/*
 * @Description:
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-12 11:21:54
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-07 16:08:06
 */
// 图书典藏模块
import request from "utils/request";
import { BASE_URL } from "utils/base";
/**
 * 入藏登记-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3080
 * @returns
 */
export function saveRcdj(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/rcdj",
    method: "post",
    data
  });
}

/**
 * 入藏批登记-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3081
 * @returns
 */
export function saveRcdjBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/rcdjBatch",
    method: "post",
    data
  });
}
/**
 * 馆藏状态处理-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3082
 * @returns
 */
export function saveGcztcl(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/gcztcl",
    method: "post",
    data
  });
}
/**
 * 馆藏状态批量处理-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3083
 * @returns
 */
export function saveGcztclBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/gcztclBatch",
    method: "post",
    data
  });
}
/**
 * 藏址变更-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3084
 * @returns
 */
export function saveCzbg(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/czbg",
    method: "post",
    data
  });
}
/**
 * 藏址变更批处理-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3085
 * @returns
 */
export function saveCzbgBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/czbgBatch",
    method: "post",
    data
  });
}
/**
 * 藏址变更批处理-查询条码书册数量
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3085
 * @returns
 */
export function tiaomaFindMarcshuce(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/czgbBatch/tiaomaFindMarcshuce",
    method: "post",
    data
  });
}
/**
 * 藏址批变更-馆藏变更-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3086
 * @returns
 */
export function saveGzbg(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/gzbg",
    method: "post",
    data
  });
}
/**
 * 条码更换-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3087
 * @returns
 */
export function saveTmgh(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/tmgh",
    method: "post",
    data
  });
}
/**
 * 馆藏状态修改—确认-添加
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3087
 * @returns
 */
export function gcztclConfirm(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/gcgl/gcztclConfirm",
    method: "post",
    data
  });
}
/**
 * 清点和剔除 - 藏书清点
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3109
 * @returns
 */
export function csqd(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/csqd",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 藏书批清点
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3110
 * @returns
 */
export function csqdBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/csqdBatch",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 清点处理-处理
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3113
 * @returns
 */
export function qdclSearch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/qdclSearch",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 清点处理-搜索
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3114
 * @returns
 */
export function qdclList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/qdclList",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 清点处理-清点处理
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3115
 * @returns
 */
export function qdclConfirm(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/qdclConfirm",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 馆藏剔除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3111
 * @returns
 */
export function gctc(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/gctc",
    method: "post",
    data
  });
}

/**
 * 清点和剔除 - 馆藏批剔除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3112
 * @returns
 */
export function gctcBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/qdhtc/gctcBatch",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3116
 * @returns
 */
export function dcpcList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcList",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-新增
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3118
 * @returns
 */
export function dcpcSave(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcSave",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-删除 - 提示接口
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3119
 * @returns
 */
export function dcpcDelHasData(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcDelHasData",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3119
 * @returns
 */
export function dcpcDel(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcDel",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-修改
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3120
 * @returns
 */
export function dcpcUpdate(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcUpdate",
    method: "post",
    data
  });
}

/**
 * 批次管理 -典藏批次-修改
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3121
 * @returns
 */
export function pcqdlbList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/pcqdlbList",
    method: "post",
    data
  });
}

/**
 * 批次管理 -批次清单-用户列表
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3253
 * @returns
 */
export function pcqdlbListOperatorList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/pcqdlbListOperatorList",
    method: "post",
    data
  });
}
/**
 * 批次管理 -批次清单-批次代码
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3518
 * @returns
 */
export function pcqdPcdmList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/psqdPcdmList",
    method: "post",
    data
  });
}

/**
 * 批次管理 -批次清单-批次清单清除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4620
 * @returns
 */
export function dcpcClean(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/pcgl/dcpcClean",
    method: "post",
    data
  });
}

/**
 * 馆藏分类统计
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3352
 * @returns
 */
export function gcfltj(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dctj/gcfltj",
    method: "post",
    data
  });
}

/**
 * 馆藏清单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3348
 * @returns
 */
export function gcqd(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dctj/gcqd",
    method: "post",
    data
  });
}

/**
 * 典藏清单-清单总览====作废====勿用
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3822
 * @returns
 */
// export function gcqdZtai(data) {
//   return request({
//     url: BASE_URL + "/api/e/libCollection/dctj/gcqd/groupByZtai",
//     method: "post",
//     data
//   });
// }

/**
 * 馆藏统计
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3353
 * @returns
 */
export function gctj(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dctj/gctj",
    method: "post",
    data
  });
}

/**
 * 馆藏书目清单
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3349
 * @returns
 */
export function gcsmqd(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dctj/gcsmqd",
    method: "post",
    data
  });
}

/**
 * 馆藏清单-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3473
 * @returns
 */
export const gcqdExportExcel = () =>
  "/api/e/libCollection/dctj/gcqdExportExcel";

/**
 * 馆藏分类统计-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4243
 * @returns
 */
export const gcflExportExcel = () =>
  "/api/e/libCollection/dctj/gcfltj/ExportExcel";

/**
 * 馆藏统计-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3474
 * @returns
 */
export const gctjExportExcel = () =>
  "/api/e/libCollection/dctj/gctjExportExcel";

/**
 * 馆藏书目清单-导出excel
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3475
 * @returns
 */
export const gcsmqdExportExcel = () =>
  "/api/e/libCollection/dctj/gcsmqdExportExcel";

// 馆藏清查统计
// http://192.168.1.132:4999/index.php?s=/29&page_id=4678
export function marcshuceList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/marcshuceList",
    method: "post",
    data
  });
}

// 典藏统计--清查书目清单
// http://192.168.1.132:4999/index.php?s=/29&page_id=4677
export function marctyList(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/marctyList",
    method: "post",
    data
  });
}

/**
 * 典藏统计--书目清单导出
 * http://192.168.1.132:4999/index.php?s=/29&page_id=4689
 */
export const marctyListExport = () =>
  "/api/e/libCollection/dcqc/marctyList/export";
// 馆藏清查导出
// http://192.168.1.132:4999/index.php?s=/29&page_id=4690
export const marcshuceListtExcel = () =>
  "/api/e/libCollection/dcqc/marcshuceList/export";

// 类型查询
// http://192.168.1.132:4999/index.php?s=/29&page_id=4674
export function findTypes(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/findTypes",
    method: "post",
    data
  });
}

// 清查登记
// http://192.168.1.132:4999/index.php?s=/29&page_id=4675
export function invertory(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/invertory",
    method: "post",
    data
  });
}
/**
 * 类型查询
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4674
 * @returns
 */
export function fetchDcqdTypes(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/findTypes",
    method: "post",
    data
  });
}

// 清查批登记
// http://192.168.1.132:4999/index.php?s=/29&page_id=4676
export function invertoryBatch(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/invertoryBatch",
    method: "post",
    data
  });
}
/**
 * 类型删除
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4673
 * @returns
 */
export function delDcqdType(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/delType",
    method: "post",
    data
  });
}

/**
 * 类型编辑
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4672
 * @returns
 */
export function editDcqdType(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/saveType",
    method: "post",
    data
  });
}

/**
 * 类型下书册数量
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4719
 * @returns
 */
export function getDcqdCount(data) {
  return request({
    url: BASE_URL + "/api/e/libCollection/dcqc/shuceCount",
    method: "post",
    data
  });
}
