<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 14:33:51
 -->
<template>
  <div class="wxltjc">
    <div class="readercard">
      <div class="readingTitle">读者信息</div>
      <div class="readerContent">
        <div class="readerTop">
          <div class="cardNumber">
            <span>读者证号:</span>
            <el-input
              v-model="readerBarcode"
              class="cardcontent"
              size="mini"
              style="width:180px;margin-right:10px;margin-left:10px"
              @keyup.enter.native="getReader(readerBarcode)"
              ref="readerInputRef"
              autofocus
              clearable
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              @click="getReader(readerBarcode)"
            >
              <icon-svg icon-class="icon-btn-ico-2" />确认</el-button
            >
          </div>

          <div class="cardSelect">
            <div class="cardfresh">
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
        <div class="readerMgs">
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
              <span class="item_label">备注</span>
              <span class="item_string">{{ readerData.beizhu }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="bookcard">
      <div class="bookTitle">图书信息</div>
      <div class="bookContent" style="paddingLeft:5px">
        <el-form
          class="addForm custom__form"
          ref="literatureForm"
          label-width="80px"
          :model="literatureForm"
          :rules="rules"
        >
          <el-form-item class="item" prop="isbn">
            <el-select
              filterable
              class="filterKey"
              size="mini"
              v-model="currentLiteratureFilterKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in literatureFilterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-input
              clearable
              size="mini"
              v-model="literatureForm.literatureSearchKey"
              placeholder="请输入搜索关键词"
              ref="literatureSearchKey"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (literatureForm.literatureSearchKey = val),
                  bookInfo
                )
              "
              @keyup.enter.native="delayFunc(bookInfo)"
            ></el-input>
          </el-form-item>
          <el-form-item></el-form-item>

          <el-form-item class="item" label="借出藏址" prop="cangzhi">
            <el-select
              filterable
              size="mini"
              v-model="literatureForm.cangzhi"
              placeholder="请选择"
              ref="cangzhi"
            >
              <el-option
                v-for="item in cangzhiArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item></el-form-item>

          <el-form-item class="item" label="图书类型" prop="type">
            <el-select
              filterable
              size="mini"
              v-model="literatureForm.type"
              placeholder="请选择"
              ref="type"
            >
              <el-option
                v-for="item in typeArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item></el-form-item>

          <el-form-item class="item" label="借阅备注" prop="beizhu">
            <el-input
              clearable
              size="mini"
              v-model="literatureForm.beizhu"
              placeholder="请输入借阅备注"
              ref="beizhu"
            ></el-input>
          </el-form-item>
        </el-form>
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
        height="320"
        v-loading="loadingDqjy"
        v-if="currentBottomMode === 'dqjy'"
      >
        <el-table-column prop="ztming" min-width="115" label="正题名">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="isbn"
          width="145"
          label="ISBN/ISSN"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="czName" label="借出藏址">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="price"
          label="价格"
          width="87"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="cbrqi" label="年份">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="rememberDue"
          label="记到期"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="brwTime" label="借出日期">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="returnTime"
          label="应还日期"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="userName" label="操作员">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="remark" label="备注">
        </el-table-column>

        <el-table-column
          show-overflow-tooltip
          prop="date"
          label="操作"
          width="45"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="guihuan(scope.row)"
              >归还</el-button
            >
            <span style="color:#0079fe"> | </span>
            <el-button type="text" size="mini" @click="xujie(scope.row)"
              >续借</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div v-if="currentBottomMode === 'cxjg'">
        <el-table
          :data="readercxjgData"
          stripe
          style="width: 100%"
          height="315"
          v-loading="loadingCxjg"
        >
          <el-table-column prop="isbn" width="145" label="ISBN/ISSN">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbrqi" label="出版日期">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="price"
            label="价格"
            width="100"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dghao" label="订购号">
          </el-table-column>
          <el-table-column show-overflow-tooltip align="center" label="记到期">
            <template slot-scope="scope">
              <el-select
                filterable
                placeholder="请选择"
                v-model="scope.row.listID"
                size="mini"
                clearable
                v-if="scope.row.list"
              >
                <el-option
                  v-for="(item, index) in scope.row.list"
                  :key="index"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ghsj"
            label="操作"
            width="45"
          >
            <template slot-scope="scope">
              <el-button type="text" size="mini" @click="jiechu(scope.row)"
                >借出</el-button
              >
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
    </div>
    <!-- 罚款弹窗 -->
    <div class="overdue">
      <el-dialog title="超期罚款" :visible.sync="overTimeVisible">
        <div class="edit__content">
          <div class="tit">
            <span>图书信息</span>
          </div>
          <div class="user__info">
            <div class="info__column">
              <p>
                <span class="label">ISBN/ISSN</span
                ><span class="val">{{ overTimegData["isbn/issn"] }}</span>
              </p>
              <p>
                <span class="label">正题名</span
                ><span class="val"> {{ overTimegData.ztming }}</span>
              </p>
              <p>
                <span class="label">借出时间</span
                ><span class="val">{{
                  overTimegData.brwTime | splitDateTime
                }}</span>
              </p>
              <p>
                <span class="label">应还时间</span
                ><span class="val">{{
                  overTimegData.returnTime | splitDateTime
                }}</span>
              </p>

              <p>
                <span class="label">应罚金额</span
                ><span class="val">{{ overTimegData.overDueFine }}</span>
              </p>
              <p>
                <span class="label">超期时间</span
                ><span class="val">{{ overTimegData.overDueDays }}</span>
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
                <el-form-item prop="fine" label="实罚金额">
                  <el-input
                    clearable
                    size="mini"
                    v-model="overdue.fine"
                  ></el-input>
                </el-form-item>
                <el-form-item prop="remark" label="备注">
                  <el-input
                    clearable
                    size="mini"
                    v-model.trim="overdue.remark"
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
              <el-button size="mini" type="primary" @click="overdueSure"
                >确定</el-button
              >
              <el-button size="mini" @click="overdueCancel">取消</el-button>
            </div>
          </div>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import { getReaderData } from "api/circulation";
