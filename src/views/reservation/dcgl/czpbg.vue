<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-07 16:32:11
 -->
<template>
  <div class="res_contain common__content">
    <el-scrollbar>
      <div class="content">
        <div class="content_card">
          <div class="res_pc_register">
            <div class="card_title">藏址批变更</div>
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
                    size="mini"
                    :rules="simpleFormRules"
                  >
                    <el-form-item class="item" prop="libid" label="入藏成员馆">
                      <el-select
                        filterable
                        v-model="simpleForm.libid"
                        placeholder="请选择..."
                        @change="getInitSelect(simpleForm.libid)"
                      >
                        <el-option
                          v-for="item in cygList"
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
                    <el-form-item class="item" prop="ltlxid" label="流通类型">
                      <el-select
                        filterable
                        v-model="simpleForm.ltlxid"
                        placeholder="请选择..."
                      >
                        <el-option
                          v-for="item in ltlxidOptions"
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
                  </el-form>
                </div>
              </div>
              <div class="sure_btn">
                <el-button
                  size="mini"
                  type="primary"
                  @click="czbgBatchSubmitForm('simpleForm')"
                  :icon="uploadControl ? 'el-icon-loading' : ''"
                  >确定</el-button
                >
                <el-checkbox style="margin-left: 30px;" v-model="xiangtongCz"
                  >同藏址转换记录到批次中</el-checkbox
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

          <div class="res_pc_register">
            <div class="card_title">馆藏变更</div>
            <div class="register_content">
              <div class="card_tma">
                <div>
                  <p>藏址变更:</p>
                  <span>从</span>
                  <el-select
                    filterable
                    v-model="czid1"
                    placeholder="请选择..."
                    size="mini"
                    @focus="getUserCzListOption()"
                  >
                    <el-option
                      v-for="item in userCzListOption"
                      :key="item.czid"
                      :label="item.mingcheng"
                      :value="item.czid"
                    ></el-option>
                  </el-select>
                  <span>至</span>
                  <el-select
                    filterable
                    v-model="czid2"
                    placeholder="请选择..."
                    size="mini"
                    @focus="getUserCzListOption()"
                  >
                    <el-option
                      v-for="item in userCzListOption"
                      :key="item.czid"
                      :label="item.mingcheng"
                      :value="item.czid"
                    ></el-option>
                  </el-select>
                </div>
              </div>
              <div class="sure_btn">
                <el-button size="mini" type="primary" @click="saveCzbg"
                  >确定</el-button
                >
              </div>
            </div>
            <div class="register_tip">
              <p>
                藏址整体更换操作，可以实现把前一个藏址的图书全部迁移到后一个藏址，该操作不能回退，请谨慎操作！
              </p>
            </div>
          </div>
        </div>
        <el-dialog
          custom-class="duplicate__dialog"
          title="藏址批登记结果"
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
    <!-- 查询条码书册数量 -->
    <el-dialog
      :close-on-click-modal="false"
      custom-class="duplicate__dialog"
      title="查重结果"
      :visible.sync="showDuplicateDialog"
    >
      <div>
        <p class="tips">查重完成，共{{ duplicateData.length }}条</p>
        <el-table
          :data="duplicateData"
          ref="duplicateTable"
          @row-click="duplicateClickRow"
          border
          style="width: 100%"
          height="calc(50vh - 70px)"
          @selection-change="handleExcelSelectionChange"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="strVal2" label="正题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="key" label="条码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="intVal"
            label="目标藏址馆藏数"
          >
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button
            size="mini"
            type="primary"
            @click="saveCzbgBatchAfterConfirm"
            >确认</el-button
          >
          <el-button
            size="mini"
            :disabled="excelSelection.length === 0"
            @click="handleExcelDelRepeat"
            >剔除</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import { getToken } from "utils/auth";
