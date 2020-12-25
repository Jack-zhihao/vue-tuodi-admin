<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-26 10:27:00
 -->
<template>
  <div class="cqgl common__content_">
    <div class="content__header_title">
      <span>超期管理</span>
      <div class="tool">
        <el-button
          size="mini"
          type="primary"
          :disabled="tableData.length == 0"
          @click="print"
        >
          <icon-svg icon-class="icon-daochu" />
          导出</el-button
        >
      </div>
    </div>
    <div class="content">
      <div class="toolbar">
        <label for="">成员馆：</label>
        <el-select
          filterable
          size="mini"
          v-model="libId"
          placeholder="选择成员馆"
        >
          <el-option
            v-for="item in libListSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="supplier-selection">
          <el-select
            filterable
            size="mini"
            class="el-select-supplier"
            v-model="optionKey"
          >
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="supplier-key"
            placeholder="请输入搜索关键词"
            v-model="content"
            ref="focusInput"
            @keyup.native="
              handleBarCodeScanner($event, val => (content = val), search)
            "
            @keyup.native.enter="delayFunc(search)"
          ></el-input>
        </div>
        <el-button size="mini" type="primary" @click="search">
          <icon-svg icon-class="icon-btn-ico-2" />
          查询</el-button
        >
      </div>
      <div ref="multipleTableBox" class="multipleTableBox">
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          border
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerName"
            label="读者姓名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerUnit"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ban"
            label="级"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ji"
            label="班"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xueduan"
            label="学段"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="藏址名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借阅日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yhsj"
            label="应还日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tel"
            label="电话号码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="phone"
            label="手机号码"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__pages">
      <td-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page.sync="param.pageNumber"
        :page-size="param.pageSize"
      ></td-pagination>
    </div>
  </div>
</template>
<script>
import { overDueList } from "api/circulation";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
import { CQGL_OPTIONS } from "utils/selectOptions";
export default {
  name: "cir_cqgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.optionList = CQGL_OPTIONS;
    return {
      libId: this.$store.getters.userInfo.libId,
      content: "",
      optionKey: "isbn",
      tableData: [],
      loading: false,
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取超期列表 */
    getOverDueList() {
      this.loading != this.loading;
      overDueList(this.param).then(res => {
        this.loading != this.loading;
        if (res.code == 0) {
          this.tableData = [...res.data.dataList];
          this.totalCount = +res.data.totalElements;
        }
      });
    },
    search() {
      this.optionList.map(ele => {
        this.param[ele.value] = "";
      });
      this.param.pageNumber = 1;
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.getOverDueList();
    },

    /**打印 */
    print() {
      this.param.func_name_us = "cqgl";
      downLoadExcel("/api/e/flow/readerOther/overDue/ExportExcel", this.param);
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getOverDueList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getOverDueList();
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>
