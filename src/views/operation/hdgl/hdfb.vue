<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 09:30:21
 -->

<template>
  <div class="hdfb common__content">
    <td-content-header>
      活动发布
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
          <p class="label">举办馆：</p>
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
          <p class="label">举办时间：</p>
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
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="statusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusSelect"
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

      <div class="content__table" ref="literatureTable">
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
          <el-table-column prop="mainLibName" label="举办馆"> </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="acTitle"
            label="活动标题"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="acAddress"
            label="举办地点"
          ></el-table-column>
          <el-table-column prop="HoldingTime" label="举办时间" width="305">
          </el-table-column>
          <el-table-column prop="SignUpNum" label="报名人数" width="100">
          </el-table-column>

          <el-table-column prop="curSignInCount" label="签到人数" width="100">
          </el-table-column>

          <el-table-column prop="acPV" label="浏览量" width="100">
          </el-table-column>

          <el-table-column prop="status" label="状态" width="100">
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
              >
                <template v-slot:menus>
                  <div v-if="scope.row.acZtai == '0'">
                    <div class="menu" @click="upStatus(1, scope.row)">
                      发布
                    </div>
                  </div>

                  <div v-if="scope.row.acZtai == '1'">
                    <div class="menu" @click="upStatus(2, scope.row)">
                      暂停
                    </div>
                    <div
                      class="menu"
                      v-if="scope.row.acIsQRSignIN"
                      @click="showErweima(scope.row.acId)"
                    >
                      签到码
                    </div>
                    <div class="menu" @click="goHdsj(scope.row.acId)">
                      数据
                    </div>
                  </div>

                  <div v-if="scope.row.acZtai == '3'">
                    <div class="menu" @click="goHdsj(scope.row.acId)">
                      数据
                    </div>
                  </div>

                  <div v-if="scope.row.acZtai == '2'">
                    <div class="menu" @click="upStatus(1, scope.row)">
                      发布
                    </div>
                    <div class="menu" @click="upStatus(3, scope.row)">
                      结束
                    </div>
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" style="justifyContent:space-between">
        <div
          style="marginLeft:20px;font:bolder 16px Microsoft YaHei ;color:#515355"
        >
          活动总数：<span>{{ undisposed }}</span> 待发布：<span>{{
            processed
          }}</span>
          进行中：<span>{{ processing }}</span> 已结束：<span>{{ over }}</span>
        </div>
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
              新增活动
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
              <span>活动信息</span>
            </div>
            <el-form-item class="item" prop="holdLibId" label="举办馆">
              <el-select
                filterable
                v-model="literatureAddForm.holdLibId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="holdLocation" label="举办地点">
              <el-input
                clearable
                v-model="literatureAddForm.holdLocation"
                ref="holdLocation"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="参与馆">
              <el-select
                filterable
                v-model="literatureAddForm.participateLibId"
                multiple
                class="multi line"
                collapse-tags
                placeholder="请选择"
                style="flexBasis:150px"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="EventTitle" label="活动标题">
              <el-input
                clearable
                v-model="literatureAddForm.EventTitle"
                ref="EventTitle"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="date1" label="起始时间">
              <el-date-picker
                v-model="literatureAddForm.date1"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="literatureAddForm.startDatePicker"
                ref="date1"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="date2" label="结束时间">
              <el-date-picker
                v-model="literatureAddForm.date2"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="literatureAddForm.endDatePicker"
                ref="date2"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="限制报名人数">
              <el-switch v-model="literatureAddForm.limitNums"> </el-switch>
              <el-input-number
                v-model="literatureAddForm.limitNumsInput"
                :min="1"
                v-if="literatureAddForm.limitNums"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="开通扫码签到">
              <el-switch v-model="literatureAddForm.checkIn"> </el-switch>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="奖励活动积分">
              <el-switch v-model="literatureAddForm.integral"> </el-switch>
              <span style="marginLeft:15px" v-if="literatureAddForm.integral"
                >报名奖励积分:</span
              >
              <el-input-number
                v-model="literatureAddForm.SignupIntegralInput"
                :min="0"
                v-if="literatureAddForm.integral"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
              <br />
              <span style="marginLeft:55px" v-if="literatureAddForm.integral"
                >签到奖励积分:</span
              >
              <el-input-number
                v-model="literatureAddForm.checkInIntegralInput"
                :min="0"
                v-if="literatureAddForm.integral"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="活动封面" prop="file">
              <el-upload
                class="avatar-uploader"
                :action="BASE_URL + '/api/p/img/upload'"
                :show-file-list="false"
                :before-upload="beforeAvatarUploadAdd"
                :on-success="handleElibLoginSuccessAdd"
                :data="fileFormData"
                ref="file"
              >
                <!-- 预览图片 -->
                <img
                  v-if="literatureAddForm.avatarUrl"
                  :src="literatureAddForm.avatarUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="avatar-uploader-txt">点击上传图片</div>
              </el-upload>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="活动简介"
              prop="textarea"
              style="flex:0 0 100%"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入活动简介"
                v-model="literatureAddForm.textarea"
                clearable
                style="width:330%"
                ref="textarea"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="item" label="活动详情">
              <editor-bar
                v-model="literatureAddForm.editor.info"
                :isClear="literatureAddForm.isClear"
              ></editor-bar>
            </el-form-item>
            <el-form-item
              class="item"
              style="justifyContent: flex-start;marginLeft:100px"
            >
              <el-checkbox
                v-model="literatureAddForm.shortStatus"
                @change="selectCheckAdd"
                >保存后直接发布</el-checkbox
              >
              <el-checkbox v-model="literatureAddForm.acIsRecommend"
                >首页推荐</el-checkbox
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureAddForm')"
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
              编辑活动
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
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>活动信息</span>
            </div>
            <el-form-item class="item" prop="holdLibId" label="举办馆">
              <el-select
                filterable
                v-model="literatureEditForm.holdLibId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="holdLocation" label="举办地点">
              <el-input
                clearable
                v-model="literatureEditForm.holdLocation"
                ref="holdLocation"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="参与馆">
              <el-select
                filterable
                v-model="literatureEditForm.participateLibId"
                multiple
                class="multi line"
                collapse-tags
                placeholder="请选择"
                style="flexBasis:150px"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="EventTitle" label="活动标题">
              <el-input
                clearable
                v-model="literatureEditForm.EventTitle"
                ref="EventTitle"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="date1" label="起始时间">
              <el-date-picker
                v-model="literatureEditForm.date1"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="literatureEditForm.startDatePicker"
                ref="date1"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="date2" label="结束时间">
              <el-date-picker
                v-model="literatureEditForm.date2"
                type="datetime"
                placeholder="选择日期时间"
                clearable
                format="yyyy-MM-dd HH:mm"
                value-format="yyyy-MM-dd HH:mm"
                :picker-options="literatureEditForm.endDatePicker"
                ref="date2"
                class="el-date-editor--datetime"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="限制报名人数">
              <el-switch v-model="literatureEditForm.limitNums"> </el-switch>
              <el-input-number
                v-model="literatureEditForm.limitNumsInput"
                :min="1"
                v-if="literatureEditForm.limitNums"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="开通扫码签到">
              <el-switch v-model="literatureEditForm.checkIn"> </el-switch>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="奖励活动积分">
              <el-switch v-model="literatureEditForm.integral"> </el-switch>
              <span style="marginLeft:15px" v-if="literatureEditForm.integral"
                >报名奖励积分:</span
              >
              <el-input-number
                v-model="literatureEditForm.SignupIntegralInput"
                :min="0"
                v-if="literatureEditForm.integral"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
              <br />
              <span style="marginLeft:55px" v-if="literatureEditForm.integral"
                >签到奖励积分:</span
              >
              <el-input-number
                v-model="literatureEditForm.checkInIntegralInput"
                :min="0"
                v-if="literatureEditForm.integral"
                style="marginLeft:10px;width:120px"
              ></el-input-number>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="活动封面" prop="file">
              <el-upload
                class="avatar-uploader"
                :action="BASE_URL + '/api/p/img/upload'"
                :show-file-list="false"
                :before-upload="beforeAvatarUploadEdit"
                :on-success="handleElibLoginSuccessEdit"
                :data="fileFormData"
                ref="file"
              >
                <!-- 预览图片 -->
                <img
                  v-if="literatureEditForm.avatarUrl"
                  :src="literatureEditForm.avatarUrl"
                  class="avatar"
                />
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                <div class="avatar-uploader-txt">点击上传图片</div>
              </el-upload>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="活动简介"
              prop="textarea"
              style="flex:0 0 100%"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="literatureEditForm.textarea"
                clearable
                style="width:330%"
                ref="textarea"
              >
              </el-input>
            </el-form-item>
            <el-form-item class="item" label="活动详情">
              <editor-bar
                v-model="literatureEditForm.editor.info"
                :isClear="literatureEditForm.isClear"
              ></editor-bar>
            </el-form-item>
            <el-form-item
              class="item"
              style="justifyContent: flex-start;marginLeft:100px"
            >
              <el-checkbox
                v-model="literatureEditForm.shortStatus"
                @change="selectCheckEdit"
                >保存后直接发布</el-checkbox
              >
              <el-checkbox
                v-model="literatureEditForm.acIsRecommend"
                @change="selectRecommendEdit"
                >首页推荐</el-checkbox
              >
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureEditForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 二维码弹窗 -->
    <el-dialog title="签到码" :visible.sync="erweimaBox">
      <div class="qr__container" v-loading="generateQrCode">
        <img id="image" src="" alt="" />
      </div>
      <el-form :model="QRcodeForm">
        <el-form-item size="mini" label="大小" style="marginLeft:-15px">
          <el-select
            filterable
            v-model="QRcodeForm.size"
            placeholder="请选择"
            @change="select800"
            clearable
          >
            <el-option
              v-for="item in QRcodeSize"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="erweimaBox = false" size="mini">取 消</el-button>
        <el-button type="primary" @click="loadErWeiMa" size="mini"
          >下 载</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchActivity,
  saveActivity,
  activityExpo,
  delActivity,
  updZtai
} from "api/operation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import EditorBar from "components/EditorBar";
import QRCode from "qrcode";
import { IMG_URL } from "utils/base";
import { BASE_URL } from "utils/base";
import { getToken } from "utils/auth";

