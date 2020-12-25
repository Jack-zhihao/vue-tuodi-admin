<!--
 * @Description: 编目模块
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-08 09:35:29
 * @LastEditTime: 2020-03-10 20:19:57
 -->

<template>
  <div class="p-bm" tabindex="1" ref="bm" style="outline: none;">
    <div class="outer__header" v-if="!hideJDSM || !hideTMSMS">
      <span
        class="outer__header_item"
        :class="{ active: activeName === 'jdsm' }"
        @click="changeTab('jdsm')"
        v-if="!hideJDSM"
        >简单书目</span
      >
      <span
        class="outer__header_item"
        :class="{ active: activeName === 'tmsms' }"
        @click="changeTab('tmsms')"
        v-if="!hideTMSMS"
        >条目式模式</span
      >
      <span
        class="outer__header_item"
        :class="{ active: activeName === 'marcms' }"
        @click="changeTab('marcms')"
        >MARC模式</span
      >
    </div>
    <div class="outer__content" :class="{ full: hideJDSM && hideTMSMS }">
      <jdsm ref="jdsm" v-if="activeName === 'jdsm'"></jdsm>
      <tmsms ref="tmsms" v-if="activeName === 'tmsms'"></tmsms>
      <marcms ref="marcms" v-if="activeName === 'marcms'"></marcms>
    </div>
    <!-- 粘贴网页MARC -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="analysisVisible"
      title="粘贴网页MARC"
      @closed="$refs.bm.focus()"
    >
      <el-input
        v-model="analysisData"
        type="textarea"
        ref="analysisData"
        :rows="10"
        placeholder="请输入网页MARC数据"
      >
      </el-input>
      <p style="line-height: 1.5;">操作步骤：</p>
      <p style="line-height: 1.5;">
        1、<a href="javascript:void(0)" @click="getGTLink">点击打开连接</a>
        ，搜索书目数据
      </p>
      <p style="line-height: 1.5;">2、切换到 MARC 格式</p>
      <p style="line-height: 1.5;">3、CTRL + A 全选</p>
      <p style="line-height: 1.5;">4、CTRL + C 复制</p>
      <p style="line-height: 1.5;">
        5、切换回本页 CTRL + V 复制内容到上方输入框中
      </p>
      <p style="line-height: 1.5;">6、点击确定解析数据</p>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" type="primary" @click="handleAnalysis"
              >确定</el-button
            >
            <el-button size="mini" @click="handleAnalysisCancel"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
<script>
import jdsm from "./bmComponent/jdsm";
import marcms from "./bmComponent/marcms";
import tmsms from "./bmComponent/tmsms";

import { analysisCatalogueNlc } from "api/catalogue";

