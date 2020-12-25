<!--
 * @Description: 征订数目预订
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-03-16 11:09:37
 * @LastEditTime: 2020-03-10 15:58:27
 -->

<template>
  <div class="acq-zdsmyd common__content">
    <td-content-header>
      征订目录
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddZDCatalog"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            type="primary"
            :disabled="multipleZDCatalogSelection.length === 0"
            size="mini"
            @click="deleteZDCatalog('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
              v-show="multipleZDCatalogSelection.length"
              >({{ multipleZDCatalogSelection.length }})</span
            ></el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">供应商：</p>
          <el-select
            filterable
            size="mini"
            v-model="gysId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in gysList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">创建时间：</p>
          <el-date-picker
            size="mini"
            v-model="startDate"
            value-format="yyyy-MM-dd"
            style="marginRight:3px"
            type="date"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="endDate"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          >
          </el-date-picker>
          <el-input
            size="mini"
            clearable
            v-model="zdCatalogSearchKey"
            placeholder="请输入征订目录"
            @keydown.enter.native="initZDCatalogList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initZDCatalogList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          ref="zdsmydTable"
          v-loading="loadZDCatalogData"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleZDCatalogSelectionChange"
          border
          :data="zdCatalogList"
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
                @click="handleDirectDetailPage(scope.row.zdpcid)"
                class="g-row__check primary"
                >{{ scope.row.zdpcdm }}</span
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cygName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="gysName" label="供应商">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="创建时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="创建者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fuzhu" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                ref="actionTool"
                :id="scope.row.zdpcid"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="checkZDCatalogDetail"
                @handleDel="deleteZDCatalog(scope.row)"
              >
                <template v-slot:menus>
                  <div class="menu" @click="downLoadData(scope.row.zdpcid)">
                    导出
                  </div>
                  <div
                    class="menu"
                    @click="handleDirectDetailPage(scope.row.zdpcid)"
                  >
                    详情
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleZDCatalogSizeChange"
          @current-change="handleZDCatalogCurrentChange"
          :total="totalZDCatalogCount"
          :currentPage="currentZDCatalogPage"
          :pageSize="zdCatalogPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增征订目录 -->
    <side-wrap class="common__side_form" v-show="showAddSide" width="850px">
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
          ref="zdCatalogAddForm"
          label-width="90px"
          :model="zdCatalogAddForm"
          size="mini"
          :rules="zdCatalogFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>征订目录信息</span>
            </div>
            <el-form-item class="item" prop="zdpcdm" label="征订目录">
              <el-input clearable v-model="zdCatalogAddForm.zdpcdm"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                disabled
                v-model="zdCatalogAddForm.libid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cygList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                v-model="zdCatalogAddForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysAddList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item item__textarea" prop="fuzhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="zdCatalogAddForm.fuzhu"
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
              @click="submitForm('zdCatalogAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSide = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑征订目录 -->
    <side-wrap class="common__side_form" v-show="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              编辑征订目录
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="zdCatalogEditForm"
          label-width="90px"
          :model="zdCatalogEditForm"
          :rules="zdCatalogFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>征订目录信息</span>
            </div>
            <el-form-item class="item" prop="zdpcdm" label="征订目录">
              <el-input clearable v-model="zdCatalogEditForm.zdpcdm"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                disabled
                v-model="zdCatalogEditForm.libid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in cygList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                v-model="zdCatalogEditForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysEditList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item item__textarea" prop="fuzhu" label="备注">
              <el-input
                type="textarea"
                clearable
                v-model="zdCatalogEditForm.fuzhu"
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
              @click="submitForm('zdCatalogEditForm')"
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
import { userGysInLibList, getCygList } from "api/public";
import { searchZdpc, saveZdpc, delZdpc } from "api/acquisition";
import { downLoadExcel } from "utils/utils";

