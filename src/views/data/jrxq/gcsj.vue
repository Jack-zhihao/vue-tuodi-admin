<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:34:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:34:12
 -->
<template>
  <div class="jrxq-gcsj common__content">
    <td-content-header>
      馆藏数据
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
              v-for="item in booksOptions"
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
            v-model="collectionSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCollectionList"
          ></el-input>
        </div>

        <div class="header__line">
          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="operate"
          >
            <el-option
              v-for="item in bookStatusOptions"
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

          <p class="label">入库时间：</p>
          <el-date-picker
            v-model="putStorageTimeStart"
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
            v-model="putStorageTimeEnd"
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
          <el-button type="primary" size="mini" @click="initCollectionList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line3">
        <el-table
          v-loading="loadCollectionData"
          ref="table"
          border
          :data="collectionList"
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
          <el-table-column
            show-overflow-tooltip
            prop="bookId"
            label="书册编号"
            width="161"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookBarcode"
            label="条形码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="callNumber"
            label="索书号"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bookName" label="正题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="subTitle" label="副题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="author" label="责任者">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="publisher"
            label="出版社"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookPrice"
            label="册价"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="addressName"
            label="藏址"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookStatus"
            label="状态"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="putStorageTime"
            label="入库时间"
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
          @size-change="handleCollectionSizeChange"
          @current-change="handleCollectionCurrentChange"
          :total="totalCollectionCount"
          :currentPage="currentCollectionPage"
          :pageSize="collectionPageSize"
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
  searchCollection,
  searchCollectionExcel
} from "api/data";

import { userCzList } from "api/public";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_gcsj",
  data() {
    this.booksOptions = [
      {
        value: "bookId",
        label: "书册编号"
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
        value: "bookBarcode",
        label: "条形码"
      },
      {
        value: "callNumber",
        label: "索书号"
      },
      {
        value: "author",
        label: "责任者"
      },
      {
        value: "subTitle",
        label: "副题名"
      },
      {
        value: "publisher",
        label: "出版社"
      }
    ];
    this.bookStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "在馆",
        label: "在馆"
      },
      {
        value: "借出",
        label: "借出"
      },
      {
        value: "编目",
        label: "编目"
      },
      {
        value: "丢失",
        label: "丢失"
      },
      {
        value: "剔除",
        label: "剔除"
      },
      {
        value: "交互",
        label: "交互"
      },
      {
        value: "赠送",
        label: "赠送"
      },
      {
        value: "装订",
        label: "装订"
      },
      {
        value: "锁定",
        label: "锁定"
      },
      {
        value: "预约",
        label: "预约"
      },
      {
        value: "闲架",
        label: "闲架"
      },
      {
        value: "修补",
        label: "修补"
      },
      {
        value: "移送",
        label: "移送"
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
      putStorageTimeStart: "",
      putStorageTimeEnd: "",
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      loadCollectionData: false,
      collectionList: [],
      collectionSearchKey: "",
      currentCzidKey: "bookId",
      collectionPageSize: 15,
      currentCollectionPage: 1,
      totalCollectionCount: 0
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
    // 馆藏列表
    initCollectionList() {
      this.currentCollectionPage = 1;
      this.setRequestObj();
      this.getCollectionList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        operate: this.operate,
        libId: this.memberLib,
        addressId: this.addressId,
        putStorageTimeStart: this.putStorageTimeStart,
        putStorageTimeEnd: this.putStorageTimeEnd,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentCzidKey] = this.collectionSearchKey;
    },
    getCollectionList() {
      this.loadCollectionData = true;
      let requestObj = {
        pageNumber: this.currentCollectionPage,
        pageSize: this.collectionPageSize,
        ...this.requestObj
      };
      searchCollection(requestObj)
        .then(res => {
          this.loadCollectionData = false;
          this.collectionList = res.data.dataList;
          this.totalCollectionCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadCollectionData = false));
    },
    handleCollectionSizeChange(val) {
      this.collectionPageSize = val;
      this.getCollectionList();
    },
    handleCollectionCurrentChange(val) {
      this.currentCollectionPage = val;
      this.getCollectionList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchCollectionExcel(), {
        ...this.requestObj,
        func_name_us: "special_searchCollectionExcel"
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
</style>
