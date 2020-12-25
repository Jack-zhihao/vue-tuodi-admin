<template>
  <div class="pcgl common__content">
    <td-content-header>
      <span>批次管理</span>

      <el-radio-group v-model="radio" @change="selectSXJ">
        <el-radio label="sj">上架批次</el-radio>
        <el-radio label="xj">下架批次</el-radio>
      </el-radio-group>

      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <!-- <el-button
            size="mini"
            type="primary"
            @click="takeBook"
            v-if="radio == 'sj'"
          >
            确认取书
          </el-button> -->
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleLiteratureSelection.length === 0"
            @click="deleteGzsm"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
            <span v-show="multipleLiteratureSelection.length"
              >({{ multipleLiteratureSelection.length }})</span
            >
          </el-button>
          <!-- <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          > -->
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
          <p class="label">批次：</p>
          <el-select filterable size="mini" v-model="pici" placeholder="请选择">
            <el-option
              v-for="item in piciArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label" v-if="radio == 'sj'">目的藏址：</p>
          <p class="label" v-if="radio == 'xj'">下架藏址：</p>

          <el-select
            filterable
            size="mini"
            v-model="targetCz"
            placeholder="请选择"
          >
            <el-option
              v-for="item in tarczArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
          ></el-input>

          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="date1"
            type="datetime"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="startDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            type="datetime"
            placeholder="选择结束时间"
            size="mini"
            clearable
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            :picker-options="endDatePicker"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="content__header">
        <div class="header__line">
          <p class="label">批次状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="pcStatusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in pcStatusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">备注：</p>
          <el-input
            size="mini"
            clearable
            v-model="beizhu"
            placeholder="请输入"
          ></el-input>
          <el-button type="primary" size="mini" @click="initLiteratureList">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadDCPCData"
          border=""
          ref="DCPCList"
          :data="DCPCList"
          stripe
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label="序号"
            align="center"
            width="65"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="批次名称">
            <template slot-scope="scope">
              <span
                @click="handleDirectDetailPage(scope.row)"
                class="g-row__check primary"
                >{{ scope.row.daima }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="目的藏址"
            v-if="radio == 'sj'"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="下架藏址"
            v-if="radio == 'xj'"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="targetCount"
            label="派发数量"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="finishCount"
            label="完成数量"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optUserName"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optUserid"
            label="操作员账号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="targetUserName"
            label="派发员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="targetUserid"
            label="派发员账号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="finish_status"
            label="批次状态"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="备注"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                v-if="scope.row.finish == '0' && radio == 'sj'"
                :ops="['detail', 'edit', 'del']"
                @handleDetail="handleDetail(scope.row)"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row)"
              >
              </td-action-tool>
              <td-action-tool
                v-if="
                  (scope.row.finish == '2' && radio == 'sj') ||
                    (scope.row.finish == '3' && radio == 'sj')
                "
                :ops="['detail']"
                @handleDetail="handleDetail(scope.row)"
              >
              </td-action-tool>
              <td-action-tool
                v-if="radio == 'xj'"
                :ops="['detail', 'edit', 'del']"
                @handleDetail="handleDetail(scope.row)"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row)"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增编辑弹窗 -->
    <side-wrap class="common__side_form" v-if="showSideWarp" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增批次</div>
            <div v-else class="tit">编辑批次</div>
          </div>
          <i class="el-icon-close" @click="cancelForm('DCPCForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="DCPCForm"
          label-width="90px"
          :model="DCPCForm"
          :rules="DCPCFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="pcName" label="批次名称">
              <el-input
                clearable
                v-model="DCPCForm.pcName"
                placeholder="请输入"
                ref="pcName"
              ></el-input>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" prop="pcType" label="批次类型">
              <el-select
                filterable
                v-model="DCPCForm.pcType"
                placeholder="请选择"
                disabled
                ref="pcType"
              >
                <el-option
                  v-for="item in pcTypeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                v-model="DCPCForm.libid"
                placeholder="请选择"
                ref="libid"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item
              class="item"
              prop="tarCz"
              :label="radio == 'sj' ? '目的藏址' : '下架藏址'"
            >
              <el-select
                filterable
                v-model="DCPCForm.tarCz"
                placeholder="请选择"
                ref="tarCz"
              >
                <el-option
                  v-for="item in czArrForm"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" prop="operator" label="运营人员">
              <el-select
                filterable
                v-model="DCPCForm.operator"
                placeholder="请选择"
                ref="operator"
              >
                <el-option
                  v-for="item in operatorArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" prop="fuzhu" label="备注">
              <el-input
                clearable
                v-model="DCPCForm.fuzhu"
                type="textarea"
                ref="fuzhu"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>

            <p>
              注：请保存批次，并前往【派发图书】中添加需要<span
                v-if="radio == 'sj'"
                >上架</span
              ><span v-if="radio == 'xj'">下架</span>的图书，再执行派发
            </p>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
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
import { mapGetters } from "vuex";
import {
  getSxjpcList,
  pcListAdd,
  pcListUpdate,
  pcglList,
  pcglDel,
  dztemExpo
} from "api/operation";
import { downLoadExcel } from "utils/utils";

