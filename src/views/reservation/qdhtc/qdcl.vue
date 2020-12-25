<template>
  <div class="res_qdcl common__content">
    <div class="content">
      <div class="content__card">
        <el-form
          class="simple__form"
          ref="simpleForm"
          label-width="90px"
          :model="simpleForm"
          :rules="simpleFormRules"
          size="mini"
        >
          <el-form-item class="item" prop="czid" label="财产藏址">
            <el-select
              filterable
              :disabled="deal__card_show"
              v-model="simpleForm.czid"
              placeholder="请选择..."
            >
              <el-option
                v-for="item in czidOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="item" prop="pcid" label="清点批次">
            <el-select
              filterable
              :disabled="deal__card_show"
              v-model="simpleForm.pcid"
              placeholder="请选择..."
            >
              <el-option
                v-for="item in pcidOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="autoItem" prop="isClose">
            <el-checkbox
              label="处理完毕后，关闭该批次"
              name="type"
              true-label="1"
              false-label="2"
              v-model="simpleForm.close"
            ></el-checkbox>
          </el-form-item>
          <el-form-item class="autoItem">
            <el-button
              :disabled="deal__card_show"
              :loading="deal_btn_loading"
              @click="deal('simpleForm')"
              type="primary"
              >处理</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <transition name="el-fade-in">
        <div class="deal__card" v-show="deal__card_show">
          <el-button
            class="close__btn"
            @click="closeWarp"
            style="padding: 0"
            type="text"
          >
            <i
              style="font-size: 22px;"
              class="el-icon-circle-close-outline"
            ></i>
          </el-button>
          <div class="deal__content">
            <div class="filter__bar">
              <el-select
                filterable
                class="header__filters_type"
                size="mini"
                v-model="currentFilterKey"
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
                class="group__filters_value"
                v-model="currentFilterVal"
                placeholder="请输入搜索关键词"
                @keyup.native="
                  handleBarCodeScanner($event, val => (currentFilterVal = val))
                "
              ></el-input>
              <el-button size="mini" type="primary" @click="search">
                <icon-svg icon-class="icon-btn-ico-2" />搜索
              </el-button>
              <el-button
                @click="qdclDeal"
                :disabled="selectRow.length ? false : true"
                class="deal__btn"
                size="mini"
                type="primary"
                >清点处理</el-button
              >
            </div>
            <div class="table__box" ref="table__box">
              <el-table
                height="100%"
                ref="multipleTable"
                :data="tableData"
                @row-click="rowClick"
                @selection-change="selectFunc"
                stripe
                border=""
                v-loading="loading"
                style="width: 100%"
              >
                <el-table-column
                  type="selection"
                  width="35"
                  align="center"
                ></el-table-column>
                <el-table-column
                  type="index"
                  width="35"
                  label=" "
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="tiaoma"
                  label="条形码"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="sshao"
                  label="索书号"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ztming"
                  min-width="115"
                  label="正题名"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="zrsming"
                  label="责任说明"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cbzhe"
                  label="出版社"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cbrqi"
                  label="出版时间"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ztai"
                  label="状态"
                  width="45"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="xzLib"
                  label="现在馆"
                ></el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="czName"
                  label="现在藏址"
                ></el-table-column>
              </el-table>
            </div>
            <div class="content__pages">
              <td-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :total="totalCount"
                :current-page.sync="pageNumber"
                :page-size="pageSize"
              ></td-pagination>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
