<template>
  <div class="p-simple-menu">
    <div class="container">
      <div class="container__left">
        <div class="part__half part__liutong" @click="checkLiutong">
          <div class="part__label">流通</div>
          <img :src="liutongIcon" class="part__icon" />
        </div>
      </div>
      <div class="container__right">
        <div class="part__quater part__bianmu" @click="checkBianmu">
          <div class="part__label">编目</div>
          <img :src="bianmuIcon" class="part__icon" />
        </div>
        <div class="part__quater part__banzheng">
          <div class="part__label">办证</div>
          <img :src="banzhengIcon" class="part__icon" />
          <div class="part__menus">
            <div
              v-if="show_cir_dzgl"
              @click="
                $router.push({ name: 'simple_dzgl', query: { open: true } })
              "
              class="part__menu"
            >
              新增
            </div>
            <div
              v-if="show_cir_dzpdr"
              @click="$router.push({ name: 'simple_dzpdr' })"
              class="part__menu"
            >
              批量导入
            </div>
          </div>
        </div>
        <div class="part__quater part__chaxun">
          <div class="part__label">查询</div>
          <img :src="chaxunIcon" class="part__icon" />
          <div class="part__menus">
            <div
              v-if="show_cir_dzgl"
              @click="$router.push({ name: 'simple_dzgl' })"
              class="part__menu"
            >
              读者
            </div>
            <div
              v-if="show_res_gcsmqd"
              @click="$router.push({ name: 'simple_gcsmqd' })"
              class="part__menu"
            >
              馆藏书目
            </div>
            <div
              v-if="show_res_dcqd"
              @click="$router.push({ name: 'simple_dcqd' })"
              class="part__menu"
            >
              典藏清单
            </div>
            <div
              v-if="show_cir_dzjylscx"
              @click="$router.push({ name: 'simple_dzjylscx' })"
              class="part__menu"
            >
              读者借阅
            </div>
            <div
              v-if="show_cir_wxjylscx"
              @click="$router.push({ name: 'simple_wxjylscx' })"
              class="part__menu"
            >
              文献借阅
            </div>
          </div>
        </div>
        <div class="part__quater part__tongji">
          <div class="part__label">统计</div>
          <img :src="tongjiIcon" class="part__icon" />
          <div class="part__menus">
            <div
              v-if="show_cir_dzjhtj"
              @click="$router.push({ name: 'simple_dzjhtj' })"
              class="part__menu"
            >
              读者借还
            </div>
            <div
              v-if="show_cir_dzjyphb"
              @click="$router.push({ name: 'simple_dzjyphb' })"
              class="part__menu"
            >
              读者排行
            </div>
            <div
              v-if="show_cir_wxjyphb"
              @click="$router.push({ name: 'simple_wxjyphb' })"
              class="part__menu"
            >
              文献排行
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import liutongIcon from "assets/simple/ico_liutong.png";
import bianmuIcon from "assets/simple/ico_bianmu.png";
import banzhengIcon from "assets/simple/ico_banzheng.png";
import chaxunIcon from "assets/simple/ico_chaxun.png";
import tongjiIcon from "assets/simple/ico_tongji.png";

export default {
  mounted() {
    this.generateMenus();
  },
  data() {
    this.liutongIcon = liutongIcon;
    this.bianmuIcon = bianmuIcon;
    this.banzhengIcon = banzhengIcon;
    this.chaxunIcon = chaxunIcon;
    this.tongjiIcon = tongjiIcon;
    return {
      show_cir_jhgl: false,
      show_cat_xzbm: false,
      show_cir_dzgl: false,
      show_cir_dzpdr: false,
      show_res_gcsmqd: false,
      show_res_dcqd: false,
      show_cir_dzjylscx: false,
      show_cir_wxjylscx: false,
      show_cir_dzjhtj: false,
      show_cir_dzjyphb: false,
      show_cir_wxjyphb: false
    };
  },
  methods: {
    checkLiutong() {
      if (!this.show_cir_jhgl) {
        this.$message.warning("没有 流通-借还管理 权限，请联系管理员开通");
        return;
      }
      this.$router.push({
        name: "simple_jhgl"
      });
    },
    checkBianmu() {
      if (!this.show_cat_xzbm) {
        this.$message.warning("没有 编目 权限，请联系管理员开通");
        return;
      }
      this.$router.push({
        name: "simple_xzbm"
      });
    },
    generateMenus() {
      const addRouters = this.$store.getters.addRouters;
      const firstMenus = [
        "circulation_wxlt",
        "catalogue_wxbm",
        "circulation_dzgl",
        "circulation_ltcx",
        "circulation_lttj",
        "reservation_dctj"
      ];
      // 对应原来的页面
      // 流通
      // 借还管理 - circulation_wxlt - [cir_jhgl]

      // 编目
      // 新增书目 - catalogue_wxbm - [cat_xzbm]

      // 办证
      // 读者管理 - circulation_dzgl - [cir_dzgl]
      // 读者批导入 - circulation_dzgl -[cir_dzpdr]

      // 查询
      // 读者 - circulation_dzgl - [cir_dzgl]
      // 馆藏书目清单 - reservation_dctj -[res_gcsmqd]
      // 典藏清单 - reservation_dctj -[res_dcqd]
      // 读者借阅历史 - circulation_ltcx -[cir_dzjylscx]
      // 文献借阅历史 - circulation_ltcx -[cir_wxjylscx]

      // 统计
      // 读者借还 - circulation_lttj - [cir_dzjhtj]
      // 读者排行 - circulation_lttj - [cir_dzjyphb]
      // 文献排行 - circulation_lttj - [cir_wxjyphb]

      for (let i = 0; i < addRouters.length; i++) {
        let currentMenuName = addRouters[i].name;
        if (!firstMenus.includes(currentMenuName)) {
          continue;
        }
        addRouters[i].children.forEach(router => {
          switch (router.name) {
            case "cir_jhgl":
              this.show_cir_jhgl = true;
              break;
            case "cat_xzbm":
              this.show_cat_xzbm = true;
              break;
            case "cir_dzgl":
              this.show_cir_dzgl = true;
              break;
            case "cir_dzpdr":
              this.show_cir_dzpdr = true;
              break;
            case "res_gcsmqd":
              this.show_res_gcsmqd = true;
              break;
            case "res_dcqd":
              this.show_res_dcqd = true;
              break;
            case "cir_dzjylscx":
              this.show_cir_dzjylscx = true;
              break;
            case "cir_wxjylscx":
              this.show_cir_wxjylscx = true;
              break;
            case "cir_dzjhtj":
              this.show_cir_dzjhtj = true;
              break;
            case "cir_dzjyphb":
              this.show_cir_dzjyphb = true;
              break;
            case "cir_wxjyphb":
              this.show_cir_wxjyphb = true;
              break;
            default:
              break;
          }
        });
      }
    }
  }
};
</script>

