<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:33:32
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:07:48
 -->
<template>
  <div class="jrxq-czsj common__content">
    <td-content-header>
      藏址数据
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
            v-model="currentCzKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerOptions"
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
            v-model="czSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="iniCzList"
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
              v-for="item in czStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">藏址类型：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="addressType"
          >
            <el-option
              v-for="item in czTypeOptions"
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
          <el-button type="primary" size="mini" @click="iniCzList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-table
          v-loading="loadCzData"
          ref="table"
          border
          :data="czList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            show-overflow-tooltip
            prop="addressCode"
            label="藏址代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="addressName"
            label="藏址名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="addressType"
            label="藏址类型"
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
              <div>{{ scope.row.invalid | changeState }}</div>
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
          @size-change="handleCzSizeChange"
          @current-change="handleCzChange"
          :total="totalCzCount"
          :currentPage="currentCzPage"
          :pageSize="czPageSize"
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
  searchLibraryAddress,
  searchLibraryAddressExport
} from "api/data";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_czsj",
  data() {
    this.readerOptions = [
      {
        value: "addressCode",
        label: "藏址代码"
      },
      {
        value: "addressName",
        label: "藏址名称"
      }
    ];
    this.czStatusOptions = [
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
      },
      {
        value: 2,
        label: "其他"
      }
    ];
    this.czTypeOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "0",
        label: "普通藏址"
      },
      {
        value: "1",
        label: "智慧书房"
      }
    ];
    return {
      areaId: "",
      invalid: "",
      addressType: "",
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
      loadCzData: false,
      czList: [],
      czSearchKey: "",
      currentCzKey: "addressCode",
      czPageSize: 15,
      currentCzPage: 1,
      totalCzCount: 0
    };
  },
  filters: {
    changeState(val) {
      if (val == 0) {
        return "注销";
      } else if (val == 1) {
        return "正常";
      } else {
        return "其他";
      }
    }
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
    // 藏址数据列表
    iniCzList() {
      this.currentCzPage = 1;
      this.setRequestObj();
      this.getCzList();
    },
    setRequestObj() {
      this.requestObj = {
        addressType: this.addressType,
        invalid: this.invalid,
        areaId: this.areaId,
        libId: this.memberLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentCzKey] = this.czSearchKey;
    },
    getCzList() {
      this.loadCzData = true;
      let requestObj = {
        pageNumber: this.currentCzPage,
        pageSize: this.czPageSize,
        ...this.requestObj
      };

      searchLibraryAddress(requestObj)
        .then(res => {
          this.loadCzData = false;
          this.czList = res.data.dataList;
          this.totalCzCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCzData = false));
    },
    handleCzSizeChange(val) {
      this.czPageSize = val;
      this.getCzList();
    },
    handleCzChange(val) {
      this.currentCzPage = val;
      this.getCzList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchLibraryAddressExport(), {
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
