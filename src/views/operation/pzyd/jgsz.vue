<!--
 * @Description: 荐购设置
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-08-29 14:06:24
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 17:14:08
 -->
<template>
  <div class="set-jgsz common__content">
    <td-content-header>
      荐购设置
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowJgSide"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleJgSelection.length === 0"
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
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="currentLibId"
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
          <p class="label">书库名称：</p>
          <el-select
            filterable
            size="mini"
            v-model="tableName"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tableNameOptionsAll"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="initJgList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="contentTable">
        <el-table
          ref="jgListTable"
          v-loading="loadJgListData"
          @row-click="jgListRowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          border
          :data="jgList"
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
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
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
          <el-table-column show-overflow-tooltip prop="topType" label="排行榜">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="topName"
            label="排行榜条件"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否启用">
            <template slot-scope="scope">
              {{ scope.row.userd ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.setId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkJgDetail"
                @handleDel="handleDelJg"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleJgSizeChange"
          @current-change="handleJgCurrentChange"
          :total="totalJgListCount"
          :currentPage="currentJgListPage"
          :pageSize="jgListPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 荐购推荐条件 -->
    <side-wrap class="common__side_form" v-show="showAddJgSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增荐购推荐条件</div>
            <div v-else class="tit active">修改荐购推荐条件</div>
          </div>
          <i class="el-icon-close" @click="showAddJgSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="jgAddForm"
          :model="jgAddForm"
          label-width="100px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">设置信息</div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="jgAddForm.libId"
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
            <el-form-item class="item" prop="topType" label="排行榜">
              <el-select
                filterable
                v-model="jgAddForm.topType"
                placeholder="请选择"
                @change="getLibBorrowRank"
              >
                <el-option
                  v-for="item in rankingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jdTopId" label="排行榜条件">
              <el-select
                filterable
                v-model="jgAddForm.jdTopId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in topNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="userd" label="是否启用">
              <div style="width: 230px">
                <el-radio v-model="jgAddForm.userd" :label="true">是</el-radio>
                <el-radio v-model="jgAddForm.userd" :label="false">否</el-radio>
              </div>
            </el-form-item>
            <el-form-item
              style="flex: 0 0 100%;"
              class="item"
              prop="tableName"
              label="书库名称"
            >
              <el-select
                filterable
                @change="getCategoryList"
                v-model="jgAddForm.tableName"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in tableNameOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 0;"></el-form-item>
            <el-form-item
              style="flex: 0 0 100%;"
              class="item item__category"
              prop="userd"
              label="图书分类"
            >
              <el-checkbox
                :indeterminate="isIndeterminate"
                v-model="checkAllCategories"
                @change="handleCheckAllChange"
                >全选</el-checkbox
              >
              <el-checkbox-group
                v-loading="loadingCategory"
                v-model="checkedCategories"
                @change="handleCheckedCitiesChange"
              >
                <el-checkbox
                  v-for="category in categories"
                  :label="category"
                  :key="category"
                  >{{ category }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </div>
        </el-form>
      </div>

      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('jgAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm('jgAddForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddJgSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import { findJgouSet, delJgouSet, saveJgouSet } from "api/setting";

import { getLibBorrowRank, getTableList, getTableCategories } from "api/other";

export default {
  name: "opera_jgsz",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.rankingOptions = [
      {
        label: "图书销量榜",
        value: "图书销量榜"
      },
      {
        label: "新书销量榜",
        value: "新书销量榜"
      },
      {
        label: "图书热评榜",
        value: "图书热评榜"
      },
      {
        label: "少儿畅销榜",
        value: "少儿畅销榜"
      },
      {
        label: "中小学教辅榜",
        value: "中小学教辅榜"
      },
      {
        label: "责任者销量榜",
        value: "责任者销量榜"
      }
    ];
    return {
      isAdd: true,
      tableName: "",
      tableNameOptions: [],
      tableNameOptionsAll: [],
      savingTableName: false,
      multipleJgSelection: [],
      currentLibId: this.$store.getters.userInfo.libId,
      loadJgListData: false,
      jgList: [],
      totalJgListCount: 0,
      currentJgListPage: 1,
      jgListPageSize: 15,
      showAddJgSide: false,
      topNameOptions: [],
      jgAddForm: {
        libId: this.$store.getters.userInfo.libId,
        topType: "图书销量榜",
        jdTopId: "",
        userd: true,
        setId: "",
        tableName: ""
      },
      checkAllCategories: true,
      checkedCategories: [],
      categories: [],
      isIndeterminate: false,
      loadingCategory: false
    };
  },
  methods: {
    getTableNameList() {
      getTableList().then(res => {
        let data = res.data.map(item => {
          return {
            label: item.tableDescribe,
            value: item.tableName
          };
        });
        this.tableNameOptions = Object.assign([], data);
        data.unshift({
          label: "全部",
          value: ""
        });
        this.tableNameOptionsAll = data;
      });
    },
    handleCheckAllChange(val) {
      this.checkedCategories = val ? this.categories : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      // 编辑的时候也要判断全选框的状态，此时通过 this.checkedCategories 拿到值
      if (!value) {
        value = this.checkedCategories;
      }
      let checkedCount = value.length;
      this.checkAllCategories =
        checkedCount > 0 && checkedCount === this.categories.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.categories.length;
    },
    getCategroyNmaeFromId(id) {
      return this.categoryNameMap[id];
    },
    getCategoryList() {
      this.loadingCategory = true;
      getTableCategories({
        tableName: this.jgAddForm.tableName
      })
        .then(res => {
          let categories = res.data.map(item => item.categoryName);
          this.categories = categories;
          if (this.sideMode === "add" && this.checkAllCategories) {
            this.checkedCategories = categories;
          } else {
            // 编辑的时候要手动触发
            this.handleCheckedCitiesChange();
          }
        })
        .finally(() => {
          this.loadingCategory = false;
        });
    },
    initJgList() {
      this.currentJgListPage = 1;
      this.requestObj = {
        libId: this.currentLibId,
        tableName: this.tableName
      };
      this.getJgList();
    },
    getJgList() {
      this.loadJgListData = true;
      findJgouSet({
        pageNumber: this.currentJgListPage,
        pageSize: this.jgListPageSize,
        ...this.requestObj
      })
        .then(res => {
          this.jgList = res.data.dataList;
          this.totalJgListCount = +res.data.totalElements;
        })
        .finally(() => {
          this.loadJgListData = false;
        });
    },
    handleShowJgSide() {
      this.isAdd = true;
      this.sideMode = "add";
      this.checkAllCategories = true;
      this.handleCheckAllChange(this.categories);
      this.showAddJgSide = true;
      this.$nextTick(() => {
        this.resetForm("jgAddForm");
      });
    },
    getLibBorrowRank(val, isKeep) {
      // isKeep 用于编辑的时候加载对应的排行榜条件后不重置
      getLibBorrowRank({
        topType: this.jgAddForm.topType,
        pageNumber: 1,
        pageSize: 1000
      }).then(res => {
        let arr = res.data.dataList.map(item => {
          return {
            label: item.topName || item.topType,
            value: item.id
          };
        });

        this.topNameOptions = arr;
        if (!isKeep) {
          this.jgAddForm.jdTopId = arr[0] ? arr[0].value : "";
        }
      });
    },
    handleJgSizeChange(val) {
      this.jgListPageSize = val;
      this.getJgList();
    },
    handleJgCurrentChange(val) {
      this.currentJgListPage = val;
      this.getJgList();
    },
    handleDelJg(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadJgListData = true;
          delJgouSet({
            setIds: ids ? ids : this.multipleJgSelection.join(",")
          })
            .then(res => {
              this.loadJgListData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initJgList();
            })
            .catch(() => {
              this.loadJgListData = false;
            });
        })
        .catch(() => {});
    },
    jgListRowClick(row) {
      this.$refs["jgListTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.isAdd = false;
      this.checkJgDetail("", "", row);
    },
    handleSelectionChange(val) {
      this.multipleJgSelection = val.map(item => item.setId);
    },
    checkJgDetail(id, index, data) {
      this.sideMode = "edit";
      this.jgAddForm = {
        libId: data.libId,
        topType: data.topType,
        jdTopId: +data.jdTopId,
        userd: data.userd,
        setId: data.setId,
        tableName: data.tableName
      };
      this.checkedCategories = data.types ? data.types.split(",") : [];

      this.jgAddFormOrigin = Object.assign({}, this.jgAddForm);
      this.getLibBorrowRank("", true);
      this.showAddJgSide = true;
      this.getCategoryList();
    },
    updateJgInfo() {
      let matchTopArr = this.topNameOptions.filter(
        item => item.value === this.jgAddForm.jdTopId
      );
      let topName = matchTopArr[0] ? matchTopArr[0].label : "";
      saveJgouSet({
        ...this.jgAddForm,
        topName,
        types: this.checkedCategories.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.showAddJgSide = false;
        this.initJgList();
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updateJgInfo();
        } else {
          return false;
        }
      });
    },
    resetForm() {
      if (this.sideMode === "add") {
        this.jgAddForm = {
          libId: this.$store.getters.userInfo.libId,
          topType: "图书销量榜",
          jdTopId: "",
          userd: true,
          setId: "",
          tableName:
            this.tableNameOptions.length > 0
              ? this.tableNameOptions[0].value
              : ""
        };
        this.getCategoryList();
        this.getLibBorrowRank();
      } else {
        this.jgAddForm = Object.assign({}, this.jgAddFormOrigin);
        this.getLibBorrowRank("", true);
      }
    }
  },
  created() {
    this.initJgList();
    this.getTableNameList();
  },
  activated() {
    this.getTableNameList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .item__category .el-form-item__label {
  flex: 0 0 100px;
}
</style>
