<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: 你的名字
 * @LastEditTime: 2020-03-04 14:36:06
 -->
<template>
  <div class="fkgl common__content_">
    <div class="content__header_title">
      <span>罚款管理</span>
      <div class="tool">
        <el-button
          size="mini"
          type="primary"
          :disabled="selectRow.length ? false : true"
          @click="multDel"
        >
          <icon-svg icon-class="icon-btn-ico-1" />
          删除</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :disabled="tableData.length == 0"
          @click="print"
        >
          <icon-svg icon-class="icon-daochu" />
          导出</el-button
        >
      </div>
    </div>
    <div class="content">
      <div :class="more ? 'toolbar moreOption' : 'toolbar'">
        <div>
          <label>成员馆：</label>
          <el-select
            filterable
            size="mini"
            v-model="readerLib"
            placeholder="选择成员馆"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <label for="">收款状态：</label>
          <el-select
            filterable
            size="mini"
            class="skuan"
            v-model="cashType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in cashTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="supplier-selection">
            <el-select
              filterable
              size="mini"
              class="el-select-supplier"
              v-model="optionKey"
            >
              <el-option
                v-for="item in optionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              size="mini"
              clearable
              class="supplier-key"
              placeholder="请输入搜索关键词"
              v-model="content"
              ref="focusInput"
              @keyup.native="
                handleBarCodeScanner($event, val => (content = val), search)
              "
              @keyup.enter.native="delayFunc(search)"
            ></el-input>
          </div>
          <el-button size="mini" type="primary" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
          <p
            v-if="!more"
            @click="moreOption"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            更多条件
          </p>
          <p
            v-if="more"
            @click="moreOption"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            隐藏条件
          </p>
        </div>
        <div class="select-item">
          <label>借阅时间：</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="borrowStart"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="borrowEnd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
          <label>应还时间：</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="returnStart"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="returnEnd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
          <label>操作时间：</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="optimeStart"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd"
            v-model="optimeEnd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
        </div>
      </div>
      <div
        :class="more ? 'more-option' : ''"
        ref="multipleTableBox"
        class="multipleTableBox"
      >
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-dblclick="handleSkuan"
          @row-click="rowClick"
          @selection-change="selectFunc"
          border
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerName"
            label="读者姓名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerUnit"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ji"
            label="级"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ban"
            label="班"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借阅日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yhsj"
            label="应还日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="操作日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="wzlxing"
            label="处罚类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fajin"
            label="金额"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="isPay" label="收款状态">
            <template slot-scope="scope">
              <div v-if="scope.row.isPay == '已收款'" class="normal">
                <i></i>&nbsp;已收款
              </div>
              <div v-if="scope.row.isPay == '未收款'" class="logout">
                <i></i>&nbsp;未收款
              </div>
              <div v-if="scope.row.isPay == '免罚'" class="mfa">
                <i></i>&nbsp;免罚
              </div>
              <div v-if="scope.row.isPay == '已退款'" class="back">
                <i></i>&nbsp;已退款
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beizhu"
            label="备注"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="操作员"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.wzid"
                :ops="['skuan', 'tkuan', 'del']"
                @handleSkuan="handleSkuan(scope.row)"
                @handleTkuan="handleTkuan(scope.row.wzid)"
                @handleDel="handleDel(scope.row.wzid)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__pages">
      <td-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page.sync="param.pageNumber"
        :page-size="param.pageSize"
      ></td-pagination>
    </div>
    <!---收款wrap--->
    <side-wrap v-show="skWrap" width="850px">
      <template v-slot:header>
        <el-button
          class="close-side-wrap"
          @click="closeWrap"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">收款</p>
      </template>
      <div class="side-wrap-content">
        <p class="side-wrap-content-title">{{ skData.title }}</p>
        <div class="side-wrap-content-item">
          <label class="side-wrap-content-label">是否免罚</label>
          <el-radio-group v-model="skData.isAvoid">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
        </div>
        <div class="side-wrap-content-item">
          <label class="side-wrap-content-label">实罚金额</label>
          <el-input
            size="mini"
            clearable
            disabled
            v-only-num.float="skData.amount"
            v-model="skData.amount"
          ></el-input>
        </div>
        <div class="side-wrap-content-item">
          <label style="vertical-align: top;" class="side-wrap-content-label"
            >备注</label
          >
          <el-input
            size="mini"
            type="textarea"
            v-model="skData.remark"
          ></el-input>
        </div>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button size="mini" @click="closeWrap">取消</el-button>
          <el-button size="mini" @click="skuanFunc" type="primary"
            >确定</el-button
          >
        </div>
      </template>
    </side-wrap>
    <!---退款wrap--->
    <side-wrap v-show="tkWrap" width="850px">
      <template v-slot:header>
        <el-button
          size="mini"
          class="close-side-wrap"
          @click="closeWrap"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">退款</p>
      </template>
      <div class="side-wrap-content">
        <p class="side-wrap-content-title" style="padding: 10px 0"></p>
        <div class="side-wrap-content-item">
          <label style="vertical-align: top;" class="side-wrap-content-label"
            >退款原因</label
          >
          <el-input
            size="mini"
            type="textarea"
            v-model="tkData.remark"
          ></el-input>
        </div>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button size="mini" @click="closeWrap">取消</el-button>
          <el-button size="mini" @click="tkuanFunc" type="primary"
            >确定</el-button
          >
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { fineList, fineDelete, collectMoney, backMoney } from "api/circulation";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";

