<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 17:34:33
 -->

<template>
  <div class="rwjhgl common__content">
    <td-content-header>
      任务计划管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
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
          <p class="label">计划名称：</p>
          <el-input
            v-model="proName"
            placeholder="请输入"
            size="mini"
          ></el-input>
        </div>
        <div class="header__line">
          <p class="label">任务频率：</p>
          <el-select
            filterable
            size="mini"
            v-model="frequency"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in frequencySelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
          <p class="label">发布时间：</p>
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
          <el-table-column
            prop="taskPlanName"
            show-overflow-tooltip
            label="计划名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="taskPlanFrequent"
            label="任务频率"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="taskPlanStartEnd"
            label="任务时效"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="tpName"
            label="任务步骤"
          ></el-table-column>

          <el-table-column show-overflow-tooltip prop="czNum" label="藏址数量">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="actionNum"
            label="任务步骤数量"
            width="105"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="taskPlanReleaseTime"
            label="发布时间"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="planStatus"
            label="状态"
            width="45"
          >
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool :ops="['edit']" @handleEdit="editGzsm(scope.row)">
                <template v-slot:menus>
                  <div v-if="scope.row.planStatus == '未发布'">
                    <div class="menu" @click="singleDeleteGzsm(scope.row)">
                      删除
                    </div>
                  </div>
                  <div v-if="scope.row.planStatus == '已发布'">
                    <div class="menu" @click="renwudan(scope.row)">
                      任务单
                    </div>
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

    <!-- 新增任务计划 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增任务计划
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('literatureAddForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="80px"
          :model="literatureAddForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>任务计划信息</span>
            </div>

            <el-form-item class="item" prop="taskPlanName" label="计划名称">
              <el-input
                clearable
                v-model="literatureAddForm.taskPlanName"
                ref="taskPlanName"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              prop="taskPlanFrequency"
              label="任务频率"
            >
              <el-select
                filterable
                v-model="literatureAddForm.taskPlanFrequency"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="taskPlanFrequency"
              >
                <el-option
                  v-for="item in frequencySelectAddEdit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="计划开始时效"
              prop="taskPlanStart"
            >
              <el-time-picker
                v-model="literatureAddForm.taskPlanStart"
                placeholder="开始时间"
                ref="taskPlanStart"
              >
              </el-time-picker>
              <span style="color:#aaa;marginLeft: 20px"
                >用户判断任务的执行有效时间</span
              >
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taskPlanEnd" label="计划结束时效">
              <el-time-picker
                v-model="literatureAddForm.taskPlanEnd"
                placeholder="结束时间"
                ref="taskPlanEnd"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taskPlanRemind" label="提醒时间">
              <el-select
                filterable
                v-model="literatureAddForm.taskPlanRemind"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="taskPlanRemind"
              >
                <el-option
                  v-for="item in timeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span style="color:#aaa;marginLeft: 20px"
                >提前多长时间提醒用户任务即将到期</span
              >
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" label="任务步骤" prop="tpId">
              <el-select
                filterable
                v-model="literatureAddForm.tpId"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="tpId"
              >
                <el-option
                  v-for="item in taskSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>

            <el-form-item class="item" label="藏址筛选方式">
              <el-radio v-model="radio" label="2" @change="changeCz"
                >按用户</el-radio
              >
              <el-radio v-model="radio" label="1" @change="changeCz"
                >按藏址</el-radio
              >
            </el-form-item>

            <el-form-item></el-form-item>
            <el-form-item class="item" label="分配藏址" prop="czIds">
              <el-cascader
                v-model="literatureAddForm.czIds"
                :options="TibetanSite"
                :props="{
                  multiple: true
                }"
                clearable
                ref="czIds"
                filterable
                placeholder="输入要搜索藏址"
              ></el-cascader>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="发布时间"
              prop="taskPlanReleaseTime"
            >
              <el-date-picker
                v-model="literatureAddForm.taskPlanReleaseTime"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm:ss"
                @change="selectDateFbAdd"
                value-format="yyyy-MM-dd HH:mm:ss"
                ref="taskPlanReleaseTime"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              :disabled="isSubmit == true"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('literatureAddForm')"
              type="primary"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑活动 -->
    <side-wrap
      v-loading="loadLiteratureDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑任务计划
            </div>
          </div>
          <i
            class="el-icon-close"
            @click="cancelForm('literatureEditForm')"
          ></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureEditForm"
          label-width="80px"
          :model="literatureEditForm"
          :rules="rules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>任务计划信息</span>
            </div>
            <el-form-item class="item" prop="taskPlanName" label="计划名称">
              <el-input
                clearable
                v-model="literatureEditForm.taskPlanName"
                ref="taskPlanName"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              prop="taskPlanFrequency"
              label="任务频率"
            >
              <el-select
                filterable
                v-model="literatureEditForm.taskPlanFrequency"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="taskPlanFrequency"
              >
                <el-option
                  v-for="item in frequencySelectAddEdit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="计划开始时效"
              prop="taskPlanStart"
            >
              <el-time-picker
                v-model="literatureEditForm.taskPlanStart"
                placeholder="开始时间"
                ref="taskPlanStart"
              >
              </el-time-picker>
              <span style="color:#aaa;marginLeft: 20px"
                >用户判断任务的执行有效时间</span
              >
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taskPlanEnd" label="计划结束时效">
              <el-time-picker
                v-model="literatureEditForm.taskPlanEnd"
                placeholder="结束时间"
                ref="taskPlanEnd"
                class="el-date-editor--datetime"
              >
              </el-time-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="taskPlanRemind" label="提醒时间">
              <el-select
                filterable
                v-model="literatureEditForm.taskPlanRemind"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="taskPlanRemind"
              >
                <el-option
                  v-for="item in timeSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <span style="color:#aaa;marginLeft: 20px"
                >提前多长时间提醒用户任务即将到期</span
              >
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" label="任务步骤" prop="tpId">
              <el-select
                filterable
                v-model="literatureEditForm.tpId"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="tpId"
              >
                <el-option
                  v-for="item in taskSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>

            <el-form-item class="item" label="藏址筛选方式">
              <el-radio v-model="radio" label="2" @change="changeCz"
                >按用户</el-radio
              >
              <el-radio v-model="radio" label="1" @change="changeCz"
                >按藏址</el-radio
              >
            </el-form-item>

            <el-form-item></el-form-item>
            <el-form-item class="item" label="分配藏址" prop="czIds">
              <el-cascader
                v-model="literatureEditForm.czIds"
                :options="TibetanSite"
                :props="{
                  multiple: true
                }"
                clearable
                size="mini"
                ref="czIds"
                filterable
                placeholder="输入要搜索藏址"
              ></el-cascader>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="发布时间"
              prop="taskPlanReleaseTime"
            >
              <el-date-picker
                v-model="literatureEditForm.taskPlanReleaseTime"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm:ss"
                @change="selectDateFbEdit"
                value-format="yyyy-MM-dd HH:mm:ss"
                ref="taskPlanReleaseTime"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm')"
              type="primary"
              :disabled="isSubmit == true"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('literatureEditForm')"
              type="primary"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  searchPlan,
  searchSave,
  searchDel,
  listFromUser,
  listFromCz,
  searchProcess
} from "api/operation";
import dayjs from "dayjs";
import { mapGetters } from "vuex";
export default {
  name: "opera_rwjhlb",
  data() {
    return {
      selectLibId: this.$store.getters.userInfo.libId,
      // 多选
      multipleLiteratureSelection: [],
      isfinishedFB: [],
      proName: "",
      frequency: "",
      frequencySelect: [
        { label: "全部", value: "" },
        { label: "每天", value: 1 },
        { label: "每周", value: 2 },
        { label: "每月", value: 3 },
        { label: "每年", value: 4 },
        { label: "仅一次", value: 5 }
      ],
      frequencySelectAddEdit: [
        { label: "每天", value: 1 },
        { label: "每周", value: 2 },
        { label: "每月", value: 3 },
        { label: "每年", value: 4 },
        { label: "仅一次", value: 5 }
      ],
      status: "",
      statusArr: [
        { label: "全部", value: "" },
        { label: "未发布", value: "0" },
        { label: "已发布", value: "1" }
      ],
      timeSelect: [
        { label: "1小时", value: 1 },
        { label: "2小时", value: 2 },
        { label: "3小时", value: 3 },
        { label: "4小时", value: 4 },
        { label: "5小时", value: 5 },
        { label: "6小时", value: 6 },
        { label: "7小时", value: 7 },
        { label: "8小时", value: 8 },
        { label: "9小时", value: 9 },
        { label: "10小时", value: 10 },
        { label: "11小时", value: 11 },
        { label: "12小时", value: 12 },
        { label: "13小时", value: 13 },
        { label: "14小时", value: 14 },
        { label: "15小时", value: 15 },
        { label: "16小时", value: 16 },
        { label: "17小时", value: 17 },
        { label: "18小时", value: 18 },
        { label: "19小时", value: 19 },
        { label: "20小时", value: 20 },
        { label: "21小时", value: 21 },
        { label: "22小时", value: 22 },
        { label: "23小时", value: 23 },
        { label: "24小时", value: 24 }
      ],
      taskSelect: [],
      TibetanSite: [],
      loadLiteratureData: false,
      // 是否可以提交
      isSubmit: false,
      literatureList: [],
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      // 新增
      showAddSide: false,
      radio: "2",
      literatureAddForm: {
        taskPlanName: "",
        taskPlanFrequency: "",
        taskPlanStart: "",
        taskPlanEnd: "",
        taskPlanRemind: "",
        tpId: "",
        czIds: [],
        taskPlanReleaseTime: "",
        userIds: "",
        datas: ""
      },
      literatureEditForm: {
        taskPlanName: "",
        taskPlanFrequency: "",
        taskPlanStart: "",
        taskPlanEnd: "",
        taskPlanRemind: "",
        tpId: "",
        czIds: [],
        taskPlanReleaseTime: "",
        userIds: "",
        datas: ""
      },

      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      rules: {
        taskPlanName: [
          { required: true, message: "请填写计划名称", trigger: "blur" }
        ],

        taskPlanFrequency: [
          { required: true, message: "请选择任务频率", trigger: "change" }
        ],
        taskPlanStart: [
          { required: true, message: "请选择计划开始时效", trigger: "change" }
        ],
        taskPlanEnd: [
          { required: true, message: "请选择计划结束时效", trigger: "change" }
        ],
        taskPlanRemind: [
          { required: true, message: "请选择提醒时间", trigger: "change" }
        ],
        tpId: [
          { required: true, message: "请选择任务步骤", trigger: "change" }
        ],
        czIds: [
          { required: true, message: "请选择分配藏址", trigger: "change" }
        ],
        taskPlanReleaseTime: [
          { required: true, message: "请选择发布时间", trigger: "change" }
        ]
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
          return time.getTime() < new Date(this.date1) - 8.64e7;
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
      this.getLiteratureList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.editGzsm(row);
    },

    selectDateFbAdd(val) {
      this.literatureAddForm.taskPlanReleaseTime = val;
    },

    selectDateFbEdit(val) {
      this.literatureEditForm.taskPlanReleaseTime = val;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        taskPlanName: this.proName,
        taskPlanFrequency: this.frequency,
        taskPlanReleaseStart: this.date1,
        taskPlanReleaseEnd: this.date2,
        planStatus: this.status,
        libId: this.selectLibId
      };

      searchPlan(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          res.data.dataList.forEach(item => {
            switch (item.taskPlanFrequency) {
              case 1:
                item.taskPlanFrequent = "每天";
                break;
              case 2:
                item.taskPlanFrequent = "每周";
                break;
              case 3:
                item.taskPlanFrequent = "每月";
                break;
              case 4:
                item.taskPlanFrequent = "每年";
                break;
              case 5:
                item.taskPlanFrequent = "仅一次";
                break;
            }
            item.taskPlanStartEnd =
              item.taskPlanStart.slice(-8) + "-" + item.taskPlanEnd.slice(-8);
          });
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
    // 新增
    handleAdd() {
      this.showAddSide = true;
    },

    // 提交接口
    handleLiteratureFormAdd() {
      let arr = [];
      if (this.radio == 1) {
        this.literatureAddForm.czIds.forEach(item => {
          let temp = "";
          temp = item[1];
          item[1] = item[2];
          item[2] = temp;
        });
      }
      this.literatureAddForm.czIds.forEach(item => {
        arr.push(item.join("-"));
      });
      this.literatureAddForm.datas = arr.join();

      let params = {
        ...this.literatureAddForm
      };
      // 去除这个传参
      params.czIds = "";
      params.taskPlanStart = dayjs(this.literatureAddForm.taskPlanStart).format(
        "HH:mm:ss"
      );
      params.taskPlanEnd = dayjs(this.literatureAddForm.taskPlanEnd).format(
        "HH:mm:ss"
      );

      searchSave(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          // 刷新列表
          this.initLiteratureList();
        }
      });
    },
    // 编辑接口
    handleLiteratureFormEdit() {
      let arr = [];
      if (this.radio == 1) {
        this.literatureEditForm.czIds.forEach(item => {
          let temp = "";
          temp = item[1];
          item[1] = item[2];
          item[2] = temp;
        });
      }
      this.literatureEditForm.czIds.forEach(item => {
        arr.push(item.join("-"));
      });
      this.literatureEditForm.datas = arr.join();
      let params = {
        ...this.literatureEditForm
      };
      params.czIds = "";
      params.taskPlanStart = dayjs(
        this.literatureEditForm.taskPlanStart
      ).format("HH:mm:ss");
      params.taskPlanEnd = dayjs(this.literatureEditForm.taskPlanEnd).format(
        "HH:mm:ss"
      );

      searchSave(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.initLiteratureList();
        }
      });
    },
    // 取消提交
    cancelForm(formName) {
      if (formName === "literatureAddForm") {
        this.showAddSide = false;
        this.$refs["literatureAddForm"].resetFields();
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
      }
    },
    // 验证提交校验
    jsYz(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          // 通过表单验证
          if (formName === "literatureAddForm") {
            this.handleLiteratureFormAdd();
            this.showAddSide = false;
            this.$refs["literatureAddForm"].resetFields();
            // 清空表单其余
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit();
            this.showEditSide = false;
            this.$refs["literatureEditForm"].resetFields();
            // 清空表单其余
          }
        } else {
          if (error && Object.keys(error).length > 0) {
            let keysArr = Object.keys(error);
            this.$refs[keysArr[0]].focus();
          }
          return false;
        }
      });
    },
    // 保存提交
    submitForm(formName) {
      let that = this;

      setTimeout(function() {
        that.jsYz(formName);
      }, 100);
    },
    // 编辑活动页面
    editGzsm(row) {
      // window.console.log(row);
      this.showEditSide = true;

      this.radio = "2";
      this.listFromUser();
      let arr = row.datas.split(",");
      let newArr = [];
      arr.forEach(item => {
        newArr.push(item.split("-"));
      });
      this.literatureEditForm = {
        taskPlanName: row.taskPlanName,
        taskPlanFrequency: row.taskPlanFrequency,
        taskPlanStart: row.taskPlanStart,
        taskPlanEnd: row.taskPlanEnd,
        taskPlanRemind: row.taskPlanRemind,
        tpId: row.tpId,
        taskPlanReleaseTime: row.taskPlanReleaseTime,
        taskPlanId: row.taskPlanId,
        czIds: newArr
      };
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          searchDel({ taskPlanIds: row.taskPlanId }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          if (this.isfinishedFB.includes("已发布")) {
            this.$message.error("选项包含已发布计划,不能删除，请重新勾选！");
            return false;
          }
          searchDel({
            taskPlanIds: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.taskPlanId);
      this.isfinishedFB = val.map(item => {
        return item.planStatus;
      });
    },

    renwudan(row) {
      this.$router.push({
        name: "opera_rwdlb",
        query: {
          taskPlanId: row.taskPlanId,
          taskPlanName: row.taskPlanName
        }
      });
    },
    changeCz() {
      // console.log(5);
      this.literatureAddForm.czIds = [];
      this.literatureEditForm.czIds = [];
      if (this.radio == 1) {
        this.listFromCz();
      } else {
        this.listFromUser();
      }
    },
    searchProcess() {
      searchProcess({
        pageNumber: 1,
        pageSize: 9999
      }).then(res => {
        this.taskSelect = res.data.dataList.map(item => {
          return {
            value: item.tpId,
            label: item.tpName
          };
        });
      });
    },
    //=============================需求改动暂不需要================
    // open() {
    //   this.$confirm("选中藏址未绑定运营用户，请先前往绑定。", "提示", {
    //     confirmButtonText: "去绑定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       // 前往 “馆藏分配” 界面
    //       this.$router.push({ name: "set_yhgl" });
    //     })
    //     .catch(() => {});
    // },
    // isBangLibAdd(val) {
    //   // console.log(val);
    //   if (val.length > 0) {
    //     this.isSubmit = false;
    //     val.forEach(item => {
    //       isBangding({ czId: item })
    //         .then()
    //         .catch(err => {
    //           if (err) {
    //             this.isSubmit = true;
    //             this.open();
    //           }
    //         });
    //     });
    //   }
    // },
    listFromUser() {
      listFromUser().then(res => {
        let str = JSON.stringify(res.data);
        str = str.replace(/users/g, "children");
        str = str.replace(/czs/g, "children");
        str = str.replace(/libId/g, "value");
        str = str.replace(/libName/g, "label");
        str = str.replace(/userId/g, "value");
        str = str.replace(/username/g, "label");
        str = str.replace(/czId/g, "value");
        str = str.replace(/czName/g, "label");
        let arr = JSON.parse(str);

        this.TibetanSite = arr;
      });
    },
    listFromCz() {
      listFromCz().then(res => {
        let str = JSON.stringify(res.data);
        str = str.replace(/users/g, "children");
        str = str.replace(/czs/g, "children");
        str = str.replace(/libId/g, "value");
        str = str.replace(/libName/g, "label");
        str = str.replace(/userId/g, "value");
        str = str.replace(/username/g, "label");
        str = str.replace(/czId/g, "value");
        str = str.replace(/czName/g, "label");
        let arr = JSON.parse(str);

        this.TibetanSite = arr;
      });
    }
  },
  activated() {
    this.searchProcess();
  },
  mounted() {
    this.initLiteratureList();
    this.listFromUser();
    this.searchProcess();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
/deep/.el-form-item__content {
  width: 590px;
}
</style>
