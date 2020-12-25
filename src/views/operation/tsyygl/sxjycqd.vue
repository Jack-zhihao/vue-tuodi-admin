<template>
  <div class="sxjycqd common__content">
    <td-content-header>
      上下架异常清单
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
          <p class="label">藏址：</p>
          <el-select
            filterable
            size="mini"
            v-model="cangId"
            placeholder="请选择"
            ref="czId"
            clearable
          >
            <el-option
              v-for="item in cangArr"
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
            clearable
          >
            <el-option
              v-for="item in statusArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="label">确认日期：</p>
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
          <span>- &nbsp;</span>
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
            placeholder="请输入"
            ref="literatureSearchKey"
            @keyup.enter.native="initLiteratureList"
            class="group__filter_value"
          ></el-input>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
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
            prop="ztming"
            min-width="115"
            show-overflow-tooltip
            label="正题名"
          >
          </el-table-column>
          <el-table-column prop="tiaoma" show-overflow-tooltip label="条形码">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="isbn" label="ISBN">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="libname"
            label="成员馆"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="usercode"
            label="用户账号"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="用户名称"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="czname" label="藏址名称">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="date" label="确认日期">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="bookZtai"
            label="状态"
            width="45"
          >
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
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import { errorList, errorListExp, nowczList } from "api/operation";
export default {
  name: "opera_sxjycqd",
  data() {
    this.literatureFilterOptions = [
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "tiaoma",
        label: "条形码"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "userName",
        label: "用户名称"
      },
      {
        value: "userCode",
        label: "用户账号"
      }
    ];
    return {
      selectLibId: this.$store.getters.userInfo.libId,
      cangId: "",
      cangArr: [],
      statusId: "",
      statusArr: [
        { label: "全部", value: "" },
        { label: "原本在架", value: "原本在架" },
        { label: "异常下架", value: "异常下架" },
        { label: "已被借出", value: "已被借出" }
      ],
      startOperTime: "",
      endOperTime: "",
      currentLiteratureFilterKey: "tiaoma",
      literatureSearchKey: "",
      loadLiteratureData: false,
      literatureList: [],
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
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
    handleExport() {
      downLoadExcel(errorListExp(), {
        ...this.reqObj,
        func_name_us: "sxjErrorList"
      });
    },
    selectLib() {
      this.nowczList();
    },
    nowczList() {
      nowczList({
        libid: this.selectLibId
      }).then(res => {
        this.cangArr = res.data.map(item => {
          return {
            value: item.id,
            label: item.name
          };
        });
        if (this.cangArr.length > 1) {
          this.cangArr.unshift({ label: "全部", value: "" });
        }
      });
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
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setReqObj();
      this.getLiteratureList();
    },
    setReqObj() {
      this.reqObj = {
        libid: this.selectLibId,
        czName: this.cangId,
        ztai: this.statusId,
        date1: this.startOperTime,
        date2: this.endOperTime
      };
      this.reqObj[this.currentLiteratureFilterKey] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;
      errorList({
        pageSize: this.literaturePageSize,
        pageNumber: this.currentLiteraturePage,
        ...this.reqObj
      })
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data.dataList;

          this.totalLiteratureCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },

    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    }
  },
  created() {
    this.initLiteratureList();
    this.nowczList();
  },
  activated() {
    this.initLiteratureList();
    this.nowczList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
/deep/ .custom__form .item {
  align-items: center;
}
/deep/.el-form-item__label {
  width: 96px !important;
}
.edit__footer {
  justify-content: flex-end !important;
}
.txt {
  width: 500px;
}
</style>
