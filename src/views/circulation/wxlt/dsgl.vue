<!--
 * @Description: 丢失管理
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-03-01 09:27:44
 * @LastEditTime: 2020-03-04 10:23:50
 -->

<template>
  <div class="cir-dsgl common__content">
    <td-content-header>
      丢失管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowSearchSide"
            ><icon-svg icon-class="icon-btn-ico-" /> 丢失登记</el-button
          >
          <el-button
            :disabled="multipleLossBookSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteLossBook('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 丢失删除</el-button
          >
          <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <el-select
            filterable
            class="header__filters_type group__filters_type"
            size="mini"
            v-model="currentLossBookFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in lossBookFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filters_value"
            v-model="lossBookSearchKey"
            ref="focusInput"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (lossBookSearchKey = val),
                initLossBookList
              )
            "
            @keydown.enter.native="delayFunc(initLossBookList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initLossBookList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="lossBookTable">
        <el-table
          ref="lossTable"
          @row-click="lossBookClickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadLossBookData"
          @selection-change="handleLossBookSelectionChange"
          border
          :data="lossBookList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jcsj" label="借阅日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ghsj" label="归还日期">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fajin" label="罚金">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="jiaona" label="收款状态">
            <template slot-scope="scope">
              <span v-show="scope.row.payFlag == 2"
                ><span class="flag__icon flag__icon_success"></span>
                已收款</span
              >
              <span v-show="scope.row.payFlag == 1"
                ><span class="flag__icon flag__icon_err"></span> 未收款</span
              >
              <span v-show="scope.row.payFlag == 3"
                ><span class="flag__icon flag__icon"></span> 免罚</span
              >
              <span v-show="scope.row.payFlag == 4"
                ><span class="flag__icon flag__icon_back"></span> 已退款</span
              >
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="beizhu" label="备注">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="操作时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="username" label="操作员">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row"
                :index="scope.$index"
                :ops="['restore', 'modi', 'del']"
                @handleRestore="restoreLossBook"
                @handleModi="checkLossBookDetail"
                @handleDel="deleteLossBook"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLossBookSizeChange"
          @current-change="handleLossBookCurrentChange"
          :total="totalLossBookCount"
          :currentPage="currentLossBookPage"
          :pageSize="lossBookPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 丢失登记 -->
    <side-wrap
      class="dialog__add dialog__add_search common__side_form"
      v-if="showSearchSide"
      width="980px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              丢失登记
            </div>
          </div>
          <i class="el-icon-close" @click="showSearchSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <div class="tit">
          <span>读者信息</span>
        </div>
        <div class="user__filter">
          <span>读者证号：</span>
          <el-input
            ref="readerInput"
            size="mini"
            @keyup.enter.native="searchReaderInfo"
            clearable
            v-model="searchReaderId"
          ></el-input>
          <el-button @click="searchReaderInfo" type="primary" size="mini"
            ><icon-svg icon-class="icon-btn-ico-2" />确认</el-button
          >
        </div>
        <div class="user__info">
          <div class="avatar">
            <div
              v-show="!userInfo.picture"
              style="display:flex;align-items:center;justify-content: center;width:100%;height:100%;background:#DBE1E7;"
            >
              <span style="color:#919FAF;font-size:16px;">无图片</span>
            </div>
            <img
              v-show="userInfo.picture"
              :src="BASE_URL + 'api/p/img/url?img=' + userInfo.picture"
              alt=""
            />
          </div>
          <div class="info__column info__column_1">
            <p v-show="userInfo.ztai">
              <span class="user__name">{{ userInfo.xming }}</span>
              <span
                class="user__status"
                :class="{ success: userInfo.ztai === '正常' }"
                >{{ userInfo.ztai }}</span
              >
            </p>
            <p>
              <span class="label">有效期</span>：<span class="val">{{
                userInfo.jzrqi | splitDateTime
              }}</span>
            </p>
            <p>
              <span class="label">成员馆</span>：<span class="val">{{
                userInfo.libName
              }}</span>
            </p>
            <p>
              <span class="label">本馆已预约</span>：<span
                v-show="userInfo.bgyjyyshu"
                class="val"
                >{{ userInfo.bgyjyyshu }}册</span
              >
            </p>
            <p>
              <span class="label">本馆可预约</span>：<span
                v-show="userInfo.bgkyyyshu"
                class="val"
                >{{ userInfo.bgkyyyshu }} 册</span
              >
            </p>
          </div>
          <div class="info__column">
            <p>
              <span class="label">联系方式</span>：<span class="val">{{
                userInfo.shouji
              }}</span>
            </p>
            <p>
              <span class="label">证内金额</span>：<span class="val">{{
                userInfo.yajin
              }}</span>
            </p>
            <p>
              <span class="label">是否馆际读者</span>：<span
                v-show="userInfo.xming"
                class="val"
                >{{ userInfo.guanji ? "是" : "否" }}</span
              >
            </p>
            <p>
              <span class="label">馆际已预约数</span>：<span class="val">{{
                userInfo.gjyjyyshu
              }}</span>
            </p>
            <p>
              <span class="label">馆际可预约数</span>：<span class="val">{{
                userInfo.gjkyyyshu
              }}</span>
            </p>
          </div>
        </div>
        <div class="tit">
          <span>图书信息</span>
        </div>
        <el-table
          border
          ref="borrowBookTable"
          @row-click="borrowBookClickRow"
          highlight-current-row
          @current-change="handleBorrowBooksSelectionChange"
          :data="userBorrowBooks"
          v-loading="loadingBorrowBooks"
          stripe
          style="width: 100%"
        >
          <el-table-column show-overflow-tooltip label="条形码" prop="tiaoma">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="正题名"
            prop="ztming"
            min-width="115"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="所属馆"
            prop="libJiancheng"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="现藏址"
            prop="mingcheng"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="索书号" prop="sshao">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="卷册信息" prop="jcmshu">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="价格"
            width="87"
            prop="jge"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip label="借出日期" prop="jcsj">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="应还日期" prop="yhsj">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="续借" prop="xjcshu">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            label="状态"
            width="45"
            prop="ztai"
          >
          </el-table-column>
        </el-table>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              type="primary"
              :disabled="userLossBooksCheck.length !== 1"
              @click="handleLossBooksCheckClick"
              :loading="loadCheckConfirm"
              >登记</el-button
            >
            <el-button size="mini" @click="showSearchSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 确认登记信息 -->
    <el-dialog
      custom-class="check__dialog"
      title="确认登记信息"
      :visible.sync="showCheckConfirm"
    >
      <el-scrollbar>
        <div class="tit" v-show="checkConfirmInfo.loseFineMethod !== '本金'">
          <span>图书信息</span>
        </div>
        <div
          class="check__type"
          v-show="checkConfirmInfo.loseFineMethod !== '本金'"
        >
          <div class="item">
            <span class="label">条形码</span>：
            <span class="val">{{ checkConfirmInfo.tiaoma }}</span>
          </div>
          <div class="item">
            <span class="label">正题名</span>：
            <span class="val">{{ checkConfirmInfo.ztming }}</span>
          </div>
          <div class="item">
            <span class="label">借出时间</span>：
            <span class="val">{{ checkConfirmInfo.jcsj }}</span>
          </div>
          <div class="item">
            <span class="label">处罚费率</span>：
            <span class="val">{{ checkConfirmInfo.overDueFineOdds }}</span>
          </div>
          <div class="item">
            <span class="label">应还时间</span>：
            <span class="val">{{ checkConfirmInfo.yhsj }}</span>
          </div>
          <div class="item">
            <span class="label">应罚金额</span>：
            <span class="val">{{ checkConfirmInfo.overDueFine }}</span>
          </div>
          <div class="item">
            <span class="label">超期时间</span>：
            <span class="val">{{ checkConfirmInfo.overTime }}</span>
          </div>
        </div>
        <div class="tit">
          <span>丢失信息</span>
        </div>
        <div class="check__type">
          <div class="item">
            <span class="label">罚款类型</span>：
            <span class="val">{{ checkConfirmInfo.loseFineType }}</span>
          </div>
          <div class="item">
            <span class="label">书价</span>：
            <span class="val">{{ checkConfirmInfo.bookPrice }}</span>
          </div>
          <div class="item">
            <span class="label">罚款方式</span>：
            <span class="val">{{ checkConfirmInfo.loseFineMethod }}</span>
          </div>
          <div class="item">
            <span class="label">应罚金额</span>：
            <span class="val">{{ checkConfirmInfo.amountOfPenalty }}</span>
          </div>
          <div class="item">
            <span class="label">罚款赔率</span>：
            <span class="val">{{ checkConfirmInfo.loseFineOdds }}</span>
          </div>
        </div>
        <div class="tit">
          <span>确认信息</span>
        </div>
        <el-form
          class="check__form"
          ref="checkForm"
          label-width="135px"
          :model="checkForm"
          :rules="checkFormRules"
          size="mini"
        >
          <el-form-item class="item" prop="gather" label="是否立即收取">
            <el-radio-group v-model="checkForm.gather">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item class="item" prop="deduct" label="是否从押金中扣除">
            <el-radio-group v-model="checkForm.deduct">
              <el-radio :label="true">是</el-radio>
              <el-radio :label="false">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            class="item"
            prop="overDueFine"
            label="超期实罚金额"
            v-show="checkConfirmInfo.loseFineMethod !== '本金'"
          >
            <el-input
              v-only-num.float="checkForm.overDueFine"
              clearable
              v-model="checkForm.overDueFine"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" prop="bookPrice" label="书价实罚金额">
            <el-input
              v-only-num.float="checkForm.bookPrice"
              clearable
              v-model="checkForm.bookPrice"
            ></el-input>
          </el-form-item>
          <el-form-item class="item" label="总实罚金额">
            <span style="padding-left: 10px;">{{
              (+checkForm.overDueFine + +checkForm.bookPrice).toFixed(2)
            }}</span>
          </el-form-item>
          <el-form-item class="item" prop="beizhu" label="备注">
            <el-input
              clearable
              type="textarea"
              v-model="checkForm.beizhu"
            ></el-input>
          </el-form-item>
        </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button type="primary" size="mini" @click="submitForm('checkForm')"
            >确定</el-button
          >
          <el-button @click="showCheckConfirm = false">取 消</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 丢失修改 -->
    <side-wrap
      v-loading="loadLossBookDetail"
      class="dialog__add common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              丢失修改
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="editForm"
          ref="lossBookEditForm"
          label-width="80px"
          :model="lossBookEditForm"
          :rules="lossBookFormRules"
          size="mini"
        >
          <div class="form__type">
            <div class="tit">
              <span>缴纳信息</span>
            </div>
            <el-form-item class="item" prop="payFlag" label="收款状态">
              <el-select
                filterable
                v-model="lossBookEditForm.payFlag"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in receiptOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="fine" label="应罚金额">
              <el-input
                clearable
                v-only-num.float="lossBookEditForm.fine"
                v-model="lossBookEditForm.fine"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__textarea"
              prop="beizhu"
              label="备注"
            >
              <el-input
                clearable
                type="textarea"
                v-model="lossBookEditForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              :loading="savingEdit"
              @click="submitForm('lossBookEditForm')"
              type="primary"
              >确定</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  doclx3LoseList,
  doclx3LoseReader,
  doclx3LoseDel,
  doclx3LoseUpd,
  doclx3LoseRec,
  doclx3LoseConfirm,
  doclx3LoseAdd,
  loseListExcel
} from "api/circulation";
import { BASE_URL } from "utils/base";
import { downLoadExcel } from "utils/utils";
import { DSGL_OPTIONS } from "utils/selectOptions";
export default {
  name: "cir_dsgl",
  data() {
    this.BASE_URL = BASE_URL;
    this.lossBookFilterOptions = DSGL_OPTIONS;
    this.receiptOptions = [
      {
        value: "1",
        label: "未收款"
      },
      {
        value: "2",
        label: "已收款"
      },
      {
        value: "3",
        label: "免罚"
      },
      {
        value: "4",
        label: "已退款"
      }
    ];
    this.lossBookFormRules = {};
    this.checkFormRules = {
      overDueFine: [
        { required: true, message: "超期实罚金额不能为空", trigger: "blur" }
      ],
      bookPrice: [
        { required: true, message: "书价实罚金额不能为空", trigger: "blur" }
      ]
    };
    return {
      // 列表相关
      multipleLossBookSelection: [],
      loadLossBookData: false,
      lossBookList: [],
      lossBookSearchKey: "",
      currentLossBookFilterKey: "10",
      lossBookPageSize: 15,
      currentLossBookPage: 1,
      totalLossBookCount: 0,
      // 登记
      showSearchSide: false,
      searchReaderId: "",
      userInfo: {},
      userLossBooksCheck: [],
      userBorrowBooks: [],
      loadingBorrowBooks: false,
      showCheckConfirm: false,
      checkForm: {
        gather: true,
        deduct: true,
        overDueFine: 0,
        bookPrice: 0,
        beizhu: "",
        sumFine: 0
      },
      checkConfirmInfo: {},
      loadCheckConfirm: false,
      // 编辑
      loadLossBookDetail: false,
      showEditSide: false,
      savingEdit: false,
      lossBookEditForm: {}
    };
  },
  methods: {
    // 丢失恢复
    restoreLossBook(data) {
      doclx3LoseRec({
        loseId: data.wzid
      }).then(res => {
        this.$message.success(res.message);
        this.getLossBookList();
      });
    },
    // 丢失删除
    lossBookClickRow(row) {
      this.$refs.lossTable.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkLossBookDetail(row);
    },
    handleLossBookSelectionChange(val) {
      this.multipleLossBookSelection = val.map(item => item.wzid);
    },
    deleteLossBook(data) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadLossBookData = true;
          doclx3LoseDel({
            loseIds: data ? data.wzid : this.multipleLossBookSelection.join(",")
          })
            .then(res => {
              this.loadLossBookData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.initLossBookList();
            })
            .catch(() => {
              this.loadLossBookData = false;
            });
        })
        .catch(() => {});
    },
    // 丢失列表
    initLossBookList() {
      this.currentLossBookPage = 1;
      this.setRequestObj();
      this.getLossBookList();
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.currentLossBookFilterKey,
        content: this.lossBookSearchKey
      };
    },
    getLossBookList() {
      this.loadLossBookData = true;

      let requestObj = {
        pageNumber: this.currentLossBookPage,
        pageSize: this.lossBookPageSize,
        ...this.requestObj
      };

      doclx3LoseList(requestObj)
        .then(res => {
          this.loadLossBookData = false;
          this.lossBookList = res.data.dataList;
          this.totalLossBookCount = +res.data.totalElements;
        })
        .catch(() => {
          this.loadLossBookData = false;
        });
    },
    // 导出
    handleExport() {
      downLoadExcel(loseListExcel(), {
        ...this.requestObj
      });
    },
    handleLossBookSizeChange(val) {
      this.lossBookPageSize = val;
      this.getLossBookList();
    },
    handleLossBookCurrentChange(val) {
      this.currentLossBookPage = val;
      this.getLossBookList();
    },
    // 丢失详情/修改
    checkLossBookDetail(data) {
      this.currentLossBookData = data;
      this.showEditSide = true;
      this.getLossBookDetail(data);
    },
    getLossBookDetail(data) {
      this.lossBookEditForm = {
        payFlag: data.payFlag,
        fine: data.fajin,
        beizhu: data.beizhu
      };
    },
    handleLossBookFormEdit() {
      this.savingEdit = true;
      doclx3LoseUpd({
        loseId: this.currentLossBookData.wzid,
        payFlag: this.lossBookEditForm.payFlag,
        fine: this.lossBookEditForm.fine,
        beizhu: this.lossBookEditForm.beizhu
      })
        .then(res => {
          this.savingEdit = false;
          this.$message.success(res.message);
          this.showEditSide = false;
          this.getLossBookList();
        })
        .catch(() => {
          this.savingEdit = false;
        });
    },
    // 丢失登记
    handleShowSearchSide() {
      this.userInfo = {};
      this.searchReaderId = "";
      this.userBorrowBooks = [];
      this.showSearchSide = true;
      this.$nextTick(() => {
        this.$refs.readerInput.focus();
      });
    },
    searchReaderInfo() {
      if (this.searchReaderId === "") {
        this.$message("请输入读者证号");
        return;
      }
      this.loadingBorrowBooks = true;
      doclx3LoseReader({
        readerBarcode: this.searchReaderId
      })
        .then(res => {
          this.loadingBorrowBooks = false;
          this.userInfo = res.data.docLtReaderDto;
          this.userBorrowBooks = res.data.docLtCurrentBroDtos;
          if (this.userBorrowBooks.length) {
            this.$refs.borrowBookTable.setCurrentRow(this.userBorrowBooks[0]);
            let checkData = [];
            checkData.push(this.userBorrowBooks[0].dqjyid);
            // 单选
            this.userLossBooksCheck = checkData;
          } else {
            this.$refs.readerInput.focus();
          }
        })
        .catch(() => {
          this.loadingBorrowBooks = false;
        });
    },
    borrowBookClickRow(row) {
      this.$refs.borrowBookTable.toggleRowSelection(row);
    },
    handleBorrowBooksSelectionChange(val) {
      let checkData = [];
      checkData.push(val.dqjyid);
      // 单选
      this.userLossBooksCheck = checkData;
      // 多选
      // this.userLossBooksCheck = val.map(item => item.dqjyid);
    },
    handleLossBooksCheckClick() {
      this.loadCheckConfirm = true;
      doclx3LoseConfirm({
        dqjyid: this.userLossBooksCheck[0]
      })
        .then(res => {
          this.showCheckConfirm = true;
          this.loadCheckConfirm = false;
          this.checkConfirmInfo = res.data;
          this.checkForm.sumFine = res.data.sumFine; // 总实罚金额
          this.checkForm.overDueFine = res.data.overDueFine; // 超期实罚金额
          this.checkForm.bookPrice = res.data.amountOfPenalty; // bookPrice
        })
        .catch(() => {
          this.loadCheckConfirm = false;
        });
    },
    // 丢失登记确认
    handleCheckFormSubmit() {
      let requestObj = this.checkForm;
      requestObj.dqjyid = this.userLossBooksCheck[0];
      requestObj.overTime = this.checkConfirmInfo.overTime;
      requestObj.sumFine = (
        +requestObj.overDueFine + +requestObj.bookPrice
      ).toFixed(2);
      doclx3LoseAdd(requestObj).then(res => {
        this.$message.success(res.message);
        this.showCheckConfirm = false;
        this.searchReaderInfo();
        this.getLossBookList();
        this.resetForm("checkForm");
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "lossBookEditForm") {
        // 恢复原始数据
        this.lossBookEditForm = Object.assign({}, this.lossBookEditFormOrigin);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "checkForm") {
            this.handleCheckFormSubmit();
          }
          if (formName === "lossBookEditForm") {
            this.handleLossBookFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.getLossBookList();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.flag__icon {
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: @fontTintColor;
  &.flag__icon_success {
    background: @successColor;
  }
  &.flag__icon_err {
    background: @dangerColor;
  }
  &.flag__icon_back {
    background: @apologColor;
  }
}
.dialog__add_search {
  .user__filter {
    display: flex;
    height: 36px;
    margin: 26px 0;
    align-items: center;
    .el-input {
      width: 180px;
      margin-right: 10px;
    }
  }
  .user__info {
    display: flex;
    height: 154px;
    align-items: center;
    font-size: @FSize_16;
    margin-bottom: 46px;
    .avatar {
      width: 130px;
      height: 154px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
        vertical-align: bottom;
      }
    }
    .info__column {
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      flex-basis: 50%;
    }
    // .info__column_1 {
    //   flex: 1;
    // }
    .user__name {
      color: @fontDarkColor;
      font-weight: bold;
      font-size: @FSize_20;
    }
    .user__status {
      color: #fff;
      display: inline-block;
      padding: 5px 10px;
      border-radius: 4px;
      margin-left: 10px;
      line-height: 1;
      background: @dangerColor;
      &.success {
        background: @successColor;
      }
    }
    .label {
      width: 100px;
      display: inline-block;
      white-space: nowrap;
      text-align-last: justify;
    }
    .val {
      color: @fontDarkColor;
      font-weight: bold;
    }
  }
}
.editForm {
  .el-select,
  .el-input {
    width: 230px;
  }
  .el-form-item {
    margin-bottom: 18px;
  }
  /deep/ .el-form-item__label {
    white-space: nowrap;
    text-align-last: justify;
    position: relative;
    &:after {
      content: "：";
      position: absolute;
      right: 0px;
    }
  }
}
.check__dialog {
  .tit {
    font-size: @FSize_20;
    font-weight: bold;
    margin-bottom: 20px;
  }
  .check__type {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 27px;
    .item {
      flex: 0 0 50%;
      margin-bottom: 20px;
      display: flex;
      .label {
        width: 73px;
        white-space: nowrap;
        text-align-last: justify;
      }
      .val {
        color: @fontDarkColor;
        font-weight: bold;
      }
    }
  }
  .check__form {
    .el-input {
      width: 230px;
    }
    .el-form-item {
      margin-bottom: 18px;
    }
    /deep/ .el-form-item__label {
      white-space: nowrap;
      text-align-last: justify;
      position: relative;
      &:after {
        content: "：";
        position: absolute;
        right: 0px;
      }
    }
  }
}
/deep/ .el-dialog__body {
  height: 60vh;
}
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>
