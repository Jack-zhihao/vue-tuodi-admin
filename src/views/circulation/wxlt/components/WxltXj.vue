<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-04 09:42:19
 -->
<template>
  <div class="wxltxj">
    <div class="readercard">
      <div class="readingTitle">读者信息</div>
      <div class="readerContent">
        <div class="readerTop">
          <div class="cardNumber">
            <span>读者证号：</span>
            <el-input
              v-model="readerBarcode"
              size="mini"
              style="width:140px;margin-right:20px;"
              @keyup.enter.native="getReader()"
              @blur="addSetTimer"
              @focus="clearSetTimer"
              ref="readerInputRef"
            ></el-input>
            <el-button type="primary" size="mini" @click="getReader()">
              <icon-svg icon-class="icon-btn-ico-2" />确认</el-button
            >
          </div>
          <div class="cardfinger" v-if="false">
            <finger-print
              @getFingerPrint="getFingerPrint"
              compareTemplate="121554"
              :actions="['verify']"
              :visibleIcon="true"
            ></finger-print>
          </div>
          <div class="cardSelect cardfreshContain">
            <div class="cardfresh">
              <span>页面刷新：</span>
              <el-select
                filterable
                v-model="refreshTimeXj"
                size="mini"
                style="width:70px"
                @change="changeRefreshTime"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>
          </div>
        </div>
        <div class="readerMsgWrapper">
          <div class="readerMsgL">
            <div class="top">
              <div class="top__img">
                <el-image
                  class="avatar"
                  v-if="readerData.picture"
                  style="width: 100%; height: 100%;"
                  :src="`${IMG_URL}/api/p/img/url?img=${readerData.picture}`"
                  fit="contain"
                ></el-image>
                <img v-else :src="require('assets/avatar.png')" />
              </div>
              <div class="info">
                <div class="info__name">
                  {{ readerData.xming ? readerData.xming : "" }}
                  <span
                    v-if="
                      readerData.xingbie === false ? !readerData.xingbie : false
                    "
                  >
                    <icon-svg
                      icon-class="icon-nv1"
                      style="color:#FF6F9E;width:16px;height:16px"
                    />
                  </span>
                  <span v-if="readerData.xingbie">
                    <icon-svg
                      icon-class="icon-nan"
                      style="color:#FF6F9E;width:16px;height:16px"
                    />
                  </span>
                  <span class="status" v-if="readerData.ztai">{{
                    readerData.ztai
                  }}</span>
                </div>
                <div class="info__id">读者证号：{{ readerData.dzzhao }}</div>
                <div class="info__date">
                  有效期：{{ readerData.jzrqi | splitDateTime }}
                </div>
                <div class="info__money" v-if="readerData.qkuan">
                  欠款：{{ readerData.qkuan }}
                </div>
              </div>
            </div>
            <div class="middle">
              <div class="count">
                <div class="value">{{ readerData.bgyjCshu }}</div>
                <div class="label">本馆已借</div>
              </div>
              <div class="count">
                <div class="value">{{ readerData.bgkjCshu }}</div>
                <div class="label">本馆可借</div>
              </div>
              <div class="count">
                <div class="value">{{ readerData.zdkjCshu }}</div>
                <div class="label">最大可借</div>
              </div>
            </div>
          </div>
          <div class="readerMsgR">
            <div class="msgr_line">
              <span class="line__label">成员馆：</span>
              <span class="line__val" :title="readerData.libName">{{
                readerData.libName
              }}</span>
            </div>
            <div class="msgr_line">
              <div class="msgr_line__half">
                <span class="line__label">读者单位：</span>
                <span class="line__val" :title="readerData.dzdw">{{
                  readerData.dzdw
                }}</span>
              </div>
              <div class="msgr_line__half">
                <span class="line__label"
                  >押&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;金：</span
                >
                <span class="line__val" :title="readerData.yajin">{{
                  readerData.yajin
                }}</span>
              </div>
            </div>
            <div class="msgr_line">
              <div class="msgr_line__half">
                <span class="line__label">是否馆际读者：</span>
                <span class="line__val">{{
                  readerData.guanji | filterguanji
                }}</span>
              </div>
              <div class="msgr_line__half">
                <span class="line__label">馆际已借册数：</span>
                <span class="line__val">{{ readerData.gjyjCshu }}</span>
              </div>
            </div>
            <div class="msgr_line">
              <div class="msgr_line__half">
                <span class="line__label">馆际可借册数：</span>
                <span class="line__val">{{ readerData.gjkjCshu }}</span>
              </div>
              <div class="msgr_line__half">
                <span class="line__label">停借截止日期：</span>
                <span class="line__val" :title="readerData.ztenddate">{{
                  readerData.ztenddate
                }}</span>
              </div>
            </div>
            <div class="msgr_line">
              <span class="line__label">证件号码：</span>
              <span class="line__val" :title="readerData.zjhma">{{
                readerData.zjhma
              }}</span>
            </div>
            <div class="msgr_line">
              <span class="line__label">联系方式：</span>
              <span
                class="line__val"
                :title="
                  readerData.dianhua
                    ? readerData.shouji + ',' + readerData.dianhua
                    : readerData.shouji
                "
                v-if="readerData.shouji"
              >
                {{
                  readerData.dianhua
                    ? readerData.shouji + "," + readerData.dianhua
                    : readerData.shouji
                }}
              </span>
            </div>
            <div class="msgr_line">
              <span class="line__label"
                >备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</span
              >
              <span class="line__val" :title="readerData.beizhu">{{
                readerData.beizhu
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bookcard">
      <div class="bookTitle">图书信息</div>
      <div class="bookContent">
        <div class="bookTop">
          <div class="bookNumber">
            <span>图书条形码:</span>
            <el-input
              v-model="bookBarcode"
              size="mini"
              style="width:140px;margin-right:20px;"
              @keyup.enter.native="getReturnBooks()"
              @blur="addSetTimer"
              @focus="bookClearSetTimer"
              ref="bookInputRef"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-right:10px"
              @click="getReturnBooks()"
            >
              <icon-svg icon-class="icon-btn-ico-2" />确认</el-button
            >
          </div>
        </div>
        <div class="bookMgs">
          <div class="bookTip">
            <div class="bookName">
              {{ returnBookData.ztming }}
              <span class="bookStyle" v-if="returnBookData.wxlxing">{{
                returnBookData.wxlxing
              }}</span>
            </div>
          </div>
          <div class="bookWrap">
            <div class="bookItem">
              <div>
                <span class="item_label">责任者</span>
                <span class="item_string">{{ returnBookData.zrsming }}</span>
              </div>
              <div>
                <span class="item_label">条形码</span>
                <span class="item_string">{{ returnBookData.tiaoma }}</span>
              </div>
              <div>
                <span class="item_label">索书号</span>
                <span class="item_string">{{ returnBookData.sshao }}</span>
              </div>
              <div>
                <span class="item_label">现在馆</span>
                <span class="item_string">{{ returnBookData.cygid1Name }}</span>
              </div>
              <div>
                <span class="item_label">现藏址</span>
                <span class="item_string">{{ returnBookData.czid1Name }}</span>
              </div>
            </div>
            <div class="bookItem">
              <div>
                <span class="item_label">ISBN/ISSN</span>
                <span class="item_string">{{ returnBookData.isbn }}</span>
              </div>
              <div>
                <span class="item_label">出版社</span>
                <span class="item_string">{{ returnBookData.cbzhe }}</span>
              </div>
              <div>
                <span class="item_label">出版年</span>
                <span class="item_string">{{ returnBookData.cbrqi }}</span>
              </div>
              <div>
                <span class="item_label">价格</span>
                <span class="item_string">{{ returnBookData.jge }}</span>
              </div>
              <div>
                <span class="item_label">附件</span>
                <span class="item_string">{{
                  returnBookData.fjian | filterguanji
                }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bookStatus">
      <div class="c-tab__header">
        <span
          class="header__item"
          v-for="(item, index) in bottomTabs"
          @click="changeBottomMode(item.value)"
          :key="index"
          :class="{ active: currentBottomMode === item.value }"
          >{{ item.label }}</span
        >
      </div>
      <el-table
        :data="readercurData"
        stripe
        style="width: 100%"
        height="293"
        v-loading="loadingReaderCur"
        border
        v-if="currentBottomMode === 'dqjy'"
      >
        <el-table-column prop="tiaoma" width="161" label="条形码">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ztming"
          min-width="115"
          label="正题名"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jcmshu" label="卷册描述">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="libJiancheng"
          label="现在馆"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mingcheng" label="现藏址">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="jge"
          label="价格"
          width="87"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jcsj" label="借出日期">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="yhsj" label="应还日期">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="xjcshu" label="续借">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ztai" label="书册状态">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="username" label="操作员">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jyztai" label="借阅状态">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import {
  getReaderData,
  getRenewBooksData,
  getcurbroData
} from "api/circulation";
import FingerPrint from "components/FingerPrint";
import { IMG_URL } from "utils/base";
export default {
  components: {
    FingerPrint
  },
  data() {
    this.options = [
      {
        value: 30000,
        label: "30秒"
      },
      {
        value: 60000,
        label: "60秒"
      },
      {
        value: 120000,
        label: "2分钟"
      },
      {
        value: 300000,
        label: "5分钟"
      },
      {
        value: "",
        label: "不刷新"
      }
    ];
    return {
      loadingReaderCur: false,
      checked: false,
      readerBarcode: "",
      refreshTime: "",
      bookBarcode: "",

      thimeDay: "",
      readercurData: [],
      readerData: {},
      returnBookData: {},
      refreshTimeXj: "",
      timerXj: null,
      bottomTabs: [
        {
          value: "dqjy",
          label: "当前借阅"
        }
      ],

      currentBottomMode: "dqjy",
      readerInputRefFocus: true,
      IMG_URL: IMG_URL
    };
  },
  activated() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timerXj);
    this.timerXj = null;
    this.setTimer();
    // 点进来就要光标指定读者证号
    this.readerInputRefFocus = true;
    // 从借出归还进来，刷新页面
    this.getReader();
  },
  deactivated() {
    if (this.timerXj) {
      clearInterval(this.timerXj);
      this.timerXj = null;
    }
  },
  mounted() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timerXj);
    this.timerXj = null;
    this.setTimer();
  },
  methods: {
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },

    setTimer() {
      if (this.timerXj == null && this.refreshTimeXj) {
        if (this.refreshTimeXj) {
          this.timerXj = setInterval(() => {
            this.clearData();
          }, this.refreshTimeXj);
        }
      }
    },
    // 改变时间
    changeRefreshTime(value) {
      if (!value) {
        clearInterval(this.timerXj);
        return;
      }
      if (this.timerXj) {
        clearInterval(this.timerXj);
      }
      this.timerXj = setInterval(() => {
        this.clearData();
      }, value);
    },
    clearData() {
      this.readerData = {};
      this.returnBookData = {};
      this.readercurData = [];
      this.bottomTabs[0].label = "当前借阅";
      this.bookBarcode = "";
    },
    /**指纹采集 */
    getFingerPrint(code) {
      this.readerBarcode = code;
    },
    getReader() {
      this.readerData = {};
      this.returnBookData = {};
      this.readercurData = [];
      this.bottomTabs[0].label = "当前借阅";
      this.bookBarcode = "";
      if (!this.readerBarcode) {
        this.$nextTick(() => {
          this.$refs.readerInputRef.select();
          this.readerInputRefFocus = false;
        });
        return;
      }
      getReaderData({ readerBarcode: this.readerBarcode })
        .then(res => {
          if (res.code == 0) {
            this.readerData = res.data;
            this.getcurBro();
            if (this.readerInputRefFocus) {
              this.$nextTick(() => {
                this.$refs.readerInputRef.select();
                this.readerInputRefFocus = false;
              });
            } else {
              this.$refs.bookInputRef.select();
            }
          }
        })
        .catch(() => {
          this.$refs.readerInputRef.select();
        });
    },
    getReturnBooks() {
      if (!this.readerData.dzzhao) {
        this.$message.error("请先刷读者证");
        return;
      }
      if (!this.bookBarcode) {
        this.$refs.bookInputRef.select();
        return;
      }
      getRenewBooksData({
        readerBarcode: this.readerData.dzzhao,
        bookBarcode: this.bookBarcode
      })
        .then(res => {
          if (res.code == 0) {
            // this.bookBarcode = "";
            this.$message.success(res.message);
            this.returnBookData = res.data;
            this.$refs.readerInputRef.select();
            this.getcurBro();
            // 续借完成之后获取读者信息
            getReaderData({ readerBarcode: this.readerData.dzzhao }).then(
              res => {
                if (res.code == 0) {
                  this.readerData = res.data;
                }
              }
            );
          }
        })
        .catch(() => {
          this.$refs.bookInputRef.select();
        });
    },
    getcurBro() {
      if (!this.readerData.dzzhao) {
        return;
      }
      this.loadingReaderCur = true;
      getcurbroData({ readerBarcode: this.readerData.dzzhao })
        .then(res => {
          if (res.code == 0) {
            this.readercurData = res.data;
            this.loadingReaderCur = false;
            this.bottomTabs[0].label = `当前借阅（${res.data.length}）`;
          }
        })
        .catch(() => {
          this.loadingReaderCur = false;
          this.bottomTabs[0].label = "当前借阅（0）";
        });
    },
    // 输入的时候要清除定时器
    clearSetTimer() {
      clearInterval(this.timerXj);
    },
    bookClearSetTimer() {
      clearInterval(this.timerXj);
    },
    addSetTimer() {
      clearInterval(this.timerXj);
      this.timerXj = null;
      this.setTimer();
    }
  },
  destroyed() {
    clearInterval(this.timerXj);
  }
};
</script>
<style lang="less" scoped>
.wxltxj {
  height: 100%;
}
@import "~styles/circulation/circulation.less";
.cardfinger {
  /deep/ .finger {
    margin-left: -10px;
  }
}
</style>
