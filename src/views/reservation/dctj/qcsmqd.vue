<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2020-03-05 10:27:08
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 18:56:22
 -->
<template>
  <div class="res_qcsmqd common__content">
    <td-content-header>
      <span>清查书目清单</span>
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
            v-model="libid"
            placeholder="请选择"
            @change="getUserCZ"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">财产藏址：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="czid0"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czidList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">现在藏址：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="czid1"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czidList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">基本大类：</p>
          <el-select
            filterable
            size="mini"
            v-model="classify"
            placeholder="请选择"
          >
            <el-option
              v-for="item in jbTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line" style="margin-top: 3px;">
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
            placeholder="请输入搜索关键词"
            @keydown.enter.native="search"
          ></el-input>
          <p class="label">清查类别：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="inventoryid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span class="label">清查日期：</span>
          <el-date-picker
            v-model="start"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            :picker-options="startDatePicker"
          >
          </el-date-picker>
          <span>至&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="end"
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
      <div class="content__table" ref="literatureTable">
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
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flhao"
            label="分类号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任说明"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN/ISSN"
            width="145"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="classify"
            label="基本大类"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="shuceCount"
            label="馆藏册数"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="invertoryCount"
            label="清查册数"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="inventoryName"
            label="清查类别"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <div class="computed__table">
          <div class="left">
            <div>种数：{{ zataiObj.marcCount || "-" }}</div>
            <div>清查册数：{{ zataiObj.shuceCount || "-" }}</div>
            <div>总金额：{{ zataiObj.priceAll || "-" }}</div>
          </div>
        </div>
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
import { findTypes } from "api/reservation";
import { categories } from "utils/24categories";
import { marctyList, marctyListExport } from "api/reservation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import { userCzList } from "api/public";

export default {
  name: "res_qcsmqd",
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
      filterOptions: [
        { label: "ISBN", value: "isbn" },
        { label: "ISSN", value: "issn" },
        { label: "正题名", value: "ztming" },
        { label: "条形码", value: "barcode" },
        { label: "分类号", value: "flhao" },
        { label: "责任说明", value: "zrsming" },
        { label: "出版社", value: "cbzhe" }
      ],
      classify: "",
      jbTypeList: [],
      inventoryid: "",
      typeArr: [],
      libid: this.$store.getters.userInfo.libId,
      currentFilterKey: "isbn",
      filterSearchKey: "",
      start: "",
      end: "",
      loading: false,
      gcsmqdList: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 15,
      requestObj: {},
      zataiObj: {},
      czid1: "",
      czid0: "",
      czidList: []
    };
  },
  methods: {
    getjbType() {
      for (const [key, val] of Object.entries(categories)) {
        this.jbTypeList.push({
          value: key,
          label: `${key}  ${val}`
        });
      }
      this.jbTypeList.unshift({
        value: "",
        label: "全部"
      });
    },
    findTypes() {
      let newArr = [];
      this.inventoryid = "";
      findTypes({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        if (res.data.dataList.length > 0) {
          newArr = res.data.dataList.map(item => {
            return {
              value: item.inventoryId,
              label: item.inventoryName
            };
          });
          if (newArr.length > 1) {
            newArr.unshift({ label: "全部", value: "" });
          }
          this.typeArr = newArr;
        }
      });
    },
    search() {
      this.pageNumber = 1;
      this.getGcsmqdList();
    },
    getGcsmqdList() {
      this.requestObj = {
        inventoryId: this.inventoryid,
        libId: this.libid,
        start: this.start,
        end: this.end,
        czid1: this.czid1,
        czid0: this.czid0,
        classify: this.classify,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey;
      this.loading = true;
      marctyList({
        ...this.requestObj
      })
        .then(res => {
          this.loading = false;
          res.data.page.dataList.forEach(ele => {
            ele.isbn = ele.isbn || ele.issn;
          });
          this.totalCount = Number(res.data.page.totalElements);
          this.gcsmqdList = res.data.page.dataList;

          this.zataiObj = {
            shuceCount: res.data.shuceCount,
            marcCount: res.data.marcCount,
            priceAll: res.data.priceAll
          };
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
      downLoadExcel(marctyListExport(), {
        ...this.requestObj
      });
    },
    getUserCZ() {
      userCzList({
        libId: this.libid
      }).then(res => {
        this.czidList = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        this.czidList.unshift({
          value: "",
          label: "全部"
        });
      });
    }
  },
  created() {
    this.getUserCZ();
    this.getjbType();
    this.findTypes();
  },
  activated() {
    this.getUserCZ();
    this.getjbType();
    this.findTypes();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content__table {
  height: ~"calc(100% - 93px - 36px)" !important;
}
.computed__table {
  word-break: break-all;
  display: flex;
  justify-content: space-between;
  width: 100%;
  .left {
    div {
      display: inline-block;
      font-weight: 700;
      padding-right: 30px;
      padding-left: 10px;
    }
  }
  .right {
    div {
      display: inline-block;
      font-weight: 700;
      padding-right: 30px;
      padding-left: 10px;
    }
  }
}
</style>
