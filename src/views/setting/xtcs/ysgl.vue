<template>
  <div class="ysgl common__content">
    <td-content-header>
      <span>预算管理</span>
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
          <el-table-column show-overflow-tooltip prop="daima" label="预算代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mingcheng"
            label="预算名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yslxName"
            label="预算类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="laiyuan"
            label="预算来源"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="hbCode"
            label="货币代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jine"
            label="预算金额"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jzjine"
            label="基准金额"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.ysid)"
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
            <div v-if="isAdd" class="tit">新增预算</div>
            <div v-else class="tit active">修改预算</div>
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
            <p class="tit">基本信息</p>
            <el-form-item class="item" prop="daima" label="预算代码">
              <el-input clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                @change="getYslxFind"
                v-model="form.libid"
                placeholder="请选择"
              >
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jine" label="预算金额">
              <el-input
                clearable
                v-only-num.float="form.jine"
                v-model="form.jine"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="预算名称">
              <el-input clearable v-model="form.mingcheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jzjine" label="基准金额">
              <el-input
                clearable
                v-only-num.float="form.jzjine"
                v-model="form.jzjine"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yslxid" label="预算类型">
              <el-select filterable v-model="form.yslxid" placeholder="请选择">
                <el-option
                  v-for="option in yslxFindList"
                  :key="option.yslxid"
                  :label="option.leixing"
                  :value="option.yslxid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="hbid" label="货币">
              <el-select filterable v-model="form.hbid" placeholder="请选择">
                <el-option
                  v-for="option in hbFindList"
                  :key="option.hbid"
                  :label="option.hbname"
                  :value="option.hbid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="laiyuan" label="预算来源">
              <el-input clearable v-model="form.laiyuan"></el-input>
            </el-form-item>
            <p class="tit">更多信息</p>
            <el-form-item class="item" prop="lianxiren" label="联系人">
              <el-input clearable v-model="form.lianxiren"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="dizhi" label="地址">
              <el-input clearable v-model="form.dizhi"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="dianhua" label="电码号码">
              <el-input clearable v-model="form.dianhua"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input type="textarea" v-model="form.fuzhu"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="youxiang" label="电子邮件">
              <el-input clearable v-model="form.youxiang"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="youbian" label="邮政编码">
              <el-input clearable v-model="form.youbian"></el-input>
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
import { yslxList } from "api/public";
import { ysFind, ysDel, ysSave } from "api/setting";
import { hbList } from "api/public";
import { mapGetters } from "vuex";
export default {
  name: "set_ysgl",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.flagList = [
      { value: 0, label: "预算代码" },
      { value: 1, label: "预算名称" },
      { value: 2, label: "预算类型" },
      { value: 3, label: "预算来源" },
      { value: 4, label: "货币代码" }
    ];
    this.rules = {
      daima: [{ required: true, message: "请输入预算代码", trigger: "blur" }],
      jine: [{ required: true, message: "请输入预算金额", trigger: "blur" }],
      jzjine: [{ required: true, message: "请输入基准金额", trigger: "blur" }],
      mingcheng: [
        { required: true, message: "请输入预算名称", trigger: "blur" }
      ],
      hbid: [{ required: true, message: "请选择货币", trigger: "blur" }],
      yslxid: [{ required: true, message: "请选择预算类型", trigger: "blur" }],
      laiyuan: [{ required: true, message: "请输入预算来源", trigger: "blur" }],
      libid: [{ required: true, message: "请选择成员馆", trigger: "blur" }]
    };
    this.baseForm = {
      libid: this.$store.getters.userInfo.libId,
      ysid: "",
      daima: "",
      mingcheng: "",
      yslxid: "",
      laiyuan: "",
      hbid: "",
      jine: "",
      jzjine: "",
      lianxiren: "",
      dizhi: "",
      dianhua: "",
      youxiang: "",
      fuzhu: ""
    };
    return {
      show: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      flag: 0,
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      hbFindList: [],
      yslxFindList: [],
      totalCount: 0,
      param: {
        flag: 0,
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取预算列表 */
    getYsFind() {
      this.loading = !this.loading;
      ysFind(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },
    /**获取货币列表 */
    getHbFind() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        if (res.code == 0) {
          this.hbFindList = [...res.data];
        }
      });
    },
    /**获取预算类型 */
    getYslxFind() {
      yslxList({
        libId: this.form.libid || this.libId
      }).then(res => {
        if (res.code == 0) {
          this.yslxFindList = [...res.data];
        }
      });
    },
    add() {
      this.show = !this.show;
      this.form = { ...this.baseForm };
      this.getYslxFind();
    },
    multDel() {
      let ysid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            ysid += ele.ysid + ",";
          });
          ysDel({
            ysid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getYsFind(this.param);
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
      this.getYsFind(this.param);
    },

    closeWrap() {
      this.show = !this.show;
      this.isAdd = true;
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
          ysSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.closeWrap();
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getYsFind(this.param);
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
      this.getYslxFind();
    },
    handleDel(ysid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        ysDel({
          ysid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getYsFind(this.param);
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
      this.getYsFind(this.param);
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getYsFind(this.param);
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    this.getHbFind();
    this.getYslxFind();
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
