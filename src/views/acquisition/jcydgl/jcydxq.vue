<!--
 * @Description: 教材预定详情
 * @Autor: chenming.feng
 * @Date: 2019-11-05 11:31:15
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 15:08:54
 -->
<template>
  <div class="acq-smyd three-distribution">
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
                v-loading="loadBiaoshiData"
                border
                key="marcTable"
                class="cus__table"
                :data="marcFormList"
                stripe
                style="width: 100%"
                height="500"
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
                      class="input__text triangle"
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
                key="tmTable"
                v-loading="loadBiaoshiData"
                border
                class="cus__table"
                :data="tmFormList"
                stripe
                style="width: 100%"
                height="500"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="name"
                  label="字段名称"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="item"
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
                <span class="value">{{ infoForm.cygName }}</span>
              </div>
              <div class="item">
                <span class="label">预算代码：</span>
                <span class="value">{{ infoForm.ysCode }}</span>
              </div>
              <div class="item">
                <span class="label">书目控制号：</span>
                <span class="value">{{ infoForm.marcid }}</span>
              </div>
              <div class="item">
                <span class="label">供应商代码：</span>
                <span class="value">{{ infoForm.gysCode }}</span>
              </div>
            </div>
            <div class="content">
              <el-form
                :disabled="!canEdit"
                ref="infoForm"
                class="info__form"
                label-width="100px"
                :inline="true"
                :model="infoForm"
                :rules="infoFormRules"
              >
                <el-form-item label="预订编号">
                  <el-input
                    clearable
                    size="small"
                    v-model="infoForm.ydbhao"
                  ></el-input>
                </el-form-item>
                <el-form-item label="预订单">
                  <el-select
                    filterable
                    size="small"
                    v-model="infoForm.ydpcid"
                    @change="changeYdDetail"
                    placeholder="请选择预订单"
                  >
                    <el-option
                      v-for="item in yddOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="预订册数">
                  <el-input
                    ref="focusInput"
                    clearable
                    size="small"
                    v-model="infoForm.ceshu"
                    v-only-num="infoForm.ceshu"
                  ></el-input>
                </el-form-item>
                <el-form-item label="文献来源">
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
                <el-form-item label="原价货币类型">
                  <el-select
                    filterable
                    size="small"
                    @change="handleConvertHlv"
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
                <el-form-item label="介质类型">
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
                <el-form-item label="原价" prop="yuanjia">
                  <el-input
                    @blur="handleConvertHlv"
                    clearable
                    size="small"
                    v-only-num.float="infoForm.yuanjia"
                    v-model="infoForm.yuanjia"
                  ></el-input>
                </el-form-item>
                <el-form-item label="装订方式">
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
                <el-form-item label="预订货币类型">
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
                <el-form-item label="分册数量" prop="juance">
                  <el-input
                    clearable
                    size="small"
                    v-only-num="infoForm.juance"
                    v-model="infoForm.juance"
                  ></el-input>
                </el-form-item>
                <el-form-item label="预订价" prop="jiage">
                  <el-input
                    clearable
                    size="small"
                    v-only-num.float="infoForm.jiage"
                    v-model="infoForm.jiage"
                  ></el-input>
                </el-form-item>
                <el-form-item label="备注" class="item__textarea">
                  <el-input
                    clearable
                    size="small"
                    v-model="infoForm.fuzhu"
                    type="textarea"
                  ></el-input>
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
                key="ydTable"
                :header-cell-style="{ background: '#fff' }"
                :data="ydList"
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
                  prop="libCode"
                  label="成员馆代码"
                >
                  <template slot-scope="scope">
                    <span
                      @click="checkYdDetail(scope.row)"
                      class="g-row__check"
                      >{{ scope.row.libCode }}</span
                    >
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
                <el-table-column label="操作" width="45" fixed="right">
                  <template slot-scope="scope">
                    <td-action-tool
                      ref="actionTool"
                      v-show="canEdit"
                      :id="scope.row.ydsmid"
                      :index="scope.$index"
                      :ops="['del', 'unsubscribe']"
                      @handleUnsubscribe="unsubscribeYd"
                      @handleDel="deleteYd"
                    >
                      <template v-slot:menus>
                        <div class="menu" @click="checkYdDetail(scope.row)">
                          编辑
                        </div>
                      </template>
                    </td-action-tool>
                  </template>
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
            <div class="content__gc" v-if="currentBottomMode === 'gc'">
              <el-table
                :header-cell-style="{ background: '#fff' }"
                :data="gcList"
                stripe
                key="gcTable"
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
  </div>
</template>

<script>
import {
  WXLYUAN_OPTIONS,
  JZLEIXING_OPTIONS,
  ZDFANGSHI_OPTIONS,
  MARC_CN
} from "utils/variables";

import { marcGetMarcTyinfo, itemsGetMarcTyinfo } from "api/catalogue";

import { hbList } from "api/public";

