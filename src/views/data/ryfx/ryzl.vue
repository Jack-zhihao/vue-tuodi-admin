<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-07-29 09:32:17
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:38:19
 -->
<template>
  <div class="gczl common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content__header">
          <div class="header__line" style="marginTop:12px">
            <div>
              <span>选择区域：</span>
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
                :disabled="jinYong"
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
        <div class="chart_gczl" v-if="showImg == 1">
          <span class="chart_title" style="marginRight:15px">读者总览</span>
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

          <el-button size="mini" @click="downLoadData" class="downLoad"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-histogram
              :data="chartData"
              :settings="chartSettings"
              :toolbox="toolbox"
              :colors="colors"
              :events="chartEvents"
              :tooltip="tooltips"
              :extend="extends_zl"
            ></ve-histogram>
          </div>
        </div>
        <!-- 下一级图 -->
        <div class="chart_gczl" v-if="showImg == 2">
          <span
            v-if="showImgUnit == 1"
            class="chart_title"
            style="marginRight:15px"
            >读者单位</span
          >
          <span
            v-if="showImgUnit == 2"
            class="chart_title"
            style="marginRight:15px"
            >读者类型</span
          >
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
            @click="downLoadDataUnit"
            class="downLoad"
            v-if="showImgUnit == 1"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          ><el-button
            size="mini"
            @click="downLoadDataType"
            class="downLoad"
            v-if="showImgUnit == 2"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <div class="xueliTop">
              <el-button-group class="buttons">
                <el-button
                  @click="readerUnit"
                  size="mini"
                  :class="addButton_unit"
                  >读者单位</el-button
                >
                <el-button
                  @click="readerType"
                  size="mini"
                  :class="addButton_type"
                  >读者类型</el-button
                >
              </el-button-group>
            </div>
            <p
              style="color: #0079fe;
                font-size: 14px;
                cursor: pointer;
                marginTop:-20px"
              @click="preStep"
            >
              <icon-svg icon-class="icon-shouqi"></icon-svg> 返回上一级
            </p>
            <ve-histogram
              :data="chartData_readerUnit"
              :settings="chartSettings_readerUnit"
              :toolbox="toolbox_readerUnit"
              :colors="colors_readerUnit"
              :extend="extends_zl"
              v-if="showImgUnit == 1"
            ></ve-histogram>
            <ve-histogram
              :data="chartData_readerType"
              :settings="chartSettings_readerType"
              :toolbox="toolbox_readerType"
              :colors="colors_readerType"
              :extend="extends_zl"
              v-if="showImgUnit == 2"
            ></ve-histogram>
          </div>
        </div>
        <div class="chartExcel">
          <div class="left">
            <span class="chart_title" style="marginRight:15px">性别分布</span>
            <div style="marginTop:15px">
              <ve-ring
                :data="chartData_sex"
                :settings="chartSettings_sex"
                :toolbox="toolbox_sex"
                :colors="colors_sex"
                :tooltip="tooltip"
              ></ve-ring>
            </div>
          </div>
          <div class="right">
            <span class="chart_title" style="marginRight:15px"
              >最受欢迎图书</span
            >
            <el-button size="mini" @click="downLoadSex" class="downLoad"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
            <div style="marginTop:15px" class="popularBook">
              <div class="man">
                <span class="chart_title" style="marginRight:15px;color:#50A3FF"
                  >男生</span
                >
                <div class="man_body" style="width: 100%">
                  <el-table
                    :data="manBooks"
                    style="width: 100%"
                    :show-header="false"
                  >
                    <el-table-column width="40">
                      <template slot-scope="scope">
                        <div
                          class="Ranking Ranking1"
                          v-if="scope.row.index == 1"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking2"
                          v-if="scope.row.index == 2"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking3"
                          v-if="scope.row.index == 3"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking4"
                          v-if="scope.row.index >= 4"
                        >
                          {{ scope.row.index }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="ztming"
                      min-width="115"
                      label="正题名"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                      prop="broNum"
                      label="借阅量"
                      align="center"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
              <div class="woman">
                <span class="chart_title" style="marginRight:15px;color:#FC9292"
                  >女生</span
                >
                <div class="woman_body" style="width: 100%">
                  <el-table
                    :data="womanBooks"
                    style="width: 100%"
                    :show-header="false"
                  >
                    <el-table-column width="40">
                      <template slot-scope="scope">
                        <div
                          class="Ranking Ranking1"
                          v-if="scope.row.index == 1"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking2"
                          v-if="scope.row.index == 2"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking3"
                          v-if="scope.row.index == 3"
                        >
                          {{ scope.row.index }}
                        </div>
                        <div
                          class="Ranking Ranking4"
                          v-if="scope.row.index >= 4"
                        >
                          {{ scope.row.index }}
                        </div>
                      </template>
                    </el-table-column>
                    <el-table-column
                      prop="ztming"
                      min-width="115"
                      label="正题名"
                      show-overflow-tooltip
                    >
                    </el-table-column>
                    <el-table-column
                      prop="broNum"
                      label="借阅量"
                      align="center"
                    >
                    </el-table-column>
                  </el-table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="chartExcel">
          <div class="left">
            <span class="chart_title" style="marginRight:15px"
              >读者年龄结构</span
            >
            <i class="el-icon-question chart_des">
              <span class="text">
                计算规则:读者年龄结构基于读者身份证号，数据涵盖身份证信息完整的读者
              </span>
            </i>
            <el-button size="mini" @click="downLoad_readerAge" class="downLoad"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
            <div style="marginTop:15px">
              <ve-histogram
                :data="chartData_readerAge"
                :toolbox="toolbox_readerAge"
                :colors="colors"
                :settings="setting_readerAge"
                :extend="chartExtend_readerAge"
              ></ve-histogram>
            </div>
          </div>
          <div class="right">
            <span class="chart_title" style="marginRight:15px"
              >管理人员结构</span
            >
            <el-button size="mini" @click="downLoadManager" class="downLoad"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
            <div style="marginTop:15px" class="popularBook2">
              <div class="xueliTop">
                <span
                  style="font-size:14px;
                font-family:Microsoft YaHei;
                font-weight:400;color:#373839"
                  >总人数：<span style="font-size:24px">{{ total }}</span></span
                >
                <span style="fontWeight:700">学历结构</span>
                <!-- <el-button-group class="buttons"> -->
                <!-- <el-button
                    @click="managerXueLi"
                    size="mini"
                    :class="addButtonStyle1"
                    >学历结构</el-button
                  > -->
                <!-- <el-button
                    @click="managerTitle"
                    size="mini"
                    :class="addButtonStyle2"
                    >职称结构</el-button
                  > -->
                <!-- <el-button
                    @click="managerAge"
                    size="mini"
                    :class="addButtonStyle3"
                    >年龄结构</el-button
                  > -->
                <!-- </el-button-group> -->
              </div>
              <ve-ring
                :data="chartData_manager"
                :settings="chartSettings_manager"
                :toolbox="toolbox_manager"
                :colors="colors_manager"
                :tooltip="tooltip_manager"
              ></ve-ring>
            </div>
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
  libReader,
  libReaderExp,
  libReaderDetail,
  libReaderUnitExp,
  libReaderTypeExp,
  personSexTop10Age,
  ageStructureExp,
  sexExp,
  EducationExp,
  Education
} from "api/data";
import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
// import { categoriesJyfx } from "@/utils/24categories";

