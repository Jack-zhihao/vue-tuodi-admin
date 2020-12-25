<!--
 * @Description: 用户类型列表
 * @Autor: chenming.feng
 * @Date: 2019-10-31 10:40:39
 * @LastEditors: 你的名字
 * @LastEditTime: 2020-03-06 14:20:02
 -->
<template>
  <div class="set-yhlx common__content">
    <td-content-header>
      用户类型管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddUserTypeList"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleUserTypeListSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteUserTypeList('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">用户类型：</p>
          <el-input
            ref="focusInput"
            size="mini"
            clearable
            v-model="yjlxSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initYhList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initYhList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="userTypeListTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadUserTypeListData"
          @selection-change="yhSelectChange"
          border
          :data="userTypeListList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
            :selectable="handleSelectable"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userTypeName"
            label="类型名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="分配任务">
            <template slot-scope="scope">
              {{ scope.row.haveFunction1 ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                v-if="scope.row.userTypeName !== '系统用户'"
                :id="scope.row.userTypeId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkUserTypeListDetail"
                @handleDel="deleteUserTypeList"
              ></td-action-tool>
              <div v-else style="text-align:center;">
                <span title="不允许操作">-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleUserTypeListSizeChange"
          @current-change="handleUserTypeListCurrentChange"
          :total="totalUserTypeListCount"
          :currentPage="currentUserTypeListPage"
          :pageSize="userTypeListPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑用户信息 -->
    <side-wrap
      v-loading="loadUserTypeListDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增用户类型信息</div>
            <div v-else class="tit active">修改用户类型信息</div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="yhlxEditForm"
          label-width="80px"
          :model="yhlxEditForm"
          :rules="yhlxFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>用户类型信息</span>
            </div>
            <el-form-item class="item" prop="userTypeName" label="类型名称">
              <el-input
                clearable
                v-model="yhlxEditForm.userTypeName"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="分配任务">
              <el-radio-group v-model="yhlxEditForm.haveFunction1">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <p style="font-size: 12px;color: #999;">
                用于限制计划分配任务单时是否可以选择用户
              </p>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('yhlxEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('yhlxEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { UserSearch, UserDel, UserSave } from "api/operation";
export default {
  name: "opera_yhlxgl",
  data() {
    this.yhlxFormRules = {
      userTypeName: [
        { required: true, message: "用户类型不能为空", trigger: "blur" }
      ],
      haveFunction1: [{ required: true }]
    };
    return {
      isAdd: true,
      // 列表相关
      multipleUserTypeListSelection: [],
      loadUserTypeListData: false,
      userTypeListList: [],
      yjlxSearchKey: "",
      userTypeListPageSize: 10,
      currentUserTypeListPage: 1,
      totalUserTypeListCount: 0,
      // 编辑
      loadUserTypeListDetail: false,
      showEditSide: false,
      yhlxEditForm: {
        userTypeName: "",
        haveFunction1: true
      }
    };
  },
  created() {
    this.initYhList();
  },
  methods: {
    //用户查询
    setRequestObj() {
      this.requestObj = {
        userTypeName: this.yjlxSearchKey
      };
    },
    // 用户列表
    initYhList() {
      this.currentUserTypeListPage = 1;
      this.setRequestObj();
      this.getUserTypeListList();
    },
    clickRow(row) {
      if (row.userTypeName === "系统用户") {
        return;
      }
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      if (row.userTypeName === "系统用户") {
        return;
      }
      this.isAdd = false;
      this.checkUserTypeListDetail("", "", row);
    },
    handleSelectable(row) {
      if (row.userTypeName === "系统用户") {
        return false;
      }
      return true;
    },
    yhSelectChange(val) {
      this.multipleUserTypeListSelection = val.map(item => item.userTypeId);
    },
    checkUserTypeListDetail(id, index, data) {
      this.showEditSide = true;
      this.$nextTick(() => {
        this.yhlxEditForm = {
          userTypeName: data.userTypeName,
          haveFunction1: data.haveFunction1,
          userTypeId: data.userTypeId
        };
        this.yhlxEditFormOrigin = Object.assign({}, this.yhlxEditForm);
      });
    },
    deleteUserTypeList(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadUserTypeListData = true;
          UserDel({
            userTypeIds: ids
              ? ids
              : this.multipleUserTypeListSelection.join(",")
          })
            .then(res => {
              this.loadUserTypeListData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initYhList();
            })
            .catch(() => {
              this.loadUserTypeListData = false;
            });
        })
        .catch(() => {});
    },
    getUserTypeListList() {
      this.loadUserTypeListData = true;

      let requestObj = {
        pageNumber: this.currentUserTypeListPage,
        pageSize: this.userTypeListPageSize,
        ...this.requestObj
      };

      UserSearch(requestObj)
        .then(res => {
          this.loadUserTypeListData = false;
          this.userTypeListList = res.data.dataList;
          this.totalUserTypeListCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadUserTypeListData = false;
        });
    },
    handleUserTypeListSizeChange(val) {
      this.userTypeListPageSize = val;
      this.getUserTypeListList();
    },
    handleUserTypeListCurrentChange(val) {
      this.currentUserTypeListPage = val;
      this.getUserTypeListList();
    },
    // 用户新增
    showAddUserTypeList() {
      this.isAdd = true;
      this.showEditSide = true;
      this.$nextTick(() => {
        this.resetForm("userTypeListAddForm");
      });
    },
    // 用户编辑
    handleUserTypeListFormEdit() {
      UserSave({
        ...this.yhlxEditForm
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initYhList();
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "yhlxEditForm") {
        // 恢复原始数据
        this.yhlxEditForm = Object.assign({}, this.yhlxEditFormOrigin);
      } else {
        this.yhlxEditForm = {
          userTypeName: "",
          haveFunction1: true
        };
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleUserTypeListFormEdit();
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.initYhList();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
