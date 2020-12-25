<template>
  <div class="per_zdys common__content">
    <td-content-header>
      <span>期刊书目信息</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            size="mini"
            type="primary"
            @click="handleDel(false)"
            :disabled="qksmSelectedRow.length ? false : true"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <el-select
            filterable
            class="header__filters_type group__filters_type"
            size="mini"
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filters_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="search()"
            ref="focusInput"
          ></el-input>
          <el-button type="primary" size="mini" @click="search()">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          ref="ZDYSList"
          v-loading="loadZDYSData"
          border=""
          :data="ZDYSList"
          stripe
          highlight-current-row
          @row-dblclick="handleDirectBMPage"
          @row-click="storageFunc"
          @selection-change="qksmSelectedRowFunc"
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
            width="145"
            prop="issn"
            label="ISSN"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flhao"
            label="分类号"
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
            prop="dghao"
            label="订购号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzqi"
            label="出版周期"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="qkjge"
            label="价格"
            width="87"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.wzid"
                :ops="['del']"
                @handleDel="handleDel(scope.row)"
              >
                <template v-slot:menus>
                  <div class="menu" @click="handleDirectBMPage(scope.row)">
                    编目
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__pages">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :current-page.sync="pageNumber"
          :page-size="pageSize"
        ></td-pagination>
      </div>
      <div class="content__table content__table__zdlist" ref="literatureTable2">
        <td-content-header class="handle__bar">
          <span>装订列表</span>
          <template v-slot:btns>
            <div class="header__ops">
              <el-button
                size="mini"
                type="primary"
                :disabled="ZDSelectedRow.length !== 1"
                @click="goPathCollect(false)"
              >
                <icon-svg icon-class="icon-yanshouguanli" />验收
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="handleZdJsong(false)"
                :disabled="ZDSelectedRow.length ? false : true"
              >
                <icon-svg icon-class="icon-wenjianyisong" />交送
              </el-button>
              <el-button
                size="mini"
                type="primary"
                :disabled="ZDSelectedRow.length ? false : true"
                @click="handleZdDel(false)"
              >
                <icon-svg icon-class="icon-btn-ico-1" />删除
              </el-button>
            </div>
          </template>
        </td-content-header>
        <el-table
          ref="ZDList"
          v-loading="loadZDListData"
          border=""
          :data="ZDList"
          stripe
          @row-click="rowClick"
          @row-dblclick="goPathCollect"
          @selection-change="ZDSelectedRowFunc"
          style="width: 100%"
          height="calc(100% - 40px)"
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
            prop="jcsm"
            label="卷册说明"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="pihao"
            label="批号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfs"
            label="总份数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ydcs"
            label="已验收份数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yjscs"
            label="已交送份数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="装订人"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="装订时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yusuanDaima"
            label="预算代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdlx"
            label="装订类型"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.wzid"
                :ops="['del']"
                @handleDel="handleZdDel(scope.row.yanshouid)"
              >
                <template v-slot:menus>
                  <div class="menu" @click="goPathCollect(scope.row)">
                    验收
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      title="装订信息"
      :visible.sync="centerDialogVisible"
      width="850px"
      center
    >
      <div>
        <el-form
          class="addForm custom__form"
          ref="ZDYSForm"
          :modal="false"
          label-width="110px"
          :model="ZDYSForm"
          :rules="ZDYSFormRules"
        >
          <div class="form__type">
            <div class="tit"></div>
            <el-form-item class="item" prop="czid" label="馆藏地点">
              <el-select
                filterable
                size="small"
                v-model="ZDYSForm.czid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userCzList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ltlxid" label="流通类型">
              <el-select
                filterable
                size="small"
                v-model="ZDYSForm.ltlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in flowTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="pihao" label="批号">
              <el-input
                clearable
                size="small"
                v-model="ZDYSForm.pihao"
                placeholder="请输入批号"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdlx" label="装订类型">
              <el-select
                filterable
                size="small"
                v-model="ZDYSForm.zdlx"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdfsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdcs" label="装订册数">
              <el-input
                clearable
                size="small"
                v-model="ZDYSForm.zdcs"
                placeholder="请输入装订册数"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjg" label="装订价格">
              <el-input
                clearable
                size="small"
                v-model="ZDYSForm.zdjg"
                placeholder="请输入装订价格"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                size="small"
                v-model="ZDYSForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userYsLibList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item class="item">{{
              "卷册说明：" + ZDYSForm.jcsm
            }}</el-form-item>
            <el-form-item class="item"></el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                clearable
                size="small"
                v-model="ZDYSForm.sshao"
                placeholder="请输入索书号"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="tiaoma" label="条码号">
              <el-input
                clearable
                size="small"
                v-model="ZDYSForm.tiaoma"
                placeholder="请输入条码号"
                @keyup.native="
                  handleBarCodeScanner($event, val => (ZDYSForm.tiaoma = val))
                "
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ZDYSForm')"
          >确 定</el-button
        >
        <el-button @click="closeDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  qksmxxList,
  qksmxxListDel,
  zdlbList,
  zdlbJiaoSong,
  zdlbDel,
  zdlbYanshou
} from "api/periodical";

