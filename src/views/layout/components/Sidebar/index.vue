<template>
  <div class="app-sidebar">
    <div class="side__title" :class="{ hide: isCollapse }">
      <span class="txt" v-show="!isCollapse">菜单栏</span>
      <i
        v-show="!isCollapse"
        class="el-icon-caret-left"
        @click="isCollapse = true"
      ></i>
      <i
        v-show="isCollapse"
        class="el-icon-caret-right"
        @click="isCollapse = false"
      ></i>
    </div>
    <div class="side-wrapper">
      <el-scrollbar wrap-class="scrollbar-wrapper">
        <el-menu
          :default-active="defaultActive"
          class="el-menu-vertical-demo"
          router
          :collapse="isCollapse"
        >
          <!-- 展示全部模块菜单，根据一级菜单显示/隐藏 -->
          <sidebar-item
            v-for="(menuObject, index) in classifyMenus"
            v-show="currentFirstMenu === menuObject.name"
            :menus="menuObject.menus"
            :key="index"
          ></sidebar-item>
        </el-menu>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
export default {
  components: {
    SidebarItem
  },
  computed: {
    ...mapGetters(["permission_routers", "currentFirstMenu"])
  },
  watch: {
    $route() {
      this.defaultActive = this.$route.path;
    }
  },
  data() {
    return {
      defaultActive: this.$route.path,
      isCollapse: false,
      classifyMenus: {}
    };
  },
  methods: {
    classifyMenu(routers) {
      let classifyObject = {};
      let firstMenus = [];
      routers.forEach(route => {
        if (!route.hidden) {
          let path = route.path;
          let firstMenuName = path.substring(1, path.indexOf("/", 1));
          if (!classifyObject[firstMenuName]) {
            classifyObject[firstMenuName] = {
              name: firstMenuName,
              menus: []
            };
            firstMenus.push(firstMenuName);
          }
          classifyObject[firstMenuName].menus.push(route);
        }
      });
      this.classifyMenus = classifyObject;
      if (this.currentFirstMenu === "base") {
        // 欢迎页面展示第一个菜单
        this.$store.commit("SET_CURRENTMENU", firstMenus[0]);
      }
      this.$store.commit("SET_FIRSTMENUS", firstMenus);
    }
  },
  mounted() {
    this.classifyMenu(this.permission_routers);
  }
};
</script>

<style lang="less" scoped>
.app-sidebar {
  background: #fff;
  overflow: hidden;
  flex-shrink: 0;
  .side__title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 40px;
    border-bottom: 1px solid @borderColor;
    border-right: 1px solid @borderColor;
    padding: 0 18px 0 13px;
    &.hide {
      justify-content: center;
    }
    .txt {
      padding-left: 35px;
      font-size: @FSize_15;
      font-weight: bold;
      color: @fontBaseColor;
    }
    i {
      cursor: pointer;
      font-size: @FSize_16;
    }
  }
  .side-wrapper {
    height: ~"calc(100vh - 44px - 70px)";
    border-right: solid 1px @borderColor;
  }
}
</style>

<style lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 160px;
  min-height: 400px;
}
.el-scrollbar {
  height: 100%;
}
.app-sidebar {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}
</style>
