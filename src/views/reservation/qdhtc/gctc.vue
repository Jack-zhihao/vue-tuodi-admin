<template>
  <div class="res_contain common__content">
    <div class="content">
      <div class="content_card">
        <div class="res_register">
          <div class="card_title">馆藏剔除</div>
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
                  @keyup.enter.native="gctcSubmitForm('simpleForm')"
                  v-model="simpleForm.tiaoma"
                  ref="tiaomaInput"
                ></el-input>
              </el-form-item>
              <p style="width: 100%"></p>
              <el-form-item class="item" prop="pcid" label="批次">
                <el-select
                  filterable
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
            </el-form>
            <div class="sure_btn">
              <el-button
                size="mini"
                type="primary"
                @click="gctcSubmitForm('simpleForm')"
                >剔除</el-button
              >
              <el-checkbox style="margin-left:40px;" v-model="checked"
                >剔除前无需确认</el-checkbox
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
            >
              <el-table-column
                show-overflow-tooltip
                prop="tiaoma"
                label="条形码"
              >
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
              <el-table-column show-overflow-tooltip prop="cejia" label="册价">
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="taojia" label="套价">
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
  </div>
</template>

<script>
import { getPcList } from "api/public";
import { gctc } from "api/reservation";
export default {
  name: "res_gctc",
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        tiaoma: "",
        pcid: ""
      },
      loadingReaderCur: false,
      simpleFormRules: {
        tiaoma: [
          { required: true, message: "条形码不能为空", trigger: "blur" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      pcidOptions: [],
      bookData: {},
      codeData: [],
      checked: false
    };
  },
  methods: {
    getPcList() {
      getPcList({}).then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.dcpcid,
            label: item.daima
          };
        });
      });
    },
    // 剔除
    gctc() {
      gctc(this.simpleForm)
        .then(res => {
          this.$message.success(res.message);
          this.bookData = res.data.bookInfo;
          this.codeData = res.data.libInfo;
          this.simpleForm.tiaoma = "";
          this.$nextTick(() => {
            this.$refs["simpleForm"].clearValidate();
          });
          this.$refs.tiaomaInput.select();
        })
        .catch(() => {
          this.$refs.tiaomaInput.select();
        });
    },
    gctcSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.checked) {
            this.$confirm("确定要剔除么?", "提示", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning"
            })
              .then(() => {
                this.gctc();
              })
              .catch(() => {});
          } else {
            this.gctc();
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
