<template>
  <div class="sjzl common__content">
    <el-scrollbar>
      <td-content-header>
        数据总览
      </td-content-header>
      <div class="content">
        <div class="content__header">
          <div class="header__line">
            <el-select
              filterable
              v-model="weiDu"
              placeholder="请选择"
              size="mini"
              @change="handleWeiDu"
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
              style="marginRight:3px"
              :clearable="false"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
            <span>- &nbsp;</span>
            <el-date-picker
              v-model="date2"
              align="right"
              type="date"
              placeholder="选择结束日期"
              :picker-options="endDatePicker"
              @change="selectDate2"
              size="mini"
              :clearable="false"
              class="el-date-editor--datetime"
            >
            </el-date-picker>

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

            <span style="marginLeft:13px" class="label">成员馆：</span>

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

      <!-- 图表 -->
      <div class="chart">
        <div class="chart_collect">
          <p class="desc">时间段馆藏增量</p>
          <div class="middle_des">
            <span class="ceshu"
              ><span class="ceshuNum">{{ marcshuce_total }}</span
              >册</span
            >
            |
            <span class="ceshu"
              >人均<span class="ceshuNum">{{ marcshuce_person_average }}</span
              >册</span
            >
          </div>
          <div class="huanTongBi">
            <span
              >环比<span class="huanbi"
                ><i class="el-icon-caret-top" v-if="increase_marcshuce_hb">{{
                  marcshuce_huanbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_marcshuce_hb">{{
                  marcshuce_huanbi | jueduizhi
                }}</i></span
              ></span
            >
            <span style="marginLeft:20px" v-if="show_tb"
              >同比<span class="tongbi"
                ><i class="el-icon-caret-top" v-if="increase_marcshuce_tb">{{
                  marcshuce_tongbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_marcshuce_tb">{{
                  marcshuce_tongbi | jueduizhi
                }}</i></span
              ></span
            >
          </div>
          <ve-line
            :data="chartData_collect"
            :settings="collectSettings"
            :toolbox="toolbox_collect"
            :colors="colors"
          >
          </ve-line>
        </div>
        <div class="chart_reader">
          <p class="desc">时间段读者增量</p>
          <div class="middle_des">
            <span class="ceshu"
              ><span class="ceshuNum">{{ reader_total }}</span
              >人</span
            >
          </div>
          <div class="huanTongBi">
            <span
              >环比<span class="huanbi"
                ><i class="el-icon-caret-top" v-if="increase_reader_hb">{{
                  reader_huanbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_reader_hb">{{
                  reader_huanbi | jueduizhi
                }}</i></span
              ></span
            >
            <span style="marginLeft:20px" v-if="show_tb"
              >同比<span class="tongbi"
                ><i class="el-icon-caret-top" v-if="increase_reader_tb">{{
                  reader_tongbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_reader_tb">{{
                  reader_tongbi | jueduizhi
                }}</i></span
              ></span
            >
          </div>
          <ve-line
            :data="chartData_reader"
            :settings="readerSettings"
            :toolbox="toolbox_reader"
            :colors="colors"
          >
          </ve-line>
        </div>
        <div class="chart_Borrow">
          <p class="desc">时间段借还增量</p>
          <div class="middle_des middle_des_borrow">
            <span class="borrow">借出</span>
            <span class="back">归还</span>
            <span class="ceshu"
              ><span class="ceshuNum">{{ borrow_total }}</span
              >册</span
            >
            <span class="line"></span>
            <span class="ceshu"
              >人均借<span class="ceshuNum">{{
                borrowReturn_borrow_average
              }}</span
              >册</span
            >
            <span class="line"></span>
            <span
              ><span class="ceshuNum">{{ return_total }}</span
              >册</span
            >
          </div>
          <div class="huanTongBi">
            <span
              >环比<span class="huanbi"
                ><i class="el-icon-caret-top" v-if="increase_borrow_hb">{{
                  borrow_huanbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_borrow_hb">{{
                  borrow_huanbi | jueduizhi
                }}</i></span
              ></span
            >
            <span style="marginLeft:20px" v-if="show_tb"
              >同比<span class="tongbi"
                ><i class="el-icon-caret-top" v-if="increase_borrow_tb">{{
                  borrow_tongbi | jueduizhi
                }}</i
                ><i class="el-icon-caret-bottom" v-if="reduce_borrow_tb">{{
                  borrow_tongbi | jueduizhi
                }}</i></span
              ></span
            >
          </div>
          <ve-line
            :data="chartData_borrowReturn"
            :settings="borrowSettings"
            :toolbox="toolbox_borrowReturn"
            :colors="colors"
          >
          </ve-line>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  echartData,
  searchLib,
  searchLibArea
} from "api/data";
import "echarts/lib/component/toolbox";
let that;
export default {
  name: "da_sjzl",
  data() {
    this.collectSettings = {
      area: true
    };
    this.toolbox_collect = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "馆藏增量"
        }
      }
    };
    this.readerSettings = {
      area: true
    };
    this.toolbox_reader = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "读者增量"
        }
      }
    };
    this.borrowSettings = {
      area: true
    };
    this.toolbox_borrowReturn = {
      right: 20,
      feature: {
        saveAsImage: {
          title: "保存为图片",
          type: "png",
          name: "借还增量"
        }
      }
    };
    this.colors = ["#04A2DB", "#03CC87"];
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
      isShow: false,
      // 区域是否触发
      isSelectRegion: false,
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
      idArr: {},
      // 馆藏
      chartData_collect: {
        columns: ["日期", "增量"],
        rows: []
      },
      chartData_reader: {
        columns: ["日期", "增量"],
        rows: []
      },
      chartData_borrowReturn: {
        columns: ["日期", "借出", "归还"],
        rows: []
      },
      // 是否展示同比
      show_tb: true,
      increase_marcshuce_hb: false,
      reduce_marcshuce_hb: false,
      increase_marcshuce_tb: false,
      reduce_marcshuce_tb: false,
      increase_reader_hb: false,
      increase_reader_tb: false,
      reduce_reader_hb: false,
      reduce_reader_tb: false,
      increase_borrow_hb: false,
      increase_borrow_tb: false,
      reduce_borrow_hb: false,
      reduce_borrow_tb: false,
      marcshuce_total: "0",
      marcshuce_person_average: "0",
      marcshuce_huanbi: "0",
      marcshuce_tongbi: "0",
      reader_total: "0",
      reader_huanbi: "0",
      reader_tongbi: "0",
      borrowReturn_borrow_average: "0",
      borrow_total: "0",
      return_total: "0",
      borrow_huanbi: "0",
      borrow_tongbi: "0",
      timesPeriod: "",
      // 统计按钮禁用
      tongjiDisabled: false
    };
  },
  filters: {
    libCounts(key) {
      return that.idArr[key];
    },
    jueduizhi(value) {
      if (value) {
        return Math.abs(parseFloat(value)) + "%";
      } else {
        return "";
      }
    }
  },
  computed: {},
  methods: {
    // 维度选择
    handleWeiDu() {
      // 根据已经选择的时间段，锁定维度
      // if (this.timesPeriod < 30) {
      //   this.weiDu = 1;
      // } else {
      //   this.weiDu = 2;
      // }
      // 按照要求不要锁定维度
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
    // // 选择馆
    // selectLib(val) {
    //   this.tongJiTu();
    // },
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
    // 选择开始时间
    selectDate1(val) {
      let date1 = new Date(val);
      let year = date1.getFullYear();
      let month =
        date1.getMonth() + 1 < 10
          ? "0" + (date1.getMonth() + 1)
          : date1.getMonth() + 1;
      let d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      this.date1 = year + "-" + month + "-" + d;
      // 判断时间段
      let ms1 = date1.getTime(); //时间戳
      let ms2 = new Date(this.date2).getTime();
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
    selectDate2(val) {
      let date2 = new Date(val);
      let year = date2.getFullYear();
      let month =
        date2.getMonth() + 1 < 10
          ? "0" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let d = date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
      this.date2 = year + "-" + month + "-" + d;
      // 判断时间段
      let ms1 = new Date(this.date1).getTime(); //时间戳
      let ms2 = date2.getTime();
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
    echartData() {
      let params = {
        dateType: this.weiDu,
        libId: this.memberLib,
        date1: this.date1,
        date2: this.date2,
        areaId: this.region
      };
      echartData(params).then(res => {
        // console.log(res);
        const {
          marcshuce_total,
          marcshuce_person_average,
          marcshuce_tongbi,
          marcshuce_huanbi,
          marcshuceMap,
          reader_total,
          reader_huanbi,
          reader_tongbi,
          readerMap,
          borrowMap,
          borrowReturn_borrow_average,
          borrow_huanbi,
          borrow_tongbi,
          borrow_total,
          return_total,
          returnMap
        } = res.data;
        this.marcshuce_total = marcshuce_total;
        this.marcshuce_person_average = marcshuce_person_average;
        this.marcshuce_tongbi = marcshuce_tongbi;
        this.marcshuce_huanbi = marcshuce_huanbi;
        // 馆藏环比
        if (parseFloat(marcshuce_huanbi) > 0) {
          this.increase_marcshuce_hb = true;
          this.reduce_marcshuce_hb = false;
        } else {
          this.increase_marcshuce_hb = false;
          this.reduce_marcshuce_hb = true;
        }
        // 馆藏同比
        if (marcshuce_tongbi) {
          // 有返回才显示同比
          this.show_tb = true;
          if (parseFloat(marcshuce_tongbi) > 0) {
            this.increase_marcshuce_tb = true;
            this.reduce_marcshuce_tb = false;
          } else {
            this.reduce_marcshuce_tb = true;
            this.increase_marcshuce_tb = false;
          }
        } else {
          // 没有返回，隐藏同比
          this.show_tb = false;
        }
        // 读者环比
        if (parseFloat(reader_huanbi) > 0) {
          this.increase_reader_hb = true;
          this.reduce_reader_hb = false;
        } else {
          this.reduce_reader_hb = true;
          this.increase_reader_hb = false;
        }
        // 读者同比
        if (parseFloat(reader_tongbi) > 0) {
          this.increase_reader_tb = true;
          this.reduce_reader_tb = false;
        } else {
          this.reduce_reader_tb = true;
          this.increase_reader_tb = false;
        }
        // 借 环比
        if (parseFloat(borrow_huanbi) > 0) {
          this.increase_borrow_hb = true;
          this.reduce_borrow_hb = false;
        } else {
          this.reduce_borrow_hb = true;
          this.increase_borrow_hb = false;
        }
        // 借 同比
        if (parseFloat(borrow_tongbi) > 0) {
          this.increase_borrow_tb = true;
          this.reduce_borrow_tb = false;
        } else {
          this.reduce_borrow_tb = true;
          this.increase_borrow_tb = false;
        }
        this.reader_total = reader_total;
        this.reader_huanbi = reader_huanbi;
        this.reader_tongbi = reader_tongbi;
        this.borrowReturn_borrow_average = borrowReturn_borrow_average;
        this.borrow_huanbi = borrow_huanbi;
        this.borrow_tongbi = borrow_tongbi;
        this.borrow_total = borrow_total;
        this.return_total = return_total;
        // 馆藏增量
        for (const key in marcshuceMap) {
          const Increment = marcshuceMap[key];
          const dateX = key;
          let obj = {
            日期: dateX,
            增量: Increment
          };
          this.chartData_collect.rows.push(obj);
        }
        // 读者增量
        for (const key in readerMap) {
          const Increment = readerMap[key];
          const dateX = key;
          let obj = {
            日期: dateX,
            增量: Increment
          };
          this.chartData_reader.rows.push(obj);
        }
        // 借还增量
        for (const key in borrowMap) {
          const borrowCounts = borrowMap[key];
          const dateX = key;
          let obj = {
            日期: dateX,
            借出: borrowCounts,
            归还: ""
          };
          this.chartData_borrowReturn.rows.push(obj);
        }
        this.chartData_borrowReturn.rows.forEach(item => {
          item["归还"] = returnMap[item["日期"]];
        });
        // console.log(this.chartData_borrowReturn.rows);
      });
    },
    // 统计图表
    tongJiTu() {
      // 清空图表重新渲染
      this.chartData_collect.rows = [];
      this.chartData_reader.rows = [];
      this.chartData_borrowReturn.rows = [];
      this.echartData();
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
.chart_collect,
.chart_reader,
.chart_Borrow {
  margin: 5px 15px;
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
.el-icon-caret-top {
  color: #de5151;
  font-weight: bold;
}
.el-icon-caret-bottom {
  color: #1dc147;
  font-weight: bold;
}
.borrow,
.back {
  color: #373839;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold;
  font-weight: bold;
  position: absolute;
  left: 5px;
  top: -25px;
}
.back {
  left: 252px;
}
.line {
  display: inline-block;
  width: 1px;
  height: 20px;
  background-color: #c8d3df;
  margin: 0 15px;
  position: relative;
  top: 5px;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
