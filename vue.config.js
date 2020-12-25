/*
 * @Description:
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-01-21 10:33:11
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 15:54:49
 */
const path = require("path");
const resolve = dir => path.join(__dirname, dir);
module.exports = {
  publicPath: process.env.NODE_ENV === "production" ? "/elib/" : "/", // 部署应用包时的基本 URL
  outputDir: "dist/elib",
  devServer: {
    host: "0.0.0.0",
    port: 4819,
    https: false,
    hotOnly: true,
    proxy: {
      "/api_yue": {
        target: "http://192.168.1.17:8083", // 李月测试服务器
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_yue": ""
        }
      },
      "/api_local": {
        target: "http://192.168.1.47:8083", // 47测试服务器
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_local": ""
        }
      },
      "/api_WJ": {
        target: "http://192.168.1.50:8084", //炜杰
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_WJ": ""
        }
      },
      "/api_HB": {
        target: "http://192.168.1.64:8083", //慧波
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_HB": ""
        }
      },
      "/api_1_HB": {
        target: "http://192.168.1.43:8084", //慧波
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_1_HB": ""
        }
      },
      "/api_LJ": {
        target: "http://192.168.1.59:8083", //亮金
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_LJ": ""
        }
      },
      "/api_yy": {
        target: "http://192.168.1.40:8083", //杨勇
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_yy": ""
        }
      },
      "/api_finger": {
        target: "http://127.0.0.1:22001",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/api_finger": ""
        }
      },
      "/service": {
        target: "http://192.168.1.47:8083",
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          "^/service": ""
        }
      }
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("api", resolve("src/api"))
      .set("assets", resolve("src/assets"))
      .set("common", resolve("src/common"))
      .set("components", resolve("src/components"))
      .set("directives", resolve("src/directives"))
      .set("filters", resolve("src/filters"))
      .set("lang", resolve("src/lang"))
      .set("mixins", resolve("src/mixins"))
      .set("store", resolve("src/store"))
      .set("styles", resolve("src/styles"))
      .set("utils", resolve("src/utils"))
      .set("views", resolve("src/views"));
  },
  pluginOptions: {
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [path.resolve(__dirname, "src/styles/abstracts/*.less")]
    }
  }
};
