/*
 * @Description: 设置数据路由
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-12-11 15:02:07
 */

import Layout from "views/layout/Layout";

const dataRouter = [
  {
    path: "/data/sjzl",
    component: Layout,
    redirect: "noredirect",
    name: "data_sjzl",
    meta: {
      title: "数据总览",
      icon: "icon-shujuzonglan",
      functionId: "e66d38907b1948b5901f44e47b7eea59"
    },
    children: [
      {
        path: "sjzl",
        name: "da_sjzl",
        meta: {
          title: "数据总览",
          functionId: "42650c9e0d8b4939afa1808baea570c7"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/sjzl/sjzl")
      }
    ]
  },
  {
    path: "/data/gcfx",
    component: Layout,
    redirect: "noredirect",
    name: "data_gcfx",
    meta: {
      title: "馆藏分析",
      icon: "icon-guancangfenxi",
      functionId: "b47e686d075f45ecb58be9beb81801f6"
    },
    children: [
      {
        path: "gczl",
        name: "da_gczl",
        meta: {
          title: "馆藏总览",
          functionId: "8f561127dced447fa10dd73cc2027853"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/gcfx/gczl")
      },
      {
        path: "gcfx",
        name: "da_gcfx",
        meta: {
          title: "馆藏分析",
          functionId: "96cdddd613354f90ad93919890319bd4"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/gcfx/gcfx")
      },
      {
        path: "dbqk",
        name: "da_dbqk",
        meta: {
          title: "达标情况",
          functionId: "a91e7bf0a9db4120a50eec77784dcb4f"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/gcfx/dbqk")
      }
    ]
  },
  {
    path: "/data/jyfx",
    component: Layout,
    redirect: "noredirect",
    name: "data_jyfx",
    meta: {
      title: "借阅分析",
      icon: "icon-jieyuefenxi",
      functionId: "53b45b95532e43a7ba5ecdf525603257"
    },
    children: [
      {
        path: "jyzl",
        name: "da_jyzl",
        meta: {
          title: "借阅总览",
          functionId: "710ce81cca8f4584ae87bea62bea9702"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jyfx/jyzl")
      },
      {
        path: "jyfx",
        name: "da_jyfx",
        meta: {
          title: "借阅分析",
          functionId: "073a103849014d73973e7a4907cab791"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jyfx/jyfx")
      },
      {
        path: "jyph",
        name: "da_jyph",
        meta: {
          title: "借阅排行",
          functionId: "dff600ba52e04340b5a07445bd87d68c"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jyfx/jyph")
      }
    ]
  },
  {
    path: "/data/ryfx",
    component: Layout,
    redirect: "noredirect",
    name: "data_ryfx",
    meta: {
      title: "人员分析",
      icon: "icon-renyuanfenxi",
      functionId: "b0a5aa4f7ca242039198984f5eced7cc"
    },
    children: [
      {
        path: "ryzl",
        name: "da_ryzl",
        meta: {
          title: "人员总览",
          functionId: "48f80ee488a746f28d92a5e57c6970ea"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/ryfx/ryzl")
      }
    ]
  },
  {
    path: "/data/qypz",
    component: Layout,
    redirect: "noredirect",
    name: "data_qypz",
    meta: {
      title: "区域配置",
      icon: "icon-xitongquanxian",
      functionId: "dd229f82c384496d94b100acbaf343da"
    },
    children: [
      {
        path: "qypz",
        name: "da_qypz",
        meta: {
          title: "区域配置",
          functionId: "eeae942917f047d298c14d5749798aa5"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/qypz/qypz")
      }
    ]
  },
  {
    path: "/data/sszs",
    component: Layout,
    redirect: "noredirect",
    name: "data_sszs",
    hidden: true,
    meta: { title: "搜索指数", icon: "icon-xitongquanxian" },
    children: [
      {
        path: "sszs",
        name: "da_sszs",
        meta: { title: "搜索指数" },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/sszs/sszs")
      }
    ]
  },
  {
    path: "/data/jrzl",
    component: Layout,
    redirect: "noredirect",
    name: "data_jrzl",
    meta: {
      title: "接入总览",
      icon: "icon-xitongquanxian",
      functionId: "91ce0a4d561b4ad884557a7d3730e2ef"
    },
    children: [
      {
        path: "jrzl",
        name: "jrzl_jrzl",
        meta: {
          title: "接入总览",
          functionId: "f720dc464e94467fafae901549d2baf0"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrzl/jrzl")
      }
    ]
  },
  {
    path: "/data/jrxq",
    component: Layout,
    redirect: "noredirect",
    name: "data_jrxq",
    meta: {
      title: "接入详情",
      icon: "icon-xitongquanxian",
      functionId: "ab6da2cd80f9420f96fe52ddfba2ca85"
    },
    children: [
      {
        path: "dzlx",
        name: "jrxq_dzlx",
        meta: {
          title: "读者类型",
          functionId: "25533f1e12a843e1bf750f65a4f88bfc"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/dzlx")
      },
      {
        path: "czsj",
        name: "jrxq_czsj",
        meta: {
          title: "藏址数据",
          functionId: "54f00490e4a5433eb63b9da4147d5f27"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/czsj")
      },
      {
        path: "dzsj",
        name: "jrxq_dzsj",
        meta: {
          title: "读者数据",
          functionId: "161d0c622a874dc187195364c184e4c4"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/dzsj")
      },
      {
        path: "yhsj",
        name: "jrxq_yhsj",
        meta: {
          title: "用户数据",
          functionId: "4c2bf8c716e6447c9d77fdab54f0510a"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/yhsj")
      },
      {
        path: "smsj",
        name: "jrxq_smsj",
        meta: {
          title: "书目数据",
          functionId: "7ee8585e19014ffbada5da321d7de2b8"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/smsj")
      },
      {
        path: "gcsj",
        name: "jrxq_gcsj",
        meta: {
          title: "馆藏数据",
          functionId: "290c16827f09441d9ce9f5f15588ad96"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/gcsj")
      },
      {
        path: "ltsj",
        name: "jrxq_ltsj",
        meta: {
          title: "流通数据",
          functionId: "6062bda2adf94bb0bd698c70bbedd08b"
        },
        component: () =>
          import(/* webpackChunkName: 'data' */ "views/data/jrxq/ltsj")
      }
    ]
  }
];

export default dataRouter;
