<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-11-22 20:03:40
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 18:46:43
 -->
<template>
  <div class="qdsj common__content">
    <td-content-header>
      签到数据
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleBatchSignOut('')"
            ><icon-svg icon-class="icon-btn-ico-" /> 批量签退</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteQdsj('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-dropdown @command="download" style="marginLeft:10px">
            <el-button size="mini" type="primary" class="daochustyle">
              <icon-svg icon-class="icon-daochu" />导出
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="downloadDocx">
                导出word</el-dropdown-item
              >
              <el-dropdown-item command="downloadExp"
                >导出excel</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <div class="header__line">
            <p class="label">读者信息：</p>
            <el-select
              class="group__filter_type"
              filterable
              size="mini"
              v-model="dzListId"
            >
              <el-option
                v-for="item in dzListSelect"
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
              v-model="currentSearchKey"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="initSignInList"
            ></el-input>

            <p class="label">签到时间：</p>
            <el-date-picker
              v-model="dateStart"
              align="right"
              type="datetime"
              placeholder="选择开始时间"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="marginRight:3px"
              :clearable="true"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
            <span>- &nbsp;</span>
            <el-date-picker
              v-model="dateEnd"
              align="right"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              :clearable="true"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
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
          </div>

          <div class="header__line">
            <p class="label">签退时间：</p>
            <el-date-picker
              v-model="dataSignOutStart"
              align="right"
              type="datetime"
              placeholder="选择开始时间"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              :clearable="true"
              style="marginRight:3px"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
            <span>- &nbsp;</span>
            <el-date-picker
              v-model="dataSignOutEnd"
              align="right"
              type="datetime"
              placeholder="选择结束时间"
              size="mini"
              :clearable="true"
              value-format="yyyy-MM-dd HH:mm:ss"
              class="el-date-editor--datetime"
            >
            </el-date-picker>
            <p class="label">排序方式：</p>
            <el-select
              filterable
              size="mini"
              v-model="sortordId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sortordSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="initSignInList"
              ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
            >
          </div>
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="qdsjSelectChange"
          v-loading="loadLiteratureData"
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
          <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzName" label="读者姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzlxName"
            label="读者类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzdw" label="读者单位">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sjsjian"
            label="签到时间"
            width="190"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xjsjian"
            label="签退时间"
            width="190"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="servertimeLength"
            label="服务时长"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName1"
            label="签到地点"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName2"
            label="签退地点"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="状态"
            width="80"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.dzylid"
                :index="scope.$index"
                :data="scope.row"
                :ops="['del', 'edit']"
                @handleEdit="handleEdit"
                @handleDel="deleteQdsj"
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
          :currentPage.sync="pageNumber"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 编辑签到数据 -->
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">编辑签到数据</div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form class="custom__form" label-width="90px" size="mini">
          <div class="custom__form_wrapper">
            <div class="tit">签到数据</div>
            <el-form-item class="item" label="读者证号">
              <div class="minW">{{ editForm.dzzhao }}</div>
            </el-form-item>
            <el-form-item class="item" label="读者姓名">
              <div class="minW">{{ editForm.dzName }}</div>
            </el-form-item>
            <el-form-item class="item" label="读者类型">
              <div class="minW">{{ editForm.dzlxName }}</div>
            </el-form-item>
            <el-form-item class="item" label="读者单位">
              <div class="minW">{{ editForm.dzdw }}</div>
            </el-form-item>
            <el-form-item class="item" label="状态">
              <el-select
                filterable
                v-model="editForm.ztai"
                placeholder="请选择"
                @change="statusChange()"
              >
                <el-option
                  v-for="item in statusSelect2"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="签到时间">
              <el-date-picker
                v-model="editForm.sjsjian"
                align="right"
                type="datetime"
                placeholder="请选择签到时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="marginRight:5px;flex: 0 0 188px"
                :clearable="true"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" label="签退时间">
              <el-date-picker
                v-model="editForm.xjsjian"
                align="right"
                type="datetime"
                placeholder="请选择签退时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="marginRight:5px;flex: 0 0 188px"
                :clearable="true"
                default-value
                @change="timeChange"
              >
              </el-date-picker>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button size="mini" type="primary" @click="submitForm"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>

    <!-- 批量签退 -->
    <side-wrap
      v-loading="loadLiteratureData"
      class="common__side_form"
      v-if="showQianTui"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              批量签退
            </div>
          </div>
          <i class="el-icon-close" @click="showQianTui = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form class="custom__form" label-width="140px" size="mini">
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>批量签退</span>
            </div>
            <el-form-item class="item" label="本次共选中待签退数">
              {{ filterArrTotal }}
            </el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item class="item" label="请选择签退时间">
              <el-date-picker
                v-model="batchSignForm.xjsjian"
                align="right"
                type="datetime"
                placeholder="开始时间"
                value-format="yyyy-MM-dd HH:mm:ss"
                style="marginRight:5px;flex: 0 0 188px"
                :clearable="true"
              >
              </el-date-picker>
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
              @click="submitFormBatchSignOut"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showQianTui = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  volunteerList,
  volunteerSignOut,
  volunteerSignOutCount,
  volunteerEdit,
  volunteerDel,
  volunteerExportExcel,
  docxExport
} from "api/feature";
import { downLoadExcel } from "utils/utils";
import { formatDateTime } from "utils/filterDate";

