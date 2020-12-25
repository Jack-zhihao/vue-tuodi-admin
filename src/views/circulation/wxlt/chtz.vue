<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-05-17 14:56:27
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-24 10:47:22
 -->

<template>
  <div class="cir-chtz common__content">
    <td-content-header>
      催还通知
      <template v-slot:btns>
        <div class="header__ops">
          <el-dropdown @command="download">
            <el-button size="mini" type="primary" class="daochustyle">
              <icon-svg icon-class="icon-daochu" />导出
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="downloadFile">
                列表数据</el-dropdown-item
              >
              <el-dropdown-item command="downloadDocx"
                >催还条格式</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          <el-button
            size="mini"
            type="primary"
            :loading="isSending"
            @click="sendEmail"
            :disabled="multipleSelection.length === 0"
            ><icon-svg icon-class="icon-btn-ico-" /> 发送邮件</el-button
          >
          <el-button
            :loading="isSending"
            size="mini"
            type="primary"
            @click="sendAllEmail"
            ><icon-svg icon-class="icon-btn-ico-" /> 发送全部</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-select
            filterable
            size="mini"
            v-model="currentChtzInfoFilterKey"
            placeholder="请选择"
            class="group__filter_type"
          >
            <el-option
              v-for="item in chtzInfoFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            class="group__filter_value"
            clearable
            ref="focusInput"
            v-model="chtzInfoSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initChtzInfoList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initChtzInfoList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
          <el-checkbox style="margin-left: 12px;" v-model="isChecked"
            >去除Email信息不完整记录</el-checkbox
          >
        </div>
        <div class="header__line">
          <span>读者类型：</span>
          <el-select
            filterable
            size="mini"
            clearable
            v-model="readerType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span>超期天数：</span
          ><el-input
            size="mini"
            clearable
            v-model="delayDay"
            @blur="checkDelayDay"
          ></el-input>
          <span>读者证号：</span>
          <el-input clearable v-model="readerCodeStart" size="mini"></el-input>
          <span>至&nbsp;&nbsp;&nbsp;</span>
          <el-input clearable v-model="readerCodeEnd" size="mini"></el-input>
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-click="clickRow"
          v-loading="loadChtzInfoData"
          @selection-change="handleChtzInfoSelectionChange"
          border
          :data="chtzInfoList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="所在馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="email" label="Email">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcmshu" label="卷册描述">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jge" label="单价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcsj" label="借出日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yhsj" label="应还日期">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleChtzInfoSizeChange"
          @current-change="handleChtzInfoCurrentChange"
          :total="totalChtzInfoCount"
          :currentPage="currentChtzInfoPage"
          :pageSize="chtzInfoPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 发送结果 -->
    <el-dialog
      custom-class="chtz__dialog"
      title="邮件发送详情"
      :visible.sync="showReceiveDialog"
    >
      <el-scrollbar>
        <div class="wrapper">
          <div class="tit">{{ failText }}</div>
          <p class="tit">失败的邮件详情如下</p>
          <el-table :data="failData" border style="width: 100%">
            <el-table-column prop="dzzhao" label="读者证"> </el-table-column>
            <el-table-column prop="xming" label="读者姓名"> </el-table-column>
            <el-table-column prop="reason" label="失败原因"> </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { readerType } from "api/public";

import {
  rushRetSearch,
  rushRetExport,
  aloneMail,
  allMail,
  docxExport
} from "api/circulation";

import { downLoadExcel } from "utils/utils";

