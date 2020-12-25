<template>
  <div class="acq_yscl common__content">
    <!--读者借阅查询-->
    <td-content-header>
      <span>移送处理</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="
              multipleBorrowSelection.length === 0 ||
                multipleBorrowSelection.length > 1
            "
            @click="catalogueTransfer"
          >
            <i class=""></i>移交典藏
          </el-button>
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
            v-model="flag"
            placeholder="请选择"
          >
            <el-option
              v-for="item in flagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            ref="currentFilterValInput"
          ></el-input>
          <el-button type="primary" size="mini" @click="initBorrowList">
            <icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadBorrowData"
          @selection-change="handleBorrowSelectionChange"
          @row-click="clickRow"
          ref="ysclTable"
          border
          :data="BorrowList"
          stripe
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
            label="验收代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="分馆简称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysName"
            label="供应商"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ysName"
            label="预算代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="日期"
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
    <el-dialog
      title="移交标识"
      :visible.sync="dialogVisible"
      width="640px"
      :before-close="handleClose"
    >
      <div class="el-dialog-item">
        <label>移交标识：</label>
        <el-input v-model="transferCode" size="mini"></el-input>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
        style="display: flex;justify-content: space-between;"
      >
        <div>
          <el-button @click="catalogueTransferReset" size="mini"
            >重置</el-button
          >
        </div>
        <div>
          <el-button type="primary" @click="catalogueTransferSure" size="mini"
            >确 定</el-button
          >
          <el-button @click="handleClose" size="mini">取 消</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCatalogueTransferList, catalogueTransferDeal } from "api/catalogue";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";

export default {
  name: "acq_yscl",
  data() {
    this.flagList = [
      { value: "yspcCode", label: "验收批次代码" },
      { value: "ysuanName", label: "预算名称" },
      { value: "gysName", label: "供应商名称" }
    ];
    return {
      // 列表相关
      czid: "",
      userCzList: [],
      multipleBorrowSelection: [],
      loadBorrowData: false,
      BorrowList: [],
      dialogVisible: false,
      BorrowPageSize: 15,
      currentBorrowPage: 1,
      totalBorrowCount: 0,
      requestObj: {},
      transferCode: "",
      flag: "yspcCode",
      currentFilterVal: ""
    };
  },
  activated() {
    this.$nextTick(() => {
      this.$refs["currentFilterValInput"].focus();
    });
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    initBorrowList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.getBorrowList();
      this.currentBorrowPage = 1;
    },
    initParamList() {
      this.getUserCzList();
    },
    // 选择
    handleBorrowSelectionChange(val) {
      this.multipleBorrowSelection = val.map(item => item.yspcid);
    },

    // 点击当前行
    clickRow(row) {
      this.$refs.ysclTable.toggleRowSelection(row);
    },
    // 获取列表
    getBorrowList() {
      this.loadBorrowData = true;
      this.requestObj = {
        pageNumber: this.currentBorrowPage,
        pageSize: this.BorrowPageSize
      };
      this.requestObj[this.flag] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );
      getCatalogueTransferList(this.requestObj)
        .then(res => {
          this.loadBorrowData = false;
          this.BorrowList = res.data.dataList;
          this.totalBorrowCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadBorrowData = false));
    },
    // 点击移交典藏
    catalogueTransfer() {
      this.dialogVisible = true;
    },
    // 提交移交标识
    catalogueTransferSure() {
      if (!this.transferCode) {
        this.$message.error("请输入移交标识");
        return;
      }
      let param = {};
      param.transferCode = this.transferCode;
      param.yspcId = this.multipleBorrowSelection[0];
      catalogueTransferDeal(param)
        .then(res => {
          this.$message.success(res.message);
          this.dialogVisible = false;
        })
        .catch(() => {
          this.dialogVisible = false;
        });
    },
    // 重置
    catalogueTransferReset() {
      this.transferCode = "";
    },
    // 关闭
    handleClose() {
      this.dialogVisible = false;
      this.transferCode = "";
    },
    handleBorrowSizeChange(val) {
      this.BorrowPageSize = val;
      this.getBorrowList();
    },
    handleBorrowCurrentChange(val) {
      this.currentBorrowPage = val;
      this.getBorrowList();
    },
    getUserCzList() {
      this.czid = "";
      userCzList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mingcheng: "全部",
          czid: ""
        });
        this.userCzList = [...res.data];
      });
    }
  },
  mounted() {
    this.initParamList();
    this.$refs["currentFilterValInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
