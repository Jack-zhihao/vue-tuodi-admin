<template>
  <div class="cir_dzjyphb common__content">
    <!--读者借阅排行榜-->
    <td-content-header>
      <span>读者借阅排行榜</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="print" type="primary" size="mini">
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
          <p class="label">成员馆：</p>
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
          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="dzlxid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerTypeList"
              :key="item.dzlxid"
              :label="item.mcheng"
              :value="item.dzlxid"
            ></el-option>
          </el-select>
          <p class="label">馆藏地点：</p>
          <el-select filterable size="mini" v-model="czid" placeholder="请选择">
            <el-option
              v-for="item in userCzList"
              :key="item.czid"
              :label="item.mingcheng"
              :value="item.czid"
            ></el-option>
          </el-select>
          <p class="label">排榜人数：</p>
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
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initRankList"
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
            prop="dzzh"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzname"
            label="读者姓名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzdw"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="总借阅册数"
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
import { dzjyphb } from "api/circulation";
import { readerType, userCzList } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzjyphb",
  data() {
    this.filterOptions = [
      { label: "读者证号", value: "dzzhao" },
      { label: "读者姓名", value: "xming" },
      { label: "读者单位", value: "dzdw" }
    ];
    return {
      // 列表相关
      filterSearchKey: "",
      currentFilterKey: "dzzhao",
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      dzlxid: "",
      czid: "",
      renshu: 10,
      readerTypeList: [],
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

    initParamList() {
      this.getUserCzList();
      this.getReaderType();
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
        dzlxid: this.dzlxid,
        czid: this.czid,
        pageNumber: this.currentRankPage,
        pageSize: this.RankPageSize
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /^\s+|\s+$/g,
        ""
      );
      dzjyphb({
        ...this.requestObj
      })
        .then(res => {
          this.loadRankData = false;
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
    getReaderType() {
      this.mcheng = "";
      readerType({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mcheng: "全部",
          dzlxid: ""
        });
        this.readerTypeList = [...res.data];
      });
    },
    getUserCzList() {
      this.czid = "";
      userCzList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mingcheng: "全部",
          czid: ""
        });
        this.userCzList = [...res.data];
      });
    },
    valiNumber(val) {
      this.renshu = Math.abs(parseFloat(val).toFixed(0)) || 10;
    },
    print() {
      downLoadExcel("/api/e/flow/lttj/dzjyphbExportExcel", {
        ...this.requestObj
      });
    }
  },
  mounted() {
    this.initParamList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
