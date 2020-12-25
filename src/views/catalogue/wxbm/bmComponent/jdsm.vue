<!--
 * @Description: 简单编目
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-08 13:47:21
 * @LastEditTime: 2020-03-10 17:12:51
 -->

<template>
  <div class="jdsm" ref="jdsmWrapper">
    <div class="content">
      <div v-show="showMarcDownloadList" class="taolu__layer">
        <el-scrollbar v-loading="downloadTransing">
          <icon-svg
            icon-class="icon-btn-ico-21"
            @click.native="
              showMarcDownloadList = false;
              $refs.jdsmWrapper.focus();
            "
          />
          <p class="shortItem__tip">
            根据【<span>{{ downLoadType }}</span
            >】套录
          </p>
          <div class="shortItem" v-show="marcDownList.length === 0">
            暂无相应记录
          </div>
          <div
            class="shortItem"
            v-for="(item, index) in marcDownList"
            :key="index"
            @click="marcDownloadTrans(item)"
          >
            <el-popover
              popper-class="isnb__popover"
              trigger="hover"
              placement="right-start"
            >
              <div class="triangle">
                <table width="680px" border="0" cellspacing="0">
                  <tr
                    v-for="(item, index) in item.fieldList"
                    :key="index"
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
                <p>
                  {{ index + 1 }}. 正题名：<span
                    style="font-weight:bold;"
                    :title="item.ztming"
                    >{{ item.ztming }}</span
                  >
                </p>
                <p v-show="item.isbn">
                  &nbsp;&nbsp;&nbsp;&nbsp;ISBN：<span
                    style="font-weight:bold;"
                    :title="item.isbn"
                    >{{ item.isbn }}</span
                  >
                </p>
                <p v-show="item.issn">
                  &nbsp;&nbsp;&nbsp;&nbsp;ISSN：<span
                    style="font-weight:bold;"
                    :title="item.issn"
                    >{{ item.issn }}</span
                  >
                </p>
              </div>
            </el-popover>
          </div>
        </el-scrollbar>
      </div>
      <el-form
        v-loading="loadTyInfo"
        :model="jdbmForm"
        :rules="jdbmFormRules"
        label-width="100px"
        ref="jdbmForm"
        class="jdbm__Form custom__form"
        size="mini"
        style="margin-top: 10px;"
      >
        <div class="custom__form_wrapper">
          <el-form-item class="item" label="正题名" prop="ztming">
            <el-input
              ref="focusInput"
              clearable
              data-type="smarcInput"
              class="smarc__input"
              data-index="0"
              v-model="jdbmForm.ztming"
              @keydown.alt.84.native.exact.stop="
                marcDownload('ztming', jdbmForm.ztming)
              "
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="副题名" prop="ftming">
            <el-input
              clearable
              data-type="smarcInput"
              class="smarc__input"
              data-index="1"
              v-model="jdbmForm.ftming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="并列题名" prop="bltming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="2"
              clearable
              v-model="jdbmForm.bltming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="责任者" prop="zrsming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="3"
              clearable
              v-model="jdbmForm.zrsming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="其他责任者" prop="otherzrsming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="4"
              clearable
              v-model="jdbmForm.otherzrsming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="I S B N" prop="isbn">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="5"
              clearable
              @keyup.native="
                handleBarCodeScanner($event, val => (jdbmForm.isbn = val))
              "
              v-model="jdbmForm.isbn"
              @keydown.alt.84.native.exact.stop="
                marcDownload('isbn', jdbmForm.isbn)
              "
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="出版时间" prop="cbrqi">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="6"
              clearable
              v-model="jdbmForm.cbrqi"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="出版社" prop="cbzhe">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="7"
              clearable
              v-model="jdbmForm.cbzhe"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="出版地" prop="cbdi">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="8"
              clearable
              v-model="jdbmForm.cbdi"
            ></el-input>
          </el-form-item>
          <el-form-item
            class="item"
            :class="{ require: $route.query.from !== 'acq_jcyd' }"
            label="分类号"
            prop="flhao"
          >
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="9"
              @blur="flhaoBlur"
              @keydown.enter.native="flhaoBlur"
              clearable
              v-model="jdbmForm.flhao"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="版本说明" prop="bci">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="10"
              clearable
              v-model="jdbmForm.bci"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="文献尺寸" prop="ccun">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="11"
              clearable
              v-model="jdbmForm.ccun"
            ></el-input>
          </el-form-item>
          <el-form-item class="item item__select" label="主题词" prop="zti">
            <el-select
              filterable
              v-model="ztiSelected"
              multiple
              class="multi line"
              collapse-tags
              ref="ztiSelect"
              @change="changeZti"
              @blur="handleShowSelectBlur"
            >
              <el-option
                v-for="item in ztiSelectedArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              data-type="smarcInput"
              ref="nextFocus"
              class="smarc__input"
              data-index="12"
              clearable
              v-model="jdbmForm.zti"
            ></el-input>
            <span key="1" @click="handleShowSelect" v-if="!showSelect">
              <icon-svg class="primary" icon-class="icon-xialajiantou" />
            </span>
            <span key="2" v-if="showSelect">
              <icon-svg
                style="transform: rotate(180deg)"
                class="primary"
                icon-class="icon-xialajiantou"
              />
            </span>
          </el-form-item>
          <el-form-item class="item" label="价格" prop="jge">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="13"
              clearable
              v-model="jdbmForm.jge"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="页码" prop="yma">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="14"
              clearable
              v-model="jdbmForm.yma"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="语种" prop="yzhong">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="15"
              clearable
              v-model="jdbmForm.yzhong"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="分辑名" prop="fjming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="16"
              clearable
              v-model="jdbmForm.fjming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="分辑号" prop="fjhao">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="17"
              clearable
              v-model="jdbmForm.fjhao"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="丛编题名" prop="cbtming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="18"
              clearable
              v-model="jdbmForm.cbtming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="丛编责任者" prop="cbzrsming">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="19"
              clearable
              v-model="jdbmForm.cbzrsming"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="附件" prop="fjian">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              data-index="20"
              clearable
              v-model="jdbmForm.fjian"
            ></el-input>
          </el-form-item>
          <el-form-item class="item item__line" label="一般性附注" prop="fzhu">
            <el-input
              data-type="smarcInput"
              class="smarc__input"
              style="width: 100%;"
              data-index="21"
              clearable
              v-model="jdbmForm.fzhu"
            ></el-input>
          </el-form-item>
          <el-form-item class="item item__line" label="摘要内容" prop="zyao">
            <el-input
              type="textarea"
              data-type="smarcInput"
              class="smarc__input"
              style="width: 100%;"
              data-index="22"
              clearable
              :rows="5"
              v-model="jdbmForm.zyao"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="footer">
      <div class="data__detail">
        <div>
          <p v-show="catalogDto.createUserName">
            创建人:<span class="name">{{ catalogDto.createUserName }}</span>
          </p>
          <p v-show="catalogDto.riqi">
            创建日期:<span :title="catalogDto.riqi">{{ catalogDto.riqi }}</span>
          </p>
        </div>
        <div>
          <p v-show="catalogDto.updateUserName">
            最近编目人:<span class="name">{{ catalogDto.updateUserName }}</span>
          </p>
          <p v-show="catalogDto.updateTime">
            最近编目日期:<span :title="catalogDto.updateTime">{{
              catalogDto.updateTime
            }}</span>
          </p>
        </div>
        <div>
          <p v-show="catalogDto.auditUserName">
            审校人:<span class="name">{{ catalogDto.auditUserName }}</span>
          </p>
          <p v-show="catalogDto.auditTime">
            审校日期:<span :title="catalogDto.auditTime">{{
              catalogDto.auditTime
            }}</span>
          </p>
        </div>
      </div>
      <div>
        <el-button
          :loading="downloadTransing"
          type="primary"
          size="mini"
          @click="checkMarcDownload"
          title="输入完 ISBN 或 正题名 字段后，可按 Alt + T 进行套录"
          >套录(T)</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="$eventBus.$emit('handleAnalysisVisible')"
          title="ALT + G"
          >粘贴网页MARC(G)</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="auditItem"
          :loading="isAuditing"
          v-if="!alreadyAudit"
          title="ALT + F"
          >审校(F)</el-button
        >
        <el-button
          size="mini"
          title="ALT + U"
          @click="unauditItem"
          :loading="isAuditing"
          v-else
          >取消审校(U)</el-button
        >
        <el-button
          :loading="saveTyInfo"
          title="ALT + S"
          type="primary"
          size="mini"
          @click="submitForm('jdbmForm')"
          >保存(S)</el-button
        >
        <el-button size="mini" @click="closeCurrentTag">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import {
  simpleGetMarcTyinfo,
  catalogSimpleSave,
  catMarcDownload,
  catMarcDownloadFieldList,
  catalogueAudit,
  catalogueUnAudit
} from "api/catalogue";

