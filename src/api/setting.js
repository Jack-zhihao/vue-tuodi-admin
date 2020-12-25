/*
 * @Description: 设置模块
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-12 11:23:32
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-27 17:55:43
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/** 系统权限 开始 **/

/**
 * 用户密码修改
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4551
 * @returns
 */
export function userPwdChange(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/changeUserPwd",
    method: "post",
    data
  });
}

/**
 * 系统管理-用户管理-用户保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2673
 * @returns
 */
export function sysUserSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/save",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 馆藏批处理
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4339
 * @returns
 */
export function saveUserTypeBatch(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/saveUserTypeBatch",
    method: "post",
    data
  });
}

/**
 * 系统管理-用户管理-根据用户获取用户信息
 *
 * @export
 * @param http://192.168.1.132:4999/index.php?s=/29&page_id=2675
 * @returns
 */
export function sysUserGetUser(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/getUser",
    method: "post",
    data
  });
}

/**
 * 系统管理-用户管理-用户删除
 *
 * @export
 * @param userIds 用户编号
 * @returns
 */
export function sysUserDelete(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-用户管理-用户列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2677
 * @returns
 */
export function sysUserList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-角色列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2655
 * @returns
 */
export function sysRoleList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/role/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-角色保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2664
 * @returns
 */
export function sysRoleSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/role/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-获取角色
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2665
 * @returns
 */
export function sysRoleGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/role/getRole",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-角色删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2666
 * @returns
 */
export function sysRoleDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/role/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-根据馆获取馆角色信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2674
 * @returns
 */
export function sysRoleSelectByLibId(data) {
  return request({
    url: BASE_URL + "/api/e/sys/role/selectByLibId",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-IP列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2813
 * @returns
 */
export function sysUserIPList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/ipList",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-用户IP新增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2816
 * @returns
 */
export function sysUserIPSet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/userIpSet",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-用户IP删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2815
 * @returns
 */
export function sysUserIPDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/userIpDelete",
    method: "post",
    data
  });
}

/**
 * 系统管理-角色管理-用户IP列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2814
 * @returns
 */
export function sysUserOwnIPList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/userIpList",
    method: "post",
    data
  });
}

/**
 * 系统管理-菜单管理-树形菜单tree
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2647
 * @returns
 */
export function sysMenuTree() {
  return request({
    url: BASE_URL + "/api/e/sys/menu/tree",
    method: "post"
  });
}

/**
 * 系统管理-菜单管理-根据父编号获取子功能菜单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2648
 * @returns
 */
export function sysMenuSubMenu(data) {
  return request({
    url: BASE_URL + "/api/e/sys/menu/subMenu",
    method: "post",
    data
  });
}

/**
 * 系统管理-菜单管理-功能菜单保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2651
 * @returns
 */
export function sysMenuSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/menu/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-菜单管理-功能菜单删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2652
 * @returns
 */
export function sysMenuDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/menu/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-菜单管理-根据编号获取功能菜单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2653
 * @returns
 */
export function sysMenuGetFun(data) {
  return request({
    url: BASE_URL + "/api/e/sys/menu/getMenuFunction",
    method: "post",
    data
  });
}

/** 系统权限 结束 **/

/** 机读格式 开始 **/

/**
 * 系统管理-机读格式-文献类型列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2698
 * @returns
 */
export function sysMarcConfigWxlxList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/wxLx/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-文献类型删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2698
 * @returns
 */
export function sysMarcConfigWxlxDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/wxLx/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-文献类型保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2699
 * @returns
 */
export function sysMarcConfigWxlxSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/wxLx/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取文献类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2701
 * @returns
 */
export function sysMarcConfigWxlxGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/wxLx/getWxLxById",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC分编列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2702
 * @returns
 */
export function sysMarcConfigMarcFbList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcFb/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC分编删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2706
 * @returns
 */
export function sysMarcConfigMarcFbDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcFb/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC分编保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2705
 * @returns
 */
export function sysMarcConfigMarcFbSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcFb/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取MARC分编
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2707
 * @returns
 */
export function sysMarcConfigMarcFbGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcFb/getMarcFbById",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC类型列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2694
 * @returns
 */
export function sysMarcConfigMarcList(data = {}) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcLx/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC类型删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2696
 * @returns
 */
export function sysMarcConfigMarcLxDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcLx/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC类型保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2695
 * @returns
 */
export function sysMarcConfigMarcLxSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcLx/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取MARC类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2697
 * @returns
 */
export function sysMarcConfigMarcLxGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcLx/getMarcLxById",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC条目列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2727
 * @returns
 */
export function sysMarcConfigMarcEntryList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcEntry/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC条目删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2734
 * @returns
 */
export function sysMarcConfigMarcEntryDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcEntry/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC条目保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2733
 * @returns
 */
export function sysMarcConfigMarcEntrySave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcEntry/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取MARC条目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2735
 * @returns
 */
export function sysMarcConfigMarcEntryGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcEntry/getMarcEntryById",
    method: "post",
    data
  });
}
/**
 * 系统管理-机读格式-MARC模板列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2710
 * @returns
 */
export function sysMarcConfigMarcTempList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTemplete/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC模板删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2716
 * @returns
 */
export function sysMarcConfigMarcTempDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTemplete/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-MARC模板保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2712
 * @returns
 */
export function sysMarcConfigMarcTempSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTemplete/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取MARC模板
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2717
 * @returns
 */
export function sysMarcConfigMarcTempGet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTemplete/getMarcTempleteById",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-模板字段列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2723
 * @returns
 */
export function sysMarcConfigMarcTempFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTempleteField/list",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-模板字段删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2720
 * @returns
 */
export function sysMarcConfigMarcTempFieldDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTempleteField/delete",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-模板字段保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2719
 * @returns
 */
export function sysMarcConfigMarcTempFieldSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcTempleteField/save",
    method: "post",
    data
  });
}

/**
 * 系统管理-机读格式-获取模板字段
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2721
 * @returns
 */
export function sysMarcConfigMarcTempFieldGet(data) {
  return request({
    url:
      BASE_URL + "/api/e/sys/marcConfig/marcTempleteField/getMarcMbFieldById",
    method: "post",
    data
  });
}

/***
 *
 * 系统管理-机读格式-MARC馆藏列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4609
 *
 */
export function marcBookFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcBookField/list",
    method: "post",
    data
  });
}

/***
 *
 * 系统管理-机读格式-获取MARC馆藏
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4608
 *
 */
export function getByIdOrMarcLxId(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcBookField/getByIdOrMarcLxId",
    method: "post",
    data
  });
}

/***
 *
 * 系统管理-机读格式-MARC馆藏删除
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4607
 *
 */
export function marcBookFieldDelete(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcBookField/delete",
    method: "post",
    data
  });
}

/***
 *
 * 系统管理-机读格式-MARC馆藏保存
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4606
 *
 */
export function marcBookFieldSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/marcBookField/save",
    method: "post",
    data
  });
}

/** 机读格式 结束 **/

/** 系统参数 开始 **/

/***
 *
 * 系统参数-成员馆-成员馆列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2781
 *
 */
export function cygFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cygFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-成员馆-上一级成员馆列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2794
 *
 */
export function cygSjList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cygSjList",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-成员馆-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2799
 *
 */
export function cygDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cygDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-成员馆-保存-修改
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2798
 *
 */
export function cygSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cygSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-供应商-供应商列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2749
 *
 */
export function gysFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/gysFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-供应商-供应商删除
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2751
 *
 */
export function gysDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/gysDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-供应商-供应商编辑-新增
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2750
 *
 */
export function gysSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/gysSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-出版社-出版社列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2753
 *
 */
export function cbsFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cbsFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-出版社-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2755
 *
 */
