<template>
  <div class="ysgl common__content">
    <td-content-header>
      <span>预算类型</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="add" type="primary" size="mini">
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
          <span class="label">成员馆：</span>
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
            v-model="flag"
            placeholder="请选择"
          >
            <el-option
              v-for="item in flagList"
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
          <el-button type="primary" @click="search" size="mini">
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
          <el-table-column show-overflow-tooltip prop="daima" label="类型代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="leixing"
            label="预算类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="附注说明"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.yslxid"
                :scope="scope.row"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.yslxid)"
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
            <div v-if="isAdd" class="tit">新增预算类型</div>
            <div v-else class="tit active">修改预算类型</div>
          </div>
          <i class="el-icon-close" @click="closeWrap"></i>
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
            <p class="tit">预算类型信息</p>
            <el-form-item class="item" prop="daima" label="类型代码">
              <el-input size="mini" clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                size="mini"
                type="textarea"
                v-model="form.fuzhu"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="leixing" label="预算类型">
              <el-input size="mini" clearable v-model="form.leixing"></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                size="mini"
                v-model="form.libId"
                placeholder=""
              >
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
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
import { yslxDel, yslxSave, yslxFind } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_yslx",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.flagList = [
      { value: "", label: "全部" },
      { value: 0, label: "类型代码" },
      { value: 1, label: "预算类型" }
    ];
    this.rules = {
      daima: [{ required: true, message: "请输入类型代码", trigger: "blur" }],
      jine: [{ required: true, message: "请输入预算金额", trigger: "blur" }],
      jzjine: [{ required: true, message: "请输入基准金额", trigger: "blur" }],
      mingcheng: [
        { required: true, message: "请输入预算名称", trigger: "blur" }
      ],
      leixing: [{ required: true, message: "请输入预算类型", trigger: "blur" }],
      laiyuan: [{ required: true, message: "请输入预算来源", trigger: "blur" }],
      libId: [{ required: true, message: "请选择成员馆", trigger: "blur" }]
    };
    this.baseForm = {
      libId: this.$store.getters.userInfo.libId,
      leixing: "",
      daima: "",
      fuzhu: ""
    };
    return {
      show: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      flag: "",
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      yslxFindList: [],
      totalCount: 0,
      param: {
        flag: "",
        content: "",
        libId: "",
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取预算类型 */
    getYslxFind() {
      this.loading = !this.loading;
      yslxFind(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },

    add() {
      this.show = !this.show;
      this.isAdd = true;
      this.form = { ...this.baseForm };
    },
    multDel() {
      let yslxid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            yslxid += ele.yslxid + ",";
          });
          yslxDel({
            yslxid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getYslxFind();
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
      this.param.flag = this.flag;
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.getYslxFind();
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
          yslxSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getYslxFind();
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
    handleDel(yslxid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        yslxDel({
          yslxid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getYslxFind();
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
      this.getYslxFind();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getYslxFind();
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
  width: 80px !important;
}
</style>
