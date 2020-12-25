/*
 * @Description: 采访模块路由
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-05 14:33:46
 */

import Layout from "views/layout/Layout";

const acquisitionRouter = [
  {
    path: "/acquisition/tsydgl",
    component: Layout,
    redirect: "noredirect",
    name: "acquisition_tsydgl",
    meta: {
      title: "图书预订管理",
      icon: "icon-zhengdingguanli",
      functionId: "5c69f058c0c749d38cb522024bf7fc2c"
    },
    children: [
      {
        path: "zdsmyd",
        meta: {
          title: "征订书目预订",
          functionId: "f5baac23f66648a9833507f5c3de5481"
        },
        name: "acq_zdsmyd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/zdsmyd")
      },
      {
        path: "zdsmlb",
        meta: { title: "征订书目列表", hide: true },
        name: "acq_zdsmlb",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/zdsmlb")
      },
      {
        path: "smyd",
        meta: { title: "书目预订", hide: true },
        name: "acq_smyd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/smyd")
      },
      {
        path: "zjyd",
        meta: {
          title: "直接预订",
          functionId: "f3cc8791276b471a880c30f902705695"
        },
        name: "acq_zjyd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/zjyd")
      },
      {
        path: "yddgl",
        meta: {
          title: "预订单管理",
          functionId: "1d653a5d66d946f298f68db5fd20a6c9"
        },
        name: "acq_yddgl",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/yddgl")
      },
      {
        path: "tstj",
        meta: {
          title: "图书推荐",
          functionId: "e7294e41f5e54c19a7ad005540e23b36"
        },
        name: "acq_tstj",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/tstj")
      },
      {
        path: "tstjBookItem",
        meta: { title: "书目信息", hide: true },
        name: "acq_tstjBookItem",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/tstjBookItem")
      },
      {
        path: "dzjg",
        meta: {
          title: "读者荐购",
          functionId: "f930cf0fb8684cee8af66967a3b49f91"
        },
        name: "acq_dzjg",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/dzjg")
      },
      {
        path: "yddxq",
        meta: { title: "预订单详情", hide: true },
        name: "acq_yddxq",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/yddxq")
      },
      {
        path: "cqxx",
        meta: { title: "催缺信息", hide: true },
        name: "acq_cqxx",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsydgl/cqxx")
      }
    ]
  },
  {
    path: "/acquisition/tsysgl",
    component: Layout,
    redirect: "noredirect",
    name: "acquisition_tsysgl",
    meta: {
      title: "图书验收管理",
      icon: "icon-yanshouguanli",
      functionId: "65e6e95ea5d54b2d9ff551819b7c2ae5"
    },
    children: [
      {
        path: "ydys",
        meta: {
          title: "预订验收",
          functionId: "11612734ef2e4c70acca8cff77068df0"
        },
        name: "acq_ydys",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsysgl/ydys")
      },
      {
        path: "zjys",
        meta: {
          title: "直接验收",
          functionId: "38c4dcc636a14249b18c43eacb83b7c7"
        },
        name: "acq_zjys",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsysgl/zjys")
      },
      {
        path: "ysdgl",
        meta: {
          title: "验收单管理",
          functionId: "ac4359d9dcbb49eeba5149cefcc525b6"
        },
        name: "acq_ysdgl",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsysgl/ysdgl")
      },
      {
        path: "ysdxq",
        meta: { title: "验收单详情", hide: true },
        name: "acq_ysdxq",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsysgl/ysdxq")
      },
      {
        path: "smys",
        meta: { title: "书目验收", hide: true },
        name: "acq_smys",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/tsysgl/smys")
      }
    ]
  },
  {
    path: "/acquisition/cfbb",
    component: Layout,
    redirect: "noredirect",
    name: "acquisition_cfbb",
    meta: {
      title: "采访报表",
      icon: "icon-caifangbaobiao",
      functionId: "edafc8468f99452295556f44c1016c81"
    },
    children: [
      {
        path: "dgd",
        meta: {
          title: "订购单",
          functionId: "6007e8bf4ae846b5953f79f54292f255"
        },
        name: "acq_dgd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cfbb/dgd")
      },
      {
        path: "tdd",
        meta: {
          title: "退订单",
          functionId: "6ec519204f164fe78ae5409da5b1d2ae"
        },
        name: "acq_tdd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cfbb/tdd")
      },
      {
        path: "ysd",
        meta: {
          title: "验收单",
          functionId: "5a40fc31485d41d7aaa9bf6d19941edb"
        },
        name: "acq_ysd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cfbb/ysd")
      },
      {
        path: "cqd",
        meta: {
          title: "催缺单",
          functionId: "90209a7cb3a0424a8d9f0b523eff3540"
        },
        name: "acq_cqd",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cfbb/cqd")
      }
    ]
  },
  {
    path: "/acquisition/cftj",
    component: Layout,
    redirect: "noredirect",
    name: "acquisition_cftj",
    meta: {
      title: "采访统计",
      icon: "icon-liutongtongji",
      functionId: "17d5575f6c594720acbd13a0bb2877c5"
    },
    children: [
      {
        path: "gbccz",
        meta: {
          title: "个别财产账",
          functionId: "a45c0a7b3d8f4517adab20a3f1bc139f"
        },
        name: "acq_gbccz",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cftj/gbccz")
      },
      {
        path: "zkccz",
        meta: {
          title: "总括财产账",
          functionId: "5eaa40e0f74d429eb96d231df23cd1bd"
        },
        name: "acq_zkccz",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cftj/zkccz")
      },
      {
        path: "ydfltj",
        meta: {
          title: "预订分类统计",
          functionId: "6b995cf5795843569a27753a8d9582d6"
        },
        name: "acq_ydfltj",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cftj/ydfltj")
      },
      {
        path: "ysfltj",
        meta: {
          title: "验收分类统计",
          functionId: "5a89e05760e441b3816cb9e9d48f7472"
        },
        name: "acq_ysfltj",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cftj/ysfltj")
      }
    ]
  },
  {
    path: "/acquisition/cbcs",
    component: Layout,
    meta: {
      title: "采编参数",
      icon: "icon-zhengdingguanli",
      functionId: "f0c40df7f6464f17823b01676aa8520b"
    },
    name: "acquisition_cbcs",
    redirect: "noredirect",
    children: [
      {
        path: "zchgl",
        name: "acq_zchgl",
        meta: {
          title: "种次号管理",
          functionId: "eb6f09b751ca486795bd23de352194d5"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cbcs/zchgl")
      },
      {
        path: "ztcgl",
        name: "acq_ztcgl",
        meta: {
          title: "主题词管理",
          functionId: "0ca92174f20d407ea7246ad926a6addc"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/cbcs/ztcgl")
      }
    ]
  },
  {
    path: "/acquisition/ydgl",
    component: Layout,
    redirect: "noredirect",
    name: "acquisition_ydgl",
    hidden: true,
    meta: { title: "预订管理", icon: "el-icon-menu" },
    children: [
      {
        path: "ydgl",
        meta: { title: "预订管理" },
        name: "acq_ydgl",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/ydgl/ydgl")
      },
      {
        path: "ydpcgl",
        meta: { title: "预订批次管理" },
        name: "acq_ydpcgl",
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/ydgl/ydpcgl")
      }
    ]
  },
  {
    path: "/acquisition/zdgl",
    component: Layout,
    meta: { title: "征订管理", icon: "el-icon-menu" },
    hidden: true,
    name: "acquisition_zdgl",
    redirect: "noredirect",
    children: [
      {
        path: "zdpcgl",
        name: "acq_zdpcgl",
        meta: { title: "预订批次管理" },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/zdgl/zdpcgl")
      },
      {
        path: "zdmlgl",
        name: "acq_zdmlgl",
        meta: { title: "预订目录管理" },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/zdgl/zdmlgl")
      }
    ]
  },
  {
    path: "/acquisition/jcydgl",
    component: Layout,
    meta: {
      title: "教材预订管理",
      icon: "icon-zhengdingguanli",
      functionId: "d752ca86265f4315a6ce883b9ac0d519"
    },
    name: "acquisition_jcydgl",
    redirect: "noredirect",
    children: [
      {
        path: "jcydd",
        name: "acq_jcydd",
        meta: {
          title: "教材预订单",
          functionId: "8d0e00e072e64436ab439873561277b2"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcydgl/jcydd")
      },
      {
        path: "jcyddxq",
        name: "acq_jcyddxq",
        meta: { title: "教材预订单详情", hide: true },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcydgl/jcyddxq")
      },
      {
        path: "jcyd",
        name: "acq_jcyd",
        meta: {
          title: "教材预订",
          functionId: "30e0910df05f49bbbf3e7605de4d964a"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcydgl/jcyd")
      },
      {
        path: "jcydxq",
        name: "acq_jcydxq",
        meta: { title: "教材预订详情", hide: true },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcydgl/jcydxq")
      }
    ]
  },
  {
    path: "/acquisition/jcysgl",
    component: Layout,
    meta: {
      title: "教材验收管理",
      icon: "icon-yanshouguanli",
      functionId: "eeff8cb3f84945cbb8243d97f0241b69"
    },
    name: "acquisition_jcysgl",
    redirect: "noredirect",
    children: [
      {
        path: "jcysd",
        name: "acq_jcysd",
        meta: {
          title: "教材验收单",
          functionId: "57d8a29130264e54b197f02cbb8ac896"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcysgl/jcysd")
      },
      {
        path: "jcysdxq",
        name: "acq_jcysdxq",
        meta: { title: "教材验收单详情", hide: true },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcysgl/jcysdxq")
      },
      {
        path: "jcydys",
        name: "acq_jcydys",
        meta: { title: "教材预订验收" },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcysgl/jcydys")
      },
      {
        path: "jcsmys",
        name: "acq_jcsmys",
        meta: { title: "教材书目验收", hide: true },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/jcysgl/jcsmys")
      }
    ]
  },
  {
    path: "/acquisition/zjgl",
    component: Layout,
    meta: {
      title: "资金管理",
      icon: "icon-caijingguanli",
      functionId: "5ae8f1a8b2bf45468906a1bc5ea2b3ca"
    },
    name: "acquisition_zjgl",
    redirect: "noredirect",
    children: [
      {
        path: "zjgl",
        name: "acq_zjgl",
        meta: {
          title: "资金管理",
          functionId: "d2c7ba36648e41c1bba150d4b246a5be"
        },
        component: () =>
          import(/* webpackChunkName: 'acquisition' */ "views/acquisition/zjgl/zjgl")
      }
    ]
  }
];

export default acquisitionRouter;
