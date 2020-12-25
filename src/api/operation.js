/*
 * @Description: 运营模块
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-11 09:42:58
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 11:41:21
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 云选书设置-保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4374
 * @returns
 */
export function yunBookSetSave(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/set/save",
    method: "post",
    data
  });
}

/**
 * 云选书设置-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4375
 * @returns
 */
export function yunBookSetSearch(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/set/search",
    method: "post",
    data,
    noMsg: true
  });
}

/**
 * 云选书设置-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4376
 * @returns
 */
export function yunBookSetDel(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/set/del",
    method: "post",
    data
  });
}

/**
 * 用户类型-列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4330
 * @returns
 */
export function UserList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/type/list",
    method: "post",
    data
  });
}

/**
 * 用户类型-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4328
 * @returns
 */
export function UserDel(data) {
  return request({
    url: BASE_URL + "api/e/sys/user/type/del",
    method: "post",
    data
  });
}

/**
 * 用户类型-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4327
 * @returns
 */
export function UserSearch(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/type/search",
    method: "post",
    data
  });
}

/**
 * 用户类型-保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4326
 * @returns
 */
export function UserSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/user/type/save",
    method: "post",
    data
  });
}

/**
 * 品质阅读-批次清单清除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4036
 * @returns
 */
export function batchDelete(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/batch/delete",
    method: "post",
    data
  });
}

/**
 * 品质阅读-批次查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4037
 * @returns
 */
export function BatchList(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/batch/search",
    method: "post",
    data
  });
}

/**
 * 品质阅读-新建或保存批次
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4035
 * @returns
 */
export function BatchSave(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/batch/save",
    method: "post",
    data
  });
}

/**
 * 品质阅读-批次明细导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4041
 * @returns
 */
export const BatchExpo = () => "/api/e/operation/reading/batch/export";

/**
 * 品质阅读-当前馆批次下拉框
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4038
 * @returns
 */
export function selectBatchList(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/batch/list",
    method: "post",
    data
  });
}

/**
 * 品质阅读-结算清单列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4039
 * @returns
 */
export function jsqdList(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/batch/brwBehavior",
    method: "post",
    data
  });
}

/**
 * 品质阅读-结算清单导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4040
 * @returns
 */
export const jsqdExpo = () =>
  "/api/e/operation/reading/batch/brwBehavior/export";

/**
 * 查重地址保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4048
 * @returns
 */
export function readingConfigSave(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/configSave",
    method: "post",
    data
  });
}

/**
 * 查重地址删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4049
 * @returns
 */
export function readingConfigDelete(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/configDelete",
    method: "post",
    data
  });
}

/**
 * 查重地址列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4050
 * @returns
 */
export function readingConfigList(data) {
  return request({
    url: BASE_URL + "/api/e/operation/reading/configList",
    method: "post",
    data
  });
}

/**
 * 馆藏列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4248
 * @returns
 */
export function getGcCollections(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/collections",
    method: "post",
    data
  });
}

// 活动查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4091
export function searchActivity(data) {
  return request({
    url: BASE_URL + "/api/e/activity/search",
    method: "post",
    data
  });
}

// 活动新增|修改
// http://192.168.1.132:4999/index.php?s=/29&page_id=4090
export function saveActivity(data) {
  return request({
    url: BASE_URL + "/api/e/activity/save",
    method: "post",
    data
  });
}

// 活动删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4092
export function delActivity(data) {
  return request({
    url: BASE_URL + "/api/e/activity/del",
    method: "post",
    data
  });
}

// 活动主界面导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4148
export const activityExpo = () => "/api/e/activity/activityExcel";

// 活动报名数据列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4093
export function searchRegistration(data) {
  return request({
    url: BASE_URL + "/api/e/activity/applyData",
    method: "post",
    data
  });
}

// 活动切换状态
// http://192.168.1.132:4999/index.php?s=/29&page_id=4095
export function updZtai(data) {
  return request({
    url: BASE_URL + "/api/e/activity/updZtai",
    method: "post",
    data
  });
}

// 活动签到列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4094
export function searchCheckIn(data) {
  return request({
    url: BASE_URL + "/api/e/activity/signinData",
    method: "post",
    data
  });
}

// 报名导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4149
export const RegistrationExpo = () => "/api/e/activity/applyExcel";

// 签到导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4150
export const CheckInExpo = () => "/api/e/activity/signExcel";

// 系统公告查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4171
export function searchSystem(data) {
  return request({
    url: BASE_URL + "/api/e/notice/sys/search",
    method: "post",
    data
  });
}

