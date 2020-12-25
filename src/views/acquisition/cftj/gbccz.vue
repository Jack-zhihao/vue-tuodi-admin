<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-11 19:28:35
 * @LastEditTime: 2020-03-10 09:45:29
 -->
<template>
  <div class="acq-gbcctj common__content">
    <td-content-header>
      个别财产帐
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
          <p class="label">馆藏地点：</p>
          <el-select
            filterable
            size="mini"
            v-model="gcLocIds"
            multiple
            class="multi line"
            clearable
            collapse-tags
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
          <p class="label">馆藏状态：</p>
          <el-select
            filterable
            size="mini"
            multiple
            collapse-tags
            v-model="gcZTIds"
            placeholder="请选择"
            class="multi line"
            clearable
          >
            <el-option
              v-for="item in gcZTOptions"
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
          <p class="label">入库日期：</p>
          <el-date-picker
            v-model="rkDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="rkDateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initGBCCTJList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="gbcctjTable">
        <el-table
          v-loading="loadGBCCTJData"
          border
          :data="gbcctjList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
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
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jge" label="单价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName0" label="财产馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ceshu" label="册数">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="riqi" label="入库日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ztai" label="馆藏状态">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleGBCCTJSizeChange"
          @current-change="handleGBCCTJCurrentChange"
          :total="totalGBCCTJCount"
          :currentPage="currentGBCCTJPage"
          :pageSize="gbcctjPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { mapGetters } from "vuex";

import { ZTAI_OPTIONS } from "utils/variables";

import { userCzList } from "api/public";

import { getGbcczReport } from "api/catalogue";

export default {
  name: "acq_gbccz",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.gcZTOptions = ZTAI_OPTIONS;
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      gcLocOptions: [],
      gcLocIds: [],
      gcZTIds: [],
      rkDateStart: "",
      rkDateEnd: "",
      // 列表
      loadGBCCTJData: false,
      gbcctjList: [],
      currentGBCCTJPage: 1,
      gbcctjPageSize: 15,
      totalGBCCTJCount: 0
    };
  },
  methods: {
    // 搜索栏
    initOptions() {
      this.getGcLocOptions();
    },
    currentLibChange() {
      this.initOptions();
    },
    getGcLocOptions() {
      userCzList({
        libId: this.currentLib
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
    // 列表
    initGBCCTJList() {
      this.currentGBCCTJPage = 1;
      this.setRequestObj();
      this.getGBCCTJList();
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.currentLib,
        czids: this.gcLocIds.join(","),
        ztais: this.gcZTIds.join(","),
        start: this.rkDateStart ? this.rkDateStart : "",
        end: this.rkDateEnd ? this.rkDateEnd : ""
      };
    },
    getGBCCTJList() {
      this.loadGBCCTJData = true;

      let requestObj = {
        pageNumber: this.currentGBCCTJPage,
        pageSize: this.gbcctjPageSize,
        ...this.requestObj
      };

      getGbcczReport(requestObj)
        .then(res => {
          this.gbcctjList = res.data.dataList;
          this.totalGBCCTJCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadGBCCTJData = false;
        });
    },
    handleGBCCTJSizeChange(val) {
      this.gbcctjPageSize = val;
      this.getGBCCTJList();
    },
    handleGBCCTJCurrentChange(val) {
      this.currentGBCCTJPage = val;
      this.getGBCCTJList();
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/report/aloneMoney", this.requestObj);
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