import { myBrowser } from "utils/utils";

import { findZtcByFlhaoEq } from "api/acquisition";

export default {
  name: "jdsm",
  data() {
    this.myBrowser = myBrowser;
    this.jdbmFormRules = {
      ztming: [{ required: true, message: "正题名不能为空", trigger: "blur" }],
      flhao: [{ required: true, message: "分类号不能为空", trigger: "blur" }]
    };
    if (this.$route.query.from === "acq_jcyd") {
      delete this.jdbmFormRules["flhao"];
    }
    return {
      // 获取模板
      loadTyInfo: false,
      jdbmForm: {
        ztming: "",
        ftming: "",
        fjming: "",
        bltming: "",
        flhao: "",
        fjhao: "",
        zrsming: "",
        otherzrsming: "",
        isbn: "",
        jge: "CNY",
        cbdi: "",
        cbzhe: "",
        cbrqi: "",
        bci: "",
        ccun: "",
        yma: "",
        fjian: "",
        yzhong: "",
        cbtming: "",
        cbzrsming: "",
        zti: "",
        fzhu: "",
        zyao: ""
      },
      saveTyInfo: false,
      savingItems: false,
      downLoadType: "",
      showMarcDownloadList: false,
      marcDownList: [],
      downloadTransing: false,
      // 表单事件
      ztiSelected: [],
      ztiSelectedArr: [],
      showSelect: false,
      alreadyAudit: false,
      isAuditing: false,
      // 审校信息
      catalogDto: {}
    };
  },
  methods: {
    isChangeFormData() {
      return this.defaultBMForm !== JSON.stringify(this.jdbmForm);
    },
    // 获取模板
    getMarcTyInfo() {
      if (!this.$route.query.marctyid) {
        this.defaultBMForm = JSON.stringify(this.jdbmForm);
        this.resetForm("jdbmForm");
        this.$refs.focusInput && this.$refs.focusInput.select();
        return;
      }
      this.loadTyInfo = true;
      simpleGetMarcTyinfo({
        marctyid: this.$route.query.marctyid
      })
        .then(res => {
          this.alreadyAudit = res.data.ztai === "已审核";
          this.catalogDto = {
            createUserName: res.data.createUserName,
            riqi: res.data.riqi,
            updateUserName: res.data.updateUserName,
            updateTime: res.data.updateTime,
            auditUserName: res.data.auditUserName,
            auditTime: res.data.auditTime
          };
          let formObj = this.jdbmForm;
          Object.keys(formObj).map(key => {
            formObj[key] = res.data[key] ? res.data[key] : "";
          });
          this.$nextTick(() => {
            this.$refs.focusInput && this.$refs.focusInput.select();
          });
          this.defaultBMForm = JSON.stringify(formObj);
        })
        .finally(() => {
          this.loadTyInfo = false;
        });
    },
    checkMarcDownload(defatulData) {
      if (
        this.jdbmForm.ztming === "" &&
        this.jdbmForm.isbn === "" &&
        !defatulData
      ) {
        this.$message.error("请输入正题名或ISBN");
        return;
      }
      this.downloadTransing = true;
      let requestObj = {};
      if (this.jdbmForm.ztming) {
        requestObj.ztming = this.jdbmForm.ztming;
      } else if (this.jdbmForm.isbn) {
        requestObj.isbn = this.jdbmForm.isbn;
      } else if (defatulData.key) {
        requestObj[defatulData.key] = defatulData.value;
      }
      if (requestObj.isbn) {
        this.downLoadType = "ISBN";
      } else if (requestObj.issn) {
        this.downLoadType = "ISSN";
      } else if (requestObj.ztming) {
        this.downLoadType = "正题名";
      }
      catMarcDownload(requestObj)
        .then(res => {
          this.$nextTick(() => {
            this.showMarcDownloadList = true;
          });
          this.marcDownList = res.data;
        })
        .finally(() => {
          this.downloadTransing = false;
        });
    },
    marcDownload(field, data) {
      if (field === "isbn" || field === "ztming") {
        let requestObj = {};
        switch (field) {
          case "isbn":
            requestObj.isbn = data;
            break;
          case "ztming":
            requestObj.ztming = data;
            break;
          default:
            break;
        }
        this.downloadTransing = true;
        if (requestObj.isbn) {
          this.downLoadType = "ISBN";
        } else if (requestObj.issn) {
          this.downLoadType = "ISSN";
        } else if (requestObj.ztming) {
          this.downLoadType = "正题名";
        }
        catMarcDownload(requestObj)
          .then(res => {
            this.$nextTick(() => {
              this.showMarcDownloadList = true;
            });
            this.marcDownList = res.data;
          })
          .finally(() => {
            this.downloadTransing = false;
          });
      }
    },
    marcDownloadTrans(item) {
      this.downloadTransing = true;
      catMarcDownloadFieldList({
        marcnr: item.marcnr,
        mode: 1
      })
        .then(res => {
          this.$refs.jdbmForm.clearValidate();
          let formObj = this.jdbmForm;
          Object.keys(formObj).forEach(key => {
            formObj[key] = res.data[key] ? res.data[key] : "";
          });
        })
        .finally(() => {
          this.downloadTransing = false;
          // this.showMarcDownloadList = false;
          this.$refs.jdsmWrapper.focus();
        });
    },
    // 表单事件
    changeZti(val) {
      this.jdbmForm.zti = val.join("");
    },
    handleShowSelect() {
      this.showSelect = true;
      this.$refs.ztiSelect.focus();
    },
    handleShowSelectBlur() {
      this.showSelect = false;
      setTimeout(() => {
        document
          .querySelector(".item__select input")
          .setAttribute("tabIndex", -1);
      }, 500);
    },
    flhaoBlur(event) {
      findZtcByFlhaoEq({
        flhao: event.target.value
      }).then(res => {
        this.ztiSelectedArr = res.data.map(item => {
          return {
            value: item,
            label: item
          };
        });

        if (this.ztiSelectedArr[0]) {
          this.ztiSelected = [this.ztiSelectedArr[0].value];
          this.changeZti(this.ztiSelected);
        } else {
          this.ztiSelected = [];
        }
        setTimeout(() => {
          document
            .querySelector(".item__select input")
            .setAttribute("tabIndex", -1);
        }, 500);
      });
    },
    // 取消
    closeCurrentTag() {
      if (this.$route.query.from) {
        this.$store
          .dispatch("delView", {
            name: this.$route.name,
            path: this.$route.path
          })
          .then(() => {
            let retunQeury = {
              zdpcid: this.$route.query.zdpcid
            };
            if (this.$route.query.isbn) {
              retunQeury.isbn = this.$route.query.isbn;
            }
            this.$router.push({
              name: this.$route.query.from,
              query: retunQeury
            });
          });
      }
    },
    // 保存
    catalogSimpleSave() {
      this.saveTyInfo = true;
      catalogSimpleSave({
        zdpcId: this.$route.query.zdpcid,
        isQk: this.$route.query.isQk,
        marctyid: this.$route.query.marctyid,
        ...this.jdbmForm
      })
        .then(res => {
          this.saveTyInfo = false;
          this.$message.success(res.message);
          if (this.$route.query.marctyid) {
            this.$eventBus.$emit("jdbm-update");
          } else {
            this.$eventBus.$emit("jdbm-initupdate");
          }
          this.closeCurrentTag();
        })
        .catch(() => {
          this.saveTyInfo = false;
        });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.catalogSimpleSave();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    setSimpleFormInputEvents() {
      this.$refs.jdbmForm.$el.addEventListener(
        "keydown",
        event => {
          // 37-← 38-↑  39-→ 40-↓ 13-Enter
          let keyCode = event.keyCode;

          // 如果不是ALT+上下左右方向键 或者 回车键 则不处理
          if (event.altKey) {
            if (keyCode < 37 || keyCode > 40) {
              return;
            }
          } else if (keyCode !== 13) {
            return;
          }
          let target = event.target || event.srcElement;
          if (
            target.nodeName.toLowerCase() !== "input" &&
            target.dataset.type !== "smarcInput"
          ) {
            return;
          }
          window.event.preventDefault();
          let targetIndex = +target.dataset.index;
          switch (keyCode) {
            case 37:
              targetIndex--;
              targetIndex = Math.max(targetIndex, 0);
              break;
            case 38:
              if (targetIndex >= 22) {
                targetIndex -= 1;
              } else {
                targetIndex -= 3;
              }
              if (targetIndex < 0) {
                targetIndex += 3;
              }
              break;
            case 39:
            case 13:
              targetIndex++;
              targetIndex = Math.min(targetIndex, 22);
              break;
            case 40:
              if (18 <= targetIndex && targetIndex <= 20) {
                targetIndex = 21;
              } else if (targetIndex === 21) {
                targetIndex = 22;
              } else {
                targetIndex += 3;
              }
              if (targetIndex > 22) {
                targetIndex -= 3;
              }
              break;
            default:
              break;
          }

          let container = document.querySelector(".jdbm__Form").children[0]
            .children[targetIndex];
          let targetDom =
            container.querySelector(".smarc__input input") ||
            container.querySelector(".smarc__input textarea");

          setTimeout(() => {
            targetDom.focus();
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    auditItem() {
      this.$confirm("确定将此记录修改为审校吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isAuditing = true;
          catalogueAudit({
            marcId: this.$route.query.marcid
          })
            .then(res => {
              this.$eventBus.$emit("jdbm-update");
              this.alreadyAudit = true;
              this.$message.success(res.message);
              this.catalogDto.auditUserName = res.data.auditUserName;
              this.catalogDto.auditTime = res.data.auditTime;
            })
            .finally(() => {
              this.isAuditing = false;
            });
        })
        .catch(() => {});
    },
    unauditItem() {
      this.$confirm("确定将此记录取消审校吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isAuditing = true;
          catalogueUnAudit({
            marcId: this.$route.query.marcid
          })
            .then(res => {
              this.$eventBus.$emit("jdbm-update");
              this.alreadyAudit = false;
              this.$message.success(res.message);
              this.catalogDto.auditUserName = this.catalogDto.auditTime = ""; // 隐藏
            })
            .finally(() => {
              this.isAuditing = false;
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    setTimeout(() => {
      if (this.$refs.focusInput) {
        this.setSimpleFormInputEvents();
        document
          .querySelector(".item__select input")
          .setAttribute("tabIndex", -1);
      }
    }, 500);
    this.getMarcTyInfo();
    this.$refs.focusInput && this.$refs.focusInput.select();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>

<style lang="less">
.jdsm {
  height: 100%;
  position: relative;
  .content {
    overflow: auto;
    height: calc(100% - 40px);
    .el-form {
      padding: 0 10px;
      .custom__form_wrapper {
        justify-content: space-between;
      }
      .el-form-item {
        display: flex;
        flex-basis: 30%;
        margin-bottom: 15px;
        &.item__line {
          flex-basis: 100%;
        }
        .el-form-item__content {
          width: 100%;
        }
        .el-input {
          width: 100%;
        }
      }
      .item__select {
        .el-form-item__content {
          display: flex;
        }
        .el-select {
          position: absolute;
          opacity: 0;
          left: 0;
          right: 0;
        }
      }
    }
  }
}
</style>
