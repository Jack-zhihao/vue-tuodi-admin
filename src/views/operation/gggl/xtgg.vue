<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 09:30:12
 -->

<template>
  <div class="xtgg common__content">
    <td-content-header>
      系统公告
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
          <p class="label">发布馆：</p>
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
          <p class="label">操作时间：</p>
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
          <el-table-column
            prop="mainLibName"
            show-overflow-tooltip
            label="发布馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sysNoticeTitle"
            label="公告标题"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sysNoticePV"
            label="浏览量"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="sysNoticeNote"
            label="备注"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="操作人"
            width="100"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="sysNoticeOptime"
            label="操作时间"
            width="180"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="100"
          >
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
              >
                <template v-slot:menus>
                  <div v-if="scope.row.sysNoticeZtai == '0'">
                    <div class="menu" @click="upStatus(1, scope.row)">
                      发布
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

    <!-- 新增活动 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增公告
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
              <span>公告信息</span>
            </div>
            <el-form-item class="item" label="发布馆">
              <el-select
                filterable
                v-model="literatureAddForm.sysNoticeMainLibId"
                placeholder="请选择"
                disabled
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

            <el-form-item></el-form-item>

            <el-form-item class="item" label="通知馆">
              <el-select
                filterable
                v-model="literatureAddForm.affiliateLibs"
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
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="sysNoticeTitle" label="公告标题">
              <el-input
                clearable
                v-model="literatureAddForm.sysNoticeTitle"
              ></el-input>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" label="公告内容" prop="sysNoticeContent">
              <editor-bar
                v-model="literatureAddForm.editor.sysNoticeContent"
                :isClear="literatureAddForm.isClear"
                @blur="editorblurAdd"
              ></editor-bar>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="备注" style="flex:0 0 100%">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入备注"
                v-model="literatureAddForm.sysNoticeNote"
                clearable
                style="width:330%"
              >
              </el-input>
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
              @click="submitForm('literatureAddForm', '0')"
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm', '1')"
              type="primary"
              >发布</el-button
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
              编辑公告
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
              <span>公告信息</span>
            </div>
            <el-form-item class="item" label="发布馆">
              <el-select
                filterable
                v-model="literatureEditForm.sysNoticeMainLibId"
                placeholder="请选择"
                disabled
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

            <el-form-item></el-form-item>

            <el-form-item class="item" label="通知馆">
              <el-select
                filterable
                v-model="literatureEditForm.affiliateLibs"
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
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="sysNoticeTitle" label="公告标题">
              <el-input
                clearable
                v-model="literatureEditForm.sysNoticeTitle"
              ></el-input>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" label="公告内容" prop="sysNoticeContent">
              <editor-bar
                v-model="literatureEditForm.editor.sysNoticeContent"
                :isClear="literatureEditForm.isClear"
                @blur="editorblurEdit"
              ></editor-bar>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" label="备注" style="flex:0 0 100%">
              <el-input
                type="textarea"
                autosize
                placeholder="请输入备注"
                v-model="literatureEditForm.sysNoticeNote"
                clearable
                style="width:330%"
              >
              </el-input>
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
              @click="submitForm('literatureEditForm', '0')"
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm', '1')"
              type="primary"
              >发布</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  searchSystem,
  saveSystemGG,
  systemExpo,
  SystemDel,
  sysZtai
} from "api/operation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import EditorBar from "components/EditorBar";