export default {
  name: "cat_bm",
  components: {
    jdsm,
    marcms,
    tmsms
  },
  watch: {
    $route(to) {
      if (to.name !== "cat_bm") {
        return;
      }
      if (this.marctyid !== to.query.marctyid) {
        this.marctyid = to.query.marctyid;
        this.resetData();
      }
    }
  },
  data() {
    return {
      activeName: localStorage.getItem("td-jdbmmode"),
      hideJDSM: false,
      hideTMSMS: false,
      hideMARCMS: false,
      // 解析
      analysisData: "",
      analysisVisible: false
    };
  },
  methods: {
    getGTLink() {
      window.open(
        `http://opac.nlc.cn/F/?func=find-b&find_code=ISB&request=${this.isbn ||
          ""}&local_base=NLC01&filter_code_1=WLN&filter_request_1=&filter_code_2=WYR&filter_request_2=&filter_code_3=WYR&filter_request_3=&filter_code_4=WFM&filter_request_4=&filter_code_5=WSL&filter_request_5=`,
        "_blank"
      );
    },
    handleAnalysis() {
      if (!this.analysisData) {
        this.$message.warning("请输入国图标准MARC数据");
        return;
      }
      analysisCatalogueNlc({
        nlc: this.analysisData,
        marcMode: 3
      }).then(res => {
        this.noNeedCheckChange = true;
        let itemList = res.data.map((item, index) => {
          item = {
            index: index,
            ...item
          };
          return item;
        });

        this.activeName = "marcms";
        this.$nextTick(() => {
          this.$refs.marcms.updateItemList(itemList);
          this.analysisVisible = false;
        });
      });
    },
    handleAnalysisCancel() {
      this.analysisVisible = false;
      this.$refs.bm.focus();
    },
    handleAnalysisVisible() {
      this.analysisVisible = true;
      this.analysisData = "";
      this.$nextTick(() => {
        this.$refs["analysisData"].select();
      });
    },
    keyEvent(event) {
      if (event.altKey && event.keyCode === 71) {
        // G 国图标准MARC
        window.event.preventDefault();
        this.handleAnalysisVisible();
      } else if (event.altKey && event.keyCode === 70) {
        // F 审校
        window.event.preventDefault();
        switch (this.activeName) {
          case "jdsm":
            this.$refs.jdsm.auditItem();
            break;
          case "tmsms":
            this.$refs.tmsms.auditItem();
            break;
          case "marcms":
            this.$refs.marcms.auditItem();
            break;
          default:
            break;
        }
      } else if (event.altKey && event.keyCode === 85) {
        // U 取消审校
        window.event.preventDefault();
        switch (this.activeName) {
          case "jdsm":
            this.$refs.jdsm.unauditItem();
            break;
          case "tmsms":
            this.$refs.tmsms.unauditItem();
            break;
          case "marcms":
            this.$refs.marcms.unauditItem();
            break;
          default:
            break;
        }
      } else if (event.altKey && event.keyCode === 84) {
        // T 套录
        window.event.preventDefault();
        switch (this.activeName) {
          case "jdsm":
            this.$refs.jdsm.checkMarcDownload();
            break;
          case "tmsms":
            this.$refs.tmsms.checkMarcDownload();
            break;
          case "marcms":
            this.$refs.marcms.checkMarcDownload();
            break;
          default:
            break;
        }
      } else if (event.altKey && event.keyCode === 83) {
        // S 保存
        window.event.preventDefault();
        switch (this.activeName) {
          case "jdsm":
            this.$refs.jdsm.submitForm("jdbmForm");
            break;
          case "tmsms":
            this.$refs.tmsms.saveItems();
            break;
          case "marcms":
            this.$refs.marcms.checkItems();
            break;
          default:
            break;
        }
      }
    },
    getDefaultTLData() {
      // 默认打开套录列表
      switch (this.activeName) {
        case "jdsm":
          this.$refs.jdsm.checkMarcDownload({
            key: this.$route.params.key,
            value: this.$route.params.value
          });
          break;
        case "tmsms":
          this.$refs.tmsms.checkMarcDownload({
            key: this.$route.params.key,
            value: this.$route.params.value
          });
          break;
        case "marcms":
          this.$refs.marcms.checkMarcDownload({
            key: this.$route.params.key,
            value: this.$route.params.value
          });
          break;
        default:
          break;
      }
    },
    async resetData() {
      switch (this.activeName) {
        case "jdsm":
          this.$refs.jdsm.getMarcTyInfo();
          break;
        case "tmsms":
          this.$refs.tmsms.getMarcTyInfo(true);
          break;
        case "marcms":
          await this.$refs.marcms.getMarcTyInfo(true);
          this.$refs.marcms.getSysMarcConfigMarcFbList();
          break;
        default:
          break;
      }
    },
    changeTab(tabName) {
      if (
        (this.activeName === "jdsm" && this.$refs.jdsm.isChangeFormData()) ||
        (this.activeName === "tmsms" && this.$refs.tmsms.isChangeTmList()) ||
        (this.activeName === "marcms" && this.$refs.marcms.isChangeItemList())
      ) {
        this.$confirm("切换将导致未保存的内容丢失，是否继续切换？", "提示", {
          confirmButtonText: "继续切换",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          localStorage.setItem("td-jdbmmode", tabName);
          this.activeName = tabName;
        });
      } else {
        localStorage.setItem("td-jdbmmode", tabName);
        this.activeName = tabName;
      }
    },
    setInitialTab() {
      if (this.$TDLib === "yun") {
        // 云选书域名下只有 marcms
        this.activeName = "marcms";
        this.hideJDSM = this.hideTMSMS = true;
      } else if (this.$route.query.isQk == 1) {
        // 期刊需要隐藏简单模式，所以每次激活的时候判断
        // 如果期刊 && 当前简单模式
        // 显示条目模式
        this.hideJDSM = true;
        this.hideTMSMS = this.hideMARCMS = false;
        if (this.activeName === "jdsm") {
          this.activeName = "tmsms";
        }
      } else {
        this.hideJDSM = this.hideTMSMS = this.hideMARCMS = false;
        this.activeName = localStorage.getItem("td-jdbmmode") || "jdsm";
      }
    }
  },
  created() {
    this.setInitialTab();
  },
  mounted() {
    this.$eventBus.$on("handleAnalysisVisible", () => {
      this.handleAnalysisVisible();
    });
    document
      .querySelector(".p-bm")
      .addEventListener("keydown", this.keyEvent, false);
    this.marctyid = this.$route.query.marctyid;
  },
  activated() {
    this.setInitialTab();
    if (this.$route.params.reset) {
      this.resetData();
      if (this.$route.params.key) {
        this.getDefaultTLData();
      }
    }
  },
  destroyed() {
    this.$eventBus.$off("handleAnalysisVisible");
  }
};
</script>

