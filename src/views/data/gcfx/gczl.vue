<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-07-29 09:32:17
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:21:34
 -->
<template>
  <div class="gczl common__content">
    <el-scrollbar>
      <div class="content">
        <td-content-header>
          馆藏总览
        </td-content-header>
        <div class="content__header">
          <div class="header__line">
            <div>
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
                  {{
                    scope.data.areaName
                  }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                    scope.data.areaId | libCounts
                  }}
                </template>
              </el-cascader>
            </div>

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
            </div>
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
      <!-- 图表 -->
      <div class="chart" style="overflow: hidden;">
        <div class="chart_gczl">
          <span class="chart_title">馆藏变化情况</span>
          <i class="el-icon-question chart_des">
            <span class="text">
              计算规则:文献流通数(册/馆藏)文就总数
              (册)数据含义:反映馆藏文献有多少被读者利用,是衡量图书馆工作效果的主要尺度,从中不但可看出读者工作服务质量的高低,也可看出馆藏质量的高低
            </span>
          </i>
          <el-select
            filterable
            v-model="weiDu"
            placeholder="请选择"
            size="mini"
            class="weiDu"
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
            style="marginRight:5px"
            :clearable="false"
            value-format="yyyy-MM-dd"
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
            size="mini"
            :clearable="false"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>

          <el-button size="mini" @click="downLoadData" class="downLoad"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-histogram
              :data="chartData"
              :settings="chartSettings"
              :toolbox="toolbox"
              :colors="colors"
              :tooltip="tooltip"
              :extend="extend_gc"
            ></ve-histogram>
          </div>
        </div>
        <div class="chartExcel">
          <a
            class="chart_title chart_title1"
            :class="{ active: currentBottomMode === 1 }"
            href="javascript:void(0)"
            @click="toggleBig"
            >各大类馆藏详情</a
          >

          <a
            class="chart_title chart_title2"
            :class="{ active: currentBottomMode === 2 }"
            style="marginLeft:20px"
            href="javascript:void(0)"
            @click="toggleclassify"
            >各部类馆藏详情</a
          >
          <el-button
            size="mini"
            @click="downLoadDataClassify"
            class="downLoad"
            v-if="this.currentBottomMode === 1"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <el-button
            size="mini"
            @click="downLoadDataClassifyFive"
            class="downLoad"
            v-if="this.currentBottomMode === 2"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <el-table
            :data="tableData"
            stripe
            style="width: 100%;marginTop:20px"
            v-loading="loading"
          >
            <el-table-column prop="classify" label="大类" width="180">
            </el-table-column>
            <el-table-column prop="marcty_count" label="馆藏种数" width="180">
            </el-table-column>
            <el-table-column prop="marcshuce_count" label="馆藏册数">
            </el-table-column>
            <el-table-column prop="marctyinfo_borrow_count" label="借阅种数">
            </el-table-column>
            <el-table-column prop="marcshuce_borrow_count" label="借阅册数">
            </el-table-column>
            <el-table-column prop="marctyinfo_borrow_avg" label="平均借阅册数">
            </el-table-column>
            <el-table-column prop="marcty_userate" label="文献利用率">
            </el-table-column>
          </el-table>
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
  vchartCollect,
  vchartCollectExcel,
  classify,
  classifyExcel,
  classifyFive,
  classifyFiveExcel
} from "api/data";
import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
// import { categoriesJyfx } from "@/utils/24categories";

