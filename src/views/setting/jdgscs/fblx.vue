<!--
 * @Description: 分编类型
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-09 18:44:58
 -->

<template>
  <div class="set-fblx common__content">
    <td-content-header>
      分编类型管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddMarcfb"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMarcfbSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteMarcfb('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
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
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentMarcfbFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in marcfbFilterOptions"
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
            v-model="marcfbSearchKey"
            placeholder="请输入搜索关键词"
            ref="focusInput"
            @keydown.enter.native="initMarcfbList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initMarcfbList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadMarcfbData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleMarcfbSelectionChange"
          border
          :data="marcfbList"
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
            prop="leixing"
            show-overflow-tooltip
            label="分编类型"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="wxLxName"
            label="文献类型"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="marcLxName"
            label="MARC类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zifuji" label="字符集">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="附注说明">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.marcfbid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkMarcfbDetail"
                @handleDel="deleteMarcfb"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleMarcfbSizeChange"
          @current-change="handleMarcfbCurrentChange"
          :total="totalMarcfbCount"
          :currentPage="currentMarcfbPage"
          :pageSize="marcfbPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增文献 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增分编类型
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcfbAddForm"
          label-width="90px"
          :model="marcfbAddForm"
          :rules="marcfbFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>分编类型信息</span>
            </div>
            <el-form-item class="item" prop="leixing" label="分编类型">
              <el-input clearable v-model="marcfbAddForm.leixing"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zifuji" label="字符集">
              <el-select
                filterable
                v-model="marcfbAddForm.zifuji"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zifujiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="wxlxid" label="文献类型">
              <el-select
                filterable
                v-model="marcfbAddForm.wxlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in wxlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="marclxid" label="MARC类型">
              <el-select
                filterable
                v-model="marcfbAddForm.marclxid"
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
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                clearable
                type="textarea"
                v-model="marcfbAddForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marcfbAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcfbAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSideCancle">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑文献 -->
    <side-wrap
      v-loading="loadMarcfbDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              文献类型信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marcfbEditForm"
          label-width="90px"
          :model="marcfbEditForm"
          :rules="marcfbFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>分编类型信息</span>
            </div>
            <el-form-item class="item" prop="leixing" label="分编类型">
              <el-input clearable v-model="marcfbEditForm.leixing"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zifuji" label="字符集">
              <el-select
                filterable
                v-model="marcfbEditForm.zifuji"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zifujiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="wxlxid" label="文献类型">
              <el-select
                filterable
                v-model="marcfbEditForm.wxlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in wxlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="marclxid" label="MARC类型">
              <el-select
                filterable
                v-model="marcfbEditForm.marclxid"
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
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                type="textarea"
                clearable
                v-model="marcfbEditForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marcfbEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marcfbEditForm')"
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
  sysMarcConfigMarcFbList,
  sysMarcConfigMarcFbDel,
  sysMarcConfigMarcFbSave,
  sysMarcConfigMarcFbGet,
  sysMarcConfigWxlxList
} from "api/setting";

