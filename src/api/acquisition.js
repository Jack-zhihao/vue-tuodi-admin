/*
 * @Description: 采访模块
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-12 11:19:54
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-07 16:34:23
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 用户列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4358
 * @returns
 */
export function moneyGetUserList(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/getUserList",
    method: "post",
    data
  });
}

/**
 * 资金管理-新增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4336
 * @returns
 */
export function moneyAdd(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/add",
    method: "post",
    data
  });
}

/**
 * 资金管理-更新
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4337
 * @returns
 */
export function moneyUpdate(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/update",
    method: "post",
    data
  });
}

/**
 * 资金管理-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4338
 * @returns
 */
export function moneyDel(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/del",
    method: "post",
    data
  });
}

/**
 * 资金管理-列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4340
 * @returns
 */
export function moneyList(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/list",
    method: "post",
    data
  });
}

/**
 * 资金管理-上传
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4341
 * @returns
 */
export function moneyUpload(data) {
  return request({
    url: BASE_URL + "/api/e/interview/money/upload",
    method: "post",
    data
  });
}

/**
 * 资金管理-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4342
 * @returns
 */
export const moneyExportExcel = () => "/api/e/interview/money/exportExcel";

/**
 * 导出附件全部
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4359
 * @returns
 */
export const moneyExportAttach = () => "/api/e/interview/money/getRar";

/**
 * 征订批次-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2997
 * @returns
 */
export function saveZdpc(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdpc/save",
    method: "post",
    data
  });
}

/**
 * 征订批次-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2999
 * @returns
 */
export function searchZdpc(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdpc/search",
    method: "post",
    data
  });
}

/**
 * 征订批次-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3000
 * @returns
 */
export function delZdpc(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdpc/del",
    method: "post",
    data
  });
}

/**
 * 征订批次-预订记录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3058
 * @returns
 */
export function getYdsmListInLib(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smListInLib",
    method: "post",
    data
  });
}

/**
 * 征订批次-馆藏记录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3059
 * @returns
 */
export function getYdsmCollection(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smCollection",
    method: "post",
    data
  });
}

/**
 * 征订批次-验收记录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3098
 * @returns
 */
export function getYssmListInLib(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/ysListInLib",
    method: "post",
    data
  });
}

/**
 * 征订书目-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3012
 * @returns
 */
export function searchZdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/search",
    method: "post",
    data
  });
}

/**
 * 征订书目-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3015
 * @returns
 */
export function delZdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/del",
    method: "post",
    data
  });
}

/**
 * 征订书目-征订查重
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3022
 * @returns
 */
export function checkZdsmRepeat(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/checkRepeat",
    method: "post",
    data
  });
}

/**
 * 征订书目-跳转预订
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3024
 * @returns
 */
export function reserveZdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/reserve",
    method: "post",
    data
  });
}

/**
 * 征订书目-预订单列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3074
 * @returns
 */
export function ydPcList(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcList",
    method: "post",
    data
  });
}

/**
 * 征订书目-预订单信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3075
 * @returns
 */
export function ydPcFind(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcidFind",
    method: "post",
    data
  });
}

/**
 * 工作单-设置
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3037
 * @returns
 */
export function workSave(data) {
  return request({
    url: BASE_URL + "/api/e/interview/work/save",
    method: "post",
    data
  });
}

/**
 * 获取工作单信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3072
 * @returns
 */
export function workGet(data) {
  return request({
    url: BASE_URL + "/api/e/interview/work/get",
    method: "post",
    data
  });
}

/**
 * 预订单-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3045
 * @returns
 */
export function ydPcAdd(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcAdd",
    method: "post",
    data
  });
}

/**
 * 预订批次-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3047
 * @returns
 */
export function ydPcSearch(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcSearch",
    method: "post",
    data
  });
}

/**
 * 预订单-清空
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3048
 * @returns
 */
export function ydPcEmpty(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcEmpty",
    method: "post",
    data
  });
}

