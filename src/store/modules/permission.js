/*
 * @Description: 权限配置
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:58:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-22 09:35:25
 */
import { asyncRouterMap, constantRouterMap } from "@/router";

/**
 * 通过 functionid 判断是否与当前用户权限匹配
 * @param roles
 * @param route
 */
let userMenusId = []; // 存放菜单 functionId 数组
let userMenusIdObj = {}; // 菜单functionId - 菜单显示名字 映射
function hasPermission(route, userMenusArr) {
  if (!userMenusId.length) {
    userMenusId = userMenusArr.map(item => {
      userMenusIdObj[item.functionId] = item.showName;
      return item.functionId;
    });
  }
  if (route.meta && route.meta.functionId) {
    route.meta.title = userMenusIdObj[route.meta.functionId];
    return userMenusId.includes(route.meta.functionId);
  } else {
    return true;
  }
}

/**
 * 根据用户信息过滤菜单展示
 *
 * @param {*} routes asyncRouterMap
 * @param {*} userMenus
 * @returns
 */
function filterAsyncRouter(routes, userMenus) {
  const res = [];

  routes.forEach(route => {
    const tmp = {
      ...route
    };
    if (hasPermission(tmp, userMenus) && !tmp.hidden) {
      if (tmp.children) {
        tmp.children = filterAsyncRouter(tmp.children, userMenus);
      }
      res.push(tmp);
    }
  });

  return res;
}

/**
 * 获取全部用户菜单的 id
 *
 * @param {*} menuList
 */
function getAllMenuIds(menuList) {
  let idsArr = [];
  menuList.forEach(item => {
    if (item.functionId) {
      idsArr.push({
        functionId: item.functionId,
        showName: item.displayName || item.name
      });
    }
    if (item.children) {
      idsArr.push(...getAllMenuIds(item.children));
    }
  });
  return idsArr;
}

const permission = {
  state: {
    routers: [],
    userMenus: [],
    addRouters: [],
    firstMenus: [],
    currentFirstMenu: ""
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers;
      state.routers = constantRouterMap.concat(routers);
    },
    SET_MENUSID: (state, userMenus) => {
      state.userMenus = getAllMenuIds(userMenus);
    },
    SET_FIRSTMENUS: (state, firstMenus) => {
      let menuCn = {
        acquisition: "采访",
        catalogue: "编目",
        reservation: "典藏",
        periodical: "期刊",
        circulation: "流通",
        setting: "设置",
        feature: "特色",
        help: "帮助",
        data: "数据",
        operation: "运营"
      };
      state.firstMenus = firstMenus.map(menu => {
        return {
          name: menu,
          name_cn: menuCn[menu]
        };
      });
    },
    SET_CURRENTMENU: (state, menuname) => {
      state.currentFirstMenu = menuname;
    }
  },
  actions: {
    GenerateRoutes({ commit, state }, data) {
      return new Promise(resolve => {
        let menuList = data.menuList;
        commit("SET_MENUSID", menuList);
        // 过滤得到用户的菜单
        let accessedRouters = filterAsyncRouter(
          asyncRouterMap,
          state.userMenus
        );
        accessedRouters.push({
          path: "*",
          redirect: "/404",
          hidden: true
        });
        commit("SET_ROUTERS", accessedRouters);
        resolve();
      });
    }
  }
};

export default permission;
