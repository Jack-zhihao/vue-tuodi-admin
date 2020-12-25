/*
 * @Description: 期刊模块路由
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 20:22:51
 */

import Layout from "views/layout/Layout";

const periodicalRouter = [
  {
    path: "/periodical/qkydgl",
    component: Layout,
    redirect: "noredirect",
    name: "periodical_qkydgl",
    meta: {
      title: "期刊预订管理",
      icon: "icon-qikanyudingguanli",
      functionId: "8007ab57beeb4921805aea4d38034af1"
    },
    children: [
      {
        path: "qkzdmlyd",
        meta: {
          title: "期刊征订目录预订",
          functionId: "56312cc4ef5a4cbbbc3e71d28facd923"
        },
        name: "per_qkzdmlyd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkydgl/qkzdmlyd")
      },
      {
        path: "qkzdmllb",
        meta: {
          hide: true,
          title: "期刊征订目录列表",
          functionId: "2fc4ae785526454080ae6db8d87cb28c"
        },
        name: "per_qkzdmllb",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkydgl/qkzdmllb")
      },
      {
        path: "qkyd",
        meta: { hide: true, title: "期刊预订" },
        name: "per_qkyd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkydgl/qkyd")
      }
    ]
  },
  {
    path: "/periodical/qkjdgl",
    component: Layout,
    redirect: "noredirect",
    name: "periodical_qkjdgl",
    meta: {
      title: "期刊记到管理",
      icon: "icon-qikanjidaoguanli",
      functionId: "7b85e3dd1fb149ecab1e68cdecccd750"
    },
    children: [
      {
        path: "qkjdcl",
        meta: { title: "期刊记到处理" },
        name: "per_qkjdcl",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkjdgl/qkjdcl")
      },
      {
        path: "zdys",
        meta: {
          title: "装订验收",
          functionId: "6ce6a2df321e432aadb9d77a55896518"
        },
        name: "per_zdys",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkjdgl/zdys")
      },
      {
        path: "zdys_collection",
        meta: { title: "装订验收-馆藏信息", hide: true },
        name: "per_zdys_collection",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkjdgl/zdys_collection")
      },
      {
        path: "hdbhs",
        meta: {
          title: "合订本回溯",
          functionId: "4700c0f95ebd4b2bb9ba0e1ab9ec765f"
        },
        name: "per_hdbhs",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkjdgl/hdbhs")
      },
      {
        path: "zdpys",
        meta: { title: "装订批移送" },
        name: "per_zdpys",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/qkjdgl/zdpys")
      }
    ]
  },
  {
    path: "/periodical/bb",
    component: Layout,
    redirect: "noredirect",
    name: "periodical_bb",
    meta: {
      title: "报表",
      icon: "icon-liutongtongji",
      functionId: "832f579104e741b9a09e4072ac59362a"
    },
    children: [
      {
        path: "dgd",
        meta: {
          title: "订购单",
          functionId: "e5e82df584344b20ab7d5a7dc22e7a63"
        },
        name: "per_dgd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/bb/dgd")
      },
      {
        path: "tdd",
        meta: {
          title: "停订单",
          functionId: "2bd6cb91e6a245b08bcb97ea8d81c16b"
        },
        name: "per_tdd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/bb/tdd")
      },
      {
        path: "jdd",
        meta: {
          title: "记到单",
          functionId: "47d19217108841b3bfa382b1f4632ff4"
        },
        name: "per_jdd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/bb/jdd")
      },
      {
        path: "zdd",
        meta: {
          title: "装订单",
          functionId: "02391d355a124969a11b9a59577e2839"
        },
        name: "per_zdd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/bb/zdd")
      },
      {
        path: "cqd",
        meta: {
          title: "催缺单",
          functionId: "f95ceb80f2b9405c8aba396ed5fd5f9b"
        },
        name: "per_cqd",
        component: () =>
          import(/* webpackChunkName: 'periodical' */ "views/periodical/bb/cqd")
      }
    ]
  }
];

export default periodicalRouter;
