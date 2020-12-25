<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 15:05:37
 -->
<template>
  <div class="common__content">
    <td-content-header>
      馆藏清查统计
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleDownLoadExcel">
            <icon-svg icon-class="icon-daochu" />导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="libid"
            placeholder="请选择"
            @change="changeLib"
            clearable
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">清查类别：</p>
          <el-select
            clearable
            filterable
            size="mini"
            v-model="qcTypeId"
            placeholder="请选择"
            :key="menuKey"
          >
            <el-option
              v-for="item in typeArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <span class="label">清查日期：</span>
          <el-date-picker
            v-model="date1"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="开始时间"
            style="marginRight:3px"
            :picker-options="startDatePicker"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            type="datetime"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="结束时间"
            :picker-options="endDatePicker"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loading"
          border=""
          :data="gcsmqdList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="invertoryName"
            label="清查类别"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="marcCount"
            label="种数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="shuceCount"
            label="册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="shucePrice"
            label="金额(元)"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="marcScale"
            label="种数比例%"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="shuceScale"
            label="册数比例%"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="priceScale"
            label="金额比例%"
          ></el-table-column>
        </el-table>
      </div>
    </div>
  </div>
</template>

<script>
import { marcshuceList, findTypes, marcshuceListtExcel } from "api/reservation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";

export default {
  name: "res_gcqctj",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.startDatePicker = {
      disabledDate: time => {
        if (this.date2) {
          return (
            // 如果结束时间已经选择
            time.getTime() > new Date(this.date2)
          );
        }
      }
    };
    this.endDatePicker = {
      disabledDate: time => {
        return time.getTime() < new Date(this.date1) - 8.64e7;
      }
    };
    return {
      libid: this.$store.getters.userInfo.libId,
      qcTypeId: "",
      typeArr: [],
      date1: "",
      date2: "",
      loading: false,
      gcsmqdList: [],
      menuKey: 1
    };
  },
  watch: {
    typeArr() {
      ++this.menuKey;
    }
  },
  methods: {
    search() {
      this.loading = true;
      marcshuceList({
        libId: this.libid,
        inventoryId: this.qcTypeId,
        start: this.date1,
        end: this.date2
      })
        .then(res => {
          this.loading = false;
          this.gcsmqdList = res.data;
        })
        .catch(() => {
          this.loading = false;
        });
    },
    findTypes() {
      let newArr = [];
      this.qcTypeId = "";
      findTypes({
        libId: this.libid
      }).then(res => {
        if (res.data.dataList.length > 0) {
          newArr = res.data.dataList.map(item => {
            return {
              value: item.inventoryId,
              label: item.inventoryName
            };
          });
        }

        if (newArr.length > 1) {
          newArr.unshift({ label: "全部", value: "" });
        }
        this.typeArr = newArr;
      });
    },
    changeLib() {
      this.findTypes();
    },
    handleDownLoadExcel() {
      downLoadExcel(marcshuceListtExcel(), {
        libId: this.libid,
        inventoryId: this.qcTypeId,
        start: this.date1,
        end: this.date2
      });
    }
  },
  created() {
    this.search();
    this.findTypes();
  },
  activated() {
    this.findTypes();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
