<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:34:13
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:44:30
 -->
<template>
  <div class="jrxq-smsj common__content">
    <td-content-header>
      书目数据
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
          <span class="label">选择区域：</span>
          <el-cascader
            v-model="region"
            :options="regionArr"
            @change="handleChange"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'areaId',
              label: 'areaName',
              children: 'childs'
            }"
            size="mini"
            clearable
          >
            <template slot-scope="scope">
              {{ scope.data.areaName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                getLibCounts(scope.data.areaId)
              }}
            </template>
          </el-cascader>

          <span style="marginLeft:13px" class="label">成员馆：</span>

          <el-select
            filterable
            v-model="memberLib"
            placeholder="请选择馆"
            size="mini"
          >
            <el-option
              v-for="item in memberLibArr"
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
            v-model="currentCatalogKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in catalogOptions"
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
            v-model="catalogSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCatalogList"
          ></el-input>
        </div>

        <div class="header__line">
          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="optTimeStart"
            align="right"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="marginRight:3px"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="optTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initCatalogList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-table
          v-loading="loadCatalogData"
          ref="table"
          border
          :data="catalogList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="catalogueId"
            label="书目编号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbnOrissn"
            label="ISBN/ISSN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bookName" label="正题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="subTitle" label="副题名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="partitionName"
            label="分辑名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="author"
            label="责任者"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="clsNumber"
            label="分类号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publisher"
            label="出版社"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publishDate"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="orderNo" label="订购号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="price"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="page"
            label="页码"
            width="60"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="catalogueType"
            label="类型"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="putStorageTime"
            label="编目时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optTime"
            label="操作时间"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCatalogSizeChange"
          @current-change="handleCatalogCurrentChange"
          :total="totalCatalogCount"
          :currentPage="currentCatalogPage"
          :pageSize="catalogPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  searchLib,
  searchLibArea,
  searchCatalogue,
  searchCatalogueExcel
} from "api/data";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_smsj",
  data() {
    this.catalogOptions = [
      {
        value: "catalogueId",
        label: "书名编号"
      },
      {
        value: "isbnOrissn",
        label: "ISBN/ISSN"
      },
      {
        value: "bookName",
        label: "正题名"
      },
      {
        value: "subTitle",
        label: "副题名"
      },
      {
        value: "partitionName",
        label: "分辑名"
      },
      {
        value: "author",
        label: "责任者"
      },
      {
        value: "clsNumber",
        label: "分类号"
      },
      {
        value: "publisher",
        label: "出版社"
      },
      {
        value: "orderNo",
        label: "订购号"
      }
    ];
    return {
      areaId: "",
      memberLib: "",
      memberLibArr: [],
      region: [],
      regionArr: [],
      isShow: false,
      idArr: {},
      //时间传参
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      loadCatalogData: false,
      catalogList: [],
      catalogSearchKey: "",
      currentCatalogKey: "书名编号",
      catalogPageSize: 15,
      currentCatalogPage: 1,
      totalCatalogCount: 0
    };
  },
  methods: {
    getLibCounts(key) {
      return this.idArr[key];
    },
    // 树形馆的对应数量
    treeLibCount() {
      treeLibCount().then(res => {
        this.idArr = res.data;
      });
    },
    // 选择区域
    handleChange(value) {
      // 清空馆下拉框
      this.memberLib = "";
      this.searchLib(value);
      this.areaId = value;
      // 触发了区域选择事件
      this.isSelectRegion = true;
    },
    // 区域树状图
    getAreaTreeData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = treeData;
        this.areaId = "";
      });
    },
    // 查询馆id对应的区域
    searchLibArea(libId) {
      let params = {
        libId
      };
      searchLibArea(params).then(res => {
        // 显示地区
        this.region = res.data.areaId;
        this.areaId = res.data.areaId;
        // 显示馆列表，并且是否显示全部选项
        this.searchLib(this.region);
      });
    },
    // 区域对应的馆
    searchLib(areaId) {
      let params = {
        areaId
      };
      searchLib(params).then(res => {
        if (!res.data.length) {
          this.$message.error("该区域暂没有馆，请重新选择");
          this.memberLibArr = [];
          this.isShow = false; //隐藏全部选项
        } else {
          this.memberLibArr = res.data.map(item => {
            return {
              label: item.libMingcheng,
              value: item.libId
            };
          });
          if (this.memberLibArr.length > 1) {
            //说明有多个馆，显示全部选项
            this.memberLibArr.unshift({ label: "全部", value: "" });
          } else if (this.memberLibArr.length == 1) {
            this.memberLib = this.memberLibArr[0].value;
          }
        }
      });
    },
    // 书目列表
    initCatalogList() {
      this.currentCatalogPage = 1;
      this.setRequestObj();
      this.getCatalogList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        libId: this.memberLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentCatalogKey] = this.catalogSearchKey;
    },
    getCatalogList() {
      this.loadCatalogData = true;
      let requestObj = {
        pageNumber: this.currentCatalogPage,
        pageSize: this.catalogPageSize,
        ...this.requestObj
      };
      searchCatalogue(requestObj)
        .then(res => {
          this.loadCatalogData = false;
          this.catalogList = res.data.dataList;
          this.totalCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCatalogData = false));
    },
    handleCatalogSizeChange(val) {
      this.catalogPageSize = val;
      this.getCatalogList();
    },
    handleCatalogCurrentChange(val) {
      this.currentCatalogPage = val;
      this.getCatalogList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchCatalogueExcel(), {
        ...this.requestObj,
        func_name_us: "special_searchCatalogueExcel"
      });
    }
  },
  created() {
    this.getAreaTreeData();
    this.treeLibCount();
    // 查找对应的地区
    this.searchLibArea(this.$store.getters.userInfo.libId);
  },
  mounted() {
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
