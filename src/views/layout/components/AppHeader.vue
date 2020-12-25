<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-18 09:21:37
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-24 11:40:38
 -->
<template>
  <div class="app-header">
    <img :src="logoPath" class="logo" />
    <div class="menus" :class="showMenus ? '' : 'clear'">
      <span
        class="menu"
        :class="{ active: currentFirstMenu === item.name }"
        @click="changeMenu(item.name)"
        v-for="(item, index) in filterMenus(firstMenus)"
        :key="index"
      >
        <img
          class="menu__icon"
          :src="getMenuIcon(item.name)"
          :alt="item.name_cn"
        />
        <span class="menu__name">{{ item.name_cn }}</span>
      </span>
    </div>
    <div class="user">
      <el-popover
        popper-class="header__tools-popper"
        placement="bottom"
        width="170"
        trigger="click"
      >
        <div class="tools__list">
          <p class="user__name">{{ $store.getters.userInfo.username }}</p>
          <p class="user__lib">{{ $store.getters.userInfo.libName }}</p>
          <el-popover
            popper-class="font__list-popper"
            placement="right"
            trigger="hover"
          >
            <div
              class="font__item"
              :class="{ active: fontSize === '120px' }"
              @click="changeFontSize('120px')"
            >
              较大
            </div>
            <div
              class="font__item"
              :class="{ active: fontSize === '100px' }"
              @click="changeFontSize('100px')"
            >
              大
            </div>
            <div
              class="font__item"
              :class="{ active: fontSize === '90px' }"
              @click="changeFontSize('90px')"
            >
              中
            </div>
            <div
              class="font__item"
              :class="{ active: fontSize === '80px' }"
              @click="changeFontSize('80px')"
            >
              小
            </div>
            <p slot="reference" class="tool">
              <icon-svg icon-class="icon-zitidaxiao" />字体大小
            </p>
          </el-popover>
          <p class="tool" @click="changePwd">
            <icon-svg icon-class="icon-gerencanshu" /> 修改密码
          </p>
          <p class="tool" @click="handleLogout">
            <icon-svg icon-class="icon-tuichu" /> 退出登录
          </p>
        </div>
        <el-button slot="reference" type="text"
          ><span class="txt">{{ $store.getters.userInfo.username }}</span>
          <icon-svg style="color: #fff;" icon-class="icon-xialajiantou" />
        </el-button>
      </el-popover>
    </div>
    <!-- 修改密码弹窗 -->
    <el-dialog
      title="修改密码"
      :visible.sync="changePwdVisible"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <el-form
        :model="pwdForm"
        :rules="pwdFormRules"
        ref="pwdForm"
        label-width="80px"
      >
        <el-form-item label="旧密码" prop="oldPwd">
          <el-input
            type="password"
            clearable
            size="small"
            placeholder="请输入旧密码"
            v-model="pwdForm.oldPwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPwd">
          <el-input
            type="password"
            clearable
            size="small"
            placeholder="请输入新密码"
            v-model="pwdForm.newPwd"
          ></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPwd">
          <el-input
            type="password"
            clearable
            size="small"
            placeholder="请再次输入新密码"
            v-model="pwdForm.confirmPwd"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="submitForm('pwdForm')"
          >修 改</el-button
        >
        <el-button size="small" @click="changePwdVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { userPwdChange } from "api/setting";

