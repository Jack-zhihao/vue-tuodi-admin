<template>
  <div class="cir_dzdqjycx common__content">
    <!--读者借阅查询-->
    <td-content-header>
      <span>读者当前借阅查询</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            @click="print"
            :disabled="requestObj.libid ? false : true"
          >
            <icon-svg icon-class="icon-daochu" />
            导出
          </el-button>
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
            @change="initParamList"
            v-model="libid"
            placeholder="请选择"
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
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerTypeList"
              :key="item.dzlxid"
              :label="item.mcheng"
              :value="item.dzlxid"
            ></el-option>
          </el-select>
          <p class="label">读者状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="dzheStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="desc">借阅时间：</p>
          <el-date-picker
            style="margin-right: 7px;"
            class="filter__date"
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            class="filter__date"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
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
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initBorrowList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initBorrowList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadBorrowData"
          @selection-change="handleBorrowSelectionChange"
          border=""
          :data="BorrowList"
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
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xming"
            label="读者姓名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzdw"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            v-if="libMode === '学校馆'"
            show-overflow-tooltip
            prop="ji"
            label="级"
          ></el-table-column>
          <el-table-column
            v-if="libMode === '学校馆'"
            show-overflow-tooltip
            prop="ban"
            label="班"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="现藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cejia"
            label="价格"
            width="87"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借出日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yhsj"
            label="应还日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xjcshu"
            label="续借"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleBorrowSizeChange"
          @current-change="handleBorrowCurrentChange"
          :total="totalBorrowCount"
          :currentPage="currentBorrowPage"
          :pageSize="BorrowPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { dzjycx } from "api/circulation";
import { readerType } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzdqjycx",
  data() {
    this.filterOptions = [
      { label: "读者证号", value: "dzzhao" },
      { label: "读者姓名", value: "xming" },
      { label: "读者单位", value: "dzdw" }
    ];
    this.readerStatus = [
      { label: "全部", value: "" },
      { label: "正常", value: "正常" },
      { label: "注销", value: "注销" },
      { label: "挂失", value: "挂失" },
      { label: "暂停", value: "暂停" },
      { label: "退证", value: "退证" },
      { label: "过期", value: "过期" }
    ];
    return {
      // 列表相关
      libMode: "公共馆",
      filterSearchKey: "",
      currentFilterKey: "dzzhao",
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      dzheStatus: "",
      dzlxid: "",
      readerTypeList: [],
      multipleBorrowSelection: [],
      loadBorrowData: false,
      BorrowList: [],
      BorrowPageSize: 15,
      currentBorrowPage: 1,
      totalBorrowCount: 0,
      requestObj: {}
    };
  },
  computed: {
    ...mapGetters(["libList", "libTypeObj"])
  },
  methods: {
    initBorrowList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      // 判断当前搜索是公共馆/学校馆
      this.libMode = this.libTypeObj[this.libid] || "公共馆";
      this.currentBorrowPage = 1;
      this.getBorrowList();
    },

    initParamList() {
      this.getReaderTypeList();
    },

    handleBorrowSelectionChange(val) {
      this.multipleBorrowSelection = val.map(item => item.Borrowid);
    },

    getBorrowList() {
      this.loadBorrowData = true;
      this.requestObj = {
        libid: this.libid,
        date1: this.date1 || "",
        date2: this.date2 || "",
        dzlxid: this.dzlxid,
        dzheStatus: this.dzheStatus,
        pageNumber: this.currentBorrowPage,
        pageSize: this.BorrowPageSize
      };
      this.requestObj[this.currentFilterKey] = this.filterSearchKey.replace(
        /^\s+|\s+$/g,
        ""
      );
      dzjycx(this.requestObj)
        .then(res => {
          this.loadBorrowData = false;
          this.BorrowList = res.data.dataList;
          this.totalBorrowCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadBorrowData = false));
    },
    handleBorrowSizeChange(val) {
      this.BorrowPageSize = val;
      this.getBorrowList();
    },
    handleBorrowCurrentChange(val) {
      this.currentBorrowPage = val;
      this.getBorrowList();
    },
    getReaderTypeList() {
      this.dzlxid = "";
      readerType({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mcheng: "全部",
          dzlxid: ""
        });
        this.readerTypeList = [...res.data];
      });
    },
    print() {
      downLoadExcel("/api/e/flow/ltcx/dzjycxExportExcel", {
        func_name_us: "dzjycx",
        ...this.requestObj
      });
    }
  },
  mounted() {
    this.initParamList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>

<style lang="less">
// .cir_dzdqjycx {
//   .content__header {
//     flex-direction: column;
//     align-items: flex-start !important;
//     .header__filters:nth-child(2) {
//       margin-top: 3px;
//     }
//   }
//   .content__table {
//     height: calc(100% - 64px - 32px) !important;
//   }
// }
</style>
