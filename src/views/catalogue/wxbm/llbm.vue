<!--
 * @Description: 浏览编目
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-18 09:18:29
 * @LastEditTime: 2020-03-02 19:49:34
 -->

<template>
  <div class="cat-llbm common__content">
    <el-scrollbar>
      <div class="container">
        <div class="top">
          <div class="top__pc">
            <td-content-header>
              验收单信息
            </td-content-header>
            <div class="content__header">
              <div class="header__filters">
                <el-select
                  filterable
                  class="header__filters_type group__filters_type"
                  size="mini"
                  v-model="currentPCFilterKey"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pcFilterOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-input
                  size="mini"
                  clearable
                  class="group__filters_value"
                  v-model="currentPCFilterVal"
                  placeholder="请输入搜索关键词"
                  @keydown.enter.native="initPcList"
                ></el-input>
                <el-button type="primary" size="mini" @click="initPcList"
                  ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
                >
              </div>
            </div>
            <div class="content__table">
              <el-table
                v-loading="loadPCData"
                border
                highlight-current-row
                @current-change="changePCRow"
                :data="pcList"
                stripe
                style="width: 100%"
                height="50vh - 56px - 52px"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="daima"
                  label="验收单"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="libName"
                  label="分馆简称"
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
                  prop="ztai"
                  label="状态"
                  width="45"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="userName"
                  label="操作员"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="optime"
                  label="日期"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="content__page">
              <el-scrollbar>
                <td-pagination
                  @size-change="handlePCSizeChange"
                  @current-change="handlePCCurrentChange"
                  :total="totalPCCount"
                  :currentPage="currentPCPage"
                  :pageSize="pcPageSize"
                ></td-pagination>
              </el-scrollbar>
            </div>
          </div>
          <div class="top__sm">
            <td-content-header>
              验收书目信息
              <template v-slot:btns>
                <div class="header__ops">
                  <el-button
                    :disabled="multipleSmSelection.length === 0"
                    size="mini"
                    type="primary"
                    @click="deleteSM('')"
                    ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
                  >
                </div>
              </template>
            </td-content-header>
            <div class="content__header">
              <div class="header__filters">
                <span>查找范围：</span>
                <el-select
                  filterable
                  size="mini"
                  v-model="searchScope"
                  placeholder="请选择查找范围"
                >
                  <el-option label="本批次" value="1"></el-option>
                  <el-option label="所有批次" value="2"></el-option>
                </el-select>
                <el-select
                  filterable
                  class="header__filters_type group__filters_type"
                  size="mini"
                  v-model="currentFilterKey"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in smFilterOptions"
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
                  @keyup.native="
                    handleBarCodeScanner(
                      $event,
                      val => (currentFilterVal = val),
                      initSmList
                    )
                  "
                  @keydown.enter.native="delayFunc(initSmList)"
                ></el-input>
                <el-button type="primary" size="mini" @click="initSmList"
                  ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
                >
              </div>
            </div>
            <div class="content__table">
              <el-table
                v-loading="loadSMData"
                border
                highlight-current-row
                ref="table"
                @row-click="clickRow"
                @row-dblclick="rowDblclick"
                @selection-change="handleSMSelectionChange"
                @current-change="changeSMRow"
                :data="smList"
                stripe
                style="width: 100%"
                height="50vh - 56px - 52px"
              >
                <el-table-column
                  type="selection"
                  width="35"
                  align="center"
                ></el-table-column>
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
                <el-table-column
                  show-overflow-tooltip
                  prop="cbzhe"
                  label="出版社"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cbdi"
                  label="出版地"
                >
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
                  prop="yzhong"
                  label="语种"
                  width="40"
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
                      :id="scope.row.yssmid"
                      :index="scope.$index"
                      :ops="['']"
                    >
                      <template v-slot:menus>
                        <div
                          class="menu"
                          @click="
                            handleDirectCatalog(
                              scope.row.marcid,
                              scope.row.marctyid
                            )
                          "
                        >
                          编目
                        </div>
                        <div class="menu" @click="deleteSM(scope.row.marctyid)">
                          删除
                        </div>
                      </template>
                    </td-action-tool>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="content__page">
              <el-scrollbar>
                <td-pagination
                  @size-change="handleSMSizeChange"
                  @current-change="handleSMCurrentChange"
                  :total="totalSMCount"
                  :currentPage="currentSMPage"
                  :pageSize="smPageSize"
                ></td-pagination>
              </el-scrollbar>
            </div>
          </div>
        </div>
        <div class="bottom">
          <div class="c-tab__header">
            <div class="headers">
              <span
                class="header__item"
                v-for="(item, index) in bottomTabs"
                @click="changeBottomMode(item.value)"
                :key="index"
                :class="{ active: currentBottomMode === item.value }"
                >{{ item.label }}</span
              >
            </div>
          </div>
          <div class="content">
            <div class="content__ys" v-if="currentBottomMode === 'ys'">
              <el-table
                key="ysTable"
                v-loading="loadYssmList"
                :header-cell-style="{ background: '#fff' }"
                :data="ysList"
                @row-dblclick="ysrowDblclick"
                stripe
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
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
                <el-table-column
                  show-overflow-tooltip
                  prop="fuben"
                  label="册数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cejia"
                  label="册价"
                >
                </el-table-column
                >ydlaiyuan
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
                key="gcTable"
                v-loading="loadGcsmList"
                :header-cell-style="{ background: '#fff' }"
                :data="gcList"
                stripe
                style="width: 100%"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
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
                <el-table-column
                  show-overflow-tooltip
                  prop="cejia"
                  label="册价"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="taojia"
                  label="套价"
                >
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
            <!-- <el-button size="small" type="primary" @click="addAllotItem"
              >新 增</el-button
            > -->
            <el-button
              type="primary"
              size="small"
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
import {
  getYdsmCollection,
  getYssmListInLib,
  bmsmSearch,
  pcSearch,
  saveYssm,
  getYscurSshao
} from "api/acquisition";

