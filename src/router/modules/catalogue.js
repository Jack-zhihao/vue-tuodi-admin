// 编目模块路由
import Layout from "views/layout/Layout";

const catalogueRouter = [
  {
    path: "/catalogue/wxbm",
    component: Layout,
    redirect: "noredirect",
    name: "catalogue_wxbm",
    meta: {
      title: "文献编目",
      icon: "icon-wenxianbianmu",
      functionId: "4bbac9bec09644dab66c43a9eb0aaa1f"
    },
    children: [
      {
        path: "bmgl",
        meta: {
          title: "编目管理",
          functionId: "e8d8dce152a242829710d80a750e08ce"
        },
        name: "cat_bmgl",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/bmgl")
      },
      {
        path: "llbm",
        meta: {
          title: "浏览编目",
          functionId: "a56668898c334fc3998fd6fe548060f2"
        },
        name: "cat_llbm",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/llbm")
      },
      {
        path: "zjbm",
        meta: {
          title: "直接编目",
          functionId: "7479ef129c644c69acb404201702c1af"
        },
        name: "cat_zjbm",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/zjbm")
      },
      {
        path: "hsjk",
        meta: {
          title: "回溯建库",
          functionId: "4034b7ddeced49ab9e3d51acc7bb86b5"
        },
        name: "cat_hsjk",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/hsjk")
      },
      {
        path: "xzbmedit",
        meta: { title: "新增书目-编辑", hide: true },
        name: "cat_xzbmedit",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/xzbmedit")
      },
      {
        path: "plbjgc",
        meta: { title: "批量编辑馆藏", hide: true },
        name: "cat_plbjgc",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/plbjgc")
      },
      {
        path: "xzbm",
        meta: { title: "新增书目", hide: true },
        name: "cat_xzbm",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/xzbm")
      },
      {
        path: "bm",
        meta: { title: "编目", hide: true },
        name: "cat_bm",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/bm")
      },
      {
        path: "cc",
        meta: { title: "查重", hide: true },
        name: "cat_cc",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxbm/cc")
      }
    ]
  },
  {
    path: "/catalogue/wxys",
    component: Layout,
    redirect: "noredirect",
    name: "catalogue_wxys",
    meta: {
      title: "文献移送",
      icon: "icon-wenjianyisong",
      functionId: "22c200e948ce4b5b962ba64f767cfea9"
    },
    children: [
      {
        path: "yscl",
        meta: {
          title: "移送处理",
          functionId: "837474475bb34a4aabc77db9b000dd5c"
        },
        name: "cat_yscl",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/wxys/yscl")
      }
    ]
  },
  {
    path: "/catalogue/bmtj",
    component: Layout,
    redirect: "noredirect",
    name: "catalogue_bmtj",
    meta: {
      title: "编目统计",
      icon: "icon-liutongtongji",
      functionId: "ffe49598aaec4b918b853620cd999fd2"
    },
    children: [
      {
        path: "bmtj",
        meta: {
          title: "编目统计",
          functionId: "655cdf18ddb2424dbcbcfe51d208b799"
        },
        name: "cat_bmtj",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/bmtj/bmtj")
      },
      {
        path: "sbdy",
        meta: {
          title: "书标打印",
          functionId: "7e8a97b313214aeca2040aba18840bee"
        },
        name: "cat_sbdy",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/bmtj/sbdy")
      },
      {
        path: "pcgl",
        meta: {
          title: "批次管理",
          functionId: "ff4d4bd2335347f090c5394606e27b4b"
        },
        name: "cat_pcgl",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/bmtj/pcgl")
      }
    ]
  },
  {
    path: "/catalogue/sjcl",
    component: Layout,
    redirect: "noredirect",
    name: "catalogue_sjcl",
    meta: {
      title: "数据处理",
      icon: "icon-liutongtongji",
      functionId: "dec1149a34fa4a9b897aab01b130ec40"
    },
    children: [
      {
        path: "gcsmdr",
        meta: {
          title: "馆藏书目导入",
          functionId: "3f7d743d5d3a406ebb6224197154b2fc"
        },
        name: "cat_gcsmdr",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/sjcl/gcsmdr")
      },
      {
        path: "gcsmdrlb",
        meta: { title: "馆藏书目导入列表", hide: true },
        name: "cat_gcsmdrlb",
        component: () =>
          import(/* webpackChunkName: 'catalogue' */ "views/catalogue/sjcl/gcsmdrlb")
      }
    ]
  }
];

export default catalogueRouter;
