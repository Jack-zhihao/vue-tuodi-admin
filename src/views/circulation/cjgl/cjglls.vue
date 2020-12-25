<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-03 14:19:56
 -->
<template>
  <div class="cjglls common__content">
    <td-content-header>
      财经历史信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            @click="print"
            :disabled="tableData.length == 0"
          >
            <icon-svg icon-class="icon-daochu" />导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div :class="more ? 'toolbar open-option' : 'toolbar'" ref="toolBar">
        <div class="base-option">
          <label>成员馆</label>
          <el-select
            filterable
            v-model="libId"
            size="mini"
            class="selectLIb"
            placeholder="选择成员馆"
            @change="getLiblistSelect"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <label>财经类型</label>
          <el-select
            filterable
            class="el-select-120"
            v-model="leixing"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in leixingList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="supplier-selection">
            <el-select
              filterable
              class="el-select-supplier"
              v-model="flag"
              size="mini"
            >
              <el-option
                v-for="item in flagList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              clearable
              class="supplier-key"
              placeholder="请输入搜索关键词"
              v-model="dzzhaoName"
              size="mini"
            ></el-input>
          </div>
          <el-button type="primary" @click="search" size="mini">
            <icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
          <p
            v-show="!more"
            @click="moreOption"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            更多条件
          </p>
          <p
            v-show="more"
            @click="more = false"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            隐藏条件
          </p>
        </div>
        <div class="more-option">
          <label>起止时间</label>
          <el-date-picker
            v-model="qyrqi_d1"
            type="date"
            placeholder="选择日期"
            size="mini"
          ></el-date-picker
          >至
          <el-date-picker
            v-model="qyrqi_d2"
            type="date"
            placeholder="选择日期"
            size="mini"
          ></el-date-picker>
          <label for="">收款类型</label>
          <el-select
            filterable
            v-model="moneyLeixing"
            placeholder="请选择"
            class="el-select-120"
            size="mini"
          >
            <el-option
              v-for="item in moneyLeixingList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <label>收款项目</label>
          <el-select
            filterable
            v-model="moneyXiangmu"
            placeholder="请选择"
            class="el-select-120"
            size="mini"
          >
            <el-option
              v-for="item in moneyXiangmuList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <label>操作员</label>
          <el-select
            filterable
            v-model="userName"
            placeholder="请选择"
            class="el-select-120"
            size="mini"
          >
            <el-option
              v-for="item in userNameList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div
        :class="more ? 'more-option' : ''"
        class="multipleTableBox"
        ref="multipleTableBox"
      >
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @selection-change="selectFunc"
          border=""
          stripe
          v-loading="loading"
          style="width:100%"
        >
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column
            prop="dzzhao"
            label="读者证号"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="xming" label="读者姓名" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="dzdw"
            label="读者单位"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="xiangmu"
            label="项目"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            align="center"
            prop="jine"
            label="金额"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.cjlx == '收入'" class="jinegreen">
                +{{ scope.row.jine }}
              </div>
              <div v-if="scope.row.cjlx == '支出'" class="jinered">
                {{
                  scope.row.jine == 0 ? "-" + scope.row.jine : scope.row.jine
                }}
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="sklx"
            label="收款类型"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="leixing"
            label="财经类型"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.cjlx == '收入'" class="income">
                <i></i>&nbsp;收入
              </div>
              <div v-if="scope.row.cjlx == '支出'" class="outcome">
                <i></i>&nbsp;支出
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="libName"
            label="成员馆"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="username"
            label="操作员"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="optime"
            label="日期"
            show-overflow-tooltip
            width="180"
          >
          </el-table-column>
          <el-table-column
            align="center"
            prop="bzhu"
            label="备注"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__pages">
      <div class="computed__table">
        <div>人工现金：{{ moneyTotal.XJ ? moneyTotal.XJ : "0.00" }}元</div>
        <div>机器现金：{{ moneyTotal.JXSK ? moneyTotal.JXSK : "0.00" }}元</div>
        <div>微信：{{ moneyTotal.WX ? moneyTotal.WX : "0.00" }}元</div>
        <div>支付宝：{{ moneyTotal.ZFB ? moneyTotal.ZFB : "0.00" }}元</div>
        <div>总账：{{ moneyTotal.TOTAL ? moneyTotal.TOTAL : "0.00" }}元</div>
      </div>
      <div class="content__pagination">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="pageNumber"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import {
  moneyHistoryList,
  getUserList,
  moneyHistoryTotal
} from "api/circulation";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_cjglls",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.curLibId = this.$store.getters.userInfo.libId;
    this.moneyXiangmuList = [
      { label: "全部", value: "" },
      { label: "押金", value: 1 },
      { label: "罚金", value: 2 },
      { label: "免罚", value: 3 },
      { label: "验证费", value: 4 },
      { label: "工本费", value: 5 },
      { label: "增值服务费", value: 6 },
      { label: "续证费", value: 7 }
    ];
    this.moneyLeixingList = [
      { label: "全部", value: "" },
      { label: "人工现金", value: 1 },
      { label: "机器现金", value: 2 },
      { label: "微信", value: 3 },
      { label: "支付宝", value: 4 }
    ];
    this.leixingList = [
      { label: "全部", value: "" },
      { label: "支出", value: 1 },
      { label: "收入", value: 2 }
    ];
    this.flagList = [
      { value: 0, label: "读者证号" },
      { value: 1, label: "读者姓名" }
    ];
    return {
      show: false,
      more: false,
      libId: this.$store.getters.userInfo.libId,
      selectShow: false,
      flag: 0,
      dzzhaoName: "",
      userNameList: [{ value: "", label: "全部" }],
      leixing: "",
      moneyLeixing: "",
      moneyXiangmu: "",
      pageSize: 15,
      pageNumber: 1,
      userName: "",
      tableData: [],
      selectRow: [],
      loading: false,
      totalCount: 0,
      dzuntis: "",
      param: {
        libid: "",
        pageSize: 15,
        pageNumber: 1,
        dzuntis: "",
        moneyLeixing: "",
        moneyXiangmu: "",
        startTime: "",
        endTime: "",
        leixing: ""
      },
      qyrqi_d1: "",
      qyrqi_d2: "",
      moneyTotal: {}
    };
  },
  mounted() {
    this.getUserListOptions(this.curLibId);
  },
  watch: {
    more(val) {
      if (val) {
        // 展开
        let toolBarHeight = this.$refs.toolBar.scrollHeight + 3;
        this.$refs.toolBar.style.height = toolBarHeight + "px";
        this.$refs.multipleTableBox.style.height = `calc(100% - ${toolBarHeight +
          2}px)`;
      } else {
        // 收缩
        this.$refs.toolBar.style.height = "33px";
        this.$refs.multipleTableBox.style.height = "calc(100% - 35px)";
      }
    }
  },
  methods: {
    moreOption() {
      this.more = true;
    },
    getLiblistSelect(value) {
      this.getUserListOptions(value);
    },
    getUserListOptions(data) {
      this.userName = "";
      this.userNameList = [{ value: "", label: "全部" }];
      if (!data) {
        return;
      }
      // 操作人列表
      getUserList({
        libId: data
      }).then(res => {
        if (res.code == 0) {
          res.data.map(item => {
            let userNameTemp = {};
            userNameTemp.label = item.username;
            userNameTemp.value = item.userId;
            this.userNameList.push(userNameTemp);
          });
        }
      });
    },
    /**获取列表 */
    getmoneyHistoryList(param) {
      this.loading = !this.loading;
      moneyHistoryList(param)
        .then(res => {
          this.loading = !this.loading;
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
          moneyHistoryTotal(param).then(res => {
            this.moneyTotal = res.data;
          });
        })
        .catch(() => {
          this.loading = !this.loading;
        });
    },
    search() {
      this.pageNumber = 1;
      this.param.pageNumber = this.pageNumber;
      this.param.pageSize = this.pageSize;
      this.param.libid = this.libId;
      this.param.dzuntis = this.dzuntis;
      this.param.leixing = this.leixing;
      this.param.moneyLeixing = this.moneyLeixing;
      this.param.moneyXiangmu = this.moneyXiangmu;
      this.param.operator = this.userName;
      if (this.flag == 0) {
        this.param.dzzhao = this.dzzhaoName.trim();
        this.param.dzname = "";
      } else {
        this.param.dzname = this.dzzhaoName.trim();
        this.param.dzzhao = "";
      }
      if (this.qyrqi_d1) {
        this.param.startTime = this.fromDateToYMD(this.qyrqi_d1) || "";
      } else {
        this.param.startTime = "";
      }
      if (this.qyrqi_d2) {
        this.param.endTime =
          this.fromDateToYMD(
            new Date(this.qyrqi_d2.getTime() + 1000 * 3600 * 24 * 1 - 1)
          ) || "";
      } else {
        this.param.endTime = "";
      }
      this.getmoneyHistoryList(this.param);
    },
    print() {
      this.param.func_name_us = "cjlscx";
      downLoadExcel("/api/e/flow/moneyManager/moneyHistoryListExportExcel", {
        ...this.param
      });
    },
    fromDateToYMD(date) {
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = m < 10 ? "0" + m : m;
      var d = date.getDate();
      d = d < 10 ? "0" + d : d;
      var h = date.getHours();
      h = h < 10 ? "0" + h : h;
      var minute = date.getMinutes();
      var second = date.getSeconds();
      minute = minute < 10 ? "0" + minute : minute;
      second = second < 10 ? "0" + second : second;
      return y + "-" + m + "-" + d + " " + h + ":" + minute + ":" + second;
    },

    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },

    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.pageNumber = 1;

      this.getmoneyHistoryList(this.param);
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.pageNumber = pageNumber;
      this.getmoneyHistoryList(this.param);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
