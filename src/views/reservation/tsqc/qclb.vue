<!--
 * @Description: 清查类别
 * @Date: 2020-03-05 10:08:01
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-07 15:35:55
 -->

<template>
  <div class="res-qclb common__content">
    <td-content-header>
      清查类别
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowAddField"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleItemSelection.length === 0"
            size="mini"
            type="primary"
            @click="handleDeleteFieldItem('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除
            <span v-show="multipleItemSelection.length > 0"
              >({{ multipleItemSelection.length }})</span
            >
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
            v-model="filterKey"
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
            @keyup.enter.native="initItemList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initItemList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="catalogTable">
        <el-table
          v-loading="loadingData"
          ref="table"
          @row-dblclick="handleShowEditField"
          @selection-change="handleItemSelectionChange"
          border
          :data="itemList"
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
            show-overflow-tooltip
            prop="inventoryCode"
            label="类别代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="inventoryName"
            label="清查类别"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="inventoryNote"
            label="备注"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                :id="scope.row.inventoryId"
                @handleEdit="handleShowEditField(scope.row)"
                @handleDel="handleDeleteFieldItem"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handlePageSizeChange"
          @current-change="handlePageCurrentChange"
          :total="totalItemCount"
          :currentPage="currentItemPage"
          :pageSize="itemPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑清查类别 -->
    <side-wrap
      class="common__side_form"
      v-show="showFieldEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              {{
                fieldEditSideMode === "add" ? "新增清查类别" : "编辑清查类别"
              }}
            </div>
          </div>
          <i class="el-icon-close" @click="showFieldEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="fieldEditForm"
          label-width="100px"
          :model="fieldEditForm"
          :rules="fieldEditFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>清查类别信息</span>
            </div>
            <el-form-item
              class="item item__line"
              prop="inventoryCode"
              label="类别代码"
            >
              <el-input
                clearable
                placeholder="例：1"
                v-model="fieldEditForm.inventoryCode"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__line" prop="libId" label="成员馆">
              <el-select
                filterable
                size="mini"
                v-model="fieldEditForm.libId"
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
              class="item item__line"
              prop="inventoryName"
              label="清查类别"
            >
              <el-input
                clearable
                placeholder="例：非法图书"
                v-model="fieldEditForm.inventoryName"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="inventoryNote"
              label="备注"
            >
              <el-input
                type="textarea"
                clearable
                :rows="4"
                v-model="fieldEditForm.inventoryNote"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="resetForm('fieldEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="small"
              @click="submitForm('fieldEditForm')"
              type="primary"
              :loading="savingFieldData"
              >保存</el-button
            >
            <el-button size="small" @click="showFieldEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  fetchDcqdTypes,
  delDcqdType,
  editDcqdType,
  getDcqdCount
} from "api/reservation";

export default {
  name: "res_qclb",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.filterOptions = [
      {
        label: "类别代码",
        value: "inventoryCode"
      },
      {
        label: "清查类别",
        value: "inventoryName"
      }
    ];
    this.fieldEditFormRules = {
      inventoryCode: [
        { required: true, message: "类别代码不能为空", trigger: "blur" }
      ],
      inventoryName: [
        { required: true, message: "清查类别不能为空", trigger: "blur" }
      ]
    };
    return {
      multipleItemSelection: [],
      itemList: [],
      selectLibId: this.$store.getters.userInfo.libId,
      filterKey: "inventoryCode",
      searchKey: "",
      fieldEditSideMode: "add",
      loadingData: false,
      totalItemCount: 0,
      currentItemPage: 1,
      itemPageSize: 15,
      // 编辑窗口
      fieldEditForm: {
        inventoryName: "",
        inventoryCode: "",
        inventoryNote: "",
        libId: this.$store.getters.userInfo.libId
      },
      showFieldEditSide: false,
      savingFieldData: false
    };
  },
  created() {
    this.initItemList();
  },
  methods: {
    handleShowAddField() {
      this.fieldEditSideMode = "add";
      this.resetForm("fieldEditForm");
      this.showFieldEditSide = true;
    },
    handleShowEditField(row) {
      this.fieldEditSideMode = "edit";
      this.fieldEditFormOriginal = {
        inventoryName: row.inventoryName,
        inventoryCode: row.inventoryCode,
        inventoryNote: row.inventoryNote,
        libId: row.libId
      };
      this.currentInventoryId = row.inventoryId;
      this.resetForm("fieldEditForm");
      this.showFieldEditSide = true;
    },
    handleDeleteFieldItem(ids) {
      getDcqdCount({
        inventoryIds: ids ? ids : this.multipleItemSelection.join(",")
      }).then(res => {
        this.$confirm(
          `此类别已清查 ${res.data.qcCount} 册图书，确认继续删除吗？`,
          "提示",
          {
            confirmButtonText: "确定删除",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.loadingData = true;
            delDcqdType({
              inventoryIds: ids ? ids : this.multipleItemSelection.join(",")
            })
              .then(res => {
                this.$message.success(res.message);
                this.initItemList();
              })
              .catch(() => {
                this.loadingData = false;
              });
          })
          .catch(() => {});
      });
    },
    initItemList() {
      this.currentItemPage = 1;
      this.setRequestObj();
      this.getItemList();
    },
    setRequestObj() {
      this.rquestObj = {
        libId: this.selectLibId,
        [this.filterKey]: this.searchKey
      };
    },
    getItemList() {
      this.loadingData = true;
      fetchDcqdTypes({
        ...this.rquestObj,
        pageNumber: this.currentItemPage,
        pageSize: this.itemPageSize
      })
        .then(res => {
          this.itemList = res.data.dataList;
          this.totalItemCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadingData = false;
        });
    },
    handleItemSelectionChange(val) {
      this.multipleItemSelection = val.map(item => item.inventoryId);
    },
    handlePageSizeChange(val) {
      this.itemPageSize = val;
      this.getItemList();
    },
    handlePageCurrentChange(val) {
      this.currentItemPage = val;
      this.getItemList();
    },
    // 表单
    _editDcqdType() {
      let requestObj = {
        ...this.fieldEditForm
      };
      if (this.fieldEditSideMode === "edit") {
        requestObj.inventoryId = this.currentInventoryId;
      }
      this.savingFieldData = true;
      editDcqdType(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.showFieldEditSide = false;
          this.initItemList();
        })
        .finally(() => {
          this.savingFieldData = false;
        });
    },
    // 表单通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this._editDcqdType();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (this.fieldEditSideMode === "edit") {
        Object.assign(this.fieldEditForm, this.fieldEditFormOriginal);
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
