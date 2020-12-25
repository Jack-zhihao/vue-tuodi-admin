<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @Date: 2019-07-29 09:32:17
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-09 15:32:17
 -->
<template>
  <div class="p-qypz common__content">
    <!-- 地区配置浮层 -->
    <div class="region__layer" ref="regionLayer">
      <div
        style="border-bottom: 1px solid #EAEAEA;height: 30px;line-height: 30px;"
      >
        <span
          class="regin__layer_op"
          v-if="showRegionLayer"
          @click="handleHideRegionLayer"
        >
          <i class="el-icon-d-arrow-left"></i>
        </span>
        <span class="regin__layer_op" v-else @click="handleShowRegionLayer">
          <i class="el-icon-d-arrow-right"></i>
        </span>
      </div>
      <div style="height: calc(100% - 30px);">
        <div class="layer__icon" ref="layerIcon">
          <icon-svg icon-class="icon-china-copy"></icon-svg>
        </div>
        <el-scrollbar>
          <el-tree
            ref="regionTree"
            :data="regionData"
            show-checkbox
            :expand-on-click-node="false"
            :default-checked-keys="defaultCheckedRegion"
            node-key="areaId"
            @check="regionDataChange"
            :props="defaultProps"
          >
            <span class="custom-tree-node" slot-scope="{ node, data }">
              <span style="font-size: 16px;">{{ node.label }}</span>
              <span>
                <td-action-tool>
                  <template v-slot:menus>
                    <div class="menu">
                      <el-button
                        type="text"
                        size="small"
                        style="font-size: 14px;"
                        @click="appendAreaNode(data)"
                      >
                        新增
                      </el-button>
                    </div>
                    <div class="menu">
                      <el-button
                        type="text"
                        size="small"
                        style="font-size: 14px;"
                        v-if="data.areaId !== '1'"
                        @click="modiAreaNode(data)"
                      >
                        编辑
                      </el-button>
                    </div>
                    <div class="menu">
                      <el-button
                        style="color: #de5151;font-size: 14px;"
                        type="text"
                        size="small"
                        v-if="data.areaId !== '1'"
                        @click="remove(node, data)"
                      >
                        删除
                      </el-button>
                    </div>
                  </template>
                </td-action-tool>
              </span>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </div>
    <div class="content__right" ref="contentRight">
      <td-content-header>
        区域配置
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
            >
              <el-option
                v-for="item in filterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-input
              ref="focusInput"
              size="mini"
              clearable
              class="group__filter_value"
              v-model="currentFilterVal"
              placeholder="请输入搜索关键词"
              @keyup.enter.native="initLibsArea"
            ></el-input>
            <el-button type="primary" size="mini" @click="initLibsArea"
              ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
            >
          </div>
        </div>
        <div class="content__table" ref="contentTable">
          <el-table
            ref="userListTable"
            v-loading="loadLibsAreaData"
            @row-dblclick="rowDblclick"
            border
            :data="libsAreaList"
            stripe
            style="width: 100%"
            height="100%"
          >
            <el-table-column type="index" label=" " align="center" width="35">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libCode"
              label="成员馆代码"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libJiancheng"
              label="成员馆简称"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libMingcheng"
              label="成员馆全称"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="userName"
              label="操作人"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="libDatetime"
              label="操作时间"
            >
            </el-table-column>
            <el-table-column label="操作" width="45" fixed="right">
              <template slot-scope="scope">
                <td-action-tool>
                  <template v-slot:menus>
                    <div class="menu" @click="changeLibAreaDetail(scope.row)">
                      编辑
                    </div>
                  </template>
                </td-action-tool>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div class="content__page">
          <td-pagination
            @size-change="handleLibAreaSizeChange"
            @current-change="handleLibAreaCurrentChange"
            :total="totalLibsAreaCount"
            :currentPage="currentLibsAreaPage"
            :pageSize="libAreaPageSize"
          ></td-pagination>
        </div>
        <!-- 区域节点编辑弹窗 -->
        <el-dialog
          :close-on-click-modal="false"
          custom-class="lib__area_dialog"
          title="编辑区域"
          :visible.sync="editAreaNodeDialogVisible"
          width="420px"
        >
          <el-form
            :model="areaNodeModiForm"
            :rules="areaNodeModiFormRules"
            ref="areaNodeModiForm"
            label-width="100px"
          >
            <el-form-item size="small" label="区域名称" prop="areaName">
              <el-input
                clearable
                v-model="areaNodeModiForm.areaName"
              ></el-input>
            </el-form-item>
            <el-form-item size="small" label="上级区域" prop="parentId">
              <el-cascader
                style="width: 280px"
                v-model="areaNodeModiForm.parentId"
                placeholder="请选择区域所属区域"
                :options="editRegionData"
                :show-all-levels="false"
                :props="{
                  checkStrictly: true,
                  emitPath: false,
                  value: 'areaId',
                  label: 'areaName',
                  children: 'childs'
                }"
              ></el-cascader>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button
              size="small"
              type="primary"
              @click="handleAreaNodeChange('areaNodeModiForm')"
              >确 定</el-button
            >
            <el-button size="small" @click="editAreaNodeDialogVisible = false"
              >取 消</el-button
            >
          </span>
        </el-dialog>
        <!-- 区域配置列表编辑馆所属区域 -->
        <el-dialog
          :close-on-click-modal="false"
          custom-class="lib__area_dialog"
          title="编辑所属区域"
          :visible.sync="editLibAreaDialogVisible"
          width="420px"
        >
          <p style="margin-bottom: 15px;">请选择馆所属区域</p>
          <el-cascader
            size="small"
            v-model="libAreaId"
            placeholder="请选择区域所属区域"
            :options="regionData"
            :show-all-levels="false"
            :props="{
              checkStrictly: true,
              emitPath: false,
              value: 'areaId',
              label: 'areaName',
              children: 'childs'
            }"
          ></el-cascader>
          <span slot="footer" class="dialog-footer">
            <el-button size="small" type="primary" @click="handleLibAreaChange"
              >确 定</el-button
            >
            <el-button size="small" @click="editLibAreaDialogVisible = false"
              >取 消</el-button
            >
          </span>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAreaTreeData,
  getAreaTreeDataWithout,
  addAreaData,
  updateAreaData,
  deleteAreaData,
  getLibsArea,
  updateLibArea,
  searchLibArea
} from "api/data";

