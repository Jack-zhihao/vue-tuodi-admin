<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-22 14:38:03
 * @LastEditTime: 2020-02-25 09:56:59
 -->

<template>
  <div class="cir-dzzppdr">
    <el-scrollbar>
      <div style="padding: 20px;">
        <div class="import__area">
          <div class="tit">读者照片批导入</div>
          <div class="content import__content">
            <div class="import__upload">
              <p class="tip">使用说明：</p>
              <p class="intro">
                1、实现办理读者证用户的照片批量导入，可以一次性上传多张照片；
              </p>
              <p class="intro">
                2、只能上传".jpg", ".jpeg", ".png", ".gif", ".bmp" 格式的照片；
              </p>
              <p class="intro">3、单个文件大小不超过 1mb；</p>
              <p class="intro">4、每次上传不超过 100mb。</p>
              <div class="import__select">
                <span>匹配字段：</span>
                <el-select filterable size="mini" v-model="matchKey">
                  <el-option value="1" key="dzzh" label="读者证号"></el-option>
                  <el-option value="2" key="zjhm" label="证件号码"></el-option>
                </el-select>
              </div>
              <div>
                <!-- <el-scrollbar> -->
                <el-upload
                  ref="fileUpload"
                  action=""
                  multiple
                  :http-request="uploadFile"
                  :auto-upload="false"
                >
                  <el-button
                    :disabled="uploadingFileData"
                    slot="trigger"
                    size="mini"
                    type="primary"
                    >选择文件</el-button
                  >
                  <div slot="tip" class="el-upload__tip">
                    请上传要导入的照片，照片名字要和对应的匹配字段相符
                  </div>
                </el-upload>
                <!-- </el-scrollbar> -->
              </div>
            </div>
            <div class="btns">
              <el-button
                size="mini"
                type="primary"
                :loading="uploadingFileData"
                @click="handleUploadFile"
                >导入</el-button
              >
              <el-button
                size="mini"
                :disabled="uploadingFileData"
                @click="removeFile"
                >清空</el-button
              >
            </div>
          </div>
        </div>
        <div
          class="import__results"
          v-show="sucessList.length > 0 || failList.length > 0"
        >
          <div class="tit" style="margin-top: 20px;">导入结果</div>
          <div class="content">
            <p>
              总共导入{{ sucessList.length + failList.length }}份文件，其中{{
                sucessList.length
              }}份文件导入成功，{{ failList.length }}份文件导入失败。
            </p>
            <p>导入失败的文件详情如下：</p>
            <el-table :data="failList" style="width: 100%">
              <el-table-column
                prop="field"
                :label="matchKey == '1' ? '读者证号' : '证件号码'"
              >
              </el-table-column>
              <el-table-column prop="content" label="说明"> </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script>
import { batchReaderPic } from "api/circulation";
export default {
  name: "cir_dzzppdr",
  data() {
    this.availableFileArr = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/bmp"
    ];
    this.totalSize = 0;
    this.picArr = [];
    return {
      // 导入
      uploadingFileData: false,
      matchKey: "1",
      sucessList: [],
      failList: []
    };
  },
  methods: {
    // 导入
    handleUploadFile() {
      this.$refs["fileUpload"].submit();

      this.uploadingFileData = true;
      let formData = new FormData();
      formData.append("fieldType", this.matchKey);
      for (let i = 0; i < this.picArr.length; i++) {
        let file = this.picArr[i];
        let fileType = file.type;
        let fieSize = file.size / 1024 / 1024;
        formData.append("file", file);
        if (!this.availableFileArr.includes(fileType)) {
          this.$message.error(`${file.name}不符合上传格式`);
          this.clearPics();
          return;
        }
        if (fieSize > 1) {
          this.$message.error(`${file.name}超出单张图片大小`);
          this.clearPics();
          return;
        }
        this.totalSize += fieSize;
        if (this.totalSize > 100) {
          this.$message.error(`单次上传大小超出限制，请分次上传。`);
          this.clearPics();
          return;
        }
      }
      batchReaderPic(formData)
        .then(res => {
          this.sucessList = res.data.sucessList;
          this.failList = res.data.failList;
        })
        .finally(() => {
          this.uploadingFileData = false;
          this.clearPics();
        });
    },
    uploadFile(params) {
      this.picArr.push(params.file);
    },
    removeFile() {
      this.clearPics();
      this.clearResults();
    },
    clearPics() {
      this.uploadingFileData = false;
      this.$refs["fileUpload"].clearFiles();
      this.picArr = [];
      this.totalSize = 0;
    },
    clearResults() {
      this.sucessList = this.failList = [];
    }
  }
};
</script>

<style lang="less" scoped>
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
.tit {
  font-weight: bold;
  color: @fontTintColor;
  line-height: 1;
  margin-bottom: 10px;
}
.intro {
  line-height: 1.5;
}
.content {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  padding: 20px 17px;
}
.import__select {
  margin: 20px 0;
}
.el-button {
  padding: 8px 30px;
}
/deep/ .el-upload-list {
  padding-right: 20px;
}
.import__results {
  p {
    line-height: 2;
  }
}
</style>
