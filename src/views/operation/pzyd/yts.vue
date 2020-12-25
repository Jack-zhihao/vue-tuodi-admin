<!--
 * @Description: 批次清单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 18:46:51
 -->
<template>
  <div class="yts common__content">
    <td-content-header>
      图书列表
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">书库名称：</p>
          <el-select
            filterable
            size="mini"
            v-model="tableName"
            placeholder="请选择"
            clearable
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
            class="group__filter_type"
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
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (literatureSearchKey = val),
                initLiteratureList
              )
            "
            @keydown.enter.native="delayFunc(initLiteratureList)"
            style="flex:auto;max-width:200px"
          ></el-input>
          <p class="label">排序方式：</p>
          <el-select
            filterable
            size="mini"
            v-model="sortId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sortSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          @row-dblclick="rowDblclick"
          @selection-change="handleLiteratureSelectionChange"
          v-loading="loadLiteratureData"
          border
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
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="tableDescribe"
            label="书库名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="145"
            prop="isbn"
            label="ISBN"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="title"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publisher"
            label="出版社"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="author" label="责任者">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="pubdate"
            label="出版日期"
            width="70"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="price"
            label="价格"
            width="87"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="categoryNo"
            label="分类号"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="language" label="语种">
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
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
import { searchBookItem, getTableList, yunbookItemdel } from "api/other";

import { YTS_OPTIONS } from "utils/selectOptions";

export default {
  name: "opera_yts",
  data() {
    this.literatureFilterOptions = YTS_OPTIONS;
    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      sortSelect: [
        { label: "ISBN", value: "0" },
        { label: "正题名", value: "1" },
        { label: "出版日期", value: "2" },
        { label: "出版社", value: "3" },
        { label: "分类号", value: "4" },
        { label: "责任者", value: "5" },
        { label: "语种", value: "6" }
      ],
      sortId: "0",
      tableName: "",
      libListSelect: [],
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "isbn",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0
    };
  },
  computed: {},
  methods: {
    // 书库列表
    getAllLib() {
      getTableList().then(res => {
        this.libListSelect = res.data.map(item => {
          if (item.tableDescribe === this.$route.params.name) {
            this.tableName = item.tableName;
            this.initLiteratureList();
          }
          return {
            value: item.tableName,
            label: item.tableDescribe
          };
        });
        this.libListSelect.unshift({
          value: "",
          label: "全部"
        });
      });
    },
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.getLiteratureList();
    },
    rowDblclick(row) {
      //  跳转到编辑页面
      this.editGzsm(row);
    },
    setRequestObj() {
      this.requestObj = {
        tableName: this.tableName
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },

    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj,

        orderby: this.sortId
      };

      searchBookItem(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data.dataList;
          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    // 新增
    handleAdd() {
      // 跳去新增页面
      this.$router.push({ name: "opera_smxx" });
    },

    // 编辑
    editGzsm(row) {
      // 跳到编辑页面

      this.$router.push({ name: "opera_addtao-edit", query: row });
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 删除
          yunbookItemdel({ ids: row.tableName + "~" + row.id }).then(res => {
            if (res.code == 0) {
              this.$message.success(res.message);
              this.initLiteratureList();
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
          yunbookItemdel({
            ids: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => {
        return item.tableName + "~" + item.id;
      });
    }
  },
  activated() {
    this.getAllLib();
    if (!this.$route.params.name) {
      // 判断是否查看详情
      this.initLiteratureList();
    }
  },
  mounted() {
    this.getAllLib();
    if (!this.$route.params.name) {
      // 判断是否查看详情
      this.initLiteratureList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
</style>
