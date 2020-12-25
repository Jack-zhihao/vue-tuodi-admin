<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 16:07:54
 -->

<template>
  <div class="opera_yhfkgl common__content">
    <td-content-header>
      用户反馈列表
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">来源：</span>
          <el-select
            filterable
            size="mini"
            placeholder="请选择"
            v-model="feedbackFrom"
          >
            <el-option
              v-for="item in feedBackOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <span style="white-space: nowrap" class="label">成员馆：</span>
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

          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentUserManageKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userManageOptions"
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
            v-model="currentSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initUserFeedBackList"
            style="flex:auto;max-width:200px"
          ></el-input>
        </div>
        <div class="header__line">
          <p class="label">反馈时间：</p>
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

          <span class="label">状态：</span>
          <el-select filterable size="mini" placeholder="请选择" v-model="ztai">
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-button type="primary" size="mini" @click="initUserFeedBackList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
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
          <el-table-column
            prop="feedbackFrom"
            show-overflow-tooltip
            label="来源"
          >
            <template slot-scope="scope">
              <div>{{ scope.row.feedbackFrom | changeFeedBack }}</div>
            </template>
          </el-table-column>
          <el-table-column prop="libName" show-overflow-tooltip label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="czName" label="藏址">
          </el-table-column>
          <el-table-column prop="barcode" show-overflow-tooltip label="账号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="name" label="姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="phone" label="手机号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="detail"
            label="反馈内容"
          ></el-table-column>

          <el-table-column show-overflow-tooltip prop="optime" label="反馈时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cnZtai"
            label="状态"
            width="70"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.id"
                :data="scope.row"
                :index="scope.$index"
                :ops="['']"
              >
                <template v-slot:menus>
                  <div
                    v-if="scope.row.ztai == '0'"
                    class="menu"
                    @click="handleDispose(scope.row)"
                  >
                    处理
                  </div>
                  <div v-else class="menu" @click="handleDetails(scope.row)">
                    详情
                  </div>
                </template>
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
    <!-- 反馈详情 -->
    <side-wrap class="common__side_form" v-if="showDetailSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              用户反馈详情
            </div>
          </div>
          <i class="el-icon-close" @click="showDetailSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form class="custom__form" ref="categoryEditForm" label-width="90px">
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>处理用户反馈</span>
            </div>
            <el-form-item class="item" label="注意">
              处理之后读者可见，且不可更改和删除！
            </el-form-item>
          </div>

          <div class="custom__form_wrapper">
            <div class="tit">
              <span>处理信息</span>
            </div>
            <el-form-item class="item" label="回复内容">
              {{ detailsForm.makeContent }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="操作员">
              {{ detailsForm.makeUsername }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="操作时间">
              {{ detailsForm.makeOptime }}
            </el-form-item>
          </div>

          <div class="custom__form_wrapper">
            <div class="tit">
              <span>反馈信息</span>
            </div>
            <el-form-item class="item" label="读者账号">
              {{ detailsForm.feedbackBarcode }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="读者姓名">
              {{ detailsForm.feedbackName }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="藏址">
              {{ detailsForm.feedbackCzName }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="反馈时间">
              {{ detailsForm.feedbackOptime }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="反馈内容">
              {{ detailsForm.feedbackContent }}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button size="mini" @click="showDetailSide = false"
              >返回</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>

    <!-- 处理用户反馈 -->
    <side-wrap class="common__side_form" v-if="showUserSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              处理用户反馈
            </div>
          </div>
          <i class="el-icon-close" @click="showUserSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form class="custom__form" ref="categoryEditForm" label-width="90px">
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>处理用户反馈</span>
            </div>
            <el-form-item class="item" label="注意">
              处理之后读者可见，且不可更改和删除！
            </el-form-item>
          </div>

          <div class="custom__form_wrapper">
            <div class="tit">
              <span>处理信息</span>
            </div>
            <el-form-item class="item" label="回复内容">
              <el-input
                clearable
                type="textarea"
                size="mini"
                v-model="detail"
                placeholder="请填写回复读者内容，读者可看到"
              ></el-input>
            </el-form-item>
          </div>

          <div class="custom__form_wrapper">
            <div class="tit">
              <span>反馈信息</span>
            </div>
            <el-form-item class="item" label="读者账号">
              {{ disposeForm.feedbackBarcode }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="读者姓名">
              {{ disposeForm.feedbackName }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="藏址">
              {{ disposeForm.feedbackCzName }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="反馈时间">
              {{ disposeForm.feedbackOptime }}
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item class="item" label="反馈内容">
              {{ disposeForm.feedbackContent }}
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button size="mini" @click="showUserSide = false"
              >取消</el-button
            >
            <el-button size="mini" @click="submitForm">保存</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { feedbackSearch, feedbackDetail, feedbackMake } from "api/operation";

import { mapGetters } from "vuex";

export default {
  name: "opera_yhfkgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.feedBackOptions = [
      {
        value: "app_reader",
        label: "品质阅读"
      },
      {
        value: "app_operation",
        label: "运营APP"
      },
      {
        value: "app_applet",
        label: "小程序读者"
      }
    ];
    this.userManageOptions = [
      {
        value: "barcode",
        label: "读者证号"
      },
      {
        value: "name",
        label: "读者姓名"
      },
      {
        value: "phone",
        label: "联系方式"
      }
    ];
    this.statusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "0",
        label: "未处理"
      },
      {
        value: "1",
        label: "已处理"
      },
      {
        value: "2",
        label: "不予处理"
      }
    ];

    return {
      ztai: "",
      feedbackFrom: "app_reader",
      // 多选
      multipleLiteratureSelection: [],
      cangzhiSelect: [],
      currentLib: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      currentSearchKey: "",
      currentUserManageKey: "barcode",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 详情
      showDetailSide: false,
      requestForm: {},
      detailsForm: {},
      // 用户反馈
      showUserSide: false,
      detail: "",
      disposeRequestForm: {},
      disposeForm: {},
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
  filters: {
    changeFeedBack(val) {
      if (val == "app_reader") {
        return "品质阅读";
      } else if (val == "app_applet") {
        return "苔花小程序";
      } else {
        return "运营APP";
      }
    }
  },
  methods: {
    submitForm() {
      feedbackMake({
        id: this.disposeRequestForm.id,
        feedbackFrom: this.disposeRequestForm.feedbackFrom,
        detail: this.detail
      }).then(res => {
        this.showUserSide = false;
        this.$message.success(res.message);
        this.getUserFeedBackList();
      });
    },
    handleDetails(row) {
      this.showDetailSide = true;
      this.requestForm = { ...row };
      let obj = {
        id: this.requestForm.id,
        feedbackFrom: this.requestForm.feedbackFrom
      };
      feedbackDetail(obj).then(res => {
        this.detailsForm = res.data;
      });
    },
    handleDispose(row) {
      this.showUserSide = true;
      this.disposeRequestForm = { ...row };
      let obj = {
        id: this.disposeRequestForm.id,
        feedbackFrom: this.disposeRequestForm.feedbackFrom
      };
      feedbackDetail(obj).then(res => {
        this.disposeForm = res.data;
      });
    },
    // 用户反馈列表
    initUserFeedBackList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.getUserFeedBackList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },

    setRequestObj() {
      this.requestObj = {
        ztai: this.ztai,
        feedbackFrom: this.feedbackFrom,
        libId: this.currentLib
      };
      this.requestObj[this.currentUserManageKey] = this.currentSearchKey;
    },
    getUserFeedBackList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj,
        start: this.date1,
        end: this.date2
      };

      feedbackSearch(requestObj)
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
      this.getUserFeedBackList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getUserFeedBackList();
    },

    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.readerNoticeId);
    }
  },
  mounted() {
    this.initUserFeedBackList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-textarea__inner {
  height: 200px;
  min-height: 200px !important;
}
</style>
