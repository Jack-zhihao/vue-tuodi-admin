<!--
 * @Description: 预订验收
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-19 09:07:05
 * @LastEditTime: 2020-03-06 16:34:52
 -->

<template>
  <div class="acq-ydys common__content" ref="contentWrapper">
    <el-scrollbar>
      <td-content-header>
        书目信息
        <span v-show="quickInfo.yspcCode"
          >【验收单：{{ quickInfo.yspcCode }}】</span
        >
      </td-content-header>
      <!-- 顶部列表内容 -->
      <div class="content">
        <div class="content__header">
          <div class="header__filters">
            <p class="desc">预订单：</p>
            <el-select
              filterable
              size="mini"
              v-model="selectedYdd"
              placeholder="请选择"
            >
              <el-option
                v-for="item in yddOptions"
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
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (currentFilterVal = val),
                  initYDCatalogList
                )
              "
              @keydown.enter.native="delayFunc(initYDCatalogList)"
            ></el-input>
            <el-button type="primary" size="mini" @click="initYDCatalogList"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
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
            v-loading="loadYDCatalogData"
            border
            highlight-current-row
            @row-dblclick="rowDblclick"
            @current-change="handleCurrentChange"
            :data="ydCatalogList"
            stripe
            style="width: 100%"
            class="top__table"
            height="100%"
          >
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
              prop="ztming"
              min-width="115"
              label="正题名"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
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
              prop="yma"
              label="页数"
              width="60"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zdfangshi"
              label="装订方式"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jzleixing"
              label="介质类型"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="ydCode" label="预订单">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydTime"
              label="预订时间"
            >
            </el-table-column>
            <el-table-column label="操作" width="45" fixed="right">
              <template slot-scope="scope">
                <td-action-tool
                  :id="scope.row.ydCatalogid"
                  :index="scope.$index"
                  :ops="[]"
                >
                  <template v-slot:menus>
                    <div
                      class="menu"
                      @click="
                        handleYSPage(
                          scope.row.marcid,
                          scope.row.marctyid,
                          scope.row.ydsmid
                        )
                      "
                    >
                      验收
                    </div>
                    <div
                      class="menu"
                      @click="
                        handleDirectBMPage(scope.row.marcid, scope.row.marctyid)
                      "
                    >
                      编目
                    </div>
                  </template>
                </td-action-tool>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content__page">
          <td-pagination
            @size-change="handleYDCatalogSizeChange"
            @current-change="handleYDCatalogCurrentChange"
            :total="totalYDCatalogCount"
            :currentPage="currentYDCatalogPage"
            :pageSize="ydCatalogPageSize"
          ></td-pagination>
        </div>
      </div>
      <!-- 分隔区域 -->
      <td-content-header>
        <span>快捷验收</span>
        <template v-slot:btns>
          <div class="header__ops">
            <el-button
              size="mini"
              type="primary"
              :loading="savingYs"
              :disabled="!currentMarcid || currentMarcid === '-' || !canEdit"
              @click="submitForm('ysForm')"
              >保存验收</el-button
            >
          </div>
        </template>
      </td-content-header>
      <!-- 底部表格内容 -->
      <div class="bottom">
        <div class="content">
          <div class="content__ys" v-loading="getSshao">
            <div class="header">
              <div class="item__info">
                <span class="label">成员馆：</span>
                <span class="value">{{ quickInfo.libName }}</span>
              </div>
              <div class="item__info">
                <span class="label">验收单：</span>
                <span class="value">{{ quickInfo.yspcCode }}</span>
              </div>
              <div class="item__info">
                <span class="label">书目控制号：</span>
                <span class="value">{{ currentMarcid }}</span>
              </div>
              <div class="item__info">
                <span class="label">预订编号：</span>
                <span class="value">{{ ydbhCode }}</span>
              </div>
            </div>
            <el-form
              class="custom__form"
              ref="ysForm"
              label-width="65px"
              :rules="formRules"
              :model="ysForm"
              :disabled="!currentMarcid || currentMarcid === '-' || !canEdit"
            >
              <el-form-item
                label-width="92px"
                class="item"
                prop="yjhbid"
                label="原价货币类型"
              >
                <el-select
                  filterable
                  @change="handleConvertHlv"
                  size="small"
                  v-model="ysForm.yjhbid"
                  placeholder="请选择货币类型"
                >
                  <el-option
                    v-for="item in moneyTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="yuanjia" label="原价">
                <el-input
                  @blur="handleConvertHlv"
                  clearable
                  v-only-num.float="ysForm.yuanjia"
                  size="small"
                  v-model="ysForm.yuanjia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="cejia" label="册价">
                <el-input
                  @blur="calculateTaojia"
                  clearable
                  v-only-num.float="ysForm.cejia"
                  size="small"
                  v-model="ysForm.cejia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="ydlaiyuan" label="文献来源">
                <el-select
                  filterable
                  size="small"
                  v-model="ysForm.ydlaiyuan"
                  placeholder="请选择文献来源"
                >
                  <el-option
                    v-for="item in dglyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="92px"
                class="item"
                prop="ydhbid"
                label="预订货币类型"
              >
                <el-select
                  filterable
                  @change="handleConvertHlv"
                  size="small"
                  v-model="ysForm.ydhbid"
                  placeholder="请选择货币类型"
                >
                  <el-option
                    v-for="item in moneyTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="jiage" label="预订价">
                <el-input
                  clearable
                  size="small"
                  v-only-num.float="ysForm.jiage"
                  v-model="ysForm.jiage"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="taojia" label="套价">
                <el-input
                  clearable
                  v-only-num.float="ysForm.taojia"
                  size="small"
                  v-model="ysForm.taojia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="jzleixing" label="介质类型">
                <el-select
                  filterable
                  size="small"
                  v-model="ysForm.jzleixing"
                  placeholder="请选择介质类型"
                >
                  <el-option
                    v-for="item in jzlxOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                label-width="92px"
                class="item"
                prop="zdfangshi"
                label="装订方式"
              >
                <el-select
                  filterable
                  size="small"
                  v-model="ysForm.zdfangshi"
                  placeholder="请选择装订方式"
                >
                  <el-option
                    v-for="item in zzfsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="juance" label="分册数量">
                <el-input
                  clearable
                  size="small"
                  @blur="calculateTaojia"
                  v-only-num="ysForm.juance"
                  v-model="ysForm.juance"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="fuben" label="复本数">
                <el-input
                  clearable
                  size="small"
                  v-only-num="ysForm.fuben"
                  v-model="ysForm.fuben"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="sshao" label="索书号">
                <el-input
                  clearable
                  size="small"
                  v-model="ysForm.sshao"
                ></el-input>
              </el-form-item>
              <el-form-item
                label-width="92px"
                class="item"
                prop="ydRecord"
                label="预订记录"
                style="flex-basis: 45%;"
              >
                <el-input
                  readonly
                  clearable
                  size="small"
                  v-model="ysForm.ydRecord"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" label="">
                <el-button
                  size="small"
                  type="primary"
                  @click="handleShowGCAllot"
                  >馆藏分配</el-button
                >
              </el-form-item>
              <el-form-item class="item" label=""> </el-form-item>
              <el-form-item
                label-width="92px"
                class="item"
                prop="beizhu"
                label="备注"
                style="flex-basis: 45%;"
              >
                <el-input
                  clearable
                  style="width: 100%;"
                  type="textarea"
                  size="small"
                  v-model="ysForm.beizhu"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <!-- 馆藏分配 -->
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
        <el-table :data="gcAllotList" border style="width: 100%">
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column label="条形码">
            <template slot-scope="scope">
              <el-input
                @keydown.enter.native="nextGcInput($event, scope.$index)"
                :ref="'gcTmInput' + scope.$index"
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
            <el-button size="small" type="primary" @click="addOneAllotItem"
              >新 增</el-button
            >
            <el-button size="small" @click="showGCAllot = false"
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
  WXLYUAN_OPTIONS,
  JZLEIXING_OPTIONS,
  ZDFANGSHI_OPTIONS
} from "utils/variables";

