<!--
 * @Description: 馆藏书目导入
 * @Date: 2020-02-14 10:35:25
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 16:22:33
 -->
<template>
  <div class="cat-gcsmdr common__content">
    <td-content-header>
      馆藏书目导入
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="addData"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleDataSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteData('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
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
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
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
            v-model="searchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (searchKey = val),
                initDataList
              )
            "
            @keydown.enter.native="delayFunc(initDataList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initDataList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="dataTable">
        <el-table
          v-loading="loadingData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="editData"
          @selection-change="handleSelectionChange"
          border
          :data="dataList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="导入批次" width="145">
            <template slot-scope="scope">
              <span
                @click="checkDataDetail(scope.row.batchCode, scope.row.batchId)"
                class="g-row__check primary"
                >{{ scope.row.batchCode }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
            width="120"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="catalogNum"
            label="总书目数"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookNum"
            label="总册数"
            width="80"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="batchNote" label="备注">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            width="80"
            label="操作人"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="operTime"
            label="操作时间"
            width="160"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.batchId"
                :data="scope.row"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="editData(scope.row)"
                @handleDel="deleteData"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalDataCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 导入批次 -->
    <el-dialog
      :title="importFormTitle"
      :visible.sync="importBatchVisible"
      width="690px"
    >
      <el-form
        ref="importForm"
        :rules="importFormRules"
        :model="importForm"
        size="mini"
        class="custom__form"
        label-width="100px"
      >
        <div class="custom__form_wrapper">
          <el-form-item class="item" label="导入批次" prop="batchCode">
            <el-input
              v-model="importForm.batchCode"
              placeholder="请输入导入批次"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="成员馆" prop="libId">
            <el-select
              filterable
              v-model="importForm.libId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item" label="备注">
            <el-input
              type="textarea"
              :rows="5"
              v-model="importForm.batchNote"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          :loading="savingData"
          @click="submitForm('importForm')"
          >保 存</el-button
        >
        <el-button @click="importBatchVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import {
  delMarcBookBatch,
  saveMarcBookBatch,
  fetchMarcBookBatch
} from "api/catalogue";

export default {
  name: "cat_gcsmdr",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.filterOptions = [
      {
        value: "batchCode",
        label: "导入批次"
      },
      {
        value: "userName",
        label: "操作人"
      }
    ];
    this.importFormRules = {
      batchCode: [
        { required: true, message: "请输入导入批次", trigger: "blur" }
      ]
    };
    return {
      // 列表
      selectLibId: this.$store.getters.userInfo.libId,
      currentFilterKey: "batchCode",
      searchKey: "",
      loadingData: false,
      dataList: [],
      multipleDataSelection: [],
      totalDataCount: 0,
      currentPage: 1,
      pageSize: 15,
      // 导入
      importFormTitle: "",
      importBatchVisible: false,
      importForm: {
        libId: this.$store.getters.userInfo.libId,
        batchCode: "",
        batchNote: ""
      },
      savingData: false
    };
  },
  created() {
    this.initDataList();
  },
  methods: {
    // 列表
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[this.currentFilterKey] = this.searchKey;
    },
    initDataList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getDataList();
    },
    getDataList() {
      this.loadingData = true;

      let requestObj = {
        libId: this.selectLibId,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        ...this.requestObj
      };

      fetchMarcBookBatch(requestObj)
        .then(res => {
          this.dataList = res.data.dataList;
          this.totalDataCount = Number(res.data.totalElements);
        })
        .finally(() => (this.loadingData = false));
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    // 编辑
    addData() {
      this.importFormTitle = "新增导入批次";
      this.importBatchVisible = true;
      this.importForm = {
        libId: this.$store.getters.userInfo.libId,
        batchCode: "",
        batchNote: ""
      };
    },
    editData(row) {
      this.importFormTitle = "编辑导入批次";
      this.importBatchVisible = true;
      this.importForm = {
        batchId: row.batchId,
        libId: row.libId,
        batchCode: row.batchCode,
        batchNote: row.batchNote
      };
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleSubmitForm();
        }
      });
    },
    handleSubmitForm() {
      let requestObj = Object.assign({}, this.importForm);
      this.savingData = true;
      saveMarcBookBatch(requestObj)
        .then(res => {
          this.initDataList();
          this.$message.success(res.message);
          this.importBatchVisible = false;
        })
        .finally(() => {
          this.savingData = false;
        });
    },
    // 删除
    deleteData(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delMarcBookBatch({
            batchIds: ids ? ids : this.multipleDataSelection.join(",")
          }).then(res => {
            this.$message({
              type: "success",
              message: res.message
            });
            this.initDataList();
          });
        })
        .catch(() => {});
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleDataSelection = val.map(item => item.batchId);
    },
    checkDataDetail(batchCode, batchId) {
      this.$router.push({
        name: "cat_gcsmdrlb",
        query: {
          batchCode,
          id: batchId
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
