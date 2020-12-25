<!--
 * @Description: 读者荐购
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-04-22 14:34:18
 * @LastEditTime: 2020-03-10 19:14:46
 -->

<template>
  <div class="acq-dzjg common__content">
    <el-scrollbar>
      <td-content-header>
        读者荐购
        <template v-slot:btns>
          <div class="header__ops">
            <el-button
              :disabled="multipleDzjgSelection.length === 0"
              size="mini"
              type="primary"
              @click="deleteDzjg('')"
              ><icon-svg icon-class="icon-btn-ico-1" /> 删除<span
                v-show="multipleDzjgSelection.length"
                >({{ multipleDzjgSelection.length }})</span
              ></el-button
            >
            <el-button size="mini" type="primary" @click="downLoadFile"
              ><icon-svg icon-class="icon-daochu" /> 导出</el-button
            >
            <el-popover
              popper-class="pop__dzjg"
              placement="bottom"
              width="200"
              trigger="click"
            >
              <div @click="changeDzjgStatus">
                <p>不符合馆藏，不采购</p>
                <p>待采购</p>
                <p>采购中</p>
                <p>已入库</p>
              </div>
              <el-button
                style="margin-left: 10px;"
                slot="reference"
                size="mini"
                type="primary"
                :disabled="multipleDzjgSelection.length === 0"
                >更改状态<icon-svg
                  style="margin-left: 5px;"
                  icon-class="icon-xialajiantou"
              /></el-button>
            </el-popover>
          </div>
        </template>
      </td-content-header>
      <div class="content">
        <div class="content__header">
          <div class="header__filters">
            <p class="desc">成员馆：</p>
            <el-select
              filterable
              size="mini"
              v-model="currentLibId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <p class="desc">状态：</p>
            <el-select
              filterable
              size="mini"
              v-model="jgZtai"
              placeholder="请选择"
            >
              <el-option
                v-for="item in jgZtaiOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="currentDzjgFilterKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in dzjgFilterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              style="flex: 1;max-width: 250px;"
              size="mini"
              clearable
              class="group__filters_value"
              v-model="dzjgSearchKey"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (dzjgSearchKey = val),
                  initDzjgList
                )
              "
              placeholder="请输入搜索关键词"
              @keydown.enter.native="delayFunc(initDzjgList)"
            ></el-input>
            <p class="desc">排序方式：</p>
            <el-select
              filterable
              size="mini"
              v-model="sort"
              placeholder="请选择"
            >
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-button type="primary" size="mini" @click="initDzjgList"
              ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
            >
          </div>
        </div>
        <el-table
          ref="dzjgTable"
          v-loading="loadDzjgData"
          @selection-change="handleDzjgSelectionChange"
          border
          :data="dzjgList"
          stripe
          highlight-current-row
          @row-click="clickRow"
          @current-change="handleDzjgRowChange"
          style="width: 100%"
          height="calc(50vh - 56px - 52px)"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tming" label="正题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yzhong" label="语种">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbrqi" label="出版时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jgrs"
            width="70"
            label="荐购人次"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="最近荐购时间"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ztai" label="状态">
          </el-table-column>
        </el-table>
        <div class="content__page">
          <div
            class="selected__count"
            style="font-size:14px;font-weight: bold;flex: 1;text-indent: 4px;"
          >
            <span
              >共计&nbsp;&nbsp;图书册价：{{
                bookCount
              }}&nbsp;&nbsp;&nbsp;&nbsp;荐购人次：{{ jgCount }}</span
            >
          </div>
          <td-pagination
            @size-change="handleDzjgSizeChange"
            @current-change="handleDzjgCurrentChange"
            :total="totalDzjgCount"
            :currentPage="currentDzjgPage"
            :pageSize="dzjgPageSize"
          ></td-pagination>
        </div>
      </div>
      <td-content-header>
        荐购详情
      </td-content-header>
      <el-table
        v-loading="loadIsbnData"
        border
        :data="isbnDataList"
        stripe
        style="width: 100%"
      >
        <el-table-column type="index" label=" " align="center" width="35">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dzzhao" label="读者证号">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="xming" label="读者姓名">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="optime" label="荐购时间">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="shouji" label="联系方式">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="dzyjian" label="Email">
        </el-table-column>
        <el-table-column
          show-overflow-tooltip
          prop="dzlxName"
          label="读者类型"
          width="70"
        >
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="ztai" label="证状态">
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="jgly" label="荐购理由">
        </el-table-column>
      </el-table>
    </el-scrollbar>
  </div>
</template>

<script>
import { downLoadExcel } from "utils/utils";

import { DZJG_OPTIONS } from "utils/selectOptions";

import {
  searchTsjgR,
  deleteTsjgR,
  updateZtaiR,
  jgDzheList,
  tsjgE,
  searchTsjgRSum
} from "api/acquisition";

import { mapGetters } from "vuex";

