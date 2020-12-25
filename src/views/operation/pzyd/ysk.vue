<!--
 * @Description: 云书库
 * @Autor: chenming.feng
 * @Date: 2019-10-17 16:37:24
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 16:48:27
 -->
<template>
  <div class="set-ysk common__content">
    <td-content-header>
      书库信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="createTabelVisible"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleSKSelection.length === 0"
            size="mini"
            type="primary"
            @click="handleDelJg('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            placeholder="请输入搜索关键词"
            v-model="currentFilterVal"
            @keydown.enter.native="initSKList"
            style="flex:auto;max-width:200px"
          ></el-input>
          <el-button type="primary" size="mini" @click="initSKList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="contentTable">
        <el-table
          ref="skListTable"
          v-loading="loadSKListData"
          @row-click="skListRowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          border
          :data="skList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
            :selectable="handleSelectable"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tableName"
            label="书库代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tableDescribe"
            label="书库名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="更新时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="username" label="操作员">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                v-if="scope.row.tableName !== 'JD'"
                :id="scope.row.id"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit', 'detail']"
                @handleDetail="checkJgDetail"
                @handleEdit="handleEditTable"
                @handleDel="handleDelJg"
              ></td-action-tool>
              <div v-else style="text-align: center;">
                <span title="不允许操作">-</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleJgSizeChange"
          @current-change="handleJgCurrentChange"
          :total="totalSKListCount"
          :currentPage="currentSKListPage"
          :pageSize="skListPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增书库/导入 -->
    <el-dialog
      title="新增书库"
      custom-class="scroll__hide"
      :visible.sync="showAddTable"
      width="80%"
    >
      <el-scrollbar>
        <el-steps
          :active="stepNum"
          finish-status="success"
          align-center
          style="margin-bottom: 10px;"
        >
          <el-step title="上传数据"></el-step>
          <el-step title="导入数据"></el-step>
          <el-step title="导入完成"></el-step>
        </el-steps>
        <el-form
          v-show="!showImportProgress"
          class="add__form"
          ref="tableAddForm"
          :model="tableAddForm"
          :rules="tableAddFormRules"
          label-width="100px"
        >
          <el-form-item
            size="mini"
            class="item"
            prop="tableName"
            label="书库代码"
          >
            <el-input
              placeholder="请输入书库代码"
              v-model="tableAddForm.tableName"
            ></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            class="item"
            prop="tableDescribe"
            label="书库名称"
          >
            <el-input
              placeholder="请输入书库名称"
              v-model="tableAddForm.tableDescribe"
            ></el-input>
          </el-form-item>
          <el-form-item
            size="mini"
            class="item"
            prop="flag"
            label="编辑方式"
            v-show="currentTableMode === 'edit'"
          >
            <el-radio v-model="tableAddForm.flag" :label="0">全部更新</el-radio>
            <el-radio v-model="tableAddForm.flag" :label="1">新增图书</el-radio>
            <el-radio v-model="tableAddForm.flag" :label="2">删除图书</el-radio>
          </el-form-item>
          <el-form-item
            size="mini"
            class="item"
            label="导入数据"
            style="margin-bottom: 0;line-height: 1;"
          >
            <el-upload
              ref="excelUpload"
              :http-request="uploadExcelFile"
              :before-upload="beforeExcelUpload"
              :on-remove="handleRemove"
              :on-change="handleExcelChange"
              action=""
              accept=".xls,.xlsx"
              :auto-upload="false"
            >
              <el-button size="mini" type="text">点击上传书库文件</el-button>
              <div slot="tip" class="el-upload__tip">
                仅限.xls / .xlsx文件，大小限制2M
              </div>
            </el-upload>
          </el-form-item>
          <el-form-item size="mini" class="item" label="">
            <el-button
              size="mini"
              type="primary"
              :loading="uploadingExcel"
              @click="submitExcel"
              >导入</el-button
            >
          </el-form-item>
          <div v-if="uploadFilePath" style="padding: 0 30px;">
            <h3 style="margin-bottom: 10px;">请选择对应字段</h3>
            <table style="width: 100%;">
              <tr style="font-weight: bold;font-size: 15px;">
                <td>书库对应字段</td>
                <td>Excel对应字段</td>
                <td>书库对应字段</td>
                <td>Excel对应字段</td>
              </tr>
              <tr>
                <td style="position: relative;">
                  <span style="position: absolute; left: -11px; color: #F56C6C;"
                    >*</span
                  >
                  ISBN
                </td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.isbn"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td style="position: relative;">
                  <span style="position: absolute; left: -11px; color: #F56C6C;"
                    >*</span
                  >正题名
                </td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.title"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>出版日期</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.pubdate"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>出版社</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.press"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>价格</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.price"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>分类号</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.flhao"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>分类名</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.catagory"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>责任者</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.author"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
              </tr>
              <tr>
                <td>语种</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.language"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
                <td>荐购理由</td>
                <td>
                  <el-select
                    filterable
                    size="mini"
                    clearable
                    v-model="headerForm.recommendReason"
                  >
                    <el-option
                      v-for="item in headerOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </td>
              </tr>
            </table>
          </div>
        </el-form>
        <div
          v-show="showImportProgress"
          style="text-align: center;padding-top: 20px;"
        >
          <div v-if="showUploadResult">
            <el-progress
              :stroke-width="8"
              :width="100"
              type="circle"
              :percentage="uploadTabelPercent"
            ></el-progress>
            <p>
              正在导入中（{{ countData.already }}/{{ countData.all }}），请稍后
            </p>
          </div>
          <div v-else style="text-align: center;">
            <p style="font-size: 40px;color: #409EFF;">
              <i class="el-icon-success"></i>
            </p>

            <p v-if="removeTableResult" style="font-size: 20px;">
              成功删除{{ removeTableResult.delSucNum }}条数据
            </p>
            <p v-else style="font-size: 20px;">
              成功导入{{ countData.already }}条数据
            </p>

            <p v-if="removeTableResult" style="margin: 10px 0;">
              未删除{{ removeTableResult.delFailNum }}条数据
              <el-button
                v-if="removeTableResult.delFailNum"
                style="vertical-align: baseline;"
                type="text"
                @click="downloadUnDelData"
                >下载未导入结果</el-button
              >
            </p>
            <p v-else style="margin: 10px 0;">
              未导入{{ countData.all - countData.already }}条数据
              <el-button
                v-if="false"
                style="vertical-align: baseline;"
                type="text"
                >下载未导入结果</el-button
              >
            </p>

            <p>
              <el-button type="primary" size="mini" @click="reUpload"
                >再次导入</el-button
              >
            </p>
          </div>
        </div>
      </el-scrollbar>
      <template v-slot:footer>
        <div
          class="edit__footer border"
          style="display: flex;justify-content: space-between;"
        >
          <div>
            <el-button v-if="false" size="mini" @click="resetTableAddForm"
              >重置</el-button
            >
          </div>
          <div v-show="!showImportProgress">
            <el-button
              size="mini"
              type="primary"
              :loading="savingTableName"
              @click="submitForm('tableAddForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddTable = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import Cookies from "js-cookie";

