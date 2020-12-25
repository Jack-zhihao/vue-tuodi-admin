<!--
 * @Description: 教材验收单详情
 * @Autor: chenming.feng
 * @Date: 2019-11-05 11:48:32
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:52:16
 -->
<template>
  <div class="acq-ysdxq common__content">
    <td-content-header>
      教材验收单详情<span v-show="yspcCode"
        >【教材验收单：{{ yspcCode }}】</span
      >
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            @click="handleDel('')"
            :disabled="multipleSelection.length === 0"
            size="mini"
            type="primary"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-button @click="downLoadData" size="mini" type="primary"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
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
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (currentFilterVal = val),
                initYSCatalogList
              )
            "
            @keydown.enter.native="delayFunc(initYSCatalogList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initYSCatalogList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadYSCatalogData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          border
          :data="YSCatalogList"
          stripe
          style="width: 100%"
          height="100%"
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
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="ydpcCode" label="预订单">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="yuanjia" label="单价">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="taojia" label="套价">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuben"
            label="复本数"
            width="55"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfangshi"
            label="装订方式"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jzleixing"
            label="介质类型"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="验收人">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="验收时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yslxing"
            label="验收类型"
          >
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.yssmid"
                :data="scope.row"
                :index="scope.$index"
                @handleEdit="handleEdit"
                @handleDel="handleDel"
                :ops="['edit', 'del']"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleYSCatalogSizeChange"
          @current-change="handleYSCatalogCurrentChange"
          :total="totalYSCatalogCount"
          :currentPage="currentYSCatalogPage"
          :pageSize="YSCatalogPageSize"
        >
        </td-pagination>
      </div>
    </div>
    <!-- 侧边栏详情 -->
    <side-wrap
      class="common__side_form"
      v-if="initDetailSide"
      v-show="showDetailSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              验收单信息
            </div>
          </div>
          <i class="el-icon-close" @click="showDetailSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="ysdDetailForm"
          class="custom__form"
          label-width="90px"
          :model="ysdDetailForm"
          :rules="formRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>验收单信息</span>
            </div>
            <el-form-item class="item" label="成员馆">
              <p style="width:230px;">{{ ysdDetailForm.libName }}</p>
            </el-form-item>
            <el-form-item class="item" label="验收单">
              <p style="width:230px;">{{ ysdDetailForm.yspcCode }}</p>
            </el-form-item>
            <el-form-item class="item" label="书目控制号">
              <p style="width:230px;">{{ ysdDetailForm.marcid }}</p>
            </el-form-item>
            <el-form-item class="item" label="预订编号">
              <p style="width:230px;">{{ ysdDetailForm.ydbhao }}</p>
            </el-form-item>
            <el-form-item class="item" label="原价货币类型" prop="yjhbid">
              <el-select
                filterable
                @change="handleConvertHlv"
                v-model="ysdDetailForm.yjhbid"
                placeholder="请选择货币类型"
              >
                <el-option
                  v-for="item in moneyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="文献来源" prop="ydlaiyuan">
              <el-select
                filterable
                v-model="ysdDetailForm.ydlaiyuan"
                placeholder="请选择文献来源"
              >
                <el-option
                  v-for="item in dglyOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="原价" prop="yuanjia">
              <el-input
                @blur="handleConvertHlv"
                v-only-num.float="ysdDetailForm.yuanjia"
                v-model="ysdDetailForm.yuanjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="介质类型" prop="jzleixing">
              <el-select
                filterable
                v-model="ysdDetailForm.jzleixing"
                placeholder="请选择介质类型"
              >
                <el-option
                  v-for="item in jzlxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="预订货币类型" prop="ydhbid">
              <el-select
                filterable
                @change="handleConvertHlv"
                v-model="ysdDetailForm.ydhbid"
                placeholder="请选择货币类型"
              >
                <el-option
                  v-for="item in moneyTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="装订方式" prop="zdfangshi">
              <el-select
                filterable
                v-model="ysdDetailForm.zdfangshi"
                placeholder="请选择装订方式"
              >
                <el-option
                  v-for="item in zzfsOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="预订价" prop="ydjge">
              <el-input
                v-only-num.float="ysdDetailForm.ydjge"
                v-model="ysdDetailForm.ydjge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="分册数量" prop="juance">
              <el-input
                @blur="calculateTaojia"
                v-only-num="ysdDetailForm.juance"
                v-model="ysdDetailForm.juance"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="册价" prop="cejia">
              <el-input
                @blur="calculateTaojia"
                v-only-num.float="ysdDetailForm.cejia"
                v-model="ysdDetailForm.cejia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="验收册数" prop="fuben">
              <el-input
                v-only-num="ysdDetailForm.fuben"
                v-model="ysdDetailForm.fuben"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="套价" prop="taojia">
              <el-input
                v-only-num.float="ysdDetailForm.taojia"
                v-model="ysdDetailForm.taojia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="索书号" prop="sshao">
              <el-input v-model="ysdDetailForm.sshao"></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              label="预订记录"
              prop="ydRecord"
              v-if="ysdDetailForm.yslxing !== '直接验收'"
            >
              <el-input readonly v-model="ysdDetailForm.ydRecord"></el-input>
            </el-form-item>
            <el-form-item
              class="item item__textarea"
              label="备注"
              prop="beizhu"
            >
              <el-input
                v-model="ysdDetailForm.beizhu"
                type="textarea"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('ysdDetailForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              :loading="isSaveYssm"
              size="mini"
              type="primary"
              @click="submitForm('ysdDetailForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showDetailSide = false"
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
  WXLYUAN_OPTIONS,
  JZLEIXING_OPTIONS,
  ZDFANGSHI_OPTIONS
} from "utils/variables";

