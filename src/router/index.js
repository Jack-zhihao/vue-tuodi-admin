/*
 * @Description: 路由配置
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-01-21 09:19:51
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-22 09:33:11
 */
import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "views/layout/Layout";
/* Router Modules */
import acquisitionRouter from "./modules/acquisition";
import catalogueRouter from "./modules/catalogue";
import periodicalRouter from "./modules/periodical";
import reservationRouter from "./modules/reservation";
import settingRouter from "./modules/setting";
import circulationRouter from "./modules/circulation";
import dataRouter from "./modules/data";
import featureRouter from "./modules/feature";
import helpRouter from "./modules/help";
import simpleRouter from "./modules/simple";
import operationRouter from "./modules/operation";

export const constantRouterMap = [
  {
    path: "/",
    redirect: "/base/welcome",
    hidden: true
  },
  {
    path: "/base",
    component: Layout,
    children: [
      {
        path: "welcome",
        meta: {
          title: "欢迎"
        },
        name: "welcome",
        component: () => import(/* webpackChunkName: "base" */ "views/welcome")
      }
    ],
    hidden: true
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "base" */ "views/login"),
    hidden: true
  },
  {
    path: "/404",
    component: () =>
      import(/* webpackChunkName: "errorPage" */ "views/errorPage/404"),
    hidden: true
  },
  {
    path: "/401",
    component: () =>
      import(/* webpackChunkName: "errorPage" */ "views/errorPage/401"),
    hidden: true
  }
];

export default new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
});

// 异步加载的路由
export const asyncRouterMap = [
  ...acquisitionRouter,
  ...catalogueRouter,
  ...periodicalRouter,
  ...reservationRouter,
  ...circulationRouter,
  ...settingRouter,
  ...dataRouter,
  ...operationRouter,
  ...featureRouter,
  ...helpRouter,
  ...simpleRouter,
  {
    path: "*",
    redirect: "/404",
    hidden: true
  }
];
