<!--
 * @Description: 
 * @Date: 2019-12-25 20:36:17
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 15:05:29
 -->
<template>
  <svg class="svg-icon" aria-hidden="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script>
export default {
  name: "icon-svg",
  props: {
    iconClass: {
      type: String,
      required: true
    },
    click: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    iconName() {
      return `#${this.iconClass}`;
    }
  }
};
</script>

<style lang="less">
.svg-icon {
  width: 1em;
  height: 1em;
  /* vertical-align: -0.15em; */
  vertical-align: middle;
  fill: currentColor;
  overflow: hidden;
  font-size: 0.16rem;
}
.el-button {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  vertical-align: middle;
  span {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .svg-icon {
    font-size: 0.12rem;
    margin-right: 5px;
  }
}
// 全局按钮样式
.svg-icon.danger {
  cursor: pointer;
  color: @dangerColor;
}
.svg-icon.primary {
  cursor: pointer;
  color: @primaryColor;
}
</style>
