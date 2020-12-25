<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-22 15:19:56
 * @LastEditTime: 2020-03-10 19:19:56
 -->

<template>
  <div class="acq-zchgl common__content">
    <td-content-header>
      种次号库管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddCategory"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            type="primary"
            :disabled="multipleCategorySelection.length === 0"
            size="mini"
            @click="deleteCategory('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
              v-show="multipleCategorySelection.length"
              >({{ multipleCategorySelection.length }})</span
            ></el-button
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
            v-model="currentCategoryFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in categoryFilterOptions"
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
            v-model="categorySearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initCategoryList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initCategoryList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="categoryTable">
        <el-table
          v-loading="loadCategoryData"
          ref="table"
          @row-click="clickRow"
          @selection-change="handleCategorySelectionChange"
          border
          :data="categoryList"
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
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="最大种次号">
            <template slot-scope="scope">
              <span
                @click="
                  checkCategoryDetail(scope.row.zdid, scope.$index, scope.row)
                "
                class="g-row__check"
                >{{ scope.row.zdzchao }}</span
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="leixing" label="类型">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="用户">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="时间">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.zdid"
                :data="scope.row"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkCategoryDetail"
                @handleDel="deleteCategory(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCategorySizeChange"
          @current-change="handleCategoryCurrentChange"
          :total="totalCategoryCount"
          :currentPage="currentCategoryPage"
          :pageSize="categoryPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增种次号 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增种次号
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="categoryAddForm"
          label-width="90px"
          :model="categoryAddForm"
          :rules="categoryFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>种次号信息</span>
            </div>
            <el-form-item class="item" prop="cygid" label="成员馆">
              <el-select
                filterable
                v-model="categoryAddForm.cygid"
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
            <el-form-item class="item" prop="flhao" label="分类号">
              <el-input clearable v-model="categoryAddForm.flhao"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdzchao" label="最大种次号">
              <el-input clearable v-model="categoryAddForm.zdzchao"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="leixing" label="类型">
              <el-input clearable v-model="categoryAddForm.leixing"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('categoryAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('categoryAddForm')"
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
              种次号信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="categoryEditForm"
          label-width="90px"
          :model="categoryEditForm"
          :rules="categoryFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>种次号信息</span>
            </div>
            <el-form-item class="item" prop="cygid" label="成员馆">
              <el-select
                filterable
                v-model="categoryEditForm.cygid"
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
            <el-form-item class="item" prop="flhao" label="分类号">
              <el-input clearable v-model="categoryEditForm.flhao"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdzchao" label="最大种次号">
              <el-input clearable v-model="categoryEditForm.zdzchao"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="leixing" label="类型">
              <el-input clearable v-model="categoryEditForm.leixing"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('categoryEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('categoryEditForm')"
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
import { searchMaxZch, deleteMaxZchs, saveMaxZch } from "api/acquisition";
import { mapGetters } from "vuex";
export default {
  name: "acq_zchgl",
  data() {
    this.categoryFilterOptions = [
      {
        value: "1",
        label: "分类号"
      },
      {
        value: "2",
        label: "最大种次号"
      }
    ];
    this.categoryFormRules = {
      flhao: [{ required: true, message: "分类号不能为空", trigger: "blur" }],
      zdzchao: [
        { required: true, message: "最大种次号不能为空", trigger: "blur" }
      ],
      leixing: [{ required: true, message: "类型不能为空", trigger: "blur" }]
    };
    this.categoryAddFormTemp = {
      zdzchao: "",
      flhao: "",
      cygid: this.$store.getters.userInfo.libId,
      leixing: ""
    };
    return {
      // 列表相关
      multipleCategorySelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadCategoryData: false,
      categoryList: [],
      categorySearchKey: "",
      currentCategoryFilterKey: "1",
      categoryPageSize: 15,
      currentCategoryPage: 1,
      totalCategoryCount: 0,
      currentZdid: "",
      // 新增
      showAddSide: false,
      categoryAddForm: {
        zdzchao: "",
        flhao: "",
        cygid: this.$store.getters.userInfo.libId,
        leixing: ""
      },
      // 编辑
      showEditSide: false,
      categoryEditForm: {
        zdzchao: "",
        flhao: "",
        cygid: "",
        leixing: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 文献列表
    initCategoryList() {
      this.currentCategoryPage = 1;
      this.setRequestObj();
      this.getCategoryList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleCategorySelectionChange(val) {
      this.multipleCategorySelection = val.map(item => item.zdid);
    },
    checkCategoryDetail(id, index, data) {
      this.currentZdid = id;
      this.showEditSide = true;
      this.categoryEditFormOrigin = Object.assign({}, data); // 备份原始数据
      this.categoryEditForm = data;
    },
    deleteCategory(row) {
      this.$confirm(
        row.zdid
          ? `确定要删除【分类号】${row.flhao}吗?`
          : `确定要删除${this.multipleCategorySelection.length}条数据吗`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadCategoryData = true;
          deleteMaxZchs({
            zdids: row.zdid
              ? row.zdid
              : this.multipleCategorySelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initCategoryList();
            })
            .finally(() => {
              this.loadCategoryData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.currentCategoryFilterKey,
        content: this.categorySearchKey,
        libid: this.selectLibId
      };
    },
    getCategoryList() {
      this.loadCategoryData = true;

      let requestObj = {
        pageNumber: this.currentCategoryPage,
        pageSize: this.categoryPageSize,
        ...this.requestObj
      };

      searchMaxZch(requestObj)
        .then(res => {
          this.categoryList = res.data.dataList;
          this.totalCategoryCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadCategoryData = false;
        });
    },
    handleCategorySizeChange(val) {
      this.categoryPageSize = val;
      this.getCategoryList();
    },
    handleCategoryCurrentChange(val) {
      this.currentCategoryPage = val;
      this.getCategoryList();
    },
    // 文献新增
    showAddCategory() {
      this.showAddSide = true;
      this.$nextTick(() => {
        this.resetForm("categoryAddForm");
      });
    },
    handleCategoryFormAdd() {
      saveMaxZch({
        leixing: this.categoryAddForm.leixing,
        zdzchao: this.categoryAddForm.zdzchao,
        flhao: this.categoryAddForm.flhao,
        cygid: this.categoryAddForm.cygid
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("categoryAddForm");
        this.showAddSide = false;
        this.initCategoryList();
      });
    },
    // 文献编辑
    handleCategoryFormEdit() {
      saveMaxZch({
        zdid: this.currentZdid,
        leixing: this.categoryEditForm.leixing,
        zdzchao: this.categoryEditForm.zdzchao,
        flhao: this.categoryEditForm.flhao,
        cygid: this.categoryEditForm.cygid
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initCategoryList();
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "categoryEditForm") {
        // 恢复原始数据
        this.categoryEditForm = Object.assign({}, this.categoryEditFormOrigin);
      } else {
        this.categoryAddForm = Object.assign({}, this.categoryAddFormTemp);
      }
      this.$refs[formName].clearValidate();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "categoryAddForm") {
            this.handleCategoryFormAdd();
          } else if (formName === "categoryEditForm") {
            this.handleCategoryFormEdit();
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