import { BASE_URL } from "utils/base";
import { commLibList, userCzList, flowType, getPcList } from "api/public";
import { saveCzbgBatch, saveGzbg, tiaomaFindMarcshuce } from "api/reservation";
export default {
  name: "res_czpbg",
  data() {
    return {
      libid: this.$store.getters.userInfo.libId,
      simpleForm: {
        libid: this.$store.getters.userInfo.libId,
        czid: "",
        ltlxid: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: ""
      },
      baseForm: {
        libid: this.$store.getters.userInfo.libId,
        czid: "",
        ltlxid: "",
        pcid: "",
        tiaomaBatch1: "",
        tiaomaBatch2: "",
        type: 1,
        filePath: ""
      },
      simpleFormRules: {
        libid: [
          { required: true, message: "成员馆不能为空", trigger: "change" }
        ],
        ltlxid: [
          { required: true, message: "流通类型不能为空", trigger: "change" }
        ],
        czid: [
          { required: true, message: "入藏藏址不能为空", trigger: "change" }
        ],
        pcid: [{ required: true, message: "批次不能为空", trigger: "change" }]
      },
      BASE_URL: BASE_URL,
      uploadControl: false,
      fileList: [],
      cygList: [],
      ltlxidOptions: [],
      userCzList: [],
      pcidOptions: [],
      fileFormData: {
        userToken: getToken(),
        fileType: "czpbg_txt"
      },
      // 馆藏的藏址
      userCzListOption: [],
      czid1: "",
      czid2: "",
      xiangtongCz: true,
      showUploadFormDialog: false,
      uploadFormData: [],
      formTime: {
        success: "",
        fail: ""
      },
      // 条码书册数量
      showDuplicateDialog: false,
      excelSelection: [],
      duplicateData: []
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    getInitSelect(val) {
      this.getUserCzList(val);
      this.getLtlxOptions(val);
    },
    getCygList() {
      commLibList().then(res => {
        this.cygList = res.data.map(item => {
          return {
            label: item.libJiancheng,
            value: item.libId
          };
        });
      });
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
    getLtlxOptions(libid) {
      flowType({
        libId: libid || this.$store.getters.userInfo.libId
      }).then(res => {
        this.ltlxidOptions = res.data.map(item => {
          return {
            value: item.ltlxid,
            label: item.mingcheng
          };
        });
        this.simpleForm.ltlxid = this.ltlxidOptions[0]
          ? this.ltlxidOptions[0].value
          : "";
      });
    },
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
    // 馆藏的藏址的获取
    getUserCzListOption() {
      userCzList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.userCzListOption = [...res.data];
      });
    },
    // 检查条码书册数量
    checkMarcShuce() {
      tiaomaFindMarcshuce({
        tiaomaBatch1: this.simpleForm.tiaomaBatch1,
        tiaomaBatch2: this.simpleForm.tiaomaBatch2,
        type: this.simpleForm.type,
        filePath: this.simpleForm.filePath,
        czid: this.simpleForm.czid
      }).then(res => {
        let fail = false;
        res.data.forEach(item => {
          if (!item.strVal2) {
            fail = true;
          }
        });
        if (fail) {
          this.deleteBatchArr = [];
          this.saveCzbgBatch();
        } else {
          this.showDuplicateDialog = true;
          this.deleteBatchArr = []; // 用来存储剔除的条码，每次加载这个查重页都要重置。
          this.duplicateData = res.data;
        }
      });
    },
    duplicateClickRow(row) {
      this.$refs.duplicateTable.toggleRowSelection(row);
    },
    handleExcelSelectionChange(val) {
      this.excelSelection = val.map(item => item.strVal);
    },
    handleExcelDelRepeat() {
      this.duplicateData = this.duplicateData.filter(item => {
        if (this.excelSelection.includes(item.strVal)) {
          this.deleteBatchArr.push(item.key);
          return false;
        }
        return true;
      });
      this.excelSelection = [];
    },
    saveCzbgBatchAfterConfirm() {
      this.showDuplicateDialog = false;
      if (this.duplicateData.length === 0) {
        return;
      }
      this.saveCzbgBatch();
    },
    // 发送请求
    saveCzbgBatch() {
      saveCzbgBatch({
        ...this.simpleForm,
        xiangtongCz: this.xiangtongCz ? 1 : 2,
        deleteTiaoma: this.deleteBatchArr.join(",")
      }).then(res => {
        this.$refs["simpleForm"].resetFields();
        this.getUserCzList();
        this.getLtlxOptions();
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
    czbgBatchSubmitForm(formName) {
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
            this.checkMarcShuce();
          }
        } else {
          return false;
        }
      });
    },
    saveCzbg() {
      saveGzbg({
        czid1: this.czid1,
        czid2: this.czid2
      }).then(res => {
        this.$message.success(res.message);
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
        this.simpleForm.filePath = res.data.FileUrl;
        this.uploadControl = false;
        this.$refs.upload.clearFiles();
        this.checkMarcShuce();
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
    this.getCygList();
    this.getUserCzList();
    this.getLtlxOptions();
    this.getPcList();
    this.$refs.tiaomaBatch1Input.focus();
  },
  activated() {
    this.getPcList();
    this.$refs.tiaomaBatch1Input.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
@import "~styles/reservation.less";
</style>