export default {
  name: "feature_qdsj",
  data() {
    return {
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      dzListSelect: [
        { label: "读者证号", value: "dzzhao" },
        { label: "读者姓名", value: "dzName" },
        { label: "读者类型", value: "dzlxName" },
        { label: "读者单位", value: "dzdw" },
        { label: "签到地点", value: "czName1" },
        { label: "签退地点", value: "czName2" }
      ],
      statusSelect: [
        { label: "全部", value: "" },
        { label: "已签到", value: "已签到" },
        { label: "已签退", value: "已签退" }
      ],
      statusSelect2: [
        { label: "已签退", value: "已签退" },
        { label: "已签到", value: "已签到" }
      ],
      sortordSelect: [
        { label: "状态", value: "1" },
        { label: "签到时间", value: "2" },
        { label: "签退时间", value: "3" },
        { label: "服务时长", value: "4" },
        { label: "签到地点", value: "5" }
      ],
      czName1: "",
      czName2: "",
      dzylid: "",
      xjsjian: "",
      dzListId: "dzzhao",
      statusId: "已签到",
      sortordId: "1",
      loadLiteratureData: false,
      filterArrTotal: "",
      literatureList: [],
      currentSearchKey: "",
      pageSize: 15,
      pageNumber: 1,
      totalCount: 0,
      // 时间传参
      dateStart: "",
      dateEnd: "",
      dataSignOutStart: "",
      dataSignOutEnd: "",
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      editForm: {
        dzylid: "",
        ztai: "",
        sjsjian: "",
        xjsjian: "",
        dzzhao: "",
        dzName: "",
        dzlxName: "",
        dzdw: ""
      },
      //   批量签退
      showQianTui: false,
      batchSignForm: {
        xjsjian: ""
      }
    };
  },
  methods: {
    // 签到数据列表
    initSignInList() {
      this.pageNumber = 1;
      this.setRequestObj();
      this.getSignInList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleEdit("", "", row);
    },
    qdsjSelectChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.dzylid);
    },
    setRequestObj() {
      this.requestObj = {
        ztai: this.statusId,
        sjsjian2: this.dateEnd,
        xjsjian1: this.dataSignOutStart,
        sjsjian1: this.dateStart,
        xjsjian2: this.dataSignOutEnd,
        orderBy: this.sortordId
      };
      this.requestObj[this.dzListId] = this.currentSearchKey;
    },
    getSignInList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        ...this.requestObj
      };

      volunteerList(requestObj)
        .then(res => {
          this.dzylid = res.data.dataList.dzylid;
          this.loadLiteratureData = false;
          this.literatureList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getSignInList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getSignInList();
    },
    timeChange() {
      this.editForm.ztai = "已签退";
    },
    statusChange() {
      if (this.editForm.ztai == "已签退") {
        this.editForm.xjsjian = formatDateTime(
          new Date(),
          "yyyy-MM-dd HH:mm:ss"
        );
      } else {
        this.editForm.xjsjian = "";
      }
    },
    // 编辑保存
    handleFormEdit() {
      volunteerEdit({
        ...this.editForm
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initSignInList();
      });
    },
    // 编辑
    handleEdit(id, index, data) {
      this.showEditSide = true;
      this.dzylid = id;
      this.$nextTick(() => {
        this.editForm = {
          ztai: data.ztai,
          xjsjian: data.xjsjian,
          sjsjian: data.sjsjian,
          dzzhao: data.dzzhao,
          dzlxName: data.dzlxName,
          dzName: data.dzName,
          dzdw: data.dzdw,
          dzylid: data.dzylid,
          czName1: data.czName1,
          czName2: data.czName2
        };
      });
    },
    // 批量签退
    handleBatchSignOut() {
      this.showQianTui = true;
      volunteerSignOutCount(this.requestObj).then(res => {
        this.filterArrTotal = res.data;
      });
      this.batchSignForm.xjsjian = formatDateTime(
        new Date(),
        "yyyy-MM-dd HH:mm:ss"
      );
    },
    // 保存提交
    submitForm() {
      this.handleFormEdit();
    },
    // 批量签退保存
    submitFormBatchSignOut() {
      this.$confirm("确定要批量签退么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          volunteerSignOut({
            ...this.requestObj,
            xjsjian: this.batchSignForm.xjsjian,
            ztai: "已签退"
          }).then(res => {
            this.$message.success(res.message);
            this.showQianTui = false;
            this.initSignInList();
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteQdsj(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          volunteerDel({
            dzylids: ids ? ids : this.multipleLiteratureSelection.join(",")
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.initSignInList();
            }
          });
        })
        .catch(() => {});
    },
    // 导出
    download(command) {
      if (command === "downloadDocx") {
        docxExport({
          ...this.requestObj
        }).then(res => {
          let data = res.data;
          downLoadExcel(data);
        });
      } else {
        downLoadExcel(volunteerExportExcel(), {
          ...this.requestObj,
          func_name_us: "special_volunteer"
        });
      }
    }
  },
  created() {
    this.initSignInList();
  },
  mounted() {
    this.initSignInList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.minW {
  width: 235px;
}
</style>
