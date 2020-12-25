<template>
  <div class="simple-wrapper">
    <app-header></app-header>
    <div class="simple__return">
      <div class="btn" @click="$router.push({ name: 'simple_menu' })">
        <icon-svg icon-class="icon-huifu" style="margin-right: 5px;" />
        返回
      </div>
    </div>
    <div class="simple__content">
      <router-view></router-view>
    </div>
    <app-footer></app-footer>
  </div>
</template>

<script>
import { AppHeader, AppFooter } from "./components";

export default {
  name: "home",
  components: {
    AppHeader,
    AppFooter
  }
};
</script>

<style lang="less" scoped>
.simple-wrapper {
  height: 100%;
}
.simple__return {
  height: 30px;
  line-height: 30px;
  padding-left: 20px;
  font-weight: bold;
  .btn {
    width: 60px;
    display: flex;
    align-items: center;
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
}
.simple__content {
  height: ~"calc(100% - 50px - 30px - 30px)";
  background: #fff;
  > div {
    height: 100%;
  }
}
</style>