/**
 * 预订批次-催缺单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3049
 * @returns
 */
export function ydPcUrging(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/pcUrging",
    method: "post",
    data
  });
}

/**
 * 催缺单导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3145
 * @returns
 */
export const reportUrging = () => "/api/e/interview/file/report/urging";

/**
 * 预订书目-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3054
 * @returns
 */
export function searchYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smSearch",
    method: "post",
    data
  });
}

/**
 * 预订书目-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3055
 * @returns
 */
export function saveYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smSave",
    method: "post",
    data
  });
}

/**
 * 预订书目-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3056
 * @returns
 */
export function ydsmDel(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smDel",
    method: "post",
    data
  });
}

/**
 * 预订书目-退订
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3057
 * @returns
 */
export function unsubscribeYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/smUnsubscribe",
    method: "post",
    data
  });
}

/**
 * 预订书目-查询库中图书
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3060
 * @returns
 */
export function searchYdBook(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/searchBook",
    method: "post",
    data
  });
}

/**
 * 预订书目-验收书目查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3096
 * @returns
 */
export function searchYssm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/smSearch",
    method: "post",
    data
  });
}

/**
 * 验收书目查询2
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3379
 * @returns
 */
export function bmsmSearch(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/bmsmSearch",
    method: "post",
    data
  });
}

/**
 * 预订书目-删除验收书目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3097
 * @returns
 */
export function delYssm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/smDel",
    method: "post",
    data
  });
}

/**
 * 采访-快捷验收
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3090
 * @returns
 */
export function saveYssm(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/smSave",
    method: "post",
    data
  });
}

/**
 * 直接验收-快捷验收信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3078
 * @returns
 */
export function quickAcceptance(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/quickAcceptance",
    method: "post",
    data
  });
}
/**
 * 验收单查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3095
 * @returns
 */
export function pcSearch(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/pcSearch",
    method: "post",
    data
  });
}

/**
 * 验收单新增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3092
 * @returns
 */
export function pcSave(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/pcSave",
    method: "post",
    data
  });
}

/**
 * 征定书目-excel文件上传
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3123
 * @returns
 */
export function uploadZdExcel(data) {
  return request({
    url: BASE_URL + "/api/e/interview/file/zdsmI",
    method: "post",
    noNeedQS: true,
    isformData: true,
    data
  });
}

/**
 * 征定书目-数据导入
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3126
 * @returns
 */
export function importZdsmMain(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/import/main",
    method: "post",
    data
  });
}

/**
 * 征定书目-excel数据查重
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3127
 * @returns
 */
export function checkExcelRepeat(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/import/checkRepeat",
    method: "post",
    data
  });
}

/**
 * 征定书目-excel查重删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3128
 * @returns
 */
export function delRepeat(data) {
  return request({
    url: BASE_URL + "/api/e/interview/zdsm/import/delRepeat",
    method: "post",
    data
  });
}

/**
 * 征定书目-id获取书目信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3221
 * @returns
 */
export function searchBookBySmid(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/searchBookBySmid",
    method: "post",
    data
  });
}

/**
 * marc获取图书信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3276
 * @returns
 */
export function searchBookByMarcid(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/searchBookByMarcid",
    method: "post",
    data
  });
}

/**
 * 读者荐购-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3284
 * @returns
 */
export function searchTsjgR(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchTsjgR",
    method: "post",
    data
  });
}

/**
 * 荐购总数
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4045
 * @returns
 */
export function searchTsjgRSum(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchTsjgRSum",
    method: "post",
    data
  });
}

/**
 * 读者荐购-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3285
 * @returns
 */
export function deleteTsjgR(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/deleteTsjgR",
    method: "post",
    data
  });
}

/**
 * 读者荐购-更新状态
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3286
 * @returns
 */
export function updateZtaiR(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/updateZtaiR",
    method: "post",
    data
  });
}

