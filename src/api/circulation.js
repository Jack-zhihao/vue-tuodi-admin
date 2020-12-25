/*
 * @Description: 流通模块接口
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-02-12 11:23:10
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-02-27 15:50:21
 */

import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 读者信息
 *
 * @export
 * @param
 * @returns
 */
// http://192.168.1.132:4999/index.php?s=/29&page_id=2847
export function getReaderData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/reader",
    method: "post",
    data
  });
}
/**
 * 借书成功返回图书信息
 *
 * @export
 * @param
 * @returns
 */
export function getBookData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/bro",
    method: "post",
    data
  });
}
/**
 * 财经历史信息操作人
 *
 * @export
 * @param  http://192.168.1.132:4999/index.php?s=/29&page_id=2938
 * @returns
 */
export function getUserList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/moneyManager/operatorList",
    method: "post",
    data
  });
}
/**
 * 财经历史信息
 *
 * @export
 * @param
 * @returns
 */
export function moneyHistoryList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/moneyManager/moneyHistoryList",
    method: "post",
    data
  });
}
/**
 * 财经历史信息总账
 *
 * @export
 * @param http://192.168.1.132:4999/index.php?s=/29&page_id=2968
 * @returns
 */
export function moneyHistoryTotal(data) {
  return request({
    url: BASE_URL + "/api/e/flow/moneyManager/moneyTotal",
    method: "post",
    data
  });
}
/**
 * 获取当前借阅信息
 *
 * @export
 * @param
 * @returns
 */
export function getcurbroData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/curBro",
    method: "post",
    data
  });
}
/**
 * 获取历史借阅信息
 *
 * @export
 * @param
 * @returns
 */
export function gethisbroData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/hisBro",
    method: "post",
    data
  });
}
/**
 * 获取其他馆址信息
 *
 * @export
 * @param
 * @returns
 */
export function getOtherczData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/othercz",
    method: "post",
    data
  });
}
/**
 * 读者管理退证
 *
 * @export
 * @param http://192.168.1.132:4999/index.php?s=/29&page_id=2894
 * @returns
 */
export function UpdateStatus(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerUpdateStatus",
    method: "post",
    data
  });
}
/**
 * 获取归还信息
 *
 * @export
 * @param
 * @returns
 */
export function getReturnBooksData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/ret",
    method: "post",
    data
  });
}
/**
 * 获取归还后完成还书罚款停借之后的图书信息
 *
 * @export
 * @param
 * @returns
 */
export function getReturnBooks(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/book",
    method: "post",
    data
  });
}

/**
 * 获取续借信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2851
 * @returns
 */
export function getRenewBooksData(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/ren",
    method: "post",
    data
  });
}
/**
 * 确定预约信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2970
 * @returns
 */
export function yuyueMake(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/yuyueMake",
    method: "post",
    data
  });
}
/**
 * 获取超期信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2949
 * @returns
 */
export function overdue(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/overdue",
    method: "post",
    data
  });
}
/**
 * 获取确定超期信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2956
 * @returns
 */
export function overdueOk(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/overdueOk",
    method: "post",
    data
  });
}
/**
 * 获取停借信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2963
 * @returns
 */
export function stopBro(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/stopBro",
    method: "post",
    data
  });
}
/**
 * 获取停借确定信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=2967
 * @returns
 */
export function stopBroOk(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/stopBroOk",
    method: "post",
    data
  });
}
/**
 * 获取借还一体的读者读本信息
 *
 * @export
 * @param 查询http://192.168.1.132:4999/index.php?s=/29&page_id=3408
 * @returns
 */
export function broAndRet(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/broAndRet",
    method: "post",
    data
  });
}

