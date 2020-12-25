/*
 * @Description: 全局 getters
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-01-21 09:57:51
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-09-26 10:00:56
 */

const getters = {
  userInfo: state => state.user.userInfo,
  addRouters: state => state.permission.addRouters,
  permission_routers: state => state.permission.routers,
  firstMenus: state => state.permission.firstMenus,
  currentFirstMenu: state => state.permission.currentFirstMenu,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  libTypeObj: state => state.app.libTypeObj,
  libList: state => state.app.libList, // 当前用户权限管列表（不含全部）
  // libListSelect: state => state.app.libListSelect, // 当前用户权限管列表（含全部）- 2019-09-02 去掉全部条件，from: slj
  libListSelect: state => state.app.libList, // 当前用户权限管列表（含全部）
  certTypeList: state => state.app.CRM_CERT_TYPE,
  eduTypeList: state => state.app.CRM_EDUCATION
};
export default getters;
