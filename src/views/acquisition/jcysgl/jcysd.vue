<!--
 * @Description: 教材验收单
 * @Autor: chenming.feng
 * @Date: 2019-11-04 10:53:49
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:52:05
 -->
<template>
  <div class="acq_ysdgl common__content">
    <td-content-header>
      验收单目录
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddYsdForm"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            size="mini"
            type="primary"
            @click="print"
            :disabled="
              multipleSelection.length === 0 || multipleSelection.length > 1
                ? true
                : false
            "
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="flag"
            placeholder="请选择"
          >
            <el-option
              v-for="item in flagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="content"
            placeholder="请输入搜索关键词"
            ref="contentInput"
          ></el-input>
          <p class="label">起止时间：</p>
          <el-date-picker
            style="margin-right: 3px;"
            size="mini"
            value-format="yyyy-MM-dd"
            clearable
            v-model="startDate"
            type="date"
            placeholder="开始时间"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="endDate"
            size="mini"
            clearable
            type="date"
            placeholder="结束时间"
            value-format="yyyy-MM-dd"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initGetPcSearchList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="contentTable">
        <el-table
          v-loading="loadUserListData"
          highlight-current-row
          @current-change="handleCurrentChange"
          @selection-change="handleSelectionChange"
          @row-click="clickRow"
          border
          :data="tableData"
          ref="tableSelect"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column label=" " type="index" align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="daima" label="验收单">
            <template slot-scope="scope">
              <span
                class="g-row__check primary"
                @click="handleDirectDetailPage(scope.row.yspcid)"
                >{{ scope.row.daima }}</span
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="gysName" label="供应商">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="操作员">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column prop="optime" show-overflow-tooltip label="创建时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="beizhu" label="备注">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="设为工作验收单">
            <template slot-scope="scope">
              <span v-if="!(scope.row.ztai === '完成')">
                <i
                  @click="setWorkYsd(scope.row.yspcid)"
                  :class="
                    scope.row.work
                      ? 'el-icon-star-on workStyle'
                      : 'el-icon-star-off workNoStyle'
                  "
                ></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.yspcid"
                :index="scope.$index"
                :data="scope.row"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="handleDirectDetailPage(scope.row.yspcid)"
                  >
                    详情
                  </div>
                  <div class="menu" @click="editDetailPage(scope.row)">
                    编辑
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
          :total="totalCount"
          :currentPage="currentUserListPage"
          :pageSize="userListPageSize"
        ></td-pagination>
      </div>
    </div>

    <side-wrap class="common__side_form" v-if="showAddYsdSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">新增验收单</div>
          </div>
          <i class="el-icon-close" @click="handleCloseYsdForm"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="YsdAddForm"
          :model="YsdAddForm"
          :rules="YsdAddFormRules"
          label-width="90px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">验收单信息</div>
            <el-form-item class="item" prop="daima" label="验收单">
              <el-input clearable v-model="YsdAddForm.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                v-model="YsdAddForm.gysid"
                placeholder="请选择供应商"
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
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                disabled
                v-model="YsdAddForm.libid"
                placeholder="选择成员馆"
                @change="getParamList"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                v-model="YsdAddForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysList"
                  :key="item.ysid"
                  :label="item.mingcheng"
                  :value="item.ysid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="isWork" label="当前验收单">
              <el-switch
                v-model="YsdAddForm.isWork"
                active-text="开"
                inactive-text="关"
              >
              </el-switch>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="YsdAddForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="resetYsdAddForm">重置</el-button>
          </div>
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm('YsdAddForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="handleCloseYsdForm">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑验证单 -->
    <side-wrap class="common__side_form" v-if="showEditYsdSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">编辑验收单</div>
          </div>
          <i class="el-icon-close" @click="handleCloseEditYsdForm"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="YsdEditForm"
          :model="YsdEditForm"
          :rules="YsdEditFormRules"
          label-width="90px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">验收单信息</div>
            <el-form-item class="item" prop="daima" label="验收单">
              <el-input
                :disabled="true"
                clearable
                v-model="YsdEditForm.daima"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                v-model="YsdEditForm.gysid"
                placeholder="请选择供应商"
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
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                disabled
                v-model="YsdEditForm.libid"
                placeholder="选择成员馆"
                @change="getParamList"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                v-model="YsdEditForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysList"
                  :key="item.ysid"
                  :label="item.mingcheng"
                  :value="item.ysid"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item class="item" prop="isWork" label="当前验收单">
              <el-switch
                v-model="YsdEditForm.isWork"
                active-text="开"
                inactive-text="关"
              >
              </el-switch>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-select
                filterable
                v-model="YsdEditForm.ztai"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ztaiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="YsdEditForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetYsdEditForm">重置</el-button>
          </div>
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitEditForm('YsdEditForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="handleCloseEditYsdForm"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
// import { validateObj } from "utils/validate";
import { userGysInLibList, userYsLibList } from "api/public";
import { mapGetters } from "vuex";
import { pcSearch, workSave, pcSave } from "api/acquisition";
import { downLoadExcel } from "utils/utils";
export default {
  name: "acq_ysdgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.flagList = [
      { value: 1, label: "验收单" },
      { value: 2, label: "供应商" }
    ];
    this.libId = this.$store.getters.userInfo.libId;
    this.YsdAddFormRules = {
      daima: [{ required: true, message: "验收单不能为空", trigger: "blur" }],
      libid: [{ required: true, message: "成员馆不能为空", trigger: "blur" }],
      ysid: [{ required: true, message: "预算代码不能为空", trigger: "blur" }],
      gysid: [{ required: true, message: "供应商不能为空", trigger: "blur" }]
    };
    this.YsdEditFormRules = {
      daima: [{ required: true, message: "验收单不能为空", trigger: "blur" }],
      libid: [{ required: true, message: "成员馆不能为空", trigger: "blur" }],
      ysid: [{ required: true, message: "预算代码不能为空", trigger: "blur" }],
      gysid: [{ required: true, message: "供应商不能为空", trigger: "blur" }]
    };
    return {
      // 列表信息
      totalCount: 0,
      currentUserListPage: 1,
      userListPageSize: 10,
      gysOptions: [],
      gysSelect: "",
      loadUserListData: false,
      tableData: [],
      YsdAddForm: {
        libid: this.$store.getters.userInfo.libId,
        daima: "",
        gysid: "",
        ysid: "",
        beizhu: "",
        isWork: false
      },

      multipleSelection: [],
      currentRow: null,
      showAddYsdSide: false,
      ysOrderSearchKey: "",
      startDate: "",
      endDate: "",
      flag: 1,
      content: "",
      ysList: "",

      showEditYsdSide: false,
      YsdEditForm: {
        libid: this.$store.getters.userInfo.libId,
        daima: "",
        gysid: "",
        ysid: "",
        beizhu: "",
        isWork: false,
        yspcid: "",
        ztai: ""
      },
      ztaiList: [
        { value: "完成", label: "完成" },
        { value: "验收", label: "验收" },
        { value: "编目", label: "编目" }
      ]
    };
  },
  methods: {
    getParamList() {
      this.getGysOptions();
      this.getYsdmOptions();
    },
    // 获取预算代码和供应商列表
    getGysOptions() {
      // 供应商
      userGysInLibList({
        libId: this.YsdAddForm.libid
      })
        .then(res => {
          this.gysOptions = res.data.map(item => {
            return {
              value: item.gysId,
              label: item.gysName
            };
          });
          this.YsdAddForm.gysid = this.gysOptions[0]
            ? this.gysOptions[0].value
            : "";
        })
        .catch(() => {});
    },
    getYsdmOptions() {
      userYsLibList({
        libId: this.YsdAddForm.libid
      })
        .then(res => {
          this.ysList = res.data;
          this.YsdAddForm.ysid = this.ysList[0] ? this.ysList[0].ysid : "";
        })
        .catch(() => {});
    },
    initGetPcSearchList() {
      this.currentUserListPage = 1;
      this.getPcSearchList();
    },

    getPcSearchList() {
      this.loadUserListData = !this.loadUserListData;
      let param = {};
      param.flag = this.flag;
      param.content = this.content;
      param.startDate = this.startDate;
      param.endDate = this.endDate;
      param.pageNumber = this.currentUserListPage;
      param.pageSize = this.userListPageSize;
      pcSearch(param).then(res => {
        this.loadUserListData = !this.loadUserListData;
        this.totalCount = +res.data.totalElements;
        this.tableData = [...res.data.dataList];
      });
    },
    setWorkYsd(id) {
      workSave({ yspcid: id }).then(res => {
        this.$message.success(res.message);
        this.tableData.map(ele => {
          if (ele.yspcid == id) {
            ele.work = true;
          } else {
            ele.work = false;
          }
        });
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          pcSave(this.YsdAddForm).then(res => {
            this.$message.success(res.message);
            this.showAddYsdSide = false;
            this.$refs["YsdAddForm"].resetFields();
            this.initGetPcSearchList();
          });
        } else {
          return false;
        }
      });
    },
    showAddYsdForm() {
      this.showAddYsdSide = true;
      this.addYsdFrom = true;
      // this.getGysOptions();
      // this.getYsdmOptions();
    },

    handleCloseYsdForm() {
      this.showAddYsdSide = false;
      this.$refs["YsdAddForm"].resetFields();
    },
    resetYsdAddForm() {
      this.$refs["YsdAddForm"].resetFields();
    },
    resetYsdEditForm() {
      this.$refs["YsdEditForm"].resetFields();
    },
    //导出
    print() {
      downLoadExcel("api/e/interview/file/yssmE", {
        yspcid: this.multipleSelection[0]
      });
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },

    handleUserSizeChange(pageSize) {
      this.userListPageSize = pageSize;
      this.getPcSearchList();
    },
    handleUserCurrentChange(currentPage) {
      this.currentUserListPage = currentPage;
      this.getPcSearchList();
    },

    // 点击当前行
    clickRow(row) {
      this.$refs.tableSelect.toggleRowSelection(row);
    },
    editDetailPage(val) {
      this.showEditYsdSide = true;
      this.$nextTick(() => {
        this.$refs["YsdEditForm"].resetFields();
      });
      this.YsdEditForm.daima = val.daima;
      this.YsdEditForm.gysid = val.gysid;
      this.YsdEditForm.ysid = val.ysid;
      this.YsdEditForm.isWork = val.work;
      this.YsdEditForm.beizhu = val.beizhu;
      this.YsdEditForm.yspcid = val.yspcid;
      this.YsdEditForm.ztai = val.ztai;
    },
    submitEditForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          pcSave(this.YsdEditForm).then(res => {
            this.$message.success(res.message);
            this.showEditYsdSide = false;
            this.initGetPcSearchList();
          });
        } else {
          return false;
        }
      });
    },

    handleCloseEditYsdForm() {
      this.showEditYsdSide = false;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(item => item.yspcid);
    },
    // 前往征订验收单详情列表
    handleDirectDetailPage(id) {
      this.$router.push({
        name: "acq_jcysdxq",
        query: {
          yspcid: id
        }
      });
    }
  },
  mounted() {
    this.getGysOptions();
    this.getYsdmOptions();
    this.initGetPcSearchList();
    this.$refs.contentInput.focus();
  },
  activated() {
    this.$refs.contentInput.focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
