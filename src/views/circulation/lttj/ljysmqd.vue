<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-12 09:08:43
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-06 17:27:29
 -->
<template>
  <div class="common__content">
    <td-content-header>
      书目借阅情况
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :loading="fetchingData"
            @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            @change="getGcLocOptions"
            multiple
            collapse-tags
            clearable
            class="multi line"
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
          <p class="label">藏址：</p>
          <el-select
            filterable
            size="mini"
            v-model="gcLocIds"
            multiple
            collapse-tags
            class="multi line"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in gcLocOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">编目时间：</p>
          <el-date-picker
            v-model="dateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="dateEnd"
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
        <div class="header__line" style="margin-top: 3px;">
          <span class="label">借阅次数：</span>
          <el-input
            placeholder="请输入借阅次数"
            v-model="jycs"
            size="mini"
            clearable
          >
          </el-input>
          <el-radio style="margin-right: 0px;" v-model="pipei" label="1"
            >小于等于</el-radio
          >
          <el-radio style="margin:0 20px;" v-model="pipei" label="3"
            >大于等于</el-radio
          >
          <el-radio v-model="pipei" label="2">等于</el-radio>

          <span class="label">借阅时间：</span>
          <el-date-picker
            v-model="brw_date1"
            style="margin-right: 7px;"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
            class="filter__date"
          >
          </el-date-picker>
          <span>至&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="brw_date2"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
            class="filter__date"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="content__table line2" ref="zdmlTable">
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
          <el-table-column
            prop="ztming"
            min-width="115"
            show-overflow-tooltip
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            width="145"
            label="ISBN/ISSN"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ftming" label="分题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fjming" label="分缉名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fjhao" label="分缉号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="借阅次数"
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

import { czListByLibIds } from "api/public";

import { zeroBrwBookList, zeroBrwBookExportExcel } from "api/circulation";

import { downLoadExcel } from "utils/utils";

export default {
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      selectLibId: [this.$store.getters.userInfo.libId],
      dateStart: "",
      dateEnd: "",
      currentPageSize: 15,
      currentPage: 1,
      totalCount: 0,
      dataList: [],
      gcLocOptions: [],
      gcLocIds: [],
      fetchingData: false,
      brw_date1: "",
      brw_date2: "",
      jycs: "",
      pipei: "1",
      loadListData: false
    };
  },
  methods: {
    getGcLocOptions() {
      czListByLibIds({
        libIds: this.selectLibId.join()
      }).then(res => {
        this.gcLocOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        this.gcLocIds = [];
      });
    },
    // 目录列表
    initList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getList();
    },
    setRequestObj() {
      this.requestObj = {
        czid: this.gcLocIds.join(),
        libid: this.selectLibId.join(),
        date1: this.dateStart,
        date2: this.dateEnd,
        jycs: this.jycs,
        pipei: this.jycs ? this.pipei : "",
        brw_date1: this.brw_date1,
        brw_date2: this.brw_date2
      };
    },
    getList() {
      this.loadListData = true;

      let requestObj = {
        pageNumber: this.currentPage,
        pageSize: this.currentPageSize,
        ...this.requestObj
      };

      zeroBrwBookList(requestObj)
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
      downLoadExcel(zeroBrwBookExportExcel(), {
        ...this.requestObj,
        func_name_us: "zeroBrwBook"
      });
    }
  },
  created() {
    this.initList();
    this.getGcLocOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
