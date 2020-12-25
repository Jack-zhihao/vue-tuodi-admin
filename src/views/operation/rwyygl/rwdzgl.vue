<!--
 * @Description: 任务动作列表
 * @Autor: chenming.feng
 * @Date: 2019-10-22 14:24:57
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 15:59:40
 -->
<template>
  <div class="p-rwdzlb common__content">
    <td-content-header>
      任务动作管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowAddSide"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteItem('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">动作名称：</p>
          <el-input
            clearable
            size="mini"
            v-model="searchValue"
            placeholder="请输入检索内容"
            @keyup.enter.native="initList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadingListData"
          @selection-change="handleSelectionChange"
          border
          :data="listData"
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
          <el-table-column show-overflow-tooltip prop="taName" label="动作名称">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="taType" label="动作类型">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="taContent"
            label="前端动作名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否属于柜门维护">
            <template slot-scope="scope">
              {{ scope.row.taMaintenance ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="更新时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="更新用户"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.taId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="handleShowEditSide"
                @handleDel="deleteItem"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑弹窗 -->
    <side-wrap class="common__side_form" v-show="editSideVisible" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增任务动作信息</div>
            <div v-else class="tit active">修改任务动作信息</div>
          </div>
          <i class="el-icon-close" @click="editSideVisible = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="editForm"
          label-width="160px"
          :model="editForm"
          :rules="eidtFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>任务动作信息</span>
            </div>
            <el-form-item class="item" prop="taName" label="动作名称">
              <el-input
                clearable
                placeholder="请输入任务动作名称"
                v-model="editForm.taName"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taType" label="动作类型">
              <el-select
                filterable
                @change="resetTaType"
                v-model="editForm.taType"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in nodeTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taContent" label="动作内容">
              <el-select
                filterable
                v-model="editForm.taContent"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in nodeContents"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taAppName" label="前端动作名称">
              <el-input
                clearable
                placeholder="请输入前端动作名称"
                v-model="editForm.taAppName"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="0">
              <p style="font-size: 12px;color: #999;">
                用于显示在APP，提示用户操作名称
              </p>
            </el-form-item>
            <el-form-item
              class="item"
              prop="taMaintenance"
              label="是否属于柜门维护"
            >
              <el-select
                filterable
                v-model="editForm.taMaintenance"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [
                    { label: '是', value: true },
                    { label: '否', value: false }
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label-width="0">
              <p style="font-size: 12px;color: #999;">
                用于判断任务动作是否需要记录盘点数据
              </p>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              :loading="isSavingForm"
              @click="submitForm('editForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="editSideVisible = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { saveAction, searchAction, delAction } from "api/operation";

export default {
  name: "opera_rwdzgl",
  data() {
    this.eidtFormRules = {
      taName: [
        { required: true, message: "动作名称不能为空", trigger: "blur" }
      ],
      taType: [
        { required: true, message: "请选择动作类型", trigger: "change" }
      ],
      taContent: [
        { required: true, message: "请选择动作内容", trigger: "blur" }
      ],
      taAppName: [
        { required: true, message: "前端动作名称不能为空", trigger: "blur" }
      ]
    };
    this.nodeTypes = [
      {
        label: "定位类",
        value: "定位类"
      },
      {
        label: "文本类",
        value: "文本类"
      },
      {
        label: "功能类",
        value: "功能类"
      }
    ];
    // 定位类
    this.nodeContents1 = [
      {
        label: "50米",
        value: "50米"
      },
      {
        label: "100米",
        value: "100米"
      }
    ];
    // 文本类
    this.nodeContents2 = [
      {
        label: "文本框",
        value: "文本框"
      },
      {
        label: "图片",
        value: "图片"
      }
    ];
    // 功能类
    this.nodeContents3 = [
      {
        label: "打开柜门",
        value: "打开柜门"
      },
      {
        label: "处理反馈",
        value: "处理反馈"
      },
      {
        label: "图书上下架",
        value: "图书上下架"
      }
    ];
    return {
      isAdd: true,
      nodeContents: this.nodeContents1,
      searchValue: "",
      multipleSelection: [],
      loadingListData: false,
      listData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 15,
      currentAcNode: 0,
      editSideVisible: false,
      editForm: {
        taName: "",
        taType: "定位类",
        taContent: "50米",
        taAppName: "",
        taMaintenance: false
      },
      isSavingForm: false
    };
  },
  created() {
    this.initList();
  },
  methods: {
    resetTaType(val) {
      if (val === "定位类") {
        this.nodeContents = this.nodeContents1;
        this.editForm.taContent = "50米";
      } else if (val === "文本类") {
        this.nodeContents = this.nodeContents2;
        this.editForm.taContent = "文本框";
      } else if (val === "功能类") {
        this.nodeContents = this.nodeContents3;
        this.editForm.taContent = "打开柜门";
      }
    },
    setRequestObj() {
      this.requestObj = {
        taName: this.searchValue
      };
    },
    initList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getList();
    },
    getList() {
      this.loadingListData = true;

      let requestObj = {
        pageNumber: this.currentPage,
        pageSize: this.ccdzPageSize,
        ...this.requestObj
      };

      searchAction(requestObj)
        .then(res => {
          this.listData = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadingListData = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.isAdd = false;
      this.handleShowEditSide(row.taId, "", row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.taId);
    },
    handleShowAddSide() {
      this.isAdd = true;
      this.editSideVisible = true;
      this.$nextTick(() => {
        this.resetForm("editForm");
      });
    },
    deleteItem(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadingListData = true;
          delAction({
            taIds: ids ? ids : this.multipleSelection.join(",")
          })
            .then(res => {
              this.$message.success(res.message);
              this.initList();
            })
            .finally(() => {
              this.loadingListData = false;
            });
        })
        .catch(() => {});
    },
    handleShowEditSide(id, index, data) {
      this.editSideVisible = true;
      this.$nextTick(() => {
        let val = data.taType;
        if (val === "定位类") {
          this.nodeContents = this.nodeContents1;
        } else if (val === "文本类") {
          this.nodeContents = this.nodeContents2;
        } else if (val === "功能类") {
          this.nodeContents = this.nodeContents3;
        }
        this.editForm = {
          taName: data.taName,
          taType: data.taType,
          taContent: data.taContent,
          taAppName: data.taAppName,
          taMaintenance: data.taMaintenance,
          taId: data.taId
        };
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleUpdateForm();
        } else {
          return false;
        }
      });
    },
    handleUpdateForm() {
      this.isSavingForm = true;
      saveAction({
        ...this.editForm
      })
        .then(res => {
          this.$message.success(res.message);
          this.initList();
          this.editSideVisible = false;
        })
        .finally(() => {
          this.isSavingForm = false;
        });
    },
    resetForm(formName) {
      this.editForm = {
        taName: "",
        taType: "定位类",
        taContent: "50米",
        taAppName: "",
        taMaintenance: false
      };
      this.$refs[formName].resetFields();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
