<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-11-11 15:26:55
 * @LastEditors: 你的名字
 * @LastEditTime: 2020-03-06 14:23:13
 -->
<template>
  <div class="yxssz common__content">
    <td-content-header>
      云选书设置
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddList"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleYunSetting.length === 0"
            size="mini"
            type="primary"
            @click="deleteYunList('')"
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
            clearable
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
          <p class="label">显示荐购理由：</p>
          <el-select
            filterable
            size="mini"
            v-model="showRecommendReson"
            placeholder="请选择"
          >
            <el-option
              v-for="item in showReasonList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">提交荐购理由：</p>
          <el-select
            filterable
            size="mini"
            v-model="submitRecommendReson"
            placeholder="请选择"
          >
            <el-option
              v-for="item in submitReasonList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="initYunSettingList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="zjglTable">
        <el-table
          v-loading="loadingData"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          ref="yunSettingTable"
          border
          :data="dataList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="100">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="money"
            label="显示荐购理由"
          >
            <template slot-scope="scope">
              {{ scope.row.showRecommendReson ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="remark"
            label="提交荐购理由"
          >
            <template slot-scope="scope">
              {{ scope.row.submitRecommendReson ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                ref="actionTool"
                :id="scope.row.ybSetId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="showEditList"
                @handleDel="deleteYunList"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
          :total="totalCount"
          :pageNumber="pageNumber"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 增加/编辑云选书设置 -->
    <side-wrap
      v-loading="loadingData"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">云选书设置</div>
            <div v-else class="tit active">编辑云选书设置</div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="yunSettingEditForm"
          label-width="80px"
          :model="yunSettingEditForm"
          :rules="yunSettingRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>云选书设置</span>
            </div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="yunSettingEditForm.libId"
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
            <el-form-item class="item"></el-form-item>
            <el-form-item
              class="item"
              prop="showRecommendReson"
              label="是否显示荐购理由"
              label-width="40%"
            >
              <el-radio-group v-model="yunSettingEditForm.showRecommendReson">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <p style="font-size: 12px;color: #999;">
                用于判断云选书详情是否显示荐购理由
              </p>
            </el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item
              class="item"
              prop="submitRecommendReson"
              label="是否提交荐购理由"
              label-width="40%"
            >
              <el-radio-group v-model="yunSettingEditForm.submitRecommendReson">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
              <p style="font-size: 12px;color: #999;">
                用于判断云选书读者是否提交荐购理由
              </p>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('yunSettingEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('yunSettingEditForm')"
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
import { mapGetters } from "vuex";

import { yunBookSetSave, yunBookSetDel, yunBookSetSearch } from "api/operation";

export default {
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.yunSettingRules = {
      libId: [{ required: true, message: "成员馆不能为空", trigger: "blur" }],
      showRecommendReson: [{ required: true }],
      submitRecommendReson: [{ required: true }]
    };
    return {
      isAdd: true,
      multipleYunSetting: [],
      selectLibId: this.$store.getters.userInfo.libId,
      pageSize: 15,
      pageNumber: 1,
      totalCount: 0,
      showReasonList: [
        { label: "全部", value: "" },
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      submitReasonList: [
        { label: "全部", value: "" },
        { label: "是", value: true },
        { label: "否", value: false }
      ],
      dataList: [],
      loadingData: false,
      showEditSide: false,
      showRecommendReson: "",
      submitRecommendReson: "",
      // 表单
      yunSettingEditForm: {
        ybSetId: "",
        randomId: "",
        isReplace: "",
        showRecommendReson: true,
        submitRecommendReson: true,
        libId: this.$store.getters.userInfo.libId
      }
    };
  },
  created() {
    this.initYunSettingList();
  },
  methods: {
    // 云设置列表
    rowClick(row) {
      this.$refs["yunSettingTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.isAdd = false;
      this.showEditList("", "", row);
    },
    handleSelectionChange(val) {
      this.multipleYunSetting = val.map(item => item.ybSetId);
    },
    // 删除
    deleteYunList(ids) {
      this.$confirm(
        "该操作将删除资金管理目录下的资金信息，是否确认删除?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadingData = true;
          yunBookSetDel({
            ybSetIds: ids ? ids : this.multipleYunSetting.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initYunSettingList();
            })
            .finally(() => {
              this.loadingData = false;
            });
        })
        .catch(() => {});
    },
    // 新增云选书设置
    showAddList() {
      this.isAdd = true;
      this.currentMode = "add";
      this.showEditSide = true;
      this.$nextTick(() => {
        this.resetForm("yunSettingEditForm");
      });
    },
    // 编辑云选书设置
    showEditList(id, index, data) {
      this.currentMode = "edit";
      this.showEditSide = true;
      this.yunSettingEditForm = {
        ybSetId: data.ybSetId,
        libId: data.libId,
        showRecommendReson: data.showRecommendReson,
        submitRecommendReson: data.submitRecommendReson
      };
      this.yunSettingEditFormOrigin = Object.assign(
        {},
        this.yunSettingEditForm
      );
    },
    // 编辑
    handleYunFormEdit() {
      if (this.currentMode === "add") {
        yunBookSetSave({
          ...this.yunSettingEditForm
        })
          .then(res => {
            this.$message.success(res.message);
            this.showEditSide = false;
            this.initYunSettingList();
          })
          .catch(err => {
            this.$confirm("该成员馆已设置规则，是否要替换?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }).then(() => {
              yunBookSetSave({
                isReplace: true,
                randomId: err.data.randomId,
                ...this.yunSettingEditForm
              })
                .then(res => {
                  this.$message.success(res.message);
                  this.showEditSide = false;
                  this.initYunSettingList();
                })
                .catch(() => {
                  this.showEditSide = false;
                });
            });
          });
      } else {
        yunBookSetSave({
          ...this.yunSettingEditForm
        }).then(res => {
          this.$message.success(res.message);
          this.showEditSide = false;
          this.initYunSettingList();
        });
      }
    },
    // 目录列表
    initYunSettingList() {
      this.pageNumber = 1;
      this.setRequestObj();
      this.getList();
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId,
        showRecommendReson: this.showRecommendReson,
        submitRecommendReson: this.submitRecommendReson
      };
    },
    getList() {
      this.loadingData = true;

      let requestObj = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        ...this.requestObj
      };

      yunBookSetSearch(requestObj)
        .then(res => {
          this.loadingData = false;
          this.dataList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadingData = false;
        });
    },
    // 通用
    resetForm() {
      if (this.currentMode === "edit") {
        // 恢复原始数据
        this.yunSettingEditForm = Object.assign(
          {},
          this.yunSettingEditFormOrigin
        );
      } else {
        this.yunSettingEditForm = {
          libId: this.$store.getters.userInfo.libId,
          showRecommendReson: true,
          submitRecommendReson: true
        };
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleYunFormEdit();
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    handlePageChange(val) {
      this.pageNumber = val;
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
