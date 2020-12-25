<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:29:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-06 15:48:15
 -->
<template>
  <div class="jrxq-dzlx common__content">
    <td-content-header>
      读者类型
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

          <span class="label" style="marginLeft:13px">成员馆：</span>

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
            v-model="typeCodeKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeCodeOptions"
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
            v-model="readerTypeSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initReaderTypeList"
          ></el-input>
        </div>

        <div class="header__line">
          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="invalid"
          >
            <el-option
              v-for="item in readerTypeStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

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
          <el-button type="primary" size="mini" @click="initReaderTypeList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-table
          v-loading="loadReaderTypeData"
          ref="table"
          border
          :data="readerTypeList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            show-overflow-tooltip
            prop="readerTypeCode"
            label="读者类型代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerTypeName"
            label="读者类型名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="invalid"
            label="状态"
            width="45"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.invalid == 0 ? "注销" : "正常" }}</div>
            </template>
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
          @size-change="handleReaderTypeSizeChange"
          @current-change="handleReaderTypeCurrentChange"
          :total="totalReaderTypeCount"
          :currentPage="readerTypePage"
          :pageSize="readerTypePageSize"
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
  searchReaderType,
  searchReaderTypeExport
} from "api/data";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_dzlx",
  data() {
    this.typeCodeOptions = [
      {
        value: "readerTypeCode",
        label: "读者类型代码"
      },
      {
        value: "readerTypeName",
        label: "读者类型名称"
      }
    ];
    this.readerTypeStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: 1,
        label: "正常"
      },
      {
        value: 0,
        label: "注销"
      }
    ];
    return {
      areaId: "",
      invalid: "",
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
      loadReaderTypeData: false,
      readerTypeList: [],
      readerTypeSearchKey: "",
      typeCodeKey: "readerTypeCode",
      readerTypePageSize: 15,
      readerTypePage: 1,
      totalReaderTypeCount: 0
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
          this.$message("该区域暂没有馆，请重新选择");
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
    // 读者类型列表
    initReaderTypeList() {
      this.readerTypePage = 1;
      this.setRequestObj();
      this.getReaderTypeList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        invalid: this.invalid,
        libId: this.memberLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.typeCodeKey] = this.readerTypeSearchKey;
    },
    getReaderTypeList() {
      this.loadReaderTypeData = true;
      let requestObj = {
        pageNumber: this.readerTypePage,
        pageSize: this.readerTypePageSize,
        ...this.requestObj
      };
      searchReaderType(requestObj)
        .then(res => {
          this.readerTypeList = res.data.dataList;
          this.totalReaderTypeCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadReaderTypeData = false;
        });
    },
    handleReaderTypeSizeChange(val) {
      this.readerTypePageSize = val;
      this.getReaderTypeList();
    },
    handleReaderTypeCurrentChange(val) {
      this.readerTypePage = val;
      this.getReaderTypeList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchReaderTypeExport(), {
        ...this.requestObj
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
