<template>
  <div class="cir_wxjhtj common__content">
    <td-content-header>
      <span>文献借还统计</span>
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
          <p class="desc">成员馆：</p>
          <el-select
            filterable
            size="mini"
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
          <el-button type="primary" size="mini" @click="initCensusList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
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
            prop="wxlx"
            label="基本大类"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jycs"
            label="借阅册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bro_percent"
            label="借阅占比"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { wxjhtj } from "api/circulation";
import { categories } from "utils/24categories";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_wxjhtj",
  data() {
    return {
      // 列表相关
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
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

    getCensusList() {
      this.loadCensusData = true;
      this.requestObj = {
        libid: this.libid,
        date1: this.date1 || "",
        date2: this.date2 || ""
      };
      wxjhtj(this.requestObj)
        .then(res => {
          this.loadCensusData = false;
          res.data.filter(ele => {
            if (ele.wxlx) {
              ele.wxlx = `${ele.wxlx} ${" " + categories[ele.wxlx]}`;
            }
          });
          this.CensusList = [...res.data];
        })
        .catch(() => (this.loadCensusData = false));
    },
    print() {
      downLoadExcel("/api/e/flow/lttj/wxjhtjExportExcel", {
        ...this.requestObj
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
