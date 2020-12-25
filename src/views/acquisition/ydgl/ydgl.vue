<template>
  <div class="ydgl">
    <div class="content__header">
      <div class="content__header_title">用户列表</div>
    </div>
    <el-button type="primary" @click="changeSide">预订管理</el-button>
    <br />
    <action-tooltip id="1" :ops="['edit']" @handleEdit="handleEdit">
      操作提示符
    </action-tooltip>
    <side-wrap v-if="show" width="400px">
      <template v-slot:header>
        <h1>Here might be a header content</h1>
      </template>
      <div class="tab">
        tab
      </div>
      <template v-slot:footer>
        <p>Here's some footer info</p>
      </template>
    </side-wrap>
    <br />
    <el-table border :data="tableData" stripe style="width: 100%">
      <el-table-column prop="date" label="日期" width="180"> </el-table-column>
      <el-table-column prop="name" label="姓名" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址"> </el-table-column>
    </el-table>
    <td-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :total="totalCount"
    ></td-pagination>
  </div>
</template>

<script>
import SideWrap from "components/SideWrap";
import ActionTooltip from "components/ActionTooltip";
export default {
  name: "acq_ydgl",
  components: {
    SideWrap,
    ActionTooltip
  },
  data() {
    return {
      totalCount: 20,
      show: false,
      tableData: [
        {
          date: "2016-05-02",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄"
        },
        {
          date: "2016-05-04",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1517 弄"
        },
        {
          date: "2016-05-01",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1519 弄"
        },
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1516 弄"
        }
      ]
    };
  },
  methods: {
    changeSide() {
      this.show = !this.show;
    },
    handleEdit() {
      // console.log("编辑", id);
    },
    // eslint-disable-next-line
    handleSizeChange(pageSize) {
      // console.log('handleSizeChange', pageSize);
    },
    // eslint-disable-next-line
    handleCurrentChange(currentPage) {
      // console.log('handleCurrentChange', currentPage);
    }
  }
};
</script>

<style lang="less">
.ydgl {
  background: @bgColor;
  .content__header_title {
    .contentTitle();
  }
}

.tab {
  height: 1000px;
  background: lightblue;
}
</style>
