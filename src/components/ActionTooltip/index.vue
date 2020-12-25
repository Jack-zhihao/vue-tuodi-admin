<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-06-25 10:32:05
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-06 23:07:29
 -->
<template>
  <el-popover
    placement="bottom-end"
    v-model="showTool"
    popper-class="action__tooltip"
  >
    <div class="menus" @click="hideTool">
      <!-- 不通用的功能按钮可以通过 menus 插槽在这里展示 -->
      <!-- 下面这个是使用 demo -->
      <!--  
      <template v-slot:menus>
        <div class="menu">
          编目
        </div>
      </template> 
      -->
      <slot name="menus"></slot>
    </div>

    <div class="menus">
      <div
        class="menu"
        v-if="ops.includes('detail')"
        @click="emitEvent('handleDetail')"
      >
        详情
      </div>
      <div
        class="menu"
        v-if="ops.includes('restore')"
        @click="emitEvent('handleRestore')"
      >
        恢复
      </div>
      <div
        class="menu"
        v-if="ops.includes('catague')"
        @click="emitEvent('handleCatague')"
      >
        编目
      </div>
      <div
        class="menu"
        v-if="ops.includes('edit')"
        @click="emitEvent('handleEdit')"
      >
        编辑
      </div>
      <div
        class="menu"
        v-if="ops.includes('skuan')"
        @click="emitEvent('handleSkuan')"
      >
        收款
      </div>
      <div
        class="menu"
        v-if="ops.includes('tkuan')"
        @click="emitEvent('handleTkuan')"
      >
        退款
      </div>
      <div
        class="menu"
        v-if="ops.includes('modi')"
        @click="emitEvent('handleModi')"
      >
        修改
      </div>
      <div
        class="menu"
        v-if="ops.includes('gcfp')"
        @click="emitEvent('handleGCFP')"
      >
        馆藏分配
      </div>
      <div
        class="menu"
        v-if="ops.includes('unsubscribe')"
        @click="emitEvent('handleUnsubscribe')"
      >
        退订
      </div>
      <div
        class="menu"
        v-if="ops.includes('renew')"
        @click="emitEvent('handleRenew')"
      >
        续订
      </div>
      <div
        class="menu"
        v-if="ops.includes('discontinue')"
        @click="emitEvent('handleDiscontinue')"
      >
        停订
      </div>
      <div
        class="menu"
        v-if="ops.includes('del')"
        @click="emitEvent('handleDel')"
      >
        删除
      </div>
      <div
        class="menu"
        v-if="ops.includes('delay')"
        @click="emitEvent('handleDelay')"
      >
        延期处理
      </div>
      <div
        class="menu"
        v-if="ops.includes('chuli')"
        @click="emitEvent('handleChuli')"
      >
        处理
      </div>
      <div
        class="menu"
        v-if="ops.includes('sureTake')"
        @click="emitEvent('handleSureTake')"
      >
        处理
      </div>
      <div
        class="menu"
        v-if="ops.includes('sxjpf')"
        @click="emitEvent('handleSxjpf')"
      >
        上下架派发
      </div>
    </div>

    <div slot="reference">
      <div class="menu__op">
        <span class="op__dot"></span>
        <span class="op__dot"></span>
        <span class="op__dot"></span>
      </div>
    </div>
  </el-popover>
</template>

<script>
export default {
  props: {
    id: {
      type: [String, Number, Object],
      default: ""
    },
    index: {
      type: Number
    },
    ops: {
      type: Array,
      default: () => [""]
    },
    data: {
      type: Object
    }
  },
  data() {
    return {
      showTool: false
    };
  },
  methods: {
    hideTool() {
      this.showTool = false;
    },
    emitEvent(name) {
      this.hideTool();
      this.$emit(name, this.id, this.index, this.data);
    }
  }
};
</script>

<style lang="less">
.action__tooltip {
  padding: 10px 0;
  min-width: 96px;
  margin-top: 8px !important;
  .popper__arrow {
    display: none;
  }
  .menu {
    display: block;
    padding: 0 10px;
    line-height: 36px;
    font-size: @FSize_14;
    cursor: pointer;
    &:hover {
      color: @primaryColor;
      background: #e4f1ff;
    }
    button {
      width: 100%;
      justify-content: left;
    }
  }
}
.op__dot {
  display: inline-block;
  width: 4px;
  height: 4px;
  flex: 0 0 4px;
  border-radius: 50%;
  background: @primaryColor;
  vertical-align: middle;
  margin-right: 2px;
}
.menu__op {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  height: 22px;
  cursor: pointer;
}
</style>
