<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-14 16:16:34
 * @LastEditors  : chenming.feng
 * @LastEditTime : 2019-12-25 16:25:05
 -->
<template>
  <div class="p-login">
    <el-container>
      <el-main class="login__content">
        <div class="login__container">
          <div>
            <el-header>
              <img src="" class="logo" />
            </el-header>
            <div class="login__bg"></div>
          </div>
          <div class="login__body">
            <p class="login__title">登&nbsp;&nbsp;录</p>
            <el-form
              key="login"
              class="login__form"
              :rules="loginFormRules"
              ref="loginForm"
              :model="loginForm"
            >
              <el-form-item prop="loginName">
                <el-input
                  v-model="loginForm.loginName"
                  placeholder="请输入用户名"
                  clearable
                  @keyup.native.enter="moveToPwd"
                  ref="loginName"
                  ><icon-svg icon-class="icon-yonghu" slot="prefix"
                /></el-input>
              </el-form-item>
              <el-form-item prop="loginPwd">
                <el-input
                  type="password"
                  ref="pwdInput"
                  clearable
                  v-model="loginForm.loginPwd"
                  placeholder="请输入密码"
                  @keyup.native.enter="submitLogin('loginForm')"
                  ><icon-svg icon-class="icon-suo" slot="prefix"
                /></el-input>
              </el-form-item>
              <el-button
                :loading="isLoading"
                type="primary"
                @click="submitLogin('loginForm')"
                >登录</el-button
              >
            </el-form>
          </div>
        </div>
        <el-footer>
          <p class="login__footer" style="color:#EFEFEF">
            <span v-if="$TDConfig.isShowCopyRight"
              >&copy;广东拓迪智能科技有限公司 版权所有 |</span
            >
            技术支持：400-600-8085 | 软件版本：V4.1.3.5
          </p>
        </el-footer>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { getSystemImg } from "api/setting";
import { IMG_URL } from "utils/base";
import { userIsLogin } from "api/login";
import { mapActions } from "vuex";
export default {
  data() {
    this.loginFormRules = {
      loginName: [
        {
          required: true,
          message: "请输入用户名",
          trigger: "blur"
        }
      ],
      loginPwd: [
        {
          required: true,
          message: "请输入密码",
          trigger: "blur"
        }
      ]
    };
    return {
      isLoading: false,
      IMG_URL: IMG_URL,
      loginForm: {
        loginName: "",
        loginPwd: ""
      }
    };
  },
  methods: {
    // 登录前校验
    userIsLogin() {
      userIsLogin({
        loginName: this.loginForm.loginName,
        loginPwd: this.loginForm.loginPwd
      }).then(res => {
        if (res.message === "检测到该账号正在使用中，确定要继续登录吗？") {
          this.$confirm("检测到该账号正在使用中，确定要继续登录吗？", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              this.handleLogin();
            })
            .catch(() => {
              this.$refs.loginName.select();
            });
        } else if (res.message === "操作成功！") {
          this.handleLogin();
        }
      });
    },
    handleLogin() {
      this.isLoading = true;
      this.loginByUsername({
        loginName: this.loginForm.loginName,
        loginPwd: this.loginForm.loginPwd
      })
        .then(res => {
          this.isLoading = false;
          // 1 为极简模式
          if (res.data.user.mode === "1") {
            this.$router.push({ name: "simple_menu" }); //登录成功之后重定向到首页
          } else {
            if (res.data.warn.flag === 1) {
              // 密码强度不够
              this.$router.push({
                name: "welcome",
                params: {
                  userId: res.data.user.userId,
                  msg: res.data.warn.msg
                }
              });
            } else {
              this.$router.push({ path: "/" }); //重定向到首页
            }
          }
        })
        .catch(() => {
          this.isLoading = false;
        });
    },
    moveToPwd() {
      this.$refs.pwdInput.focus();
    },
    submitLogin(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 登录前校验
          this.userIsLogin();
        } else {
          return false;
        }
      });
    },
    getSystemImg() {
      getSystemImg().then(res => {
        // Logo
        let logoPath = res.data.elibIndexLogo;
        if (logoPath) {
          document
            .querySelector(".logo")
            .setAttribute("src", `${IMG_URL}/api/p/img/url?img=${logoPath}`);
        } else {
          document
            .querySelector(".logo")
            .setAttribute("src", "../../assets/logo_blue.png");
        }

        // 背景
        let loginBgPath = res.data.elibIndex;
        if (loginBgPath) {
          document.querySelector(
            ".p-login"
          ).style.backgroundImage = `url('${IMG_URL}/api/p/img/url?img=${loginBgPath}')`;
        } else {
          document.querySelector(
            ".p-login"
          ).style.backgroundImage = `url('../../assets/login_bg.jpg')`;
        }

        // 登录栏左侧框
        let loginLeftPath = res.data.elibIndexLogin;
        if (loginLeftPath) {
          document.querySelector(
            ".login__bg"
          ).style.backgroundImage = `url('${IMG_URL}/api/p/img/url?img=${loginLeftPath}')`;
        } else {
          document.querySelector(
            ".login__bg"
          ).style.backgroundImage = `url('../../assets/login_swiper1.jpg')`;
        }
      });
    },
    ...mapActions({ loginByUsername: "LoginByUsername" })
  },
  mounted() {
    this.getSystemImg();
  }
};
</script>

<style lang="less">
.p-login {
  min-width: 1200px;
  position: relative;
  overflow: hidden;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .login__content {
    padding: 0;
  }
  .login__container {
    display: flex;
    background: #fff;
    box-shadow: 0px 0px 32px 0px rgba(0, 0, 0, 0.2);
    width: 85vw;
    min-width: 810px;
    height: 85vh;
    border-radius: 1.5vw;
    overflow: hidden;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    top: 50%;
    > div {
      width: 60%;
      min-height: 750px;
      .login__bg {
        background-position: center;
        background-repeat: no-repeat;
        background-size: 100% 100%;
        height: ~"calc(100% - 40vh)";
        max-width: 530px;
        margin: 0 auto;
        opacity: 0.76;
      }
    }
    .login__body {
      position: relative;
      flex: 1;
      width: 40%;
      .login__title {
        line-height: 1;
        font-size: 36px;
        color: @primaryColor;
        margin: 20vh auto 8vh;
        text-align: center;
      }
      .login__form {
        width: 72%;
        margin: auto;
        max-width: 402px;
        .el-form-item {
          margin-bottom: 2.8vh;
        }
        .el-input {
          input {
            height: 4.6vh;
            font-size: 16px;
            // background: #f3f5f8;
            border: none;
            border-bottom: 1px solid #ddd;
            border-radius: 0px;
            padding-left: 40px;
          }
        }
        .el-button {
          box-sizing: border-box;
          margin-top: 4.5vh;
          font-size: 20px;
          width: 16.5vw;
          max-width: 230px;
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0.5vw;
        }
        .el-input__prefix {
          display: flex;
          align-items: center;
        }
        .el-input__inner:focus + .el-input__prefix {
          color: #409eff;
        }
      }
      .el-button {
        width: 100%;
      }
    }
  }
  .el-header {
    height: 16vh !important;
    padding: 20px;
    .logo {
      width: 20vw;
    }
  }
  .el-footer {
    position: absolute;
    // height: 21.2vh !important;
    bottom: 0;
    width: 100%;
    text-align: center;
    color: #838f9d;
    font-size: 16px;
    // padding-top: 6.85vh;
    p {
      margin-bottom: 10px;
    }
    .login__footer {
      margin-top: 20px;
      font-size: 14px;
    }
  }
}
</style>
