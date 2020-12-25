/*
 * @Description: 编目模块接口
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-12 11:20:39
 * @LastEditors: chenming.feng
 * @LastEditTime : 2020-02-14 11:02:00
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/** 文献编目 开始 **/

/**
 * 编目-获取索书号
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2801
 * @returns
 */
export function getSSHao(data) {
  return request({
    url: BASE_URL + "/api/e/book/getSshao",
    method: "post",
    data
  });
}

/**
 * 回溯建库-书目列表
 * 馆藏批次书目列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2812
 * http://192.168.1.132:4999/index.php?s=/29&page_id=4615 参数不同
 * @returns
 */
export function catalogueList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/list",
    method: "post",
    data
  });
}

/**
 * 回溯建库-根据书目编号推荐书目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2827
 * @returns
 */
export function catalogueRecommend(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/recommend",
    method: "post",
    data
  });
}

/**
 * 回溯建库-根据书目编号删除书目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2828
 * @returns
 */
export function catalogueDelete(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/delete",
    method: "post",
    data
  });
}

/**
 * 回溯建库-套录书目列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2838
 * @returns
 */
export function catalogueDownload(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/download",
    method: "post",
    data
  });
}

/**
 * 回溯建库-书目审校审核
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2848
 * @returns
 */
export function catalogueAudit(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/audit",
    method: "post",
    data
  });
}

/**
 * 回溯建库-书目取消审校审核
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4618
 * @returns
 */
export function catalogueUnAudit(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/unAudit",
    method: "post",
    data
  });
}

/**
 * 回溯建库-书目馆藏
 * 数据处理-馆藏批次书目馆藏
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2817
 * http://192.168.1.132:4999/index.php?s=/29&page_id=4616
 * @returns
 */
export function bookListByCatalogue(data) {
  return request({
    url: BASE_URL + "/api/e/book/listByCatalogue",
    method: "post",
    data
  });
}

/**
 * 回溯建库-馆藏新增初始化
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2819
 * @returns
 */
export function bookBookDefault(data) {
  return request({
    url: BASE_URL + "/api/e/book/bookDefault",
    method: "post",
    data
  });
}

/**
 * 回溯建库-根据书册编号获取书册馆藏信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2820
 * @returns
 */
export function bookGetBookById(data) {
  return request({
    url: BASE_URL + "/api/e/book/getBookById",
    method: "post",
    data
  });
}

/**
 * 回溯建库-根据书册编号删除馆藏
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2821
 * @returns
 */
export function bookDelete(data) {
  return request({
    url: BASE_URL + "/api/e/book/delete",
    method: "post",
    data
  });
}

/**
 * 回溯建库-馆藏保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2822
 * @returns
 */
export function bookSave(data) {
  return request({
    url: BASE_URL + "/api/e/book/save",
    method: "post",
    data,
    needEmpty: true
  });
}

/** 文献编目 结束 **/

/**
 * 套录/新增/多卷
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2842
 * @returns
 */
export function catalogDownloadSave(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/download/save",
    method: "post",
    noNeedQS: true,
    data: data,
    noMsg: true
  });
}

/**
 * 复本
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2843
 * @returns
 */
export function catalogCoppy(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/coppy",
    noNeedQS: true,
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 多卷查重
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2885
 * @returns
 */
export function catalogMultireelCheck(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/multireelCheck",
    method: "post",
    data
  });
}

/** 通用编目 **/

/**
 * 简单编目-获取数据
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2880
 * @returns
 */
export function simpleGetMarcTyinfo(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/simple/getMarcTyinfo",
    method: "post",
    data
  });
}

/**
 * 简单编目-保存操作
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2881
 * @returns
 */
export function catalogSimpleSave(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/simple/save",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 简单编目-条目编目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2947
 * @returns
 */
export function itemsGetMarcTyinfo(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/items/getMarcTyinfo",
    method: "post",
    data
  });
}

/**
 * 简单编目-条目编目保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2948
 * @returns
 */
export function catItemsSave(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/items/save",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 简单编目-MARC编目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2954
 * @returns
 */
export function marcGetMarcTyinfo(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/marc/getMarcTyinfo",
    method: "post",
    data
  });
}

/**
 * 简单编目-MARC编目保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2959
 * @returns
 */
export function catMarcSave(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/marc/save",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 简单编目-MARC信息套录
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2960
 * @returns
 */
export function catMarcDownload(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/marc/download",
    method: "post",
    data
  });
}

