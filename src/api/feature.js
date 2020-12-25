/*
 * @Description: 特色-专项流通接口
 * @Autor: wj.liang
 * @Date: 2019-11-22 15:53:12
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-01-16 18:08:01
 */
import request from "utils/request";
import { BASE_URL } from "utils/base";

//专项借还管理- 读者证号-加载当前借阅列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4395
export function currentBrw(data) {
  return request({
    url: BASE_URL + "/api/e/special/reader/currentBrw",
    method: "post",
    data
  });
}

// 专项借还管理-书籍查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4396
export function bookSelect(data) {
  return request({
    url: BASE_URL + "/api/e/special/bookSelect",
    method: "post",
    data
  });
}

// 专项借还管理-读者类型
// http://192.168.1.132:4999/index.php?s=/29&page_id=2796
export function readerType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/readerType",
    method: "post",
    data
  });
}

// 专项借还管理-归还
// http://192.168.1.132:4999/index.php?s=/29&page_id=4398

export function giveBack(data) {
  return request({
    url: BASE_URL + "/api/e/special/reader/giveBack",
    method: "post",
    data
  });
}

// 专项借还管理-续借
// http://192.168.1.132:4999/index.php?s=/29&page_id=4400

export function rennew(data) {
  return request({
    url: BASE_URL + "/api/e/special/reader/rennew",
    method: "post",
    data
  });
}

// 专项借还管理-借出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4397

export function borrow(data) {
  return request({
    url: BASE_URL + "/api/e/special/reader/borrow",
    method: "post",
    data
  });
}

// 专项借还管理-超期罚款
// http://192.168.1.132:4999/index.php?s=/29&page_id=4399
export function fine(data) {
  return request({
    url: BASE_URL + "/api/e/special/overDue/fine",
    method: "post",
    data
  });
}

// 专项流通参数列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4393
export function configList(data) {
  return request({
    url: BASE_URL + "/api/e/special/config/list",
    method: "post",
    data
  });
}

// 专项流通参数删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4392
export function configdelete(data) {
  return request({
    url: BASE_URL + "/api/e/special/config/delete",
    method: "post",
    data
  });
}

// 专项流通参数保存
// http://192.168.1.132:4999/index.php?s=/29&page_id=4390
export function configsave(data) {
  return request({
    url: BASE_URL + "/api/e/special/config/save",
    method: "post",
    data
  });
}

// 专项流通参数获取
// http://192.168.1.132:4999/index.php?s=/29&page_id=4391
export function getConfig(data) {
  return request({
    url: BASE_URL + "/api/e/special/config/getConfig",
    method: "post",
    data
  });
}

// 专项借还查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4407
export function cirLlist(data) {
  return request({
    url: BASE_URL + "/api/e/special/cir/list",
    method: "post",
    data
  });
}

// 专项借还查询导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4409
export const cirLlistExp = () => "/api/e/special/cir/list/export";

// 专项罚款列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=4402
export function fineList(data) {
  return request({
    url: BASE_URL + "/api/e/special/fine/list",
    method: "post",
    data
  });
}

// 操作员列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3670
export function userList(data) {
  return request({
    url: BASE_URL + "api/e/parameter/userList",
    method: "post",
    data
  });
}

// 专项罚款导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4403
export const fineListExp = () => "/api/e/special/fine/list/export";

// 专项收款
// http://192.168.1.132:4999/index.php?s=/29&page_id=4404
export function fineReceipt(data) {
  return request({
    url: BASE_URL + "/api/e/special/fine/receipt",
    method: "post",
    data
  });
}

// 专项退款
// http://192.168.1.132:4999/index.php?s=/29&page_id=4405
export function fineRefund(data) {
  return request({
    url: BASE_URL + "/api/e/special/fine/refund",
    method: "post",
    data
  });
}

// ============义工模块===============
/**
 * 义工管理 -- 义工签到、签退
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4384
 * @returns
 */
export function volunteerSignInOut(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/signInOut",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 义工签到、签退--签到数据
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4430
 * @returns
 */
export function volunteerSignInOutData(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/signInOutData",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 签到数据
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4385
 * @returns
 */
export function volunteerList(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/list",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 批量签退
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4386
 * @returns
 */
export function volunteerSignOut(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/signOut",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 批量签退--统计总数
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4426
 */
export function volunteerSignOutCount(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/signOutCount",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 批量删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4387
 * @returns
 */
export function volunteerDel(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/del",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 编辑
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4412
 * @returns
 */
export function volunteerEdit(data) {
  return request({
    url: BASE_URL + "/api/e/special/volunteer/edit",
    method: "post",
    data
  });
}

/**
 * 义工管理 -- 签到数据-导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4388
 * @returns
 */
export const volunteerExportExcel = () =>
  "/api/e/special/volunteer/exportExcel";

export function docxExport(data) {
  return request({
    url: BASE_URL + "api/e/special/volunteer/exportWord",
    method: "post",
    data
  });
}