import { FKGL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_fkgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.optionList = FKGL_OPTIONS;

    this.cashTypeList = [
      { label: "全部", value: "" },
      { label: "未收款", value: 1 },
      { label: "已收款", value: 2 },
      { label: "免罚", value: 3 },
      { label: "已退款", value: 4 }
    ];
    return {
      more: false,
      elTableHeight: "",
      skWrap: false,
      tkWrap: false,
      borrowStart: "",
      borrowEnd: "",
      returnStart: "",
      returnEnd: "",
      optimeStart: "",
      optimeEnd: "",
      cashType: "",
      readerLib: this.$store.getters.userInfo.libId,
      content: "",
      optionKey: "isbn",
      tableData: [],
      selectRow: [],
      loading: false,
      skData: {
        amount: "",
        remark: "",
        isAvoid: 0,
        title: ""
      },
      tkData: {
        wzid: true,
        remark: ""
      },
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    moreOption() {
      this.more = !this.more;
      setTimeout(() => {
        this.elTableHeight = this.$refs.multipleTableBox.clientHeight + 1;
      }, 50);
    },
    /**获取罚款列表 */
    getFineList() {
      this.loading = !this.loading;
      fineList(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },
    /**打印 */
    print() {
      this.param.func_name_us = "fkgl";
      downLoadExcel("/api/e/flow/readerOther/fine/ExportExcel", this.param);
    },
    multDel() {
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let wzIds = "";
          this.selectRow.map(ele => {
            wzIds += ele.wzid + ",";
          });
          fineDelete({
            wzIds
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.pageNumber = 1;
              this.getFineList();
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "未选择操作项!"
        });
      }
    },
    search() {
      this.optionList.map(ele => {
        this.param[ele.value] = "";
      });
      this.param.borrowStart = this.borrowStart || "";
      this.param.borrowEnd = this.borrowEnd || "";
      this.param.returnStart = this.returnStart || "";
      this.param.returnEnd = this.returnEnd || "";
      this.param.optimeStart = this.optimeStart || "";
      this.param.optimeEnd = this.optimeEnd || "";
      this.param.pageNumber = 1;
      this.param.readerLib = this.readerLib;
      this.param.cashType = this.cashType;
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.getFineList();
    },

    closeWrap() {
      this.skWrap = false;
      this.tkWrap = false;
      this.tkData.remark = "";
    },
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSkuan(row) {
      this.skWrap = true;
      this.skData = {
        amount: row.fajin,
        remark: row.beizhu,
        isAvoid: 0,
        title: row.wzlxing + "收款",
        wzid: row.wzid
      };
    },
    skuanFunc() {
      collectMoney({
        ...this.skData
      }).then(res => {
        if (res.code == 0) {
          this.skWrap = false;
          this.param.pageNumber = 1;
          this.getFineList();
          this.closeWrap();
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    handleTkuan(wzid) {
      this.tkWrap = true;
      this.tkData.wzid = wzid;
    },
    tkuanFunc() {
      backMoney({
        ...this.tkData
      }).then(res => {
        if (res.code == 0) {
          this.param.pageNumber = 1;
          this.getFineList();
          this.closeWrap();
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },

    handleDel(wzid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let wzIds = wzid;
        fineDelete({
          wzIds
        }).then(res => {
          if (res.code == 0) {
            this.pageNumber = 1;
            this.getFineList();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getFineList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getFineList();
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>

<style lang="less">
.fkgl {
  .content__header_title {
    .contentTitle();
    position: relative;
    .tool {
      position: absolute;
      right: 20px;
      top: 0;
    }
  }
  .content {
    background-color: @contentBgColor;
    height: calc(100% - 91px);
    .toolbar {
      position: relative;
      padding: 0 !important;
      height: 32px;
      overflow: hidden;
      .select-item {
        .el-date-editor {
          width: 130px;
          margin-top: 3px;
        }
        .el-range-separator {
          line-height: 28px;
        }
      }
      label {
        display: inline-block;
        text-align: right;
        font-size: @FSize_15;
        position: relative;
        padding-left: 10px;
      }
      .el-select {
        width: 120px;
        &.skuan {
          width: 90px;
        }
      }
      .supplier-selection {
        display: inline-block;
        .el-select-supplier {
          width: 115px;
          margin: 0;
          .el-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
        .el-input.supplier-key {
          width: 225px;
          .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
      }
      &.moreOption {
        height: 64px;
        transition: height 0.6s;
        -webkit-transition: height 0.6s;
      }
    }
    .multipleTableBox {
      height: calc(100% - 56px);
      &.more-option {
        height: calc(100% - 64px) !important;
        transition: height 0.6s;
        -webkit-transition: height 0.6s;
      }
    }
    .el-table {
      &::before {
        background-color: transparent;
      }
      .cell {
        i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 8px;
        }
        .normal {
          i {
            background-color: @successColor;
          }
        }
        .logout {
          i {
            background-color: @dangerColor;
          }
        }
        .mfa {
          i {
            background-color: @grayColor;
          }
        }
        .back {
          i {
            background-color: @apologColor;
          }
        }
      }
      .el-button {
        padding: 0 20px;
        font-weight: bold;
        font-size: @FSize_16;
      }
      .el-table__empty-block {
        height: auto;
      }
    }
  }
  .side__wrapper {
    .el-tabs--border-card {
      border: none;
      .el-tabs__header {
        border: none;
        background-color: @topBgColor;
        .el-tabs__item {
          height: 50px;
          line-height: 50px;
        }
        .el-tabs__item.is-active {
          color: @primaryColor;
          font-size: @FSize_16;
          font-weight: bold;
          border: none;
        }
      }
    }
    .side-wrap-content {
      padding: 0 20px;
      box-sizing: border-box;
      .side-wrap-content-title {
        font-family: "MicrosoftYaHei-Bold";
        font-size: @FSize_16;
        color: @fontDarkerColor;
        font-weight: bold;
        line-height: 60px;
        margin: 0;
      }
      .side-wrap-content-item {
        padding-bottom: 20px;
        .side-wrap-content-label {
          display: inline-block;
          width: 80px;
          text-align: right;
          white-space: nowrap;
          text-align-last: justify;
          position: relative;
          margin-right: 12px;
          padding-right: 2px;
          text-indent: 0.5em;
          font-size: @FSize_14;
          color: @fontBaseColor;
          &:after {
            content: "：";
            position: absolute;
            right: -11px;
          }
        }
        .el-input {
          width: 230px;
          margin-right: 10px;
        }
        .el-textarea {
          width: 230px;
          height: 82px;
          .el-textarea__inner {
            height: 100%;
          }
        }
      }
    }
    .side-wrap-footer {
      padding: 10px 0;
      border-top: 1px solid @tableBorderColor;
      .el-button {
        float: right;
        padding: 8px 30px;
        margin-left: 10px;
      }
    }
  }
}
</style>
