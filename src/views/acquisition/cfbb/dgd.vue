<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-10 17:16:11
 * @LastEditTime: 2020-03-10 09:43:59
 -->

<template>
  <div class="acq-dgd common__content">
    <td-content-header>
      订购单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
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
            size="mini"
            v-model="currentLib"
            placeholder="请选择"
            @change="currentLibChange"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">预订单：</p>
          <el-select
            filterable
            size="mini"
            v-model="yddIds"
            multiple
            clearable
            class="multi line"
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in yddOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">供应商：</p>
          <el-select
            filterable
            size="mini"
            v-model="gysIds"
            multiple
            clearable
            class="multi line"
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in gysOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">订购人：</p>
          <el-select
            filterable
            size="mini"
            clearable
            v-model="dgrId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in dgrOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="content__header">
        <div class="header__line">
          <span>预订日期：</span>
          <el-date-picker
            v-model="ydDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="ydDateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initDGDList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="dgdTable">
        <el-table
          v-loading="loadDGDData"
          border
          :data="dgdList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libCode"
            label="成员馆代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ydbhao" label="预订编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ceshu"
            label="复本数"
            width="55"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jiage"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zjia" label="总价">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleDGDSizeChange"
          @current-change="handleDGDCurrentChange"
          :total="totalDGDCount"
          :currentPage="currentDGDPage"
          :pageSize="dgdPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { mapGetters } from "vuex";

import { ydpcList, userGysInLibList, ydpcUserList } from "api/public";

import { getYdReport } from "api/catalogue";

export default {
  name: "acq_dgd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      yddOptions: [],
      yddIds: [],
      gysOptions: [],
      gysIds: [],
      dgrOptions: [],
      dgrId: "",
      ydDateStart: "",
      ydDateEnd: "",
      // 列表
      loadDGDData: false,
      dgdList: [],
      currentDGDPage: 1,
      dgdPageSize: 15,
      totalDGDCount: 0
    };
  },
  methods: {
    // 搜索栏
    initOptions() {
      this.getYddOptions();
      this.getGysOptions();
      this.getDgrOptions();
    },
    currentLibChange() {
      this.initOptions();
    },
    getYddOptions() {
      ydpcList({
        libId: this.currentLib
      }).then(res => {
        this.yddOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ydpcid
          };
        });
        this.yddIds = [];
      });
    },
    getGysOptions() {
      userGysInLibList({
        libId: this.currentLib
      }).then(res => {
        this.gysOptions = res.data.map(item => {
          return {
            label: item.gysName,
            value: item.gysId
          };
        });
        this.gysIds = [];
      });
    },
    getDgrOptions() {
      ydpcUserList({
        libId: this.currentLib
      }).then(res => {
        this.dgrOptions = res.data.map(item => {
          return {
            label: item.username,
            value: item.userid
          };
        });
        this.dgrId = "";
      });
    },
    // 列表
    initDGDList() {
      this.currentDGDPage = 1;
      this.setRequestObj();
      this.getDGDList();
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.currentLib,
        gysids: this.gysIds.join(","),
        ydpcids: this.yddIds.join(","),
        flag: "0",
        start: this.ydDateStart ? this.ydDateStart : "",
        end: this.ydDateEnd ? this.ydDateEnd : "",
        userid: this.dgrId
      };
    },
    getDGDList() {
      this.loadDGDData = true;

      let requestObj = {
        pageNumber: this.currentDGDPage,
        pageSize: this.dgdPageSize,
        ...this.requestObj
      };

      getYdReport(requestObj)
        .then(res => {
          this.dgdList = res.data.dataList;
          this.totalDGDCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadDGDData = false;
        });
    },
    handleDGDSizeChange(val) {
      this.dgdPageSize = val;
      this.getDGDList();
    },
    handleDGDCurrentChange(val) {
      this.currentDGDPage = val;
      this.getDGDList();
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/report/yd", this.requestObj);
    }
  },
  mounted() {
    this.initOptions();
    this.setRequestObj();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