// 系统公告切换状态
// http://192.168.1.132:4999/index.php?s=/29&page_id=4174
export function sysZtai(data) {
  return request({
    url: BASE_URL + "/api/e/notice/sys/updZtai",
    method: "post",
    data
  });
}

// 系统公告新增编辑
// http://192.168.1.132:4999/index.php?s=/29&page_id=4170
export function saveSystemGG(data) {
  return request({
    url: BASE_URL + "/api/e/notice/sys/save",
    method: "post",
    data
  });
}

// 系统公告删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4172
export function SystemDel(data) {
  return request({
    url: BASE_URL + "/api/e/notice/sys/del",
    method: "post",
    data
  });
}

// 系统公告导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4173
export const systemExpo = () => "/api/e/notice/sys/excel";

// 读者公告查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4176
export function searchDzgg(data) {
  return request({
    url: BASE_URL + "/api/e/notice/reader/search",
    method: "post",
    data
  });
}

// 读者公告保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4175
export function saveDzgg(data) {
  return request({
    url: BASE_URL + "/api/e/notice/reader/save",
    method: "post",
    data
  });
}

// 读者公告删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4175
export function delDzgg(data) {
  return request({
    url: BASE_URL + "/api/e/notice/reader/del",
    method: "post",
    data
  });
}

// 读者公告切换状态
// http://192.168.1.132:4999/index.php?s=/29&page_id=4174
export function dzZtai(data) {
  return request({
    url: BASE_URL + "/api/e/notice/reader/updZtai",
    method: "post",
    data
  });
}

// 读者公告列表导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4178
export const dztemExpo = () => "/api/e/notice/reader/excel";

// 套录书目
// http://192.168.1.132:4999/index.php?s=/29&page_id=2838
export function catalogueDownload(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/download",
    method: "post",
    data
  });
}

// 运营--书库保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4244
export function updateYunBook(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/table/save",
    method: "post",
    data
  });
}

// 运营--书库删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4245
export function delYunBook(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/table/del",
    method: "post",
    data
  });
}

// 运营--书库查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4246
export function searchYunBook(data) {
  return request({
    url: BASE_URL + "/api/e/operation/yunbook/table/search",
    method: "post",
    data
  });
}

//运营-馆-用户-藏址
// http://192.168.1.132:4999/index.php?s=/29&page_id=4347
export function listFromUser(data) {
  return request({
    url: BASE_URL + "/api/e/task/listFromUser",
    method: "post",
    data
  });
}

//运营-馆-藏址-用户
// http://192.168.1.132:4999/index.php?s=/29&page_id=4348
export function listFromCz(data) {
  return request({
    url: BASE_URL + "/api/e/task/listFromCz",
    method: "post",
    data
  });
}

// 运营--任务管理-节点保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4280
export function saveAction(data) {
  return request({
    url: BASE_URL + "/api/e/task/action/save",
    method: "post",
    data
  });
}

// 运营--任务管理-节点查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4281
export function searchAction(data) {
  return request({
    url: BASE_URL + "/api/e/task/action/search",
    method: "post",
    data
  });
}

// 运营--任务管理-节点查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4282
export function delAction(data) {
  return request({
    url: BASE_URL + "/api/e/task/action/del",
    method: "post",
    data
  });
}

// 运营--任务管理-流程添加
// http://192.168.1.132:4999/index.php?s=/29&page_id=4283
export function saveProcess(data) {
  return request({
    url: BASE_URL + "/api/e/task/process/save",
    method: "post",
    data
  });
}

// 运营--任务管理-流程查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4284
export function searchProcess(data) {
  return request({
    url: BASE_URL + "/api/e/task/process/search",
    method: "post",
    data
  });
}

// 运营--任务管理-流程添加
// http://192.168.1.132:4999/index.php?s=/29&page_id=4285
export function delProcess(data) {
  return request({
    url: BASE_URL + "/api/e/task/process/del",
    method: "post",
    data
  });
}

// 运营--任务计划列表-查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4287
export function searchPlan(data) {
  return request({
    url: BASE_URL + "/api/e/task/plan/search",
    method: "post",
    data
  });
}

// 运营--任务计划列表-保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4286
export function searchSave(data) {
  return request({
    url: BASE_URL + "/api/e/task/plan/save",
    method: "post",
    data
  });
}

// 运营--任务计划列表-删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4288
export function searchDel(data) {
  return request({
    url: BASE_URL + "/api/e/task/plan/del",
    method: "post",
    data
  });
}

// 任务单查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4291
export function searchRenwd(data) {
  return request({
    url: BASE_URL + "/api/e/task/order/search/simple",
    method: "post",
    data
  });
}

