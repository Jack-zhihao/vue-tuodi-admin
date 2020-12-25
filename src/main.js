/*
 * @Description:
 * @Autor: wj.liang
 * @Date: 2019-08-27 09:30:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-05 16:37:05
 */
import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import directives from "directives";
import VeHistogram from "v-charts/lib/histogram.common"; // 柱状图
import VePie from "v-charts/lib/pie.common"; // 饼状图
import VeLine from "v-charts/lib/line.common"; // 折线图
import VeRing from "v-charts/lib/ring.common"; //环图
import VeMap from "v-charts/lib/map.common"; // 地图
import mixin from "mixins";

Vue.mixin(mixin);
Vue.use(directives);
Vue.component(VeHistogram.name, VeHistogram);
Vue.component(VePie.name, VePie);
Vue.component(VeLine.name, VeLine);
Vue.component(VeRing.name, VeRing);
Vue.component(VeMap.name, VeMap);
Vue.prototype.$TDConfig = window.TD_WEB_Config;
Vue.prototype.$TDLib = "";

// Vue.prototype.$TDLib = "yun";
if (location.host === "yun.library3.cn") {
  Vue.prototype.$TDLib = "yun";
}

import "./permission";
import "./plugins/element.js";

import "styles/reset.less"; // 重置样式
import "styles/global.less"; // 全局样式

import TDPagination from "components/TDPagination";
import TDContentHeader from "components/ContentHeader";
import ActionTooltip from "components/ActionTooltip";
import SideWrap from "components/SideWrap";
import IconSvg from "@/components/IconSvg";

import * as filters from "filters"; // global filters

Vue.component("td-pagination", TDPagination);
Vue.component("td-content-header", TDContentHeader);
Vue.component("td-action-tool", ActionTooltip);
Vue.component("side-wrap", SideWrap);
Vue.component("icon-svg", IconSvg);

Vue.prototype.$eventBus = new Vue();

// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
});

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
