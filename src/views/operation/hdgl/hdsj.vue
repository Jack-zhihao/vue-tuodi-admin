<!--
 * @Description: 活动数据
 * @Autor: weijie.liang
 * @Date: 2019-09-26 09:08:22
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 19:01:14
 -->

<template>
  <div class="hdsj common__content">
    <td-content-header>
      活动数据
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleExport(isActive)"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
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
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label" v-if="isActive == 0">报名时间：</p>
          <p class="label" v-if="isActive == 1">签到时间：</p>
          <el-date-picker
            v-model="date1"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="startDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="date2"
            type="datetime"
            placeholder="选择结束时间"
            size="mini"
            clearable
            format="yyyy-MM-dd HH:mm"
            value-format="yyyy-MM-dd HH:mm"
            :picker-options="endDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-input
            ref="focusInput"
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
            style="flex:auto;max-width:200px"
          ></el-input>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <span
          v-for="(item, index) in tabArr"
          :key="index"
          class="dataTab"
          :class="{ active: isActive == index }"
          @click="active(index)"
          >{{ item.name }}</span
        >
        <el-table
          ref="table"
          v-loading="loadLiteratureData"
          v-if="isActive == 0"
          border
          :data="literatureListRegistration"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="dzdw" label="读者单位">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="optime" label="报名时间">
          </el-table-column>
        </el-table>
        <el-table
          ref="table"
          v-loading="loadLiteratureData"
          v-if="isActive == 1"
          border
          :data="literatureListCheckIn"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="dzdw" label="读者单位">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="optime" label="签到时间">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCountRegistration"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
          v-if="isActive == 0"
        ></td-pagination>
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCountCheckIn"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
          v-if="isActive == 1"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  searchRegistration,
  searchCheckIn,
  RegistrationExpo,
  CheckInExpo
} from "api/operation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
export default {
  name: "opera_hdsj",
  data() {
    this.literatureFilterOptions = [
      {
        value: "dzzhao",
        label: "读者证号"
      },
      {
        value: "xming",
        label: "读者姓名"
      },
      {
        value: "dzlxName",
        label: "读者类型"
      },
      {
        value: "dzdw",
        label: "读者单位"
      }
    ];
    return {
      // 导航条样式
      isActive: "",
      tabArr: [{ name: "报名数据" }, { name: "签到数据" }],

      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureListCheckIn: [],
      literatureListRegistration: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "dzzhao",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCountRegistration: 0,
      totalLiteratureCountCheckIn: 0,
      // 时间传参
      date1: "",
      date2: "",
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.date2)
            );
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return time.getTime() < new Date(this.date1);
        }
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.getLiteratureList();
    },

    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj,
        start: this.date1,
        end: this.date2,
        acId: this.$route.query.acId
      };
      // 报名列表
      searchRegistration(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureListRegistration = res.data.dataList;
          this.totalLiteratureCountRegistration = Number(
            res.data.totalElements
          );
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
      // 签到列表
      searchCheckIn(requestObj)
        .then(res => {
          this.literatureListCheckIn = res.data.dataList;
          this.totalLiteratureCountCheckIn = Number(res.data.totalElements);
        })
        .catch(() => {});
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },

    // 导出
    handleExport(index) {
      if (index == 0) {
        downLoadExcel(RegistrationExpo(), {
          acId: this.$route.query.acId,
          ...this.requestObj
        });
      } else if (index == 1) {
        downLoadExcel(CheckInExpo(), {
          acId: this.$route.query.acId,
          ...this.requestObj
        });
      }
    },
    active(index) {
      this.isActive = index;
    }
  },
  mounted() {
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
.el-date-editor {
  flex: auto !important;
  max-width: 160px;
}
.dataTab {
  display: inline-block;
  width: 80px;
  border-bottom: 1px solid #fff;
  margin: 0 10px 10px 15px;
  text-align: center;
  padding-bottom: 5px;
  cursor: pointer;
}

.active {
  border-bottom: 1px solid #0079fe;
}
.el-table {
  height: 94% !important;
}
</style>
