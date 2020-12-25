/*
 * @Description: 公共接口
 * @Autor: chenming.feng
 * @Date: 2019-06-25 10:32:01
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-12-18 09:19:59
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 所有馆列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2057
 * @returns
 */
export function getAllLibList() {
  return request({
    url: BASE_URL + "/api/p/comm/libList",
    method: "post"
  });
}

/**
 * 权限馆列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2654
 * @returns
 */
export function commLibList() {
  return request({
    url: BASE_URL + "/api/e/sys/user/libList",
    method: "post"
  });
}

/**
 * 图片显示
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2892
 * @returns
 */
export function imgUrl() {
  return request({
    url: BASE_URL + "/api/p/img/url",
    method: "post"
  });
}

/**
 * 字典列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2667
 * @returns
 */
export function commDictionary(data) {
  return request({
    url: BASE_URL + "/api/p/comm/dictionary",
    method: "get",
    params: {
      dictType: data
    }
  });
}

/**
 * 根据馆id获取供应商列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2802
 * @returns
 */
export function userGysInLibList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/gysList",
    method: "post",
    data
  });
}

/**
 * 根据馆id获取用户预算列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2805
 * @returns
 */
export function userYsLibList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/ysList",
    method: "post",
    data
  });
}

/**
 * 用户藏址列表
 *
 * @export
 * @param 查看http://192.168.1.132:4999/index.php?s=/29&page_id=2895
 * @returns
 */
export function userCzList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/czList",
    method: "post",
    data
  });
}

/**
 * 当前用户读者类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2796
 * @returns
 */
export function readerType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/readerType",
    method: "post",
    data
  });
}

/**
 * 当前用户流通类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2795
 * @returns
 */
export function flowType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/flowType",
    method: "post",
    data
  });
}

/**
 * 当前用户借阅规则
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2797
 * @returns
 */
export function borrowRule(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/borrowRule",
    method: "post",
    data
  });
}

/**
 * 当前用户预算类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2804
 * @returns
 */
export function yslxList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/yslxList",
    method: "post",
    data
  });
}

/**
 * 当前用户货币代码
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2803
 * @returns
 */
export function hbList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/hbList",
    method: "post",
    data
  });
}

/**
 * 当前用户分类法
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2800
 * @returns
 */
export function flxList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/flxList",
    method: "post",
    data
  });
}

/**
 * 文献类型
 *
 * @export
 * @param http://192.168.1.132:4999/index.php?s=/29&page_id=2714
 * @returns
 */
export function wxType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/wxType",
    method: "post",
    data
  });
}

/**
 * 上传图片
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2064
 * @returns
 */
export function imgUpload() {
  return request({
    url: BASE_URL + "/api/p/img/upload",
    method: "post"
  });
}

/**
 * 当前用户成员馆
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3023
 * @returns
 */
export function getCygList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/cygList",
    method: "post",
    data
  });
}

/**
 * MARC分编
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2715
 * @returns
 */
export function getMarcFbList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/marcFb",
    method: "post",
    data
  });
}

/**
 * MARC类型
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2713
 * @returns
 */
export function getMarcType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/marcType",
    method: "post",
    data
  });
}

/**
 * MARC模板
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2876
 * @returns
 */
export function getMarcTemp(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/marcTemplete",
    method: "post",
    data
  });
}

/**
 * 获取批次列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3122
 * @returns
 */
export function getPcList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/pcList",
    method: "post",
    data
  });
}

/**
 * 获取征订批次列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3139
 * @returns
 */
export function getZdpcList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/zdpcList",
    method: "post",
    data
  });
}

/**
 * 预订批次列表 - 预订单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3148
 * @returns
 */
export function ydpcList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/ydpcList",
    method: "post",
    data
  });
}

/**
 * 验收批次列表 - 验收单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3150
 * @returns
 */
export function yspcList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/yspcList",
    method: "post",
    data
  });
}

/**
 * 预订人列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3168
 * @returns
 */
export function ydpcUserList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/ydpcUserList",
    method: "post",
    data
  });
}

/**
 * 验收人列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3169
 * @returns
 */
export function yspcUserList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/yspcUserList",
    method: "post",
    data
  });
}

/**
 * 操作员列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3670
 * @returns
 */
export function userList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/userList",
    method: "post",
    data
  });
}

/**
 * 编目批次列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3761
 * @returns
 */
export function catalogBatchList(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/catalogBatchList",
    method: "post",
    data
  });
}

/**
 * 多选馆-藏址列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4309
 * @returns
 */
export function czListByLibIds(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/czListByLibIds",
    method: "post",
    data
  });
}
