/*
 * @Description:
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-03 10:49:09
 */
import { BASE_URL } from "utils/base";
import { getToken } from "utils/auth";

function isIE() {
  //ie?
  if (!!window.ActiveXObject || "ActiveXObject" in window) {
    return true;
  }
  return false;
}

//  判断浏览器
export function myBrowser() {
  const userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  const isOpera = userAgent.indexOf("Opera") > -1;
  if (isOpera) {
    //判断是否Opera浏览器
    return "Opera";
  }
  if (userAgent.indexOf("Firefox") > -1) {
    //判断是否Firefox浏览器
    return "FF";
  }
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    //判断是否Safari浏览器
    return "Safari";
  }
  if (
    userAgent.indexOf("compatible") > -1 &&
    userAgent.indexOf("MSIE") > -1 &&
    !isOpera
  ) {
    //判断是否IE浏览器
    return "IE";
  }
}

// 找出数组中重复的元素
export function duplicates(arr) {
  var result = [];
  arr.forEach(function(item) {
    if (
      arr.indexOf(item) != arr.lastIndexOf(item) &&
      result.indexOf(item) == -1
    )
      result.push(item);
  });
  return result;
}

/**
 * 不打开新标签下载Excel文件
 *
 * @export
 * @param {*} url String
 * @param {*} params Object
 * @param userDefaultBase 如果不需要拼接BASE_URL，传入 false
 */
export function downLoadExcel(url, params = {}, userDefaultBase = true) {
  let link = "";
  Object.keys(params).forEach(key => {
    if (params[key]) {
      link = link + "&" + `${key}=${params[key]}`;
    }
  });
  let downLink = "";
  if (userDefaultBase) {
    downLink = `${BASE_URL}${url}?userToken=${getToken()}${link}`;
  } else {
    downLink = `${url}?userToken=${getToken()}${link}`;
  }
  if (isIE()) {
    window.open(downLink, "_self");
    // var form = document.createElement("form");
    // form.setAttribute("action", "downLink");
    // form.setAttribute("method", "get");
    // form.setAttribute("target", "_self");
    // form.setAttribute("style", "display:none");
    // document.body.appendChild(form);
    // form.submit();
    // document.body.removeChild(form);
  } else {
    let downLinkEle = document.createElement("a");
    downLinkEle.setAttribute("href", downLink);
    downLinkEle.dispatchEvent(
      new MouseEvent("click", { bubbles: true, cancelable: true, view: window })
    );
    downLinkEle = null;
  }
}

/**
 * 获取 marc 编目中的 isbn/issn/正题名
 *
 * @export
 * @param {*} marcStr
 */
export function getMarcData(marcStr) {
  let data = marcStr.split(String.fromCharCode(31));
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (item.startsWith("a")) {
      return item.substring(1).trim();
    }
  }
  return "";
}
