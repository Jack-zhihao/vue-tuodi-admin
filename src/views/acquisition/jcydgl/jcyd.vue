<!--
 * @Description: 教材订（将原直接预订页面迁移，移除底部预订记录，验收记录，馆藏记录列表）
 * @Autor: chenming.feng
 * @Date: 2019-11-04 10:52:34
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:50:18
 -->

<template>
  <div class="acq-zjyd common__content">
    <td-content-header>
      预订教材信息【预订单号：{{ defaultYDD || "暂未设置" }}】
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleYDAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
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
              handleBarCodeScanner(
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
      <div class="content__table">
        <el-table
          v-loading="loadYDCatalogData"
          border
          highlight-current-row
          @row-dblclick="rowDblclick"
          :data="ydCatalogList"
          stripe
          style="width: 100%"
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
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zti" label="主题词">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
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
          <el-table-column show-overflow-tooltip prop="guan" label="位置">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.ydCatalogid"
                :index="scope.$index"
                :ops="['']"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="
                      handleDirectYDPage(scope.row.marcid, scope.row.marctyid)
                    "
                  >
                    预订
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
import { reserveZdsm, searchYdBook, workGet } from "api/acquisition";

export default {
  name: "acq_jcyd",
  data() {
    this.filterOptions = [
      {
        value: "1",
        label: "ISBN/ISSN"
      },
      {
        value: "2",
        label: "正题名"
      },
      {
        value: "5",
        label: "分类号"
      },
      {
        value: "6",
        label: "主题词"
      },
      {
        value: "3",
        label: "出版社"
      },
      {
        value: "4",
        label: "责任者"
      }
    ];
    return {
      // 列表相关
      defaultYDD: "",
      multipleYDCatalogSelection: [],
      currentFilterKey: "1",
      loadYDCatalogData: false,
      ydCatalogList: [],
      currentFilterVal: "",
      ydCatalogPageSize: 15,
      currentYDCatalogPage: 1,
      totalYDCatalogCount: 0
    };
  },
  methods: {
    // 征订目录列表
    initYDCatalogList() {
      localStorage.setItem("td-ydSearchKey", this.currentFilterKey);
      this.currentYDCatalogPage = 1;
      this.setRequestObj();
      this.getYDCatalogList();
    },
    setRequestObj() {
      this.requestObj = {
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

      searchYdBook(requestObj)
        .then(res => {
          this.loadYDCatalogData = false;
          this.ydCatalogList = res.data.dataList;
          this.totalYDCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadYDCatalogData = false));
    },
    handleYDCatalogSizeChange(val) {
      this.ydCatalogPageSize = val;
      this.getYDCatalogList();
    },
    handleYDCatalogCurrentChange(val) {
      this.currentYDCatalogPage = val;
      this.getYDCatalogList();
    },
    // 新增预订
    handleYDAdd() {
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "acq_jcyd"
        },
        params: {
          reset: true
        }
      });
    },
    // 前往书目预订
    handleDirectYDPage(marcid, marctyid) {
      reserveZdsm({
        marcid
      }).then(() => {
        this.$router.push({
          name: "acq_jcydxq",
          query: {
            marcid,
            marctyid,
            from: "acq_jcyd"
          }
        });
      });
    },
    // 双击表格
    rowDblclick(row) {
      this.handleDirectYDPage(row.marcid, row.marctyid);
    },
    // 初始化
    getWorkDefault() {
      workGet().then(res => {
        this.defaultYDD = res.data ? res.data.ydpcCode : "";
      });
    }
  },
  mounted() {
    this.currentFilterKey = localStorage.getItem("td-ydSearchKey") || "1";
    this.getWorkDefault();
    this.$eventBus.$on("jdbm-update", () => {
      this.initYDCatalogList();
    });
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.getWorkDefault();
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
