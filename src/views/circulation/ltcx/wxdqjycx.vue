<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-08-14 11:53:22
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:00
 -->
<template>
  <div class="cir_wxdqjycx common__content">
    <td-content-header>
      <span>文献当前借阅查询</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="BorrowList.length == 0"
            @click="wxjycxPrint"
          >
            <icon-svg icon-class="icon-daochu" />
            导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line ">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            @change="initParamList"
            v-model="libid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">馆藏地点：</p>
          <el-select filterable size="mini" v-model="czid" placeholder="请选择">
            <el-option
              v-for="item in userCzList"
              :key="item.czid"
              :label="item.mingcheng"
              :value="item.czid"
            ></el-option>
          </el-select>
          <p class="label">借阅时间：</p>
          <el-date-picker
            style="margin-right: 7px;"
            class="filter__date"
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            class="filter__date"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
        </div>
        <div class="header__line">
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (filterSearchKey = val),
                initBorrowList
              )
            "
            @keydown.enter.native="delayFunc(initBorrowList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initBorrowList">
            <icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadBorrowData"
          @selection-change="handleBorrowSelectionChange"
          @row-click="clickRow"
          ref="wxjycxTable"
          border=""
          :data="BorrowList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xming"
            label="读者姓名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzdw"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            v-if="libMode === '学校馆'"
            show-overflow-tooltip
            prop="ji"
            label="级"
          ></el-table-column>
          <el-table-column
            v-if="libMode === '学校馆'"
            show-overflow-tooltip
            prop="ban"
            label="班"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            width="161"
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
            prop="libName"
            label="现在馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="现藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cejia"
            label="价格"
            width="87"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借出日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yhsj"
            label="应还日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xjcshu"
            label="续借"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleBorrowSizeChange"
          @current-change="handleBorrowCurrentChange"
          :total="totalBorrowCount"
          :currentPage="currentBorrowPage"
          :pageSize="BorrowPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { wxjycx } from "api/circulation";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";

import { WXDQJYCX_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_wxdqjycx",
  data() {
    this.filterOptions = WXDQJYCX_OPTIONS;
    return {
      // 列表相关
      libMode: "公共馆",
      filterSearchKey: "",
      currentFilterKey: "isbn",
      libid: this.$store.getters.userInfo.libId,
      czid: "",
      date1: "",
      date2: "",
      userCzList: [],
      multipleBorrowSelection: [],
      loadBorrowData: false,
      BorrowList: [],
      BorrowPageSize: 15,
      currentBorrowPage: 1,
      totalBorrowCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libList", "libTypeObj"])
  },
  methods: {
    initBorrowList() {
      // 判断当前搜索是公共馆/学校馆
      this.libMode = this.libTypeObj[this.libid] || "公共馆";
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.currentBorrowPage = 1;
      this.getBorrowList();
    },

    initParamList() {
      this.getUserCzList();
    },

    handleBorrowSelectionChange(val) {
      this.multipleBorrowSelection = val.map(item => item.Borrowid);
    },
    // 点击当前行
    clickRow(row) {
      this.$refs.wxjycxTable.toggleRowSelection(row);
    },

    getBorrowList() {
      this.loadBorrowData = true;
      this.requestObj = {
        date1: this.date1 || "",
        date2: this.date2 || "",
        libid: this.libid,
        pageNumber: this.currentBorrowPage,
        pageSize: this.BorrowPageSize,
        czid: this.czid
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /^\s+|\s+$/g,
        ""
      );
      wxjycx(this.requestObj)
        .then(res => {
          this.loadBorrowData = false;
          this.BorrowList = res.data.dataList;
          this.totalBorrowCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadBorrowData = false));
    },
    handleBorrowSizeChange(val) {
      this.BorrowPageSize = val;
      this.getBorrowList();
    },
    handleBorrowCurrentChange(val) {
      this.currentBorrowPage = val;
      this.getBorrowList();
    },
    wxjycxPrint() {
      this.requestObj.func_name_us = "wxjycx";
      downLoadExcel("/api/e/flow/ltcx/wxjycxExportExcel", this.requestObj);
    },
    getUserCzList() {
      this.czid = "";
      userCzList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mingcheng: "全部",
          czid: ""
        });
        this.userCzList = [...res.data];
      });
    }
  },
  mounted() {
    this.initParamList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
// .cir_wxdqjycx {
//   .content__table {
//     height: calc(100% - 64px - 32px) !important;
//   }
//   .content__header {
//     flex-direction: column;
//     align-items: flex-start !important;
//     .header__filters:nth-child(2) {
//       margin-top: 3px;
//     }
//   }
// }
</style>
