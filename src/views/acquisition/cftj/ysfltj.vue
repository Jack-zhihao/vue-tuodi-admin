<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-11 19:28:35
 * @LastEditTime: 2020-03-10 09:46:03
 -->

<template>
  <div class="acq-ysfltj common__content">
    <td-content-header>
      验收分类统计
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
          <p class="label">验收单：</p>
          <el-select
            filterable
            size="mini"
            v-model="ysdIds"
            multiple
            class="multi line"
            collapse-tags
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in ysdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">验收日期：</p>
          <el-date-picker
            v-model="rkDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            style="marginRight:3px"
            placeholder="开始时间"
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
      <div class="content__table" ref="ysfltjTable">
        <el-scrollbar>
          <el-table
            v-loading="loadGBCCTJData"
            border
            :data="ysfltjList"
            stripe
            style="width: 100%"
            height="100%"
          >
            <el-table-column
              align="center"
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
              prop="yscNum"
              label="验收册数"
            >
            </el-table-column>
            <el-table-column
              align="center"
              show-overflow-tooltip
              prop="zprice"
              label="总价"
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

import { yspcList } from "api/public";

import { getYsflReport } from "api/catalogue";

export default {
  name: "acq_ysfltj",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.categories = categories;
    return {
      // 筛选条件
      currentLib: this.$store.getters.userInfo.libId,
      ysdOptions: [],
      ysdIds: [],
      rkDateStart: "",
      rkDateEnd: "",
      // 列表
      loadGBCCTJData: false,
      ysfltjList: []
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
      yspcList({
        libId: this.currentLib
      }).then(res => {
        this.ysdOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.yspcid
          };
        });
        this.ysdIds = [];
      });
    },
    // 列表
    getGBCCTJList() {
      this.loadGBCCTJData = true;

      let requestObj = {
        libid: this.currentLib,
        yspcids: this.ysdIds.join(","),
        start: this.rkDateStart ? this.rkDateStart : "",
        end: this.rkDateEnd ? this.rkDateEnd : ""
      };

      getYsflReport(requestObj)
        .then(res => {
          let arr = [];
          let totalZnum = 0,
            totalCnum = 0,
            totalZprice = 0;
          categoriesKeys.forEach(key => {
            let data = res.data[key];
            totalZnum += +data.znum || 0;
            totalCnum += +data.yscNum || 0;
            totalZprice += +data.zprice || 0;
            arr.push({
              key: key,
              znum: data.znum,
              yscNum: data.yscNum,
              zprice: data.zprice
            });
          });
          arr.push({
            key: "总计",
            znum: totalZnum,
            yscNum: totalCnum,
            zprice: parseFloat(totalZprice).toFixed(2)
          });
          this.ysfltjList = arr;
        })
        .finally(() => {
          this.loadGBCCTJData = false;
        });
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/report/acceptanceClassify", {
        libid: this.currentLib,
        yspcids: this.ysdIds.join(","),
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
