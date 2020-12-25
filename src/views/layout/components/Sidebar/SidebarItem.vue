<template>
  <div>
    <el-submenu
      v-for="(submenu, index) in menus"
      :key="index"
      :index="submenu.path"
    >
      <template slot="title">
        <icon-svg :icon-class="submenu.meta.icon" />
        <span class="title" style="margin-left: 5px;">{{
          submenu.meta.title
        }}</span>
      </template>
      <el-menu-item
        :index="resolvePath(thirdMenu.path, submenu.path)"
        v-for="(thirdMenu, index) in submenu.children"
        v-show="!thirdMenu.meta.hide"
        :key="index"
        >{{ thirdMenu.meta.title }}</el-menu-item
      >
    </el-submenu>
  </div>
</template>

<script>
export default {
  props: {
    menus: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    resolvePath(path, parentPath) {
      return `${parentPath}/${path}`;
    }
  }
};
</script>

<style lang="less">
.el-menu--collapse {
  .el-submenu__icon-arrow,
  .title {
    display: none;
  }
}
</style>