/**
 * 简单编目-MARC转字段列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2962
 * @returns
 */
export function catMarcDownloadFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/marc/download/fieldList",
    method: "post",
    data
  });
}
/**
 *
 *编目-编目统计-文献移送
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3050
 * @returns
 */
export function getCatalogueTransferList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/catalogueTransfer",
    method: "post",
    data
  });
}
/**
 *
 *编目-编目统计-文献移送
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3050
 * @returns
 */
export function catalogueTransferDeal(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/catalogueTransfer/deal",
    method: "post",
    data
  });
}
/**
 * 编目-编目统计-编目统计
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3039
 * @returns
 */
export function catalogStatistics(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/catalogStatistics",
    method: "post",
    data
  });
}

/**
 * 编目-编目统计-操作员列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3668
 * @returns
 */
export function catalogStatisticsUserList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/catalogStatisticsUserList",
    method: "post",
    data
  });
}

/**
 * 编目-编目统计-书标打印列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3020
 * @returns
 */
export function catlabelPrint(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelPrint",
    method: "post",
    data
  });
}

/**
 * 征订书目-MARC导入
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3108
 * @returns
 */
export function marcImport(formData) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcImport",
    method: "post",
    noNeedQS: true,
    isformData: true,
    data: formData
  });
}

/**
 * 直接编目列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3077
 * @returns
 */
export function getDirectCatalogList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/directCatalogList",
    method: "post",
    data
  });
}

/**
 * 查重书目列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3105
 * @returns
 */
export function checkRepetitionList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/checkRepetitionList",
    method: "post",
    data
  });
}

/**
 * 合并书目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3107
 * @returns
 */
export function mergeCatalogue(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/CatalogueMerge",
    method: "post",
    data
  });
}

/**
 * 根据书目编号获取MARC信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3099
 * @returns
 */
export function getCatalogueMarc(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/CatalogueMarc",
    method: "post",
    data
  });
}

/**
 * 预订单|退订单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3142
 * @returns
 */
export function getYdReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/yd",
    method: "post",
    data
  });
}

/**
 * 验收单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3143
 * @returns
 */
export function getYsReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/ys",
    method: "post",
    data
  });
}

/**
 * 催缺单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3144
 * @returns
 */
export function getCqdReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/urging",
    method: "post",
    data
  });
}

/**
 * 采访统计 - 个别财产帐
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3157
 * @returns
 */
export function getGbcczReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/aloneMoney",
    method: "post",
    data
  });
}

/**
 * 采访统计 - 总括财产帐
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3158
 * @returns
 */
export function getZkcczReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/allMoney",
    method: "post",
    data
  });
}

/**
 * 采访统计 - 预订分类统计
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3163
 * @returns
 */
export function getYdflReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/bookingClassify",
    method: "post",
    data
  });
}

/**
 * 采访统计 - 验收分类统计
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3164
 * @returns
 */
export function getYsflReport(data) {
  return request({
    url: BASE_URL + "/api/e/interview/report/acceptanceClassify",
    method: "post",
    data
  });
}

/**
 * 种次号查缺
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3237
 * @returns
 */
export function checkZchao(data) {
  return request({
    url: BASE_URL + "/api/e/book/checkZchao",
    method: "post",
    data
  });
}

/**
 * 捐赠图书条形码
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3947
 * @returns
 */
export function getDonateBarCode(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/donate",
    method: "post",
    data
  });
}

/**
 * 书目转换 - marctyinfo 转换为 fieldList
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3237
 * @returns
 */
export function marcTyInfoToFieldList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/marcTyInfoToFieldList",
    method: "post",
    data,
    noNeedQS: true
  });
}

/**
 * 书目转换2 - fieldList 转换为 marctyinfo
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3237
 * @returns
 */
export function fieldListToMarcTyInfo(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/fieldListToMarcTyInfo",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 书目转换 - 简单编目转条目模式
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3395
 * @returns
 */
export function marcTyInfoToItemList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/marcTyInfoToItemList",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 书目转换 - marc模式切到条目编目
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3541
 * @returns
 */
export function fieldListToItemList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/fieldListToItemList",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * isbn获取出版信息
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3412
 * @returns
 */
export function getPublishWithISBN(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/getPublish",
    method: "post",
    data
  });
}

/**
 * 书标生成
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3445
 * @returns
 */
