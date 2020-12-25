# 业务系统

## 重要

`backup\ele_lib` 文件夹下的内容，是修改了 `el-input` 源码后的代码（用于实现 `el-input` clear 操作后光标激活到当前输入框），每次重新 `npm install` 之后，都要把该文件夹下（`ele_lib`）的内容全部复制替换到 `node_modules\element-ui\lib` 下。

当前源码版本为 `2.10.1`。

## 项目目录
```
├── dist                       // 生产环境打包目录
├── public                     // 模板
│   ├── index.html             // html 模板
│   └── favicon.ico            // favicon 图标
├── src                        // 源代码相关
│   ├── api                    // 所有接口请求
│   ├── assets                 // 图片、字体等静态资源
│   ├── common                 // 封装的类，用于创建对象 
│   ├── components             // 全局公用组件
│   ├── directive              // 全局指令
│   ├── filters                // 全局 filter
│   ├── lang                   // 国际化 language
│   ├── mixins                 // 全局 mixin（可复用功能）
│   ├── plugins                // 插件
│   ├── router                 // 路由配置
│   ├── store                  // 全局 store 管理
│   ├── styles                 // 全局样式
│   ├── utils                  // 全局公用方法
│   ├── views                  // views 所有页面
│   ├── element-variables.scss // element 样式
│   ├── App.vue                // 入口页面
│   ├── main.js                // 入口文件 加载组件 初始化等
│   └── permission.js          // 权限管理
├── element-variables.scss     // 自定义 element-ui 样式模板
├── theme                      // 打包后的自定义 element-ui 样式
├── .editorconfig              // 编辑器格式配置
├── .gitignore                 // git 忽略项
├── babel.config.js            // babel 配置项
├── gulpfile.js                // gulp 配置项
├── package.json               // package.json
├── README.md                  // README 文件
└── vue.config.js              // 配置相关
```

## 模块文件夹

- acquisition - 采访模块
- catalogue - 编目模块
- reservation - 典藏模块
- periodical - 期刊模块
- circulation - 流通模块
- setting - 设置模块
- help - 帮助模块
- feature - 特色模块

## 路由配置规则

```
// 对于一级路由，当设置 true 的时候该不会在侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
hidden: true // (默认 false)

//当设置 noredirect 的时候该路由在面包屑导航中不可被点击
redirect: 'noredirect'

name: 'router-name' //设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题，组件的 name 也要和这个一样。另外要避免命名冲突。
meta: {
  functionId: '0c85eb1049d94169b782a96241aa286e' //该路由在数据库中的id，如果没有这个字段意味着不需权限也能访问
  title: 'title' //设置该路由在侧边栏和面包屑中展示的名字
  icon: 'icon-name' //设置该路由的图标明
  hide: true, // 对于子路由 ，设置 true 的时候不会在侧边栏出现，默认false
  noCache: true //如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
  breadcrumb: false // 如果设置为false，则不会在breadcrumb面包屑中显示
}
```

## 样式规范

[业务系统界面统一&交互逻辑](https://www.yuque.com/wyrdmp/fgheke/nztn5q)

## 全局色系/字体大小

`src\styles\abstract\variable.less` 为抽象的基础样式，使用方式如下：

```
.ydgl {
  background: @primaryColor;
}
```

## 本地存储

`yd-ceshu` 用于存储采访-图书预定模块的册数。

...

## 其他

- 不同的路由使用同一个组件（比如编辑和新增页），默认情况下当这两个页面切换时并不会触发 vue 的 created 或者 mounted 钩子。

  - 可以通过 watch $route 的变化来做处理

  - 或者可以给每个 router-view 加上唯一的key
      
    ```
    <router-view :key="key"></router-view>

    computed: {
        key() {
            return this.$route.name !== undefined? this.$route.name + +new Date(): this.$route + +new Date()
        }
    }
    ```

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn run serve
```

### Compiles and minifies for production
```
yarn run build
```

### Lints and fixes files
```
yarn run lint
```