<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-07-30 17:56:48
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 14:56:01
 -->

<template>
  <div class="cat-pcgl common__content">
    <td-content-header>
      批次管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowDialog"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleBatchSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteBatch('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">状态：</span>
          <el-checkbox @change="initBatchList" v-model="isNormal"
            >正常</el-checkbox
          >
          <el-checkbox
            @change="initBatchList"
            v-model="isHistory"
            style="margin-right: 20px;"
            >历史</el-checkbox
          >
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentBatchFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in batchFilterOptions"
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
            v-model="BatchSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initBatchList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initBatchList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadBatchData"
          @selection-change="handleBatchSelectionChange"
          border
          :data="batchList"
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
          <el-table-column show-overflow-tooltip prop="batchCode" label="批次">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="batchStatus"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="shuceNum" label="总册数">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="batchNote" label="备注">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="操作人">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="batchOptime"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.batchId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkBatchDetail"
                @handleDel="deleteBatch"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleBatchSizeChange"
          @current-change="handleBatchCurrentChange"
          :total="totalBatchCount"
          :currentPage="currentBatchPage"
          :pageSize="batchPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增/编辑侧边栏 -->
    <side-wrap
      class="common__side_form"
      v-if="batchSideWrapVisible"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              {{ batchInfoEditMode === "add" ? "新增批次" : "编辑批次" }}
            </div>
          </div>
          <i class="el-icon-close" @click="batchSideWrapVisible = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          label-width="80px"
          :model="batchInfoForm"
          ref="batchInfoForm"
          size="mini"
          :rules="editDialogFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="batchCode" label="批次">
              <el-input clearable v-model="batchInfoForm.batchCode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="batchInfoForm.libId"
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
            <el-form-item
              v-if="batchInfoEditMode === 'edit'"
              class="item"
              prop="batchStatus"
              label="状态"
            >
              <el-radio v-model="batchInfoForm.batchStatus" label="正常"
                >正常</el-radio
              >
              <el-radio v-model="batchInfoForm.batchStatus" label="历史"
                >历史</el-radio
              >
            </el-form-item>
            <el-form-item class="item" prop="batchNote" label="备注">
              <el-input
                type="textarea"
                rows="5"
                v-model="batchInfoForm.batchNote"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('batchInfoForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('batchInfoForm')"
              type="primary"
              :loading="editingData"
              >保存</el-button
            >
            <el-button size="mini" @click="batchSideWrapVisible = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";
import {
  addBatch,
  updateBatch,
  delBatch,
  searchBatch,
  exportMarcshuceByBatchs
} from "api/catalogue";
import { mapGetters } from "vuex";

export default {
  name: "cat_pcgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.batchFilterOptions = [
      {
        label: "批次",
        value: 1
      },
      {
        label: "操作人",
        value: 2
      }
    ];
    this.editDialogFormRules = {
      batchCode: [{ required: true, message: "批次不能为空", trigger: "blur" }],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }]
    };
    return {
      // 列表搜索
      multipleBatchSelection: [],
      currentBatchFilterKey: 1,
      BatchSearchKey: "",
      isNormal: true,
      isHistory: true,
      loadBatchData: false,
      batchList: [],
      totalBatchCount: 0,
      currentBatchPage: 1,
      batchPageSize: 15,
      // 弹窗
      editingData: false,
      batchInfoEditMode: "add",
      batchSideWrapVisible: false,
      batchInfoForm: {
        batchNote: "",
        libId: this.$store.getters.userInfo.libId,
        batchCode: "",
        batchStatus: "正常"
      }
    };
  },
  methods: {
    // 列表搜索
    setRequestObj() {
      let batchStatusArr = [];
      if (this.isNormal) {
        batchStatusArr.push("正常");
      }
      if (this.isHistory) {
        batchStatusArr.push("历史");
      }
      this.requestObj = {
        flag: this.currentBatchFilterKey,
        context: this.BatchSearchKey,
        batchStatus: batchStatusArr.join(",")
      };
    },
    initBatchList() {
      this.currentBatchPage = 1;
      this.setRequestObj();
      this.getBatchList();
    },
    getBatchList() {
      this.loadBatchData = true;

      let requestObj = {
        pageNumber: this.currentBatchPage,
        pageSize: this.batchPageSize,
        ...this.requestObj
      };

      searchBatch(requestObj)
        .then(res => {
          this.batchList = res.data.dataList;
          this.totalBatchCount = +res.data.totalElements;
        })
        .finally(() => {
          this.loadBatchData = false;
        });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkBatchDetail(row.wxlxid, "", row);
    },
    handleShowDialog() {
      this.batchInfoEditMode = "add";
      // 重置
      this.batchInfoForm = {
        batchCode: "",
        libId: this.$store.getters.userInfo.libId,
        batchStatus: "正常",
        batchNote: ""
      };
      this.batchSideWrapVisible = true;
      this.$nextTick(() => {
        this.$refs["batchInfoForm"].resetFields();
      });
    },
    checkBatchDetail(id, index, data) {
      this.batchInfoEditMode = "edit";
      this.currentBatchId = data.batchId;
      // 赋值给编辑
      this.batchInfoForm = {
        batchNote: data.batchNote,
        libId: data.libId,
        batchCode: data.batchCode,
        batchStatus: data.batchStatus
      };
      this.batchSideWrapVisible = true;
    },
    handleBatchSelectionChange(val) {
      this.multipleBatchSelection = val.map(item => item.batchId);
    },
    deleteBatch(ids) {
      this.$confirm("与图书的关联关系将被同步删除，是否删除?", "批次删除", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadBatchData = true;
          delBatch({
            batchIds: ids ? ids : this.multipleBatchSelection.join(",")
          })
            .then(res => {
              this.$message.success(res.message);
              this.initBatchList();
            })
            .finally(() => {
              this.loadBatchData = false;
            });
        })
        .catch(() => {});
    },
    handleBatchSizeChange(val) {
      this.batchPageSize = val;
      this.getBatchList();
    },
    handleBatchCurrentChange(val) {
      this.currentBatchPage = val;
      this.getBatchList();
    },
    downLoadData() {
      if (this.multipleBatchSelection.length === 0) {
        this.$message.warning("请选择要导出的数据");
        return;
      }
      downLoadExcel(exportMarcshuceByBatchs(), {
        batchIds: this.multipleBatchSelection.join(",")
      });
    },
    // 侧边栏
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleModiBatch();
        } else {
          return false;
        }
      });
    },
    handleModiBatch() {
      this.editingData = true;
      if (this.batchInfoEditMode === "add") {
        addBatch({
          ...this.batchInfoForm
        })
          .then(res => {
            this.batchSideWrapVisible = false;
            this.$message.success(res.message);
            this.initBatchList();
          })
          .finally(() => {
            this.editingData = false;
          });
      } else {
        updateBatch({
          ...this.batchInfoForm,
          batchId: this.currentBatchId
        })
          .then(res => {
            this.batchSideWrapVisible = false;
            this.$message.success(res.message);
            this.initBatchList();
          })
          .finally(() => {
            this.editingData = false;
          });
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