/**
 * 读者荐购-荐购读者
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3287
 * @returns
 */
export function jgDzheList(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/jgDzheList",
    method: "post",
    data
  });
}

/**
 * 种次号-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3290
 * @returns
 */
export function searchMaxZch(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchMaxZch",
    method: "post",
    data
  });
}

/**
 * 种次号-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3291
 * @returns
 */
export function deleteMaxZchs(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/deleteMaxZchs",
    method: "post",
    data
  });
}

/**
 * 种次号-保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3292
 * @returns
 */
export function saveMaxZch(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/saveMaxZch",
    method: "post",
    data
  });
}

/**
 * 分类主题词-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3294
 * @returns
 */
export function searchZtcflhao(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchZtcflhao",
    method: "post",
    data
  });
}

/**
 * 分类主题词-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3295
 * @returns
 */
export function deleteZtcflhao(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/deleteZtcflhao",
    method: "post",
    data
  });
}

/**
 * 分类主题词-保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3296
 * @returns
 */
export function saveZtcflhao(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/saveZtcflhao",
    method: "post",
    data
  });
}

/**
 * 获取索书号（marc）
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3303
 * @returns
 */
export function getYscurSshao(data) {
  return request({
    url: BASE_URL + "/api/e/interview/ys/curSshao",
    method: "post",
    data
  });
}

/**
 * 获取marctyid
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3306
 * @returns
 */
export function marctyIdByIsbnAndZtming(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/marctyIdByIsbnAndZtming",
    method: "post",
    data
  });
}

//图书推荐-查询
//http://192.168.1.132:4999/index.php?s=/29&page_id=4205
export function searchTstjB(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchTstjTheme",
    method: "post",
    data
  });
}

// 图书推荐-新增/编辑
// http://192.168.1.132:4999/index.php?s=/29&page_id=4204
export function saveTstjTheme(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/saveTstjTheme",
    method: "post",
    data
  });
}

// 图书推荐-主题状态修改
// http://192.168.1.132:4999/index.php?s=/29&page_id=4206
export function updZtaiTstjTheme(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/updZtaiTstjTheme",
    method: "post",
    data
  });
}

// 图书推荐-主题删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4211
export function delTheme(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/delTstjTheme",
    method: "post",
    data
  });
}

// 图书推荐--主题列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4212
export function themeList(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/themeList",
    method: "post",
    data
  });
}

// 图书推荐-主题迁移
// http://192.168.1.132:4999/index.php?s=/29&page_id=4210
export function migrateTheme(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/removalTstjTheme",
    method: "post",
    data
  });
}

// 图书推荐-主题导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4228
export const themeExop = () => "/api/e/interview/file/tstj/theme";

// 书目信息-查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4207
export function searchBookItem(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/searchTstjB",
    method: "post",
    data
  });
}

// 书目信息-迁移
// http://192.168.1.132:4999/index.php?s=/29&page_id=4208
export function removalTstj(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/removalTstj",
    method: "post",
    data
  });
}

// 书目信息-删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4208
export function deleteTstjB(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/deleteTstjB",
    method: "post",
    data
  });
}

// 书目信息-导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4221
export const bookExop = () => "/api/e/interview/file/tstj/book";

/**
 * 荐购导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3309
 * @returns
 */
export const tsjgE = () => "/api/e/interview/file/tsjgE";

/**
 * 图书推荐导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3310
 * @returns
 */
export const tstjE = () => "/api/e/interview/file/tstjE";

/**
 * 汇率货币计算
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3324
 * @returns
 */
export function convertHlv(data) {
  return request({
    url: BASE_URL + "/api/e/interview/yd/convertHlv",
    method: "post",
    data
  });
}

/**
 * 主题词-精确查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3358
 * @returns
 */
export function findZtcByFlhaoEq(data) {
  return request({
    url: BASE_URL + "/api/e/interview/param/findZtcByFlhaoEq",
    method: "post",
    data
  });
}
