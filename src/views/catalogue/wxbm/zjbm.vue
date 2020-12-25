<!--
 * @Description: 直接编目
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-07 09:12:06
 * @LastEditTime: 2020-02-24 10:46:04
 -->

<template>
  <div class="cat-zjbm common__content" ref="contentWrapper">
    <el-scrollbar>
      <td-content-header>
        验收书目信息
        <template v-slot:btns>
          <div class="header__ops">
            <el-button
              :disabled="multipleYSCatalogSelection.length === 0"
              size="mini"
              type="primary"
              @click="deleteCatalog('')"
              ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
            >
          </div>
        </template>
      </td-content-header>
      <!-- 顶部列表内容 -->
      <div class="content">
        <div class="content__header">
          <div class="header__filters">
            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="currentFilterKey"
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
              ref="focusInput"
              size="mini"
              clearable
              class="group__filters_value"
              v-model="currentFilterVal"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="initYSCatalogList"
            ></el-input>
            <el-button type="primary" size="mini" @click="initYSCatalogList">
              <icon-svg icon-class="icon-btn-ico-2" />
              查询</el-button
            >
          </div>
        </div>
        <div
          ref="topTable"
          class="top__table_wrapper"
          v-if="showTopTable"
          :style="{ height: topTableH }"
        >
          <el-table
            v-loading="loadYSCatalogData"
            border
            :data="ysCatalogList"
            stripe
            style="width: 100%"
            class="top__table"
            highlight-current-row
            ref="table"
            @row-click="clickRow"
            @row-dblclick="rowDblclick"
            @current-change="handleCatalogRowChange"
            @selection-change="handleCatalogSelectionChange"
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
              prop="isbn"
              label="ISBN"
              width="145"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="flhao"
              label="分类号"
              width="90"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztming"
              label="正题名"
              min-width="115"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zrsming"
              label="责任者"
              width="70"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="cbdi" label="出版地">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="cbrqi"
              label="出版日期"
              width="70"
            >
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
              prop="yma"
              label="页数"
              width="60"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jzlx"
              label="介质类型"
              width="70"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zdfs"
              label="装订方式"
              width="70"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip label="审校" width="40">
              <template slot-scope="scope">
                {{ scope.row.ztai === "已审核" ? "是" : "否" }}
              </template>
            </el-table-column>
            <el-table-column label="操作" width="45" fixed="right">
              <template slot-scope="scope">
                <td-action-tool
                  :id="scope.row.marctyid"
                  :index="scope.$index"
                  :ops="['']"
                >
                  <template v-slot:menus>
                    <div
                      class="menu"
                      @click="
                        handleDirectBMPage(scope.row.marcid, scope.row.marctyid)
                      "
                    >
                      编目
                    </div>
                    <div
                      class="menu"
                      @click="
                        checkDuplicate(scope.row.marctyid, scope.row.isbn)
                      "
                    >
                      查重
                    </div>
                    <div
                      class="menu"
                      @click="deleteCatalog(scope.row.marctyid)"
                    >
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
            @size-change="handleYSCatalogSizeChange"
            @current-change="handleYSCatalogCurrentChange"
            :total="totalYSCatalogCount"
            :currentPage="currentYSCatalogPage"
            :pageSize="ysCatalogPageSize"
          ></td-pagination>
        </div>
      </div>
      <!-- 底部表格内容 -->
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
          <div class="content__ys" v-if="currentBottomMode === 'ys'">
            <el-table
              v-loading="loadYssmList"
              :data="ysList"
              stripe
              key="ysTable"
              style="width: 100%"
              class="top__table"
              @row-dblclick="ysrowDblclick"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="libName"
                label="分馆简称"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yspcCode"
                label="验收批号"
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
                prop="fuben"
                label="验收册数"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="cejia" label="册价">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydlaiyuan"
                label="预订来源"
              >
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
              <el-table-column label="操作" width="45" fixed="right">
                <template slot-scope="scope">
                  <td-action-tool
                    :data="scope.row"
                    :index="scope.$index"
                    :ops="['gcfp']"
                    @handleGCFP="handleShowGCAllot"
                  >
                  </td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="content__gc" v-if="currentBottomMode === 'gc'">
            <el-table
              v-loading="loadGcsmList"
              :data="gcList"
              stripe
              key="gcTable"
              style="width: 100%"
              class="top__table"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="tiaoma"
                label="条形码"
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
    <!-- 馆藏 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showGCAllot"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tit">馆藏分配</div>
          <i class="el-icon-close" @click="showGCAllot = false"></i>
        </div>
      </template>
      <div class="edit__content" style="padding: 20px 10px;">
        <p style="margin-bottom: 10px;">索书号：{{ currentSshao }}</p>
        <el-table :data="gcAllotList" border style="width: 100%">
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column label="条形码">
            <template slot-scope="scope">
              <el-input
                clearable
                size="small"
                v-model="scope.row.barcode"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="分馆">
            <template slot-scope="scope">
              <el-select
                filterable
                size="small"
                v-model="scope.row.libId"
                @change="changeCygOption($event, scope.$index)"
              >
                <el-option
                  v-for="item in cygList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="馆藏地点">
            <template slot-scope="scope">
              <el-select filterable size="small" v-model="scope.row.czId">
                <el-option
                  v-for="item in gcListMap[scope.row.libId] || []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="流通类型">
            <template slot-scope="scope">
              <el-select filterable size="small" v-model="scope.row.ltlxId">
                <el-option
                  v-for="item in ltListMap[scope.row.libId] || []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column width="40" align="center">
            <template slot-scope="scope">
              <div @click="deleteAllotItem(scope.$index)">
                <icon-svg class="danger" icon-class="icon-btn-ico-21" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="small"
              type="primary"
              :loading="savingYs"
              @click="handleSaveAllotItems"
              >确 认</el-button
            >
            <el-button size="small" @click="showGCAllot = false"
              >取 消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { getDirectCatalogList, catalogueDelete } from "api/catalogue";

