/*
 * @Description: 数据模块
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-07-26 09:40:27
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-30 11:25:33
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 馆借阅排行
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3774
 * @returns
 */
export function getLibBorrowRank(data) {
  return request({
    url: BASE_URL + "/api/e/data/borrow/analyze/libBorrowRank",
    method: "post",
    data
  });
}

/**
 * 馆借阅排行-导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3777
 * @returns
 */
export const exportLibBorrowRankExcel = () =>
  "/api/e/data/borrow/analyze/libBorrowRank/exportExcel";

/**
 * 馆读者单位借阅排行
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3775
 * @returns
 */
export function getLibReaderUnitRank(data) {
  return request({
    url: BASE_URL + "/api/e/data/borrow/analyze/libReaderUnitRank",
    method: "post",
    data
  });
}

/**
 * 馆读者单位借阅排行-导出
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3778
 * @returns
 */
export const exportLibReaderUnitRank = () =>
  "/api/e/data/borrow/analyze/libReaderUnitRank/exportExcel";

/**
 * 地区-树状图
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3720
 * @returns
 */
export function getAreaTreeData(data) {
  return request({
    url: BASE_URL + "/api/e/area/treeArea",
    method: "post",
    data
  });
}

/**
 * 地区-树状图2
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3766
 * @returns
 */
export function getAreaTreeDataWithout(data) {
  return request({
    url: BASE_URL + "/api/e/area/treeAreaNode",
    method: "post",
    data
  });
}

/**
 * 地区-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3719
 * @returns
 */
export function addAreaData(data) {
  return request({
    url: BASE_URL + "/api/e/area/addAreaNode",
    method: "post",
    data
  });
}

/**
 * 地区-更新
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3721
 * @returns
 */
export function updateAreaData(data) {
  return request({
    url: BASE_URL + "/api/e/area/updAreaNode",
    method: "post",
    data
  });
}

/**
 * 地区-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3722
 * @returns
 */
export function deleteAreaData(data) {
  return request({
    url: BASE_URL + "/api/e/area/delAreaNode",
    method: "post",
    data
  });
}

/**
 * 馆-查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3723
 * @returns
 */
export function getLibsArea(data) {
  return request({
    url: BASE_URL + "/api/e/area/libsArea",
    method: "post",
    data
  });
}

/**
 * 馆-区域编辑
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3724
 * @returns
 */
export function updateLibArea(data) {
  return request({
    url: BASE_URL + "/api/e/area/updLibArea",
    method: "post",
    data
  });
}

/**
 * 馆-区域查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3727
 * @returns
 */
export function searchLibArea(data) {
  return request({
    url: BASE_URL + "/api/e/area/treeNode",
    method: "post",
    data
  });
}

// 树形馆的对应数量
// http://192.168.1.132:4999/index.php?s=/29&page_id=3749
export function treeLibCount(data) {
  return request({
    url: BASE_URL + "/api/e/data/areaCount",
    method: "post",
    data
  });
}

// 数据总览echarts图的数据
// http://192.168.1.132:4999/index.php?s=/29&page_id=3750
export function echartData(data) {
  return request({
    url: BASE_URL + "/api/e/data/menuDateShow",
    method: "post",
    data
  });
}

// 获取馆列表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3762
export function searchLib(data) {
  return request({
    url: BASE_URL + "/api/e/data/libsArea",
    method: "post",
    data
  });
}

// 馆藏总览vchart数据
// http://192.168.1.132:4999/index.php?s=/29&page_id=3767
export function vchartCollect(data) {
  return request({
    url: BASE_URL + "/api/e/data/marchuceDataShow",
    method: "post",
    data
  });
}

// 馆藏总览-导出vchartexcel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3768
export const vchartCollectExcel = () =>
  "/api/e/data/marchuceDataShow/exportExcel";

