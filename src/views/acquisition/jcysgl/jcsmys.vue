<!--
 * @Description: 教材书目验收
 * @Autor: chenming.feng
 * @Date: 2019-11-05 14:11:10
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 15:09:25
 -->
<template>
  <div class="acq-smys three-distribution">
    <div class="wrapper">
      <el-scrollbar>
        <div class="top">
          <div class="top-left">
            <div class="c-tab__header">
              <span
                class="header__item"
                v-for="(item, index) in topTabs"
                @click="changeMode(item.value)"
                :key="index"
                :class="{ active: currentMode === item.value }"
                >{{ item.label }}</span
              >
            </div>

            <div
              v-if="currentMode === 'marc'"
              class="content"
              ref="biaoshiMarcContent"
            >
              <el-table
                class="cus__table"
                v-loading="loadBiaoshiData"
                border
                key="marcForm"
                :data="marcFormList"
                stripe
                style="width: 100%"
                height="525"
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
                  prop="field"
                  width="80"
                  align="center"
                  label="字段标识"
                >
                </el-table-column>
                <el-table-column
                  width="80"
                  show-overflow-tooltip
                  prop="bs"
                  align="center"
                  label="指示符"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="字段内容">
                  <template slot-scope="scope">
                    <input
                      :title="scope.row.content"
                      class="input__text"
                      readonly
                      :value="scope.row.content"
                    />
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div
              v-if="currentMode === 'catalog'"
              class="content"
              ref="biaoshiCatalogContent"
            >
              <el-table
                v-loading="loadBiaoshiData"
                class="cus__table"
                border
                key="tmForm"
                :data="tmFormList"
                stripe
                style="width: 100%"
                height="525"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  width="120"
                  label="字段名称"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="item"
                  width="80"
                  label="字段标识"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="content"
                  label="字段内容"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="top-right">
            <div class="header">
              <div class="item">
                <span class="label">成员馆：</span>
                <span class="value">{{ quickInfo.libName }}</span>
              </div>
              <div class="item">
                <span class="label">验收单：</span>
                <span class="value">{{ quickInfo.yspcCode }}</span>
              </div>
              <div class="item">
                <span class="label">书目控制号：</span>
                <span class="value">{{ currentMarcid }}</span>
              </div>
              <div class="item">
                <span class="label">预订编号：</span>
                <span class="value">{{ ydbhCode }}</span>
              </div>
            </div>
            <div class="content">
              <el-form
                ref="infoForm"
                class="info__form custom__form"
                label-width="100px"
                :rules="formRules"
                :model="infoForm"
              >
                <span></span>
                <el-form-item class="item" label="原价货币类型" prop="yjhbid">
                  <el-select
                    filterable
                    @change="handleConvertHlv"
                    size="small"
                    v-model="infoForm.yjhbid"
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
                <el-form-item class="item" prop="ydlaiyuan" label="文献来源">
                  <el-select
                    filterable
                    size="small"
                    v-model="infoForm.ydlaiyuan"
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
                <el-form-item class="item" prop="yuanjia" label="原价">
                  <el-input
                    @blur="handleConvertHlv"
                    size="small"
                    v-model="infoForm.yuanjia"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="jzleixing" label="介质类型">
                  <el-select
                    filterable
                    size="small"
                    v-model="infoForm.jzleixing"
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
                <el-form-item class="item" prop="ydhbid" label="预订货币类型">
                  <el-select
                    filterable
                    @change="handleConvertHlv"
                    size="small"
                    v-model="infoForm.ydhbid"
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
                <el-form-item class="item" prop="zdfangshi" label="装订方式">
                  <el-select
                    filterable
                    size="small"
                    v-model="infoForm.zdfangshi"
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
                <el-form-item class="item" prop="ydjge" label="预订价">
                  <el-input
                    size="small"
                    v-only-num.float="infoForm.ydjge"
                    v-model="infoForm.ydjge"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="juance" label="分册数量">
                  <el-input
                    @blur="calculateTaojia"
                    size="small"
                    v-only-num="infoForm.juance"
                    v-model="infoForm.juance"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="cejia" label="册价">
                  <el-input
                    @blur="calculateTaojia"
                    size="small"
                    v-only-num.float="infoForm.cejia"
                    v-model="infoForm.cejia"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="fuben" label="复本数">
                  <el-input
                    ref="focusInput"
                    size="small"
                    v-only-num="infoForm.fuben"
                    v-model="infoForm.fuben"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="taojia" label="套价">
                  <el-input
                    size="small"
                    v-only-num.float="infoForm.taojia"
                    v-model="infoForm.taojia"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="sshao" label="索书号">
                  <el-input size="small" v-model="infoForm.sshao"></el-input>
                </el-form-item>
                <el-form-item class="item" prop="ydRecord" label="预订记录">
                  <el-input
                    style="width: 485px;"
                    size="small"
                    readonly
                    v-model="infoForm.ydRecord"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  label="备注"
                  class="item item__textarea"
                  prop="beizhu"
                >
                  <el-input
                    style="width: 180px;"
                    size="small"
                    v-model="infoForm.beizhu"
                    type="textarea"
                  ></el-input>
                </el-form-item>
                <el-form-item
                  class="item"
                  label=""
                  style="justify-content: flex-start;"
                >
                  <span style="width:112px;display: inline-block;"></span>
                  <el-button
                    type="primary"
                    size="small"
                    @click="handleShowGCAllot"
                    >馆藏分配</el-button
                  >
                </el-form-item>
              </el-form>
            </div>
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
                :header-cell-style="{ background: '#fff' }"
                :data="ydList"
                stripe
                key="ydTable"
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
                  prop="libCode"
                  label="成员馆代码"
                >
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
                  label="预订编号"
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
                <el-table-column
                  show-overflow-tooltip
                  prop="ceshu"
                  label="册数"
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
                  prop="ydlaiyuan"
                  label="文献来源"
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
                :header-cell-style="{ background: '#fff' }"
                :data="ysList"
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
            <div class="content__gc" v-if="currentBottomMode === 'czId'">
              <el-table
                key="gcTable"
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
      </el-scrollbar>
    </div>
    <div class="footer">
      <div></div>
      <div>
        <el-button size="small" type="primary" @click="submitForm('infoForm')"
          >保存</el-button
        >
        <el-button size="small" @click="closeCurrentTag">取消</el-button>
      </div>
    </div>
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
              <icon-svg
                @click.native="deleteAllotItem(scope.$index)"
                class="danger"
                icon-class="icon-btn-ico-21"
              />
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
  ZDFANGSHI_OPTIONS,
  MARC_CN
} from "utils/variables";

