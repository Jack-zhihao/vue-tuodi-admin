<template>
  <div class="c-content-header">
    <div class="content__header_title">
      <slot></slot>
    </div>
    <slot name="btns"></slot>
  </div>
</template>

<style lang="less" scoped>
.c-content-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  .content__header_title {
    .contentTitle();
  }
}
</style>
