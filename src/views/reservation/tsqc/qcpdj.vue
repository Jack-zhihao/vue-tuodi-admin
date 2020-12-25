<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: 你的名字
 * @LastEditTime: 2020-03-04 11:57:46
 -->
<template>
  <div class="res_contain common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_pc_register">
            <div class="card_title">清查批登记</div>
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
                    ref="tiaomaBatch1Input"
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
                    placeholder="请输入内容"
                    size="mini"
                    @keyup.native="
                      handleBarCodeScanner(
                        $event,
                        val => (simpleForm.tiaomaBatch2 = val)
                      )
                    "
                  ></el-input>
                </div>
              </div>
              <div class="content__header" style="width: 100%;">
                <div class="header__filters" style="width: 100%;">
                  <el-form
                    class="simple__form"
                    ref="simpleForm"
                    label-width="85px"
                    style="width: 100%;"
                    :model="simpleForm"
                    :rules="simpleFormRules"
                    size="mini"
                  >
                    <el-form-item
                      class="item"
                      prop="inventoryid"
                      label="清查类别"
                    >
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
                    <el-form-item
                      class="item item__declare"
                      prop="pcid"
                      label="批次"
                    >
                      <el-select
                        filterable
                        v-model="simpleForm.pcid"
                        @change="getPcList"
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
                    <el-form-item class="item" prop="czid" label="移入藏址">
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
                </div>
              </div>
              <div class="sure_btn">
                <el-button
                  size="mini"
                  type="primary"
                  :icon="uploadControl ? 'el-icon-loading' : ''"
                  @click="rcdjBatchSubmitForm('simpleForm')"
                  >清查</el-button
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
          title="清查登记结果"
          :visible.sync="showUploadFormDialog"
        >
          <div>
            <p class="tips">
              登记成功{{ formTime.success }}条，失败{{ formTime.fail }}条
            </p>
            <el-table :data="uploadFormData" border style="width: 100%">
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
import { getToken } from "utils/auth";
import { mapGetters } from "vuex";
import { userCzList, getPcList } from "api/public";
import { invertoryBatch, findTypes } from "api/reservation";

export default {
  name: "res_qcpdj",
  data() {
    this.simpleFormRules = {
      inventoryid: [
        { required: true, message: "清查类型不能为空", trigger: "change" }
      ],
      czid: [{ required: true, message: "移入不能为空", trigger: "change" }],
      pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
    };
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        czid: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: "",
        inventoryid: ""
      },
      typeArr: [],
      pcidOptions: [],
      baseForm: {
        czid: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: "",
        inventoryid: ""
      },
      fileList: [],
      fileFormData: {
        userToken: getToken(),
        fileType: "inventory"
      },
      BASE_URL: BASE_URL,
      uploadControl: false,
      userCzList: [],
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
    getInitSelect(val) {
      this.getUserCzList(val);
    },
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
    // 发送请求
    invertoryBatch() {
      invertoryBatch(this.simpleForm).then(res => {
        this.$refs["simpleForm"].resetFields();
        this.getUserCzList();
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
    // 入藏按钮
    rcdjBatchSubmitForm(formName) {
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
            this.invertoryBatch();
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
      if (file.type == "text/plain") {
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
        this.simpleForm.filePath = res.data.FileUrl;
        this.invertoryBatch();
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
    this.getUserCzList();
    this.getPcList();
    this.findTypes();
    this.$refs.tiaomaBatch1Input.focus();
  },
  activated() {
    this.getPcList();
    this.$refs.tiaomaBatch1Input.focus();
    this.findTypes();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
