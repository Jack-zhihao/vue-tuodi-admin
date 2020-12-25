<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-10 17:16:11
 * @LastEditTime: 2020-03-10 09:43:26
 -->

<template>
  <div class="acq-cqd common__content">
    <td-content-header>
      催缺单
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
            v-model="yddId"
            clearable
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
            v-model="gysId"
            clearable
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
          <el-button type="primary" size="mini" @click="getCQDList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-scrollbar>
          <div>
            <td-content-header style="background:#f1f1f1;">
              部分到馆书目
            </td-content-header>
            <el-table
              border
              v-loading="loadCQDData0"
              :data="cqdList0"
              stripe
              style="width: 100%"
              height="100%"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="gysName"
                label="供应商"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydpcCode"
                label="预订批号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydTime"
                label="预订日期"
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
              <el-table-column
                show-overflow-tooltip
                prop="zrsming"
                label="责任者"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzhe"
                label="出版社"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydcshu"
                label="预订册数"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="wdcshu"
                label="未到册数"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jge"
                label="价格"
                width="87"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="zjia" label="总价">
              </el-table-column>
            </el-table>
            <td-content-header style="background:#f1f1f1;margin-top: 3px;">
              未到馆书目
            </td-content-header>
            <el-table
              border
              v-loading="loadCQDData1"
              :data="cqdList1"
              stripe
              style="width: 100%"
            >
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="gysName"
                label="供应商"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydpcCode"
                label="预订批号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydTime"
                label="预订日期"
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
              <el-table-column
                show-overflow-tooltip
                prop="zrsming"
                label="责任者"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzhe"
                label="出版社"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydcshu"
                label="预订册数"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="wdcshu"
                label="未到册数"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jge"
                label="价格"
                width="87"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="zjia" label="总价">
              </el-table-column>
            </el-table>
          </div>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { mapGetters } from "vuex";

import { ydpcList, userGysInLibList, ydpcUserList } from "api/public";

import { getCqdReport } from "api/catalogue";

import { reportUrging } from "api/acquisition";

export default {
  name: "acq_cqd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      yddOptions: [],
      yddId: "",
      gysOptions: [],
      gysId: "",
      dgrOptions: [],
      dgrId: "",
      ydDateStart: "",
      ydDateEnd: "",
      // 列表
      loadCQDData0: false,
      cqdList0: [],
      loadCQDData1: false,
      cqdList1: []
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
        this.yddId = "";
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
        this.gysId = "";
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
    getRequestObj(flag) {
      let requestObj = {
        libid: this.currentLib,
        gysids: this.gysId,
        ydpcids: this.yddId,
        start: this.ydDateStart ? this.ydDateStart : "",
        end: this.ydDateEnd ? this.ydDateEnd : "",
        flag: flag, // 1：部分验收， 0：没有验收
        userid: this.dgrId,
        pageSize: 1000,
        page: 1
      };
      return requestObj;
    },
    getCQDList() {
      this.loadCQDData0 = true;
      this.loadCQDData1 = true;
      getCqdReport(this.getRequestObj(1))
        .then(res => {
          this.cqdList0 = res.data.dataList;
        })
        .finally(() => {
          this.loadCQDData0 = false;
        });
      getCqdReport(this.getRequestObj(0))
        .then(res => {
          this.cqdList1 = res.data.dataList;
        })
        .finally(() => {
          this.loadCQDData1 = false;
        });
    },
    downLoadData() {
      downLoadExcel(reportUrging(), {
        libid: this.currentLib,
        gysids: this.gysId,
        ydpcids: this.yddId,
        start: this.ydDateStart ? this.ydDateStart : "",
        end: this.ydDateEnd ? this.ydDateEnd : "",
        userid: this.dgrId
      });
    }
  },
  mounted() {
    this.initOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
