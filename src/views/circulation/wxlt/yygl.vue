<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-02 19:50:25
 -->
<template>
  <div class="yygl common__content_">
    <div class="content__header_title">
      <span>预约管理</span>
      <div class="tool">
        <el-button size="mini" type="primary" @click="yydjFunc">
          <icon-svg icon-class="icon-wenxianbianmu" />
          预约登记</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :disabled="selectRow.length ? false : true"
          @click="cancelYy"
        >
          <icon-svg icon-class="icon-btn-ico-3" />
          取消预约</el-button
        >
        <el-button size="mini" type="primary" @click="cqqlFunc">
          <icon-svg icon-class="icon-btn-ico-5" />
          过期清理</el-button
        >
        <el-button
          size="mini"
          type="primary"
          :loading="dstzLoading"
          :disabled="selectRow.length ? false : true"
          @click="dstzFunc"
        >
          <icon-svg icon-class="icon-btn-ico-6" />
          到书通知</el-button
        >
      </div>
    </div>
    <div class="content">
      <div class="toolbar">
        <label>成员馆：</label>
        <el-select filterable size="mini" class="libSelect" v-model="libId">
          <el-option
            v-for="item in libListSelect"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <label style="padding: 0">读者状态：</label>
        <el-select filterable size="mini" v-model="ztai" placeholder="请选择">
          <el-option
            v-for="item in ztaiList"
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
            v-model="flag"
          >
            <el-option
              v-for="item in flagList"
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
          <icon-svg icon-class="icon-btn-ico-2" />
          查询</el-button
        >
      </div>
      <div ref="multipleTableBox" class="multipleTableBox">
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-click="rowClick"
          @selection-change="selectFunc"
          border=""
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            align="center"
            width="35"
          ></el-table-column>
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yyshijian"
            label="预约日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dsshijian"
            label="到书日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="blshijian"
            label="保留日期"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="ztai" label="状态">
            <template slot-scope="scope">
              <div v-if="scope.row.ztai == '到书已取'" class="normal">
                <i></i>
                &nbsp;{{ scope.row.ztai }}
              </div>
              <div v-if="scope.row.ztai == '未到书'" class="logout">
                <i></i>
                &nbsp;{{ scope.row.ztai }}
              </div>
              <div v-if="scope.row.ztai == '超期未取'" class="overdue">
                <i></i>
                &nbsp;{{ scope.row.ztai }}
              </div>
              <div v-if="scope.row.ztai == '到书未取'" class="notyet">
                <i></i>
                &nbsp;{{ scope.row.ztai }}
              </div>
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
    <side-wrap v-show="yydjWrap" width="850px">
      <template v-slot:header>
        <el-button
          size="mini"
          class="close-side-wrap"
          @click="closeWrap"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">预约登记</p>
      </template>
      <div class="side-wrap-content">
        <p class="side-wrap-content-title">读者信息</p>
        <div>
          <label for="">读者证号：</label>
          <el-input
            size="mini"
            clearable
            v-model="yydjForm.dzzhao"
            @keyup.native.enter="getReader"
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
                {{ yydjForm.xming || "--" }}
              </label>
              <span
                :class="yydjForm.ztai != '正常' ? 'guashi' : ''"
                v-if="yydjForm.ztai"
                >{{ yydjForm.ztai }}</span
              >
            </div>
            <div class="reader-form-item">
              <label>联系方式</label>
              <span>{{ yydjForm.dianhua }}</span>
            </div>
            <div class="reader-form-item">
              <label>有效期</label>
              <span>{{ yydjForm.jzrqi }}</span>
            </div>
            <div class="reader-form-item">
              <label>证内金额</label>
              <span>{{ yydjForm.yajin }}</span>
            </div>
            <div class="reader-form-item">
              <label>成员馆</label>
              <span>{{ yydjForm.libName }}</span>
            </div>
            <div class="reader-form-item">
              <label>是否馆际读者</label>
              <span>{{ yydjForm.guanji ? "是" : "否" }}</span>
            </div>
            <div class="reader-form-item">
              <label>本馆已预约</label>
              <span>{{ yydjForm.bgyjyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>馆际已预约数</label>
              <span>{{ yydjForm.gjyjyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>本馆可预约</label>
              <span>{{ yydjForm.bgkyyyshu || 0 }}册</span>
            </div>
            <div class="reader-form-item">
              <label>馆际可预约数</label>
              <span>{{ yydjForm.gjkyyyshu || 0 }}册</span>
            </div>
          </div>
        </div>
        <p class="side-wrap-content-title">图书信息</p>
        <div>
          <div class="supplier-selection">
            <el-select
              filterable
              size="mini"
              class="el-select-supplier"
              v-model="bookFlag"
            >
              <el-option
                v-for="item in bookFlagList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              size="mini"
              clearable
              placeholder="请输入搜索关键词"
              class="supplier-key"
              v-model="bookContent"
              ref="bookContentInput"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (bookContent = val),
                  searchBook
                )
              "
              @keyup.native.enter="delayFunc(searchBook)"
            ></el-input>
          </div>
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-check"
            @click="searchBook"
            >确认</el-button
          >
        </div>
        <div class="book-info-card">
          <div class="bookTable" ref="bookTable">
            <el-table
              ref="book"
              :highlight-current-row="true"
              :data="yydjBook"
              @row-click="bookRowClick"
              border=""
              stripe
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                type="index"
                label=" "
                width="52"
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
                width="145"
                show-overflow-tooltip
                prop="isbn"
                label="ISBN"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jge"
                label="价格"
                width="87"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cygid0Name"
                label="财产馆"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztai"
                label="状态"
                width="45"
              ></el-table-column>
            </el-table>
          </div>
          <div class="book-content__pages">
            <td-pagination
              @size-change="getBookHandleSizeChange"
              @current-change="getBookHandleCurrentChange"
              :total="bookTotalCount"
              :current-page.sync="getBookParam.pageNumber"
              :page-size="getBookParam.pageSize"
              :pager-count="3"
            ></td-pagination>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button @click="closeWrap">取消</el-button>
          <el-button @click="yyFunc" type="primary">预约</el-button>
        </div>
      </template>
    </side-wrap>
    <el-dialog title="预约通知" :visible.sync="dialogVisible" width="600">
      <div class="info_tit">{{ info_tit }}</div>
      <span class="tit">失败列表</span>
      <el-table :data="yytzFailData" border style="width: 100%">
        <el-table-column width="35" type="index" label=" "> </el-table-column>
        <el-table-column show-overflow-tooltip prop="xming" label="姓名">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="reason" label="原因">
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false"
          >确 定</el-button
        >
        <el-button @click="dialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import userImg from "@/assets/user.jpg";

import {
  yyList,
  reader,
  book,
  yuyue,
  delYy,
  delBatchYy,
  orderMail
} from "api/circulation";

import { mapGetters } from "vuex";

import { BASE_URL } from "utils/base";

import dayjs from "dayjs";

import { YYGL_OPTIONS } from "utils/selectOptions";

export default {
  name: "cir_yygl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.bookFlagList = [
      { label: "正题名", value: 1 },
      { label: "条码", value: 2 },
      { label: "ISBN", value: 3 },
      { label: "责任者", value: 4 },
      { label: "索书号", value: 5 }
    ];
    this.ztaiList = [
      { label: "全部", value: "" },
      { label: "正常", value: "正常" },
      { label: "过期", value: "过期" },
      { label: "退证", value: "退证" },
      { label: "暂停", value: "暂停" },
      { label: "注销", value: "注销" },
      { label: "挂失", value: "挂失" }
    ];
    this.flagList = YYGL_OPTIONS;
    return {
      yydjWrap: false,
      libId: this.$store.getters.userInfo.libId,
      ztai: "",
      flag: 10,
      content: "",
      bookFlag: 1,
      bookContent: "",
      tableData: [],
      selectRow: [],
      loading: false,
      userImg: userImg,
      yydjForm: {
        dzzhao: "",
        xming: "",
        ztai: "",
        zjhma: "",
        jzrqi: "",
        shouji: "",
        yajin: "",
        bgyjyyshu: "",
        bgkyyyshu: "",
        gjyjyyshu: "",
        gjkyyyshu: "",
        libName: "",
        guanji: "",
        beizhu: ""
      },
      tiaoma: "",
      yydjBook: [],
      yydjBookParam: {},
      dialogVisible: false,
      yytzFailData: [],
      dstzLoading: false,
      info_tit: "",
      bookIndex: 0,
      getIndex: 0,
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      },
      getBookParam: {
        pageSize: 15,
        pageNumber: 1
      },
      bookTotalCount: 0
    };
  },
  methods: {
    /**获取预约列表 */
    getYyList() {
      this.loading = !this.loading;
      yyList(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },

    /**预约登记面板 */
    yydjFunc() {
      this.yydjWrap = true;
      setTimeout(() => {
        this.$refs.getReaderInput.focus();
      }, 500);
    },
    /**根据读者证号获取信息 */
    getReader() {
      reader({
        dzzhao: this.trim(this.yydjForm.dzzhao)
      }).then(res => {
        res.data.jzrqi = dayjs(res.data.jzrqi).format("YYYY-MM-DD");
        res.data.yajin = parseFloat(res.data.yajin).toFixed(2);
        if (res.data.picture) {
          this.userImg = BASE_URL + "/api/p/img/url?img=" + res.data.picture;
        } else {
          this.userImg = userImg;
        }
        this.yydjForm = { ...res.data };
        if (this.yydjForm.xming) {
          this.$refs.bookContentInput.focus();
        }
      });
    },
    /**根据条码获取书籍信息 */
    searchBook() {
      this.getBookParam.pageNumber = 1;
      this.getBookParam.flag = this.bookFlag;
      this.getBookParam.content = this.bookContent;
      this.yydjBookParam = {};
      this.getBook();
    },
    getBook() {
      book({
        ...this.getBookParam
      }).then(res => {
        this.yydjBook = [...res.data.dataList];
        this.bookTotalCount = Number(res.data.totalElements);
      });
    },

    search() {
      this.param.libId = this.libId;
      this.param.ztai = this.ztai;
      this.param.flag = this.flag;
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.param.pageNumber = 1;
      this.getYyList();
    },

    closeWrap() {
      this.yydjWrap = !this.yydjWrap;
      for (let key in this.yydjForm) {
        this.yydjForm[key] = "";
      }
      for (let key in this.yydjBook) {
        this.yydjBook[key] = "";
      }
      this.userImg = userImg;
      this.yydjBookParam = {};
      this.yydjBook = [];
      this.bookContent = "";
      this.bookTotalCount = 0;
      this.pageNumber = 1;
    },

    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    /** 取消预约*/
    cancelYy() {
      if (this.selectRow.length) {
        this.$confirm("确定要取消预约么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let yyids = "";
          this.selectRow.map(ele => {
            yyids += ele.yyid + ",";
          });
          delYy({
            yyids
          }).then(res => {
            if (res.code == 0) {
              this.pageNumber = 1;
              this.getYyList();
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
          message: "请选择操作项"
        });
      }
    },
    /**超期清理 */
    cqqlFunc() {
      this.$confirm("确定要超期清理么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        delBatchYy().then(res => {
          if (res.code == 0) {
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    /**去空 */
    trim(str) {
      return str.replace(/^\s+|\s+$/g, "");
    },
    /**点击行获取数据 */
    bookRowClick(row) {
      this.yydjBookParam = {
        ...row
      };
    },
    /**预约登记 */
    yyFunc() {
      if (!this.yydjForm.xming) {
        this.$message({
          type: "warning",
          message: "请输入读者证号/证件号，获取读者信息"
        });
        return;
      } else if (!this.yydjBookParam.sshid) {
        this.$message({
          type: "warning",
          message: "请选择图书(可进行查询获取)"
        });
        return;
      } else {
        yuyue({
          dzid: this.yydjForm.dzid,
          sshids: this.yydjBookParam.sshid,
          guanji: this.yydjForm.guanji,
          bgyjyyshu: this.yydjForm.bgyjyyshu,
          gjyjyyshu: this.yydjForm.gjyjyyshu,
          gjkyyyshu: this.yydjForm.gjkyyyshu,
          bgkyyyshu: this.yydjForm.bgkyyyshu
        }).then(res => {
          this.closeWrap();
          this.yydjWrap = false;
          this.param.pageNumber = 1;
          this.getYyList();
          this.$message({
            type: "success",
            message: res.message
          });
        });
      }
    },
    /**到书通知 */
    dstzFunc() {
      let yyids = [];
      this.selectRow.filter(ele => {
        yyids.push(ele.yyid);
      });
      this.dstzLoading = true;
      orderMail({
        yyids: yyids.join(",")
      })
        .then(res => {
          this.dstzLoading = false;
          if (res.data.fail) {
            this.info_tit = res.data.warning;
            this.yytzFailData = res.data.fail;
            this.dialogVisible = true;
          } else {
            this.$message.success(res.data.warning);
          }
        })
        .catch(() => {
          this.dstzLoading = false;
        });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getYyList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getYyList();
    },
    getBookHandleSizeChange(pageSize) {
      this.getBookParam.pageSize = pageSize;
      this.getBookParam.pageNumber = 1;
      this.getBook();
    },
    getBookHandleCurrentChange(pageNumber) {
      this.getBookParam.pageNumber = pageNumber;
      this.getBook();
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
.yygl {
  .side__wrapper {
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
    .el-scrollbar__view {
      height: 99%;
    }
    .side-wrap-content {
      height: 100%;
      padding: 0 20px;
      box-sizing: border-box;
      .side-wrap-content-title {
        font-family: "MicrosoftYaHei-Bold";
        font-size: @FSize_16 !important;
        color: @fontDarkerColor;
        font-weight: bold;
        line-height: 40px;
        margin: 0 !important;
      }
      .supplier-selection {
        display: inline-block;
        .el-select-supplier {
          width: 105px;
          margin: 0;
          .el-input {
            width: 100%;
          }
          .el-input__inner {
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            border-right: none;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
        .el-input.supplier-key {
          width: 225px;
          .el-input__inner {
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
            &:focus {
              border-color: #c0c4cc;
            }
          }
        }
      }
      .reader-info-card,
      .book-info-card {
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
                right: -16px;
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
                  content: " ";
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
        .book-title {
          color: @fontDarkColor;
          font-size: @FSize_20;
          font-weight: 600;
          line-height: 36px;
        }
        .book-info-item {
          width: 50%;
          display: inline-block;
          font-size: @FSize_16;
          line-height: 32px;
          span {
            font-weight: 600;
          }
        }
      }
      .book-info-card {
        height: calc(100% - 352px);
        .bookTable {
          height: 100%;
          overflow: auto;
          .el-table {
            &::before {
              background-color: transparent;
            }
          }
        }
        .book-content__pages {
          padding: 6px 0;
          border-top: 1px solid #e9edf0;
          .el-input--mini .el-input__inner {
            height: 28px;
            line-height: 28px;
          }
          .el-pagination__editor.el-input .el-input__inner {
            height: 28px;
          }
          .el-pagination .el-select .el-input {
            width: 100px;
          }
          .el-pagination__editor.el-input {
            width: 50px;
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
    padding-top: 10px;
    .info_tit {
      line-height: 32px;
      font-weight: bold;
    }
    .tit {
      line-height: 32px;
      font-weight: bold;
      color: @fontDarkerColor;
    }
  }
}
</style>
