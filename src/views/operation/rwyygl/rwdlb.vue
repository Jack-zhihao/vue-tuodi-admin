<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 16:09:36
 -->

<template>
  <div class="rwdlb common__content">
    <td-content-header> 【{{ taskPlanName }}】 任务单列表 </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectCygId"
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
          <p class="label">藏址名称：</p>
          <el-input
            v-model="selectLibId"
            placeholder="请输入"
            size="mini"
            clearable
          ></el-input>
        </div>

        <div class="header__line">
          <p class="label">完成时间：</p>
          <el-date-picker
            v-model="date1"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
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
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="endDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="status"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in statusArr"
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
      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadLiteratureData"
          @selection-change="handleLiteratureSelectionChange"
          border
          :data="literatureList"
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
          <el-table-column prop="libName" show-overflow-tooltip label="成员馆">
          </el-table-column>
          <el-table-column prop="czName" show-overflow-tooltip label="藏址名称">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="用户姓名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userCode"
            label="用户账号"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="userPhone"
            label="用户手机号"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="overTime"
            label="完成时间"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            width="100"
          >
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['detail']"
                @handleDetail="detail(scope.row)"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" style="justifyContent:flex-end">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 新增活动 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              任务单详情
            </div>
          </div>
          <i class="el-icon-close" @click="goBack"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="80px"
          :model="literatureAddForm"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>任务步骤信息</span>
            </div>

            <div class="" ref="literatureTable">
              <el-table
                v-loading="loadLiteratureTaskData"
                border
                :data="taskData"
                stripe
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column
                  prop="taName"
                  show-overflow-tooltip
                  label="任务动作名称"
                  width="116"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="taType"
                  label="动作类型"
                  width="116"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="taAppName"
                  label="前端动作名称"
                  width="116"
                ></el-table-column>

                <el-table-column
                  show-overflow-tooltip
                  prop="taMaintenance"
                  label="是否柜门维护"
                  width="116"
                ></el-table-column>

                <el-table-column
                  show-overflow-tooltip
                  prop="taContent"
                  label="动作内容"
                  width="119"
                >
                </el-table-column>

                <el-table-column
                  show-overflow-tooltip
                  label="完成状态"
                  width="135"
                >
                  <template slot-scope="scope">
                    <div style="display:flex;">
                      <span
                        style="align-items: center;
    display: flex;marginRight:5px"
                        >{{ scope.row.status }}</span
                      >
                      <el-popover
                        v-if="scope.row.image"
                        placement="right"
                        title=""
                        trigger="hover"
                        style="position: relative;top: 3px;"
                      >
                        <img
                          :src="
                            BASE_URL + '/api/p/img/url?img=' + scope.row.image
                          "
                          style="width:1000px;cursor:pointer"
                          id="image"
                          title="点击下载"
                          @click="load(scope.row.taName)"
                        />
                        <img
                          slot="reference"
                          :src="
                            BASE_URL + '/api/p/img/url?img=' + scope.row.image
                          "
                          :alt="
                            BASE_URL + '/api/p/img/url?img=' + scope.row.image
                          "
                          style="height: 50px;width: 50px;marginLeft:10px"
                        />
                      </el-popover>
                      <!-- 静态图片 -->
                      <!-- <el-popover
                        placement="right"
                        title=""
                        trigger="hover"
                        style="position: relative;top: 3px;"
                      >
                        <img
                          src="../../../assets/yuanshugui.jpeg"
                          style="width:1000px;cursor:pointer"
                          id="image"
                          title="点击下载"
                          @click="load(scope.row.taName)"
                        />
                        <img
                          slot="reference"
                          src="../../../assets/yuanshugui.jpeg"
                          :alt="
                            BASE_URL + '/api/p/img/url?img=' + scope.row.image
                          "
                          style="height: 50px;width: 50px;marginLeft:10px"
                        />
                      </el-popover> -->
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <div class="tit">
              <span>反馈信息</span>
            </div>

            <div class="" ref="literatureTable">
              <el-table
                v-loading="loadLiteratureFeedbackData"
                border
                :data="feedbackData"
                stripe
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column
                  prop="note"
                  show-overflow-tooltip
                  label="反馈内容"
                  width="550"
                  align="center"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="optime"
                  label="反馈时间"
                  width="150"
                  align="center"
                >
                </el-table-column>
              </el-table>
            </div>

            <div class="tit">
              <span>任务单信息</span>
            </div>
            <el-form-item class="item" label="用户名称">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.userName"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="用户账号">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.userAccount"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="用户手机">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.userPhone"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="藏址名称">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.libName"
                disabled
              ></el-input>
            </el-form-item>

            <div class="tit">
              <span>任务信息</span>
            </div>

            <el-form-item class="item" label="任务名称">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.taskName"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="任务频率">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.taskFrequency"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="任务时效">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.taskShiXiao"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="发布时间">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.fbTime"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="提醒时间">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.tipTime"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="任务状态">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.taskOver"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="是否为强制步骤">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.mandatory"
                disabled
              ></el-input>
            </el-form-item>

            <el-form-item></el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="goBack" type="primary"
              >返回</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { searchRenwd, detailRenwd } from "api/operation";
