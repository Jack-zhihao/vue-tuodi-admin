<!--
 * @Description: 欢迎页
 * @Autor: chenming.feng
 * @Date: 2019-06-25 10:32:07
 * @LastEditors  : Please set LastEditors
 * @LastEditTime : 2019-12-31 08:44:57
 -->
<template>
  <div class="welcome">
    <img v-if="$TDConfig.isShowCopyRight" class="img" :src="welcomeBg" alt="" />
  </div>
</template>

<script>
export default {
  name: "welcome",
  data() {
    this.welcomeBg = require("assets/help.png");
    return {};
  }
};
</script>

<style lang="less" scoped>
.welcome {
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  .img {
    width: 100%;
    max-height: 100%;
    max-width: 1059px;
    transform: translateY(-10%);
  }
}
</style>
