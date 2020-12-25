<template>
  <div class="jygz common__content">
    <td-content-header>
      <span>借阅规则管理</span>
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
          <el-select filterable size="mini" v-model="libId">
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
          <el-table-column show-overflow-tooltip prop="daima" label="规则代码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mingcheng"
            label="借阅规则"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="leixing"
            label="借阅类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ceshu"
            label="可借册数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="danwei"
            label="计时单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jieqi"
            label="借阅期限"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dsfkfshi"
            label="丢失罚款方式"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="ztai"
            label="状态"
            width="45"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.ztai" class="normal"><i></i>&nbsp;正常</div>
              <div v-else class="logout"><i></i>&nbsp;注销</div>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.jygzid)"
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
            <div v-if="isAdd" class="tit">新增借阅规则</div>
            <div v-else class="tit active">修改借阅规则</div>
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
            <el-form-item class="item" prop="daima" label="规则代码">
              <el-input clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select filterable v-model="form.libid" placeholder="">
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="借阅规则">
              <el-input clearable v-model="form.mingcheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="danwei" label="计时单位">
              <el-radio-group v-model="form.danwei">
                <el-radio label="天">天</el-radio>
                <el-radio label="小时">小时</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-radio-group v-model="form.ztai">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">注销</el-radio>
              </el-radio-group>
            </el-form-item>
            <p class="tit">借阅规则</p>
            <el-form-item class="item" prop="leixing" label="借阅类型">
              <el-radio-group v-model="form.leixing">
                <el-radio label="免费">免费</el-radio>
                <el-radio label="有偿"
                  >有偿
                  <el-input
                    clearable
                    v-only-num.float="form.ycflv"
                    v-model="form.ycflv"
                    style="width:85px"
                  ></el-input>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="jieqi" label="借阅期限">
              <el-input
                clearable
                v-only-num="form.jieqi"
                v-model="form.jieqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jyqidian" label="起点计入记时">
              <el-radio-group v-model="form.jyqidian">
                <el-radio label="是">是</el-radio>
                <el-radio label="否">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="ceshu" label="可借册数">
              <el-input
                clearable
                v-only-num="form.ceshu"
                v-model="form.ceshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zxghsjian" label="最小归还时间">
              <el-input
                clearable
                v-only-num="form.zxghsjian"
                v-model="form.zxghsjian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item class="item" prop="iscjie" label="是否允许超借">
              <el-radio-group v-model="form.iscjie">
                <el-radio :label="true">允许</el-radio>
                <el-radio :label="false">不允许</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item"
              v-show="form.iscjie"
              prop="cjplv"
              label="超借处罚赔率"
            >
              <el-input
                clearable
                v-only-num.float="form.cjplv"
                v-model="form.cjplv"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              v-show="form.iscjie"
              prop="zdcjje"
              label="最大罚款金额"
            >
              <el-input
                clearable
                v-only-num.float="form.zdcjje"
                v-model="form.zdcjje"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              v-show="form.iscjie"
              prop="cjmfsjian"
              label="超借免罚时间"
            >
              <el-tooltip class="item" content="以分钟为单位">
                <el-input
                  clearable
                  v-only-num="form.cjmfsjian"
                  v-model="form.cjmfsjian"
                ></el-input>
              </el-tooltip>
            </el-form-item>
            <p class="tit">丢失处理规则</p>
            <el-form-item class="item" prop="dsfklxing" label="丢失罚款类型">
              <el-radio-group v-model="form.dsfklxing">
                <el-radio label="套价">套价</el-radio>
                <el-radio label="册价">册价</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="dsfkfshi" label="丢失罚款方式">
              <el-radio-group v-model="form.dsfkfshi">
                <el-radio label="本金">本金</el-radio>
                <el-radio label="本金+超期罚金">本金+超期罚金</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="dspeilv" label="丢失罚款赔率">
              <el-input
                clearable
                v-only-num.float="form.dspeilv"
                v-model="form.dspeilv"
              ></el-input>
            </el-form-item>
            <p class="tit">续借规则</p>
            <el-form-item class="item" prop="xjsjian" label="续借时间">
              <el-input
                v-only-num="form.xjsjian"
                clearable
                v-model="form.xjsjian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="xjjsfshi" label="续借计算方式">
              <el-radio-group v-model="form.xjjsfshi">
                <el-radio label="当时+续期">当时+续期</el-radio>
                <el-radio label="借期+续期">借期+续期</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="xjcshu" label="最大续借次数">
              <el-input
                clearable
                v-only-num="form.xjcshu"
                v-model="form.xjcshu"
              ></el-input>
            </el-form-item>
            <p class="tit">过期处理规则</p>
            <el-form-item class="item" prop="cqmfsjian" label="超期免罚时间">
              <el-input
                clearable
                v-only-num="form.cqmfsjian"
                v-model="form.cqmfsjian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cqjbqdian" label="超罚加倍起点">
              <el-input
                clearable
                v-only-num="form.cqjbqdian"
                v-model="form.cqjbqdian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cqcffshi" label="超期处罚方式">
              <el-radio-group v-model="form.cqcffshi">
                <el-radio label="罚金">罚金</el-radio>
                <el-radio label="停借">停借</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="zdfkje" label="最大罚款金额">
              <el-input
                clearable
                v-only-num.float="form.zdfkje"
                v-model="form.zdfkje"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cqflv" label="超期处罚费率">
              <el-input
                clearable
                v-only-num.float="form.cqflv"
                v-model="form.cqflv"
              ></el-input>
            </el-form-item>
            <p class="tit">污损处理规则</p>
            <el-form-item class="item" prop="wsfklxing" label="污损罚款类型">
              <el-radio-group v-model="form.wsfklxing">
                <el-radio label="套价">套价</el-radio>
                <el-radio label="册价">册价</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="wsfkfshi" label="污损罚款方式">
              <el-radio-group v-model="form.wsfkfshi">
                <el-radio label="本金">本金</el-radio>
                <el-radio label="本金+超期罚金">本金+超期罚金</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item"
              type="number"
              prop="wspeilv"
              label="污损罚款赔率"
            >
              <el-input
                clearable
                v-only-num.float="form.wspeilv"
                v-model="form.wspeilv"
              ></el-input>
            </el-form-item>
            <p class="tit">转借规则</p>
            <el-form-item class="item" prop="zjcshu" label="转借次数">
              <el-input
                clearable
                v-only-num="form.zjcshu"
                v-model="form.zjcshu"
              ></el-input>
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
import { borrowRuleList, borrowRuleSave, borrowRuleDel } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_jygz",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    let validateCjie = (rule, value, callback) => {
      if (this.form.iscjie && !value && value !== 0) {
        callback(new Error());
      } else {
        callback();
      }
    };
    this.optionList = [
      { label: "借阅规则名称", value: "name" },
      { label: "借阅规则代码", value: "code" },
      { label: "借阅类型", value: "borrowType" },
      { label: "计时单位", value: "timeUnit" },
      { label: "罚款方式", value: "fineWay" }
    ];
    this.rules = {
      libid: [{ required: true, message: "请选择成员馆", trigger: "blur" }],
      daima: [
        { required: true, message: "请输入借阅规则代码", trigger: "blur" }
      ],
      mingcheng: [
        { required: true, message: "请输入借阅规则名称", trigger: "blur" }
      ],
      ceshu: [
        { required: true, message: "请输入最大可借册数", trigger: "blur" }
      ],
      zxghsjian: [
        { required: true, message: "请输入最小归还时间", trigger: "blur" }
      ],
      dspeilv: [
        { required: true, message: "请输入丢失罚款倍率", trigger: "blur" }
      ],
      xjsjian: [{ required: true, message: "请输入续借时间", trigger: "blur" }],
      xjcshu: [
        { required: true, message: "请输入最大续借次数", trigger: "blur" }
      ],
      cqmfsjian: [
        { required: true, message: "请输入超期免罚时间", trigger: "blur" }
      ],
      cqjbqdian: [
        { required: true, message: "请输入超罚加倍起点", trigger: "blur" }
      ],
      zdfkje: [
        { required: true, message: "请输入最大罚款金额", trigger: "blur" }
      ],
      cqflv: [
        { required: true, message: "请输入超期处罚倍率", trigger: "blur" }
      ],
      wspeilv: [
        { required: true, message: "请输入污损罚款赔率", trigger: "blur" }
      ],
      zjcshu: [{ required: true, message: "请输入转借次数", trigger: "blur" }],
      cjplv: [
        {
          validator: validateCjie,
          message: "请输入超借处罚赔率",
          trigger: "blur"
        }
      ],
      zdcjje: [
        {
          validator: validateCjie,
          message: "请输入最大罚款金额",
          trigger: "blur"
        }
      ],
      cjmfsjian: [
        {
          validator: validateCjie,
          message: "请输入超借免罚时间",
          trigger: "blur"
        }
      ]
    };
    this.baseForm = {
      daima: "",
      libid: this.$store.getters.userInfo.libId,
      mingcheng: "",
      danwei: "天",
      ztai: true,
      leixing: "免费",
      ycflv: "",
      jieqi: "",
      jyqidian: "是",
      ceshu: "",
      zxghsjian: "",
      chazheng: "册价",
      dsfkfshi: "本金",
      dspeilv: "",
      xjsjian: "",
      dsfklxing: "册价",
      xjjsfshi: "当时+续期",
      xjcshu: "",
      cqmfsjian: "",
      cqjbqdian: "",
      cqcffshi: "罚金",
      zdfkje: "",
      cqflv: "",
      wsfklxing: "册价",
      wsfkfshi: "本金+超期罚金",
      wspeilv: "",
      zjcshu: "",
      iscjie: false,
      cjplv: "",
      zdcjje: "",
      cjmfsjian: ""
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
      pickerDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取预算列表 */
    getBorrowRuleList() {
      this.loading = !this.loading;
      borrowRuleList(this.param).then(res => {
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
      let jygzid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            jygzid += ele.jygzid + ",";
          });
          borrowRuleDel({
            jygzid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getBorrowRuleList();
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
      this.param.name = "";
      this.param.code = "";
      this.param.borrowType = "";
      this.param.timeUnit = "";
      this.param.fineWay = "";
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.getBorrowRuleList();
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
          let requstObj = {
            ...this.form
          };
          if (this.form.iscjie) {
            requstObj.cjplv = this.form.cjplv || "";
            requstObj.zdcjje = this.form.zdcjje || "";
            requstObj.iscjie = this.form.iscjie || "";
          }
          borrowRuleSave(requstObj).then(res => {
            this.$message.success(res.message);
            this.$refs[formName].resetFields();
            this.show = !this.show;
            this.param.pageNumber = 1;
            this.getBorrowRuleList();
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
    handleDel(jygzid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        borrowRuleDel({
          jygzid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getBorrowRuleList();
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
      this.getBorrowRuleList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getBorrowRuleList();
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
</style>

//
<style lang="less">
// .jygz {
//   .el-radio-group__jylx {
//     margin-top: 10px;
//   }
//   .ycang {
//     width: 165px;
//   }
//   .el-select-supplier {
//     width: 135px !important;
//   }
// }
//
</style>
