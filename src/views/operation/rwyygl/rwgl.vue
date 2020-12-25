<!--
 * @Description: 任务步骤列表
 * @Autor: chenming.feng
 * @Date: 2019-10-22 14:24:57
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 16:03:12
 -->
<template>
  <div class="p-rwdzlb common__content">
    <td-content-header>
      任务管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddSide"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteItem('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">任务步骤名称：</p>
          <el-input
            clearable
            size="mini"
            v-model="searchValue"
            placeholder="请输入检索内容"
            @keyup.enter.native="initList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadingListData"
          @selection-change="handleSelectionChange"
          border
          :data="listData"
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
            prop="tpName"
            label="任务步骤名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="更新时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="更新用户"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.tpId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="showEditSide"
                @handleDel="deleteItem"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑步骤列表 -->
    <side-wrap
      v-loading="loadindgDetail"
      class="common__side_form"
      v-show="editSideVisible"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增任务步骤信息</div>
            <div v-else class="tit active">修改任务步骤信息</div>
          </div>
          <i class="el-icon-close" @click="editSideVisible = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="eidtForm"
          label-width="160px"
          :model="eidtForm"
          :rules="eidtFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>任务步骤信息</span>
            </div>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="tpName"
              label="任务步骤名称"
            >
              <el-input
                clearable
                placeholder="请输入任务步骤名称"
                v-model="eidtForm.tpName"
              ></el-input>
            </el-form-item>
            <span></span>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="actions"
              label="节点步骤"
            >
              <el-select
                filterable
                v-model="currentAcNode"
                placeholder="请选择动作"
              >
                <el-option
                  v-for="item in nodeAcList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-button
                type="primary"
                style="margin-left: 10px;"
                @click="handleAddAcNode"
                >添加</el-button
              >
              <el-table
                :data="nodeDataList"
                border
                style="width: 600px;margin-top: 10px;"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column prop="taName" label="动作名称">
                </el-table-column>
                <el-table-column prop="taAppName" label="前端动作名称">
                </el-table-column>
                <el-table-column label="操作" width="45">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #F56C6C;"
                      @click="handleRemoveNode(scope.$index)"
                      >删除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
            </el-form-item>
            <span></span>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="tpMandatory"
              label="是否为强制流程"
            >
              <el-select
                filterable
                v-model="eidtForm.tpMandatory"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in [
                    { label: '是', value: true },
                    { label: '否', value: false }
                  ]"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <div style="font-size: 12px;color: #999;">
                用于判断完成父步骤后，是否必须执行此步骤，才能进入子步骤
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('eidtForm')"
              :loading="isSavingForm"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="editSideVisible = false"
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
  saveProcess,
  searchProcess,
  delProcess,
  searchAction
} from "api/operation";

export default {
  name: "opera_rwgl",
  data() {
    this.eidtFormRules = {
      tpName: [
        { required: true, message: "任务步骤名称不能为空", trigger: "blur" }
      ],
      actions: [
        {
          required: true,
          message: "至少添加一个节点步骤",
          trigger: "blur"
        }
      ]
    };
    return {
      isAdd: true,
      searchValue: "",
      multipleSelection: [],
      loadingListData: false,
      listData: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 15,
      currentAcNode: "",
      loadindgDetail: false,
      editSideVisible: false,
      isSavingForm: false,
      eidtForm: {
        tpName: "",
        actions: "",
        tpMandatory: false
      },
      nodeDataList: [],
      nodeAcList: []
    };
  },
  created() {
    this.initList();
    this.getAcNodeList();
  },
  activated() {
    this.getAcNodeList();
  },
  methods: {
    getAcNodeList() {
      let map = {};
      searchAction({
        pageSize: 9999,
        pageNumber: 1
      }).then(res => {
        this.nodeAcList = res.data.dataList.map(item => {
          map[item.taId] = {
            taName: item.taName,
            taAppName: item.taAppName
          };
          return {
            label: item.taName,
            value: item.taId
          };
        });
        this.currentAcNode = this.nodeAcList[0].value;
      });
      this.nodeAcListMap = map;
    },
    setRequestObj() {
      this.requestObj = {
        tpName: this.searchValue
      };
    },
    initList() {
      this.currentCCDZPage = 1;
      this.setRequestObj();
      this.getList();
    },
    getList() {
      this.loadingListData = true;

      let requestObj = {
        pageNumber: this.currentCCDZPage,
        pageSize: this.ccdzPageSize,
        ...this.requestObj
      };

      searchProcess(requestObj)
        .then(res => {
          this.listData = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadingListData = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.isAdd = false;
      this.showEditSide(row.tpId, "", row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.tpId);
    },
    showAddSide() {
      this.isAdd = true;
      this.editSideVisible = true;
      this.$nextTick(() => {
        this.resetForm("eidtForm");
      });
    },
    handleAddAcNode() {
      this.nodeDataList.push({
        taId: this.currentAcNode,
        taName: this.nodeAcListMap[this.currentAcNode]["taName"],
        taAppName: this.nodeAcListMap[this.currentAcNode]["taAppName"]
      });
      this.setFormActions();
      this.$refs.eidtForm.validateField("actions");
    },
    setFormActions() {
      this.eidtForm.actions = this.nodeDataList
        .map((item, index) => {
          return index + 1 + "-" + item.taId;
        })
        .join();
    },
    deleteItem(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadingListData = true;
          delProcess({
            tpIds: ids ? ids : this.multipleSelection.join(",")
          })
            .then(res => {
              this.$message.success(res.message);
              this.initList();
            })
            .finally(() => {
              this.loadingListData = false;
            });
        })
        .catch(() => {});
    },
    showEditSide(id, index, data) {
      this.editSideVisible = true;
      this.eidtForm = {
        tpName: data.tpName,
        actions: "",
        tpMandatory: data.tpMandatory,
        tpId: data.tpId
      };
      this.nodeDataList = data.list.map(item => {
        return {
          taId: item.taId,
          taName: item.taName,
          taAppName: item.taAppName
        };
      });
      this.setFormActions();
      this.editSideVisible = true;
      this.$nextTick(() => {
        this.$refs.eidtForm.validate();
      });
    },
    handleAddProcess() {
      this.isSavingForm = true;
      saveProcess({
        ...this.eidtForm
      })
        .then(res => {
          this.$message.success(res.message);
          this.editSideVisible = false;
          this.initList();
        })
        .finally(() => {
          this.isSavingForm = false;
        });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleAddProcess();
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      this.eidtForm = {
        tpName: "",
        actions: "",
        tpMandatory: false
      };
      this.nodeDataList = [];
      this.$refs[formName].resetFields();
    },
    handleRemoveNode(index) {
      this.nodeDataList.splice(index, 1);
      this.setFormActions();
      this.$refs.eidtForm.validateField("actions");
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
