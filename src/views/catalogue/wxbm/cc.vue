<!--
 * @Description: 查重
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-27 10:24:11
 * @LastEditTime: 2020-03-10 18:01:26
 -->

<template>
  <div class="cat-cc common__content">
    <el-scrollbar>
      <div class="content" style="height: 100%;ib">
        <div class="content__header" style="marginTop: 3px;">
          <div class="header__line">
            <span class="label">查重字段：</span>
            <el-select
              filterable
              class="group__filter_type"
              size="mini"
              v-model="currentFilterKey1"
              placeholder="请选择"
            >
              <el-option
                v-for="item in filterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              size="mini"
              clearable
              class="group__filter_value"
              v-model="currentFilterVal1"
              placeholder="请输入搜索关键词"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (currentFilterVal1 = val),
                  getDuplicateList
                )
              "
              @keydown.enter.native="delayFunc(getDuplicateList)"
            ></el-input>
            <div class="label" style="marginRight: 13px;">and</div>
            <el-select
              filterable
              class="group__filter_type"
              size="mini"
              v-model="currentFilterKey2"
              placeholder="请选择"
            >
              <el-option
                v-for="item in filterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              size="mini"
              clearable
              class="group__filter_value"
              v-model="currentFilterVal2"
              placeholder="请输入搜索关键词"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (currentFilterVal2 = val),
                  getDuplicateList
                )
              "
              @keydown.enter.native="delayFunc(getDuplicateList)"
            ></el-input>
            <el-button type="primary" size="mini" @click="getDuplicateList"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
            >
          </div>
          <div class="header__line">
            <p class="count">查重结果共{{ duplicateData.length }}条</p>
            <el-button
              :loading="isMerging"
              @click="handleMergeCatalogue"
              size="mini"
              type="primary"
              style="marginLeft: 13px;"
              :disabled="multipleSelection.length < 1"
              ><icon-svg icon-class="icon-btn-ico-8" /> 合并记录</el-button
            >
          </div>
        </div>
        <div class="content__table">
          <el-table
            v-loading="loadDuplicateData"
            ref="duplicateTable"
            @row-click="duplicateClickRow"
            @selection-change="handleSelectionChange"
            stripe
            border
            style="width: 100%"
            height="413"
            highlight-current-row
            @current-change="handleRowChange"
            :data="duplicateData"
          >
            <el-table-column
              type="selection"
              width="35"
              :selectable="handleSelectable"
              align="center"
            ></el-table-column>
            <el-table-column
              prop="target"
              label="目标书目"
              align="center"
              width="70"
            >
              <template slot-scope="scope">
                <span @click="setMergeTarget(scope.row)">
                  <i
                    :class="
                      scope.row.marctyid === currentyMarcid
                        ? 'el-icon-star-on workStyle'
                        : 'el-icon-star-off workNoStyle'
                    "
                  ></i>
                </span>
              </template>
            </el-table-column>
            <el-table-column width="145" label="ISBN" show-overflow-tooltip>
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
            <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztming"
              min-width="115"
              label="正题名"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zrsming"
              label="责任者"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jge"
              label="价格"
              width="87"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="updateUserName"
              label="最近编目人"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="updateTime"
              label="最近编目时间"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <div class="bottom">
        <div class="c-tab__header">
          <span
            class="header__item"
            v-for="(item, index) in bottomTabs"
            @click="changeBottomMode(item.value)"
            :key="index"
            :class="{ active: currentBottomMode === item.value }"
            >{{ item.label }}</span
          >
        </div>
        <div class="content">
          <div class="content__yd" v-if="currentBottomMode === 'yd'">
            <el-table
              key="ydTable"
              v-loading="loadYdsmList"
              :header-cell-style="{ background: '#fff' }"
              :data="ydList"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="libCode"
                label="成员馆代码"
              >
                <template slot-scope="scope">
                  <span @click="showYdDetail(scope.row)" class="g-row__check">{{
                    scope.row.libCode
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydpcCode"
                label="订购单"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydbhao"
                label="预订批号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="gysName"
                label="供应商"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ysCode"
                label="预算代码"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="ceshu" label="册数">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jge"
                label="价格"
                width="87"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydlaiyuan"
                label="来源"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydTime"
                label="预订日期"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="userName"
                label="预订者"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="content__ys" v-if="currentBottomMode === 'ys'">
            <el-table
              key="ysTable"
              v-loading="loadYssmList"
              :header-cell-style="{ background: '#fff' }"
              :data="ysList"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yslxing"
                label="验收类别"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="libCode"
                label="成员馆代码"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yspcCode"
                label="验收单"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="gysName"
                label="供应商"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="fuben" label="册数">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="cejia" label="册价">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="userName"
                label="验收人"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="optime"
                label="验收时间"
              >
              </el-table-column>
            </el-table>
          </div>
          <div class="content__gc" v-if="currentBottomMode === 'gc'">
            <el-table
              key="gcTable"
              v-loading="loadGcsmList"
              :header-cell-style="{ background: '#fff' }"
              :data="gcList"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="tiaoma"
                label="条码号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="sshao"
                label="索书号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="libName0"
                label="财产馆"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="czName0"
                label="财产馆藏址"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="libName1"
                label="现在馆"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="czName1"
                label="现在馆藏址"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztai"
                label="状态"
                width="45"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="cejia" label="册价">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="taojia" label="套价">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jzleixing"
                label="介质类型"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zdfangshi"
                label="装订方式"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="optime"
                label="入库时间"
              >
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  getYdsmCollection,
  getYssmListInLib,
  getYdsmListInLib
} from "api/acquisition";

import { myBrowser } from "utils/utils";

import { checkRepetitionList, mergeCatalogue } from "api/catalogue";

export default {
  name: "cat_cc",
  data() {
    this.myBrowser = myBrowser;
    this.filterOptions = [
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "isrc",
        label: "ISRC"
      },
      {
        value: "flhao",
        label: "分类号"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "zrsming",
        label: "责任者"
      },
      {
        value: "cbdi",
        label: "出版地"
      },
      {
        value: "cbzhe",
        label: "出版社"
      },
      {
        value: "cbrqi",
        label: "出版日期"
      },
      {
        value: "zti",
        label: "主题"
      },
      {
        value: "yzhong",
        label: "语种"
      },
      {
        value: "issn",
        label: "ISSN"
      }
    ];
    return {
      isMerging: false,
      loadDuplicateData: false,
      currentFilterKey1: "isbn",
      currentFilterKey2: "isbn",
      currentFilterVal1: "",
      currentFilterVal2: "",
      duplicateData: [],
      multipleSelection: [],
      loadMarcText: false,
      marcText: [],
      currentyMarcid: "",
      // 下方表格
      bottomTabs: [
        {
          label: "成员馆预订信息",
          value: "yd"
        },
        {
          label: "成员馆验收信息",
          value: "ys"
        },
        {
          label: "成员馆馆藏信息",
          value: "gc"
        }
      ],
      currentBottomMode: "yd",
      loadYdsmList: false,
      ydList: [],
      loadYssmList: false,
      ysList: [],
      loadGcsmList: false,
      gcList: []
    };
  },
  mounted() {
    this.marctyid = this.$route.query.marctyid;
    this.isbn = this.$route.query.isbn;
    this.currentFilterVal1 = this.isbn || "";
    this.getDuplicateList();
  },
  watch: {
    $route(to) {
      if (to.name !== "cat_cc") {
        return;
      }
      if (this.marctyid !== to.query.marctyid) {
        this.marctyid = to.query.marctyid;
        this.isbn = this.$route.query.isbn;
        this.currentFilterKey1 = this.currentFilterKey2 = "isbn";
        this.currentFilterVal2 = "";
        this.currentFilterVal1 = this.isbn || "";
        this.resetBottomTabs();
        this.marcText = [];
        this.currentyMarcid = "";
        this.duplicateData = [];
        this.getDuplicateList();
      }
    }
  },
  methods: {
    handleSelectable(row) {
      return row.marctyid !== this.currentyMarcid;
    },
    setMergeTarget(row) {
      this.$refs.duplicateTable.toggleRowSelection(row, false);
      this.currentyMarcid = row.marctyid;
    },
    handleRowChange(row) {
      if (row) {
        this.marcid = row.marcid;
        this.getDetailTableData();
      } else {
        this.marcid = "";
      }
    },
    duplicateClickRow(row, column) {
      if (
        column.property === "target" ||
        row.marctyid === this.currentyMarcid
      ) {
        return;
      }
      this.$refs.duplicateTable.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.marctyid);
    },
    resetBottomTabs() {
      this.ydList = [];
      this.gcList = [];
      this.ysList = [];
      this.bottomTabs[0].label = "成员馆预订信息";
      this.bottomTabs[1].label = "成员馆验收信息";
      this.bottomTabs[2].label = "成员馆馆藏信息";
    },
    getDuplicateList() {
      let requestObj = {
        marctyid: this.$route.query.marctyid
      };
      if (this.currentFilterVal1) {
        requestObj[this.currentFilterKey1] = this.currentFilterVal1;
      }
      if (this.currentFilterVal2) {
        requestObj[this.currentFilterKey2] = this.currentFilterVal2;
      }
      this.resetBottomTabs();
      this.marcText = [];
      this.currentyMarcid = "";
      this.loadDuplicateData = true;
      checkRepetitionList(requestObj)
        .then(res => {
          this.duplicateData = res.data;
        })
        .finally(() => {
          this.loadDuplicateData = false;
        });
    },
    handleMergeCatalogue() {
      if (!this.currentyMarcid) {
        this.$message("请选择目标书目");
        return;
      }
      let requestObj = {
        marctyid: this.currentyMarcid,
        mergeIds: this.multipleSelection.join(",")
      };
      this.isMerging = true;
      mergeCatalogue(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.getDuplicateList();
        })
        .finally(() => {
          this.isMerging = false;
        });
    },
    // 下方表格
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 初始化
    getDetailTableData() {
      this.getYdsmListInLib();
      this.getYssmListInLib();
      this.getYdsmCollection();
    },
    // 下方表格 - 馆藏
    getYdsmCollection() {
      this.loadGcsmList = true;
      getYdsmCollection({
        marcid: this.marcid
      })
        .then(res => {
          this.gcList = res.data;
          let inLib = 0;
          res.data.forEach(item => {
            if (item.ztai === "在馆") {
              inLib++;
            }
          });
          this.bottomTabs[2].label = `成员馆馆藏信息（${inLib}/${
            res.data.length
          }）`;
        })
        .finally(() => {
          this.loadGcsmList = false;
        });
    },
    // 下方表格 - 验收
    getYssmListInLib() {
      this.loadYssmList = true;
      getYssmListInLib({
        marcid: this.marcid,
        flag: 1
      })
        .then(res => {
          this.ysList = res.data;
          this.bottomTabs[1].label = `成员馆验收信息（${res.data.length}）`;
        })
        .finally(() => {
          this.loadYssmList = false;
        });
    },
    // 下方表格 - 预订
    getYdsmListInLib() {
      this.loadYdsmList = true;
      getYdsmListInLib({
        marcid: this.marcid,
        flag: 1
      })
        .then(res => {
          this.ydList = res.data;
          this.bottomTabs[0].label = `成员馆预订信息（${res.data.length}）`;
        })
        .finally(() => {
          this.loadYdsmList = false;
        });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.cat-cc {
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .c-tab__header {
    display: flex;
    height: 36px;
    align-items: center;
    background: @topBgColor;
    .header__item {
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding: 0 17px;
      font-size: @FSize_15;
      &.active {
        font-weight: bold;
        color: @primaryColor;
        background: @contentHdColor;
      }
    }
  }
  .content {
    .count {
      color: @fontTintColor;
      font-size: @FSize_14;
    }
    .workStyle {
      font-size: @FSize_20;
      color: #de5151;
    }
    .workNoStyle {
      font-size: @FSize_18;
      color: #c8d3df;
    }
  }
}
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