// 图书查询---图书历史借阅
// http://192.168.1.132:4999/index.php?s=/29&page_id=4545
export function bookHistoryBro(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/bookHistoryBro",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2856
 *
 */
export function yyList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx2/yyList",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-获取图书信息
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2857
 *
 */
export function book(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx2/book",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-获取读者信息
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2858
 *
 */
export function reader(data) {
  return request({
    url: BASE_URL + "api/e/flow/doclx2/reader",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-预约操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2862
 *
 */
export function yuyue(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx2/yuyue",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-发送 ： 预约到馆通知
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3380
 *
 */
export function orderMail(data) {
  return request({
    url: BASE_URL + "api/e/mailmodel/order/mail",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-取消预约
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2867
 *
 */
export function delYy(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx2/delYy",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-预约管理-清除超期
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2869
 *
 */
export function delBatchYy(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx2/delBatchYy",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-污损处理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2870
 *
 */
export function wuSunList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSunList",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-污损处理-获取读者信息
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2871
 *
 */
export function wuSunFindReader(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSun/findReader",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-污损处理-污损信息
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2872
 *
 */
export function wuSunLoseMessage(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSun/loseMessage",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-污损处理-登记
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2873
 *
 */
export function wuSunRegister(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSun/register",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-污损处理-删除
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2951
 *
 */
export function wuSunDel(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSunDel",
    method: "post",
    data
  });
}

/***
 *
 * 污损处理-导出excel
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3977
 *
 */
export const exportWuSunExportExcel = () =>
  "/api/e/flow/doclx/wuSunExportExcel";

/***
 *
 * 文献流通-污损处理-恢复
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2950
 *
 */
export function HuiFu(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/wuSun/HuiFu",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-罚款管理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2863
 *
 */
export function fineList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/fine/list",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-罚款管理-删除操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2863
 *
 */
export function fineDelete(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/fine/delete",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-罚款管理-收款操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2862
 *
 */
export function collectMoney(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/fine/collectMoney",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-罚款管理-退款操作
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2865
 *
 */
export function backMoney(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/fine/backMoney",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-超期管理-获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2868
 *
 */
export function overDueList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/overDue/list",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-获取读者列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2831
 *
 */
export function readerManagerList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerList",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-新增办证
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2826
 *
 */
export function readerManagerSave(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerSave",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-删除读者
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2832
 *
 */
export function readerManagerDel(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerDel",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-更新读者
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2830
 *
 */
export function readerManagerUpdate(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerUpdate",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-延期处理-数据展示
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2882
 *
 */
export function doclxYanqiList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/yanQiList",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-更新读者状态
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2830
 *
 */
export function readerManagerUpdateStatus(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/readerManagerUpdateStatus",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-读者批管理
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3359
 *
 */
export function readerBatchChange(data) {
  return request({
    url: BASE_URL + "api/e/flow/readerManager/readerBatchChange",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-延期处理-确认处理（单个）
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2883
 *
 */
export function doclxYanqiHandle(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/yanQiHandle",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-获取读者类型
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2796
 *
 */
export function readerType(data) {
  return request({
    url: BASE_URL + "/api/e/parameter/readerType",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-获取单个读者信息
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2829
 *
 */
export function getReaderManager(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/getReaderManager",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-获取读者日记
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2893
 *
 */
export function flowReaderLog(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/flowReaderLog",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-延期处理-确认处理（批量）
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2890
 *
 */
export function doclxYanqiHandlePiLiang(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx/yanQiHandlePiLiang",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-读者管理批处理
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2833
 *
 */
export function operateManagerBatch(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/operateManagerBatch",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-丢失管理-列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2874
 *
 */
export function doclx3LoseList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseList",
    method: "post",
    data
  });
}

// 丢失管理--导出
export const loseListExcel = () => "/api/e/flow/doclx3/loseExp";

/***
 *
 * 文献流通-丢失登记-读者
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2875
 *
 */
export function doclx3LoseReader(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseReader",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-丢失管理-删除
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2877
 *
 */
export function doclx3LoseDel(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseDel",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-丢失管理-修改
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2878
 *
 */
export function doclx3LoseUpd(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseUpd",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-丢失管理-恢复
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2879
 *
 */
export function doclx3LoseRec(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseRec",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-丢失登记-确认
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2884
 */
export function doclx3LoseConfirm(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseConfirm",
    method: "post",
    data
  });
}
/***
 *
 * 文献流通-丢失登记-登记
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2879
 *
 */
export function doclx3LoseAdd(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx3/loseAdd",
    method: "post",
    data
  });
}

/***
 *
 * 读者管理-读者管理-校验唯一证号
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2825
 *
 */
export function IDNOIsExist(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/IDNOIsExist",
    method: "post",
    data
  });
}

/***
 *

 * 流通统计 - 流通统计列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3373
 *
 */
export function lttjList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/lttjList",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-导出
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3388
 *
 */
export const lttjListExport = () => "/api/e/flow/lttj/lttjListExportExcel";

/***
 *
 * 流通统计 - 流通统计-数据行跳转柱状图
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3847
 *
 */
export function lttjListToEchart(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/lttjList/toEchart",
    method: "post",
    data
  });
}

/***
 *

 * 流通统计-操作员列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3406
 *
 */
export function lttjUserList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/lttjUserList",
    method: "post",
    data
  });
}

/***
 *

 * 文献流通-读者单位管理借还统计
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2975
 *
 */
export function dzdwjhtjList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzdwjhtj",
    method: "post",
    data
  });
}
/*
 * 流通统计-读者借还排行榜 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2937
 *
 */
export function dzjyphb(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzjyphb",
    method: "post",
    data
  });
}

/***
 *
 * 文献流通-读者类型管理借还统计
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2971
 *
 */
export function dzlxjhtjList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzlxjhtj",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-读者借还统计 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2969
 *
 */
export function dzjhtj(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzjhtj",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-文献借阅排行榜 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2952
 *
 */
export function wxjyphb(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/wxjyphb",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-文献借阅统计 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2988
 *
 */
export function wxjhtj(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/wxjhtj",
    method: "post",
    data
  });
}

/*
 * 流通查询-读者借阅查询
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3032
 *
 */
export function dzjycx(data) {
  return request({
    url: BASE_URL + "/api/e/flow/ltcx/dzjycx",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-文献借阅统计 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2988
 *
 */
export function wxjycx(data) {
  return request({
    url: BASE_URL + "/api/e/flow/ltcx/wxjycx",
    method: "post",
    data
  });
}

/*
 * 流通查询-读者借阅历史查询
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3035
 *
 */
export function dzjylscx(data) {
  return request({
    url: BASE_URL + "/api/e/flow/ltcx/dzjylscx",
    method: "post",
    data
  });
}

/***
 *
 * 流通统计-文献借阅统计 - 获取列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2988
 *
 */
export function wxjylscx(data) {
  return request({
    url: BASE_URL + "/api/e/flow/ltcx/wxjylscx",
    method: "post",
    data
  });
}

/***
 *
 * 读者照片批导入
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3273
 *
 */
export function batchReaderPic(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/batch/readerPic",
    method: "post",
    data,
    noNeedQS: true,
    isformData: true
  });
}

/**
 * 读者导入模板下载
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3345
 * @returns
 */
export const modelE = () => "/api/e/flow/reader/file/modelE";

/***
 *
 * 读者批量导入
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3346
 *
 */
export function readerI(data) {
  return request({
    url: BASE_URL + "/api/e/flow/reader/file/readerI",
    method: "post",
    data,
    noNeedQS: true,
    isformData: true
  });
}

/***
 *
 * 查询
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3371
 *
 */
export function rushRetSearch(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/rushRet/search",
    method: "post",
    data
  });
}

/**
 * 读者导入模板下载
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3345
 * @returns
 */
export const rushRetExport = () => "/api/e/mailmodel/rushRet/export";

/**
 * doc导出催还条
 *
 * @export
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4381
 * @returns
 */
export function docxExport(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/rushRet/docx",
    method: "post",
    data
  });
}

/***
 *
 * 多选发送
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3377
 *
 */
export function aloneMail(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/rushRet/aloneMail",
    method: "post",
    data
  });
}

/***
 *
 * 全部发送
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3378
 *
 */
export function allMail(data) {
  return request({
    url: BASE_URL + "/api/e/mailmodel/rushRet/allMail",
    method: "post",
    data
  });
}

/***
 *
 * 假期设定列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2790
 *
 */
export function holidaySetList(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/holidaySetList",
    method: "post",
    data
  });
}

/***
 *
 * 假期设定保存/更新
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2791
 *
 */
export function holidaySetSave(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/holidaySetSave",
    method: "post",
    data
  });
}

/***
 *
 * 删除假期设定
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2792
 *
 */
export function holidaySetDel(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/holidaySetDel",
    method: "post",
    data
  });
}

/***
 *
 * 获取假期设定
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2793
 *
 */
export function getHolidaySet(data) {
  return request({
    url: BASE_URL + "/api/e/sys/flowParameters/getHolidaySet",
    method: "post",
    data
  });
}

/***
 *
 * 超借列表
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3584
 *
 */
export function cjSearch(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx4/cjSearch",
    method: "post",
    data
  });
}

/***
 *
 * 超借编辑
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3585
 *
 */
export function cjSave(data) {
  return request({
    url: BASE_URL + "/api/e/flow/doclx4/cjSave",
    method: "post",
    data
  });
}

/***
 *
 * 获取成员馆-读者密码类型
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=3758
 *
 */
export function getReaderDefaultPassType(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/getMorenMima",
    method: "post",
    data
  });
}

/***
 *
 * 书目借阅情况
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4029
 */
export function zeroBrwBookList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/zeroBrwBookList",
    method: "post",
    data
  });
}

