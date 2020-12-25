<template>
  <div class="acq-yddxq common__content">
    <td-content-header>
      预订单详情
      <span style="font-weight: 600">{{
        `【预订单：${$route.query.daima}】`
      }}</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            :disabled="ZDSMSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteZDSM(false)"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
          </el-button>
          <el-button size="mini" type="primary" @click="print">
            <icon-svg icon-class="icon-daochu" />导出
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
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
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            ref="focusInput"
            placeholder="请输入搜索关键词"
            autofocus
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (currentFilterVal = val),
                initZDOrderList
              )
            "
            @keydown.enter.native="delayFunc(initZDOrderList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initZDOrderList">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadZDSMLoader"
          ref="zdOrderList"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleZDSMSelectionChange"
          border=""
          :data="zdOrderList"
          stripe
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
          <el-table-column prop="ydbhao" show-overflow-tooltip label="预订编号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            width="145"
            label="ISBN"
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
            prop="flhao"
            label="分类号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ceshu"
            label="预订册数"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfangshi"
            label="装订方式"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jzleixing"
            label="介质类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ydTime"
            label="订购时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="订购人"
          ></el-table-column>
          <el-table-column fixed="right" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.zdOrderid"
                :index="scope.$index"
                :ops="['edit', 'del']"
                @handleEdit="editZDSM(scope.row)"
                @handleDel="deleteZDSM(scope.row.ydsmid)"
              >
                <template v-slot:menus>
                  <div class="menu" @click="smUnsubscribe(scope.row.ydsmid)">
                    退订
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleZDOrderSizeChange"
          @current-change="handleZDOrderCurrentChange"
          :total="totalZDOrderCount"
          :currentPage="currentZDOrderPage"
          :pageSize="zdOrderPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 修改-查看订单信息 -->
    <side-wrap class="common__side_form" v-show="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">订单信息</div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          :rules="yddxqRules"
          :model="yddxqForm"
          label-width="90px"
          ref="yddxqForm"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>书目控制号：{{ yddxqForm.marcid }}</span>
            </div>
            <el-form-item class="item" prop="ydphao" label="预订编号">
              <el-input v-model="yddxqForm.ydbhao"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ydpcid" label="预订单">
              <el-select
                filterable
                v-model="yddxqForm.ydpcid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in yddList"
                  :key="item.ydpcid"
                  :label="item.daima"
                  :value="item.ydpcid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item"
              type="number"
              prop="ydphao"
              label="预订册数"
            >
              <el-input
                v-only-num="yddxqForm.ceshu"
                v-model="yddxqForm.ceshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ydlaiyuan" label="文献来源">
              <el-select
                filterable
                v-model="yddxqForm.ydlaiyuan"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dgSourceList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="yjhbid" label="原价货币类型">
              <el-select
                filterable
                v-model="yddxqForm.yjhbid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in hbList"
                  :key="item.hbid"
                  :label="item.hbcode"
                  :value="item.hbid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-select
                filterable
                v-model="yddxqForm.jzleixing"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in agentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="yuanjia" label="原价">
              <el-input
                v-only-num.float="yddxqForm.yuanjia"
                v-model="yddxqForm.yuanjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-select
                filterable
                v-model="yddxqForm.zdfangshi"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in agentList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ydhbid" label="预订货币类型">
              <el-select
                filterable
                v-model="yddxqForm.ydhbid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in hbList"
                  :key="item.hbid"
                  :label="item.hbcode"
                  :value="item.hbid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="juance" label="分册数量">
              <el-input v-model="yddxqForm.juance"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jiage" label="预订价">
              <el-input
                v-only-num.float="yddxqForm.jiage"
                v-model="yddxqForm.jiage"
              ></el-input>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item item__textarea"
              type="number"
              prop="fuzhu"
              label="备注"
            >
              <el-input type="textarea" v-model="yddxqForm.fuzhu"></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" type="primary" @click="saveForm('yddxqForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('yddxqForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  ydPcSearch,
  searchYdsm,
  saveYdsm,
  unsubscribeYdsm,
  ydsmDel
} from "api/acquisition";

import { hbList } from "api/public";

import { downLoadExcel } from "utils/utils";

import { YDDXQ_OPTIONS } from "utils/selectOptions";

