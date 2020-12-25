/*
 * @Description:
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:21
 * @LastEditors: wj.liang
 * @LastEditTime: 2019-10-31 11:37:17
 */
import { loginByUsername, getUserInfo } from "api/login";
import { setToken, getToken, removeToken } from "utils/auth";

const app = {
  state: {
    token: getToken(),
    userInfo: null
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
    SET_USERINFO: (state, info) => {
      state.userInfo = info;
    }
  },
  actions: {
    // 用户名登录
    LoginByUsername({ commit }, userInfo) {
      const loginName = userInfo.loginName.trim();
      return new Promise((resolve, reject) => {
        loginByUsername(loginName, userInfo.loginPwd)
          .then(res => {
            // 登录成功后将token存储在cookie之中
            const userToken = getToken();
            // console.log(userToken);
            commit("SET_TOKEN", userToken);
            setToken(userToken);
            resolve(res);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 获取用户信息
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token)
          .then(response => {
            // 这里进行用户信息设置以及路由设置
            commit("SET_USERINFO", response.data.user);
            resolve(response.data.menuList);
          })
          .catch(error => {
            reject(error);
          });
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      localStorage.setItem("td-logout", (Math.random() * 10).toString());
      return new Promise(resolve => {
        commit("SET_TOKEN", "");
        removeToken();
        resolve();
      });
    }
  }
};
export default app;
