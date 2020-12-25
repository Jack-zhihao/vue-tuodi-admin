<template>
  <div class="cardContent">
    <el-scrollbar>
      <div class="tab__container">
        <div class="c-tab__header">
          <span
            class="header__item"
            v-for="(item, index) in bottomTabs"
            @click="changeBottomMode(item.value)"
            :key="index"
            :class="{ active: currentBottomMode === item.value }"
            >{{ item.label }}</span
          >
        </div>
        <div class="itemCard">
          <keep-alive>
            <wxlt-jc v-if="currentBottomMode == 'jc'"></wxlt-jc>
          </keep-alive>
          <keep-alive>
            <wxlt-gh v-if="currentBottomMode == 'gh'"></wxlt-gh>
          </keep-alive>
          <keep-alive>
            <wxlt-xj v-if="currentBottomMode == 'xj'"></wxlt-xj>
          </keep-alive>
          <keep-alive>
            <wxlt-jhyt v-if="currentBottomMode == 'jhyt'"></wxlt-jhyt>
          </keep-alive>
          <keep-alive>
            <wxlt-tscx v-if="currentBottomMode == 'tscx'"></wxlt-tscx>
          </keep-alive>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import WxltGh from "./components/WxltGh";
import WxltJc from "./components/WxltJc";
import WxltXj from "./components/WxltXj";
import WxltJhyt from "./components/WxltJhyt";
import WxltTscx from "./components/WxltTscx";
export default {
  name: "cir_jhgl",
  components: {
    WxltGh,
    WxltJc,
    WxltJhyt,
    WxltXj,
    WxltTscx
  },
  data() {
    this.bottomTabs = [
      {
        value: "jc",
        label: "借出"
      },
      {
        value: "gh",
        label: "归还"
      },
      {
        value: "xj",
        label: "续借"
      },
      {
        value: "jhyt",
        label: "借还一体"
      },
      {
        value: "tscx",
        label: "图书查询"
      }
    ];
    return {
      activeName: "first",
      currentBottomMode: "jc"
    };
  },
  methods: {
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    }
  }
};
</script>

<style lang="less" scoped>
.cardContent {
  background: @contentHdColor;
  box-sizing: border-box;
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}

.itemCard {
  height: 100%;
  box-shadow: 0 0 0 0;
  border: 0;
}
.tab__container {
  .c-tab__header {
    display: flex;
    height: 36px;
    align-items: center;
    background: @topBgColor;
    .header__item {
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding: 0 17px;
      font-size: @FSize_15;
      &.active {
        font-weight: bold;
        color: @primaryColor;
        background: @contentHdColor;
      }
    }
  }
  /deep/ tr th {
    background: @contentHdColor;
  }
}
</style>