export default {
  name: "acq_zdsmyd",
  data() {
    this.zdCatalogFormRules = {
      zdpcdm: [
        { required: true, message: "征订目录不能为空", trigger: "blur" }
      ],
      libid: [{ required: true, message: "请选择成员馆", trigger: "change" }],
      gysid: [{ required: true, message: "请选择供应商", trigger: "change" }]
    };
    return {
      // 列表相关
      multipleZDCatalogSelection: [],
      gysList: [],
      cygList: [],
      gysId: "",
      loadZDCatalogData: false,
      zdCatalogList: [],
      zdCatalogSearchKey: "",
      zdCatalogPageSize: 15,
      currentZDCatalogPage: 1,
      totalZDCatalogCount: 0,
      currentZDCatalogId: "",
      startDate: "",
      endDate: "",
      // 新增
      gysAddList: [],
      showAddSide: false,
      zdCatalogAddForm: {
        zdpcdm: "",
        libid: "",
        gysid: "",
        fuzhu: ""
      },
      // 编辑
      gysEditList: [],
      showEditSide: false,
      zdCatalogEditForm: {
        zdpcdm: "",
        libid: "",
        gysid: "",
        fuzhu: ""
      }
    };
  },
  methods: {
    // 征订目录列表
    rowClick(row) {
      this.$refs["zdsmydTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkZDCatalogDetail(row.zdpcid, "", row);
    },
    initZDCatalogList() {
      this.currentZDCatalogPage = 1;
      this.setRequestObj();
      this.getZDCatalogList();
    },
    getGysList() {
      userGysInLibList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        let filterData = res.data.map(item => {
          return {
            label: item.gysName,
            value: item.gysId
          };
        });
        filterData.unshift({
          label: "全部",
          value: ""
        });
        this.gysList = filterData;
      });
    },
    handleZDCatalogSelectionChange(val) {
      this.multipleZDCatalogSelection = val.map(item => item.zdpcid);
    },
    deleteZDCatalog(row) {
      this.$confirm(
        row.zdpcid
          ? `该操作将同步删除征订目录【${
              row.zdpcdm
            }】下的书目信息，是否确认删除?`
          : `确定删除${this.multipleZDCatalogSelection.length}条数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadZDCatalogData = true;
          delZdpc({
            zdpcids: row.zdpcid
              ? row.zdpcid
              : this.multipleZDCatalogSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initZDCatalogList();
            })
            .finally(() => {
              this.loadZDCatalogData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        gysId: this.gysId,
        zdpcCode: this.zdCatalogSearchKey,
        startDate: this.startDate,
        endDate: this.endDate
      };
    },
    getZDCatalogList() {
      this.loadZDCatalogData = true;

      let requestObj = {
        pageNumber: this.currentZDCatalogPage,
        pageSize: this.zdCatalogPageSize,
        ...this.requestObj
      };

      searchZdpc(requestObj)
        .then(res => {
          this.zdCatalogList = res.data.dataList;
          this.totalZDCatalogCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadZDCatalogData = false;
        });
    },
    handleZDCatalogSizeChange(val) {
      this.zdCatalogPageSize = val;
      this.getZDCatalogList();
    },
    handleZDCatalogCurrentChange(val) {
      this.currentZDCatalogPage = val;
      this.getZDCatalogList();
    },
    // 目录新增
    getGysAddList() {
      userGysInLibList({
        libId: this.zdCatalogAddForm.libid
      }).then(res => {
        this.gysAddList = res.data.map(item => {
          return {
            label: item.gysName,
            value: item.gysId
          };
        });
        this.zdCatalogAddForm.gysid = this.gysAddList[0]
          ? this.gysAddList[0].value
          : "";
      });
    },
    showAddZDCatalog() {
      this.showAddSide = true;
      this.$refs["zdCatalogAddForm"].clearValidate("zdpcdm");
      this.zdCatalogAddForm.zdpcdm = "";
      this.zdCatalogAddForm.fuzhu = "";
      this.zdCatalogAddForm.libid = this.$store.getters.userInfo.libId;
      this.getGysAddList();
    },
    handleLiteratureFormAdd() {
      saveZdpc(this.zdCatalogAddForm).then(res => {
        this.$message.success(res.message);
        this.showAddSide = false;
        this.initZDCatalogList();
      });
    },
    downLoadData(zdpcid) {
      this.$refs.actionTool.showTool = false;
      downLoadExcel("/api/e/interview/file/zdsmE", {
        zdpcid: zdpcid
      });
    },
    // 目录编辑
    getGysEditList(libid) {
      userGysInLibList({
        libId: this.zdCatalogEditForm.libid
      }).then(res => {
        this.gysEditList = res.data.map(item => {
          return {
            label: item.gysName,
            value: item.gysId
          };
        });
        // 切换成员馆
        if (libid) {
          this.zdCatalogEditForm.gysid = this.gysEditList[0]
            ? this.gysEditList[0].value
            : "";
        }
      });
    },
    checkZDCatalogDetail(id, index, data) {
      this.currentZDCatalogId = id;
      this.showEditSide = true;
      this.$refs["zdCatalogEditForm"].clearValidate("zdpcdm");
      this.zdCatalogEditForm = {
        zdpcdm: data.zdpcdm,
        libid: data.libid,
        gysid: data.gysid,
        fuzhu: data.fuzhu
      };
      this.getGysEditList();
    },
    handleLiteratureFormEdit() {
      let requestObj = {
        zdpcid: this.currentZDCatalogId,
        ...this.zdCatalogEditForm
      };
      saveZdpc(requestObj).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initZDCatalogList();
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "zdCatalogAddForm") {
            this.handleLiteratureFormAdd();
          } else if (formName === "zdCatalogEditForm") {
            this.handleLiteratureFormEdit();
          }
        } else {
          return false;
        }
      });
    },
    getCygList() {
      getCygList().then(res => {
        this.cygList = res.data.map(item => {
          return {
            label: item.libJiancheng,
            value: item.libId
          };
        });
      });
    },
    // 前往征订书目列表
    handleDirectDetailPage(id) {
      this.$router.push({
        name: "acq_zdsmlb",
        query: {
          zdpcid: id
        }
      });
    }
  },
  created() {
    this.getGysList();
    this.getCygList();
    this.initZDCatalogList();
  },
  activated() {
    this.getGysList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
