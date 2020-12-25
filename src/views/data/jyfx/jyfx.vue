<!--
 * @Description: 
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:48
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:33:16
 -->
<template>
  <div class="sjzl common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content__header">
          <div class="header__line" style="marginTop:10px">
            <!-- 选择区域 -->
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
            <!-- 成员馆 -->
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
          <div class="header__line">
            <span class="label">时间范围：</span>
            <el-date-picker
              v-model="date1"
              type="month"
              placeholder="选择开始月"
              size="mini"
              @change="selectDate1"
              value-format="yyyy-MM-dd"
              :clearable="false"
              class="el-date-editor--datetime"
              style="marginRight:3px"
            >
            </el-date-picker>
            <span>- &nbsp;</span>
            <el-date-picker
              v-model="date2"
              type="month"
              placeholder="选择结束月"
              size="mini"
              @change="selectDate2"
              value-format="yyyy-MM-dd"
              :clearable="false"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <!-- 图表 -->
      <div class="chart">
        <div class="chart_collect">
          <span class="desc">读者借阅率</span>
          <i class="el-icon-question chart_des_literature">
            <span class="text_literature">
              计算公式：时间段读者借阅文献数/借阅读者人数<br />意义：反应每个读者时间段平均借阅文献数
            </span>
          </i>
          <el-button
            size="mini"
            @click="downLoadData_readerBRate"
            class="downLoad_kinds"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-line
              :data="chartData_readerBRate"
              :toolbox="toolbox_readerBRate"
              :colors="colors"
              :settings="chartSettings_chartData_readerBRate"
            >
            </ve-line>
          </div>
        </div>
        <div class="chart_reader">
          <span class="desc">文献流通率</span>
          <i class="el-icon-question chart_des_literature">
            <span class="text_literature">
              计算公式：文献流通册数/馆藏中提供流通的文献数<br />意义：文献流通率反映图书馆馆藏文献的利用情况和读者的阅读需求程度，是衡量馆藏文献质量和流通工作的重要尺度，也是研究读者的重要素材
            </span>
          </i>
          <el-button
            size="mini"
            @click="downLoadData_CirculationRate"
            class="downLoad_kinds"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div style="marginTop:15px">
            <ve-line
              :data="chartData_literatureCirculationRate"
              :toolbox="toolbox_literatureCirculationRate"
              :colors="colors"
              :settings="chartSettings_CirculationRate"
            >
            </ve-line>
          </div>
        </div>
        <div class="chart_Borrow">
          <span class="desc">热门分类</span>
          <el-button
            size="mini"
            @click="downLoadData_topTen"
            class="downLoad_kinds"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <el-button
            size="mini"
            @click="downLoadData_remen"
            class="downLoad_kind"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
          <div class="circle" style="marginTop:15px">
            <!-- 外盒包住,以后canvas导出 -->
            <div id="box_circle" ref="box_circle">
              <div
                v-for="(item, index) in tableData"
                :key="index"
                :class="'circle' + (index + 1)"
              >
                <p>{{ item.name }}</p>
              </div>
            </div>
            <div class="tables">
              <el-table
                :data="tableData"
                stripe
                style="width: 75%;position:absolute;right:0px;top:65px"
              >
                <el-table-column
                  prop="name"
                  label="类型"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  prop="intVal"
                  label="借阅册数"
                  show-overflow-tooltip
                  align="center"
                >
                </el-table-column>
              </el-table>
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
  borrowAnalysis,
  readerBRateExport,
  booksCirculationExport,
  classifyTopTenExp
} from "api/data";

import "echarts/lib/component/toolbox";
import { downLoadExcel } from "utils/utils";
import { categoriesJyfx } from "@/utils/24categories";
import html2canvas from "html2canvas";

