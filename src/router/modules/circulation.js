/*
 * @Description: 流通模块路由
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2019-12-13 15:30:24
 */

import Layout from "views/layout/Layout";

const circulationRouter = [
  {
    path: "/circulation/wxlt",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_wxlt",
    meta: {
      title: "文献流通",
      icon: "icon-wenxianliutong",
      functionId: "d4d26a7227184c06963e66a7f15bca1b"
    },
    children: [
      {
        path: "jhgl",
        meta: {
          title: "借还管理",
          functionId: "0b8b3cde7df84d009acbd7d277ae6ac6"
        },
        name: "cir_jhgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/jhgl")
      },
      {
        path: "dsgl",
        meta: {
          title: "丢失管理",
          functionId: "038611719b5949a68f64eb72162e5f76"
        },
        name: "cir_dsgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/dsgl")
      },
      {
        path: "yqcl",
        meta: {
          title: "延期处理",
          functionId: "8aa86dce517f41f6aef3d4bc62416355"
        },
        name: "cir_yqcl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/yqcl")
      },
      {
        path: "yygl",
        meta: {
          title: "预约管理",
          functionId: "1258a2ef26244ce8a76ddbc8f7f8a8c8"
        },
        name: "cir_yygl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/yygl")
      },
      {
        path: "cqgl",
        meta: {
          title: "超期管理",
          functionId: "8ba0b36849c543a9aa302332814015fe"
        },
        name: "cir_cqgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/cqgl")
      },
      {
        path: "wscl",
        meta: {
          title: "污损处理",
          functionId: "3ecf17bbe6654dd6979b1d1a238c066e"
        },
        name: "cir_wscl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/wscl")
      },
      {
        path: "fkgl",
        meta: {
          title: "罚款管理",
          functionId: "85dcc0dea0c74de88d1ab56f537f6338"
        },
        name: "cir_fkgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/fkgl")
      },
      {
        path: "chtz",
        meta: {
          title: "催还通知",
          functionId: "8113770bb3e44ed99f705de0e85df94b"
        },
        name: "cir_chtz",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/chtz")
      },
      {
        path: "cjcl",
        meta: {
          title: "超借处理",
          functionId: "89365eb3803f40fc9e794c486f20ae0a"
        },
        name: "cir_cjcl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/wxlt/cjcl")
      }
    ]
  },
  {
    path: "/circulation/ltwh",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_ltwh",
    meta: {
      title: "流通维护",
      icon: "icon-wenxianliutong",
      functionId: "353dc02c55ec4aaf9a34d6fd9ded535e"
    },
    children: [
      {
        path: "ltwh",
        meta: {
          title: "流通维护",
          functionId: "900233e553ff4e6db2158ff4a03fd8bf"
        },
        name: "cir_ltwh",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltwh/ltwh")
      }
    ]
  },
  {
    path: "/circulation/dzgl",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_dzgl",
    meta: {
      title: "读者管理",
      icon: "icon-duzheguanli",
      functionId: "ecbdce4b946d4a6c996169b0d738c9d5"
    },
    children: [
      {
        path: "dzgl",
        meta: {
          title: "读者管理",
          functionId: "a76959a559674918ae6377a5e4cc5c46"
        },
        name: "cir_dzgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzgl")
      },
      {
        path: "dzpdr",
        meta: {
          title: "读者批导入",
          functionId: "e991e77cc9ca45a3a06be41efa483189"
        },
        name: "cir_dzpdr",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzpdr")
      },
      {
        path: "dzzppdr",
        meta: {
          title: "读者照片批导入",
          functionId: "17e47ec787a4497786b7a34208820b8e"
        },
        name: "cir_dzzppdr",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzzppdr")
      },
      {
        path: "ljydzqd",
        meta: {
          title: "读者借阅情况",
          functionId: "034b39223e8a464da381fa383c861de5"
        },
        name: "cir_ljydzqd",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/ljydzqd")
      },
      {
        path: "dzjypg",
        meta: {
          title: "读者借阅评估",
          functionId: "ba1c4150d30144519166a26477ec1d55"
        },
        name: "cir_dzjypg",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/dzgl/dzjypg")
      }
    ]
  },
  {
    path: "/circulation/cjglls",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_cjgl",
    meta: {
      title: "财经管理",
      icon: "icon-caijingguanli",
      functionId: "1a64fc93feae4779acdc37d83c925353"
    },
    children: [
      {
        path: "cjglls",
        meta: {
          title: "财经历史查询",
          functionId: "730ea23d44b640cbb6bcd746324479b6"
        },
        name: "cir_cjgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/cjgl/cjglls")
      }
    ]
  },
  {
    path: "/circulation/lttj",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_lttj",
    meta: {
      title: "流通统计",
      icon: "icon-liutongtongji",
      functionId: "677a7499652e4bf59b176f0cdfbe9452"
    },
    children: [
      {
        path: "lttj",
        meta: {
          title: "流通统计",
          functionId: "c7fa040ec02a4cd385e1e9678d3b31e7"
        },
        name: "cir_lttj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/lttj")
      },
      {
        path: "dzjyphb",
        meta: {
          title: "读者借阅排行榜",
          functionId: "c90e9d8ad1904726ade9e8a86f745777"
        },
        name: "cir_dzjyphb",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzjyphb")
      },
      {
        path: "dzjhtj",
        meta: {
          title: "读者借还统计",
          functionId: "afdfed2858e44bbdaeead22e352b68c9"
        },
        name: "cir_dzjhtj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzjhtj")
      },
      {
        path: "wxjyphb",
        meta: {
          title: "文献借阅排行榜",
          functionId: "77351ba673904dcc9c753c5a34a088cd"
        },
        name: "cir_wxjyphb",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/wxjyphb")
      },
      {
        path: "wxjhtj",
        meta: {
          title: "文献借还统计",
          functionId: "9c4f896412a8479ca4b8edb56757075f"
        },
        name: "cir_wxjhtj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/wxjhtj")
      },
      {
        path: "dzlxjhtj",
        meta: {
          title: "读者类型借还统计",
          functionId: "1aca2bdee06340dbb03580d3eef0790b"
        },
        name: "cir_dzlxjhtj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzlxjhtj")
      },
      {
        path: "dzdwjhtj",
        meta: {
          title: "读者单位借还统计",
          functionId: "9f218c90efb849f5b44167d008af321c"
        },
        name: "cir_dzdwjhtj",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/dzdwjhtj")
      },
      {
        path: "ljysmqd",
        meta: {
          title: "书目借阅情况",
          functionId: "b37fa0ec285e43358882c2ccac1679f3"
        },
        name: "cir_ljysmqd",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/lttj/ljysmqd")
      }
    ]
  },
  {
    path: "/circulation/ltcx",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_ltcx",
    meta: {
      title: "流通查询",
      icon: "icon-liutongchaxun",
      functionId: "85e9f95dfc504610944d280504eff45c"
    },
    children: [
      {
        path: "dzdqjycx",
        meta: {
          title: "读者当前借阅查询",
          functionId: "0d1ef7c3b30b4370969da62cd75755df"
        },
        name: "cir_dzdqjycx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/dzdqjycx")
      },
      {
        path: "dzjylscx",
        meta: {
          title: "读者历史借阅查询",
          functionId: "adfc6e7b79764df48eff8758c44bd792"
        },
        name: "cir_dzjylscx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/dzjylscx")
      },
      {
        path: "wxdqjycx",
        meta: {
          title: "文献当前借阅查询",
          functionId: "1f01f7c52aad4d6e8353e834633bb51b"
        },
        name: "cir_wxdqjycx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/wxdqjycx")
      },
      {
        path: "wxjylscx",
        meta: {
          title: "文献历史借阅查询",
          functionId: "27d76d7cbe624b9b9157939e470c776c"
        },
        name: "cir_wxjylscx",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ltcx/wxjylscx")
      }
    ]
  },
  {
    path: "/circulation/ylsgl",
    component: Layout,
    redirect: "noredirect",
    name: "circulation_ylsgl",
    meta: {
      title: "阅览室管理",
      icon: "icon-liutongchaxun",
      functionId: "0aaeff8cabf549b4a3d4730ec20f9228"
    },
    children: [
      {
        path: "ylsgl",
        meta: {
          title: "阅览室管理",
          functionId: "587e140cb3f44dc3981b05b9d48768ef",
          hide: false
        },
        name: "cir_ylsgl",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ylsgl/ylsgl")
      },
      {
        path: "ylsxq",
        meta: {
          title: "阅览室详情",
          functionId: "61dc912a36164b9d87bac373a7c520c0",
          hide: false
        },
        name: "cir_ylsxq",
        component: () =>
          import(/* webpackChunkName: 'circulation' */ "views/circulation/ylsgl/ylsxq")
      }
    ]
  }
];

export default circulationRouter;
