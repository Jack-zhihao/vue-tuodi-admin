<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-05-17 16:26:35
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-09 10:38:58
 -->

<template>
  <div class="set-yjmb common__content">
    <td-content-header>
      邮件服务器参数设置
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="add" type="primary" size="mini">
            <icon-svg icon-class="icon-btn-ico-" />
            新增</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleSelection.length ? false : true"
            @click="multDel"
          >
            <icon-svg icon-class="icon-btn-ico-1" />
            删除</el-button
          >
        </div>
      </template>
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
          @selection-change="handleSelectionChange"
          border
          :data="tempInfoList"
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
            prop="mailUsername"
            label="邮箱账号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailPassword"
            label="邮件密码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailTypeHost"
            label="smtp服务器"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mailTypePort"
            label="邮件服务器端口"
          >
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row)"
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

    <!-- 编辑新增模板 -->
    <side-wrap class="common__side_form" v-if="showSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit" v-if="isAdd">
              新增邮件参数设置
            </div>
            <div class="tit active" v-else>
              修改邮件参数设置
            </div>
          </div>
          <i class="el-icon-close" @click="showSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcfbForm"
          label-width="120px"
          :model="marcfbForm"
          :rules="marcfbFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>邮件参数信息</span>
            </div>
            <el-form-item class="item" label="smtp服务器">
              <el-select
                filterable
                v-model="marcfbForm.mailType"
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
            <el-form-item class="item" prop="mailUsername" label="邮箱账号">
              <el-input
                clearable
                v-model="marcfbForm.mailUsername"
                ref="mailUsername"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="mailPassword" label="邮箱密码">
              <el-input
                clearable
                placeholder="请输入密码"
                type="password"
                v-model="marcfbForm.mailPassword"
                ref="mailPassword"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="是否使用">
              <el-switch
                v-model="marcfbForm.userd"
                active-text="开"
                inactive-text="关"
              >
              </el-switch>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marcfbForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcfbForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showSide = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { searchFindAll, szMailSave, szMailDel } from "api/setting";

export default {
  name: "set_yjmb",
  data() {
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入密码！"));
      } else {
        let reg = /^[A-Za-z0-9]+$/;
        if (!reg.test(value)) {
          callback(new Error("密码不能有中文字符！"));
        } else {
          callback();
        }
      }
    };
    let validateUserName = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入邮箱"));
      } else {
        // 为下面正则单独取消eslint校验，否则不能提交代码
        // eslint-disable-next-line
        let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (!reg.test(value)) {
          callback(new Error("请输入正确的邮箱格式！"));
        } else {
          callback();
        }
      }
    };
    return {
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 列表
      loadBooksInfoData: false,
      tempInfoList: [],
      multipleSelection: [],
      typeOptions: [
        {
          label: "QQ邮箱",
          value: "1"
        },
        {
          label: "163邮箱/网易邮箱",
          value: "2"
        },
        {
          label: "新浪邮箱",
          value: "3"
        },
        {
          label: "搜狐邮箱",
          value: "4"
        },
        {
          label: "Foxmail邮箱",
          value: "5"
        }
      ],
      // 编辑模板
      showSide: false,
      isAdd: true,
      marcfbFormRules: {
        mailUsername: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: validateUserName, trigger: "blur" }
        ],
        mailPassword: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      marcfbForm: {
        mailType: "1",
        mailUsername: "",
        mailPassword: "",
        userd: false
      }
    };
  },
  methods: {
    // 列表
    getTempInfoList() {
      this.loadBooksInfoData = true;
      searchFindAll({
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage
      })
        .then(res => {
          this.tempInfoList = res.data.dataList;
          this.totalLiteratureCount = res.data.totalElements;
          this.loadBooksInfoData = false;
        })
        .catch(() => {
          this.loadBooksInfoData = false;
        });
    },
    rowDblclick(row) {
      this.handleEdit(row);
    },
    // 编辑
    handleEdit(val) {
      this.showSide = true;
      this.mailSetId = val.mailSetId;
      this.isAdd = false;
      this.marcfbForm = {
        mailType: String(val.mailType),
        mailUsername: val.mailUsername,
        mailPassword: val.mailPassword,
        userd: val.userd
      };
    },
    handleDel(val) {
      this.mailSetId = val.mailSetId;
      this.szMailDel();
    },
    submitForm() {
      this.$refs["marcfbForm"].validate((valid, error) => {
        if (valid) {
          // 通过表单验证
          this.szMailSave();
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    add() {
      this.isAdd = true;
      this.showSide = true;
      this.marcfbForm = {
        mailType: "1",
        mailUsername: "",
        mailPassword: "",
        userd: false
      };
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.mailSetId);
    },
    multDel() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          szMailDel({ mailSetIds: this.multipleSelection.join() }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.getTempInfoList();
            }
          });
        })
        .catch(() => {});
    },
    szMailSave() {
      let params = {
        ...this.marcfbForm
      };
      if (!this.isAdd) {
        params.mailSetId = this.mailSetId;
      }
      szMailSave(params)
        .then(res => {
          this.$message.success(res.message);
          this.showSide = false;
          this.getTempInfoList();
        })
        .catch(() => {});
    },
    szMailDel() {
      szMailDel({ mailSetIds: this.mailSetId })
        .then(res => {
          this.$message.success(res.message);
          this.getTempInfoList();
        })
        .catch(() => {});
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getTempInfoList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getTempInfoList();
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
      flex: 0 0 50%;
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
