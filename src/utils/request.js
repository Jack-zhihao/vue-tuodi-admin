/*
 * @Description: axios 全局配置
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-01-21 09:54:02
 * @LastEditors  : chenming.feng
 * @LastEditTime : 2020-01-14 10:46:33
 */
import axios from "axios";
import qs from "qs";
import { Message, MessageBox } from "element-ui";
import { getToken } from "utils/auth";
import store from "store";

const service = axios.create();

function removeEmptyKey(data) {
  let newObj = {};
  for (const key in data) {
    const element = data[key];
    if (element !== "" && element !== null) {
      newObj[key] = element;
    }
  }

  return newObj;
}

// request 请求拦截器
service.interceptors.request.use(
  config => {
    // console.log(config);
    // console.log(config.data);
    // 配置 token 信息
    if (!config.isformData) {
      if (config.method.toUpperCase() === "POST") {
        config.data = {
          userToken: getToken(),
          ...config.data
        };
        // console.log(config.data);
      } else if (config.method.toUpperCase() === "GET") {
        config.params = {
          userToken: getToken(),
          ...config.params
        };
      }
      // 如果要保留空字段则不处理
      if (!config.needEmpty) {
        // 删除 POST 请求中 config.data 的空值属性
        config.data = removeEmptyKey(config.data);
        // 删除 GET 请求中 config.params 的空值属性
        config.params = removeEmptyKey(config.params);
      }
    } else {
      config.data.append("userToken", getToken());
    }
    // 格式化 file 格式请求
    if (config.method === "post" && !config.noNeedQS) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  error => {
    // eslint-disable-next-line
    console.log("error;", error); // for debug
    Promise.reject(error);
  }
);

let isExpired = false;

// response 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data;
    if (typeof res != "object") {
      if (
        response.headers["content-type"].indexOf("application/octet-stream") >
          -1 ||
        response.headers["content-type"].indexOf("application/vnd.ms-excel") >
          -1
      ) {
        // 下载文件的接口返回 response，便于获取文件名
        return response;
      } else {
        return res;
      }
    }
    // 指纹采集接口
    if ("ret" in res) {
      return res;
    }
    if (res.code !== 0) {
      // 登录过期了
      if (res.code === 2000) {
        if (!isExpired) {
          MessageBox.confirm(
            // "账号信息已过期，你可以取消继续留在该页面，或者重新登录",
            "账号信息已过期，请重新登录",
            "确定登出",
            {
              confirmButtonText: "重新登录",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              store.dispatch("FedLogOut").then(() => {
                location.reload(); // 为了重新实例化vue-router对象 避免bug
              });
            })
            .catch(() => {
              isExpired = false;
              // removeToken(); // 要避免死循环
            });
        }
        isExpired = true;
      } else {
        if (!response.config.noMsg) {
          Message.error(res.message);
        }
      }
      return Promise.reject(res);
    } else {
      if (
        response.headers["content-type"].indexOf("application/octet-stream") >
          -1 ||
        response.headers["content-type"].indexOf("application/vnd.ms-excel") >
          -1
      ) {
        // 下载文件的接口返回 response，便于获取文件名
        return response;
      } else {
        return res;
      }
    }
  },
  error => {
    // eslint-disable-next-line
    console.log("err:" + error); // for debug
    if (error.code === "ECONNABORTED") {
      // 请求超时
      Message({
        message: "服务器连接超时，请稍后重试。",
        type: "error",
        duration: 3 * 1000
      });
    } else {
      // 过滤指纹模块驱动未安装接口返回的提示
      if (error.message !== "Network Error") {
        // 自定义处理
        Message({
          message: error.message,
          type: "error",
          duration: 3 * 1000
        });
      }
    }
    return Promise.reject(error);
  }
);

export default service;
