<!--
 * @Description: 菜单管理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-02-18 11:08:14
 * @LastEditTime: 2019-11-15 14:20:35
 -->

<template>
  <div class="set-cdgl">
    <td-content-header>
      菜单管理
    </td-content-header>
    <div class="content">
      <div class="content__tab">
        <div class="tab__header">
          <span class="tit">一级菜单</span>
          <el-button
            v-if="false"
            size="small"
            type="text"
            @click="handleAddMenu(1)"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
        <div class="tab__menus">
          <div
            class="tab__menu"
            @click="getSubMenus(menu, 1)"
            :class="{ active: menu.functionId === currentMenu1 }"
            v-for="(menu, index) in sysMenuFirst"
            :key="index"
          >
            <div>
              <span
                class="menu__status"
                :class="{ active: menu.isInvalid === 1 }"
              ></span>
              <span class="menu__txt">{{ menu.name }}</span>
              <!-- <span v-show="menu.isInvalid === 1">(生效)</span>
              <span v-show="menu.isInvalid === 0">(未生效)</span> -->
            </div>
            <div>
              <el-button
                type="text"
                @click.stop="handelEditMenu(menu.functionId, '0', 1)"
                ><icon-svg icon-class="icon-btn-ico-22" />
              </el-button>
              <el-button
                type="text"
                @click.stop="handelDelMenu(menu.functionId, 1)"
                ><icon-svg icon-class="icon-btn-ico-1" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content__tab">
        <div class="tab__header">
          <span class="tit">二级菜单</span>
          <el-button size="small" type="text" @click="handleAddMenu(2)"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
        <div class="tab__menus">
          <div
            class="tab__menu"
            @click="getSubMenus(menu, 2)"
            :class="{ active: menu.functionId === currentMenu2 }"
            v-for="(menu, index) in sysMenuSec"
            :key="index"
          >
            <div>
              <span
                class="menu__status"
                :class="{ active: menu.isInvalid === 1 }"
              ></span>
              <span class="menu__txt">{{ menu.name }}</span>
              <!-- <span v-show="menu.isInvalid === 1">(生效)</span>
              <span v-show="menu.isInvalid === 0">(未生效)</span> -->
            </div>
            <div>
              <el-button
                type="text"
                @click.stop="handelEditMenu(menu.functionId, menu.parentId, 2)"
                ><icon-svg icon-class="icon-btn-ico-22" />
              </el-button>
              <el-button
                type="text"
                @click.stop="handelDelMenu(menu.functionId, 2)"
                ><icon-svg icon-class="icon-btn-ico-1" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content__tab">
        <div class="tab__header">
          <span class="tit">三级菜单</span>
          <el-button size="small" type="text" @click="handleAddMenu(3)"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
        <div class="tab__menus">
          <div
            class="tab__menu"
            @click="getSubMenus(menu, 3)"
            :class="{ active: menu.functionId === currentMenu3 }"
            v-for="(menu, index) in sysMenuThird"
            :key="index"
          >
            <div>
              <span
                class="menu__status"
                :class="{ active: menu.isInvalid === 1 }"
              ></span>
              <span class="menu__txt">{{ menu.name }}</span>
              <!-- <span v-show="menu.isInvalid === 1">(生效)</span>
              <span v-show="menu.isInvalid === 0">(未生效)</span> -->
            </div>
            <div>
              <el-button
                type="text"
                @click.stop="handelEditMenu(menu.functionId, menu.parentId, 3)"
                ><icon-svg icon-class="icon-btn-ico-22" />
              </el-button>
              <el-button
                type="text"
                @click.stop="handelDelMenu(menu.functionId, 3)"
                ><icon-svg icon-class="icon-btn-ico-1" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="content__tab">
        <div class="tab__header">
          <span class="tit">功能按钮</span>
          <el-button size="small" type="text" @click="handleAddMenu(4)"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
        <div class="tab__menus">
          <div
            class="tab__menu"
            @click="getSubMenus(menu, 4)"
            :class="{ active: menu.functionId === currentFunctionId }"
            v-for="(menu, index) in sysMenuBtns"
            :key="index"
          >
            <div>
              <span
                class="menu__status"
                :class="{ active: menu.isInvalid === 1 }"
              ></span>
              <span class="menu__txt">{{ menu.name }}</span>
              <!-- <span v-show="menu.isInvalid === 1">(生效)</span>
              <span v-show="menu.isInvalid === 0">(未生效)</span> -->
            </div>
            <div>
              <el-button
                type="text"
                @click.stop="handelEditMenu(menu.functionId, menu.parentId, 4)"
                ><icon-svg icon-class="icon-btn-ico-22" />
              </el-button>
              <el-button
                type="text"
                @click.stop="handelDelMenu(menu.functionId, 4)"
                ><icon-svg icon-class="icon-btn-ico-1" />
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增菜单 -->
    <el-dialog
      custom-class="menu__add_dialog"
      title="新增菜单/按钮"
      :visible.sync="showAddDialog"
    >
      <el-form
        ref="addMenuForm"
        class="custom__form"
        label-width="140px"
        :model="addMenuForm"
        :rules="menuFormRules"
      >
        <el-form-item class="item" prop="name" label="菜单/按钮名称">
          <el-input
            clearable
            size="small"
            placeholder="用于权限判断"
            v-model="addMenuForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="displayName" label="菜单/按钮展示名称">
          <el-input
            clearable
            placeholder="用于实际展示的名称"
            size="small"
            v-model="addMenuForm.displayName"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="enName" label="菜单/按钮英文名称">
          <el-input
            clearable
            size="small"
            v-model="addMenuForm.enName"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="code" label="权限代码">
          <el-input
            clearable
            size="small"
            v-model="addMenuForm.code"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="showOrder" label="排序">
          <el-input
            clearable
            size="small"
            v-model="addMenuForm.showOrder"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="isInvalid" label="生效">
          <div class="item__text">
            <el-switch
              size="small"
              :active-value="1"
              :inactive-value="0"
              active-text="生效"
              inactive-text="不生效"
              v-model="addMenuForm.isInvalid"
            >
            </el-switch>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button size="small" @click="resetForm('addMenuForm')"
            >重置</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            :loading="isSavingAddForm"
            @click="submitForm('addMenuForm')"
            >保 存</el-button
          >
          <el-button size="small" @click="showAddDialog = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 编辑菜单 -->
    <el-dialog
      custom-class="menu__add_dialog"
      title="编辑菜单/按钮"
      :visible.sync="showEditDialog"
    >
      <el-form
        v-loading="loadMenuFun"
        ref="editMenuForm"
        class="custom__form"
        label-width="140px"
        :model="editMenuForm"
        :rules="menuFormRules"
      >
        <el-form-item class="item" prop="name" label="菜单/按钮名称">
          <el-input
            clearable
            placeholder="用于权限判断"
            size="small"
            v-model="editMenuForm.name"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="displayName" label="菜单/按钮展示名称">
          <el-input
            clearable
            placeholder="用于实际展示的名称"
            size="small"
            v-model="editMenuForm.displayName"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="enName" label="菜单/按钮英文名称">
          <el-input
            clearable
            size="small"
            v-model="editMenuForm.enName"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="code" label="权限代码">
          <el-input
            clearable
            size="small"
            v-model="editMenuForm.code"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="showOrder" label="排序">
          <el-input
            clearable
            size="small"
            v-model="editMenuForm.showOrder"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="isInvalid" label="生效">
          <div class="item__text">
            <el-switch
              size="small"
              :active-value="1"
              :inactive-value="0"
              active-text="生效"
              inactive-text="不生效"
              v-model="editMenuForm.isInvalid"
            >
            </el-switch>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button size="small" @click="resetForm('editMenuForm')"
            >重置</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            :loading="isSavingEditForm"
            @click="submitForm('editMenuForm')"
            >保 存</el-button
          >
          <el-button size="small" @click="showEditDialog = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  sysMenuTree,
  sysMenuSubMenu,
  sysMenuSave,
  sysMenuDel,
  sysMenuGetFun
} from "api/setting";
export default {
  name: "set_cdgl",
  data() {
    this.menuFormRules = {
      name: [
        { required: true, message: "菜单/按钮名称不能为空", trigger: "blur" }
      ],
      displayName: [
        {
          required: true,
          message: "菜单/按钮展示名称不能为空",
          trigger: "blur"
        }
      ],
      enName: [
        {
          required: true,
          message: "菜单/按钮英文名称不能为空",
          trigger: "blur"
        }
      ],
      showOrder: [{ required: true, message: "排序不能为空", trigger: "blur" }]
    };
    return {
      sysMenuFirst: {},
      sysMenuSec: {},
      sysMenuThird: {},
      sysMenuBtns: {},
      currentMenu1: "", // 一级菜单选中的
      currentMenu2: "", // 二级菜单选中的
      currentMenu3: "", // 三级菜单选中的
      currentParentId: "", // 当前菜单父菜单id
      currentFunctionId: "", // 当前菜单id
      currentMenuLevel: "",
      // 新增
      showAddDialog: false,
      isSavingAddForm: false,
      addMenuForm: {
        name: "",
        displayName: "",
        enName: "",
        code: "",
        showOrder: "",
        isInvalid: 1
      },
      // 编辑
      showEditDialog: false,
      editMenuForm: {},
      isSavingEditForm: false,
      loadMenuFun: false
    };
  },
  methods: {
    getSubMenus(menu, level) {
      this.currentParentId = menu.parentId;
      this.currentFunctionId = menu.functionId;
      if (level === 4) {
        return;
      }
      sysMenuSubMenu({
        parentId: this.currentFunctionId
      }).then(res => {
        let mapMenu = this.mapMenuTree(res.data);
        switch (level) {
          case 1:
            this.currentMenu1 = menu.functionId;
            this.currentMenu2 = "";
            this.currentMenu3 = "";
            this.sysMenuSec = mapMenu;
            this.sysMenuThird = {};
            this.sysMenuBtns = {};
            break;
          case 2:
            this.currentMenu2 = menu.functionId;
            this.currentMenu3 = "";
            this.sysMenuBtns = {};
            this.sysMenuThird = mapMenu;
            break;
          case 3:
            this.currentMenu3 = menu.functionId;
            this.sysMenuBtns = mapMenu;
            break;
          default:
            break;
        }
      });
    },
    getSysFirstMenuTree() {
      sysMenuTree().then(res => {
        this.sysMenuFirst = this.mapMenuTree(res.data);
      });
    },
    handleAddMenu(level) {
      switch (level) {
        case 2:
          this.currentParentId = this.currentMenu1;
          if (!this.sysMenuFirst.hasOwnProperty(this.currentParentId)) {
            this.$message.warning("请先选择一级菜单");
            return;
          }
          break;
        case 3:
          this.currentParentId = this.currentMenu2;
          if (!this.sysMenuSec.hasOwnProperty(this.currentParentId)) {
            this.$message.warning("请先选择二级菜单");
            return;
          }
          break;
        case 4:
          this.currentParentId = this.currentMenu3;
          if (!this.sysMenuThird.hasOwnProperty(this.currentParentId)) {
            this.$message.warning("请先选择三级菜单");
            return;
          }
          break;
        default:
          break;
      }
      this.currentMenuLevel = level;
      this.showAddDialog = true;
    },
    handleSubmitAddMenu() {
      this.isSavingAddForm = true;
      let requestObj = this.addMenuForm;
      if (this.currentMenuLevel === 1) {
        requestObj.parentId = 0;
      } else {
        requestObj.parentId = this.currentParentId;
      }
      if (this.currentMenuLevel === 4) {
        requestObj.isMenu = 0;
      } else {
        requestObj.isMenu = 1;
      }
      sysMenuSave(requestObj)
        .then(res => {
          this.isSavingAddForm = false;
          this.$message.success(res.message);
          this.showAddDialog = false;
          this.resetForm("addMenuForm");

          this.getSysFirstMenuTree();
          if (this.currentParentId != 0) {
            // 局部更新菜单
            this.refreshSubMenus();
          }
        })
        .catch(() => {
          this.isSavingAddForm = false;
        });
    },
    refreshSubMenus() {
      sysMenuSubMenu({
        parentId: this.currentParentId
      }).then(res => {
        let mapMenu = this.mapMenuTree(res.data);
        switch (this.currentMenuLevel) {
          case 2:
            // this.sysMenuFirst[this.currentMenu1].children = res.data;
            this.sysMenuSec = mapMenu;
            break;
          case 3:
            // this.sysMenuSec[this.currentMenu2].children = res.data;
            this.sysMenuThird = mapMenu;
            break;
          case 4:
            // this.sysMenuThird[this.currentMenu3].children = res.data;
            this.sysMenuBtns = mapMenu;
            break;
          default:
            break;
        }
      });
    },
    // 编辑
    handelEditMenu(functionId, parentId, level) {
      this.currentFunctionId = functionId;
      this.currentParentId = parentId;
      this.currentMenuLevel = level;
      this.showEditDialog = true;
      this.loadMenuFun = true;
      sysMenuGetFun({
        functionId: functionId
      }).then(res => {
        this.editMenuForm = Object.assign({}, res.data);
        this.editMenuFormOrigin = Object.assign({}, res.data);
        this.loadMenuFun = false;
      });
    },
    handleSubmitEditMenu() {
      this.isSavingEditForm = true;
      let requestObj = this.editMenuForm;
      if (this.currentMenuLevel === 1) {
        requestObj.parentId = 0;
      } else {
        requestObj.parentId = this.currentParentId;
      }
      if (this.currentMenuLevel === 4) {
        requestObj.isMenu = 0;
      } else {
        requestObj.isMenu = 1;
      }
      requestObj.functionId = this.currentFunctionId;

      sysMenuSave(requestObj)
        .then(res => {
          this.isSavingEditForm = false;
          this.$message.success(res.message);
          this.showEditDialog = false;
          this.getSysFirstMenuTree();

          if (this.currentParentId != 0) {
            // 局部更新菜单
            this.refreshSubMenus();
          }
        })
        .catch(() => {
          this.isSavingEditForm = false;
        });
    },
    // 删除
    handelDelMenu(id, level) {
      this.currentMenuLevel = level;
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          sysMenuDel({
            functionIds: id
          }).then(res => {
            this.$message.success(res.message);
            this.getSysFirstMenuTree();
            switch (level) {
              case 2:
                delete this.sysMenuSec[id];
                break;
              case 3:
                delete this.sysMenuThird[id];
                break;
              case 4:
                delete this.sysMenuBtns[id];
                break;
              default:
                break;
            }
          });
        })
        .catch(() => {});
    },
    // 通用
    resetForm(formName) {
      if (formName === "editMenuForm") {
        this.editMenuForm = Object.assign({}, this.editMenuFormOrigin);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "addMenuForm") {
            this.handleSubmitAddMenu();
          } else if (formName === "editMenuForm") {
            this.handleSubmitEditMenu();
          }
        } else {
          return false;
        }
      });
    },
    // 返回 functionId 树
    mapMenuTree(data) {
      data = data || [];
      let menuObj = {};
      data.map(item => {
        menuObj[item.functionId] = item;
      });
      return menuObj;
    }
  },
  mounted() {
    this.getSysFirstMenuTree();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.content {
  display: flex;
  .content__tab {
    margin: 0 1%;
    border: 1px solid rgba(234, 234, 234, 1);
    border-radius: 4px;
    flex: 0 0 23%;
    background: #fff;
    .tab__header {
      padding: 0 20px;
      background: @topBgColor;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      .tit {
        font-size: 15px;
        color: @fontDarkColor;
        font-weight: bold;
      }
    }
    .tab__menus {
      height: 500px;
      overflow-y: auto;
      padding: 10px 0;
    }
    .tab__menu {
      display: flex;
      height: 42px;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      cursor: pointer;
      &.active,
      &:hover {
        background: #eef6ff;
      }
      .menu__status {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
        background: @grayColor;
        &.active {
          background: @successColor;
        }
      }
      .menu__txt {
        font-size: 14px;
        font-weight: bold;
      }

      .el-checkbox {
        margin-right: 10px;
      }
      .el-button {
        margin-left: 10px;
      }
      i {
        font-size: 14px;
      }
    }
  }
}
.custom__form {
  display: flex;
  flex-wrap: wrap;
  .item {
    flex: 0 0 100%;
    justify-content: left !important;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
