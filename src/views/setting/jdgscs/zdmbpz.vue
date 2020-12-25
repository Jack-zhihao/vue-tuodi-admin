<!--
 * @Description: 字段模板配置
 * @Date: 2020-02-25 11:38:46
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 14:37:02
 -->

<template>
  <div class="set-zdmbpz common__content">
    <td-content-header>
      定长字段
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
          <p class="label">MARC类型：</p>
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
          @current-change="currentFieldRowChange"
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
            prop="invariantField"
            width="100"
            label="定长字段参数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="invariantState"
            label="定长字段说明"
          >
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.fieldId"
                :ops="['edit', 'del']"
                @handleDel="handleDeleteFieldItem"
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
        分段设置
        <template v-slot:btns>
          <div class="header__ops">
            <el-button
              size="mini"
              type="primary"
              @click="handleShowAddSubField"
            >
              <icon-svg icon-class="icon-btn-ico-" />添加
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
        style="height:calc(40% - 36px);"
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
            type="index"
            label=" "
            align="center"
            width="30"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="subFieldName"
            label="分段名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="subFieldLength"
            label="分段长度"
            width="80"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="subFieldDefault"
            label="默认值"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isEmpty"
            label="可为空"
            width="80"
          >
            <template slot-scope="scope">
              {{ scope.row.isEmpty == "1" ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="subFieldType"
            label="分段类型"
          >
            <template slot-scope="scope">
              <span v-show="scope.row.subFieldType === 1">文本框</span>
              <span v-show="scope.row.subFieldType === 2">下拉框</span>
              <span v-show="scope.row.subFieldType === 3">多选框</span>
            </template>
          </el-table-column>
          <el-table-column label="排序" width="70">
            <template slot-scope="scope">
              <i
                v-show="scope.$index !== 0"
                title="上移"
                style="fontWeight: bold;fontSize: 16px;padding: 5px;cursor:pointer;color: #378de6;"
                class="el-icon-top"
                @click="moveMarcConfigInvSubField(scope.row.subFieldId, 1)"
              ></i>
              <i
                v-show="scope.$index === 0"
                style="fontSize: 16px;padding: 5px;opacity: 0;"
                class="el-icon-top"
              ></i>
              <i
                v-show="scope.$index !== subFieldData.length - 1"
                title="下移"
                style="fontWeight: bold;fontSize: 16px;padding: 5px;cursor:pointer;color: #378de6;"
                class="el-icon-bottom"
                @click="moveMarcConfigInvSubField(scope.row.subFieldId, 2)"
              ></i>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.subFieldId"
                :ops="['edit', 'del']"
                @handleDel="handleDeleteSubFieldItem"
                @handleEdit="handleShowEditSubField(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 编辑定长字段 -->
    <side-wrap
      class="common__side_form"
      v-show="showFieldEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isFieldAdd" class="tit">新增定长字段</div>
            <div v-else class="tit active">编辑定长字段</div>
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
            <el-form-item
              class="item item__line"
              prop="invariantField"
              label="定长字段参数"
            >
              <el-input
                clearable
                maxlength="4"
                placeholder="3-4个字符，例：100a"
                v-model="fieldEditForm.invariantField"
                ref="focusInput1"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="invariantState"
              label="定长字段说明"
            >
              <el-input
                clearable
                placeholder="请输入定长字段说明"
                v-model="fieldEditForm.invariantState"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('fieldEditForm')"
              >重置</el-button
            >
          </div>
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
    <!-- 编辑分段设置 -->
    <side-wrap
      class="common__side_form"
      v-show="showSubFieldEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isSubsectionAdd" class="tit">添加分段</div>
            <div v-else class="tit active">编辑分段</div>
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
              <span>分段信息</span>
            </div>
            <el-form-item
              class="item item__line"
              prop="subFieldName"
              label="分段名称"
            >
              <el-input
                clearable
                placeholder="例：编目语种"
                v-model="subFieldEditForm.subFieldName"
                ref="focusInput2"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="subFieldLength"
              label="分段长度"
            >
              <el-input
                clearable
                placeholder="例：3"
                v-model="subFieldEditForm.subFieldLength"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="subFieldDefault"
              label="默认值"
            >
              <el-input
                v-if="subFieldEditForm.subFieldType === 1"
                clearable
                placeholder="例：chi"
                v-model="subFieldEditForm.subFieldDefault"
              ></el-input>
              <el-select
                filterable
                v-else
                clearable
                v-model="subFieldEditForm.subFieldDefault"
                placeholder="请选择"
              >
                <el-option
                  v-for="listItem in subFieldEditForm.list"
                  :key="listItem.key"
                  :label="
                    listItem.key ? listItem.key + '-' + listItem.value : ''
                  "
                  :value="listItem.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="subFieldType"
              label="分段类型"
            >
              <el-select
                v-model="subFieldEditForm.subFieldType"
                placeholder="请选择"
              >
                <el-option label="文本框" :value="1"></el-option>
                <el-option label="下拉框" :value="2"></el-option>
                <el-option label="多选框" :value="3"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="isEmpty"
              label="其他设置"
            >
              <el-checkbox
                v-model="subFieldEditForm.isEmpty"
                :true-label="1"
                :false-label="0"
                >可为空</el-checkbox
              >
            </el-form-item>
            <el-form-item
              v-show="subFieldEditForm.subFieldType !== 1"
              class="item item__line"
              prop="list"
              label="数据源"
            >
              <div style="minWidth: 230px;">
                <el-button type="text" @click="addSubFiledItemProp"
                  >添加</el-button
                >
              </div>
              <div
                ref="subFieldList"
                v-for="(item, index) in subFieldEditForm.list"
                :key="index"
              >
                <el-input
                  clearable
                  placeholder="例：chi"
                  v-model="item.key"
                  tag="key"
                  data-key="key"
                  @keyup.enter.native="addSubFiledItemProp"
                ></el-input>
                =
                <el-input
                  clearable
                  placeholder="汉语"
                  v-model="item.value"
                  tag="value"
                  @keyup.enter.native="addSubFiledItemProp"
                ></el-input>
                <el-button
                  tabindex="-1"
                  type="text"
                  style="marginLeft: 5px;"
                  @click="removeSubFieldItemProp(index)"
                  >删除</el-button
                >
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('subFieldEditForm')"
              >重置</el-button
            >
          </div>
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
import {
  sysMarcConfigMarcList,
  marcConfigInvFieldSave,
  marcConfigInvFieldList,
  deleteMarcConfigInvField,
  marcConfigInvSubFieldList,
  marcConfigInvSubFieldSave,
  delMarcConfigInvSubField,
  moveMarcConfigInvSubField
} from "api/setting";

export default {
  name: "set_zdmbpz",
  watch: {
    "subFieldEditForm.list": {
      handler(newVal) {
        if (this.subFieldEditForm.subFieldType === 1) {
          return;
        }
        if (newVal.length === 0) {
          this.subFieldEditForm.subFieldDefault = "";
        }
        this.$refs["subFieldEditForm"].validateField("list");
      },
      deep: true
    }
  },
  data() {
    let reg1 = /^\d{3}$/; // 前三位为数字
    let reg2 = /^\d{3}[0-9a-zA-Z]{1}$/; // 前三位为数字，最后一位是字符串
    let validateItem = (rule, value, callback) => {
      if (value === "" || value.length < 3) {
        callback(new Error("请输入3-4个字符，例：100a"));
      } else if (value.length === 3 && !reg1.test(value)) {
        callback(new Error("前三位需为数字"));
      } else if (value.length === 4 && !reg2.test(value)) {
        callback(new Error("前三位需为数字,第四位[0-9a-zA-Z]"));
      } else {
        callback();
      }
    };
    this.fieldEditFormRules = {
      invariantField: [
        {
          min: 3,
          max: 4,
          validator: validateItem,
          required: true,
          trigger: "blur"
        }
      ],
      invariantState: [
        { required: true, message: "定长字段说明不能为空", trigger: "blur" }
      ]
    };
    const validateSubFieldDefault = (rule, value, callback) => {
      if (
        this.subFieldEditForm.subFieldLength &&
        value.length > this.subFieldEditForm.subFieldLength
      ) {
        callback(new Error("默认值超出分段长度"));
      } else {
        callback();
      }
    };
    const validateSubFieldList = (rule, value, callback) => {
      if (this.subFieldEditForm.subFieldType === 1) {
        callback();
      } else {
        for (let i = 0; i < this.subFieldEditForm.list.length; i++) {
          let item = this.subFieldEditForm.list[i];
          if (item.key === "" || item.value === "") {
            callback(new Error("数据源配置不能有空值"));
            break;
          }
          if (item.key.length > this.subFieldEditForm.subFieldLength) {
            callback(new Error("数据源配置不能超过分段长度"));
            break;
          }
        }
        let keyArr = this.subFieldEditForm.list.map(item => item.key);

        // 重复
        if (keyArr.length > Array.from(new Set([...keyArr])).length) {
          callback(new Error("数据源配置存在重复字段"));
          return;
        }
        callback();
      }
    };
    this.subFieldEditFormRules = {
      subFieldName: [
        {
          required: true,
          message: "分段名称不能为空",
          trigger: "blur"
        }
      ],
      subFieldLength: [
        { required: true, message: "分段长度不能为空", trigger: "blur" },
        {
          pattern: /^[0-9]*$/,
          message: "分段长度只能输入数字",
          trigger: "blur"
        }
      ],
      subFieldDefault: [
        { validator: validateSubFieldDefault, trigger: "blur" }
      ],
      list: [
        {
          validator: validateSubFieldList
        }
      ]
    };
    return {
      // 字段列表
      marcType: "",
      marcTypeOptions: [],
      multipleFieldItemSelection: [],
      loadingFieldData: false,
      fieldList: [],
      totalFieldDataCount: 0,
      currentFieldPage: 1,
      fieldPageSize: 15,
      // 字段编辑
      isFieldAdd: true,
      fieldEditSideMode: "add",
      showFieldEditSide: false,
      fieldEditForm: {
        invariantField: "",
        invariantState: ""
      },
      savingFieldData: false,
      // 分段列表
      loadSubFieldData: false,
      subFieldData: [],
      multipleSubFieldItemSelection: [],
      // 分段编辑
      isSubsectionAdd: true,
      showSubFieldEditSide: false,
      subFieldEditSideMode: "add",
      subFieldEditForm: {
        subFieldName: "",
        subFieldLength: "",
        subFieldDefault: "",
        isEmpty: 1,
        subFieldType: "",
        list: []
      },
      savingSubFieldData: false
    };
  },
  created() {
    this.getMarclxList();
    this.initFieldListData();
  },
  activated() {
    this.getMarclxList();
  },
  methods: {
    // 字段列表
    getMarclxList() {
      sysMarcConfigMarcList({
        pageNumber: 1,
        pageSize: 10
      }).then(res => {
        this.marcTypeOptions = res.data.dataList.map(item => {
          return {
            label: item.leixing,
            value: item.marclxid
          };
        });
        if (!this.marcType && this.marcTypeOptions[0]) {
          this.marcType = this.marcTypeOptions[0].value;
        }
      });
    },
    initFieldListData() {
      this.currentFieldPage = 1;
      this.getFieldListData();
    },
    getFieldListData() {
      this.loadingFieldData = true;
      marcConfigInvFieldList({
        marcLxId: this.marcType,
        pageNumber: this.currentFieldPage,
        pageSize: this.fieldPageSize
      })
        .then(res => {
          this.fieldList = res.data.dataList;
          this.totalFieldDataCount = Number(res.data.totalElements);
          this.$nextTick(() => {
            this.fieldList[0] &&
              this.$refs.fieldTable.setCurrentRow(this.fieldList[0]);
          });
        })
        .finally(() => (this.loadingFieldData = false));
    },
    changeMarcType() {
      this.initFieldListData();
    },
    currentFieldRowChange(row) {
      if (!row) {
        this.subFieldData = [];
        return;
      }
      this.currentFieldId = row.fieldId;
      this.getSubFieldData();
    },
    handleFieldSizeChange(val) {
      this.fieldPageSize = val;
      this.getFieldListData();
    },
    handleFieldCurrentChange(val) {
      this.currentFieldPage = val;
      this.getFieldListData();
    },
    // 字段操作
    marcConfigInvFieldSave() {
      let requestObj = {
        marcLxId: this.marcType,
        invariantField: this.fieldEditForm.invariantField,
        invariantState: this.fieldEditForm.invariantState
      };
      if (this.fieldEditSideMode === "edit") {
        requestObj.fieldId = this.currentFieldId;
      }
      this.savingFieldData = true;
      marcConfigInvFieldSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.showFieldEditSide = false;
          this.initFieldListData();
        })
        .finally(() => {
          this.savingFieldData = false;
        });
    },
    handleShowEditField(row) {
      this.isFieldAdd = false;
      this.fieldEditSideMode = "edit";
      this.fieldEditFormOriginal = {
        invariantField: row.invariantField,
        invariantState: row.invariantState
      };
      this.currentFieldId = row.fieldId;
      this.resetForm("fieldEditForm");
      this.showFieldEditSide = true;
    },
    handleShowAddField() {
      this.isFieldAdd = true;
      let _this = this;
      setTimeout(function() {
        _this.$refs["focusInput1"].focus();
      }, 10);
      this.fieldEditSideMode = "add";
      this.resetForm("fieldEditForm");
      this.showFieldEditSide = true;
    },
    handleFieldSelectionChange(val) {
      this.multipleFieldItemSelection = val.map(item => item.fieldId);
    },
    handleDeleteFieldItem(ids) {
      this.$confirm(
        ids
          ? "确定删除该定长字段吗？"
          : `确定删除 ${this.multipleFieldItemSelection.length} 条定长字段吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadingFieldData = true;
          deleteMarcConfigInvField({
            fieldIds: ids ? ids : this.multipleFieldItemSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initFieldListData();
            })
            .catch(() => {
              this.loadingFieldData = false;
            });
        })
        .catch(() => {});
    },
    // 分段列表
    getSubFieldData() {
      this.loadSubFieldData = true;
      marcConfigInvSubFieldList({
        fieldId: this.currentFieldId
      })
        .then(res => {
          this.subFieldData = res.data;
        })
        .finally(() => (this.loadSubFieldData = false));
    },
    handleShowAddSubField() {
      this.isSubsectionAdd = true;
      let _this = this;
      setTimeout(function() {
        _this.$refs["focusInput2"].focus();
      }, 10);
      this.subFieldEditSideMode = "add";
      this.resetForm("subFieldEditForm");
      this.showSubFieldEditSide = true;
    },
    handleShowEditSubField(row) {
      this.isSubsectionAdd = false;
      this.subFieldEditSideMode = "edit";
      this.currentSubFieldId = row.subFieldId;
      // 注意要深拷贝
      this.subFieldEditFormOriginal = {
        subFieldName: row.subFieldName,
        subFieldLength: row.subFieldLength,
        subFieldDefault: row.subFieldDefault,
        isEmpty: row.isEmpty,
        subFieldType: row.subFieldType,
        list: JSON.parse(JSON.stringify(row.list)) || []
      };
      this.resetForm("subFieldEditForm");
      this.showSubFieldEditSide = true;
    },
    moveMarcConfigInvSubField(subFieldId, type) {
      moveMarcConfigInvSubField({
        subFieldId,
        type
      }).then(res => {
        this.$message.success(res.message);
        this.getSubFieldData();
      });
    },
    handleDeleteSubFieldItem(ids) {
      this.$confirm(
        ids
          ? "确定删除该分段设置数据吗？"
          : `确定删除 ${
              this.multipleSubFieldItemSelection.length
            } 条分段设置数据吗？`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadSubFieldData = true;
          delMarcConfigInvSubField({
            subFieldIds: ids
              ? ids
              : this.multipleSubFieldItemSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getSubFieldData();
            })
            .catch(() => {
              this.loadSubFieldData = false;
            });
        })
        .catch(() => {});
    },
    handleSubFieldSelectionChange(val) {
      this.multipleSubFieldItemSelection = val.map(item => item.subFieldId);
    },
    addSubFiledItemProp() {
      this.subFieldEditForm.list.push({
        key: "",
        value: ""
      });
      this.$nextTick(() => {
        // 找到第一个空白输入框定位
        let index = -1;
        let key = "";
        for (let i = 0; i < this.subFieldEditForm.list.length; i++) {
          let item = this.subFieldEditForm.list[i];
          if (item.key === "") {
            index = i;
            key = "key";
            break;
          }
          if (item.value === "") {
            index = i;
            key = "value";
            break;
          }
        }
        if (index > -1) {
          let matchItem = this.$refs.subFieldList[index].querySelector(
            `input[tag='${key}']`
          );
          matchItem.select();
        }
      });
    },
    removeSubFieldItemProp(index) {
      this.subFieldEditForm.list.splice(index, 1);
    },
    marcConfigInvSubFieldSave() {
      let requestObj = {
        fieldId: this.currentFieldId,
        marcLxId: this.marcType,
        subFieldName: this.subFieldEditForm.subFieldName,
        subFieldLength: this.subFieldEditForm.subFieldLength,
        subFieldDefault: this.subFieldEditForm.subFieldDefault,
        isEmpty: this.subFieldEditForm.isEmpty,
        subFieldType: this.subFieldEditForm.subFieldType,
        list: JSON.stringify(this.subFieldEditForm.list)
      };
      if (this.subFieldEditSideMode === "edit") {
        requestObj.subFieldId = this.currentSubFieldId;
      }
      this.savingSubFieldData = true;
      marcConfigInvSubFieldSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.showSubFieldEditSide = false;
          this.getSubFieldData();
        })
        .finally(() => {
          this.savingSubFieldData = false;
        });
    },
    // 表单通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "fieldEditForm") {
            this.marcConfigInvFieldSave();
          } else if (formName === "subFieldEditForm") {
            this.marcConfigInvSubFieldSave();
          }
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
      if (formName === "fieldEditForm") {
        if (this.fieldEditSideMode === "edit") {
          Object.assign(this.fieldEditForm, this.fieldEditFormOriginal);
        }
      } else if (formName === "subFieldEditForm") {
        if (this.subFieldEditSideMode === "edit") {
          Object.assign(
            this.subFieldEditForm,
            JSON.parse(JSON.stringify(this.subFieldEditFormOriginal))
          );
        }
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
