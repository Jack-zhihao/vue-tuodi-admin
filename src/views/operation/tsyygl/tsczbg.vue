<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 19:42:09
 -->
<template>
  <div class="res_czbg common__content">
    <!-- <div class="content_padding"></div> -->
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="rcdj_register">
            <div class="card_title">图书藏址变更设置</div>
            <div class="register_content">
              <el-form
                class="simple__form"
                ref="simpleForm"
                label-width="85px"
                :model="simpleForm"
                :rules="simpleFormRules"
              >
                <el-form-item class="item" prop="tiaoma" label="条形码">
                  <el-input
                    clearable
                    size="mini"
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
                    size="mini"
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
                    size="mini"
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
                    size="mini"
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
                    placeholder="请选择..."
                    size="mini"
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
          <div class="rcdj_bookMsg">
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
          <div class="rcdj_duplicateMsg">
            <div class="card_title">藏址复本信息</div>
            <div class="duplicateMsg_content">
              <el-table
                :data="czCodeData"
                stripe
                style="width: 100%"
                v-loading="loadingReaderCur"
                height="500px"
              >
                <el-table-column prop="name" label="藏址"> </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="count"
                  label="复本"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="rcdj_duplicateMsg_cz">
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
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { commLibList, userCzList, flowType } from "api/public";
import { sxjczbg, getPcinfoList } from "api/operation";

