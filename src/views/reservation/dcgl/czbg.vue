<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-03 17:33:12
 -->
<template>
  <div class="res_contain common__content">
    <!-- <div class="content_padding"></div> -->
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_register">
            <div class="card_title">藏址变更</div>
            <div class="register_content">
              <el-form
                class="simple__form"
                ref="simpleForm"
                label-width="85px"
                :model="simpleForm"
                :rules="simpleFormRules"
                size="mini"
              >
                <el-form-item class="item" prop="tiaoma" label="条形码">
                  <el-input
                    clearable
                    v-model="simpleForm.tiaoma"
                    @keyup.enter.native="gzbgSubmitForm('simpleForm')"
                    ref="tiaomaInput"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="libid" label="入藏成员馆">
                  <el-select
                    filterable
                    v-model="simpleForm.libid"
                    placeholder="请选择..."
                    @change="getInitSelect(simpleForm.libid)"
                  >
                    <el-option
                      v-for="item in cygList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item" prop="czid" label="入藏藏址">
                  <el-select
                    filterable
                    v-model="simpleForm.czid"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in userCzList"
                      :key="item.czid"
                      :label="item.mingcheng"
                      :value="item.czid"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item" prop="ltlxid" label="流通类型">
                  <el-select
                    filterable
                    v-model="simpleForm.ltlxid"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in ltlxidOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item
                  class="item item__declare"
                  prop="pcid"
                  label="批次"
                >
                  <el-select
                    filterable
                    v-model="simpleForm.pcid"
                    @change="getPcList"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in pcidOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="sure_btn">
                <el-checkbox
                  style="margin-bottom: 3px;margin-right: 10px;"
                  v-model="checkRepeat"
                  >藏址查重</el-checkbox
                >
                <el-checkbox
                  style="margin-bottom: 3px;margin-right: 10px;"
                  v-model="checked"
                  >变更前无需确认</el-checkbox
                >
                <el-checkbox
                  style="margin-bottom: 3px;margin-right: 10px;"
                  v-model="xiangtongCz"
                  >同藏址转换记录到批次中</el-checkbox
                >
                <el-button
                  size="mini"
                  type="primary"
                  @click="gzbgSubmitForm('simpleForm')"
                  >确定</el-button
                >
              </div>
            </div>
          </div>
          <div class="res_bookMsg">
            <div class="card_title">图书信息</div>
            <div class="bookMsg_content">
              <div class="bookItem">
                <div>
                  <span class="item_label">正题名</span>
                  <span class="item_string">{{ bookData.ztming }}</span>
                </div>
                <div>
                  <span class="item_label">尺寸</span>
                  <span class="item_string">{{ bookData.ccun }}</span>
                </div>
                <div>
                  <span class="item_label">责任者</span>
                  <span class="item_string">{{ bookData.zrsming }}</span>
                </div>
                <div>
                  <span class="item_label">页码</span>
                  <span class="item_string">{{ bookData.yma }}</span>
                </div>
                <div>
                  <span class="item_label">I S B N</span>
                  <span class="item_string">{{ bookData.isbn }}</span>
                </div>
                <div>
                  <span class="item_label">介质类型</span>
                  <span class="item_string">{{ bookData.jzleixing }}</span>
                </div>
                <div>
                  <span class="item_label">出版社</span>
                  <span class="item_string">{{ bookData.cbzhe }}</span>
                </div>
                <div>
                  <span class="item_label">装订方式</span>
                  <span class="item_string">{{ bookData.zdfangshi }}</span>
                </div>
                <div>
                  <span class="item_label">出版地</span>
                  <span class="item_string">{{ bookData.cbdi }}</span>
                </div>
                <div>
                  <span class="item_label">文献来源</span>
                  <span class="item_string">{{ bookData.wxlyuan }}</span>
                </div>
                <div>
                  <span class="item_label">出版年</span>
                  <span class="item_string">{{ bookData.cbrqi }}</span>
                </div>
                <div>
                  <span class="item_label">价格</span>
                  <span class="item_string">{{ bookData.jge }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="res_duplicateMsg">
            <div class="card_title">复本信息</div>
            <div class="duplicateMsg_content">
              <el-table
                :data="codeData"
                stripe
                style="width: 100%"
                v-loading="loadingReaderCur"
                height="500px"
              >
                <el-table-column prop="tiaoma" label="条形码" width="161">
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
                  prop="sshao"
                  label="索书号"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ccLib"
                  label="财产馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="xzLib"
                  label="现在馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="czName"
                  label="现藏址"
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
                  prop="jcmshu"
                  label="卷册说明"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { commLibList, userCzList, flowType, getPcList } from "api/public";
import { saveCzbg, tiaomaFindMarcshuce } from "api/reservation";
export default {
  name: "res_czbg",
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        libid: this.$store.getters.userInfo.libId,
        tiaoma: "",
        ltlxid: "",
        czid: "",
        pcid: ""
      },
      bookData: {},
      codeData: [],
      loadingReaderCur: false,
      simpleFormRules: {
        tiaoma: [
          { required: true, message: "条形码不能为空", trigger: "change" }
        ],
        libid: [
          { required: true, message: "成员馆不能为空", trigger: "change" }
        ],
        ltlxid: [
          { required: true, message: "流通类型不能为空", trigger: "change" }
        ],
        czid: [
          { required: true, message: "入藏藏址不能为空", trigger: "change" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      checkRepeat: true,
      checked: false,
      xiangtongCz: true,
      cygList: [],
      ltlxidOptions: [],
      userCzList: [],
      pcidOptions: []
    };
  },
  methods: {
    getInitSelect(val) {
      this.getUserCzList(val);
      this.getLtlxOptions(val);
    },
    getCygList() {
      commLibList().then(res => {
        this.cygList = res.data.map(item => {
          return {
            label: item.libJiancheng,
            value: item.libId
          };
        });
      });
    },
    getUserCzList(libid) {
      userCzList({
        libId: libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.userCzList = [...res.data];
        this.simpleForm.czid = this.userCzList[0]
          ? this.userCzList[0].czid
          : "";
      });
    },
    getLtlxOptions(libid) {
      flowType({
        libId: libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.ltlxidOptions = res.data.map(item => {
          return {
            value: item.ltlxid,
            label: item.mingcheng
          };
        });
        this.simpleForm.ltlxid = this.ltlxidOptions[0]
          ? this.ltlxidOptions[0].value
          : "";
      });
    },
    getPcList() {
      getPcList().then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.dcpcid,
            label: item.daima
          };
        });
      });
    },
    // 藏址变更
    saveCzbg() {
      saveCzbg({
        ...this.simpleForm,
        xiangtongCz: this.xiangtongCz ? 1 : 2
      })
        .then(res => {
          this.$message.success(res.message);
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libInfo;
          this.$refs.tiaomaInput.select();
        })
        .catch(() => {
          this.$refs.tiaomaInput.select();
        });
    },
    gzbgSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checked) {
            this.$confirm("确定要馆藏变更么?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              if (this.checkRepeat) {
                this.checkMarcShuce();
              } else {
                this.saveCzbg();
              }
            });
          } else {
            if (this.checkRepeat) {
              this.checkMarcShuce();
            } else {
              this.saveCzbg();
            }
          }
        } else {
          return false;
        }
      });
    },
    checkMarcShuce() {
      tiaomaFindMarcshuce({
        tiaomaBatch1: this.simpleForm.tiaoma,
        tiaomaBatch2: this.simpleForm.tiaoma,
        type: 1,
        czid: this.simpleForm.czid
      }).then(res => {
        if (!res.data[0].strVal2) {
          this.$message.error("条码不存在!");
          this.$refs.tiaomaInput.select();
          return;
        } else if (res.data[0].strVal2 && res.data[0].intVal > 0) {
          this.$message.error(`变更失败！目标藏址已有相同文献`);
          this.$refs.tiaomaInput.select();
          return;
        }
        this.saveCzbg();
      });
    }
  },
  mounted() {
    this.getCygList();
    this.getUserCzList();
    this.getLtlxOptions();
    this.getPcList();
    this.$refs.tiaomaInput.focus();
  },
  activated() {
    this.$refs.tiaomaInput.focus();
    this.getPcList();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