.cjglls {
  .content {
    background-color: @contentBgColor;
    height: calc(100% - 36px - 63px);
    .toolbar {
      position: relative;
      padding: 0px;
      box-sizing: border-box;
      height: 33px;
      white-space: nowrap;
      transition: height 0.6s;
      label {
        display: inline-block;
        text-align: right;
        position: relative;
        margin-right: 12px;
        padding-right: 2px;
        text-indent: 0.5em;
        font-size: @FSize_14;
        &:after {
          content: "：";
          position: absolute;
          right: -11px;
        }
      }
      /deep/.el-select {
        width: 120px;
        margin-right: 10px;
        &.el-select-120 {
          width: 100px;
          margin-right: 0;
        }
      }
      .supplier-selection {
        display: inline-block;
        margin-right: 10px;
        margin-left: 10px;
        .el-select-supplier {
          width: 115px;
          margin-right: 0;
          /deep/.el-input__inner {
            border-color: @borderColor;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
        .el-input.supplier-key {
          width: 225px;
          /deep/.el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
      }

      .more-option {
        padding-top: 3px;
        .el-date-editor {
          width: 135px;
          .el-range-input {
            cursor: default;
          }
        }
        .el-date-editor .el-range-separator {
          line-height: 26px;
        }
      }
    }
    .multipleTableBox {
      height: calc(100% - 33px);
    }
    .el-table {
      &::before {
        background-color: transparent;
      }
      .cell {
        i {
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 8px;
        }
        .income {
          i {
            background-color: #1dc147;
          }
        }
        .outcome {
          i {
            background-color: #de5151;
          }
        }
      }
      .el-button {
        padding: 0 20px;
        font-weight: bold;
        font-size: @FSize_16;
      }
      .el-table__fixed-right::before {
        height: auto;
      }

      .jinegreen {
        color: #1dc147;
      }
      .jinered {
        color: #de5151;
      }
    }
  }
  .content__pages {
    background-color: @contentBgColor;
    padding-top: 30px;
    border-top: 1px solid #e9edf0;
    position: relative;
    .computed__table {
      position: absolute;
      top: 6px;
      left: 0;
      word-break: break-all;
      div {
        display: inline-block;
        font-weight: 700;
        padding-right: 30px;
        padding-left: 10px;
      }
    }
    .content__pagination {
      width: 100%;
    }
  }
}
</style>
