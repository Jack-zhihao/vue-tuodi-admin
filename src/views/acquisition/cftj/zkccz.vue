<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-11 19:28:35
 * @LastEditTime: 2020-03-10 09:46:18
 -->

<template>
  <div class="acq-zkcctj common__content">
    <td-content-header>
      总括财产统计
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
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="currentLib"
            placeholder="请选择"
            @change="currentLibChange"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">馆藏地点：</p>
          <el-select
            filterable
            size="mini"
            v-model="gcLocIds"
            multiple
            class="multi line"
            clearable
            collapse-tags
            placeholder="请选择"
          >
            <el-option
              v-for="item in gcLocOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

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
          <el-button type="primary" size="mini" @click="getGBCCTJList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="zkcctjTable">
        <el-scrollbar>
          <el-table
            v-loading="loadGBCCTJData"
            border
            :data="zkcctjList"
            stripe
            style="width: 100%;"
            height="100%"
          >
            <el-table-column
              align="left"
              show-overflow-tooltip
              label="基本大类"
            >
              <template slot-scope="scope">
                <span>{{ scope.row.key }}</span>
                <span v-show="categories[scope.row.key]">
                  {{ categories[scope.row.key] }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="znum"
              label="种数"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="znumPercentage"
              label="种数比例%"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="cnum"
              label="册数"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="cnumPercentage"
              label="册数比例%"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="zprice"
              label="流通总价"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="zpricePercentage"
              label="金额比例%"
            >
            </el-table-column>
          </el-table>
        </el-scrollbar>
      </div>
    </div>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { mapGetters } from "vuex";

import { categories, categoriesKeys } from "utils/24categories";

import { userCzList } from "api/public";

import { getZkcczReport } from "api/catalogue";

export default {
  name: "acq_zkccz",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.categories = categories;
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      gcLocOptions: [],
      gcLocIds: [],
      rkDateStart: "",
      rkDateEnd: "",
      // 列表
      loadGBCCTJData: false,
      zkcctjList: []
    };
  },
  methods: {
    // 搜索栏
    initOptions() {
      this.getGcLocOptions();
    },
    currentLibChange() {
      this.initOptions();
    },
    getGcLocOptions() {
      userCzList({
        libId: this.currentLib
      }).then(res => {
        this.gcLocOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        this.gcLocIds = [];
      });
    },
    // 列表
    getGBCCTJList() {
      this.loadGBCCTJData = true;

      let requestObj = {
        libid: this.currentLib,
        czids: this.gcLocIds.join(","),
        start: this.rkDateStart ? this.rkDateStart : "",
        end: this.rkDateEnd ? this.rkDateEnd : ""
      };

      getZkcczReport(requestObj)
        .then(res => {
          let arr = [];
          let totalZnum = 0,
            totalCnum = 0,
            totalZprice = 0,
            totalZpricePercentege = 100.0,
            totalCnumPercentage = 100.0,
            totalZnumPercentage = 100.0;
          categoriesKeys.forEach(key => {
            let data = res.data[key];
            totalZnum += +data.znum || 0;
            totalCnum += +data.cnum || 0;
            totalZprice += +data.zprice || 0;
            // totalZpricePercentege += +data.zpricePercentage || 100.0;
            // totalCnumPercentage += +data.cnumPercentage || 100.0;
            // totalZnumPercentage += +data.znumPercentage || 100.0;
            arr.push({
              key: key,
              znum: data.znum,
              cnum: data.cnum,
              zprice: data.zprice,
              znumPercentage: data.znumPercentage,
              cnumPercentage: data.cnumPercentage,
              zpricePercentage: data.zpricePercentage
            });
          });
          arr.push({
            key: "总计",
            znum: totalZnum,
            cnum: totalCnum,
            zpricePercentage: totalZpricePercentege,
            cnumPercentage: totalCnumPercentage,
            znumPercentage: totalZnumPercentage,
            zprice: parseFloat(totalZprice).toFixed(2)
          });
          this.zkcctjList = arr;
        })
        .finally(() => {
          this.loadGBCCTJData = false;
        });
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/report/allMoney", {
        libid: this.currentLib,
        czids: this.gcLocIds.join(","),
        start: this.rkDateStart ? this.rkDateStart : "",
        end: this.rkDateEnd ? this.rkDateEnd : ""
      });
    }
  },
  mounted() {
    this.initOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
