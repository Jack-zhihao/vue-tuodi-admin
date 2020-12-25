/*
 * @Description: 其他接口
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-29 15:29:18
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-11-01 15:20:09
 */

import request from "utils/request";
import Cookies from "js-cookie";
// 云选书接口地址从后台返回的 cookie 获取
const YUNBOOK_URL = Cookies.get("yunService");
/**
 * 排行榜类型列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3916
 * @returns
 */
export function getLibBorrowRank(params) {
  return request({
    url: YUNBOOK_URL + "/jd/get/bookTopType",
    method: "get",
    params
  });
}

/**
 * 图书分类-列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3892
 * @returns
 */
export function getCategoryList(params) {
  return request({
    url: YUNBOOK_URL + "/jd/get/categoryList",
    method: "get",
    params
  });
}

/**
 * 创建书目库
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4015
 * @returns
 */
export function createTable(data) {
  return request({
    url: YUNBOOK_URL + "/third/createTable",
    method: "POST",
    data
  });
}

/**
 * 书目导入
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4043
 * @returns
 */
export function bookImport(data) {
  return request({
    url: YUNBOOK_URL + "/excel/data/book/import",
    method: "POST",
    data
  });
}

/**
 * 所有书目库
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4013
 * @returns
 */
export function getTableList(data) {
  return request({
    url: YUNBOOK_URL + "/third/dbs",
    method: "POST",
    data
  });
}

/**
 * 库中分类
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4014
 * @returns
 */
export function getTableCategories(data) {
  return request({
    url: YUNBOOK_URL + "/third/categorys",
    method: "POST",
    data
  });
}

/**
 * 库中分类
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4042
 * @returns
 */
export function excelUpload(data) {
  return request({
    url: YUNBOOK_URL + "/excel/upload",
    method: "POST",
    data,
    noNeedQS: true,
    isformData: true
  });
}

// 云图书--书目查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4229
export function searchBookItem(data) {
  return request({
    url: YUNBOOK_URL + "/third/manager/search",
    method: "post",
    data
  });
}

// 云图书--书库编辑新增
// http://192.168.1.132:4999/index.php?s=/29&page_id=4230
export function yunbookItemsave(data) {
  return request({
    url: YUNBOOK_URL + "/third/manager/save",
    method: "post",
    data
  });
}

// 云图书--书目删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4242
export function yunbookItemdel(data) {
  return request({
    url: YUNBOOK_URL + "/third/manager/delete",
    method: "post",
    data
  });
}

// 云图书--书库删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4231
export function yunbookTableDel(data) {
  return request({
    url: YUNBOOK_URL + "/third/manager/table/delete",
    method: "post",
    data
  });
}
