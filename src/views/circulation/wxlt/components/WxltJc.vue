<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:41
 -->
<template>
  <div class="wxltjc">
    <div class="readercard">
      <div class="readingTitle">读者信息</div>
      <div class="readerContent">
        <div class="readerTop">
          <div class="cardNumber">
            <span>读者证号：</span>
            <el-input
              v-model="readerBarcode"
              class="cardcontent"
              size="mini"
              style="width:140px;margin-right:10px;"
              @keyup.enter.native="getReader(readerBarcode)"
              @blur="addSetTimer"
              @focus="clearSetTimer"
              ref="readerInputRef"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              @click="getReader(readerBarcode)"
            >
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
          <div class="cardSelect">
            <div class="cardfresh">
              <el-checkbox v-model="checked" style="margin-right:10px;"
                >退证</el-checkbox
              >
              <span>页面刷新：</span>
              <el-select
                filterable
                v-model="refreshTime"
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

        <!-- <div v-if="false" class="readerMgs">
          <div class="readerImg">
            <el-image
              class="avatar"
              v-if="readerData.picture"
              style="width: 110px; height: 154px"
              :src="`${IMG_URL}/api/p/img/url?img=${readerData.picture}`"
              fit="contain"
            ></el-image>
            <icon-svg v-else icon-class="icon-yonghu"></icon-svg>
          </div>
          <div class="readerTip">
            <div class="readerName">
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
              <span class="money" v-if="readerData.qkuan"
                >欠款{{ readerData.qkuan }}</span
              >
            </div>
            <div>
              读者证号: &nbsp;<span>{{ readerData.dzzhao }}</span>
            </div>
            <div>
              有效期:&nbsp;<span>{{ readerData.jzrqi | splitDateTime }}</span>
            </div>
            <div>
              成员馆:&nbsp;<span>{{ readerData.libName }}</span>
            </div>
            <div class="readerlend">
              本馆已借：&nbsp;<span>{{ readerData.bgyjCshu }}册</span
              >&nbsp;&nbsp;|&nbsp;&nbsp;本馆可借：&nbsp;<span
                >{{ readerData.bgkjCshu }}册</span
              >&nbsp;&nbsp;|&nbsp;&nbsp;最大可借：&nbsp;<span
                >{{ readerData.zdkjCshu }}册</span
              >
            </div>
            <div>
              <span class="item_label" style="font-weight:normal">备注：</span>
              <span class="item_string">{{ readerData.beizhu }}</span>
            </div>
          </div>
          <div class="readerLog" v-if="false">
              <el-button class="readerButton" type="primary" size="mini"
                >读者日志</el-button
              >
            </div>
        </div>
        <div v-if="false" class="readerWrap">
          <div class="readerItem">
            <div>
              <span class="item_label">是否馆际读者</span>
              <span class="item_string">{{
                readerData.guanji | filterguanji
              }}</span>
            </div>
            <div>
              <span class="item_label">馆际已借册数</span>
              <span class="item_string">{{ readerData.gjyjCshu }}</span>
            </div>
            <div>
              <span class="item_label">馆际可借册数</span>
              <span class="item_string">{{ readerData.gjkjCshu }}</span>
            </div>
          </div>
          <div class="readerItem">
            <div>
              <span class="item_label">读者单位</span>
              <span class="item_string">{{ readerData.dzdw }}</span>
            </div>
            <div>
              <span class="item_label">证件号码</span>
              <span class="item_string">{{ readerData.zjhma }}</span>
            </div>
            <div>
              <span class="item_label">联系方式</span>
              <span v-if="readerData.shouji" class="item_string"
                >{{
                  readerData.dianhua
                    ? readerData.shouji + "," + readerData.dianhua
                    : readerData.shouji
                }}
              </span>
              <span v-else class="item_string">{{ readerData.dianhua }} </span>
            </div>
          </div>
          <div class="readerItem">
            <div>
              <span class="item_label">停借截止日期</span>
              <span class="item_string">{{ readerData.ztenddate }}</span>
            </div>
            <div>
              <span class="item_label">押金</span>
              <span class="item_string">{{ readerData.yajin }}</span>
            </div>
            <div>
              <span class="item_label">已借金额</span>
              <span class="item_string">{{ readerData.yjje }}</span>
            </div>
          </div>
        </div> -->
      </div>
    </div>
    <div class="bookcard">
      <div class="bookTitle">图书信息</div>
      <div class="bookContent">
        <div class="bookTop">
          <div class="bookNumber">
            <span>图书条形码：</span>
            <el-input
              v-model="bookBarcode"
              size="mini"
              style="width:140px;margin-right:20px;"
              @keyup.enter.native="getBook()"
              @blur="addSetTimer"
              @focus="bookClearSetTimer"
              ref="bookInputRef"
            ></el-input>
            <el-button type="primary" size="mini" @click="getBook">
              <icon-svg icon-class="icon-btn-ico-2" />确认</el-button
            >
            <el-tooltip effect="dark" :content="returntitle" placement="bottom">
              <el-date-picker
                v-model="timeDay"
                type="date"
                placeholder="自定义应还日期"
                size="mini"
                style="width:160px"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-tooltip>
          </div>
        </div>
        <div class="bookMgs">
          <div class="bookTip">
            <div class="bookName">
              {{ bookData.ztming }}
              <span class="bookStyle" v-if="bookData.wxlxing">{{
                bookData.wxlxing
              }}</span>
            </div>
          </div>
          <div class="bookWrap">
            <div class="bookItem">
              <div>
                <span class="item_label">责任者</span>
                <span class="item_string">{{ bookData.zrsming }}</span>
              </div>
              <div>
                <span class="item_label">条形码</span>
                <span class="item_string">{{ bookData.tiaoma }}</span>
              </div>
              <div>
                <span class="item_label">索书号</span>
                <span class="item_string">{{ bookData.sshao }}</span>
              </div>
              <div>
                <span class="item_label">现在馆</span>
                <span class="item_string">{{ bookData.cygid1Name }}</span>
              </div>
              <div>
                <span class="item_label">现藏址</span>
                <span class="item_string">{{ bookData.czid1Name }}</span>
              </div>
            </div>
            <div class="bookItem">
              <div>
                <span class="item_label">ISBN/ISSN</span>
                <span class="item_string">{{ bookData.isbn }}</span>
              </div>
              <div>
                <span class="item_label">出版社</span>
                <span class="item_string">{{ bookData.cbzhe }}</span>
              </div>
              <div>
                <span class="item_label">出版年</span>
                <span class="item_string">{{ bookData.cbrqi }}</span>
              </div>
              <div>
                <span class="item_label">价格</span>
                <span class="item_string">{{ bookData.jge }}</span>
              </div>
              <div>
                <span class="item_label">附件</span>
                <span class="item_string">{{
                  bookData.fjian | filterguanji
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
        border
        stripe
        style="width: 100%"
        height="327"
        v-loading="loadingReaderCur"
        v-if="currentBottomMode === 'dqjy'"
      >
        <el-table-column prop="tiaoma" label="条形码" width="161">
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
        <el-table-column
          show-overflow-tooltip
          prop="date"
          label="操作"
          width="45"
        >
          <template slot-scope="scope">
            <span
              class="otherczStr"
              @click="
                getOthercz(scope.row.tiaoma, scope.row.isbn, scope.row.ztming)
              "
              >本馆馆藏</span
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-if="currentBottomMode === 'lsjy'">
        <el-table
          :data="readerhisData"
          stripe
          border
          style="width: 100%"
          height="293"
          v-loading="loadingReaderHis"
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
          <el-table-column
            show-overflow-tooltip
            prop="mingcheng"
            label="现藏址"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcsj" label="借出日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yhsj" label="应还日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ghsj" label="归还日期">
            <template slot-scope="scope">
              <span :class="scope.row.jyztai == '正常' ? '' : 'returnTime'">
                {{ scope.row.ghsj }}
              </span>
            </template>
          </el-table-column>
        </el-table>
        <div class="content__page">
          <td-pagination
            @size-change="handleHisSizeChange"
            @current-change="handleHisCurrentChange"
            :total="hisTotalCount"
            :currentPage="hiscurrentPage"
            :pageSize="hisPageSize"
          ></td-pagination>
        </div>
      </div>

      <el-table
        :data="otherczData"
        stripe
        style="width: 100%"
        height="327"
        border
        v-loading="loadingOthercz"
        v-if="currentBottomMode === 'bggc'"
      >
        <el-table-column
          width="161"
          prop="tiaoma"
          label="条形码"
        ></el-table-column>
        <el-table-column show-overflow-tooltip prop="sshao" label="索书号">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="ztai"
          label="状态"
          width="45"
        >
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="date"
          label="卷册描述"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="jge"
          label="价格"
          width="87"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="mingcheng" label="现藏址">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import {
  getReaderData,
  getcurbroData,
  getBookData,
  gethisbroData,
  getOtherczData,
  UpdateStatus
} from "api/circulation";
import { IMG_URL } from "utils/base";
import FingerPrint from "components/FingerPrint";
export default {
  components: {
    FingerPrint
  },
  data() {
    this.returntitle =
      "日期为空，按照流通规则生成应还日期；一旦您选择了日期，那么这个日期就是图书的自定义应还日期。如果您不明白选择该日期的作用，请保持日期为空。";
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
      currentLib: this.$store.getters.userInfo.libId,
      loadingReaderCur: false,
      loadingReaderHis: false,
      loadingOthercz: false,
      checked: false,
      readerBarcode: "",
      refreshTime: "",
      IMG_URL: IMG_URL,

      timeDay: "",
      bookBarcode: "",
      bookForm: {},
      readerData: {},
      bookData: {},
      readercurData: [],
      readerhisData: [],
      otherczData: [],
      operateType: 6, //退证
      ztming: "",
      activeName: "first",
      timer: null,
      bottomTabs: [
        {
          value: "dqjy",
          label: "当前借阅"
        },
        {
          value: "lsjy",
          label: "历史借阅"
        },
        {
          value: "bggc",
          label: "本馆馆藏"
        }
      ],
      currentBottomMode: "dqjy",
      readerInputRefFocus: true,

      // 历史记录
      hisTotalCount: 0,
      hiscurrentPage: 1,
      hisPageSize: 10
    };
  },
  activated() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
    this.checked = false;
    // 点进来就要光标指定读者证号
    this.readerInputRefFocus = true;

    // 从归还进来刷新,根据之前的读者刷新
    this.getReader(this.readerData.dzzhao);
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mounted() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
  },
  methods: {
    /**指纹采集 */
    getFingerPrint(code) {
      this.readerBarcode = code;
    },
    setTimer() {
      if (this.timer == null && this.refreshTime) {
        if (this.refreshTime) {
          this.timer = setInterval(() => {
            this.clearData();
            this.readerBarcode = "";
            this.bookBarcode = "";
          }, this.refreshTime);
        }
      }
    },
    clearData() {
      this.bookData = {};
      this.readercurData = [];
      this.readerhisData = [];
      this.bottomTabs[0].label = "当前借阅";
      this.bottomTabs[1].label = "历史借阅";
      this.bottomTabs[2].label = "本馆馆藏";
      this.otherczData = [];
      this.readerData = {};
      this.ztming = "";
      this.activeName = "first";
    },
    // 改变时间
    changeRefreshTime(value) {
      if (!value) {
        clearInterval(this.timer);
        return;
      }
      if (this.timer) {
        clearInterval(this.timer);
      }
      this.timer = setInterval(() => {
        this.clearData();
        this.readerBarcode = "";
        this.bookBarcode = "";
      }, value);
    },
    getReader(value) {
      this.clearData();
      // 重置历史记录的页数
      this.hiscurrentPage = 1;
      if (!value) {
        this.$nextTick(() => {
          this.$refs.readerInputRef.select();
          this.readerInputRefFocus = false;
        });
        return;
      }
      getReaderData({ readerBarcode: value })
        .then(res => {
          // this.readerBarcode = "";
          this.readerData = res.data;
          this.getcurBro();
          this.gethisBro();
          if (this.readerInputRefFocus) {
            this.$nextTick(() => {
              this.$refs.readerInputRef.select();
              this.readerInputRefFocus = false;
            });
          } else {
            this.$refs.bookInputRef.select();
          }
          // 读者退证
          if (this.checked) {
            UpdateStatus({
              operateType: this.operateType,
              dzid: this.readerData.dzid
            }).then(res => {
              if (res.code == 0) {
                this.$message.success("退证成功");
              }
            });
          }
        })
        .catch(() => {
          this.$refs.readerInputRef.select();
        });
    },
    getBook() {
      if (!this.readerData.dzzhao) {
        this.$message.error("请先刷读者证");
        return;
      }
      if (!this.bookBarcode) {
        this.$refs.bookInputRef.select();
      }
      this.bookForm.bookBarcode = this.bookBarcode;
      this.bookForm.readerBarcode = this.readerData.dzzhao;
      this.bookForm.yhrq = this.timeDay;
      getBookData(this.bookForm)
        .then(res => {
          if (res.code == 0) {
            // 查询本馆馆藏
            this.getOthercz(
              this.bookBarcode,
              res.data.isbn,
              res.data.ztming,
              true
            );
            this.bookData = res.data;
            this.timeDay = "";
            this.getcurBro();
            this.gethisBro();
            this.$refs.readerInputRef.select();
            this.bookBarcode = "";
            this.$message.success(res.message);
            getReaderData({ readerBarcode: this.readerData.dzzhao }).then(
              res => {
                if (res.code == 0) {
                  this.readerData = res.data;
                  this.currentBottomMode = "dqjy";
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
          }
          this.bottomTabs[0].label = `当前借阅（${res.data.length}）`;
        })
        .catch(() => {
          this.loadingReaderCur = false;
          this.bottomTabs[0].label = "当前借阅（0）";
        });
    },
    gethisBro() {
      if (!this.readerData.dzzhao) {
        return;
      }
      this.loadingReaderHis = true;
      gethisbroData({
        readerBarcode: this.readerData.dzzhao,
        pageSize: this.hisPageSize,
        pageNumber: this.hiscurrentPage
      })
        .then(res => {
          if (res.code == 0) {
            this.readerhisData = res.data.dataList;
            this.loadingReaderHis = false;
            this.hisTotalCount = +res.data.totalElements;
          }
          this.bottomTabs[1].label = `历史借阅（${res.data.totalElements}）`;
        })
        .catch(() => {
          this.loadingReaderHis = false;
          this.bottomTabs[1].label = "历史借阅（0）";
        });
    },
    getOthercz(tiaoma, isbn, ztming, noNeedActive) {
      if (!noNeedActive) {
        this.currentBottomMode = "bggc";
      }
      if (!this.currentLib || !tiaoma) {
        return;
      }
      this.loadingOthercz = true;
      this.activeName = "third";
      this.ztming = ztming;
      let data = {};
      data.libid = this.currentLib;
      data.tiaoma = tiaoma;
      data.isbn = isbn;
      getOtherczData(data)
        .then(res => {
          this.otherczData = res.data;
          let inLib = 0;
          res.data.forEach(item => {
            if (item.ztai === "在馆") {
              inLib++;
            }
          });
          this.loadingOthercz = false;
          this.bottomTabs[2].label = `${ztming}（${inLib}/${res.data.length}）`;
        })
        .catch(() => {
          this.loadingOthercz = false;
          this.bottomTabs[2].label = `${ztming}(0/0)`;
        });
    },
    clearSetTimer() {
      clearInterval(this.timer);
    },
    bookClearSetTimer() {
      clearInterval(this.timer);
    },
    addSetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.setTimer();
    },
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    handleHisSizeChange(val) {
      this.hisPageSize = val;
      this.gethisBro();
    },
    handleHisCurrentChange(val) {
      this.hiscurrentPage = val;
      this.gethisBro();
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/circulation/circulation.less";
.wxltjc {
  height: 100%;
}

// 屏幕兼容
@media screen and (max-width: 1198px) {
  .bookcard .bookContent .bookMgs .bookTip .bookName {
    height: 65px;
    line-height: 65px;
  }
  .bookcard .bookContent .bookMgs .bookWrap .bookItem div {
    height: 36px;
    line-height: 36px;
  }
}
@media screen and (max-width: 1304px) {
  .readercard .readerContent .readerTop {
    flex-wrap: wrap;
    .cardSelect {
      width: 100%;
    }
  }
  .readercard .readerContent .readerMsgR .msgr_line {
    height: 35px;
    line-height: 35px;
  }
}
</style>