import { hbList } from "api/public";

import {
  searchYssm,
  delYssm,
  saveYssm,
  getYscurSshao,
  convertHlv
} from "api/acquisition";

import { downLoadExcel } from "utils/utils";

export default {
  name: "acq_ysdxq",
  data() {
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    this.filterOptions = [
      {
        value: "1",
        label: "ISBN"
      },
      {
        value: "2",
        label: "正题名"
      },
      {
        value: "3",
        label: "责任者"
      },
      {
        value: "4",
        label: "出版社"
      },
      {
        value: "5",
        label: "分类号"
      },
      {
        value: "6",
        label: "预订批号"
      },
      {
        value: "7",
        label: "验收人"
      },
      {
        value: "9",
        label: "装订方式"
      },
      {
        value: "10",
        label: "介质类型"
      },
      {
        value: "11",
        label: "价格"
      }
    ];
    this.formRules = {
      yuanjia: [{ required: true, message: "原价不能为空", trigger: "blur" }],
      fuben: [{ required: true, message: "验收册数不能为空", trigger: "blur" }],
      taojia: [{ required: true, message: "套价不能为空", trigger: "blur" }],
      cejia: [{ required: true, message: "册价不能为空", trigger: "blur" }]
    };
    return {
      // 列表相关
      yspcCode: "",
      multipleSelection: [],
      currentFilterKey: "1",
      loadYSCatalogData: false,
      YSCatalogList: [],
      currentFilterVal: "",
      YSCatalogPageSize: 15,
      currentYSCatalogPage: 1,
      totalYSCatalogCount: 0,
      // 侧边栏
      isSaveYssm: false,
      initDetailSide: false,
      showDetailSide: false,
      moneyTypeOptions: [],
      ysdDetailForm: {}
    };
  },
  watch: {
    $route(to) {
      if (to.name !== "acq_jcysdxq") {
        return;
      }
      if (to.query.yspcid !== this.yspcid) {
        this.yspcid = to.query.yspcid;
        this.initYSCatalogList();
      }
    }
  },
  methods: {
    // 征订目录列表
    downLoadData() {
      downLoadExcel("/api/e/interview/file/yssmE", {
        yspcid: this.yspcid,
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      });
    },
    handleEdit(id, index, data) {
      this.initDetailSide = true;
      this.showDetailSide = true;
      this.$nextTick(() => {
        this.ysdDetailFormOrigin = Object.assign({}, data);
        this.ysdDetailForm = data;

        getYscurSshao({
          marcid: data.marcid
        }).then(res => {
          this.ysdDetailForm.sshao = res.data.sshao;
        });

        this.$refs["ysdDetailForm"].clearValidate();
      });
    },
    handleDel(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delYssm({
            yssmids: ids ? ids : this.multipleSelection.join(",")
          }).then(res => {
            this.$message.success(res.message);
            this.getYSCatalogList();
          });
        })
        .catch(() => {});
    },
    rowDblclick(row) {
      this.handleEdit("", "", row);
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val.map(role => role.yssmid);
    },
    initYSCatalogList() {
      this.currentYSCatalogPage = 1;
      this.setRequestObj();
      this.getYSCatalogList();
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      };
    },
    getYSCatalogList() {
      this.loadYSCatalogData = true;

      let requestObj = {
        yspcid: this.yspcid,
        pageNumber: this.currentYSCatalogPage,
        pageSize: this.YSCatalogPageSize,
        ...this.requestObj
      };

      searchYssm(requestObj)
        .then(res => {
          this.loadYSCatalogData = false;
          this.YSCatalogList = res.data.dataList || [];
          if (this.YSCatalogList.length > 0) {
            this.yspcCode = this.YSCatalogList[0].yspcCode;
          }
          this.totalYSCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadYSCatalogData = false;
        });
    },
    handleYSCatalogSizeChange(val) {
      this.YSCatalogPageSize = val;
      this.getYSCatalogList();
    },
    handleYSCatalogCurrentChange(val) {
      this.currentYSCatalogPage = val;
      this.getYSCatalogList();
    },
    // 快捷验收
    handleConvertHlv() {
      convertHlv({
        fromHbId: this.ysdDetailForm.yjhbid,
        toHbId: this.ysdDetailForm.ydhbid,
        fromMoney: this.ysdDetailForm.yuanjia
      }).then(res => {
        this.ysdDetailForm.ydjge = Number(res.data.toMoney).toFixed(2);
      });
    },
    calculateTaojia() {
      let count = Number(this.ysdDetailForm.juance) || 0;
      let cejia = Number(this.ysdDetailForm.cejia) || 0;
      this.ysdDetailForm.taojia = count * cejia;
    },
    getMoneyTypeOptions() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.moneyTypeOptions = res.data.map(item => {
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
      });
    },
    resetForm() {
      this.$refs["ysdDetailForm"].clearValidate();
      this.ysdDetailForm = Object.assign({}, this.ysdDetailFormOrigin);
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.saveYssm();
        } else {
          return false;
        }
      });
    },
    saveYssm() {
      this.isSaveYssm = true;
      saveYssm(this.ysdDetailForm)
        .then(res => {
          this.gcAllotList = [];
          this.$message.success(res.message);
          this.initYSCatalogList();
        })
        .finally(() => {
          this.isSaveYssm = false;
          this.showDetailSide = false;
        });
    }
  },
  mounted() {
    this.yspcid = this.$route.query.yspcid;
    this.initYSCatalogList();
    this.getMoneyTypeOptions();
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.$refs["focusInput"].focus();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