import { hbList } from "api/public";

import {
  quickAcceptance,
  ydPcList,
  searchYdsm,
  saveYssm,
  getYscurSshao,
  convertHlv
} from "api/acquisition";

import { getCygList, userCzList, flowType } from "api/public";

import { YDYS_OPTIONS } from "utils/selectOptions";

export default {
  name: "acq_ydys",
  data() {
    this.filterOptions = YDYS_OPTIONS;
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    this.ysFormTemp = {
      yjhbid: "",
      yuanjia: "",
      cejia: "",
      ydlaiyuan: "订购",
      ydhbid: "",
      jiage: "",
      taojia: "",
      jzleixing: "纸张",
      zdfangshi: "平装",
      juance: "",
      fuben: "",
      sshao: "",
      ydRecord: "",
      beizhu: "",
      ydsmid: ""
    };
    this.formRules = {
      yuanjia: [{ required: true, message: "原价不能为空", trigger: "blur" }],
      fuben: [{ required: true, message: "复本数不能为空", trigger: "blur" }],
      taojia: [{ required: true, message: "套价不能为空", trigger: "blur" }],
      cejia: [{ required: true, message: "册价不能为空", trigger: "blur" }]
    };
    return {
      topTableH: "",
      showTopTable: false,
      // 列表相关
      selectedYdd: "",
      yddOptions: [],
      currentFilterKey: "1",
      loadYDCatalogData: false,
      ydCatalogList: [],
      currentFilterVal: "",
      ydCatalogPageSize: 15,
      currentYDCatalogPage: 1,
      totalYDCatalogCount: 0,
      // 快捷验收
      canEdit: false,
      currentMarcid: "-",
      ydbhCode: "-",
      moneyTypeOptions: [],
      ysForm: {
        yjhbid: "",
        yuanjia: "",
        cejia: "",
        ydlaiyuan: "订购",
        ydhbid: "",
        jiage: "",
        taojia: "",
        jzleixing: "纸张",
        zdfangshi: "平装",
        juance: "",
        fuben: "",
        sshao: "",
        ydRecord: "",
        beizhu: "",
        ydsmid: ""
      },
      quickInfo: {},
      savingYs: false,
      getSshao: false,
      // 馆藏
      showGCAllot: false,
      gcAllotList: [],
      cygList: [],
      gcListMap: {},
      ltListMap: {}
    };
  },
  methods: {
    // 征订目录列表
    initYDCatalogList() {
      this.currentYDCatalogPage = 1;
      this.setRequestObj();
      this.getYDCatalogList();
    },
    setRequestObj() {
      this.requestObj = {
        ydpcid: this.selectedYdd,
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      };
    },
    getYDCatalogList() {
      this.loadYDCatalogData = true;

      let requestObj = {
        pageNumber: this.currentYDCatalogPage,
        pageSize: this.ydCatalogPageSize,
        ...this.requestObj
      };

      searchYdsm(requestObj)
        .then(res => {
          this.ydCatalogList = res.data.dataList;
          this.totalYDCatalogCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadYDCatalogData = false;
        });
    },
    handleYDCatalogSizeChange(val) {
      this.ydCatalogPageSize = val;
      this.getYDCatalogList();
    },
    handleYDCatalogCurrentChange(val) {
      this.currentYDCatalogPage = val;
      this.getYDCatalogList();
    },
    getYdPcList() {
      ydPcList().then(res => {
        this.yddOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ydpcid
          };
        });
        this.yddOptions.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    rowDblclick(row) {
      this.handleDirectBMPage(row.marcid, row.marctyid);
    },
    handleCurrentChange(val) {
      this.gcAllotList = [];
      this.$refs["ysForm"].clearValidate();

      if (!val) {
        this.ysForm = Object.assign({}, this.ysFormTemp);
        this.ysForm.yuanjia = this.ysForm.yuanjia.toFixed(2);
        this.ysForm.jiage = this.ysForm.jiage.toFixed(2);
        this.currentMarcid = "-";
        this.ydbhCode = "-";
        return;
      }

      this.ydbhCode = val.ydbhao ? val.ydbhao : "-";
      Object.keys(this.ysFormTemp).forEach(item => {
        if (val[item] && val !== 0) {
          this.ysForm[item] = val[item];
        } else {
          this.ysForm[item] = this.ysFormTemp[item];
        }
      });
      this.ysForm.yuanjia = this.ysForm.yuanjia.toFixed(2);
      // 设置复本数
      this.ysForm["fuben"] = val["ceshu"];
      // 册价默认取原价的值
      if (!this.ysForm["cejia"]) {
        this.ysForm["cejia"] = this.ysForm["jiage"].toFixed(2);
      }
      // 没有分册数量默认1
      if (!this.ysForm["juance"]) {
        this.ysForm["juance"] = 1;
      }
      // 获取索书号
      this.getSshao = true;
      getYscurSshao({
        marcid: val.marcid
      })
        .then(res => {
          this.ysForm["sshao"] = res.data.sshao;
        })
        .finally(() => {
          this.getSshao = false;
        });
      // 如果没有预订价要计算一次
      this.ysForm.jiage = this.ysForm.jiage && this.ysForm.jiage.toFixed(2);
      if (!this.ysForm.jiage) {
        this.handleConvertHlv();
      }
      // 如果没有套价要计算一次
      if (!this.ysForm.taojia) {
        this.calculateTaojia();
      }
      this.currentMarcid = val.marcid;
    },
    // 底部快捷验收
    handleConvertHlv() {
      convertHlv({
        fromHbId: this.ysForm.yjhbid,
        toHbId: this.ysForm.ydhbid,
        fromMoney: this.ysForm.yuanjia
      }).then(res => {
        this.ysForm.jiage = +res.data.toMoney.toFixed(2);
      });
    },
    calculateTaojia() {
      let count = Number(this.ysForm.juance) || 0;
      let cejia = Number(this.ysForm.cejia) || 0;
      this.ysForm.taojia = (count * cejia).toFixed(2);
    },
    getQuickAcceptance() {
      this.isGetQuickAcceptance = true;
      quickAcceptance()
        .then(res => {
          this.quickInfo = res.data;
          this.canEdit = true;
        })
        .catch(() => {
          this.canEdit = false;
        })
        .finally(() => {
          this.isGetQuickAcceptance = false;
        });
    },
    getMoneyTypeOptions() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.moneyTypeOptions = res.data.map(item => {
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
        this.ysFormTemp.yjhbid = this.ysFormTemp.ydhbid = this.moneyTypeOptions[0].value;
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveYssm();
        } else {
          return false;
        }
      });
    },
    saveYssm() {
      this.savingYs = true;
      let requestObj = {
        marcid: this.currentMarcid,
        yslxing: "预订验收",
        yspcid: this.quickInfo.yspcid,
        collectionDtos: JSON.stringify(this.gcAllotList),
        ...this.ysForm,
        ydjge: this.ysForm.jiage
      };
      saveYssm(requestObj)
        .then(res => {
          this.gcAllotList = [];
          this.$refs["ysForm"].resetFields();
          this.$message.success(res.message);
          this.initYDCatalogList();
        })
        .finally(() => {
          this.savingYs = false;
        });
    },
    // 前往书目验收
    handleYSPage(marcid, marctyid, ydsmid) {
      this.$router.push({
        name: "acq_smys",
        query: {
          marcid,
          marctyid,
          ydsmid,
          from: "acq_ydys"
        }
      });
    },
    handleDirectBMPage(marcid, marctyid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marcid,
          marctyid,
          from: "acq_ydys"
        }
      });
    },
    // 馆藏
    nextGcInput(event, index) {
      let nextInput = this.$refs["gcTmInput" + (index + 1)];
      if (nextInput) {
        nextInput.focus();
      }
    },
    addOneAllotItem() {
      let currentLib = this.$store.getters.userInfo.libId;
      this.gcAllotList.push({
        barcode: "",
        libId: currentLib,
        czId: this.gcListMap[currentLib][0].value || "",
        ltlxId: this.ltListMap[currentLib][0].value || ""
      });
    },
    addAllotItems() {
      let gap = (this.ysForm.fuben || 1) - this.gcAllotList.length;
      let currentLib = this.$store.getters.userInfo.libId;
      let gcData = this.gcListMap[currentLib];
      let ltlxData = this.ltListMap[currentLib];
      for (let index = 0; index < gap; index++) {
        this.gcAllotList.push({
          barcode: "",
          libId: currentLib,
          czId: gcData[0] ? gcData[0].value : "",
          ltlxId: ltlxData[0] ? ltlxData[0].value : ""
        });
      }
      this.$nextTick(() => {
        this.$refs["gcTmInput0"].focus();
      });
    },
    deleteAllotItem(index) {
      this.gcAllotList.splice(index, 1);
      this.ysForm.fuben = this.gcAllotList.length;
    },
    handleShowGCAllot() {
      this.showGCAllot = true;
      if (this.cygList.length === 0) {
        this.getCygList();
      } else if (this.cygList.length > 0) {
        this.addAllotItems();
      }
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
        this.getgcAllotListFinish = true;
        if (this.gcAllotList.length === 0 && this.getLtListFinish) {
          this.addAllotItems();
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
        this.getLtListFinish = true;
        if (this.gcAllotList.length === 0 && this.getgcAllotListFinish) {
          this.addAllotItems();
        }
      });
    }
  },
  mounted() {
    this.topTableH =
      (this.$refs.contentWrapper.clientHeight - 56 - 55 - 52) / 2 + "px";
    this.showTopTable = true;
    this.getMoneyTypeOptions();
    this.getYdPcList();
    this.$eventBus.$on("jdbm-update", () => {
      this.initYDCatalogList();
    });
    this.getQuickAcceptance();
    this.$refs["focusInput"].focus();
  },
  activated() {
    if (this.isGetQuickAcceptance) {
      return;
    }
    this.getQuickAcceptance();
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
@import "../styles/check.less";
.dialog__add {
  /deep/ .el-table th,
  /deep/ .el-table td {
    padding: 3px 0;
  }
}
.acq-ydys {
  position: relative;
}
.bottom {
  margin-top: 0;
}
</style>
