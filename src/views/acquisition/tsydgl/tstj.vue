<!--
 * @Description: 批次清单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 19:30:16
 -->
<template>
  <div class="jjlb common__content">
    <td-content-header>
      图书推荐
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="migrateAll"
            ><icon-svg icon-class="icon-wenjianyisong" />迁移</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" />删除<span
              v-show="multipleLiteratureSelection.length"
              size="mini"
              >({{ multipleLiteratureSelection.length }})</span
            ></el-button
          >
          <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
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
          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            value-format="yyyy-MM-dd"
            style="marginRight:3px"
            :clearable="true"
          >
          </el-date-picker>
          <span>-&nbsp;</span>
          <el-date-picker
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            value-format="yyyy-MM-dd"
            size="mini"
            :clearable="true"
          >
          </el-date-picker>

          <el-select
            filterable
            size="mini"
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
            class="group__filter_type"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-input
            ref="focusInput"
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
          ></el-input>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          @row-dblclick="rowDblclick"
          v-loading="loadLiteratureData"
          @selection-change="handleLiteratureSelectionChange"
          border
          :data="literatureList"
          stripe
          height="100%"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="主题词">
            <template slot-scope="scope">
              <div class="g-row__check primary" @click="goBookItem(scope.row)">
                {{ scope.row.themeTitle }}
              </div>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bookNum" label="书目数">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="themeNote" label="备注">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="操作人"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="操作时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="70"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sort"
            label="顺序"
            width="70"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
              >
                <template v-slot:menus>
                  <div v-if="scope.row.ztai == '关闭'">
                    <div class="menu" @click="upStatus(0, scope.row)">
                      激活
                    </div>
                  </div>
                  <div v-if="scope.row.ztai == '激活'">
                    <div class="menu" @click="upStatus(1, scope.row)">
                      关闭
                    </div>
                  </div>
                  <div class="menu" @click="migrate(scope.row)">
                    迁移
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 新增主题 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增主题
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('literatureAddForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="90px"
          :model="literatureAddForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>主题信息</span>
            </div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="literatureAddForm.libId"
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
            </el-form-item>
            <el-form-item class="item" prop="themeTitle" label="主题词">
              <el-input
                clearable
                v-model="literatureAddForm.themeTitle"
                ref="themeTitle"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="themeZtai" label="状态">
              <el-radio-group v-model="literatureAddForm.themeZtai">
                <el-radio :label="true">激活</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="item" prop="sort" label="排序">
              <el-input
                clearable
                v-model="literatureAddForm.sort"
                ref="sort"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureAddForm.themeNote"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureAddForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑主题说明 -->
    <side-wrap
      v-loading="loadLiteratureDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              编辑主题
            </div>
          </div>
          <i
            class="el-icon-close"
            @click="cancelForm('literatureEditForm')"
          ></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureEditForm"
          label-width="90px"
          :model="literatureEditForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>主题信息</span>
            </div>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="literatureEditForm.libId"
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
            </el-form-item>
            <el-form-item class="item" prop="themeTitle" label="主题词">
              <el-input
                clearable
                v-model="literatureEditForm.themeTitle"
                ref="themeTitle"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" prop="themeZtai" label="状态">
              <el-radio-group v-model="literatureEditForm.themeZtai">
                <el-radio :label="true">激活</el-radio>
                <el-radio :label="false">关闭</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="item" prop="sort" label="排序">
              <el-input
                clearable
                v-model="literatureEditForm.sort"
                ref="sort"
              ></el-input>
            </el-form-item>

            <el-form-item class="item" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="literatureEditForm.themeNote"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureEditForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 删除前迁移弹框 -->
    <el-dialog title="删除主题" :visible.sync="dialogTheme">
      <el-form :model="delThemeForm" size="mini">
        <p>该主题关联有推荐的书目信息，删除前是否需要迁移书目？</p>
        <el-form-item
          label=""
          :label-width="formLabelWidth"
          style="margin:20px 0"
        >
          <el-radio-group v-model="delThemeForm.migrate">
            <el-radio :label="true">迁移</el-radio>
            <el-radio :label="false">不迁移</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item
          label="目标主题："
          :label-width="formLabelWidth"
          v-if="delThemeForm.migrate == true"
        >
          <el-select
            filterable
            v-model="delThemeForm.targetTheme"
            placeholder="请选择目标主题"
          >
            <el-option
              v-for="item in themeList"
              :key="item.themeId"
              :label="item.themeTitle"
              :value="item.themeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="dialogTheme = false">取 消</el-button>
        <el-button
          size="mini"
          type="primary"
          @click="confirmDel(delThemeForm.ids)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 迁移弹框 -->
    <el-dialog title="迁移书目" :visible.sync="dialogMigrate">
      <el-form :model="migrateThemeForm" size="mini">
        <el-form-item label="目标主题：" :label-width="formLabelWidth">
          <el-select
            filterable
            v-model="migrateThemeForm.targetTheme"
            placeholder="请选择目标主题"
          >
            <el-option
              v-for="item in themeList"
              :key="item.themeId"
              :label="item.themeTitle"
              :value="item.themeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="mini" @click="migrateThemeForm = false"
          >取 消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="confirmMigrate(migrateThemeForm.ids)"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchTstjB,
  saveTstjTheme,
  updZtaiTstjTheme,
  delTheme,
  themeList,
  migrateTheme,
  themeExop
} from "api/acquisition";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";