export function cbsDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cbsDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-出版社-修改-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2755
 *
 */
export function cbsSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/cbsSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-货币-货币列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2799
 *
 */
export function hbFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/hbFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-货币-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2760
 *
 */
export function hbDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/hbDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-货币-保存操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2758
 *
 */
export function hbSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/hbSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算管理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2768
 *
 */
export function ysFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ysFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算管理-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2770
 *
 */
export function ysDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ysDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算管理-编辑-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2769
 *
 */
export function ysSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ysSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-藏址管理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2777
 *
 */
export function czFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/czFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-藏址管理-修改-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2778
 *
 */
export function czSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/czSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-藏址管理-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2779
 *
 */
export function czDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/czDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算类型-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2762
 *
 */
export function yslxFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/yslxFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算类型-编辑-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2763
 *
 */
export function yslxSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/yslxSave",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-预算类型-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2764
 *
 */
export function yslxDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/yslxDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-IP管理-获取IP列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2772
 *
 */
export function ipFind(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ipFind",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-IP管理-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2774
 *
 */
export function ipDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ipDel",
    method: "post",
    data
  });
}

/***
 *
 * 系统参数-IP管理-编辑-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2773
 *
 */
export function ipSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setup/param/ipSave",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-读者类型-获取读者列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2726
 *
 */
export function readerTypeList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/readerTypeList",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-读者类型-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2728
 *
 */
export function readerTypeSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/readerTypeSave",
    method: "post",
    data,
    needEmpty: true
  });
}

/***
 *
 * 流通参数-读者类型-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2729
 *
 */
export function readerTypeDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/readerTypeDel",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-借阅规则 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2742
 *
 */
export function borrowRuleList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/borrowRuleList",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-借阅规则 - 新增-编辑操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2743
 *
 */
export function borrowRuleSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/borrowRuleSave",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-借阅规则 - 删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2744
 *
 */
export function borrowRuleDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/borrowRuleDel",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-流通规则 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2783
 *
 */
export function flowRuleList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowRuleList",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-流通规则 - 编辑新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2784
 *
 */
export function flowRuleSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowRuleSave",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-流通规则 - 删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2785
 *
 */
export function flowRuleDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowRuleDel",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-流通类型 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2736
 *
 */
export function flowTypeList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowTypeList",
    method: "post",
    data
  });
}

/***
 *
 * 流通参数-流通类型 - 编辑-新增操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2737
 *
 */
export function flowTypeSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowTypeSave",
    method: "post",
    data,
    needEmpty: true
  });
}

/***
 *
 * 流通参数-流通类型 - 删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2737
 *
 */
export function flowTypeDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowTypeDel",
    method: "post",
    data
  });
}
/***
 *
 * WebOPAC参数-热门图书设置
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3326
 *
 */
export function getHotBookSetting(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setting/getHotBookSetting",
    method: "post",
    data
  });
}
/***
 *
 * WebOPAC参数-热门图书设置-编辑
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3325
 *
 */
export function hotBook(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setting/hotBook",
    method: "post",
    data
  });
}

/***
 *
 * WebOPAC参数-页面设置
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3317
 *
 */
export function systemImgSetting() {
  return request({
    url: BASE_URL + "/api/p/comm/systemImgSetting",
    method: "post"
  });
}
/***
 *
 * WebOPAC参数-页面设置 -上传
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3316
 *
 */
export function imgSetting(data) {
  return request({
    url: BASE_URL + "/api/e/sys/setting/imgSetting",
    method: "post",
    data
  });
}

/***
 *
 * 查询 ： 邮箱模板
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3375
 *
 */
export function searchMailTemp(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/find",
    method: "post",
    data
  });
}

/***
 *
 * 编辑 ： 邮箱模板
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3376
 *
 */
export function updateMailTemp(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/save",
    method: "post",
    data
  });
}

