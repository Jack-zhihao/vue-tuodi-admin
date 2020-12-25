<template>
  <div class="per_zdpys common__content">
    <td-content-header>
      <span>装订批移送</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            :disabled="shuceids.length === 0"
            @click="zdpysJiaosong"
          >
            <icon-svg icon-class="icon-btn-ico-" />交送
          </el-button>
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
            @change="changeFilterOptions"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <div class="group__filter_value">
            <el-input
              size="mini"
              clearable
              class=""
              v-model="currentFilterVal"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="search(true)"
            ></el-input>
            <el-input
              size="mini"
              clearable
              class=""
              :disabled="currentFilterKey === 'pihao'"
              v-model="currentFilterVal2"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="search(true)"
            ></el-input>
          </div>
          <el-button type="primary" size="mini" @click="search(true)">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="ZDPYSListBox">
        <el-table
          v-loading="loadZDPYSData"
          border=""
          ref="ZDPYSList"
          :data="ZDPYSList"
          stripe
          @row-click="rowClick"
          @selection-change="handleSelectionChange"
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="35"
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
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="所属成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="czName"
            label="藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ltlxName"
            label="流通类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdjg"
            label="单价"
          ></el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="pageNumber"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { zdpysList, zdpysJiaosong } from "api/periodical";
export default {
  name: "per_zdpys",
  data() {
    this.filterOptions = [
      { label: "条形码", value: "tiaoma" },
      { label: "批号", value: "pihao" }
    ];
    return {
      currentFilterKey: "tiaoma",
      currentFilterVal: "",
      currentFilterVal2: "",
      loadZDPYSData: false,
      ZDPYSList: [],
      shuceids: [],
      totalCount: 0,
      pageNumber: 1,
      pageSize: 15
    };
  },
  methods: {
    search() {
      this.pageNumber = 1;
      this.getZdpysList();
    },
    getZdpysList() {
      this.loadZDPYSData = true;
      let param = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      if (this.currentFilterKey === "pihao") {
        param[this.currentFilterKey] = this.currentFilterVal;
      } else {
        param["tiaoma1"] = this.currentFilterVal;
        param["tiaoma2"] = this.currentFilterVal2;
      }

      zdpysList({
        ...param
      })
        .then(res => {
          this.loadZDPYSData = false;
          this.totalCount = Number(res.data.totalElements);
          this.ZDPYSList = [...res.data.dataList];
        })
        .catch(() => {
          this.loadZDPYSData = false;
        });
    },
    rowClick(row) {
      this.$refs.ZDPYSList.toggleRowSelection(row);
    },
    //交送,
    zdpysJiaosong() {
      zdpysJiaosong({
        shuceids: this.shuceids.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.search();
      });
    },
    handleSelectionChange(row) {
      this.shuceids = [];
      row.filter(ele => {
        this.shuceids.push(ele.shuceid);
      });
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.pageNumber = 1;
      this.getZdpysList();
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getZdpysList();
    },
    changeFilterOptions() {
      if (this.currentFilterKey === "pihao") {
        this.currentFilterVal2 = "";
      }
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.per_zdpys {
  .content__header {
    .header__line {
      /deep/.group__filter_value {
        position: relative;
        margin-right: 10px;
        .el-input {
          width: 160px;
          margin: 0;
          &:nth-child(1) {
            .el-input__inner {
              border-radius: 0;
              border-right: none;
              padding-right: 30rpx;
            }
          }
          &:nth-child(2) {
            .el-input__inner {
              border-left: none;
              padding-left: 20px;
            }
          }
        }
        &::before {
          content: "至";
          position: absolute;
          left: 50%;
          margin-left: -8px;
          z-index: 999;
          top: 3px;
        }
      }
    }
  }
}
</style>
