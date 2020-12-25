<template>
  <div class="per_zdd common__content">
    <td-content-header>
      <span>装订单</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="ZDDList.lenght == 0"
            @click="print"
          >
            <icon-svg icon-class="icon-daochu" />导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            @change="initData"
            v-model="libid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">装订者：</p>
          <el-select
            filterable
            size="mini"
            v-model="userid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ydrList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
          <p class="label">馆藏地点：</p>
          <el-select filterable size="mini" v-model="czid" placeholder="请选择">
            <el-option
              v-for="item in czList"
              :key="item.czid"
              :label="item.mingcheng"
              :value="item.czid"
            ></el-option>
          </el-select>
          <p class="label">装订批号：</p>
          <el-input
            size="mini"
            clearable
            v-model="zdph"
            placeholder="请输入搜索装订批号"
          ></el-input>
        </div>
        <div class="header__line">
          <p class="label">操作日期：</p>
          <el-date-picker
            style="margin-right:3px"
            class="el-date-editor--datetime"
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始日期"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            class="el-date-editor--datetime"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束日期"
          ></el-date-picker>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadZDDData"
          border=""
          ref="ZDDList"
          :data="ZDDList"
          stripe
          @row-click="rowClick"
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="issn"
            width="145"
            label="ISSN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dghao"
            label="订购号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flhao"
            label="分类号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsm"
            label="卷信息"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdlx"
            label="装订类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="装订者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="装订日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="馆藏地点"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdjg"
            label="装订价格"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfs"
            label="装订份数"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleZDDSizeChange"
          @current-change="handleZDDCurrentChange"
          :total="totalZDDCount"
          :currentPage="currentZDDPage"
          :pageSize="ZDDPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { zdd, zddOperatorList } from "api/periodical";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "per_zdd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      czid: "",
      czList: [],
      userid: "",
      zdph: "",
      ydrList: [],
      date1: "",
      date2: "",
      loadZDDData: false,
      ZDDList: [],
      totalZDDCount: 0,
      currentZDDPage: 1,
      ZDDPageSize: 15,
      param: {}
    };
  },
  methods: {
    search() {
      this.currentZDDPage = 1;
      this.getZdd();
    },
    getZdd() {
      this.loadZDDData = true;
      this.param = {
        libid: this.libid,
        userid: this.userid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        czid: this.czid,
        zdph: this.zdph,
        pageSize: this.ZDDPageSizem,
        pageNumber: this.currentZDDPage
      };
      zdd(this.param)
        .then(res => {
          this.loadZDDData = false;
          this.totalZDDCount = Number(res.data.totalElements);
          this.ZDDList = [...res.data.dataList];
        })
        .catch(() => {
          this.loadZDDData = true;
        });
    },
    rowClick(row) {
      this.$refs.ZDDList.toggleRowSelection(row);
    },
    initData() {
      this.userid = "";
      this.czid = "";
      this.getYdList();
      this.getCzList();
    },
    getCzList() {
      userCzList({
        libId: this.libid
      }).then(res => {
        this.czList = [{ mingcheng: "全部", czid: "" }, ...res.data];
      });
    },
    getYdList() {
      zddOperatorList().then(res => {
        this.ydrList = [{ username: "全部", userId: "" }, ...res.data];
      });
    },
    print() {
      this.param.func_name_us = "zdd";
      downLoadExcel("/api/e/qikan/baobiao/zddExportExcel", this.param);
    },
    handleZDDSizeChange(pageSize) {
      this.ZDDPageSize = pageSize;
      this.currentZDDPage = 1;
      this.getZdd();
    },
    handleZDDCurrentChange(pageNumber) {
      this.currentZDDPage = pageNumber;
      this.getZdd();
    }
  },
  mounted() {
    this.initData();
    this.getZdd();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