import {
  getYdsmListInLib,
  getYssmListInLib,
  getYdsmCollection,
  ydsmDel,
  unsubscribeYdsm,
  reserveZdsm,
  ydPcList,
  ydPcFind,
  saveYdsm,
  convertHlv
} from "api/acquisition";
export default {
  name: "acq_smyd",
  watch: {
    $route(to) {
      if (to.name !== "acq_smyd") {
        return;
      }
      if (this.zdsmid !== to.query.zdsmid || this.zdpcid !== to.query.zdpcid) {
        this.zdpcid = to.query.zdpcid;
        this.zdsmid = to.query.zdsmid;
        this.initData();
      }
    }
  },
  data() {
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
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    this.infoFormRules = {
      yuanjia: [{ required: true, message: "原价不能为空", trigger: "blur" }],
      jiage: [{ required: true, message: "预订价不能为空", trigger: "blur" }]
    };
    return {
      canEdit: true,
      // 右侧表单
      infoForm: {
        cygName: "",
        ysCode: "",
        marcid: "",
        gysCode: "",
        ydbhao: "",
        ydpcid: "",
        ceshu: localStorage.getItem("td-ydceshu") || 1,
        ydlaiyuan: "",
        yjhbid: "",
        jzleixing: "",
        yuanjia: "",
        zdfangshi: "",
        ydhbid: "",
        juance: 1,
        jiage: "",
        fuzhu: ""
      },
      yddOptions: [],
      moneyTypeOptions: [],
      // 字段标识表单
      currentMode: "marc",
      loadBiaoshiData: false,
      marcFormList: [],
      tmFormList: [],
      // 下方表格
      bottomTabs: [
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
          value: "gc"
        }
      ],
      currentBottomMode: "yd",
      ydList: [],
      ysList: [],
      gcList: []
    };
  },
  methods: {
    // 左侧模式
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
      this.infoForm.yuanjia = ""; // 防止没有价格字段没有重置为空
      itemsGetMarcTyinfo({
        marctyid: this.$route.query.marctyid
      }).then(res => {
        this.tmFormList = res.data.fieldList.map(item => {
          if (item.item === "010d" && item.content) {
            // eslint-disable-next-line no-useless-escape
            let floatReg = /\d+(.\d+)?/g;
            let arrNums = item.content.match(floatReg);
            this.infoForm.yuanjia = arrNums ? arrNums[0] : 0;
            this.handleConvertHlv();
          }
          return {
            content: item.content,
            item: item.item,
            name: MARC_CN[item.field] || item.field
          };
        });
      });
    },
    // 右侧编辑框
    getReserveZdsm() {
      reserveZdsm({
        zdpcid: this.$route.query.zdpcid,
        zdsmid: this.$route.query.zdsmid,
        marcid: this.$route.query.marcid
      })
        .then(res => {
          this.canEdit = true;
          this.infoForm = {
            ...this.infoForm,
            ydlaiyuan: "订购",
            jzleixing: "纸张",
            zdfangshi: "平装",
            ...res.data
          };
        })
        .catch(() => {
          this.canEdit = false;
        });
    },
    handleConvertHlv() {
      convertHlv({
        fromHbId: this.infoForm.yjhbid,
        toHbId: this.infoForm.ydhbid,
        fromMoney: this.infoForm.yuanjia
      }).then(res => {
        this.infoForm.jiage = Number(res.data.toMoney).toFixed(2);
      });
    },
    getMoneyTypeOptions() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.moneyTypeOptions = res.data.map(item => {
          // 默认人民币
          if (item.hbcode.toUpperCase() === "CNY") {
            this.infoForm.yjhbid = this.infoForm.ydhbid = item.hbid;
          }
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
        if (!this.infoForm.yjhbid) {
          this.infoForm.yjhbid = this.infoForm.ydhbid = this.getArrFirstValue(
            this.moneyTypeOptions
          );
        }
      });
    },
    getYdPcList() {
      ydPcList().then(res => {
        this.yddOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ydpcid
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
    changeYdDetail(ydpcid) {
      ydPcFind({
        ydpcid: ydpcid
      }).then(res => {
        this.infoForm.cygName = res.data.cygName;
        this.infoForm.ysCode = res.data.ysCode;
        this.infoForm.gysCode = res.data.gysCode;
      });
    },
    checkYdDetail(data) {
      this.infoForm = {
        ...this.infoForm,
        ...data,
        jiage: data["jge"]
      };
    },
    unsubscribeYd(id) {
      this.$confirm("确定要退订么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          unsubscribeYdsm({
            ydsmids: id
          }).then(res => {
            this.$message.success(res.message);
            this.getYdsmListInLib();
          });
        })
        .catch(() => {});
    },
    deleteYd(id) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ydsmDel({
            ydsmids: id
          }).then(res => {
            this.$message.success(res.message);
            this.getYdsmListInLib();
          });
        })
        .catch(() => {});
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveYdsm();
        } else {
          return false;
        }
      });
    },
    saveYdsm() {
      let requestObj = Object.assign({}, this.infoForm);
      requestObj.marcid = this.$route.query.marcid;
      saveYdsm(requestObj).then(res => {
        localStorage.setItem("td-ydceshu", requestObj.ceshu);
        this.$eventBus.$emit("smyd-update");
        this.closeCurrentTag();
        this.$message.success(res.message);
      });
    },
    // 取消
    closeCurrentTag() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          this.$router.push({
            name: this.$route.query.from,
            query: {
              zdpcid: this.$route.query.zdpcid // acq_zdsmlb
            }
          });
        });
    },
    // 初始化
    initData() {
      this.$refs["infoForm"].clearValidate();
      this.getReserveZdsm();
      this.getYssmListInLiB();
      this.getYdsmListInLib();
      this.getYdsmCollection();
      this.getMoneyTypeOptions();
      this.marcGetMarcTyinfo();
      this.itemsGetMarcTyinfo();
    }
  },
  mounted() {
    this.zdpcid = this.$route.query.zdpcid;
    this.zdsmid = this.$route.query.zdsmid;
    this.initData();
    this.getYdPcList();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "../styles/3distribution.less";
/deep/ .input__text {
  outline: none;
  border: none;
  background: transparent;
  width: 100%;
  text-overflow: ellipsis;
  overflow: hidden;
}
</style>