import { catalogueDelete } from "api/catalogue";

import { getCygList, userCzList, flowType } from "api/public";

import { LLBM_OPTIONS } from "utils/selectOptions";

export default {
  name: "cat_llbm",
  data() {
    this.pcFilterOptions = [
      {
        value: "1",
        label: "验收单"
      },
      {
        value: "2",
        label: "供应商"
      }
    ];
    this.smFilterOptions = LLBM_OPTIONS;

    return {
      // 批次列表
      currentPCFilterKey: "1",
      currentPCFilterVal: "",
      loadPCData: false,
      pcList: [],
      currentPCPage: 1,
      pcPageSize: 15,
      totalPCCount: 0,
      // 书目列表
      currentFilterKey: "1",
      loadSMData: false,
      smList: [],
      currentFilterVal: "",
      smPageSize: 15,
      currentSMPage: 1,
      totalSMCount: 0,
      searchScope: "1",
      multipleSmSelection: [],
      // 下方表格
      bottomTabs: [
        {
          label: "成员馆验收信息",
          value: "ys"
        },
        {
          label: "成员馆馆藏信息",
          value: "gc"
        }
      ],
      currentBottomMode: "ys",
      loadYssmList: false,
      ysList: [],
      loadGcsmList: false,
      gcList: [],
      // 馆藏分配
      currentSshao: "-",
      savingYs: false,
      showGCAllot: false,
      gcAllotList: [],
      cygList: [],
      gcListMap: {},
      ltListMap: {}
    };
  },
  methods: {
    // 批次列表
    initPcList() {
      this.currentSMPage = 1;
      this.setPCRequestObj();
      this.getPCList();
    },
    setPCRequestObj() {
      this.pcRequestObj = {
        flag: this.currentPCFilterKey,
        content: this.currentPCFilterVal
      };
    },
    getPCList() {
      this.loadPCData = true;

      let pcRequestObj = {
        pageNumber: this.currentPCPage,
        pageSize: this.pcPageSize,
        ztai: "编目",
        ...this.pcRequestObj
      };

      pcSearch(pcRequestObj)
        .then(res => {
          this.pcList = res.data.dataList;
          this.totalPCCount = Number(res.data.totalElements);
          this.totalSMCount = 0;
          this.currentSMPage = 1;
        })
        .finally(() => {
          this.loadPCData = false;
        });
    },
    changePCRow(row) {
      if (row) {
        this.searchScope = "1";
        this.currentYspcid = row.yspcid;
        this.initSmList();
      } else {
        this.currentYspcid = "";
        this.smList = [];
        this.gcList = [];
        this.ysList = [];
        this.bottomTabs[0].label = "成员馆验收信息";
        this.bottomTabs[1].label = "成员馆馆藏信息";
      }
      this.currentFilterKey = "1";
      this.currentFilterVal = "";
    },
    handlePCSizeChange(val) {
      this.pcPageSize = val;
      this.getPCList();
    },
    handlePCCurrentChange(val) {
      this.currentPCPage = val;
      this.getPCList();
    },
    // 书目列表
    initSmList() {
      this.currentSMPage = 1;
      this.setRequestObj();
      this.getSMList();
      this.gcList = [];
      this.ysList = [];
      this.bottomTabs[0].label = "成员馆验收信息";
      this.bottomTabs[1].label = "成员馆馆藏信息";
    },
    setRequestObj() {
      this.requestObj = {
        yspcid: this.searchScope === "1" ? this.currentYspcid : "",
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      };
    },
    getSMList() {
      if (this.searchScope === "1" && !this.currentYspcid) {
        if (this.$route.name !== "cat_llbm") {
          return;
        } else {
          this.$message("请先选择验收批次");
          return;
        }
      }
      this.loadSMData = true;

      let requestObj = {
        pageNumber: this.currentSMPage,
        pageSize: this.smPageSize,
        ...this.requestObj
      };

      bmsmSearch(requestObj)
        .then(res => {
          this.smList = res.data.dataList;
          this.totalSMCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadSMData = false;
        });
    },
    handleSMSizeChange(val) {
      this.smPageSize = val;
      this.getSMList();
    },
    handleSMCurrentChange(val) {
      this.currentSMPage = val;
      this.getSMList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleDirectCatalog(row.marcid, row.marctyid);
    },
    handleSMSelectionChange(val) {
      this.multipleSmSelection = val.map(item => item.yssmid);
      this.marctyIdsSelection = val.map(item => item.marctyid);
    },
    deleteSM(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          catalogueDelete({
            marctyIds: ids ? ids : this.marctyIdsSelection.join(",")
          }).then(res => {
            this.$message.success(res.message);
            this.initSmList();
          });
        })
        .catch(() => {});
    },
    changeSMRow(row) {
      if (row) {
        this.currentSm = row;
        this.getSMDetailTableData();
      } else {
        this.currentSm = "";
      }
    },
    // 前往编目
    handleDirectCatalog(marcid, marctyid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marcid,
          marctyid,
          from: "cat_llbm"
        }
      });
    },
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 下方表格 - 馆藏
    getYdsmCollection() {
      this.loadGcsmList = true;
      getYdsmCollection({
        marcid: this.currentSm ? this.currentSm.marcid : ""
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
    // 下方表格 - 验收
    getYssmListInLib() {
      this.loadYssmList = true;
      getYssmListInLib({
        marcid: this.currentSm ? this.currentSm.marcid : "",
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
    getSMDetailTableData() {
      this.getYssmListInLib();
      this.getYdsmCollection();
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
        yslxing: "浏览编目",
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
          this.getSMDetailTableData();
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
    this.getCygList();
    this.$eventBus.$on("jdbm-update", () => {
      this.initSmList();
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
.status {
  display: inline-block;
  margin-right: 6px;
  width: 8px;
  height: 8px;
  border-radius: 100%;
  background: @grayColor;
  &.active {
    background: @successColor;
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.container {
  .top {
    height: ~"calc(50vh + 52px)";
    border-bottom: 1px solid @borderColor;
    .content__table {
      height: calc(100% - 36px - 33px - 32px);
    }
    .top__pc {
      width: 410px;
      border-right: 1px solid @tableBorderColor;
      float: left;
      height: 100%;
    }
    .top__sm {
      width: ~"calc(100% - 415px)";
      height: 100%;
      float: right;
      border-left: 1px solid @tableBorderColor;
    }
    .header__filters_type {
      flex: 0 0 90px !important;
    }
    .group__filters_value {
      flex: 0 0 200px !important;
    }
  }
  .bottom {
    border-top: 1px solid @borderColor;
    margin-top: 4px;
  }
  .c-tab__header {
    height: 36px;
    background: @topBgColor;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    .header__item {
      display: inline-block;
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
  .cus__table {
    /deep/ th,
    /deep/ td {
      padding: 1px 0;
    }
  }
  /deep/ .el-table .el-button {
    padding: 0;
  }
}
</style>
