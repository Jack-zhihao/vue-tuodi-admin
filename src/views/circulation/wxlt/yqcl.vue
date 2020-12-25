<!--
 * @Description: 延期处理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors  : wj.liang
 * @Date: 2019-03-01 16:37:10
 * @LastEditTime : 2020-02-06 15:20:53
 -->

<template>
  <div class="cir-yacl common__content">
    <td-content-header>
      图书借阅信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="totalBooksInfoCount === 0"
            @click="handleMultipleDelayShowAll"
            ><icon-svg icon-class="icon-btn-ico-" /> 批量延期处理</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="multipleSelection.length !== 1"
            @click="handleBooksDelayShow('')"
            ><icon-svg icon-class="icon-btn-ico-" /> 延期处理</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <div style="display:flex;width: 100%;">
            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="currentBooksInfoFilterKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in booksInfoFilterOptions"
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
              class="group__filters_value"
              v-model="booksInfoSearchKey"
              placeholder="请输入搜索关键词"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (booksInfoSearchKey = val),
                  initBooksInfoList
                )
              "
              @keydown.enter.native="delayFunc(initBooksInfoList)"
            ></el-input>
            <el-button type="primary" size="mini" @click="initBooksInfoList"
              ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
            >
          </div>
          <div style="margin-top: 3px;">
            <span>借阅时间：</span>
            <el-date-picker
              v-model="borrowDateStart"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="borrowDateEnd"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
            >
            </el-date-picker>
            <span>应还时间：</span>
            <el-date-picker
              v-model="shouldReturnDateRangeStart"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="开始时间"
            >
            </el-date-picker>
            <span>至</span>
            <el-date-picker
              v-model="shouldReturnDateRangeEnd"
              type="date"
              size="mini"
              value-format="yyyy-MM-dd"
              placeholder="结束时间"
            >
            </el-date-picker>
          </div>
        </div>
      </div>
      <div class="content__table" ref="booksInfoTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadBooksInfoData"
          @selection-change="handleBooksInfoSelectionChange"
          border
          :data="booksInfoList"
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
          <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcsj" label="借阅日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yhsj" label="应还日期">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.dqjyid"
                :index="scope.$index"
                :ops="['delay']"
                @handleDelay="handleBooksDelayShow"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleBooksInfoSizeChange"
          @current-change="handleBooksInfoCurrentChange"
          :total="totalBooksInfoCount"
          :currentPage="currentBooksInfoPage"
          :pageSize="booksInfoPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 延期浮层 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="showDelayLayer"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              延期处理
            </div>
          </div>
          <i class="el-icon-close" @click="showDelayLayer = false"></i>
        </div>
      </template>
      <div class="form__type">
        <div class="tit">
          <span>延长信息</span>
        </div>
        <p class="tips">
          读者延期操作，对当前<span>{{ multipleModeText }}</span
          >的查询结果执行延期操作， 该操作不能退回，请谨慎操作。
        </p>
        <p class="tips">
          如延期后,应还时间在假期设定时间之内,则真正的应还时间为假期结束时间。
        </p>
        <div class="type">
          <el-radio v-model="dealyType" :label="true">应还日期：</el-radio>
          <el-date-picker
            v-model="delayDate"
            type="date"
            size="mini"
            :picker-options="delayDateOptions"
            value-format="yyyy-MM-dd"
            placeholder="请选择日期"
          >
          </el-date-picker>
        </div>
        <div class="type">
          <el-radio v-model="dealyType" :label="false">延长天数：</el-radio>
          <el-input size="mini" v-model="delayDay"></el-input>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" type="primary" @click="handleBooksDelay"
              >确定</el-button
            >
            <el-button size="mini" @click="showDelayLayer = false"
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
  doclxYanqiList,
  doclxYanqiHandle,
  doclxYanqiHandlePiLiang
} from "api/circulation";

