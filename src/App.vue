<!--
 * @Description: 
 * @Autor: chenming.feng
 * @Date: 2019-01-21 09:19:51
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-05 16:16:45
 -->
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: "app",
  mounted() {
    let fontSize = localStorage.getItem("td-fontSize");
    if (fontSize) {
      document.documentElement.style.fontSize = fontSize;
    }
  },
  created() {
    // 退出当前页面执行
    window.onunload = function() {
      // ios 不支持 window.onbeforeunload()
      // 将退出时间存于localstorage中
      localStorage.setItem("td-leaveTime", new Date().getTime());
    };
  }
};
</script>

<style lang="less">
.el-table--scrollable-x.el-table--border th.gutter:last-of-type {
  display: block !important;
  width: 17px !important;
}
</style>
