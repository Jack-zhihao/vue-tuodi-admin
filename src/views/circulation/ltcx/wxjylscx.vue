<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:08
 -->
<template>
  <div class="cir_wxjylscx common__content">
    <!--读者借阅查询-->
    <td-content-header>
      <span>文献借阅历史查询</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="BorrowList.length == 0"
            @click="wxjylscxPrint"
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
        <div class="header__line">
          <p class="desc">成员馆：</p>
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
          border=""
          :data="BorrowList"
          stripe
          style="width: 100%"
          height="100%"
        >
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
            prop="tiaoma"
            width="161"
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
            prop="taojia"
            label="套价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借出日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ghsj"
            label="还书日期"
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
import { wxjylscx } from "api/circulation";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";

import { WXDQJYCX_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_wxjylscx",
  data() {
    this.filterOptions = WXDQJYCX_OPTIONS;
    return {
      // 列表相关
      filterSearchKey: "",
      currentFilterKey: "isbn",
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      czid: "",
      userCzList: [],
      loadBorrowData: false,
      BorrowList: [],
      BorrowPageSize: 15,
      currentBorrowPage: 1,
      totalBorrowCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    initBorrowList() {
      this.currentBorrowPage = 1;
      this.getBorrowList();
    },

    initParamList() {
      this.getUserCzList();
    },
    getBorrowList() {
      this.loadBorrowData = true;
      this.requestObj = {
        libid: this.libid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        pageNumber: this.currentBorrowPage,
        pageSize: this.BorrowPageSize,
        czid: this.czid
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /^\s+|\s+$/g,
        ""
      );
      wxjylscx(this.requestObj)
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
    wxjylscxPrint() {
      this.requestObj.func_name_us = "wxjylscx";
      downLoadExcel("/api/e/flow/ltcx/wxjylscxExportExcel", this.requestObj);
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
// .cir_wxjylscx {
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
