<template>
  <div class="per_tdd common__content">
    <td-content-header>
      <span>停订单</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="TddList.lenght == 0"
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
          <p class="label">订购年：</p>
          <el-select filterable size="mini" v-model="dgn" placeholder="请选择">
            <el-option
              v-for="item in DGNList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">供应商：</p>
          <el-select
            filterable
            size="mini"
            v-model="gysid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in gysList"
              :key="item.gysId"
              :label="item.gysName"
              :value="item.gysId"
            ></el-option>
          </el-select>
          <p class="label">预订人：</p>
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
        </div>
        <div class="header__line">
          <p class="label">订购日期：</p>
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
          <p class="label">期刊类型：</p>
          <el-select filterable size="mini" v-model="hxqk" placeholder="请选择">
            <el-option
              v-for="item in hxqkList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadTddData"
          border=""
          ref="TddList"
          :data="TddList"
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
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysCode"
            label="供应商代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzq"
            label="出版周期"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dgnf"
            label="预订年"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zongqi"
            label="订购期数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ceshu"
            label="预订数量"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jiage"
            label="单价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ydnianjia"
            label="年价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="订购时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="备注"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleTddSizeChange"
          @current-change="handleTddCurrentChange"
          :total="totalTddCount"
          :currentPage="currentTddPage"
          :pageSize="TddPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { dgd, dgdOperatorList } from "api/periodical";
import { userGysInLibList } from "api/public";
import { mapGetters } from "vuex";
import { formatDate } from "utils/filterDate";
import { downLoadExcel } from "utils/utils";
export default {
  name: "per_tdd",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      dgn: "",
      DGNList: [{ label: "全部", value: "" }],
      hxqkList: [
        { label: "全部", value: "" },
        { label: "核心期刊", value: 1 },
        { label: "非核心期刊", value: 0 }
      ],
      gysid: "",
      gysList: [],
      userid: "",
      ydrList: [],
      date1: "",
      date2: "",
      hxqk: "",
      zdph: "",
      loadTddData: false,
      TddList: [],
      totalTddCount: 0,
      currentTddPage: 1,
      TddPageSize: 15,
      param: {}
    };
  },
  methods: {
    search() {
      this.currentTddPage = 1;
      this.getTdd();
    },
    getTdd() {
      this.loadTddData = true;
      this.param = {
        libid: this.libid,
        ztai: "停订",
        dgnf: this.dgn,
        userid: this.userid,
        gysid: this.gysid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        hxqk: this.hxqk,
        zdph: this.zdph,
        pageSize: this.TddPageSize,
        pageNumber: this.currentTddPage
      };
      dgd(this.param)
        .then(res => {
          this.loadTddData = false;
          this.totalTddCount = Number(res.data.totalElements);
          this.TddList = [...res.data.dataList];
        })
        .catch(() => {
          this.loadTddData = false;
        });
    },
    rowClick(row) {
      this.$refs.TddList.toggleRowSelection(row);
    },
    initData() {
      this.gysid = "";
      this.userid = "";
      this.getYdList();
      this.getGysList();
    },
    getGysList() {
      userGysInLibList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.gysList = [{ gysName: "全部", gysId: "" }, ...res.data];
      });
    },
    getYdList() {
      dgdOperatorList({
        code: 2
      }).then(res => {
        this.ydrList = [{ username: "全部", userId: "" }, ...res.data];
      });
    },
    print() {
      this.param.func_name_us = "dgd";
      downLoadExcel("/api/e/qikan/baobiao/dgdExportExcel", this.param);
    },
    handleTddSizeChange(pageSize) {
      this.TddPageSize = pageSize;
      this.currentTddPage = 1;
      this.getTdd();
    },
    handleTddCurrentChange(pageNumber) {
      this.currentTddPage = pageNumber;
      this.getTdd();
    },
    initZDNF() {
      let C_Year = Number(formatDate(new Date(), "yyyy"));
      while (C_Year >= 2010) {
        this.DGNList.push({ label: C_Year, value: C_Year });
        C_Year--;
      }
    }
  },
  mounted() {
    this.initData();
    this.initZDNF();
    this.getTdd();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
