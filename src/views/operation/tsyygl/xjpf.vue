<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 20:07:41
 -->
<template>
  <div class="p-xjpf common__content">
    <div class="content">
      <div class="content_card">
        <div class="rcdj_register">
          <div class="card_title">图书派发</div>
          <div class="register_content">
            <el-form
              class="custom__form"
              ref="simpleForm"
              label-width="85px"
              :model="simpleForm"
              :rules="simpleFormRules"
              @submit.native.prevent
              size="mini"
            >
              <div class="custom__form_wrapper">
                <el-form-item class="item item__3" prop="sxjPcId" label="批次">
                  <el-select
                    filterable
                    v-model="simpleForm.sxjPcId"
                    placeholder="请选择批次"
                    ref="pc"
                  >
                    <el-option
                      v-for="item in pcArr"
                      :key="item.id"
                      :label="item.daima"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>

                <el-form-item class="item item__3" label="下架藏址">
                  <el-input
                    disabled
                    size="mini"
                    v-model="targetCzName"
                    placeholder="请选择批次"
                  ></el-input>
                </el-form-item>

                <el-form-item class="item item__3" label="运营人员">
                  <el-input
                    disabled
                    size="mini"
                    v-model="targetUserName"
                    placeholder="请选择批次"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
            <div class="sure_btn">
              <el-button
                size="mini"
                type="primary"
                @click="gzbgSubmitForm('simpleForm')"
                >确认派发</el-button
              >
            </div>
          </div>
        </div>

        <div class="rcdj_duplicateMsg content">
          <div class="card_title bookInfo content__header">
            <span>藏址书册</span>
            <div class="header__line" style="position: relative;">
              <el-select
                filterable
                class="group__filter_type"
                size="mini"
                v-model="filterKey"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in filterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-input
                size="mini"
                clearable
                class="group__filter_value"
                v-model="filterValue"
                placeholder="请输入搜索关键词"
                @keydown.enter.native="initDataList"
              ></el-input>
              <p class="label">排序：</p>
              <el-select
                filterable
                v-model="sort"
                placeholder="请选择批次"
                ref="pc"
                size="mini"
              >
                <el-option
                  v-for="item in sortArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button type="primary" size="mini" @click="initDataList">
                <icon-svg icon-class="icon-btn-ico-2" />查询
              </el-button>
              <el-button
                type="primary"
                size="mini"
                @click="tcxjNum"
                style="position:absolute;right:0px"
              >
                填充下架数量
              </el-button>
            </div>
            <div class="header__line" style="justify-content: flex-end;">
              <span>已选择{{ selectNum }}本</span>
            </div>
          </div>
          <div class="duplicateMsg_content">
            <el-table
              :data="bookDataList"
              stripe
              border
              v-loading="loadingListData"
              height="100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="35" align="center">
              </el-table-column>
              <el-table-column
                type="index"
                label="序号"
                align="center"
                width="65"
                show-overflow-tooltip
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztming"
                label="正题名"
                width="115"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ftm"
                label="副题名"
                width="115"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fjming"
                label="分辑名"
                width="115"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zrsming"
                label="责任者"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzhe"
                label="出版社"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="isbn"
                label="ISBN"
                width="145"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fuben"
                label="复本数"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jieyue"
                label="被借阅册数"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip label="下架数量">
                <template slot-scope="scope">
                  <el-input
                    size="mini"
                    clearable
                    v-model="scope.row.tiaomas.length"
                    placeholder="请输入"
                  >
                  </el-input>
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="content__page">
            <td-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :total="totalDataCount"
              :currentPage="currentPage"
              :pageSize="currentPageSize"
            ></td-pagination>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { xjpfBookSearch, getSxjpcList } from "api/operation";

export default {
  name: "opera_xjpf",
  data() {
    this.sortArr = [
      { label: "复本数升序", value: 2 },
      { label: "复本数降序", value: 1 },
      { label: "正题名正序", value: 3 },
      { label: "正题名倒序", value: 4 }
    ];
    this.filterOptions = [{ label: "正题名", value: "ztm" }];
    this.simpleFormRules = {
      sxjPcId: [{ required: true, message: "请选择批次", trigger: "change" }]
    };
    return {
      simpleForm: {
        sxjPcId: ""
      },
      pcArr: [],
      sxjPcId: "",
      targetCzName: "",
      targetUserName: "",
      operatorArr: [],
      bookData: {},
      bookDataList: [],
      sort: 2,
      multipleItemSelection: [],
      loadingListData: false,
      filterKey: "ztm",
      filterValue: "",
      selectNum: "",
      totalDataCount: 0,
      currentPage: 1,
      currentPageSize: 15
    };
  },
  created() {
    this._getSxjpcList();
  },
  methods: {
    _getSxjpcList() {
      getSxjpcList({
        code: 2,
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.pcArr = res.data;
        if (this.pcArr[0]) {
          this.simpleForm.sxjPcId = res.data[0].id;
          this.targetCzName = res.data[0].targetCzName;
          this.targetUserName = res.data[0].targetUserName;
        }
      });
    },
    gzbgSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          // 通过
        } else {
          return false;
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleItemSelection = val.map(item => item.sxjpcId);
    },
    deleteGzsm() {},
    paifa() {},
    setRequestObj() {
      this.requstObj = {
        [this.filterKey]: this.filterValue,
        orderBy: this.sort
      };
    },
    initDataList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getDataList();
    },
    getDataList() {
      xjpfBookSearch(this.requstObj).then(res => {
        this.bookDataList = res.data.dataList;
        this.totalDataCount = +res.data.totalElements;
      });
    },
    tcxjNum() {},
    handleSizeChange(val) {
      this.currentPageSize = val;
      this.initDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.initDataList();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.p-xjpf {
  width: 100%;
  .content {
    padding: 0 20px;
    height: 100%;
  }
  .content_card {
    height: 100%;
    .card_title {
      padding: 0;
      line-height: 36px;
      font-size: @FSize_14;
      font-weight: bold;
      color: @fontTintColor;
    }
    .rcdj_register {
      .register_content {
        border: 1px solid @borderColor;
        box-shadow: 1px 1px 6px #e2e2e2;
        padding: 10px;
        box-sizing: border-box;
        .sure_btn {
          text-align: right;
        }
      }
      .el-select {
        width: 100% !important;
      }
    }

    .rcdj_duplicateMsg {
      padding: 0;
      height: ~"calc(100% - 133px)";
      .duplicateMsg_content {
        height: ~"calc(100% - 95px - 32px)";
        box-shadow: 1px 1px 6px #e2e2e2;
      }
    }
  }
}
</style>
