<!--
 * @Description: 
 * @Autor: chenming.feng
 * @Date: 2019-11-22 09:34:14
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-05 11:07:26
 -->
<template>
  <div class="ygqd">
    <div class="readercard" style="width: 100%">
      <div class="readingTitle">义工信息</div>
      <div class="readerContent">
        <div class="readerTop">
          <div class="cardNumber">
            <span>读者证号:</span>
            <el-input
              clearable
              v-model="dzzhao"
              class="cardcontent"
              size="mini"
              style="width:180px;margin-right:20px;margin-left:15px"
              @keyup.enter.native="getReader(dzzhao)"
              @blur="addSetTimer"
              @focus="clearSetTimer"
              ref="readerInputRef"
            ></el-input>
            <span>签到地点：</span>
            <el-select
              filterable
              v-model="czId"
              size="mini"
              style="width:150px;padding-right:20px"
              ref="czId"
              clearable
            >
              <el-option
                v-for="item in cangzhiArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <span>页面刷新：</span>
            <el-select
              filterable
              v-model="refreshTime"
              size="mini"
              style="width:110px"
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
        <div class="readerMgs" style="padding: 10px;">
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
        <div class="readerWrap" style="padding: 10px;">
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
    <div class="qiandaoData">
      <div class="c-tab__header">
        <span class="header__item">签到数据</span>
      </div>
      <div class="data__table">
        <el-table
          :data="readeListData"
          stripe
          style="width: 100%"
          height="100%"
          v-loading="loadingReaderCur"
        >
          <el-table-column
            show-overflow-tooltip
            prop="sjsjian"
            label="签到时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xjsjian"
            label="签退时间"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName1"
            label="签到地点"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName2"
            label="签退地点"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="servertimeLength"
            label="服务时长"
            width="70"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username1"
            label="签到操作员"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username2"
            label="签退操作员"
            width="100"
          >
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__page">
      <td-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalElements"
        :currentPage="pageNumber"
        :pageSize="pageSize"
      ></td-pagination>
    </div>
  </div>
</template>

<script>
import { volunteerSignInOut, volunteerSignInOutData } from "api/feature";
import { userCzList } from "api/public";
import { IMG_URL } from "utils/base";
export default {
  name: "feature_ygqd",
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
      selectLibId: this.$store.getters.userInfo.libId,
      cangzhiArr: [],
      totalElements: 0,
      pageSize: 15,
      pageNumber: 1,
      loadingReaderCur: false,
      dzzhao: "",
      refreshTime: "",
      IMG_URL: IMG_URL,
      czId: "",
      timeDay: "",
      readerData: {},
      readeListData: [],
      timer: null,
      readerInputRefFocus: true
    };
  },
  activated() {
    this.czList();
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
    // 点进来就要光标指定读者证号
    this.readerInputRefFocus = true;
  },
  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  },
  mounted() {
    this.czList();
    // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
    this.$refs.readerInputRef.select();
    clearInterval(this.timer);
    this.timer = null;
    this.setTimer();
  },
  methods: {
    czList() {
      userCzList({
        libId: this.selectLibId
      }).then(res => {
        this.cangzhiArr = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
      });
    },
    // 义工签到列表
    getReader() {
      this.pageNumber = 1;
      this.setRequestObj();
      // 只有这里触发的要改变状态
      this.getInList(true);
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.getInList();
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getInList();
    },
    setRequestObj() {
      this.requestObj = {
        dzzhao: this.dzzhao,
        czId: this.czId
      };
    },
    getInList(needChangeStatus) {
      this.clearData();
      let requestObj = {
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
        czId: this.czId,
        ...this.requestObj
      };
      if (needChangeStatus) {
        volunteerSignInOut(requestObj)
          .then(res => {
            this.readerData = res.data;
            let { xjsjian, sjsjian } = res.data;
            if (sjsjian && !xjsjian) {
              this.$message.success(res.message);
            } else {
              this.$message.success(res.message);
            }
            this.$nextTick(() => {
              this.$refs.readerInputRef.select();
              this.readerInputRefFocus = false;
            });
          })
          .then(() => {
            volunteerSignInOutData(requestObj)
              .then(res => {
                this.readeListData = res.data.dataList;
                this.totalElements = Number(res.data.totalElements);
                this.$nextTick(() => {
                  this.$refs.readerInputRef.select();
                  this.readerInputRefFocus = false;
                });
              })
              .catch(() => {
                this.$refs.readerInputRef.select();
              });
          })
          .catch(() => {
            this.$refs.readerInputRef.select();
          });
      } else {
        volunteerSignInOutData(requestObj)
          .then(res => {
            this.readeListData = res.data.dataList;
            this.totalElements = Number(res.data.totalElements);
            this.$nextTick(() => {
              this.$refs.readerInputRef.select();
              this.readerInputRefFocus = false;
            });
          })
          .catch(() => {
            this.$refs.readerInputRef.select();
          });
      }
    },
    setTimer() {
      if (this.timer == null && this.refreshTime) {
        if (this.refreshTime) {
          this.timer = setInterval(() => {
            this.clearData();
            this.dzzhao = "";
          }, this.refreshTime);
        }
      }
    },
    clearData() {
      this.readeListData = [];
      this.readerData = {};
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
        this.dzzhao = "";
        this.czId = "";
      }, value);
    },
    clearSetTimer() {
      clearInterval(this.timer);
    },
    addSetTimer() {
      clearInterval(this.timer);
      this.timer = null;
      this.setTimer();
    }
  },
  destroyed() {
    clearInterval(this.timer);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/circulation/circulation.less";

.qiandaoData {
  margin-top: 10px;
  height: ~"calc(100% - 381px - 42px)" !important;
  min-height: 152px !important;
  border: 1px solid @borderColor;

  /deep/.el-tabs {
    height: 100%;
  }

  .c-tab__header {
    display: flex;
    height: 36px;
    align-items: center;
    background: @topBgColor;

    .header__item {
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding: 0 17px;
      font-size: @FSize_15;

      &.active {
        font-weight: bold;
        color: @primaryColor;
        background: @contentHdColor;
      }
    }
  }

  /deep/ tr th {
    background: @contentHdColor;
  }

  .returnTime {
    color: red;
  }

  .otherczStr {
    color: @primaryColor;
  }

  .data__table {
    height: ~"calc(100% - 36px)";
  }
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
</style>
