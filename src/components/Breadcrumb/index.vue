<template>
  <el-breadcrumb separator="/">
    <el-breadcrumb-item v-for="(item, index) in levelList" :key="item.name">
      <span
        v-if="item.redirect === 'noredirect' || index == levelList.length - 1"
        class="no-redirect"
        >{{ item.meta.title }}</span
      >
      <a v-else @click.prevent="routerClick(item.name)">{{
        item.meta.title
      }}</a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
export default {
  data() {
    return {
      levelList: null
    };
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  created() {
    this.getBreadcrumb();
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const first = matched[0];
      if (first) {
        let path = first.path;
        let firstMenuName = path.substring(1, path.indexOf("/", 1));
        let menuCn = {
          acquisition: "采访",
          catalogue: "编目",
          reservation: "典藏",
          periodical: "期刊",
          circulation: "流通",
          setting: "设置"
        };
        matched = [
          {
            path: `/${firstMenuName}`,
            redirect: "noredirect",
            meta: { title: menuCn[firstMenuName] }
          }
        ].concat(matched);
      }
      // if (
      //   first &&
      //   first.name.trim().toLocaleLowerCase() !==
      //     "Dashboard".toLocaleLowerCase()
      // ) {
      //   matched = [{ path: "/dashboard", meta: { title: "dashboard" } }].concat(
      //     matched
      //   );
      // }
      this.levelList = matched.filter(
        item => item.meta && item.meta.title && item.meta.breadcrumb !== false
      );
    },
    routerClick(name) {
      this.$router.push({
        name: name
      });
    }
  }
};
</script>

<style lang="less" scoped>
.el-breadcrumb {
  height: 44px;
  line-height: 44px;
  padding-left: 20px;
  /deep/ .el-breadcrumb__separator {
    color: @fontDarkColor;
  }
  /deep/ .el-breadcrumb__inner {
    font-size: @FSize_16 !important;
    color: @fontDarkColor !important;
    font-weight: bold !important;
  }
}
</style>
