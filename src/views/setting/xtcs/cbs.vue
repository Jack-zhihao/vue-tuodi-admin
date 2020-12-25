<template>
  <div class="cbs common__content">
    <td-content-header>
      出版社详细信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="add" type="primary" size="mini">
            <icon-svg icon-class="icon-btn-ico-" />
            新增</el-button
          >
          <el-button
            :disabled="selectRow.length ? false : true"
            @click="multDel"
            type="primary"
            size="mini"
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
          <el-select
            filterable
            class="group__filter_type"
            v-model="flag"
            placeholder="供应商名称"
            size="mini"
          >
            <el-option
              v-for="item in flagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            clearable
            class="group__filter_value"
            placeholder="请输入搜索关键词"
            v-model="content"
            size="mini"
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
          <el-table-column
            show-overflow-tooltip
            prop="cbscode"
            label="出版社代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbsname"
            label="出版社名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbsaddress"
            label="出版地"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbsaddcode"
            label="地区代码"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.cbsid)"
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
            <div v-if="isAdd" class="tit">新增出版社</div>
            <div v-else class="tit active">修改出版社</div>
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
            <div class="tit">
              <span>出版社信息</span>
            </div>
            <el-form-item class="item" prop="cbscode" label="出版社代码">
              <el-input clearable v-model="form.cbscode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbsaddress" label="出版地">
              <el-input clearable v-model="form.cbsaddress"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbsname" label="出版社名称">
              <el-input clearable v-model="form.cbsname"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbsaddcode" label="地区代码">
              <el-input clearable v-model="form.cbsaddcode"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button @click="closeWrap">取消</el-button>
            <el-button @click="saveForm('form')" type="primary">保存</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { cbsFind, cbsDel, cbsSave } from "api/setting";
export default {
  name: "set_cbs",
  data() {
    this.flagList = [
      { value: 0, label: "出版社代码" },
      { value: 1, label: "出版社名称" },
      { value: 2, label: "出版社地址" },
      { value: 3, label: "出版社地址代码" }
    ];
    this.rules = {
      cbscode: [
        { required: true, message: "请输入出版社代码", trigger: "blur" }
      ],
      cbsaddress: [
        { required: true, message: "请输入出版社地址", trigger: "blur" }
      ],
      cbsname: [
        { required: true, message: "请输入出版社名称", trigger: "blur" }
      ]
    };
    return {
      isAdd: true,
      show: false,
      content: "",
      flag: 1,
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      baseForm: {
        cbscode: "",
        cbsaddress: "",
        cbsname: "",
        cbsaddcode: ""
      },
      totalCount: 0,
      param: {
        flag: 1,
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /** 获取出版社列表 */
    getCbsFind() {
      this.loading = !this.loading;
      cbsFind(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          res.data.dataList.forEach(ele => {
            ele.cbsaddcode = ele.cbsaddcode || "-";
          });
          this.tableData = res.data.dataList;
          this.totalCount = +res.data.totalElements;
        }
      });
    },
    add() {
      this.isAdd = true;
      this.show = !this.show;
      this.form = { ...this.baseForm };
    },
    multDel() {
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let cbsid = "";
          this.selectRow.forEach(ele => {
            cbsid += ele.cbsid + ",";
          });
          cbsDel({
            cbsid
          }).then(res => {
            if (res.code == 0) {
              this.param.pageNumber = 1;
              this.getCbsFind();
              this.selectRow = [];
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
      this.param.pageNumber = 1;
      this.param.flag = this.flag;
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.getCbsFind();
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
          for (let key in this.form) {
            this.form[key] = this.form[key] || "";
          }
          cbsSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
            }
          });
        } else {
          return false;
        }
      });
    },
    closeWrap() {
      this.show = !this.show;
      this.form = { ...this.baseform };
      this.$refs["form"].resetFields();
    },
    handleEdit(row) {
      this.form = { ...row };
      this.show = true;
      this.isAdd = false;
    },
    handleDel(cbsid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cbsDel({
          cbsid
        }).then(res => {
          if (res.code == 0) {
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
      this.getCbsFind();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getCbsFind();
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
