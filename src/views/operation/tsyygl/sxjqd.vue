<template>
  <div class="pcgl common__content">
    <td-content-header>
      <span>清单列表</span>

      <el-radio-group v-model="radio" @change="selectSXJ">
        <el-radio label="sj">上架清单</el-radio>
        <el-radio label="xj">下架清单</el-radio>
      </el-radio-group>

      <template v-slot:btns>
        <div class="header__ops">
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
            v-if="radio == 'xj'"
            @click="chuli"
          >
            处理<span v-show="multipleLiteratureSelection.length"
              >({{ multipleLiteratureSelection.length }})</span
            >
          </el-button>
          <!-- <el-button
            size="mini"
            type="primary"
            :disabled="multipleLiteratureSelection.length === 0"
            @click="deleteGzsm"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
            <span v-show="multipleLiteratureSelection.length"
              >({{ multipleLiteratureSelection.length }})</span
            >
          </el-button> -->
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
            v-model="libid"
            placeholder="请选择"
            @change="changeLib"
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

          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey_cz"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions_cz"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <!-- <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey_cz"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
          ></el-input> -->
          <el-select
            filterable
            size="mini"
            v-model="literatureSearchKey_cz"
            placeholder="请选择"
          >
            <el-option
              v-for="item in czArrSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey_bookInfo"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions_bookInfo"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey_bookInfo"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
          ></el-input>
        </div>
      </div>
      <div class="content__header">
        <div class="header__line">
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
          <!-- <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey_oper"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions_oper"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select> -->
          <p class="label">操作人：</p>
          <!-- <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="literatureSearchKey_oper"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initLiteratureList"
          ></el-input> -->
          <el-select
            filterable
            size="mini"
            v-model="literatureSearchKey_oper"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>

          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="statusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-button type="primary" size="mini" @click="initLiteratureList">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadDCPCData"
          border
          ref="DCPCList"
          :data="DCPCList"
          stripe
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          height="100%"
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
          <el-table-column
            show-overflow-tooltip
            prop="batchName"
            label="批次名称"
          >
            <!-- <template slot-scope="scope">
              <span
                @click="handleDirectDetailPage(scope.row.pcName)"
                class="g-row__check primary"
                >{{ scope.row.pcName }}</span
              >
            </template> -->
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ftming"
            label="副题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjming"
            label="分辑名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czid0Name"
            label="原藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="targetCzidName"
            label="目的藏址"
            v-if="radio == 'sj'"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="finishCzidName"
            label="现藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="bookZtai"
            label="状态"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="finishUserName"
            label="操作员"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="bookOptime"
            label="操作时间"
          ></el-table-column>

          <!-- <el-table-column fixed="right" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                v-if="scope.row.status == '未派发' && radio == 'xj'"
                :ops="['del', 'chuli']"
                @handleChuli="handleChuli(scope.row)"
                @handleDel="handleDel(scope.row)"
              >
              </td-action-tool>
              <td-action-tool
                v-if="scope.row.status == '未派发' && radio == 'sj'"
                :ops="['del']"
                @handleDel="handleDel(scope.row)"
              >
              </td-action-tool>
              <td-action-tool
                v-if="
                  (scope.row.finish == '待取书' && radio === 'sj') ||
                    (scope.row.finish == '取书失败' && radio === 'sj')
                "
                :ops="['del', 'sureTake']"
                @handleDel="handleDel(scope.row)"
              >
              </td-action-tool>
            </template>
          </el-table-column> -->
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
            <div class="tit">图书处理</div>
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
              <span>图书信息</span>
            </div>
            <div class="tips">
              处理后，将修改选中图书的现藏址，馆藏状态，典藏批次
            </div>
            <div class="tit">已选择本{{ bookNumber }}</div>

            <el-form-item class="item" prop="czId" label="现藏址">
              <el-select
                filterable
                v-model="DCPCForm.czId"
                placeholder="请选择"
                ref="nowCz"
              >
                <el-option
                  v-for="item in czArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <el-form-item class="item" prop="ztai" label="馆藏状态">
              <el-select
                filterable
                v-model="DCPCForm.ztai"
                placeholder="请选择"
                ref="libStausId"
              >
                <el-option
                  v-for="item in libStausArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>

            <el-form-item></el-form-item>

            <!-- <el-form-item class="item" prop="dcpc" label="典藏批次">
              <el-select
                filterable
                v-model="DCPCForm.dcpc"
                placeholder="请选择"
                ref="dcpc"
              >
                <el-option
                  v-for="item in dcpcArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item> -->
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
  selectSxjList,
  sxjqdListExp,
  dealWith
} from "api/operation";
import { downLoadExcel } from "utils/utils";
import { userCzList, userList } from "api/public";

