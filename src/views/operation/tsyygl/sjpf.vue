<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 16:29:27
 -->
<template>
  <div class="p-sjpf">
    <div class="content">
      <div class="content_card">
        <div class="rcdj_register">
          <div class="card_title">图书派发</div>
          <div class="register_content">
            <el-form
              class="custom__form"
              ref="simpleForm"
              label-width="70px"
              :model="simpleForm"
              :rules="simpleFormRules"
              @submit.native.prevent
              size="mini"
            >
              <div class="custom__form_wrapper">
                <el-form-item class="item item__3" label="批次">
                  <el-select
                    filterable
                    size="mini"
                    v-model="sxjPcId"
                    placeholder="请选择批次"
                    @change="_changePcId"
                  >
                    <el-option
                      v-for="item in pcArr"
                      :key="item.id"
                      :label="item.daima"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item item__3" label="目的藏址">
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
                <el-form-item
                  class="item item__line"
                  prop="tiaoma"
                  label="条形码"
                >
                  <el-input
                    clearable
                    v-model="simpleForm.tiaoma"
                    @keyup.enter.native="submitForm('simpleForm')"
                    ref="tiaomaInput"
                  ></el-input>
                  <el-checkbox
                    v-if="false"
                    style="margin-left: 10px;"
                    v-model="checkRepeated"
                    >藏址查重</el-checkbox
                  >
                  <el-button
                    size="mini"
                    type="primary"
                    style="marginLeft: 10px;"
                    @click="submitForm('simpleForm')"
                    :loading="isLoadingData"
                    >确定</el-button
                  >
                </el-form-item>
              </div>
            </el-form>
          </div>
        </div>
        <div class="rcdj_duplicateMsg">
          <div class="card_title bookInfo">
            <span>书册信息</span>
            <div>
              <el-button
                size="mini"
                type="primary"
                :loading="loadingReaderCur"
                @click="handlePayout"
              >
                确认派发
              </el-button>
              <el-button
                size="mini"
                type="primary"
                :disabled="multipleItemSelection.length === 0"
                @click="deleteGzsm('')"
              >
                <icon-svg icon-class="icon-btn-ico-1" />删除
                <span v-show="multipleItemSelection.length"
                  >({{ multipleItemSelection.length }})</span
                >
              </el-button>
            </div>
          </div>
          <div class="duplicateMsg_content">
            <el-table
              :data="bookDataList"
              stripe
              border
              height="100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="35" align="center">
              </el-table-column>
              <el-table-column type="index" label=" " align="center" width="35">
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztming"
                label="正题名"
                min-width="115"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ftming"
                label="副题名"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fjming"
                label="分辑名"
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
                label="出版者"
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
                prop="tiaoma"
                label="条形码"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="czName"
                label="现藏址"
              >
              </el-table-column>
              <el-table-column label="操作" width="45">
                <template slot-scope="scope">
                  <td-action-tool
                    :id="scope.row.marcid + '-' + scope.row.tiaoma"
                    :ops="['del']"
                    @handleDel="deleteGzsm"
                  ></td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  sjpfBookSearch,
  sjpfBookSave,
  getSxjpcList,
  sjpfBookList,
  sjpfBookListDelete,
  sjpfBookChange
} from "api/operation";
export default {
  name: "opera_sjpf",
  data() {
    this.simpleFormRules = {
      tiaoma: [{ required: true, message: "条形码不能为空", trigger: "blur" }]
    };
    return {
      simpleForm: {
        tiaoma: ""
      },
      isLoadingData: false,
      checkRepeated: true,
      sxjPcId: "",
      pcArr: [],
      targetCzName: "",
      targetUserName: "",
      bookDataList: [],
      multipleItemSelection: [],
      loadingReaderCur: false
    };
  },
  created() {
    this._getSxjpcList();
  },
  methods: {
    _getSxjpcList() {
      getSxjpcList({
        code: 1,
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.pcArr = res.data;
        if (this.pcArr[0]) {
          this.sxjPcId = res.data[0].id;
          this.targetCzName = res.data[0].targetCzName;
          this.targetUserName = res.data[0].targetUserName;
          this._sjpfBookList();
        }
      });
    },
    _changePcId() {
      this.getName();
      this._sjpfBookList();
      this.$nextTick(() => {
        this.$refs.tiaomaInput.select();
      });
    },
    getName(val) {
      for (let i = 0; i < this.pcArr.length; i++) {
        let item = this.pcArr[i];
        if (item.id === val) {
          this.targetCzName = item.targetCzName;
          this.targetUserName = item.targetUserName;
        }
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(async valid => {
        if (valid) {
          let bookData = await this._sjpfBookSearch();
          this._sjpfBookSave(bookData);
        }
      });
    },
    _sjpfBookSearch() {
      return new Promise(resolve => {
        this.isLoadingData = true;
        sjpfBookSearch({
          tiaoma: this.simpleForm.tiaoma
        })
          .then(res => {
            resolve(res.data.libInfo);
          })
          .finally(() => {
            this.isLoadingData = false;
            this.$refs.tiaomaInput.select();
          });
      });
    },
    _sjpfBookList() {
      if (!this.sxjPcId) {
        return;
      }
      sjpfBookList({
        sxjPcId: this.sxjPcId
      }).then(res => {
        this.bookDataList = res.data.dataList;
      });
    },
    _sjpfBookSave(bookData) {
      sjpfBookSave({
        sxjPcId: this.sxjPcId,
        tiaoma: bookData.tiaoma,
        marcId: bookData.marcid
      }).then(res => {
        this.$message.success(res.message);
        this._sjpfBookList();
      });
    },
    handleSelectionChange(val) {
      this.multipleItemSelection = val.map(
        item => item.marcid + "-" + item.tiaoma
      );
    },
    deleteGzsm(ids) {
      this.$confirm("将从清单中删除书册，请从批次中取走图书。", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        sjpfBookListDelete({
          sxjPcId: this.sxjPcId,
          data: ids || this.multipleItemSelection.join()
        }).then(res => {
          this.$message.success(res.message);
          this._sjpfBookList();
        });
      });
    },
    handlePayout() {
      this.loadingReaderCur = true;
      sjpfBookChange({
        sxjPcId: this.sxjPcId
      })
        .then(res => {
          this.$message.success(res.message);
          this._sjpfBookList();
          this.$refs.tiaomaInput.select();
        })
        .finally(() => {
          this.loadingReaderCur = false;
        });
    }
  },
  mounted() {
    this.$refs.tiaomaInput.select();
  },
  activated() {
    this.$refs.tiaomaInput.select();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.p-sjpf {
  width: 100%;
  .content {
    padding: 0 20px;
    height: 100%;
  }
  .content_card {
    height: 100%;
    .card_title {
      line-height: 36px;
      width: 120px;
      font-size: @FSize_14;
      font-family: MicrosoftYaHei-Bold;
      font-weight: bold;
      color: @fontTintColor;
      &.bookInfo {
        width: 100%;
        display: flex;
        justify-content: space-between;
        padding: 5px 0;
      }
    }
    .rcdj_register {
      box-sizing: border-box;
      .register_content {
        border: 1px solid @borderColor;
        box-shadow: 1px 1px 6px #e2e2e2;
        padding: 10px;
        box-sizing: border-box;
        .custom__form {
          .el-select,
          .el-input {
            width: 180px;
          }
        }
      }
    }
    .rcdj_duplicateMsg {
      height: ~"calc(100% - 152px)";
      .duplicateMsg_content {
        height: ~"calc(100% - 52px)";
        box-shadow: 1px 1px 6px #e2e2e2;
      }
      /deep/ .el-select,
      /deep/ .el-input {
        width: 140px;
        margin-right: 10px;
      }
    }
  }
}
</style>
