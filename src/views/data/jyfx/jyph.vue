<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-13 15:52:54
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:35:31
 -->
<template>
  <div class="p-jyph common__content">
    <td-content-header>
      借阅排行
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">选择区域：</p>
          <el-cascader
            placeholder="请选择区域"
            style="flex-basis: 160px;margin-right: 13px;"
            v-model="regionId"
            :options="regionArr"
            @change="handleChange"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'areaId',
              label: 'areaName',
              children: 'childs'
            }"
            size="mini"
          >
            <template slot-scope="scope">
              {{ scope.data.areaName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                getAreaCount(scope.data.areaId)
              }}
            </template>
          </el-cascader>
          <p class="label">成员馆：</p>
          <el-select
            filterable
            style="flex-basis: 160px;"
            size="mini"
            v-model="currentLibId"
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
          <p class="label">排序：</p>
          <el-select
            filterable
            style="flex-basis: 160px;"
            size="mini"
            v-model="sortType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sortTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="getStatDatas"
            ><icon-svg icon-class="icon-btn-ico-2" />统计</el-button
          >
        </div>
      </div>
      <div class="content__body">
        <div class="charts">
          <div v-if="showMode === 'lib'" class="charts__header">
            <span class="tit">成员馆借阅排行榜</span>
            <el-date-picker
              size="mini"
              v-model="libStartDate"
              type="date"
              :clearable="false"
              @change="getStatDatas"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <el-date-picker
              size="mini"
              @change="getStatDatas"
              v-model="libEndDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-button
              size="mini"
              @click="exportLibBorrowRankExcel"
              class="downLoad"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
          </div>
          <div v-else class="charts__header">
            <span class="tit" v-if="showImgUnit == 1">读者单位借阅排行榜</span>
            <span class="tit" v-if="showImgUnit == 2">文献藏址借阅排行榜</span>
            <el-date-picker
              size="mini"
              v-model="readerStartDate"
              type="date"
              :clearable="false"
              @change="getReaderDatas"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            <span>&nbsp;&nbsp;-&nbsp;&nbsp;</span>
            <el-date-picker
              size="mini"
              @change="getReaderDatas"
              v-model="readerEndDate"
              type="date"
              :clearable="false"
              value-format="yyyy-MM-dd"
              placeholder="选择日期"
            >
            </el-date-picker>
            <el-button
              size="mini"
              @click="exportLibReaderUnitRank"
              class="downLoad"
              v-if="showImgUnit == 1"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
            <el-button
              size="mini"
              @click="exportLibReaderUnitRank"
              class="downLoad"
              v-if="showImgUnit == 2"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
          </div>
          <div v-if="showMode !== 'lib'" class="xueliTop">
            <span style="fontWeight:700">读者单位</span>
            <!-- <el-button-group class="buttons"> -->
            <!-- <el-button
                @click="readerUnit"
                size="mini"
                :class="addButton_unit"
                >读者单位</el-button
              > -->
            <!-- <el-button
                @click="readerType"
                size="mini"
                :class="addButton_type"
                >文献藏址</el-button
              > -->
            <!-- </el-button-group> -->
          </div>
          <p
            v-if="showMode === 'reader'"
            class="return__p"
            @click="showLibData"
          >
            <icon-svg icon-class="icon-shouqi"></icon-svg> 返回上一级
          </p>
          <div class="charts__view" v-if="showMode === 'lib'">
            <ve-histogram
              ref="chart_lib"
              :data="libBorrowRankChartData"
              :toolbox="libBorrowRankToolbox"
              :settings="libBorrowRankChartSettings"
              :events="libBorrowRankChartEvents"
              :colors="['#50A3FF', '#11DC9B']"
              :data-empty="libDataEmpty"
              :extend="chartExtend"
            ></ve-histogram>
          </div>
          <div v-else class="charts__view">
            <ve-histogram
              ref="chart_reader"
              :data="readerRankChartData"
              :settings="readerBorrowRankChartSettings"
              :toolbox="readerRankToolbox"
              :colors="['#50A3FF']"
              :data-empty="readerDataEmpty"
              :extend="chartExtend"
              v-if="showImgUnit == 1"
            ></ve-histogram>
            <ve-histogram
              ref="chart_reader"
              :data="readerRankChartData"
              :settings="readerBorrowRankChartSettings"
              :toolbox="literatureRankToolbox"
              :colors="['#11DC9B']"
              :data-empty="readerDataEmpty"
              :extend="chartExtend"
              v-if="showImgUnit == 2"
            ></ve-histogram>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  searchLib,
  searchLibArea,
  treeLibCount,
  getLibBorrowRank,
  exportLibBorrowRankExcel,
  getLibReaderUnitRank,
  exportLibReaderUnitRank
} from "api/data";