import { hbList, getCygList, userCzList, flowType } from "api/public";

import { marcGetMarcTyinfo, itemsGetMarcTyinfo } from "api/catalogue";

import {
  getYdsmListInLib,
  getYssmListInLib,
  getYdsmCollection,
  quickAcceptance,
  saveYssm,
  searchBookBySmid,
  searchBookByMarcid,
  getYscurSshao,
  convertHlv
} from "api/acquisition";

export default {
  name: "acq_smys",
  data() {
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    this.formRules = {
      yuanjia: [{ required: true, message: "原价不能为空", trigger: "blur" }],
      fuben: [{ required: true, message: "复本数不能为空", trigger: "blur" }],
      taojia: [{ required: true, message: "套价不能为空", trigger: "blur" }],
      cejia: [{ required: true, message: "册价不能为空", trigger: "blur" }]
    };
    this.topTabs = [
      {
        label: "MARC模式",
        value: "marc"
      },
      {
        label: "条目式模式",
        value: "catalog"
      }
    ];
    this.bottomTabs = [
      {
        label: "预订记录",
        value: "yd"
      },
      {
        label: "验收记录",
        value: "ys"
      },
      {
        label: "馆藏记录",
        value: "czId"
      }
    ];
    this.infoFormTemp = {
      yjhbid: "",
      ydhbid: "",
      ydlaiyuan: "订购",
      jzleixing: "纸张",
      zdfangshi: "平装"
    };
    return {
      // 右侧表单
      canEdit: false,
      quickInfo: {},
      ydbhCode: "",
      currentMarcid: "",
      infoForm: {
        yjhbid: "",
        yuanjia: "",
        cejia: "",
        ydlaiyuan: "订购",
        ydhbid: "",
        ydjge: "",
        taojia: "",
        jzleixing: "纸张",
        zdfangshi: "平装",
        juance: 1,
        fuben: "",
        sshao: "",
        beizhu: "",
        ydsmid: ""
      },
      moneyTypeOptions: [],
      // 字段标识表单
      currentMode: "marc",
      loadBiaoshiData: false,
      marcFormList: [],
      tmFormList: [],
      // 下方表格
      currentBottomMode: "yd",
      ydList: [],
      ysList: [],
      gcList: [],
      // 馆藏
      showGCAllot: false,
      gcAllotList: [],
      cygList: [],
      gcListMap: {},
      ltListMap: {}
    };
  },
  watch: {
    $route(to) {
      if (to.name !== "acq_smys") {
        return;
      }
      if (this.currentMarcid !== to.query.marcid) {
        this.currentMarcid = to.query.marcid;
        this.initData();
      }
    }
  },
  methods: {
    // 字段标识
    changeMode(mode) {
      this.currentMode = mode;
    },
    marcGetMarcTyinfo() {
      marcGetMarcTyinfo({
        marctyid: this.$route.query.marctyid
      }).then(res => {
        this.marcFormList = res.data.fieldList.map(item => {
          item.indexOne = item.indexOne === null ? "" : item.indexOne;
          item.indexTwo = item.indexTwo === null ? "" : item.indexTwo;
          return {
            field: item.field,
            content: item.content,
            bs: item.indexOne + item.indexTwo
          };
        });
      });
    },
    itemsGetMarcTyinfo() {
      itemsGetMarcTyinfo({
        marctyid: this.$route.query.marctyid
      }).then(res => {
        this.tmFormList = res.data.fieldList.map(item => {
          return {
            content: item.content,
            item: item.item,
            name: MARC_CN[item.field] || item.field
          };
        });
      });
    },
    // 下方表格
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 下方表格 - 馆藏
    getYdsmCollection() {
      getYdsmCollection({
        marcid: this.$route.query.marcid
      }).then(res => {
        this.gcList = res.data;
        let inLib = 0;
        res.data.forEach(item => {
          if (item.ztai === "在馆") {
            inLib++;
          }
        });
        this.bottomTabs[2].label = `馆藏记录（${inLib}/${res.data.length}）`;
      });
    },
    // 下方表格 - 验收
    getYssmListInLiB() {
      getYssmListInLib({
        zdpcid: this.$route.query.zdpcid,
        marcid: this.$route.query.marcid
      }).then(res => {
        this.ysList = res.data;
        this.bottomTabs[1].label = `验收记录（${res.data.length}）`;
      });
    },
    // 下方表格 - 预订
    getYdsmListInLib() {
      getYdsmListInLib({
        zdpcid: this.$route.query.zdpcid,
        marcid: this.$route.query.marcid
      }).then(res => {
        this.ydList = res.data;
        this.bottomTabs[0].label = `预订记录（${res.data.length}）`;
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
      this.infoForm.fuben = this.gcAllotList.length;
    },
    addAllotItems() {
      let gap = (this.infoForm.fuben || 1) - this.gcAllotList.length;
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
      this.infoForm.fuben = this.gcAllotList.length;
    },
    handleShowGCAllot() {
      this.showGCAllot = true;
      if (this.cygList.length === 0) {
        this.getCygList();
      } else if (this.cygList.length) {
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
    },
    // 快捷表单
    handleConvertHlv() {
      convertHlv({
        fromHbId: this.infoForm.yjhbid,
        toHbId: this.infoForm.ydhbid,
        fromMoney: this.infoForm.yuanjia
      }).then(res => {
        this.infoForm.ydjge = Number(res.data.toMoney).toFixed(2);
      });
    },
    calculateTaojia() {
      let count = Number(this.infoForm.juance) || 0;
      let cejia = Number(this.infoForm.cejia) || 0;
      this.infoForm.taojia = count * cejia;
    },
    searchBookBySmid() {
      searchBookBySmid({
        ydsmid: this.$route.query.ydsmid
      }).then(res => {
        this.ydbhCode = res.data.ydbhao; // 预订验收才有预订编号
        for (const key in this.infoForm) {
          const element = res.data[key];
          if (key === "ydjge") {
            this.infoForm["ydjge"] = res.data["jiage"];
          } else {
            this.infoForm[key] = element ? element : "";
          }
        }
        // 设置复本数
        this.infoForm["fuben"] = res.data["ceshu"];

        getYscurSshao({
          marcid: res.data.marcid
        }).then(res => {
          this.infoForm["sshao"] = res.data.sshao;
        });
        // 册价默认取原价的值
        if (!this.infoForm["cejia"]) {
          this.infoForm["cejia"] = this.infoForm["yuanjia"];
        }
        // 没有分册数量默认1
        if (!this.infoForm["juance"]) {
          this.infoForm["juance"] = 1;
        }
        // 如果没有预订价要计算一次
        if (!this.infoForm.ydjge) {
          this.handleConvertHlv();
        }
        // 如果没有套价要计算一次
        if (!this.infoForm.taojia) {
          this.calculateTaojia();
        }
      });
    },
    searchBookByMarcid() {
      searchBookByMarcid({
        marcid: this.currentMarcid
      }).then(res => {
        for (const key in this.infoForm) {
          this.infoForm[key] = "";
        }
        // 初始值
        this.infoForm.yjhbid = this.infoFormTemp.yjhbid;
        this.infoForm.ydhbid = this.infoFormTemp.ydhbid;
        this.infoForm.ydlaiyuan = this.infoFormTemp.ydlaiyuan;
        this.infoForm.jzleixing = this.infoFormTemp.jzleixing;
        this.infoForm.zdfangshi = this.infoFormTemp.zdfangshi;

        // 设置值
        this.infoForm["sshao"] = res.data.sshao;
        this.infoForm["yuanjia"] = res.data.jge;
        this.infoForm["fuben"] = localStorage.getItem("td-zjysfuben") || "";
        // 册价默认取原价的值
        if (!this.infoForm["cejia"]) {
          this.infoForm["cejia"] = res.data.jge;
        }
        // 没有分册数量默认1
        if (!this.infoForm["juance"]) {
          this.infoForm["juance"] = 1;
        }
        this.handleConvertHlv();
        this.calculateTaojia();
      });
    },
    getQuickAcceptance() {
      quickAcceptance()
        .then(res => {
          this.quickInfo = res.data;
          this.canEdit = true;
        })
        .catch(() => {
          this.canEdit = false;
        });
    },
    getMoneyTypeOptions() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.moneyTypeOptions = res.data.map(item => {
          // 默认人民币
          if (item.hbcode.toUpperCase() === "CNY") {
            this.infoFormTemp.yjhbid = this.infoFormTemp.ydhbid = item.hbid;
          }
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
        // 强制默认人民币
        if (!this.infoFormTemp.yjhbid) {
          this.infoFormTemp.yjhbid = this.infoFormTemp.ydhbid = this.getArrFirstValue(
            this.moneyTypeOptions
          );
        }
        if (this.infoForm.yjhbid === "") {
          this.infoForm.yjhbid = this.infoFormTemp.yjhbid;
          this.infoForm.ydhbid = this.infoFormTemp.ydhbid;
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleSaveys();
        } else {
          return false;
        }
      });
    },
    handleSaveys() {
      let yslxing = "";
      switch (this.$route.query.from) {
        case "acq_jcydys":
          yslxing = "预订验收";
          break;
        default:
          break;
      }

      let requestObj = {
        marcid: this.currentMarcid,
        yslxing: yslxing,
        yspcid: this.quickInfo.yspcid,
        collectionDtos: JSON.stringify(this.gcAllotList),
        ...this.infoForm
      };
      saveYssm(requestObj).then(res => {
        if (yslxing === "直接验收") {
          localStorage.setItem("td-zjysfuben", this.infoForm.fuben);
        }
        this.$message.success(res.message);
        this.closeCurrentTag();
      });
    },
    closeCurrentTag() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          this.$router.push({
            name: this.$route.query.from
          });
        });
    },
    // 初始化
    initData() {
      this.gcAllotList = [];
      this.$refs["infoForm"].resetFields();
      this.getQuickAcceptance();
      this.getYssmListInLiB();
      this.getYdsmListInLib();
      this.getYdsmCollection();
      this.getMoneyTypeOptions();
      this.marcGetMarcTyinfo();
      this.itemsGetMarcTyinfo();
      if (this.$route.query.ydsmid) {
        this.searchBookBySmid(); // 预订验收
      } else {
        this.searchBookByMarcid(); // 直接验收
      }
    }
  },
  mounted() {
    this.currentMarcid = this.$route.query.marcid;
    this.initData();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "../styles/3distribution.less";
@import "~styles/commonContent.less";
/deep/ .input__text {
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}

.top-right {
  .info__form {
    display: flex;
    flex-wrap: wrap;
  }
}
.dialog__add {
  /deep/ .el-table th,
  /deep/ .el-table td {
    padding: 3px 0;
  }
}
.bottom {
  margin-top: 7px;
  border-top: 1px solid @borderColor;
}
</style>
