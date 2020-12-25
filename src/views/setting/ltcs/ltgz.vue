<template>
  <div class="ltgz common__content">
    <td-content-header>
      <span>流通规则管理</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="add">
            <icon-svg icon-class="icon-btn-ico-" />
            新增</el-button
          >
          <el-button size="mini" type="primary" @click="batchAdd">
            <icon-svg icon-class="icon-btn-ico-" />
            批新增</el-button
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
            @change="changeLib"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="readerId"
            placeholder="选择读者类型"
            clearable
          >
            <el-option
              v-for="item in readerArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">流通类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="liuTId"
            placeholder="选择流通类型"
            clearable
          >
            <el-option
              v-for="item in liuTArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">借阅规则：</p>
          <el-select
            filterable
            size="mini"
            v-model="jygzId"
            placeholder="选择借阅规则"
            clearable
          >
            <el-option
              v-for="item in jygzArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">馆藏地址：</p>
          <el-select
            filterable
            size="mini"
            v-model="guanCId"
            placeholder="选择馆藏地址"
            clearable
          >
            <el-option
              v-for="item in guanCArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
          @row-dblclick="rowDblclick"
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
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerTypeCode"
            label="读者类型代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flowTypeCode"
            label="流通类型代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="borrowRuleCode"
            label="借阅规则代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libAdressCode"
            label="馆藏地址代码"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :data="scope.row"
                :index="scope.$index"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit"
                @handleDel="handleDel(scope.row)"
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
            <el-form-item class="item" prop="dzlxid" label="读者类型代码">
              <el-select
                filterable
                v-model="form.dzlxid"
                :disabled="form.guanji ? false : true"
                @change="linkReaderTypeData"
              >
                <el-option
                  v-for="option in readerTypeList"
                  :key="option.dzlxid"
                  :label="option.daima"
                  :value="option.dzlxid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ltlxid" label="流通类型代码">
              <el-select filterable v-model="form.ltlxid">
                <el-option
                  v-for="option in flowTypeList"
                  :key="option.ltlxid"
                  :label="option.daima"
                  :value="option.ltlxid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" prop="guanji" label="成员馆">
              <el-radio-group
                @change="linkReaderType(form.guanji)"
                v-model="form.guanji"
              >
                <el-radio :label="true">本馆</el-radio>
                <el-radio :label="false">外馆</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="zhuanxiang" label="专项">
              <el-radio-group v-model="form.zhuanxiang">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="jygzid" label="借阅规则代码">
              <el-select filterable v-model="form.jygzid">
                <el-option
                  v-for="option in borrowRuleList"
                  :key="option.jygzid"
                  :label="option.daima"
                  :value="option.jygzid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="gcdzid_temp" label="馆藏地址代码">
              <el-select
                filterable
                v-model="form.gcdzid_temp"
                :multiple="isAdd"
                class="multi line"
                collapse-tags
              >
                <el-option
                  v-for="option in libCzList"
                  :key="option.czid"
                  :label="option.daima"
                  :value="option.czid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注">
              <el-input
                clearable
                v-model="form.fuzhu"
                type="textarea"
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
    <!-- 批量新增窗口 -->
    <side-wrap
      class="common__side_form"
      v-show="showBatchAdd"
      width="850px"
      v-loading="sideWrapLoading"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">批新增流通规则</div>
          </div>
          <i
            class="el-icon-close"
            @click="closeBatchAdd('batchForm')"
            icon="el-icon-close"
          ></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="batchForm"
          :rules="batchRules"
          class="custom__form"
          :model="batchForm"
          label-width="auto"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <p class="tit"></p>
            <el-form-item
              class="item item1"
              prop="copyRules"
              label="将流通规则复制到"
              style="width:120px"
            >
              <el-select
                filterable
                v-model="batchForm.copyRules"
                clearable
                @change="selectTarget"
              >
                <el-option
                  v-for="option in copyRulesArr"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item class="item item1" prop="typeId" :label="ziduanName">
              <el-select
                filterable
                clearable
                v-model="batchForm.typeId"
                @change="handleSelectName"
              >
                <el-option
                  v-for="option in typeArr"
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
            <el-button size="mini" @click="closeBatchAdd('batchForm')"
              >取消</el-button
            >
            <el-button
              size="mini"
              @click="saveBatchForm('batchForm')"
              type="primary"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import {
  userCzList,
  readerType,
  flowType,
  borrowRule,
  czListByLibIds
} from "api/public";
import {
  flowRuleDel,
  flowRuleList,
  flowRuleSave,
  flowRuleBatchAdd
} from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_ltgz",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.rules = {
      dzlxid: [
        { required: true, message: "请选择读者类型", trigger: "change" }
      ],
      gcdzid_temp: [
        { required: true, message: "请选择馆藏地址", trigger: "change" }
      ],
      ltlxid: [
        { required: true, message: "请选择流通类型", trigger: "change" }
      ],
      jygzid: [{ required: true, message: "请选择借阅规则", trigger: "change" }]
    };
    this.batchRules = {
      copyRules: [
        {
          required: true,
          message: "请选择要复制到的指定目标",
          trigger: "change"
        }
      ],
      typeId: [
        { required: true, message: "请选择要操作的选项", trigger: "change" }
      ]
    };
    this.baseForm = {
      ltgzid: "",
      // daima: "",
      dzlxid: "",
      dzlxid2: "",
      gcdzid: "",
      gcdzid_temp: "",
      ltlxid: "",
      jygzid: "",
      fuzhu: "",
      guanji: true,
      zhuanxiang: false
    };
    return {
      show: false,
      showBatchAdd: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      // optionKey: "readerTypeCode",
      readerId: "",
      readerArr: [],
      liuTId: "",
      liuTArr: [],
      jygzId: "",
      jygzArr: [],
      guanCId: "",
      guanCArr: [],
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      sideWrapLoading: false,
      form: {},
      libCzList: [],
      readerTypeList: [],
      borrowRuleList: [],
      flowTypeList: [],
      totalCount: 0,
      editSign: false,
      param: {
        pageSize: 15,
        pageNumber: 1
      },
      batchForm: {
        typeId: "",
        copyRules: "dzlx"
      },
      ziduanName: "读者类型",
      selectName: "",
      typeArr: [],
      copyRulesArr: [
        { label: "读者类型", value: "dzlx" },
        { label: "流通类型", value: "ltlx" },
        { label: "馆藏地址", value: "gcdz" },
        { label: "借阅规则", value: "jygz" }
      ]
    };
  },
  methods: {
    /**获取流通规则列表 */
    getFlowRuleList() {
      this.loading = !this.loading;
      flowRuleList(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },

    //馆际关联读者类型
    linkReaderType(guanji) {
      if (guanji) {
        this.form.dzlxid = this.form.dzlxid2;
      } else {
        this.form.dzlxid = "xtnz";
      }
    },
    linkReaderTypeData() {
      this.form.dzlxid2 = this.form.dzlxid;
    },

    initOption() {
      this.getReaderTypeList();
      this.getBorrowRuleList();
      this.getFlowTypeList();
      this.getCzList();
    },
    /**获取读者类型列表 */
    getReaderTypeList() {
      let libId = this.$store.getters.userInfo.libId;
      if (this.editSign) {
        libId = this.libId;
      }
      readerType({
        libId,
        pageSize: 1000
      }).then(res => {
        if (res.code == 0) {
          this.readerTypeList = [...res.data];
        }
      });
    },
    /**获取借阅规则列表 */
    getBorrowRuleList() {
      let libId = this.$store.getters.userInfo.libId;
      if (this.editSign) {
        libId = this.libId;
      }
      borrowRule({
        libId,
        pageSize: 1000
      }).then(res => {
        if (res.code == 0) {
          this.borrowRuleList = res.data;
        }
      });
    },
    /**获取流通类型列表 */
    getFlowTypeList() {
      let libId = this.$store.getters.userInfo.libId;
      if (this.editSign) {
        libId = this.libId;
      }
      flowType({
        libId
      }).then(res => {
        if (res.code == 0) {
          this.flowTypeList = res.data;
        }
      });
    },
    /**获取藏址列表 */
    getCzList() {
      let libId = this.$store.getters.userInfo.libId;
      if (this.editSign) {
        libId = this.libId;
      }
      userCzList({
        libId,
        pageSize: 1000
      }).then(res => {
        if (res.code == 0) {
          this.libCzList = res.data;
        }
      });
    },
    add() {
      this.show = !this.show;
      this.form = { ...this.baseForm };
      this.$refs["form"].resetFields();
      this.isAdd = true;
      this.initOption();
    },
    batchAdd() {
      this.showBatchAdd = true;
      this.readerTypeMethod();
      this.batchForm = {
        copyRules: "dzlx",
        typeId: ""
      };
      this.ziduanName = "读者类型";
    },
    closeBatchAdd(form) {
      this.$refs[form].resetFields();
      this.showBatchAdd = false;
    },
    saveBatchForm(form) {
      this.$refs[form].validate((valid, error) => {
        if (valid) {
          // 弹窗是否确认
          this.$confirm(
            `确定将符合查询条件的所有流通规则，复制到${this.ziduanName}` +
              `(${this.selectName})?`,
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
            .then(() => {
              // 确认复制
              this.flowRuleBatchAdd();
            })
            .catch(() => {
              // 取消确认
            });
        } else {
          if (error) {
            return false;
          }
        }
      });
    },
    flowRuleBatchAdd() {
      this.sideWrapLoading = true;
      let attr = "";
      switch (this.ziduanName) {
        case "读者类型":
          attr = "targetDzlxId";
          break;
        case "流通类型":
          attr = "targetLtlxId";
          break;
        case "馆藏地址":
          attr = "targetCzId";
          break;
        case "借阅规则":
          attr = "targetJygzId";
          break;
      }
      let params = {
        libId: this.libId,
        czId: this.guanCId,
        ltlxId: this.liuTId,
        jygzId: this.jygzId,
        dzlxId: this.readerId
      };
      params[attr] = this.batchForm.typeId;
      flowRuleBatchAdd(params).then(res => {
        this.sideWrapLoading = false;
        this.$message.success(res.message);
        this.$refs["batchForm"].resetFields();
        this.showBatchAdd = false;
        this.getFlowRuleList();
      });
    },
    multDel() {
      let ltgzid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            ltgzid += ele.ltgzid + ",";
          });
          flowRuleDel({
            ltgzid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getFlowRuleList();
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
      this.param.flowRuleCode = "";
      this.param.readerTypeCode = "";
      this.param.libAdressCode = "";
      this.param.flowType = "";
      this.param.borrowRuleCode = "";
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.param.dzlxId = this.readerId;
      this.param.jygzId = this.jygzId;
      this.param.ltlxId = this.liuTId;
      this.param.czId = this.guanCId;
      this.getFlowRuleList();
    },

    closeWrap() {
      this.show = !this.show;
      this.$refs["form"].resetFields();
      this.form = { ...this.baseForm };
      this.editSign = false;
    },
    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },

    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleEdit("", "", row);
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.form.gcdzid = this.form.gcdzid_temp.join(",");
          } else {
            this.form.gcdzid = this.form.gcdzid_temp;
          }
          flowRuleSave(this.form).then(res => {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.show = !this.show;
            setTimeout(() => {
              this.form = Object.assign({}, this.baseForm);
              this.$refs["form"].clearValidate();
            }, 500);
            this.param.pageNumber = 1;
            this.getFlowRuleList();
          });
        } else {
          return false;
        }
      });
    },

    handleEdit(id, index, row) {
      this.isAdd = false;
      this.show = true;
      row.gcdzid_temp = row.gcdzid;
      this.form = { ...row };
      this.form.dzlxid2 = this.form.dzlxid;
      this.editSign = true;
      this.initOption();
    },
    handleDel(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        flowRuleDel({
          ltgzid: row.ltgzid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getFlowRuleList();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    // 筛选馆藏地址
    czListByLibIds(home) {
      czListByLibIds({ libId: this.libId }).then(res => {
        if (home) {
          this.guanCId = "";
          if (res.data.length > 1) {
            this.guanCArr.push({ value: "", label: "全部" });
          }
          res.data.forEach(item => {
            this.guanCArr.push({ value: item.czid, label: item.daima });
          });
        } else {
          // 批新增用数据
          this.typeArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.czid
            };
          });
        }
      });
    },
    // 筛选借阅规则
    borrowRuleMethod(home) {
      borrowRule({ libId: this.libId }).then(res => {
        if (home) {
          this.jygzId = "";
          let newArr = [];
          newArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.jygzid
            };
          });
          if (newArr.length > 1) {
            newArr.unshift({ value: "", label: "全部" });
          }
          this.jygzArr = newArr;
        } else {
          // 批新增用数据
          this.typeArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.jygzid
            };
          });
        }
      });
    },
    // 筛选流通类型
    flowTypeMethod(home) {
      flowType({ libId: this.libId }).then(res => {
        if (home) {
          this.liuTId = "";
          let newArr = [];
          newArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.ltlxid
            };
          });
          if (newArr.length > 1) {
            newArr.unshift({ value: "", label: "全部" });
          }
          this.liuTArr = newArr;
        } else {
          // 批新增用数据
          this.typeArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.ltlxid
            };
          });
        }
      });
    },
    // 筛选读者类型
    readerTypeMethod(home) {
      readerType({ libId: this.libId }).then(res => {
        if (home) {
          this.readerId = "";
          let newArr = [];
          newArr = res.data.map(item => {
            return {
              value: item.dzlxid,
              label: item.daima
            };
          });
          if (newArr.length > 1) {
            newArr.unshift({ value: "", label: "全部" });
          }
          this.readerArr = newArr;
        } else {
          // 批新增用数据
          this.typeArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.dzlxid
            };
          });
        }
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getFlowRuleList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getFlowRuleList();
    },
    selectTarget(val) {
      if (val === "dzlx") {
        this.ziduanName = "读者类型";
        this.readerTypeMethod();
      } else if (val === "ltlx") {
        this.ziduanName = "流通类型";
        this.flowTypeMethod();
      } else if (val === "gcdz") {
        this.ziduanName = "馆藏地址";
        this.czListByLibIds();
      } else if (val === "jygz") {
        this.ziduanName = "借阅规则";
        this.borrowRuleMethod();
      }
    },
    handleSelectName(val) {
      this.typeArr.forEach(item => {
        if (item.value === val) {
          this.selectName = item.label;
        }
      });
    },
    changeLib() {
      this.czListByLibIds("home");
      this.borrowRuleMethod("home");
      this.flowTypeMethod("home");
      this.readerTypeMethod("home");
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    // this.$refs.focusInput.focus();
    this.czListByLibIds("home");
    this.borrowRuleMethod("home");
    this.flowTypeMethod("home");
    this.readerTypeMethod("home");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
/deep/ .item1 {
  .el-form-item__label {
    width: 140px !important;
    white-space: nowrap;
  }
}
</style>
