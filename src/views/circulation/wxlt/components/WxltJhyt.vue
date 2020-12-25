<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:49
 -->
<template>
  <div class="wxltjhyt">
    <div class="bookOrreader">
      <div class="bookTop">
        <div class="bookNumber">
          <span>条形码:</span>
          <el-input
            v-model="barcodes"
            size="mini"
            style="width:180px;margin-right:10px;margin-left:10px"
            @keyup.enter.native="getReaderAndBook()"
            @blur="addSetTimer"
            ref="barcodesInputRef"
            @focus="clearSetTimer"
          ></el-input>
          <el-button
            type="primary"
            size="mini"
            style="margin-right:20px"
            @click="getReaderAndBook()"
          >
            <icon-svg icon-class="icon-btn-ico-2" />
            确认</el-button
          >
          <el-select
            filterable
            v-model="czid"
            placeholder="归还到"
            size="mini"
            style="width:150px;margin-left:10px;"
          >
            <el-option
              v-for="item in returnLibListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-tooltip
            class="item"
            effect="dark"
            :content="isSameCzTitle"
            placement="bottom"
          >
            <el-checkbox v-model="isSameCz" style="margin-left:10px;"
              >藏址一致</el-checkbox
            >
          </el-tooltip>
          <div class="refrsh_time">
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
    </div>
    <div class="readercard">
      <div class="readingTitle">读者信息</div>
      <div class="readerContent">
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
        stripe
        style="width: 100%"
        height="315"
        v-loading="loadingReaderCur"
        border
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
          height="282"
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
        border
        style="width: 100%"
        height="315"
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
    <div class="overdue">
      <el-dialog title="超期罚款" :visible.sync="overTimeVisible">
        <div class="edit__content">
          <div class="tit">
            <span>图书信息</span>
          </div>
          <div class="user__info">
            <div class="info__column">
              <p>
                <span class="label">条形码</span
                ><span class="val">{{ overTimegData.tma }}</span>
              </p>
              <p>
                <span class="label">正题名</span
                ><span class="val"> {{ overTimegData.ztming }}</span>
              </p>
              <p>
                <span class="label">借出时间</span
                ><span class="val">{{
                  overTimegData.jcsj | splitDateTime
                }}</span>
              </p>
              <p>
                <span class="label">应还时间</span
                ><span class="val">{{
                  overTimegData.yhsj | splitDateTime
                }}</span>
              </p>
              <p>
                <span class="label">处罚费率</span
                ><span class="val">{{ overTimegData.flv }}</span>
              </p>
              <p>
                <span class="label">应罚金额</span
                ><span class="val">{{ overTimegData.fjin }}</span>
              </p>
              <p>
                <span class="label">超期时间</span
                ><span class="val">{{ overTimegData.cqsj }}</span>
              </p>
            </div>
          </div>
          <div class="tit">
            <span>确认信息</span>
          </div>
          <div class="user__info">
            <div class="info__column info__column_1">
              <el-form
                class="addForm custom__form"
                ref="overdue"
                :model="overdue"
                :rules="overdueRules"
              >
                <el-form-item
                  prop="isFine"
                  label="是否免罚"
                  style="margin-bottom:0"
                >
                  <el-radio-group
                    v-model="overdue.isFine"
                    size="mini"
                    :disabled="isFineDisabled"
                    @change="isFineChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  prop="isGet"
                  label="是否立即收取"
                  style="margin-bottom:0"
                >
                  <el-radio-group
                    v-model="overdue.isGet"
                    size="mini"
                    :disabled="isGetDisabled"
                    @change="isGetChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  prop="isGetForegift"
                  label="是否从押金中扣除"
                  style="margin-bottom:0"
                >
                  <el-radio-group
                    v-model="overdue.isGetForegift"
                    size="mini"
                    :disabled="isGetFDisabled"
                    @change="isGetFChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item prop="money" label="实罚金额">
                  <el-input
                    clearable
                    size="mini"
                    v-model="overdue.money"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="beizhu" label="备注">
                  <el-input
                    clearable
                    size="mini"
                    v-model.trim="overdue.beizhu"
                    type="textarea"
                    autosize
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <template v-slot:footer>
          <div class="edit__footer border">
            <div></div>
            <div>
              <el-button
                size="mini"
                type="primary"
                @click="overdueSure('overdue')"
                >确定</el-button
              >
              <el-button size="mini" @click="overdueCancel">取消</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="appoint">
      <el-dialog title="预约到书分配" :visible.sync="appointVisible">
        <div class="edit__content">
          <div class="appoint__table__title">
            共有{{ appointData.length }}位读者预约了此书
          </div>
          <div class="appoint__table">
            <el-table
              :data="appointData"
              height="100%"
              border
              style="width: 100%"
              highlight-current-row
              @current-change="handleCurrentAppoint"
            >
              <el-table-column prop="dzzhao" label="读者证号">
              </el-table-column>
              <el-table-column prop="xming" label="读者姓名"> </el-table-column>
              <el-table-column prop="dzlxName" label="读者类型" width="70">
              </el-table-column>
              <el-table-column prop="yyshijian" label="预约日期">
              </el-table-column>
              <el-table-column prop="tel" label="电话"> </el-table-column>
              <el-table-column prop="ztai" label="状态" width="45">
              </el-table-column>
            </el-table>
          </div>
        </div>
        <template v-slot:footer>
          <div class="edit__footer border">
            <div></div>
            <div>
              <el-button size="mini" type="primary" @click="appointSure"
                >确定</el-button
              >
              <el-button size="mini" @click="appointCancel">取消</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
    <div class="stoplend">
      <el-dialog
        title="超期停借处理"
        :visible.sync="stoplendVisible"
        width="640px"
      >
        <div class="edit__content">
          <el-radio-group v-model="stopBroradio">
            <el-radio :label="1"
              >暂停至某天：
              <el-date-picker
                v-model="stopBroTime"
                type="date"
                placeholder="选择时间"
                :disabled="stopBroTimeDisabled"
                :picker-options="pickerOptions1"
                size="mini"
              ></el-date-picker>
            </el-radio>
            <el-radio :label="2"
              >暂停多少天：
              <el-input
                clearable
                :disabled="stopBroDayDisabled"
                v-model="stopBroDay"
                size="mini"
              ></el-input>
            </el-radio>
          </el-radio-group>
        </div>
        <template v-slot:footer>
          <div class="edit__footer border">
            <div></div>
            <div>
              <el-button size="mini" type="primary" @click="stopBroradioSure"
                >确定</el-button
              >
              <el-button size="mini" @click="stopLendCancel">取消</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import {
  getReaderData,
  getcurbroData,
  getReturnBooks,
  broAndRet,
  overdue,
  overdueOk,
  stopBro,
  stopBroOk,
  yuyueMake,
  getOtherczData,
  gethisbroData
} from "api/circulation";
import { IMG_URL } from "utils/base";
import { userCzList } from "api/public";