import { updateYunBook, delYunBook, searchYunBook } from "api/operation";

import { bookImport, excelUpload } from "api/other";

import { downLoadExcel } from "utils/utils";

const YUNBOOK_URL = Cookies.get("yunService");

export default {
  name: "opera_ysk",
  data() {
    this.filterOptions = [
      {
        label: "书库代码",
        value: "tableName"
      },
      {
        label: "书库名称",
        value: "tableDescribe"
      },
      {
        label: "操作员",
        value: "username"
      }
    ];
    this.tableAddFormRules = {
      tableName: [
        { required: true, message: "请输入书库代码", trigger: "blur" },
        {
          min: 6,
          message: "长度至少为6位",
          trigger: "blur"
        },
        {
          pattern: /^[a-zA-Z]{1,10}[_][0-9a-zA-Z]{3,10}$/,
          message:
            "必须是以非数字开头，且包含下划线以及字母或数字的字符串（例如: tuodi_book）"
        }
      ],
      tableDescribe: [
        { required: true, message: "请输入书库名称", trigger: "blur" },
        {
          max: 10,
          message: "请输入10字以内",
          trigger: "blur"
        }
      ]
    };
    return {
      currentFilterKey: "tableName",
      showAddTable: false,
      tableAddForm: {
        flag: 0,
        tableName: "",
        tableDescribe: ""
      },
      currentFilterVal: "",
      savingTableName: false,
      multipleSKSelection: [],
      loadSKListData: false,
      skList: [],
      totalSKListCount: 0,
      currentSKListPage: 1,
      skListPageSize: 15,
      stepNum: 0,
      showImportProgress: false,
      uploadTabelPercent: 0,
      uploadingExcel: false,
      headerOptions: [],
      headerForm: {
        title: "",
        author: "",
        pubdate: "",
        press: "",
        price: "",
        flhao: "",
        catagory: "",
        isbn: "",
        language: "",
        recommendReason: ""
      },
      countData: {
        already: 0,
        all: 0
      },
      uploadFilePath: "",
      showUploadResult: false,
      currentTableMode: "add",
      removeTableResult: "" // 判断是否有删除书库
    };
  },
  methods: {
    // 第三方书库
    downloadUnDelData() {
      downLoadExcel(
        YUNBOOK_URL + "/excel/download",
        {
          path: this.removeTableResult.path
        },
        false
      );
    },
    reUpload() {
      this.showImportProgress = false;
      this.uploadTabelPercent = 0;
      this.uploadFilePath = "";
      this.countData = {
        already: 0,
        all: 0
      };
      this.headerForm = {
        title: "",
        author: "",
        pubdate: "",
        press: "",
        price: "",
        flhao: "",
        catagory: "",
        isbn: "",
        language: "",
        recommendReason: ""
      };
      this.stepNum = 0;
      this.resetTableAddForm();
    },
    submitExcel() {
      if (this.stepNum === 0) {
        this.$message.warning("请上传书库文件");
        return;
      }
      this.$refs["excelUpload"].submit();
    },
    beforeExcelUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2; // 2MB
      if (!isLt2M) {
        this.$message.error("上传文件大小不能超过 2MB!");
      }
      return isLt2M;
    },
    handleExcelChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.stepNum = 1;
    },
    handleRemove() {
      this.stepNum = 0;
      this.uploadFilePath = "";
      this.headerForm = {
        title: "",
        author: "",
        pubdate: "",
        press: "",
        price: "",
        flhao: "",
        catagory: "",
        isbn: "",
        language: "",
        recommendReason: ""
      };
    },
    uploadExcelFile(params) {
      this.uploadingExcel = true;
      let formData = new FormData();
      formData.append("excel", params.file);
      excelUpload(formData)
        .then(res => {
          this.$message.success(res.message);
          this.uploadFilePath = res.data.path;
          this.headerOptions = res.data.head.map(item => {
            return {
              label: item,
              value: item
            };
          });
          // 重置选中的选项
          this.headerForm = {
            title: "",
            author: "",
            pubdate: "",
            press: "",
            price: "",
            flhao: "",
            catagory: "",
            isbn: "",
            language: "",
            recommendReason: ""
          };
          this.stepNum = 2;
        })
        .finally(() => {
          this.uploadingExcel = false;
        });
    },
    createTable() {
      this.savingTableName = true;
      updateYunBook({
        id: this.currentTableID,
        tableName: this.tableAddForm.tableName,
        tableDescribe: this.tableAddForm.tableDescribe
      })
        .then(() => {
          let tempId = new Date().getTime(); // 用于获取 socket 数据
          // 获取上传进度
          const socket = new SockJS(`${YUNBOOK_URL}/socket`); // eslint-disable-line
          const stompClient = Stomp.over(socket); // eslint-disable-line
          stompClient.debug = null;
          stompClient.connect({}, () => {
            let subscription = stompClient.subscribe(
              `/queue/excel/${tempId}`,
              data => {
                this.showImportProgress = true;
                let countData = JSON.parse(data.body).data;
                this.countData = {
                  already: countData.already,
                  all: countData.all
                };
                this.uploadTabelPercent = Number(
                  ((countData.already * 100) / countData.all).toFixed(2)
                );
                if (this.uploadTabelPercent < 100) {
                  this.showUploadResult = true;
                } else {
                  subscription.unsubscribe();
                  this.showUploadResult = false;
                }
              }
            );
            bookImport({
              path: this.uploadFilePath,
              flag:
                this.currentTableMode === "edit" ? this.tableAddForm.flag : "",
              tableName: this.tableAddForm.tableName,
              tableDescribe: this.tableAddForm.tableDescribe,
              ...this.headerForm,
              pageId: tempId
            })
              .then(res => {
                if (this.tableAddForm.flag === 2) {
                  // 删除图书模式
                  this.removeTableResult = res.data;
                } else {
                  this.removeTableResult = "";
                  this.$message.success(res.message);
                }
                this.stepNum = 3;
                this.$refs["excelUpload"].clearFiles();
                this.initSKList();
              })
              .catch(() => {
                // 导入失败
                this.showImportProgress = false;
              })
              .finally(() => {
                this.savingTableName = false;
              });
          });
        })
        .catch(() => {
          this.savingTableName = false;
        });
    },
    createTabelVisible() {
      this.currentTableMode = "add";
      this.currentTableID = "";
      this.showAddTable = true;
      this.$nextTick(() => {
        // 如果打开的时候已经完成导入，重置导入界面
        if (!this.showUploadResult) {
          this.reUpload();
        }
      });
    },
    resetTableAddForm() {
      this.tableAddForm = {
        flag: 0,
        tableName: "",
        tableDescribe: ""
      };
      this.$nextTick(() => {
        this.$refs["tableAddForm"].resetFields();
        this.$refs["excelUpload"].clearFiles();
      });
    },
    initSKList() {
      this.currentSKListPage = 1;
      this.requestObj = {};
      this.requestObj[this.currentFilterKey] = this.currentFilterVal;
      this.getSKList();
    },
    getSKList() {
      this.loadSKListData = true;
      searchYunBook({
        pageNumber: this.currentSKListPage,
        pageSize: this.skListPageSize,
        ...this.requestObj
      })
        .then(res => {
          this.skList = res.data.dataList;
          this.totalSKListCount = +res.data.totalElements;
        })
        .finally(() => {
          this.loadSKListData = false;
        });
    },
    handleJgSizeChange(val) {
      this.skListPageSize = val;
      this.getSKList();
    },
    handleJgCurrentChange(val) {
      this.currentSKListPage = val;
      this.getSKList();
    },
    handleEditTable(id, index, data) {
      if (this.showUploadResult) {
        this.$message.warning("还有正在导入中的书库，请稍后尝试");
        return;
      }
      this.currentTableMode = "edit";
      this.currentTableID = id;
      this.showAddTable = true;
      this.$nextTick(() => {
        // 走到这里肯定是导入完成的，所以重置上传组件
        this.reUpload();
        setTimeout(() => {
          this.tableAddForm = {
            tableName: data.tableName,
            tableDescribe: data.tableDescribe,
            flag: 0
          };
        }, 0);
      });
    },
    handleDelJg(ids) {
      if (!ids && this.multipleSKSelection.length > 1) {
        this.$message.warning("一次只能删除一个书库");
        return;
      }
      const h = this.$createElement;
      this.$msgbox({
        title: "删除云书库",
        message: h("div", null, [
          h("p", null, "书库中图书即将全部删除，无法恢复！请慎重操作 "),
          h(
            "p",
            { style: "color: #999" },
            "当前展示该书库的成员馆，即将展示京东默认书库"
          )
        ]),
        showCancelButton: true,
        confirmButtonText: "确认删除",
        cancelButtonText: "取消"
      }).then(() => {
        this.loadSKListData = true;
        delYunBook({
          id: ids ? ids : this.multipleSKSelection.join()
        })
          .then(res => {
            this.loadSKListData = false;
            this.$message({
              type: "success",
              message: res.message
            });
            this.initSKList();
          })
          .catch(() => {
            this.loadSKListData = false;
          });
      });
    },
    skListRowClick(row) {
      if (row.tableName === "JD") {
        return;
      }
      this.$refs["skListTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      if (row.tableName === "JD") {
        return;
      }
      this.checkJgDetail("", "", row);
    },
    handleSelectable(row) {
      if (row.tableName === "JD") {
        return false;
      }
      return true;
    },
    handleSelectionChange(val) {
      this.multipleSKSelection = val.map(item => item.id);
    },
    checkJgDetail(id, index, data) {
      this.$router.push({
        name: "opera_yts",
        params: {
          name: data.tableDescribe
        }
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "tableAddForm") {
            if (!this.uploadFilePath) {
              this.$message.error("请先导入书库文件");
              return;
            }
            if (this.headerForm.isbn === "") {
              this.$message.error("ISBN Excel对应字段 未选择");
              return;
            }
            if (this.headerForm.title === "") {
              this.$message.error("正题名 Excel对应字段 未选择");
              return;
            }
            this.createTable();
          }
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.initSKList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .item__category .el-form-item__label {
  flex: 0 0 100px;
}
</style>
