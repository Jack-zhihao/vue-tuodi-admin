<template>
  <div class="per_jdd common__content">
    <td-content-header>
      <span>记到单</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="JDDList.length == 0"
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
          <p class="label">记到日期：</p>
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
          <p class="label">操作者：</p>
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
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadJDDData"
          border=""
          ref="JDDList"
          :data="JDDList"
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
            prop="dghao"
            label="订购号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="issn"
            width="145"
            label="ISSN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="year"
            label="记到年"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="qi"
            label="卷期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ce"
            label="记到册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jddd"
            label="预定部门"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="记到人"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="记到日期"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleJDDSizeChange"
          @current-change="handleJDDCurrentChange"
          :total="totalJDDCount"
          :currentPage="currentJDDPage"
          :pageSize="JDDPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { jdd, jddOperatorList } from "api/periodical";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "per_jdd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.DGNList = [{ label: 1990, value: 1990 }];
    return {
      libid: this.$store.getters.userInfo.libId,
      userid: "",
      ydrList: [],
      date1: "",
      date2: "",
      loadJDDData: false,
      JDDList: [],
      selectRow: [],
      totalJDDCount: 0,
      currentJDDPage: 1,
      JDDPageSize: 15,
      param: {}
    };
  },
  methods: {
    search() {
      this.currentJDDPage = 1;
      this.getJdd();
    },
    getJdd() {
      this.loadJDDData = true;
      this.param = {
        libid: this.libid,
        userid: this.userid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        pageSize: this.JDDPageSize,
        pageNumber: this.currentJDDPage
      };
      jdd(this.param)
        .then(res => {
          this.loadJDDData = false;
          this.totalJDDCount = Number(res.data.totalElements);
          this.JDDList = [...res.data.dataList];
        })
        .catch(() => {
          this.loadJDDData = false;
        });
    },
    initData() {
      this.userid = "";
      jddOperatorList().then(res => {
        this.ydrList = [{ username: "全部", userId: "" }, ...res.data];
      });
    },
    print() {
      this.param.func_name_us = "jdd";
      downLoadExcel("/api/e/qikan/baobiao/jddExportExcel", this.param);
    },
    handleJDDSizeChange(pageSize) {
      this.JDDPageSize = pageSize;
      this.currentJDDPage = 1;
      this.getJdd();
    },
    handleJDDCurrentChange(pageNumber) {
      this.currentJDDPage = pageNumber;
      this.getJdd();
    },
    rowClick(row) {
      this.$refs.JDDList.toggleRowSelection(row);
    }
  },
  mounted() {
    this.initData();
    this.getJdd();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
