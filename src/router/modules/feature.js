/*
 * @Description: 特色模块路由
 * @Autor: chenming.feng
 * @Date: 2019-11-22 09:27:15
 * @LastEditors: wj.liang
 * @LastEditTime: 2019-11-28 16:05:30
 */
import Layout from "views/layout/Layout";

const featureRouter = [
  {
    path: "/feature/volunteer",
    component: Layout,
    redirect: "noredirect",
    name: "feature_volunteer",
    meta: {
      title: "义工管理",
      icon: "icon-Mbangzhu",
      functionId: "b417e5f5893045c682265c7f1054573a"
    },
    children: [
      {
        path: "ygqd",
        meta: {
          title: "义工签到",
          functionId: "9a2bebaa31494cfc9f9e14b8a5d599ba"
        },
        name: "feature_ygqd",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/volunteer/ygqd")
      },
      {
        path: "qdsj",
        meta: {
          title: "签到数据",
          functionId: "90249e5e4c7f435fa3fa4ec34179bc13"
        },
        name: "feature_qdsj",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/volunteer/qdsj")
      }
    ]
  },
  {
    path: "/feature/circulation",
    component: Layout,
    redirect: "noredirect",
    name: "feature_circulation",
    meta: {
      title: "专项流通",
      icon: "icon-Mbangzhu",
      functionId: "782be7692373459fa403691c35e25b9e"
    },
    children: [
      {
        path: "zxjhgl",
        meta: {
          title: "专项借还管理",
          functionId: "85eeab9808bb4828b5b914a90c91c34f"
        },
        name: "feature_zxjhgl",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/circulation/zxjhgl")
      },
      {
        path: "zxfkgl",
        meta: {
          title: "专项罚款管理",
          functionId: "ed659c61ba1048ac946cf72a138af459"
        },
        name: "feature_zxfkgl",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/circulation/zxfkgl")
      },
      {
        path: "dzzxjhcx",
        meta: { title: "读者专项借还查询" },
        name: "feature_dzzxjhcx",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/circulation/dzzxjhcx")
      },
      {
        path: "zxltcs",
        meta: {
          title: "专项流通参数",
          functionId: "95997d89e94d4980b316721c846c277b"
        },
        name: "feature_zxltcs",
        component: () =>
          import(/* webpackChunkName: 'feature' */ "views/feature/circulation/zxltcs")
      }
    ]
  }
];

export default featureRouter;
