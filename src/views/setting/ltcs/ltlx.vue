<template>
  <div class="ltlx common__content">
    <td-content-header>
      <span>流通类型管理</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="add">
            <icon-svg icon-class="icon-btn-ico-" />
            新增</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="selectRow.length ? false : true"
            @click="multDel"
          >
            <icon-svg icon-class="icon-btn-ico-1" />
            删除</el-button
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
            v-model="libId"
            placeholder="选择成员馆"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            filterable
            size="mini"
            class="group__filter_type"
            v-model="optionKey"
          >
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            placeholder="请输入搜索关键词"
            v-model="content"
            ref="focusInput"
          ></el-input>
          <el-button size="mini" type="primary" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="multipleTableBox">
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-click="rowClick"
          @row-dblclick="handleEdit"
          @selection-change="selectFunc"
          stripe
          border=""
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="daima"
            label="流通类型代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mingcheng"
            label="流通类型名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.ztai"><i></i>&nbsp;正常</div>
              <div v-else><i></i>&nbsp;注销</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="附注"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.ltlxid)"
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
          :current-page.sync="param.pageNumber"
          :page-size="param.pageSize"
        ></td-pagination>
      </div>
    </div>
    <side-wrap class="common__side_form" v-show="show" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增流通规则</div>
            <div v-else class="tit active">修改流通规则</div>
          </div>
          <i class="el-icon-close" @click="closeWrap" icon="el-icon-close"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="form"
          :rules="rules"
          class="custom__form"
          :model="form"
          label-width="auto"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <p class="tit">基本信息</p>
            <el-form-item class="item" prop="daima" label="流通类型代码">
              <el-input clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select filterable v-model="form.libid">
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="流通类型名称">
              <el-input clearable v-model="form.mingcheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注">
              <el-input
                clearable
                v-model="form.fuzhu"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-radio-group v-model="form.ztai">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">注销</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button size="mini" @click="closeWrap">取消</el-button>
            <el-button size="mini" @click="saveForm('form')" type="primary"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { flowTypeList, flowTypeSave, flowTypeDel } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_ltlx",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.optionList = [
      { value: "code", label: "流通类型代码" },
      { value: "name", label: "流通类型名称" }
    ];
    this.rules = {
      daima: [
        { required: true, message: "请输入流通类型代码", trigger: "blur" }
      ],
      mingcheng: [
        { required: true, message: "请输入流通类型名称", trigger: "blur" }
      ],
      libid: [{ required: true, message: "请选择成员馆", trigger: "blur" }]
    };
    this.baseForm = {
      daima: "",
      mingcheng: "",
      libid: this.$store.getters.userInfo.libId,
      fuzhu: "",
      ztai: true
    };
    return {
      show: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      optionKey: "name",
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取流通类型列表 */
    getFlowTypeList() {
      this.loading = !this.loading;
      flowTypeList(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },

    add() {
      this.show = !this.show;
      this.form = { ...this.baseForm };
      this.isAdd = true;
    },
    multDel() {
      let ltlxid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            ltlxid += ele.ltlxid + ",";
          });
          flowTypeDel({
            ltlxid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getFlowTypeList();
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "未选择操作项!"
        });
      }
    },
    search() {
      this.param.code = "";
      this.param.name = "";
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.getFlowTypeList();
    },

    closeWrap() {
      this.show = !this.show;
      this.$refs["form"].resetFields();
      this.form = { ...this.baseForm };
    },
    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },

    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          flowTypeSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getFlowTypeList();
            }
          });
        } else {
          return false;
        }
      });
    },

    handleEdit(row) {
      this.isAdd = false;
      this.show = true;
      this.form = { ...row };
    },
    handleDel(ltlxid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        flowTypeDel({
          ltlxid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getFlowTypeList();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getFlowTypeList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getFlowTypeList();
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    this.$refs.focusInput.focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
/deep/ .el-form-item {
  height: 28px;
}
</style>
