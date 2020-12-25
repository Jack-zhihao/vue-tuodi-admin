<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-04 14:39:51
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
              clearable
              autofocus
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
            <el-button type="text" size="mini" @click="xujie(scope.row)"
              >续借</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
import { getReaderData } from "api/circulation";
import { currentBrw, rennew } from "api/feature";
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
    return {
      libId: this.$store.getters.userInfo.libId,
      loadingDqjy: false,
      readerBarcode: "",
      refreshTime: "",
      IMG_URL: IMG_URL,
      readerData: {},
      readercurData: [],

      bottomTabs: [
        {
          value: "dqjy",
          label: "当前借阅"
        }
      ],
      currentBottomMode: "dqjy",

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
          this.readercurData = res.data;
        })
        .catch(() => {
          this.loadingDqjy = false;
        });
    },

    // 底部tab
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },

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
    }
  },

  deactivated() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
  activated() {
    this.$refs.readerInputRef.focus();
  },
  mounted() {
    this.$refs.readerInputRef.focus();
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
.readerItem {
  padding-left: 10px;
}
.readingTitle {
  padding: 8.5px 0 !important;
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
      width: 110px;
    }
  }
}
</style>
