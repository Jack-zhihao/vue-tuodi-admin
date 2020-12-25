/*
 * @Description: 极简模式
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:21
 * @LastEditors  : chenming.feng
 * @LastEditTime : 2020-01-13 15:08:35
 */

import Layout from "views/layout/SimpleLayout"; // 这里采用 Layout 是为了脚本能够顺利处理，注意同一个文件不要和另外一个 Layout 混淆使用

const simpleRouter = [
  {
    path: "/simple",
    component: Layout,
    redirect: "noredirect",
    name: "simple",
    meta: { title: "极简模式", icon: "" },
    children: [
      {
        path: "menu",
        meta: { title: "极简菜单", hide: true },
        name: "simple_menu",
        component: () =>
          import(/* webpackChunkName: 'base' */ "views/simple/menu")
      },
      {
        path: "jhgl",
        meta: { title: "借还管理", hide: true },
        name: "simple_jhgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/jhgl")
      },
      {
        path: "xzbm",
        meta: { title: "新增书目", hide: true },
        name: "simple_xzbm",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/xzbm")
      },
      {
        path: "dzgl",
        meta: { title: "读者管理", hide: true },
        name: "simple_dzgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzgl")
      },
      {
        path: "dzpdr",
        meta: { title: "读者批导入", hide: true },
        name: "simple_dzpdr",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzpdr")
      },
      {
        path: "gcsmqd",
        name: "simple_gcsmqd",
        meta: { title: "馆藏书目清单", hide: true },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/gcsmqd")
      },
      {
        path: "dcqd",
        name: "simple_dcqd",
        meta: { title: "典藏清单", hide: true },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/dcqd")
      },
      {
        path: "dzjylscx",
        meta: { title: "读者历史借阅查询", hide: true },
        name: "simple_dzjylscx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/dzjylscx")
      },
      {
        path: "wxjylscx",
        meta: { title: "文献历史借阅查询", hide: true },
        name: "simple_wxjylscx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/wxjylscx")
      },
      {
        path: "dzjhtj",
        meta: { title: "读者借还统计", hide: true },
        name: "simple_dzjhtj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzjhtj")
      },
      {
        path: "dzjyphb",
        meta: { title: "读者借阅排行榜", hide: true },
        name: "simple_dzjyphb",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzjyphb")
      },
      {
        path: "wxjyphb",
        meta: { title: "文献借阅排行榜", hide: true },
        name: "simple_wxjyphb",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/wxjyphb")
      }
    ]
  }
];

export default simpleRouter;