let that;
export default {
  name: "da_ryzl",
  data() {
    this.dateUserRateMap = {};
    this.chartSettings = {
      yAxisType: ["0.[00]a"],
      yAxisName: ["读者数量"],
      stack: { 馆名: ["读者基数", "新增读者"] }
    };
    this.chartSettings_readerUnit = {
      yAxisName: ["读者数量"],
      xAxisName: ["读者单位"]
    };
    this.chartSettings_readerType = {
      yAxisName: ["读者数量"],
      xAxisName: ["读者类型"]
    };
    this.chartSettings_sex = {};
    this.chartSettings_manager = {};
    this.setting_readerAge = {
      yAxisName: ["人数"],
      xAxisName: ["年龄"]
    };
    this.toolbox = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "读者总览"
        }
      }
    };
    this.toolbox_readerUnit = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "读者单位"
        }
      }
    };
    this.toolbox_readerType = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "读者类型"
        }
      }
    };
    this.toolbox_sex = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "性别分布"
        }
      }
    };
    this.toolbox_manager = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "学历结构"
        }
      }
    };
    this.toolbox_readerAge = {
      feature: {
        saveAsImage: {
          title: "保存",
          type: "png",
          name: "读者年龄结构"
        }
      }
    };
    this.colors = ["#50A3FF", "#11DC9B"];
    this.colors_sex = ["#50A3FF", "#FC9292"];
    this.colors_manager = [
      "#EAA674",
      "#36CBCB",
      "#00C989",
      "#B58BF0",
      "#889BEA"
    ];
    this.colors_readerUnit = ["#50A3FF"];
    this.colors_readerType = ["#50A3FF"];
    this.chartEvents = {
      click: e => {
        if (e) {
          this.showImg = 2;
          this.jinYong = true;
          this.memberLib = e.data.libId;
          this.libReaderDetail();
        }
      }
    };
    this.tooltip = {
      trigger: "item",
      formatter: function(params) {
        let res = "";
        let str = params.name.substr(0, 1);
        res += params.marker + str + "：" + params.value + "人" + "<br>";
        return res;
      }
    };
    this.tooltip_manager = {
      trigger: "item",
      formatter: function(params) {
        let res = "";
        let str = "";
        let num = params.name.indexOf("：");
        str = params.name.substring(0, num);
        res += params.marker + str + "：" + params.percent + "%" + "<br/>";

        return res;
      }
    };
    this.tooltips = {
      trigger: "axis",
      formatter: function(params) {
        let res = "";
        res +=
          params[0].marker +
          params[0].seriesName +
          ":" +
          params[0].value +
          "<br/>";
        for (let i = 1; i < params.length; i++) {
          res +=
            params[i].marker +
            params[i].seriesName +
            ":" +
            params[i].value +
            "<br/>";
        }
        return res;
      }
    };
    this.chartExtend_readerAge = {
      grid: {
        x: 10,
        x2: 10
      },
      series: {
        barMaxWidth: 40
      }
    };
    this.extends_zl = {
      grid: {
        x: 40,
        x2: 40,
        top: 70
      },
      series: {
        barMaxWidth: 40
      }
    };
    return {
      jinYong: false,
      showImg: 1,
      showImgUnit: 1,
      total: "",
      loading: false,
      currentBottomMode: 1,
      tongjiDisabled: false,
      // 区域是否触发
      isSelectRegion: false,
      region: [],
      // 区域id
      areaId: "",
      regionArr: [],
      memberLib: "",
      memberLibArr: [],
      manBooks: [],
      womanBooks: [],
      indexArr: [],
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
      addButtonStyle1: "addButtonAvailable",
      addButtonStyle2: "addButtonUnAvailable",
      addButtonStyle3: "addButtonUnAvailable",
      addButton_unit: "addButtonAvailable",
      addButton_type: "addButtonUnAvailable",
      chartData: {
        columns: ["馆名", "读者基数", "新增读者"],
        rows: []
      },
      chartData_readerUnit: {
        columns: ["读者单位", "读者数量"],
        rows: []
      },
      chartData_readerType: {
        columns: ["读者类型", "读者数量"],
        rows: []
      },
      chartData_sex: {
        columns: ["性别", "人数"],
        rows: []
      },
      chartData_readerAge: {
        columns: ["年龄", "读者人数"],
        rows: []
      },
      chartData_manager: {
        columns: ["学历结构", "人数"],
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
      this.libReader();
      this.personSexTop10Age();
      this.Education();
      this.libReaderDetail();
    },
    managerXueLi() {
      this.addButtonStyle1 = "addButtonAvailable";
      this.addButtonStyle2 = "addButtonUnAvailable";
      this.addButtonStyle3 = "addButtonUnAvailable";
      this.Education();
    },
    // managerTitle() {
    //   this.addButtonStyle1 = "addButtonUnAvailable";
    //   this.addButtonStyle2 = "addButtonAvailable";
    //   this.addButtonStyle3 = "addButtonUnAvailable";
    // },
    // managerAge() {
    //   this.addButtonStyle1 = "addButtonUnAvailable";
    //   this.addButtonStyle2 = "addButtonUnAvailable";
    //   this.addButtonStyle3 = "addButtonAvailable";
    // },
    readerUnit() {
      this.addButton_unit = "addButtonAvailable";
      this.addButton_type = "addButtonUnAvailable";
      this.showImgUnit = 1;
    },
    readerType() {
      this.addButton_unit = "addButtonUnAvailable";
      this.addButton_type = "addButtonAvailable";
      this.showImgUnit = 2;
    },
    // 图表请求
    libReader() {
      let params = {
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      libReader(params).then(res => {
        let arr = [];
        if (res.data.length > 0) {
          res.data.forEach(item => {
            let obj = {
              馆名: item.tmpS2,
              读者基数: {
                value: item.tmpI1 - item.tmpI2,
                libId: item.tmpS1
              },
              新增读者: {
                value: item.tmpI2,
                libId: item.tmpS1
              }
            };
            arr.push(obj);
          });
        }
        this.chartData.rows = arr;
      });
    },
    // 性别分布、最受欢迎图书、年龄结构
    personSexTop10Age() {
      let params = {
        areaId: this.region,
        libId: this.memberLib
      };
      personSexTop10Age(params).then(res => {
        // console.log(res);
        // 性别环形图
        let arrSex = [];
        let objMan = {
          性别: "男 " + Math.floor(res.data.manPercent * 100) + "%",
          人数: res.data.manNum
        };
        arrSex.push(objMan);
        let objWoman = {
          性别: "女 " + Math.floor(res.data.womanPercent * 100) + "%",
          人数: res.data.womanNum
        };
        arrSex.push(objWoman);
        this.chartData_sex.rows = arrSex;
        // 最受欢迎图书
        let i = 1;
        let j = 1;
        res.data.manTop10.forEach(item => {
          item.index = i;
          i++;
        });
        res.data.womanTop10.forEach(item => {
          item.index = j;
          j++;
        });
        this.manBooks = res.data.manTop10;
        this.womanBooks = res.data.womanTop10;
        // 年龄结构
        let arrYear = [];
        res.data.yearsStatistical.forEach(item => {
          let objYear = {
            年龄: item.field,
            读者人数: item.count
          };
          arrYear.push(objYear);
        });
        this.chartData_readerAge.rows = arrYear;
      });
    },
    // 学历结构
    Education() {
      let params = {
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      Education(params).then(res => {
        let managerArr = [];
        this.total = 0;
        if (res.data.length > 0) {
          res.data.forEach(item => {
            let managerObj = {
              学历结构: item.xueli + "：" + item.count,
              人数: item.count
            };
            managerArr.push(managerObj);
          });
          this.total = res.data[0].total;
        }
        this.chartData_manager.rows = managerArr;
      });
    },
    // 馆读者详情
    libReaderDetail() {
      let params = {
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2
      };
      libReaderDetail(params).then(res => {
        // 读者单位
        let unitArr = [];
        if (res.data.readerUnit.length > 0) {
          res.data.readerUnit.forEach(item => {
            let unitObj = {
              读者单位: item.tmpS1,
              读者数量: item.tmpI1
            };
            unitArr.push(unitObj);
          });
        }
        this.chartData_readerUnit.rows = unitArr;
        // 读者类型
        let readerTypeArr = [];
        if (res.data.readerType > 0) {
          res.data.readerType.forEach(item => {
            let typeObj = {
              读者类型: item.tmpS1,
              读者数量: item.tmpI1
            };
            readerTypeArr.push(typeObj);
          });
        }
        this.chartData_readerType.rows = readerTypeArr;
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
      // 读者总览数据图表
      downLoadExcel(libReaderExp(), {
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region,
        func_name_us: "readerAnalyze"
      });
    },
    downLoadSex() {
      // 性别分布导出
      downLoadExcel(sexExp(), {
        libId: this.memberLib,
        areaId: this.region
      });
    },
    // 年龄结构导出
    downLoad_readerAge() {
      downLoadExcel(ageStructureExp(), {
        libId: this.memberLib,
        areaId: this.region,
        func_name_us: "readerAge"
      });
    },
    // 学历结构导出
    downLoadManager() {
      downLoadExcel(EducationExp(), {
        libId: this.memberLib,
        areaId: this.region,
        func_name_us: "education",
        date1: this.date1,
        date2: this.date2
      });
    },
    // 读者单位导出
    downLoadDataUnit() {
      downLoadExcel(libReaderUnitExp(), {
        libId: this.memberLib,
        func_name_us: "readerUnit",
        date1: this.date1,
        date2: this.date2
      });
    },
    // 读者类型导出
    downLoadDataType() {
      downLoadExcel(libReaderTypeExp(), {
        libId: this.memberLib,
        func_name_us: "readerType",
        date1: this.date1,
        date2: this.date2
      });
    },
    toggleclassify() {
      this.currentBottomMode = 2;
      this.classifyFive();
    },
    toggleBig() {
      this.currentBottomMode = 1;
      this.classify();
    },
    preStep() {
      this.showImg = 1;
      this.jinYong = false;
      this.tongJiTu();
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
.chartExcel {
  display: flex;
  justify-content: space-between;
  > div {
    background: rgba(246, 248, 250, 0);
    border: 1px solid rgba(200, 211, 223, 1);
    border-radius: 4px;
    padding: 10px;
  }
  .left {
    margin-right: 30px;
    flex: 1;
    position: relative;
  }
  .right {
    position: relative;
    flex: 1;
    .popularBook {
      background: rgba(246, 248, 250, 0);
      // border: 1px solid rgba(200, 211, 223, 1);
      border-radius: 4px;
      padding: 10px;
      display: flex;
      justify-content: space-between;
      .man {
        flex: 1;
        margin-right: 30px;
        .man_body {
          background-color: #f8fafc;
          border-top: 2px solid #50a3ff;
          padding-top: 10px;
          .Ranking {
            width: 24px;
            height: 24px;

            border-radius: 4px;
            color: #fff;
            text-align: center;
          }
          .Ranking1 {
            background: rgba(222, 81, 81, 1);
          }
          .Ranking2 {
            background: rgba(254, 137, 0, 1);
          }
          .Ranking3 {
            background: rgba(235, 178, 6, 1);
          }
          .Ranking4 {
            background: rgba(186, 188, 190, 1);
          }
        }
      }
      .woman {
        flex: 1;
        .woman_body {
          background-color: #fbf6f6;
          border-top: 2px solid #fc9292;
          padding-top: 10px;
          .Ranking {
            width: 24px;
            height: 24px;

            border-radius: 4px;
            color: #fff;
            text-align: center;
          }
          .Ranking1 {
            background: rgba(222, 81, 81, 1);
          }
          .Ranking2 {
            background: rgba(254, 137, 0, 1);
          }
          .Ranking3 {
            background: rgba(235, 178, 6, 1);
          }
          .Ranking4 {
            background: rgba(186, 188, 190, 1);
          }
        }
      }
    }
  }
}
.chart_title {
  font-size: 16px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  color: rgba(55, 56, 57, 1);
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

.downLoad {
  position: absolute;
  top: 10px;
  right: 16px;
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
