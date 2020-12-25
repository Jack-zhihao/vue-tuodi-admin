<template>
  <div class="cir_wxjyphb common__content">
    <td-content-header>
      <span>文献借阅排行榜</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="print">
            <icon-svg icon-class="icon-daochu" />
            导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="desc">成员馆：</p>
          <el-select
            filterable
            size="mini"
            @change="initParamList"
            v-model="libid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">文献所在藏址：</p>
          <el-select filterable size="mini" v-model="czid" placeholder="请选择">
            <el-option
              v-for="item in userCzList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">基本大类：</p>
          <el-select filterable size="mini" v-model="wxfl" placeholder="请选择">
            <el-option
              v-for="item in wxTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">排榜范围：</p>
          <el-input
            type="number"
            @blur="valiNumber(renshu)"
            v-model="renshu"
            size="mini"
            clearable
            class="min-width"
          ></el-input>
        </div>
        <div class="header__line">
          <p class="desc">借阅时间：</p>
          <el-date-picker
            style="margin-right: 7px;"
            class="filter__date"
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            class="filter__date"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
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
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (currentFilterVal = val),
                initRankList
              )
            "
            @keydown.enter.native="delayFunc(initRankList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initRankList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadRankData"
          @selection-change="handleRankSelectionChange"
          border=""
          :data="RankList"
          stripe
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
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            width="145"
            label="ISBN/ISSN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="借阅次数"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleRankSizeChange"
          @current-change="handleRankCurrentChange"
          :total="totalRankCount"
          :currentPage="currentRankPage"
          :pageSize="RankPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { wxjyphb } from "api/circulation";
import { userCzList } from "api/public";
import { categories } from "utils/24categories";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
import { WXJYPHB_OPTIONS } from "utils/selectOptions";
export default {
  name: "cir_wxjyphb",
  data() {
    this.filterOptions = WXJYPHB_OPTIONS;
    return {
      // 列表相关
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      wxfl: "",
      czid: "",
      renshu: 10,
      currentFilterKey: "isbn",
      currentFilterVal: "",
      wxTypeList: [],
      userCzList: [],
      multipleRankSelection: [],
      loadRankData: false,
      RankList: [],
      RankPageSize: 15,
      currentRankPage: 1,
      totalRankCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    initRankList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.currentRankPage = 1;
      this.getRankList();
    },

    handleRankSelectionChange(val) {
      this.multipleRankSelection = val.map(item => item.Rankid);
    },

    getRankList() {
      this.loadRankData = true;
      this.requestObj = {
        libid: this.libid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        renshu: this.renshu,
        wxfl: this.wxfl,
        czid: this.czid,
        pageNumber: this.currentRankPage,
        pageSize: this.RankPageSize
      };
      this.requestObj[this.currentFilterKey] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );
      wxjyphb(this.requestObj)
        .then(res => {
          this.loadRankData = false;
          res.data.dataList.forEach(ele => {
            ele.isbn = ele.isbn || ele.issn;
          });
          this.RankList = res.data.dataList;
          this.totalRankCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadRankData = false));
    },
    handleRankSizeChange(val) {
      this.RankPageSize = val;
      this.getRankList();
    },
    handleRankCurrentChange(val) {
      this.currentRankPage = val;
      this.getRankList();
    },
    getwxType() {
      for (const [key, val] of Object.entries(categories)) {
        this.wxTypeList.push({
          value: key,
          label: `${key}  ${val}`
        });
      }
      this.wxTypeList.unshift({
        value: "",
        label: "全部"
      });
    },
    //关联图书馆
    initParamList() {
      this.czid = "";
      this.getUserCzList();
    },
    getUserCzList() {
      userCzList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.userCzList = [];
        res.data.filter(ele => {
          this.userCzList.push({
            label: ele.mingcheng,
            value: ele.czid
          });
        });
        this.userCzList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    valiNumber(val) {
      this.renshu = Math.abs(parseFloat(val).toFixed(0)) || 10;
    },
    print() {
      downLoadExcel("/api/e/flow/lttj/wxjyphbExoprtExcel", {
        ...this.requestObj
      });
    }
  },
  mounted() {
    this.initParamList();
    this.getwxType();
    this.getUserCzList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
