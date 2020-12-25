<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-15 14:49:19
 * @LastEditTime: 2020-03-07 11:06:01
 -->

<template>
  <div class="p-qkyd" ref="qkydWrapper" tabindex="1" style="outline: none;">
    <div class="container">
      <div class="content__marc">
        <td-content-header>
          MARC模式
        </td-content-header>
        <marc-editor ref="marcEditor"></marc-editor>
      </div>
      <div class="content__form">
        <el-scrollbar>
          <div class="header">
            <div class="item">
              <span class="label">成员馆：</span>
              <span class="value">{{ formTitObj.libJiancheng || "-" }}</span>
            </div>
            <div class="item">
              <span class="label">预算代码：</span>
              <span class="value">{{ formTitObj.yusuanDaima || "-" }}</span>
            </div>
            <div class="item">
              <span class="label">书目控制号：</span>
              <span class="value">{{ formTitObj.smkzhao || "-" }}</span>
            </div>
            <div class="item">
              <span class="label">供应商代码：</span>
              <span class="value">{{ formTitObj.gysCode || "-" }}</span>
            </div>
            <div
              v-if="currentTag"
              class="header__tag"
              :class="{
                renew: currentTag === '续订',
                new: currentTag === '新订'
              }"
            >
              <p class="tag__txt">{{ currentTag }}</p>
            </div>
          </div>
          <div class="content">
            <el-form
              ref="infoForm"
              class="info__form"
              label-width="100px"
              :inline="true"
              :model="infoForm"
              :rules="infoFormRules"
              size="mini"
            >
              <el-form-item label="预订编号" prop="ydbhao">
                <el-input clearable v-model="infoForm.ydbhao"></el-input>
              </el-form-item>
              <el-form-item label="出版周期" prop="cbzq">
                <el-select
                  filterable
                  :disabled="$route.query.type == '2'"
                  v-model="infoForm.cbzq"
                  @change="changeCycle"
                  placeholder="请选择出版周期"
                >
                  <el-option
                    v-for="item in cycleOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="原价货币类型" prop="yjhbid">
                <el-select
                  filterable
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
              <el-form-item label="预订货币类型" prop="ydhbid">
                <el-select
                  filterable
                  @change="handleConvertHlv"
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
              <el-form-item label="原单价" prop="yuanjia">
                <el-input
                  @blur="handleConvertDayHlv"
                  clearable
                  v-only-num.float="infoForm.yuanjia"
                  v-model="infoForm.yuanjia"
                ></el-input>
              </el-form-item>
              <el-form-item label="预订单价" prop="jiage">
                <el-input
                  clearable
                  v-only-num.float="infoForm.jiage"
                  v-model="infoForm.jiage"
                ></el-input>
              </el-form-item>
              <el-form-item label="原年价" prop="nianjia">
                <el-input
                  @blur="handleConvertYearHlv"
                  clearable
                  v-only-num.float="infoForm.nianjia"
                  v-model="infoForm.nianjia"
                ></el-input>
              </el-form-item>
              <el-form-item label="预订年价" prop="ydnianjia">
                <el-input
                  clearable
                  v-only-num.float="infoForm.ydnianjia"
                  v-model="infoForm.ydnianjia"
                ></el-input>
              </el-form-item>
              <el-form-item label="订购年份" prop="dgnf">
                <el-date-picker
                  :disabled="$route.query.type == '2'"
                  value-format="yyyy"
                  v-model="infoForm.dgnf"
                  type="year"
                  clearable
                  placeholder="选择年份"
                >
                </el-date-picker>
              </el-form-item>
              <el-form-item label="订购期数" prop="zongqi">
                <el-input
                  @blur="changeNianjia"
                  clearable
                  :disabled="$route.query.type == '2'"
                  v-only-num="infoForm.zongqi"
                  v-model="infoForm.zongqi"
                ></el-input>
              </el-form-item>
              <el-form-item label="预订数量" prop="ceshu">
                <el-input
                  clearable
                  ref="focusInput"
                  v-model="infoForm.ceshu"
                  v-only-num="infoForm.ceshu"
                ></el-input>
              </el-form-item>
              <el-form-item label="文献来源" prop="ydlaiyuan">
                <el-select
                  filterable
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
              <el-form-item label="装订方式" prop="zdfangshi">
                <el-select
                  filterable
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
              <el-form-item label="介质类型" prop="jzleixing">
                <el-select
                  filterable
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
              <el-form-item label="订购号" prop="dgh">
                <el-input clearable v-model="infoForm.dgh"></el-input>
              </el-form-item>
              <el-form-item label="预订部门" prop="jddd">
                <el-input clearable v-model="infoForm.jddd"></el-input>
              </el-form-item>
              <el-form-item label="是否核心期刊" prop="hexinqk">
                <el-checkbox v-model="infoForm.hexinqk"></el-checkbox>
              </el-form-item>
              <el-form-item label="备注" class="item__textarea" prop="fuzhu">
                <el-input
                  clearable
                  v-model="infoForm.fuzhu"
                  type="textarea"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <div class="footer">
      <el-button
        title="手动输入完010 a(ISBN)或011 a(ISSN)或200 a(正题名)字段后，可按Alt+T进行套录"
        size="mini"
        @click="$refs.marcEditor.checkMarcDownload()"
        >套录(T)</el-button
      >
      <el-button type="primary" size="mini" @click="submitForm('infoForm')"
        >保存</el-button
      >
      <el-button size="mini" @click="closeCurrentPage">取消</el-button>
    </div>
  </div>
