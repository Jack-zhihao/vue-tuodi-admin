<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-02-27 16:21:47
 -->
<template>
  <div class="cir_dzdwjhtj common__content">
    <td-content-header>
      读者单位借还统计
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="dzdwjhtjData.length == 0"
            @click="print"
            ><icon-svg icon-class="icon-daochu" />导出</el-button
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
            v-model="libid"
            placeholder="选择成员馆"
            size="mini"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">读者单位：</p>
          <el-input
            clearable
            placeholder="请输入读者单位"
            size="mini"
            v-model="dzdw"
            ref="dzdwInput"
          ></el-input>

          <p class="label">借阅时间：</p>
          <el-date-picker
            v-model="dateStart"
            type="date"
            size="mini"
            style="margin-right: 7px;"
            placeholder="开始时间"
            value-format="yyyy-MM-dd"
            class="filter__date"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="dateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            class="filter__date"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initDuZheList">
            <icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="booksInfoTable">
        <el-table
          v-loading="loadBooksInfoData"
          border
          :data="dzdwjhtjData"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzdw" label="读者单位">
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
import { readerType, dzdwjhtjList, dzdwjhtjCount } from "api/circulation";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzdwjhtj",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    return {
      readerTypeList: [],
      allparam: {
        libid: "",
        dzdw: "",
        date1: "",
        date2: "",
        pageNumber: 1,
        pageSize: 15
      },
      sumList: {
        jieyuecs: "",
        guihuancs: ""
      },
      libid: this.$store.getters.userInfo.libId,
      dzdw: "",
      pageNumber: 1,
      pageSize: 15,
      dateStart: "",
      dateEnd: "",

      totalCount: 0,
      // 列表
      loadBooksInfoData: false,
      delayDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      dzdwjhtjData: []
    };
  },
  mounted() {
    this.getReaderTypeList();
    this.$refs.dzdwInput.focus();
  },
  activated() {
    this.$refs.dzdwInput.focus();
  },
  methods: {
    /** 获取读者类型列表 */
    getReaderTypeList() {
      readerType({
        libId: this.$store.getters.userInfo.libId,
        pageSize: 1000,
        pageNumber: 1
      }).then(res => {
        if (res.code == 0) {
          this.readerTypeList = [...res.data];
        }
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
      this.allparam.dzdw = this.dzdw;
      this.allparam.pageNumber = this.pageNumber;
      this.allparam.pageSize = this.pageSize;
      dzdwjhtjList(this.allparam)
        .then(res => {
          this.loadBooksInfoData = !this.loadBooksInfoData;
          res.data.dataList.map((ele, index) => {
            ele.index = 1 + (this.pageNumber - 1) * this.pageSize + index++;
          });
          this.totalCount = +res.data.totalElements;
          this.dzdwjhtjData = [...res.data.dataList];
        })
        .catch(() => {
          this.loadBooksInfoData = !this.loadBooksInfoData;
        });
      dzdwjhtjCount({
        dzdw: this.dzdw,
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
      downLoadExcel("/api/e/flow/lttj/dzdwjhtjExportExcel", this.allparam);
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