// 任务单详情
// http://192.168.1.132:4999/index.php?s=/29&page_id=4292
export function detailRenwd(data) {
  return request({
    url: BASE_URL + "/api/e/task/order/search/detail",
    method: "post",
    data
  });
}

// 运营反馈列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4293
export function feedbackList(data) {
  return request({
    url: BASE_URL + "/api/e/task/plan/feedback/list",
    method: "post",
    data
  });
}

// 运营反馈列表--检测绑定
// http://192.168.1.132:4999/index.php?s=/29&page_id=4302
export function isBangding(data) {
  return request({
    url: BASE_URL + "/api/e/task/plan/isBinding",
    method: "post",
    data,
    noMsg: true
  });
}
// ========================图书运营管理===============================

// ========林晓宏==========
// 读者上架请求--图书上下架请求管理
// http://192.168.1.132:4999/index.php?s=/29&page_id=4536
export function selectRequestShevles(data) {
  return request({
    url: BASE_URL + "/api/e/flow/bookShevles/selectRequestShevles",
    method: "post",
    data
  });
}

// 读者上架请求--图书上架处理
// http://192.168.1.132:4999/index.php?s=/29&page_id=4537
export function shevlesManage(data) {
  return request({
    url: BASE_URL + "/api/e/flow/bookShevles/shevlesManage",
    method: "post",
    data
  });
}

// 背包清单--查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4717
export function backPackSearch(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/backPackSearch",
    method: "post",
    data
  });
}

// 背包清单--导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4718
export const backPackSearchExport = () => "/api/e/sxj/backPackSearch/export";

// ========================图书运营管理===============================

// ========梁启丽==========

// 运营图书藏址变更--藏址变更
// http://192.168.1.132:4999/index.php?s=/29&page_id=4445
export function sxjczbg(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/czbg",
    method: "post",
    data
  });
}
// 运营图书藏址查重--藏址查重
// http://192.168.1.132:4999/index.php?s=/29&page_id=4451
export function sxjczcc(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/czcc",
    method: "post",
    data
  });
}
// 运营疑问列表--疑问查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4449
export function selectDoubt(data) {
  return request({
    url: BASE_URL + "/api/e/operation/user/selectDoubt",
    method: "post",
    data
  });
}
// 运营图书疑问列表--疑问删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4448
export function doubtDelete(data) {
  return request({
    url: BASE_URL + "/api/e/operation/user/doubtDelete",
    method: "post",
    data
  });
}
// 运营图书疑问列表--疑问保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4446
export function doubtSave(data) {
  return request({
    url: BASE_URL + "/api/e/operation/user/doubtSave",
    method: "post",
    data
  });
}
// 运营图书疑问列表--获取疑问
// http://192.168.1.132:4999/index.php?s=/29&page_id=4447
export function getDoubt(data) {
  return request({
    url: BASE_URL + "/api/e/operation/user/getDoubt",
    method: "post",
    data
  });
}

// 运营图书藏址变更--批次获取
// http://192.168.1.132:4999/index.php?s=/29&page_id=4453
export function getPcinfoList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/pcinfoList",
    method: "post",
    data
  });
}

// ========梁伟杰========

// 批次管理列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4453
export function pcinfoList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/pcinfoList",
    method: "post",
    data
  });
}

// 批次管理删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4454
export function pcinfoDel(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/pcinfoDel",
    method: "post",
    data
  });
}

// 批次管理新增编辑
// http://192.168.1.132:4999/index.php?s=/29&page_id=4452
export function pcinfoSave(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/pcinfoSave",
    method: "post",
    data
  });
}

// 批次书目总数
// http://192.168.1.132:4999/index.php?s=/29&page_id=4455
export function bookCount(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/bookCount",
    method: "post",
    data,
    noMsg: true
  });
}

// 批次---上下架派发
// http://192.168.1.132:4999/index.php?s=/29&page_id=4457
export function sxjSave(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/save",
    method: "post",
    data
  });
}

// 上下架派发--检测是新增还是编辑已有
// http://192.168.1.132:4999/index.php?s=/29&page_id=4473
export function existSxjinfo(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/existSxjinfo",
    method: "post",
    data
  });
}

// 上下架派发对象----按用户
// http://192.168.1.132:4999/index.php?s=/29&page_id=4466
export function sxjFromUser(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/listFromUser",
    method: "post",
    data
  });
}

// 上下架派发对象----藏址
// http://192.168.1.132:4999/index.php?s=/29&page_id=4467
export function sxjFromCz(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/listFromCz",
    method: "post",
    data
  });
}

// 上下架清单列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4465
export function sxjqdList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/list",
    method: "post",
    data
  });
}