</template>

<script>
import {
  WXLYUAN_OPTIONS,
  JZLEIXING_OPTIONS,
  ZDFANGSHI_OPTIONS
} from "utils/variables";

import { hbList } from "api/public";

import { convertHlv } from "api/acquisition";

import {
  getYdsmOtherMsg,
  saveYdsm,
  getMarcOrder,
  ydsmXuDing
} from "api/periodical";

import MarcEditor from "./components/marcEditor";

import { catMarcSave } from "api/catalogue";

export default {
  name: "per_qkyd",
  components: {
    MarcEditor
  },
  data() {
    let validateNumcount = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入预订数量"));
      } else if (value <= 0) {
        callback(new Error("预订数量必须大于0"));
      } else {
        callback();
      }
    };

    this.infoFormRules = {
      yuanjia: [{ required: true, message: "请输入原单价", trigger: "blur" }],
      jiage: [{ required: true, message: "请输入预订单价", trigger: "blur" }],
      ceshu: [{ required: true, validator: validateNumcount, trigger: "blur" }],
      dgnf: [{ required: true, message: "请选择订购年份", trigger: "change" }],
      yjhbid: [
        { required: true, message: "请选择原价货币类型", trigger: "change" }
      ],
      ydhbid: [
        { required: true, message: "请选择预订货币类型", trigger: "change" }
      ],
      nianjia: [{ required: true, message: "请输入原年价", trigger: "blur" }],
      ydnianjia: [
        { required: true, message: "请输入预订年价", trigger: "blur" }
      ],
      zongqi: [{ required: true, message: "请输入订购期数", trigger: "blur" }],
      dgh: [{ required: true, message: "请输入订购号", trigger: "blur" }]
    };
    this.cycleValObj = {
      年刊: 1,
      半年刊: 2,
      双月刊: 6,
      月刊: 12,
      半月刊: 24,
      双周刊: 26,
      周刊: 52,
      季刊: 4,
      旬刊: 36,
      不定期: 1,
      日报: 365
    };
    this.cycleOptions = [
      {
        label: "年刊",
        value: "年刊"
      },
      {
        label: "半年刊",
        value: "半年刊"
      },
      {
        label: "双月刊",
        value: "双月刊"
      },
      {
        label: "月刊",
        value: "月刊"
      },
      {
        label: "半月刊",
        value: "半月刊"
      },
      {
        label: "双周刊",
        value: "双周刊"
      },
      {
        label: "周刊",
        value: "周刊"
      },
      {
        label: "季刊",
        value: "季刊"
      },
      {
        label: "旬刊",
        value: "旬刊"
      },
      {
        label: "不定期",
        value: "不定期"
      },
      {
        label: "日报",
        value: "日报"
      }
    ];
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    return {
      // 右侧表格
      moneyTypeOptions: [],
      formTitObj: {
        libJiancheng: "",
        yusuanDaima: "",
        smkzhao: "",
        gysCode: ""
      },
      currentTag: "",
      infoForm: {
        ydbhao: "",
        cbzq: "",
        yjhbid: "",
        ydhbid: "",
        yuanjia: "",
        jiage: "",
        nianjia: "",
        ydnianjia: "",
        dgnf: "",
        zongqi: "",
        ceshu: "",
        ydlaiyuan: "订购",
        zdfangshi: "平装",
        jzleixing: "纸张",
        hexinqk: false,
        jddd: "",
        dgh: "",
        fuzhu: ""
      }
    };
  },
  methods: {
    keyEvent(event) {
      if (event.altKey && event.keyCode === 84) {
        // T 套录
        window.event.preventDefault();
        this.$refs.marcEditor.checkMarcDownload();
      }
      if (event.altKey && event.keyCode === 78) {
        // ALT+N 新增MARC
        window.event.preventDefault();
        this.$refs.marcEditor.addItem();
      } else if (event.altKey && event.keyCode === 88) {
        // ALT+X 删除MARC
        window.event.preventDefault();
        this.$refs.marcEditor.checkRemoveItems();
      }
    },
    // 右侧表格
    getXdOrder() {
      // 续订
      ydsmXuDing({
        marcid: this.marcid
      })
        .then(res => {
          Object.keys(this.infoForm).forEach(key => {
            this.infoForm[key] = res.data[key];
          });
        })
        .catch(() => {
          this.closeCurrentPage();
        });
    },
    getMarcOrder() {
      // 编辑
      getMarcOrder({
        qkydsmid: this.qkydsmid,
        type: this.type // 2为获取单个记录
      })
        .then(res => {
          Object.keys(this.infoForm).forEach(key => {
            this.infoForm[key] = res.data[key];
          });
        })
        .catch(() => {
          this.closeCurrentPage();
        });
    },
    changeCycle(value) {
      this.infoForm.zongqi = this.cycleValObj[value];
      this.changeNianjia();
    },
    getMoneyTypeOptions(libId) {
      return new Promise((resolve, reject) => {
        hbList({
          libId: libId
        })
          .then(res => {
            this.moneyTypeOptions = res.data.map(item => {
              return {
                label: item.hbcode,
                value: item.hbid
              };
            });
            this.infoForm.yjhbid = this.infoForm.ydhbid = this
              .moneyTypeOptions[0]
              ? this.moneyTypeOptions[0].value
              : "";
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    async getYdsmOtherMsgApi() {
      return new Promise((resolve, reject) => {
        getYdsmOtherMsg({
          zdpcid: this.$route.query.zdpcid,
          marcid: this.$route.query.marcid
        })
          .then(res => {
            let resultData = res.data[0];
            this.formTitObj.libJiancheng = resultData.libJiancheng;
            this.formTitObj.yusuanDaima = resultData.yusuanDaima;
            this.formTitObj.smkzhao = resultData.smkzhao;
            this.formTitObj.gysCode = resultData.gysCode;
            this.infoForm.dgnf = resultData.zdnian;
            // 新订的时候设置默认值
            if (this.currentTag == "新订") {
              // 原单价
              this.infoForm.yuanjia = resultData.qkjge ? resultData.qkjge : 0;
              this.handleConvertDayHlv();
              // 原年价
              this.infoForm.nianjia = (
                this.infoForm.yuanjia * this.infoForm.zongqi
              ).toFixed(2);
              if (Number.isNaN(this.infoForm.nianjia)) {
                this.infoForm.nianjia = 0;
              }
              this.handleConvertYearHlv();
              // 期刊
              let isExistcbzq = this.cycleValObj[resultData.cbzqi]
                ? true
                : false;
              this.infoForm.cbzq = isExistcbzq ? resultData.cbzqi : "月刊";

              this.changeCycle(this.infoForm.cbzq);
              // 预订数量
              this.infoForm.ceshu = resultData.ceshu;
              // 地点
              this.infoForm.jddd = resultData.jddd;
              // 订购号
              this.infoForm.dgh = resultData.dghao;
            }
            this.otherMsg = resultData;
            resolve(resultData.libid);
          })
          .catch(() => {
            reject();
          });
      });
    },
    async getYdsmOtherMsg() {
      let libId = await this.getYdsmOtherMsgApi();
      await this.getMoneyTypeOptions(libId);
    },
    closeCurrentPage() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          this.$router.push({
            name: this.$route.query.from,
            query: {
              zdpcid: this.$route.query.zdpcid
            }
          });
        });
    },
    saveYdsm() {
      let requestObj = {
        ...this.otherMsg,
        ...this.infoForm,
        zdpcid: this.$route.query.zdpcid,
        cbplv: this.cycleValObj[this.infoForm.cbzq],
        marcid: this.$route.query.marcid,
        qkydsmid: this.$route.query.qkydsmid
      };
      saveYdsm(requestObj).then(res => {
        this.$message.success(res.message);

        this.$eventBus.$emit("qkyd-update");

        this.closeCurrentPage();
      });
    },
    // 通用
    handleConvertHlv() {
      this.handleConvertDayHlv();
      this.handleConvertYearHlv();
    },
    changeNianjia() {
      this.infoForm.nianjia = (
        this.infoForm.yuanjia * this.infoForm.zongqi
      ).toFixed(2);
      this.handleConvertYearHlv();
    },
    handleConvertDayHlv() {
      // 单价
      convertHlv({
        fromHbId: this.infoForm.yjhbid,
        toHbId: this.infoForm.ydhbid,
        fromMoney: this.infoForm.yuanjia || 0
      }).then(res => {
        this.infoForm.jiage = Number(res.data.toMoney).toFixed(2);
        this.changeNianjia();
      });
    },
    handleConvertYearHlv() {
      // 年价
      convertHlv({
        fromHbId: this.infoForm.yjhbid,
        toHbId: this.infoForm.ydhbid,
        fromMoney: this.infoForm.nianjia || 0
      }).then(res => {
        this.infoForm.ydnianjia = Number(res.data.toMoney).toFixed(2);
      });
    },
    async initData() {
      await this.$refs.marcEditor.getMarcTyInfo(true);
      this.$refs.marcEditor.getSysMarcConfigMarcFbList();
      // 新订的记录数据从这里拿
      await this.getYdsmOtherMsg();
      if (this.type === 1) {
        this.getXdOrder(); // 续订的记录数据从这里拿
      } else {
        if (this.qkydsmid) {
          this.getMarcOrder(); // 编辑的记录数据从这里拿
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.$refs.marcEditor.checkItems()) {
            this.saveMarcItems();
          }
        } else {
          return false;
        }
      });
    },
    saveMarcItems() {
      this.savingItems = true;
      catMarcSave({
        isQk: 1,
        marcfbid: this.$refs.marcEditor.fbtype,
        templateId: this.$refs.marcEditor.mbType,
        marctyid: this.$route.query.marctyid,
        fieldList: JSON.stringify(this.$refs.marcEditor.itemList)
      })
        .then(() => {
          this.saveYdsm();
        })
        .finally(() => {
          this.savingItems = false;
        });
    },
    getCurrentTag() {
      switch (this.type) {
        case 1:
          this.currentTag = "续订";
          break;
        case 2: // 编辑不要显示状态
          this.currentTag = "";
          break;
        default:
          this.currentTag = "新订";
          break;
      }
    }
  },
  mounted() {
    document
      .querySelector(".p-qkyd")
      .addEventListener("keydown", this.keyEvent, false);
    this.qkydsmid = this.$route.query.qkydsmid;
    this.marcid = this.$route.query.marcid;
    this.type = this.$route.query.type;
    this.getCurrentTag();
    this.initData();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  },
  watch: {
    $route(to) {
      if (to.name !== "per_qkyd") {
        return;
      }
      if (
        this.marcid !== to.query.marcid ||
        this.qkydsmid !== to.query.qkydsmid ||
        this.type !== to.query.type
      ) {
        this.marcid = to.query.marcid;
        this.type = this.$route.query.type;
        this.getCurrentTag();
        this.qkydsmid = to.query.qkydsmid;
        this.$refs["infoForm"].resetFields();
        this.initData();
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  display: flex;
  justify-content: space-between;
  height: ~"calc(100% - 45px)";
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .content__marc {
    height: 100%;
    width: ~"calc(100% - 613px)";
    flex: auto;
    border-right: 1px solid @borderColor;
  }
  .content__form {
    height: 100%;
    border-left: 1px solid @borderColor;
    margin-left: 5px;
    flex-basis: 530px;
    flex-shrink: 0;
    .content {
      padding: 0 10px 20px;
    }
    .header {
      position: relative;
      display: flex;
      flex-wrap: wrap;
      padding: 10px 25px;
      background: @topBgColor;
      border-bottom: 1px solid @borderColor;
      .item {
        display: flex;
        align-items: center;
        flex-basis: 50%;
        height: 28px;
        margin: 4px 0;
        .label {
          flex-shrink: 0;
          font-weight: bold;
        }
        .value {
          line-height: 1;
          padding: 4px;
          background: @contentHdColor;
          border-radius: 4px;
        }
      }
      .header__tag {
        position: absolute;
        right: 0;
        top: 0;
        font-size: @FSize_16;
        color: @fontWhiteColor;
        &::before {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-width: 40px;
          border-style: solid;
          border-color: transparent;
        }
        &::after {
          content: "";
          position: absolute;
          top: 0;
          right: 0;
          width: 0;
          height: 0;
          border-width: 15px;
          border-style: solid;
          border-color: #f1f2f3 #f1f2f3 transparent transparent;
        }
        &.new {
          &::before {
            border-color: @primaryColor @primaryColor transparent transparent;
          }
        }
        &.renew {
          &::before {
            border-color: @successColor @successColor transparent transparent;
          }
        }
        .tag__txt {
          position: relative;
          transform: rotate(45deg);
          margin-top: 20px;
          letter-spacing: 5px;
        }
      }
    }
    .el-form {
      padding-top: 18px;
      /deep/ .el-form-item__label {
        text-align-last: justify;
        position: relative;
        &:after {
          content: "：";
          position: absolute;
          right: 0px;
        }
      }
      .item__textarea {
        display: flex;
        /deep/ .el-form-item__content {
          flex: 1;
        }
      }
      .el-form-item.is-required {
        /deep/ .el-form-item__label {
          &::before {
            position: absolute;
            left: -8px;
            top: 3px;
            content: "*";
            color: @dangerColor;
          }
        }
      }
    }
    .el-select,
    .el-input,
    .el-input-number {
      width: 140px;
    }
  }
}
.footer {
  height: 45px;
  border-top: 1px solid @tableBorderColor;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  .el-button {
    padding: 8px 30px;
  }
}
</style>
