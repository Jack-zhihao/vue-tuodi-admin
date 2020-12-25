/*
 * @Description: 帮助模块路由
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-22 09:27:43
 */

import Layout from "views/layout/Layout";

const helpRouter = [
  {
    path: "/help/marc",
    component: Layout,
    redirect: "noredirect",
    name: "help_marc",
    meta: { title: "MARC帮助", icon: "icon-Mbangzhu" },
    children: [
      {
        path: "cnmarc",
        meta: { title: "CNMARC帮助" },
        name: "help_cnmarc",
        component: () =>
          import(/* webpackChunkName: 'help' */ "views/help/marc/cnmarc")
      },
      {
        path: "marc21",
        meta: { title: "MARC21帮助" },
        name: "help_marc21",
        component: () =>
          import(/* webpackChunkName: 'help' */ "views/help/marc/marc21")
      }
    ]
  }
];

export default helpRouter;
