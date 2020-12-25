<template>
  <div class="jrzl-jrzl common__content">
    <td-content-header>
      接入总览
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">选择区域：</span>
          <el-cascader
            v-model="region"
            :options="regionArr"
            @change="handleChange"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'areaId',
              label: 'areaName',
              children: 'childs'
            }"
            size="mini"
            clearable
          >
            <template slot-scope="scope">
              {{ scope.data.areaName }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{
                getLibCounts(scope.data.areaId)
              }}
            </template>
          </el-cascader>
          <span class="label" style="marginLeft:20px"
            >已接入成员馆：<span v-show="!loading">{{ access }}</span
            ><i v-show="loading" class="el-icon-loading"></i
          ></span>
          <span class="label" style="marginLeft:40px"
            >待接入成员馆：<span v-show="!loading">{{ count - access }}</span
            ><i v-show="loading" class="el-icon-loading"></i
          ></span>
        </div>
        <div class="content__table"></div>
      </div>
      <div class="content__table">
        <ve-map
          style="margin: auto;"
          height="100%"
          width="80%"
          :data="chartData"
          :settings="chartSettings"
          :extend="chartExtend"
        ></ve-map>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  searchLibArea,
  accessPandect
} from "api/data";
import cityMap from "./countryData.js";

export default {
  name: "jrzl_jrzl",
  computed: {
    chartSettings() {
      return {
        mapURLProfix: "./geo/data/",
        // mapURLProfix: "https://geo.datav.aliyun.com/areas/bound/", // http://datav.aliyun.com/tools/atlas/#&lat=33.50475906922609&lng=104.2822265625&zoom=4
        position: this.position
      };
    }
  },
  data() {
    this.chartExtend = {
      series: {
        itemStyle: {
          areaColor: "rgba(23, 27, 57,0)",
          borderColor: "#378de6",
          borderWidth: 1
        }
      }
    };
    return {
      position: "100000_full",
      areaId: "",
      loading: false,
      memberLib: "",
      count: 0,
      access: 0,
      region: [],
      regionArr: [],
      idArr: {},
      chartData: {
        columns: ["位置", "已接入成员馆", "待接入成员馆"],
        rows: []
      }
    };
  },
  methods: {
    getLibCounts(key) {
      return this.idArr[key];
    },
    // 树形馆的对应数量
    treeLibCount() {
      treeLibCount().then(res => {
        this.idArr = res.data;
      });
    },
    getAccessPandect() {
      this.loading = true;
      accessPandect({
        areaId: this.areaId
      })
        .then(res => {
          let count = 0,
            access = 0;
          res.data.forEach(area => {
            count += +area.count;
            access += +area.access;
          });
          this.chartData.rows = res.data
            .filter(area => area.areaId !== this.areaId)
            .map(area => {
              return {
                位置: area.areaName,
                已接入成员馆: area.access,
                待接入成员馆: area.count - area.access
              };
            });

          this.count = count;
          this.access = access;
        })
        .finally(() => {
          this.loading = false;
        });
    },
    // 选择区域
    handleChange(value) {
      this.memberLib = "";
      this.areaId = value;
      // 触发了区域选择事件
      this.isSelectRegion = true;
      // 找到对应的映射
      let currCountryName = this.treeDataMap[value];
      if (cityMap[currCountryName]) {
        this.position = cityMap[currCountryName] + "_full";
      } else {
        this.$message.warning("没有选中区域的地图数据");
        // this.position = "100000_full";
      }
      this.getAccessPandect();
    },
    recursion(data) {
      data.forEach(item => {
        this.treeDataMap[item.areaId] = item.areaName;
        if (item.childs) {
          this.recursion(item.childs);
        }
      });
    },
    // 区域树状图
    getAreaTreeData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = treeData;
        this.areaId = "";

        this.treeDataMap = {}; // 把区域id和区域名字关联
        this.recursion(treeData);
      });
    },
    // 查询馆id对应的区域
    searchLibArea(libId) {
      let params = {
        libId
      };
      searchLibArea(params).then(res => {
        // 显示地区
        this.region = res.data.areaId;
        this.areaId = res.data.areaId;
      });
    }
  },
  created() {
    this.getAreaTreeData();
    this.treeLibCount();
    this.getAccessPandect();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content {
  position: relative;
  .el-select {
    flex: 0 0 100px !important;
  }
}
</style>
