<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-06 17:29:27
 -->
<template>
  <div class="cir_lttj common__content">
    <td-content-header>
      <span>流通统计</span>
      <el-radio-group size="mini" v-model="type">
        <el-radio :label="1">图书借阅时情况</el-radio>
        <el-radio :label="2">图书财产所在情况</el-radio>
      </el-radio-group>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="exportExcel">
            <icon-svg icon-class="icon-daochu" />导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="desc">
            {{ (type === 1 ? "借出所在馆" : "图书财产馆") + "：" }}
          </p>
          <el-select
            filterable
            size="mini"
            @change="initCzList('cygid0')"
            v-model="cygid0"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="desc">
            {{ (type === 1 ? "还书所在馆" : "图书所在馆") + "：" }}
          </p>
          <el-select
            filterable
            size="mini"
            @change="initCzList('cygid1')"
            v-model="cygid1"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="desc">时间类型：</p>
          <el-radio-group size="mini" v-model="timeType">
            <el-radio :label="1">日</el-radio>
            <el-radio :label="2">月</el-radio>
          </el-radio-group>
          <p style="margin-left:10px" class="desc">操作员：</p>
          <el-select
            filterable
            size="mini"
            v-model="userid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="desc">
            {{ type === 1 ? "借出所在藏址" : "图书财产藏址" }}：
          </p>
          <el-select
            filterable
            multiple
            collapse-tags
            size="mini"
            class="multi line"
            v-model="czid0"
            style="flex: 0 0 160px;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in czList0"
              :key="item.czid"
              :label="item.mingcheng"
              :value="item.czid"
            ></el-option>
          </el-select>
          <p class="desc">
            {{ (type === 1 ? "还书所在藏址" : "图书所在藏址") + "：" }}
          </p>
          <el-select
            filterable
            multiple
            collapse-tags
            size="mini"
            class="multi line"
            v-model="czid1"
            style="flex: 0 0 160px;"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in czList1"
              :key="item.czid"
              :label="item.mingcheng"
              :value="item.czid"
            ></el-option>
          </el-select>
          <p class="desc">借阅时间：</p>
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
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table line3" ref="literatureTable">
        <el-table
          v-loading="loadData"
          border=""
          :data="tableData"
          stripe
          @row-dblclick="rowDblclick"
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            show-overflow-tooltip
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jccs"
            label="借出册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ghcs"
            label="还回册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcrs"
            label="借出人数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ghrs"
            label="还回人数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="usercode"
            label="操作"
            width="80"
          >
            <template slot-scope="scope">
              <span
                style="color: #378DE6;cursor: pointer;"
                @click="lttjListToEchart(scope.row.optime)"
                >查看详情</span
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="sumList">
        <span>总计</span>
        <span>借出册数：{{ sumList.jccs || 0 }}</span>
        <span>还回册数：{{ sumList.ghcs || 0 }}</span>
        <span>借出人数：{{ sumList.jcrs || 0 }}</span>
        <span>还回人数：{{ sumList.ghrs || 0 }}</span>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 数据展示 -->
    <div class="echarts__data" v-show="showEchartsData">
      <td-content-header>
        <span>数据详情</span>
      </td-content-header>
      <div class="content">
        <div class="content__header">
          <div class="header__filters">
            <p class="desc">借阅日期：</p>
            <el-date-picker
              v-show="timeType === 1"
              style="margin-right: 7px;"
              class="filter__date"
              size="mini"
              v-model="echartDay"
              value-format="yyyy-MM-dd"
              type="date"
              placeholder="请选择日期"
              :clearable="false"
            ></el-date-picker>
            <el-date-picker
              v-show="timeType === 2"
              style="margin-right: 7px;"
              class="filter__date"
              size="mini"
              v-model="echartMonth"
              value-format="yyyy-MM"
              type="month"
              placeholder="请选择日期"
              :clearable="false"
            ></el-date-picker>
            <el-button type="primary" size="mini" @click="getEchartData">
              <icon-svg icon-class="icon-btn-ico-2" />查询
            </el-button>
          </div>
          <div class="header__filters" style="font-size: 14px;">
            <span
              style="color: #0079FE;cursor: pointer;"
              @click="showEchartsData = false"
              ><icon-svg
                icon-class="icon-shouqi"
                style="margin-bottom: 3px;"
              ></icon-svg>
              返回上一级</span
            >
          </div>
        </div>
        <div class="content__body">
          <el-scrollbar>
            <ve-histogram
              :loading="loadingChartData"
              ref="vchart"
              :data="chartData"
              :settings="chartSettings"
              :extend="chartExtend"
              :toolbox="chartToolbox"
              :colors="['#50A3FF', '#11DC9B']"
            ></ve-histogram>
          </el-scrollbar>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "v-charts/lib/style.css";
