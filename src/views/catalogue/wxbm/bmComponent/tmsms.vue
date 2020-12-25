<!--
 * @Description: 条目编目
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-14 09:09:26
 * @LastEditTime: 2020-03-10 17:13:40
 -->

<template>
  <div class="c-tmms" ref="tmmsWrapper">
    <div v-show="showMarcDownloadList" class="taolu__layer">
      <el-scrollbar v-loading="downloadTransing">
        <icon-svg
          icon-class="icon-btn-ico-21"
          @click.native="
            showMarcDownloadList = false;
            $refs.tmmsWrapper.focus();
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
    <div class="header">
      <div class="header__line">
        <div class="header__filter">
          <span class="label">MARC类型：</span>
          <el-select
            filterable
            size="mini"
            v-model="marctype"
            placeholder="请选择"
            @change="getMarcTyInfo(false)"
          >
            <el-option
              v-for="item in marcConfigMarcList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </div>
    <div class="body" ref="contentTable">
      <el-table
        v-loading="loadTableData"
        border
        ref="itemTable"
        :data="tmList"
        style="width: 100%"
        v-if="showItemTable"
        height="100%"
        :cell-class-name="cellClassName"
      >
        <el-table-column
          width="170"
          label="字段名称"
          align="center"
          prop="name"
        >
        </el-table-column>
        <el-table-column width="90" label="字段标识" align="center" prop="item">
        </el-table-column>
        <el-table-column prop="roleCode" label="字段内容" align="center">
          <template slot-scope="scope">
            <el-input
              v-if="
                scope.row.field !== 'isbn' &&
                  scope.row.field !== 'issn' &&
                  scope.row.field !== 'ztming'
              "
              data-type="tmInput"
              :data-index="scope.$index"
              size="mini"
              v-model="scope.row.content"
            ></el-input>
            <el-input
              v-else
              data-type="tmInput"
              :data-index="scope.$index"
              @keydown.alt.84.native.exact.stop="
                marcDownload($event, scope.row)
              "
              size="mini"
              v-model="scope.row.content"
            ></el-input>
          </template>
        </el-table-column>
      </el-table>
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
          title="输入完010 a(ISBN)或011 a(ISSN)或200 a(正题名)字段后，可按 Alt + T 进行套录"
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
          :loading="savingItems"
          size="mini"
          title="ALT + S"
          type="primary"
          @click="saveItems"
          >保存(S)</el-button
        >
        <el-button size="mini" @click="closeCurrentTag">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { MARC_CN } from "utils/variables";

import { getMarcType } from "api/public";

import { myBrowser } from "utils/utils";

import {
  itemsGetMarcTyinfo,
  catItemsSave,
  catMarcDownload,
  catMarcDownloadFieldList,
  catalogueAudit,
  catalogueUnAudit
} from "api/catalogue";

