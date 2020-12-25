<template>
  <div class="opera_yhtgjl common__content">
    <td-content-header>
      用户推广记录
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">成员馆：</span>
          <el-select
            filterable
            v-model="currentLib"
            placeholder="请选择馆"
            size="mini"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">用户类型：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="userType"
          >
            <el-option
              v-for="item in userTypeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentUserIdKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userOptions"
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
            v-model="collectionSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCollectionList"
          ></el-input>
        </div>

        <div class="header__line">
          <p class="label">注册时间：</p>
          <el-date-picker
            v-model="optTimeStart"
            align="right"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="marginRight:3px"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>至 &nbsp;</span>
          <el-date-picker
            v-model="optTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <span class="label">邀请人数：</span>
          <el-input
            size="mini"
            clearable
            v-only-num="inviteNumberStart"
            v-model="inviteNumberStart"
            placeholder="请输入数字"
          ></el-input>
          <span style="margin-right: 13px">至</span>
          <el-input
            size="mini"
            clearable
            v-only-num="inviteNumberEnd"
            v-model="inviteNumberEnd"
            placeholder="请输入数字"
          ></el-input>

          <el-button type="primary" size="mini" @click="initCollectionList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table line2">
        <el-table
          v-loading="loadData"
          ref="table"
          @row-dblclick="rowDblclick"
          border
          :data="collectionList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userType"
            label="用户类型"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.userType | changeState }}</div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="用户名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzzhao" label="用户账号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optTime"
            label="注册时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="inviteCode"
            label="邀请码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="countInviteUser"
            label="邀请人数"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.inviteCode"
                :data="scope.row"
                :index="scope.$index"
              >
                <template v-slot:menus>
                  <div class="menu" @click="detail(scope.row)">
                    详情
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCollectionSizeChange"
          @current-change="handleCollectionCurrentChange"
          :total="totalCollectionCount"
          :currentPage="currentUserPage"
          :pageSize="userPageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 详情页面 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              用户邀请列表详情
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="content">
        <div class="content__header" style="margin: 20px 0">
          <div class="header__line">
            <span class="label">成员馆：</span>
            <el-select
              filterable
              v-model="detailLib"
              placeholder="请选择馆"
              size="mini"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-select
              filterable
              class="group__filter_type"
              size="mini"
              v-model="detailUserIdKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in detailUserOptions"
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
              v-model="detailSearchKey"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="initDetailList"
            ></el-input>
          </div>

          <div class="header__line">
            <p class="label">注册时间：</p>
            <el-date-picker
              v-model="optTimeStart1"
              align="right"
              type="datetime"
              placeholder="选择开始时间"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="marginRight:3px"
              :clearable="true"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
            <span>至 &nbsp;</span>
            <el-date-picker
              v-model="optTimeEnd1"
              align="right"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              :clearable="true"
              class="el-date-editor--datetime"
            >
            </el-date-picker>

            <el-button type="primary" size="mini" @click="initDetailList">
              <icon-svg icon-class="icon-btn-ico-2" />
              查询</el-button
            >
          </div>
        </div>
        <div class="content__table line2">
          <el-table
            v-loading="loadData"
            ref="table"
            border
            :data="detailList"
            stripe
            style="width: 100%"
            height="100%"
          >
            <el-table-column type="index" label=" " align="left" width="100">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libName"
              label="成员馆"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userName"
              label="用户名"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="dzzhao"
              label="用户账号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="optTime"
              label="注册时间"
            >
            </el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div class="content__page">
            <td-pagination
              @size-change="handleDetailSizeChange"
              @current-change="handleDetailChange"
              :total="totalDetailCount"
              :currentPage="currentDetailPage"
              :pageSize="detailPageSize"
            ></td-pagination>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  inviteUser,
  userPromotionRecord,
  userPromotionRecordExcel
} from "api/operation";

import { mapGetters } from "vuex";

