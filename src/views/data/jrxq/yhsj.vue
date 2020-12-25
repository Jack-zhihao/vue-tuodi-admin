<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-03 09:34:00
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 15:28:04
 -->
<template>
  <div class="jrxq-yhsj common__content">
    <td-content-header>
      用户数据
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

          <span style="marginLeft:13px" class="label">成员馆：</span>

          <el-select
            filterable
            v-model="memberLib"
            placeholder="请选择馆"
            size="mini"
          >
            <el-option
              v-for="item in memberLibArr"
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
            v-model="currentUserKey"
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
            v-model="userSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="iniUserList"
          ></el-input>
        </div>
        <div class="header__line">
          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="userStatus"
          >
            <el-option
              v-for="item in userStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">工作方式：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="workMode"
          >
            <el-option
              v-for="item in workModeOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">职称：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="userRank"
          >
            <el-option
              v-for="item in userRankOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span class="label">学历：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="userEdu"
          >
            <el-option
              v-for="item in userEduOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>

        <div class="header__line">
          <p class="label">入职时间：</p>
          <el-date-picker
            v-model="entryTimeStart"
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
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="entryTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <p class="label">有效时间：</p>
          <el-date-picker
            v-model="validTimeStart"
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
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="validTimeEnd"
            align="right"
            type="datetime"
            placeholder="选择结束时间"
            value-format="yyyy-MM-dd HH:mm:ss"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
        </div>

        <div class="header__line">
          <p class="label">操作时间：</p>
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
          <span>- &nbsp;</span>
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
          <el-button type="primary" size="mini" @click="iniUserList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          v-loading="loadUserData"
          ref="table"
          border
          :data="userList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            show-overflow-tooltip
            prop="userCode"
            label="用户代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="用户名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="idNumber"
            label="证件号码"
            width="161"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="birthDate"
            label="出生日期"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userSex" label="性别">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userStatus"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userTel"
            label="联系方式"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="workMode"
            label="工作方式"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userRank" label="昵称">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userEdu" label="学历">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="entryTime"
            label="入职时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="validTime"
            label="有效时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optTime"
            label="操作时间"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleUserSizeChange"
          @current-change="handleUserChange"
          :total="totalUserCount"
          :currentPage="currentUserPage"
          :pageSize="userPageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  treeLibCount,
  searchLib,
  searchLibArea,
  searchUser,
  searchUserExcel
} from "api/data";

import { downLoadExcel } from "utils/utils";
export default {
  name: "jrxq_yhsj",
  data() {
    this.userOptions = [
      {
        value: "userCode",
        label: "用户代码"
      },
      {
        value: "userName",
        label: "用户名称"
      },
      {
        value: "idNumber",
        label: "证件号码"
      },
      {
        value: "userTel",
        label: "联系方式"
      },
      {
        value: "userSex",
        label: "性别"
      }
    ];
    this.userStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "在职",
        label: "在职"
      },
      {
        value: "离职",
        label: "离职"
      }
    ];
    this.workModeOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "专职",
        label: "专职"
      },
      {
        value: "兼职",
        label: "兼职"
      }
    ];
    this.userRankOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "正高级",
        label: "正高级"
      },
      {
        value: "副高级",
        label: "副高级"
      },
      {
        value: "中级",
        label: "中级"
      },
      {
        value: "初(助理)级",
        label: "初(助理)级"
      },
      {
        value: "初(员级)级",
        label: "初(员级)级"
      },
      {
        value: "其他",
        label: "其他"
      }
    ];
    this.userEduOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "小学",
        label: "小学"
      },
      {
        value: "初中",
        label: "初中"
      },
      {
        value: "中专/高中",
        label: "中专/高中"
      },
      {
        value: "大专",
        label: "大专"
      },
      {
        value: "本科",
        label: "本科"
      },
      {
        value: "硕士研究生",
        label: "硕士研究生"
      },
      {
        value: "博士研究生",
        label: "博士研究生"
      },
      {
        value: "其他",
        label: "其他"
      }
    ];
    return {
      areaId: "",
      userEdu: "",
      userRank: "",
      userStatus: "",
      workMode: "",
      memberLib: "",
      memberLibArr: [],
      region: [],
      regionArr: [],
      isShow: false,
      idArr: {},
      //时间传参
      entryTimeStart: "",
      entryTimeEnd: "",
      validTimeStart: "",
      validTimeEnd: "",
      optTimeStart: "",
      optTimeEnd: "",
      // 列表相关
      loadUserData: false,
      userList: [],
      userSearchKey: "",
      currentUserKey: "userCode",
      userPageSize: 15,
      currentUserPage: 1,
      totalUserCount: 0
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
    // 选择区域
    handleChange(value) {
      // 清空馆下拉框
      this.memberLib = "";
      this.searchLib(value);
      this.areaId = value;
      // 触发了区域选择事件
      this.isSelectRegion = true;
    },
    // 区域树状图
    getAreaTreeData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionArr = treeData;
        this.areaId = "";
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
        // 显示馆列表，并且是否显示全部选项
        this.searchLib(this.region);
      });
    },
    // 区域对应的馆
    searchLib(areaId) {
      let params = {
        areaId
      };
      searchLib(params).then(res => {
        if (!res.data.length) {
          this.$message.error("该区域暂没有馆，请重新选择");
          this.memberLibArr = [];
          this.isShow = false; //隐藏全部选项
        } else {
          this.memberLibArr = res.data.map(item => {
            return {
              label: item.libMingcheng,
              value: item.libId
            };
          });
          if (this.memberLibArr.length > 1) {
            //说明有多个馆，显示全部选项
            this.memberLibArr.unshift({ label: "全部", value: "" });
          } else if (this.memberLibArr.length == 1) {
            this.memberLib = this.memberLibArr[0].value;
          }
        }
      });
    },
    // 用户数据列表
    iniUserList() {
      this.currentUserPage = 1;
      this.setRequestObj();
      this.getUserList();
    },
    setRequestObj() {
      this.requestObj = {
        areaId: this.areaId,
        userRank: this.userRank,
        userEdu: this.userEdu,
        workMode: this.workMode,
        userStatus: this.userStatus,
        libId: this.memberLib,
        optTimeStart: this.optTimeStart,
        optTimeEnd: this.optTimeEnd,
        entryTimeStart: this.entryTimeStart,
        entryTimeEnd: this.entryTimeEnd,
        validTimeStart: this.validTimeStart,
        validTimeEnd: this.validTimeEnd
      };
      this.requestObj[this.currentUserKey] = this.userSearchKey;
    },
    getUserList() {
      this.loadUserData = true;
      let requestObj = {
        pageNumber: this.currentUserPage,
        pageSize: this.userPageSize,
        ...this.requestObj
      };
      searchUser(requestObj)
        .then(res => {
          this.loadUserData = false;
          this.userList = res.data.dataList;
          this.totalUserCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadUserData = false));
    },
    handleUserSizeChange(val) {
      this.userPageSize = val;
      this.getUserList();
    },
    handleUserChange(val) {
      this.currentUserPage = val;
      this.getUserList();
    },
    // 导出
    handleExport() {
      downLoadExcel(searchUserExcel(), {
        ...this.requestObj,
        func_name_us: "special_searchUserExcel"
      });
    }
  },
  created() {
    this.getAreaTreeData();
    this.treeLibCount();
    // 查找对应的地区
    this.searchLibArea(this.$store.getters.userInfo.libId);
  },
  mounted() {
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content {
  .content__table {
    height: ~"calc(100% - 124px - 32px)" !important;
  }
}
</style>