import { qdclSearch, qdclList, qdclConfirm } from "api/reservation";
import { getPcList, userCzList } from "api/public";
export default {
  name: "res_qdcl",
  data() {
    this.simpleFormRules = {
      czid: [{ required: true, message: "请选择藏址", trigger: "change" }],
      pcid: [{ required: true, message: "请选择批次", trigger: "change" }]
    };
    this.filterOptions = [
      { value: "tiaoma", label: "条码" },
      { value: "sshao", label: "索书号" },
      { value: "ztming", label: "正题名" },
      { value: "ztai", label: "状态" }
    ];
    return {
      simpleForm: {
        czid: "",
        pcid: "",
        close: ""
      },
      pcidOptions: [],
      czidOptions: [],
      deal__card_show: false,
      deal_btn_loading: false,
      loading: false,
      tableData: [],
      selectRow: [],
      currentFilterKey: "tiaoma",
      currentFilterVal: "",
      pageSize: 15,
      pageNumber: 1,
      totalCount: 0,
      param: {}
    };
  },
  methods: {
    //处理
    deal(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.deal_btn_loading = true;
          qdclSearch({
            ...this.simpleForm
          }).then(res => {
            this.selectRow = [];

            this.tableData = res.data.dataList;
            this.pageSize = Number(res.data.pageSize);
            this.pageNumber = Number(res.data.pageNumber);
            this.totalCount = Number(res.data.totalElements);
            this.deal__card_show = true;
            this.deal_btn_loading = false;
          });
        }
      });
    },
    //搜索
    search() {
      this.param = {};
      this.param[this.currentFilterKey] = this.currentFilterVal.replace(
        /(^\s+)|(\s+$)/g,
        ""
      );
      this.param["pageNumber"] = 1;
      this.getQdList();
    },
    getQdList() {
      this.loading = true;
      this.param["czid"] = this.simpleForm.czid;
      this.param["pcid"] = this.simpleForm.pcid;
      this.param["pageSize"] = this.pageSize;
      this.param["pageNumber"] = this.pageNumber;
      qdclList({
        ...this.param
      })
        .then(res => {
          this.loading = false;
          this.selectRow = [];
          res.data.dataList.map((ele, index) => {
            ele.index = (this.pageNumber - 1) * this.pageSize + index + 1;
          });
          this.tableData = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loading = false;
        });
    },
    closeWarp() {
      this.getPcList();
      this.deal__card_show = false;
    },
    //清点处理
    qdclDeal() {
      let shuceids = [];
      this.selectRow.map(ele => {
        shuceids.push(ele.shuceid);
      });
      qdclConfirm({
        shuceids: shuceids.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.search();
      });
    },
    //获取批次列表
    getPcList() {
      getPcList({
        type: "清点"
      }).then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.dcpcid,
            label: item.daima
          };
        });
      });
    },
    //获取藏址列表
    getCzList() {
      userCzList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.map(ele => {
          this.czidOptions.push({
            value: ele.czid,
            label: ele.mingcheng
          });
        });
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.pageNumber = 1;
      this.getQdList();
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getQdList();
    },
    selectFunc(row) {
      this.selectRow = row;
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    }
  },
  mounted() {
    this.getPcList();
    this.getCzList();
  },
  activated() {
    this.getPcList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>

<style lang="less">
.res_qdcl {
  .content {
    padding: 10px;
    height: 100%;
    background-color: #fff;
    .content__card {
      border: 1px solid @borderColor;
      padding: 15px 10px 0;
      box-shadow: 1px 1px 6px #e2e2e2;
      .simple__form {
        max-width: 1000px;
        display: flex;
        .item {
          flex-basis: 300px;
          .el-select {
            width: 90%;
          }
          .el-form-item__label {
            text-align-last: justify;
            position: relative;
            &::after {
              content: "：";
              position: absolute;
              color: #606266;
              right: 0px;
            }
          }
        }
        .autoItem {
          .el-form-item__content {
            margin: 0 !important;
            padding-left: 10px;
          }
        }
        /deep/.el-button {
          width: 80px;
          margin-left: 10px;
        }
      }
    }
    .deal__card {
      height: calc(100% - 68px);
      margin-top: 10px;
      border: 1px solid @borderColor;
      box-shadow: 1px 1px 6px #e2e2e2;
      position: relative;
      .close__btn {
        position: absolute;
        top: 5px;
        right: 5px;
      }
      .deal__content {
        height: calc(100% - 32px);
        padding: 0 10px;
        box-sizing: border-box;
        .filter__bar {
          padding: 10px 0;
          position: relative;
          .header__filters_type {
            width: 120px;
            .el-input__inner {
              border-right: none;
            }
          }
          .el-input {
            width: 180px;
          }
          .el-button {
            width: 80px;
            margin-left: 10px;
            &.deal__btn {
              position: absolute;
              right: 0;
            }
          }
        }
        .table__box {
          height: calc(100% - 52px);
        }
      }
    }
  }
}
</style>