// 馆藏总览大类表格
// http://192.168.1.132:4999/index.php?s=/29&page_id=3769
export function classify(data) {
  return request({
    url: BASE_URL + "/api/e/data/marchuceDataShowClassify",
    method: "post",
    data
  });
}

// 馆藏总览五大部类大类表格
// http://192.168.1.132:4999/index.php?s=/29&page_id=3769
export function classifyFive(data) {
  return request({
    url: BASE_URL + "/api/e/data/marchuceDataShow/ClassifyFive",
    method: "post",
    data
  });
}

// 馆藏总览大类导出excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3770
export const classifyExcel = () =>
  "/api/e/data/marchuceDataShowClassify/exportExcel";

// 馆藏总览五大部类导出excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3770
export const classifyFiveExcel = () =>
  "/api/e/data/marchuceDataShow/ClassifyFive/exportExcel";

// 馆藏分析--流通藏书比/种次比
// http://192.168.1.132:4999/index.php?s=/29&page_id=3764
export function circulation_collect(data) {
  return request({
    url: BASE_URL + "/api/e/data/analyze/cirBook",
    method: "post",
    data
  });
}

// 流通藏书比-导出excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3772
export const circulation_collect_excel = () =>
  "/api/e/data/analyze/cirBook/exportExcel";

// 馆藏分析--文献入藏情况
// http://192.168.1.132:4999/index.php?s=/29&page_id=3765
export function literature_collect(data) {
  return request({
    url: BASE_URL + "/api/e/data/analyze/bookIns",
    method: "post",
    data
  });
}

// 文献入藏情况-导出excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3771
export const literature_collect_excel = () =>
  "/api/e/data/analyze/bookIns/exportExcel";

// 流通种次比-导出excel-copy
// http://192.168.1.132:4999/index.php?s=/29&page_id=3773
export const circulation__kinds_excel = () =>
  "/api/e/data/analyze/cirBook/cirKind/exportExcel";

// 借阅总览整体指标
// http://192.168.1.132:4999/index.php?s=/29&page_id=3785
export function borrowTarget(data) {
  return request({
    url: BASE_URL + "/api/e/data/borrow/analyze/globalIndex",
    method: "post",
    data
  });
}

// 借阅趋势
// http://192.168.1.132:4999/index.php?s=/29&page_id=3786
export function borrowTrend(data) {
  return request({
    url: BASE_URL + "/api/e/data/borrow/analyze/trend",
    method: "post",
    data
  });
}

// 借阅趋势导出表
// http://192.168.1.132:4999/index.php?s=/29&page_id=3787
export const borrowTrendExport = () =>
  "/api/e/data/borrow/analyze/trend/exportExcel";

// 借阅分析（读者借阅率和文献流通率）
// http://192.168.1.132:4999/index.php?s=/29&page_id=3780
export function borrowAnalysis(data) {
  return request({
    url: BASE_URL + "/api/e/data/borrow/broAnalyze",
    method: "post",
    data
  });
}

// 读者借阅率，导出excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3782
export const readerBRateExport = () =>
  "/api/e/data/borrow/broAnalyze/readerBroRateExp";

// 文献流通率,导出Excel
// http://192.168.1.132:4999/index.php?s=/29&page_id=3783
export const booksCirculationExport = () =>
  "/api/e/data/borrow/broAnalyze/docBroRateExp";

// 22分类Top10xls
// http://192.168.1.132:4999/index.php?s=/29&page_id=3784
export const classifyTopTenExp = () =>
  "/api/e/data/borrow/broAnalyze/classifyTop10Exp";

// 馆藏分析--达标情况
// http://192.168.1.132:4999/index.php?s=/29&page_id=3809
export function standardStatus(data) {
  return request({
    url: BASE_URL + "/api/e/data/person/libAnalysis/targetSituation",
    method: "post",
    data
  });
}

// 达标情况导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3812
export const standardStatusExp = () =>
  "/api/e/data/person/libAnalysis/targetSituation/exportExcel";

