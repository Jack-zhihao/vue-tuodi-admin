<template>
  <div class="finger">
    <el-button
      type="primary"
      size="small"
      class="iconfont"
      @click="fingerPrintClick"
      v-show="actions.includes('register')"
    >
      <icon-svg
        icon-class="icon-btn-ico-7"
        style="margin-right: 5px;"
        v-if="visibleIcon"
      />
      指纹采集</el-button
    >
    <el-button
      size="small"
      class="iconfont"
      type="primary"
      @click="fingerPrintVerify"
      v-show="actions.includes('verify')"
    >
      <icon-svg
        icon-class="icon-btn-ico-7"
        style="margin-right: 5px;"
        v-if="visibleIcon"
      />
      指纹验证</el-button
    >
    <el-dialog
      custom-class="finger__dialog"
      :title="collectTitle"
      :visible.sync="showFingerCollect"
      @close="handleCollectClose"
      :modal-append-to-body="false"
    >
      <div class="finger_img_outer">
        <img class="finger_img" :src="currentFingerPrint" alt="" />
      </div>
      <div class="finger_counts">
        <p>{{ collectTips }}</p>
        <div class="counts_items" v-if="currentType === 1">
          <div
            v-for="(item, index) in [1, 2, 3]"
            :key="index"
            class="counts_item"
            :class="{ active: collectedCounts > index }"
          ></div>
        </div>
        <div class="counts_items" v-if="currentType === 2">
          <div
            v-for="(item, index) in [1]"
            :key="index"
            class="counts_item"
            :class="{ active: collectedCounts > index }"
          ></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div style="height: 36px;">
          <el-button
            size="small"
            type="primary"
            v-show="reCollectShow"
            @click="reCollect"
            >重新采集</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  fingerPrintCapture,
  fingerPrintGetImage,
  fingerPrintCancel,
  fingerPrintGetTemplate,
  fingerprintVerify
} from "api/fingerPrint";

