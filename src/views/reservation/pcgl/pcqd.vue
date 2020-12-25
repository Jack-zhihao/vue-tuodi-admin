<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 18:47:48
 -->
<template>
  <div class="res_pcqd common__content">
    <td-content-header>
      <span>批次清单</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleLiteratureSelection.length === 0"
            @click="deletePcqd"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="PcqdList.length == 0"
            @click="print"
          >
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
            @change="getUserList"
            v-model="libid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">批次类型：</p>
          <el-select
            filterable
            size="mini"
            @change="pcqdPcdmList"
            v-model="pcType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in pclxList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            @change="pcqdPcdmList"
            v-model="ztai"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ztaiList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">操作员：</p>
          <el-select
            filterable
            size="mini"
            v-model="userid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.userId"
              :label="item.username"
              :value="item.userId"
            ></el-option>
          </el-select>
          <p class="label">批次代码：</p>
          <el-select
            filterable
            size="mini"
            v-model="dcpcid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in pcdmList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="label">操作时间：</p>
          <el-date-picker
            style="marginRight: 3px;"
            size="mini"
            v-model="time1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="time2"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
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
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (filterSearchKey = val),
                initPcqdList
              )
            "
            @keydown.enter.native="delayFunc(initPcqdList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initPcqdList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line3" ref="literatureTable">
        <el-table
          v-loading="loadPcqdData"
          border=""
          ref="PcqdList"
          :data="PcqdList"
          stripe
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="daima"
            label="批次代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="pcType"
            label="批次类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ccLib"
            label="财产馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xzLib"
            label="现在馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="现藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dcpcscOptime1"
            label="操作时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="marcshuceOptime2"
            label="入库时间"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool :ops="['del']" @handleDel="handleDel(scope.row)">
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handlePcqdSizeChange"
          @current-change="handlePcqdCurrentChange"
          :total="totalPcqdCount"
          :currentPage="currentPcqdPage"
          :pageSize="PcqdPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  pcqdlbList,
  pcqdlbListOperatorList,
  pcqdPcdmList,
  dcpcClean
} from "api/reservation";

import { mapGetters } from "vuex";

import { downLoadExcel } from "utils/utils";

import { RESPCQD_OPTIONS } from "utils/selectOptions";

export default {
  name: "res_pcqd",
  data() {
    this.filterOptions = RESPCQD_OPTIONS;
    this.pclxList = [
      { label: "全部", value: "" },
      { label: "清查", value: "清查" },
      { label: "清点", value: "清点" },
      { label: "普通", value: "普通" }
    ];
    this.ztaiList = [
      { label: "全部", value: "" },
      { label: "正常", value: "正常" },
      { label: "历史", value: "历史" }
    ];

    return {
      // 列表相关
      multipleLiteratureSelection: [],
      filterSearchKey: "",
      currentFilterKey: "tiaoma",
      libid: this.$store.getters.userInfo.libId,
      pcType: "",
      time1: "",
      time2: "",
      userid: "",
      dcpcid: "",
      ztai: "",
      readerTypeList: [],
      userList: [],
      loadPcqdData: false,
      PcqdList: [],
      PcqdPageSize: 15,
      currentPcqdPage: 1,
      totalPcqdCount: 0,
      requestObj: {},
      pcdmList: []
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.pcscid);
    },
    // 单个删除
    handleDel(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dcpcClean({ pcscids: row.pcscid }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getPcqdList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deletePcqd() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          dcpcClean({ pcscids: this.multipleLiteratureSelection.join() }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  message: res.message,
                  type: "success"
                });
                this.getPcqdList();
              }
            }
          );
        })
        .catch(() => {});
    },
    initPcqdList() {
      this.currentPcqdPage = 1;
      this.getPcqdList();
    },
    // 批次代码的加载
    pcqdPcdmList() {
      pcqdPcdmList({
        ztai: this.ztai,
        pcType: this.pcType
      }).then(res => {
        this.dcpcid = "";
        this.pcdmList = res.data.map(item => {
          return {
            label: item.daima,
            value: item.dcpcid
          };
        });
        this.pcdmList.unshift({ label: "全部", value: "" });
      });
    },

    getPcqdList() {
      this.loadPcqdData = true;
      this.requestObj = {
        libid: this.libid,
        pcType: this.pcType,
        userid: this.userid,
        time1: this.time1 || "",
        time2: this.time2 || "",
        dcpcid: this.dcpcid,
        ztai: this.ztai,
        pageNumber: this.currentPcqdPage,
        pageSize: this.PcqdPageSize
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /\s+/g,
        ""
      );
      pcqdlbList(this.requestObj)
        .then(res => {
          this.loadPcqdData = false;
          this.PcqdList = res.data.dataList;
          this.totalPcqdCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadPcqdData = false;
        });
    },
    handlePcqdSizeChange(val) {
      this.PcqdPageSize = val;
      this.getPcqdList();
    },
    handlePcqdCurrentChange(val) {
      this.currentPcqdPage = val;
      this.getPcqdList();
    },
    getUserList() {
      pcqdlbListOperatorList({
        libid: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.userid = "";
        res.data.unshift({
          userId: "",
          username: "全部"
        });
        this.userList = res.data;
      });
    },
    rowClick(row) {
      this.$refs.PcqdList.toggleRowSelection(row);
    },
    print() {
      this.requestObj.func_name_us = "pcqd";
      downLoadExcel(
        "/api/e/libCollection/pcgl/pcqdExportExcel",
        this.requestObj
      );
    }
  },
  mounted() {
    this.getUserList();
    this.pcqdPcdmList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