// 人员分析--馆读者总览
// http://192.168.1.132:4999/index.php?s=/29&page_id=3796
export function libReader(data) {
  return request({
    url: BASE_URL + "/api/e/data/person/analyze/reader",
    method: "post",
    data
  });
}

// 人员分析--馆读者总览导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3797
export const libReaderExp = () =>
  "/api/e/data/person/analyze/reader/exportExcel";

// 人员分析--馆读者详情
// http://192.168.1.132:4999/index.php?s=/29&page_id=3798
export function libReaderDetail(data) {
  return request({
    url: BASE_URL + "/api/e/data/person/analyze/readerDetail",
    method: "post",
    data
  });
}

// 人员分析--馆读者单位导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3799
export const libReaderUnitExp = () =>
  "/api/e/data/person/analyze/readerUnit/exportExcel";

// 人员分析--馆读者类型导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3800
export const libReaderTypeExp = () =>
  "/api/e/data/person/analyze/readerType/exportExcel";

// 人员分析-性别分布、最受欢迎图书、年龄结构三张图数据
// http://192.168.1.132:4999/index.php?s=/29&page_id=3804
export function personSexTop10Age(data) {
  return request({
    url: BASE_URL + "/api/e/data/person/analyze/personSexTop10Age",
    method: "post",
    data
  });
}

// 人员分析-年龄结构导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3805
export const ageStructureExp = () =>
  "/api/e/data/person/analyze/readerAge/exportExcel";

// 人员分析-性别占比导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3806
export const sexExp = () => "/api/e/data/person/analyze/sexPercent/exportExcel";

// 人员分析-学历结构导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=3811
export const EducationExp = () =>
  "/api/e/data/person/analyze/education/exportExcel";

// 人员分析-学历结构
// http://192.168.1.132:4999/index.php?s=/29&page_id=3810
export function Education(data) {
  return request({
    url: BASE_URL + "/api/e/data/person/analyze/education",
    method: "post",
    data
  });
}

/**
 * 书目查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4417
 * @returns
 */
export function searchCatalogue(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchCatalogue",
    method: "post",
    data
  });
}

// 书目导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4427
export const searchCatalogueExcel = () => "/api/e/access/searchCatalogue/excel";

/**
 * 馆藏查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4418
 * @returns
 */
export function searchCollection(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchCollection",
    method: "post",
    data
  });
}

// 馆藏导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4428
export const searchCollectionExcel = () =>
  "/api/e/access/searchCollection/excel";

/**
 * 流通查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4419
 * @returns
 */
export function searchCir(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchCir",
    method: "post",
    data
  });
}

// 流通导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4429
export const searchCirExcel = () => "/api/e/access/searchCir/excel";

/**
 * 用户查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4431
 * @returns
 */
export function searchUser(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchUser",
    method: "post",
    data
  });
}

// 用户导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4432
export const searchUserExcel = () => "/api/e/access/searchUser/export";

/**
 * 读者数据查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4458
 * @returns
 */
export function searchReader(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchReader",
    method: "post",
    data
  });
}

// 读者数据导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4459
export const searchReaderExport = () => "/api/e/access/searchReader/export";

/**
 * 读者类型查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4460
 * @returns
 */
export function searchReaderType(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchReaderType",
    method: "post",
    data
  });
}

// 读者类型导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4461
export const searchReaderTypeExport = () =>
  "/api/e/access/searchReaderType/export";

/**
 * 藏址查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4462
 * @returns
 */
export function searchLibraryAddress(data) {
  return request({
    url: BASE_URL + "/api/e/access/searchLibraryAddress",
    method: "post",
    data
  });
}

// 藏址导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4463
export const searchLibraryAddressExport = () =>
  "/api/e/access/searchLibraryAddress/export";

/**
 * 接入总览
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4470
 * @returns
 */
export function accessPandect(data) {
  return request({
    url: BASE_URL + "/api/e/access/accessPandect",
    method: "post",
    data
  });
}
