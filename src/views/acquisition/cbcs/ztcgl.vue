<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-22 15:19:56
 * @LastEditTime: 2020-03-10 16:51:02
 -->

<template>
  <div class="acq-ztcgl common__content">
    <td-content-header>
      分类主题词管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddSubject"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleSubjectSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteSubject('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
              v-show="multipleSubjectSelection.length"
              >({{ multipleSubjectSelection.length }})</span
            ></el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentSubjectFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in subjectFilterOptions"
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
            v-model="subjectSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initSubjectList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initSubjectList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="subjectTable">
        <el-table
          v-loading="loadSubjectData"
          ref="table"
          @row-click="clickRow"
          @selection-change="handleSubjectSelectionChange"
          border
          :data="subjectList"
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
          <el-table-column show-overflow-tooltip prop="flcode" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="主题词">
            <template slot-scope="scope">
              <span
                @click="
                  checkSubjectDetail(
                    scope.row.ztcflhid,
                    scope.$index,
                    scope.row
                  )
                "
                class="g-row__check"
                >{{ scope.row.ztword }}</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.ztcflhid"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkSubjectDetail"
                @handleDel="deleteSubject(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSubjectSizeChange"
          @current-change="handleSubjectCurrentChange"
          :total="totalSubjectCount"
          :currentPage="currentSubjectPage"
          :pageSize="subjectPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增种次号 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增分类主题词
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="subjectAddForm"
          label-width="90px"
          :model="subjectAddForm"
          :rules="subjectFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>分类主题词信息</span>
            </div>
            <el-form-item class="item" prop="flcode" label="分类号">
              <el-input clearable v-model="subjectAddForm.flcode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ztword" label="主题词">
              <el-input
                v-monitor-split="subjectAddForm.ztword"
                clearable
                v-model="subjectAddForm.ztword"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('subjectAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('subjectAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSide = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑文献 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              编辑分类主题词
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="subjectEditForm"
          label-width="90px"
          :model="subjectEditForm"
          :rules="subjectFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>分类主题词信息</span>
            </div>
            <el-form-item class="item" prop="flcode" label="分类号">
              <el-input clearable v-model="subjectEditForm.flcode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ztword" label="主题词">
              <el-input
                v-monitor-split="subjectEditForm.ztword"
                clearable
                v-model="subjectEditForm.ztword"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('subjectEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              :loading="isSavingData"
              @click="submitForm('subjectEditForm')"
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
import { searchZtcflhao, deleteZtcflhao, saveZtcflhao } from "api/acquisition";

export default {
  name: "acq_ztcgl",
  data() {
    this.subjectFilterOptions = [
      {
        value: "1",
        label: "分类号"
      },
      {
        value: "2",
        label: "主题词"
      }
    ];
    this.subjectFormRules = {
      flcode: [{ required: true, message: "分类号不能为空", trigger: "blur" }],
      ztword: [{ required: true, message: "主题词不能为空", trigger: "blur" }]
    };
    this.subjectAddFormTemp = {
      flcode: "",
      ztword: ""
    };
    return {
      // 列表相关
      multipleSubjectSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadSubjectData: false,
      subjectList: [],
      subjectSearchKey: "",
      currentSubjectFilterKey: "1",
      subjectPageSize: 15,
      currentSubjectPage: 1,
      totalSubjectCount: 0,
      currentSubjectId: "",
      // 新增
      showAddSide: false,
      subjectAddForm: {
        flcode: "",
        ztword: ""
      },
      // 编辑
      showEditSide: false,
      isSavingData: false,
      subjectEditForm: {
        flcode: "",
        ztword: ""
      }
    };
  },
  methods: {
    // 文献列表
    initSubjectList() {
      this.currentSubjectPage = 1;
      this.setRequestObj();
      this.getSubjectList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleSubjectSelectionChange(val) {
      this.multipleSubjectSelection = val.map(item => item.ztcflhid);
    },
    checkSubjectDetail(id, index, data) {
      this.currentSubjectId = id;
      this.showEditSide = true;

      this.subjectEditFormOrigin = Object.assign({}, data); // 备份原始数据
      this.subjectEditForm = data;
    },
    deleteSubject(row) {
      this.$confirm(
        row.ztcflhid
          ? `确定要删除分类号【${row.flcode}】的主题词数据吗?`
          : `确定要删除${this.multipleSubjectSelection.length}条数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadSubjectData = true;
          deleteZtcflhao({
            ztcflhids: row.ztcflhid
              ? row.ztcflhid
              : this.multipleSubjectSelection.join(",")
          })
            .then(res => {
              this.loadSubjectData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initSubjectList();
            })
            .catch(() => {
              this.loadSubjectData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.currentSubjectFilterKey,
        content: this.subjectSearchKey
      };
    },
    getSubjectList() {
      this.loadSubjectData = true;

      let requestObj = {
        pageNumber: this.currentSubjectPage,
        pageSize: this.subjectPageSize,
        ...this.requestObj
      };

      searchZtcflhao(requestObj)
        .then(res => {
          this.loadSubjectData = false;
          this.subjectList = res.data.dataList;
          this.totalSubjectCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadSubjectData = false;
        });
    },
    handleSubjectSizeChange(val) {
      this.subjectPageSize = val;
      this.getSubjectList();
    },
    handleSubjectCurrentChange(val) {
      this.currentSubjectPage = val;
      this.getSubjectList();
    },
    // 文献新增
    showAddSubject() {
      this.showAddSide = true;
      this.$nextTick(() => {
        this.resetForm("subjectAddForm");
      });
    },
    handleSubjectFormAdd() {
      saveZtcflhao({
        flcode: this.subjectAddForm.flcode,
        ztword: this.subjectAddForm.ztword
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("subjectAddForm");
        this.showAddSide = false;
        this.initSubjectList();
      });
    },
    // 文献编辑
    handleSubjectFormEdit() {
      this.isSavingData = true;
      saveZtcflhao({
        ztcflhid: this.currentSubjectId,
        flcode: this.subjectEditForm.flcode,
        ztword: this.subjectEditForm.ztword
      })
        .then(res => {
          this.$message.success(res.message);
          this.showEditSide = false;
          this.initSubjectList();
        })
        .finally(() => {
          this.isSavingData = false;
        });
    },
    // 通用
    resetForm(formName) {
      if (formName === "subjectEditForm") {
        // 恢复原始数据
        this.subjectEditForm = Object.assign({}, this.subjectEditFormOrigin);
      } else {
        this.subjectAddForm = Object.assign({}, this.subjectAddFormTemp);
      }
      this.$refs[formName].clearValidate();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "subjectAddForm") {
            this.handleSubjectFormAdd();
          } else if (formName === "subjectEditForm") {
            this.handleSubjectFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
