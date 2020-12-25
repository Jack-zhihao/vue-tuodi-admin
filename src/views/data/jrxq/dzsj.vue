<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:33:46
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:22:18
 -->
<template>
  <div class="jrxq-dzsj common__content">
    <td-content-header>
      读者数据
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
            v-model="currentReaderKey"
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
            v-model="readerSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="iniReaderList"
          ></el-input>
        </div>
        <div class="header__line">
          <span class="label">性别：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="readerGender"
          >
            <el-option
              v-for="item in readerGenderOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="readerStatus"
          >
            <el-option
              v-for="item in readerStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">办证时间：</p>
          <el-date-picker
            v-model="createTimeStart"
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
            v-model="createTimeEnd"
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
          <p class="label">截止时间：</p>
          <el-date-picker
            v-model="endTimeStart"
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
            v-model="endTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

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
          <el-button type="primary" size="mini" @click="iniReaderList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line3">
        <el-table
          v-loading="loadReaderData"
          ref="table"
          border
          :data="readerList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column show-overflow-tooltip prop="readerName" label="姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerIdCard"
            label="证件号码"
            width="161"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerTypeName"
            label="读者类型"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="unit" label="读者单位">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerGender"
            label="性别"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mobilePhone"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="classes" label="级/班">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerStatus"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="createTime"
            label="办证时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="endTime"
            label="截止时间"
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
          @size-change="handleReaderSizeChange"
          @current-change="handleReaderChange"
          :total="totalReaderCount"
          :currentPage="currentReaderPage"
          :pageSize="readerPageSize"
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
  searchReader,
  searchReaderExport
} from "api/data";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_dzsj",
  data() {
    this.readerOptions = [
      {
        value: "readerCode",
        label: "读者证号"
      },
      {
        value: "readerName",
        label: "姓名"
      },
      {
        value: "readerType",
        label: "读者类型"
      },
      {
        value: "unit",
        label: "读者单位"
      },
      {
        value: "idNumber",
        label: "证件号码"
      },
      {
        value: "mobilePhone",
        label: "联系方式"
      }
    ];
    this.readerGenderOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "男",
        label: "男"
      },
      {
        value: "女",
        label: "女"
      }
    ];
    this.readerStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "正常",
        label: "正常"
      },
      {
        value: "注销",
        label: "注销"
      },
      {
        value: "挂失",
        label: "挂失"
      },
      {
        value: "暂停",
        label: "暂停"
      },
      {
        value: "退证",
        label: "退证"
      },
      {
        value: "过期",
        label: "过期"
      },
      {
        value: "其他",
        label: "其他"
      }
    ];
    return {
      areaId: "",
      readerGender: "",
      readerStatus: "",
      memberLib: "",
      memberLibArr: [],
      region: [],
      regionArr: [],
      isShow: false,
      idArr: {},
      //时间传参
      createTimeStart: "",
      createTimeEnd: "",
      endTimeStart: "",
      endTimeEnd: "",
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      loadReaderData: false,
      readerList: [],
      readerSearchKey: "",
      currentReaderKey: "readerCode",
      readerPageSize: 15,
      currentReaderPage: 1,
      totalReaderCount: 0
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
    // 读者数据列表
    iniReaderList() {
      this.currentReaderPage = 1;
      this.setRequestObj();
      this.getReaderList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        readerGender: this.readerGender,
        readerStatus: this.readerStatus,
        libId: this.memberLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd,
        createTimeStart: this.createTimeStart,
        createTimeEnd: this.createTimeEnd,
        endTimeStart: this.endTimeStart,
        endTimeEnd: this.endTimeEnd
      };
      this.requestObj[this.currentReaderKey] = this.readerSearchKey;
    },
    getReaderList() {
      this.loadReaderData = true;
      let requestObj = {
        pageNumber: this.currentReaderPage,
        pageSize: this.readerPageSize,
        ...this.requestObj
      };
      searchReader(requestObj)
        .then(res => {
          this.loadReaderData = false;
          this.readerList = res.data.dataList;
          this.totalReaderCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadReaderData = false));
    },
    handleReaderSizeChange(val) {
      this.readerPageSize = val;
      this.getReaderList();
    },
    handleReaderChange(val) {
      this.currentReaderPage = val;
      this.getReaderList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchReaderExport(), {
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
