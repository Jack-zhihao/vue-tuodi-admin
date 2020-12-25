/* eslint-disable */

const fs = require("fs");

const menuData = fs.readFileSync("./menu.json", "utf-8");
const menuList = JSON.parse(menuData).data.menuList;

let menuObj = {};
menuList.forEach(item => {
  // 一级
  if (item.children) {
    item.children.forEach(secChild => {
      // 二级
      let secChildName = secChild.name;
      if (menuObj[secChildName]) {
        console.log(
          "\x1B[36m%s\x1B[39m",
          `==================二级菜单${secChildName}重复，请检查后再次配置==================`
        );
      }
      menuObj[secChildName] = secChild.functionId;
      if (secChild.children) {
        secChild.children.forEach(thirdChild => {
          if (menuObj[secChildName + "-" + thirdChild.name]) {
            console.log(
              "\x1B[36m%s\x1B[39m",
              "==================三级子菜单名重复，请检查后再次配置==================",
              thirdChild.name
            );
          }
          menuObj[secChildName + "-" + thirdChild.name] = thirdChild.functionId;
        });
      }
    });
  }
});

module.exports = menuObj;
