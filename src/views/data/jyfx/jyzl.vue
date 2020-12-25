<template>
  <div class="jyzl common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content__header">
          <div class="header__line" style="marginTop:10px">
            <span class="label">选择区域：</span>
            <el-cascader
              v-model="region"
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
              clearable
            >
              <template slot-scope="scope">
                {{ scope.data.areaName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                  scope.data.areaId | libCounts
                }}
              </template>
            </el-cascader>
            <div style="marginLeft:13px">
              <span class="label">成员馆：</span>
              <el-select
                filterable
                v-model="memberLib"
                placeholder="请选择馆"
                size="mini"
              >
                <el-option
                  v-for="item in memberLibArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                size="mini"
                @click="tongJiTu"
                :disabled="tongjiDisabled"
                >统计</el-button
              >
            </div>
          </div>
        </div>
        <td-content-header>
          整体指标
        </td-content-header>
        <div class="target">
          <div
            class="year_target"
            v-for="(item, index) in arrTarget"
            :key="index"
            :style="{ backgroundImage: 'url(' + item.url + ')' }"
          >
            <div class="title">{{ item.title }}</div>
            <span>{{ item.date }}&nbsp;|&nbsp;{{ item.date_desc }}</span>
            <div class="ce">
              {{ item.borrow_count | bookCounts }}<span>册</span>
            </div>
            <div v-if="item.huanbi" class="huanTongBi">
              <span
                >环比:<i class="el-icon-caret-top" v-if="item.increase_hb">{{
                  item.huanbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="item.reduce_hb">{{
                  item.huanbi | jueduizhi
                }}</i></span
              >
              <span
                >同比:<i class="el-icon-caret-top" v-if="item.increase_tb">{{
                  item.tongbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="item.reduce_tb">{{
                  item.tongbi | jueduizhi
                }}</i></span
              >
            </div>
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div class="chart">
        <div class="chart_gcfx_borrowTrend">
          <span class="chart_title">借阅趋势</span>
          <el-select
            filterable
            v-model="weiDu"
            placeholder="请选择"
            size="mini"
            class="weiDu"
            @change="selectWeiDu"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-date-picker
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            @change="selectDate1"
            value-format="yyyy-MM-dd"
            style="marginRight:5px"
            :clearable="false"
          >
          </el-date-picker>
          <span>-</span>
          <el-date-picker
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            @change="selectDate2"
            value-format="yyyy-MM-dd"
            size="mini"
            style="marginLeft:5px"
            :clearable="false"
          >
          </el-date-picker>
          <el-button
            size="mini"
            @click="downLoadData_borrowTrend"
            class="downLoad_collect"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-histogram
              :data="chartData_borrowTrend"
              :toolbox="toolbox_borrowTrend"
              :colors="colors"
              :settings="chartSettings"
              :extend="extend"
            ></ve-histogram>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  searchLib,
  searchLibArea,
  borrowTrend,
  borrowTrendExport,
  borrowTarget
} from "api/data";
import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
let that;
export default {
  name: "da_jyzl",
  data() {
    this.toolbox_borrowTrend = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "借阅趋势"
        }
      }
    };
    this.colors = ["#50A3FF"];
    this.chartSettings = {
      yAxisName: ["借阅册数"],
      xAxisName: ["日期"],
      xAxisNameLocation: ["middle"]
    };
    this.extend = {
      series: {
        barMaxWidth: 40
      }
    };
    return {
      tongjiDisabled: false,
      isShow: false,
      // 区域是否触发
      isSelectRegion: false,
      region: [],
      regionArr: [],
      // 区域id
      areaId: "",
      memberLib: "",
      memberLibArr: [],
      options: [
        { value: 1, label: "月度" },
        { value: 2, label: "季度" },
        { value: 3, label: "年度" }
      ],
      weiDu: 1,
      date1: "",
      date2: "",
      idArr: {},
      selectDate: "",
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择
              time.getTime() > Date.now() ||
              time.getTime() > new Date(this.date2)
            );
          }
          // 结束时间没选--可以选择当天
          return time.getTime() > Date.now();
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(this.date1)
          );
        }
      },
      chartData_borrowTrend: {
        columns: ["日期", "借阅册数"],
        rows: []
      },
      arrTarget: []
    };
  },
  filters: {
    libCounts(key) {
      return that.idArr[key];
    },
    bookCounts(value) {
      return parseFloat(value);
    },
    jueduizhi(value) {
      return Math.abs(parseFloat(value)) + "%";
    }
  },
  methods: {
    // 查询馆id对应的区域
    searchLibArea(libId) {
      let params = {
        libId
      };
      searchLibArea(params).then(res => {
        // console.log(res);
        // 显示地区
        this.region = res.data.areaId;
        this.areaId = res.data.areaId;
        // 显示馆列表，并且是否显示全部选项
        this.searchLib(this.region);
      });
    },
    // 区域树状图
    getAreaTreeData() {
      getAreaTreeData().then(res => {
        // console.log(res);
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = treeData;
        this.areaId = "";
      });
    },
    // 树形馆的对应数量
    treeLibCount() {
      treeLibCount().then(res => {
        // console.log(res);
        this.idArr = res.data;
      });
    },
    // 区域对应的馆
    searchLib(areaId) {
      let params = {
        areaId
      };
      searchLib(params).then(res => {
        // console.log(res);
        if (!res.data.length) {
          this.$message.error("该区域暂没有馆，请重新选择");
          this.memberLibArr = [];
          this.tongjiDisabled = true;
          this.isShow = false; //隐藏全部选项
        } else {
          this.tongjiDisabled = false;
          this.memberLibArr = res.data.map(item => {
            return {
              label: item.libMingcheng,
              value: item.libId
            };
          });
          // 页面加载时候调用
          if (!this.isSelectRegion) {
            // 获取当前年月日到当前时间--默认时间,里面调用渲染图表方法
            this.currentDate();
          }
          if (this.memberLibArr.length > 1) {
            //说明有多个馆，显示全部选项
            this.memberLibArr.unshift({ label: "全部", value: "" });
          } else if (this.memberLibArr.length == 1) {
            this.memberLib = this.memberLibArr[0].value;
          }
        }
      });
    },
    // 获取当前年月日
    currentDate() {
      // 默认界面显示当年的年月日到现在
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      let selectDate = [];
      selectDate[0] = new Date(year, 0, 1);
      selectDate[1] = new Date();
      this.selectDate = selectDate;
      // 显示当前登录的馆
      this.memberLib = this.$store.getters.userInfo.libId;
      // 时间传参赋值
      this.selectHandleDate(this.selectDate);
    },
    // 选择维度
    selectWeiDu() {
      this.tongJiTu();
    },
    // 选择开始时间
    selectDate1() {
      this.tongJiTu();
    },
    selectDate2() {
      this.tongJiTu();
    },
    // 选择时间段
    selectHandleDate(val) {
      // 开始日期
      let d1 = new Date(val[0]);
      let month1 =
        d1.getMonth() + 1 < 10 ? "0" + (d1.getMonth() + 1) : d1.getMonth() + 1;
      let date1 = d1.getDate() < 10 ? "0" + d1.getDate() : d1.getDate();
      this.date1 = d1.getFullYear() + "-" + month1 + "-" + date1;
      // 结束日期
      let d2 = new Date(val[1]);
      let month2 =
        d2.getMonth() + 1 < 10 ? "0" + (d2.getMonth() + 1) : d2.getMonth() + 1;
      let date2 = d2.getDate() < 10 ? "0" + d2.getDate() : d2.getDate();
      this.date2 = d2.getFullYear() + "-" + month2 + "-" + date2;
      this.tongJiTu();
    },
    // 统计图表
    tongJiTu() {
      // 借阅趋势
      this.borrowTrend();
      // 借阅总览整体指标
      this.borrowTarget();
    },
    // 图表请求
    // 借阅趋势
    borrowTrend() {
      let params = {
        libId: this.memberLib,
        areaId: this.region,
        dateType: this.weiDu,
        date1: this.date1,
        date2: this.date2
      };
      borrowTrend(params).then(res => {
        let arr_borrow = [];
        for (const key in res.data) {
          let obj = {
            日期: key,
            借阅册数: res.data[key]
          };
          arr_borrow.push(obj);
        }
        this.chartData_borrowTrend.rows = arr_borrow;
      });
    },
    // 流通藏书比---导出excel
    downLoadData_borrowTrend() {
      downLoadExcel(borrowTrendExport(), {
        libId: this.memberLib,
        areaId: this.region,
        func_name_us: "borrowTrend",
        dateType: this.weiDu,
        date1: this.date1,
        date2: this.date2
      });
    },
    // 借阅总览整体指标
    borrowTarget() {
      let params = {
        libId: this.memberLib,
        areaId: this.region
      };
      borrowTarget(params).then(res => {
        let arr = [];
        res.data.nian.url = require("assets/nian.png");
        res.data.lastMonth.url = require("assets/lastmonth.png");
        res.data.quarter.url = require("assets/jidu.png");
        res.data.thisMonth.url = require("assets/thismonth.png");
        // 上个月环比
        if (parseFloat(res.data.lastMonth.huanbi) > 0) {
          res.data.lastMonth.increase_hb = true;
          res.data.lastMonth.reduce_hb = false;
        } else {
          res.data.lastMonth.increase_hb = false;
          res.data.lastMonth.reduce_hb = true;
        }
        // 上个月同比
        if (parseFloat(res.data.lastMonth.tongbi) > 0) {
          res.data.lastMonth.increase_tb = true;
          res.data.lastMonth.reduce_tb = false;
        } else {
          res.data.lastMonth.increase_tb = false;
          res.data.lastMonth.reduce_tb = true;
        }
        // 本月环比
        if (parseFloat(res.data.thisMonth.huanbi) > 0) {
          res.data.thisMonth.increase_hb = true;
          res.data.thisMonth.reduce_hb = false;
        } else {
          res.data.thisMonth.increase_hb = false;
          res.data.thisMonth.reduce_hb = true;
        }
        // 本月同比
        if (parseFloat(res.data.thisMonth.tongbi) > 0) {
          res.data.thisMonth.increase_tb = true;
          res.data.thisMonth.reduce_tb = false;
        } else {
          res.data.thisMonth.increase_tb = false;
          res.data.thisMonth.reduce_tb = true;
        }
        // 季度环比
        if (parseFloat(res.data.quarter.huanbi) > 0) {
          res.data.quarter.increase_hb = true;
          res.data.quarter.reduce_hb = false;
        } else {
          res.data.quarter.increase_hb = false;
          res.data.quarter.reduce_hb = true;
        }
        // 季度同比
        if (parseFloat(res.data.quarter.tongbi) > 0) {
          res.data.quarter.increase_tb = true;
          res.data.quarter.reduce_tb = false;
        } else {
          res.data.quarter.increase_tb = false;
          res.data.quarter.reduce_tb = true;
        }
        arr.push(res.data.nian);
        arr.push(res.data.quarter);
        arr.push(res.data.lastMonth);
        arr.push(res.data.thisMonth);
        this.arrTarget = arr;
      });
    },
    // 选择区域
    handleChange(value) {
      // 清空馆下拉框
      this.memberLib = "";
      this.searchLib(value);
      this.areaId = value;
      this.isSelectRegion = true;
    }
  },
  beforeCreate: function() {
    that = this;
  },
  created() {
    //加载区域树状图
    this.getAreaTreeData();
    this.$eventBus.$on("qypz-update", () => {
      this.getAreaTreeData();
      this.treeLibCount();
      this.searchLibArea(this.$store.getters.userInfo.libId);
    });
    this.treeLibCount();
    // 查找对应的地区
    this.searchLibArea(this.$store.getters.userInfo.libId);
  },
  destroyed() {
    this.$eventBus.$off("qypz-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.target {
  display: flex;
  > div {
    box-sizing: border-box;
    // flex: 1;
    flex-shrink: 0;
    height: 2rem;
    border-radius: 4px;
    margin: 0 0.1rem;
    padding: 0.2rem;
    font-size: 0.16rem;
    font-family: MicrosoftYaHei-Bold;
    font-weight: bold;
    background-size: cover;
    background-repeat: no-repeat;
    color: rgba(255, 255, 255, 1);
    line-height: 0.16rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > span {
      font-size: 0.14rem;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      opacity: 0.5;
      display: block;
      margin: 0.11rem 0 0.4rem;
    }
    > div:nth-child(3) {
      margin-bottom: 30px;
      font-size: 0.16rem;
    }
    .huanTongBi {
      // width: 82%;
      height: 32px;
      box-sizing: border-box;
      background: rgba(255, 255, 255, 0.7);
      border-radius: 18px;
      padding: 0.1rem;
      line-height: 0.12rem;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      span {
        font-size: 0.12rem;
        font-family: MicrosoftYaHei-Bold;
        font-weight: bold;
        color: rgba(81, 83, 85, 1);
        i {
          font-size: 0.12rem;
          font-family: MicrosoftYaHei-Bold;
          font-weight: bold;
        }
        .el-icon-caret-bottom {
          color: #1dc147;
        }
        .el-icon-caret-top {
          color: #de5151;
        }
      }
      span:nth-last-of-type(1) {
        margin-left: 0.625em;
      }
    }
  }
}
@media (min-width: 1640px) {
  .year_target {
    flex: 1;
    .huanTongBi {
      width: 71.89%;
    }
  }
}
@media (min-width: 1410px) and (max-width: 1639px) {
  .target {
    flex-wrap: wrap;
    .year_target {
      margin-top: 5px;
      flex: 0 0 48%;
      .huanTongBi {
        width: 40%;
      }
    }
  }
}
@media (max-width: 1409px) {
  .target {
    flex-wrap: wrap;
    .year_target {
      margin-top: 5px;
      flex: 0 0 98%;
      .huanTongBi {
        width: 20%;
      }
    }
  }
}

.chart_gcfx_borrowTrend {
  margin: 5px 15px;
  padding: 10px;
  position: relative;
  background: rgba(246, 248, 250, 0);
  border: 1px solid rgba(200, 211, 223, 1);
  border-radius: 4px;
}
.chart_title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(55, 56, 57, 1);
}
.weiDu {
  width: 120px;
  height: 36px;
  margin: 0 10px -3px 20px;
}
.downLoad_collect {
  position: absolute;
  top: 10px;
  right: 16px;
}
.year_target {
  &:hover {
    transform: translate3d(0, -2px, 0);
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
