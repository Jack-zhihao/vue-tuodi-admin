<!--
 * @Description: 流通维护-流通维护
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-09-18 11:49:54
 * @LastEditors: chenming.feng
 * @LastEditTime: 2019-09-27 15:02:18
 -->
<template>
  <div class="p-ltwh">
    <td-content-header>
      流通维护
    </td-content-header>
    <el-scrollbar class="scroll__hide" v-loading="loadingSavedConfig">
      <div style="padding: 0 10px;">
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          class="ruleForm"
          label-position="right"
          size="mini"
        >
          <el-divider content-position="left">文献筛选</el-divider>
          <el-form-item
            label-width="170px"
            class="item"
            label="藏址"
            prop="checkedCzs"
          >
            <el-checkbox
              :indeterminate="isCzIndeterminate"
              v-model="checkAllCz"
              @change="handleCheckAllCzChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="ruleForm.checkedCzs"
              @change="handleCheckedCzsChange"
            >
              <el-checkbox v-for="czId in czList" :label="czId" :key="czId">{{
                getCzLabel(czId)
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label-width="170px"
            class="item"
            label="文献流通量（小于等于）"
            prop="cirBookNum"
          >
            <el-input
              clearable
              type="number"
              v-model="ruleForm.cirBookNum"
              @change="getBookFiltrate"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="选中文献总册数">
            <span v-loading="loadingCirBookCount">{{ cirBookCount }}</span>
          </el-form-item>
          <el-divider content-position="left">读者筛选</el-divider>
          <el-form-item
            label-width="170px"
            class="item"
            label="读者类型"
            prop="checkedDzs"
          >
            <el-checkbox
              :indeterminate="isDzIndeterminate"
              v-model="checkAllDz"
              @change="handleCheckAllDzChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="ruleForm.checkedDzs"
              @change="handleCheckedDzsChange"
            >
              <el-checkbox v-for="dzId in dzList" :label="dzId" :key="dzId">{{
                getDzLabel(dzId)
              }}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item
            label-width="170px"
            class="item"
            label="读者单位"
            prop="readerUnits"
          >
            <el-input
              clearable
              style="max-width: 300px;"
              placeholder="可通过逗号做区分，输入多个读者单位"
              @change="getReaderFiltrate"
              v-model="ruleForm.readerUnits"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="170px"
            class="item"
            label="读者借阅量（小于等于）"
            prop="readerBrwNum"
          >
            <el-input
              @change="getReaderFiltrate"
              type="number"
              clearable
              v-model="ruleForm.readerBrwNum"
            ></el-input>
          </el-form-item>
          <el-form-item
            label-width="170px"
            class="item"
            label="过滤读者"
            prop="filterReader"
          >
            <el-input
              placeholder="可通过逗号做区分，输入多个读者"
              @change="getReaderFiltrate"
              type="textarea"
              :rows="5"
              v-model="ruleForm.filterReader"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="选中读者总数">
            <span v-loading="loadingReaderBrwCount">{{ readerBrwCount }}</span>
          </el-form-item>
          <el-divider content-position="left">借还筛选</el-divider>
          <el-form-item
            label-width="170px"
            class="item"
            label="借阅基础"
            prop="brwBasic"
          >
            <div>
              <el-radio v-model="ruleForm.brwBasic" :label="1">文献</el-radio>
              <el-radio v-model="ruleForm.brwBasic" :label="2">读者</el-radio>
            </div>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="借出时间">
            <el-date-picker
              v-model="ruleForm.brwTimeStart"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
            >
            </el-date-picker>
            -
            <el-date-picker
              v-model="ruleForm.brwTimeEnd"
              :clearable="false"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="datetime"
              :picker-options="pickerOptions"
              placeholder="选择日期时间"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="单个读者借阅量">
            <el-input
              clearable
              type="number"
              v-model="ruleForm.singleReaderBrwNum"
            ></el-input>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="借阅时长/天">
            <div style="display: flex;">
              <el-input
                clearable
                type="number"
                v-model="ruleForm.brwDurationStart"
              ></el-input
              >&nbsp;-&nbsp;<el-input
                clearable
                type="number"
                v-model="ruleForm.brwDurationEnd"
              ></el-input>
            </div>
          </el-form-item>
          <el-form-item label-width="170px" class="item" label="">
            <el-button type="primary" :loading="savingData" @click="handleSave"
              >保存</el-button
            >
            <el-button
              type="primary"
              :loading="savingData"
              @click="handleExcute"
              >执行</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import {
  cirMGetConfig,
  cirMBookFiltrate,
  cirMReaderFiltrate,
  cirMSave,
  cirMCirDataCreate
} from "api/circulation";

import { userCzList, readerType } from "api/public";

import dayjs from "dayjs";

export default {
  data() {
    this.rules = {};
    this.pickerOptions = {
      disabledDate(time) {
        return time.getTime() > Date.now();
      }
    };
    return {
      loadingSavedConfig: false,
      ruleForm: {
        // 文献筛选
        checkedCzs: [],
        cirBookNum: 0,
        // 读者筛选
        checkedDzs: [],
        readerUnits: "",
        readerBrwNum: 0,
        filterReader: "",
        // 借还筛选
        brwBasic: 1,
        brwTimeStart: dayjs()
          .startOf("year")
          .format("YYYY-MM-DD HH:mm:ss"),
        brwTimeEnd: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        singleReaderBrwNum: 1,
        brwDurationStart: 3,
        brwDurationEnd: 15
      },
      // 文献筛选
      isCzIndeterminate: false,
      checkAllCz: false,
      czList: [],
      cirBookCount: 0,
      loadingCirBookCount: false,
      // 读者筛选
      isDzIndeterminate: false,
      checkAllDz: false,
      dzList: [],
      readerBrwCount: 0,
      loadingReaderBrwCount: false,
      // 操作
      savingData: false
    };
  },
  methods: {
    // 藏址
    handleCheckAllCzChange(val) {
      this.ruleForm.checkedCzs = val ? this.czList : [];
      this.BookFiltrateCzIds = this.ruleForm.checkedCzs.join();
      this.isCzIndeterminate = false;
      this.getBookFiltrate();
    },
    handleCheckedCzsChange(value) {
      this.BookFiltrateCzIds = value.join();
      let checkedCount = value.length;
      this.checkAllCz = checkedCount === this.czList.length;
      this.isCzIndeterminate =
        checkedCount > 0 && checkedCount < this.czList.length;
      this.getBookFiltrate();
    },
    getBookFiltrate() {
      this.loadingCirBookCount = true;
      cirMBookFiltrate({
        czIds: this.BookFiltrateCzIds,
        cirBookNum: this.ruleForm.cirBookNum
      })
        .then(res => {
          this.cirBookCount = res.data;
        })
        .finally(() => {
          this.loadingCirBookCount = false;
        });
    },
    getCzLabel(czId) {
      return this.czMap[czId];
    },
    getUserCzList() {
      return new Promise((resolve, reject) => {
        userCzList({
          libId: this.$store.getters.userInfo.libId
        })
          .then(res => {
            this.czMap = {};
            this.czList = res.data.map(item => {
              this.czMap[item.czid] = item.mingcheng;
              return item.czid;
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 读者筛选
    handleCheckAllDzChange(val) {
      this.ruleForm.checkedDzs = val ? this.dzList : [];
      this.DzFiltrateCzIds = this.ruleForm.checkedDzs.join();
      this.isDzIndeterminate = false;
      this.getReaderFiltrate();
    },
    handleCheckedDzsChange(value) {
      this.DzFiltrateCzIds = value.join();
      let checkedCount = value.length;
      this.checkAllDz = checkedCount === this.dzList.length;
      this.isDzIndeterminate =
        checkedCount > 0 && checkedCount < this.dzList.length;
      this.getReaderFiltrate();
    },
    getReaderFiltrate() {
      this.loadingReaderBrwCount = true;
      cirMReaderFiltrate({
        readerTypes: this.DzFiltrateCzIds,
        readerUnits: this.ruleForm.readerUnits,
        filterReader: this.ruleForm.filterReader,
        readerBrwNum: this.ruleForm.readerBrwNum
      })
        .then(res => {
          this.readerBrwCount = res.data;
        })
        .finally(() => {
          this.loadingReaderBrwCount = false;
        });
    },
    getDzLabel(dzId) {
      return this.readerTypeMap[dzId];
    },
    getReaderType() {
      return new Promise((resolve, reject) => {
        readerType({
          libId: this.$store.getters.userInfo.libId
        })
          .then(res => {
            this.readerTypeMap = {};
            this.dzList = res.data.map(item => {
              this.readerTypeMap[item.dzlxid] = item.mcheng;
              return item.dzlxid;
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 操作
    handleSave() {
      if (
        dayjs(this.ruleForm.brwTimeEnd).isBefore(
          dayjs(this.ruleForm.brwTimeStart)
        )
      ) {
        this.$message.warning("借出时间的结束日期不能早于开始日期。");
        return;
      }
      if (
        dayjs().isBefore(dayjs(this.ruleForm.brwTimeStart)) ||
        dayjs().isBefore(dayjs(this.ruleForm.brwTimeEnd))
      ) {
        this.$message.warning("借出时间的开始日期/结束日期不能超过当前时间。");
        return;
      }
      this.savingData = true;
      cirMSave({
        maintainId: this.maintainId || "",
        czIds: this.BookFiltrateCzIds,
        cirBookNum: this.ruleForm.cirBookNum,
        readerTypes: this.DzFiltrateCzIds,
        readerUnits: this.ruleForm.readerUnits,
        filterReader: this.ruleForm.filterReader,
        readerBrwNum: this.ruleForm.readerBrwNum,
        brwBasic: this.ruleForm.brwBasic,
        brwTimeStart: this.ruleForm.brwTimeStart,
        brwTimeEnd: this.ruleForm.brwTimeEnd,
        singleReaderBrwNum: this.ruleForm.singleReaderBrwNum,
        brwDurationStart: this.ruleForm.brwDurationStart,
        brwDurationEnd: this.ruleForm.brwDurationEnd
      })
        .then(res => {
          this.$message.success(res.message);
        })
        .finally(() => {
          this.savingData = false;
        });
    },
    handleExcute() {
      if (
        dayjs(this.ruleForm.brwTimeEnd).isBefore(
          dayjs(this.ruleForm.brwTimeStart)
        )
      ) {
        this.$message.warning("借出时间的结束日期不能早于开始日期。");
        return;
      }
      if (
        dayjs().isBefore(dayjs(this.ruleForm.brwTimeStart)) ||
        dayjs().isBefore(dayjs(this.ruleForm.brwTimeEnd))
      ) {
        this.$message.warning("借出时间的开始日期/结束日期不能超过当前时间。");
        return;
      }
      this.savingData = true;
      cirMCirDataCreate({
        czIds: this.BookFiltrateCzIds,
        cirBookNum: this.ruleForm.cirBookNum,
        readerTypes: this.DzFiltrateCzIds,
        readerUnits: this.ruleForm.readerUnits,
        filterReader: this.ruleForm.filterReader,
        readerBrwNum: this.ruleForm.readerBrwNum,
        brwBasic: this.ruleForm.brwBasic,
        brwTimeStart: this.ruleForm.brwTimeStart,
        brwTimeEnd: this.ruleForm.brwTimeEnd,
        singleReaderBrwNum: this.ruleForm.singleReaderBrwNum,
        brwDurationStart: this.ruleForm.brwDurationStart,
        brwDurationEnd: this.ruleForm.brwDurationEnd,
        bookNum: this.cirBookCount,
        readerNum: this.readerBrwCount
      })
        .then(res => {
          this.$message.success(res.message);
        })
        .finally(() => {
          this.savingData = false;
        });
    },
    setDefaultConfig() {
      // 设置默认藏址
      this.handleCheckAllCzChange(true);
      // 设置默认读者类型
      this.handleCheckAllDzChange(true);
    },
    cirMGetConfig() {
      cirMGetConfig()
        .then(res => {
          if (!res.data) {
            // 没有保存过数据，设置默认数据
            this.setDefaultConfig();
            return;
          }
          let data = res.data;
          this.maintainId = data.maintainId;
          this.ruleForm = {
            checkedCzs: data.czIds ? data.czIds.split(",") : [],
            cirBookNum: data.cirBookNum || 0,
            checkedDzs: data.readerTypes ? data.readerTypes.split(",") : [],
            readerUnits: data.readerUnits || "",
            readerBrwNum: data.readerBrwNum || 0,
            filterReader: data.filterReader || "",
            brwBasic: data.brwBasic || 1,
            brwTimeStart:
              data.brwTimeStart ||
              dayjs()
                .startOf("year")
                .format("YYYY-MM-DD HH:mm:ss"),
            brwTimeEnd:
              data.brwTimeEnd || dayjs().format("YYYY-MM-DD HH:mm:ss"),
            singleReaderBrwNum: data.singleReaderBrwNum || 1,
            brwDurationStart: data.brwDurationStart || 3,
            brwDurationEnd: data.brwDurationEnd || 15
          };
          this.handleCheckedCzsChange(this.ruleForm.checkedCzs);
          this.handleCheckedDzsChange(this.ruleForm.checkedDzs);
        })
        .finally(() => {
          this.loadingSavedConfig = false;
        });
    }
  },
  created() {
    this.loadingSavedConfig = true;
    let p1 = this.getUserCzList();
    let p2 = this.getReaderType();
    Promise.all([p1, p2])
      .then(() => {
        this.cirMGetConfig();
      })
      .catch(() => {
        this.loadingSavedConfig = false;
      });
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.p-ltwh {
  .scroll__hide {
    height: ~"calc(100% - 40px)";
  }
  .ruleForm {
    .item {
      margin-bottom: 8px;
      /deep/ .el-form-item__label {
        // text-align-last: justify;
        position: relative;
      }
    }
  }
  h3 {
    margin-bottom: 10px;
  }
  .el-input {
    flex: 220px 0 0;
    max-width: 220px;
  }
  p {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    span {
      white-space: nowrap;
    }
  }
}
</style>
