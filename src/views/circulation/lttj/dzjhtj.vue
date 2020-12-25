<template>
  <div class="cir_dzjhtj common__content">
    <td-content-header>
      <span>读者借还统计</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="print" type="primary" size="mini">
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
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            @change="getReaderType"
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
          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="dzlxid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerTypeList"
              :key="item.dzlxid"
              :label="item.mcheng"
              :value="item.dzlxid"
            ></el-option>
          </el-select>
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
            @keydown.enter.native="initCensusList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initCensusList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
        <div class="header__line">
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
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadCensusData"
          border=""
          :data="CensusList"
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
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzdw"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xujiecs"
            label="续借次数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="借阅册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="guihuancs"
            label="归还册数"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCensusSizeChange"
          @current-change="handleCensusCurrentChange"
          :total="totalCensusCount"
          :currentPage="currentCensusPage"
          :pageSize="CensusPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { dzjhtj } from "api/circulation";
import { readerType } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzjhtj",
  data() {
    this.filterOptions = [
      { label: "读者证号", value: "dzzhao" },
      { label: "读者姓名", value: "xming" },
      { label: "读者单位", value: "dzdw" }
    ];

    return {
      // 列表相关
      filterSearchKey: "",
      currentFilterKey: "dzzhao",
      libid: this.$store.getters.userInfo.libId,
      dzlxid: "",
      date1: "",
      date2: "",
      readerTypeList: [],
      multipleCensusSelection: [],
      loadCensusData: false,
      CensusList: [],
      CensusPageSize: 15,
      currentCensusPage: 1,
      totalCensusCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    initCensusList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.currentCensusPage = 1;
      this.getCensusList();
    },

    handleCensusSelectionChange() {
      //val
      // this.multipleCensusSelection = val.map(item => item.Censusid);
    },

    getCensusList() {
      this.loadCensusData = true;
      this.requestObj = {
        libid: this.libid,
        dzlxid: this.dzlxid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        pageNumber: this.currentCensusPage,
        pageSize: this.CensusPageSize
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /^\s+|\s+$/g,
        ""
      );
      dzjhtj(this.requestObj)
        .then(res => {
          this.loadCensusData = false;
          this.CensusList = res.data.dataList;
          this.totalCensusCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCensusData = false));
    },
    handleCensusSizeChange(val) {
      this.CensusPageSize = val;
      this.getCensusList();
    },
    handleCensusCurrentChange(val) {
      this.currentCensusPage = val;
      this.getCensusList();
    },
    getReaderType() {
      this.dzlxid = "";
      readerType({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mcheng: "全部",
          dzlxid: ""
        });
        this.readerTypeList = [...res.data];
      });
    },
    //导出
    print() {
      downLoadExcel("/api/e/flow/lttj/dzjhtjExportExcel", {
        ...this.requestObj
      });
    }
  },
  mounted() {
    this.getReaderType();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