export default {
  name: "cir_chtz",
  data() {
    this.chtzInfoFilterOptions = [
      {
        label: "读者单位",
        value: "2"
      },
      {
        label: "读者姓名",
        value: "1"
      }
    ];
    return {
      // 搜索
      delayDay: "",
      readerCodeStart: "",
      readerCodeEnd: "",
      isChecked: false,
      readerType: "",
      currentChtzInfoFilterKey: "2",
      chtzInfoSearchKey: "",
      readerTypeOptions: [],
      // 列表
      loadChtzInfoData: false,
      chtzInfoList: [],
      multipleSelection: [],
      totalChtzInfoCount: 0,
      currentChtzInfoPage: 1,
      chtzInfoPageSize: 15,
      // 浮层
      showReceiveDialog: false,
      failData: [],
      failText: "",
      isSending: false
    };
  },
  methods: {
    getReaderType() {
      readerType({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.readerTypeOptions = res.data.map(item => {
          return {
            label: item.mcheng,
            value: item.dzlxid
          };
        });
      });
    },
    // 搜索
    initChtzInfoList() {
      this.currentChtzInfoPage = 1;
      this.setRequestObj();
      this.getChtzInfoList();
    },
    setRequestObj() {
      this.requestObj = {
        dayNum: this.delayDay,
        flag: this.currentChtzInfoFilterKey,
        content: this.chtzInfoSearchKey,
        dzlxid: this.readerType,
        startDzhe: this.readerCodeStart,
        endDzhe: this.readerCodeEnd,
        haveEmail: this.isChecked
      };
    },
    getChtzInfoList() {
      this.loadChtzInfoData = true;
      let requestObj = {
        pageNumber: this.currentChtzInfoPage,
        pageSize: this.chtzInfoPageSize,
        ...this.requestObj
      };
      rushRetSearch(requestObj)
        .then(res => {
          this.loadChtzInfoData = false;
          this.chtzInfoList = res.data.dataList;
          this.totalChtzInfoCount = +res.data.totalElements;
        })
        .catch(() => {
          this.loadChtzInfoData = false;
        });
    },
    checkDelayDay() {
      if (!/^[0-9]+$/.test(this.delayDay)) {
        this.delayDay = "";
      }
    },
    // 列表
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleChtzInfoSelectionChange(val) {
      this.multipleSelection = val.map(item => item.dqjyid);
    },
    handleChtzInfoSizeChange(val) {
      this.chtzInfoPageSize = val;
      this.getChtzInfoList();
    },
    handleChtzInfoCurrentChange(val) {
      this.currentChtzInfoPage = val;
      this.getChtzInfoList();
    },
    download(command) {
      if (command == "downloadFile") {
        downLoadExcel(rushRetExport(), this.requestObj);
      } else {
        docxExport(this.requestObj).then(res => {
          let data = res.data;
          downLoadExcel(data);
        });
      }
    },
    sendEmail() {
      this.isSending = true;
      aloneMail({
        dqjyids: this.multipleSelection.join(",")
      })
        .then(res => {
          if (res.data.fail) {
            this.showReceiveDialog = true;
            this.failData = res.data.fail;
            this.failText = res.data.warning;
          } else {
            this.$message.success(res.data.warning);
          }
        })
        .finally(() => {
          this.isSending = false;
        });
    },
    sendAllEmail() {
      this.$confirm("确定向检索结果中的全部用户发送邮件么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.isSending = true;
          allMail({
            pageNumber: this.currentChtzInfoPage,
            pageSize: this.chtzInfoPageSize,
            ...this.requestObj
          })
            .then(res => {
              if (res.data.fail) {
                this.showReceiveDialog = true;
                this.failData = res.data.fail;
                this.failText = res.data.warning;
              } else {
                this.$message.success(res.data.warning);
              }
            })
            .finally(() => {
              this.isSending = false;
            });
        })
        .catch(() => {});
    }
  },
  mounted() {
    this.getReaderType();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

// .cir-chtz {
//   .header__filters {
//     flex-wrap: wrap;
//     .header__filters_line {
//       display: flex;
//       width: 100%;
//       align-items: center;
//       span {
//         white-space: nowrap;
//       }
//     }
//   }
//   .content__table {
//     height: ~"calc(100% - 64px - 32px)";
//   }
// /deep/
.chtz__dialog {
  width: 830px;
  .el-dialog__body {
    padding: 0;
  }
  .wrapper {
    padding: 20px 20px 10px;
  }
  .tit {
    font-weight: bold;
    font-size: @FSize_14;
    color: @fontBaseColor;
    margin-bottom: 10px;
  }
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
// }

.daochustyle {
  margin: 0 10px;
}
</style>
