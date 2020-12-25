<template>
  <div class="app-main">
    <app-bread-crumb v-if="false"></app-bread-crumb>
    <tags-view></tags-view>

    <div class="app_content">
      <keep-alive :include="cachedViews">
        <router-view></router-view>
      </keep-alive>
    </div>

    <app-footer></app-footer>
  </div>
</template>

<script>
import AppBreadCrumb from "components/Breadcrumb";
import AppFooter from "./AppFooter";
import TagsView from "./TagsView";

export default {
  components: {
    AppBreadCrumb,
    TagsView,
    AppFooter
  },
  computed: {
    cachedViews() {
      return this.$store.state.tagsView.cachedViews;
    }
  }
};
</script>

<style lang="less">
.app-main {
  flex: auto;
  overflow: hidden;
  background: #fff;
  .app_content {
    height: ~"calc(100% - 40px - 30px)";
    background: #fff;
    > div {
      height: 100%;
    }
  }
  .app__footer {
    background: #f1f1f1;
    height: 30px;
    line-height: 30px;
    text-align: center;
    font-size: @FSize_14;
  }
}
</style>