export default {
  name: "opera_sxjqd",
  data() {
    this.DCPCFormRules = {
      czId: [{ required: true, message: "请选择现藏址", trigger: "change" }],
      ztai: [{ required: true, message: "请选择馆藏状态", trigger: "change" }]
    };
    return {
      libid: this.$store.getters.userInfo.libId,
      radio: "sj",
      piciArr: [],
      pici: "",

      statusId: "",
      statusArr: [
        { label: "全部", value: "" },
        { label: "正常上架", value: "正常上架" },
        { label: "额外上架", value: "额外上架" },
        { label: "正常下架", value: "正常下架" },
        { label: "额外下架", value: "额外下架" },
        { label: "错架上架", value: "错架上架" }
      ],
      currentFilterKey_cz: "curCzId",
      literatureFilterOptions_cz: [
        { label: "原藏址", value: "oldCzId" },
        { label: "目的藏址", value: "targetCzId" },
        { label: "现藏址", value: "curCzId" }
      ],
      literatureSearchKey_cz: "",

      currentFilterKey_bookInfo: "tiaoma",
      literatureFilterOptions_bookInfo: [
        { label: "ISBN", value: "isbn" },
        { label: "正题名", value: "ztming" },
        { label: "条形码", value: "tiaoma" },
        { label: "副题名", value: "ftming" },
        { label: "分辑名", value: "fjming" }
      ],
      literatureSearchKey_bookInfo: "",

      // currentFilterKey_oper: "operator",
      // literatureFilterOptions_oper: [
      //   { label: "操作员", value: "operator" },
      //   { label: "操作员账号", value: "operCode" }
      // ],
      literatureSearchKey_oper: "",
      date1: "",
      date2: "",

      loadDCPCData: false,
      DCPCList: [],
      totalLiteratureCount: 0,
      currentLiteraturePage: 1,
      literaturePageSize: 15,
      multipleLiteratureSelection: [],
      showSideWarp: false,
      userIdList: [],

      DCPCForm: {
        czId: "",
        ztai: "在馆",
        ids: ""
      },
      dcpcArr: [],
      czArr: [],
      czArrSelect: [],
      libStausArr: [
        { label: "在馆", value: "在馆" }
        // { label: "编目", value: "编目" },
        // { label: "借出", value: "借出" },
        // { label: "丢失", value: "丢失" },
        // { label: "剔除", value: "剔除" },
        // { label: "交换", value: "交换" },
        // { label: "赠送", value: "赠送" },
        // { label: "装订", value: "装订" },
        // { label: "锁定", value: "锁定" },
        // { label: "预约", value: "预约" },
        // { label: "清点", value: "清点" },
        // { label: "闭架", value: "闭架" },
        // { label: "修补", value: "修补" },
        // { label: "移送", value: "移送" },
        // { label: "清查", value: "清查" }
      ],
      bookNumber: "",

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
  watch: {
    $route(to) {
      if (this.pici !== to.query.piciId) {
        this.pici = to.query.piciId;
        this.initLiteratureList();
      }
    }
  },
  methods: {
    selectSXJ() {
      if (this.radio == "sj") {
        this.literatureFilterOptions_cz = [
          { label: "原藏址", value: "oldCzId" },
          { label: "目的藏址", value: "targetCzId" },
          { label: "现藏址", value: "curCzId" }
        ];
      } else {
        this.literatureFilterOptions_cz = [
          { label: "原藏址", value: "oldCzId" },
          { label: "现藏址", value: "curCzId" }
        ];
      }
      this.getSxjpcList();
    },
    getUserList() {
      userList({
        libid: this.libid
      }).then(res => {
        this.literatureSearchKey_oper = "";
        this.userIdList = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
        this.userIdList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    changeLib() {
      this.getSxjpcList();
      this.userCzList();
      this.getUserList();
    },
    // 批次的获取
    getSxjpcList() {
      let code = this.radio == "sj" ? "1" : "2";
      let params = {
        code,
        libId: this.libid
      };
      let newArr = [];
      getSxjpcList(params).then(res => {
        if (res.data.length > 0) {
          newArr = res.data.map(item => {
            return {
              label: item.daima,
              value: item.id
            };
          });
        }
        if (newArr.length > 1) {
          newArr.unshift({ label: "全部", value: "" });
        }
        this.piciArr = newArr;
      });
      this.userCzList();
      this.initLiteratureList();
    },
    userCzList() {
      let newArr = [];
      userCzList({
        libId: this.libid
      }).then(res => {
        if (res.data.length > 0) {
          newArr = res.data.map(item => {
            return {
              value: item.czid,
              label: item.mingcheng
            };
          });
        }
        this.czArr = newArr;
        this.czArrSelect = newArr;
        this.czArrSelect.unshift({
          label: "全部",
          value: ""
        });
      });
    },

    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setReqObj();
      this.getLiteratureList();
    },
    setReqObj() {
      let code = this.radio == "sj" ? "1" : "2";
      this.reqObj = {
        libId: this.libid,
        type: code
      };
      this.reqObj[this.currentFilterKey] = this.literatureSearchKey;
      this.reqObj[this.currentFilterKey_cz] = this.literatureSearchKey_cz;
      this.reqObj[
        this.currentFilterKey_bookInfo
      ] = this.literatureSearchKey_bookInfo;
      // this.reqObj[this.currentFilterKey_oper] = this.literatureSearchKey_oper;
    },
    getLiteratureList() {
      this.loadDCPCData = true;
      selectSxjList({
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage,
        batchId: this.pici,
        bookZtai: this.statusId,
        startTime: this.date1,
        endTime: this.date2,
        userId: this.literatureSearchKey_oper,
        ...this.reqObj
      })
        .then(res => {
          this.loadDCPCData = false;
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
    rowDblclick() {
      // this.handleChuli(row);
    },
    handleSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
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
    chuli() {
      this.showSideWarp = true;
      this.bookNumber = this.multipleLiteratureSelection.length;
      this.DCPCForm = {
        ids: this.multipleLiteratureSelection.join(),
        ztai: "在馆",
        czId: ""
      };
    },
    handleChuli() {
      this.showSideWarp = true;
      this.DCPCForm = {
        nowCz: "",
        libStausId: "在馆",
        dcpc: ""
      };
    },
    handleExport() {
      downLoadExcel(sxjqdListExp(), this.reqObj);
    },
    // 单个删除
    handleDel() {
      this.$confirm(
        "批次下有关联图书，删除后将无法恢复。批次关联的图书将取消，是否继续?",
        "删除批次",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // pcinfoDel({ sxjpcIds: row.sxjpcId }).then(res => {
          //   if (res.code == 0) {
          //     this.$message({
          //       message: "删除成功",
          //       type: "success"
          //     });
          //     this.initLiteratureList();
          //   }
          // });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm(
        "批次下有关联图书，删除后将无法恢复。批次关联的图书将取消，是否继续?",
        "删除批次",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          // pcinfoDel({ sxjpcIds: row.sxjpcId }).then(res => {
          //   if (res.code == 0) {
          //     this.$message({
          //       message: "删除成功",
          //       type: "success"
          //     });
          //     this.initLiteratureList();
          //   }
          // });
        })
        .catch(() => {});
    },

    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          // 通过验证
          dealWith(this.DCPCForm)
            .then(res => {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.showSideWarp = false;
            })
            .catch(res => {
              this.showSideWarp = true;
              this.$message({
                message: res.message,
                type: "error"
              });
            });
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
    this.userCzList();
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
.tips {
  font-size: 14px;
  color: #8f8f8f;
}
</style>
