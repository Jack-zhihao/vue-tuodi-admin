/*
 * @Description: 运营模块路由
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-11 09:42:01
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 17:27:34
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-07 13:55:52
 */

import Layout from "views/layout/Layout";

const operationRouter = [
  {
    path: "/operation/pzyd",
    component: Layout,
    redirect: "noredirect",
    name: "operation_pzyd",
    meta: {
      title: "品质阅读",
      icon: "icon-pinzhiyuedu",
      functionId: "82dc2a4c055640a983e988e02af18622"
    },
    children: [
      {
        path: "cspz",
        meta: { title: "参数配置" },
        name: "opera_cspz",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/cspz")
      },
      {
        path: "pcqd",
        meta: {
          title: "批次清单",
          functionId: "13fb9638f04d45df9df7a111ef8d3acd"
        },
        name: "opera_pcqd",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/pcqd")
      },
      {
        path: "jsqd",
        meta: {
          title: "结算清单",
          functionId: "6bc0257ad2144b89a9135ab0f08a501d"
        },
        name: "opera_jsqd",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/jsqd")
      },
      {
        path: "jgsz",
        name: "opera_jgsz",
        meta: {
          title: "荐购设置",
          functionId: "d1c34e3749c449b787a446dd3ff4c98f"
        },
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/jgsz")
      },
      {
        path: "ysk",
        name: "opera_ysk",
        meta: {
          title: "云书库",
          functionId: "4b3fb5f1b3a449a9a8c63d0c91428935"
        },
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/ysk")
      },
      {
        path: "yts",
        meta: {
          title: "云图书",
          functionId: "33d8bfac3a0f4907869aeb01b2aa0081"
        },
        name: "opera_yts",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/yts")
      },
      {
        path: "yxssz",
        meta: {
          title: "云选书设置",
          functionId: "31ab5ca11c08495bb8382f650e77757b"
        },
        name: "opera_yxssz",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/yxssz")
      },
      {
        path: "smxx",
        meta: { title: "书目信息", hide: true },
        name: "opera_smxx",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/smxx")
      },
      {
        path: "addtao-add",
        meta: { title: "新增书目", hide: true },
        name: "opera_addtao-add",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/addtao")
      },
      {
        path: "addtao-edit",
        meta: { title: "编辑书目", isEdit: true, hide: true },
        name: "opera_addtao-edit",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/pzyd/addtao")
      }
    ]
  },
  {
    path: "/operation/hdgl",
    component: Layout,
    redirect: "noredirect",
    name: "operation_hdgl",
    meta: {
      title: "活动管理",
      icon: "icon-huodong",
      functionId: "8e7b725b488f41f785f3bc02d273c0bc"
    },
    children: [
      {
        path: "hdfb",
        meta: {
          title: "活动发布",
          functionId: "d5ba8275cb854da1929542be1e06596e"
        },
        name: "opera_hdfb",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/hdgl/hdfb")
      },
      {
        path: "hdsj",
        meta: { title: "活动数据", hide: true },
        name: "opera_hdsj",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/hdgl/hdsj")
      }
    ]
  },
  {
    path: "/operation/gggl",
    component: Layout,
    redirect: "noredirect",
    name: "operation_gggl",
    meta: {
      title: "公告管理",
      icon: "icon-gonggao",
      functionId: "681f4e4cde1e4814b2d42b30f0ca1550"
    },
    children: [
      {
        path: "xtgg",
        meta: {
          title: "系统公告",
          functionId: "3e0c3b990af64b629d1d00ffbeae9516"
        },
        name: "opera_xtgg",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/gggl/xtgg")
      },
      {
        path: "dzgg",
        meta: {
          title: "读者公告",
          functionId: "77498d0d419f48f9b493f9c84c7535aa"
        },
        name: "opera_dzgg",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/gggl/dzgg")
      }
    ]
  },
  {
    path: "/operation/tsyygl",
    component: Layout,
    redirect: "noredirect",
    name: "operation_tsyygl",
    meta: {
      title: "图书运营管理",
      icon: "icon-liutongweihu",
      functionId: "832bb5ae0a4d4762b78e3255aca4a4ce"
    },
    children: [
      {
        path: "tsczbg",
        meta: {
          title: "图书藏址变更",
          functionId: "51534e13d1824dcaa04a95f9fa4ab641"
        },
        name: "opera_tsczbg",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/tsczbg")
      },
      {
        path: "tsczcc",
        meta: {
          title: "图书藏址查重",
          functionId: "1f7c9e47d2634b258a95c3e223b64c86"
        },
        name: "opera_tsczcc",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/tsczcc")
      },
      {
        path: "pcgl",
        meta: {
          title: "批次管理",
          functionId: "",
          hide: false
        },
        name: "opera_pcgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/pcgl")
      },
      {
        path: "sjpf",
        meta: {
          title: "上架派发",
          functionId: "",
          hide: false
        },
        name: "opera_sjpf",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/sjpf")
      },
      {
        path: "xjpf",
        meta: {
          title: "下架派发",
          functionId: "",
          hide: false
        },
        name: "opera_xjpf",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/xjpf")
      },
      {
        path: "sxjqd",
        meta: {
          title: "上下架清单",
          functionId: "481aa432b1aa404b914170f948d7a78a",
          hide: false
        },
        name: "opera_sxjqd",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/sxjqd.vue")
      },
      {
        path: "tsjzgl",
        meta: {
          title: "图书捐赠管理",
          functionId: "812110936cd84f45bde72e663370c87c"
        },
        name: "opera_tsjzgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/tsjzgl")
      },
      {
        path: "dzsjqq",
        meta: {
          title: "读者上架请求",
          functionId: "7af47ec95f9541a08c25ceec5abc48fc"
        },
        name: "opera_dzsjqq",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/dzsjqq")
      },
      {
        path: "bbqd",
        meta: {
          title: "背包清单",
          functionId: "8ec4109a9fa24ed394365eaec3acf631"
        },
        name: "opera_bbqd",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/tsyygl/bbqd")
      }
    ]
  },
  {
    path: "/operation/rwyygl",
    component: Layout,
    redirect: "noredirect",
    name: "operation_khdwh",
    meta: {
      title: "任务运营管理",
      icon: "icon-liutongweihu",
      functionId: "6d2f30491ce8438dbc990baf59833236"
    },
    children: [
      {
        path: "rwdzgl",
        meta: {
          title: "任务动作管理",
          functionId: "d3842193ea6d449bb24c7f87c60cc795"
        },
        name: "opera_rwdzgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/rwyygl/rwdzgl")
      },
      {
        path: "rwgl",
        meta: {
          title: "任务管理",
          functionId: "36fe45ed35764acaacc0791c77657cdc"
        },
        name: "opera_rwgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/rwyygl/rwgl")
      },
      {
        path: "rwjhgl",
        meta: {
          title: "任务计划管理",
          functionId: "c9a94c41c93140699ae15364c7864fa7"
        },
        name: "opera_rwjhgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/rwyygl/rwjhgl")
      },
      {
        path: "rwdlb",
        meta: { title: "任务单列表", hide: true },
        name: "opera_rwdlb",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/rwyygl/rwdlb")
      }
    ]
  },
  {
    path: "/operation/yhyygl",
    component: Layout,
    redirect: "noredirect",
    name: "operation_yhyygl",
    meta: {
      title: "用户运营管理",
      icon: "icon-yonghu",
      functionId: "b026c136909b4233b0b1e7fa41eda4ca"
    },
    children: [
      {
        path: "yhtgjl",
        meta: { title: "用户推广记录" },
        name: "opera_yhtgjl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/yhyygl/yhtgjl")
      },
      {
        path: "yhlxgl",
        meta: {
          title: "用户类型管理",
          functionId: "47ba4a6d727d4a469926ec500b42dfa7"
        },
        name: "opera_yhlxgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/yhyygl/yhlxgl")
      }
    ]
  },
  {
    path: "/operation/bzyfk",
    component: Layout,
    redirect: "noredirect",
    name: "operation_bzyfk",
    meta: {
      title: "帮助与反馈",
      icon: "icon-Mbangzhu",
      functionId: "363cc5d187354e57b23d219b2c9878da"
    },
    children: [
      {
        path: "yhfkgl",
        meta: {
          title: "用户反馈管理",
          functionId: "fb0c6483d9d142d8afcc6ee77d54aa0e"
        },
        name: "opera_yhfkgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/bzyfk/yhfkgl")
      },
      {
        path: "ywbzgl",
        meta: {
          title: "疑问帮助管理",
          functionId: "e6d955c07c7646ef8bb55848ce0d9897"
        },
        name: "opera_ywbzgl",
        component: () =>
          import(/* webpackChunkName: 'operation' */ "views/operation/bzyfk/ywbzgl")
      }
    ]
  }
];

export default operationRouter;
