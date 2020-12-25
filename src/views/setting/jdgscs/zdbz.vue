<!--
 * @Description: 字段模板配置
 * @Date: 2020-02-25 11:38:46
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 15:52:18
 -->

<template>
  <div class="set-zdmbpz common__content">
    <td-content-header>
      字段帮助
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowAddField">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            :disabled="multipleFieldItemSelection.length === 0"
            size="mini"
            type="primary"
            @click="handleDeleteFieldItem('')"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
            <span v-show="multipleFieldItemSelection.length"
              >({{ multipleFieldItemSelection.length }})</span
            >
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <!-- 定长字段 -->
      <div class="content__header">
        <div class="header__line">
          <p class="desc">MARC类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="marcType"
            placeholder="请选择MARC类型"
            @change="changeMarcType"
          >
            <el-option
              v-for="item in marcTypeOptions"
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
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initFieldListData"
          ></el-input>
          <el-button type="primary" size="mini" @click="initFieldListData">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div
        class="content__table"
        style="height:calc(60% - 33px - 32px);"
        ref="dataTable"
      >
        <el-table
          v-loading="loadingFieldData"
          ref="fieldTable"
          border
          @row-dblclick="handleShowEditField"
          @selection-change="handleFieldSelectionChange"
          :data="fieldList"
          stripe
          style="width: 100%;"
          height="100%"
          highlight-current-row
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop=""
            width="100"
            label="字段标识符"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="字段名称">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="指示符1">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="指示符2">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="是否定长">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="分编必备">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="可重复">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="总长度">
          </el-table-column>

          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.fieldId"
                :ops="['edit', 'del']"
                @handleDel="handleDeleteFieldItem(scope.row)"
                @handleEdit="handleShowEditField(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleFieldSizeChange"
          @current-change="handleFieldCurrentChange"
          :total="totalFieldDataCount"
          :currentPage="currentFieldPage"
          :pageSize="fieldPageSize"
        ></td-pagination>
      </div>

      <!-- 分段设置 -->
      <td-content-header>
        子字段
        <template v-slot:btns>
          <div class="header__ops">
            <el-button
              size="mini"
              type="primary"
              @click="handleShowAddSubField"
            >
              <icon-svg icon-class="icon-btn-ico-" />新增
            </el-button>
            <el-button
              :disabled="multipleSubFieldItemSelection.length === 0"
              size="mini"
              type="primary"
              @click="handleDeleteSubFieldItem('')"
            >
              <icon-svg icon-class="icon-btn-ico-1" />删除
              <span v-show="multipleSubFieldItemSelection.length"
                >({{ multipleSubFieldItemSelection.length }})</span
              >
            </el-button>
          </div>
        </template>
      </td-content-header>
      <div
        class="content__table"
        style="height:calc(40% - 36px - 33px);"
        ref="dataTable"
      >
        <el-table
          v-loading="loadSubFieldData"
          ref="subFieldTable"
          border
          @row-dblclick="handleShowEditSubField"
          @selection-change="handleSubFieldSelectionChange"
          :data="subFieldData"
          stripe
          style="width: 100%;"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop=""
            label="子字段标识符"
            width="100"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop=""
            label="子字段名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop=""
            label="长度"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="分编必备">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="可重复">
          </el-table-column>

          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.subFieldId"
                :ops="['edit', 'del']"
                @handleDel="handleDeleteSubFieldItem(scope.row)"
                @handleEdit="handleShowEditSubField(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleFieldSizeChange_son"
          @current-change="handleFieldCurrentChange_son"
          :total="totalFieldDataCount_son"
          :currentPage="currentFieldPage_son"
          :pageSize="fieldPageSize_son"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增编辑字段 -->
    <side-wrap
      class="common__side_form"
      v-show="showFieldEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              {{
                fieldEditSideMode === "add" ? "新增MARC字段" : "编辑MARC字段"
              }}
            </div>
          </div>
          <i class="el-icon-close" @click="showFieldEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="fieldEditForm"
          label-width="130px"
          :model="fieldEditForm"
          :rules="fieldEditFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>字段信息</span>
            </div>
            <el-form-item class="item" prop="invariantField" label="字段标识符">
              <el-input
                clearable
                maxlength="3"
                minlength="3"
                placeholder="3位数字"
                v-model="fieldEditForm.invariantField"
                ref="invariantField"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="invariantState_1" label="指示符1">
              <el-input
                clearable
                placeholder="请输入"
                v-model="fieldEditForm.invariantState_1"
                ref="invariantState_1"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdName" label="字段名称">
              <el-input
                clearable
                placeholder="请输入"
                v-model="fieldEditForm.zdName"
                ref="zdName"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="invariantState_2" label="指示符2">
              <el-input
                clearable
                placeholder="请输入"
                v-model="fieldEditForm.invariantState_2"
                ref="invariantState_2"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__line" label="其他设置" style="">
              <el-checkbox-group v-model="fieldEditForm.setList">
                <el-checkbox label="定长字段"></el-checkbox>
                <el-checkbox label="分编必备"></el-checkbox>
                <el-checkbox label="可重复"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item class="item" prop="totalLength" label="总长度">
              <el-input
                :disabled="!setList.includes('定长字段')"
                clearable
                placeholder="请输入"
                v-model="fieldEditForm.totalLength"
                ref="totalLength"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item label="帮助信息" class="item line">
              <el-input
                type="textarea"
                placeholder="请输入内容"
                v-model="fieldEditForm.textarea"
              >
              </el-input>
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
              @click="submitForm('fieldEditForm')"
              type="primary"
              :loading="savingFieldData"
              >保存</el-button
            >
            <el-button size="mini" @click="showFieldEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 新增编辑子字段字段 -->
    <side-wrap
      class="common__side_form"
      v-show="showSubFieldEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              {{
                subFieldEditSideMode === "add"
                  ? "新增MARC子字段"
                  : "编辑MARC子字段"
              }}
            </div>
          </div>
          <i class="el-icon-close" @click="showSubFieldEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="subFieldEditForm"
          label-width="100px"
          :model="subFieldEditForm"
          size="mini"
          :rules="subFieldEditFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>子字段信息</span>
            </div>
            <el-form-item class="item" prop="subField_son" label="子字段标识符">
              <el-input
                clearable
                placeholder="1个字符"
                v-model="subFieldEditForm.subField_son"
                ref="subField_son"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>

            <el-form-item class="item" prop="subFieldName" label="子字段名称">
              <el-input
                clearable
                placeholder="请输入"
                v-model="subFieldEditForm.subFieldName"
                ref="subFieldName"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>

            <el-form-item class="item" prop="length" label="长度">
              <el-input
                clearable
                placeholder="请输入"
                v-model="subFieldEditForm.length"
                ref="length"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>

            <el-form-item class="item" prop="subFieldSet" label="其他设置">
              <el-checkbox-group v-model="subFieldEditForm.setList_son">
                <el-checkbox label="分编必备"></el-checkbox>
                <el-checkbox label="可重复"></el-checkbox>
              </el-checkbox-group>
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
              @click="submitForm('subFieldEditForm')"
              type="primary"
              :loading="savingSubFieldData"
              >保存</el-button
            >
            <el-button size="mini" @click="showSubFieldEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {} from "api/setting";

