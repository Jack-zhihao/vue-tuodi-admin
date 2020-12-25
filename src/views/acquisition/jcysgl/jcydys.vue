<!--
 * @Description: 教材预订验收（和预订验收一样，去掉快捷验收）
 * @Autor: chenming.feng
 * @Date: 2019-11-04 10:53:42
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:51:37
 -->
<template>
  <div class="acq-ydys common__content" ref="contentWrapper">
    <td-content-header>
      教材书目信息
      <span v-show="quickInfo.yspcCode"
        >【验收单：{{ quickInfo.yspcCode }}】</span
      >
    </td-content-header>
    <!-- 顶部列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">预订单：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectedYdd"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yddOptions"
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
            ref="focusInput"
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarColabelanner(
                $event,
                val => (currentFilterVal = val),
                initYDCatalogList
              )
            "
            @keydown.enter.native="delayFunc(initYDCatalogList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initYDCatalogList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div ref="topTable" class="content__table">
        <el-table
          v-loading="loadYDCatalogData"
          border
          highlight-current-row
          :data="ydCatalogList"
          stripe
          style="width: 100%"
          class="top__table"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yma"
            label="页数"
            width="60"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfangshi"
            label="装订方式"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jzleixing"
            label="介质类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ydCode" label="预订单">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ydTime" label="预订时间">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.ydCatalogid"
                :index="scope.$index"
                :ops="[]"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="
                      handleYSPage(
                        scope.row.marcid,
                        scope.row.marctyid,
                        scope.row.ydsmid
                      )
                    "
                  >
                    验收
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleYDCatalogSizeChange"
          @current-change="handleYDCatalogCurrentChange"
          :total="totalYDCatalogCount"
          :currentPage="currentYDCatalogPage"
          :pageSize="ydCatalogPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { quickAcceptance, ydPcList, searchYdsm } from "api/acquisition";

export default {
  name: "acq_jcydys",
  data() {
    this.filterOptions = [
      {
        value: "1",
        label: "ISBN"
      },
      {
        value: "2",
        label: "正题名"
      },
      {
        value: "3",
        label: "责任者"
      },
      {
        value: "4",
        label: "价格"
      },
      {
        value: "5",
        label: "出版社"
      },
      {
        value: "6",
        label: "分类号"
      },
      {
        value: "7",
        label: "订购编号"
      },
      {
        value: "8",
        label: "副题名"
      },
      {
        value: "9",
        label: "丛编题名"
      },
      {
        value: "10",
        label: "分辑号"
      },
      {
        value: "11",
        label: "索书号"
      },
      {
        value: "12",
        label: "条码号"
      }
    ];
    return {
      // 列表相关
      selectedYdd: "",
      yddOptions: [],
      currentFilterKey: "1",
      loadYDCatalogData: false,
      ydCatalogList: [],
      currentFilterVal: "",
      ydCatalogPageSize: 15,
      currentYDCatalogPage: 1,
      totalYDCatalogCount: 0,
      quickInfo: {}
    };
  },
  methods: {
    getQuickAcceptance() {
      this.isGetQuickAcceptance = true;
      quickAcceptance()
        .then(res => {
          this.quickInfo = res.data;
        })
        .finally(() => {
          this.isGetQuickAcceptance = false;
        });
    },
    // 征订目录列表
    initYDCatalogList() {
      this.currentYDCatalogPage = 1;
      this.setRequestObj();
      this.getYDCatalogList();
    },
    setRequestObj() {
      this.requestObj = {
        ydpcid: this.selectedYdd,
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      };
    },
    getYDCatalogList() {
      this.loadYDCatalogData = true;

      let requestObj = {
        pageNumber: this.currentYDCatalogPage,
        pageSize: this.ydCatalogPageSize,
        ...this.requestObj
      };

      searchYdsm(requestObj)
        .then(res => {
          this.ydCatalogList = res.data.dataList;
          this.totalYDCatalogCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadYDCatalogData = false;
        });
    },
    handleYDCatalogSizeChange(val) {
      this.ydCatalogPageSize = val;
      this.getYDCatalogList();
    },
    handleYDCatalogCurrentChange(val) {
      this.currentYDCatalogPage = val;
      this.getYDCatalogList();
    },
    getYdPcList() {
      ydPcList().then(res => {
        this.yddOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ydpcid
          };
        });
        this.yddOptions.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    // 前往书目验收
    handleYSPage(marcid, marctyid, ydsmid) {
      this.$router.push({
        name: "acq_jcsmys",
        query: {
          marcid,
          marctyid,
          ydsmid,
          from: "acq_jcydys"
        }
      });
    }
  },
  mounted() {
    this.getYdPcList();
    this.$eventBus.$on("jdbm-update", () => {
      this.initYDCatalogList();
    });
    this.getQuickAcceptance();
    this.$refs["focusInput"].focus();
  },
  activated() {
    if (this.isGetQuickAcceptance) {
      return;
    }
    this.getQuickAcceptance();
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
