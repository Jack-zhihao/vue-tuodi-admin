<!--
 * @Description: 超借处理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-06-25 14:05:09
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-06 15:29:43
 -->

<template>
  <div class="cir-cjcl common__content">
    <td-content-header>
      超借处理
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select filterable size="mini" class="libSelect" v-model="libId">
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-select
            filterable
            size="mini"
            v-model="currentCjclInfoFilterKey"
            placeholder="请选择"
            class="group__filter_type"
          >
            <el-option
              v-for="item in cjclInfoFilterOptions"
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
            v-model="cjclInfoSearchKey"
            placeholder="请输入搜索关键词"
            class="group__filter_value"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (cjclInfoSearchKey = val),
                initCjclInfoList
              )
            "
            @keydown.enter.native="delayFunc(initCjclInfoList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initCjclInfoList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table">
        <el-table
          ref="table"
          @row-dblclick="rowDblclick"
          v-loading="loadCjchInfoData"
          border
          :data="cjclInfoList"
          stripe
          style="width: 100%"
          height="100%"
        >
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
            prop="czName"
            label="藏址名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cejia" label="册价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcsj" label="借阅日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fajin" label="罚金">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="收款状态">
            <template slot-scope="scope">
              <span class="status" :class="'status_' + scope.row.status"></span>
              {{ scope.row.status | filterStatus }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="username" label="操作员">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="beizhu" label="备注">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool>
                <template v-slot:menus>
                  <div class="menu" @click="editCjclMoney(scope.row)">
                    罚款编辑
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCjclInfoSizeChange"
          @current-change="handleCjclInfoCurrentChange"
          :total="totalCjclInfoCount"
          :currentPage="currentCjclInfoPage"
          :pageSize="cjclInfoPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 超期修改 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              超期修改
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="cqxgForm"
          label-width="80px"
          :model="cqxgForm"
          :rules="cqxgFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>缴纳信息</span>
            </div>
            <el-form-item
              class="item"
              size="medium"
              prop="status"
              label="收款状态"
            >
              <el-select
                filterable
                size="mini"
                class="libSelect"
                v-model="cqxgForm.status"
              >
                <el-option
                  v-for="item in skztList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item"
              size="medium"
              prop="fajin"
              label="应罚金额"
            >
              <el-input
                v-only-num.float="cqxgForm.fajin"
                clearable
                v-model="cqxgForm.fajin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" size="medium" prop="beizhu" label="备注">
              <el-input
                type="textarea"
                rows="4"
                v-model="cqxgForm.beizhu"
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
              type="primary"
              @click="submitForm('cqxgForm')"
              >确定</el-button
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
import { mapGetters } from "vuex";

import { cjSearch, cjSave } from "api/circulation";

import { CJCL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_cjcl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.cjclInfoFilterOptions = CJCL_OPTIONS;
    this.skztList = [
      {
        label: "未收款",
        value: 1
      },
      {
        label: "已收款",
        value: 2
      },
      {
        label: "免罚",
        value: 3
      }
    ];
    this.cqxgFormRules = {
      fajin: [{ required: true, message: "请输入应罚金额", trigger: "blur" }]
    };
    return {
      libId: this.$store.getters.userInfo.libId,
      currentCjclInfoFilterKey: "7",
      cjclInfoSearchKey: "",
      loadCjchInfoData: false,
      totalCjclInfoCount: 0,
      currentCjclInfoPage: 1,
      cjclInfoPageSize: 10,
      cjclInfoList: [],
      // 超期修改
      showEditSide: false,
      cqxgForm: {
        status: "",
        fajin: "",
        beizhu: ""
      }
    };
  },
  filters: {
    filterStatus(val) {
      let obj = {
        1: "未收款",
        2: "已收款",
        3: "免罚",
        4: "已退款"
      };
      return obj[val];
    }
  },
  methods: {
    initCjclInfoList() {
      this.currentCjclInfoPage = 1;
      this.setRequestObj();
      this.getCjclInfoList();
    },
    setRequestObj() {
      this.requestObj = {
        libid: this.libId,
        flag: this.currentCjclInfoFilterKey,
        content: this.cjclInfoSearchKey
      };
    },
    getCjclInfoList() {
      this.loadCjchInfoData = true;
      let requestObj = {
        pageNumber: this.currentCjclInfoPage,
        pageSize: this.cjclInfoPageSize,
        ...this.requestObj
      };
      cjSearch(requestObj)
        .then(res => {
          this.loadCjchInfoData = false;
          this.cjclInfoList = res.data.dataList;
          this.totalCjclInfoCount = +res.data.totalElements;
        })
        .catch(() => {
          this.loadCjchInfoData = false;
        });
    },
    rowDblclick(row) {
      this.editCjclMoney(row);
    },
    editCjclMoney(data) {
      if (data.status === 2) {
        this.$message.warning("已收款的记录，不允许进行编辑操作！");
        return;
      }
      if (data.status === 4) {
        this.$message.warning("已退款的记录，不允许进行编辑操作！");
        return;
      }
      this.currentWzId = data.wzid;
      this.cqxgForm = {
        status: data.status,
        fajin: data.fajin,
        beizhu: data.beizhu
      };
      this.showEditSide = true;
    },
    handleCjclInfoSizeChange(val) {
      this.cjclInfoPageSize = val;
      this.getCjclInfoList();
    },
    handleCjclInfoCurrentChange(val) {
      this.currentCjclInfoPage = val;
      this.getCjclInfoList();
    },
    saveCjclMoney() {
      cjSave({
        ...this.cqxgForm,
        wzid: this.currentWzId
      }).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initCjclInfoList();
      });
    },
    // 通用
    resetForm(formName) {
      this.$refs[formName].clearValidate();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveCjclMoney();
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.status {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  &.status_1 {
    background: @dangerColor;
  }
  &.status_2 {
    background: @successColor;
  }
  &.status_3 {
    background: @grayColor;
  }
  &.status_4 {
    background: @fontTintColor;
  }
}
</style>
