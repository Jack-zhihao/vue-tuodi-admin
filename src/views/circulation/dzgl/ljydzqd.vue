<!--
 * @Description: 读者借阅情况
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-12 09:09:30
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-06 17:27:01
 -->
<template>
  <div class="common__content">
    <td-content-header>
      读者借阅情况
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :loading="fetchingData"
            @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <div class="filters__line">
            <p class="desc">成员馆：</p>
            <el-select
              filterable
              size="mini"
              v-model="selectLibId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="currentFilterKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in filterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              size="mini"
              clearable
              class="group__filters_value"
              v-model="searchKey"
              placeholder="请输入搜索关键词"
              ref="focusInput"
              @keydown.enter.native="initList"
            ></el-input>
            <span>借阅时间：</span>
            <el-date-picker
              v-model="brw_date1"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="起始日期"
            >
            </el-date-picker>
            <span>至&nbsp;&nbsp;</span>
            <el-date-picker
              v-model="brw_date2"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
            >
            </el-date-picker>
            <el-button type="primary" size="mini" @click="initList"
              ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
            >
          </div>
          <div class="filters__line" style="margin-top: 3px;">
            <span class="label">借阅册数：</span>
            <el-input
              placeholder="请输入借阅册数"
              v-model="jycs"
              size="mini"
              clearable
            >
            </el-input>
            <el-radio style="margin-right:0px;" v-model="pipei" label="1"
              >小于等于</el-radio
            >
            <el-radio style="margin:0 20px;" v-model="pipei" label="3"
              >大于等于</el-radio
            >
            <el-radio v-model="pipei" label="2">等于</el-radio>
            <p class="desc">状态：</p>
            <el-select
              filterable
              size="mini"
              v-model="ztai"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ztaiOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span>办证时间：</span>
            <el-date-picker
              v-model="dateStart"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="起始日期"
            >
            </el-date-picker>
            <span>至&nbsp;&nbsp;</span>
            <el-date-picker
              v-model="dateEnd"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="结束日期"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="content__table" ref="zdmlTable">
        <el-table
          v-loading="loadListData"
          ref="table"
          border
          :data="dataList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column prop="dzzhao" show-overflow-tooltip label="读者证号">
          </el-table-column>
          <el-table-column prop="xming" show-overflow-tooltip label="读者姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sex" label="性别">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzdw" label="读者单位">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bzrqi" label="办证时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="借阅册数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="currentPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  zeroBorrowDetails,
  zeroBorrowDetailsExportExcel
} from "api/circulation";

import { downLoadExcel } from "utils/utils";

export default {
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.ztaiOptions = [
      {
        label: "全部",
        value: ""
      },
      {
        label: "正常",
        value: "正常"
      },
      {
        label: "注销",
        value: "注销"
      },
      {
        label: "挂失",
        value: "挂失"
      },
      {
        label: "暂停",
        value: "暂停"
      },
      {
        label: "退证",
        value: "退证"
      },
      {
        label: "过期",
        value: "过期"
      }
    ];
    this.filterOptions = [
      {
        label: "读者证号",
        value: "dzzhao"
      },
      {
        label: "读者姓名",
        value: "xming"
      },
      {
        label: "读者类型",
        value: "dzlx"
      },
      {
        label: "读者单位",
        value: "dzdw"
      }
    ];
    return {
      currentFilterKey: "dzzhao",
      searchKey: "",
      brw_date1: "",
      brw_date2: "",
      jycs: "",
      pipei: "1",
      selectLibId: this.$store.getters.userInfo.libId,
      dateStart: "",
      dateEnd: "",
      currentPageSize: 15,
      currentPage: 1,
      totalCount: 0,
      dataList: [],
      gcLocOptions: [],
      ztai: "",
      loadListData: false,
      fetchingData: false
    };
  },
  methods: {
    // 目录列表
    initList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getList();
    },
    setRequestObj() {
      this.requestObj = {
        ztai: this.ztai,
        libid: this.selectLibId,
        date1: this.dateStart,
        date2: this.dateEnd,
        jycs: this.jycs,
        pipei: this.jycs ? this.pipei : "",
        brw_date1: this.brw_date1,
        brw_date2: this.brw_date2
      };
      this.requestObj[this.currentFilterKey] = this.searchKey;
    },
    getList() {
      this.loadListData = true;

      let requestObj = {
        pageNumber: this.currentPage,
        pageSize: this.currentPageSize,
        ...this.requestObj
      };

      zeroBorrowDetails(requestObj)
        .then(res => {
          this.loadListData = false;
          this.dataList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadListData = false;
        });
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getList();
    },
    handlePageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    downLoadData() {
      downLoadExcel(zeroBorrowDetailsExportExcel(), {
        ...this.requestObj,
        func_name_us: "reader_borrowDetails"
      });
    }
  },
  initList() {
    this.getList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.header__filters {
  flex-wrap: wrap;
  .filters__line {
    display: flex;
    align-items: center;
    flex-basis: 100%;
    flex-shrink: 0;
  }
}
.content__table {
  height: ~"calc(100% - 32px - 64px)" !important;
}
</style>
