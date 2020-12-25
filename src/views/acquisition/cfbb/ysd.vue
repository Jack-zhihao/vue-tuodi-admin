<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-10 17:16:11
 * @LastEditTime: 2020-03-10 09:44:52
 -->

<template>
  <div class="acq-ysd common__content">
    <td-content-header>
      验收单
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
          <p class="label">验收单：</p>
          <el-select
            filterable
            size="mini"
            clearable
            v-model="ysdId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ysdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">验收人：</p>
          <el-select
            filterable
            size="mini"
            clearable
            v-model="ysrId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ysrOptions"
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
          <span>验收日期：</span>
          <el-date-picker
            v-model="ysDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="ysDateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initYSDList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="ysdTable">
        <el-table
          v-loading="loadYSDData"
          border
          :data="ysdList"
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
            prop="gysCode"
            label="供应商代码"
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
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuben"
            label="复本数"
            width="55"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yuanjia"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zjia" label="总价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="验收人">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="验收时间">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleYSDSizeChange"
          @current-change="handleYSDCurrentChange"
          :total="totalYSDCount"
          :currentPage="currentYSDPage"
          :pageSize="ysdPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { mapGetters } from "vuex";

import { yspcList, yspcUserList } from "api/public";

import { getYsReport } from "api/catalogue";

export default {
  name: "acq_ysd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      ysdOptions: [],
      ysdId: "",
      ysrOptions: [],
      ysrId: "",
      ysDateStart: "",
      ysDateEnd: "",
      // 列表
      loadYSDData: false,
      ysdList: [],
      currentYSDPage: 1,
      ysdPageSize: 15,
      totalYSDCount: 0
    };
  },
  methods: {
    // 搜索栏
    initOptions() {
      this.getYddOptions();
      this.getYsrOptions();
    },
    currentLibChange() {
      this.initOptions();
    },
    getYddOptions() {
      yspcList({
        libId: this.currentLib
      }).then(res => {
        this.ysdOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.yspcid
          };
        });
        this.ysdId = "";
      });
    },
    getYsrOptions() {
      yspcUserList({
        libId: this.currentLib
      }).then(res => {
        this.ysrOptions = res.data.map(item => {
          return {
            label: item.username,
            value: item.userid
          };
        });
        this.ysrId = "";
      });
    },
    // 列表
    initYSDList() {
      this.currentYSDPage = 1;
      this.setRequestObj();
      this.getYSDList();
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.currentLib,
        userid: this.ysrId,
        yspcid: this.ysdId,
        start: this.ysDateStart ? this.ysDateStart : "",
        end: this.ysDateEnd ? this.ysDateEnd : ""
      };
    },
    getYSDList() {
      this.loadYSDData = true;

      let requestObj = {
        pageNumber: this.currentYSDPage,
        pageSize: this.ysdPageSize,
        ...this.requestObj
      };

      getYsReport(requestObj)
        .then(res => {
          this.ysdList = res.data.dataList;
          this.totalYSDCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadYSDData = false;
        });
    },
    handleYSDSizeChange(val) {
      this.ysdPageSize = val;
      this.getYSDList();
    },
    handleYSDCurrentChange(val) {
      this.currentYSDPage = val;
      this.getYSDList();
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/report/ys", this.requestObj);
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
