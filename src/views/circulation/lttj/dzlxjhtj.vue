<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-02-27 16:31:04
 -->
<template>
  <div class="cir_dzlxjhtj common__content">
    <td-content-header>
      读者类型借还统计
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="dzlxjhtjData.length == 0"
            @click="print"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="desc">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="libid"
            @change="getReaderTypeList"
            placeholder="选择成员馆"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="dzlxid"
            placeholder="选择读者类型"
          >
            <el-option
              v-for="item in readerTypeList"
              :key="item.dzlxid"
              :label="item.mcheng"
              :value="item.dzlxid"
            ></el-option>
          </el-select>

          <p class="label">借阅时间：</p>
          <el-date-picker
            v-model="dateStart"
            type="date"
            size="mini"
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
            style="margin-right: 7px;"
            class="filter__date"
          >
          </el-date-picker>
          <span>至&nbsp;&nbsp;</span>
          <el-date-picker
            v-model="dateEnd"
            type="date"
            size="mini"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
            class="filter__date"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initDuZheList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="booksInfoTable">
        <el-table
          v-loading="loadBooksInfoData"
          border
          :data="dzlxjhtjData"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieyuecs"
            label="借阅册数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="guihuancs"
            label="归还册数"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="sumList">
        <span>总计</span>
        <span>借出册数：{{ sumList.jieyuecs || 0 }}</span>
        <span>还回册数：{{ sumList.guihuancs || 0 }}</span>
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
import { readerType, dzlxjhtjList, dzlxjhtjCount } from "api/circulation";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzlxjhtj",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    return {
      readerTypeList: [],
      allparam: {
        libid: "",
        dzlxid: "",
        date1: "",
        date2: "",
        pageNumber: 1,
        pageSize: 15
      },
      sumList: {
        jieyuecs: "",
        guihuancs: ""
      },
      dateStart: "",
      dateEnd: "",
      libid: this.$store.getters.userInfo.libId,
      dzlxid: "",
      pageNumber: 1,
      pageSize: 15,
      totalCount: 0,
      // 列表
      loadBooksInfoData: false,
      delayDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      dzlxjhtjData: []
    };
  },
  mounted() {
    this.getReaderTypeList();
  },
  methods: {
    /** 获取读者类型列表 */
    getReaderTypeList() {
      readerType({
        libId: this.allparam.libid || this.$store.getters.userInfo.libId,
        pageSize: 1000,
        pageNumber: 1
      }).then(res => {
        if (res.code == 0) {
          res.data.unshift({
            dzlxid: "",
            mcheng: "全部"
          });
          this.readerTypeList = [...res.data];
        }
        this.allparam.dzlxid = "";
      });
    },
    initDuZheList() {
      this.pageNumber = 1;
      this.getDuZheList();
    },
    getDuZheList() {
      this.loadBooksInfoData = true;
      this.allparam.date1 = this.dateStart || "";
      this.allparam.date2 = this.dateEnd || "";
      this.allparam.libid = this.libid;
      this.allparam.pageNumber = this.pageNumber;
      this.allparam.pageSize = this.pageSize;
      this.allparam.dzlxid = this.dzlxid;
      dzlxjhtjList(this.allparam)
        .then(res => {
          this.dzdwjhtjData = res.data;
          this.loadBooksInfoData = !this.loadBooksInfoData;
          res.data.dataList.map((ele, index) => {
            ele.index = 1 + (this.pageNumber - 1) * this.pageSize + index++;
          });
          this.totalCount = +res.data.totalElements;
          this.dzlxjhtjData = [...res.data.dataList];
        })
        .catch(() => {
          this.loadBooksInfoData = !this.loadBooksInfoData;
        });
      dzlxjhtjCount({
        dzlxid: this.dzlxid,
        libid: this.libid,
        date1: this.dateStart,
        date2: this.dateEnd
      })
        .then(res => {
          this.sumList = {
            jieyuecs: res.data.jieyuecs,
            guihuancs: res.data.guihuancs
          };
        })
        .catch(() => {});
    },
    print() {
      downLoadExcel("/api/e/flow/lttj/dzlxjhtjExportExcel", this.allparam);
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDuZheList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getDuZheList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.sumList {
  height: 30px;
  line-height: 30px;
  font-size: @FSize_16;
  font-weight: bold;
  color: @fontDarkerColor;
  padding-left: 20px;
  box-sizing: border-box;
  span {
    margin-right: 20px;
  }
}
</style>