import { userCzList, userYsLibList, flowType } from "api/public";

import { mapGetters } from "vuex";

import { ZDYS_OPTIONS } from "utils/selectOptions";

export default {
  name: "per_zdys",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.filterOptions = ZDYS_OPTIONS;

    this.zdfsList = [
      { label: "平装", value: "平装" },
      { label: "精装", value: "精装" },
      { label: "线装", value: "线装" }
    ];
    this.ZDYSFormRules = {
      czid: [{ required: true, message: "请选择馆藏地址", trigger: "change" }],
      ltlxid: [
        { required: true, message: "请选择流通类型", trigger: "change" }
      ],
      pihao: [{ required: true, message: "请输入批号", trigger: "blur" }],
      zdlx: [{ required: true, message: "请选择装订类型", trigger: "change" }],
      zdcs: [{ required: true, message: "请输入装订册数", trigger: "blur" }],
      zdjg: [{ required: true, message: "请输入装订价格", trigger: "blur" }],
      ysid: [{ required: true, message: "请选择预算代码", trigger: "change" }],
      sshao: [{ required: true, message: "请输入索书号", trigger: "blur" }],
      tiaoma: [{ required: true, message: "请输入条码号", trigger: "blur" }]
    };
    return {
      currentFilterKey: "issn",
      currentFilterVal: "",
      //书目表格
      loadZDYSData: false,
      ZDYSList: [],
      qksmSelectedRow: [],
      storageRow: {},
      totalCount: 0,
      pageSize: 15,
      pageNumber: 1,
      //装订表格
      loadZDListData: false,
      ZDList: [],
      ZDSelectedRow: [],
      //装订对话框
      centerDialogVisible: false,
      ZDYSForm: {},
      userCzList: [],
      userYsLibList: [],
      flowTypeList: []
    };
  },
  methods: {
    search() {
      this.pageNumber = 1;
      this.getQksmxxList();
      this.ZDList = [];
    },
    //列表
    getQksmxxList() {
      let param = {
        pageSize: this.pageSize,
        pageNumber: this.pageNumber
      };
      param[this.currentFilterKey] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );
      this.loadZDYSData = true;
      qksmxxList({
        ...param
      })
        .then(res => {
          this.loadZDYSData = false;
          this.totalCount = Number(res.data.totalElements);
          this.ZDYSList = [...res.data.dataList];
        })
        .catch(() => {
          this.loadZDYSData = false;
        });
    },
    qksmSelectedRowFunc(row) {
      this.qksmSelectedRow = [...row];
    },
    //书目删除
    handleDel(row) {
      let marcids = [];
      let marctyIds = [];
      if (row) {
        marcids.push(row.marcid);
        marctyIds.push(row.marctyid);
      } else {
        this.qksmSelectedRow.map(ele => {
          marcids.push(ele.marcid);
          marctyIds.push(ele.marctyid);
        });
      }
      qksmxxListDel({
        marcids: marcids.join(","),
        marctyIds: marctyIds.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.getQksmxxList();
      });
    },
    rowClick(row) {
      this.$refs.ZDList.toggleRowSelection(row);
    },
    //编目
    handleDirectBMPage(row) {
      let param = {
        isQk: 1,
        marcid: row.marcid,
        marctyid: row.marctyid
      };
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "per_zdys",
          ...param
        }
      });
    },
    handleCurrentChange(pageNumber) {
      this.pageNumber = pageNumber;
      this.getQksmxxList();
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.pageNumber = 1;
      this.getQksmxxList();
    },
    //点击行存储
    storageFunc(row) {
      this.storageRow = { ...row };
      this.$refs.ZDYSList.toggleRowSelection(row);
      this.getZdlbList();
    },
    //装订列表
    getZdlbList() {
      this.loadZDListData = true;
      zdlbList({
        pageSize: 1000,
        pageNumber: 1,
        marcid: this.storageRow.marcid
      })
        .then(res => {
          this.loadZDListData = false;
          this.ZDList = [...res.data.dataList];
          this.initZdOption();
        })
        .catch(() => {
          this.loadZDListData = false;
        });
    },
    //选择
    ZDSelectedRowFunc(row) {
      this.ZDSelectedRow = [...row];
    },
    //装订-编辑
    handleZdEdit(row) {
      this.centerDialogVisible = true;
      this.ZDYSForm = { ...row };
    },
    //装订-删除
    handleZdDel(yanshouid) {
      let yanshouids = [];
      if (yanshouid) {
        yanshouids = [yanshouid];
      } else {
        this.ZDSelectedRow.filter(ele => {
          yanshouids.push(ele.yanshouid);
        });
      }
      zdlbDel({
        yanshouids: yanshouids.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.getZdlbList();
      });
    },
    //装订--验收 - 跳转路由
    goPathCollect(row) {
      let param = {};
      if (!row) {
        if (this.ZDSelectedRow[0].ydcs == this.ZDSelectedRow[0].zdfs) {
          this.$message.warning("已验收所有份数");
          return;
        }
        param = {
          qkjge: this.storageRow.qkjge,
          yanshouid: this.ZDSelectedRow[0].yanshouid,
          marctyId: this.ZDSelectedRow[0].marctyid
        };
      } else {
        if (row.ydcs == row.zdfs) {
          this.$message.warning("已验收所有份数");
          return;
        }
        param = {
          yanshouid: row.yanshouid,
          marctyId: row.marctyid
        };
      }
      this.$router.push({
        name: "per_zdys_collection",
        query: {
          ...param
        }
      });
    },
    //装订交送
    handleZdJsong() {
      let yanshouids = [];
      this.ZDSelectedRow.filter(ele => {
        yanshouids.push(ele.yanshouid);
      });
      zdlbJiaoSong({
        yanshouids: yanshouids.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.getZdlbList();
      });
    },
    //对话框submit
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          zdlbYanshou({
            ...this.ZDYSForm
          }).then(res => {
            this.$message.success(res.message);
            this.getZdlbList();
            this.centerDialogVisible = false;
            this.$refs[formName].resetFields();
          });
        }
      });
    },

    closeDialog() {
      this.$refs["ZDYSForm"].resetFields();
      this.centerDialogVisible = false;
    },

    //获取对话框option
    initZdOption() {
      const libId = this.$store.getters.userInfo.libId;
      //获取藏址
      userCzList({
        libId
      }).then(res => {
        this.userCzList = [];
        res.data.filter(ele => {
          this.userCzList.push({
            value: ele.czid,
            label: ele.mingcheng
          });
        });
      });
      //获取预算类型
      userYsLibList({
        libId
      }).then(res => {
        this.userYsLibList = [];
        res.data.filter(ele => {
          this.userYsLibList.push({
            value: ele.ysid,
            label: ele.daima
          });
        });
      });
      //获取流通类型
      flowType({
        libId
      }).then(res => {
        this.flowTypeList = [];
        res.data.filter(ele => {
          this.flowTypeList.push({
            value: ele.ltlxid,
            label: ele.mingcheng
          });
        });
      });
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
    this.$eventBus.$on("jdbm-update", () => {
      this.getQksmxxList();
      this.ZDList = [];
    });
    this.$eventBus.$on("zdys_collect", () => {
      this.getZdlbList();
    });
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
    this.$eventBus.$off("zdys_collect");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.per_zdys {
  .content {
    .content__table {
      height: calc(50% - 33px);
      &.content__table__zdlist {
        height: calc(50% - 32px);
      }
    }
  }
}
</style>