export default {
  name: "opera_tsczbg",
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
      bookData: {
        ztming: "",
        ccun: "",
        zrsming: "",
        yma: "",
        isbn: "",
        jzleixing: "",
        cbzhe: "",
        zdfangshi: "",
        cbdi: "",
        wxlyuan: "",
        cbrqi: "",
        jge: ""
      },
      czCodeData: [],
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
      this.getPcList(val);
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
    getPcList(libid) {
      getPcinfoList({
        libid: libid || this.$store.getters.userInfo.libId,
        pageSize: 1000,
        pageNumer: 1,
        code: "0"
      }).then(res => {
        this.pcidOptions = res.data.dataList.map(item => {
          return {
            value: item.sxjpcId,
            label: item.daima
          };
        });
      });
    },
    // 藏址变更
    saveCzbg() {
      sxjczbg({
        ...this.simpleForm,
        xiangtongCz: this.xiangtongCz ? 1 : 2
      })
        .then(res => {
          this.$message.success("藏址变更成功");
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libList;
          this.czCodeData = res.data.czList;
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
      // tiaomaFindMarcshuce({
      //   tiaomaBatch1: this.simpleForm.tiaoma,
      //   tiaomaBatch2: this.simpleForm.tiaoma,
      //   type: 1,
      //   czid: this.simpleForm.czid
      // }).then(res => {
      //   if (!res.data[0].strVal2) {
      //     this.$message.error("条码不存在!");
      //     this.$refs.tiaomaInput.select();
      //     return;
      //   } else if (res.data[0].strVal2 && res.data[0].intVal > 0) {
      //     this.$message.error(`变更失败！目标藏址已有相同文献`);
      //     this.$refs.tiaomaInput.select();
      //     return;
      //   }
      this.saveCzbg();
      // });
    }
  },
  mounted() {
    if (this.$route.query.tiaoma && this.$route.query.bookData) {
      this.simpleForm.tiaoma = this.$route.query.tiaoma;
      this.bookData = this.$route.query.bookData;
    }
    this.getCygList();
    this.getUserCzList();
    this.getLtlxOptions();
    this.getPcList();
    this.$refs.tiaomaInput.focus();
  },
  // watch: {
  //   $route(to) {
  //     if (to.name !== "opera_tsczbg") {
  //       return;
  //     }
  //     console.log(to);
  //     if (to.query.tiaoma) {
  //       console.log(111);
  //       this.simpleForm.tiaoma = to.query.tiaoma;
  //       this.getCygList();
  //       this.getUserCzList();
  //       this.getLtlxOptions();
  //       this.getPcList();
  //       this.$refs.tiaomaInput.focus();
  //     }
  //   }
  // },
  activated() {
    if (this.$route.query.tiaoma && this.$route.query.bookData) {
      this.simpleForm.tiaoma = this.$route.query.tiaoma;
      this.bookData = this.$route.query.bookData;
    }
    this.$refs.tiaomaInput.focus();
    this.getPcList();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
.res_czbg {
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  width: 100%;
  .content_padding {
    height: 20px;
    background: #f1f1f1;
  }
  .content {
    padding: 0 20px;
    height: 100%;
  }
  .content_card {
    height: 100%;
    .card_title {
      padding-top: 6px;
      line-height: 30px;
      width: 120px;
      font-size: @FSize_14;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: @fontTintColor;
    }
    .rcdj_register {
      vertical-align: top;
      width: 50%;
      display: inline-block;
      box-sizing: border-box;
      .register_content {
        height: 224px;
        border: 1px solid @borderColor;
        margin-right: 5px;
        -moz-box-shadow: 1px 1px 6px #e2e2e2;
        -webkit-box-shadow: 1px 1px 6px #e2e2e2;
        box-shadow: 1px 1px 6px #e2e2e2;
        padding: 10px;
        box-sizing: border-box;
        .simple__form {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          background: @contentHdColor;

          .item {
            flex: 0 0 49%;
            .el-select {
              width: 100%;
            }
            /deep/ .el-form-item__label {
              text-align-last: justify;
              position: relative;
              &:after {
                content: "：";
                position: absolute;
                right: 0px;
              }
            }
            &.is-required {
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
        }
        .sure_btn {
          padding-left: 15%;
          /deep/.el-button {
            width: 100px;
          }
        }
      }
    }
    .rcdj_bookMsg {
      vertical-align: top;
      width: 50%;
      display: inline-block;
      box-sizing: border-box;
      .bookMsg_content {
        height: 224px;
        border: 1px solid @borderColor;
        margin-left: 5px;
        -moz-box-shadow: 1px 1px 6px #e2e2e2;
        -webkit-box-shadow: 1px 1px 6px #e2e2e2;
        box-shadow: 1px 1px 6px #e2e2e2;
        padding: 10px;
        box-sizing: border-box;
        .bookItem {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          div {
            height: 32px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            font-size: @FSize_14;
            width: 50%;
            .item_label {
              display: inline-block;
              width: 60px;
              text-align-last: justify;
              position: relative;
              padding-right: 14px;
              &:after {
                content: "：";
                position: absolute;
                right: 0px;
              }
            }
            .item_string {
              font-weight: bold;
              line-height: 32px;
              // display: inline-block;
              width: ~"calc(100% - 60px)";
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
    }
    .rcdj_duplicateMsg {
      width: 30%;
      height: calc(100% - 224px - 50px);
      display: inline-block;
      box-sizing: border-box;
      .duplicateMsg_content {
        height: calc(100% - 50px);
        border: 1px solid @borderColor;
        -moz-box-shadow: 1px 1px 6px #e2e2e2;
        -webkit-box-shadow: 1px 1px 6px #e2e2e2;
        box-shadow: 1px 1px 6px #e2e2e2;
        // padding: 5px;
        box-sizing: border-box;
      }
    }
    .rcdj_duplicateMsg_cz {
      width: 70%;
      height: calc(100% - 224px - 50px);
      display: inline-block;
      box-sizing: border-box;
      .duplicateMsg_content {
        height: calc(100% - 50px);
        border: 1px solid @borderColor;
        -moz-box-shadow: 1px 1px 6px #e2e2e2;
        -webkit-box-shadow: 1px 1px 6px #e2e2e2;
        box-shadow: 1px 1px 6px #e2e2e2;
        // padding: 5px;
        box-sizing: border-box;
      }
    }
  }
}
</style>
