<!--
 * @Description: 资金管理
 * @Autor: chenming.feng
 * @Date: 2019-11-05 09:19:29
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 19:34:50
 -->
<template>
  <div class="common__content">
    <td-content-header>
      资金管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddList"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMoneySelection.length === 0"
            type="primary"
            size="mini"
            @click="deleteMoneyList('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
              v-show="multipleMoneySelection.length"
              >({{ multipleMoneySelection.length }})</span
            ></el-button
          >
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出
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
            clearable
            size="mini"
            @change="getUserList"
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
          <span>操作时间：</span>
          <el-date-picker
            v-model="dateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="dateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
          <p class="label">操作者：</p>
          <el-select
            filterable
            size="mini"
            v-model="userListID"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="initMoneyList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="zjglTable">
        <el-table
          v-loading="loadingData"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          ref="moneyTable"
          border
          :data="dataList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="moneyName"
            show-overflow-tooltip
            label="资金名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="moneyPrice" label="金额">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="操作人">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="操作时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                ref="actionTool"
                :id="scope.row.cfMoneyId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="showEditList"
                @handleDel="deleteMoneyList(scope.row)"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="downLoadAttach(scope.row.cfMoneyId)"
                  >
                    下载附件
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="currentPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑资金管理信息 -->
    <side-wrap
      v-loading="loadingData"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              资金管理信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="moneyEditForm"
          label-width="90px"
          :model="moneyEditForm"
          :rules="moneyFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>资金管理信息</span>
            </div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="moneyEditForm.libId"
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
            </el-form-item>
            <el-form-item class="item" prop="moneyName" label="资金名称">
              <el-input clearable v-model="moneyEditForm.moneyName"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="money" label="金额">
              <el-input
                clearable
                v-only-num.float="moneyEditForm.money"
                v-model="moneyEditForm.money"
              ></el-input>
            </el-form-item>
            <el-form-item class="item"> </el-form-item>
            <el-form-item
              class="item"
              prop="file_path"
              label="附件上传"
              style="flex: 100%;"
            >
              <el-upload
                :action="BASE_URL + '/api/e/interview/money/upload'"
                name="file"
                ref="fileUpload"
                :file-list="fileList"
                :data="fileFormData"
                multiple
                accept=".pdf,.jpg,.png"
                :on-change="handleFileChange"
                :on-success="handleFileUploadSuccess"
                :on-remove="handleFileRemove"
              >
                <el-button size="mini" type="primary">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  附件支持图片（png/jpg）和PDF格式上传，并且支持上传多张
                </div>
              </el-upload>
            </el-form-item>
            <span></span>
            <el-form-item class="item" prop="remark" label="备注">
              <el-input
                clearable
                type="textarea"
                :rows="4"
                v-model="moneyEditForm.remark"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('moneyEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('moneyEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { BASE_URL } from "utils/base";
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";

import {
  moneyAdd,
  moneyUpdate,
  moneyDel,
  moneyList,
  moneyExportExcel,
  moneyGetUserList,
  moneyExportAttach
} from "api/acquisition";

export default {
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.BASE_URL = BASE_URL;
    this.moneyFormRules = {
      libId: [{ required: true, message: "请选择成员馆", trigger: "change" }],
      moneyName: [
        { required: true, message: "资金名称不能为空", trigger: "blur" }
      ],
      money: [{ required: true, message: "金额不能为空", trigger: "blur" }],
      file_path: [{ required: true, message: "附件不能为空", trigger: "blur" }]
    };
    return {
      multipleMoneySelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      dateStart: "",
      dateEnd: "",
      currentPageSize: 15,
      currentPage: 1,
      totalCount: 0,
      userList: [],
      dataList: [],
      currentMoneyManageId: "",
      loadingData: false,
      showEditSide: false,
      userListID: "",
      // 表单
      moneyEditForm: {
        cfMoneyId: "",
        moneyName: "",
        money: "",
        libId: this.$store.getters.userInfo.libId,
        remark: "",
        file_path: ""
      },
      fileList: [],
      fileFormData: {
        userToken: getToken()
      }
    };
  },
  created() {
    this.initMoneyList();
  },
  methods: {
    handleFileUploadSuccess() {
      if (timer) {
        clearTimeout(timer);
      }
      let timer = setTimeout(() => {
        this.checkFileExist();
      }, 100);
    },
    handleFileChange(file, fileList) {
      this.fileList = fileList;
    },
    handleFileRemove(file, fileList) {
      this.fileList = fileList;
      this.checkFileExist();
    },
    setFileList(data) {
      // 设置附件列表
      this.fileList = Object.keys(data).map(key => {
        return {
          name: key,
          url: data[key]
        };
      });
    },
    // 资金管理目录列表
    rowClick(row) {
      this.$refs["moneyTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.showEditList("", "", row);
    },
    handleSelectionChange(val) {
      this.multipleMoneySelection = val.map(item => item.cfMoneyId);
    },
    downLoadAttach(cfMoneyId) {
      downLoadExcel(moneyExportAttach(), {
        cfMoneyId
      });
    },
    // 删除
    deleteMoneyList(row) {
      this.$confirm(
        row.cfMoneyId
          ? `该操作将删除资金信息【${row.moneyName}】，是否确认删除?`
          : `确定删除${this.multipleMoneySelection.length}条数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadingData = true;
          moneyDel({
            cfMoneyIds: row.cfMoneyId
              ? row.cfMoneyId
              : this.multipleMoneySelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initMoneyList();
            })
            .finally(() => {
              this.loadingData = false;
            });
        })
        .catch(() => {});
    },
    // 操作员
    getUserList() {
      moneyGetUserList({
        libId: this.selectLibId
      }).then(res => {
        this.userList = res.data.map(e => {
          return {
            label: e.username,
            value: e.userId
          };
        });
        this.userList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    // 资金新增
    showAddList() {
      this.currentMode = "add";
      this.fileList = [];
      this.showEditSide = true;
      this.$nextTick(() => {
        this.resetForm("moneyEditForm");
      });
    },
    // 编辑信息
    showEditList(id, index, data) {
      this.currentMode = "edit";
      this.showEditSide = true;
      this.moneyEditForm = {
        cfMoneyId: data.cfMoneyId,
        moneyName: data.moneyName,
        money: data.money,
        libId: data.libId,
        remark: data.remark,
        file_path: data.file_path
      };
      this.setFileList(data.path);
      this.fileListOrigin = Object.assign([], this.fileList);
      this.moneyEditFormOrigin = Object.assign({}, this.moneyEditForm);
    },
    // 编辑
    handleMoneyListFormEdit() {
      if (this.currentMode === "add") {
        moneyAdd({
          ...this.moneyEditForm
        }).then(res => {
          this.$message.success(res.message);
          this.showEditSide = false;
          this.initMoneyList();
        });
      } else {
        moneyUpdate({
          ...this.moneyEditForm
        }).then(res => {
          this.$message.success(res.message);
          this.showEditSide = false;
          this.initMoneyList();
        });
      }
    },
    // 目录列表
    initMoneyList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getList();
      this.getUserList();
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId,
        userId: this.userListID,
        optime1: this.dateStart,
        optime2: this.dateEnd
      };
    },
    getList() {
      this.loadingData = true;

      let requestObj = {
        pageNumber: this.currentPage,
        pageSize: this.currentPageSize,
        ...this.requestObj
      };

      moneyList(requestObj)
        .then(res => {
          this.loadingData = false;
          this.dataList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadingData = false;
        });
    },
    // 通用
    resetForm(formName) {
      this.$refs["fileUpload"].clearFiles();
      if (this.currentMode === "edit") {
        // 恢复原始数据
        this.moneyEditForm = Object.assign({}, this.moneyEditFormOrigin);
        this.fileList = Object.assign([], this.fileListOrigin);
      } else {
        this.moneyEditForm = {
          moneyName: "",
          money: "",
          libId: this.$store.getters.userInfo.libId,
          remark: "",
          file_path: ""
        };
        this.fileList = [];
      }
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleMoneyListFormEdit();
        }
      });
    },
    checkFileExist() {
      this.moneyEditForm.file_path = this.fileList
        .map(item => item.url || item.response.data[0])
        .join();
      this.$refs["moneyEditForm"].validateField("file_path");
    },
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.getList();
    },
    handlePageChange(val) {
      this.currentPage = val;
      this.getList();
    },
    downLoadData() {
      downLoadExcel(moneyExportExcel(), {
        ...this.requestObj,
        func_name_us: "cf_money"
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
