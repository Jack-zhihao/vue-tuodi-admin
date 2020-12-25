<!--
 * @Description: 
 * @Autor: qili.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-10 16:48:20
 -->

<template>
  <div class="ywbzgl common__content">
    <td-content-header>
      疑问帮助管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">疑问类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectProType"
            placeholder="请选择"
          >
            <el-option
              v-for="item in proTypeList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">疑问问题：</p>
          <el-input
            v-model="proName"
            placeholder="请输入疑问问题"
            size="mini"
          ></el-input>
          <p class="label">疑问答案：</p>
          <el-input
            v-model="proAnswer"
            placeholder="请输入疑问答案"
            size="mini"
          ></el-input>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="getdoubtList"
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
          :data="doubtList"
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
            prop="doubtType"
            show-overflow-tooltip
            label="疑问类型"
          >
            <template slot-scope="scope">
              {{ scope.row.doubtType == 1 ? "站点详情" : "" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="doubtProblem"
            show-overflow-tooltip
            label="疑问问题"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="doubtReply"
            label="疑问答案"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="status"
            label="状态"
            width="45"
          >
            <template slot-scope="scope">
              {{ scope.row.status == 1 ? "启用" : "停用" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.doubtId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="deleteGzsm"
              ></td-action-tool>
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

    <!-- 新增 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增疑问信息
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('doubtAddForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="doubtAddForm"
          label-width="80px"
          :model="doubtAddForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>疑问信息</span>
            </div>

            <el-form-item class="item" prop="doubtType" label="疑问类型">
              <el-select
                filterable
                v-model="doubtAddForm.doubtType"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="doubtType"
              >
                <el-option
                  v-for="item in doubtTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              prop="doubtProblem"
              class="item"
              label="疑问问题"
              style="flex:0 0 50%"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入疑问问题"
                v-model="doubtAddForm.doubtProblem"
                clearable
                style="width:100%"
              >
              </el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="疑问答案"
              style="flex:0 0 50%"
              prop="doubtReply"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入疑问答案"
                v-model="doubtAddForm.doubtReply"
                clearable
                style="width:100%"
              >
              </el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="status" label="启用状态">
              <el-radio v-model="doubtAddForm.status" label="1">启用</el-radio>
              <el-radio v-model="doubtAddForm.status" label="0">停用</el-radio>
            </el-form-item>
            <el-form-item></el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('doubtAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('doubtAddForm')"
              type="primary"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>

    <!-- 编辑疑问 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑疑问信息
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('doubtEditForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="doubtEditForm"
          label-width="80px"
          :model="doubtEditForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>疑问信息</span>
            </div>

            <el-form-item class="item" prop="doubtType" label="疑问类型">
              <el-select
                filterable
                v-model="doubtEditForm.doubtType"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="taskPlanFrequency"
              >
                <el-option
                  v-for="item in doubtTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="疑问问题"
              prop="doubtProblem"
              style="flex:0 0 50%"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入疑问问题"
                v-model="doubtEditForm.doubtProblem"
                clearable
                style="width:100%"
              >
              </el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item"
              label="疑问答案"
              style="flex:0 0 50%"
              prop="doubtReply"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入疑问答案"
                v-model="doubtEditForm.doubtReply"
                clearable
                style="width:100%"
              >
              </el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="status" label="启用状态">
              <el-radio v-model="doubtEditForm.status" label="1">启用</el-radio>
              <el-radio v-model="doubtEditForm.status" label="0">停用</el-radio>
            </el-form-item>
            <el-form-item></el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('doubtEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('doubtEditForm')"
              type="primary"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { selectDoubt, doubtDelete, doubtSave, getDoubt } from "api/operation";
export default {
  name: "opera_ywbzgl",
  data() {
    return {
      proTypeList: [
        {
          label: "站点详情",
          value: 1
        }
      ],
      selectProType: "",
      proName: "",
      proAnswer: "",
      selectStatus: "",
      statusList: [{ label: "启用", value: 1 }, { label: "停用", value: 0 }],
      doubtList: [],
      doubtAddForm: {
        doubtType: "",
        doubtProblem: "",
        doubtReply: "",
        status: "1"
      },
      doubtEditForm: {
        doubtId: "",
        doubtType: "",
        doubtProblem: "",
        doubtReply: "",
        status: "1"
      },
      rules: {
        doubtType: [
          { required: true, message: "请选择疑问类型", trigger: "blur" }
        ],

        doubtProblem: [
          { required: true, message: "请填写疑问问题", trigger: "change" }
        ],
        doubtReply: [
          { required: true, message: "请填写疑问答案", trigger: "change" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "change" }]
      },
      showAddSide: false,
      showEditSide: false,
      doubtTypeList: [{ label: "站点详情", value: 1 }],
      // 多选
      multipleLiteratureSelection: [],
      loadLiteratureData: false,
      // 是否可以提交
      literatureList: [],
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0
    };
  },
  computed: {},
  methods: {
    // 文献列表
    getdoubtList() {
      this.currentLiteraturePage = 1;
      this.getLiteratureList();
    },
    // 验证提交校验
    jsYz(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          // 通过表单验证
          if (formName === "doubtAddForm") {
            this.handleLiteratureFormAdd();
            this.showAddSide = false;
            this.$refs["doubtAddForm"].resetFields();
            // 清空表单其余
          } else if (formName === "doubtEditForm") {
            this.handleLiteratureFormEdit();
            this.showEditSide = false;
            this.$refs["doubtEditForm"].resetFields();
            // 清空表单其余
          }
        } else {
          if (error && Object.keys(error).length > 0) {
            let keysArr = Object.keys(error);
            this.$refs[keysArr[0]].focus();
          }
          return false;
        }
      });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    // 新增
    handleAdd() {
      this.showAddSide = true;
    },
    // 提交接口
    handleLiteratureFormAdd() {
      let params = {
        ...this.doubtAddForm
      };
      doubtSave(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          // 刷新列表
          this.getdoubtList();
        }
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

    rowDblclick(row) {
      this.editGzsm(row);
    },

    getLiteratureList() {
      this.loadLiteratureData = true;
      let requestObj = {
        doubtType: this.selectProType,
        doubtProblem: this.proName,
        doubtReply: this.proAnswer,
        status: this.selectStatus
      };
      selectDoubt(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          if (res.code == 0 && res.data.dataList) {
            this.loadLiteratureData = false;
            this.doubtList = res.data.dataList;
          }
          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },

    // 编辑接口
    handleLiteratureFormEdit() {
      let params = {
        ...this.doubtEditForm
      };
      doubtSave(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.getdoubtList();
        }
      });
    },
    // 取消提交
    cancelForm(formName) {
      if (formName === "doubtAddForm") {
        this.showAddSide = false;
        this.$refs["doubtAddForm"].resetFields();
      } else if (formName === "doubtEditForm") {
        this.showEditSide = false;
        this.$refs["doubtEditForm"].resetFields();
      }
    },

    // 保存提交
    submitForm(formName) {
      let that = this;
      setTimeout(function() {
        that.jsYz(formName);
      }, 100);
    },
    // 编辑活动页面
    editGzsm(row) {
      this.showEditSide = true;
      getDoubt({ doubtId: row.doubtId }).then(res => {
        this.doubtEditForm = res.data;
        this.doubtEditForm.doubtId = res.data.doubtId;
        this.doubtEditForm.doubtType = res.data.doubtType;
        this.doubtEditForm.doubtProblem = res.data.doubtProblem;
        this.doubtEditForm.doubtReply = res.data.doubtReply;
        this.doubtEditForm.status = String(res.data.status);
      });
    },
    // 删除
    deleteGzsm(rowids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadingListData = true;
          doubtDelete({
            doubtIds: rowids
              ? rowids
              : this.multipleLiteratureSelection.join(",")
          })
            .then(res => {
              this.$message.success(res.message);
              this.getdoubtList();
            })
            .finally(() => {
              this.loadingListData = false;
            });
        })
        .catch(() => {});
    },
    // 多选
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.doubtId);
    }
  },
  mounted() {
    this.getdoubtList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
/deep/.el-form-item__content {
  width: 590px;
}
</style>