// 上下架清单原藏址列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4475
export function orgczList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxjList/czList0",
    method: "post",
    data
  });
}

// 上下架清单现藏址列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4476
export function nowczList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxjList/czList1",
    method: "post",
    data
  });
}

// 上下架清单列表--导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4468
export const sxjqdListExp = () => "/api/e/sxj/selectSxjList/export";

// 上下架派发批量处理
// http://192.168.1.132:4999/index.php?s=/29&page_id=4474
export function updateBatch(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/updateBatch",
    method: "post",
    data
  });
}

// 上下级清单列表编辑
export function sxjListupdate(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxjList/update",
    method: "post",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4487

// 上下架异常清单列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4471
export function errorList(data) {
  return request({
    url: BASE_URL + "/api/e/bookOperation/sxj/errorList",
    method: "post",
    data
  });
}

// 上下架异常清单列表--导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4472
export const errorListExp = () => "/api/e/bookOperation/sxjError/exportExcel";

// 用户推广--推广记录
// http://192.168.1.132:4999/index.php?s=/29&page_id=4513
export function inviteUser(data) {
  return request({
    url: BASE_URL + "/api/third/appInvite/inviteUser",
    method: "post",
    data
  });
}

// 用户推广--用户邀请列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4515
export function userPromotionRecord(data) {
  return request({
    url: BASE_URL + "/api/third/appInvite/userPromotionRecord",
    method: "post",
    data
  });
}

// 用户推广--推广记录导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4514
export const userPromotionRecordExcel = () =>
  "/api/third/appInvite/userPromotionRecord/excel";

// 帮助与反馈--用户反馈管理
// http://192.168.1.132:4999/index.php?s=/29&page_id=4533
export function feedbackSearch(data) {
  return request({
    url: BASE_URL + "/api/e/operation/feedback/search",
    method: "post",
    data
  });
}

// 帮助与反馈--反馈处理
// http://192.168.1.132:4999/index.php?s=/29&page_id=4535
export function feedbackMake(data) {
  return request({
    url: BASE_URL + "/api/e/operation/feedback/make",
    method: "post",
    data
  });
}

// 帮助与反馈--反馈详情
// http://192.168.1.132:4999/index.php?s=/29&page_id=4534
export function feedbackDetail(data) {
  return request({
    url: BASE_URL + "/api/e/operation/feedback/detail",
    method: "post",
    data
  });
}

// ================重做后的上下架==============
// 批次列表下拉框
// http://192.168.1.132:4999/index.php?s=/29&page_id=4716
export function getSxjpcList(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/getSxjpcList",
    method: "post",
    data
  });
}

// 批次列表新增
// http://192.168.1.132:4999/index.php?s=/29&page_id=4704
export function pcListAdd(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/pcinfo/add",
    method: "post",
    data
  });
}
// 上下架清单重做
//http://192.168.1.132:4999/index.php?s=/29&page_id=4710
export function selectSxjList(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/selectSxjList/list",
    method: "post",
    data
  });
}

// 批次列表编辑
// http://192.168.1.132:4999/index.php?s=/29&page_id=4703
export function pcListUpdate(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/pcinfo/update",
    method: "post",
    data
  });
}

/**
 * 上架派发-图书查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4706
 * @returns
 */
export function sjpfBookSearch(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/sj/bookSearch",
    method: "post",
    data
  });
}

/**
 * 上架-显示已派发数据列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4722
 * @returns
 */
export function sjpfBookList(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/sj/pcinfo/marc/list",
    method: "post",
    data
  });
}

/**
 * 上架-删除已派发数据
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4723
 * @returns
 */
export function sjpfBookListDelete(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/sj/pcinfo/marc/delete",
    method: "post",
    data
  });
}

// 批次列表查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4720
export function pcglList(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/pcinfo/list",
    method: "post",
    data
  });
}

// 下架处理重做
//http://192.168.1.132:4999/index.php?s=/29&page_id=4713
export function dealWith(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/book/dealWith",
    method: "post",
    data
  });
}

/**
 * 上架派发-保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4707
 * @returns
 */
export function sjpfBookSave(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/sj/pc/marcid/add",
    method: "post",
    data
  });
}

/**
 * 确认派发
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4721
 * @returns
 */
export function sjpfBookChange(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/sj/update/pcinfo/status",
    method: "post",
    data
  });
}

// 批次列表删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4705
export function pcglDel(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/pcinfo/delete",
    method: "post",
    data
  });
}

/**
 * 下架派发-图书查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4708
 * @returns
 */
export function xjpfBookSearch(data) {
  return request({
    url: BASE_URL + "/api/e/sxj/xj/bookSearch",
    method: "post",
    data
  });
}