import "echarts/lib/component/toolbox";
import { mapGetters } from "vuex";

import {
  lttjList,
  lttjUserList,
  lttjListExport,
  lttjListToEchart
} from "api/circulation";

import { userCzList } from "api/public";

import { downLoadExcel } from "utils/utils";

export default {
  name: "cir_lttj",
  data() {
    this.chartExtend = {
      grid: {
        x: 20,
        x2: 20
      },
      series: {
        barMaxWidth: 40
      }
    };
    this.chartToolbox = {
      feature: {
        saveAsImage: {}
      },
      right: 20
    };
    return {
      // 列表相关
      type: 1,
      cygid0: this.$store.getters.userInfo.libId,
      cygid1: this.$store.getters.userInfo.libId,
      czid0: [],
      czList0: [],
      czid1: [],
      czList1: [],
      timeType: 1,
      date1: "",
      date2: "",
      userid: "",
      userList: [],
      loadData: false,
      tableData: [],
      pageSize: 15,
      currentPage: 1,
      totalCount: 0,
      requestObj: {},
      //合计
      sumList: {},
      showEchartsData: false,
      // 数据
      chartData: {
        columns: ["日期", "借阅", "归还"],
        rows: []
      },
      echartDay: "",
      echartMonth: "",
      chartSettings: {
        yAxisName: ["册数"],
        xAxisName: ["时间"]
      },
      loadingChartData: false
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    search() {
      for (const key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.currentPage = 1;
      this.getLttjList();
    },
    getLttjList() {
      this.loadData = true;
      this.requestObj = {
        type: this.type,
        cygid0: this.cygid0,
        cygid1: this.cygid1,
        czid0: this.czid0.join(","),
        czid1: this.czid1.join(","),
        timeType: this.timeType,
        date1: this.date1 || "",
        date2: this.date2 || "",
        userid: this.userid,
        pageSize: this.pageSize,
        pageNumber: this.currentPage
      };
      lttjList({
        ...this.requestObj
      })
        .then(res => {
          this.loadData = false;
          this.tableData = res.data.dataList[0].list1;
          this.sumList = res.data.dataList[0].list2[0];
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadData = false;
        });
    },
    //关联对应藏址
    initCzList(cygType) {
      this.getUserCzList(this[cygType], cygType);
    },
    getUserList() {
      lttjUserList().then(res => {
        res.data.filter(ele => {
          this.userList.push({
            username: ele.username,
            userId: ele.userId
          });
        });
        this.userList.unshift({
          username: "全部",
          userId: ""
        });
      });
    },
    getUserCzList(cygid, cygType) {
      userCzList({
        libId: cygid
      }).then(res => {
        if (cygType === "cygid0") {
          this.czList0 = [];
          res.data.filter(ele => {
            this.czList0.push({
              czid: ele.czid,
              mingcheng: ele.mingcheng
            });
          });
          this.czid0 = [];
        } else {
          this.czList1 = [];
          res.data.filter(ele => {
            this.czList1.push({
              czid: ele.czid,
              mingcheng: ele.mingcheng
            });
          });
          this.czid1 = [];
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.currentPage = 1;
      this.getLttjList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLttjList();
    },
    exportExcel() {
      downLoadExcel(lttjListExport(), {
        ...this.requestObj
      });
    },
    rowDblclick(val) {
      this.lttjListToEchart(val.optime);
    },
    lttjListToEchart(date) {
      this.showEchartsData = true;
      this.echartDay = date;
      this.echartMonth = date;
      this.chartSettings.xAxisName[0] = this.timeType === 1 ? "时间" : "日期";
      this.$nextTick(() => {
        this.$refs.vchart.echarts.resize();
        this.getEchartData();
      });
    },
    getEchartData() {
      this.loadingChartData = true;
      lttjListToEchart({
        ...this.requestObj,
        dateData: this.timeType === 1 ? this.echartDay : this.echartMonth
      })
        .then(res => {
          let dataArr = [];
          Object.keys(res.data)
            .sort((a, b) => a - b)
            .forEach(key => {
              let data = res.data[key];
              dataArr.push({
                日期: data.time,
                借阅: data.count1,
                归还: data.count2
              });
            });
          this.chartData.rows = dataArr;
        })
        .finally(() => {
          this.loadingChartData = false;
        });
    }
  },
  mounted() {
    this.initCzList("cygid0");
    this.initCzList("cygid1");
    this.getUserList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.echarts__data {
  position: absolute;
  z-index: 1;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;

  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>

<style lang="less">
.sumList {
  height: 30px;
  line-height: 30px;
  font-size: @FSize_16;
  font-weight: bold;
  color: @fontDarkerColor;
  padding-left: 20px;
  box-sizing: border-box;
  span {
    margin-right: 20px;
  }
}
</style>
