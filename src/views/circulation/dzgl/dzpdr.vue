<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: 你的名字
 * @Date: 2019-04-22 14:37:39
 * @LastEditTime: 2020-03-04 14:19:29
 -->

<template>
  <div class="cir-dzpdr">
    <el-scrollbar>
      <div class="container">
        <div class="import__area">
          <div class="tit">读者导入</div>
          <div class="content import__content">
            <div class="import__upload">
              <p class="tip">请选择要导入的文件</p>
              <el-upload
                ref="fileUpload"
                action=""
                accept=".xls,.xlsx"
                :http-request="uploadFile"
                :on-change="handleFileChange"
                :auto-upload="false"
                :file-list="fileList"
              >
                <el-button slot="trigger" size="mini" type="primary"
                  >选择文件</el-button
                >
                <div slot="tip" class="el-upload__tip">
                  请上传Excel文件
                </div>
              </el-upload>
            </div>
            <div class="btns">
              <el-button
                size="mini"
                type="primary"
                :loading="uploadingFileData"
                @click="handleUploadFile"
                >导入</el-button
              >
              <el-button size="mini" @click="removeFile">取消</el-button>
            </div>
          </div>
        </div>
        <div class="temp__area">
          <div class="tit">读者导入模板下载</div>
          <div class="content temp__content">
            <p class="tip">请按需选择如下字段获取模板，并点击“下载模板”。</p>
            <el-checkbox
              style="margin-top: 20px;"
              :indeterminate="isIndeterminate"
              v-model="checkAll"
              @change="handleCheckAllChange"
              >全选</el-checkbox
            >
            <el-checkbox-group
              v-model="checkedKeys"
              @change="handleCheckedCitiesChange"
            >
              <el-checkbox
                :disabled="disabledKeys.includes(key)"
                v-for="key in keys"
                :label="key"
                :key="key"
              >
                <span v-if="key !== '读者类型'">{{ key }}</span>
                <span v-if="key === '读者类型'">
                  读者类型
                </span>
              </el-checkbox>
            </el-checkbox-group>
            <el-button type="primary" size="mini" @click="downLoadData"
              >下载模板</el-button
            >
          </div>
        </div>
      </div>
    </el-scrollbar>
    <el-dialog title="异常日志" :visible.sync="showErrInfo">
      <el-table :data="errData" height="100%">
        <el-table-column property="tag" label="异常行数"></el-table-column>
        <el-table-column property="warning" label="异常信息"></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
const keysMap = {
  读者证号: "dzzhao",
  状态: "ztai",
  证件类型: "zjlx",
  证件号码: "zjhma",
  性别: "xingbie",
  地址: "dizhi",
  启用日期: "qyrqi",
  邮编: "youbian",
  籍贯: "jiguan",
  学历: "xueli",
  读者单位: "dzdw",
  姓名: "xming",
  密码: "mima",
  职称: "zcheng",
  出生日期: "csrqi",
  电话: "dianhua",
  办证日期: "bzrqi",
  截止日期: "jzrqi",
  电子邮件: "dzyjian",
  手机: "shouji",
  押金: "yajin",
  读者类型: "dzlx",
  学籍号: "xjh",
  级: "ji",
  学段: "xueduan",
  班: "ban"
};

const disabledKeys = [
  "读者证号",
  "状态",
  "性别",
  "启用日期",
  "姓名",
  "读者类型"
];

const keyOptions = [
  "读者证号",
  "状态",
  "证件类型",
  "证件号码",
  "性别",
  "地址",
  "启用日期",
  "邮编",
  "籍贯",
  "学历",
  "读者单位",
  "姓名",
  "密码",
  "职称",
  "出生日期",
  "电话",
  "办证日期",
  "截止日期",
  "电子邮件",
  "手机",
  "押金",
  "读者类型",
  "学籍号",
  "级",
  "学段",
  "班"
];

import { modelE, readerI } from "api/circulation";

import { downLoadExcel } from "utils/utils";

export default {
  name: "cir_dzpdr",
  data() {
    return {
      // 导入
      showErrInfo: false,
      errData: [],
      uploadingFileData: false,
      // 模板
      checkAll: false,
      isIndeterminate: true,
      keys: keyOptions,
      disabledKeys: disabledKeys,
      checkedKeys: ["读者证号", "状态", "性别", "启用日期", "姓名", "读者类型"],
      fileList: []
    };
  },
  methods: {
    // 导入
    handleUploadFile() {
      window.console.log(this.fileList);
      if (this.fileList.length > 0) {
        this.$refs["fileUpload"].submit();
      } else {
        this.$message.error("请选择上传的文件");
      }
    },
    handleFileChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
      this.fileList = fileList;
    },
    uploadFile(params) {
      this.uploadingFileData = true;
      let formData = new FormData();
      formData.append("excel", params.file);
      readerI(formData)
        .then(res => {
          if (res.data) {
            this.showErrInfo = true;
            this.errData = res.data;
          } else {
            this.$message.success(res.message);
          }
        })
        .finally(() => {
          this.uploadingFileData = false;
          this.removeFile();
        });
    },
    removeFile() {
      this.$refs["fileUpload"].clearFiles();
    },
    // 模板
    handleCheckAllChange(val) {
      this.checkedKeys = val ? keyOptions : disabledKeys;
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.keys.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.keys.length;
    },
    downLoadData() {
      let requestObj = {};
      for (const key in keysMap) {
        const element = keysMap[key];
        if (this.checkedKeys.includes(key)) {
          requestObj[element] = 0;
        } else {
          requestObj[element] = 1;
        }
      }
      downLoadExcel(modelE(), requestObj);
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.cir-dzpdr {
  .container {
    padding: 20px;
  }
}
.tit {
  font-weight: bold;
  color: @fontTintColor;
  line-height: 1;
  margin-bottom: 10px;
}
.content {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 20px 17px;
}
.temp__area {
  margin-top: 40px;
}
.import__content {
  .tip {
    margin-bottom: 10px;
  }
  .btns {
    margin-top: 50px;
  }
}
.temp__content {
  .tip {
    font-size: @FSize_14;
  }
}
.el-checkbox {
  width: 20%;
  font-size: @FSize_16;
  margin-bottom: 15px;
}
.el-button {
  padding: 8px 30px;
}
</style>
