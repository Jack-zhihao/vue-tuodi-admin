<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 10:46:51
 -->
<template>
  <div class="res_gcsmqd common__content">
    <td-content-header>
      <span>馆藏书目清单</span>
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
            @change="getUserCZ"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="group__filter_type"
            filterable
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
            class="group__filter_value"
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (filterSearchKey = val),
                search
              )
            "
            @keyup.native.enter="delayFunc(search)"
          ></el-input>
          <p class="desc">财产藏址：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="czid0"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czidList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="desc">现在藏址：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="czid1"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czidList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line">
          <span class="label">创建时间：</span>
          <el-date-picker
            v-model="riqi1"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span>至&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="riqi2"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line3" ref="literatureTable">
        <el-table
          v-loading="loading"
          border=""
          :data="gcsmqdList"
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
            prop="isbn"
            label="ISBN/ISSN"
            width="145"
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
            prop="zrsming"
            label="责任说明"
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
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ccun"
            label="尺寸"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yma"
            label="页数"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookNumber"
            label="册数"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="riqi"
            label="书目创建时间"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <div class="computed__table">
          <div class="left">
            <div>种数：{{ zataiObj.totalNumber || "-" }}</div>
            <div>册数：{{ zataiObj.totalBookNumber || "-" }}</div>
            <div>总金额：{{ zataiObj.totalPrice || "-" }}</div>
          </div>
        </div>
      </div>
      <div class="content__page">
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
import { gcsmqd, gcsmqdExportExcel } from "api/reservation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import { userCzList } from "api/public";
import { GCSMQD_OPTIONS } from "utils/selectOptions";

export default {
  name: "res_gcsmqd",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.filterOptions = GCSMQD_OPTIONS;
    return {
      libid: this.$store.getters.userInfo.libId,
      currentFilterKey: "ztming",
      filterSearchKey: "",
      riqi1: "",
      riqi2: "",
      loading: false,
      gcsmqdList: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 15,
      requestObj: {},
      zataiObj: {},
      czid1: "",
      czid0: "",
      czidList: []
    };
  },
  methods: {
    search() {
      this.pageNumber = 1;
      this.getGcsmqdList();
    },
    getGcsmqdList() {
      this.requestObj = {
        libid: this.libid,
        riqi1: this.riqi1,
        riqi2: this.riqi2,
        czid1: this.czid1,
        czid0: this.czid0,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey;
      this.loading = true;
      gcsmqd({
        ...this.requestObj
      })
        .then(res => {
          this.loading = false;
          res.data.page.dataList.forEach(ele => {
            ele.isbn = ele.isbn || ele.issn;
          });
          this.totalCount = Number(res.data.page.totalElements);
          this.gcsmqdList = res.data.page.dataList;

          this.zataiObj = {
            totalBookNumber: res.data.totalBookNumber,
            totalNumber: res.data.totalNumber,
            totalPrice: res.data.totalPrice
          };
        })
        .catch(() => {
          this.loading = false;
        });
    },
    handleSizeChange(pageSize) {
      this.pageNumber = 1;
      this.pageSize = pageSize;
      this.getGcsmqdList();
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getGcsmqdList();
    },
    handleDownLoadExcel() {
      downLoadExcel(gcsmqdExportExcel(), {
        ...this.requestObj
      });
    },
    getUserCZ() {
      userCzList({
        libId: this.libid
      }).then(res => {
        this.czidList = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
      });
    }
  },
  created() {
    this.getUserCZ();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.computed__table {
  word-break: break-all;
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left {
    div {
      display: inline-block;
      font-weight: 700;
      padding-right: 30px;
      padding-left: 10px;
    }
  }
  .right {
    div {
      display: inline-block;
      font-weight: 700;
      padding-right: 30px;
      padding-left: 10px;
    }
  }
}
</style>