<style lang="less">
.isnb__popover {
  box-sizing: border-box;
  max-height: 600px;
  overflow: auto;
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid #c8d3df;
  }
  tr {
    line-height: 23px;
    color: #333;
    font-size: 14px;
  }
}
.p-bm {
  box-sizing: border-box;
  .outer__header {
    height: 40px;
    background: #f1f2f3;
    font-size: 0;
    .outer__header_item {
      display: inline-block;
      padding: 0 20px;
      line-height: 40px;
      font-size: 0.15rem;
      color: #515355;
      cursor: pointer;
      &.active {
        color: #378de6;
        font-weight: bold;
        background: #fff;
      }
    }
  }
  .outer__content {
    height: ~"calc(100% - 40px)";
    &.full {
      height: 100%;
    }
  }
  .content-tabs {
    height: 100%;
    .el-tabs--border-card {
      height: 100%;
      border: 1px solid #ececec;
      box-shadow: 0px 1px 1px #ddd;
      -webkit-box-shadow: 0px 1px 1px #ddd;
      border-top: none;
      border-left: none;
      .el-tabs__header {
        background-color: @topBgColor;
        border-bottom: 1px solid @topBgColor;
        .el-tabs__item {
          height: 40px;
          line-height: 40px;
          color: @fontBaseColor;
          font-size: @FSize_15;
          &.is-active {
            border-left-color: @topBgColor;
            border-right-color: @topBgColor;
            color: @primaryColor;
            font-weight: 600;
          }
        }
      }
      .el-tabs__content {
        height: calc(100% - 40px);
        padding: 0;
        .el-tab-pane {
          height: 100%;
        }
      }
    }
  }
  .taolu__layer {
    position: absolute;
    font-size: 14px;
    width: 230px;
    right: 20px;
    top: 0;
    padding: 0 0 10px;
    height: 50vh;
    z-index: 3;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .svg-icon {
      position: absolute;
      top: 7px;
      right: 7px;
      cursor: pointer;
      color: #de5151;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .shortItem__tip {
      line-height: 1;
      color: @fontTintColor;
      padding: 10px 9px;
      span {
        color: red;
      }
    }
    .shortItem {
      color: @fontBaseColor;
      line-height: 1;
      cursor: pointer;
      padding: 10px;
      &:hover {
        background: @hoverBgColor;
        color: @primaryColor;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
  .header {
    padding: 5px 15px;
    .header__line {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .label {
      white-space: nowrap;
    }
    .header__filter {
      display: flex;
      align-items: center;
    }
    .el-select {
      width: 140px;
    }
  }
  .body {
    height: ~"calc(100% - 40px - 38px)";
    overflow: hidden;
    tbody {
      td {
        background: #fff !important;
      }
    }
    td,
    .cell {
      padding: 0 !important;
      &.disabled {
        background: #f2f2f2 !important;
      }
    }
    textarea,
    input {
      border-radius: 0;
      border-color: transparent;
      font-size: 14px;
      color: #333;
      &:focus {
        border-color: #378de6;
      }
    }
  }
  .footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    text-align: right;
    padding: 0 10px;
    box-sizing: border-box;
    border-top: 1px solid @borderColor;
    position: relative;
    .data__detail {
      display: flex;
      font-size: 0.12rem;
      text-align: left;
      > div {
        padding-right: 2px;
        margin-right: 2px;
        &:last-child {
          margin-right: 0;
          padding-right: 0;
          border-right: none;
        }
        p {
          white-space: nowrap;
        }
      }
      .name {
        color: red;
      }
    }
  }
}
@media screen and (max-width: 1200px) {
  .p-bm {
    .footer {
      .data__detail {
        > div {
          p {
            max-width: 140px;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }
      }
    }
  }
}
</style>
