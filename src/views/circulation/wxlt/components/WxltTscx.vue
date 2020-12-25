<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-07 16:39:55
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
              @keyup.enter.native="getBookInfo(bookBarcode)"
              ref="bookInputRef"
            ></el-input>
            <el-button
              type="primary"
              size="mini"
              style="margin-right:20px"
              @click="getBookInfo(bookBarcode)"
            >
              <icon-svg icon-class="icon-btn-ico-2" />
              确认</el-button
            >
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
      <el-scrollbar>
        <el-table
          key="tslsjy"
          height="293"
          :data="jyData"
          stripe
          border
          style="width: 100%"
          v-if="currentBottomMode === 'tslsjy'"
          v-loading="loadingJueY"
        >
          <el-table-column type="index" width="80" prop="tiaoma" label=" ">
          </el-table-column>
          <el-table-column
            prop="readerBarcode"
            label="读者证号"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerName"
            label="读者姓名"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerType"
            label="读者类型"
            width="70"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerWork"
            label="读者单位"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerBroBookTime"
            label="借出日期"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerCanRetBookTime"
            label="应还日期"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="readerRetBookTime"
            label="还书日期"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column prop="bookStatus" label="类型" show-overflow-tooltip>
          </el-table-column>
        </el-table>

        <el-table
          key="dmbj"
          :data="guanCData"
          stripe
          border
          style="width: 100%"
          height="293"
          v-loading="loadingGuanc"
          v-if="currentBottomMode === 'bggc'"
        >
          <el-table-column prop="tiaoma" width="161" label="条形码">
          </el-table-column>
          <el-table-column prop="sshao" label="索书号" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="ztai"
            label="状态"
            width="45"
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
            prop="jge"
            label="价格"
            width="120"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="mingcheng"
            label="现藏址"
            show-overflow-tooltip
          >
          </el-table-column>
        </el-table>
      </el-scrollbar>
      <div class="content__page" v-if="currentBottomMode === 'tslsjy'">
        <td-pagination
          @size-change="handleSizeChange_jy"
          @current-change="handleCurrentChange_jy"
          :total="TotalCount_jy"
          :currentPage="currentPage_jy"
          :pageSize="PageSize_jy"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getReturnBooks,
  getReaderData,
  bookHistoryBro,
  getOtherczData
} from "api/circulation";
import { IMG_URL } from "utils/base";
export default {
  data() {
    return {
      loadingGuanc: false,
      loadingJueY: false,
      bookBarcode: "",
      jyData: [],
      bookData: {},
      readerData: {},
      guanCData: [],
      IMG_URL: IMG_URL,
      bottomTabs: [
        {
          value: "tslsjy",
          label: "图书历史借阅"
        },
        {
          value: "bggc",
          label: "本馆馆藏"
        }
      ],
      shuceid: "",
      currentBottomMode: "tslsjy",
      TotalCount_jy: 0,
      currentPage_jy: 1,
      PageSize_jy: 10
      // TotalCount_gc: 0,
      // currentPage_gc: 1,
      // PageSize_gc: 15
    };
  },
  mounted() {
    this.$refs.bookInputRef.focus();
  },
  activated() {
    this.$refs.bookInputRef.focus();
  },
  methods: {
    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 查询图书状态
    getBookInfo() {
      if (this.bookBarcode === "") {
        this.$message.error("请输入条形码！");
        return false;
      }
      this.getReturnBooks();
    },
    // 查询读者信息
    getReaderData(readerBarcode, dzId) {
      getReaderData({
        readerBarcode: readerBarcode,
        dzId: dzId || ""
      }).then(res => {
        this.readerData = res.data;
      });
    },
    // 图书历史借阅
    bookHistoryBro(shuceid) {
      this.loadingJueY = true;
      bookHistoryBro({
        shuceId: shuceid,
        pageNumber: this.currentPage_jy,
        pageSize: this.PageSize_jy
      })
        .then(res => {
          this.loadingJueY = false;
          this.jyData = res.data.dataList;
          this.TotalCount_jy = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadingJueY = false;
        });
    },
    // 本馆馆藏
    getOtherczData(libid, tiaoma, isbn) {
      this.loadingGuanc = true;
      getOtherczData({
        libid,
        tiaoma,
        isbn
      })
        .then(res => {
          this.loadingGuanc = false;
          this.guanCData = res.data;
          // this.TotalCount_gc = Number(res.data.totalElements);
          let inLib = 0;
          res.data.forEach(item => {
            if (item.ztai === "在馆") {
              inLib++;
            }
          });
          this.bottomTabs[1].label = `${this.bookData.ztming}（${inLib}/${
            res.data.length
          }）`;
        })
        .catch(() => {
          this.loadingGuanc = false;
          this.bottomTabs[2].label = `${this.bookData.ztming}(0/0)`;
        });
    },
    getReturnBooks() {
      getReturnBooks({
        bookBarcode: this.bookBarcode
      })
        .then(res => {
          // 数据加载后全选输入框
          this.$refs.bookInputRef.select();
          this.currentBottomMode = "tslsjy";
          this.bookData = res.data;
          // 图书历史借阅列表
          this.bookHistoryBro(res.data.shuceid);
          this.shuceid = res.data.shuceid;
          // 本馆馆藏接口
          this.getOtherczData(res.data.cygid0, res.data.tiaoma, res.data.isbn);

          if (res.data.ztai === "在馆") {
            this.$message.success("文献未借出");
            this.readerData = {};
          } else if (res.data.ztai === "借出") {
            this.$message.error("文献已借出");
            this.getReaderData(res.data.readerBarcode, res.data.dzid);
          }
        })
        .catch(() => {
          this.readerData = {};
          this.bookData = {};
          this.guanCData = [];
          this.jyData = [];
          this.bottomTabs[1].label = "本馆馆藏";
          this.$refs.bookInputRef.select();
        });
    },
    // handleSizeChange_gc() {},
    // handleCurrentChange_gc() {},
    handleSizeChange_jy(val) {
      this.PageSize_jy = val;
      this.bookHistoryBro(this.shuceid);
    },
    handleCurrentChange_jy(val) {
      this.currentPage_jy = val;
      this.bookHistoryBro(this.shuceid);
    }
  }
};
</script>
<style lang="less" scoped>
.wxltgh {
  min-width: 890px;
  height: 100%;
  .edit__footer {
    display: flex;
    // height: 76px;
    align-items: center;
    justify-content: space-between;
    .el-button {
      padding: 10px 40px;
    }
  }
}
@import "~styles/circulation/circulation.less";
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
/deep/.el-scrollbar__wrap {
  margin-bottom: 0px !important;
}
</style>