import {
  getYssmListInLib,
  getYdsmCollection,
  saveYssm,
  getYscurSshao
} from "api/acquisition";

import { getCygList, userCzList, flowType } from "api/public";

import { mapGetters } from "vuex";

import { ZJBM_OPTIONS } from "utils/selectOptions";

export default {
  name: "cat_zjbm",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.filterOptions = ZJBM_OPTIONS;
    return {
      topTableH: "",
      showTopTable: false,
      // 列表相关
      multipleYSCatalogSelection: [],
      currentFilterKey: "isbn",
      loadYSCatalogData: false,
      ysCatalogList: [],
      currentFilterVal: "",
      ysCatalogPageSize: 15,
      currentYSCatalogPage: 1,
      totalYSCatalogCount: 0,
      // 底部tab
      currentBottomMode: "ys",
      bottomTabs: [
        {
          value: "ys",
          label: "成员馆验收信息"
        },
        {
          value: "gc",
          label: "成员馆馆藏信息"
        }
      ],
      loadYssmList: false,
      ysList: [],
      loadGcsmList: false,
      gcList: [],
      // 馆藏分配
      savingYs: false,
      showGCAllot: false,
      currentSshao: "-",
      gcAllotList: [],
      cygList: [],
      gcListMap: {},
      ltListMap: {}
    };
  },
  methods: {
    checkDuplicate(marctyid, isbn) {
      this.$router.push({
        name: "cat_cc",
        query: {
          marctyid,
          isbn,
          from: "cat_zjbm"
        }
      });
    },
    // 验收书目列表
    initYSCatalogList() {
      this.currentYSCatalogPage = 1;
      this.setRequestObj();
      this.getYSCatalogList();
      this.gcList = [];
      this.ysList = [];
      this.bottomTabs[0].label = "成员馆验收信息";
      this.bottomTabs[1].label = "成员馆馆藏信息";
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleDirectBMPage(row.marcid, row.marctyid);
    },
    handleCatalogSelectionChange(val) {
      this.multipleYSCatalogSelection = val.map(item => item.marctyid);
    },
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[this.currentFilterKey] = this.currentFilterVal;
    },
    getYSCatalogList() {
      this.loadYSCatalogData = true;

      let requestObj = {
        pageNumber: this.currentYSCatalogPage,
        pageSize: this.ysCatalogPageSize,
        ...this.requestObj
      };

      getDirectCatalogList(requestObj)
        .then(res => {
          this.loadYSCatalogData = false;
          this.ysCatalogList = res.data.dataList;
          this.totalYSCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadYSCatalogData = false));
    },
    handleYSCatalogSizeChange(val) {
      this.ysCatalogPageSize = val;
      this.getYSCatalogList();
    },
    handleYSCatalogCurrentChange(val) {
      this.currentYSCatalogPage = val;
      this.getYSCatalogList();
    },
    deleteCatalog(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadYSCatalogData = true;
          catalogueDelete({
            marctyIds: ids ? ids : this.multipleYSCatalogSelection.join(",")
          })
            .then(res => {
              this.loadYSCatalogData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initYSCatalogList();
            })
            .catch(() => {
              this.loadYSCatalogData = false;
            });
        })
        .catch(() => {});
    },
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    handleCatalogRowChange(row) {
      if (row) {
        this.marcid = row.marcid;
        this.getDetailTableData();
      } else {
        this.marcid = "";
      }
    },
    getDetailTableData() {
      this.getYssmListInLib();
      this.getYdsmCollection();
    },
    getYssmListInLib() {
      this.loadYssmList = true;
      getYssmListInLib({
        marcid: this.marcid,
        flag: 1
      })
        .then(res => {
          this.ysList = res.data;
          this.bottomTabs[0].label = `成员馆验收信息（${res.data.length}）`;
        })
        .finally(() => {
          this.loadYssmList = false;
        });
    },
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
          this.bottomTabs[1].label = `成员馆馆藏信息（${inLib}/${
            res.data.length
          }）`;
        })
        .finally(() => {
          this.loadGcsmList = false;
        });
    },
    // 前往编目
    handleDirectBMPage(marcid, marctyid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marcid,
          marctyid,
          from: "cat_zjbm"
        }
      });
    },
    // 馆藏
    addAllotItem() {
      let currentLib = this.$store.getters.userInfo.libId;
      let gcData = this.gcListMap[currentLib];
      let ltlxData = this.ltListMap[currentLib];
      this.gcAllotList.push({
        barcode: "",
        libId: currentLib,
        czId: gcData[0] ? gcData[0].value : "",
        ltlxId: ltlxData[0] ? ltlxData[0].value : "",
        shuceid: ""
      });
    },
    handleSaveAllotItems() {
      this.savingYs = true;
      let requestObj = {
        yslxing: "直接编目",
        collectionDtos: JSON.stringify(this.gcAllotList),
        ...this.currentYSData,
        sshao: this.currentSshao,
        shuceid: this.gcAllotList[0].shuceid
      };
      saveYssm(requestObj)
        .then(res => {
          this.showGCAllot = false;
          this.gcAllotList = [];
          this.$message.success(res.message);
          this.initYSCatalogList();
        })
        .finally(() => {
          this.savingYs = false;
        });
    },
    deleteAllotItem(index) {
      this.gcAllotList.splice(index, 1);
    },
    ysrowDblclick(row) {
      this.handleShowGCAllot(row.marcid, row.$index, row);
    },
    handleShowGCAllot(id, index, data) {
      this.currentYSData = data;
      getYscurSshao({
        marcid: data.marcid
      }).then(res => {
        // 有索书号根据返回的记录显示，否则根据复本数加载对应条数
        this.gcAllotList = [];
        this.showGCAllot = true;
        this.currentSshao = res.data.sshao;
        // 获取馆藏分配数据
        getYdsmCollection({
          marcid: data.marcid,
          yssmid: data.yssmid
        }).then(res => {
          if (res.data.length > 0) {
            res.data.forEach(item => {
              if (!this.gcListMap[item.cygid1]) {
                this.changeCygOption(item.cygid1);
              }
              this.gcAllotList.push({
                barcode: item.tiaoma,
                libId: item.cygid1,
                czId: item.czid1,
                ltlxId: item.ltlxid,
                shuceid: item.shuceid
              });
            });
          } else {
            let i = 0;
            while (i < data.fuben) {
              this.addAllotItem();
              i++;
            }
          }
        });
      });
    },
    getCygList() {
      getCygList().then(res => {
        this.cygList = res.data
          ? res.data.map(item => {
              return {
                label: item.libJiancheng,
                value: item.libId
              };
            })
          : [];
        this.changeCygOption(this.$store.getters.userInfo.libId);
      });
    },
    changeCygOption(cygId, index) {
      this.getGcList(cygId, index);
      this.getLtList(cygId, index);
    },
    getGcList(cygId, index) {
      if (this.gcListMap[cygId]) {
        if (index >= 0) {
          this.gcAllotList[index].czId = this.gcListMap[cygId][0]
            ? this.gcListMap[cygId][0].value
            : "";
        }
        return;
      }
      userCzList({
        libId: cygId
      }).then(res => {
        let filterData = res.data
          ? res.data.map(item => {
              return {
                label: item.mingcheng,
                value: item.czid
              };
            })
          : [];
        this.$set(this.gcListMap, cygId, filterData);
        if (index >= 0) {
          this.gcAllotList[index].czId = filterData[0]
            ? filterData[0].value
            : "";
        }
      });
    },
    getLtList(cygId, index) {
      if (this.ltListMap[cygId]) {
        if (index >= 0) {
          this.gcAllotList[index].ltlxId = this.ltListMap[cygId][0]
            ? this.ltListMap[cygId][0].value
            : "";
        }
        return;
      }
      flowType({
        libId: cygId
      }).then(res => {
        let filterData = res.data
          ? res.data.map(item => {
              return {
                label: item.mingcheng,
                value: item.ltlxid
              };
            })
          : [];
        this.$set(this.ltListMap, cygId, filterData);
        if (index >= 0) {
          this.gcAllotList[index].ltlxId = filterData[0]
            ? filterData[0].value
            : "";
        }
      });
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.getCygList();
    this.topTableH =
      (this.$refs.contentWrapper.clientHeight - 40 - 42 - 52) / 2 + "px";
    this.showTopTable = true;
    this.$eventBus.$on("jdbm-update", () => {
      this.initYSCatalogList();
    });
  },
  activated() {
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 5px;
  background: #919faf;
  &.active {
    background: #1dc147;
  }
}
.bottom {
  border-top: 1px solid @borderColor;
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
  /deep/ tr th {
    background: @contentHdColor;
  }
}

.dialog__gc {
  /deep/ .el-table {
    th,
    td {
      padding: 3px 0;
    }
  }
}
</style>
