<template>
  <!-- 批量编辑馆藏页 -->
  <div class="cat-plbjgc" tabindex="1" style="outline: none;">
    <div class="wrapper">
      <el-scrollbar ref="scrollBar">
        <div class="content__middle">
          <span class="tit">馆藏信息</span>
          <div v-if="false">
            <span class="tip">索书号：</span>
            <el-input
              @keyup.enter.native="multireelCheck"
              size="small"
              v-model="sshao"
              style="width: 180px;margin-right: 10px;"
            ></el-input>
            <el-button
              size="small"
              type="primary"
              @click="multireelCheck"
              :loading="loadMultireel"
              >多卷查重</el-button
            >
          </div>
          <div></div>
        </div>
        <div class="content__bottom" style="border-bottom: 1px solid #f2f2f2;">
          <!-- 馆藏模板 -->
          <div class="bottom__template">
            <el-form
              class="template__form"
              ref="templateForm"
              label-width="70px"
              :model="templateForm"
            >
              <el-form-item class="item" label="复本数">
                <el-input
                  disabled
                  size="small"
                  :max="100"
                  :min="1"
                  v-model="fuben"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="cejia" label="册价">
                <el-input
                  clearable
                  size="small"
                  @change="templateFormChange('cejia', $event)"
                  v-model="templateForm.cejia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="taojia" label="套价">
                <el-input
                  clearable
                  @change="templateFormChange('taojia', $event)"
                  size="small"
                  v-model="templateForm.taojia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="ztai" label="状态">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('ztai', $event)"
                  v-model="templateForm.ztai"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ztOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="czid1" label="藏址">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('czid1', $event)"
                  v-model="templateForm.czid1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in czOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="ltlxid" label="流通类型">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('ltlxid', $event)"
                  v-model="templateForm.ltlxid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ltOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="gysid" label="供应商">
                <el-select
                  filterable
                  size="small"
                  v-model="templateForm.gysid"
                  @change="templateFormChange('gysid', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in gysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="batchid" label="批次">
                <el-select
                  filterable
                  size="small"
                  v-model="templateForm.batchid"
                  @change="templateFormChange('batchid', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in batchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="zdfangshi" label="装订方式">
                <el-select
                  filterable
                  size="small"
                  v-model="templateForm.zdfangshi"
                  @change="templateFormChange('zdfangshi', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in zdfsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="ysuanid" label="预算">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('ysuanid', $event)"
                  v-model="templateForm.ysuanid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="jzleixing" label="介质类型">
                <el-select
                  filterable
                  size="small"
                  v-model="templateForm.jzleixing"
                  @change="templateFormChange('jzleixing', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in jzlxOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="wxlyuan" label="来源">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('wxlyuan', $event)"
                  v-model="templateForm.wxlyuan"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in wxlyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item" prop="jcmshu" label="卷册描述">
                <el-input
                  clearable
                  size="small"
                  @change="templateFormChange('jcmshu', $event)"
                  v-model="templateForm.jcmshu"
                ></el-input>
              </el-form-item>
              <el-form-item class="item" prop="beizhu" label="备注">
                <el-input
                  clearable
                  size="small"
                  @change="templateFormChange('beizhu', $event)"
                  v-model="templateForm.beizhu"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 条目数据项 -->
          <div class="bottom__item">
            <div class="item__head">
              <table cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th width="4%">序号</th>
                    <th width="8%">条形码</th>
                    <th width="5%">册价</th>
                    <th width="5%">套价</th>
                    <th width="5%">状态</th>
                    <th width="9%">藏址</th>
                    <th width="6%">流通类型</th>
                    <th width="6%">供应商</th>
                    <th width="6%">批次</th>
                    <th width="6%">装订</th>
                    <th width="4%">预算</th>
                    <th width="4%">介质类型</th>
                    <th width="4%">来源</th>
                    <th width="10%">卷册描述</th>
                    <th width="14%">备注</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="item__content">
              <table cellspacing="0" cellpadding="0">
                <tbody ref="itemBody">
                  <tr v-for="(item, index) in bookList" :key="index">
                    <td width="4%">{{ index + 1 }}</td>
                    <td width="8%">
                      <input
                        type="text"
                        v-model="item.tiaoma"
                        @keyup="
                          handleBarCodeScanner(
                            $event,
                            val => (item.tiaoma = val),
                            () => nextTiaoma($event, index)
                          )
                        "
                        @keyup.enter="nextTiaoma($event, index)"
                      />
                    </td>
                    <td width="5%">
                      <input type="text" v-model="item.cejia" />
                    </td>
                    <td width="5%">
                      <input type="text" v-model="item.taojia" />
                    </td>
                    <td width="5%">
                      <select v-model="item.ztai">
                        <option
                          v-for="option in ztOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="9%">
                      <select v-model="item.czid1">
                        <option
                          v-for="option in czOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.ltlxid">
                        <option
                          v-for="option in ltOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.gysid">
                        <option
                          v-for="option in gysOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.batchid">
                        <option
                          v-for="option in batchOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.zdfangshi">
                        <option
                          v-for="option in zdfsOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.ysuanid">
                        <option
                          v-for="option in ysOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.jzleixing">
                        <option
                          v-for="option in jzlxOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.wxlyuan">
                        <option
                          v-for="option in wxlyOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                        >
                          {{ option.label }}
                        </option>
                      </select>
                    </td>
                    <td width="10%">
                      <input type="text" v-model="item.jcmshu" />
                    </td>
                    <td width="14%">
                      <input type="text" v-model="item.beizhu" />
                    </td>
                  </tr>
                </tbody>
              </table>
              <table
                cellspacing="0"
                cellpadding="0"
                style="position: absolute;left: 0;top: 0;pointer-events:none;"
              >
                <tbody style="pointer-events:none;">
                  <tr
                    v-for="(item, index) in bookList"
                    :key="index"
                    style="height: 33px;pointer-events:none;"
                  >
                    <td
                      :class="{
                        repeat: repeatTiaoMaArr.includes(item.tiaoma)
                      }"
                      style="pointer-events:none;"
                    ></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="content__footer">
      <div>
        <el-popover placement="top" width="400" trigger="hover">
          <div>
            <p style="text-align:center;font-weight: bold;">快捷键组合</p>
            <p style="text-align:center;margin-bottom: 10px;">
              快捷键由ALT键加上其他按键组成，如
            </p>
            <p>保存快捷键：ALT+S</p>
            <p>取消快捷键：ALT+C</p>
          </div>
          <p slot="reference">
            <i class="el-icon-question"></i>
            <span style="margin-left: 10px;">快捷组合键：ALT+对应键</span>
          </p>
        </el-popover>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          v-show="bookList.length > 0"
          @click="handleUpdata"
          >保存(S)</el-button
        >
        <el-button type="primary" size="small" @click="closeCurrentTag"
          >取消(C)</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import {
  ZTAI_OPTIONS,
  ZDFANGSHI_OPTIONS,
  JZLEIXING_OPTIONS,
  WXLYUAN_OPTIONS
} from "utils/variables";

