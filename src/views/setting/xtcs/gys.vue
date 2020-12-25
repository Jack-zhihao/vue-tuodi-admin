<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 20:03:01
 -->
<template>
  <div class="gys common__content">
    <td-content-header>
      <span>供应商详细信息</span>
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
    <!-- 列表内容 -->
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
          <el-table-column
            show-overflow-tooltip
            prop="gysCode"
            label="供应商代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysName"
            label="供应商名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysAddr"
            label="供应商地址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysCont"
            label="联系人"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysTele"
            label="联系电话"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cygName"
            label="成员馆"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.gysId)"
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
    <!-- 新增/编辑 弹窗 -->
    <side-wrap class="common__side_form" v-if="show" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增供应商</div>
            <div v-else class="tit active">修改供应商</div>
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
            <div class="tit">
              <span>权限信息</span>
            </div>
            <el-form-item class="item" prop="gysCode" label="供应商代码">
              <el-input clearable v-model="form.gysCode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysPass" label="供应商密码">
              <el-input
                clearable
                v-model="form.gysPass"
                type="password"
                show-password
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysName" label="供应商名称">
              <el-input clearable v-model="form.gysName"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysPass2" label="确认密码">
              <el-input
                type="password"
                show-password
                clearable
                v-model="form.gysPass2"
              ></el-input>
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
            <div class="tit">
              <span>更多信息</span>
            </div>
            <el-form-item class="item" prop="gysCont" label="联系人">
              <el-input clearable v-model="form.gysCont"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysBank" label="开户行">
              <el-input clearable v-model="form.gysBank"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysTele" label="联系电码">
              <el-input clearable v-model="form.gysTele"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysAcco" label="供应商账号">
              <el-input clearable v-model="form.gysAcco"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysFax" label="传真号码">
              <el-input clearable v-model="form.gysFax"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysStat" label="供应商状态">
              <el-radio-group v-model="form.gysStat">
                <el-radio label="正常">正常</el-radio>
                <el-radio label="注销">注销</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="gysPost" label="邮政编码">
              <el-input clearable v-model="form.gysPost"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysCred" label="信用评分">
              <el-rate
                :colors="['#FE8900', '#FE8900', '#FE8900']"
                v-model="form.gysCred"
              ></el-rate>
            </el-form-item>
            <el-form-item class="item" prop="gysMail" label="电子邮件">
              <el-input clearable v-model="form.gysMail"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="haschildlib" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="form.gysRema"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysAddr" label="供应商地址">
              <el-input clearable v-model="form.gysAddr"></el-input>
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
import { mapGetters } from "vuex";
import { gysFind, gysDel, gysSave } from "api/setting";
export default {
  name: "set_gys",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "" && !this.form.gysPass) {
        callback();
      } else if (value !== this.form.gysPass && this.form.gysPass) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    this.flagList = [
      { value: 0, label: "供应商代码" },
      { value: 1, label: "供应商名称" },
      { value: 2, label: "供应商地址" },
      { value: 3, label: "联系人" },
      { value: 4, label: "联系电话" }
    ];
    this.baseForm = {
      libId: this.$store.getters.userInfo.libId,
      gysCode: "",
      cygName: "",
      gysPass: "",
      gysPass2: "",
      gysName: "",
      gysCont: "",
      gysBank: "",
      gysTele: "",
      gysAcco: "",
      gysFax: "",
      gysPost: "",
      gysMail: "",
      gysAddr: "",
      gysStat: "正常",
      gysRema: "",
      gysCred: 0
    };
    this.rules = {
      gysCode: [
        { required: true, message: "请输入供应商代码", trigger: "blur" }
      ],
      gysName: [
        { required: true, message: "请输入供应商名称", trigger: "blur" }
      ],
      libId: [{ required: true, message: "请选择成员馆", trigger: "blur" }],
      gysPass: [
        { required: false, message: "请输入供应商密码", trigger: "blur" }
      ],
      gysPass2: [{ validator: validatePass2, trigger: "blur" }]
    };
    return {
      show: false,
      loading: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      commLibList: [],
      flag: 1,
      content: "",
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
    /** 获取供应商列表 */
    getGysFind() {
      this.loading = !this.loading;
      gysFind(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          res.data.dataList.forEach(ele => {
            ele.gysPass2 = ele.gysPass;
            ele.gysCred = +ele.gysCred;
          });
          this.tableData = [...res.data.dataList];
          this.totalCount = +res.data.totalElements;
        }
      });
    },
    search() {
      this.param.pageNumber = 1;
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.param.flag = this.flag;
      this.param.libId = this.libId;
      this.getGysFind();
    },
    add() {
      this.isAdd = true;
      this.show = !this.show;
      this.form = { ...this.baseForm };
    },
    multDel() {
      let gysId = ""; /**供应商id */
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            gysId += ele.gysId + ",";
          });
          gysDel({
            gysId
          }).then(res => {
            if (res.code == 0) {
              this.param.pageNumber = 1;
              this.getGysFind();
              /**操作提示 */
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

    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleEdit(row) {
      this.isAdd = false;
      this.form = { ...row };
      this.show = true;
    },
    handleDel(gysId) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        gysDel({
          gysId
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getGysFind();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    closeWrap() {
      this.show = !this.show;
      this.$refs["form"].resetFields();
      this.form = { ...this.baseForm };
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          gysSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.getGysFind();
            }
          });
        } else {
          return false;
        }
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getGysFind();
    },
    handleCurrentChange(currentPage) {
      this.param.pageNumber = currentPage;
      this.getGysFind();
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
  padding-right: 2px;
  margin-right: 12px;
  &::after {
    position: absolute;
    right: -11px !important;
  }
}
/deep/ .custom__form_wrapper {
  .el-form-item:nth-child(2n -1) {
    justify-content: flex-end !important;
    -webkit-box-pack: end !important;
  }
  .el-radio-group {
    width: 230px;
  }
  .el-rate {
    width: 230px;
  }
}
</style>
