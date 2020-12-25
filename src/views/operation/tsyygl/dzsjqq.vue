<template>
  <div class="dzsjqq common__content">
    <td-content-header>
      读者上架请求
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleBatchSignOut('')"
            ><icon-svg icon-class="icon-btn-ico-" /> 处理</el-button
          >
          <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">成员馆：</span>
          <el-select
            filterable
            v-model="libId"
            placeholder="请选择馆"
            size="mini"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">站点：</span>
          <el-input
            ref="focusInput"
            size="mini"
            clearable
            v-model="hidingPlace"
          ></el-input>

          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in booksOptions"
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
            class="group__filter_value"
            v-model="initSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCollectionList"
          ></el-input>
        </div>

        <div class="header__line">
          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="status"
          >
            <el-option
              v-for="item in bookStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">请求时间：</p>
          <el-date-picker
            v-model="optTimeStart"
            align="right"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="marginRight:3px"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="optTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initCollectionList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-table
          v-loading="loadingData"
          ref="table"
          @row-click="clickRow"
          border
          @selection-change="handleSelectionChange"
          :data="initFormList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label="序号" align="center" width="65">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bookName" label="正题名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookAuthor"
            label="责任者"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publisher"
            label="出版社"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="shevlesSuggest"
            label="请求上架建议"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hidingPlace"
            label="请求上架站点"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optTime"
            label="请求时间"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="status" label="状态">
            <template slot-scope="scope">
              <div>{{ scope.row.status | changeStatus }}</div>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.id"
                :data="scope.row"
                :index="scope.$index"
                :ops="['']"
                v-if="scope.row.status == '0'"
              >
                <template v-slot:menus>
                  <div
                    v-if="scope.row.status == '0'"
                    class="menu"
                    @click="handleDispose(scope.row)"
                  >
                    处理
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCollectionSizeChange"
          @current-change="handleCollectionCurrentChange"
          :total="totalCount"
          :currentPage="pageNumber"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { selectRequestShevles, shevlesManage } from "api/operation";

import { mapGetters } from "vuex";

import { downLoadExcel } from "utils/utils";
export default {
  name: "tsyygl_dzsjqq",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.booksOptions = [
      {
        value: "bookName",
        label: "正题名"
      },
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "bookAuthor",
        label: "责任者"
      },
      {
        value: "publisher",
        label: "出版社"
      },
      {
        value: "readerCode",
        label: "读者证号"
      }
    ];
    this.bookStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: 0,
        label: "未处理"
      },
      {
        value: 1,
        label: "已处理"
      }
    ];
    return {
      // 多选
      multipleLiteratureSelection: [],
      status: "",
      libId: this.$store.getters.userInfo.libId,
      //时间传参
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      hidingPlace: "",
      loadingData: false,
      initFormList: [],
      initSearchKey: "",
      currentKey: "bookName",
      pageSize: 15,
      pageNumber: 1,
      totalCount: 0
    };
  },
  filters: {
    changeStatus(val) {
      if (val == 0) {
        return "未处理";
      } else if (val == 1) {
        return "已处理";
      }
    }
  },
  methods: {
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 处理
    handleDispose(row) {
      shevlesManage({ shevlesInfoIds: row.shevlesInfoId }).then(res => {
        this.$message.success(res.message);
        this.getCollectionList();
      });
    },
    // 多选成员馆
    handleSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.shevlesInfoId);
    },
    // 馆藏列表
    initCollectionList() {
      this.pageNumber = 1;
      this.setRequestObj();
      this.getCollectionList();
    },
    setRequestObj() {
      this.requestObj = {
        status: this.status,
        hidingPlace: this.hidingPlace,
        libId: this.libId,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentKey] = this.initSearchKey;
    },
    getCollectionList() {
      this.loadingData = true;
      let requestObj = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        ...this.requestObj
      };
      selectRequestShevles(requestObj)
        .then(res => {
          this.loadingData = false;
          this.initFormList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadingData = false));
    },
    handleCollectionSizeChange(val) {
      this.pageSize = val;
      this.getCollectionList();
    },
    handleCollectionCurrentChange(val) {
      this.pageNumber = val;
      this.getCollectionList();
    },
    // 批量处理
    handleBatchSignOut(shevlesInfoId) {
      shevlesManage({
        shevlesInfoIds: shevlesInfoId
          ? shevlesInfoId
          : this.multipleLiteratureSelection.join(",")
      })
        .then(res => {
          this.$message.success(res.message);
          this.getCollectionList();
        })
        .catch(() => {});
    },
    // 导出
    handleExport() {
      downLoadExcel("/api/e/flow/bookShevles/selectRequestShelves/export", {
        libId: this.libId,
        hidingPlace: this.hidingPlace,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd,
        status: this.status
      });
    }
  },
  created() {
    this.getCollectionList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
