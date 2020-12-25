/*
 * @Description:
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:21
 * @LastEditors  : wj.liang
 * @LastEditTime : 2019-12-27 17:32:33
 */
import request from "utils/request";
import { BASE_URL } from "utils/base";

/**
 * 用户登录
 *
 * @export
 * @param {用户名， 密码}
 * @returns
 */
export function loginByUsername(loginName, loginPwd) {
  const data = {
    loginName,
    loginPwd
  };
  return request({
    url: BASE_URL + "/api/p/login/userLogin",
    method: "post",
    data
  });
}

// 登录前校验
export function userIsLogin(data) {
  return request({
    url: BASE_URL + "/api/p/login/userIsLogin",
    method: "post",
    data
  });
}

/**
 * 退出登录
 *
 * @export
 * @returns
 */
export function logout() {
  return request({
    url: BASE_URL + "/login/logout",
    method: "post"
  });
}

// 退出登录
export function userLogout() {
  return request({
    url: BASE_URL + "/api/p/login/userLogout",
    method: "post"
  });
}

/**
 * 获取用户信息
 *
 * @export
 * @param {token}
 * @returns
 */
export function getUserInfo() {
  return request({
    url: BASE_URL + "/api/e/sys/user/userAndPerm",
    method: "post"
  });
}
