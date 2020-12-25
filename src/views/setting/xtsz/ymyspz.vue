<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-07 11:08:28
 -->
<template>
  <div class="cir_dzdwjhtj common__content">
    <td-content-header>
      页面元素配置
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <el-scrollbar>
        <div class="content__card">
          <div class="contentWrap_title">elib登陆首页图片</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleElibSuccess"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                class="avatar-uploader-button"
                type="primary"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${this.fileForm.elibIndex}`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card">
          <div class="contentWrap_title">elib登陆首页Logo</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleElibLoginSuccess"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.elibIndexLogo
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card">
          <div class="contentWrap_title">elib登陆首页左侧图片</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleElibLeftSuccess"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.elibIndexLogin
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card" v-if="false">
          <div class="contentWrap_title">webopac首页Logo</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleWebopacLogoSuccess"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.opacIndexLogo
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card" v-if="false">
          <div class="contentWrap_title">webopac首页二维码</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleWebopacSuccess"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.opacIndexQrcode
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card">
          <div class="contentWrap_title">读者服务首页图片一</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleReader1Success"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.readerIndexOne
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card">
          <div class="contentWrap_title">读者服务首页图片二</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleReader2Success"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.readerIndexTwo
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
        <div class="content__card">
          <div class="contentWrap_title">读者服务首页图片三</div>
          <div class="contentWrap_upload">
            <el-upload
              class="upload-Logo"
              :action="BASE_URL + '/api/p/img/upload'"
              :show-file-list="false"
              :before-upload="beforeUpload"
              :on-success="handleReader3Success"
              :data="fileFormData"
            >
              <el-button
                size="mini"
                type="primary"
                class="avatar-uploader-button"
                >上传</el-button
              >
              <div class="avatar_container">
                <img
                  :src="
                    `${IMG_URL}/api/p/img/url?img=${
                      this.fileForm.readerIndexThree
                    }`
                  "
                  class="avatar"
                />
              </div>
            </el-upload>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
import { IMG_URL } from "utils/base";
import { BASE_URL } from "utils/base";
import { systemImgSetting, imgSetting } from "api/setting";
import { getToken } from "utils/auth";
export default {
  name: "set_ymyspz",
  data() {
    return {
      // 列表
      BASE_URL: BASE_URL,
      IMG_URL: IMG_URL,
      fileFormData: {
        userToken: getToken(),
        imgType: "system"
      },
      fileForm: {
        id: "",
        elibIndex: "",
        elibIndexLogo: "",
        elibIndexLogin: "",
        opacIndexLogo: "",
        opacIndexQrcode: "",
        readerIndexOne: "",
        readerIndexTwo: "",
        readerIndexThree: ""
      }
    };
  },
  mounted() {
    this.gerSystemImgSetting();
  },
  activated() {},
  methods: {
    gerSystemImgSetting() {
      systemImgSetting().then(res => {
        this.fileForm = { ...res.data };
      });
    },
    beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      if (!isJPG) {
        this.$message.error("上传图片只能是 JPG 格式!");
      }
      return isJPG;
    },
    handleElibSuccess(res) {
      if (res.code == 0) {
        this.fileForm.elibIndex = res.data.imgUrl;
        this.imgSetting({ elibIndex: res.data.imgUrl });
      }
    },
    handleElibLoginSuccess(res) {
      if (res.code == 0) {
        this.fileForm.elibIndexLogo = res.data.imgUrl;
        this.imgSetting({ elibIndexLogo: res.data.imgUrl });
      }
    },
    handleElibLeftSuccess(res) {
      if (res.code == 0) {
        this.fileForm.elibIndexLogin = res.data.imgUrl;
        this.imgSetting({ elibIndexLogin: res.data.imgUrl });
      }
    },
    handleWebopacLogoSuccess(res) {
      if (res.code == 0) {
        this.fileForm.opacIndexLogo = res.data.imgUrl;
        this.imgSetting({ opacIndexLogo: res.data.imgUrl });
      }
    },
    handleWebopacSuccess(res) {
      if (res.code == 0) {
        this.fileForm.opacIndexQrcode = res.data.imgUrl;
        this.imgSetting({ opacIndexQrcode: res.data.imgUrl });
      }
    },
    handleReader1Success(res) {
      if (res.code == 0) {
        this.fileForm.readerIndexOne = res.data.imgUrl;
        this.imgSetting({ readerIndexOne: res.data.imgUrl });
      }
    },
    handleReader2Success(res) {
      if (res.code == 0) {
        this.fileForm.readerIndexTwo = res.data.imgUrl;
        this.imgSetting({ readerIndexTwo: res.data.imgUrl });
      }
    },
    handleReader3Success(res) {
      if (res.code == 0) {
        this.fileForm.readerIndexThree = res.data.imgUrl;
        this.imgSetting({ readerIndexThree: res.data.imgUrl });
      }
    },
    imgSetting(file) {
      if (this.fileForm.id) {
        file.id = this.fileForm.id;
      }
      imgSetting(file).then(() => {
        this.$message.success("上传成功");
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content {
  /deep/.el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .content__card {
    padding: 10px 20px 10px 15px;
  }
  .contentWrap_title {
    font-weight: bold;
  }
  .contentWrap_upload {
    width: 500px;
    margin-top: 20px;
    .upload-Logo {
      position: relative;
      margin-left: 125px;
      .el-upload {
        cursor: pointer;
        display: inline-block;
        .avatar-uploader-button {
          padding: 8px 30px;
          position: absolute;
          margin-top: -15px;
          top: 50%;
          right: 110%;
        }
      }
      .el-upload:hover {
        border-color: #409eff;
      }
      .avatar_container {
        display: inline-block;
        background: #f2f2f2;
        border: 1px dashed #e2e2e2;
        width: 300px;
        .avatar {
          max-width: 100%;
        }
      }
    }
  }
}
</style>
