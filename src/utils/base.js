/*
 * @Description:
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-01-21 10:13:22
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-09 20:30:38
 */
const PRODUCT_URL = "/service";

const LOCAL_INDEX = 1;

const LOCAL_OBJ = {
  0: "api_mock", // 模拟数据
  1: "/api_local", // 测试服务器数据
  2: "/api_WJ", // 炜杰
  3: "/api_HB", // 慧波:8083
  31: "/api_1_HB", // 慧波:8084
  4: "/api_LJ", // 亮金
  5: "/api_yy" //杨勇
};

const DEV_URL = LOCAL_OBJ[LOCAL_INDEX];

// 根据当前环境获取基本请求路径，如果是正式环境要使用 PRODUCT_URL，否则 DEV_URL

export const BASE_URL =
  process.env.NODE_ENV === "production" ? PRODUCT_URL : DEV_URL;

export const IMG_URL = BASE_URL;

const FINGER_PRODUCT_URL = "http://127.0.0.1:22001";
const FINGER_DEV_URL = "/api_finger";

export const FINGER_URL =
  process.env.NODE_ENV === "production" ? FINGER_PRODUCT_URL : FINGER_DEV_URL;

// 项目根路径
export const PROJECT_BASE = "https://xxxx";
