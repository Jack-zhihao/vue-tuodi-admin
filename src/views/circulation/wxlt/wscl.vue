<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-26 10:27:24
 -->
<template>
  <div class="wscl common__content_">
    <div class="content__header_title">
      <span>污损处理</span>
      <div class="tool">
        <el-button size="mini" type="primary" @click="downLoadData"
          ><icon-svg icon-class="icon-daochu" /> 导出</el-button
        >
        <el-button size="mini" type="primary" @click="wsdj">
          <icon-svg icon-class="icon-wenxianbianmu" />污损登记
        </el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="selectRow.length ? false : true"
          @click="wsDel"
        >
          <icon-svg icon-class="icon-btn-ico-1" />污损删除
        </el-button>
      </div>
    </div>
    <div class="content">
      <div class="toolbar">
        <label for="">成员馆：</label>
        <el-select
          filterable
          size="mini"
          v-model="libid"
          placeholder="选择成员馆"
        >
          <el-option
            v-for="item in libListSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <label for="">收款状态：</label>
        <el-select
          filterable
          size="mini"
          v-model="status"
          placeholder="选择收款状态"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <div class="supplier-selection">
          <el-select
            filterable
            size="mini"
            class="el-select-supplier"
            v-model="optionKey"
          >
            <el-option
              v-for="item in optionList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="supplier-key"
            placeholder="请输入搜索关键词"
            v-model="content"
            ref="focusInput"
            @keyup.native="
              handleBarCodeScanner($event, val => (content = val), search)
            "
            @keyup.native.enter="delayFunc(search)"
          ></el-input>
        </div>
        <el-button size="mini" type="primary" @click="search">
          <icon-svg icon-class="icon-btn-ico-2" />查询
        </el-button>
      </div>
      <div ref="multipleTableBox" class="multipleTableBox">
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-click="rowClick"
          @selection-change="selectFunc"
          border
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            align="center"
            label=" "
            width="35"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xming"
            label="读者姓名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            width="145"
            label="ISBN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcsj"
            label="借阅日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ghsj"
            label="归还日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fajin"
            label="罚金"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="jiaona" label="收款状态">
            <template slot-scope="scope">
              <div v-if="scope.row.status === 2" class="normal">
                <i></i>&nbsp;已收款
              </div>
              <div v-if="scope.row.status === 1" class="logout">
                <i></i>&nbsp;未收款
              </div>
              <div v-if="scope.row.status === 3" class="mfa">
                <i></i>&nbsp;免罚
              </div>
              <div v-if="scope.row.status === 4" class="back">
                <i></i>&nbsp;已退款
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="操作员"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beizhu"
            label="污损说明"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="操作时间"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.wzid"
                :ops="['restore', 'del']"
                @handleRestore="handleRestore(scope.row.wzid)"
                @handleDel="handleDel(scope.row.wzid)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__pages">
      <td-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page.sync="param.pageNumber"
        :page-size="param.pageSize"
      ></td-pagination>
    </div>
    <side-wrap v-show="wsclWrap" width="850px">
      <template v-slot:header>
        <el-button
          class="close-side-wrap"
          @click="closeWrap"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">污损登记</p>
      </template>
      <div class="side-wrap-content">
        <p class="side-wrap-content-title">读者信息</p>
        <div>
          <label for="">读者证号：</label>
          <el-input
            size="mini"
            @keyup.native.enter="getReader"
            clearable
            v-model="dzzhao"
            ref="getReaderInput"
          ></el-input>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            @click="getReader"
            >确认</el-button
          >
        </div>
        <div class="reader-info-card">
          <div class="reader-face">
            <img :src="userImg" />
          </div>
          <div class="reader-form">
            <div class="reader-form-item reader-state-item">
              <label>
                {{ wsData.xming || "--" }}
                <!-- <i class="el-icon-edit"></i> -->
              </label>
              <span
                :class="wsData.ztai != '正常' ? 'guashi' : ''"
                v-if="wsData.ztai"
                >{{ wsData.ztai }}</span
              >
            </div>
            <div class="reader-form-item">
              <label>联系方式</label>
              <span>{{ wsData.dianhua || "-" }}</span>
            </div>
            <div class="reader-form-item">
              <label>有效期</label>
              <span>{{ wsData.jzrqi }}</span>
            </div>
            <div class="reader-form-item">
              <label>证内金额</label>
              <span>{{ wsData.yajin }}</span>
            </div>
            <div class="reader-form-item">
              <label>成员馆</label>
              <span>{{ wsData.libName }}</span>
            </div>
            <div class="reader-form-item">
              <label>是否馆际读者</label>
              <span>{{ wsData.guanji ? "是" : "否" }}</span>
            </div>
            <div class="reader-form-item">
              <label>本馆已预约</label>
              <span>{{ wsData.bgyjyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>馆际已预约数</label>
              <span>{{ wsData.gjyjyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>本馆可预约</label>
              <span>{{ wsData.bgkyyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>馆际可预约数</label>
              <span>{{ wsData.gjkyyyshu || 0 }}册</span>
            </div>
          </div>
        </div>
        <p class="side-wrap-content-title">图书信息</p>
        <div class="book-info-card">
          <el-table
            ref="bookTable"
            :data="wsData.borrowList"
            border=""
            stripe
            style="width: 100%"
            highlight-current-row
            @row-click="selectBookFunc"
          >
            <el-table-column
              show-overflow-tooltip
              prop="tiaoma"
              label="条形码"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztming"
              min-width="115"
              label="正题名"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libMingcheng"
              label="所属馆"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="mingcheng"
              label="现藏址"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="sshao"
              label="索书号"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jcmshu"
              label="卷册信息"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="bookMoney"
              label="价格"
              width="87"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jcsj"
              label="借出日期"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="yhsj"
              label="应还日期"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="xjcshu"
              label="续借"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztai"
              label="状态"
              width="45"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button @click="closeWrap">取消</el-button>
          <el-button @click="djiFunc" type="primary">登记</el-button>
        </div>
      </template>
    </side-wrap>
    <el-dialog
      title="确认登记信息"
      :visible.sync="dialogVisible"
      width="600px"
      :before-close="handleClose"
    >
      <p
        v-if="dshiData.wsfkfshi === '本金+超期罚金'"
        class="el-dialog-content-title"
      >
        图书信息
      </p>
      <div
        v-if="dshiData.wsfkfshi === '本金+超期罚金'"
        class="el-dialog-content"
      >
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">条形码</label>
          <span class="el-dialog-content-item-text">{{ dshiData.tiaoma }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">正题名</label>
          <span class="el-dialog-content-item-text">{{ dshiData.ztming }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">借出时间</label>
          <span class="el-dialog-content-item-text">{{ dshiData.jcsj }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">处罚赔率</label>
          <span class="el-dialog-content-item-text">
            {{ dshiData.overDueFineOdds }}
          </span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">应还时间</label>
          <span class="el-dialog-content-item-text">{{ dshiData.yhsj }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">应罚金额</label>
          <span class="el-dialog-content-item-text">
            {{ dshiData.overDueFine }}
          </span>
        </div>
        <div v-if="dshiData.overTime" class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">超期时间</label>
          <span class="el-dialog-content-item-text">
            {{ dshiData.overTime }}
          </span>
        </div>
      </div>
      <p class="el-dialog-content-title">污损信息</p>
      <div class="el-dialog-content">
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">罚款类型</label>
          <span>{{ dshiData.wsfklxing }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">书价</label>
          <span>{{ dshiData.bookMoney }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">罚款方式</label>
          <span>{{ dshiData.wsfkfshi }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">应罚金额</label>
          <span>{{ dshiData.yfje }}</span>
        </div>
        <div class="el-dialog-content-item">
          <label class="el-dialog-content-item-label">罚款赔率</label>
          <span>{{ dshiData.wsfkpeilv }}</span>
        </div>
      </div>
      <p class="el-dialog-content-title">确认信息</p>
      <div class="el-dialog-content">
        <div class="el-dialog-content-item el-dialog-content-info">
          <label class="el-dialog-content-item-label content-info-label"
            >是否立即收</label
          >
          <el-radio-group v-model="dshiData.lksq">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </div>
        <div
          v-if="dshiData.lksq"
          class="el-dialog-content-item el-dialog-content-info"
        >
          <label class="el-dialog-content-item-label content-info-label"
            >是否从押金中扣除</label
          >
          <el-radio-group v-model="dshiData.cyjzkc">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
          </el-radio-group>
        </div>
        <div
          v-if="dshiData.wsfkfshi === '本金+超期罚金'"
          class="el-dialog-content-item el-dialog-content-info"
        >
          <label class="el-dialog-content-item-label content-info-label"
            >超期实罚金额</label
          >
          <el-input
            size="mini"
            clearable
            v-model="dshiData.cqsfje"
            v-only-num.float="dshiData.cqsfje"
            @keyup.native="linkMoney"
          ></el-input>
        </div>
        <div class="el-dialog-content-item el-dialog-content-info">
          <label class="el-dialog-content-item-label content-info-label"
            >书价实罚金额</label
          >
          <el-input
            size="mini"
            clearable
            v-model="dshiData.yfje2"
            v-only-num.float="dshiData.yfje2"
            @keyup.native="linkMoney"
          ></el-input>
        </div>
        <div class="el-dialog-content-item el-dialog-content-info">
          <label class="el-dialog-content-item-label content-info-label"
            >总实罚金额</label
          >
          <span>{{ dshiData.sjsfjw }}</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="confrim">确 定</el-button>
        <el-button size="mini" @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { hbList } from "api/public";

import { czDel } from "api/setting";

import { downLoadExcel } from "utils/utils";

import {
  wuSunList,
  wuSunFindReader,
  wuSunLoseMessage,
  wuSunRegister,
  wuSunDel,
  HuiFu,
  reader,
  exportWuSunExportExcel
} from "api/circulation";

import { mapGetters } from "vuex";

import userImg from "assets/user.jpg";

import { BASE_URL } from "utils/base";

import { WSCL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_wscl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.statusOptions = [
      {
        label: "全部",
        value: ""
      },
      {
        label: "未收款",
        value: "1"
      },
      {
        label: "已收款",
        value: "2"
      },
      {
        label: "免罚",
        value: "3"
      },
      {
        label: "已退款",
        value: "4"
      }
    ];

    this.optionList = WSCL_OPTIONS;
    return {
      status: "",
      wsclWrap: false,
      libid: this.$store.getters.userInfo.libId,
      optionKey: "isbn",
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      userImg: userImg,
      dzzhao: "",
      wsData: {
        dzzhao: "",
        libName: "",
        libid: "",
        xming: "",
        bzrqi: "",
        csrqi: "",
        jzrqi: "",
        bgkyyyshu: "",
        bgyjyyshu: "",
        gjyjyyshu: "",
        gjkyyyshu: "",
        yajin: "",
        guanji: false,
        borrowList: []
      },
      dialogVisible: false,
      selectBook: {},
      dshiData: {
        lksq: false,
        cyjzkc: false,
        sjsfjw: "",
        chaoqi: false,
        dqjyid: "",
        wsfklxing: "",
        wsfkfshi: "",
        wsfkpeilv: "",
        bookMoney: "",
        yfje: "",
        dzid: "",
        overTime: "",
        overDueFine: "",
        overDueFineOdds: "",
        ztming: "",
        tiaoma: "",
        yhsj: "",
        jcsj: "",
        cqsfje: "",
        yfje2: ""
      },
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取污损列表 */
    getWuSunList() {
      this.loading = true;
      wuSunList(this.param)
        .then(res => {
          this.loading = false;
          this.totalCount = +res.data.totalElements;
          this.tableData = res.data.dataList;
        })
        .catch(() => {
          this.loading = false;
        });
    },

    multDel() {
      let czid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            czid += ele.czid + ",";
          });
          czDel({
            czid
          }).then(res => {
            if (res.code == 0) {
              this.selectRow = [];
              this.param.pageNumber = 1;
              this.getWuSunList();
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "未选择操作项!"
        });
      }
    },
    downLoadData() {
      downLoadExcel(exportWuSunExportExcel(), {
        ...this.param,
        func_name_us: "wusunList"
      });
    },
    search() {
      this.optionList.map(ele => {
        this.param[ele.value] = "";
      });
      this.param.libid = this.libid;
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.pageNumber = 1;
      this.param.status = this.status;
      this.getWuSunList();
    },
    closeWrap() {
      this.wsclWrap = false;
      this.userImg = userImg;
      this.dzzhao = "";
      for (const key in this.wsData) {
        this.wsData[key] = "";
      }
      this.userImg = userImg;
      this.wsData.borrowList = [];
      this.selectBook = {};
    },
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    /**污损登记 */
    wsdj() {
      this.wsclWrap = true;
      setTimeout(() => {
        this.$refs.getReaderInput.focus();
      }, 500);
    },
    /** 污损删除*/
    wsDel() {
      let wzid = "";
      this.selectRow.map(ele => {
        wzid += ele.wzid + ",";
      });
      wuSunDel({
        wzid
      }).then(res => {
        this.selectRow = [];
        this.getWuSunList();
        this.$message({
          type: "success",
          message: res.message
        });
      });
    },
    /**登记操作 */
    djiFunc() {
      if (!this.selectBook.dqjyid) {
        this.$message({
          type: "warning",
          message: "请选择操作项"
        });
        return;
      } else {
        wuSunLoseMessage({
          dqjyid: this.selectBook.dqjyid,
          tiaoma: this.selectBook.tiaoma
        }).then(res => {
          this.dialogVisible = true;
          for (let key in res.data) {
            this.dshiData[key] = res.data[key];
          }
          res.data.overDueFine = parseFloat(res.data.overDueFine).toFixed(2);
          res.data.yfje = parseFloat(res.data.yfje).toFixed(2);
          res.data.overDueFine = parseFloat(res.data.overDueFine).toFixed(2);
          this.dshiData.cqsfje = res.data.overDueFine;
          this.dshiData.yfje2 = res.data.yfje;
          if (this.dshiData.wsfkfshi === "本金") {
            this.dshiData.sjsfjw = Number(res.data.yfje);
            this.dshiData.overTime = false;
          } else {
            this.dshiData.sjsfjw =
              Number(res.data.yfje) + Number(res.data.overDueFine);
          }
          this.dshiData.sjsfjw = parseFloat(this.dshiData.sjsfjw).toFixed(2);
        });
      }
    },
    //超期实罚金额联动
    linkMoney() {
      this.dshiData.sjsfjw =
        Number(this.dshiData.cqsfje) + Number(this.dshiData.yfje2);
      this.dshiData.sjsfjw = this.dshiData.sjsfjw.toFixed(2);
    },
    /**查找读者 */
    getReader() {
      wuSunFindReader({
        dzzhao: this.dzzhao
      }).then(res => {
        this.wsData["borrowList"] = res.data.borrowList;
        reader({
          dzzhao: this.dzzhao
        }).then(res => {
          if (res.data.picture) {
            this.userImg = BASE_URL + "/api/p/img/url?img=" + res.data.picture;
          } else {
            this.userImg = userImg;
          }
          Object.keys(res.data).filter(key => {
            this.wsData[key] = res.data[key];
          });
          if (this.wsData.borrowList.length) {
            this.$refs.bookTable.setCurrentRow(this.wsData.borrowList[0]);
            this.selectBook = { ...this.wsData.borrowList[0] };
          } else {
            this.$refs.getReaderInput.focus();
          }
          hbList({
            libId: this.$store.getters.userInfo.libId
          }).then(res => {
            res.data.filter(hbEle => {
              this.wsData.borrowList.filter(bookEle => {
                bookEle.bookMoney = bookEle.bookMoney.replace(hbEle.hbcode, "");
              });
            });
          });
        });
      });
    },
    handleClose() {
      this.dialogVisible = false;
    },
    confrim() {
      wuSunRegister({
        ...this.dshiData
      }).then(res => {
        if (res.code == 0) {
          this.getReader();
          this.dialogVisible = false;
          this.param.pageNumber = 1;
          this.getWuSunList();
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },

    selectBookFunc(row) {
      this.selectBook = { ...row };
    },
    handleRestore(wzid) {
      HuiFu({
        wzid
      }).then(res => {
        this.getWuSunList();
        this.$message({
          type: "success",
          message: res.message
        });
      });
    },
    handleDel(wzid) {
      wuSunDel({
        wzid
      }).then(res => {
        this.getWuSunList();
        this.$message({
          type: "success",
          message: res.message
        });
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.getWuSunList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getWuSunList();
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>

<style lang="less">
.wscl {
  .side__wrapper {
    .side__header {
      position: relative;
    }
    .el-tabs--border-card {
      border: none;
      .el-tabs__header {
        border: none;
        background-color: @topBgColor;
        .el-tabs__item {
          height: 50px;
          line-height: 50px;
        }
        .el-tabs__item.is-active {
          color: @primaryColor;
          font-size: @FSize_16;
          font-weight: bold;
          border: none;
        }
      }
    }
    .side-wrap-content {
      padding: 0 20px;
      box-sizing: border-box;
      .side-wrap-content-title {
        font-family: "MicrosoftYaHei-Bold";
        font-size: @FSize_16 !important;
        color: @fontDarkerColor;
        font-weight: bold;
        line-height: 40px;
        margin-top: 0 !important;
      }
      .reader-info-card {
        padding-top: 10px;
        box-sizing: border-box;
        .reader-face {
          display: inline-block;
          width: 110px;
          height: 154px;
          background: #515355;
          margin-right: 20px;
          img {
            width: 100%;
            height: 100%;
          }
        }
        .reader-form {
          display: inline-block;
          width: calc(100% - 130px);
          vertical-align: top;
          .reader-form-item {
            display: inline-block;
            width: 50%;
            line-height: 32px;
            font-size: @FSize_16;
            color: @fontBaseColor;
            label {
              display: inline-block;
              width: 100px;
              text-align: right;
              white-space: nowrap;
              text-align-last: justify;
              position: relative;
              margin-right: 12px;
              padding-right: 2px;
              text-indent: 0.5em;
              &:after {
                content: "：";
                position: absolute;
                right: -11px;
              }
            }
            span {
              font-weight: 600;
            }
            &.reader-state-item {
              label {
                width: auto;
                font-size: @FSize_20;
                color: @fontDarkColor;
                font-weight: 600;
                vertical-align: top;
                &::after {
                  content: "";
                }
              }
              span {
                background-color: @successColor;
                padding: 3px 12px;
                border-radius: 4px;
                color: @fontWhiteColor;
                font-weight: 600;
                &.guashi {
                  background-color: @dangerColor;
                }
              }
            }
            &:nth-child(2n) {
              padding-left: 80px;
              box-sizing: border-box;
            }
          }
        }
      }

      .el-input {
        width: 180px;
        margin-right: 10px;
      }
    }
    .side-wrap-footer {
      padding: 10px 0;
      border-top: 1px solid @tableBorderColor;
      .el-button {
        float: right;
        padding: 8px 30px;
        margin-left: 10px;
      }
    }
  }
  .el-dialog__body {
    padding: 0 20px;
    height: auto;
    .el-dialog-content-title {
      font-size: @FSize_16;
      color: @fontDarkerColor;
      font-weight: bold;
      line-height: 40px;
    }
    .el-dialog-content-item {
      display: inline-block;
      width: 50%;
      line-height: 36px;
      .el-dialog-content-item-label {
        display: inline-block;
        width: 80px;
        text-align: right;
        white-space: nowrap;
        text-align-last: justify;
        position: relative;
        margin-right: 12px;
        padding-right: 2px;
        text-indent: 0.5em;
        font-size: @FSize_16;
        color: @fontBaseColor;
        &:after {
          content: "：";
          position: absolute;
          right: -11px;
        }
      }
      span {
        font-weight: bold;
        font-size: @FSize_16;
        color: @fontBaseColor;
        &.el-dialog-content-item-text {
          display: inline-block;
          vertical-align: top;
          width: 170px;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }
      }
      .el-input {
        width: 180px;
      }
      &.el-dialog-content-info {
        width: 100%;
        .content-info-label {
          width: 140px;
        }
      }
    }
  }
  .cell {
    i {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 8px;
    }
    .normal {
      i {
        background-color: @successColor;
      }
    }
    .logout {
      i {
        background-color: @dangerColor;
      }
    }
    .mfa {
      i {
        background-color: @grayColor;
      }
    }
    .back {
      i {
        background-color: @apologColor;
      }
    }
  }
}
</style>