export default {
  async created() {
    if (this.$route.query.marctyid) {
      await this.getDefaultFilter();
    }
    this.getSysMarcConfigMarcList();
    this.showItemTable = true;
    if (!this.alreadySetTMSEvent) {
      this.$nextTick(() => {
        this.setTMSEvents();
      });
      this.alreadySetTMSEvent = true;
    }
  },
  data() {
    this.myBrowser = myBrowser;
    return {
      alreadyAudit: false,
      isAuditing: false,
      marctype: "",
      loadTableData: false,
      tmList: [],
      showItemTable: false,
      marcConfigMarcList: [],
      savingItems: false,
      showMarcDownloadList: false,
      downLoadType: "",
      marcDownList: [],
      downloadTransing: false,
      // 审校信息
      catalogDto: {}
    };
  },
  methods: {
    getDefaultFilter() {
      return new Promise((resolve, reject) => {
        itemsGetMarcTyinfo({
          marctyid: this.$route.query.marctyid
        })
          .then(res => {
            this.defaultMarcType = res.data.marclxid;
            resolve();
          })
          .catch(() => {
            this.defaultMarcType = "";
            reject();
          });
      });
    },
    cellClassName({ columnIndex }) {
      if (columnIndex < 2) {
        return "disabled";
      }
    },
    setMarcTypeDefault() {
      let matchItem = this.marcConfigMarcList.filter(
        item => item.value === item.defaultMarcType
      );
      if (matchItem[0]) {
        this.marctype = this.defaultMarcType;
      } else {
        this.marctype = this.marcConfigMarcList[0]
          ? this.marcConfigMarcList[0].value
          : "";
      }
    },
    getSysMarcConfigMarcList() {
      getMarcType().then(res => {
        this.marcConfigMarcList = res.data
          ? res.data.map(item => {
              return {
                label: item.leixing,
                value: item.marclxid
              };
            })
          : [];
        this.setMarcTypeDefault();
        this.getMarcTyInfo(true);
      });
    },
    isChangeTmList() {
      return this.defaultTmList !== JSON.stringify(this.tmList);
    },
    async getMarcTyInfo(isInitData) {
      if (isInitData) {
        if (this.$route.query.marctyid) {
          await this.getDefaultFilter();
        }
        this.setMarcTypeDefault();
      }
      if (!this.marctype) {
        this.defaultTmList = JSON.stringify([]);
        return;
      }
      itemsGetMarcTyinfo({
        marclxid: this.marctype,
        marctyid: this.$route.query.marctyid
      }).then(res => {
        this.alreadyAudit = res.data.ztai === "已审核";
        this.catalogDto = res.data.catalogDto;
        this.tmList = res.data.fieldList.map(item => {
          return {
            name: MARC_CN[item.field] ? MARC_CN[item.field] : item.field,
            ...item
          };
        });
        this.defaultTmList = JSON.stringify(this.tmList);
        this.setTMSFocus();
      });
    },
    checkMarcDownload(defatulData) {
      let isbn = "",
        issn = "",
        ztming = "";
      this.tmList.forEach(item => {
        if (item.field === "isbn") {
          isbn = item.content;
        }
        if (item.field === "issn") {
          issn = item.content;
        }
        if (item.field === "ztming") {
          ztming = item.content;
        }
      });
      if (isbn === "" && issn === "" && ztming === "" && !defatulData) {
        this.$message.error("请输入 ISBN 或 ISSN 或 正题名 字段");
        return;
      }
      let requestObj = {};
      if (isbn !== "") {
        requestObj.isbn = isbn;
      } else if (issn !== "") {
        requestObj.issn = issn;
      } else if (ztming !== "") {
        requestObj.ztming = ztming;
      } else if (defatulData.key) {
        requestObj[defatulData.key] = defatulData.value;
      }
      this.loadTableData = true;
      if (requestObj.isbn) {
        this.downLoadType = "ISBN";
      } else if (requestObj.issn) {
        this.downLoadType = "ISSN";
      } else if (requestObj.ztming) {
        this.downLoadType = "正题名";
      }
      this.downloadTransing = true;
      catMarcDownload(requestObj)
        .then(res => {
          this.$nextTick(() => {
            this.showMarcDownloadList = true;
          });
          this.marcDownList = res.data;
        })
        .finally(() => {
          this.downloadTransing = false;
          this.loadTableData = false;
        });
    },
    marcDownload(event, data) {
      let field = data.field;
      if (field === "isbn" || field === "issn" || field === "ztming") {
        let requestObj = {};
        switch (field) {
          case "isbn":
            requestObj.isbn = data.content;
            break;
          case "issn":
            requestObj.issn = data.content;
            break;
          case "ztming":
            requestObj.ztming = data.content;
            break;
          default:
            break;
        }
        this.loadTableData = true;
        if (requestObj.isbn) {
          this.downLoadType = "ISBN";
        } else if (requestObj.issn) {
          this.downLoadType = "ISSN";
        } else if (requestObj.ztming) {
          this.downLoadType = "正题名";
        }
        this.downloadTransing = true;
        catMarcDownload(requestObj)
          .then(res => {
            this.$nextTick(() => {
              this.showMarcDownloadList = true;
            });
            this.marcDownList = res.data;
          })
          .finally(() => {
            this.loadTableData = false;
            this.downloadTransing = false;
          });
      }
    },
    marcDownloadTrans(item) {
      this.downloadTransing = true;
      catMarcDownloadFieldList({
        marcnr: item.marcnr,
        mode: 2,
        marclxid: this.marctype
      })
        .then(res => {
          this.tmList = res.data.map(data => {
            return {
              name: MARC_CN[data.field] ? MARC_CN[data.field] : data.field,
              ...data
            };
          });
        })
        .finally(() => {
          this.downloadTransing = false;
          // this.showMarcDownloadList = false;
          this.$refs.tmmsWrapper.focus();
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
    saveItems() {
      this.savingItems = true;
      let requestObj = {
        marctyid: this.$route.query.marctyid,
        marclxid: this.marctype,
        zdpcId: this.$route.query.zdpcid,
        isQk: this.$route.query.isQk
      };
      this.tmList.forEach(item => {
        if (item.content !== null) {
          requestObj[item.field] = item.content;
        }
      });
      catItemsSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          if (this.$route.query.marctyid) {
            this.$eventBus.$emit("jdbm-update");
          } else {
            this.$eventBus.$emit("jdbm-initupdate");
          }
          this.closeCurrentTag();
        })
        .finally(() => {
          this.savingItems = false;
        });
    },
    // 键盘事件
    setTMSEvents() {
      this.$refs.itemTable.$el.addEventListener(
        "keydown",
        event => {
          // 38-↑ 40-↓ 13-Enter
          let keyCode = event.keyCode;
          // 如果不是ALT + 上下方向键或者回车键则不处理
          if (event.altKey) {
            if (keyCode !== 38 && keyCode !== 40) {
              return;
            }
          } else if (keyCode !== 13) {
            return;
          }

          let target = event.target || event.srcElement;
          if (
            target.nodeName.toLowerCase() !== "input" &&
            target.dataset.type !== "tmInput"
          ) {
            return;
          }

          window.event.preventDefault();
          let targetIndex = +target.dataset.index;
          let maxItem = this.tmList.length;
          switch (keyCode) {
            case 38:
              targetIndex--;
              targetIndex = Math.max(targetIndex, 0);
              break;
            case 13:
            case 40:
              targetIndex++;
              targetIndex = Math.min(targetIndex, maxItem - 1);
              break;
            default:
              break;
          }

          let container = this.$refs.itemTable.$el.querySelector("tbody")
            .children[targetIndex];
          let targetDom = container.querySelector("input");
          setTimeout(() => {
            targetDom.focus();
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    setTMSFocus() {
      this.$nextTick(() => {
        let firstInputOuter = this.$refs.itemTable.$el.querySelector("tbody")
          .children;

        if (firstInputOuter[0]) {
          let firstInput = firstInputOuter[0].querySelector("input");
          firstInput.select();
          firstInput.scrollIntoView();
        }
      });
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
  }
};
</script>

<style lang="less">
.c-tmms {
  position: relative;
  height: 100%;
}
</style>
