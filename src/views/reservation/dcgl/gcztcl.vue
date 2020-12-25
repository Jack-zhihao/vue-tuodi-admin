<template>
  <div class="res_contain common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_register">
            <div class="card_title">馆藏状态处理</div>
            <div class="register_content">
              <el-form
                class="simple__form"
                ref="simpleForm"
                label-width="85px"
                :model="simpleForm"
                :rules="simpleFormRules"
                size="mini"
              >
                <el-form-item class="item" prop="tiaoma" label="条形码">
                  <el-input
                    clearable
                    @keyup.enter.native="gcztclSubmitForm('simpleForm')"
                    v-model="simpleForm.tiaoma"
                    ref="tiaomaInput"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="czStatus" label="馆藏状态">
                  <el-select
                    filterable
                    v-model="simpleForm.czStatus"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in czStatusList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item" prop="pcid" label="批次">
                  <el-select
                    filterable
                    v-model="simpleForm.pcid"
                    placeholder="请选择..."
                    @change="getPcList"
                  >
                    <el-option
                      v-for="item in pcidOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="sure_btn">
                <el-button
                  size="mini"
                  type="primary"
                  @click="gcztclSubmitForm('simpleForm')"
                  >确定</el-button
                >
                <el-checkbox style="margin-left:40px;" v-model="checked"
                  >处理前无需确认</el-checkbox
                >
              </div>
            </div>
          </div>
          <div class="res_bookMsg">
            <div class="card_title">图书信息</div>
            <div class="bookMsg_content">
              <div class="bookItem">
                <div>
                  <span class="item_label">正题名</span>
                  <span class="item_string">{{ bookData.ztming }}</span>
                </div>
                <div>
                  <span class="item_label">尺寸</span>
                  <span class="item_string">{{ bookData.ccun }}</span>
                </div>
                <div>
                  <span class="item_label">责任者</span>
                  <span class="item_string">{{ bookData.zrsming }}</span>
                </div>
                <div>
                  <span class="item_label">页码</span>
                  <span class="item_string">{{ bookData.yma }}</span>
                </div>
                <div>
                  <span class="item_label">I S B N</span>
                  <span class="item_string">{{ bookData.isbn }}</span>
                </div>
                <div>
                  <span class="item_label">介质类型</span>
                  <span class="item_string">{{ bookData.jzleixing }}</span>
                </div>
                <div>
                  <span class="item_label">出版社</span>
                  <span class="item_string">{{ bookData.cbzhe }}</span>
                </div>
                <div>
                  <span class="item_label">装订方式</span>
                  <span class="item_string">{{ bookData.zdfangshi }}</span>
                </div>
                <div>
                  <span class="item_label">出版地</span>
                  <span class="item_string">{{ bookData.cbdi }}</span>
                </div>
                <div>
                  <span class="item_label">文献来源</span>
                  <span class="item_string">{{ bookData.wxlyuan }}</span>
                </div>
                <div>
                  <span class="item_label">出版年</span>
                  <span class="item_string">{{ bookData.cbrqi }}</span>
                </div>
                <div>
                  <span class="item_label">价格</span>
                  <span class="item_string">{{ bookData.jge }}</span>
                </div>
              </div>
            </div>
          </div>
          <div class="res_duplicateMsg">
            <div class="card_title">复本信息</div>
            <div class="duplicateMsg_content">
              <el-table
                :data="codeData"
                stripe
                style="width: 100%"
                height="500px"
                v-loading="loadingReaderCur"
              >
                <el-table-column prop="tiaoma" label="条形码" width="161">
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ztai"
                  label="状态"
                  width="45"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="sshao"
                  label="索书号"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ccLib"
                  label="财产馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="xzLib"
                  label="现在馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="czName"
                  label="现藏址"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cejia"
                  label="册价"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="taojia"
                  label="套价"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="jcmshu"
                  label="卷册说明"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { getPcList } from "api/public";
import { saveGcztcl, gcztclConfirm } from "api/reservation";
export default {
  name: "res_gcztcl",

  data() {
    this.czStatusList = [
      { label: "编目", value: 1 },
      { label: "在馆", value: 2 },
      { label: "借出", value: 3 },
      { label: "丢失", value: 4 },
      { label: "剔除", value: 5 },
      { label: "交换", value: 6 },
      { label: "赠送", value: 7 },
      { label: "装订", value: 8 },
      { label: "锁定", value: 9 },
      { label: "预约", value: 10 },
      { label: "清点", value: 11 },
      { label: "闭架", value: 12 },
      { label: "修补", value: 13 },
      { label: "移送", value: 14 }
    ];
    return {
      content: "",
      simpleForm: {
        tiaoma: "",
        czStatus: "",
        pcid: ""
      },
      bookData: {},
      readercurData: [],
      loadingReaderCur: false,
      simpleFormRules: {
        tiaoma: [
          { required: true, message: "条形码不能为空", trigger: "change" }
        ],
        czStatus: [
          { required: true, message: "馆藏状态不能为空", trigger: "change" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      pcidOptions: [],
      codeData: [],
      checked: false
    };
  },
  methods: {
    getPcList() {
      getPcList().then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.dcpcid,
            label: item.daima
          };
        });
      });
    },
    // 馆藏状态变更
    saveGcztcl() {
      saveGcztcl(this.simpleForm)
        .then(res => {
          this.$message.success(res.message);
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libInfo;
          this.simpleForm.tiaoma = "";
          this.$nextTick(() => {
            this.$refs["simpleForm"].clearValidate();
          });
          this.$refs.tiaomaInput.focus();
        })
        .catch(() => {
          this.$refs.tiaomaInput.select();
        });
    },
    gcztclSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checked) {
            gcztclConfirm({ tiaoma: this.simpleForm.tiaoma })
              .then(res => {
                this.$confirm(`${res.data},确定要处理馆藏状态么?`, "提示", {
                  confirmButtonText: "确定",
                  cancelButtonText: "取消",
                  type: "warning"
                })
                  .then(() => {
                    this.saveGcztcl();
                  })
                  .catch(() => {});
              })
              .catch(() => {
                this.$refs.tiaomaInput.select();
              });
          } else {
            this.saveGcztcl();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getPcList();
    this.$refs.tiaomaInput.focus();
  },
  activated() {
    this.getPcList();
    this.$refs.tiaomaInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
