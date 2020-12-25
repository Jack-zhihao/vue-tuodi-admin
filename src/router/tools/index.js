/* eslint-disable */

// ---------------------- 接口返回的权限数据，如果接口数据有变动要重新手动更新 ------------------------------
const menuObj = require("./menuObj");

// ---------------------- 下面是程序配置业务逻辑 ------------------------------
const fs = require("fs");
const path = require("path");
const filePath = path.resolve("../modules");

// 生成文件夹
let isExist = fs.existsSync(path.resolve("menuOutPut"));
if (!isExist) {
  fs.mkdirSync(path.resolve("menuOutPut"));
}

// 先清空之前生成的路由文件
delDir(path.resolve("menuOutPut"));

// 遍历路由配置文件
fileDisplay(filePath);

function fileDisplay(filePath) {
  console.log("-----start-----");
  fs.readdir(filePath, (err, files) => {
    if (err) {
      console.log(`=================${err}=================`);
    }
    const totalFiles = files.length;
    let failFile = 0;
    files.forEach(filename => {
      const filedir = path.join(filePath, filename);

      let content = fs.readFileSync(filedir, "utf-8");
      let contentStart = content.indexOf("[");
      let contentEnd = content.lastIndexOf("]");

      let routerStartData = content.substring(0, contentStart); // 前面部分的字符串
      let routerStringData = content
        .substring(contentStart, contentEnd + 1)
        .replace(/Layout/g, '"Layout"');
      let routerEndData = content.substring(contentEnd + 1); // 结束部分的字符串

      let routerData = eval("(" + routerStringData + ")"); // 字符串转换获取路由数据

      let errorCount = configFunctionId(routerData); // 配置路由 functionId

      if (errorCount > 0) {
        console.log(
          "\x1B[31m%s\x1B[39m",
          `请检查路由文件${filename}相关的接口菜单权限配置后再重新生成。`
        );
        failFile++;
      } else {
        let fileDataString =
          routerStartData +
          JSON.stringify(routerData)
            .replace(/"Layout"/g, "Layout")
            .replace(/"cop-/g, "")
            .replace(/cop-"/g, "")
            .replace(/\\r\\n/g, "") +
          routerEndData;

        fs.writeFileSync(`menuOutPut/${filename}`, fileDataString);
        console.log(
          "\x1B[32m%s\x1B[39m",
          filename + " 文件数据写入成功，请更新！"
        );
      }
    });
    console.log("-----end-----");
    if (failFile) {
      console.log(
        "\x1B[31m%s\x1B[39m",
        `共读取${totalFiles}份文件，其中${failFile}份文件生成失败，请检查。`
      );
    } else {
      console.log(
        "\x1B[32m%s\x1B[39m",
        `共读取${totalFiles}份文件，全部生成成功。`
      );
    }
  });
}

// 配置路由 functionId
function configFunctionId(routerData) {
  let errorCount = 0;
  for (let index = 0; index < routerData.length; index++) {
    const element = routerData[index];
    // 父级菜单的权限
    if (element.meta) {
      let compareNmae = `${element.meta.title}`;
      let childFunctionId = element.meta.functionId;
      if (menuObj[compareNmae] !== childFunctionId) {
        // 这里的 log 开启后可以用来对比 functionId 变更
        // console.log(
        //   `二级菜单 ${compareNmae} 的 functionId 和接口不一致，接口返回的 id 是:${
        //     menuObj[compareNmae]
        //   }，请检查后重新生成文件`
        // );
        if (menuObj[compareNmae]) {
          element.meta.functionId = menuObj[compareNmae];
        } else {
          // 这里面的 log 提示不能关闭
          errorCount++;
          console.log(
            "\x1B[36m%s\x1B[39m",
            `error:二级菜单 ${compareNmae} 接口返回的 functionId 为 undefined，请检查后重新生成文件`
          );
        }
      }
    }
    // 子菜单权限配置
    if (element.children) {
      for (let j = 0; j < element.children.length; j++) {
        const child = element.children[j];
        if (typeof child.component === "function") {
          // 因为 JSON 序列化无法转换函数，所以这里用一个特殊的拼接处理为字符串，写入的时候再全局替换为空
          // " 序列化会变成 /" ，所以也要处理一下
          child.component =
            "cop-" + child.component.toString().replace(/"/g, "'") + "cop-";
        }
        if (child.meta && !child.meta.hide) {
          let compareNmae = `${element.meta.title}-${child.meta.title}`;
          let childFunctionId = child.meta.functionId;
          if (menuObj[compareNmae] !== childFunctionId) {
            // 这里的 log 开启后可以用来对比 functionId 变更
            // console.log(
            //   `三级菜单\x1B[36m ${compareNmae} \x1B[39m的 functionId 和接口不一致，接口返回的 id 是: ${
            //     menuObj[compareNmae]
            //   }，请检查后重新生成文件`
            // );
            if (menuObj[compareNmae]) {
              child.meta.functionId = menuObj[compareNmae];
            } else {
              // 这里面的 log 提示不能关闭
              errorCount++;
              console.log(
                `三级菜单\x1B[36m ${compareNmae} \x1B[39m接口返回的 functionId 为 undefined，请检查后重新生成文件`
              );
            }
          }
        }
      }
    }
  }
  return errorCount;
}

// 清空文件夹内容
function delDir(path) {
  let files = [];
  if (fs.existsSync(path)) {
    files = fs.readdirSync(path);
    files.forEach((file, index) => {
      let curPath = path + "/" + file;
      if (fs.statSync(curPath).isDirectory()) {
        // delDir(curPath); //递归删除文件夹
      } else {
        fs.unlinkSync(curPath); //删除文件
      }
    });
    // fs.rmdirSync(path);
  }
}
