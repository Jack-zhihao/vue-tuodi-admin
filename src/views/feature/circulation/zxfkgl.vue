<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 17:59:09
 -->

<template>
  <div class="zxfkgl common__content">
    <td-content-header>
      专项罚款管理
      <template v-slot:btns>
        <div class="header__ops">
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
            @change="selectLib"
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
          <p class="label">收款状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="fineStatus"
            placeholder="请选择"
            ref="czId"
            clearable
          >
            <el-option
              v-for="item in fineStatusArr"
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
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
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
            clearable
            size="mini"
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            ref="literatureSearchKey"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (literatureSearchKey = val),
                bookInfo
              )
            "
            @keyup.enter.native="delayFunc(bookInfo)"
          ></el-input>

          <p class="label">操作人：</p>
          <el-select
            filterable
            size="mini"
            v-model="userId"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in userArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="label">借阅时间：</p>
          <el-date-picker
            v-model="startBrwTime"
            @change="selectStartBrwTime"
            type="date"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            :picker-options="startDatePickerBrw"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span class="label">- &nbsp;</span>
          <el-date-picker
            v-model="endBrwTime"
            @change="selectEndBrwTime"
            type="date"
            placeholder="选择结束时间"
            size="mini"
            clearable
            :picker-options="endDatePickerBrw"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <p class="label">还书时间：</p>
          <el-date-picker
            v-model="startGiveBackTime"
            @change="selectStartGiveBackTime"
            type="date"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            :picker-options="startDatePickerGiveBack"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span class="label">- &nbsp;</span>
          <el-date-picker
            v-model="endGiveBackTime"
            @change="selectEndGiveBackTime"
            type="date"
            placeholder="选择结束时间"
            size="mini"
            clearable
            :picker-options="endDatePickerGiveBack"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <p class="label">操作时间：</p>
          <el-date-picker
            v-model="startOperTime"
            @change="selectStartOperTime"
            type="date"
            placeholder="选择开始时间"
            size="mini"
            style="marginRight:3px"
            clearable
            :picker-options="startDatePickerReturn"
            class="el-date-editor--datetime"
          >
          </el-date-picker>
          <span class="label">- &nbsp;</span>
          <el-date-picker
            v-model="endOperTime"
            @change="selectEndOperTime"
            type="date"
            placeholder="选择结束时间"
            size="mini"
            clearable
            :picker-options="endDatePickerReturn"
            class="el-date-editor--datetime"
          >
          </el-date-picker>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          v-loading="loadLiteratureData"
          border
          :data="literatureList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            prop="readerCode"
            show-overflow-tooltip
            label="读者证号"
          >
          </el-table-column>
          <el-table-column
            prop="readerName"
            show-overflow-tooltip
            label="读者姓名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerUnit"
            label="读者单位"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN/ISSN"
            width="145"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="brwTime"
            label="借阅时间"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="giveBackTime"
            label="还书时间"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fineType"
            label="处罚类型"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="fineAmount" label="金额">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="fakuanStatus"
            label="收款状态"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="userName" label="操作人">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="operTime"
            label="操作时间"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                v-if="scope.row.fineStatus == 2"
                :ops="['tkuan']"
                @handleTkuan="tuikuan(scope.row)"
              >
              </td-action-tool>
              <td-action-tool
                v-if="scope.row.fineStatus == 1"
                :ops="['skuan']"
                @handleSkuan="shoukuan(scope.row)"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" style="justifyContent:flex-end">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  fineList,
  fineListExp,
  fineReceipt,
  fineRefund,
  userList
} from "api/feature";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
export default {
  data() {
    this.literatureFilterOptions = [
      {
        value: "isbn",
        label: "ISBN/ISSN"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "zrsming",
        label: "责任者"
      },
      {
        value: "cbzhe",
        label: "出版社"
      },
      {
        value: "readerCode",
        label: "读者证号"
      },
      {
        value: "readerName",
        label: "读者姓名"
      },
      {
        value: "readerType",
        label: "读者类型"
      },
      {
        value: "readerUnit",
        label: "读者单位"
      }
    ];
    return {
      selectLibId: this.$store.getters.userInfo.libId,
      fineStatus: "",
      fineStatusArr: [
        { label: "全部", value: "" },
        { label: "未收款", value: "1" },
        { label: "已收款", value: "2" },
        { label: "已退款", value: "3" },
        { label: "免罚", value: "4" }
      ],
      currentLiteratureFilterKey: "isbn",
      literatureSearchKey: "",
      userId: "",
      userArr: [],
      reqObj: {},
      loadLiteratureData: false,
      literatureList: [],
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      startBrwTime: "",
      endBrwTime: "",
      startGiveBackTime: "",
      endGiveBackTime: "",
      startOperTime: "",
      endOperTime: "",
      startDatePickerBrw: {
        disabledDate: time => {
          if (this.endBrwTime) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.endBrwTime)
            );
          }
        }
      },
      endDatePickerBrw: {
        disabledDate: time => {
          return time.getTime() < new Date(this.startBrwTime) - 8.64e7;
        }
      },
      startDatePickerGiveBack: {
        disabledDate: time => {
          if (this.endGiveBackTime) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.endGiveBackTime)
            );
          }
        }
      },
      endDatePickerGiveBack: {
        disabledDate: time => {
          return time.getTime() < new Date(this.startGiveBackTime) - 8.64e7;
        }
      },
      startDatePickerReturn: {
        disabledDate: time => {
          if (this.endOperTime) {
            return (
              // 如果结束时间已经选择

              time.getTime() > new Date(this.endOperTime)
            );
          }
        }
      },
      endDatePickerReturn: {
        disabledDate: time => {
          return time.getTime() < new Date(this.startOperTime) - 8.64e7;
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
      this.setReqObj();
      this.getLiteratureList();
    },
    selectLib() {
      this.userList();
    },
    userList() {
      userList({
        libId: this.selectLibId
      }).then(res => {
        this.userArr = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
        if (this.userArr.length > 1) {
          this.userArr.unshift({ label: "全部", value: "" });
        }
      });
    },
    setReqObj() {
      this.reqObj = {
        libId: this.selectLibId
      };
      this.reqObj[this.currentLiteratureFilterKey] = this.literatureSearchKey;
    },
    selectStartBrwTime(val) {
      let date1 = new Date(val);
      let year = date1.getFullYear();
      let month =
        date1.getMonth() + 1 < 10
          ? "0" + (date1.getMonth() + 1)
          : date1.getMonth() + 1;
      let d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      this.startBrwTime = year + "-" + month + "-" + d;
    },
    selectEndBrwTime(val) {
      let date2 = new Date(val);
      let year = date2.getFullYear();
      let month =
        date2.getMonth() + 1 < 10
          ? "0" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let d = date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
      this.endBrwTime = year + "-" + month + "-" + d;
    },
    selectStartOperTime(val) {
      let date1 = new Date(val);
      let year = date1.getFullYear();
      let month =
        date1.getMonth() + 1 < 10
          ? "0" + (date1.getMonth() + 1)
          : date1.getMonth() + 1;
      let d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      this.startOperTime = year + "-" + month + "-" + d;
    },
    selectEndOperTime(val) {
      let date2 = new Date(val);
      let year = date2.getFullYear();
      let month =
        date2.getMonth() + 1 < 10
          ? "0" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let d = date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
      this.endOperTime = year + "-" + month + "-" + d;
    },
    selectStartGiveBackTime(val) {
      let date1 = new Date(val);
      let year = date1.getFullYear();
      let month =
        date1.getMonth() + 1 < 10
          ? "0" + (date1.getMonth() + 1)
          : date1.getMonth() + 1;
      let d = date1.getDate() < 10 ? "0" + date1.getDate() : date1.getDate();
      this.startGiveBackTime = year + "-" + month + "-" + d;
    },
    selectEndGiveBackTime(val) {
      let date2 = new Date(val);
      let year = date2.getFullYear();
      let month =
        date2.getMonth() + 1 < 10
          ? "0" + (date2.getMonth() + 1)
          : date2.getMonth() + 1;
      let d = date2.getDate() < 10 ? "0" + date2.getDate() : date2.getDate();
      this.endGiveBackTime = year + "-" + month + "-" + d;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      fineList({
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage,
        fineStatus: this.fineStatus,
        userId: this.userId,

        startBrwTime: this.startBrwTime,
        endBrwTime: this.endBrwTime,
        startGiveBackTime: this.startGiveBackTime,
        endGiveBackTime: this.endGiveBackTime,
        startOperTime: this.startOperTime,
        endOperTime: this.endOperTime,
        ...this.reqObj
      })
        .then(res => {
          this.loadLiteratureData = false;
          res.data.dataList.forEach(item => {
            if (item.fineStatus == 1) {
              item.fakuanStatus = "未收款";
            } else if (item.fineStatus == 2) {
              item.fakuanStatus = "已收款";
            } else if (item.fineStatus == 3) {
              item.fakuanStatus = "已退款";
            } else if (item.fineStatus == 4) {
              item.fakuanStatus = "免罚";
            }
          });
          this.literatureList = res.data.dataList;

          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleExport() {
      downLoadExcel(fineListExp(), {
        fineStatus: this.fineStatus,
        userId: this.userId,
        startBrwTime: this.startBrwTime,
        endBrwTime: this.endBrwTime,
        startGiveBackTime: this.startGiveBackTime,
        endGiveBackTime: this.endGiveBackTime,
        startOperTime: this.startOperTime,
        endOperTime: this.endOperTime,
        ...this.reqObj
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
    tuikuan(row) {
      fineRefund({
        fineId: row.fineId,
        remark: row.remark
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("退款成功");
        }
      });
    },
    shoukuan(row) {
      let params = {
        fineId: row.fineId,
        isFine: row.fineStatus == 4 ? true : false,
        remark: row.remark
      };
      fineReceipt(params).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
        }
      });
    }
  },
  activated() {
    this.userList();
    this.initLiteratureList();
  },
  mounted() {
    this.userList();
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