import { downLoadExcel } from "utils/utils";

import "v-charts/lib/style.css";
import "echarts/lib/component/toolbox";
import dayjs from "dayjs";

export default {
  name: "da_jyph",
  watch: {
    showMode(val) {
      this.$nextTick(() => {
        this.$refs[`chart_${val}`].echarts.resize();
      });
    }
  },
  data() {
    this.chartExtend = {
      grid: {
        x: 40,
        x2: 40,
        top: 70
      },
      series: {
        barMaxWidth: 40
      }
    };
    this.sortTypeOptions = [
      {
        label: "总借阅量",
        value: 1
      },
      {
        label: "平均借阅量",
        value: 2
      }
    ];
    this.libBorrowRankToolbox = {
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "成员馆借阅排行榜"
        }
      },
      right: 40
    };
    this.readerRankToolbox = {
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "读者单位借阅排行榜"
        }
      }
    };
    this.literatureRankToolbox = {
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "文献藏址借阅排行榜"
        }
      }
    };
    this.libBorrowRankChartSettings = {
      axisSite: { right: ["人均借阅册数"] },
      yAxisType: ["normal", "normal"],
      yAxisName: ["总借阅册数", "人均借阅册数"]
    };
    this.readerBorrowRankChartSettings = {
      yAxisName: ["总借阅册数"]
    };
    this.libBorrowRankChartEvents = {
      click: e => {
        if (e.data.libId) {
          this.showlibReaderUnitRank(e.data.libId);
        }
      }
    };
    return {
      showMode: "lib",
      showImgUnit: 1,
      regionId: "",
      regionArr: [],
      currentLibId: "",
      libListSelect: [],
      libStartDate: dayjs()
        .startOf("year")
        .format("YYYY-MM-DD"),
      libEndDate: dayjs().format("YYYY-MM-DD"),
      sortType: 1,
      libDataEmpty: false,
      libBorrowRankChartData: {
        columns: ["成员馆", "总借阅册数", "人均借阅册数", ""],
        rows: []
      },
      readerStartDate: "",
      readerEndDate: "",
      readerDataEmpty: false,
      readerRankChartData: {
        columns: ["读者单位", "总借阅册数"],
        rows: []
      },
      addButton_unit: "addButtonAvailable",
      addButton_type: "addButtonUnAvailable"
    };
  },
  methods: {
    handleChange(areaId) {
      this.searchLib(areaId);
    },
    getStatDatas() {
      if (!this.libStartDate || !this.libEndDate) {
        return;
      }
      this.requestObj = {
        libId: this.currentLibId,
        date1: this.libStartDate,
        date2: this.libEndDate,
        sort: this.sortType
      };
      if (!this.currentLibId) {
        this.requestObj.areaId = this.regionId;
      }
      getLibBorrowRank(this.requestObj).then(res => {
        let arr = [];
        arr = res.data.map(item => {
          return {
            成员馆: item.libName,
            总借阅册数: {
              value: item.borrowCount,
              libId: item.libId
            },
            人均借阅册数: item.avaBrwCount
          };
        });
        if (arr.length === 0) {
          this.libDataEmpty = true;
        } else {
          this.libDataEmpty = false;
        }
        this.libBorrowRankChartData.rows = arr;
      });
    },
    getAreaCount(key) {
      return this.idArr[key];
    },
    // 获取区域
    getAreaTreeData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = JSON.parse(JSON.stringify(treeData));
        // if (update) {
        //   this.regionId = res.data.areaId;
        // }
      });
    },
    treeLibCount() {
      treeLibCount().then(res => {
        this.idArr = res.data;
        this.getAreaTreeData(true);
      });
    },
    // 查询馆id对应的区域
    searchLibArea(libId) {
      let params = {
        libId
      };
      searchLibArea(params).then(res => {
        // 根据用户登录馆获取地区
        this.regionId = res.data.areaId;
        this.searchLib(this.regionId);
        // 首次加载获取数据
        this.getStatDatas();
      });
    },
    // 区域对应的馆
    searchLib(areaId) {
      let params = {
        areaId
      };
      searchLib(params).then(res => {
        this.libListSelect = res.data.map(item => {
          return {
            label: item.libMingcheng,
            value: item.libId
          };
        });
        if (res.data.length > 1) {
          this.libListSelect.unshift({ label: "全部", value: "" });
        } else if (res.data.length === 1) {
          this.currentLibId = this.libListSelect[0].value;
        } else {
          // hack-没有数据隐藏下拉框的全部
          this.libListSelect.unshift({ label: "", value: "" });
          this.currentLibId = "";
          this.$nextTick(() => {
            this.libListSelect = [];
          });
        }
      });
    },
    exportLibBorrowRankExcel() {
      if (!this.requestObj) {
        this.$message.warning("请先筛选数据");
        return;
      }
      downLoadExcel(exportLibBorrowRankExcel(), {
        ...this.requestObj,
        func_name_us: "libBorrowRank"
      });
    },
    showLibData() {
      // 返回成员馆借阅排行榜
      this.showMode = "lib";
      this.libStartDate = this.readerStartDate;
      this.libEndDate = this.readerEndDate;
      this.getStatDatas();
    },
    // 馆读者单位
    showlibReaderUnitRank(libId) {
      this.showMode = "reader";
      this.chartSelectLibId = libId;
      this.readerStartDate = this.libStartDate;
      this.readerEndDate = this.libEndDate;
      this.getReaderDatas();
    },
    getReaderDatas() {
      this.readerRequestObj = {
        libId: this.chartSelectLibId,
        date1: this.readerStartDate,
        date2: this.readerEndDate
      };
      getLibReaderUnitRank(this.readerRequestObj).then(res => {
        let arr = [];
        arr = res.data.map(item => {
          return {
            读者单位: item.tmpS1,
            总借阅册数: item.tmpI1
          };
        });
        if (arr.length === 0) {
          this.readerDataEmpty = true;
        } else {
          this.readerDataEmpty = false;
        }
        this.readerRankChartData.rows = arr;
      });
    },
    exportLibReaderUnitRank() {
      if (!this.readerRequestObj) {
        this.$message.warning("请先筛选数据");
        return;
      }
      downLoadExcel(exportLibReaderUnitRank(), {
        ...this.readerRequestObj
      });
    }
    // readerUnit() {
    //   this.addButton_unit = "addButtonAvailable";
    //   this.addButton_type = "addButtonUnAvailable";
    //   this.showImgUnit = 1;
    //   // this.libReaderDetail();
    // }
    // readerType() {
    //   this.addButton_unit = "addButtonUnAvailable";
    //   this.addButton_type = "addButtonAvailable";
    //   this.showImgUnit = 2;
    //   // this.libReaderDetail();
    // }
  },
  created() {
    this.treeLibCount();
    // 查找对应的地区
    this.searchLibArea(this.$store.getters.userInfo.libId);
    this.$eventBus.$on("qypz-update", () => {
      this.treeLibCount();
      this.searchLibArea(this.$store.getters.userInfo.libId);
    });
  },
  destroyed() {
    this.$eventBus.$off("qypz-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content__body {
  .charts {
    margin: 5px 15px;
    padding: 10px;
    border: 1px solid rgba(200, 211, 223, 1);
    border-radius: 4px;
    .charts__header {
      position: relative;
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      .tit {
        font-size: 16px;
        font-weight: bold;
        color: #373839;
        margin-right: 20px;
      }
      .downLoad {
        position: absolute;
        right: 0;
        top: 0;
      }
    }
    .return__p {
      color: #0079fe;
      font-size: 14px;
      cursor: pointer;
    }
  }
}
.xueliTop {
  display: flex;
  margin-bottom: 40px;
  margin-top: 25px;
  span {
    flex: 3;
  }
  .buttons {
    flex: 6;
    .addButtonAvailable {
      background-color: #0079fe;
      color: #fff;
      border: 1px solid #0079fe;
    }
    .addButtonUnAvailable {
      background-color: #fff;
      color: #515355;
    }
  }
}
</style>
