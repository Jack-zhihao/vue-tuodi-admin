<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-19 09:49:03
 * @LastEditTime: 2020-03-10 09:28:49
 -->

<template>
  <div class="res-dcqd common__content">
    <td-content-header>
      典藏清单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">查找范围：</p>
          <el-radio-group v-model="scopeId" style="margin:5px 10px 0px 0px">
            <el-radio label="0">财产馆</el-radio>
            <el-radio label="1">现在馆</el-radio>
          </el-radio-group>
          <p class="label" style="marginLeft:20px">排序：</p>
          <el-select
            filterable
            size="mini"
            v-model="rqSort"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rqSortArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            ref="searchInput"
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (currentFilterVal = val),
                initDCList
              )
            "
            @keydown.enter.native="delayFunc(initDCList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initDCList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="currentLib"
            placeholder="请选择"
            @change="currentLibChange"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">藏址：</p>
          <el-select
            filterable
            size="mini"
            class="multi line"
            v-model="czIds"
            multiple
            clearable
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in czOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">图书类型：</p>
          <el-select
            filterable
            clearable
            size="mini"
            v-model="bookType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bookTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">状态：</p>
          <el-select
            filterable
            clearable
            size="mini"
            v-model="ztId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ztOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">清查日期：</p>
          <el-date-picker
            v-model="qcDate1"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="qcDate2"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
        </div>
        <div class="header__line">
          <p class="label">入库日期：</p>
          <el-date-picker
            v-model="rkDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="rkDateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
          <p class="label">条形码范围：</p>
          <el-input
            placeholder="请输入起始条形码"
            clearable
            size="mini"
            v-model="tmStart"
            style="marginRight:3px"
            @keyup.native="handleBarCodeScanner($event, val => (tmStart = val))"
          ></el-input>
          <span>至&nbsp;</span>
          <el-input
            placeholder="请输入结束条形码"
            clearable
            size="mini"
            v-model="tmEnd"
            style="margin-right: 0;"
            @keyup.native="handleBarCodeScanner($event, val => (tmEnd = val))"
          ></el-input>
        </div>
      </div>

      <div class="content__table line4" ref="dcTable">
        <el-table
          v-loading="loadDCData"
          border
          :data="dcList"
          stripe
          height="100%"
          style="width: 100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            width="145"
            label="ISBN/ISSN"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="riqi" label="编目日期">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cejia"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="caiChanGuan"
            label="财产馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="caiChanCz"
            label="财产藏址"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xianZaiGuan"
            label="现在馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xianZaiCz"
            label="现在藏址"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <div class="computed__table">
          <div class="left">
            <div>在馆：{{ zataiObj.zaiguan || "-" }}</div>
            <div>借出：{{ zataiObj.jiechu || "-" }}</div>
            <div>编目：{{ zataiObj.bianmu || "-" }}</div>
            <div>丢失：{{ zataiObj.diushi || "-" }}</div>
            <div>剔除：{{ zataiObj.tichu || "-" }}</div>
            <div>清查：{{ zataiObj.qingcha || "-" }}</div>
            <div>其他：{{ zataiObj.qita || "-" }}</div>
          </div>
          <div class="right">
            <div>种数：{{ zataiObj.totalNumber || "-" }}</div>
            <div>册数：{{ zataiObj.totalBookNumber || "-" }}</div>
            <div>总金额：{{ zataiObj.totalPrice || "-" }}</div>
          </div>
        </div>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleDCSizeChange"
          @current-change="handleDCCurrentChange"
          :total="totalDCCount"
          :currentPage="currentDCPage"
          :pageSize="dcPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { userCzList } from "api/public";

import { ZTAI_OPTIONS, BOOKTYPE_OPTIONS } from "utils/variables";

import { gcqd, gcqdExportExcel } from "api/reservation";

import { mapGetters } from "vuex";

import { DCQD_OPTIONS } from "utils/selectOptions";

