<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:34
 -->
<template>
  <div class="wxltgh">
    <div class="readercard">
      <div class="readingTitle">读者信息</div>
      <div class="readerContent">
        <div class="readerTop"></div>
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
        <!-- <div class="readerMgs">
          <div class="readerImg">
            <img
              v-if="readerData.picture"
              :src="`${IMG_URL}/api/p/img/url?img=${readerData.picture}`"
              width="110"
              height="154"
              alt=""
            />

            <icon-svg v-else icon-class="icon-yonghu"></icon-svg>
          </div>
          <div class="readerTip">
            <div class="readerName">
              {{ readerData.xming }}
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
              <span class="money" v-if="readerData.qkuan > 0"
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
        </div>
        <div class="readerWrap">
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
                >{{ readerData.shouji }}
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
        <div class="bookTop" style="flex-wrap: wrap;">
          <div class="bookNumber" style="line-height: 40px;">
            <span>图书条形码:</span>
            <el-input
              v-model="bookBarcode"
              size="mini"
              style="width:140px;margin-right:20px;"
              @keyup.enter.native="getReadeAndBook(bookBarcode)"
              ref="bookInputRef"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-right:20px"
              @click="getReadeAndBook(bookBarcode)"
            >
              <icon-svg icon-class="icon-btn-ico-2" />
              确认</el-button
            >
          </div>
          <div style="width: 100%;line-height: 40px;">
            <el-tooltip
              class="item"
              effect="dark"
              :content="returntitle"
              placement="bottom"
            >
              <el-date-picker
                v-model="timeDay"
                type="date"
                placeholder="自定义归还日期"
                size="mini"
                style="width:160px"
              >
              </el-date-picker>
            </el-tooltip>
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
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="bookData.zrsming"
                  placement="top-start"
                >
                  <span class="item_string">{{ bookData.zrsming }}</span>
                </el-tooltip>
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
        height="293"
        :data="returnAllData"
        stripe
        border
        style="width: 100%"
        v-if="currentBottomMode === 'bcghqd'"
      >
        <el-table-column width="161" prop="tiaoma" label="条形码">
        </el-table-column>
        <el-table-column
          prop="ztming"
          min-width="115"
          label="正题名"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="jcmshu" label="卷册描述" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="jge"
          label="价格"
          width="87"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="sshao" label="索书号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="jcsj" label="借出日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="yhsj" label="应还日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ghsj" label="归还日期" show-overflow-tooltip>
          <template slot-scope="scope">
            <span :class="scope.row.jyztai == '正常' ? '' : 'returnTime'">
              {{ scope.row.ghsj }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="fjintip"
          label="违章罚金"
          width="180"
          show-overflow-tooltip
        >
        </el-table-column>
      </el-table>
      <div
        class="computedfajin"
        v-if="returnAllData.length > 0 && currentBottomMode === 'bcghqd'"
      >
        合计罚金：<span>{{ computedfine }}</span>
      </div>
      <el-table
        :data="readercurData"
        stripe
        border
        style="width: 100%"
        height="300"
        v-loading="loadingReaderCur"
        v-if="currentBottomMode === 'dqjy'"
      >
        <el-table-column prop="tiaoma" width="161" label="条形码">
        </el-table-column>
        <el-table-column
          prop="ztming"
          min-width="115"
          label="正题名"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="jcmshu"
          label="卷册描述"
          width="180"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="libJiancheng"
          label="现在馆"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="mingcheng" label="现藏址" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="sshao" label="索书号" show-overflow-tooltip>
        </el-table-column>
        <el-table-column
          prop="jge"
          label="价格"
          width="87"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column prop="jcsj" label="借出日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="yhsj" label="应还日期" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="xjcshu" label="续借" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="ztai" label="书册状态" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="username" label="操作员" show-overflow-tooltip>
        </el-table-column>
        <el-table-column prop="jyztai" label="借阅状态" show-overflow-tooltip>
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
              <!-- <p>
                <span class="label"> 是否免罚</span>
                <span class="val">
                  <el-radio-group
                    v-model="overdue.isFine"
                    size="mini"
                    :disabled="isFineDisabled"
                    @change="isFineChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </span>
              </p>
              <p>
                <span class="label">是否立即收取</span
                ><span class="val">
                  <el-radio-group
                    v-model="overdue.isGet"
                    size="mini"
                    :disabled="isGetDisabled"
                    @change="isGetChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </span>
              </p>
              <p>
                <span class="label">是否从押金中扣除</span
                ><span class="val">
                  <el-radio-group
                    v-model="overdue.isGetForegift"
                    size="mini"
                    :disabled="isGetFDisabled"
                    @change="isGetFChange"
                  >
                    <el-radio :label="true">是</el-radio>
                    <el-radio :label="false">否</el-radio>
                  </el-radio-group>
                </span>
              </p> -->

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
  getReturnBooksData,
  getcurbroData,
  getReaderData,
  yuyueMake,
  overdue,
  overdueOk,
  stopBro,
  stopBroOk,
  getReturnBooks
} from "api/circulation";