import { YQCL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_yqcl",
  data() {
    this.booksInfoFilterOptions = YQCL_OPTIONS;
    return {
      // 列表
      multipleModeText: "已选中",
      loadBooksInfoData: false,
      currentBooksInfoFilterKey: "isbn",
      booksInfoSearchKey: "",
      booksInfoList: [],
      totalBooksInfoCount: 0,
      currentBooksInfoPage: 1,
      booksInfoPageSize: 15,
      borrowDateStart: "",
      borrowDateEnd: "",
      shouldReturnDateRangeStart: "",
      shouldReturnDateRangeEnd: "",
      multipleSelection: [],
      // 延期
      showDelayLayer: false,
      dealyType: true,
      delayDateOptions: {
        disabledDate(time) {
          return time.getTime() < Date.now();
        }
      },
      delayDate: "",
      delayDay: ""
    };
  },
  methods: {
    initBooksInfoList() {
      this.currentBooksInfoPage = 1;
      this.setRequestObj();
      this.getBooksInfoList();
    },
    setRequestObj() {
      this.requestObj = {
        borrowTime1: this.borrowDateStart ? this.borrowDateStart : "",
        borrowTime2: this.borrowDateEnd ? this.borrowDateEnd : "",
        returnTime1: this.shouldReturnDateRangeStart
          ? this.shouldReturnDateRangeStart
          : "",
        returnTime2: this.shouldReturnDateRangeEnd
          ? this.shouldReturnDateRangeEnd
          : ""
      };
      this.requestObj[this.currentBooksInfoFilterKey] = this.booksInfoSearchKey;
    },
    getBooksInfoList() {
      this.loadBooksInfoData = true;
      let requestObj = {
        pageNumber: this.currentBooksInfoPage,
        pageSize: this.booksInfoPageSize,
        ...this.requestObj
      };
      doclxYanqiList(requestObj)
        .then(res => {
          this.loadBooksInfoData = false;
          this.booksInfoList = res.data.dataList;
          this.totalBooksInfoCount = +res.data.totalElements;
        })
        .catch(() => {
          this.loadBooksInfoData = false;
        });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.handleBooksDelayShow(row.dqjyid);
    },
    handleBooksInfoSelectionChange(val) {
      this.multipleSelection = val.map(item => item.dqjyid);
    },
    handleBooksInfoSizeChange(val) {
      this.booksInfoPageSize = val;
      this.getBooksInfoList();
    },
    handleBooksInfoCurrentChange(val) {
      this.currentBooksInfoPage = val;
      this.getBooksInfoList();
    },
    handleMultipleDelayShowAll() {
      this.multipleModeText = `全部（共${this.totalBooksInfoCount}条）`;
      this.currentDealyMode = "multiple";
      this.showDelayLayer = true;
    },
    handleMultipleDelayShow() {
      this.multipleModeText = "已选中";
      this.currentDealyMode = "section";
      this.showDelayLayer = true;
    },
    handleBooksDelayShow(id) {
      this.multipleModeText = "已选中";
      this.currentDealyMode = "single";
      this.currentUserId = id ? id : this.multipleSelection[0];
      this.showDelayLayer = true;
    },
    handleBooksDelay() {
      let requestObj = {
        clfs: this.dealyType
      };
      if (this.dealyType) {
        if (this.delayDate === "") {
          this.$message("请选择应还日期");
          return;
        }
        requestObj.yhrq = this.delayDate;
      } else {
        if (this.delayDay === "") {
          this.$message("请输入延长天数");
          return;
        }
        requestObj.ycts = this.delayDay;
      }

      // 批量全部延期处理
      if (this.currentDealyMode === "multiple") {
        requestObj = {
          ...requestObj,
          ...this.requestObj
        };
        doclxYanqiHandlePiLiang(requestObj).then(res => {
          this.showDelayLayer = false;
          this.$message.success(res.message);
          this.getBooksInfoList();
          this.dealyType = true;
          this.delayDate = "";
          this.delayDay = "";
        });
      } else {
        if (this.currentDealyMode === "single") {
          // 单个修改模式
          requestObj.dqjyid = this.currentUserId;
        } else if (this.currentDealyMode === "section") {
          // 选择多个修改
          requestObj.dqjyid = this.multipleSelection.join(",");
        }
        doclxYanqiHandle(requestObj).then(res => {
          this.showDelayLayer = false;
          this.$message.success(res.message);
          this.getBooksInfoList();
          this.dealyType = true;
          this.delayDate = "";
          this.delayDay = "";
        });
      }
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.cir-yacl {
  .content__table {
    height: calc(100% - 64px - 32px);
  }
}

.header__filters {
  flex-wrap: wrap;
}

.form__type {
  padding: 20px;
  .tit {
    font-weight: bold;
    font-size: @FSize_20;
    margin-bottom: 20px;
  }
  .tips {
    color: @fontTintColor;
    font-size: @FSize_16;
    line-height: 24px;
    span {
      font-weight: bold;
    }
  }
  .type {
    display: flex;
    align-items: center;
    margin-top: 20px;
  }
  .el-radio {
    margin-right: 0;
  }
  .el-input {
    width: 230px;
  }
}
</style>