// 邮箱设置--查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4636
export function searchFindAll(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/set/findAll",
    method: "post",
    data
  });
}

// 邮箱设置--编辑新增
// http://192.168.1.132:4999/index.php?s=/29&page_id=4635
export function szMailSave(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/set/save",
    method: "post",
    data
  });
}

// 邮箱设置--删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4637
export function szMailDel(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/set/delete",
    method: "post",
    data
  });
}
/***
 *
 * 系统图片
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3317
 *
 */
export function getSystemImg(data) {
  return request({
    url: BASE_URL + "/api/p/comm/systemImgSetting",
    method: "post",
    data
  });
}

/***
 *
 * 荐购设置查询
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3963
 *
 */
export function findJgouSet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/findJgouSet",
    method: "post",
    data
  });
}

/***
 *
 * 荐购设置删除
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3962
 *
 */
export function delJgouSet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/delJgouSet",
    method: "post",
    data
  });
}

/***
 *
 * 荐购设置编辑
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3961
 *
 */
export function saveJgouSet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/saveJgouSet",
    method: "post",
    data
  });
}

// 借阅规则列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3981
export function jygzsmList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/jygzsmList",
    method: "post",
    data
  });
}

// 借阅规则新增
// http://192.168.1.132:4999/index.php?s=/29&page_id=3982
export function jygzsmSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/jygzsmSave",
    method: "post",
    data
  });
}

// 借阅规则删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=3983
export function jygzsmDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/jygzsmDel",
    method: "post",
    data
  });
}

// 操作日志列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3877
export function operLogList(data) {
  return request({
    url: BASE_URL + "/api/e/sysOperLog/list",
    method: "get",
    params: data
  });
}

// 操作员列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3878
export function operatorList(data) {
  return request({
    url: BASE_URL + "/api/e/sysOperLog/getUserList",
    method: "get",
    params: data
  });
}

// 操作日志导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4088
export const sysOperLogExel = () => "/api/e/sysOperLog/exportExcel";

// 批新增流通规则
// http://192.168.1.132:4999/index.php?s=/29&page_id=4588
export function flowRuleBatchAdd(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/flowRuleBatchAdd",
    method: "get",
    params: data
  });
}

/**
 * 定长字段保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4644
 * @returns
 */
export function marcConfigInvFieldSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invField/save",
    method: "post",
    data
  });
}

/**
 * 定长字段列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4645
 * @returns
 */
export function marcConfigInvFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invField/list",
    method: "post",
    data
  });
}

/**
 * 获取定长字段
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4646
 * @returns
 */
export function getMarcConfigInvField(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invField/getById",
    method: "post",
    data
  });
}

/**
 * 定长字段删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4647
 * @returns
 */
export function deleteMarcConfigInvField(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invField/delete",
    method: "post",
    data
  });
}

/**
 * 分段信息列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4648
 * @returns
 */
export function marcConfigInvSubFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invSubField/list",
    method: "post",
    data
  });
}

/**
 * 分段信息保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4649
 * @returns
 */
export function marcConfigInvSubFieldSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invSubField/save",
    method: "post",
    data,
    noNeedQS: true,
    needEmpty: true
  });
}

/**
 * 获取分段信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4650
 * @returns
 */
export function getMarcConfigInvSubField(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invSubField/getById",
    method: "post",
    data
  });
}

/**
 * 分段信息删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4651
 * @returns
 */
export function delMarcConfigInvSubField(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invSubField/delete",
    method: "post",
    data
  });
}

/**
 * 分段信息移动
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4652
 * @returns
 */
export function moveMarcConfigInvSubField(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invSubField/move",
    method: "post",
    data
  });
}

/**
 * 根据字段加载信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4653
 * @returns
 */
export function marcConfigInvFieldLoad(data) {
  return request({
    url: BASE_URL + "/api/e/sys/marcConfig/invField/load",
    method: "post",
    data
  });
}