export default {
  name: "res_dcqd",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.bookTypeOptions = BOOKTYPE_OPTIONS;
    this.ztOptions = Object.assign([], ZTAI_OPTIONS);
    this.ztOptions.unshift({
      label: "全部",
      value: ""
    });
    this.filterOptions = DCQD_OPTIONS;
    this.scopeOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "0",
        label: "财产"
      },
      {
        value: "1",
        label: "现在"
      }
    ];
    this.requestObj = {};
    return {
      // 搜索条件
      currentLib: this.$store.getters.userInfo.libId,
      czIds: [],
      czOptions: [],
      rqSortArr: [
        { label: "默认", value: "" },
        { label: "编目日期", value: "0" },
        { label: "出版日期", value: "1" }
      ],
      bookType: "",
      ztId: "",
      scopeId: "0",
      rqSort: "",
      qcDate2: "",
      qcDate1: "",
      rkDateStart: "",
      rkDateEnd: "",
      tmStart: "",
      tmEnd: "",
      currentFilterKey: "isbn_issn",
      currentFilterVal: "",
      // 列表
      loadDCData: false,
      dcList: [],
      zataiObj: {},
      totalDCCount: 0,
      currentDCPage: 1,
      dcPageSize: 15
    };
  },
  methods: {
    // 搜索条件
    getCzOptions() {
      userCzList({
        libId: this.currentLib
      }).then(res => {
        this.czOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
      });
    },
    currentLibChange() {
      this.getCzOptions();
    },
    downLoadData() {
      downLoadExcel(gcqdExportExcel(), {
        ...this.requestObj
      });
    },
    // 列表
    initDCList() {
      this.currentDCPage = 1;
      this.setRequestObj();
      this.getDCList(true);
    },
    setRequestObj() {
      this.requestObj = {
        libType: this.scopeId,
        libid: this.currentLib,
        czid: this.czIds,
        bookType: this.bookType,
        bookStatus: this.ztId,
        time1: this.rkDateStart || "",
        time2: this.rkDateEnd || "",
        tiaoma1: this.tmStart,
        tiaoma2: this.tmEnd,
        orderType: this.rqSort,
        qctime1: this.qcDate1 || "",
        qctime2: this.qcDate2 || ""
      };
      this.requestObj[this.currentFilterKey] = this.currentFilterVal;
    },
    getDCList(isReset) {
      if ((this.tmStart && !this.tmEnd) || (this.tmEnd && !this.tmStart)) {
        this.$message("起止条形码必须输入开始和结束范围");
        return;
      }
      this.loadDCData = true;
      let requestObj = {
        pageNumber: this.currentDCPage,
        pageSize: this.dcPageSize,
        ...this.requestObj
      };
      gcqd(requestObj)
        .then(res => {
          this.zataiObj = {
            bianmu: res.data.bianmu,
            diushi: res.data.diushi,
            tichu: res.data.tichu,
            qingcha: res.data.qingcha,
            jiechu: res.data.jiechu,
            qita: res.data.qita,
            zaiguan: res.data.zaiguan,
            totalBookNumber: res.data.totalBookNumber,
            totalNumber: res.data.totalNumber,
            totalPrice: res.data.totalPrice
          };
          this.dcList = res.data.page.dataList;
          this.totalDCCount = Number(res.data.page.totalElements);
        })
        .finally(() => {
          if (isReset) {
            this.$refs.searchInput.select();
          }
          this.loadDCData = false;
        });
    },
    handleDCSizeChange(val) {
      this.dcPageSize = val;
      this.getDCList();
    },
    handleDCCurrentChange(val) {
      this.currentDCPage = val;
      this.getDCList();
    }
  },
  mounted() {
    this.getCzOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.res-dcqd {
  // .content__table {
  //   height: ~"calc(100% - 93px - 32px - 31px)";
  // }
  .content__page {
    position: relative;
  }
  .computed__table {
    width: 100%;
    position: absolute;
    top: 6px;
    left: 0;
    word-break: break-all;
    display: flex;
    justify-content: space-between;
    .left {
      div {
        display: inline-block;
        font-weight: 700;
        padding-right: 10px;
        padding-left: 10px;
      }
    }
  }
  .right {
    div {
      display: inline-block;
      font-weight: 700;
      padding-right: 10px;
      padding-left: 10px;
    }
  }
}
</style>