export default {
  components: {
    EditorBar
  },
  name: "opera_pcqd",
  data() {
    this.literatureFilterOptions = [
      {
        value: "acTitle",
        label: "活动标题"
      },
      {
        value: "acAddress",
        label: "举办地点"
      },
      {
        value: "userName",
        label: "操作者"
      }
    ];

    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      statusSelect: [
        { label: "全部", value: "" },
        { label: "待发布", value: "0" },
        { label: "进行中", value: "1" },
        { label: "已暂停", value: "2" },
        { label: "已结束", value: "3" }
      ],
      statusId: "",
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "acTitle",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      undisposed: "",
      processed: "",
      processing: "",
      over: "",
      // 新增
      showAddSide: false,
      // 二维码弹窗
      erweimaBox: false,
      BASE_URL: BASE_URL,
      IMG_URL: IMG_URL,
      fileFormData: {
        userToken: getToken(),
        imgType: "activity"
      },
      literatureAddForm: {
        holdLibId: this.$store.getters.userInfo.libId,
        holdLocation: "",
        participateLibId: [],
        EventTitle: "",
        date1: "",
        date2: "",
        limitNums: false,
        checkIn: false,
        limitNumsInput: 0,
        // 积分
        integral: false,
        SignupIntegralInput: 0,
        checkInIntegralInput: 0,
        textarea: "",
        editor: {
          info: ""
        },
        isClear: false,
        file: "",
        acZtai: "1",
        // 勾选保存后直接发布
        shortStatus: true,
        // 首页推荐
        acIsRecommend: false,
        // 传参路径
        acCoverPath: "",
        // 预览图片路径
        avatarUrl: "",
        startDatePicker: {
          disabledDate: time => {
            // 其余后台处理
            // 结束时间没选--可以选择当天
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        endDatePicker: {
          disabledDate: time => {
            // 后台处理
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      literatureEditForm: {
        holdLibId: "",
        holdLocation: "",
        participateLibId: [],
        EventTitle: "",
        date1: "",
        date2: "",
        limitNums: "",
        checkIn: "",
        limitNumsInput: 0,
        // 积分
        integral: "",
        file: "",
        SignupIntegralInput: 0,
        checkInIntegralInput: 0,
        textarea: "",
        editor: {
          info: ""
        },
        isClear: false,
        acZtai: "",
        // 勾选保存后直接发布
        shortStatus: "",
        // 首页推荐
        acIsRecommend: "",
        // 传参路径
        acCoverPath: "",
        // 预览图片路径
        avatarUrl: "",
        // 编辑id
        acId: "",
        startDatePicker: {
          disabledDate: time => {
            // 结束时间没选--可以选择当天
            return time.getTime() < Date.now() - 8.64e7;
          }
        },
        endDatePicker: {
          disabledDate: time => {
            return time.getTime() < Date.now() - 8.64e7;
          }
        }
      },
      QRcodeForm: {
        size: 200
      },
      QRcodeSize: [
        { label: "200px", value: 200 },
        { label: "400px", value: 400 },
        { label: "800px", value: 800 }
      ],
      generateQrCode: false,
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      rules: {
        holdLibId: [
          { required: true, message: "请选择举办馆", trigger: "blur" }
        ],
        holdLocation: [
          { required: true, message: "请选择举办地点", trigger: "blur" }
        ],
        EventTitle: [
          { required: true, message: "请填写活动标题", trigger: "blur" }
        ],
        file: [{ required: true, message: "请上传图片" }],
        textarea: [
          { required: true, message: "请填写活动简介", trigger: "blur" }
        ],
        date1: [
          {
            required: true,
            message: "请选择起始时间",
            trigger: ["blur", "change"]
          }
        ],
        date2: [
          {
            required: true,
            message: "请选择结束时间",
            trigger: ["blur", "change"]
          }
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
      this.editGzsm(row);
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
        acStart: this.date1,
        acEnd: this.date2,
        acZtai: this.statusId
      };

      searchActivity(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          res.data.page.dataList.forEach(item => {
            // 举办时间
            item.HoldingTime =
              item.acStart.substr(0, 16) + "~" + item.acEnd.substr(0, 16);
            if (item.acIsLimitApply) {
              // 开通限制报名功能
              item.SignUpNum = item.acApplyCount + "/" + item.curApplyCount;
            } else {
              // 不开通
              item.SignUpNum = item.curApplyCount;
            }
            // 活动状态
            if (item.acZtai == 0) {
              item.status = "待发布";
            } else if (item.acZtai == 1) {
              item.status = "进行中";
            } else if (item.acZtai == 2) {
              item.status = "已暂停";
            } else if (item.acZtai == 3) {
              item.status = "已结束";
            }
          });
          this.literatureList = res.data.page.dataList;
          this.totalLiteratureCount = Number(res.data.page.totalElements);
          this.undisposed = res.data.statistical.activityCount;
          this.processed = res.data.statistical.waitPublishCount;
          this.processing = res.data.statistical.publishCount;
          this.over = res.data.statistical.overCount;
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
      let params = {
        acMainLibId: this.literatureAddForm.holdLibId,
        acAddress: this.literatureAddForm.holdLocation,
        acStart: this.literatureAddForm.date1,
        acEnd: this.literatureAddForm.date2,
        acTitle: this.literatureAddForm.EventTitle,
        acIsLimitApply: this.literatureAddForm.limitNums,
        acApplyCount: this.literatureAddForm.limitNums
          ? this.literatureAddForm.limitNumsInput
          : 0,
        acIsQRSignIN: this.literatureAddForm.checkIn,
        acHaveIntegration: this.literatureAddForm.integral,
        acApplyIntegration: this.literatureAddForm.integral
          ? this.literatureAddForm.SignupIntegralInput
          : 0,
        acSignInIntegration: this.literatureAddForm.integral
          ? this.literatureAddForm.checkInIntegralInput
          : 0,
        acCoverPath: this.literatureAddForm.acCoverPath,
        acSimpleContent: this.literatureAddForm.textarea,
        acDetailContent: this.literatureAddForm.editor.info,
        acZtai: this.literatureAddForm.acZtai,
        acIsRecommend: this.literatureAddForm.acIsRecommend,
        affiliateLibs: this.literatureAddForm.participateLibId.join()
      };
      saveActivity(params)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.resetField("literatureAddForm");
            // 刷新列表
            this.initLiteratureList();
          }
        })
        .catch(error => {
          if (error.message == "活动截止时间在当前时间之前，请重新设定！") {
            this.$refs.date2.focus();
          }
        });
    },
    // 编辑接口
    handleLiteratureFormEdit() {
      let params = {
        acMainLibId: this.literatureEditForm.holdLibId,
        acAddress: this.literatureEditForm.holdLocation,
        acStart: this.literatureEditForm.date1,
        acEnd: this.literatureEditForm.date2,
        acTitle: this.literatureEditForm.EventTitle,
        acIsLimitApply: this.literatureEditForm.limitNums,
        acApplyCount: this.literatureEditForm.limitNums
          ? this.literatureEditForm.limitNumsInput
          : 0,
        acIsQRSignIN: this.literatureEditForm.checkIn,
        acHaveIntegration: this.literatureEditForm.integral,
        acApplyIntegration: this.literatureEditForm.integral
          ? this.literatureEditForm.SignupIntegralInput
          : 0,
        acSignInIntegration: this.literatureEditForm.integral
          ? this.literatureEditForm.checkInIntegralInput
          : 0,
        acCoverPath: this.literatureEditForm.acCoverPath,
        acSimpleContent: this.literatureEditForm.textarea,
        acDetailContent: this.literatureEditForm.editor.info,
        acZtai: this.literatureEditForm.acZtai,
        acIsRecommend: this.literatureEditForm.acIsRecommend,
        affiliateLibs: this.literatureEditForm.participateLibId.join(),
        acId: this.literatureEditForm.acId
      };
      saveActivity(params)
        .then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.resetField("literatureEditForm");
            this.initLiteratureList();
          }
        })
        .catch(error => {
          if (error.message == "活动截止时间在当前时间之前，请重新设定！") {
            this.$refs.date2.focus();
          }
        });
    },
    // 取消提交
    cancelForm(formName) {
      if (formName === "literatureAddForm") {
        this.showAddSide = false;
        this.$refs["literatureAddForm"].resetFields();
        this.literatureAddForm.avatarUrl = "";
        this.literatureAddForm.acCoverPath = "";
        this.literatureAddForm.editor.info = "";
        this.literatureAddForm.participateLibId = [];
        this.literatureAddForm.limitNums = false;
        this.literatureAddForm.checkIn = false;
        this.literatureAddForm.integral = false;
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
        this.literatureEditForm.avatarUrl = "";
        this.literatureEditForm.acCoverPath = "";
        this.literatureEditForm.editor.info = "";
        this.literatureEditForm.participateLibId = [];
        this.literatureEditForm.limitNums = false;
        this.literatureEditForm.checkIn = false;
        this.literatureAddForm.integral = false;
      }
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
        if (valid) {
          // 通过表单验证
          if (formName === "literatureAddForm") {
            let startTime = new Date(
              this.literatureAddForm.date1.replace(/-/g, "/")
            ).getTime();
            let overTime = new Date(
              this.literatureAddForm.date2.replace(/-/g, "/")
            ).getTime();
            if (overTime <= startTime) {
              this.$message.error("结束时间必须晚于开始时间");
              this.$refs.date2.focus();
              return false;
            }
            this.handleLiteratureFormAdd();
          } else if (formName === "literatureEditForm") {
            let startTime = new Date(
              this.literatureEditForm.date1.replace(/-/g, "/")
            ).getTime();
            let overTime = new Date(
              this.literatureEditForm.date2.replace(/-/g, "/")
            ).getTime();
            if (overTime <= startTime) {
              this.$message.error("结束时间必须晚于开始时间");
              this.$refs.date2.focus();
              return false;
            }
            this.handleLiteratureFormEdit();
          }
        } else {
          return false;
        }
      });
    },
    // 清空表单信息及关闭弹框
    resetField(formName) {
      if (formName == "literatureAddForm") {
        this.showAddSide = false;
        this.$refs["literatureAddForm"].resetFields();
        // 清空表单其余
        this.literatureAddForm.avatarUrl = "";
        this.literatureAddForm.acCoverPath = "";
        this.literatureAddForm.editor.info = "";
        this.literatureAddForm.participateLibId = [];
        this.literatureAddForm.limitNums = false;
        this.literatureAddForm.checkIn = false;
        this.literatureAddForm.integral = false;
      } else if (formName == "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
        // 清空表单其余
        this.literatureEditForm.avatarUrl = "";
        this.literatureEditForm.acCoverPath = "";
        this.literatureEditForm.editor.info = "";
        this.literatureEditForm.participateLibId = [];
        this.literatureEditForm.limitNums = false;
        this.literatureEditForm.checkIn = false;
        this.literatureAddForm.integral = false;
      }
    },
    // 编辑活动页面
    editGzsm(row) {
      this.showEditSide = true;
      this.literatureEditForm.holdLibId = row.acMainLibId;
      this.literatureEditForm.holdLocation = row.acAddress;
      if (row.affiliateLibs) {
        this.literatureEditForm.participateLibId = row.affiliateLibs.split(",");
      }
      this.literatureEditForm.EventTitle = row.acTitle;
      this.literatureEditForm.date1 = row.acStart.substr(0, 16);
      this.literatureEditForm.date2 = row.acEnd.substr(0, 16);
      this.literatureEditForm.limitNums = row.acIsLimitApply;
      this.literatureEditForm.limitNumsInput = Number(row.acApplyCount);
      this.literatureEditForm.checkIn = row.acIsQRSignIN;
      this.literatureEditForm.integral = row.acHaveIntegration;
      this.literatureEditForm.SignupIntegralInput = Number(
        row.acApplyIntegration
      );
      this.literatureEditForm.checkInIntegralInput = Number(
        row.acSignInIntegration
      );
      this.literatureEditForm.avatarUrl =
        this.IMG_URL + "/api/p/img/url?img=" + row.acCoverPath;
      this.literatureEditForm.acCoverPath = row.acCoverPath;
      // 消除图片没上传验证
      this.literatureEditForm.file = row.acCoverPath;
      this.literatureEditForm.textarea = row.acSimpleContent;
      this.literatureEditForm.editor.info = row.acDetailContent;
      this.literatureEditForm.acZtai = row.acZtai;
      if (row.acZtai == 1) {
        // 进行中，要勾上保存后直接发布
        this.literatureEditForm.shortStatus = true;
      } else if (row.acZtai == 0) {
        // 待发布，不要勾上
        this.literatureEditForm.shortStatus = false;
      }
      this.literatureEditForm.acIsRecommend = row.acIsRecommend;
      this.literatureEditForm.acId = row.acId;
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delActivity({ acIds: row.acId }).then(res => {
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
          delActivity({
            acIds: this.multipleLiteratureSelection.join()
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
    // 导出
    handleExport() {
      downLoadExcel(activityExpo(), {
        acZtai: this.statusId,
        acStart: this.date1,
        acEnd: this.date2,
        ...this.requestObj
      });
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.acId);
    },

    // 快捷发布勾选
    selectCheckAdd() {
      if (this.literatureAddForm.shortStatus) {
        this.literatureAddForm.acZtai = "1";
      } else {
        this.literatureAddForm.acZtai = "0";
      }
    },

    // 快捷发布勾选
    selectCheckEdit() {
      if (this.literatureEditForm.shortStatus) {
        this.literatureEditForm.acZtai = "1";
      } else {
        this.literatureEditForm.acZtai = "0";
      }
    },
    // 首页推荐
    selectRecommendEdit() {
      if (this.literatureEditForm.acIsRecommend) {
        // 移动端首页进行推荐
      } else {
        // 不进行推荐
      }
    },
    // 跳转活动数据
    goHdsj(acId) {
      this.$router.push({
        name: "opera_hdsj",
        query: { acId }
      });
    },
    // 二维码弹出
    showErweima(acId) {
      //  如果是普通尺寸下载
      this.erweimaBox = true; //弹窗
      this.qrCodeAcId = acId;
      this.$nextTick(() => {
        this.generateQrCode = true;
        const opts = {
          margin: 1,
          width: this.QRcodeForm.size,
          errorCorrectionLevel: "H",
          type: "image/jpeg"
        };

        QRCode.toDataURL(acId, opts, (err, url) => {
          this.generateQrCode = false;
          if (err) throw err;
          document.getElementById("image").src = url;
        });
      });
    },
    // 选择800下载
    select800(value) {
      this.generateQrCode = true;
      const opts = {
        margin: 1,
        width: value,
        errorCorrectionLevel: "H",
        type: "image/jpeg"
      };

      QRCode.toDataURL(this.qrCodeAcId, opts, (err, url) => {
        this.generateQrCode = false;
        if (err) throw err;
        document.getElementById("image").src = url;
      });
    },
    // 导出图片
    loadErWeiMa() {
      let url = document.getElementById("image").src;
      let event = new MouseEvent("click");
      let a = document.createElement("a");
      a.download =
        `签到码${this.QRcodeForm.size}` + ` x ` + `${this.QRcodeForm.size}`;
      a.href = url;
      a.dispatchEvent(event);
      // 关掉窗口
      this.erweimaBox = false;
    },
    beforeAvatarUploadAdd(file) {
      var isGeshi;
      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/gif"
      ) {
        isGeshi = true;
      } else {
        isGeshi = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isGeshi) {
        this.$message.error("上传产品图片只能是png,jpg,gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传产品图片大小不能超过 2MB!");
      }
      return isLt2M && isGeshi;
    },
    beforeAvatarUploadEdit(file) {
      var isGeshi;
      if (
        file.type === "image/png" ||
        file.type === "image/jpeg" ||
        file.type === "image/gif"
      ) {
        isGeshi = true;
      } else {
        isGeshi = false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isGeshi) {
        this.$message.error("上传产品图片只能是png,jpg,gif格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传产品图片大小不能超过 2MB!");
      }
      return isLt2M && isGeshi;
    },
    handleElibLoginSuccessEdit(res) {
      if (res.code == 0) {
        this.literatureEditForm.avatarUrl =
          this.IMG_URL + "/api/p/img/url?img=" + res.data.imgUrl;
        // 保存传参
        this.literatureEditForm.acCoverPath = res.data.imgUrl;
        // 去除上传校验
        this.literatureEditForm.file = res.data.imgUrl;
        this.$message.success("上传成功");
      }
    },
    handleElibLoginSuccessAdd(res) {
      if (res.code == 0) {
        this.literatureAddForm.avatarUrl =
          this.IMG_URL + "/api/p/img/url?img=" + res.data.imgUrl;
        // 保存传参
        this.literatureAddForm.acCoverPath = res.data.imgUrl;
        // 去除上传校验
        this.literatureAddForm.file = "res.data.imgUrl";
        this.$message.success("上传成功");
      }
    },
    // 切换状态操作
    upStatus(status, row) {
      updZtai({
        acId: row.acId,
        acZtai: status
      }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.initLiteratureList();
        }
      });
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
/deep/.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
/deep/.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
/deep/.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
/deep/.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
/deep/ .avatar-uploader-txt {
  position: absolute;
  bottom: 40px;
  text-align: center;
  left: 50px;
  color: #d9d9d9;
}
/deep/ .el-form-item__label {
  min-width: 100px;
}
/deep/ .el-textarea__inner {
  height: 80px;
  min-height: 80px !important;
}
.qr__container {
  width: 400px;
  height: 400px;
  margin: auto;
  img {
    width: 100%;
    height: 100%;
    max-width: 400px;
    max-height: 400px;
  }
}

.edit__footer {
  justify-content: flex-end !important;
}
</style>
