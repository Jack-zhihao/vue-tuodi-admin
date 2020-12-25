<!--
 * @Description: 期刊征订目录预订
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-04-10 17:16:11
 * @LastEditTime: 2020-03-10 16:39:28
 -->

<template>
  <div class="per-qkzdmlyd common__content">
    <td-content-header>
      征订目录
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddZdml"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleZdmlSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteZdmlConfirm('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">起止日期：</span>
          <el-date-picker
            v-model="zdmlDateStart"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="开始时间"
            class="el-date-editor--datetime"
            style="marginRight:3px"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="zdmlDateEnd"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束时间"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentZdmlFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in zdmlFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="zdmlSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initZdmlList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initZdmlList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="zdmlTable">
        <el-table
          v-loading="loadZdmlData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleZdmlSelectionChange"
          border
          :data="zdmlList"
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
          <el-table-column show-overflow-tooltip label="征订目录">
            <template slot-scope="scope">
              <span
                @click="checkZdmllb(scope.row.zdpcid)"
                class="g-row__check primary"
                >{{ scope.row.zdpcdm }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libJiancheng"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysCode"
            label="供应商代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yusuanDaima"
            label="预算代码"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zdnian" label="征订年">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ydjzrq"
            label="预订截止日期"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="username" label="操作员">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="操作日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.zdpcid"
                :data="scope.row"
                :index="scope.$index"
                :ops="['del', 'edit', 'detail']"
                @handleEdit="checkZdmlDetail"
                @handleDel="deleteZdmlConfirm"
                @handleDetail="checkZdmllb"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleZdmlSizeChange"
          @current-change="handleZdmlCurrentChange"
          :total="totalZdmlCount"
          :currentPage="currentZdmlPage"
          :pageSize="zdmlPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增目录 -->
    <side-wrap
      class="common__side_form"
      v-if="initAddSide"
      v-show="showAddSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增征订目录
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="zdmlAddForm"
          label-width="100px"
          :model="zdmlAddForm"
          :rules="zdmlFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>征订目录信息</span>
            </div>
            <el-form-item class="item" prop="zdpcdm" label="征订目录">
              <el-input clearable v-model="zdmlAddForm.zdpcdm"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="所属成员馆">
              <el-select
                filterable
                v-model="zdmlAddForm.libid"
                disabled
                @change="changeCurrentLib($event, 'add')"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商代码">
              <el-select
                filterable
                v-model="zdmlAddForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                v-model="zdmlAddForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdnian" label="征订年">
              <el-date-picker
                value-format="yyyy"
                v-model="zdmlAddForm.zdnian"
                type="year"
                clearable
                placeholder="选择年份"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="ydjzrq" label="预订截止日期">
              <el-date-picker
                v-model="zdmlAddForm.ydjzrq"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="zdmlAddForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('zdmlAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('zdmlAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSide = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑目录 -->
    <side-wrap
      class="common__side_form"
      v-if="showEditSide"
      v-show="initEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑征订目录
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="zdmlEditForm"
          label-width="100px"
          :model="zdmlEditForm"
          :rules="zdmlFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>征订目录信息</span>
            </div>
            <el-form-item class="item" prop="zdpcdm" label="征订目录">
              <el-input clearable v-model="zdmlEditForm.zdpcdm"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="所属成员馆">
              <el-select
                filterable
                v-model="zdmlEditForm.libid"
                @change="changeCurrentLib($event, 'edit', 'update')"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商代码">
              <el-select
                filterable
                v-model="zdmlEditForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                v-model="zdmlEditForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdnian" label="征订年">
              <el-date-picker
                value-format="yyyy"
                v-model="zdmlEditForm.zdnian"
                type="year"
                clearable
                placeholder="选择年份"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="ydjzrq" label="预订截止日期">
              <el-date-picker
                v-model="zdmlEditForm.ydjzrq"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="zdmlEditForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('zdmlEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('zdmlEditForm')"
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
import {
  getZdmlydList,
  delZdmlyd,
  updateZdmlyd,
  delConfirm
} from "api/periodical";

import { userGysInLibList, userYsLibList } from "api/public";

import { mapGetters } from "vuex";

let currentYear = new Date().getFullYear() + "";

export default {
  name: "per_qkzdmlyd",
  data() {
    this.zdmlFilterOptions = [
      {
        value: "zdpcdm",
        label: "征订目录"
      },
      {
        value: "gysCode",
        label: "供应商"
      },
      {
        value: "userName",
        label: "操作员"
      }
    ];
    this.zdmlFormRules = {
      zdpcdm: [
        { required: true, message: "征订目录不能为空", trigger: "blur" }
      ],
      libid: [{ required: true, message: "成员馆不能为空", trigger: "change" }],
      gysid: [
        { required: true, message: "供应商代码不能为空", trigger: "change" }
      ],
      zdnian: [{ required: true, message: "征订年不能为空", trigger: "change" }]
    };
    this.zdmlAddFormOrigin = {
      zdpcdm: "",
      libid: this.$store.getters.userInfo.libId,
      gysid: "",
      ysid: "",
      zdnian: currentYear,
      ydjzrq: "",
      fuzhu: ""
    };
    return {
      // 列表相关
      multipleZdmlSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadZdmlData: false,
      zdmlList: [],
      zdmlSearchKey: "",
      zdmlDateStart: "",
      zdmlDateEnd: "",
      currentZdmlFilterKey: "zdpcdm",
      zdmlPageSize: 15,
      currentZdmlPage: 1,
      totalZdmlCount: 0,
      currentZdmlData: "",
      gysOptions: [],
      ysOptions: [],
      zdYearOptions: [],
      // 新增
      initAddSide: false,
      showAddSide: false,
      zdmlAddForm: {
        zdpcdm: "",
        libid: this.$store.getters.userInfo.libId,
        gysid: "",
        ysid: "",
        zdnian: currentYear,
        ydjzrq: "",
        fuzhu: ""
      },
      // 编辑
      initEditSide: false,
      showEditSide: false,
      zdmlEditForm: {
        zdpcdm: "",
        libid: "",
        gysid: "",
        ysid: "",
        zdnian: "",
        ydjzrq: "",
        fuzhu: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 目录列表
    initZdmlList() {
      this.currentZdmlPage = 1;
      this.setRequestObj();
      this.getZdmlList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkZdmlDetail("", "", row);
    },
    handleZdmlSelectionChange(val) {
      this.multipleZdmlSelection = val.map(item => item.zdpcid);
    },
    checkZdmllb(zdpcid) {
      this.$router.push({
        name: "per_qkzdmllb",
        query: {
          zdpcid
        }
      });
    },
    checkZdmlDetail(id, index, data) {
      this.currentZdmlData = data;
      this.initEditSide = true;
      this.showZdmlDetail();
    },
    deleteZdmlConfirm(ids) {
      delConfirm({
        zdpcids: ids ? ids : this.multipleZdmlSelection.join(",")
      }).then(res => {
        if (res.data.length === 0) {
          this.deleteZdml(ids, "删除时，其关联的其他信息也会被删除，确认删除?");
        } else {
          this.deleteZdml(ids, res.data[0]);
        }
      });
    },
    deleteZdml(ids, txts) {
      this.$confirm(txts, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadZdmlData = true;
          delZdmlyd({
            zdpcids: ids ? ids : this.multipleZdmlSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initZdmlList();
            })
            .finally(() => {
              this.loadZdmlData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.selectLibId,
        time1: this.zdmlDateStart,
        time2: this.zdmlDateEnd
      };
      this.requestObj[this.currentZdmlFilterKey] = this.zdmlSearchKey;
    },
    getZdmlList() {
      this.loadZdmlData = true;

      let requestObj = {
        pageNumber: this.currentZdmlPage,
        pageSize: this.zdmlPageSize,
        ...this.requestObj
      };

      getZdmlydList(requestObj)
        .then(res => {
          this.loadZdmlData = false;
          this.zdmlList = res.data.dataList;
          this.totalZdmlCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadZdmlData = false;
        });
    },
    handleZdmlSizeChange(val) {
      this.zdmlPageSize = val;
      this.getZdmlList();
    },
    handleZdmlCurrentChange(val) {
      this.currentZdmlPage = val;
      this.getZdmlList();
    },
    // 目录新增
    changeCurrentLib(libId, mode, isUpadate) {
      this.getGysOptions(libId, mode, isUpadate);
      this.getYsOptions(libId, mode, isUpadate);
    },
    showAddZdml() {
      this.initAddSide = true;
      this.showAddSide = true;
      this.$nextTick(() => {
        this.resetForm("zdmlAddForm");
      });
    },
    handleZdmlFormAdd() {
      updateZdmlyd(this.zdmlAddForm).then(res => {
        this.$message.success(res.message);
        this.resetForm("zdmlAddForm");
        this.showAddSide = false;
        this.initZdmlList();
      });
    },
    // 目录编辑
    showZdmlDetail() {
      this.zdmlEditFormOrigin = Object.assign({}, this.currentZdmlData); // 备份原始数据
      this.zdmlEditForm = Object.assign({}, this.currentZdmlData);
      this.changeCurrentLib(this.zdmlEditForm.libid, "edit");
      this.showEditSide = true;
    },
    handleZdmlFormEdit() {
      updateZdmlyd(this.zdmlEditForm).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initZdmlList();
      });
    },
    // 通用
    getGysOptions(libId, mode, isUpadate) {
      userGysInLibList({
        libId
      }).then(res => {
        this.gysOptions = res.data.map(item => {
          return {
            label: item.gysCode,
            value: item.gysId
          };
        });
        if (mode === "add") {
          this.zdmlAddForm.gysid = this.gysOptions[0]
            ? this.gysOptions[0].value
            : "";
          if (libId === this.$store.getters.userInfo.libId) {
            this.zdmlAddFormOrigin.gysid = this.zdmlAddForm.gysid;
          }
        }
        if (mode === "edit" && isUpadate === "update") {
          this.zdmlEditForm.gysid = this.gysOptions[0]
            ? this.gysOptions[0].value
            : "";
        }
      });
    },
    getYsOptions(libId, mode, isUpadate) {
      userYsLibList({
        libId
      }).then(res => {
        this.ysOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ysid
          };
        });
        if (mode === "add") {
          this.zdmlAddForm.ysid = this.ysOptions[0]
            ? this.ysOptions[0].value
            : "";
          if (libId === this.$store.getters.userInfo.libId) {
            this.zdmlAddFormOrigin.ysid = this.zdmlAddForm.ysid;
          }
        }
        if (mode === "edit" && isUpadate === "update") {
          this.zdmlEditForm.ysid = this.ysOptions[0]
            ? this.ysOptions[0].value
            : "";
        }
      });
    },
    resetForm(formName) {
      if (formName === "zdmlEditForm") {
        // 恢复原始数据
        this.zdmlEditForm = Object.assign({}, this.zdmlEditFormOrigin);
        this.changeCurrentLib(this.zdmlEditFormOrigin.libid, "edit");
      } else if (formName === "zdmlAddForm") {
        this.zdmlAddForm = Object.assign({}, this.zdmlAddFormOrigin);
        this.changeCurrentLib(this.zdmlAddForm.libid, "add");
      }
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "zdmlAddForm") {
            this.handleZdmlFormAdd();
          } else if (formName === "zdmlEditForm") {
            this.handleZdmlFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getZdmlList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
