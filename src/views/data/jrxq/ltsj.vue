<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:34:32
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:40:51
 -->
<template>
  <div class="jrxq-ltsj common__content">
    <td-content-header>
      流通数据
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
            @change="currentLibChange"
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
            v-model="currentCzidKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ltsjOptions"
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
            v-model="circulateSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCirList"
          ></el-input>
        </div>

        <div class="header__line">
          <span class="label">类型：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="operate"
          >
            <el-option
              v-for="item in operateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">藏址：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="addressId"
          >
            <el-option
              v-for="item in czIdOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">借出时间：</p>
          <el-date-picker
            v-model="brwTimeStart"
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
            v-model="brwTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
        </div>

        <div class="header__line">
          <p class="label">应还时间：</p>
          <el-date-picker
            v-model="returnTimeStart"
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
            v-model="returnTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <p class="label">还书时间：</p>
          <el-date-picker
            v-model="giveBackTimeStart"
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
            v-model="giveBackTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
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
          <el-button type="primary" size="mini" @click="initCirList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          v-loading="loadCirculateData"
          ref="table"
          border
          :data="circulateList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
            width="120"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cirId" label="流通编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerName"
            label="读者姓名"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerBarcode"
            label="读者证号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookBarcode"
            label="条形码"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bookName" label="正题名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookPrice"
            label="册价"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="addressName"
            label="藏址"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="operate"
            label="类型"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="brwTime"
            label="借出时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="returnTime"
            label="应还时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="giveBackTime"
            label="还书时间"
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
          @size-change="handleCirSizeChange"
          @current-change="handleCirCurrentChange"
          :total="totalCirculateCount"
          :currentPage="currentCirculatePage"
          :pageSize="circulatePageSize"
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
  searchCir,
  searchCirExcel
} from "api/data";

import { userCzList } from "api/public";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_ltsj",
  data() {
    this.ltsjOptions = [
      {
        value: "cirId",
        label: "流通编号"
      },
      {
        value: "readerName",
        label: "读者姓名"
      },
      {
        value: "readerBarcode",
        label: "读者证号"
      },
      {
        value: "bookBarcode",
        label: "条形码"
      },
      {
        value: "bookName",
        label: "正题名"
      }
    ];
    this.operateOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "1",
        label: "借出"
      },
      {
        value: "2",
        label: "归还"
      }
    ];
    return {
      areaId: "",
      addressId: "",
      operate: "",
      czIdOptions: [],
      memberLib: "",
      memberLibArr: [],
      region: [],
      regionArr: [],
      isShow: false,
      idArr: {},
      //时间传参
      giveBackTimeStart: "",
      giveBackTimeEnd: "",
      returnTimeStart: "",
      returnTimeEnd: "",
      brwTimeStart: "",
      brwTimeEnd: "",
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      loadCirculateData: false,
      circulateList: [],
      circulateSearchKey: "",
      currentCzidKey: "cirId",
      circulatePageSize: 15,
      currentCirculatePage: 1,
      totalCirculateCount: 0
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
    currentLibChange() {
      this.getCzOptions();
    },
    // 搜索条件
    getCzOptions() {
      userCzList({
        libId: this.memberLib
      }).then(res => {
        this.czIdOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        this.czIdOptions.unshift({ label: "全部", value: "" });
      });
    },
    // 流通列表
    initCirList() {
      this.currentCirculatePage = 1;
      this.setRequestObj();
      this.getCirList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        operate: this.operate,
        libId: this.memberLib,
        addressId: this.addressId,
        returnTimeStart: this.returnTimeStart,
        returnTimeEnd: this.returnTimeEnd,
        giveBackTimeStart: this.giveBackTimeStart,
        giveBackTimeEnd: this.giveBackTimeEnd,
        brwTimeStart: this.brwTimeStart,
        brwTimeEnd: this.brwTimeEnd,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentCzidKey] = this.circulateSearchKey;
    },
    getCirList() {
      this.loadCirculateData = true;
      let requestObj = {
        pageNumber: this.currentCirculatePage,
        pageSize: this.circulatePageSize,
        ...this.requestObj
      };
      searchCir(requestObj)
        .then(res => {
          this.loadCirculateData = false;
          this.circulateList = res.data.dataList;
          this.totalCirculateCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCirculateData = false));
    },
    handleCirSizeChange(val) {
      this.circulatePageSize = val;
      this.getCirList();
    },
    handleCirCurrentChange(val) {
      this.currentCirculatePage = val;
      this.getCirList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchCirExcel(), {
        ...this.requestObj,
        func_name_us: "special_searchCirExcel"
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
    this.getCzOptions();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content__table {
  height: ~"calc(100% - 124px - 32px)" !important;
}
</style>
