<!--
 * @Description: 角色权限管理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-18 11:08:14
 * @LastEditTime: 2020-03-09 14:39:40
 -->

<template>
  <div class="set-jsgl common__content">
    <td-content-header>
      角色管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            @click="
              initAddSide = true;
              showAddSide = true;
            "
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleRoleSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteRoles('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
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
          <el-input
            ref="focusInput"
            size="mini"
            clearable
            v-model="currentSearchRole"
            @keyup.enter.native="initRoleList"
            placeholder="请输入角色名称"
          ></el-input>
          <el-button type="primary" size="mini" @click="initRoleList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="contentTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadRoleData"
          @selection-change="handleRolesSelectionChange"
          border
          :data="rolesList"
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
          <el-table-column
            show-overflow-tooltip
            prop="roleCode"
            label="角色代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="roleName"
            label="角色名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="成员馆" prop="libName">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="角色描述">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.roleId"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkRoleDetail"
                @handleDel="deleteRoles"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleRoleSizeChange"
          @current-change="handleRoleCurrentChange"
          :total="totalRoleCount"
          :currentPage="currentRolePage"
          :pageSize="rolePageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 角色详细信息 -->
    <side-wrap
      class="common__side_form"
      v-if="initEditSide"
      v-show="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              角色详细信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="roleEditForm"
          label-width="80px"
          :model="roleEditForm"
          :rules="roleFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>角色信息</span>
            </div>
            <el-form-item class="item" prop="roleCode" label="角色代码">
              <el-input v-model="roleEditForm.roleCode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="roleName" label="角色名称">
              <el-input v-model="roleEditForm.roleName"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="roleEditForm.libId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="remark" label="角色描述">
              <el-input
                type="textarea"
                v-model="roleEditForm.remark"
              ></el-input>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>角色权限</span>
            </div>
            <el-tree
              ref="roleEditMenuTree"
              node-key="functionId"
              :data="roleMenuTreeData"
              show-checkbox
              :default-expand-all="false"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <el-button size="mini" @click="resetForm('roleEditForm')"
            >重置</el-button
          >
          <div>
            <el-button
              size="mini"
              @click="submitForm('roleEditForm')"
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
    <!-- 新建角色 -->
    <side-wrap
      class="common__side_form"
      v-if="initAddSide"
      v-show="showAddSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新建角色
            </div>
          </div>
          <i class="el-icon-close" @click="cancelAdd"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="roleAddForm"
          label-width="80px"
          :model="roleAddForm"
          :rules="roleFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>角色信息</span>
            </div>
            <el-form-item class="item" prop="roleCode" label="角色代码">
              <el-input clearable v-model="roleAddForm.roleCode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="roleName" label="角色名称">
              <el-input clearable v-model="roleAddForm.roleName"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="roleAddForm.libId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="remark" label="角色描述">
              <el-input
                type="textarea"
                clearable
                v-model="roleAddForm.remark"
              ></el-input>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>角色权限</span>
            </div>
            <el-tree
              ref="roleAddMenuTree"
              node-key="functionId"
              :data="roleMenuTreeData"
              show-checkbox
              :default-expand-all="false"
              :props="defaultProps"
            ></el-tree>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <el-button size="mini" @click="resetForm('roleAddForm')"
            >重置</el-button
          >
          <div>
            <el-button
              size="mini"
              @click="submitForm('roleAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelAdd">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  sysRoleList,
  sysRoleSave,
  sysRoleGet,
  sysRoleDel,
  sysMenuTree
} from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_jsgl",
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  data() {
    this.roleFormRules = {
      roleCode: [
        { required: true, message: "角色代码不能为空", trigger: "blur" }
      ],
      roleName: [
        { required: true, message: "用户名称不能为空", trigger: "blur" }
      ],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }]
    };
    this.defaultProps = {
      children: "children",
      label: "displayName"
    };
    return {
      // 角色列表相关
      loadRoleData: false,
      currentSearchRole: "",
      selectLibId: this.$store.getters.userInfo.libId,
      rolesList: [],
      multipleRoleSelection: [],
      totalRoleCount: 0,
      currentRolePage: 1,
      rolePageSize: 15,
      // 角色详细信息
      initEditSide: false,
      showEditSide: false,
      currentEditRoleId: "",
      roleEditForm: {
        roleCode: "",
        roleName: "",
        libId: "",
        remark: ""
      },
      // 新建角色
      initAddSide: false,
      showAddSide: false,
      roleAddForm: {
        roleCode: "",
        roleName: "",
        libId: this.$store.getters.userInfo.libId,
        remark: ""
      },
      // 权限
      roleMenuTreeData: []
    };
  },
  methods: {
    // 列表相关
    initRoleList() {
      this.currentRolePage = 1;
      this.setRoleListRequestObj();
      this.getRoleList();
    },
    setRoleListRequestObj() {
      this.roleListRequestObj = {
        libId: this.selectLibId,
        roleName: this.currentSearchRole
      };
    },
    getRoleList() {
      this.loadRoleData = true;

      let requestObj = {
        pageNumber: this.currentRolePage,
        pageSize: this.rolePageSize,
        ...this.roleListRequestObj
      };

      sysRoleList(requestObj)
        .then(res => {
          this.loadRoleData = false;
          this.rolesList = res.data.dataList;
          this.totalRoleCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadRoleData = false;
        });
    },
    deleteRoles(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysRoleDel({
            roleIds: ids || this.multipleRoleSelection.join(",")
          }).then(res => {
            this.$message.success(res.message);
            if (index) {
              this.rolesList.splice(index, 1);
            } else {
              this.initRoleList();
            }
          });
        })
        .catch(() => {});
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkRoleDetail(row.roleId);
    },
    handleRolesSelectionChange(roles) {
      this.multipleRoleSelection = roles.map(role => role.roleId);
    },
    handleRoleSizeChange(val) {
      this.rolePageSize = val;
      this.getRoleList();
    },
    handleRoleCurrentChange(val) {
      this.currentRolePage = val;
      this.getRoleList();
    },
    // 新增未保存 取消需重置
    cancelAdd() {
      this.showAddSide = false;
      this.resetForm("roleAddForm");
    },
    // 新增角色
    handleRoleFormAdd() {
      let menuChecksArr =
        this.$refs.roleAddMenuTree.getCheckedNodes(false, true) || [];
      if (menuChecksArr.length === 0) {
        this.$message("至少选择一个角色权限");
        return;
      }
      let requestObj = this.roleAddForm;
      requestObj.functionIds = menuChecksArr
        .map(item => item.functionId)
        .join(",");
      if (requestObj.functionIds.length === 0) {
        this.$message("请选择至少一项角色权限");
        return;
      }
      sysRoleSave(requestObj).then(res => {
        this.$message.success(res.message);
        this.resetForm("roleAddForm");
        this.$refs.roleAddMenuTree.setCheckedKeys([]);
        this.showAddSide = false;
        this.getRoleList();
      });
    },
    // 角色详情
    checkRoleDetail(id) {
      this.currentEditRoleId = id;
      sysRoleGet({
        roleId: id
      }).then(res => {
        this.initEditSide = true;
        this.showEditSide = true;
        let roleData = res.data.role;
        let checkedMenus = res.data.functionList.map(item => item.functionId);

        // 用于重置
        this.roleEditFormOrigin = Object.assign(
          {},
          {
            roleCode: roleData.roleCode,
            roleName: roleData.roleName,
            libId: roleData.libId,
            remark: roleData.remark
          }
        );
        this.defaultMenuCheckedOrigin = Object.assign([], checkedMenus);
        // 用于展示
        this.roleEditForm = Object.assign(
          {},
          {
            roleCode: roleData.roleCode,
            roleName: roleData.roleName,
            libId: roleData.libId,
            remark: roleData.remark
          }
        );

        this.$nextTick(() => {
          // 清空原来选中的权限 checkbox
          this.$refs.roleEditMenuTree.setCheckedKeys([]);
          // 赋值
          checkedMenus.map(item => {
            this.$refs.roleEditMenuTree.setChecked(item, true, false);
          });
        });
      });
    },
    handleRoleFormEdit() {
      let menuChecksArr =
        this.$refs.roleEditMenuTree.getCheckedNodes(false, true) || [];
      if (menuChecksArr.length === 0) {
        this.$message("至少选择一个角色权限");
        return;
      }
      let requestObj = this.roleEditForm;
      requestObj.roleId = this.currentEditRoleId;
      requestObj.functionIds = menuChecksArr
        .map(item => item.functionId)
        .join(",");
      sysRoleSave(requestObj).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.getRoleList();
      });
    },
    // 角色权限
    getSysMenuTree() {
      sysMenuTree().then(res => {
        this.roleMenuTreeData = res.data;
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "roleEditForm") {
            this.handleRoleFormEdit();
          } else if (formName === "roleAddForm") {
            this.handleRoleFormAdd();
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (formName === "roleAddForm") {
        this.$refs.roleAddMenuTree.setCheckedKeys([]);
      } else if (formName === "roleEditForm") {
        this.roleEditForm = Object.assign({}, this.roleEditFormOrigin);
        this.$refs.roleEditMenuTree.setCheckedKeys(
          this.defaultMenuCheckedOrigin
        );
      }
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.initRoleList();
    this.getSysMenuTree();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.edit__content {
  .el-tree {
    width: 100%;
  }
  /deep/ .el-tree-node__label {
    font-size: @FSize_16;
    font-weight: 600;
  }
}
</style>
