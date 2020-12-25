/*
 * @Description: 期刊模块
 * @Autor: chenming.feng
 * @Date: 2019-08-27 09:30:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-12-23 15:23:35
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 征订目录预订列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3153
 * @returns
 */
export function getZdmlydList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmlyd/list",
    method: "post",
    data
  });
}

/**
 * 征订目录预订删除确认
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3153
 * @returns
 */
export function delConfirm(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmlyd/delConfirm",
    method: "post",
    data
  });
}

/**
 * 征订目录预订新增 http://192.168.1.132:4999/index.php?s=/29&page_id=3149
 * 征订目录预订更新 http://192.168.1.132:4999/index.php?s=/29&page_id=3151
 *
 * @export
 * @returns
 */
export function updateZdmlyd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmlyd/save",
    method: "post",
    data
  });
}

/**
 * 征订目录预订删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3152
 * @returns
 */
export function delZdmlyd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmlyd/del",
    method: "post",
    data
  });
}

/**
 * 期刊征订目录列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3155
 * @returns
 */
export function getZdmllbList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/list",
    method: "post",
    data
  });
}

/**
 * marc的订购记录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3159
 * @returns
 */
export function getMarcOrderList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/marcOrderList",
    method: "post",
    data
  });
}

/**
 * 出版周期下拉列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3160
 * @returns
 */
export function getYdsmCbzqList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmCbzqList",
    method: "post",
    data
  });
}

/**
 * 新订-获取其他信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3161
 * @returns
 */
export function getYdsmOtherMsg(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmOtherMsg",
    method: "post",
    data
  });
}

/**
 * 获取操作标识
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3162
 * @returns
 */
export function ydsmGetCzbs(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmGetCzbs",
    method: "post",
    data
  });
}

/**
 * marc的订购记录 新增、更新
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3165
 * @returns
 */
export function saveYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmSave",
    method: "post",
    data
  });
}

/**
 * marc的订购记录 删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3166
 * @returns
 */
export function delYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmDel",
    method: "post",
    data
  });
}

/**
 * marc的订购记录 停订
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3167
 * @returns
 */
export function stopYdsm(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmStop",
    method: "post",
    data
  });
}

/**
 * 期刊征订目录列表-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3211
 * @returns
 */
export function delZdmllb(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/Del",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到书目信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3260
 * @returns
 */
export function jdsmxx(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdsmxx",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到总记录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3264
 * @returns
 */
export function jdzjl(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdzjl",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3267
 * @returns
 */
export function jdxx(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdxx",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到信息新增、修改
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3268
 * @returns
 */
export function jdxxSave(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdxxSave",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理---记到信息删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3270
 * @returns
 */
export function jdxxDel(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdxxDel",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到信息装订
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3272
 * @returns
 */
export function jdxxYanshou(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdxxYanshou",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到信息-记到
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3289
 * @returns
 */
export function jdxxJd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jd",
    method: "post",
    data
  });
}

/**
 * 期刊记到管理 - 记到处理--记到信息-记到信息向前后新增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3293
 * @returns
 */
export function jdxxSaveTeding(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/jdxxSaveTeding",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 期刊书目信息-数据展示
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3275
 * @returns
 */
export function qksmxxList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/qksmxxList",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 期刊书目信息-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3355
 * @returns
 */
export function qksmxxListDel(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/qksmxxListDel",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 装订列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3277
 * @returns
 */
export function zdlbList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/zdlbList",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 装订列表 - 验收
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3279
 * @returns
 */
export function zdlbYanshou(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/zdlbYanshou",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 装订列表 - 删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3280
 * @returns
 */
export function zdlbDel(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/zdlbDel",
    method: "post",
    data
  });
}

/**
 * 期刊装订验收 - 装订列表 - 移送
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3281
 * @returns
 */
export function zdlbJiaoSong(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/zdlbJiaoSong",
    method: "post",
    data
  });
}

/**
 * 期刊装订批移送-列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3282
 * @returns
 */
export function zdpysList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdpys/list",
    method: "post",
    data
  });
}

/**
 * 期刊装订批移送-交送
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3283
 * @returns
 */
export function zdpysJiaosong(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdpys/jiaosong",
    method: "post",
    data
  });
}

/**
 * 期刊装订移送-获取单个验收信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3315
 * @returns
 */
export function getYanshou(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/getYanshou",
    method: "post",
    data
  });
}

/**
 * 期刊装订移送-装订列表-验收
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3279
 * @returns
 */
export function zdysMarcSave(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/zdys/zdysMarcSave",
    method: "post",
    data,
    noNeedQS: true
  });
}

/* 期刊征订目录列表-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3259
 * @returns
 */
export function getMarcOrder(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/getMarcOrder",
    method: "post",
    data
  });
}

/* 期刊报表 - 订购单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3288
 * @returns
 */
export function dgd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/dgd",
    method: "post",
    data
  });
}

/* 期刊报表 - 记到单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3297
 * @returns
 */
export function jdd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/jdd",
    method: "post",
    data
  });
}

/* 期刊报表 - 装订单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3311
 * @returns
 */
export function zdd(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/zdd",
    method: "post",
    data
  });
}

/* 期刊报表 - 订购单-操作员列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3320
 * @returns
 */
export function dgdOperatorList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/dgdOperatorList",
    method: "post",
    data
  });
}

/* 期刊报表 - 记到单-操作员列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3321
 * @returns
 */
export function jddOperatorList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/jddOperatorList",
    method: "post",
    data
  });
}

/* 期刊报表 - 装订单 - 操作员列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3322
 * @returns
 */
export function zddOperatorList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/zddOperatorList",
    method: "post",
    data
  });
}

// 期刊报表-催缺单
// http://192.168.1.132:4999/index.php?s=/29&page_id=4254
export function cqdList(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/baobiao/cqd",
    method: "post",
    data
  });
}

// 催缺单-供应商
// http://192.168.1.132:4999/index.php?s=/29&page_id=2802
export function gysList(data) {
  return request({
    url: BASE_URL + "api/e/parameter/gysList",
    method: "post",
    data
  });
}

// 催缺单-导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3102
export const cqdExcel = () => "/api/e/qikan/baobiao/cqdExportExcel";

/**
 * marc的订购记录 续订
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3354
 * @returns
 */
export function ydsmXuDing(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/zdmllb/ydsmXuDing",
    method: "post",
    data
  });
}

/**
 * 馆藏书目清单-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3482
 * @returns
 */
export const zdmllbExportExcel = () => "/api/e/qikan/zdmllb/exportExcel";

// 期刊-快捷预订
// http://192.168.1.132:4999/index.php?s=/29&page_id=4257
export function kjydExcel(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/file/kjydImport",
    method: "post",
    data,
    noNeedQS: true,
    isformData: true
  });
}

// 期刊-快捷预订-下载模板
// http://192.168.1.132:4999/index.php?s=/29&page_id=4260
export const kjydMould = () => "/api/e/qikan/file/mould";

/**
 * 记到信息进行馆藏分配
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4540
 * @returns
 */
export function qkjdxxGcfp(data) {
  return request({
    url: BASE_URL + "/api/e/qikan/jidao/qkjdcl/qkjdxxGcfp",
    method: "post",
    data
  });
}
