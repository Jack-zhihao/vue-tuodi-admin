<template>
  <div class="tags-view-container">
    <scroll-pane ref="scrollPane" class="tags-view-wrapper">
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        :key="tag.path"
        tag="span"
        class="tags-view-item"
        @click.middle.native="closeSelectedTag(tag)"
        @contextmenu.prevent.native="openMenu(tag, $event)"
      >
        {{ tag.title }}
        <span
          class="el-icon-close"
          v-if="tag.name !== 'welcome'"
          @click.prevent.stop="closeSelectedTag(tag)"
        />
      </router-link>
    </scroll-pane>
    <el-popover
      placement="bottom"
      width="120"
      trigger="click"
      popper-class="pop__menus_wrapper"
    >
      <div class="pop__menus">
        <el-scrollbar wrap-class="scrollbar-wrapper">
          <div
            v-for="(tag, index) in visitedViews"
            class="pop__menu"
            :class="isActive(tag) ? 'active' : ''"
            :key="index"
            @click="handlePopMenuClick(tag)"
          >
            <span class="check"><i class="el-icon-check"></i></span>
            {{ tag.title }}
          </div>
        </el-scrollbar>
      </div>
      <el-button
        slot="reference"
        size="small"
        type="text"
        class="showPopIcon"
        icon="el-icon-d-arrow-right"
      ></el-button>
    </el-popover>

    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="closeSelectedTag(selectedTag)">关闭当前页</li>
      <li @click="closeOthersTags">关闭其他页</li>
      <li @click="closeAllTags">关闭全部页面</li>
    </ul>
  </div>
</template>

<script>
import ScrollPane from "components/ScrollPane";
export default {
  components: {
    ScrollPane
  },
  data() {
    return {
      visible: false,
      top: 0,
      left: 0,
      selectedTag: {}
    };
  },
  computed: {
    visitedViews() {
      return this.$store.state.tagsView.visitedViews;
    }
  },
  watch: {
    $route() {
      this.addViewTags();
      this.moveToCurrentTag();
    },
    visible(value) {
      if (value) {
        document.body.addEventListener("click", this.closeMenu);
      } else {
        document.body.removeEventListener("click", this.closeMenu);
      }
    }
  },
  mounted() {
    this.addViewTags();
  },
  methods: {
    isActive(route) {
      return route.path === this.$route.path;
    },
    addViewTags() {
      const { name } = this.$route;
      if (name) {
        this.$store.dispatch("addView", this.$route);
      }
      return false;
    },
    moveToCurrentTag() {
      const tags = this.$refs.tag;
      this.$nextTick(() => {
        for (const tag of tags) {
          if (tag.to.path === this.$route.path) {
            this.$refs.scrollPane.moveToTarget(tag);

            // when query is different then update
            if (tag.to.fullPath !== this.$route.fullPath) {
              this.$store.dispatch("updateVisitedView", this.$route);
            }

            break;
          }
        }
      });
    },
    closeSelectedTag(view) {
      this.$store.dispatch("delView", view).then(({ visitedViews }) => {
        if (this.isActive(view)) {
          const latestView = visitedViews.slice(-1)[0];
          if (latestView) {
            this.$router.push(latestView);
          } else {
            this.$router.push("/");
          }
        }
      });
    },
    openMenu(tag, e) {
      if (tag.name === "welcome") {
        return;
      }
      const menuMinWidth = 104;
      const offsetLeft = this.$el.getBoundingClientRect().left; // container margin left
      const offsetWidth = this.$el.offsetWidth; // container width
      const maxLeft = offsetWidth - menuMinWidth; // left boundary
      const left = e.clientX - offsetLeft + 85; // 85: left

      if (left > maxLeft) {
        this.left = maxLeft;
      } else {
        this.left = left;
      }
      this.top = e.clientY;

      this.visible = true;
      this.selectedTag = tag;
    },
    closeMenu() {
      this.visible = false;
    },
    closeOthersTags() {
      this.$router.push(this.selectedTag);
      this.$store.dispatch("delOthersViews", this.selectedTag).then(() => {
        this.moveToCurrentTag();
      });
    },
    closeAllTags() {
      this.$store.dispatch("delAllViews");
      this.$router.push("/");
    },
    handlePopMenuClick(tag) {
      this.$router.push({
        path: tag.path,
        query: tag.query,
        fullPath: tag.fullPath
      });
    }
  }
};
</script>

<style lang="less">
//reset element css of el-icon-close
.tags-view-wrapper {
  .tags-view-item {
    .el-icon-close {
      width: 16px;
      height: 16px;
      line-height: 16px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;
      &:before {
        transform: scale(0.8);
        display: inline-block;
        vertical-align: -1px;
      }
      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
.pop__menus_wrapper {
  margin-top: 0 !important;
  padding: 10px 0 !important;
  .pop__menus {
    height: 400px;
    .pop__menu {
      text-indent: 36px;
      font-size: @FSize_14;
      color: @fontDarkColor;
      line-height: 36px;
      cursor: pointer;
      position: relative;
      .check {
        display: none;
        position: absolute;
        left: -54px;
      }
      &:hover {
        background: @hoverBgColor;
      }
      &.active {
        color: @primaryColor;
        .check {
          display: inline-block;
        }
      }
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
  }
}
</style>

<style lang="less" scoped>
.tags-view-container {
  display: flex;
  height: 40px;
  width: 100%;
  background: #fff;
  box-shadow: 0px 1px 0px 0px rgba(234, 234, 234, 1);
  border-bottom: solid 1px @borderColor;
  .tags-view-wrapper {
    width: ~"calc(100% - 22px - 30px)";
    margin-right: 20px;
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 32px;
      line-height: 32px;
      border: 1px solid @tableBorderColor;
      color: @fontBaseColor;
      background: #fff;
      padding: 0 15px;
      font-size: @FSize_15;
      margin-left: 6px;
      margin-top: 2px;
      &:first-of-type {
        margin-left: 15px;
      }
      &:last-of-type {
        margin-right: 15px;
      }
      &.active {
        background-color: @primaryColor;
        color: #fff;
        font-weight: bold;
        border-color: @primaryColor;
      }
    }
  }
  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 101;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);
    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;
      &:hover {
        background: #eee;
      }
    }
  }
  .showPopIcon {
    font-size: @FSize_20;
    color: @fontBaseColor;
    &:hover {
      color: @primaryColor;
    }
  }
}
</style>
