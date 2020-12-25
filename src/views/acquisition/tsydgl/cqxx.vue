<template>
  <div class="acq_cqxx">
    <div class="common__content">
      <td-content-header>
        <span>部分未到馆</span>
        <span style="font-weight: 400">{{ `【预订单：${yddhao}】` }}</span>
        <template v-slot:btns>
          <div class="header__ops">
            <el-button size="mini" type="primary" @click="print">
              <icon-svg icon-class="icon-daochu" /> 导出
            </el-button>
          </div>
        </template>
      </td-content-header>
      <!-- 列表内容 -->
      <div class="content">
        <div class="content__table" ref="literatureTable">
          <el-table
            v-loading="loadPartNoArriveData"
            border=""
            :data="yesYshouList"
            stripe
            style="width: 100%"
            height="100%"
          >
            <el-table-column
              type="index"
              label=" "
              align="center"
              width="35"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="gysName"
              label="供应商"
            >
              <template slot-scope="scope">
                <span
                  @click="handleDirectDetailPage(scope.row)"
                  class="g-row__check"
                  >{{ scope.row.gysName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydpcCode"
              label="预订批号"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydTime"
              label="预订日期"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztming"
              min-width="115"
              label="正题名"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="isbn"
              label="ISBN"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zrsming"
              label="责任者"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="cbzhe"
              label="出版社"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydcshu"
              label="预订册数"
              width="70"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="wdcshu"
              label="未到册数"
              width="70"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jge"
              label="价格"
              width="87"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zjia"
              label="总价"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
    <div class="common__content">
      <td-content-header>
        <span>全部未到馆书目</span>
      </td-content-header>
      <!-- 列表内容 -->
      <div class="content">
        <div class="content__table" ref="literatureTable2">
          <el-table
            v-loading="loadAllNoArriveData"
            border=""
            :data="noYshouList"
            stripe
            style="width: 100%"
            height="100%"
          >
            <el-table-column
              type="index"
              label=" "
              align="center"
              width="35"
            ></el-table-column>
            <el-table-column show-overflow-tooltip label="供应商">
              <template slot-scope="scope">
                <span
                  @click="handleDirectDetailPage(scope.row)"
                  class="g-row__check"
                  >{{ scope.row.gysName }}</span
                >
              </template>
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydpcCode"
              label="预订批号"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydTime"
              label="预订日期"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ztming"
              min-width="115"
              label="正题名"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="isbn"
              label="ISBN"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zrsming"
              label="责任者"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="cbzhe"
              label="出版社"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydcshu"
              label="预订册数"
              width="70"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="wdcshu"
              label="未到册数"
              width="70"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="jge"
              label="价格"
              width="87"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zjia"
              label="总价"
            ></el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ydPcUrging } from "api/acquisition";
import { downLoadExcel } from "utils/utils";
export default {
  naem: "acq_cqxx",
  data() {
    return {
      yddhao: "",
      // 部分未到馆数据
      loadPartNoArriveData: false,
      yesYshouList: [],
      partNoParam: {
        pageSize: 10000,
        pageNumber: 1
      },
      // 全部未到馆数据
      loadAllNoArriveData: false,
      noYshouList: [],
      allNoParam: {
        pageSize: 10000,
        pageNumber: 1
      }
    };
  },
  methods: {
    //获取催缺信息列表
    getAllNoCqList() {
      this.loadAllNoArriveData = true;
      ydPcUrging({
        ydpcid: this.$route.query.ydpcid,
        flag: "0",
        ...this.allNoParam
      })
        .then(res => {
          this.loadAllNoArriveData = false;
          this.yddhao = res.data.ydpcCode;
          res.data.page.dataList.map((ele, index) => {
            ele.index =
              (this.allNoParam.pageNumber - 1) * this.allNoParam.pageSize +
              index +
              1;
          });
          this.noYshouList = res.data.page.dataList;
        })
        .catch(() => {
          this.loadAllNoArriveData = false;
        });
    },
    getPartNoCqList() {
      this.loadPartNoArriveData = true;
      ydPcUrging({
        ydpcid: this.$route.query.ydpcid,
        flag: "1",
        ...this.partNoParam
      })
        .then(res => {
          this.loadPartNoArriveData = false;
          this.yddhao = res.data.ydpcCode;
          res.data.page.dataList.map((ele, index) => {
            ele.index =
              (this.partNoParam.pageNumber - 1) * this.partNoParam.pageSize +
              index +
              1;
          });
          this.yesYshouList = res.data.page.dataList;
        })
        .catch(() => {
          this.loadPartNoArriveData = false;
        });
    },

    print() {
      downLoadExcel("api/e/interview/file/urgingE", {
        ydpcid: this.$route.query.ydpcid
      });
    }
  },
  mounted() {
    this.getAllNoCqList();
    this.getPartNoCqList();
  },
  activated() {
    this.getAllNoCqList();
    this.getPartNoCqList();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
.acq_cqxx {
  .common__content {
    height: 50%;
    .content__table {
      height: 100%;
      .el-table th,
      .el-table td {
        padding: 8px 0;
      }
    }
  }
}
</style>
