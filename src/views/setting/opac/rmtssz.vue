<template>
  <div class="cir_dzdwjhtj common__content">
    <td-content-header>
      热门图书设置
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">统计总数：</p>
          <span v-if="editable == false">{{ count }}</span>
          <el-input
            v-else
            style="width:220px"
            clearable
            placeholder="请输入统计总数"
            size="mini"
            v-model="count"
            ref="countInput"
            @change="computedAll"
          ></el-input>
          <p class="label" style="marginLeft:20px">时间段：</p>
          <el-date-picker
            :disabled="editable == false"
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            @change="selectDate1"
            style="marginRight:3px"
            :clearable="false"
            value-format="yyyy-MM-dd"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            :disabled="editable == false"
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            @change="selectDate2"
            size="mini"
            :clearable="false"
            value-format="yyyy-MM-dd"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <div v-show="editable == false">
            <el-button size="mini" type="primary" @click="editable = true"
              >编辑</el-button
            >
          </div>
          <div v-show="editable == true">
            <el-button size="mini" type="primary" @click="cancelData"
              ><i></i>取消</el-button
            >
            <el-button size="mini" type="primary" @click="saleData"
              ><i></i>保存</el-button
            >
          </div>
        </div>
      </div>
      <div class="content__bottom">
        <el-scrollbar>
          <el-table
            :data="bookList"
            border
            :summary-method="getSummaries"
            show-summary
            style="width: 100%"
          >
            <el-table-column prop="sshao" label="基本大类">
              <template slot-scope="scope">
                <span
                  >{{ scope.row.sshao }}&nbsp;{{ scope.row.classfiyName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column prop="zhanbi" label="占比%">
              <template slot-scope="scope">
                <div>
                  <span v-if="editable == false">{{ scope.row.zhanbi }}</span>
                  <el-input
                    v-else
                    type="text"
                    size="mini"
                    v-model="scope.row.zhanbi"
                    @change="computedRatio(scope.row.sshao, scope.row.zhanbi)"
                  />
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="ceshu" label="册数"></el-table-column>
            <el-table-column prop="checked" label="优先展示">
              <template slot-scope="scope">
                <div v-if="editable == true">
                  <el-checkbox
                    v-model="scope.row.checked"
                    @change="checkedEvent(scope.row.sshao, scope.row.checked)"
                  ></el-checkbox>
                </div>
                <div v-else>
                  <el-checkbox
                    v-if="scope.row.checked == true"
                    v-model="scope.row.checked"
                    disabled
                  ></el-checkbox>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { getHotBookSetting, hotBook } from "api/setting";
import { categories } from "utils/24categories";
export default {
  name: "set_rmtssz",
  data() {
    return {
      // 列表
      loadBooksInfoData: false,
      dzdwjhtjData: [],
      count: 100,
      templateForm: [],
      bookList: [],
      date1: "",
      date2: "",
      editable: false,
      computedZhanbiSum: 0,
      computedCeshu: 0,
      categories: {},
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
        // disabledDate: time => {
        //   return (
        //     time.getTime() > Date.now() || time.getTime() < new Date(this.date1)
        //   );
        // }
      }
    };
  },
  mounted() {
    this.date2 = localStorage.getItem("td_remen_endDate");
    this.date1 = localStorage.getItem("td_remen_startDate");
    this.getHotBookSetting();
    this.categories = Object.assign({}, categories);
    delete this.categories.other;
  },
  activated() {},
  methods: {
    selectDate1() {},
    selectDate2() {},
    getHotBookSetting() {
      this.bookList = [];
      getHotBookSetting().then(res => {
        this.count = res.data.count;
        this.id = res.data.id;
        this.customerId = res.data.customerId;
        this.preshow = res.data.preshow.charAt(res.data.preshow.length - 1);

        // 过滤出需要的数据
        let bookData = {};
        Object.keys(res.data).forEach(key => {
          if (key.indexOf("classify") > -1) {
            bookData[key] = res.data[key];
          }
        });

        this.bookinitData = bookData;
        for (let item in this.bookinitData) {
          let obj = {};
          obj.classfiy = item;
          obj.sshao = item.charAt(item.length - 1);
          obj.classfiyName = this.categories[item.charAt(item.length - 1)];
          obj.zhanbi = ((this.bookinitData[item] * 100) / this.count).toFixed(
            1
          );
          obj.ceshu = this.bookinitData[item];
          if (item.charAt(item.length - 1) == this.preshow) {
            obj.checked = true;
          } else {
            obj.checked = false;
          }
          this.bookList.push(obj);
        }
      });
    },
    computedAll() {
      for (let item of this.bookList) {
        item.ceshu = ((item.zhanbi * this.count) / 100).toFixed(0);
      }
    },
    computedRatio(sshao, zhanbi) {
      zhanbi = /^\d+(\.\d{0,1})?$/.test(zhanbi) ? zhanbi : 0;
      for (let item of this.bookList) {
        if (item.sshao == sshao) {
          item.zhanbi = parseFloat(zhanbi);
          item.ceshu = Math.round((parseFloat(zhanbi) * this.count) / 100);
        }
      }
    },
    checkedEvent(sshao, checked) {
      for (let item of this.bookList) {
        if (item.sshao == sshao) {
          item.checked = checked;
          if (checked == true) {
            this.preshow = item.sshao.charAt(item.sshao.length - 1);
          } else {
            this.preshow = "";
          }
        } else {
          item.checked = false;
        }
      }
    },
    saleData() {
      let param = {};
      param.id = this.id;
      param.customerId = this.customerId;
      param.count = parseFloat(this.count);
      if (!this.preshow) {
        this.$message.error("请选择优先展示");
        return;
      } else {
        param.preshow = this.preshow;
      }
      if (this.computedZhanbiSum > 100 || this.computedCeshu > this.count) {
        this.$message.error("占比不得超出100%，且册数不得超过统计总数");
        return;
      }
      for (let item of this.bookList) {
        param[item.classfiy] = parseFloat(item.ceshu);
      }
      param.startDate = this.date1;
      param.endDate = this.date2;
      hotBook(param).then(() => {
        // 保存后请求成功后，把时间储存在本地
        localStorage.setItem("td_remen_startDate", this.date1);
        localStorage.setItem("td_remen_endDate", this.date2);

        this.editable = false;
        this.getHotBookSetting();
      });
    },
    getSummaries(param) {
      let { columns, data } = param;
      let sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = "合计";
          return;
        }
        if (index === 3) {
          sums[index] = "";
          return;
        }
        let values = data.map(item => Number(item[column.property]));
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            let value = Number(curr);
            if (!isNaN(value)) {
              return prev + curr;
            } else {
              return prev;
            }
          }, 0);
          if (index == 1) {
            this.computedZhanbiSum = sums[index].toFixed || 0;
            sums[index] = sums[index].toFixed(1) + "%";
          }
          if (index == 2) {
            this.computedCeshu = sums[index] || 0;
          }
        } else {
          sums[index] = "";
        }
      });
      return sums;
    },
    cancelData() {
      this.editable = false;
      this.getHotBookSetting();
    }
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
.cir_dzdwjhtj {
  .header__line {
    height: 36px;
  }
  .el-table {
    /deep/.el-table th,
    .el-table td {
      padding: 1px 0 !important;
      cursor: default;
    }
  }
  .content__bottom {
    height: ~"calc(100% - 39px)";
    background: @contentHdColor;
    /deep/.el-input {
      height: 23px;
      line-height: 23px;
      .el-input__inner {
        height: 21px;
        line-height: 21px;
      }
    }
  }
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