import { getMarcType } from "api/public";
import { mapGetters } from "vuex";
export default {
  name: "set_fblx",
  data() {
    this.zifujiOptions = [
      {
        value: "UTF-8",
        label: "UTF-8"
      }
    ];
    this.marcfbFilterOptions = [
      {
        value: "wxLxName",
        label: "文献类型"
      },
      {
        value: "fbLxName",
        label: "MARC分编类型"
      },
      {
        value: "marcLxName",
        label: "MARC类型"
      }
    ];
    this.marcfbFormRules = {
      leixing: [
        { required: true, message: "分编类型不能为空", trigger: "blur" }
      ],
      wxlxid: [
        { required: true, message: "文献类型不能为空", trigger: "change" }
      ],
      marclxid: [
        { required: true, message: "MARC类型不能为空", trigger: "change" }
      ]
    };
    return {
      // 列表相关
      multipleMarcfbSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadMarcfbData: false,
      marcfbList: [],
      marcfbSearchKey: "",
      currentMarcfbFilterKey: "wxLxName",
      marcfbPageSize: 15,
      currentMarcfbPage: 1,
      totalMarcfbCount: 0,
      currentMarcfbId: "",
      // 新增
      showAddSide: false,
      marcfbAddForm: {
        leixing: "",
        fuzhu: "",
        wxlxid: "",
        marclxid: "",
        zifuji: "UTF-8"
      },
      wxlxOptions: [],
      marcOptions: [],

      // 编辑
      loadMarcfbDetail: false,
      showEditSide: false,
      marcfbEditForm: {
        daima: "",
        leixing: "",
        libId: "",
        fuzhu: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    // 文献列表
    initMarcfbList() {
      this.currentMarcfbPage = 1;
      this.setRequestObj();
      this.getMarcfbList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkMarcfbDetail(row.marcfbid);
    },
    handleMarcfbSelectionChange(val) {
      this.multipleMarcfbSelection = val.map(item => item.marcfbid);
    },
    checkMarcfbDetail(id) {
      this.currentMarcfbId = id;
      this.showEditSide = true;
      this.getMarcfbDetail();
    },
    deleteMarcfb(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarcfbData = true;
          sysMarcConfigMarcFbDel({
            marcfbids: ids ? ids : this.multipleMarcfbSelection.join(",")
          })
            .then(res => {
              this.loadMarcfbData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.marcfbList.splice(index, 1);
              } else {
                this.initMarcfbList();
              }
            })
            .catch(() => {
              this.loadMarcfbData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
      this.requestObj[this.currentMarcfbFilterKey] = this.marcfbSearchKey;
    },
    getMarcfbList() {
      this.loadMarcfbData = true;

      let requestObj = {
        pageNumber: this.currentMarcfbPage,
        pageSize: this.marcfbPageSize,
        ...this.requestObj
      };

      sysMarcConfigMarcFbList(requestObj)
        .then(res => {
          this.marcfbList = res.data.dataList;
          this.totalMarcfbCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadMarcfbData = false;
        });
    },
    handleMarcfbSizeChange(val) {
      this.marcfbPageSize = val;
      this.getMarcfbList();
    },
    handleMarcfbCurrentChange(val) {
      this.currentMarcfbPage = val;
      this.getMarcfbList();
    },
    // 文献新增
    showAddMarcfb() {
      this.showAddSide = true;
    },
    // 新增没保存、取消要重置
    showAddSideCancle() {
      this.showAddSide = false;
      this.resetForm("marcfbAddForm");
    },
    handleLiteratureFormAdd() {
      sysMarcConfigMarcFbSave({
        leixing: this.marcfbAddForm.leixing,
        fuzhu: this.marcfbAddForm.fuzhu,
        zifuji: this.marcfbAddForm.zifuji,
        wxlxid: this.marcfbAddForm.wxlxid,
        marclxid: this.marcfbAddForm.marclxid
      }).then(res => {
        this.$message.success(res.message);
        this.resetForm("marcfbAddForm");
        this.showAddSide = false;
        this.initMarcfbList();
      });
    },
    // 文献编辑
    getMarcfbDetail() {
      this.loadMarcfbDetail = true;
      sysMarcConfigMarcFbGet({
        marcfbid: this.currentMarcfbId
      })
        .then(res => {
          this.loadMarcfbDetail = false;
          this.marcfbEditFormOrigin = Object.assign({}, res.data);
          this.marcfbEditForm = res.data;
        })
        .catch(() => {
          this.loadMarcfbDetail = false;
          this.showAddSide = false;
        });
    },
    handleLiteratureFormEdit() {
      sysMarcConfigMarcFbSave({
        marcfbid: this.currentMarcfbId,
        zifuji: this.marcfbEditForm.zifuji,
        leixing: this.marcfbEditForm.leixing,
        wxlxid: this.marcfbEditForm.wxlxid,
        fuzhu: this.marcfbEditForm.fuzhu,
        marclxid: this.marcfbEditForm.marclxid
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initMarcfbList();
      });
    },
    // 通用
    getWxlxOptions() {
      sysMarcConfigWxlxList({
        libId: this.$store.getters.userInfo.libId,
        pageNumber: 1,
        pageSize: 1000
      }).then(res => {
        let options = res.data.dataList || [];
        this.wxlxOptions = options.map(item => {
          return {
            value: item.wxlxid,
            label: item.leixing
          };
        });
      });
    },
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
    resetForm(formName) {
      if (formName === "marcfbEditForm") {
        // 恢复原始数据
        this.marcfbEditForm = Object.assign({}, this.marcfbEditFormOrigin);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "marcfbAddForm") {
            this.handleLiteratureFormAdd();
          } else if (formName === "marcfbEditForm") {
            this.handleLiteratureFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getWxlxOptions();
    this.getMarcOptions();
    this.initMarcfbList();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.getWxlxOptions();
    this.getMarcOptions();
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
