## 文件夹说明

```
tools           // 脚本文件夹
  ├─index.js    // 业务文件，执行 `node index.js` 生成路由表，注意检查命令行是否有输出异常信息。
  ├─menuObj.js  // 业务文件，生成全部菜单的键/值对象，用于获取菜单的 `functionId`。
  ├─menu.json   // 原料文件，接口 `api/e/sys/user/userAndPerm` 返回的权限数据，如果菜单权限有变化则需要复制接口返回结果进来更新。
  └─menuOutPut  // 生成文件，生成好的路由表，用于替换 `router/modules/xx.js` 中的路由数据。
```

## 注意

页面路由的 `functionID` 是根据菜单中文名字匹配的，如果遇到不一致的情况请检查菜单名是否完全一致（比如接口返回的菜单中文名是否包含空格之类的）。

匹配规则
- 如果是二级菜单只匹配当前菜单名。
- 如果是三级菜单，为了避免菜单名重复，则拼接 `二级菜单名-三级菜单名`（比如`系统权限-用户管理`） 进行匹配。
- 如果需要调整匹配规则可以再 `menuObj.js` 修改

## 处理步骤

1. 每次权限菜单 `functionId` 有更新，先复制最新的 `api/e/sys/user/userAndPerm` 数据更新 `menu.json`。
2. 切换到 `tools` 目录下执行 `node index.js`。
3. 检查输出结果是否有异常
4. 调整至无异常后把 `menuOutPut` 中的文件替换 `router/modules` 中的文件即可。