<style lang="less" scoped>
.p-simple-menu {
  position: relative;
  padding-top: 30px;
  top: -30px;
  background-image: url("~assets/simple/bg.png");
  background-size: 100% 100%;
  .container {
    display: flex;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 86%;
    margin: 4% auto;
    .container__left {
      width: 30.5%;
    }
    .part__half {
      position: relative;
      height: 100%;
      width: 100%;
      background: rgba(48, 166, 255, 1);
      box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.3);
      border-radius: 20px;
    }
    .container__right {
      flex: 1;
      margin-left: 30px;
    }
    .part__half,
    .part__quater {
      cursor: pointer;
      &:hover {
        .part__label {
          opacity: 0.8;
        }
      }
    }
    .part__quater {
      position: relative;
      display: inline-block;
      overflow: hidden;
      width: ~"calc(50% - 15px)";
      height: ~"calc(50% - 15px)";
      box-shadow: 0px 5px 20px 0px rgba(0, 0, 0, 0.3);
      border-radius: 20px;
      .part__label {
        bottom: 8.33%;
        right: 7.59%;
      }
      &:hover {
        .part__menus {
          display: block;
        }
      }
      &:nth-child(2n + 1) {
        margin-right: 30px;
      }
      &:nth-child(-n + 2) {
        margin-bottom: 30px;
      }
    }
    .part__icon {
      position: absolute;
    }
    .part__menus {
      position: absolute;
      height: 100%;
      width: 38.99%;
      right: 0;
      display: none;
      .part__menu {
        position: relative;
        height: 20%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 10%;
        font-size: 26px;
        color: rgba(255, 255, 255, 1);
        opacity: 0.6;
        text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.1);
        &::after {
          content: "";
          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          position: absolute;
          bottom: 0;
        }
        &:last-child {
          &::after {
            content: none;
          }
        }
        &:hover {
          color: rgba(255, 255, 255, 1);
          opacity: 1;
        }
      }
    }
    .part__banzheng {
      .part__menus {
        background: rgba(202, 85, 85, 0.94);
      }
    }
    .part__chaxun {
      .part__menus {
        background: rgba(90, 109, 222, 0.94);
      }
    }
    .part__tongji {
      .part__menus {
        background: rgba(201, 121, 57, 0.94);
      }
    }
    .part__label {
      position: absolute;
      font-size: 90px;
      color: #fff;
      text-shadow: 0px 2px 0px rgba(0, 0, 0, 0.1);
    }
    .part__liutong {
      background-image: url("~assets/simple/jijian_03.jpg");
      background-size: 100% 100%;
      .part__icon {
        width: 60.6%;
        max-height: 40.4%;
        left: 7.8%;
        top: 6.4%;
      }
      .part__label {
        bottom: 4%;
        right: 6.2%;
      }
    }
    .part__bianmu {
      background-image: url("~assets/simple/jijian_05.jpg");
      background-size: 100% 100%;
      .part__icon {
        width: 42.96%;
        max-height: 67.22%;
        left: 5.56%;
        top: 8.33%;
      }
    }
    .part__banzheng {
      background-image: url("~assets/simple/jijian_07.jpg");
      background-size: 100% 100%;
      .part__icon {
        width: 52.57%;
        max-height: 50%;
        left: 5.56%;
        top: 8.33%;
      }
    }
    .part__chaxun {
      background-image: url("~assets/simple/jijian_11.jpg");
      background-size: 100% 100%;
      .part__icon {
        width: 47.41%;
        max-height: 70%;
        left: 5.56%;
        top: 8.33%;
      }
    }
    .part__tongji {
      background-image: url("~assets/simple/jijian_12.jpg");
      background-size: 100% 100%;
      .part__icon {
        width: 44.81%;
        max-height: 67.22%;
        left: 5.56%;
        top: 8.33%;
      }
    }
  }
}
@media screen and (min-width: 320px) {
  .p-simple-menu {
    .container {
      .part__label {
        font-size: 70px;
      }
    }
  }
}
</style>