let that;
export default {
  name: "da_gczl",
  data() {
    this.dateUserRateMap = {};
    this.chartSettings = {
      showLine: ["新增馆藏"],
      axisSite: { right: ["新增馆藏"] },
      yAxisType: ["0.[00]a", "normal"],
      yAxisName: ["馆藏/册", "增量/册"]
    };
    this.toolbox = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "馆藏变化"
        }
      }
    };
    this.colors = ["#F79700", "#50A3FF"];
    this.tooltip = {
      trigger: "axis",
      formatter: params => {
        let label = "";
        label += `${params[0].axisValue} <br />`;
        label += `利用率: ${this.dateUserRateMap[params[0].axisValue]} <br />`;
        label += `${params[0].marker} ${params[0].seriesName}: ${
          params[0].value
        } <br />`;
        if (params[1]) {
          label += `${params[1].marker} ${params[1].seriesName}: ${
            params[1].value
          } <br />`;
        }
        return label;
      }
    };
    this.extend_gc = {
      series: {
        barMaxWidth: 40
      }
    };
    this.options = [
      { value: 1, label: "月度" },
      { value: 2, label: "季度" },
      { value: 3, label: "年度" }
    ];
    return {
      loading: false,
      currentBottomMode: 1,
      tongjiDisabled: false,
      // 区域是否触发
      isSelectRegion: false,
      region: [],
      regionArr: [],
      // 区域id
      areaId: "",
      memberLib: "",
      memberLibArr: [],
      tableData: [],
      weiDu: 1,
      // 时间传参
      date1: "",
      date2: "",
      selectDate: [],
      idArr: {},
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
      chartData: {
        columns: ["日期", "新增馆藏", "馆藏总量"],
        rows: []
      }
    };
  },
  filters: {
    libCounts(key) {
      return that.idArr[key];
    }
  },
  methods: {
    // 查询馆id对应的区域
    searchLibArea(libId) {
      let params = {
        libId
      };
      searchLibArea(params).then(res => {
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
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = treeData;
        this.areaId = "";
      });
    },
    // 树形馆的对应数量
    treeLibCount() {
      treeLibCount().then(res => {
        this.idArr = res.data;
      });
    },
    // 区域对应的馆
    searchLib(areaId) {
      let params = {
        areaId
      };
      searchLib(params).then(res => {
        if (!res.data.length) {
          this.$message.error("该区域暂没有馆，请重新选择");
          this.memberLibArr = [];
          this.tongjiDisabled = true;
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

      let month1 =
        val[0].getMonth() + 1 < 10
          ? "0" + (val[0].getMonth() + 1)
          : val[0].getMonth() + 1;
      let date1 =
        val[0].getDate() < 10 ? "0" + val[0].getDate() : val[0].getDate();
      this.date1 = val[0].getFullYear() + "-" + month1 + "-" + date1;
      // 结束日期
      let month2 =
        val[1].getMonth() + 1 < 10
          ? "0" + (val[1].getMonth() + 1)
          : val[1].getMonth() + 1;
      let date2 =
        val[1].getDate() < 10 ? "0" + val[1].getDate() : val[1].getDate();
      this.date2 = val[1].getFullYear() + "-" + month2 + "-" + date2;
      this.tongJiTu();
    },
    // 统计图表
    tongJiTu() {
      // 清空图表重新渲染
      this.vchartCollect();
      // 大类变化数据图表
      this.classify();
    },
    // 图表请求
    vchartCollect() {
      let params = {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      vchartCollect(params).then(res => {
        let arr = [];
        for (const key in res.data) {
          const dateX = key;
          let obj = {
            日期: dateX,
            新增馆藏: res.data[key].addMarcshuceCount,
            馆藏总量: res.data[key].totalMarcshuceCount
          };
          this.dateUserRateMap[dateX] = res.data[key].useRate; // 日期-利用率映射
          arr.push(obj);
        }
        this.chartData.rows = arr;
      });
    },
    // 大类变化数据表
    classify() {
      this.loading = true;
      let params = {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      classify(params).then(res => {
        this.loading = false;
        // res.data.forEach(item => {
        //   item.classify = categoriesJyfx[item.classify];
        // });
        // 先不转换
        this.tableData = res.data;
      });
    },
    classifyFive() {
      this.loading = true;
      let params = {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      classifyFive(params).then(res => {
        this.loading = false;
        this.tableData = res.data;
      });
    },
    // 选择区域
    handleChange(value) {
      // 清空馆下拉框
      this.memberLib = "";
      this.searchLib(value);
      this.areaId = value;
      // 触发了区域选择事件
      this.isSelectRegion = true;
    },
    // 导出excel
    downLoadData() {
      // 大类变化数据图表
      downLoadExcel(vchartCollectExcel(), {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region,
        func_name_us: "marchuceDataShow"
      });
    },
    downLoadDataClassify() {
      downLoadExcel(classifyExcel(), {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region,
        func_name_us: "marchuceDataShowClassify"
      });
    },
    downLoadDataClassifyFive() {
      downLoadExcel(classifyFiveExcel(), {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region,
        func_name_us: "marchuceDataShowClassify"
      });
    },
    toggleclassify() {
      this.currentBottomMode = 2;
      this.classifyFive();
    },
    toggleBig() {
      this.currentBottomMode = 1;
      this.classify();
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
.gczl {
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
.chart_gczl,
.chartExcel {
  margin: 5px 15px;
  background: rgba(246, 248, 250, 0);
  border: 1px solid rgba(200, 211, 223, 1);
  border-radius: 4px;
  padding: 10px;
  position: relative;
}
.chart_title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(55, 56, 57, 1);
}
.chart_title1,
.chart_title2 {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(55, 56, 57, 1);
  text-decoration: none;
  cursor: pointer;
  &.active {
    color: #409eff;
  }
}
.chart_des {
  position: relative;
  .text {
    position: absolute;
    left: 20px;
    top: 0;
    width: 350px;
    height: 80px;
    background-color: #d6d6d6;
    font-size: 12px;
    padding: 20px;
    display: none;
    line-height: 20px;
  }
  &:hover .text {
    display: block;
    z-index: 5;
  }
}
.weiDu {
  width: 120px;
  height: 36px;
  margin: 0 10px -3px 20px;
}
.downLoad {
  position: absolute;
  top: 10px;
  right: 16px;
}
</style>