export default {
  name: "opera_pcgl",
  data() {
    this.DCPCFormRules = {
      pcName: [
        { required: true, message: "请填写批次名称", trigger: "change" }
      ],
      pcType: [
        { required: true, message: "请选择批次类型", trigger: "change" }
      ],
      libid: [{ required: true, message: "请选择成员馆", trigger: "change" }],
      tarCz: [{ required: true, message: "请选择藏址", trigger: "change" }],
      operator: [
        { required: true, message: "请选择运营人员", trigger: "change" }
      ]
    };
    return {
      libid: this.$store.getters.userInfo.libId,
      radio: "sj",
      piciArr: [],
      pici: "",
      targetCz: "",
      tarczArr: [],

      currentFilterKey: "targetUserId",
      literatureFilterOptions: [
        // { label: "操作员", value: "operator" },
        // { label: "操作员账号", value: "operCode" },
        { label: "派发员", value: "targetUserId" }
        // { label: "派发员账号", value: "pfCode" }
      ],
      literatureSearchKey: "",
      date1: "",
      date2: "",
      pcStatusId: "",
      pcStatusArr: [
        { label: "全部", value: "" },
        { label: "未派发", value: "0" },
        { label: "未确认", value: "1" },
        { label: "待处理", value: "2" },
        { label: "已完成", value: "3" }
      ],
      beizhu: "",
      loadDCPCData: false,
      DCPCList: [],
      totalLiteratureCount: 0,
      currentLiteraturePage: 1,
      literaturePageSize: 15,
      multipleLiteratureSelection: [],
      showSideWarp: false,
      isAdd: true,
      DCPCForm: {
        pcName: "",
        pcType: "上架",
        libid: "",
        tarCz: "",
        operator: "",
        fuzhu: ""
      },
      sxjPcId: "",
      pcTypeArr: [
        { label: "上架", value: "上架" },
        { label: "下架", value: "下架" }
      ],
      czArrForm: [],
      operatorArr: [],
      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.date2)
            );
          }
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return time.getTime() < new Date(this.date1);
        }
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    selectSXJ() {
      this.getSxjpcList();
    },
    getSxjpcList() {
      let code = this.radio == "sj" ? "1" : "2";
      let params = {
        code,
        libId: this.libid
      };
      let newArr = [];
      let newCz = [];
      let newCzForm = [];
      let newOper = [];
      getSxjpcList(params).then(res => {
        newArr = res.data.map(item => {
          return {
            label: item.daima,
            value: item.id
          };
        });
        if (newArr.length > 1) {
          newArr.unshift({ label: "全部", value: "" });
        }
        this.piciArr = newArr;
        newCz = res.data.map(item => {
          return {
            label: item.targetCzName,
            value: item.targetCzid
          };
        });
        newCzForm = res.data.map(item => {
          return {
            label: item.targetCzName,
            value: item.targetCzid
          };
        });
        if (newCz.length > 1) {
          newCz.unshift({ label: "全部", value: "" });
        }
        this.czArrForm = newCzForm;
        // 定义多一个，表单的藏址不会有全部选项
        this.tarczArr = newCz;

        newOper = res.data.map(item => {
          return {
            label: item.targetUserName,
            value: item.targetUserid
          };
        });
        this.operatorArr = newOper;
      });
    },
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setReqObj();
      this.getLiteratureList();
    },
    setReqObj() {
      this.reqObj = {
        libId: this.libid
      };
      this.reqObj[this.currentFilterKey] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadDCPCData = true;

      pcglList({
        pcName: this.pici,
        targetCzId: this.targetCz,
        pcInfoType: this.radio == "sj" ? "1" : "2",
        startTime: this.date1,
        endTime: this.date2,
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage,
        ...this.reqObj
      })
        .then(res => {
          this.loadDCPCData = false;

          res.data.dataList.forEach(item => {
            switch (item.finish) {
              case 0:
                item.finish_status = "未派发";
                break;
              case 1:
                item.finish_status = "未确认";
                break;
              case 2:
                item.finish_status = "待处理";
                break;
              case 3:
                item.finish_status = "已完成";
                break;
            }
            if (!item.targetCount) {
              item.targetCount = 0;
            }
            if (!item.finishCount) {
              item.finishCount = 0;
            }
          });
          this.DCPCList = res.data.dataList;

          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadDCPCData = false;
        });
    },

    handleSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.id);
    },
    clickRow(row) {
      this.$refs.DCPCList.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleEdit(row);
    },
    handleSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    handleDirectDetailPage(val) {
      this.$router.push({
        name: "opera_sxjqd_cz",
        query: { pcName: val.daima, piciId: val.id }
      });
    },
    handleAdd() {
      this.isAdd = true;
      this.showSideWarp = true;
      this.DCPCForm = {
        pcName: "",
        pcType: this.radio == "sj" ? "上架" : "下架",
        libid: this.libid,
        tarCz: "",
        operator: "",
        fuzhu: ""
      };
    },
    pcListAdd() {
      let params = {
        code: this.DCPCForm.pcType == "上架" ? "1" : "2",
        daima: this.DCPCForm.pcName,
        fuzhu: this.DCPCForm.fuzhu,
        czId: this.DCPCForm.tarCz,
        libId: this.DCPCForm.libid,
        userId: this.DCPCForm.operator
      };
      pcListAdd(params)
        .then(res => {
          this.$message.success(res.message);
          this.showSideWarp = false;
          this.initLiteratureList();
        })
        .catch(() => {});
    },
    pcListUpdate() {
      let params = {
        code: this.DCPCForm.pcType == "上架" ? "1" : "2",
        daima: this.DCPCForm.pcName,
        fuzhu: this.DCPCForm.fuzhu,
        targetCzid: this.DCPCForm.tarCz,
        libId: this.DCPCForm.libid,
        targetUserid: this.DCPCForm.operator,
        id: this.sxjPcId
      };
      pcListUpdate(params)
        .then(res => {
          this.$message.success(res.message);
          this.showSideWarp = false;
          this.initLiteratureList();
        })
        .catch(() => {});
    },
    takeBook() {
      this.$confirm("请确认图书已被运营人员取走?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadDCPCData = true;
        })
        .catch(() => {});
    },
    handleExport() {
      downLoadExcel(dztemExpo(), {
        pcName: this.pici,
        targetCzId: this.targetCz,
        pcInfoType: this.radio == "sj" ? "1" : "2",
        startTime: this.date1,
        endTime: this.date2,
        libId: this.libid
      });
    },
    handleEdit(row) {
      this.showSideWarp = true;
      this.isAdd = false;
      this.sxjPcId = row.id;
      this.DCPCForm = {
        pcName: row.daima,
        pcType: this.radio == "sj" ? "上架" : "下架",
        libid: row.libid,
        tarCz: row.targetCzid,
        operator: row.targetUserid,
        fuzhu: row.fuzhu
      };
    },

    handleDetail(row) {
      this.$router.push({
        name: "opera_sxjqd_cz",
        query: { pcName: row.pcName }
      });
    },
    // 单个删除
    handleDel(row) {
      this.$confirm("删除批次后将无法恢复，是否继续?", "删除批次", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          pcglDel({ sxjPcId: row.id }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: "删除成功",
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
      this.$confirm("删除批次后将无法恢复，是否继续?", "删除批次", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          pcglDel({ sxjPcId: this.multipleLiteratureSelection.join() }).then(
            res => {
              if (res.code == 0) {
                this.$message({
                  message: "删除成功",
                  type: "success"
                });
                this.initLiteratureList();
              }
            }
          );
        })
        .catch(() => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          // 通过验证

          if (this.isAdd) {
            // 新建
            this.pcListAdd();
          } else {
            // 编辑
            this.pcListUpdate();
          }
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.showSideWarp = false;
    }
  },
  mounted() {
    this.initLiteratureList();
    this.getSxjpcList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.res_dcpc {
  .content__header {
    flex-direction: column;
    align-items: flex-start !important;
    .header__line:nth-child(2) {
      margin-top: 3px;
    }
  }
  .custom__form {
    .tit {
      font-size: @FSize_16;
    }
  }
}

/deep/.el-form-item__label {
  width: 96px !important;
}
</style>
