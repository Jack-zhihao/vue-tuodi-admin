<template>
  <div class="res_gctj common__content">
    <td-content-header>
      <span>馆藏出版年统计</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleDownLoadExcel">
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
          <p class="label">图书类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="bookTypeId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bookTypeList"
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
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadGCTJData"
          border=""
          :data="GCTJList"
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
            prop="year"
            label="年度"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="numbers"
            label="种数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="percentageNumber"
            label="种数占比"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="total"
            label="册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="percentageTotal"
            label="册数占比"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
import { gctj, gctjExportExcel } from "api/reservation";

export default {
  name: "res_gctj",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.bookTypeList = [
      { label: "全部", value: "" },
      { label: "普通图书", value: "aa" },
      { label: "期刊", value: "bb" }
    ];
    this.timeTypeList = [
      { label: "出版年度", value: "出版年度" },
      { label: "录入年度", value: "录入年度" }
    ];
    return {
      libid: this.$store.getters.userInfo.libId,
      bookTypeId: "",
      timeTypeId: "出版年度",
      loadGCTJData: false,
      GCTJList: [],
      requestObj: {}
    };
  },
  methods: {
    search() {
      this.getGctjList();
    },
    getGctjList() {
      this.requestObj = {
        libid: this.libid,
        bookType: this.bookTypeId
      };
      this.loadGCTJData = true;
      gctj({
        ...this.requestObj
      })
        .then(res => {
          this.loadGCTJData = false;
          this.GCTJList = [...res.data];
        })
        .catch(() => {
          this.loadGCTJData = false;
        });
    },
    handleDownLoadExcel() {
      downLoadExcel(gctjExportExcel(), {
        ...this.requestObj
      });
    }
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
