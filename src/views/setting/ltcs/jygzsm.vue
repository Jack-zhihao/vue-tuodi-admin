<!--
 * @Description: 借阅规则说明
 * @Version: 4.1
 * @Autor: weijie.liang
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-07 17:10:08
 -->

<template>
  <div class="common__content">
    <td-content-header>
      借阅规则说明
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
          <p class="label">读者类型：</p>
          <el-select
            filterable
            size="mini"
            v-model="readerId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in readerArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="statusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
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
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beizhu"
            label="借阅规则说明"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['del', 'edit']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
              ></td-action-tool>
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
    <!-- 新增规则说明 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增借阅说明
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
          :model="literatureAddForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>借阅说明信息</span>
            </div>
            <el-form-item class="item" prop="selectLibId" label="成员馆">
              <el-select
                filterable
                v-model="literatureAddForm.selectLibId"
                placeholder="请选择"
                ref="selectLibId"
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
            <el-form-item class="item" prop="readerId" label="读者类型">
              <el-select
                filterable
                v-model="literatureAddForm.readerId"
                placeholder="请选择"
                ref="readerId"
              >
                <el-option
                  v-for="item in readerArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="status" label="状态">
              <el-radio-group v-model="literatureAddForm.status" ref="status">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="借阅规则说明">
              <el-input
                clearable
                type="textarea"
                v-model="literatureAddForm.beizhu"
                ref="beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
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
    <!-- 编辑规则说明 -->
    <side-wrap
      v-loading="loadLiteratureDetail"
      class="common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              编辑借阅说明
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
          label-width="80px"
          :model="literatureEditForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>借阅说明信息</span>
            </div>
            <el-form-item class="item" prop="selectLibId" label="成员馆">
              <el-select
                filterable
                v-model="literatureEditForm.selectLibId"
                placeholder="请选择"
                ref="selectLibId"
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
            <el-form-item class="item" prop="readerId" label="读者类型">
              <el-select
                filterable
                v-model="literatureEditForm.readerId"
                placeholder="请选择"
                ref="readerId"
              >
                <el-option
                  v-for="item in readerArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" prop="status" label="状态">
              <el-radio-group v-model="literatureEditForm.status" ref="status">
                <el-radio :label="true">启用</el-radio>
                <el-radio :label="false">停用</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item class="item" prop="beizhu" label="借阅规则说明">
              <el-input
                clearable
                type="textarea"
                v-model="literatureEditForm.beizhu"
                ref="beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
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
  </div>
</template>

<script>
import { jygzsmList, jygzsmSave, jygzsmDel, readerTypeList } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_jysm",
  data() {
    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      statusSelect: [
        { label: "全部", value: "" },
        { label: "启用", value: "启用" },
        { label: "停用", value: "停用" }
      ],
      statusId: "",
      selectLibId: this.$store.getters.userInfo.libId,
      readerId: "",
      readerArr: [
        {
          label: "普通读者",
          value: "0"
        },
        {
          label: "高级读者",
          value: "1"
        }
      ],
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 新增
      showAddSide: false,
      literatureAddForm: {
        selectLibId: this.$store.getters.userInfo.libId,
        beizhu: "",
        status: "",
        readerId: ""
      },
      literatureEditForm: {
        selectLibId: this.$store.getters.userInfo.libId,
        beizhu: "",
        status: "",
        readerId: ""
      },
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      rules: {
        selectLibId: [
          { required: true, message: "请选择成员馆", trigger: "blur" }
        ],
        status: [{ required: true, message: "请选择状态", trigger: "blur" }],
        beizhu: [{ required: true, message: "请填写备注 ", trigger: "blur" }],
        readerId: [
          { required: true, message: "请选择读者类型", trigger: "blur" }
        ]
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
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.editGzsm(row);
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.selectLibId,
        ztai: this.statusId
      };
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj
      };

      jygzsmList(requestObj)
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
      if (this.literatureAddForm.status) {
        this.literatureAddForm.statusStr = "启用";
      } else {
        this.literatureAddForm.statusStr = "停用";
      }
      let params = {
        // jygzsmid: "jygzsmid",
        libid: this.literatureAddForm.selectLibId,
        ztai: this.literatureAddForm.statusStr,
        beizhu: this.literatureAddForm.beizhu,
        dzlxid: this.literatureAddForm.readerId
      };
      jygzsmSave(params).then(res => {
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
      if (this.literatureEditForm.status) {
        this.literatureEditForm.statusStr = "启用";
      } else {
        this.literatureEditForm.statusStr = "停用";
      }
      let params = {
        jygzsmid: this.literatureEditForm.jygzsmid,
        libid: this.literatureEditForm.selectLibId,
        ztai: this.literatureEditForm.statusStr,
        beizhu: this.literatureEditForm.beizhu,
        dzlxid: this.literatureEditForm.readerId
      };
      jygzsmSave(params).then(res => {
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
      } else if (formName === "literatureEditForm") {
        this.showEditSide = false;
        this.$refs["literatureEditForm"].resetFields();
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
          } else if (formName === "literatureEditForm") {
            this.handleLiteratureFormEdit();
            this.showEditSide = false;
            this.$refs["literatureEditForm"].resetFields();
          }
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    },
    // 编辑借阅规则
    editGzsm(row) {
      this.showEditSide = true;
      this.literatureEditForm.selectLibId = row.libid;
      this.literatureEditForm.jygzsmid = row.jygzsmid;
      this.literatureEditForm.readerId = row.dzlxid;
      if (row.ztai == "停用") {
        this.literatureEditForm.status = false;
      } else if (row.ztai == "启用") {
        this.literatureEditForm.status = true;
      }
      this.literatureEditForm.beizhu = row.beizhu;
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          jygzsmDel({ jygzsmids: row.jygzsmid }).then(res => {
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
          jygzsmDel({
            jygzsmids: this.multipleLiteratureSelection.join()
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
      this.multipleLiteratureSelection = val.map(item => item.jygzsmid);
    },
    // 读者类型数据
    readerTypeList() {
      readerTypeList().then(res => {
        this.readerArr = res.data.dataList.map(item => {
          return {
            label: item.mcheng,
            value: item.dzlxid
          };
        });
      });
    }
  },
  created() {
    this.initLiteratureList();
    this.readerTypeList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
</style>
