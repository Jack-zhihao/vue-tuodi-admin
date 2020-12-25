<!--
 * @Description: 品质阅读-参数配置
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-11 18:42:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-10 10:06:02
 -->
<template>
  <div class="opera-cspz common__content">
    <td-content-header>
      参数配置
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showEditCCDZ('add')"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleCCDZSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteCCDZ('')"
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
          <el-button type="primary" size="mini" @click="initCCDZList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="ccdzTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadCCDZData"
          @selection-change="handleCCDZSelectionChange"
          border
          :data="ccdzList"
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
            prop="address"
            label="配置地址"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="version"
            label="系统版本"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.version | getVersion }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="checkLibCode"
            label="查重系统馆代码"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="操作者">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="operTime"
            label="操作时间"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.id"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkCCDZDetail"
                @handleDel="deleteCCDZ"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCCDZSizeChange"
          @current-change="handleCCDZCurrentChange"
          :total="totalCCDZCount"
          :currentPage="currentCCDZPage"
          :pageSize="ccdzPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 编辑文献 -->
    <side-wrap
      v-loading="loadCCDZDetail"
      class="common__side_form"
      v-show="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="!addType" class="tit active">
              编辑参数配置
            </div>
            <div v-if="addType" class="tit">
              新增参数配置
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="ccdzEditForm"
          label-width="80px"
          :model="ccdzEditForm"
          :rules="ccdzFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>参数配置信息</span>
            </div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="ccdzEditForm.libId"
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
            <el-form-item
              class="item"
              prop="address"
              label="配置地址"
              style="justifyContent: flex-end"
            >
              <el-input
                clearable
                placeholder="需配置IP/端口或域名"
                v-model="ccdzEditForm.address"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="version" label="系统版本">
              <el-select
                filterable
                v-model="ccdzEditForm.version"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in systemVersions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              label-width="110px"
              class="item"
              prop="checkLibCode"
              label="查重系统馆代码"
              style="justifyContent: flex-end"
            >
              <el-input
                clearable
                v-model="ccdzEditForm.checkLibCode"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="remark" label="备注">
              <el-input
                clearable
                :rows="5"
                type="textarea"
                v-model="ccdzEditForm.remark"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('ccdzEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('ccdzEditForm')"
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
  readingConfigSave,
  readingConfigDelete,
  readingConfigList
} from "api/operation";

import { mapGetters } from "vuex";

export default {
  name: "set_wxlx",
  data() {
    this.systemVersions = [
      {
        value: 1,
        label: "Elib-V4.0"
      },
      {
        value: 2,
        label: "Elib-V4.1"
      }
    ];
    this.ccdzFormRules = {
      checkLibCode: [
        { required: true, message: "查重系统馆代码不能为空", trigger: "blur" }
      ],
      address: [
        { required: true, message: "配置地址不能为空", trigger: "blur" }
      ],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }]
    };
    return {
      // 列表相关
      multipleCCDZSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadCCDZData: false,
      ccdzList: [],
      ccdzPageSize: 15,
      currentCCDZPage: 1,
      totalCCDZCount: 0,
      currentCCDZId: "",
      // 编辑
      loadCCDZDetail: false,
      showEditSide: false,
      ccdzEditForm: {
        libId: this.$store.getters.userInfo.libId,
        address: "",
        version: 1,
        checkLibCode: "",
        remark: ""
      },
      addType: true
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  filters: {
    getVersion(val) {
      return val === 1 ? "Elib-V4.0" : "Elib-V4.1";
    }
  },
  methods: {
    // 文献列表
    initCCDZList() {
      this.currentCCDZPage = 1;
      this.setRequestObj();
      this.getCCDZList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkCCDZDetail(row.id, "", row);
    },
    handleCCDZSelectionChange(val) {
      this.multipleCCDZSelection = val.map(item => item.id);
    },
    checkCCDZDetail(id, index, data) {
      this.currentCCDZId = id;
      this.showEditCCDZ("edit");
      this.ccdzEditForm = {
        libId: data.libId || this.$store.getters.userInfo.libId,
        address: data.address || "",
        version: data.version || 1,
        checkLibCode: data.checkLibCode || "",
        remark: data.remark || ""
      };
      this.ccdzEditFormOrigin = Object.assign({}, this.ccdzEditForm); // 备份原始数据
    },
    showEditCCDZ(mode) {
      this.editMode = mode;
      this.showEditSide = true;
      if (mode === "add") {
        this.addType = true;
        this.ccdzEditFormOrigin = {
          libId: this.$store.getters.userInfo.libId,
          address: "",
          version: 1,
          checkLibCode: "",
          remark: ""
        };
        this.$nextTick(() => {
          this.resetForm("ccdzEditForm");
        });
      } else {
        this.addType = false;
      }
    },
    deleteCCDZ(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadCCDZData = true;
          readingConfigDelete({
            ids: ids ? ids : this.multipleCCDZSelection.join(",")
          })
            .then(res => {
              this.loadCCDZData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initCCDZList();
            })
            .catch(() => {
              this.loadCCDZData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
    },
    getCCDZList() {
      this.loadCCDZData = true;

      let requestObj = {
        pageNumber: this.currentCCDZPage,
        pageSize: this.ccdzPageSize,
        ...this.requestObj
      };

      readingConfigList(requestObj)
        .then(res => {
          this.loadCCDZData = false;
          this.ccdzList = res.data.dataList;
          this.totalCCDZCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadCCDZData = false;
        });
    },
    handleCCDZSizeChange(val) {
      this.ccdzPageSize = val;
      this.getCCDZList();
    },
    handleCCDZCurrentChange(val) {
      this.currentCCDZPage = val;
      this.getCCDZList();
    },
    // 文献编辑
    handleCCDZFormEdit() {
      readingConfigSave({
        ...this.ccdzEditForm,
        id: this.editMode === "edit" ? this.currentCCDZId : ""
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initCCDZList();
      });
    },
    // 通用
    resetForm(formName) {
      this.$refs[formName].resetFields();
      // 恢复原始数据
      this.ccdzEditForm = Object.assign({}, this.ccdzEditFormOrigin);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.handleCCDZFormEdit();
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.initCCDZList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 110px !important;
}
</style>
