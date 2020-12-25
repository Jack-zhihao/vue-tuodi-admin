/*
 * @Description: 设置模块路由
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-18 11:08:49
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-10 19:10:46
 */

import Layout from "views/layout/Layout";

const settingRouter = [
  {
    path: "/setting/xtqx",
    component: Layout,
    redirect: "noredirect",
    name: "setting_xtqx",
    meta: {
      title: "系统权限",
      icon: "icon-xitongquanxian",
      functionId: "64d16d04c9c144879540e306ae86dcd7"
    },
    children: [
      {
        path: "yhgl",
        name: "set_yhgl",
        meta: {
          title: "用户管理",
          functionId: "344b20e82abb48a59905065073e24f3c"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtqx/yhgl")
      },
      {
        path: "jsgl",
        name: "set_jsgl",
        meta: {
          title: "角色管理",
          functionId: "238fa30994864d2a8e4f58f3e5b5aec2"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtqx/jsgl")
      },
      {
        path: "cdgl",
        name: "set_cdgl",
        meta: {
          title: "菜单管理",
          functionId: "1794afebd6e8464a9053129ad0877565"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtqx/cdgl")
      }
    ]
  },
  {
    path: "/setting/xtcs",
    component: Layout,
    redirect: "noredirect",
    name: "setting_xtcs",
    meta: {
      title: "系统参数",
      icon: "icon-xitongcanshu",
      functionId: "6d6b2b8350df4822b71257722e7cf3af"
    },
    children: [
      {
        path: "cyg",
        name: "set_cyg",
        meta: {
          title: "成员馆",
          functionId: "e50bc477cc2446debe5fc11480574cc1"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/cyg")
      },
      {
        path: "gys",
        name: "set_gys",
        meta: {
          title: "供应商",
          functionId: "c826c20345d34bdcbab31bc83c5e95ec"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/gys")
      },
      {
        path: "cbs",
        name: "set_cbs",
        meta: {
          title: "出版社",
          functionId: "8ba2cbd5b23840bca946e9fe0fc47790"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/cbs")
      },
      {
        path: "hbhl",
        name: "set_hbhl",
        meta: {
          title: "货币汇率",
          functionId: "fc36178a5bd044a59d36b7a87038841a"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/hbhl")
      },
      {
        path: "ysgl",
        name: "set_ysgl",
        meta: {
          title: "预算管理",
          functionId: "b82a353c4bc440c3b7fdeb9254aaa381"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/ysgl")
      },
      {
        path: "czgl",
        name: "set_czgl",
        meta: {
          title: "藏址管理",
          functionId: "379c32e05bb94d6a83e9a0e648d11b82"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/czgl")
      },
      {
        path: "yslx",
        name: "set_yslx",
        meta: {
          title: "预算类型",
          functionId: "33c4a708ada74e278e485ccd06d4e345"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/yslx")
      },
      {
        path: "ipgl",
        name: "set_ipgl",
        meta: {
          title: "IP管理",
          functionId: "d75124eb6c904aacbc90edde5500d541"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtcs/ipgl")
      }
    ]
  },
  {
    path: "/setting/jdgscs",
    component: Layout,
    redirect: "noredirect",
    name: "setting_jdgscs",
    meta: {
      title: "机读格式参数",
      icon: "icon-jidugeshicanshu",
      functionId: "2c5462e6020a45c1b397e1a8a06b1497"
    },
    children: [
      {
        path: "wxlx",
        name: "set_wxlx",
        meta: {
          title: "文献类型",
          functionId: "1eb1cd5d1ea843789f5fc38df7d9bf5f"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/wxlx")
      },
      {
        path: "marclx",
        name: "set_marclx",
        meta: {
          title: "MARC类型",
          functionId: "057e25cbf6b94e3e841f6b16853949af"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/marclx")
      },
      {
        path: "marctm",
        name: "set_marctm",
        meta: {
          title: "MARC条目",
          functionId: "8b0afc1c832047f5b511313487df7602"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/marctm")
      },
      {
        path: "fblx",
        name: "set_fblx",
        meta: {
          title: "分编类型",
          functionId: "00d58c49d00b4c1b9fe16055bc45197a"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/fblx")
      },
      {
        path: "marcmb",
        name: "set_marcmb",
        meta: {
          title: "MARC模板",
          functionId: "27f4a770fc084b46a7da473e8b481c12"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/marcmb")
      },
      // {
      //   path: "marcbz",
      //   name: "set_marcbz",
      //   meta: { title: "MARC帮助" },
      //   hidden: true,
      //   component: () =>
      //     import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/marcbz")
      // },
      {
        path: "marcgc",
        name: "set_marcgc",
        meta: {
          title: "MARC馆藏",
          functionId: "26ab4e6899f64ec2a3d5565e5dd000cc"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/marcgc")
      },
      {
        path: "zdmbpz",
        name: "set_zdmbpz",
        meta: {
          title: "字段模板配置",
          functionId: "0d080c9cf1cf486d8273821caafce421"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/zdmbpz")
      },
      {
        path: "zdbz",
        name: "set_zdbz",
        meta: {
          title: "字段帮助",
          functionId: "",
          hide: true
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/jdgscs/zdbz")
      }
    ]
  },
  {
    path: "/setting/ltcs",
    component: Layout,
    redirect: "noredirect",
    name: "setting_ltcs",
    meta: {
      title: "流通参数",
      icon: "icon-liutongcanshu",
      functionId: "26eeba4790ad4eda8f159cf5656c1228"
    },
    children: [
      {
        path: "dzlx",
        name: "set_dzlx",
        meta: {
          title: "读者类型",
          functionId: "3c5fcc9c95d742deb57bd54317f78031"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/dzlx")
      },
      {
        path: "ltlx",
        name: "set_ltlx",
        meta: {
          title: "流通类型",
          functionId: "c984f4879f8144b08237f0b09a01673f"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/ltlx")
      },
      {
        path: "jygz",
        name: "set_jygz",
        meta: {
          title: "借阅规则",
          functionId: "346530f945c4411d9d820abc4c3f7560"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/jygz")
      },
      {
        path: "ltgz",
        name: "set_ltgz",
        meta: {
          title: "流通规则",
          functionId: "0c967941c2544cc5a8e1b1c4dddaa059"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/ltgz")
      },
      {
        path: "jygzsm",
        name: "set_jygzsm",
        meta: {
          title: "借阅规则说明",
          functionId: "a1d3240895e844668824816300269c82"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/jygzsm")
      },
      {
        path: "yjsz",
        name: "set_yjsz",
        meta: { title: "邮件设置" },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/yjsz")
      },
      {
        path: "yjmb",
        name: "set_yjmb",
        meta: { title: "邮件模板" },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/yjmb")
      },
      {
        path: "jqsd",
        name: "set_jqsd",
        meta: {
          title: "假期设定",
          functionId: "ab95891bb5b04b6da7b88d515405b23c"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/ltcs/jqsd")
      }
    ]
  },
  {
    path: "/setting/opac",
    component: Layout,
    redirect: "noredirect",
    name: "setting_opac",
    meta: {
      title: "WebOPAC参数",
      icon: "icon-webopaccanshu",
      functionId: "c2af7b9953b84e8fa5b6fd4aeedea844"
    },
    children: [
      {
        path: "rmtssz",
        name: "set_rmtssz",
        meta: {
          title: "热门图书设置",
          functionId: "0805f2f3674449f889203ce4459014a3"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/opac/rmtssz")
      }
    ]
  },
  {
    path: "/setting/xtsz",
    component: Layout,
    redirect: "noredirect",
    name: "setting_xtsz",
    meta: {
      title: "系统设置",
      icon: "icon-xitongshezhi",
      functionId: "45c2e4f1624a4cf2b99a757081b15818"
    },
    children: [
      {
        path: "ymyspz",
        name: "set_ymyspz",
        meta: {
          title: "页面元素配置",
          functionId: "7fe9e8833bd34682aea9c3dbd6f91071"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtsz/ymyspz")
      }
    ]
  },
  {
    path: "/setting/xtrz",
    component: Layout,
    redirect: "noredirect",
    name: "setting_xtrz",
    meta: {
      title: "系统日志",
      icon: "icon-xitongrizhi",
      functionId: "29350d70b4a24413a758c2775f93de77"
    },
    children: [
      {
        path: "xtczrz",
        name: "set_xtczrz",
        meta: {
          title: "系统操作日志",
          functionId: "ab60074cca054cfaa3803653d85c3bd9"
        },
        component: () =>
          import(/* webpackChunkName: 'setting' */ "views/setting/xtrz/xtczrz")
      }
    ]
  }
];

export default settingRouter;