export default {
  components: {
    EditorBar
  },
  name: "opera_pcqd",
  data() {
    this.literatureFilterOptions = [
      {
        value: "title",
        label: "公告标题"
      },
      {
        value: "username",
        label: "操作人"
      }
    ];

    return {
      // 多选
      multipleLiteratureSelection: [],

      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "title",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",

      // 新增
      showAddSide: false,

      literatureAddForm: {
        sysNoticeMainLibId: this.$store.getters.userInfo.libId,
        affiliateLibs: [],
        isClear: false,
        editor: {
          sysNoticeContent: ""
        },
        sysNoticeTitle: "",
        sysNoticeContent: ""
      },
      literatureEditForm: {
        sysNoticeMainLibId: "",
        affiliateLibs: [],
        isClear: false,
        editor: {
          sysNoticeContent: ""
        },
        sysNoticeContent: "",
        sysNoticeTitle: "",
        sysNoticeId: ""
      },

      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      rules: {
        sysNoticeTitle: [
          { required: true, message: "请填写公告标题", trigger: "blur" }
        ],

        sysNoticeContent: [
          { required: true, message: "请填写公告内容", trigger: "blur" }
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
        start: this.date1,
        end: this.date2
      };

      searchSystem(requestObj)
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
    // 新增
    handleAdd() {
      this.showAddSide = true;
    },

    // 提交接口
    handleLiteratureFormAdd(index) {
      let params = {
        sysNoticeMainLibId: this.literatureAddForm.sysNoticeMainLibId,
        sysNoticeTitle: this.literatureAddForm.sysNoticeTitle,
        sysNoticeContent: this.literatureAddForm.editor.sysNoticeContent,
        sysNoticeNote: this.literatureAddForm.sysNoticeNote,
        sysNoticeZtai: index,
        affiliateLibs: this.literatureAddForm.affiliateLibs.join()
      };
      saveSystemGG(params).then(res => {
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
    handleLiteratureFormEdit(index) {
      let params = {
        sysNoticeMainLibId: this.literatureEditForm.sysNoticeMainLibId,
        sysNoticeTitle: this.literatureEditForm.sysNoticeTitle,
        sysNoticeContent: this.literatureEditForm.editor.sysNoticeContent,
        sysNoticeNote: this.literatureEditForm.sysNoticeNote,
        sysNoticeZtai: index,
        affiliateLibs: this.literatureEditForm.affiliateLibs.join(),
        sysNoticeId: this.literatureEditForm.sysNoticeId
      };
      saveSystemGG(params).then(res => {
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
        this.literatureAddForm.affiliateLibs = [];
        this.literatureAddForm.editor.sysNoticeContent = "";
        this.literatureAddForm.sysNoticeNote = "";
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
        this.literatureEditForm.affiliateLibs = [];
        this.literatureEditForm.editor.sysNoticeContent = "";
        this.literatureEditForm.sysNoticeNote = "";
      }
    },
    // 验证提交校验
    jsYz(formName, index) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过表单验证
          if (formName === "literatureAddForm") {
            this.handleLiteratureFormAdd(index);
            this.showAddSide = false;
            this.$refs["literatureAddForm"].resetFields();
            // 清空表单其余
            this.literatureAddForm.affiliateLibs = [];
            this.literatureAddForm.editor.sysNoticeContent = "";
            this.literatureAddForm.sysNoticeNote = "";
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit(index);
            this.showEditSide = false;
            this.$refs["literatureEditForm"].resetFields();
            // 清空表单其余
            this.literatureEditForm.affiliateLibs = [];
            this.literatureEditForm.editor.sysNoticeContent = "";
            this.literatureEditForm.sysNoticeNote = "";
          }
        } else {
          return false;
        }
      });
    },
    // 保存提交
    submitForm(formName, index) {
      let that = this;
      setTimeout(function() {
        that.jsYz(formName, index);
      }, 100);
    },
    // 编辑活动页面
    editGzsm(row) {
      this.showEditSide = true;
      this.literatureEditForm.sysNoticeMainLibId = row.sysNoticeMainLibId;
      this.literatureEditForm.affiliateLibs = row.affiliateLibs
        ? row.affiliateLibs.split(",")
        : [];
      this.literatureEditForm.sysNoticeTitle = row.sysNoticeTitle;
      this.literatureEditForm.editor.sysNoticeContent = row.sysNoticeContent;
      this.literatureEditForm.sysNoticeNote = row.sysNoticeNote;
      this.literatureEditForm.sysNoticeId = row.sysNoticeId;
      //  消除富文本没填的验证
      this.literatureEditForm.sysNoticeContent = row.sysNoticeContent;
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          SystemDel({ sysNoticeIds: row.sysNoticeId }).then(res => {
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
          SystemDel({
            sysNoticeIds: this.multipleLiteratureSelection.join()
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
      downLoadExcel(systemExpo(), {
        start: this.date1,
        end: this.date2,
        ...this.requestObj
      });
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.sysNoticeId);
    },

    // 切换状态操作
    upStatus(status, row) {
      sysZtai({
        sysNoticeIds: row.sysNoticeId,
        sysNoticeZtai: status
      }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.initLiteratureList();
        }
      });
    },
    editorblurAdd(val) {
      if (val != "<p><br></p>") {
        this.literatureAddForm.sysNoticeContent = val;
      } else {
        // 就是空

        this.literatureAddForm.sysNoticeContent = "";
      }
    },
    editorblurEdit(val) {
      if (val != "<p><br></p>") {
        this.literatureEditForm.sysNoticeContent = val;
      } else {
        // 就是空

        this.literatureEditForm.sysNoticeContent = "";
      }
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
</style>