export default {
  name: "acq_yddxq",
  data() {
    //订单号列表
    this.filterOptions = YDDXQ_OPTIONS;
    //订购来源列表
    this.dgSourceList = [
      { label: "订购", value: "订购" },
      { label: "邮购", value: "邮购" },
      { label: "交换", value: "交换" },
      { label: "赠送", value: "赠送" },
      { label: "其他", value: "其他" }
    ];
    //介质列表
    this.agentList = [
      { label: "纸张", value: "纸张" },
      { label: "数据", value: "数据" },
      { label: "微缩胶片", value: "微缩胶片" },
      { label: "录像带", value: "录像带" },
      { label: "其他", value: "其他" }
    ];
    //装帧
    this.zzlxList = [
      { label: "平装", value: "平装" },
      { label: "精装", value: "精装" },
      { label: "线装", value: "线装" }
    ];
    this.baseForm = {
      marcid: "",
      marctyid: "",
      ydpcid: "",
      ceshu: "",
      jzleixing: "",
      zdfangshi: "",
      ydbhao: "",
      ydsmid: "",
      yjhbid: "",
      ydhbid: "",
      yuanjia: "",
      jiage: "",
      juance: "",
      fuzhu: "",
      ydlaiyuan: ""
    };
    this.importFormRules = {};
    return {
      // 列表相关
      currentFilterVal: "",
      currentFilterKey: "1",
      ZDSMSelection: [],
      loadZDSMLoader: false,
      zdOrderList: [],
      zdOrderPageSize: 15,
      currentZDOrderPage: 1,
      totalZDOrderCount: 0,

      // 编辑，查看预订单信息
      showEditSide: false,
      yddList: [],
      yddxqForm: {
        ...this.baseForm
      },
      yddxqRules: {},
      hbList: []
    };
  },
  methods: {
    initZDOrderList() {
      this.getZDOrderList();
      this.currentZDOrderPage = 1;
    },
    //获取来源货币类表
    getHbList() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.hbList = res.data;
      });
    },
    //获取预订单列表
    getYddList() {
      ydPcSearch({
        pageSize: 1000,
        pageNumber: 1
      }).then(res => {
        this.yddList = res.data.dataList;
      });
    },
    handleZDSMSelectionChange(val) {
      this.ZDSMSelection = val.map(item => item.ydsmid);
    },
    rowDblclick(row) {
      this.editZDSM(row);
    },
    rowClick(row) {
      this.$refs.zdOrderList.toggleRowSelection(row);
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.showEditSide = false;
    },
    editZDSM(row) {
      this.showEditSide = true;
      this.yddxqForm = { ...row };
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          saveYdsm({
            ...this.yddxqForm
          }).then(res => {
            this.showEditSide = false;
            this.$message.success(res.message);
            this.initZDOrderList();
            this.$refs[formName].resetFields();
          });
        }
      });
    },
    //退订
    smUnsubscribe(ydsmid) {
      this.$confirm("您确认要退订该书目吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        unsubscribeYdsm({
          ydsmids: ydsmid
        }).then(() => {
          this.initZDOrderList();
        });
      });
    },
    deleteZDSM(ydsmid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        let ydsmids = "";
        if (ydsmid) {
          ydsmids = ydsmid;
        } else {
          ydsmids = this.ZDSMSelection.join(",");
        }
        ydsmDel({
          ydsmids
        })
          .then(res => {
            this.$message.success(res.message);
            this.initZDOrderList();
          })
          .catch(() => {
            this.$message.error("删除失败");
          });
      });
    },

    getZDOrderList() {
      this.loadZDSMLoader = true;
      let requestObj = {
        pageNumber: this.currentZDOrderPage,
        pageSize: this.zdOrderPageSize,
        flag: this.currentFilterKey,
        content: this.currentFilterVal.replace(/\s+/g, ""),
        ydpcid: this.$route.query.ydpcid
      };
      searchYdsm(requestObj)
        .then(res => {
          this.loadZDSMLoader = false;
          this.zdOrderList = res.data.dataList;
          this.totalZDOrderCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadZDSMLoader = false));
    },

    print() {
      let param = {
        flag: this.currentFilterKey,
        content: this.currentFilterVal.replace(/\s+/g, ""),
        ydpcid: this.$route.query.ydpcid
      };
      downLoadExcel("api/e/interview/file/ydsmE", param);
    },

    handleZDOrderSizeChange(val) {
      this.zdOrderPageSize = val;
      this.currentZDOrderPage = 1;
      this.getZDOrderList();
    },
    handleZDOrderCurrentChange(val) {
      this.currentZDOrderPage = val;
      this.getZDOrderList();
    }
  },
  mounted() {
    this.getYddList();
    this.getHbList();
    this.initZDOrderList();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.initZDOrderList();
    this.getYddList();
    this.getHbList();
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