import {
  userCzList,
  flowType,
  userGysInLibList,
  userYsLibList,
  catalogBatchList
} from "api/public";

import {
  catalogMultireelCheck,
  multiUpdateBatch,
  getBookByBatchId
} from "api/catalogue";

export default {
  name: "cat_plbjgc",
  async created() {
    await this.getCatalogBatchList();
    this.getOptions();
  },
  activated() {
    if (
      this.$route.params.shuceid &&
      this.preshuceid !== this.$route.params.shuceid
    ) {
      this.shuceid = this.$route.params.shuceid;
      this.preshuceid = this.$route.params.shuceid;
      this.getBookByBatchId();
    }
  },
  mounted() {
    this.shuceid = this.$route.params.shuceid;
    this.preshuceid = this.$route.params.shuceid;
    document
      .querySelector(".cat-plbjgc")
      .addEventListener("keydown", this.keyEvent, false);
  },
  data() {
    this.libId = this.$route.query.libId || this.$store.getters.userInfo.libId;
    this.ztOptions = ZTAI_OPTIONS;
    this.zdfsOptions = ZDFANGSHI_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.wxlyOptions = WXLYUAN_OPTIONS;
    this.libListSelect = [
      {
        label: "",
        value: ""
      }
    ];
    return {
      repeatTiaoMaArr: [], // 保存重复的条码
      loadMultireel: false,
      sshao: "",
      // 模板
      czOptions: [],
      ltOptions: [],
      gysOptions: [],
      batchOptions: [],
      ysOptions: [],
      templateForm: {
        tiaoma: "",
        cejia: "",
        taojia: "",
        ztai: "",
        czid1: "",
        ltlxid: "",
        gysid: "",
        batchid: "",
        zdfangshi: "",
        ysuanid: "",
        jzleixing: "",
        wxlyuan: "",
        jcmshu: "",
        beizhu: ""
      },
      bookList: [],
      fuben: 1
    };
  },
  methods: {
    keyEvent(event) {
      if (event.altKey && event.keyCode === 83) {
        // S 保存
        window.event.preventDefault();
        this.handleUpdata();
      } else if (event.altKey && event.keyCode === 67) {
        // C 返回
        window.event.preventDefault();
        this.closeCurrentTag();
      }
    },
    getBookByBatchId() {
      getBookByBatchId({
        shuceid: this.shuceid
      }).then(res => {
        this.fuben = res.data.length;
        this.bookList = res.data;
        this.$nextTick(() => {
          this.smItemFocus();
        });
        // 只有全部藏址信息一致左边的模板才显示，否则留空
        let {
          cejia,
          taojia,
          ztai,
          czid1,
          ltlxid,
          gysid,
          batchid,
          zdfangshi,
          ysuanid,
          jzleixing,
          wxlyuan,
          jcmshu,
          beizhu
        } = this.bookList[0];

        let isSame_cejia = true,
          isSame_taojia = true,
          isSame_ztai = true,
          isSame_czid1 = true,
          isSame_ltlxid = true,
          isSame_gysid = true,
          isSame_batchid = true,
          isSame_zdfangshi = true,
          isSame_ysuanid = true,
          isSame_jzleixing = true,
          isSame_wxlyuan = true,
          isSame_jcmshu = true,
          isSame_beizhu = true;

        this.bookList.forEach(item => {
          if (cejia !== item.cejia) {
            isSame_cejia = false;
          }
          if (taojia !== item.taojia) {
            isSame_taojia = false;
          }
          if (ztai !== item.ztai) {
            isSame_ztai = false;
          }
          if (czid1 !== item.czid1) {
            isSame_czid1 = false;
          }
          if (ltlxid !== item.ltlxid) {
            isSame_ltlxid = false;
          }
          if (gysid !== item.gysid) {
            isSame_gysid = false;
          }
          if (batchid !== item.batchid) {
            isSame_batchid = false;
          }
          if (zdfangshi !== item.zdfangshi) {
            isSame_zdfangshi = false;
          }
          if (ysuanid !== item.ysuanid) {
            isSame_ysuanid = false;
          }
          if (jzleixing !== item.jzleixing) {
            isSame_jzleixing = false;
          }
          if (wxlyuan !== item.wxlyuan) {
            isSame_wxlyuan = false;
          }
          if (jcmshu !== item.jcmshu) {
            isSame_jcmshu = false;
          }
          if (beizhu !== item.beizhu) {
            isSame_beizhu = false;
          }
        });

        this.templateForm.cejia = isSame_cejia ? cejia : "";
        this.templateForm.taojia = isSame_taojia ? taojia : "";
        this.templateForm.ztai = isSame_ztai ? ztai : "";
        this.templateForm.czid1 = isSame_czid1 ? czid1 : "";
        this.templateForm.ltlxid = isSame_ltlxid ? ltlxid : "";
        this.templateForm.gysid = isSame_gysid ? gysid : "";
        this.templateForm.batchid = isSame_batchid ? batchid : "";
        this.templateForm.zdfangshi = isSame_zdfangshi ? zdfangshi : "";
        this.templateForm.ysuanid = isSame_ysuanid ? ysuanid : "";
        this.templateForm.jzleixing = isSame_jzleixing ? jzleixing : "";
        this.templateForm.wxlyuan = isSame_wxlyuan ? wxlyuan : "";
        this.templateForm.jcmshu = isSame_jcmshu ? jcmshu : "";
        this.templateForm.beizhu = isSame_beizhu ? beizhu : "";
      });
    },
    getOptions() {
      let p1 = this.getCZOptions();
      let p2 = this.getLTOptions();
      let p3 = this.getGYSOptions();
      let p4 = this.getYSOptions();
      Promise.all([p1, p2, p3, p4]).then(() => {
        this.getBookByBatchId();
      });
    },
    getCZOptions() {
      return new Promise((resolve, reject) => {
        userCzList({
          libId: this.libId
        })
          .then(res => {
            this.czOptions = res.data.map(item => {
              return {
                value: item.czid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getLTOptions() {
      return new Promise((resolve, reject) => {
        flowType({
          libId: this.libId
        })
          .then(res => {
            this.ltOptions = res.data.map(item => {
              return {
                value: item.ltlxid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getGYSOptions() {
      return new Promise((resolve, reject) => {
        userGysInLibList({
          libId: this.libId
        })
          .then(res => {
            this.gysOptions = res.data.map(item => {
              return {
                value: item.gysId,
                label: item.gysName
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getYSOptions() {
      return new Promise((resolve, reject) => {
        userYsLibList({
          libId: this.libId
        })
          .then(res => {
            this.ysOptions = res.data.map(item => {
              return {
                value: item.ysid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    multireelCheck() {
      if (!this.sshao) {
        this.$message("请输入索书号");
        return;
      }
      this.loadMultireel = true;
      catalogMultireelCheck({
        sshao: this.sshao
      })
        .then(res => {
          this.showMultireelCheck = true;
          this.multireelData = res.data;
        })
        .finally(() => {
          this.loadMultireel = false;
        });
    },
    smItemFocus() {
      this.$refs["scrollBar"].$refs["wrap"].scrollTo(0, 0);
    },
    // 书目信息变更
    templateFormChange(key, value) {
      this.bookList.forEach(item => {
        item[key] = value;
      });
    },
    nextTiaoma(e, index) {
      if (index < this.bookList.length - 1) {
        this.$refs["itemBody"].childNodes[
          index + 1
        ].childNodes[1].firstChild.select();
      }
    },
    async getCatalogBatchList() {
      return new Promise((resolve, reject) => {
        catalogBatchList({
          libId: this.libId,
          flag: 0
        })
          .then(res => {
            this.batchOptions = res.data.map(item => {
              return {
                label: item.batchCode,
                value: item.batchId
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    handleUpdata() {
      multiUpdateBatch({
        bookList: JSON.stringify(this.bookList)
      })
        .then(res => {
          this.$message.success(res.message);
          this.$eventBus.$emit("hsjk-updategcxx");
          this.closeCurrentTag();
        })
        .catch(err => {
          if (err.data) {
            this.repeatTiaoMaArr = err.data;
          }
        });
    },
    closeCurrentTag() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          this.$router.push({
            name: "cat_hsjk"
          });
        });
    }
  }
};
</script>

<style lang="less" scoped>
.cat-plbjgc {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
}

.wrapper {
  height: ~"calc(100% - 57px)";
}

.content__middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: @topBgColor;
  height: 40px;
  padding: 0 20px;

  .tit {
    font-weight: bold;
    font-size: @FSize_15;
    color: @fontDarkColor;
  }

  .tip {
    line-height: 32px;
    font-weight: bold;
    font-size: @FSize_14;
    color: @fontDarkColor;
  }
}

.content__bottom {
  display: flex;
  background: @contentHdColor;

  .bottom__template {
    flex: 0 0 234px;
    padding: 0 5px;
    border-right: 1px solid @tableBorderColor;

    .item {
      margin-bottom: 0px;
    }
  }

  .bottom__item {
    width: ~"calc(100% - 234px - 12px - 10px)";
    overflow: auto;
    flex-grow: 0;
    padding: 5px;

    /deep/ .el-input__inner {
      padding: 0;
    }

    /deep/ .cell {
      padding: 0;
    }

    table {
      width: 100%;

      th,
      td {
        font-size: @FSize_14;
        height: 32px;
        font-weight: bold;
        text-align: left;
        border-right: 1px solid #c8d3df;
        border-bottom: 1px solid #c8d3df;
        text-align: center;

        &:first-child {
          border-left: 1px solid #c8d3df;
        }
      }

      th {
        border-top: 1px solid #c8d3df;
      }

      input {
        width: 100%;
        height: 32px;
        text-align: center;
        border: none;
        outline: none;
      }

      select {
        width: 100%;
        height: 32px;
        border: none;
        outline: none;
      }
    }

    .item__content {
      position: relative;
      .repeat {
        background: red;
        opacity: 0.1;
      }
    }
  }
}

.content__footer {
  height: 56px;
  background: @contentHdColor;
  border-top: 1px solid @tableBorderColor;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .el-button {
    padding: 8px 10px;
  }
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
