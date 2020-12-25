<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-05-17 16:26:35
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-09 10:36:48
 -->

<template>
  <div class="set-yjmb common__content">
    <td-content-header>
      邮件模板
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-button type="primary" size="mini" @click="getTempInfoList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-dblclick="rowDblclick"
          v-loading="loadBooksInfoData"
          border
          :data="tempInfoList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailModelLibName"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailModelType"
            label="类型"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailModelTitle"
            label="标题"
          >
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit']"
                @handleEdit="handleEdit(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 编辑模板 -->
    <side-wrap
      v-loading="loadMarcfbDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑邮件模板
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcfbEditForm"
          label-width="100px"
          :model="marcfbEditForm"
          :rules="marcfbFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>邮件模版信息</span>
            </div>
            <el-form-item class="item" prop="type" label="模版类型">
              <el-select
                filterable
                disabled
                v-model="marcfbEditForm.type"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in typeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="title" label="标题">
              <el-input clearable v-model="marcfbEditForm.title"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="content" label="内容">
              <el-input
                clearable
                type="textarea"
                v-model="marcfbEditForm.content"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div v-show="currentType === '催还'">
          <p>参数说明</p>
          <p>A：读者姓名</p>
          <p>B：读者证号</p>
          <p>C：馆名称</p>
        </div>
        <div v-show="currentType === '预约到书'">
          <p>参数说明</p>
          <p>A：读者姓名</p>
          <p>B：读者证号</p>
          <p>C：馆名称</p>
          <p>D：预约时间</p>
          <p>E：正题名</p>
          <p>F：保留时间</p>
        </div>
        <div v-show="currentType === '找回密码'">
          <p>参数说明</p>
          <p>A：读者姓名</p>
          <p>B：重置密码链接</p>
          <p>C：馆名称</p>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marcfbEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcfbEditForm')"
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
import { searchMailTemp, updateMailTemp } from "api/setting";

export default {
  name: "set_yjmb",
  data() {
    this.marcfbFormRules = {};
    return {
      // 列表
      loadBooksInfoData: false,
      tempInfoList: [],
      multipleSelection: [],
      currentType: "催还",
      typeOptions: [
        {
          label: "催还",
          value: "催还"
        },
        {
          label: "预约到书",
          value: "预约到书"
        },
        {
          label: "找回密码",
          value: "找回密码"
        }
      ],
      // 编辑模板
      showEditSide: false,
      loadMarcfbDetail: false,
      marcfbEditForm: {
        type: "",
        title: "",
        content: ""
      }
    };
  },
  methods: {
    // 列表
    getTempInfoList() {
      this.loadBooksInfoData = true;
      searchMailTemp()
        .then(res => {
          this.tempInfoList = res.data;
        })
        .finally(() => {
          this.loadBooksInfoData = false;
        });
    },
    rowDblclick(row) {
      this.handleEdit(row);
    },
    // 通用
    handleEdit(data) {
      this.showEditSide = true;
      this.currentModelData = data;
      this.currentType = data.mailModelType;
      this.marcfbEditForm.type = data.mailModelType;
      this.marcfbEditForm.title = data.mailModelTitle;
      this.marcfbEditForm.content = data.mailModelContent;
    },
    submitForm() {
      updateMailTemp({
        mailModelId: this.currentModelData.mailModelId,
        mailModelType: this.marcfbEditForm.type,
        mailModelTitle: this.marcfbEditForm.title,
        mailModelContent: this.marcfbEditForm.content,
        mailModelLibid: this.currentModelData.mailModelLibid
      }).then(res => {
        this.showEditSide = false;
        this.$message.success(res.message);
        this.getTempInfoList();
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    }
  },
  mounted() {
    this.getTempInfoList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.set-yjmb {
  .custom__form {
    .item {
      flex: 0 0 100%;
      justify-content: flex-start;
    }
    .el-textarea {
      width: 600px;
      /deep/ textarea {
        height: 100px;
      }
    }
  }
}
</style>
