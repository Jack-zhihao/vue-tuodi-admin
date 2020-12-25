<template>
  <div class="czgl common__content">
    <td-content-header>
      <span>藏址管理</span>
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
          <span class="label">状态：</span>
          <el-select
            filterable
            size="mini"
            v-model="state"
            placeholder="请选择"
            class="group__filter_type"
          >
            <el-option
              v-for="item in stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            placeholder="请输入藏址名称"
            v-model="czName"
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
          border=""
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column show-overflow-tooltip prop="daima" label="藏址代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mingcheng"
            label="藏址名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
            <template slot-scope="scope">
              <div v-if="!!scope.row.ztai" class="normal">
                <i></i>&nbsp;正常
              </div>
              <div v-else class="logout"><i></i>&nbsp;注销</div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="gjhj"
            label="外馆归还到本藏址"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.gjhj ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="gjwj"
            label="本藏址归还到外馆"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.gjwj ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.czid)"
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
            <div v-if="isAdd" class="tit">新增藏址</div>
            <div v-else class="tit active">修改藏址</div>
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
          size="mini"
        >
          <div class="custom__form_wrapper">
            <p class="tit">藏址信息</p>
            <el-form-item class="item" prop="daima" label="藏址代码">
              <el-input clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gjhj" label="外馆归还到本藏址">
              <el-radio-group v-model="form.gjhj">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="藏址名称">
              <el-input clearable v-model="form.mingcheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gjwj" label="本藏址归还到外馆">
              <el-radio-group v-model="form.gjwj">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select filterable v-model="form.libid" placeholder="请选择">
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="form.fuzhu"
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
            <el-button @click="closeWrap" size="mini">取消</el-button>
            <el-button @click="saveForm('form')" size="mini" type="primary"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { czFind, czSave, czDel } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_czgl",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.stateList = [
      { label: "全部", value: -1 },
      { label: "正常", value: 0 },
      { label: "注销", value: 1 }
    ];
    this.rules = {
      daima: [{ required: true, message: "请输入藏址代码", trigger: "blur" }],

      mingcheng: [
        { required: true, message: "请输入藏址名称", trigger: "blur" }
      ],
      libid: [{ required: true, message: "请选择成员馆", trigger: "blur" }]
    };
    this.baseForm = {
      libid: this.$store.getters.userInfo.libId,
      daima: "",
      mingcheng: "",
      ztai: true,
      gjhj: false,
      gjwj: false,
      fuzhu: ""
    };
    return {
      show: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      czName: "",
      state: -1,
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      hbFindList: [],
      yslxFindList: [],
      totalCount: 0,
      param: {
        state: -1,
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取预算列表 */
    getCzFind() {
      this.loading = !this.loading;
      czFind(this.param).then(res => {
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
      let czid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            czid += ele.czid + ",";
          });
          czDel({
            czid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getCzFind();
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
      // this.param.flag = this.flag;
      this.param.state = this.state;
      this.param.czName = this.czName.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.getCzFind();
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
          czSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getCzFind();
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
    handleDel(czid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        czDel({
          czid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getCzFind();
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
      this.getCzFind();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getCzFind();
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    // this.getCzFind();
    this.$refs.focusInput.focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 124px !important;
}
/deep/ .item {
  .el-input__inner {
    height: 32px;
  }
}
</style>
