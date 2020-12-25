<!--
 * @labelription: 催缺单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-10 16:10:16
 -->
<template>
  <div class="jjlb common__content">
    <td-content-header>
      催缺单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleExport"
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
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">应到时间：</p>
          <el-date-picker
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            value-format="yyyy-MM-dd"
            style="marginRight:3px;"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            value-format="yyyy-MM-dd"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <p class="label">供应商：</p>
          <el-select
            filterable
            size="mini"
            v-model="userid"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in operator"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-input
            ref="focusInput"
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
            style="flex:auto;max-width:200px"
          ></el-input>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          v-loading="loadLiteratureData"
          border
          :data="literatureList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="issn"
            label="ISSN"
            width="145"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dgh"
            label="订购号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="gysName" label="供应商">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="qi" label="应到期">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="zongfuben"
            label="应到数量"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="weidao" label="未到数量">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jiage" label="单价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ydnianjia" label="总价">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { cqdList, gysList, cqdExcel } from "api/periodical";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";

import { QKCQD_OPTIONS } from "utils/selectOptions";

export default {
  name: "opera_pcqd",
  data() {
    this.literatureFilterOptions = QKCQD_OPTIONS;
    return {
      // 操作员列表
      operator: [],
      userid: "",
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "issn",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择
              time.getTime() > Date.now() ||
              time.getTime() > new Date(this.date2)
            );
          }
          // 结束时间没选--可以选择当天
          return time.getTime() > Date.now();
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(this.date1)
          );
        }
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.getLiteratureList();
    },
    gysList() {
      gysList({ libid: this.selectLibId }).then(res => {
        this.operator = res.data.map(item => {
          return {
            label: item.gysName,
            value: item.gysId
          };
        });
      });
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.selectLibId,
        gysid: this.userid,
        date1: this.date1,
        date2: this.date2
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj
      };

      cqdList(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          this.literatureList = res.data.dataList;
          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    // 导出
    handleExport() {
      this.setRequestObj();
      downLoadExcel(cqdExcel(), {
        ...this.requestObj,
        func_name_us: "cqd"
      });
    }
  },
  mounted() {
    this.initLiteratureList();
    this.gysList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