export default {
  name: "da_qypz",
  data() {
    this.filterOptions = [
      {
        value: 1,
        label: "成员馆代码"
      },
      {
        value: 2,
        label: "成员馆简称"
      },
      {
        value: 3,
        label: "操作人"
      }
    ];

    this.defaultProps = {
      label: "areaName",
      children: "childs"
    };
    let validateAreaId = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请选择上级区域"));
      } else if (value === this.modiNodeData.areaId) {
        callback(new Error("不能选择自身区域作为上级区域"));
      } else {
        callback();
      }
    };
    this.areaNodeModiFormRules = {
      areaName: [
        { required: true, message: "请输入区域名称", trigger: "blur" }
      ],
      parentId: [
        { required: true, validator: validateAreaId, trigger: "change" }
      ]
    };
    return {
      // 区域节点操作
      showRegionLayer: true,
      regionData: [],
      editRegionData: [],
      defaultCheckedRegion: [],
      editAreaNodeDialogVisible: false,
      areaNodeModiForm: {
        areaName: "",
        parentId: ""
      },
      // 列表
      libAreaId: "",
      editLibAreaDialogVisible: false,
      currentFilterKey: 1,
      currentFilterVal: "",
      loadLibsAreaData: false,
      libsAreaList: [],
      totalLibsAreaCount: 0,
      currentLibsAreaPage: 1,
      libAreaPageSize: 10
    };
  },
  methods: {
    getUserLibArea() {
      searchLibArea({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.defaultCheckedRegion = [].concat(res.data.areaId);
        this.$nextTick(() => {
          this.initLibsArea();
        });
      });
    },
    // 区域节点操作
    handleHideRegionLayer() {
      this.$refs.regionLayer.style.width = "40px";
      this.$refs.contentRight.style.width = "calc(100% - 44px)";
      this.showRegionLayer = false;
      this.$refs.layerIcon.style.display = "block";
    },
    handleShowRegionLayer() {
      this.$refs.regionLayer.style.width = "320px";
      this.$refs.contentRight.style.width = "calc(100% - 324px)";
      this.showRegionLayer = true;
      this.$refs.layerIcon.style.display = "none";
    },
    getAreasData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionData = JSON.parse(JSON.stringify(treeData));
      });
    },
    regionDataChange() {
      this.initLibsArea();
    },
    appendAreaNode(data) {
      this.$prompt("请输入区域名称", "新增区域", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[\s\S]*.*[^\s][\s\S]*$/,
        inputErrorMessage: "请输入区域名称"
      })
        .then(({ value }) => {
          addAreaData({
            areaName: value,
            parentId: data.areaId,
            showOrder: 0
          }).then(res => {
            const newChild = res.data;
            if (!data.childs) {
              this.$set(data, "childs", []);
            }
            data.childs.push(newChild);
            this.$message.success(res.message);
            this.$eventBus.$emit("qypz-update");
          });
        })
        .catch(() => {});
    },
    modiAreaNode(data) {
      this.editAreaNodeDialogVisible = true;
      this.editRegionData = [];
      getAreaTreeDataWithout({
        areaId: data.areaId
      }).then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.editRegionData = JSON.parse(JSON.stringify(treeData));
        this.areaNodeModiForm.areaName = data.areaName;
        this.areaNodeModiForm.parentId = data.parentId;
        this.modiNodeData = data; // 编辑的节点数据
        this.$eventBus.$emit("qypz-update");
      });
    },
    handleAreaNodeChange(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          updateAreaData({
            areaName: this.areaNodeModiForm.areaName,
            parentId: this.areaNodeModiForm.parentId,
            areaId: this.modiNodeData.areaId
          }).then(res => {
            this.$message.success(res.message);
            this.modiNodeData.areaName = this.areaNodeModiForm.areaName;
            this.editAreaNodeDialogVisible = false;
            this.getAreasData();
            this.$eventBus.$emit("qypz-update");
          });
        } else {
          return false;
        }
      });
    },
    remove(node, data) {
      this.$confirm(
        "删除该节点，对应子节点及其成员馆关联关系将同步被移除，是否确认删除？",
        "删除区域",
        {
          confirmButtonText: "确认删除",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          const parent = node.parent;
          const children = parent.data.childs;

          const index = children.findIndex(d => d.areaId === data.areaId);
          deleteAreaData({
            areaId: data.areaId
          }).then(res => {
            this.$message.success(res.message);
            this.$eventBus.$emit("qypz-update");
            children.splice(index, 1);
          });
        })
        .catch(() => {});
    },
    // 列表
    setLibsAreaRequestObj() {
      let areas = this.$refs.regionTree.getCheckedKeys();
      this.libsAreaRequestObj = {
        areaIds: areas.join(","),
        flag: this.currentFilterKey,
        context: this.currentFilterVal
      };
    },
    initLibsArea() {
      this.currentLibsAreaPage = 1;
      this.setLibsAreaRequestObj();
      this.getLibsAreaList();
    },
    getLibsAreaList() {
      this.loadLibsAreaData = true;
      getLibsArea({
        ...this.libsAreaRequestObj,
        pageNumber: this.currentLibsAreaPage,
        pageSize: this.libAreaPageSize
      })
        .then(res => {
          if (!res.data) {
            return;
          }
          if (res.data.totalElements == 0) {
            this.$message.warning("暂无数据");
          }
          this.libsAreaList = res.data.dataList;
          this.totalLibsAreaCount = +res.data.totalElements;
        })
        .finally(() => {
          this.loadLibsAreaData = false;
        });
    },
    rowDblclick(row) {
      this.changeLibAreaDetail(row);
    },
    changeLibAreaDetail(row) {
      this.libAreaId = row.areaId;
      this.currentLibId = row.libId;
      this.editLibAreaDialogVisible = true;
    },
    handleLibAreaChange() {
      updateLibArea({
        libId: this.currentLibId,
        areaId: this.libAreaId
      }).then(res => {
        this.$message.success(res.message);
        this.editLibAreaDialogVisible = false;
        this.getLibsAreaList();
      });
    },
    handleLibAreaSizeChange(val) {
      this.libAreaPageSize = val;
      this.getLibsAreaList();
    },
    handleLibAreaCurrentChange(val) {
      this.currentLibsAreaPage = val;
      this.getLibsAreaList();
    }
  },
  created() {
    this.getAreasData();
    this.getUserLibArea();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.p-qypz {
  position: relative;
  .layer {
    position: absolute;
    left: 10px;
    top: 10px;
  }
  .region__layer {
    height: 100%;
    position: relative;
    display: inline-block;
    vertical-align: bottom;
    width: 320px;
    border: 1px solid #eaeaea;
    transition: all 0.5s;
    /deep/ .el-scrollbar__wrap {
      overflow: hidden;
    }
    .regin__layer_op {
      cursor: pointer;
      font-size: 20px;
      font-weight: bold;
      margin-left: 10px;
    }
    .layer__icon {
      position: absolute;
      background: #fff;
      text-align: center;
      z-index: 2;
      top: 31px;
      bottom: 0;
      width: 100%;
      display: none;
      .svg-icon {
        margin-top: 10px;
      }
    }
  }
  .content__right {
    height: 100%;
    display: inline-block;
    vertical-align: top;
    width: ~"calc(100% - 324px)";
    transition: all 0.5s;
  }
}
.custom-tree-node {
  margin-right: 30px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
  /deep/ .menu__op {
    padding-right: 0;
    text-align: center;
  }
}
</style>

<style lang="less">
.lib__area_dialog {
  .el-dialog__body {
    height: inherit;
  }
}
</style>
