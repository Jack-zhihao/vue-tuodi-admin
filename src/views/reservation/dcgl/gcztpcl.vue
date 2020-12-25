<template>
  <div class="res_contain common__content">
    <!-- <div class="content_padding"></div> -->
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_pc_register">
            <div class="card_title">馆藏状态批处理</div>
            <div class="register_content">
              <div class="card_radio">
                <el-radio-group v-model="simpleForm.type">
                  <el-radio :label="1">条码范围</el-radio>
                  <el-radio :label="2">来自文件</el-radio>
                </el-radio-group>
              </div>
              <div class="card_tma">
                <div class="content__btn" v-if="simpleForm.type == 2">
                  <p>请选择文件：</p>
                  <el-upload
                    class="upload-demo"
                    ref="upload"
                    :action="BASE_URL + '/api/p/file/upload'"
                    :before-upload="beforeUpload"
                    :file-list="fileList"
                    :on-success="handleAvatarSuccess"
                    :on-exceed="whenUploadMoreOne"
                    :on-error="fileUploadFail"
                    :data="fileFormData"
                    :on-change="handleChange"
                    :auto-upload="false"
                    accept=".txt"
                  >
                    <el-button slot="trigger" size="mini" type="primary"
                      >选择文件</el-button
                    >
                    <div slot="tip" class="el-upload__tip">
                      请上传txt文件，一个条码为一行
                    </div>
                  </el-upload>
                </div>
                <div v-if="simpleForm.type == 1">
                  <p>请输入条码范围:</p>
                  <span>从</span>
                  <el-input
                    v-model="simpleForm.tiaomaBatch1"
                    placeholder="请输入内容"
                    size="mini"
                    ref="tiaomaBatch1"
                    @keyup.native="
                      handleBarCodeScanner(
                        $event,
                        val => (simpleForm.tiaomaBatch1 = val)
                      )
                    "
                  ></el-input>
                  <span>至</span>
                  <el-input
                    v-model="simpleForm.tiaomaBatch2"
                    @keyup.native="
                      handleBarCodeScanner(
                        $event,
                        val => (simpleForm.tiaomaBatch2 = val)
                      )
                    "
                    placeholder="请输入内容"
                    size="mini"
                  ></el-input>
                </div>
              </div>
              <div class="content__header" style="width: 100%;">
                <div class="header__filters" style="width: 100%;">
                  <el-form
                    class="simple__form"
                    ref="simpleForm"
                    label-width="85px"
                    :model="simpleForm"
                    :rules="simpleFormRules"
                    style="width: 100%;"
                    size="mini"
                  >
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
                </div>
              </div>
              <div class="sure_btn">
                <el-button
                  size="mini"
                  type="primary"
                  @click="gcztclBatchSubmitForm('simpleForm')"
                  :icon="uploadControl ? 'el-icon-loading' : ''"
                  >确定</el-button
                >
              </div>
            </div>
            <div class="register_tip">
              <p>选择条形码范围变更的时候，要求：</p>
              <p>1、条形码范围必须位数相等;</p>
              <p>2、条形码允许的字符，必须为字母和数字;</p>
              <p>3、如果字母作为前缀的，则前缀必须一致;</p>
            </div>
          </div>
        </div>
        <el-dialog
          custom-class="duplicate__dialog"
          title="馆藏状态批处理结果"
          :visible.sync="showUploadFormDialog"
        >
          <p class="tips">
            登记成功{{ formTime.success }}条，失败{{ formTime.fail }}条
          </p>
          <div style="height:calc(100% - 26px);">
            <el-table
              :data="uploadFormData"
              border
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                show-overflow-tooltip
                prop="code"
                label="图书条形码"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="message"
                label="状态"
              >
              </el-table-column>
            </el-table>
          </div>
          <span slot="footer" class="dialog-footer">
            <div></div>
            <div>
              <el-button size="mini" @click="closeUploadDialog">关闭</el-button>
            </div>
          </span>
        </el-dialog>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { BASE_URL } from "utils/base";
import { getPcList } from "api/public";
import { mapGetters } from "vuex";
import { saveGcztclBatch } from "api/reservation";
import { getToken } from "utils/auth";
export default {
  name: "res_gcztpcl",
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
      libid: this.$store.getters.userInfo.libId,
      content: "",
      input: "",
      simpleForm: {
        czStatus: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: ""
      },
      baseForm: {
        czStatus: "",
        ltlxid: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: ""
      },
      simpleFormRules: {
        czStatus: [
          { required: true, message: "馆藏状态不能为空", trigger: "change" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      mcheng: "",
      czid: "",
      fileList: [],
      excelName: "",
      pcidOptions: [],
      fileFormData: {
        userToken: getToken(),
        fileType: "gcztpcl_txt"
      },
      BASE_URL: BASE_URL,
      uploadControl: false,
      showUploadFormDialog: false,
      uploadFormData: [],
      formTime: {
        success: "",
        fail: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
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
    // 发送请求
    saveGcztclBatch() {
      saveGcztclBatch(this.simpleForm).then(res => {
        this.$refs["simpleForm"].resetFields();
        if (res.data.data.length) {
          this.showUploadFormDialog = true;
          this.uploadFormData = res.data.data;
          this.formTime.success = res.data.success;
          this.formTime.fail = res.data.fail;
        } else {
          this.$message.success(res.message);
        }
      });
    },
    // 确定按钮
    gcztclBatchSubmitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.simpleForm.type == 2) {
            if (this.fileList.length > 0) {
              this.$refs.upload.submit();
            } else {
              this.$message.error("请上传文件");
              return false;
            }
          } else {
            this.saveGcztclBatch();
          }
        } else {
          return false;
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    //文件上传之前验证
    beforeUpload(file) {
      window.console.log(file);
      //.txt文件类型
      if (file.type == "text/plain") {
        // this.uploadFileName = file.name;
        return true;
      } else {
        this.$message.error("上传的文件格式必须为.txt格式(即是txt文件)");
        this.fileList = [];
        return false;
      }
    },
    // 上传时
    whenUploadMoreOne() {
      this.uploadControl = true;
    },
    handleAvatarSuccess(res) {
      if (res.code == "0") {
        window.console.log(res);
        // this.$message({ message: "上传成功", type: "success" });
        this.simpleForm.filePath = res.data.FileUrl;
        this.saveGcztclBatch();
        this.uploadControl = false;
        this.$refs.upload.clearFiles();
      }
    },
    //文件上传失败
    fileUploadFail(res) {
      this.uploadControl = false;
      this.$message.error(res.message);
    },
    closeUploadDialog() {
      this.showUploadFormDialog = false;
      this.uploadFormData = [];
    }
  },
  mounted() {
    this.getPcList();
    this.$refs.tiaomaBatch1.focus();
  },
  activated() {
    this.getPcList();
    this.$refs.tiaomaBatch1.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