// import FingerPrint from "components/FingerPrint";
import { formatDateTime } from "utils/filterDate";
export default {
  components: {
    // FingerPrint
  },
  data() {
    this.isSameCzTitle =
      "如果选择该项，则会检查要归还的图书和藏址列表中的选中藏址是否一致，一致才能归还。如果您不明白该操作的作用，请保持不要选中。";
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
    this.curLibId = this.$store.getters.userInfo.libId;
    let moneyRules = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("实罚金额不能为空"));
      } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(new Error("实罚金额只能填整数或保留1~2位小数"));
      } else {
        callback();
      }
    };
    return {
      loadingReaderCur: false,
      checked: false,
      refreshTime: "",
      IMG_URL: IMG_URL,
      returnLibListSelect: [
        {
          value: "",
          label: "归还到借出藏址"
        }
      ],
      barcodes: "",
      isSameCz: false,
      czid: "",
      // 历史借阅
      readerhisData: [],
      gethisbroData: [],
      hiscurrentPage: 1,
      hisPageSize: 10,
      hisTotalCount: 0,
      loadingReaderHis: false,
      // 当前馆藏数据
      currentLib: this.$store.getters.userInfo.libId,
      loadingOthercz: false,
      otherczData: [],
      preBarcodes: "",
      bookForm: {},
      readerData: {},
      bookData: {},
      readercurData: [],
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
      bookBarcode: "",
      readerBarcode: "",
      // 超期罚款
      overTimeVisible: false,
      barcode: "", //预约需要
      overTimeghsj: "",
      overTimegData: {},
      isFineDisabled: false,
      isGetDisabled: false,
      isGetFDisabled: false,
      overdue: {
        isFine: false,
        isGet: true,
        isGetForegift: false,
        money: "",
        beizhu: ""
      },
      overdueRules: {
        money: [
          { validator: moneyRules, trigger: "change" },
          { required: true, message: "请输入实罚金额", trigger: "blur" }
        ]
      },
      // 预约数据
      appointData: [],
      currentAppoint: {},
      appointVisible: false,
      // 停借的数据
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 1000 * 60 * 60 * 24;
        }
      },
      stopBroDay: "",
      stopBroTime: "",
      stopBroTimeDisabled: true,
      stopBroDayDisabled: false,
      stopBroradio: 2,
      stoplendVisible: false,
      stopBrogData: {}
    };
  },
  activated() {
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
    this.$nextTick(() => {
      this.$refs.barcodesInputRef.select();
    });

    this.clearData();
    this.barcodes = "";
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
    this.getCZOptions();
  },
  methods: {
    // 获取馆藏
    getCZOptions() {
      userCzList({
        libId: this.curLibId
      }).then(res => {
        this.returnLibListSelect = res.data.map(item => {
          return {
            value: item.czid,
            label: item.mingcheng
          };
        });
        this.returnLibListSelect.unshift({
          value: "",
          label: "归还到借出藏址"
        });
      });
    },
    setTimer() {
      if (this.timer == null && this.refreshTime) {
        if (this.refreshTime) {
          this.timer = setInterval(() => {
            this.clearData();
            this.barcodes = "";
          }, this.refreshTime);
        }
      }
    },
    clearData() {
      this.bookData = {};
      this.readercurData = [];
      this.bottomTabs[0].label = "当前借阅";
      this.bottomTabs[1].label = "历史借阅";
      this.bottomTabs[2].label = "本馆馆藏";
      this.readerhisData = [];
      this.otherczData = [];
      this.ztming = "";
      this.readerData = {};
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
        this.barcodes = "";
      }, value);
    },

    getReaderAndBook() {
      // 预约数据清除
      this.currentAppoint = {};
      this.barcode = "";
      this.appointData = [];
      if (!this.barcodes) {
        return;
      }
      let param = {};
      if (this.preBarcodes) {
        param.barcodes = this.preBarcodes + "," + this.barcodes;
      } else {
        param.barcodes = this.barcodes;
      }
      param.czid = this.czid;
      param.isSameCz = this.isSameCz;
      broAndRet(param)
        .then(res => {
          this.clearData();
          if (res.data.bookDto && res.data.readeDto) {
            // 其他藏址
            this.getOthercz(
              res.data.bookBarcode,
              res.data.bookDto.isbn,
              res.data.bookDto.ztming,
              true
            );
            this.preBarcodes = "";
            if (res.data.bookDto) {
              this.bookData = res.data.bookDto;
            }
            if (res.data.readeDto) {
              this.readerData = res.data.readeDto;
            }
            this.bookBarcode = res.data.bookBarcode;
            this.readerBarcode = res.data.readerBarcode;
            // 跳转到超期罚款页面
            if (res.jump == 2) {
              // 将之前进入罚款的数据清除
              // this.overdue = {
              //   ...this.overdueTemp
              // };
              this.isFineDisabled = false;
              this.isGetDisabled = false;
              this.isGetFDisabled = false;
              // this.$refs["overdue"].resetFields();
              this.overTimegData = {};
              this.overTimeVisible = true;
              this.$nextTick(() => {
                this.$refs["overdue"].resetFields();
              });
              let param = {};
              param.bookBarcode = res.data.bookBarcode;
              param.ghsj = res.data.bookDto.ghsj;
              overdue(param)
                .then(res => {
                  this.overTimegData = res.data;
                })
                .catch(() => {
                  this.overTimegData = {};
                });
            } else if (res.jump == 3) {
              // 将之前进入停借的数据清除
              this.stopBroDay = "";
              this.stopBroDayDisabled = false;
              this.stopBroradio = 2;
              this.stopBrogData = {};
              // 跳转到超期停借页面
              let param = {};
              param.bookBarcode = res.data.bookBarcode;
              param.ghsj = res.data.bookDto.ghsj;
              this.stoplendVisible = true;
              stopBro(param)
                .then(res => {
                  this.stopBrogData = res.data;
                  this.stopBroDay = res.data.wztjNum;
                  this.stopBroDayDisabled = false;
                  this.stopBroradio = 2;
                })
                .catch(() => {
                  this.stopBrogData = {};
                });
            } else if (res.jump == 4) {
              // 跳转到预约页面
              this.appointVisible = true;
              this.barcode = res.data.bookBarcode;
              this.appointData = res.data.docLtYuYueDtos;
              this.$message.success(res.message);
            } else {
              this.$message.success(res.message);
              this.getReturnBooks(res.data.bookBarcode);
              this.getReader(res.data.readerBarcode);
              // this.getcurBro(res.data.readerBarcode);
              this.$refs.barcodesInputRef.select();
              this.barcodes = "";
            }
          } else if (res.data.flag == 1) {
            this.preBarcodes = res.data.dzzhao;
            this.$message.success(res.message);
            this.readerData = res.data;
            this.getcurBro(res.data.dzzhao);
            this.gethisBro(res.data.dzzhao);
            // this.getReader(res.data.dzzhao);
            this.$refs.barcodesInputRef.select();
            // this.barcodes="";
          } else {
            // 其他藏址
            this.getOthercz(
              res.data.bookBarcode,
              res.data.isbn,
              res.data.ztming,
              true
            );
            this.$message.success(res.message);
            this.bookData = res.data;
            this.getReader(this.preBarcodes);
            this.$refs.barcodesInputRef.select();
            // this.barcodes="";
          }
        })
        .catch(() => {
          this.$refs.barcodesInputRef.select();
          this.clearData();
          this.preBarcodes = "";
        });
    },
    returnBookList() {
      this.getReturnBooks(this.bookBarcode);
      this.getReader(this.readerBarcode);
      // this.getcurBro(this.readerBarcode);
    },
    // 超期罚款确认
    overdueSure(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.overTimegData.tma || !this.overTimegData.ghsj) {
            return;
          }
          let param = {};
          param.isGet = this.overdue.isGet;
          param.isGetForegift = this.overdue.isGetForegift;
          param.isFine = this.overdue.isFine;
          param.money = this.overdue.money;
          param.beizhu = this.overdue.beizhu;
          param.bookBarcode = this.overTimegData.tma;
          param.ghsj = this.overTimegData.ghsj;
          overdueOk(param).then(res => {
            this.overTimeVisible = false;
            this.$message.success(res.message);
            this.overTimeVisible = false;
            // 超期罚款后跳转到预约系统
            if (res.jump == 4) {
              this.appointVisible = true;
              this.barcode = res.data.bookBarcode;
              this.appointData = res.data.docLtYuYueDtos;
            }
            this.returnBookList();
            this.$refs.barcodesInputRef.select();
          });
        }
      });
    },

    // 超期停借确认
    stopBroradioSure() {
      let param = {};
      if (!this.stopBrogData.bookBarcode || !this.stopBrogData.ghsj) {
        return;
      }
      param.bookBarcode = this.stopBrogData.bookBarcode;
      param.ghsj = this.stopBrogData.ghsj;
      param.flag = this.stopBroradio;
      let stopBroTimeTemp = "";
      if (this.stopBroradio == 1) {
        if (!this.stopBroTime == "") {
          stopBroTimeTemp = formatDateTime(
            new Date(this.stopBroTime.getTime() + 1000 * 3600 * 24 * 1 - 1)
          );
          param.content = stopBroTimeTemp;
        } else {
          this.$message.error("请输入停借日期");
          return;
        }
      } else if (this.stopBroradio == 2) {
        if (
          !/^\d+(\.\d{0,1})?$/.test(this.stopBroDay) ||
          this.stopBroDay == 0
        ) {
          this.$message.error("请输入大于0并最多保留1位小数的停借天数");
          return;
        } else {
          param.content = this.stopBroDay;
        }
      }
      stopBroOk(param).then(res => {
        this.$message.success(res.message);
        this.stoplendVisible = false;
        // 超期罚款后跳转到预约系统
        if (res.jump == 4) {
          this.appointVisible = true;
          this.barcode = res.data.bookBarcode;
          this.appointData = res.data.docLtYuYueDtos;
        }
        this.returnBookList();
        this.$refs.barcodesInputRef.select();
      });
    },
    // 预约当前行的获取
    handleCurrentAppoint(val) {
      this.currentAppoint = val;
    },
    getReader(readerBarcode) {
      this.clearData();
      if (!readerBarcode) {
        return;
      }
      getReaderData({ readerBarcode: readerBarcode }).then(res => {
        this.readerData = res.data;
        this.getcurBro(readerBarcode);
        this.gethisBro(readerBarcode);
      });
    },
    // 预约确定
    appointSure() {
      let param = {};
      if (!this.currentAppoint.yyid || !this.barcode) {
        return;
      }
      param.yyid = this.currentAppoint.yyid;
      param.bookBarcode = this.barcode;
      yuyueMake(param).then(res => {
        this.appointVisible = false;
        this.currentAppoint = {};
        this.appointData = [];
        this.barcode = "";
        this.$message.success(res.message);
        this.$refs.barcodesInputRef.select();
      });
    },
    getReturnBooks(bookBarcode) {
      getReturnBooks({ bookBarcode: bookBarcode }).then(res => {
        this.bookData = res.data;
      });
    },
    getcurBro(readerBarcode) {
      if (!readerBarcode) {
        return;
      }
      this.loadingReaderCur = true;
      getcurbroData({ readerBarcode: readerBarcode })
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
    isGetChange(val) {
      if (val == true) {
        this.isGetFDisabled = false;
        this.overdue.isGetForegift = false;
      } else {
        this.isGetFDisabled = true;
        this.overdue.isGetForegift = false;
      }
    },
    isFineChange(val) {
      if (val == true) {
        this.overdue.isGet = false;
        this.overdue.isGetForegift = false;
        this.isGetDisabled = true;
        this.isGetFDisabled = true;
      } else {
        this.overdue.isGet = true;
        this.overdue.isGetForegift = false;
        this.isGetDisabled = false;
        this.isGetFDisabled = false;
      }
    },
    isGetFChange() {},
    overdueCancel() {
      this.overTimeVisible = false;
    },
    stopLendCancel() {
      this.stoplendVisible = false;
    },
    appointCancel() {
      this.appointVisible = false;
    },

    clearSetTimer() {
      // event.currentTarget.select();
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

    // 历史借阅
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
    // 查看当前馆藏
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
  },

  watch: {
    stopBroradio(val) {
      if (val == 1) {
        this.stopBroDayDisabled = true;
        this.stopBroTimeDisabled = false;
        this.stopBroDay = "";
      }
      if (val == 2) {
        this.stopBroTime = "";
        this.stopBroTimeDisabled = true;
        this.stopBroDayDisabled = false;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.wxltJhty {
  // min-width: 1180px;
  height: 100%;
}
@import "~styles/circulation/circulation.less";
</style>
<style lang="less" scoped>
.bookOrreader {
  margin: 10px 0;
  padding: 0 10px;
  font-size: @FSize_14;
  .refrsh_time {
    display: inline-block;
    /deep/.el-input {
      .el-input__inner {
        padding: 0 20px 0 5px !important;
      }
    }
  }
}
.readerContent,
.bookContent {
  height: 300px !important;
}
.overdue {
  /deep/.el-dialog__body {
    padding: 10px;
  }
  .edit__content {
    padding: 0 10px;
    .user__info {
      .info__column {
        p {
          width: 50%;
          line-height: 30px;
          display: inline-block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          .label {
            display: inline-block;
            width: 75px;
            text-align-last: justify;
            position: relative;
            padding-right: 14px;
            &:after {
              content: "：";
              position: absolute;
              right: 0px;
            }
          }
          .val {
            font-weight: 700;
          }
        }
        .addForm {
          /deep/.el-form-item {
            margin-bottom: 18px;
            .el-form-item__label {
              display: inline-block;
              width: 132px;
              text-align-last: justify;
              position: relative;
              padding-right: 14px;
              &:after {
                content: "：";
                position: absolute;
                right: 0px;
              }
            }
            .el-input {
              width: 180px;
            }
            .el-form-item__error {
              left: 132px;
            }
            .el-textarea {
              width: 180px;
            }
          }
        }
      }
      .info__column_1 {
        p {
          width: 100%;
          .label {
            width: 120px;
          }
        }
      }
    }
    .tit {
      display: flex;
      justify-content: space-between;
      width: 100%;
      font-weight: bold;
      font-size: @FSize_20;
      margin: 10px 0;
    }
  }
}
.appoint {
  /deep/.el-dialog__body {
    padding: 10px;
  }
  .appoint__table {
    height: ~"calc(100% - 36px)";
  }
  .appoint__table__title {
    line-height: 30px;
    padding-bottom: 6px;
    font-size: 16px;
    color: @fontTintColor;
  }
  .edit__content {
    height: 100%;
  }
}
.stoplend {
  /deep/.el-dialog__body {
    padding: 10px;
  }
  .el-radio-group {
    margin-bottom: 20px;
    // width:300px;
    .el-radio {
      margin-bottom: 20px;
    }
    .el-date-editor.el-input,
    .el-date-editor.el-input__inner {
      width: 200px;
    }
    .el-input,
    .el-input__inner {
      width: 200px;
      height: 36px;
      line-height: 36px;
    }
  }
}
</style>
