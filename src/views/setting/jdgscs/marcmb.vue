<!--
 * @Description: MARC模板
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-09 19:07:57
 -->

<template>
  <div class="set-marcmb common__content">
    <td-content-header>
      MARC模板管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddMarctemp"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMarctempSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteMarctemp('')"
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
            v-model="currentMarctempFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in marctempFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            ref="focusInput"
            class="group__filter_value"
            v-model="marctempSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initMarctempList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initMarctempList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="marctempTableOut">
        <el-table
          ref="marctempTable"
          @row-click="marctempClickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadMarctempData"
          @selection-change="handleMarctempSelectionChange"
          border
          :data="marctempList"
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
            prop="mingcheng"
            show-overflow-tooltip
            label="模板名称"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="marcFbName"
            label="分编类型"
          >
          </el-table-column>
          <el-table-column label="采访位置">
            <template slot-scope="scope">
              <div>
                {{ scope.row.caifang ? "开" : "关" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="编目位置">
            <template slot-scope="scope">
              <div>
                {{ scope.row.bianmu ? "开" : "关" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="典藏位置">
            <template slot-scope="scope">
              <div>
                {{ scope.row.diancang ? "开" : "关" }}
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="附注说明">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.mbid"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkMarctempDetail"
                @handleDel="deleteMarctemp"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleMarctempSizeChange"
          @current-change="handleMarctempCurrentChange"
          :total="totalMarctempCount"
          :currentPage="currentMarctempPage"
          :pageSize="marctempPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增模板 -->
    <side-wrap class="common__side_form" v-show="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增MARC模板
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marctempAddForm"
          label-width="80px"
          :model="marctempAddForm"
          :rules="marctempFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>模板信息</span>
            </div>
            <el-form-item class="item" prop="marcfbid" label="分编类型">
              <el-select
                filterable
                v-model="marctempAddForm.marcfbid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marcfbOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="模板名称">
              <el-input
                clearable
                v-model="marctempAddForm.mingcheng"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="caifang" label="采访位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempAddForm.caifang"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="bianmu" label="编目位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempAddForm.bianmu"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="diancang" label="典藏位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempAddForm.diancang"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                clearable
                type="textarea"
                v-model="marctempAddForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('marctempAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marctempAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSide = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑文献 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div
              v-for="(item, index) in editTabs"
              :key="index"
              class="tit"
              :class="{ active: item.id === currentEditTab }"
              @click="currentEditTab = item.id"
            >
              {{ item.value }}
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div
        class="edit__content"
        v-loading="loadMarctempDetail"
        v-show="currentEditTab === 1"
      >
        <el-form
          class="custom__form"
          ref="marctempEditForm"
          label-width="80px"
          :model="marctempEditForm"
          :rules="marctempFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>模板信息</span>
            </div>
            <el-form-item class="item" prop="marcfbid" label="分编类型">
              <el-select
                filterable
                v-model="marctempEditForm.marcfbid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marcfbOptionsEdit"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="mingcheng" label="模板名称">
              <el-input
                clearable
                v-model="marctempEditForm.mingcheng"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="caifang" label="采访位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempEditForm.caifang"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="bianmu" label="编目位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempEditForm.bianmu"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="diancang" label="典藏位置">
              <div class="item__text">
                <el-switch
                  active-text="开"
                  inactive-text="关"
                  v-model="marctempEditForm.diancang"
                >
                </el-switch>
              </div>
            </el-form-item>
            <el-form-item class="item" prop="fuzhu" label="附注说明">
              <el-input
                clearable
                type="textarea"
                v-model="marctempEditForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div
        class="edit__content edit_mb"
        v-loading="loadMarctempFieldDetail"
        v-show="currentEditTab === 2"
      >
        <div class="tit">
          <span>模板字段信息</span>
          <div class="header__ops">
            <el-button
              size="mini"
              type="primary"
              @click="handleShowTempFieldAdd"
              ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
            >
            <el-button
              @click="handleTempFieldDel('')"
              :disabled="multipleTempFieldSelection.length === 0"
              size="mini"
              type="primary"
              ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
            >
          </div>
        </div>
        <el-table
          border
          ref="tempFieldTable"
          @row-click="tempFieldclickRow"
          @selection-change="handleTempFieldSelectionChange"
          :data="tempFieldList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="字段标识" prop="baoshi">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="指示符1"
            prop="zhishifu1"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="指示符2"
            prop="zhishifu2"
          >
          </el-table-column>
          <el-table-column
            label="字段内容"
            prop="neirong"
            class-name="triangle"
          >
            <template slot-scope="scope">
              <input class="input__text" readonly :value="scope.row.neirong" />
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="说明" prop="fuzhu">
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.mbzdid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleDel="handleTempFieldDel"
                @handleEdit="handleTempFieldEdit"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-slot:footer>
        <div class="edit__footer" v-show="currentEditTab === 1">
          <div>
            <el-button size="mini" @click="resetForm('marctempEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marctempEditForm')"
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
    <!-- 模板字段编辑 -->
    <el-dialog
      custom-class="mbzd__dialog"
      title="编辑模板内容"
      :visible.sync="showTempFieldEdit"
    >
      <el-form
        class="editForm custom__form"
        ref="marctempFieldEditForm"
        v-loading="loadTempFieldData"
        label-width="100px"
        :model="marctempFieldEditForm"
        :rules="marctempFieldFormRules"
      >
        <el-form-item class="item" prop="baoshi" label="字段标识">
          <el-tooltip
            class="item"
            effect="dark"
            content="限制三位，必须为数字"
            placement="top"
          >
            <el-input
              clearable
              size="mini"
              maxlength="3"
              v-model="marctempFieldEditForm.baoshi"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu" label="是否有指示符">
          <div class="item__text">
            <el-switch
              size="mini"
              active-text="是"
              inactive-text="否"
              v-model="marctempFieldEditForm.zhishifu"
            >
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu1" label="指示符1">
          <el-input
            :disabled="!marctempFieldEditForm.zhishifu"
            clearable
            maxlength="1"
            size="mini"
            v-model="marctempFieldEditForm.zhishifu1"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu2" label="指示符2">
          <el-input
            :disabled="!marctempFieldEditForm.zhishifu"
            clearable
            maxlength="1"
            size="mini"
            v-model="marctempFieldEditForm.zhishifu2"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="neirong" label="字段内容">
          <el-tooltip
            class="item"
            effect="dark"
            content="Ctrl+Enter输入字段标识符"
            placement="top"
          >
            <el-input
              class="triangle"
              clearable
              type="textarea"
              v-monitor-split="marctempFieldEditForm.neirong"
              size="mini"
              v-model="marctempFieldEditForm.neirong"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="item" prop="fuzhu" label="附注说明">
          <el-input
            clearable
            type="textarea"
            size="mini"
            v-model="marctempFieldEditForm.fuzhu"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button size="mini" @click="resetForm('marctempFieldEditForm')"
            >重置</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="submitForm('marctempFieldEditForm')"
            >保 存</el-button
          >
          <el-button size="mini" @click="showTempFieldEdit = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 模板字段新增 -->
    <el-dialog
      custom-class="mbzd__dialog"
      title="新增模板内容"
      :visible.sync="showTempFieldAdd"
    >
      <el-form
        class="editForm custom__form"
        ref="marctempFieldAddForm"
        label-width="100px"
        :model="marctempFieldAddForm"
        :rules="marctempFieldFormRules"
      >
        <el-form-item class="item" prop="baoshi" label="字段标识">
          <el-tooltip
            effect="dark"
            content="限制三位，必须为数字"
            placement="top"
          >
            <el-input
              clearable
              size="mini"
              maxlength="3"
              v-model="marctempFieldAddForm.baoshi"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu" label="是否有指示符">
          <div class="item__text">
            <el-switch
              size="mini"
              active-text="是"
              inactive-text="否"
              v-model="marctempFieldAddForm.zhishifu"
            >
            </el-switch>
          </div>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu1" label="指示符1">
          <el-input
            :disabled="!marctempFieldAddForm.zhishifu"
            clearable
            maxlength="1"
            size="mini"
            v-model="marctempFieldAddForm.zhishifu1"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="zhishifu2" label="指示符2">
          <el-input
            :disabled="!marctempFieldAddForm.zhishifu"
            clearable
            maxlength="1"
            size="mini"
            v-model="marctempFieldAddForm.zhishifu2"
          ></el-input>
        </el-form-item>
        <el-form-item class="item" prop="neirong" label="字段内容">
          <el-tooltip
            class="item"
            effect="dark"
            content="Ctrl+Enter输入字段标识符"
            placement="top"
          >
            <el-input
              class="triangle"
              clearable
              type="textarea"
              v-monitor-split="marctempFieldAddForm.neirong"
              size="mini"
              v-model="marctempFieldAddForm.neirong"
            ></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item class="item" prop="fuzhu" label="附注说明">
          <el-input
            clearable
            type="textarea"
            size="mini"
            v-model="marctempFieldAddForm.fuzhu"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button size="mini" @click="resetForm('marctempFieldAddForm')"
            >重置</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            size="mini"
            @click="submitForm('marctempFieldAddForm')"
            >保 存</el-button
          >
          <el-button size="mini" @click="showTempFieldAdd = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  sysMarcConfigMarcTempList,
  sysMarcConfigMarcTempDel,
  sysMarcConfigMarcTempSave,
  sysMarcConfigMarcTempGet,
  sysMarcConfigMarcFbList,
  sysMarcConfigMarcTempFieldList,
  sysMarcConfigMarcTempFieldDel,
  sysMarcConfigMarcTempFieldSave,
  sysMarcConfigMarcTempFieldGet
} from "api/setting";
import { mapGetters } from "vuex";

export default {
  name: "set_marcmb",
  data() {
    this.editTabs = [
      {
        value: "模板信息",
        id: 1
      },
      {
        value: "MARC模板字段",
        id: 2
      }
    ];
    this.marctempFilterOptions = [
      {
        value: "mbName",
        label: "模板名称"
      },
      {
        value: "fbLxName",
        label: "分编类型"
      }
    ];
    this.marctempFormRules = {
      mingcheng: [
        { required: true, message: "模板名称不能为空", trigger: "blur" }
      ],
      marcfbid: [
        { required: true, message: "分编类型不能为空", trigger: "change" }
      ]
    };
    let validateBaoshi = (rule, value, callback) => {
      if (value.length === 0) {
        callback(new Error("字段标识不能为空"));
      } else if (value.length !== 3 || !(+value > 0)) {
        callback(new Error("字段标识需为三位数字"));
      } else {
        callback();
      }
    };
    let validateZhishifu = (rule, value, callback) => {
      let stringArr = ["#", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
      if (value === "") {
        callback();
      } else if (!stringArr.includes(value)) {
        callback(new Error("指示符只能是 #/0-9"));
      } else {
        callback();
      }
    };
    this.marctempFieldFormRules = {
      baoshi: [{ required: true, validator: validateBaoshi, trigger: "blur" }],
      zhishifu1: [{ validator: validateZhishifu, trigger: "blur" }],
      zhishifu2: [{ validator: validateZhishifu, trigger: "blur" }]
    };
    return {
      // 列表相关
      multipleMarctempSelection: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadMarctempData: false,
      marctempList: [],
      marctempSearchKey: "",
      currentMarctempFilterKey: "mbName",
      marctempPageSize: 15,
      currentMarctempPage: 1,
      totalMarctempCount: 0,
      currentMarctempId: "",
      currentEditTab: 1,
      // 新增
      showAddSide: false,
      marctempAddForm: {
        marcfbid: "",
        mingcheng: "",
        caifang: true,
        bianmu: true,
        diancang: true,
        fuzhu: ""
      },
      marcfbOptions: [],
      // 编辑
      marcfbOptionsEdit: [],
      loadMarctempDetail: false,
      showEditSide: false,
      marctempEditForm: {
        marcfbid: "",
        mingcheng: "",
        caifang: "",
        bianmu: "",
        diancang: "",
        fuzhu: ""
      },
      // 模板
      multipleTempFieldSelection: [],
      tempFieldList: [],
      loadMarctempFieldDetail: false,
      showTempFieldEdit: false,
      loadTempFieldData: false,
      currentTempFieldId: "",
      marctempFieldEditForm: {
        baoshi: "",
        zhishifu: "",
        zhishifu1: "",
        zhishifu2: "",
        neirong: "",
        fuzhu: ""
      },
      showTempFieldAdd: false,
      marctempFieldAddForm: {
        baoshi: "",
        zhishifu: false,
        zhishifu1: "",
        zhishifu2: "",
        neirong: "",
        fuzhu: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    // 模板列表
    initMarctempList() {
      this.currentMarctempPage = 1;
      this.setRequestObj();
      this.getMarctempList();
    },
    marctempClickRow(row) {
      this.$refs.marctempTable.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkMarctempDetail(row.mbid, "", row);
    },
    handleMarctempSelectionChange(val) {
      this.multipleMarctempSelection = val.map(item => item.mbid);
    },
    checkMarctempDetail(id, index, data) {
      this.currentMarctempId = id;
      this.showEditSide = true;
      this.getMarcfbEditOptions(data.libId);
      this.getMarctempDetail();
      this.getTempFieldList();
    },
    deleteMarctemp(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarctempData = true;
          sysMarcConfigMarcTempDel({
            templeteIds: ids ? ids : this.multipleMarctempSelection.join(",")
          })
            .then(res => {
              this.loadMarctempData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.marctempList.splice(index, 1);
              } else {
                this.initMarctempList();
              }
            })
            .catch(() => {
              this.loadMarctempData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
      this.requestObj[this.currentMarctempFilterKey] = this.marctempSearchKey;
    },
    getMarctempList() {
      this.loadMarctempData = true;

      let requestObj = {
        pageNumber: this.currentMarctempPage,
        pageSize: this.marctempPageSize,
        ...this.requestObj
      };

      sysMarcConfigMarcTempList(requestObj)
        .then(res => {
          this.loadMarctempData = false;
          this.marctempList = res.data.dataList;
          this.totalMarctempCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadMarctempData = false;
        });
    },
    handleMarctempSizeChange(val) {
      this.marctempPageSize = val;
      this.getMarctempList();
    },
    handleMarctempCurrentChange(val) {
      this.currentMarctempPage = val;
      this.getMarctempList();
    },
    // 模板新增
    showAddMarctemp() {
      this.showAddSide = true;
      this.resetForm("marctempAddForm");
    },
    handleMarctempFormAdd() {
      sysMarcConfigMarcTempSave(this.marctempAddForm).then(res => {
        this.$message.success(res.message);
        this.resetForm("marctempAddForm");
        this.showAddSide = false;
        this.initMarctempList();
      });
    },
    // 模板编辑
    getMarctempDetail() {
      this.loadMarctempDetail = true;
      sysMarcConfigMarcTempGet({
        templeteId: this.currentMarctempId
      }).then(res => {
        this.loadMarctempDetail = false;
        this.marctempEditFormOrigin = Object.assign({}, res.data); // 备份原始数据
        this.marctempEditForm = res.data;
      });
    },
    handleMarctempFormEdit() {
      let requestObj = this.marctempEditForm;
      requestObj.mbid = this.currentMarctempId;
      delete requestObj["optime"];
      sysMarcConfigMarcTempSave(requestObj).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initMarctempList();
      });
    },
    getMarcfbEditOptions(libId) {
      sysMarcConfigMarcFbList({
        libId: libId,
        pageNumber: 1,
        pageSize: 1000
      }).then(res => {
        let options = res.data.dataList || [];
        this.marcfbOptionsEdit = options.map(item => {
          return {
            value: item.marcfbid,
            label: item.leixing
          };
        });
      });
    },
    // 模板字段相关
    handleTempFieldDel(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarctempFieldDetail = true;
          sysMarcConfigMarcTempFieldDel({
            mbzdids: ids ? ids : this.multipleTempFieldSelection.join(",")
          })
            .then(res => {
              this.loadMarctempFieldDetail = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.tempFieldList.splice(index, 1);
              } else {
                this.getTempFieldList();
              }
            })
            .catch(() => {
              this.loadMarctempFieldDetail = false;
            });
        })
        .catch(() => {});
    },
    handleTempFieldEdit(id) {
      this.showTempFieldEdit = true;
      this.loadTempFieldData = true;
      this.currentTempFieldId = id;
      sysMarcConfigMarcTempFieldGet({
        mbzdid: id
      }).then(res => {
        this.loadTempFieldData = false;
        this.marctempFieldEditFormOrigin = Object.assign({}, res.data); // 备份原始数据
        this.marctempFieldEditForm = res.data;
      });
    },
    tempFieldclickRow(row) {
      this.$refs.tempFieldTable.toggleRowSelection(row);
    },
    handleTempFieldSelectionChange(val) {
      this.multipleTempFieldSelection = val.map(item => item.mbzdid);
    },
    getTempFieldList() {
      this.loadMarctempFieldDetail = true;
      sysMarcConfigMarcTempFieldList({
        templeteId: this.currentMarctempId
      }).then(res => {
        this.loadMarctempFieldDetail = false;
        this.tempFieldList = res.data;
      });
    },
    handleMarctempFieldFormEdit() {
      let requestObj = Object.assign({}, this.marctempFieldEditForm);
      requestObj.marcmbid = this.currentMarctempId;
      requestObj.mbzdid = this.currentTempFieldId;
      if (!requestObj.zhishifu) {
        requestObj.zhishifu1 = "";
        requestObj.zhishifu2 = "";
      }
      delete requestObj["optime"];
      sysMarcConfigMarcTempFieldSave(requestObj).then(res => {
        this.$message.success(res.message);
        this.showTempFieldEdit = false;
        this.getTempFieldList();
      });
    },
    handleMarctempFieldFormAdd() {
      let requestObj = Object.assign({}, this.marctempFieldAddForm);
      requestObj.marcmbid = this.currentMarctempId;
      if (!requestObj.zhishifu) {
        requestObj.zhishifu1 = "";
        requestObj.zhishifu2 = "";
      }
      sysMarcConfigMarcTempFieldSave(requestObj).then(res => {
        this.$message.success(res.message);
        this.showTempFieldAdd = false;
        this.resetForm("marctempFieldAddForm");
        this.getTempFieldList();
      });
    },
    handleShowTempFieldAdd() {
      this.showTempFieldAdd = true;
      this.$nextTick(() => {
        this.resetForm("marctempFieldAddForm");
      });
    },
    // 通用
    getMarcfbOptions() {
      sysMarcConfigMarcFbList({
        libId: this.$store.getters.userInfo.libId,
        pageNumber: 1,
        pageSize: 1000
      }).then(res => {
        let options = res.data.dataList || [];
        this.marcfbOptions = options.map(item => {
          return {
            value: item.marcfbid,
            label: item.leixing
          };
        });
      });
    },
    resetForm(formName) {
      if (formName === "marctempEditForm") {
        // 恢复原始数据
        this.marctempEditForm = Object.assign({}, this.marctempEditFormOrigin);
      } else if (formName === "marctempFieldEditForm") {
        this.marctempFieldEditForm = Object.assign(
          {},
          this.marctempFieldEditFormOrigin
        );
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "marctempAddForm") {
            this.handleMarctempFormAdd();
          } else if (formName === "marctempEditForm") {
            this.handleMarctempFormEdit();
          } else if (formName === "marctempFieldEditForm") {
            this.handleMarctempFieldFormEdit();
          } else if (formName === "marctempFieldAddForm") {
            this.handleMarctempFieldFormAdd();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.initMarctempList();
    this.getMarcfbOptions();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.getMarcfbOptions();
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
/deep/ .input__text {
  outline: none;
  border: none;
  background: transparent;
}
.mbzd__dialog {
  .custom__form {
    display: flex;
    flex-wrap: wrap;
    .item {
      &:nth-child(2n) {
        justify-content: flex-end;
      }
      &:nth-child(2n + 1) {
        justify-content: initial;
      }
    }
  }
}
.edit_mb {
  .tit {
    width: 100%;
    display: flex;
    justify-content: space-between;
    font-weight: 700;
    margin: 20px 0;
    color: #000;
    font-size: 0.15rem;
  }
  .header__ops {
    padding-right: 0;
  }
}
</style>
