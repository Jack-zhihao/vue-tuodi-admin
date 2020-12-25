<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2020-03-07 08:57:28
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-09 15:51:09
 -->
<template>
  <div class="opera_bbqd common__content">
    <td-content-header>
      <span>背包清单</span>
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
            v-model="libId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">批次：</p>
          <el-select filterable size="mini" v-model="pcId" placeholder="请选择">
            <el-option
              v-for="item in pcidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            class="group__filter_type"
            filterable
            size="mini"
            v-model="currentCzKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czOptions"
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
            v-model="czSearchKey"
            placeholder="请输入"
            @keydown.enter.native="search"
          ></el-input>
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
            placeholder="请输入"
            @keydown.enter.native="search"
          ></el-input>
        </div>
        <div class="header__line">
          <el-select
            class="group__filter_type"
            filterable
            size="mini"
            v-model="currentOperatorKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in operatorOptions"
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
            v-model="operatorSearchKey"
            placeholder="请输入"
            @keydown.enter.native="search"
          ></el-input>
          <p class="label">状态：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="ztai"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ztaiArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="label">操作时间：</span>
          <el-date-picker
            v-model="time1"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            :picker-options="startDatePicker"
          >
          </el-date-picker>
          <span>至&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="time2"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
            :picker-options="endDatePicker"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
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
            label="序号"
            align="center"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="pcName"
            label="批次名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ftming"
            label="副题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjming"
            label="分辑名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="barcode"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName0"
            label="原藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName2"
            label="目的藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName1"
            label="现藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userCode"
            label="操作员账号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="操作时间"
          ></el-table-column>
        </el-table>
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
import {
  backPackSearch,
  backPackSearchExport,
  getSxjpcList
} from "api/operation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";

export default {
  name: "opera_bbqd",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.startDatePicker = {
      disabledDate: time => {
        if (this.date2) {
          return (
            // 如果结束时间已经选择
            time.getTime() > new Date(this.date2)
          );
        }
      }
    };
    this.endDatePicker = {
      disabledDate: time => {
        return time.getTime() < new Date(this.date1) - 8.64e7;
      }
    };
    return {
      ztaiArr: [
        { label: "全部", value: "" },
        { label: "待上架", value: "待上架" },
        { label: "正常下架", value: "正常下架" },
        { label: "额外下架", value: "额外下架" }
      ],
      operatorOptions: [
        { label: "操作员", value: "userName" },
        { label: "操作员账号", value: "userCode" }
      ],
      czOptions: [
        { label: "原藏址", value: "czId0" },
        { label: "目的藏址", value: "endCzId" },
        { label: "现藏址", value: "czId1" }
      ],
      filterOptions: [
        { label: "ISBN", value: "isbn" },
        { label: "条形码", value: "barcode" },
        { label: "正题名", value: "ztming" },
        { label: "副题名", value: "ftming" },
        { label: "分辑名", value: "fjming" }
      ],
      pcId: "",
      pcidOptions: [],
      ztai: "",
      libId: this.$store.getters.userInfo.libId,
      currentCzKey: "czId0",
      czSearchKey: "",
      currentOperatorKey: "userName",
      operatorSearchKey: "",
      currentFilterKey: "isbn",
      filterSearchKey: "",
      time1: "",
      time2: "",
      loading: false,
      gcsmqdList: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 15,
      requestObj: {}
    };
  },
  methods: {
    //获取批次列表
    getSxjpcList() {
      getSxjpcList({ libId: this.libId }).then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.id,
            label: item.daima
          };
        });
        this.pcidOptions.unshift({ label: "全部", value: "" });
      });
    },
    search() {
      this.pageNumber = 1;
      this.getGcsmqdList();
    },
    getGcsmqdList() {
      this.requestObj = {
        pcId: this.pcId,
        ztai: this.ztai,
        libId: this.libId,
        time1: this.time1,
        time2: this.time2,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      this.requestObj[this.currentCzKey] = this.czSearchKey;
      this.requestObj[this.currentOperatorKey] = this.operatorSearchKey;
      this.requestObj[this.currentFilterKey] = this.filterSearchKey;
      this.loading = true;
      backPackSearch({
        ...this.requestObj
      })
        .then(res => {
          this.loading = false;
          res.data.dataList.forEach(ele => {
            ele.isbn = ele.isbn || ele.issn;
          });
          this.totalCount = Number(res.data.totalElements);
          this.gcsmqdList = res.data.dataList;
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
      downLoadExcel(backPackSearchExport(), {
        ...this.requestObj
      });
    }
  },
  created() {
    this.getGcsmqdList();
    this.getSxjpcList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
