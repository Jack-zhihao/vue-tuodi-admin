<template>
  <div class="res_contain common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_register">
            <div class="card_title">条码更换</div>
            <div class="register_content">
              <el-form
                class="simple__form"
                ref="simpleForm"
                label-width="100px"
                :model="simpleForm"
                :rules="simpleFormRules"
                size="mini"
              >
                <el-form-item class="item" prop="tiaoma1" label="原始条形码">
                  <el-input
                    clearable
                    v-model="simpleForm.tiaoma1"
                    ref="tiaoma1Input"
                    @keyup.enter.native="$refs.tiaoma2Input.select()"
                    @keyup.native="
                      handleBarCodeScanner(
                        $event,
                        val => (simpleForm.tiaoma1 = val),
                        () => $refs.tiaoma2Input.select()
                      )
                    "
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="tiaoma2" label="更换后条形码">
                  <el-input
                    clearable
                    ref="tiaoma2Input"
                    v-model="simpleForm.tiaoma2"
                    @keyup.native="
                      handleBarCodeScanner(
                        $event,
                        val => (simpleForm.tiaoma2 = val),
                        () => gzbgSubmitForm('simpleForm')
                      )
                    "
                    @keyup.enter.native="
                      delayFunc(gzbgSubmitForm('simpleForm'))
                    "
                  ></el-input>
                </el-form-item>

                <el-form-item
                  class="item item__declare"
                  prop="pcid"
                  label="批次"
                >
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
                  @click="gzbgSubmitForm('simpleForm')"
                  >确定</el-button
                >
                <el-checkbox style="margin-left:40px;" v-model="checked"
                  >变更前无需确认</el-checkbox
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
                v-loading="loadingReaderCur"
                height="500px"
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
import { saveTmgh } from "api/reservation";
export default {
  name: "res_tmgh",
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        tiaoma1: "",
        tiaoma2: "",
        pcid: ""
      },
      bookData: {},
      codeData: [],
      loadingReaderCur: false,
      simpleFormRules: {
        tiaoma1: [
          { required: true, message: "原始条形码不能为空", trigger: "change" }
        ],
        tiaoma2: [
          { required: true, message: "更换后条形码不能为空", trigger: "change" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      checked: false,
      cygList: [],
      ltlxidOptions: [],
      userCzList: [],
      pcidOptions: []
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
    // 藏址变更
    saveCzbg() {
      saveTmgh(this.simpleForm)
        .then(res => {
          this.$message.success(res.message);
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libInfo;
          this.simpleForm.tiaoma1 = "";
          this.simpleForm.tiaoma2 = "";
          this.$nextTick(() => {
            this.$refs["simpleForm"].clearValidate();
          });
          this.$refs.tiaoma1Input.select();
        })
        .catch(err => {
          if (err.indexOf("未找到条形码") > -1) {
            this.$refs.tiaoma1Input.select();
          } else {
            this.$refs.tiaoma2Input.select();
          }
        });
    },
    gzbgSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checked) {
            this.$confirm("确定要条码变更么?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.saveCzbg();
              })
              .catch(() => {});
          } else {
            this.saveCzbg();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getPcList();
    this.$refs.tiaoma1Input.focus();
  },
  activated() {
    this.getPcList();
    this.$refs.tiaoma1Input.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
