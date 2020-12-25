<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2020-02-13 09:17:53
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 16:58:22
 -->
<template>
  <div class="set-marcgc common__content">
    <td-content-header>
      MARC馆藏
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddMarcgc"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMarcgcSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteMarcgc('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__table" ref="marcgcTableForm">
        <el-table
          ref="marcgcTable"
          @row-click="marcgcClickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadMarcgcData"
          @selection-change="handleSelectionChange"
          border
          :data="marcgcList"
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
            prop="marcName"
            show-overflow-tooltip
            label="MARC类型"
          >
          </el-table-column>
          <el-table-column
            prop="marcBookField"
            show-overflow-tooltip
            label="馆藏字段"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libId" label="财产馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="czId" label="财产馆藏址">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="wxlyuan"
            label="文献来源"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ltlxid" label="流通类型">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="batchId" label="批次">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="inTime" label="入库日期">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.id"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="editMarcgcDetail"
                @handleDel="handleDel(scope.row)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 新增MARC馆藏 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增MARC馆藏
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSideCancle"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcgcAddForm"
          label-width="90px"
          :model="marcgcAddForm"
          :rules="marcgcFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC馆藏信息</span>
            </div>
            <el-form-item class="item" prop="marclxid" label="MARC类型">
              <el-select
                filterable
                v-model="marcgcAddForm.marclxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marcOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="marcBookField" label="馆藏字段">
              <el-input
                clearable
                v-model="marcgcAddForm.marcBookField"
                maxlength="3"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="tiaoma" label="条形码">
              <el-input
                clearable
                v-model="marcgcAddForm.tiaoma"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                clearable
                v-model="marcgcAddForm.sshao"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cejia" label="册价">
              <el-input
                clearable
                v-model="marcgcAddForm.cejia"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="taojia" label="套价">
              <el-input
                clearable
                v-model="marcgcAddForm.taojia"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId2" label="财产馆">
              <el-input
                clearable
                v-model="marcgcAddForm.libId2"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="czId2" label="财产馆藏址">
              <el-input
                clearable
                v-model="marcgcAddForm.czId2"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="现在馆">
              <el-input
                clearable
                v-model="marcgcAddForm.libId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="czId" label="现在馆藏址">
              <el-input
                clearable
                v-model="marcgcAddForm.czId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jcmshu" label="卷册描述">
              <el-input
                clearable
                v-model="marcgcAddForm.jcmshu"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ltlxid" label="流通类型">
              <el-input
                clearable
                v-model="marcgcAddForm.ltlxid"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gys" label="供应商">
              <el-input
                clearable
                v-model="marcgcAddForm.gys"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="batchId" label="批次">
              <el-input
                clearable
                v-model="marcgcAddForm.batchId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ysuan" label="预算">
              <el-input
                clearable
                v-model="marcgcAddForm.ysuan"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-input
                clearable
                v-model="marcgcAddForm.zdfangshi"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-input
                clearable
                v-model="marcgcAddForm.jzleixing"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="inTime" label="入库日期">
              <el-input
                clearable
                v-model="marcgcAddForm.inTime"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="wxlyuan" label="文献来源">
              <el-input
                clearable
                v-model="marcgcAddForm.wxlyuan"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('marcgcAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcgcAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSideCancle">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑MARC馆藏 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑MARC馆藏
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcgcEditForm"
          label-width="90px"
          :model="marcgcEditForm"
          :rules="marcgcFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC馆藏信息</span>
            </div>
            <el-form-item class="item" prop="marclxid" label="MARC类型">
              <el-select
                filterable
                v-model="marcgcEditForm.marclxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marcOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="marcBookField" label="馆藏字段">
              <el-input
                clearable
                v-model="marcgcEditForm.marcBookField"
                maxlength="3"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="tiaoma" label="条形码">
              <el-input
                clearable
                v-model="marcgcEditForm.tiaoma"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                clearable
                v-model="marcgcEditForm.sshao"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cejia" label="册价">
              <el-input
                clearable
                v-model="marcgcEditForm.cejia"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="taojia" label="套价">
              <el-input
                clearable
                v-model="marcgcEditForm.taojia"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId2" label="财产馆">
              <el-input
                clearable
                v-model="marcgcEditForm.libId2"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="czId2" label="财产馆藏址">
              <el-input
                clearable
                v-model="marcgcEditForm.czId2"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="现在馆">
              <el-input
                clearable
                v-model="marcgcEditForm.libId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="czId" label="现在馆藏址">
              <el-input
                clearable
                v-model="marcgcEditForm.czId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jcmshu" label="卷册描述">
              <el-input
                clearable
                v-model="marcgcEditForm.jcmshu"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ltlxid" label="流通类型">
              <el-input
                clearable
                v-model="marcgcEditForm.ltlxid"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gys" label="供应商">
              <el-input
                clearable
                v-model="marcgcEditForm.gys"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="batchId" label="批次">
              <el-input
                clearable
                v-model="marcgcEditForm.batchId"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ysuan" label="预算">
              <el-input
                clearable
                v-model="marcgcEditForm.ysuan"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-input
                clearable
                v-model="marcgcEditForm.zdfangshi"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-input
                clearable
                v-model="marcgcEditForm.jzleixing"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="inTime" label="入库日期">
              <el-input
                clearable
                v-model="marcgcEditForm.inTime"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="wxlyuan" label="文献来源">
              <el-input
                clearable
                v-model="marcgcEditForm.wxlyuan"
                maxlength="1"
                @blur="checkForm"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('marcgcEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcgcEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { getMarcType } from "api/public";
import {
  marcBookFieldList,
  marcBookFieldDelete,
  getByIdOrMarcLxId,
  marcBookFieldSave
} from "api/setting";

export default {
  name: "set_marcgc",
  data() {
    const checkSubFieldValidate = (rule, value, callback) => {
      if (value === "") {
        return callback();
      }
      if (!/^[0-9a-zA-Z]+$/.test(value)) {
        return callback(new Error("请输入1位数字或者a-z大小写的字母"));
      }
      if (this.showAddSide) {
        for (let i = 0; i < Object.keys(this.marcgcAddForm).length; i++) {
          let key = Object.keys(this.marcgcAddForm)[i];
          if (rule.field !== key) {
            if (this.marcgcAddForm[key] === value && value !== null) {
              return callback(new Error(`子字段 ${value} 已存在`));
            }
          }
        }
      } else {
        for (let i = 0; i < Object.keys(this.marcgcEditForm).length; i++) {
          let key = Object.keys(this.marcgcEditForm)[i];
          if (rule.field !== key) {
            if (this.marcgcEditForm[key] === value && value !== null) {
              return callback(new Error(`子字段 ${value} 已存在`));
            }
          }
        }
      }
      return callback();
    };
    this.marcgcFormRules = {
      marclxid: [
        { required: true, message: "MARC类型不能为空", trigger: "change" }
      ],
      marcBookField: [
        { required: true, message: "馆藏字段不能为空", trigger: "change" },
        { min: 3, max: 3, message: "请输入3位数字", trigger: "blur" },
        {
          pattern: /^[0-9]*$/,
          message: "请输入数字",
          trigger: "blur"
        }
      ],
      tiaoma: [{ validator: checkSubFieldValidate }],
      sshao: [{ validator: checkSubFieldValidate }],
      cejia: [{ validator: checkSubFieldValidate }],
      taojia: [{ validator: checkSubFieldValidate }],
      libId2: [{ validator: checkSubFieldValidate }],
      czId2: [{ validator: checkSubFieldValidate }],
      libId: [{ validator: checkSubFieldValidate }],
      czId: [{ validator: checkSubFieldValidate }],
      jcmshu: [{ validator: checkSubFieldValidate }],
      ltlxid: [{ validator: checkSubFieldValidate }],
      gys: [{ validator: checkSubFieldValidate }],
      batchId: [{ validator: checkSubFieldValidate }],
      ysuan: [{ validator: checkSubFieldValidate }],
      zdfangshi: [{ validator: checkSubFieldValidate }],
      jzleixing: [{ validator: checkSubFieldValidate }],
      inTime: [{ validator: checkSubFieldValidate }],
      wxlyuan: [{ validator: checkSubFieldValidate }]
    };
    return {
      // 列表相关
      multipleMarcgcSelection: [],
      loadMarcgcData: false,
      marcgcList: [],
      pageSize: 15,
      currentPage: 1,
      totalCount: 0,
      currentMarcgcId: "",
      // 新增
      showAddSide: false,
      marcOptions: [],
      marcgcAddForm: {
        marclxid: "",
        marcBookField: "",
        tiaoma: "",
        sshao: "",
        cejia: "",
        taojia: "",
        libId2: "",
        czId2: "",
        libId: "",
        czId: "",
        jcmshu: "",
        ltlxid: "",
        gys: "",
        batchId: "",
        ysuan: "",
        zdfangshi: "",
        jzleixing: "",
        inTime: "",
        wxlyuan: ""
      },
      // 编辑
      showEditSide: false,
      marcgcEditForm: {
        marclxid: "",
        marcBookField: "",
        tiaoma: "",
        sshao: "",
        cejia: "",
        taojia: "",
        libId2: "",
        czId2: "",
        libId: "",
        czId: "",
        jcmshu: "",
        ltlxid: "",
        gys: "",
        batchId: "",
        ysuan: "",
        zdfangshi: "",
        jzleixing: "",
        inTime: "",
        wxlyuan: ""
      }
    };
  },
  methods: {
    getMarcOptions() {
      getMarcType().then(res => {
        let options = res.data || [];
        this.marcOptions = options.map(item => {
          return {
            value: item.marclxid,
            label: item.leixing
          };
        });
      });
    },
    // MARC馆藏列表
    initMarcgcList() {
      this.currentPage = 1;
      this.getMarcgcList();
    },
    marcgcClickRow(row) {
      this.$refs.marcgcTable.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.editMarcgcDetail(row.id, "", row);
    },
    handleSelectionChange(val) {
      this.multipleMarcgcSelection = val.map(item => item.id);
    },
    // 编辑-获取原来的数据
    editMarcgcDetail(id, index, data) {
      this.currentMarcgcId = id;
      this.showEditSide = true;
      getByIdOrMarcLxId({ id: this.currentMarcgcId })
        .then(() => {
          this.marcgcEditFormOrigin = Object.assign({}, data);
          this.loadMarcgcData = false;
          this.marcgcEditForm.marclxid = data.marclxid;
          this.marcgcEditForm.marcBookField = data.marcBookField;
          this.marcgcEditForm.tiaoma = data.tiaoma;
          this.marcgcEditForm.sshao = data.sshao;
          this.marcgcEditForm.cejia = data.cejia;
          this.marcgcEditForm.taojia = data.taojia;
          this.marcgcEditForm.jcmshu = data.jcmshu;
          this.marcgcEditForm.libId = data.libId;
          this.marcgcEditForm.czId = data.czId;
          this.marcgcEditForm.libId2 = data.libId2;
          this.marcgcEditForm.czId2 = data.czId2;
          this.marcgcEditForm.gys = data.gys;
          this.marcgcEditForm.batchId = data.batchId;
          this.marcgcEditForm.ltlxid = data.ltlxid;
          this.marcgcEditForm.ysuan = data.ysuan;
          this.marcgcEditForm.zdfangshi = data.zdfangshi;
          this.marcgcEditForm.jzleixing = data.jzleixing;
          this.marcgcEditForm.inTime = data.inTime;
          this.marcgcEditForm.wxlyuan = data.wxlyuan;
        })
        .catch(() => {});
    },
    // 单个删除
    handleDel(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          marcBookFieldDelete({ ids: row.id }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initMarcgcList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteMarcgc() {
      this.$confirm(
        `确定删除 ${this.multipleMarcgcSelection.length} 条数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          marcBookFieldDelete({
            ids: this.multipleMarcgcSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initMarcgcList();
            }
          });
        })
        .catch(() => {});
    },
    getMarcgcList() {
      this.loadMarcgcData = true;
      let requestObj = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize
      };
      marcBookFieldList(requestObj).then(res => {
        this.marcgcList = res.data;
        this.totalCount = Number(res.data.totalElements);
        this.loadMarcgcData = false;
      });
    },
    handleMarctempSizeChange(val) {
      this.pageSize = val;
      this.getMarcgcList();
    },
    handleMarctempCurrentChange(val) {
      this.currentPage = val;
      this.getMarcgcList();
    },
    // MARC馆藏新增
    showAddMarcgc() {
      this.showAddSide = true;
    },
    // 新增没保存，点击取消
    showAddSideCancle() {
      this.showAddSide = false;
      this.resetForm("marcgcAddForm");
    },
    // MARC馆藏新增保存
    handleMarcgcAdd() {
      marcBookFieldSave({
        marclxid: this.marcgcAddForm.marclxid,
        marcBookField: this.marcgcAddForm.marcBookField,
        tiaoma: this.marcgcAddForm.tiaoma,
        sshao: this.marcgcAddForm.sshao,
        cejia: this.marcgcAddForm.cejia,
        taojia: this.marcgcAddForm.taojia,
        jcmshu: this.marcgcAddForm.jcmshu,
        libId: this.marcgcAddForm.libId,
        czId: this.marcgcAddForm.czId,
        libId2: this.marcgcAddForm.libId2,
        czId2: this.marcgcAddForm.czId2,
        gys: this.marcgcAddForm.gys,
        batchId: this.marcgcAddForm.batchId,
        ltlxid: this.marcgcAddForm.ltlxid,
        ysuan: this.marcgcAddForm.ysuan,
        zdfangshi: this.marcgcAddForm.zdfangshi,
        jzleixing: this.marcgcAddForm.jzleixing,
        inTime: this.marcgcAddForm.inTime,
        wxlyuan: this.marcgcAddForm.wxlyuan
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("marcgcAddForm");
        this.showAddSide = false;
        this.initMarcgcList();
      });
    },
    // 编辑MARC馆藏
    handleMarcgcEdit() {
      marcBookFieldSave({
        id: this.currentMarcgcId,
        marclxid: this.marcgcEditForm.marclxid,
        marcBookField: this.marcgcEditForm.marcBookField,
        tiaoma: this.marcgcEditForm.tiaoma,
        sshao: this.marcgcEditForm.sshao,
        cejia: this.marcgcEditForm.cejia,
        taojia: this.marcgcEditForm.taojia,
        jcmshu: this.marcgcEditForm.jcmshu,
        libId: this.marcgcEditForm.libId,
        czId: this.marcgcEditForm.czId,
        libId2: this.marcgcEditForm.libId2,
        czId2: this.marcgcEditForm.czId2,
        gys: this.marcgcEditForm.gys,
        batchId: this.marcgcEditForm.batchId,
        ltlxid: this.marcgcEditForm.ltlxid,
        ysuan: this.marcgcEditForm.ysuan,
        zdfangshi: this.marcgcEditForm.zdfangshi,
        jzleixing: this.marcgcEditForm.jzleixing,
        inTime: this.marcgcEditForm.inTime,
        wxlyuan: this.marcgcEditForm.wxlyuan
      })
        .then(res => {
          this.showEditSide = false;
          this.$message.success(res.message);
          this.initMarcgcList();
        })
        .catch(() => {
          this.showEditSide = false;
        });
    },
    // 通用
    resetForm(formName) {
      if (formName === "marcgcEditForm") {
        // 恢复原始数据
        this.marcgcEditForm = Object.assign({}, this.marcgcEditFormOrigin);
        this.checkForm();
      } else {
        this.$refs[formName].resetFields();
      }
    },
    checkForm() {
      if (this.showAddSide) {
        this.$refs["marcgcAddForm"].validate();
      } else {
        this.$refs["marcgcEditForm"].validate();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "marcgcAddForm") {
            this.handleMarcgcAdd();
          } else {
            this.handleMarcgcEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.initMarcgcList();
    this.getMarcOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content {
  .content__table {
    height: 100%;
  }
}
</style>
