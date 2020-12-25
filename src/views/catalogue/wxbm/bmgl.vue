<!--
 * @Description: 编目管理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-07 09:12:06
 * @LastEditTime: 2020-03-11 13:49:56
 -->

<template>
  <div
    class="cat-bmgl common__content"
    v-loading="loadCatalogData2"
    element-loading-text="导出数据处理中"
  >
    <td-content-header>
      书目信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="createCatalog"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增书目</el-button
          >
          <el-button
            :disabled="multipleCatalogSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteCatalog('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
              v-show="multipleCatalogSelection.length"
              >({{ multipleCatalogSelection.length }})</span
            ></el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="handleRec('')"
            :disabled="multipleCatalogSelection.length === 0"
          >
            <icon-svg icon-class="icon-btn-ico-12" />推荐
          </el-button>
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectLibId"
            placeholder="请选择"
            @change="
              getThemeList();
              _getUserList();
            "
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
            v-model="currentCatalogFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in catalogFilterOptions"
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
            v-model="catalogSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (catalogSearchKey = val),
                initCatalogList
              )
            "
            @keydown.enter.native="delayFunc(initCatalogList)"
          ></el-input>
        </div>
        <div class="header__line">
          <p class="label">审校：</p>
          <el-select
            style="width: 50px;"
            filterable
            clearable
            size="mini"
            v-model="isAudit"
            placeholder="请选择"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
          <p class="label">创建人：</p>
          <el-select
            filterable
            clearable
            size="mini"
            v-model="createUserId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">创建日期：</p>
          <el-date-picker
            v-model="createStartDate"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
          >
          </el-date-picker>
          <span class="gap_r">至</span>
          <el-date-picker
            v-model="createEndDate"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initCatalogList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="catalogTable">
        <el-table
          v-loading="loadCatalogData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleCatalogSelectionChange"
          @sort-change="_changeListSort"
          border
          :data="catalogList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="30"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
            <template slot-scope="scope">
              <el-popover
                popper-class="isnb__popover"
                trigger="hover"
                placement="right-start"
              >
                <div class="triangle">
                  <table width="680px" border="0" cellspacing="0">
                    <tr
                      v-for="item in scope.row.fieldList"
                      :key="item.marctyid"
                      class="text"
                    >
                      <td width="30">
                        {{ item.field }}
                      </td>
                      <td width="25">
                        {{ item.indexOne + item.indexTwo }}
                      </td>
                      <td>
                        <input
                          v-if="myBrowser() === 'FF'"
                          class="text"
                          :value="item.content"
                          readonly
                        />
                        <span v-else class="text">
                          {{ item.content }}
                        </span>
                      </td>
                    </tr>
                  </table>
                </div>
                <div slot="reference" class="name-wrapper">
                  {{ scope.row.isbn }}
                </div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flhao"
            label="分类号"
            width="90"
            sortable="custom"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            label="正题名"
            min-width="115"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ftming"
            label="副题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            sortable="custom"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjming"
            label="分辑名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjhao"
            label="分辑号"
            sortable="custom"
            width="55"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yma"
            label="页数"
            width="60"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ccun"
            label="尺寸"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            sortable="custom"
            width="87"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="创建人"
            width="65"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            sortable="custom"
            label="创建时间"
          >
            <template slot-scope="scope">
              {{ scope.row.optime | splitDateTime }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="审校" width="40">
            <template slot-scope="scope">
              {{ scope.row.ztai === "已审核" ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isTjian"
            label="推荐"
            width="40"
          >
            <template slot-scope="scope">
              {{ scope.row.isTjian === "已推荐" ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool :ops="[]">
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="
                      handleCataEdit(scope.row.marctyid, scope.row.marcid)
                    "
                  >
                    编目
                  </div>
                  <div class="menu" @click="handleRec(scope.row.marctyid)">
                    推荐
                  </div>
                  <div
                    class="menu"
                    @click="checkDuplicate(scope.row.marctyid, scope.row.isbn)"
                  >
                    查重合并
                  </div>
                  <div class="menu" @click="deleteCatalog(scope.row.marctyid)">
                    删除
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCatalogSizeChange"
          @current-change="handleCatalogCurrentChange"
          :total="totalCatalogCount"
          :currentPage="currentCatalogPage"
          :pageSize="catalogPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 导出格式 -->
    <el-dialog
      title="导出格式选择"
      :visible.sync="exportDialogVisible"
      width="690px"
    >
      <p style="margin-bottom: 10px;">请选择需要导出的MARC格式：</p>
      <div>
        <el-radio v-model="marcType" label="CNMARC">CNMARC</el-radio>
        <el-radio v-model="marcType" label="MARC21">MARC21</el-radio>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="fetchingData" @click="downLoadData"
          >确 定</el-button
        >
        <el-button @click="exportDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 书目推荐 -->
    <el-dialog title="图书推荐" :visible.sync="showRecommendDialog">
      <p>关联主题：</p>
      <el-select filterable size="mini" v-model="themeId" placeholder="请选择">
        <el-option
          v-for="item in themeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br />
      <br />
      <p>备注：</p>
      <el-input clearable size="mini" v-model="recommendReason"></el-input>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button type="primary" size="mini" @click="handleRecSubmit"
            >推 荐</el-button
          >
          <el-button size="mini" @click="showRecommendDialog = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  catalogueList,
  catalogueDelete,
  exportMarcCatalog,
  catalogueRecommend
} from "api/catalogue";

import { userList } from "api/public";

import { myBrowser } from "utils/utils";

const fileDownload = require("js-file-download");

import { mapGetters } from "vuex";

import { themeList } from "api/acquisition";

import { BMGL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cat_bmgl",
  data() {
    this.myBrowser = myBrowser;
    this.catalogFilterOptions = BMGL_OPTIONS;
    return {
      exportDialogVisible: false,
      marcType: "CNMARC",
      fetchingData: false,
      // 列表相关
      userList: [],
      createUserId: "",
      isAudit: "",
      createStartDate: "",
      createEndDate: "",
      sortField: "",
      sortValue: "",
      multipleCatalogSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadCatalogData: false,
      loadCatalogData2: false,
      catalogList: [],
      catalogSearchKey: "",
      currentCatalogFilterKey: "isbn",
      catalogPageSize: 15,
      currentCatalogPage: 1,
      totalCatalogCount: 0,
      // 推荐
      showRecommendDialog: false,
      themeId: "",
      themeList: [], // 推荐列表
      recommendReason: ""
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  created() {
    this.getThemeList();
    this._getUserList();
  },
  methods: {
    _changeListSort({ prop, order }) {
      console.log(prop, order);

      this.sortField = prop;
      this.sortValue = order;
      // this.initCatalogList()
    },
    _getUserList() {
      userList({
        libId: this.selectLibId
      }).then(res => {
        this.userList = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
      });
    },
    getThemeList() {
      themeList({
        libId: this.selectLibId
      }).then(res => {
        this.themeList = res.data
          .filter(item => item.themeZtai == 0)
          .map(item => {
            return {
              label: item.themeTitle,
              value: item.themeId
            };
          });
      });
    },
    // 书目列表
    initCatalogList() {
      this.currentCatalogPage = 1;
      this.setRequestObj();
      this.getCatalogList();
    },
    rowDblclick(row) {
      this.handleCataEdit(row.marctyid, row.marcid);
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleCatalogSelectionChange(val) {
      this.multipleCatalogSelection = val.map(item => item.marctyid);
    },
    deleteCatalog(ids) {
      this.$confirm(
        `确定删除 ${
          ids ? 1 : this.multipleCatalogSelection.length
        } 条书目数据么?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadCatalogData = true;
          catalogueDelete({
            marctyIds: ids ? ids : this.multipleCatalogSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initCatalogList();
            })
            .finally(() => {
              this.loadCatalogData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId,
        isAudit: this.isAudit,
        createUserId: this.createUserId,
        createStartDate: this.createStartDate,
        createEndDate: this.createEndDate
      };
      this.requestObj[this.currentCatalogFilterKey] = this.catalogSearchKey;
    },
    getCatalogList() {
      this.loadCatalogData = true;

      let requestObj = {
        pageNumber: this.currentCatalogPage,
        pageSize: this.catalogPageSize,
        ...this.requestObj
      };

      catalogueList(requestObj)
        .then(res => {
          this.loadCatalogData = false;
          this.catalogList = res.data.dataList;
          this.totalCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCatalogData = false));
    },
    handleCatalogSizeChange(val) {
      this.catalogPageSize = val;
      this.getCatalogList();
    },
    handleCatalogCurrentChange(val) {
      this.currentCatalogPage = val;
      this.getCatalogList();
    },
    // 查重
    checkDuplicate(marctyid, isbn) {
      this.$router.push({
        name: "cat_cc",
        query: {
          marctyid,
          isbn,
          from: "cat_bmgl"
        }
      });
    },
    // 推荐
    handleRec(ids) {
      this.recommendsArr = ids ? ids : this.multipleCatalogSelection.join(",");
      this.showRecommendDialog = true;
    },
    handleRecSubmit() {
      if (!this.themeId) {
        this.$message.warning("请选择关联主题");
        return;
      }

      catalogueRecommend({
        marctyIds: this.recommendsArr,
        remark: this.recommendReason,
        themeId: this.themeId
      }).then(res => {
        this.recommendReason = "";
        this.themeId = "";
        this.showRecommendDialog = false;
        this.$message.success(res.message);
        this.getCatalogList();
      });
    },
    // 前往编目
    handleCataEdit(marctyid, marcid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marctyid,
          marcid,
          from: "cat_bmgl"
        }
      });
    },
    downLoadData() {
      this.loadCatalogData2 = true;
      exportMarcCatalog({
        pageNumber: this.currentCatalogPage,
        pageSize: this.catalogPageSize,
        ...this.requestObj
      }).then(res => {
        this.loadCatalogData2 = false;

        let fileName = res.headers["content-disposition"].split("=")[1];
        fileDownload(res.data, fileName);
      });
    },
    createCatalog() {
      let paramsObj = {};
      if (this.catalogList.length === 0) {
        if (this.currentCatalogFilterKey === "isbn" && this.catalogSearchKey) {
          paramsObj = {
            key: "isbn",
            value: this.catalogSearchKey
          };
        }
        if (
          this.currentCatalogFilterKey === "ztming" &&
          this.catalogSearchKey
        ) {
          paramsObj = {
            key: "ztming",
            value: this.catalogSearchKey
          };
        }
      }
      // 新增书目
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "cat_bmgl"
        },
        params: {
          reset: true,
          ...paramsObj
        }
      });
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.$eventBus.$on("jdbm-initupdate", () => {
      this.initCatalogList();
    });
    this.$eventBus.$on("jdbm-update", () => {
      this.getCatalogList();
    });
  },
  activated() {
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-initupdate");
    this.$eventBus.$off("jdbm-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>

<style lang="less">
.isnb__popover {
  box-sizing: border-box;
  max-height: 600px;
  overflow: auto;
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid #c8d3df;
  }
  tr {
    line-height: 23px;
    color: #333;
    font-size: 14px;
  }
}
</style>