/***
 *
 * 书目借阅情况-excel
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4031
 */
export const zeroBrwBookExportExcel = () =>
  "/api/e/flow/lttj/zeroBrwBook/exportExcel";

/***
 *
 * 零借阅读者清单
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4033
 */
export function zeroBrwReader(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/zeroBrwReader",
    method: "post",
    data
  });
}

/***
 *
 * 零借阅读者清单-excel
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4034
 */
export const zeroBrwReaderExportExcel = () =>
  "/api/e/flow/readerManager/zeroBrwReader/exportExcel";

/***
 *
 * 读者借阅情况
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4310
 */
export function zeroBorrowDetails(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/borrowDetails",
    method: "post",
    data
  });
}

/***
 *
 * 读者借阅情况-导出excel
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4311
 */
export const zeroBorrowDetailsExportExcel = () =>
  "/api/e/flow/readerManager/borrowDetails/exportExcel";

/***
 * 获取流通维护配置
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4084
 */
export function cirMGetConfig(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/cirM/getConfig",
    method: "POST",
    data
  });
}

/***
 * 文献筛选
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4081
 */
export function cirMBookFiltrate(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/cirM/bookFiltrate",
    method: "POST",
    data
  });
}

/***
 * 读者筛选
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4082
 */
export function cirMReaderFiltrate(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/cirM/readerFiltrate",
    method: "POST",
    data
  });
}