let that;
export default {
  name: "da_jyfx",
  data() {
    this.toolbox_readerBRate = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "读者借阅率"
        }
      }
    };
    this.toolbox_literatureCirculationRate = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "文献流通率"
        }
      }
    };
    this.chartSettings_chartData_readerBRate = {
      yAxisName: ["%"],
      xAxisName: ["日期"]
    };
    this.chartSettings_CirculationRate = {
      yAxisName: ["%"],
      xAxisName: ["日期"]
    };
    this.colors = ["#50A3FF"];
    return {
      options: [
        { value: 1, label: "日维度" },
        { value: 2, label: "月维度" },
        { value: 3, label: "年维度" }
      ],
      weiDu: 2,
      selectDate: [],
      // 时间传参
      date1: "",
      date2: "",
      region: [],
      regionArr: [],
      // 区域id
      areaId: "",
      memberLib: "",
      memberLibArr: [],
      tableData: [],
      isShow: false,
      // 区域是否触发
      isSelectRegion: false,
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            }
          },
          {
            text: "最近半年",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 180);
              picker.$emit("pick", [start, end]);
            }
          }
        ],
        disabledDate(time) {
          return time.getTime() > Date.now() - 8.64e6;
        }
      },
      idArr: {},
      // 馆藏
      chartData_readerBRate: {
        columns: ["日期", "借阅率"],
        rows: []
      },
      chartData_literatureCirculationRate: {
        columns: ["日期", "流通率"],
        rows: []
      },
      timesPeriod: "",
      // 统计按钮禁用
      tongjiDisabled: false,
      imgUrl: ""
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
      let selectDate = [];
      selectDate[0] = new Date(year, 0, 1);
      // 当前月的最后一天
      selectDate[1] = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0
      );
      this.selectDate = selectDate;
      // 显示当前登录的馆
      this.memberLib = this.$store.getters.userInfo.libId;
      // 时间传参赋值
      this.selectHandleDate(this.selectDate);
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
      // 判断时间段
      let ms1 = d1.getTime(); //时间戳
      let ms2 = d2.getTime();
      let day1 = ms1 / 1000 / 3600 / 24;
      let day2 = ms2 / 1000 / 3600 / 24;
      this.timesPeriod = day2 - day1;
      if (this.timesPeriod < 30) {
        this.weiDu = 1; //小于30天，自动更新日维度
      } else {
        this.weiDu = 2; //更新月维度
      }
      this.tongJiTu();
    },
    // 请求图表数据
    borrowAnalysis() {
      let params = {
        areaId: this.region,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2
      };
      borrowAnalysis(params).then(res => {
        // 借阅率
        let arr = [];
        if (res.data.readerBroRate.length > 0) {
          res.data.readerBroRate.forEach(item => {
            let obj = {
              日期: item.flag,
              借阅率: item.quotient
            };
            arr.push(obj);
          });
        }
        this.chartData_readerBRate.rows = arr;
        // 文献流通率
        let arr2 = [];
        if (res.data.docCirculationRate.length > 0) {
          res.data.docCirculationRate.forEach(item => {
            let obj = {
              日期: item.flag,
              流通率: item.quotient
            };
            arr2.push(obj);
          });
        }
        this.chartData_literatureCirculationRate.rows = arr2;
        // 分类前十
        if (res.data.hotTopClassify.length > 0) {
          res.data.hotTopClassify.forEach(item => {
            item.name = categoriesJyfx[item.key];
          });
        }
        this.tableData = res.data.hotTopClassify;
      });
    },
    // 统计图表
    tongJiTu() {
      // 借阅分析（读者借阅率和文献流通率）
      this.borrowAnalysis();
    },
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
    // 读者借阅率导出
    downLoadData_readerBRate() {
      downLoadExcel(readerBRateExport(), {
        areaId: this.region,
        libId: this.memberLib,
        func_name_us: "readerBroRate",
        date1: this.date1,
        date2: this.date2
      });
    },
    // 文献流通率导出
    downLoadData_CirculationRate() {
      downLoadExcel(booksCirculationExport(), {
        areaId: this.region,
        libId: this.memberLib,
        func_name_us: "docBroRate",
        date1: this.date1,
        date2: this.date2
      });
    },
    // 导出22分类前十
    downLoadData_topTen() {
      downLoadExcel(classifyTopTenExp(), {
        areaId: this.region,
        libId: this.memberLib,
        func_name_us: "hotClassifyTop10",
        date1: this.date1,
        date2: this.date2
      });
    },
    downLoadData_remen() {
      html2canvas(document.getElementById("box_circle")).then(canvas => {
        // 转成图片，生成图片地址
        this.imgUrl = canvas.toDataURL("image/png");
        this.fileDownload(this.imgUrl);
      });
    },
    // 导出图片
    fileDownload(downloadUrl) {
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      aLink.href = downloadUrl;
      aLink.download = "热门分类.png";
      // 触发点击-然后移除
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
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
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.chart_collect,
.chart_reader,
.chart_Borrow {
  margin: 5px 15px;
  position: relative;
  background: rgba(246, 248, 250, 0);
  border: 1px solid rgba(200, 211, 223, 1);
  padding: 10px;
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
  margin: 40px 0 10px;
}
.huanTongBi {
  color: #919faf;
  font-weight: bold;
}
.huanbi {
  color: #de5151;
}
.tongbi {
  color: #1dc147;
}
.borrow,
.back {
  color: #373839;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  position: absolute;
  left: 25px;
  top: -25px;
}
.back {
  left: 205px;
}
.header__filters2 {
  padding: 0 20px 10px 15px;
  span {
    font-size: 0.14rem;
  }
}
.chart_des_literature {
  position: relative;
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
  &:hover .text_literature {
    display: block;
    z-index: 5;
  }
}
.downLoad_kinds {
  position: absolute;
  top: 10px;
  right: 16px;
}
.circle {
  height: 600px;
  position: relative;
  > div {
    position: absolute;
  }
  > div:nth-child(1) {
    left: 0;
  }
  > div:nth-child(2) {
    right: 0;
  }
  .tables {
    height: 100%;
    width: 50%;
    position: absolute;
  }
  #box_circle {
    height: 100%;
    width: 50%;
    div {
      position: absolute;
      color: #373839;
      font-family: MicrosoftYaHei;
      font-weight: 400;
      text-align: center;
      box-sizing: border-box;
      p {
        margin-top: 50%;
        transform: translateY(-50%);
        font-size: 1em;
      }
    }
    .circle1 {
      width: 23.86%;
      height: 0px;
      padding-bottom: 23.86%;
      background: rgba(255, 238, 238, 1);
      border: 1px solid rgba(244, 98, 98, 1);
      margin-left: 43%;
      margin-top: 230px;
      border-radius: 50%;
    }
    .circle2 {
      width: 21.47%;
      height: 0px;
      padding-bottom: 21.47%;
      background: rgba(226, 244, 255, 1);
      border: 1px solid rgba(69, 172, 235, 1);
      margin-left: 9%;
      margin-top: 316px;
      border-radius: 50%;
    }
    .circle3 {
      width: 19.08%;
      height: 0px;
      padding-bottom: 19.08%;
      background: rgba(245, 239, 255, 1);
      border: 1px solid rgba(153, 95, 248, 1);
      margin-left: 43%;
      margin-top: 19px;
      border-radius: 50%;
    }
    .circle4 {
      width: 16.7%;
      height: 0px;
      padding-bottom: 16.7%;
      background: rgba(255, 245, 237, 1);
      border: 1px solid rgba(243, 151, 77, 1);
      margin-left: 35%;
      margin-top: 446px;
      border-radius: 50%;
    }
    .circle5 {
      width: 14.31%;
      height: 0px;
      padding-bottom: 14.31%;
      background: rgba(231, 255, 243, 1);
      border: 1px solid rgba(61, 221, 141, 1);
      margin-left: 61%;
      margin-top: 422px;
      border-radius: 50%;
    }
    .circle6 {
      width: 13.12%;
      height: 0px;
      padding-bottom: 13.12%;
      background: rgba(251, 255, 228, 1);
      border: 1px solid rgba(212, 235, 79, 1);
      margin-left: 14%;
      margin-top: 87px;
      border-radius: 50%;
    }
    .circle7 {
      width: 11.93%;
      height: 0px;
      padding-bottom: 11.93%;
      background: rgba(239, 241, 255, 1);
      border: 1px solid rgba(94, 109, 248, 1);
      margin-left: 25%;
      margin-top: 213px;
      border-radius: 50%;
    }
    .circle8 {
      width: 10.73%;
      height: 0px;
      padding-bottom: 10.73%;
      background: rgba(237, 255, 240, 1);
      border: 1px solid rgba(82, 239, 109, 1);
      margin-left: 70%;
      margin-top: 162px;
      border-radius: 50%;
    }
    .circle9 {
      width: 9.54%;
      height: 0px;
      padding-bottom: 9.54%;
      background: rgba(255, 234, 253, 1);
      border: 1px solid rgba(244, 87, 229, 1);
      margin-left: 80%;
      margin-top: 313px;
      border-radius: 50%;
    }
    .circle10 {
      width: 7.16%;
      height: 0px;
      padding-bottom: 7.16%;
      background: rgba(255, 230, 242, 1);
      border: 1px solid rgba(246, 96, 168, 1);
      margin-left: 83%;
      margin-top: 454px;
      border-radius: 50%;
    }
  }
}
</style>
