<!--
 * @Description: 
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:48
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:16:16
 -->
<template>
  <div class="dbqk common__content">
    <el-scrollbar>
      <div class="content">
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
        <td-content-header>
          数据指标
        </td-content-header>
        <div class="content__header">
          <div class="header__line">
            <span class="label">人均册数：</span>
            <el-input
              v-model="per_avg_book"
              placeholder="请输入人均册数"
              size="mini"
              @change="handleAvg"
            ></el-input>

            <span class="label">人均年增长：</span>
            <el-input
              v-model="per_avg_year_growth"
              placeholder="请输入人均年增长"
              size="mini"
              @change="handle_year_growth"
            ></el-input>
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div class="chart">
        <div class="chart_Borrow">
          <div
            style="display:flex;alignItems:center;justifyContent:space-between"
          >
            <div>
              <span class="desc" style="marginRight:22px">达标情况</span>
              <el-date-picker
                v-model="year"
                type="year"
                placeholder="选择年"
                size="mini"
                @change="selectYear"
              >
              </el-date-picker>
            </div>
            <el-button
              size="mini"
              @click="downLoadData_readerBRate"
              class="downLoad_kinds"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
          </div>
          <div class="middle_des middle_des_borrow">
            <span class="ceshu"
              >统计馆总数：<span class="ceshuNum">{{
                libCounts_total
              }}</span></span
            >
            |
            <span class="ceshu"
              >达标馆数：<span class="ceshuNum">{{
                libCounts_finish
              }}</span></span
            >
            |
            <span
              >达标率：<span class="ceshuNum">{{ rate_finish }}</span></span
            >
          </div>
          <ve-histogram
            :data="chartData_standardStatus"
            :settings="borrowSettings"
            :toolbox="toolbox_borrowReturn"
            :colors="colors"
            :mark-line="markLine"
            :extend="chartExtend"
          >
          </ve-histogram>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  standardStatus,
  searchLib,
  searchLibArea,
  standardStatusExp
} from "api/data";
import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
import "echarts/lib/component/markLine";
let that;
export default {
  name: "da_dbqk",
  data() {
    this.borrowSettings = {
      area: true,
      yAxisName: ["册"],
      xAxisName: ["馆名"]
    };
    this.toolbox_borrowReturn = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "达标情况"
        }
      }
    };
    this.colors = ["#04A2DB", "#03CC87"];
    this.chartExtend = {
      grid: {
        x: 20,
        x2: 20
      },
      series: {
        barMaxWidth: 40
      }
    };
    this.markLine = {
      data: [
        {
          name: "达标人均册数",
          yAxis: 25,
          symbol: "circle",
          lineStyle: {
            color: "#04A2DB "
          },
          label: {
            position: "end"
          }
        },
        {
          name: "达标人均年增长册数",
          yAxis: 1,
          symbol: "circle",
          lineStyle: {
            color: "#03CC87"
          },
          label: {
            position: "end"
          }
        }
      ],
      itemStyle: {
        normal: {
          lineStyle: {
            type: "dashed",
            width: 2
          },
          label: {
            // position: "end",
            formatter: "{c}",
            fontSize: 12
          }
        }
      }
    };
    return {
      // 时间传参
      year_params: "",
      year: "",
      selectDate: [],
      region: [],
      regionArr: [],
      // 区域id
      areaId: "",
      memberLib: "",
      memberLibArr: [],
      isShow: false,
      // 区域是否触发
      isSelectRegion: false,
      idArr: {},
      chartData_standardStatus: {
        columns: ["馆名", "人均册数", "人均年增长册数"],
        rows: []
      },
      // 统计按钮禁用
      tongjiDisabled: false,
      // // 人均册数
      per_avg_book: 25,
      // 人均年增长册数
      per_avg_year_growth: 1,
      // 统计馆总数
      libCounts_total: "",
      // 达标馆数
      libCounts_finish: "",
      // 达标率
      rate_finish: ""
    };
  },
  filters: {
    libCounts(key) {
      return that.idArr[key];
    }
  },
  methods: {
    // 获取当前年月日
    currentDate() {
      // 默认界面显示当年的年月日到现在
      var currentDate = new Date();
      var year = currentDate.getFullYear();
      this.year = currentDate;
      this.year_params = year;
      // 显示当前登录的馆
      this.memberLib = this.$store.getters.userInfo.libId;
      this.tongJiTu();
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
    // 选择区域
    handleChange(value) {
      // 清空馆下拉框
      this.memberLib = "";
      this.searchLib(value);
      this.areaId = value;
      // 触发了区域选择事件
      this.isSelectRegion = true;
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
    // 选择年份
    selectYear(val) {
      var year = val.getFullYear();
      this.year_params = year;
      this.year = val;
      this.tongJiTu();
    },
    // 请求数据图表
    standardStatus() {
      let params = {
        libId: this.memberLib,
        areaId: this.region,
        year: this.year_params,
        per_avg_year_growth: this.per_avg_year_growth,
        per_avg_book: this.per_avg_book,
        type: 1
      };
      standardStatus(params).then(res => {
        this.libCounts_total = res.data.libCount;
        this.libCounts_finish = res.data.okLib;
        this.rate_finish = res.data.okRate;
        // 图表
        let arr = [];
        if (res.data.chartList.length > 0) {
          res.data.chartList.forEach(item => {
            let obj = {
              馆名: item.libName,
              人均册数: item.per_avg_book,
              人均年增长册数: item.per_avg_year_growth
            };
            arr.push(obj);
          });
        }
        this.chartData_standardStatus.rows = arr;
      });
    },
    tongJiTu() {
      this.standardStatus();
    },
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
    downLoadData_readerBRate() {
      downLoadExcel(standardStatusExp(), {
        func_name_us: "targetSituation",
        libId: this.memberLib,
        areaId: this.region,
        year: this.year_params,
        per_avg_year_growth: this.per_avg_year_growth,
        per_avg_book: this.per_avg_book,
        type: 1
      });
    },
    handle_year_growth(val) {
      let re = new RegExp("^[0-9]*[1-9][0-9]*$");
      if (val.match(re) == null) {
        this.$message.error("请输入正整数");
        return false;
      } else {
        this.markLine.data[1].yAxis = val;
        this.tongJiTu();
      }
    },
    handleAvg(val) {
      let re = new RegExp("^[0-9]*[1-9][0-9]*$");
      if (val.match(re) == null) {
        this.$message.error("请输入正整数");
        return false;
      } else {
        this.markLine.data[0].yAxis = val;
        this.tongJiTu();
      }
    }
  },
  beforeCreate: function() {
    that = this;
  },
  created() {
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
.dbqk {
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
    margin-top: 10px;
  }
}
.chart_Borrow {
  margin: 5px 15px;
  background: rgba(246, 248, 250, 0);
  border: 1px solid rgba(200, 211, 223, 1);
  padding: 10px;
  padding-right: 20px;
  border-radius: 4px;
}
.desc {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(55, 56, 57, 1);
}
.ceshu {
  color: #373839;
  font-size: 14px;
}
.ceshuNum {
  color: #373839;
  font-size: 24px;
  font-family: MicrosoftYaHei;
  font-weight: 400;
}
.middle_des {
  margin: 10px 0;
}
.middle_des_borrow {
  position: relative;
  margin: 20px 0 10px;
}
</style>