export default {
  name: "acq_dzjg",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.dzjgFilterOptions = DZJG_OPTIONS;
    this.jgZtaiOptions = [
      {
        label: "全部",
        value: ""
      },
      {
        label: "未处理",
        value: "未处理"
      },
      {
        label: "不符合馆藏，不采购",
        value: "不符合馆藏，不采购"
      },
      {
        label: "待采购",
        value: "待采购"
      },
      {
        label: "采购中",
        value: "采购中"
      },
      {
        label: "已入库",
        value: "已入库"
      }
    ];
    this.sortOptions = [
      {
        label: "荐购人次",
        value: 0
      },
      {
        label: "荐购时间",
        value: 1
      },
      // {
      //   label: "价格",
      //   value: 2
      // },
      {
        label: "ISBN",
        value: 3
      },
      {
        label: "正题名",
        value: 4
      },
      {
        label: "责任者",
        value: 5
      },
      {
        label: "出版社",
        value: 6
      },
      {
        label: "出版时间",
        value: 7
      }
    ];
    return {
      bookCount: "--",
      jgCount: "--",
      currentLibId: this.$store.getters.userInfo.libId,
      jgZtai: "",
      // 图书信息
      multipleDzjgSelection: [],
      currentDzjgFilterKey: "1",
      dzjgSearchKey: "",
      sort: 0,
      loadDzjgData: false,
      dzjgList: [],
      totalDzjgCount: 0,
      currentDzjgPage: 1,
      dzjgPageSize: 15,
      loadIsbnData: false,
      isbnDataList: []
    };
  },
  methods: {
    // 图书信息
    clickRow(row) {
      this.$refs.dzjgTable.toggleRowSelection(row);
    },
    // eslint-disable-next-line
    deleteDzjg(ids, index, data) {
      this.$confirm(
        `确定要删除${this.multipleDzjgSelection.length}条数据吗?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadDzjgData = true;
          deleteTsjgR({
            param: ids
              ? `${data.isbn},${data.jgid}`
              : this.multipleDzjgSelection.join("=")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initDzjgList();
            })
            .finally(() => {
              this.loadDzjgData = false;
            });
        })
        .catch(() => {});
    },
    changeDzjgStatus(event) {
      this.loadDzjgData = true;
      let status = event.target.innerText;
      updateZtaiR({
        param: this.multipleDzjgSelection.join("="),
        ztai: status
      })
        .then(res => {
          this.$message.success(res.message);
          this.initDzjgList();
        })
        .finally(() => {
          this.loadDzjgData = false;
        });
    },
    initDzjgList() {
      this.currentDzjgPage = 1;
      this.setRequestObj();
      this.getDzjgList();
    },
    setRequestObj() {
      this.requestObj = {
        ztai: this.jgZtai,
        libId: this.currentLibId,
        flag: this.currentDzjgFilterKey,
        content: this.dzjgSearchKey,
        sort: this.sort
      };
    },
    getDzjgList() {
      this.loadDzjgData = true;
      let requestObj = {
        pageSize: this.dzjgPageSize,
        pageNumber: this.currentDzjgPage,
        ...this.requestObj
      };
      searchTsjgR(requestObj)
        .then(res => {
          this.dzjgList = res.data.dataList;
          this.totalDzjgCount = +res.data.totalElements;
          this.getDzJgSum();
          this.isbnDataList = [];
        })
        .finally(() => {
          this.loadDzjgData = false;
        });
    },
    getDzJgSum(isbnData = []) {
      searchTsjgRSum({
        pageSize: this.dzjgPageSize,
        pageNumber: this.currentDzjgPage,
        ...this.requestObj,
        isbns: isbnData.join()
      }).then(res => {
        this.bookCount = res.data.sum.toFixed(2);
        this.jgCount = res.data.peopleNum;
      });
    },
    handleDzjgSizeChange(val) {
      this.dzjgPageSize = val;
      this.getDzjgList();
    },
    handleDzjgCurrentChange(val) {
      this.currentDzjgPage = val;
      this.getDzjgList();
    },
    handleDzjgSelectionChange(val) {
      this.getDzJgSum(val.map(item => item.isbn));
      this.multipleDzjgSelection = val.map(item => `${item.isbn},${item.jgid}`);
    },
    handleDzjgRowChange(row) {
      if (!row) {
        return;
      }
      this.loadIsbnData = true;
      jgDzheList({
        isbn: row.isbn,
        libid: row.libid,
        tming: row.tming,
        zrsming: row.zrsming,
        fjming: row.fjming,
        ftming: row.ftming
      })
        .then(res => {
          this.isbnDataList = res.data;
        })
        .finally(() => {
          this.loadIsbnData = false;
        });
    },
    // 导出
    downLoadFile() {
      downLoadExcel(tsjgE(), this.requestObj);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}
</style>

<style lang="less">
.pop__dzjg {
  margin-top: 5px !important;
  padding: 10px 0;
  p {
    line-height: 36px;
    cursor: pointer;
    text-indent: 10px;
    &:hover {
      background: @hoverBgColor;
    }
  }
}
</style>
