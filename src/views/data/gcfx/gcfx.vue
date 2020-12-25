<!--
 * @Description: 
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:48
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:18:38
 -->
<template>
  <div class="gcfx common__content">
    <el-scrollbar>
      <div class="content">
        <td-content-header>
          馆藏分析
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
      <div class="chart">
        <div class="chart_gcfx_circulation_collect">
          <span class="chart_title">流通-藏书比</span>
          <i class="el-icon-question chart_des_circulation_collect">
            <span class="text_circulation_collect">
              计算规则：某类藏书流通量占全部馆藏流通量的百分比与某类藏书占全部藏书的百分比之间的比率
              数据含义：对应占比合理值为1，如该值远大于或小于1是，说明需要对馆藏进行调整，例如对应为5:1，表明该类藏书太少，需要增加；如果为1:5，则表明呆滞书太多而需要进
              行剔除
            </span>
          </i>
          <el-button
            size="mini"
            @click="downLoadData_circulation_collect"
            class="downLoad_collect"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-histogram
              :data="chartData_circulation_collect"
              :toolbox="toolbox_circulation_collect"
              :colors="colors"
              :extend="extend"
            ></ve-histogram>
          </div>
        </div>

        <div class="chart_gcfx_circulation_kinds">
          <span class="chart_title">流通册次-流通种次比</span>
          <i class="el-icon-question chart_des_circulation_kinds">
            <span class="text_circulation_kinds">
              计算规则：流通册数/流通总数
              数据含义：流通册次--流通种次比可反映读者对某类文献复本的需求，该比例可用于评价馆藏复本是否合理，例如某图书馆某类藏书某年流通1.8万册次、3000种次，二者比例为6，因此该类图书需配5个复本。
            </span>
          </i>
          <el-button
            size="mini"
            @click="downLoadData_circulation_kinds"
            class="downLoad_kinds"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-histogram
              :data="chartData_circulation_kinds"
              :toolbox="toolbox_circulation_kinds"
              :colors="colors"
              :extend="extend"
            ></ve-histogram>
          </div>
        </div>

        <div class="chart_gcfx_literature">
          <span class="chart_title">文献入藏情况</span>
          <i class="el-icon-question chart_des_literature">
            <span class="text_literature">
              计算规则:文献流通数(册/馆藏)文就总教
              (册)数据含义:反映馆藏文献有多少被读者利用,是衡量图书馆工作效果的主要尺度,从中不但可看出读者工作服务质量的高低,也可看出馆藏质量的高低
            </span>
          </i>
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
            :clearable="false"
          >
          </el-date-picker>
          <el-button
            size="mini"
            @click="downLoadData_literature"
            class="downLoad_literature"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-line
              :data="chartData_literature"
              :settings="chartSettings_literature"
              :toolbox="toolbox_literature"
              :colors="colors"
            ></ve-line>
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
  circulation_collect,
  circulation_collect_excel,
  literature_collect,
  literature_collect_excel,
  circulation__kinds_excel
} from "api/data";
import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
let that;
export default {
  name: "da_gcfx",
  data() {
    this.toolbox_circulation_collect = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "流通藏书比"
        }
      }
    };
    this.toolbox_circulation_kinds = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "流通册次-种次比"
        }
      }
    };
    this.toolbox_literature = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "文献入藏情况"
        }
      }
    };
    this.chartSettings_literature = {
      area: true
    };
    this.colors = ["#50A3FF", "#F79700"];
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
      date1: "",
      date2: "",
      weiDu: 1,
      selectDate: "",
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
      chartData_circulation_collect: {
        columns: ["分类", "流通藏书比"],
        rows: []
      },
      chartData_circulation_kinds: {
        columns: ["分类", "流通册次-流通种次比"],
        rows: []
      },
      chartData_literature: {
        columns: ["日期", "借阅册数", "入藏册数"],
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
      // 流通藏书比/种次比
      this.circulation_collect();
      // 文献入藏情况
      this.literature_collect();
    },
    // 图表请求
    // 流通藏书比/种次比
    circulation_collect() {
      let params = {
        libId: this.memberLib,
        areaId: this.region
      };
      circulation_collect(params).then(res => {
        let arr_collect = [];
        let arr_kinds = [];
        if (res.data.cirBookList.length > 0) {
          res.data.cirBookList.forEach(item => {
            let obj = {
              分类: item.classify,
              流通藏书比: item.cirBookRate
            };
            arr_collect.push(obj);
          });
        }
        this.chartData_circulation_collect.rows = arr_collect;
        if (res.data.cirKindList.length > 0) {
          res.data.cirKindList.forEach(item => {
            let obj = {
              分类: item.classify,
              "流通册次-流通种次比": item.cirKindRate
            };
            arr_kinds.push(obj);
          });
        }
        this.chartData_circulation_kinds.rows = arr_kinds;
      });
    },
    literature_collect() {
      let params = {
        libId: this.memberLib,
        areaId: this.region,
        dateType: this.weiDu,
        date1: this.date1,
        date2: this.date2
      };
      literature_collect(params).then(res => {
        let arr_literature = [];
        if (res.data.length > 0) {
          res.data.forEach(item => {
            let obj = {
              日期: item.tmpS1,
              借阅册数: item.tmpI2,
              入藏册数: item.tmpI1
            };
            arr_literature.push(obj);
          });
        }
        this.chartData_literature.rows = arr_literature;
      });
    },
    // 流通藏书比---导出excel
    downLoadData_circulation_collect() {
      downLoadExcel(circulation_collect_excel(), {
        libId: this.memberLib,
        areaId: this.region,
        func_name_us: "cirBook"
      });
    },
    // 流通种次册次比---导出excel
    downLoadData_circulation_kinds() {
      downLoadExcel(circulation__kinds_excel(), {
        libId: this.memberLib,
        areaId: this.region,
        func_name_us: "cirKind"
      });
    },
    downLoadData_literature() {
      downLoadExcel(literature_collect_excel(), {
        func_name_us: "bookIns",
        libId: this.memberLib,
        areaId: this.region,
        dateType: this.weiDu,
        date1: this.date1,
        date2: this.date2
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
.chart_gcfx_literature,
.chart_gcfx_circulation_collect,
.chart_gcfx_circulation_kinds {
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
.chart_des_circulation_collect,
.chart_des_circulation_kinds,
.chart_des_literature {
  position: relative;
  .text_circulation_collect,
  .text_circulation_kinds,
  .text_literature {
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
  &:hover .text_circulation_collect,
  &:hover .text_circulation_kinds,
  &:hover .text_literature {
    display: block;
    z-index: 5;
  }
}
.weiDu {
  width: 120px;
  height: 36px;
  margin: 0 10px -3px 20px;
}
.downLoad_collect,
.downLoad_kinds,
.downLoad_literature {
  position: absolute;
  top: 10px;
  right: 16px;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
