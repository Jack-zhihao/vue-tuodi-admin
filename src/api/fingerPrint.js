/** 返回值数据格式：json
  {
    "ret":0, //  ret为0表示成功;非0为错误
    "data":"", // data:数据
    "error":"" // error: 错误描述
  }
*/

// 指纹采集模块
import request from "utils/request";
import { FINGER_URL, BASE_URL } from "utils/base";

/**
 * 获取系统信息
 *
 * @export
 * @param
 * @returns
 */
export function fingerPrintInfo() {
  return request({
    url: FINGER_URL + "/zkbioonline/info",
    method: "get"
  });
}

/**
 * 开始采集
 *
 * @export
 * @param {*} type type为1表示采集登记指纹(采集同一手指3次指纹),type不是1则表示采集比对指纹
 * @param {*} fakeFunOn FakeFunOn为1表示开启防假,0表示关闭防假（默认开启，仅对LIVE20R有效；出现疑似假指纹时
getImage返回-2009）
 * @returns
 */
export function fingerPrintCapture({ type, FakeFunOn, random }) {
  return request({
    url: FINGER_URL + "/zkbioonline/fingerprint/beginCapture",
    method: "get",
    params: {
      type,
      FakeFunOn,
      random
    }
  });
}

/**
 * 取消采集
 *
 * @export
 * @param
 * @returns
 */
export function fingerPrintCancel(random) {
  return request({
    url: FINGER_URL + "/zkbioonline/fingerprint/cancelCapture",
    method: "get",
    params: {
      random
    }
  });
}

/**
 * 获取图像
 *
 * @export
 * @returns
 */
export function fingerPrintGetImage(random) {
  return request({
    url: FINGER_URL + "/zkbioonline/fingerprint/getImage",
    method: "get",
    params: {
      random
    }
  });
}

/**
 * 获取模板
 *
 * @export
 * @returns
 */
export function fingerPrintGetTemplate(random) {
  return request({
    url: FINGER_URL + "/zkbioonline/fingerprint/getTemplate",
    method: "get",
    params: {
      random
    }
  });
}

/***
 *
 * 读者管理-读者管理-指纹验证
 * @param 查看 http://192.168.1.132:4999/index.php?s=/29&page_id=2835
 *
 */
export function fingerprintVerify(data) {
  return request({
    url: BASE_URL + "/api/e/flow/readerManager/fingerprintVerify",
    method: "post",
    data
  });
}
