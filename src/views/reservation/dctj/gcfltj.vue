<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: 你的名字
 * @Date: 2019-04-19 09:49:47
 * @LastEditTime: 2020-03-04 11:07:19
 -->

<template>
  <div class="res-gcfltj common__content">
    <el-scrollbar>
      <td-content-header>
        馆藏分类统计
        <template v-slot:btns>
          <div class="header__ops">
            <el-button size="mini" type="primary" @click="downLoadData"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
          </div>
        </template>
      </td-content-header>
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
                v-for="item in libList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="searchData"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
            >
          </div>
        </div>
        <!-- <div class="filters" v-if="false">
        <div class="filters__type">
          <el-radio-group v-model="scopeId" style="margin:5px 10px 0 7px;">
            <el-radio label="1">财产馆</el-radio>
            <el-radio label="2">现在馆</el-radio>
          </el-radio-group>
        </div>
        <div class="filters__content">
          <div class="filters__line">
            <span>起止条形码：</span>
            <el-input
              placeholder="请输入起始条形码"
              clearable
              size="mini"
              v-model="tmStart"
            ></el-input>
            <span>至&nbsp;&nbsp;&nbsp;</span>
            <el-input
              placeholder="请输入结束条形码"
              clearable
              size="mini"
              v-model="tmEnd"
            ></el-input>
            <el-button type="primary" size="mini" @click="searchData"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
            >
          </div>
          <div class="filters__line">
            <span>图书馆：</span>
            <el-select
              filterable
              size="mini"
              v-model="currentLib"
              placeholder="请选择"
              @change="currentLibChange"
            >
              <el-option
                v-for="item in libList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="searchData"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
            >
            <span class="desc">藏址：</span>
            <el-select
              filterable
              size="mini"
              v-model="czId"
              clearable
              placeholder="请选择"
            >
              <el-option
                v-for="item in czOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span class="desc">图书类型：</span>
            <el-select
              filterable
              clearable
              size="mini"
              v-model="bookType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in bookTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="filters__line">
            <span>入藏起止时间：</span>
            <el-date-picker
              v-model="rcDateStart"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
            >
            </el-date-picker>
            <span>至&nbsp;&nbsp;</span>
            <el-date-picker
              v-model="rcDateEnd"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
            >
            </el-date-picker>
            <span>起止出版年：</span>
            <el-date-picker
              v-model="cbYearStart"
              type="year"
              size="mini"
              value-format="yyyy"
              placeholder="开始年份"
            >
            </el-date-picker>
            <span>至&nbsp;&nbsp;</span>
            <el-date-picker
              v-model="cbYearEnd"
              type="year"
              size="mini"
              value-format="yyyy"
              placeholder="结束年份"
            >
            </el-date-picker>
          </div>
        </div>
      </div> -->
        <div class="content__tabs">
          <div class="tabs__header">
            <span
              class="header__item"
              v-for="(item, index) in bottomTabs"
              @click="changeBottomMode(item.value)"
              :key="index"
              :class="{ active: currentBottomMode === item.value }"
              >{{ item.label }}</span
            >
          </div>
          <div class="tabs__content">
            <div class="content__tb" v-if="currentBottomMode === 'tb'">
              <el-table
                v-loading="loadFLTJData"
                border
                :data="fltjData"
                stripe
                style="width: 100%"
              >
                <el-table-column
                  show-overflow-tooltip
                  prop="flhname"
                  label="基本大类"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="kindnum"
                  label="种数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="kindNumScale"
                  label="种数比例%"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="bookNum"
                  label="册数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="bookNumScale"
                  label="册数比例%"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="金额（￥元）">
                  <template slot-scope="scope">
                    {{ scope.row.cashNum.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cashNumScale"
                  label="金额比例%"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="logoutBook"
                  label="注销册数"
                >
                </el-table-column>
                <el-table-column show-overflow-tooltip label="注销金额（￥元）">
                  <template slot-scope="scope">
                    {{ scope.row.logoutMoney.toFixed(2) }}
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="sjBook"
                  label="实际馆藏册数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="sjMoney"
                  label="实际金额（￥元）"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="content__bzt" v-if="currentBottomMode === 'bzt'">
              <ve-pie
                :title="chartTitles"
                :series="pieSeries"
                :legend="chartLegends"
              ></ve-pie>
            </div>
            <div class="content__zzt" v-if="currentBottomMode === 'zzt'">
              <ve-histogram
                :settings="histogramSettings"
                :extend="histogramExtend"
                :data="histogramData"
              ></ve-histogram>
              <ve-histogram
                :settings="histogramSettings"
                :extend="histogramExtend"
                :data="histogramData1"
              ></ve-histogram>
              <ve-histogram
                :settings="histogramSettings"
                :extend="histogramExtend"
                :data="histogramData2"
              ></ve-histogram>
              <!-- <ve-histogram
              :settings="histogramSettings"
              :extend="histogramExtend"
              :data="histogramData3"
            ></ve-histogram> -->
              <div class="cata__items" style="margin-bottom: 30px;">
                <div
                  class="cata__item"
                  :title="item"
                  v-for="(item, key) in categories"
                  :key="key"
                >
                  {{ key }} {{ item }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { downLoadExcel } from "utils/utils";

import { userCzList } from "api/public";

import { BOOKTYPE_OPTIONS } from "utils/variables";

import { categories } from "utils/24categories";

import { gcfltj, gcflExportExcel } from "api/reservation";

import "echarts/lib/component/title";
import echarts from "echarts";

export default {
  name: "res_gcfltj",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.categories = categories;
    this.bookTypeOptions = BOOKTYPE_OPTIONS;

    this.bottomTabs = [
      {
        label: "图表",
        value: "tb"
      },
      {
        label: "饼状图",
        value: "bzt"
      },
      {
        label: "柱状图",
        value: "zzt"
      }
    ];
    this.chartTitles = [
      {
        text: "种数比例%",
        x: "20%",
        y: 40,
        textAlign: "center"
      },
      {
        text: "册数比例%",
        x: "50%",
        y: 40,
        textAlign: "center"
      },
      {
        text: "金额比例%",
        x: "80%",
        y: 40,
        textAlign: "center"
      }
    ];
    this.chartLegends = {
      x: "center",
      y: "bottom",
      data: [
        "A 马克思主义、列宁主义、毛泽东思想、邓小平理论",
        "B 哲学、宗教",
        "C 社会科学总论",
        "D 政治、法律",
        "E 军事",
        "F 经济",
        "G 文化、科学、教育、体育",
        "H 语言、文字",
        "I 文学",
        "J 艺术",
        "K 历史、地理",
        "N 自然科学总论",
        "O 数理科学和化学",
        "P 天文学、地球科学",
        "Q 生物科学",
        "R 医药、卫生",
        "S 农业科学",
        "T 工业技术",
        "U 交通运输",
        "V 航空、航天",
        "X 环境科学、安全科学",
        "Z 综合性图书",
        "其它"
      ]
    };
    this.histogramExtend = {
      grid: {
        bottom: 30
      },
      series: {
        label: { show: true, position: "top" }
      },
      tooltip: {
        axisPointer: {
          type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
        }
      },
      xAxis: {
        axisLabel: {
          formatter: function(value) {
            return value.split(" ")[0];
          }
        }
      }
    };
    this.histogramSettings = {
      yAxisName: ["比例值%"],
      itemStyle: {
        normal: {
          color: function(params) {
            switch (params.seriesName) {
              case "种数比例":
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#5DAAFF" },
                  { offset: 1, color: "#2081ED" }
                ]);
              case "册数比例":
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#3BE59F" },
                  { offset: 1, color: "#00B857" }
                ]);
              case "金额比例":
                return new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  { offset: 0, color: "#FFBC73" },
                  { offset: 1, color: "#EB8920" }
                ]);
              default:
                break;
            }
          }
        }
      }
    };
    return {
      // 筛选条件
      scopeId: "1",
      currentLib: this.$store.getters.userInfo.libId,
      czId: "",
      czOptions: [],
      bookType: "",
      rcDateStart: "",
      rcDateEnd: "",
      tmStart: "",
      tmEnd: "",
      cbYearStart: "",
      cbYearEnd: "",
      flType: "1",
      currentBottomMode: "tb",
      // 下方表格
      loadFLTJData: false,
      fltjData: [],
      // 饼图
      pieSeries: [
        {
          name: "种数比例%",
          type: "pie",
          radius: [0, 50],
          center: ["20%", "50%"],
          label: {
            normal: {
              formatter: params =>
                params.name.split(" ")[0] + ": " + params.value
            }
          },
          data: []
        },
        {
          name: "册数比例%",
          type: "pie",
          radius: [0, 50],
          center: ["50%", "50%"],
          label: {
            normal: {
              formatter: params =>
                params.name.split(" ")[0] + ": " + params.value
            }
          },
          data: []
        },
        {
          name: "金额比例%",
          type: "pie",
          radius: [0, 50],
          center: ["80%", "50%"],
          label: {
            normal: {
              formatter: params =>
                params.name.split(" ")[0] + ": " + params.value
            }
          },
          data: []
        }
      ],
      // 柱状图
      histogramData: {
        columns: ["序号", "种数比例"],
        rows: []
      },
      histogramData1: {
        columns: ["序号", "册数比例"],
        rows: []
      },
      histogramData2: {
        columns: ["序号", "金额比例"],
        rows: []
      },
      histogramData3: {
        columns: ["序号", "注销金额"],
        rows: []
      }
    };
  },
  methods: {
    downLoadData() {
      downLoadExcel(gcflExportExcel(), {
        libid: this.currentLib
      });
    },
    // 搜索条件
    getCzOptions() {
      userCzList({
        libId: this.currentLib
      }).then(res => {
        this.czOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
      });
    },
    currentLibChange() {
      this.getCzOptions();
    },
    searchData() {
      if ((this.tmStart && !this.tmEnd) || (this.tmEnd && !this.tmStart)) {
        this.$message("起止条形码必须输入开始和结束范围");
        return;
      }
      this.loadFLTJData = true;
      gcfltj({
        libType: this.scopeId,
        libid: this.currentLib,
        czid: this.czId,
        bookType: this.bookType,
        time1: this.rcDateStart,
        time2: this.rcDateEnd,
        cbrqi1: this.cbYearStart,
        cbrqi2: this.cbYearEnd,
        tiaoma1: this.tmStart,
        tiaoma2: this.tmEnd
      })
        .then(res => {
          res.data.forEach(item => {
            item.sjMoney = (item.cashNum - item.logoutMoney).toFixed(2);
            item.sjBook = item.bookNum - item.logoutBook;
          });
          this.fltjData = res.data;

          this.renderPieSeries(res.data);
          this.renderHistogramData(res.data);
        })
        .finally(() => {
          this.loadFLTJData = false;
        });
    },
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 饼状图
    renderPieSeries(data) {
      let zsData = [],
        csData = [],
        jeData = [];
      data.forEach(item => {
        if (item.ssh !== "SUM") {
          zsData.push({
            name: item.flhname,
            value: item.kindNumScale
          });
          csData.push({
            name: item.flhname,
            value: item.bookNumScale
          });
          jeData.push({
            name: item.flhname,
            value: item.cashNumScale
          });
        }
      });
      this.pieSeries[0].data = zsData;
      this.pieSeries[1].data = csData;
      this.pieSeries[2].data = jeData;
    },
    // 柱状图
    renderHistogramData(data) {
      let histogramData = [];
      let histogramData1 = [];
      let histogramData2 = [];
      let histogramData3 = [];
      data.forEach(item => {
        if (item.ssh !== "SUM") {
          histogramData.push({
            序号: item.flhname,
            种数比例: item.kindNumScale
          });
          histogramData1.push({
            序号: item.flhname,
            册数比例: item.bookNumScale
          });
          histogramData2.push({
            序号: item.flhname,
            金额比例: item.cashNumScale
          });
          histogramData3.push({
            序号: item.flhname,
            注销金额: item.logoutMoney
          });
        }
      });
      this.histogramData.rows = histogramData;
      this.histogramData1.rows = histogramData1;
      this.histogramData2.rows = histogramData2;
      this.histogramData3.rows = histogramData3;
    }
  },
  mounted() {
    this.getCzOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.content__tabs {
  border-top: 1px solid @borderColor;
  .tabs__header {
    height: 35px;
    background: @topBgColor;
    display: flex;
    align-items: center;
    padding-right: 20px;
    .header__item {
      display: inline-block;
      cursor: pointer;
      height: 35px;
      line-height: 35px;
      padding: 0 17px;
      font-size: @FSize_15;
      &.active {
        font-weight: bold;
        color: @primaryColor;
        background: @contentHdColor;
      }
    }
  }
  .content__zzt {
    padding-top: 50px;
    .cata__items {
      padding: 0 10px;
      display: flex;
      flex-wrap: wrap;
      .cata__item {
        flex: 20% 0 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
</style>