export default {
  computed: {
    ...mapGetters(["firstMenus", "currentFirstMenu"])
  },
  methods: {
    filterMenus(menus) {
      return menus.filter(item => item.name_cn);
    },
    getMenuIcon(menu) {
      if (menu !== "/") {
        return require("assets/icon/" + menu + ".png");
      }
    },
    checkPwdSafe() {
      if (this.$route.params.userId) {
        this.$confirm(this.$route.params.msg, "提示", {
          confirmButtonText: "去修改",
          cancelButtonText: "稍后",
          type: "warning"
        })
          .then(() => {
            // 前往修改密码
            this.changePwd();
          })
          .catch(() => {});
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          userPwdChange({
            newPwd: this.pwdForm.newPwd,
            oldPwd: this.pwdForm.oldPwd
          }).then(res => {
            this.$message.success(res.message);
            this.changePwdVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    changePwd() {
      this.changePwdVisible = true;
      this.$nextTick(() => {
        this.pwdForm = {
          oldPwd: "",
          newPwd: "",
          confirmPwd: ""
        };
        this.$refs["pwdForm"].clearValidate();
      });
    },
    changeMenu(menuname) {
      this.$store.commit("SET_CURRENTMENU", menuname);
    },
    handleLogout() {
      this.$confirm("确定要退出么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$store.dispatch("FedLogOut").then(() => {
            window.location.reload();
          });
        })
        .catch(() => {});
    },
    changeFontSize(fontSize) {
      document.documentElement.style.fontSize = fontSize;
      this.fontSize = fontSize;
      localStorage.setItem("td-fontSize", fontSize);
    },
    setMenuShow() {
      if (this.$route.name.indexOf("simple_") > -1) {
        this.showMenus = false;
      } else {
        this.showMenus = true;
      }
    }
  },
  mounted() {
    this.fontSize = localStorage.getItem("td-fontSize") || "100px";
    let path = this.$route.path;
    this.changeMenu(path.substring(1, path.indexOf("/", 1)));
    this.setMenuShow();
    // 监听多窗口时退出没有刷新的问题
    window.addEventListener("storage", function(e) {
      if (e.key === "td-logout") {
        location.reload();
      }
    });
  },
  created() {
    this.checkPwdSafe();
  },
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/.test(value)) {
        callback(new Error("密码至少包含6位字符，由数字，大小写字母组成"));
      } else {
        callback();
      }
    };
    let validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入新密码"));
      } else if (value !== this.pwdForm.newPwd) {
        callback(new Error("两次新密码不一致!"));
      } else {
        callback();
      }
    };
    this.logoPath = require("assets/logo2.png");
    this.pwdFormRules = {
      oldPwd: [
        {
          required: true,
          message: "请输入旧密码",
          trigger: "blur"
        }
      ],
      newPwd: [{ required: true, validator: validatePass, trigger: "blur" }],
      confirmPwd: [
        {
          required: true,
          validator: validatePass2,
          trigger: "blur"
        }
      ]
    };
    return {
      changePwdVisible: false,
      showMenus: false,
      fontSize: "",
      pwdForm: {
        oldPwd: "",
        newPwd: "",
        confirmPwd: ""
      }
    };
  }
};
</script>

<style lang="less" scoped>
.app-header {
  height: 70px;
  flex-shrink: 0;
  background: #378de6;
  display: flex;
  align-items: center;
  padding: 0 20px;

  .logo {
    margin-right: 90px;
  }

  .menus {
    height: 100%;
    display: flex;
    flex: 1;
    opacity: 1;
    line-height: 50px;
    &.clear {
      opacity: 0;
    }
  }
  .menu {
    display: flex;
    flex-direction: column;
    align-content: center;
    justify-content: center;
    position: relative;
    padding: 0 10px;
    font-size: @FSize_16;
    color: #ffffff;
    cursor: pointer;
    text-align: center;
    &.active,
    &:hover {
      background: rgba(17, 112, 210, 1);
    }
    .menu__icon {
      vertical-align: bottom;
    }
    .menu__name {
      line-height: 1;
      margin-top: 5px;
    }
  }

  .user {
    display: flex;
    align-items: center;
    font-size: @FSize_16;
    /deep/ .el-button {
      padding: 15px;
      border-radius: 0;
      height: 70px;
    }
    .txt {
      color: #fff;
      line-height: 23px;
      height: 23px;
      margin-right: 5px;
    }
  }
}
</style>

<style lang="less">
.header__tools-popper {
  margin-top: 0 !important;
  padding: 20px 0 !important;

  .tools__list {
    .user__name {
      padding: 0 20px;
      font-size: @FSize_18;
    }

    .user__lib {
      padding: 0 20px;
      font-size: @FSize_14;
      color: @fontTintColor;
      margin-bottom: 20px;
    }

    .tool {
      padding: 0 20px;
      display: flex;
      align-items: center;
      cursor: pointer;
      line-height: 46px;
      border-bottom: 1px solid #f1f1f1;
      font-size: @FSize_15;
      color: @fontDarkColor;

      svg {
        font-size: @FSize_14;
        color: @fontBaseColor;
        margin-right: 18px;
      }

      &:hover {
        background: @hoverBgColor;
        color: @primaryColor;

        svg {
          color: @primaryColor;
        }
      }
    }
  }
}

.font__list-popper {
  margin-right: 0 !important;
  padding: 12px 0 !important;

  .font__item {
    text-indent: 12px;
    line-height: 32px;
    cursor: pointer;

    &.active,
    &:hover {
      color: @primaryColor;
      background: @hoverBgColor;
    }
  }
}
</style>
