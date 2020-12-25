<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-06-24 13:43:07
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-09 20:33:59
 -->
<template>
  <div class="p-jqsd common__content">
    <td-content-header>
      <span>假期设定</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowAddHoliday"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleHolidaySelection.length === 0"
            size="mini"
            type="primary"
            @click="handleDelHoliday('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-button type="primary" size="mini" @click="getHolidayList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="userListTable"
          v-loading="loadListData"
          @row-click="userListRowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          border
          :data="holidayList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="假期名称" prop="jqname">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="startdate"
            label="假期开始时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="enddate"
            label="假期结束时间"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.jqid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkHolidayDetail"
                @handleDel="handleDelHoliday"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalListCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 修改假期 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showAddHoliday"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增假期设定</div>
            <div v-else class="tit active">修改假期设定</div>
          </div>
          <i class="el-icon-close" @click="showAddHoliday = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="holidayForm"
          label-width="160px"
          :model="holidayForm"
          :rules="holidayFormRules"
        >
          <div class="form__type">
            <div class="tit">
              <span>假期设定</span>
            </div>
            <el-form-item
              style="flex:0 0 100%;justify-content: flex-start;"
              class="item"
              prop="jqname"
              label="假期名称"
            >
              <el-input
                clearable
                size="mini"
                v-model="holidayForm.jqname"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="flex:0 0 100%;justify-content: flex-start;"
              class="item"
              prop="startdate"
              label="假期开始时间"
            >
              <el-date-picker
                size="medium"
                value-format="yyyy-MM-dd"
                v-model="holidayForm.startdate"
                type="date"
                placeholder="选择假期开始时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item
              style="flex:0 0 100%;justify-content: flex-start;"
              class="item"
              prop="enddate"
              label="假期结束时间"
            >
              <el-date-picker
                size="medium"
                value-format="yyyy-MM-dd"
                v-model="holidayForm.enddate"
                type="date"
                placeholder="选择假期结束时间"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('holidayForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('holidayForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddHoliday = false"
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
  holidaySetList,
  holidaySetSave,
  holidaySetDel,
  getHolidaySet
} from "api/circulation";

export default {
  name: "set_jqsd",
  data() {
    this.holidayFormRules = {
      jqname: [{ required: true, message: "请输入假期名称", trigger: "blur" }],
      startdate: [
        { required: true, message: "请选择假期开始时间", trigger: "blur" }
      ],
      enddate: [
        { required: true, message: "请选择假期结束时间", trigger: "blur" }
      ]
    };
    return {
      isAdd: true,
      showAddHoliday: false,
      loadListData: false,
      multipleHolidaySelection: [],
      holidayList: [],
      currentPage: 1,
      pageSize: 10,
      totalListCount: 0,
      modiMode: "",
      holidayForm: {
        jqname: "",
        startdate: "",
        enddate: ""
      }
    };
  },
  methods: {
    handleSelectionChange(val) {
      this.multipleHolidaySelection = val.map(item => item.jqid);
    },
    userListRowClick(row) {
      this.$refs["userListTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.isAdd = false;
      this.checkHolidayDetail(row.jqid);
    },
    checkHolidayDetail(jqid) {
      this.modiMode = "edit";
      this.currentHolidayId = jqid;
      this.showAddHoliday = true;
      this.$nextTick(() => {
        this.resetForm("holidayForm");
        getHolidaySet({
          jqid: jqid
        }).then(res => {
          this.orgData = {
            jqname: res.data.jqname,
            startdate: res.data.startdate,
            enddate: res.data.enddate
          };
          this.holidayForm = Object.assign({}, this.orgData);
        });
      });
    },
    handleDelHoliday(id) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadListData = true;
          holidaySetDel({
            jqid: id ? id : this.multipleHolidaySelection.join(",")
          })
            .then(res => {
              this.loadListData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initHolidayList();
            })
            .catch(() => {
              this.loadListData = false;
            });
        })
        .catch(() => {});
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.getHolidayList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getHolidayList();
    },
    handleShowAddHoliday() {
      this.isAdd = true;
      this.modiMode = "add";
      this.showAddHoliday = true;
      this.$nextTick(() => {
        this.resetForm("holidayForm");
      });
    },
    initHolidayList() {
      this.currentPage = 1;
      this.getHolidayList();
    },
    getHolidayList() {
      this.loadListData = true;
      holidaySetList({
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      })
        .then(res => {
          this.holidayList = res.data.dataList;
          this.totalListCount = +res.data.totalElements;
        })
        .finally(() => {
          this.loadListData = false;
        });
    },
    modiHolidaySet() {
      let requestObj = {
        ...this.holidayForm
      };
      if (this.modiMode === "edit") {
        requestObj["jqid"] = this.currentHolidayId;
      }
      holidaySetSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.initHolidayList();
        })
        .finally(() => {
          this.showAddHoliday = false;
        });
    },
    // 通用
    resetForm(formName) {
      if (this.modiMode === "edit") {
        this.holidayForm = Object.assign({}, this.orgData);
        this.$refs[formName].clearValidate();
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.modiHolidaySet();
        } else {
          return false;
        }
      });
    }
  },
  created() {
    this.getHolidayList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
