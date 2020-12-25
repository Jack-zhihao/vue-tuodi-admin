<!--
 * @labelription: MARC类型
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-09 17:57:12
 -->

<template>
  <div class="set-marclx common__content">
    <td-content-header>
      MARC类型管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddMarclx"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMarclxSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteMarclx('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
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
            v-model="currentMarclxFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in marclxFilterOptions"
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
            v-model="marclxSearchKey"
            placeholder="请输入搜索关键词"
            ref="focusInput"
            @keydown.enter.native="initMarclxList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initMarclxList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="marclxTable">
        <el-table
          v-loading="loadMarclxData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleMarclxSelectionChange"
          border
          :data="marclxList"
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
            show-overflow-tooltip
            prop="leixing"
            label="MARC类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="附注说明">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jljsfu"
            label="记录结束符输出字符"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdjsfu"
            label="字段结束符输出字符"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zzdbsfu"
            label="子字段标识符输出字符"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.marclxid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkMarclxDetail"
                @handleDel="deleteMarclx"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleMarclxSizeChange"
          @current-change="handleMarclxCurrentChange"
          :total="totalMarclxCount"
          :currentPage="currentMarclxPage"
          :pageSize="marclxPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增marc类型 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增MARC类型
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marclxAddForm"
          label-width="160px"
          :model="marclxAddForm"
          :rules="marclxFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC类型信息</span>
            </div>
            <el-form-item class="item" prop="leixing" label="M A R C 类型">
              <el-input clearable v-model="marclxAddForm.leixing"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jljsfu" label="记录结束符输出字符">
              <el-input
                maxlength="1"
                clearable
                placeholder="请输入一个字符"
                v-model="marclxAddForm.jljsfu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjsfu" label="字段结束符输出字符">
              <el-input
                clearable
                maxlength="1"
                placeholder="请输入一个字符"
                v-model="marclxAddForm.zdjsfu"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              prop="zzdbsfu"
              label="子字段标识符输出字符"
            >
              <el-input
                clearable
                maxlength="1"
                placeholder="请输入一个字符"
                v-model="marclxAddForm.zzdbsfu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                type="textarea"
                v-model="marclxAddForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marclxAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marclxAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSideCancle">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑MARC类型 -->
    <side-wrap
      v-loading="loadMarclxDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              MARC类型信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marclxEditForm"
          label-width="160px"
          :model="marclxEditForm"
          :rules="marclxFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC类型信息</span>
            </div>
            <el-form-item class="item" prop="leixing" label="M A R C 类型">
              <el-input clearable v-model="marclxEditForm.leixing"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jljsfu" label="记录结束符输出字符">
              <el-input
                maxlength="1"
                clearable
                placeholder="请输入一个字符"
                v-model="marclxEditForm.jljsfu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjsfu" label="字段结束符输出字符">
              <el-input
                clearable
                maxlength="1"
                placeholder="请输入一个字符"
                v-model="marclxEditForm.zdjsfu"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              prop="zzdbsfu"
              label="子字段标识符输出字符"
            >
              <el-input
                clearable
                maxlength="1"
                placeholder="请输入一个字符"
                v-model="marclxEditForm.zzdbsfu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                type="textarea"
                v-model="marclxEditForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marclxEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marclxEditForm')"
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
import {
  sysMarcConfigMarcList,
  sysMarcConfigMarcLxDel,
  sysMarcConfigMarcLxSave,
  sysMarcConfigMarcLxGet
} from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_marclx",
  data() {
    this.marclxFilterOptions = [
      {
        value: "marcLxName",
        label: "MARC类型"
      }
    ];
    this.marclxFormRules = {
      leixing: [
        { required: true, message: "文献类型不能为空", trigger: "blur" }
      ],
      jljsfu: [{ required: true, message: "请输入一个字符", trigger: "blur" }],
      zdjsfu: [{ required: true, message: "请输入一个字符", trigger: "blur" }],
      zzdbsfu: [{ required: true, message: "请输入一个字符", trigger: "blur" }]
    };
    return {
      // 列表相关
      multipleMarclxSelection: [],
      loadMarclxData: false,
      marclxList: [],
      marclxSearchKey: "",
      currentMarclxFilterKey: "marcLxName",
      marclxPageSize: 15,
      currentMarclxPage: 1,
      totalMarclxCount: 0,
      currentMarclxId: "",
      // 新增
      showAddSide: false,
      marclxAddForm: {
        leixing: "",
        fuzhu: "",
        jljsfu: "",
        zdjsfu: "",
        zzdbsfu: ""
      },
      // 编辑
      loadMarclxDetail: false,
      showEditSide: false,
      marclxEditForm: {
        leixing: "",
        fuzhu: "",
        jljsfu: "",
        zdjsfu: "",
        zzdbsfu: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    // 文献列表
    initMarclxList() {
      this.currentMarclxPage = 1;
      this.setRequestObj();
      this.getMarclxList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkMarclxDetail(row.marclxid);
    },
    handleMarclxSelectionChange(val) {
      this.multipleMarclxSelection = val.map(item => item.marclxid);
    },
    checkMarclxDetail(id) {
      this.currentMarclxId = id;
      this.showEditSide = true;
      this.getMarclxDetail();
    },
    deleteMarclx(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarclxData = true;
          sysMarcConfigMarcLxDel({
            marclxids: ids ? ids : this.multipleMarclxSelection.join(",")
          })
            .then(res => {
              this.loadMarclxData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.marclxList.splice(index, 1);
              } else {
                this.initMarclxList();
              }
            })
            .catch(() => {
              this.loadMarclxData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[this.currentMarclxFilterKey] = this.marclxSearchKey;
    },
    getMarclxList() {
      this.loadMarclxData = true;

      let requestObj = {
        pageNumber: this.currentMarclxPage,
        pageSize: this.marclxPageSize,
        ...this.requestObj
      };

      sysMarcConfigMarcList(requestObj)
        .then(res => {
          this.marclxList = res.data.dataList;
          this.totalMarclxCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadMarclxData = false;
        });
    },
    handleMarclxSizeChange(val) {
      this.marclxPageSize = val;
      this.getMarclxList();
    },
    handleMarclxCurrentChange(val) {
      this.currentMarclxPage = val;
      this.getMarclxList();
    },
    // 文献新增
    showAddMarclx() {
      this.showAddSide = true;
    },
    // 新增没保存、取消要重置
    showAddSideCancle() {
      this.showAddSide = false;
      this.resetForm("marclxAddForm");
    },
    handleMarclxFormAdd() {
      sysMarcConfigMarcLxSave({
        leixing: this.marclxAddForm.leixing,
        fuzhu: this.marclxAddForm.fuzhu,
        jljsfu: this.marclxAddForm.jljsfu,
        zdjsfu: this.marclxAddForm.zdjsfu,
        zzdbsfu: this.marclxAddForm.zzdbsfu
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("marclxAddForm");
        this.showAddSide = false;
        this.initMarclxList();
      });
    },
    // 文献编辑
    getMarclxDetail() {
      this.loadMarclxDetail = true;
      sysMarcConfigMarcLxGet({
        marclxid: this.currentMarclxId
      }).then(res => {
        this.loadMarclxDetail = false;
        this.marclxEditFormOrigin = Object.assign({}, res.data);
        this.marclxEditForm = res.data;
      });
    },
    handleMarclxFormEdit() {
      sysMarcConfigMarcLxSave({
        marclxid: this.currentMarclxId,
        leixing: this.marclxEditForm.leixing,
        fuzhu: this.marclxEditForm.fuzhu,
        jljsfu: this.marclxEditForm.jljsfu,
        zdjsfu: this.marclxEditForm.zdjsfu,
        zzdbsfu: this.marclxEditForm.zzdbsfu
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initMarclxList();
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "marclxEditForm") {
        // 恢复原始数据
        this.marclxEditForm = Object.assign({}, this.marclxEditFormOrigin);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "marclxAddForm") {
            this.handleMarclxFormAdd();
          } else if (formName === "marclxEditForm") {
            this.handleMarclxFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.initMarclxList();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
