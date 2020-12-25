<!--
 * @labelription: 文献类型
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-09 17:52:54
 -->

<template>
  <div class="set-wxlx common__content">
    <td-content-header>
      文献类型管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddLiterature"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteLiterature('')"
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
          <el-table-column show-overflow-tooltip prop="daima" label="类型代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="leixing"
            label="文献类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.wxlxid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkLiteratureDetail"
                @handleDel="deleteLiterature"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增文献 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增文献类型
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="80px"
          :model="literatureAddForm"
          :rules="literatureFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>文献类型信息</span>
            </div>
            <el-form-item class="item" prop="daima" label="类型代码">
              <el-input clearable v-model="literatureAddForm.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="leixing" label="文献类型">
              <el-input
                clearable
                v-model="literatureAddForm.leixing"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="literatureAddForm.libId"
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
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureAddForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('literatureAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSideCancle">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑文献 -->
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
              文献类型信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureEditForm"
          label-width="80px"
          :model="literatureEditForm"
          :rules="literatureFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>文献类型信息</span>
            </div>
            <el-form-item class="item" prop="daima" label="类型代码">
              <el-input clearable v-model="literatureEditForm.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="leixing" label="文献类型">
              <el-input
                clearable
                v-model="literatureEditForm.leixing"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="literatureEditForm.libId"
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
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureEditForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('literatureEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm')"
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
  sysMarcConfigWxlxList,
  sysMarcConfigWxlxDel,
  sysMarcConfigWxlxSave,
  sysMarcConfigWxlxGet
} from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_wxlx",
  data() {
    this.literatureFilterOptions = [
      {
        value: "wxLxCode",
        label: "类型代码"
      },
      {
        value: "wxLxName",
        label: "文献类型"
      }
    ];
    this.literatureFormRules = {
      daima: [{ required: true, message: "类型代码不能为空", trigger: "blur" }],
      leixing: [
        { required: true, message: "文献类型不能为空", trigger: "blur" }
      ],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }]
    };
    return {
      // 列表相关
      multipleLiteratureSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "wxLxCode",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      currentLiteratureId: "",
      // 新增
      showAddSide: false,
      literatureAddForm: {
        daima: "",
        leixing: "",
        libId: "",
        fuzhu: ""
      },
      // 编辑
      loadLiteratureDetail: false,
      showEditSide: false,
      literatureEditForm: {
        daima: "",
        leixing: "",
        libId: "",
        fuzhu: ""
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
      this.checkLiteratureDetail(row.wxlxid);
    },
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.wxlxid);
    },
    checkLiteratureDetail(id) {
      this.currentLiteratureId = id;
      this.showEditSide = true;
      this.getLiteratureDetail();
    },
    deleteLiterature(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadLiteratureData = true;
          sysMarcConfigWxlxDel({
            wxlxids: ids ? ids : this.multipleLiteratureSelection.join(",")
          })
            .then(res => {
              this.loadLiteratureData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.literatureList.splice(index, 1);
              } else {
                this.initLiteratureList();
              }
            })
            .catch(() => {
              this.loadLiteratureData = false;
            });
        })
        .catch(() => {});
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
        ...this.requestObj
      };

      sysMarcConfigWxlxList(requestObj)
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
    // 文献新增
    showAddLiterature() {
      this.showAddSide = true;
    },
    // 新增没保存、取消要重置
    showAddSideCancle() {
      this.showAddSide = false;
      this.resetForm("literatureAddForm");
    },
    handleLiteratureFormAdd() {
      sysMarcConfigWxlxSave({
        leixing: this.literatureAddForm.leixing,
        daima: this.literatureAddForm.daima,
        fuzhu: this.literatureAddForm.fuzhu,
        libId: this.literatureAddForm.libId
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("literatureAddForm");
        this.showAddSide = false;
        this.initLiteratureList();
      });
    },
    // 文献编辑
    getLiteratureDetail() {
      this.loadLiteratureDetail = true;
      sysMarcConfigWxlxGet({
        wxlxid: this.currentLiteratureId
      }).then(res => {
        this.loadLiteratureDetail = false;
        this.literatureEditFormOrigin = Object.assign({}, res.data); // 备份原始数据
        this.literatureEditForm = res.data;
      });
    },
    handleLiteratureFormEdit() {
      sysMarcConfigWxlxSave({
        wxlxid: this.currentLiteratureId,
        leixing: this.literatureEditForm.leixing,
        daima: this.literatureEditForm.daima,
        fuzhu: this.literatureEditForm.fuzhu,
        libId: this.literatureEditForm.libId
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initLiteratureList();
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "literatureEditForm") {
        // 恢复原始数据
        this.literatureEditForm = Object.assign(
          {},
          this.literatureEditFormOrigin
        );
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "literatureAddForm") {
            this.handleLiteratureFormAdd();
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.initLiteratureList();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item {
  height: 28px;
}
</style>
