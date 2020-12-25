<template>
  <div class="res_dcpc common__content">
    <td-content-header>
      <span>典藏批次</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="sideWarp">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleSelection.length === 0"
            @click="handleDel(false)"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
          </el-button>
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
            v-model="libid"
            placeholder="请选择"
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
            v-model="currentFilterKey"
            placeholder="请选择"
            class="group__filter_type"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            class="group__filter_value"
            size="mini"
            clearable
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="search(true)"
          ></el-input>
          <el-button type="primary" size="mini" @click="search(true)">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadDCPCData"
          border=""
          ref="DCPCList"
          :data="DCPCList"
          stripe
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="daima" label="批次代码">
            <template slot-scope="scope">
              <span @click="handleEdit(scope.row)" class="g-row__check">{{
                scope.row.daima
              }}</span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libJiancheng"
            label="成员馆简称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="操作时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="pcType"
            label="批次类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="备注"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.dcpcid"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.dcpcid)"
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
          :currentPage="param.pageNumber"
          :pageSize="param.pageSize"
        ></td-pagination>
      </div>
    </div>
    <side-wrap
      class="dialog common__side_form"
      v-if="showSideWarp"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增批次</div>
            <div v-else class="tit active">修改批次</div>
          </div>
          <i class="el-icon-close" @click="cancelForm('DCPCForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="DCPCForm"
          label-width="110px"
          :model="DCPCForm"
          :rules="DCPCFormRules"
          size="mini"
        >
          <div class="form__type">
            <div class="tit">
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="daima" label="批次代码">
              <el-input
                clearable
                v-model="DCPCForm.daima"
                placeholder="请输入批次代码"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                v-model="DCPCForm.libid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-radio-group v-model="DCPCForm.ztai">
                <el-radio label="正常">正常</el-radio>
                <el-radio label="历史">历史</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="pcType" label="批次类型">
              <el-radio-group v-model="DCPCForm.pcType">
                <el-radio label="普通">普通</el-radio>
                <el-radio label="清点">清点</el-radio>
                <el-radio label="清查">清查</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item item__textarea" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                size="mini"
                v-model="DCPCForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('DCPCForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('DCPCForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('DCPCForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  dcpcList,
  dcpcSave,
  dcpcDel,
  dcpcUpdate,
  dcpcDelHasData
} from "api/reservation";
import { mapGetters } from "vuex";
export default {
  name: "res_dcpc",
  data() {
    this.DCPCFormRules = {
      daima: [{ required: true, message: "请输入批次代码", trigger: "blur" }]
    };
    this.filterOptions = [
      { value: "pcdm", label: "批次代码" },
      { value: "userName", label: "操作员" }
    ];
    return {
      libid: this.$store.getters.userInfo.libId,
      currentFilterKey: "pcdm",
      currentFilterVal: "",
      multipleSelection: [],
      loadDCPCData: false,
      DCPCList: [],
      pageSize: 15,
      pageNumber: 1,
      totalCount: 0,
      showSideWarp: false,
      isAdd: true,
      baseForm: {
        daima: "",
        libid: this.$store.getters.userInfo.libId,
        pcType: "普通",
        ztai: "正常",
        fuzhu: ""
      },
      DCPCForm: {},
      param: {
        libid: this.$store.getters.userInfo.libId,
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    initDCPCList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.getDCPCList();
      this.pageNumber = 1;
    },

    handleSelectionChange(row) {
      this.multipleSelection = [];
      row.filter(item => {
        this.multipleSelection.push(item.dcpcid);
      });
    },
    rowClick(row) {
      this.$refs.DCPCList.toggleRowSelection(row);
    },

    search(tempTip) {
      if (tempTip) {
        this.pageNumber = 1;
      }
      this.param = {
        libid: this.libid,
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      this.param[this.currentFilterKey] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );

      this.getDCPCList();
    },

    getDCPCList() {
      this.loadDCPCData = true;
      dcpcList(this.param)
        .then(res => {
          this.loadDCPCData = false;
          this.DCPCList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadDCPCData = false;
        });
    },
    handleEdit(row) {
      this.showSideWarp = true;
      this.isAdd = false;
      this.DCPCForm = { ...row };
    },
    handleDel(dcpcid) {
      let dcpcids = "";
      if (dcpcid) {
        dcpcids = dcpcid;
      } else {
        dcpcids = this.multipleSelection.join(",");
      }
      dcpcDelHasData({
        dcpcids
      }).then(res => {
        if (res.data) {
          tipFunc(dcpcDelFunc);
        } else {
          dcpcDelFunc();
        }
      });
      let this_ = this;
      function tipFunc(func) {
        this_
          .$confirm(
            "所选批次代码在批次清单中存在相关联数据，确认删除？",
            "提示",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            }
          )
          .then(() => {
            func();
          });
      }
      function dcpcDelFunc() {
        dcpcDel({
          dcpcids
        }).then(res => {
          this_.$message.success(res.message);
          this_.search();
        });
      }
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.pageNumber = 1;
      this.search();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.search();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.DCPCForm.daima = this.DCPCForm.daima.replace(/\s+/g, "");
          if (this.isAdd) {
            dcpcSave(this.DCPCForm).then(res => {
              this.$refs[formName].resetFields();
              this.showSideWarp = false;
              this.$message.success(res.message);
              this.getDCPCList();
            });
          } else {
            dcpcUpdate({
              ...this.DCPCForm
            }).then(res => {
              this.cancelForm(formName);
              this.$message.success(res.message);
              this.getDCPCList();
            });
          }
        }
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.DCPCForm = { ...this.baseForm };
      this.isAdd = true;
      this.showSideWarp = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    sideWarp() {
      this.showSideWarp = true;
    }
  },
  mounted() {
    this.DCPCForm = { ...this.baseForm };
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