import dayjs from "dayjs";
import { BASE_URL } from "utils/base";
import { mapGetters } from "vuex";
export default {
  name: "opera_rwdlb",
  data() {
    this.literatureFilterOptions = [
      {
        value: "userName",
        label: "用户名称"
      },
      {
        value: "userCode",
        label: "用户账号"
      },
      {
        value: "userPhone",
        label: "用户手机号"
      }
    ];
    this.BASE_URL = BASE_URL;
    return {
      // 多选
      multipleLiteratureSelection: [],
      selectLibId: "",
      selectCygId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      loadLiteratureTaskData: false,
      loadLiteratureFeedbackData: false,
      literatureList: [],
      taskData: [],
      feedbackData: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "userName",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      taskPlanName: "",
      // 时间传参
      date1: "",
      date2: "",
      status: "",
      statusArr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "未处理",
          value: 1
        },
        {
          label: "已完成",
          value: 3
        },
        {
          label: "任务终止",
          value: 4
        }
      ],
      // 新增
      showAddSide: false,

      literatureAddForm: {
        userName: "",
        userAccount: "",
        userPhone: "",
        libName: "",
        taskOver: "",
        taskName: "",
        taskFrequency: "",
        taskShiXiao: "",
        fbTime: "",
        tipTime: "",
        mandatory: ""
      },
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
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.detail(row);
    },
    setRequestObj() {
      this.taskPlanName = this.$route.query.taskPlanName;
      this.requestObj = {
        taskPlanId: this.$route.query.taskPlanId,
        czName: this.selectLibId,
        status: this.status,
        libId: this.selectCygId
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
        end: this.date2
      };

      searchRenwd(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data.dataList;
          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    // 详情
    detail(row) {
      this.showAddSide = true;
      this.detailRenwd(row);
    },
    detailRenwd(row) {
      detailRenwd({ toId: row.toId, status: row.status }).then(res => {
        this.literatureAddForm.userName = res.data.user.userName;
        this.literatureAddForm.userAccount = res.data.user.userCode;
        this.literatureAddForm.userPhone = res.data.user.userPhone;
        this.literatureAddForm.libName = res.data.user.czName;
        this.literatureAddForm.taskName = res.data.plan.taskPlanName;

        switch (res.data.plan.taskPlanFrequency) {
          case 1:
            this.literatureAddForm.taskFrequency = "每天";
            break;
          case 2:
            this.literatureAddForm.taskFrequency = "每周";
            break;
          case 3:
            this.literatureAddForm.taskFrequency = "每月";
            break;
          case 4:
            this.literatureAddForm.taskFrequency = "每年";
            break;
        }
        if (res.data.plan.taskPlanStart && res.data.plan.taskPlanEnd) {
          this.literatureAddForm.taskShiXiao =
            dayjs(res.data.plan.taskPlanStart).format("HH:mm:ss") +
            "~" +
            dayjs(res.data.plan.taskPlanEnd).format("HH:mm:ss");
        }
        this.literatureAddForm.fbTime = res.data.plan.taskPlanReleaseTime;
        this.literatureAddForm.tipTime =
          res.data.plan.taskPlanRemind + "个小时前";
        this.literatureAddForm.taskOver = res.data.plan.status;
        this.literatureAddForm.mandatory = res.data.plan.mandatory
          ? "是"
          : "否";
        //  任务步骤信息列表
        res.data.actions.forEach(item => {
          item.taMaintenance = item.taMaintenance ? "是" : "否";
        });

        this.taskData = res.data.actions;
        // 反馈信息列表
        this.feedbackData = res.data.feedbacks;
      });
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.readerNoticeId);
    },
    goBack() {
      this.showAddSide = false;
    },
    load(name) {
      let url = document.getElementById("image").src;
      let event = new MouseEvent("click");
      let a = document.createElement("a");
      a.download = `${name}.jpg`;
      a.href = url;
      a.dispatchEvent(event);
    }
  },
  mounted() {
    this.initLiteratureList();
  },
  activated() {
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
.item {
  &:nth-child(2n + 1) {
    justify-content: flex-start !important;
  }
}
/deep/.el-form-item__label {
  width: 110px !important;
  white-space: nowrap;
}
</style>