export function labelPrintMakePdf(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelPrintMakePdf",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 条码校验（文件）
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3444
 * @returns
 */
export function labelFileAdd(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelFileAdd",
    method: "post",
    isformData: true,
    noNeedQS: true,
    data
  });
}

/**
 * 条码校验（单个）
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3443
 * @returns
 */
export function checkBarcode(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/checkBarcode",
    method: "post",
    data
  });
}

/**
 * 书标排版查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3446
 * @returns
 */
export function labelPrintFind(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelPrintFind",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 书标排版删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3447
 * @returns
 */
export function labelPrintDel(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelPrintDel",
    method: "post",
    data
  });
}

/**
 * 书标排版保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3448
 * @returns
 */
export function labelPrintSave(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/labelPrintSave",
    method: "post",
    data,
    needEmpty: true
  });
}

/**
 * 套录书目转换
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3477
 * @returns
 */
export function downLoadToMarc(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/downLoadToMarc",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * MARC模板切换
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3611
 * @returns
 */
export function templateSwitch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/templateSwitch",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 批次-增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3755
 * @returns
 */
export function addBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/addBatch",
    method: "post",
    data
  });
}

/**
 * 批次-改
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3756
 * @returns
 */
export function updateBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/updBatch",
    method: "post",
    data
  });
}

/**
 * 批次-删
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3757
 * @returns
 */
export function delBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/delBatch",
    method: "post",
    data
  });
}

/**
 * 批次-查
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3759
 * @returns
 */
export function searchBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/searchBatch",
    method: "post",
    data
  });
}

/**
 * 批次-导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3760
 * @returns
 */
export const exportMarcshuceByBatchs = () =>
  "/api/e/catalog/other/exportMarcshuceByBatchs";

// 捐赠列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3979
export function donateList(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/donateList",
    method: "post",
    data
  });
}

// 捐赠列表导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4068
export const donateListExp = () => "/api/e/catalog/other/donateExcel";

// 捐赠删除
// http://192.168.1.132:4999/index.php?s=/29&page_id=4070
export function donateListDel(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/donateDel",
    method: "post",
    data
  });
}

/**
 * MARC导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3975
 * @returns
 */
export function exportMarcCatalog(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/exportMarc",
    method: "post",
    data
  });
}

/**
 * 粘贴国图MARC数据
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4012
 * @returns
 */
export function analysisCatalogueNlc(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/catalogue/nlc",
    method: "post",
    data
  });
}

/**
 * 馆藏批量保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4581
 * @returns
 */
export function multiUpdateBatch(data) {
  return request({
    url: BASE_URL + "/api/e/book/updateBatch",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 馆藏信息批量获取
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4582
 * @returns
 */
export function getBookByBatchId(data) {
  return request({
    url: BASE_URL + "/api/e/book/getBookByBatchId",
    method: "post",
    data
  });
}

/**
 * 批量修改索书号
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4596
 * @returns
 */
export function updateBatchSshao(data) {
  return request({
    url: BASE_URL + "/api/e/book/updateBatchSshao",
    method: "post",
    noNeedQS: true,
    data
  });
}

/**
 * 判断是否有权限修改藏址
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4596
 * @returns
 */
export function checkLibUpdate(data) {
  return request({
    url: BASE_URL + "/api/p/comm/checkLibUpdate",
    method: "post",
    data
  });
}

/**
 * MARC馆藏批次保存
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4610
 * @returns
 */
export function saveMarcBookBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookBatch/save",
    method: "post",
    data
  });
}

/**
 * MARC馆藏批次删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4611
 * @returns
 */
export function delMarcBookBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookBatch/delete",
    method: "post",
    data
  });
}

/**
 * 获取MARC馆藏批次
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4612
 * @returns
 */
export function getMarcBookBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookBatch/getBatch",
    method: "post",
    data
  });
}

/**
 * MARC馆藏批次列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4613
 * @returns
 */
export function fetchMarcBookBatch(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookBatch/list",
    method: "post",
    data
  });
}

/**
 * MARC馆藏导入
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4614
 * @returns
 */
export function marcBookImport(formData) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookImport",
    method: "post",
    noNeedQS: true,
    isformData: true,
    data: formData,
    noMsg: true
  });
}

/**
 * MARC馆藏导入进度
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4630
 * @returns
 */
export function marcBookImportProcess(data) {
  return request({
    url: BASE_URL + "/api/e/catalog/other/marcBookImport/process",
    method: "post",
    data
  });
}