import {
  currentBrw,
  bookSelect,
  giveBack,
  borrow,
  rennew,
  fine
} from "api/feature";
import { userCzList } from "api/public";
import { IMG_URL } from "utils/base";

export default {
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
    this.literatureFilterOptions = [
      {
        value: "isbn",
        label: "ISSN/ISBN"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "flhao",
        label: "分类号"
      },
      {
        value: "zrsming",
        label: "责任者"
      },
      {
        value: "cbzhe",
        label: "出版社"
      },
      {
        value: "dghao",
        label: "订购号"
      }
    ];
    let moneyRules = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("实罚金额不能为空"));
      } else if (!/^\d+(\.\d{0,2})?$/.test(value)) {
        callback(new Error("实罚金额只能填整数或保留1~2位小数"));
      } else {
        callback();
      }
    };
    this.rules = {
      cangzhi: [{ required: true, message: "请选择藏址", trigger: "change" }],
      type: [{ required: true, message: "请选择图书类型", trigger: "change" }]
    };
    this.overdueRules = {
      fine: [
        { validator: moneyRules, trigger: "change" },
        { required: true, message: "请输入实罚金额", trigger: "blur" }
      ]
    };
    return {
      libId: this.$store.getters.userInfo.libId,
      cangzhiArr: [],
      typeArr: [
        {
          label: "期刊",
          value: "2"
        },
        {
          label: "图书",
          value: "1"
        }
      ],
      loadingDqjy: false,
      loadingCxjg: false,
      readerBarcode: "",
      refreshTime: "",
      IMG_URL: IMG_URL,
      readerData: {},
      readercurData: [],
      readercxjgData: [],
      listID: "",
      literatureForm: {
        literatureSearchKey: "",
        cangzhi: "",
        type: "1",
        beizhu: ""
      },
      reqObj: {},
      currentLiteratureFilterKey: "isbn",
      bottomTabs: [
        {
          value: "dqjy",
          label: "当前借阅"
        },
        {
          value: "cxjg",
          label: "查询结果"
        }
      ],
      currentBottomMode: "dqjy",
      overTimeVisible: false,
      overTimegData: {},
      isFineDisabled: false,
      isGetDisabled: false,
      isGetFDisabled: false,
      overdue: {
        isFine: false,
        isGet: true,
        isGetForegift: false,
        fine: "",
        remark: ""
      },

      // 分页器
      hisTotalCount: 0,
      hiscurrentPage: 1,
      hisPageSize: 15,
      timer: ""
    };
  },
  methods: {
    // 改变时间
    changeRefreshTime(value) {
      if (!value) {
        clearInterval(this.timer);
        return;
      }
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    getReader(value) {
      if (!this.readerBarcode) {
        this.$message.error("请输入读者证号");
        return false;
      }
      if (!this.refreshTime) {
        this.getReaderData(value);
      } else {
        if (this.timer) {
          clearInterval(this.timer);
        }
        this.timer = setInterval(() => {
          this.getReaderData(value);
        }, this.refreshTime);
      }
    },
    getReaderData(value) {
      // 读者信息
      getReaderData({ readerBarcode: value })
        .then(res => {
          this.$refs.literatureSearchKey.focus();
          this.duzheId = res.data.dzid;
          this.readerData = res.data;
          this.currentBrw(this.duzheId);
        })
        .catch(() => {
          this.$refs.readerInputRef.select();
          this.readerData = {};
          this.readercurData = [];
        });
    },
    currentBrw(value) {
      // 当前借阅列表
      this.loadingDqjy = true;
      currentBrw({ readerId: value })
        .then(res => {
          this.loadingDqjy = false;
          this.currentBottomMode = "dqjy";
          this.readercurData = res.data;
        })
        .catch(() => {
          this.loadingDqjy = false;
        });
    },
    bookInfo() {
      if (!this.readerBarcode) {
        this.$message.error("请先输入读者证号");
        this.$refs.readerInputRef.focus();
        return false;
      }
      this.currentBottomMode = "cxjg";
      this.hiscurrentPage = 1;

      this.searchbook();
    },
    searchbook() {
      this.setRequestObj();
      this.$refs["literatureForm"].validate(valid => {
        if (valid) {
          this.bookSelect();
        } else {
          return false;
        }
      });
    },
    setRequestObj() {
      this.reqObj = {
        bookType: this.literatureForm.type,
        czId: this.literatureForm.cangzhi,
        pageSize: this.hisPageSize,
        pageNumber: this.hiscurrentPage
      };
      this.reqObj[
        this.currentLiteratureFilterKey
      ] = this.literatureForm.literatureSearchKey;
    },
    // 书籍查询接口
    bookSelect() {
      this.loadingCxjg = true;
      let params = {
        ...this.reqObj
      };
      bookSelect(params)
        .then(res => {
          this.$refs.readerInputRef.select();
          this.loadingCxjg = false;
          this.currentBottomMode = "cxjg";
          this.readercxjgData = res.data.dataList;
          this.hisTotalCount = Number(res.data.totalElements);
          localStorage.setItem("lastType", this.literatureForm.type);
          localStorage.setItem("lastCangzhi", this.literatureForm.cangzhi);
        })
        .catch(() => {
          this.loadingCxjg = false;
          this.$refs.literatureSearchKey.select();
          this.readercxjgData = [];
          this.hisTotalCount = 0;
        });
    },
    // 获取上次藏址和类型
    getLastInfo() {
      if (
        localStorage.getItem("lastCangzhi") &&
        localStorage.getItem("lastType")
      ) {
        this.literatureForm.type = localStorage.getItem("lastType");
        this.literatureForm.cangzhi = localStorage.getItem("lastCangzhi");
      }
    },
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    guihuan(row) {
      giveBack({
        cirId: row.cirId
      }).then(res => {
        if (res.code == 0 && !res.data) {
          this.$message.success("归还成功");
          this.currentBrw(this.duzheId);
          this.$refs.readerInputRef.select();
        } else if (res.code == 0 && res.data) {
          this.$message.error("该书籍借阅超期,已进入超期罚款页面!");
          this.overTimeVisible = true;
          this.overdue.cirId = row.cirId;
          this.overTimegData = {
            ...res.data
          };
          this.overdue.fine = res.data.overDueFine;
        }
      });
    },
    // 超期罚款接口--确定按钮
    overdueSure() {
      this.$refs.overdue.validate(valid => {
        if (valid) {
          fine({
            cirId: this.overdue.cirId,
            isFine: this.overdue.isFine,
            isGet: this.overdue.isGet,
            isGetForegift: this.overdue.isGetForegift,
            fine: this.overdue.fine,
            remark: this.overdue.remark
          }).then(res => {
            if (res.code == 0) {
              this.$message.success("操作成功");
              this.overTimeVisible = false;
              this.currentBrw(this.duzheId);
            }
          });
        } else {
          return false;
        }
      });
    },
    overdueCancel() {
      this.overTimeVisible = false;
      this.$refs.overdue.resetFields();
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
    isGetChange(val) {
      if (val == true) {
        this.isGetFDisabled = false;
        this.overdue.isGetForegift = false;
      } else {
        this.isGetFDisabled = true;
        this.overdue.isGetForegift = false;
      }
    },
    isGetFChange() {},
    xujie(row) {
      rennew({
        cirId: row.cirId
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("续借成功");
          this.currentBrw(this.duzheId);
          this.$refs.readerInputRef.select();
        }
      });
    },
    jiechu(row) {
      borrow({
        readerId: this.duzheId,
        marcId: row.marcId,
        czId: this.literatureForm.cangzhi,
        rememberDue: row.listID
      }).then(res => {
        if (res.code == 0) {
          this.$message.success("借出成功");
          this.bookSelect();
          this.$refs.readerInputRef.select();
        }
      });
    },
    czList() {
      userCzList({ libId: this.libId }).then(res => {
        this.cangzhiArr = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
      });
    },
    handleHisSizeChange(val) {
      this.hisPageSize = val;
      this.searchbook();
    },
    handleHisCurrentChange(val) {
      this.hiscurrentPage = val;
      this.searchbook();
    }
  },
  activated() {
    this.czList();
    this.$refs.readerInputRef.focus();
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  mounted() {
    this.czList();
    this.$refs.readerInputRef.focus();
    this.getLastInfo();
  },
  destroyed() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  }
};
</script>
<style lang="less" scoped>
@import "~styles/circulation/circulation.less";
@import "~styles/commonContent.less";
.readerImg {
  margin: 5px 10px 0 10px;
}
.readingTitle,
.bookTitle {
  padding: 8.5px 0 !important;
}
.readerItem {
  padding-left: 10px;
}
.wxltjc {
  height: 100%;
}
/deep/ .avatar {
  img {
    width: 100%;
    height: 100%;
  }
}
.readerTop {
  display: block !important;
}
.cardSelect {
  display: block !important;
}
.custom__form {
  .item {
    justify-content: flex-start !important;
    margin-bottom: 5px !important;
    margin-left: 10px !important;
    &:nth-child(1) {
      margin-top: 10px;
    }
    .filterKey {
      margin-right: 0 !important;
      flex: 0 0 100px !important;
      /deep/ .el-input__inner {
        border-right: none;
        border-top-right-radius: 0;
        border-bottom-right-radius: 0;
      }
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
</style>
