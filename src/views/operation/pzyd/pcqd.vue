<!--
 * @Description: 批次清单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 18:38:37
 -->
<template>
  <div class="pcqd common__content">
    <td-content-header>
      批次清单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <!-- <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary" 
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          > -->
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
          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            value-format="yyyy-MM-dd"
            style="marginRight:3px;"
            class="el-date-editor--datetime"
            :clearable="true"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            value-format="yyyy-MM-dd"
            size="mini"
            :clearable="true"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="statusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusSelect"
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
          <el-table-column show-overflow-tooltip prop="batchNo" label="批次">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="operTime"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="booksNum"
            label="书目/书册数"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            width="45"
          >
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
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

    <!-- 新增批次 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增批次
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
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="batchNo" label="批次">
              <el-input
                clearable
                v-model="literatureAddForm.batchNo"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="selectLibId" label="成员馆">
              <el-select
                filterable
                v-model="literatureAddForm.selectLibId"
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
            </el-form-item>
            <el-form-item class="item" prop="status" label="状态">
              <el-radio-group v-model="literatureAddForm.status">
                <el-radio :label="true">激活</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureAddForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureAddForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑批次说明 -->
    <side-wrap
      v-loading="loadLiteratureDetail"
      class="dialog__add common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑批次
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
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="batchNo" label="批次">
              <el-input
                clearable
                v-model="literatureEditForm.batchNo"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="selectLibId" label="成员馆">
              <el-select
                filterable
                v-model="literatureEditForm.selectLibId"
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
            </el-form-item>

            <el-form-item class="item" prop="status" label="状态">
              <el-radio-group v-model="literatureEditForm.status">
                <el-radio :label="true">激活</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureEditForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureEditForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { BatchList, BatchSave, BatchExpo } from "api/operation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
export default {
  name: "opera_pcqd",
  data() {
    this.literatureFilterOptions = [
      {
        value: "batchNo",
        label: "批次"
      },
      {
        value: "userName",
        label: "操作员"
      }
    ];
    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      statusSelect: [
        { label: "全部", value: "" },
        { label: "激活", value: "0" },
        { label: "关闭", value: "1" }
      ],
      statusId: "",
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "batchNo",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      // 新增
      showAddSide: false,
      literatureAddForm: {
        batchNo: "",
        selectLibId: this.$store.getters.userInfo.libId,
        beizhu: "",
        status: true
      },
      literatureEditForm: {
        batchNo: "",
        selectLibId: "",
        beizhu: "",
        status: ""
      },
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      rules: {
        selectLibId: [
          { required: true, message: "请选择成员馆", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        beizhu: [{ required: true, message: "请填写备注 ", trigger: "blur" }],
        batchNo: [{ required: true, message: "请填写批次 ", trigger: "blur" }]
      },
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择
              time.getTime() > Date.now() ||
              time.getTime() > new Date(this.date2)
            );
          }
          // 结束时间没选--可以选择当天
          return time.getTime() > Date.now();
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() ||
            time.getTime() < new Date(this.date1) - 8.64e7
          );
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
        startDate: this.date1,
        endDate: this.date2,
        status: this.statusId
      };

      BatchList(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          res.data.dataList.forEach(item => {
            item.booksNum = item.catalogNum + "/" + item.bookNum;
            item.status = item.status == 0 ? "激活" : "关闭";
          });
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
    handleLiteratureFormAdd() {
      if (this.literatureAddForm.status) {
        this.literatureAddForm.statusStr = 0;
      } else {
        this.literatureAddForm.statusStr = 1;
      }
      let params = {
        batchNo: this.literatureAddForm.batchNo,
        libId: this.literatureAddForm.selectLibId,
        status: this.literatureAddForm.statusStr,
        remark: this.literatureAddForm.beizhu
      };
      BatchSave(params).then(res => {
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
    handleLiteratureFormEdit() {
      if (this.literatureEditForm.status) {
        this.literatureEditForm.statusStr = 0;
      } else {
        this.literatureEditForm.statusStr = 1;
      }
      let params = {
        batchId: this.literatureEditForm.batchId,
        batchNo: this.literatureEditForm.batchNo,
        libId: this.literatureEditForm.selectLibId,
        status: this.literatureEditForm.statusStr,
        remark: this.literatureEditForm.beizhu
      };
      BatchSave(params).then(res => {
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
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
      }
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "literatureAddForm") {
            this.handleLiteratureFormAdd();
            this.showAddSide = false;
            this.$refs["literatureAddForm"].resetFields();
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit();
            this.showEditSide = false;
            this.$refs["literatureEditForm"].resetFields();
          }
        } else {
          return false;
        }
      });
    },
    // 编辑批次
    editGzsm(row) {
      this.showEditSide = true;
      this.literatureEditForm.selectLibId = row.libId;
      this.literatureEditForm.batchId = row.batchId;
      this.literatureEditForm.batchNo = row.batchNo;
      if (row.status == "关闭") {
        this.literatureEditForm.status = false;
      } else if (row.status == "激活") {
        this.literatureEditForm.status = true;
      }
      this.literatureEditForm.beizhu = row.remark;
    },
    // 单个删除
    // singleDeleteGzsm(row) {
    //   this.$confirm("确定要删除么?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       jygzsmDel({ jygzsmids: row.jygzsmid }).then(res => {
    //         if (res.code == 0) {
    //           this.$message({
    //             message: res.message,
    //             type: "success"
    //           });
    //           this.initLiteratureList();
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },
    // 批量删除
    // deleteGzsm() {
    //   this.$confirm("确定要删除么?", "提示", {
    //     confirmButtonText: "确定",
    //     cancelButtonText: "取消",
    //     type: "warning"
    //   })
    //     .then(() => {
    //       jygzsmDel({
    //         jygzsmids: this.multipleLiteratureSelection.join()
    //       }).then(res => {
    //         if (res.code == 0) {
    //           this.$message({
    //             message: res.message,
    //             type: "success"
    //           });
    //           this.initLiteratureList();
    //         }
    //       });
    //     })
    //     .catch(() => {});
    // },
    // 导出
    handleExport() {
      if (this.multipleLiteratureSelection.length > 0) {
        downLoadExcel(BatchExpo(), {
          batchIds: this.multipleLiteratureSelection.join()
        });
      } else {
        this.$message.error("请选择批次");
      }
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.batchId);
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
.edit__footer {
  justify-content: flex-end !important;
}
</style>
