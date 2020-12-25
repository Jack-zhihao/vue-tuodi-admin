<!--
 * @Description: 文献类型
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-05 18:45:17
 -->

<template>
  <div class="jjlb common__content">
    <td-content-header>
      捐赠列表
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-button type="primary" size="mini" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <p class="desc">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            class="header__filters_type group__filters_type"
            size="mini"
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            ref="focusInput"
            size="mini"
            clearable
            class="group__filters_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (literatureSearchKey = val),
                initDonateList
              )
            "
            @keydown.enter.native="delayFunc(initDonateList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initDonateList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          @row-dblclick="rowDblclick"
          @row-click="clickRow"
          v-loading="loadLiteratureData"
          border
          @selection-change="handleLiteratureSelectionChange"
          :data="literatureList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="bookName" label="正题名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookSecName"
            label="分辑名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="author" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="press" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="price" label="册价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="barCode" label="条形码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['catague', 'del']"
                @handleCatague="goCatague(scope.row.isbn)"
                @handleDel="singleDeleteGzsm(scope.row.donateId)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { donateList, donateListDel, donateListExp } from "api/catalogue";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cat_jzlb",
  data() {
    this.literatureFilterOptions = [
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "fjming",
        label: "分辑名"
      },
      {
        value: "author",
        label: "责任者"
      },
      {
        value: "press",
        label: "出版社"
      },
      {
        value: "barcode",
        label: "条形码"
      },
      {
        value: "dzzhao",
        label: "读者证号"
      }
    ];

    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "isbn",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 捐赠列表
    initDonateList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.donateList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.goCatague(row.isbn);
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    donateList() {
      this.loadLiteratureData = true;
      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj
      };
      donateList(requestObj).then(res => {
        this.loadLiteratureData = false;
        this.literatureList = res.data.dataList;
        this.totalLiteratureCount = Number(res.data.totalElements);
      });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.donateList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.donateList();
    },
    // 导出
    handleExport() {
      this.setRequestObj();
      let requestObj = {
        ...this.requestObj
      };
      downLoadExcel(donateListExp(), requestObj);
    },
    goCatague(isbn) {
      this.$router.push({
        name: "cat_xzbm",
        query: { isbn }
      });
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          donateListDel({ donateIds: row }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initDonateList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          donateListDel({
            donateIds: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initDonateList();
            }
          });
        })
        .catch(() => {});
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.donateId);
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.initDonateList();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>
