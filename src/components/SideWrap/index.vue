<template>
  <transition name="hide">
    <div class="side__wrapper" :style="{ width: width }">
      <div class="side__header">
        <slot name="header"> </slot>
      </div>
      <el-scrollbar class="side__content">
        <slot></slot>
      </el-scrollbar>
      <div class="side__footer">
        <slot name="footer"> </slot>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    width: {
      type: String,
      default: "50%"
    },
    border: {
      type: Boolean,
      default: () => true
    }
  }
};
</script>

<style lang="less" scoped>
.side__wrapper {
  z-index: 100;
  position: fixed;
  right: 0;
  top: 0;
  bottom: 0;
  background: #fff;
  box-shadow: 0px 0px 40px 0px rgba(0, 0, 0, 0.3);
  .side__header {
    height: 50px;
    overflow: hidden;
    background: @topBgColor;
  }
  .side__footer {
    height: 54px;
    overflow: hidden;
    margin: 0 20px;
    /deep/ .border {
      border-top: 1px solid @tableBorderColor;
    }
  }
  .side__content {
    height: ~"calc(100% - 50px - 54px)";
  }
}
.hide-enter-active,
.hide-leave-active {
  transition: transform 0.5s ease-in-out;
}
.hide-enter, .hide-leave-to /* .hide-leave-active below version 2.1.8 */ {
  transform: translateX(100%);
}
</style>

<style lang="less">
.side__content {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
</style>