export default {
  name: "finger",
  props: {
    actions: {
      type: Array,
      default: () => ["register", "verify"]
    },
    compareTemplate: {
      type: String
    },
    visibleIcon: {
      type: Boolean,
      default: false
    }
  },
  data() {
    this.FINGERPRINT_NUMBER = 3; // 需采集次数
    this.fingerTimer = null; // 采集定时器
    this.timerCounts = 0; // 采集定时器次数
    this.finalFingerPrint = ""; // 最终指纹
    return {
      currentType: 1, // 1-指纹采集，2-指纹验证
      collectTitle: "指纹采集",
      reCollectShow: false,
      collectedCounts: 0, // 已采集次数
      currentFingerPrint: "", // 每次采集后的指纹
      showFingerCollect: false,
      collectTips: "请开始采集指纹"
    };
  },
  methods: {
    getRandomNum() {
      return parseInt(Math.random() * 10000);
    },
    handleCollectClose() {
      this.cancelFingerCapture();
      this.showFingerCollect = false;
    },
    fingerPrintClick() {
      this.currentType = 1;
      this.collectTitle = "指纹采集";
      this.collectTips = "请开始指纹采集";
      this.reCollectShow = false;
      this.showFingerCollect = true;
      this.startFingerCapture(this.currentType);
    },
    fingerPrintVerify() {
      this.currentType = 2;
      this.collectTitle = "指纹验证";
      this.collectTips = "请开始指纹验证";
      this.reCollectShow = false;
      this.showFingerCollect = true;
      this.startFingerCapture(this.currentType);
    },
    startFingerCapture(type = 1, FakeFunOn = 1) {
      fingerPrintCapture({
        type,
        FakeFunOn,
        random: this.getRandomNum()
      })
        .then(res => {
          let ret = res.ret;
          if (ret === 0) {
            // 获取指纹照片
            this.getFingerImage(type);
          } else if (ret === -2001) {
            this.$message.error("未检测到指纹采集器");
            this.showFingerCollect = false;
          } else if (ret === -2002) {
            this.$message.error("加载算法库失败");
            this.showFingerCollect = false;
          } else if (ret === -2005) {
            // 正在采集 重新采集
            this.cancelFingerCapture();
            this.startFingerCapture(type);
          } else {
            this.$message.error(`错误代码：${ret},${res.error}`);
            this.showFingerCollect = false;
          }
        })
        .catch(() => {
          this.$message.error("请安装指纹驱动或启动该服务!");
          this.showFingerCollect = false;
        });
    },
    cancelFingerCapture() {
      fingerPrintCancel(this.getRandomNum())
        .then(() => {
          this.resetCollect();
        })
        .catch(err => {
          this.$message.error(err.message);
        });
    },
    getFingerImage(type) {
      this.timerCounts += 1;
      // 长时间未操作清空timer，每秒五次
      if (this.timerCounts >= 5 * 60 * 10) {
        this.cancelFingerCapture();
        return;
      }
      fingerPrintGetImage(this.getRandomNum())
        .then(res => {
          let counts = 0; // 指纹采集次数
          let base64FPImg = "";
          if (res.ret === 0) {
            counts = res.data.enroll_index; // 指纹采集次数
            base64FPImg = res.data.jpg_base64;
          }
          if (type === 2) {
            // 指纹验证模式 采集1次
            if (counts == 0) {
              this.fingerTimer = setTimeout(
                this.getFingerImage.bind(this, this.currentType),
                200
              ); // 定时器继续获取指纹
            } else {
              this.collectedCounts = counts;
              //将定时器关闭
              clearTimeout(this.fingerTimer);
              //显示指纹图像
              this.showFingerPrintImage(base64FPImg);
              //获取指纹模板
              this.getFingerPrintTemplate("verification");
            }
          } else {
            // 指纹采集模式 采集n次
            if (counts !== this.FINGERPRINT_NUMBER) {
              if (counts !== 0) {
                this.collectedCounts = counts;
                this.collectTips = `剩余采集次数${this.FINGERPRINT_NUMBER -
                  counts}次`;
                this.showFingerPrintImage(base64FPImg); // 显示当前指纹
              }
              this.fingerTimer = setTimeout(this.getFingerImage, 200); // 定时器继续获取指纹
            } else {
              // 指纹采集模式 达到满次
              clearTimeout(this.fingerTimer);
              this.collectedCounts = counts;
              this.showFingerPrintImage(base64FPImg);
              // 获取指纹模板
              this.getFingerPrintTemplate("register");
            }
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.showFingerCollect = false;
        });
    },
    showFingerPrintImage(url) {
      this.currentFingerPrint = `data:image/png;base64,${url}`;
    },
    /**
     * 获取指纹模板
     * @param flag 判断是登记和验证标记 register:登记；verification:验证
     */
    getFingerPrintTemplate(flag) {
      fingerPrintGetTemplate(this.getRandomNum())
        .then(res => {
          let ret = res.ret;
          if (ret === 0) {
            if (flag === "register") {
              // 采集
              this.$message.success("指纹采集成功");
              this.finalFingerPrint = res.data.template;
              this.cancelFingerCapture();
              this.showFingerCollect = false;
              this.$emit("getFingerPrint", res.data.template);
            } else if (flag == "verification") {
              // 指纹验证
              this.verifyFingerPrint(res.data.template);
            }
          } else if (ret === -2003) {
            this.$message.error(
              flag === "register" ? "采集失败，请重新采集." : "请重按手指"
            );
            this.cancelFingerCapture();
            this.reCollectShow = true;
          } else {
            this.$message.error(res.error);
          }
        })
        .catch(err => {
          this.$message.error(err.message);
          this.showFingerCollect = false;
        });
    },
    reCollect() {
      this.resetCollect();
      this.startFingerCapture(this.currentType);
      this.reCollectShow = false;
    },
    resetCollect() {
      clearTimeout(this.fingerTimer);
      this.timerCounts = 0;
      this.collectedCounts = 0;
      this.currentFingerPrint = "";
      this.collectTips = "请开始采集指纹";
    },
    verifyFingerPrint() {
      fingerprintVerify({
        fingerPrint: this.compareTemplate
      })
        .then(res => {
          this.$message.success("验证成功");
          this.cancelFingerCapture();
          this.showFingerCollect = false;
          this.$emit("getReaderCode", res.data.readerCode);
        })
        .catch(() => {
          this.cancelFingerCapture();
          this.showFingerCollect = false;
        });
    }
  }
};
</script>

<style lang="less">
.finger {
  /deep/.el-button {
    min-width: 85px !important;
  }
}
.iconfont {
  font-size: 14px;
}
.finger__dialog {
  .el-dialog__body {
    display: flex;
    .finger_img_outer {
      width: 50%;
      border: 1px solid @borderColor;
      img {
        width: 100%;
        max-height: 100%;
      }
    }
    .finger_counts {
      width: 50%;
      text-align: center;
      margin-top: 10px;
      font-size: @FSize_16;

      .counts_items {
        margin-top: 30px;
        text-align: center;
      }
      .counts_item {
        display: inline-block;
        background: #afb5b9;
        margin-right: 3px;
        width: 50px;
        height: 20px;
        &.active {
          background: @primaryColor;
        }
      }
    }
  }
}
</style>
