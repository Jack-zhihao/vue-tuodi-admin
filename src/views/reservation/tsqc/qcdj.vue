<template>
  <div class="res_contain common__content">
    <!-- <div class="content_padding"></div> -->
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_register">
            <div class="card_title">清查登记</div>
            <div class="register_content">
              <el-form
                class="simple__form"
                ref="simpleForm"
                label-width="85px"
                :model="simpleForm"
                :rules="simpleFormRules"
                size="mini"
              >
                <el-form-item class="item" prop="barcode" label="条形码">
                  <el-input
                    clearable
                    v-model="simpleForm.barcode"
                    @keyup.enter.native="rcdjSubmitForm('simpleForm')"
                    ref="tiaomaInput"
                  ></el-input>
                </el-form-item>
                <el-form-item class="item" prop="inventoryid" label="清查类别">
                  <el-select
                    filterable
                    v-model="simpleForm.inventoryid"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in typeArr"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="item" prop="dcpcid" label="清查批次">
                  <el-select
                    filterable
                    v-model="simpleForm.dcpcid"
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
                <el-form-item class="item" prop="czid" label="入藏藏址">
                  <el-select
                    filterable
                    v-model="simpleForm.czid"
                    placeholder="请选择..."
                  >
                    <el-option
                      v-for="item in userCzList"
                      :key="item.czid"
                      :label="item.mingcheng"
                      :value="item.czid"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-form>
              <div class="sure_btn">
                <el-button
                  size="mini"
                  type="primary"
                  @click="rcdjSubmitForm('simpleForm')"
                  >清查</el-button
                >
                <el-checkbox style="margin-left:40px;" v-model="checked"
                  >登记前无需确认</el-checkbox
                >
              </div>
            </div>
          </div>
          <div class="res_bookMsg">
            <div class="card_title">图书信息</div>
            <div class="bookMsg_content">
              <div class="bookItem">
                <div>
                  <span class="item_label">题名</span>
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
                  prop="czName0"
                  label="财产藏址"
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
        </div></div
    ></el-scrollbar>
  </div>
</template>

<script>
import { userCzList, getPcList } from "api/public";
import { findTypes, invertory } from "api/reservation";
export default {
  name: "res_qcdj",
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        libid: this.$store.getters.userInfo.libId,
        barcode: "",
        czid: "",
        dcpcid: "",
        inventoryid: ""
      },
      loadingReaderCur: false,
      simpleFormRules: {
        barcode: [
          { required: true, message: "条形码不能为空", trigger: "change" }
        ],
        dcpcid: [
          { required: true, message: "清查批次不能为空", trigger: "change" }
        ],
        czid: [
          { required: true, message: "入藏藏址不能为空", trigger: "change" }
        ],
        inventoryid: [
          { required: true, message: "清查批次不能为空", trigger: "change" }
        ]
      },
      userCzList: [],
      pcidOptions: [],
      bookData: {},
      codeData: [],
      checked: false,
      typeArr: []
    };
  },
  methods: {
    getUserCzList(libid) {
      userCzList({
        libId: libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.userCzList = [...res.data];
        this.simpleForm.czid = this.userCzList[0]
          ? this.userCzList[0].czid
          : "";
      });
    },
    findTypes(libid) {
      let newArr = [];
      this.inventoryid = "";
      findTypes({
        libId: libid || this.$store.getters.userInfo.libId
      }).then(res => {
        if (res.data.dataList.length > 0) {
          newArr = res.data.dataList.map(item => {
            return {
              value: item.inventoryId,
              label: item.inventoryName
            };
          });
        }
        // if (newArr.length > 1) {
        //   newArr.unshift({ label: "全部", value: "" });
        // }
        this.typeArr = newArr;
      });
    },
    getPcList() {
      getPcList({
        type: "清查"
      }).then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.dcpcid,
            label: item.daima
          };
        });
      });
    },
    // 清查登记
    invertory() {
      invertory(this.simpleForm)
        .then(res => {
          this.$message.success(res.message);
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libInfo;
          this.simpleForm.barcode = "";
          this.$nextTick(() => {
            this.$refs["simpleForm"].clearValidate();
          });
          this.$refs.tiaomaInput.select();
        })
        .catch(() => {
          this.$refs.tiaomaInput.select();
        });
    },
    rcdjSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checked) {
            this.$confirm("确定要清查登记么?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.invertory();
              })
              .catch(() => {});
          } else {
            this.invertory();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getUserCzList();
    this.findTypes();
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
