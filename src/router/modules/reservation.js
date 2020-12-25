/*
 * @Description: 典藏模块路由
 * @Autor: chenming.feng
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 09:37:47
 */
import Layout from "views/layout/Layout";

const reservationRouter = [
  {
    path: "/reservation/dcgl",
    component: Layout,
    redirect: "noredirect",
    name: "reservation_dcgl",
    meta: {
      title: "典藏管理",
      icon: "icon-diancangguanli",
      functionId: "98e8c648932c40f0a6439305a5019ccf"
    },
    children: [
      {
        path: "rcdj",
        name: "res_rcdj",
        meta: {
          title: "入藏登记",
          functionId: "e2348a3f098745c3bf256408400f23de"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/rcdj")
      },
      {
        path: "rcpdj",
        name: "res_rcpdj",
        meta: {
          title: "入藏批登记",
          functionId: "15049f3c05074b19a4311123d57596e2"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/rcpdj")
      },
      {
        path: "gcztcl",
        name: "res_gcztcl",
        meta: {
          title: "馆藏状态处理",
          functionId: "63b75ea4a01742b59acc2a1768d790d8"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/gcztcl")
      },
      {
        path: "gcztpcl",
        name: "res_gcztpcl",
        meta: {
          title: "馆藏状态批处理",
          functionId: "5a203fe773c847db94cb30a1dd19986d"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/gcztpcl")
      },
      {
        path: "czbg",
        name: "res_czbg",
        meta: {
          title: "藏址变更",
          functionId: "21b3d099fb4f44ecb5a71f47ef77fb57"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/czbg")
      },
      {
        path: "czpbg",
        name: "res_czpbg",
        meta: {
          title: "藏址批变更",
          functionId: "efcf3e2c8bf14843b3a7b0ec9d74c0db"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/czpbg")
      },
      {
        path: "tmgh",
        name: "res_tmgh",
        meta: {
          title: "条码更换",
          functionId: "8790fa7584894f5fbf3b56b695f868ae"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dcgl/tmgh")
      }
    ]
  },
  {
    path: "/reservation/qdhtc",
    component: Layout,
    redirect: "noredirect",
    name: "reservation_qdhtc",
    meta: {
      title: "清点和剔除",
      icon: "icon-qingdianhetichu",
      functionId: "aaf8c61524b94287b383140d02ead628"
    },
    children: [
      {
        path: "csqd",
        name: "res_csqd",
        meta: {
          title: "藏书清点",
          functionId: "b909c3957faa407bba64d5c72dcf8f0a"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/qdhtc/csqd")
      },
      {
        path: "cspqd",
        name: "res_cspqd",
        meta: {
          title: "藏书批清点",
          functionId: "ed3d9b4acc4f45dd8667b9d23b5bf6c1"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/qdhtc/cspqd")
      },
      {
        path: "qdcl",
        name: "res_qdcl",
        meta: {
          title: "清点处理",
          functionId: "e6cf78569f9f4c1ca08fe6193788f2ab"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/qdhtc/qdcl")
      },
      {
        path: "gctc",
        name: "res_gctc",
        meta: {
          title: "馆藏剔除",
          functionId: "5281f2370fee4a5f886a6622515ac621"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/qdhtc/gctc")
      },
      {
        path: "gcptc",
        name: "res_gcptc",
        meta: {
          title: "馆藏批剔除",
          functionId: "ad51b3163c7c4a4ba7372ea59b84a956"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/qdhtc/gcptc")
      }
    ]
  },
  {
    path: "/reservation/pcgl",
    component: Layout,
    redirect: "noredirect",
    name: "reservation_pcgl",
    meta: {
      title: "批次管理",
      icon: "icon-piciguanli",
      functionId: "437f89f0594c42b5917d7d22890aa598"
    },
    children: [
      {
        path: "dcpc",
        name: "res_dcpc",
        meta: {
          title: "典藏批次",
          functionId: "57f8b90670ea43228924ccd549c04fe9"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/pcgl/dcpc")
      },
      {
        path: "pcqd",
        name: "res_pcqd",
        meta: {
          title: "批次清单",
          functionId: "531d208e86824ab19a5c92cde03a9629"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/pcgl/pcqd")
      }
    ]
  },
  {
    path: "/reservation/dctj",
    component: Layout,
    redirect: "noredirect",
    name: "reservation_dctj",
    meta: {
      title: "典藏统计",
      icon: "icon-liutongtongji",
      functionId: "963741348cb04e9caf3d99d39abb1a9b"
    },
    children: [
      {
        path: "dcqd",
        name: "res_dcqd",
        meta: {
          title: "典藏清单",
          functionId: "ea87dea803764e4882b2970dcc9d7c6c"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/dcqd")
      },
      {
        path: "gcfltj",
        name: "res_gcfltj",
        meta: {
          title: "馆藏分类统计",
          functionId: "46a78311b7084a689a9456fb3e44ec9b"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/gcfltj")
      },
      {
        path: "gctj",
        name: "res_gctj",
        meta: {
          title: "馆藏统计",
          functionId: "1cc62e10f5bd43fd9a416950390464ff"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/gctj")
      },
      {
        path: "gcsmqd",
        name: "res_gcsmqd",
        meta: {
          title: "馆藏书目清单",
          functionId: "19682998fc2240dcbc26c08ccdb3e27a"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/gcsmqd")
      },
      {
        path: "qcsmqd",
        name: "res_qcsmqd",
        meta: {
          title: "清查书目清单",
          functionId: "81ec663a23fb4fcf906e2ab48cb78dab"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/qcsmqd")
      },
      {
        path: "gcqctj",
        name: "res_gcqctj",
        meta: {
          title: "馆藏清查统计",
          functionId: "fe9b8346a073488bb45b6a0209e1bbd2"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/dctj/gcqctj")
      }
    ]
  },
  {
    path: "/reservation/tsqc",
    component: Layout,
    redirect: "noredirect",
    name: "reservation_tsqc",
    meta: {
      title: "图书清查",
      icon: "icon-liutongtongji",
      functionId: "7005b47aff284c6db7d88225d47b2e03"
    },
    children: [
      {
        path: "qclb",
        name: "res_qclb",
        meta: {
          title: "清查类别",
          functionId: "df8094b53be545ba9fa8e0e89bc6fe81"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/tsqc/qclb")
      },
      {
        path: "qcdj",
        name: "res_qcdj",
        meta: {
          title: "清查登记",
          functionId: "025b58510221474aa35e894d17d23638"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/tsqc/qcdj")
      },
      {
        path: "qcpdj",
        name: "res_qcpdj",
        meta: {
          title: "清查批登记",
          functionId: "ab9753a22a4548f2b7256db72953c7c1"
        },
        component: () =>
          import(/* webpackChunkName: 'reservation' */ "views/reservation/tsqc/qcpdj")
      }
    ]
  }
];

export default reservationRouter;
