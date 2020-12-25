<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 17:42:11
 -->

<template>
  <div class="zxltcs common__content">
    <td-content-header>
      专项流通参数
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">参数名：</p>
          <el-input
            v-model="configName"
            placeholder="请输入参数名"
            size="mini"
            clearable
          ></el-input>
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectLibId"
            placeholder="请选择"
            @change="selectLib"
            clearable
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">藏址：</p>
          <el-select
            filterable
            size="mini"
            v-model="czId"
            placeholder="请选择"
            ref="czId"
            clearable
          >
            <el-option
              v-for="item in cangzhiArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="dzlxId"
            placeholder="请选择"
            ref="dzlxId"
            clearable
          >
            <el-option
              v-for="item in dzlxArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="date1"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            :picker-options="startDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>- &nbsp;</span>
          <el-date-picker
            v-model="date2"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="选择结束时间"
            size="mini"
            clearable
            :picker-options="endDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadLiteratureData"
          @selection-change="handleLiteratureSelectionChange"
          border
          :data="literatureList"
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
          <el-table-column
            prop="configName"
            show-overflow-tooltip
            label="参数名"
          >
          </el-table-column>
          <el-table-column prop="libName" show-overflow-tooltip label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="czName" label="外借藏址">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
            width="70"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="brwBookNums"
            label="可借册数"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="brwDays"
            label="可借天数"
            width="105"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="operTime"
            label="操作时间"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="userName" label="操作人">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleDel="singleDeleteGzsm(scope.row)"
                @handleEdit="editGzsm(scope.row)"
              >
              </td-action-tool>
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

    <!-- 新增任务计划 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit" v-if="isAdd">
              新增专项流通参数
            </div>
            <div class="tit active" v-else>
              编辑专项流通参数
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('literatureAddForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="80px"
          size="mini"
          :model="literatureAddForm"
          :rules="rules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>专项流通参数</span>
            </div>

            <el-form-item class="item" prop="configName" label="参数名">
              <el-input
                clearable
                v-model="literatureAddForm.configName"
                ref="configName"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="brwBookNums" label="可借册数">
              <el-input
                clearable
                v-model="literatureAddForm.brwBookNums"
                ref="brwBookNums"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="brwDays" label="可借天数">
              <el-input
                clearable
                v-model="literatureAddForm.brwDays"
                ref="brwDays"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="dzlxId" label="读者类型">
              <el-select
                filterable
                v-model="literatureAddForm.dzlxId"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="dzlxId"
              >
                <el-option
                  v-for="item in dzlxArrForm"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="literatureAddForm.libId"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="libId"
                @change="selectFormLib"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" prop="czId" label="外借藏址">
              <el-select
                filterable
                v-model="literatureAddForm.czId"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="czId"
              >
                <el-option
                  v-for="item in cangzhiArrForm"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <div class="tit">
              <span>超期处理规则</span>
            </div>

            <el-form-item class="item" label="超期日罚/元" prop="overDueFine">
              <el-input
                clearable
                v-model="literatureAddForm.overDueFine"
                ref="overDueFine"
              ></el-input>
            </el-form-item>

            <el-form-item
              class="item"
              label="超期最高罚款金额/元"
              prop="overDueFineMax"
            >
              <el-input
                clearable
                v-model="literatureAddForm.overDueFineMax"
                ref="overDueFineMax"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="超期免罚天数" prop="impunityDays">
              <el-input
                clearable
                v-model="literatureAddForm.impunityDays"
                ref="impunityDays"
              ></el-input>
            </el-form-item>

            <div class="tit">
              <span>续借规则</span>
            </div>

            <el-form-item class="item" label="续借时间/天" prop="rennewDays">
              <el-input
                clearable
                v-model="literatureAddForm.rennewDays"
                ref="rennewDays"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="续借计算方式" prop="rennewMode">
              <el-select
                filterable
                v-model="literatureAddForm.rennewMode"
                placeholder="请选择"
                style="flexBasis:150px"
                ref="rennewMode"
              >
                <el-option
                  v-for="item in rennewModeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" label="最大续借次数" prop="rennewNums">
              <el-input
                clearable
                v-model="literatureAddForm.rennewNums"
                ref="rennewNums"
              ></el-input>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" label="备注" prop="remark">
              <el-input
                type="textarea"
                autosize
                clearable
                v-model="literatureAddForm.remark"
                ref="remark"
                style="width:330%"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('literatureAddForm')"
              type="primary"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { readerType, configList, configsave, configdelete } from "api/feature";
import { userCzList } from "api/public";
import { mapGetters } from "vuex";
export default {
  data() {
    let moneyRules = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("实罚金额不能为空"));
      } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(new Error("实罚金额只能填整数或保留1~2位小数"));
      } else {
        callback();
      }
    };
    let znumRules = (rule, value, callback) => {
      if (!/(^[1-9]+\d*$)|(^0$)/.test(value)) {
        callback(new Error("只能为正整数或0"));
      } else {
        callback();
      }
    };
    return {
      selectLibId: this.$store.getters.userInfo.libId,
      configName: "",
      czId: "",
      dzlxId: "",
      dzlxArr: [],
      cangzhiArr: [],
      // 多选
      multipleLiteratureSelection: [],
      loadLiteratureData: false,
      literatureList: [],
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      // 新增
      showAddSide: false,
      isAdd: true,
      rennewModeArr: [
        { label: "当时+续期", value: 1 },
        { label: "借期+续期", value: 2 }
      ],
      dzlxArrForm: [],
      cangzhiArrForm: [],
      literatureAddForm: {
        configName: "",
        brwBookNums: "",
        brwDays: "",
        dzlxId: "",
        libId: "",
        czId: "",
        overDueFine: "",
        overDueFineMax: "",
        impunityDays: "",
        rennewDays: "",
        rennewMode: "",
        rennewNums: "",
        remark: ""
      },

      rules: {
        configName: [
          { required: true, message: "请填写参数名称", trigger: "blur" }
        ],

        brwBookNums: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写可借册数", trigger: "blur" }
        ],
        brwDays: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写可借天数", trigger: "blur" }
        ],
        dzlxId: [
          { required: true, message: "请选择读者类型", trigger: "change" }
        ],
        libId: [{ required: true, message: "请选择成员馆", trigger: "change" }],
        czId: [
          { required: true, message: "请选择外借藏址", trigger: "change" }
        ],
        overDueFine: [
          { validator: moneyRules, trigger: "change" },
          { required: true, message: "请填写日罚金额", trigger: "blur" }
        ],
        overDueFineMax: [
          { validator: moneyRules, trigger: "change" },
          { required: true, message: "请填写最高罚款金额", trigger: "blur" }
        ],
        impunityDays: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写免罚天数", trigger: "blur" }
        ],
        rennewDays: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写续借时间", trigger: "blur" }
        ],
        rennewMode: [
          { required: true, message: "请选择续借计算方式", trigger: "change" }
        ],
        rennewNums: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写最大续借次数", trigger: "blur" }
        ]
      },
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.date2)
            );
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return time.getTime() < new Date(this.date1) - 8.64e7;
        }
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.getLiteratureList();
    },
    readerType() {
      readerType({ libId: this.selectLibId }).then(res => {
        this.dzlxArr = res.data.map(item => {
          return {
            label: item.mcheng,
            value: item.dzlxid
          };
        });
        if (this.dzlxArr.length > 1) {
          this.dzlxArr.unshift({ label: "全部", value: "" });
        }
      });
    },
    readerTypeForm() {
      readerType({ libId: this.literatureAddForm.libId }).then(res => {
        this.dzlxArrForm = res.data.map(item => {
          return {
            label: item.mcheng,
            value: item.dzlxid
          };
        });
        if (this.dzlxArrForm.length > 1) {
          this.dzlxArrForm.unshift({ label: "全部", value: "" });
        }
      });
    },
    czList() {
      userCzList({ libId: this.selectLibId }).then(res => {
        this.cangzhiArr = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        if (this.cangzhiArr.length > 1) {
          this.cangzhiArr.unshift({ label: "全部", value: "" });
        }
      });
    },
    czListForm() {
      userCzList({ libId: this.literatureAddForm.libId }).then(res => {
        this.cangzhiArrForm = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        if (this.cangzhiArrForm.length > 1) {
          this.cangzhiArrForm.unshift({ label: "全部", value: "" });
        }
      });
    },
    selectLib() {
      this.czList();
      this.readerType();
      this.initLiteratureList();
    },
    selectFormLib() {
      this.literatureAddForm.czId = "";
      this.literatureAddForm.dzlxId = "";
      this.czListForm();
      this.readerTypeForm();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.editGzsm(row);
    },

    getLiteratureList() {
      this.loadLiteratureData = true;
      configList({
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage,
        libId: this.selectLibId,
        czId: this.czId,
        dzlxId: this.dzlxId,
        configName: this.configName,
        startDate: this.date1,
        endDate: this.date2
      }).then(res => {
        this.loadLiteratureData = false;
        this.literatureList = res.data.dataList;
        this.totalLiteratureCount = Number(res.data.totalElements);
      });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    // 新增
    handleAdd() {
      this.showAddSide = true;
      this.isAdd = true;
      this.literatureAddForm = {
        configName: "",
        brwBookNums: "",
        brwDays: "",
        dzlxId: "",
        libId: this.$store.getters.userInfo.libId,
        czId: "",
        overDueFine: "0.00",
        overDueFineMax: "0.00",
        impunityDays: "0",
        rennewDays: "0",
        rennewMode: "",
        rennewNums: "0",
        remark: ""
      };
      // 顺序不能调，会传参出错
      this.czListForm();
      this.readerTypeForm();
    },

    // 新增接口
    configqadd() {
      configsave({
        ...this.literatureAddForm
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.$refs["literatureAddForm"].resetFields();
          this.showAddSide = false;
          this.initLiteratureList();
        }
      });
    },
    // 编辑接口
    configqedit() {
      configsave({
        ...this.literatureAddForm
      }).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.showAddSide = false;
          this.initLiteratureList();
        }
      });
    },
    // 取消提交
    cancelForm(formName) {
      this.showAddSide = false;
      this.$refs[formName].resetFields();
    },
    // 验证提交校验
    jsYz(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          if (this.isAdd) {
            this.configqadd();
          } else {
            this.configqedit();
          }
        } else {
          if (error && Object.keys(error).length > 0) {
            let keysArr = Object.keys(error);
            this.$refs[keysArr[0]].focus();
          }
          return false;
        }
      });
    },
    // 保存提交
    submitForm(formName) {
      let that = this;

      setTimeout(function() {
        that.jsYz(formName);
      }, 100);
    },
    // 编辑活动页面
    editGzsm(row) {
      this.showAddSide = true;
      this.isAdd = false;
      this.literatureAddForm.configName = row.configName;
      this.literatureAddForm.brwBookNums = row.brwBookNums;
      this.literatureAddForm.brwDays = row.brwDays;
      this.literatureAddForm.dzlxId = row.dzlxId;
      this.literatureAddForm.czId = row.czId;
      this.literatureAddForm.libId = row.libId;
      this.literatureAddForm.overDueFine = row.overDueFine;
      this.literatureAddForm.overDueFineMax = row.overDueFineMax;
      this.literatureAddForm.impunityDays = row.impunityDays;
      this.literatureAddForm.rennewDays = row.rennewDays;
      this.literatureAddForm.rennewMode = row.rennewMode;
      this.literatureAddForm.rennewNums = row.rennewNums;
      this.literatureAddForm.remark = row.remark;
      this.literatureAddForm.configId = row.configId;
      // 顺序不能调，会传参出错
      this.czListForm();
      this.readerTypeForm();
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          configdelete({ configIds: row.configId }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          configdelete({
            configIds: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.configId);
    }
  },
  activated() {
    this.czList();
    this.readerType();
    this.initLiteratureList();
  },
  mounted() {
    this.czList();
    this.readerType();
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}

/deep/ .el-form-item__label {
  min-width: 100px;
}
/deep/ .el-textarea__inner {
  height: 80px;
  min-height: 80px !important;
}

/deep/ .custom__form .item {
  align-items: center;
}
.edit__footer {
  justify-content: flex-end !important;
}
</style>