import { downLoadExcel } from "utils/utils";
export default {
  name: "opera_yhtgjl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.userOptions = [
      {
        value: "userName",
        label: "用户名"
      },
      {
        value: "userBarcode",
        label: "用户账号"
      }
    ];
    this.userTypeOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "01",
        label: "小程序"
      },
      {
        value: "02",
        label: "app"
      }
    ];
    this.detailUserOptions = [
      {
        value: "userName",
        label: "用户名"
      },
      {
        value: "userBarcode",
        label: "用户账号"
      }
    ];
    return {
      userType: "",
      currentLib: this.$store.getters.userInfo.libId,
      //时间传参
      optTimeStart: "",
      optTimeEnd: "",
      optTimeStart1: "",
      optTimeEnd1: "",
      // 列表相关
      loadData: false,
      collectionList: [],
      inviteNumberStart: "",
      inviteNumberEnd: "",
      collectionSearchKey: "",
      currentUserIdKey: "userName",
      userPageSize: 15,
      currentUserPage: 1,
      totalCollectionCount: 0,
      // 详情
      inviteCode: "",
      detailLib: this.$store.getters.userInfo.libId,
      showEditSide: false,
      detailSearchKey: "",
      detailUserIdKey: "userName",
      detailList: [],
      detailPageSize: 15,
      currentDetailPage: 1,
      totalDetailCount: 0
    };
  },
  filters: {
    changeState(val) {
      if (val == "01") {
        return "小程序";
      } else if (val == "02") {
        return "app";
      }
    }
  },
  created() {
    this.initCollectionList();
  },
  methods: {
    detail(row) {
      this.showEditSide = true;
      this.inviteCode = row.inviteCode;
      this.userName = row.userName;
      this.initDetailList();
    },
    rowDblclick(row) {
      this.detail(row);
    },
    // 用户列表
    initCollectionList() {
      this.currentUserPage = 1;
      this.setRequestObj();
      this.getUserCodeList();
    },
    handleDetailSizeChange(val) {
      this.detailPageSize = val;
      this.getDetailList();
    },
    handleDetailChange(val) {
      this.currentDetailPage = val;
      this.getDetailList();
    },
    // 用户邀请列表
    initDetailList() {
      this.currentDetailPage = 1;
      this.setRequestAbj();
      this.getDetailList();
    },
    getDetailList() {
      this.loadData = true;
      let requestAbj = {
        pageNumber: this.currentDetailPage,
        pageSize: this.detailPageSize,
        inviteCode: this.inviteCode,
        ...this.requestAbj
      };
      userPromotionRecord(requestAbj)
        .then(res => {
          this.loadData = false;
          this.detailList = res.data.dataList;
          this.totalDetailCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadData = false));
    },
    setRequestAbj() {
      this.requestAbj = {
        optTimeStart: this.optTimeStart1,
        optTimeEnd: this.optTimeEnd1,
        libId: this.detailLib
      };
      this.requestAbj[this.detailUserIdKey] = this.detailSearchKey;
    },
    setRequestObj() {
      this.requestObj = {
        inviteNumberStart: this.inviteNumberStart,
        inviteNumberEnd: this.inviteNumberEnd,
        userType: this.userType,
        libId: this.currentLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd
      };
      this.requestObj[this.currentUserIdKey] = this.collectionSearchKey;
    },
    getUserCodeList() {
      this.loadData = true;
      let requestObj = {
        pageNumber: this.currentUserPage,
        pageSize: this.userPageSize,
        ...this.requestObj
      };
      inviteUser(requestObj)
        .then(res => {
          this.loadData = false;
          this.collectionList = res.data.dataList;
          this.totalCollectionCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadData = false));
    },
    handleCollectionSizeChange(val) {
      this.userPageSize = val;
      this.getUserCodeList();
    },
    handleCollectionCurrentChange(val) {
      this.currentUserPage = val;
      this.getUserCodeList();
    },
    // 导出
    handleExport() {
      downLoadExcel(userPromotionRecordExcel(), {
        ...this.requestObj
      });
    }
  },
  mounted() {
    this.initCollectionList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
