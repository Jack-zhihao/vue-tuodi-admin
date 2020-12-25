<template>
  <div class="res_contain common__content">
    <div class="content">
      <div class="content_card">
        <div class="res_pc_register">
          <div class="card_title">藏书清点</div>
          <div class="register_content">
            <div class="card_radio">
              <el-radio-group v-model="radio">
                <el-radio :label="1">条码范围</el-radio>
                <el-radio :label="2">来自文件</el-radio>
              </el-radio-group>
            </div>
            <div class="card_tma">
              <div class="content__btn" v-if="radio == 2">
                <p>请选择文件：</p>
                <el-upload
                  class="upload-demo"
                  ref="upload"
                  :auto-upload="false"
                  :action="BASE_URL + '/api/p/file/upload'"
                  :before-upload="beforeUpload"
                  :file-list="fileList"
                  :on-success="handleAvatarSuccess"
                  :on-exceed="whenUploadMoreOne"
                  :on-error="fileUploadFail"
                  :data="fileFormData"
                  :on-change="handleChange"
                  accept=".txt"
                  name="file"
                >
                  <el-button slot="trigger" size="mini" type="primary"
                    >选择文件</el-button
                  >
                  <div slot="tip" class="el-upload__tip">
                    请上传txt文件，一个条码为一行
                  </div>
                </el-upload>
                <span>{{ uploadFileName }}</span>
              </div>
              <div v-if="radio == 1">
                <p>请输入条码范围:</p>
                <span>从</span>
                <el-input
                  v-model="tiaomaBatch1"
                  placeholder="请输入内容"
                  size="mini"
                  @keyup.native="
                    handleBarCodeScanner($event, val => (tiaomaBatch1 = val))
                  "
                ></el-input>
                <span>至</span>
                <el-input
                  v-model="tiaomaBatch2"
                  placeholder="请输入内容"
                  size="mini"
                  @keyup.native="
                    handleBarCodeScanner($event, val => (tiaomaBatch2 = val))
                  "
                ></el-input>
              </div>
            </div>
            <div class="content__header">
              <div class="header__filters">
                <p class="desc">批次：</p>
                <el-select
                  filterable
                  size="mini"
                  v-model="pcid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in pcidOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="sure_btn">
              <el-button size="mini" type="primary" @click="initCheckFunc"
                >清点</el-button
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
    </div>
    <el-dialog
      custom-class="duplicate__dialog"
      title="藏书批清点结果"
      :visible.sync="DialogVisible"
    >
      <p class="tips">
        登记成功{{ timeTemp.success }}条，失败{{ timeTemp.fail }}条
      </p>
      <div class="table_box" style="height:calc(100% - 26px);">
        <el-table :data="uploadData" border style="width: 100%" height="100%">
          <el-table-column
            show-overflow-tooltip
            prop="code"
            label="图书条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="message"
            label="状态"
          ></el-table-column>
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
</template>

<script>
import { BASE_URL } from "utils/base";
import { getToken } from "utils/auth";
import { getPcList } from "api/public";
import { csqdBatch } from "api/reservation";

export default {
  name: "res_cspqd",
  data() {
    return {
      tiaomaBatch1: "",
      tiaomaBatch2: "",
      radio: 1,
      pcid: "",
      pcidOptions: [],
      fileList: [],
      fileFormData: {
        userToken: getToken(),
        fileType: "cspqd"
      },
      FileUrl: "",
      uploadControl: false,
      uploadFileName: "",
      BASE_URL: BASE_URL,
      DialogVisible: false,
      timeTemp: {},
      uploadData: []
    };
  },
  methods: {
    initCheckFunc() {
      this.radio === 1 ? this.checkFunc() : this.submitUploadFile();
    },
    //清点操作方法
    checkFunc() {
      let param = {
        type: this.radio,
        pcid: this.pcid,
        tiaomaBatch1: this.tiaomaBatch1,
        tiaomaBatch2: this.tiaomaBatch2,
        filePath: this.FileUrl
      };
      csqdBatch(param).then(res => {
        if (res.data != {} || res.data.data.length) {
          this.DialogVisible = true;
          this.uploadData = res.data.data;
          this.timeTemp.fail = res.data.fail;
          this.timeTemp.success = res.data.success;
        } else {
          this.$message.success(res.message);
        }
      });
    },
    handleChange(file, fileList) {
      this.fileList = fileList.slice(-1);
    },
    handlePreview(file, fileList) {
      this.fileList = [];
      window.console.log(file, fileList);
    },
    //文件上传之前验证 .xlsx/.xls文件类型
    beforeUpload(file) {
      if (file.type == "text/plain") {
        this.uploadFileName = file.name;
        return true;
      } else {
        this.$message.error("上传的文件格式必须为.txt格式");
        this.fileList = [];
        return false;
      }
    },
    // 上传时
    whenUploadMoreOne() {
      this.uploadControl = !this.uploadControl;
    },
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.$refs.upload.clearFiles();
        this.fileList = [];
        this.uploadFileName = "";
        this.uploadControl = !this.uploadControl;
        this.FileUrl = res.data.FileUrl;
        this.checkFunc();
      }
    },
    //文件上传失败
    fileUploadFail(res) {
      this.uploadControl = !this.uploadControl;
      this.$message.error(res.message);
    },
    //上传到服务器
    submitUploadFile() {
      if (!this.pcid) {
        this.$message.error("请选择批次代码");
        return;
      }
      if (this.fileList.length > 0) {
        this.$refs.upload.submit();
      } else {
        this.$message.error("请上传文件");
        return false;
      }
    },
    closeUploadDialog() {
      this.DialogVisible = false;
      this.uploadData = [];
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
    }
  },
  mounted() {
    this.getPcList();
  },
  activated() {
    this.getPcList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
@import "~styles/reservation.less";
</style>
