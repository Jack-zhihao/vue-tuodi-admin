<!--
 * @Description: 
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:23
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-03 09:18:19
 -->
<template>
  <div class="app__footer">
    <span v-if="$TDConfig.isShowCopyRight"
      >&copy;广东拓迪智能科技有限公司 版权所有 |</span
    >
    技术支持：400-600-8085 | 软件版本：V4.1.3.5
    <div class="btn__mode" type="text" @click="changeMode">
      切换{{ toMode }}模式
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      toMode: ""
    };
  },
  methods: {
    setMode() {
      // 当前为极简模式
      if (this.$route.name.indexOf("simple_") > -1) {
        this.toMode = "专业";
      } else {
        this.toMode = "极简";
      }
    },
    changeMode() {
      if (this.toMode === "专业") {
        // 极简 => 专业
        this.toMode = "极简";
        this.$router.push("/");
      } else {
        // 专业 => 极简
        this.toMode = "专业";
        this.$router.push({
          name: "simple_menu"
        });
      }
    }
  },
  created() {
    this.setMode();
  }
};
</script>

<style lang="less" scoped>
.app__footer {
  position: relative;
  background: #f1f1f1;
  height: 30px;
  line-height: 30px;
  text-align: center;
  font-size: @FSize_14;
}
.btn__mode {
  position: absolute;
  cursor: pointer;
  right: 10px;
  top: 0;
  height: 28px;
  line-height: 28px;
  color: #378de6;
  font-size: @FSize_16;
}
</style>