export default {
  name: "set_zdbz",

  data() {
    let reg1 = /^\d{3}$/; // 三位为数字
    let validateItem = (rule, value, callback) => {
      if (value.length != 3) {
        callback(new Error("请输入3字符!"));
      } else if (!reg1.test(value)) {
        callback(new Error("三位必须是数字！"));
      } else {
        callback();
      }
    };
    this.fieldEditFormRules = {
      invariantField: [
        {
          min: 3,
          max: 3,
          validator: validateItem,
          required: true,
          trigger: "blur"
        }
      ],
      zdName: [{ required: true, message: "字段名称不能为空", trigger: "blur" }]
      // totalLength: [
      //   { required: true, message: "定长字段说明不能为空", trigger: "blur" }
      // ],
    };

    let regSubField = /^[A-Za-z0-9]{1}$/;
    let validateSON = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("子字段标识符不能为空!"));
      } else if (value.length > 1) {
        callback(new Error("必须是1位数字或字母！"));
      } else if (!regSubField.test(value)) {
        callback(new Error("必须是1位数字或字母！"));
      } else {
        callback();
      }
    };
    this.subFieldEditFormRules = {
      subField_son: [
        {
          required: true,
          validator: validateSON,
          trigger: "blur"
        }
      ],
      subFieldName: [
        {
          required: true,
          message: "子字段名称不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      currentFilterKey: "字段标识符",
      literatureFilterOptions: [
        { label: "字段标识符", value: "字段标识符" },
        { label: "字段名称", value: "字段名称" }
      ],
      literatureSearchKey: "",
      setList: ["定长字段", "分编必备", "可重复"],
      // ==============
      // 字段列表
      marcType: "",
      marcTypeOptions: [],
      multipleFieldItemSelection: [],
      loadingFieldData: false,
      fieldList: [],
      totalFieldDataCount: 0,
      currentFieldPage: 1,
      fieldPageSize: 15,
      totalFieldDataCount_son: 0,
      currentFieldPage_son: 1,
      fieldPageSize_son: 15,
      // 字段编辑
      fieldEditSideMode: "add",
      showFieldEditSide: false,
      fieldEditForm: {
        invariantField: "",
        invariantState_1: "",
        zdName: "",
        invariantState_2: "",
        setList: [],
        totalLength: "",
        textarea: ""
      },
      savingFieldData: false,
      // 分段列表
      loadSubFieldData: false,
      subFieldData: [],
      multipleSubFieldItemSelection: [],
      // 分段编辑
      showSubFieldEditSide: false,
      subFieldEditSideMode: "add",
      subFieldEditForm: {
        subField_son: "",
        subFieldName: "",
        length: "",
        setList_son: []
      },
      savingSubFieldData: false
    };
  },
  created() {
    this.initFieldListData();
  },
  activated() {},
  methods: {
    initFieldListData() {
      this.currentFieldPage = 1;
      this.getFieldListData();
    },
    getFieldListData() {
      // this.loadingFieldData = true;
      // marcConfigInvFieldList({
      //   marcLxId: this.marcType,
      //   pageNumber: this.currentFieldPage,
      //   pageSize: this.fieldPageSize
      // })
      //   .then(res => {
      //     this.fieldList = res.data.dataList;
      //     this.totalFieldDataCount = Number(res.data.totalElements);
      //     this.$nextTick(() => {
      //       this.fieldList[0] &&
      //         this.$refs.fieldTable.setCurrentRow(this.fieldList[0]);
      //     });
      //   })
      //   .finally(() => (this.loadingFieldData = false));
    },
    changeMarcType() {
      this.initFieldListData();
    },

    handleFieldSizeChange(val) {
      this.fieldPageSize = val;
      this.getFieldListData();
    },
    handleFieldCurrentChange(val) {
      this.currentFieldPage = val;
      this.getFieldListData();
    },
    handleFieldSizeChange_son() {},
    handleFieldCurrentChange_son() {},

    handleShowEditField(row) {
      this.fieldEditSideMode = "edit";
      // 回显数据

      this.currentFieldId = row.fieldId;

      this.showFieldEditSide = true;
    },
    handleShowAddField() {
      this.fieldEditSideMode = "add";

      this.showFieldEditSide = true;
    },
    handleFieldSelectionChange(val) {
      this.multipleFieldItemSelection = val.map(item => item.fieldId);
    },
    handleDeleteFieldItem(row) {
      this.$confirm(
        row.ids
          ? `确定删除【${row.name}】吗？`
          : `确定删除 ${this.multipleFieldItemSelection.length} 条定长字段吗？`,
        "删除字段示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadingFieldData = true;
          // deleteMarcConfigInvField({
          //   fieldIds: row.ids
          //     ? row.ids
          //     : this.multipleFieldItemSelection.join(",")
          // })
          //   .then(res => {
          //     this.$message({
          //       type: "success",
          //       message: res.message
          //     });
          //     this.initFieldListData();
          //   })
          //   .catch(() => {
          //     this.loadingFieldData = false;
          //   });
        })
        .catch(() => {});
    },

    handleShowAddSubField() {
      this.subFieldEditSideMode = "add";

      this.showSubFieldEditSide = true;
    },
    handleShowEditSubField(row) {
      this.subFieldEditSideMode = "edit";
      this.currentSubFieldId = row.subFieldId;

      this.showSubFieldEditSide = true;
    },

    handleDeleteSubFieldItem(row) {
      this.$confirm(
        row.ids
          ? `确定删除${row.name}吗？`
          : `确定删除 ${
              this.multipleSubFieldItemSelection.length
            } 条分段设置数据吗？`,
        "删除MARC子字段",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadSubFieldData = true;
          // delMarcConfigInvSubField({
          //   subFieldIds: row.ids
          //     ? row.ids
          //     : this.multipleSubFieldItemSelection.join(",")
          // })
          //   .then(res => {
          //     this.$message({
          //       type: "success",
          //       message: res.message
          //     });
          //   })
          //   .catch(() => {
          //     this.loadSubFieldData = false;
          //   });
        })
        .catch(() => {});
    },
    handleSubFieldSelectionChange(val) {
      this.multipleSubFieldItemSelection = val.map(item => item.subFieldId);
    },

    // 表单通用
    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          if (formName === "fieldEditForm") {
            // 保存字段
          } else if (formName === "subFieldEditForm") {
            // 保存子字段
          }
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~styles/commonContent.less";
@import "~styles/commonStyle.less";
</style>
