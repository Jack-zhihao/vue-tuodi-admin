<template>
  <div class="cat_bmtj common__content">
    <!--读者借阅查询-->
    <td-content-header>
      <span>编目统计</span>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-radio v-model="bookType" :label="1">书册</el-radio>
          <el-radio v-model="bookType" :label="2">书目</el-radio>
        </div>
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
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">起止时间：</p>
          <el-date-picker
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            style="marginRight: 3px;"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            size="mini"
            value-format="yyyy-MM-dd 00:00:00"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
          <p class="label">操作员：</p>
          <el-select
            filterable
            size="mini"
            v-model="userId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="initBmtjList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadBorrowData"
          border
          :data="bmtjList"
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
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libCode"
            label="成员馆代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="amount"
            key="1"
            label="总编目册数"
            v-if="dataMode === 1"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="amount"
            key="2"
            v-if="dataMode === 2"
            label="总编目书目数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sevenDayCount"
            key="3"
            v-if="dataMode === 1"
            label="一周内编目总册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sevenDayCount"
            key="4"
            v-if="dataMode === 2"
            label="一周内编目书目数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="monthCount"
            key="5"
            v-if="dataMode === 1"
            label="一月内编目总册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="monthCount"
            key="6"
            v-if="dataMode === 2"
            label="一月内编目书目数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="timeCount"
            key="7"
            v-if="dataMode === 1"
            label="时间段内编目总册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="timeCount"
            key="8"
            v-if="dataMode === 2"
            label="时间段内编目书目数"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { catalogStatistics, catalogStatisticsUserList } from "api/catalogue";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";
export default {
  name: "cat_bmtj",
  data() {
    return {
      // 列表相关
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      czid: "",
      userCzList: [],
      dataMode: 1,
      bookType: 1,
      userId: "",
      userIdList: [],
      loadBorrowData: false,
      bmtjList: [],
      pageSize: 15,
      currentPage: 1,
      totalCount: 0,
      requestObj: {}
    };
  },
  watch: {
    bookType() {
      this.catalogStatisticsUserList();
    }
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    initBmtjList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.getBmtjList();
      this.currentPage = 1;
    },

    initParamList() {
      this.getUserCzList();
      this.catalogStatisticsUserList();
    },

    getBmtjList() {
      this.loadBorrowData = true;
      this.requestObj = {
        libId: this.libid,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        optimeStart: this.date1,
        optimeEnd: this.date2,
        bookType: this.bookType,
        userId: this.userId
      };
      catalogStatistics(this.requestObj)
        .then(res => {
          this.dataMode = this.bookType;
          this.loadBorrowData = false;
          this.bmtjList = res.data.list;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadBorrowData = false));
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getBmtjList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getBmtjList();
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
    catalogStatisticsUserList() {
      catalogStatisticsUserList({
        libId: this.libid,
        optimeStart: this.date1,
        optimeEnd: this.date2,
        bookType: this.bookType
      }).then(res => {
        this.userId = "";
        this.userIdList = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
        if (this.userIdList.length > 1) {
          this.userIdList.unshift({
            label: "全部",
            value: ""
          });
        } else if (this.userIdList.length === 1) {
          this.userId = this.userIdList[0].value;
        }
      });
    }
  },
  mounted() {
    this.initParamList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
