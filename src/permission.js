/*
 * @Description:
 * @Autor: chenming.feng
 * @Date: 2019-01-21 10:12:43
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-12-23 14:05:01
 */

import router from "./router";
import store from "./store";
import { getToken, removeToken } from "utils/auth";

// 进入页面执行
// 记录当前时间并转成时间戳
const now = new Date().getTime();
// 从缓存中获取用户上次退出的时间戳
const leaveTime = parseInt(localStorage.getItem("td-leaveTime"), 10);
// 判断是否为刷新，两次间隔在60s内判定为刷新操作
const refresh = now - leaveTime <= 1000 * 60;
// 重新登录
if (!refresh) {
  removeToken();
}

const whiteList = ["/login"]; // no redirect whitelist

router.beforeEach((to, from, next) => {
  if (getToken()) {
    if (to.path === "/login") {
      // 如果已经有cookie
      next({
        path: "/"
      });
    } else {
      // 获取馆列表
      if (!store.getters.libList) {
        store.dispatch("GetLibList");
      }
      // 获取证件类型 - 证书
      if (!store.getters.certTypeList) {
        store.dispatch("GetCertTypes");
      }
      // 获取证件类型 - 学历
      if (!store.getters.eduTypeList) {
        store.dispatch("GetEduTypes");
      }

      if (store.getters.userInfo) {
        // 刷新的时候判断进入什么模式
        if (
          store.getters.userInfo.mode === "1" &&
          to.name === "welcome" &&
          from.path === "/"
        ) {
          next({
            name: "simple_menu"
          });
        } else {
          next();
        }
      } else {
        // 拉取用户信息
        store
          .dispatch("GetUserInfo")
          .then(menuList => {
            store
              .dispatch("GenerateRoutes", {
                menuList
              })
              .then(() => {
                // 动态添加可访问路由表
                router.addRoutes(store.getters.addRouters);
                // hack方法 确保addRoutes已完成
                next({
                  ...to,
                  replace: true
                });
              });
          })
          .catch(() => {
            store.dispatch("FedLogOut").then(() => {
              next({
                path: "/"
              });
            });
          });
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next();
    } else {
      next({
        path: "/login"
      });
    }
  }
});