/***
 * 流通维护配置保存
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4083
 */
export function cirMSave(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/cirM/save",
    method: "POST",
    data
  });
}

/***
 * 流通数据生成/执行
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=4084
 */
export function cirMCirDataCreate(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerOther/cirM/cirDataCreate",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4343
// 阅览室id
export function RoomId(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/getRoomByLibid",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4313
// 阅览室管理-入室登记
export function enterRoom(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/enter",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4314
// 阅览室管理-出室登记
export function outRoom(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/out",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4315
// 阅览室管理-座位预约
export function seatBooking(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/seatBooking",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4316
// 阅览室管理-查询列表
export function list(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/list",
    method: "POST",
    data
  });
}

// 阅览室--操作员
// http://192.168.1.132:4999/index.php?s=/29&page_id=4346
export function userList(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/getUserNameId",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4317
// 阅览室管理-列表导出
export const roomExcel = () => "/api/e/flow/readingRoom/exportExcel";

// http://192.168.1.132:4999/index.php?s=/29&page_id=4318
// 阅览室新增
export function addRoom(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/add",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4319
// 阅览室删除
export function delRoom(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/del",
    method: "POST",
    data
  });
}

// http://192.168.1.132:4999/index.php?s=/29&page_id=4320
// 阅览室编辑
export function editRoom(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readingRoom/update",
    method: "POST",
    data
  });
}

// 读者单位借还统计总计
// http://192.168.1.132:4999/index.php?s=/29&page_id=4641
export function dzdwjhtjCount(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzdwjhtjCount",
    method: "POST",
    data
  });
}

// 读者类型借还统计总计
// http://192.168.1.132:4999/index.php?s=/29&page_id=4640
export function dzlxjhtjCount(data) {
  return request({
    url: BASE_URL + "/api/e/flow/lttj/dzlxjhtjCount",
    method: "POST",
    data
  });
}
