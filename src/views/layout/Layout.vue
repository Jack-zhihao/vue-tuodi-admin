<template>
  <div class="app-wrapper">
    <app-header></app-header>
    <div class="main-container">
      <sidebar></sidebar>
      <app-main></app-main>
    </div>
  </div>
</template>

<script>
import { AppHeader, Sidebar, AppMain } from "./components";

export default {
  name: "home",
  components: {
    AppHeader,
    Sidebar,
    AppMain
  }
};
</script>

<style lang="less" scoped>
.app-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
}
.main-container {
  overflow: hidden;
  display: flex;
  flex: 1;
}
</style>
