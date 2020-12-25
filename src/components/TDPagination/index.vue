<template>
  <el-pagination
    class="td__pagination"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :total="total"
    layout="slot, sizes, prev, pager, next, jumper"
  >
    <template v-slot
      ><span class="page__counts"
        >共<span class="page__count">{{ totalPage }}</span
        >页/<span class="page__count">{{ total }}</span
        >条数据</span
      ></template
    >
  </el-pagination>
</template>

<script>
export default {
  props: {
    pageSizes: {
      type: Array,
      default: () => [10, 15, 20, 50]
    },
    pageSize: {
      type: [String, Number],
      default: 10
    },
    currentPage: {
      type: [String, Number],
      default: 1
    },
    total: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    totalPage() {
      return Math.ceil(this.total / this.pageSize);
    }
  },
  methods: {
    handleSizeChange(pageSize) {
      this.$emit("size-change", pageSize);
    },
    handleCurrentChange(currentPage) {
      this.$emit("current-change", currentPage);
    }
  }
};
</script>

<style lang="less" scoped>
.td__pagination {
  text-align: right;
  padding-right: 20px;
  .page__counts {
    color: @fontTintColor;
    font-size: @FSize_14;
    display: inline;
    margin-right: 5px;
    font-weight: normal;
    .page__count {
      display: inline;
      color: @dangerColor;
    }
  }
  /deep/ .el-pagination__sizes {
    margin-right: 5px;
  }
  /deep/ .el-pagination__jump {
    margin-left: 10px;
  }
}
</style>