import { userCzList } from "api/public";
import { IMG_URL } from "utils/base";
import { formatDateTime } from "utils/filterDate";
export default {
  data() {
    this.curLibId = this.$store.getters.userInfo.libId;
    this.isSameCzTitle =
      "如果选择该项，则会检查要归还的图书和藏址列表中的选中藏址是否一致，一致才能归还。如果您不明白该操作的作用，请保持不要选中。";
    this.returntitle =
      "日期为空，按照流通规则生成应还日期；一旦您选择了日期，那么这个日期就是图书的自定义应还日期。如果您不明白选择该日期的作用，请保持日期为空。";
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
      isSameCz: false,
      bookBarcode: "",
      czid: "",
      options: [],
      timeDay: "",
      returnAllData: [],
      bookData: {},
      readerData: {},
      readercurData: [],
      computedfine: 0,
      libList: [],
      IMG_URL: IMG_URL,
      returnLibListSelect: [
        {
          value: "",
          label: "归还到借出藏址"
        }
      ],
      pevReaderdzzhao: "",

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
      stopBrogData: {},
      // 预约数据
      appointData: [],
      currentAppoint: {},
      appointVisible: false,
      overTimeVisible: false,
      // 罚款数据
      barcode: "",
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
      // overdueTemp: {
      //   isFine: false,
      //   isGet: true,
      //   isGetForegift: false,
      //   money: "",
      //   beizhu: ""
      // },
      overdueRules: {
        money: [
          { validator: moneyRules, trigger: "change" },
          { required: true, message: "请输入实罚金额", trigger: "blur" }
        ]
      },
      bottomTabs: [
        {
          value: "bcghqd",
          label: "本次归还清单"
        },
        {
          value: "dqjy",
          label: "当前借阅"
        }
      ],
      currentBottomMode: "bcghqd"
    };
  },
  mounted() {
    this.getCZOptions();

    let isSameCz = localStorage.getItem("td-jhgl_czyz");
    this.isSameCz = isSameCz === "1" ? true : false;
  },
  activated() {
    // 从借出和续借进来刷新,根据之前的读者刷新
    // this.getReadeAndBook(this.readerData.dzzhao);
    this.bookData = {};
    this.readerData = {};
    this.readercurData = [];
    this.returnAllData = [];
    this.bottomTabs[0].label = "本次归还清单";
    this.computedfine = 0;
    this.activeName = "first";
    this.bookBarcode = "";
    this.timeDay = "";
    // this.czid = "";
    // this.isSameCz = false;
    this.$nextTick(() => {
      this.$refs.bookInputRef.select();
    });
  },
  methods: {
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 获取馆藏
    getCZOptions() {
      userCzList({
        libId: this.curLibId
      }).then(res => {
        let lastCZid = localStorage.getItem("td-jhgl_czid");
        this.returnLibListSelect = res.data.map(item => {
          if (item.czid === lastCZid) {
            this.czid = lastCZid;
          }
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
    // 还书请求
    getReadeAndBook(bookBarcode) {
      this.bookData = {};
      this.readerData = {};
      this.readercurData = [];
      // 预约数据清除
      this.currentAppoint = {};
      this.barcode = "";
      this.appointData = [];
      // 如果没有bookBarcode清除其他数据
      this.$refs.bookInputRef.select();
      if (!bookBarcode) {
        this.returnAllData = []; //将填过的数据清除
        this.pevReaderdzzhao = "";
        this.timeDay = "";
        // this.isSameCz = false;
        // this.czid = "";
        return;
      }
      let param = {};
      param.bookBarcode = bookBarcode;
      param.isSameCz = this.isSameCz;
      if (this.timeDay) {
        param.ghsj = formatDateTime(
          new Date(this.timeDay.getTime() + 1000 * 3600 * 24 * 1 - 1)
        );
      } else {
        param.ghsj = "";
      }
      param.czid = this.czid;
      getReturnBooksData(param)
        .then(res => {
          // 保存用户 藏址一致复选框或者归还藏址数据
          localStorage.setItem("td-jhgl_czyz", this.isSameCz ? "1" : "0");
          localStorage.setItem("td-jhgl_czid", this.czid);

          this.bookBarcode = "";
          this.bookData = res.data.bookDto;
          this.timeDay = "";
          this.readerData = res.data.readeDto;

          // 和之前的读者的进行对比，不同的则删除本次归还清单
          if (!(this.pevReaderdzzhao == this.readerData.dzzhao)) {
            this.returnAllData = [];
          }
          // 将当前的归还数据存起来，完成罚款之后推到本次归还清单
          this.returnCurData = res.data.bookDto;

          // 成功后将读者保存
          this.pevReaderdzzhao = this.readerData.dzzhao;
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
            param.ghsj = res.data.ghsj;
            overdue(param)
              .then(res => {
                this.overTimegData = res.data;
                this.overdue.money = res.data.fjin;
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
            param.ghsj = res.data.ghsj;
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
            this.returnBookList();
          } else {
            this.computedfine = 0;
            this.returnAllData.push(res.data.bookDto);
            this.bottomTabs[0].label = `本次归还清单（${
              this.returnAllData.length
            }）`;
            this.$message.success(res.message);
            let sum = 0;
            this.returnAllData.map(ele => {
              sum += ele.fjin * 100;
              ele.fjintip = ele.fjin.toFixed(2);
            });
            this.computedfine = (Math.round(parseFloat(sum)) / 100).toFixed(2);
            // 刷新当前借阅
            this.getReader();

            this.getReturnBooks();
          }
        })
        .catch(() => {
          this.$refs.bookInputRef.select();
        });
    },
    getReader() {
      this.readerData = {};
      if (!this.pevReaderdzzhao) {
        return;
      }
      getReaderData({ readerBarcode: this.pevReaderdzzhao }).then(res => {
        if (res.code == 0) {
          this.readerData = res.data;
          this.getcurBro();
        }
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
            this.bottomTabs[1].label = `当前借阅（${res.data.length}）`;
          }
        })
        .catch(() => {
          this.loadingReaderCur = false;
          this.bottomTabs[1].label = "当前借阅（0）";
        });
    },
    // 还书成功之后的本次归还清单
    returnBookList() {
      this.computedfine = 0;
      this.returnAllData.push(this.returnCurData);
      this.bottomTabs[0].label = `本次归还清单（${this.returnAllData.length}）`;
      let sum = 0;
      this.returnAllData.map(ele => {
        sum += ele.fjin * 100;
        ele.fjintip = ele.fjin.toFixed(2);
      });
      this.computedfine = (Math.round(parseFloat(sum)) / 100).toFixed(2);
      // 还成功之后刷新一下读者，册数更改
      this.bookBarcode = "";
      this.getReturnBooks();
      this.getReader();
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
            // 罚款返回罚金，将本次归还清单的罚金数据修改
            this.returnCurData.fjin = res.data.fine;
            this.overTimeVisible = false;
            // 超期罚款后跳转到预约系统
            if (res.jump == 4) {
              this.appointVisible = true;
              this.barcode = res.data.bookBarcode;
              this.appointData = res.data.docLtYuYueDtos;
            }
            this.returnBookList();
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
      });
    },
    // 预约当前行的获取
    handleCurrentAppoint(val) {
      this.currentAppoint = val;
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
      });
    },
    overdueCancel() {
      this.overTimeVisible = false;
    },
    stopLendCancel() {
      this.stoplendVisible = false;
    },
    appointCancel() {
      this.appointVisible = false;
    },
    // 完成还书之后要更新图书的信息
    getReturnBooks() {
      getReturnBooks({ bookBarcode: this.bookData.tiaoma }).then(res => {
        this.bookData = res.data;
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
    isGetFChange() {}
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
@import "~styles/circulation/circulation.less";

.wxltgh {
  min-width: 890px;
  height: 100%;
  .edit__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-button {
      padding: 10px 40px;
    }
  }
  .bookName {
    line-height: 65px !important;
    height: 65px !important;
  }
  .bookItem {
    > div {
      height: 40px !important;
      line-height: 40px !important;
    }
  }
}

.bookStatus {
  .computedfajin {
    text-align: right;
    line-height: 32px;
    span {
      display: inline-block;
      width: 200px;
      padding-left: 40px;
      box-sizing: border-box;
      text-align: left;
      color: red;
    }
  }
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