let znumRules = (rule, value, callback) => {
  if (!/(^[1-9]+\d*$)|(^0$)/.test(value)) {
    callback(new Error("只能为正整数或0"));
  } else {
    callback();
  }
};
export default {
  name: "acq_tstj",
  data() {
    this.literatureFilterOptions = [
      {
        value: "themeTitle",
        label: "主题"
      },
      {
        value: "userName",
        label: "操作人"
      }
    ];
    return {
      // 多选
      multipleLiteratureSelection: [],
      multipleBook: [],
      bookSum: "",
      // 激活主题列表
      themeList: [],
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "themeTitle",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      // 新增
      showAddSide: false,
      literatureAddForm: {
        themeTitle: "",
        libId: this.$store.getters.userInfo.libId,
        themeNote: "",
        themeZtai: true,
        sort: ""
      },
      literatureEditForm: {
        themeTitle: "",
        libId: "",
        themeNote: "",
        themeZtai: "",
        sort: ""
      },
      delThemeForm: {
        migrate: true,
        targetTheme: ""
      },
      migrateThemeForm: {
        targetTheme: ""
      },
      formLabelWidth: "120px",
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      dialogTheme: false,
      dialogMigrate: false,

      rules: {
        libId: [{ required: true, message: "请选择成员馆", trigger: "blur" }],
        themeZtai: [{ required: true, message: "请选择状态", trigger: "blur" }],

        themeTitle: [
          { required: true, message: "请填写主题 ", trigger: "blur" }
        ],
        sort: [
          { required: true, message: "排序不能为空", trigger: "blur" },
          { validator: znumRules, trigger: "change" }
        ]
      },
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择
              time.getTime() > Date.now() ||
              time.getTime() > new Date(this.date2)
            );
          }
          // 结束时间没选--可以选择当天
          return time.getTime() > Date.now();
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(this.date1)
          );
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
      this.setRequestObj();
      this.getLiteratureList();
    },
    // clickRow(row) {
    //   this.$refs.table.toggleRowSelection(row);
    // },
    rowDblclick(row) {
      this.editGzsm(row);
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj,
        start: this.date1,
        end: this.date2
      };

      searchTstjB(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data.dataList;
          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
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
    },
    // 提交接口
    handleLiteratureFormAdd() {
      let params = {
        themeTitle: this.literatureAddForm.themeTitle,
        themeNote: this.literatureAddForm.themeNote,
        themeZtai: this.literatureAddForm.themeZtai ? "0" : "1",
        libId: this.literatureAddForm.libId,
        sort: this.literatureAddForm.sort
      };
      saveTstjTheme(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          // 刷新列表
          this.initLiteratureList();
        }
      });
    },
    // 编辑接口
    handleLiteratureFormEdit() {
      let params = {
        themeTitle: this.literatureEditForm.themeTitle,
        themeNote: this.literatureEditForm.themeNote,
        themeZtai: this.literatureEditForm.themeZtai ? "0" : "1",
        libId: this.literatureEditForm.libId,
        themeId: this.literatureEditForm.themeId,
        sort: this.literatureEditForm.sort
      };
      saveTstjTheme(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.message,
            type: "success"
          });
          this.initLiteratureList();
        }
      });
    },
    // 取消提交
    cancelForm(formName) {
      if (formName === "literatureAddForm") {
        this.showAddSide = false;
        this.$refs["literatureAddForm"].resetFields();
        this.literatureAddForm.themeNote = "";
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
        this.literatureEditForm.themeNote = "";
      }
    },
    // 保存提交
    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          if (formName === "literatureAddForm") {
            this.handleLiteratureFormAdd();
            this.showAddSide = false;
            this.$refs["literatureAddForm"].resetFields();
            this.literatureAddForm.themeNote = "";
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit();
            this.showEditSide = false;
            this.$refs["literatureEditForm"].resetFields();
            this.literatureEditForm.themeNote = "";
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
    // 编辑批次
    editGzsm(row) {
      this.showEditSide = true;
      this.literatureEditForm = { ...row };
      this.literatureEditForm.themeZtai =
        this.literatureEditForm.themeZtai == 0 ? true : false;
    },
    // 删除接口---0直接删除，1有迁移后删除
    delTheme(ids, index) {
      this.dialogTheme = false;

      if (!index) {
        // 直接删除

        delTheme({
          themeIds: ids,
          removal: false
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.initLiteratureList();
          }
        });
      } else {
        // 迁移后删除
        delTheme({
          themeIds: ids,
          removal: true,
          themeId: this.delThemeForm.targetTheme
        }).then(res => {
          if (res.code == 0) {
            this.$message({
              message: res.message,
              type: "success"
            });
            this.delThemeForm.targetTheme = "";
            this.initLiteratureList();
          }
        });
      }
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm(`确定要删除主题词【${row.themeTitle}】吗?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          // 判断主题是否有关联书目，无则直接删除，有则弹窗，在弹窗内删除
          let flag = Number(row.bookNum) > 0 ? true : false;
          if (flag) {
            // 有关联
            this.delThemeForm.ids = row.themeId;
            this.dialogTheme = true;
            this.getThemeList();
          } else {
            this.delTheme(row.themeId, 0);
          }
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm(
        `确定要删除${this.multipleLiteratureSelection.length}条数据么?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          if (this.bookSum > 0) {
            this.dialogTheme = true;
            this.delThemeForm.ids = this.multipleLiteratureSelection.join();
            this.getThemeList();
          } else {
            this.delTheme(this.multipleLiteratureSelection.join(), 0);
          }
        })
        .catch(() => {});
    },
    // 弹窗内确认删除按钮
    confirmDel(ids) {
      if (this.delThemeForm.migrate) {
        // 迁移

        this.delTheme(ids, 1);
      } else {
        this.delTheme(ids, 0);
      }
    },
    // 弹窗内确认迁移
    confirmMigrate(ids) {
      this.dialogMigrate = false;
      this.migrateTheme(ids);
    },
    // 迁移接口
    migrateTheme(ids) {
      migrateTheme({
        themeIds: ids,
        themeId: this.migrateThemeForm.targetTheme
      }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.initLiteratureList();
        }
      });
    },
    // 导出
    handleExport() {
      if (this.multipleLiteratureSelection.length > 0) {
        downLoadExcel(themeExop(), {
          themeIds: this.multipleLiteratureSelection.join()
        });
      } else {
        this.$message.error("请选择主题");
      }
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.themeId);

      this.multipleBook = val.map(item => {
        return Number(item.bookNum);
      });
      this.bookSum = 0;
      this.multipleBook.forEach(item => {
        this.bookSum += item;
      });
    },
    getThemeList() {
      themeList({ libId: this.selectLibId, isAlive: true }).then(res => {
        if (res.code == 0) {
          this.themeList = res.data.map(item => {
            return {
              themeId: item.themeId,
              themeTitle: item.themeTitle
            };
          });
        }
      });
    },
    // 单迁移按钮
    migrate(row) {
      if (row.bookNum == 0) {
        this.$message.error("该主题未关联书目");
      } else {
        this.migrateThemeForm.ids = row.themeId;
        this.dialogMigrate = true;
        this.getThemeList();
      }
    },
    // 批量迁移按钮
    migrateAll() {
      if (this.bookSum > 0) {
        this.dialogMigrate = true;
        this.migrateThemeForm.ids = this.multipleLiteratureSelection.join();
        this.getThemeList();
      } else {
        this.$message.error("所选主题均未关联书目");
      }
    },
    // 切换主题状态
    upStatus(index, row) {
      updZtaiTstjTheme({ themeId: row.themeId, themeZtai: index }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.initLiteratureList();
        }
      });
    },
    goBookItem(row) {
      this.$router.push({
        name: "acq_tstjBookItem",
        query: {
          themeId: row.themeId,
          libId: row.libId
        }
      });
    }
  },
  mounted() {
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
