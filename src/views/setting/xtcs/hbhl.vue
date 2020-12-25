<template>
  <div class="hbhl common__content">
    <td-content-header>
      <span>货币汇率信息</span>
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
          <span class="label">成员馆：</span>
          <el-select
            filterable
            size="mini"
            v-model="libId"
            placeholder="选择成员馆"
          >
            <el-option
              v-for="item in libList"
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
            placeholder="供应商名称"
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
          <el-button size="mini" type="primary" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div ref="multipleTableBox" class="content__table">
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
          <el-table-column show-overflow-tooltip prop="hbcode" label="货币代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hbname"
            label="货币名称"
            width=""
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hbhuilv"
            label="货币汇率"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.hbid"
                :scope="scope.row"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.hbid)"
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
    <side-wrap class="common__side_form" width="850px" v-show="show">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增货币</div>
            <div v-else class="tit active">修改货币</div>
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
            <p class="tit">货币信息</p>
            <el-form-item class="item" prop="hbcode" label="货币代码">
              <el-input clearable v-model="form.hbcode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="hbhuilv" label="货币汇率">
              <el-input
                clearable
                v-only-num.float="form.hbhuilv"
                v-model="form.hbhuilv"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="hbname" label="货币名称">
              <el-input clearable v-model="form.hbname"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select filterable v-model="form.libId" placeholder="">
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
import { hbFind, hbDel, hbSave } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_hbhl",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    this.flagList = [
      { label: "货币代码", value: 0 },
      { label: "货币名称", value: 1 }
    ];
    this.rules = {
      hbcode: [
        { required: true, message: "请输入货币代码", trigger: "blur" },
        { type: "string", max: 3, message: "货币代码最长为3位" }
      ],
      hbhuilv: [{ required: true, message: "请输入货币汇率", trigger: "blur" }],
      hbname: [{ required: true, message: "请输入货币名称", trigger: "blur" }],
      libId: [{ required: true, message: "请选择成员馆", trigger: "blur" }]
    };
    this.baseForm = {
      hbcode: "",
      hbhuilv: "",
      hbname: "",
      libId: this.$store.getters.userInfo.libId
    };
    return {
      isAdd: false,
      show: false,
      flag: 1,
      content: "",
      libId: this.$store.getters.userInfo.libId,
      loading: false,
      tableData: [],
      selectRow: [],
      form: {},
      totalCount: 0,
      param: {
        flag: 1,
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取货币汇率列表 */
    getHbFind() {
      this.loading = !this.loading;
      hbFind(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.tableData = [...res.data.dataList];
          this.totalCount = +res.data.totalElements;
        }
      });
    },
    add() {
      this.show = !this.show;
      this.isAdd = true;
      this.form = { ...this.baseForm };
    },
    multDel() {
      let hbid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.map(ele => {
            hbid += ele.hbid + ",";
          });
          hbDel({
            hbid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getHbFind();
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
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.param.flag = this.flag;
      this.param.libId = this.libId;
      this.getHbFind();
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          hbSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getHbFind();
            }
          });
        } else {
          return false;
        }
      });
    },
    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    closeWrap() {
      this.show = !this.show;
      this.form = { ...this.baseForm };
      this.$refs["form"].resetFields();
      this.isAdd = false;
    },
    handleEdit(row) {
      this.show = true;
      this.isAdd = false;
      this.form = { ...row };
    },
    handleDel(hbid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        hbDel({
          hbid
        }).then(res => {
          if (res.code == 0) {
            this.selectRow = [];
            this.param.pageNumber = 1;
            this.getHbFind();
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
      this.getHbFind();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getHbFind();
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
