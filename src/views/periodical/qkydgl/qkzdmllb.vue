<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-10 17:16:11
 * @LastEditTime: 2020-03-11 10:01:05
 -->

<template>
  <div class="per-qkzdmlyd common__content">
    <td-content-header>
      征订目录列表
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowKjyd">
            快捷预订</el-button
          >
          <el-button size="mini" type="primary" @click="handleShowImportSide"
            ><icon-svg icon-class="icon-btn-ico-13" /> MARC导入</el-button
          >
          <el-button size="mini" type="primary" @click="handleMarcAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleZdmlSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteZdml('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-button size="mini" type="primary" @click="downLoadData"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <el-scrollbar>
        <div class="top">
          <div class="content__header">
            <div class="header__line">
              <el-select
                filterable
                class="group__filter_type"
                size="mini"
                v-model="currentZdmlFilterKey"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdmlFilterOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                size="mini"
                clearable
                class="group__filter_value"
                v-model="zdmlSearchKey"
                placeholder="请输入搜索关键词"
                ref="focusInput"
                @keydown.enter.native="initZdmlList"
              ></el-input>
              <el-button type="primary" size="mini" @click="initZdmlList"
                ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
              >
            </div>
          </div>
          <div class="content__table" style="height: calc(50vh - 56px - 52px);">
            <el-table
              v-loading="loadZdmlData"
              ref="zdmlTable"
              @row-click="zdmlClickRow"
              @row-dblclick="zdmlDblclick"
              @selection-change="handleZdmlSelectionChange"
              border
              :data="zdmlList"
              stripe
              highlight-current-row
              @current-change="handleZdmlRowChange"
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
                prop="issn"
                label="ISSN"
                width="145"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="flhao"
                label="分类号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztming"
                min-width="115"
                label="正题名"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zrsming"
                label="责任者"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzhe"
                label="出版社"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="dghao"
                label="订购号"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzqi"
                label="出版周期"
                width="70"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="qkjge"
                label="价格"
                width="87"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yma"
                label="页数"
                width="60"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="biaozhu"
                label="标注"
              >
              </el-table-column>
              <el-table-column label="操作" width="45" fixed="right">
                <template slot-scope="scope">
                  <td-action-tool
                    :id="scope.row.zdsmid"
                    :data="scope.row"
                    :index="scope.$index"
                    :ops="['del']"
                    @handleDel="deleteZdml"
                  >
                    <template v-slot:menus>
                      <div
                        class="menu"
                        @click="
                          handleMarcEdit(scope.row.marcid, scope.row.marctyid)
                        "
                      >
                        编目
                      </div>
                    </template>
                  </td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>

          <div class="content__page">
            <td-pagination
              @size-change="handleZdmlSizeChange"
              @current-change="handleZdmlCurrentChange"
              :total="totalZdmlCount"
              :currentPage="currentZdmlPage"
              :pageSize="zdmlPageSize"
            ></td-pagination>
          </div>
        </div>
        <div class="bottom">
          <td-content-header>
            订购记录
            <template v-slot:btns>
              <div class="header__ops">
                <el-button size="mini" type="primary" @click="handleYDAdd"
                  ><icon-svg icon-class="icon-btn-ico-" /> 新订</el-button
                >
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="multipleZdmlSelection.length === 0"
                  @click="renewMarcOrder"
                  ><icon-svg icon-class="icon-btn-ico-" /> 续订</el-button
                >
                <el-button
                  :disabled="multipleMarcListSelection.length === 0"
                  size="mini"
                  type="primary"
                  @click="deleteMarcList('')"
                  ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
                >
              </div>
            </template>
          </td-content-header>
          <el-table
            v-loading="loadMarcListData"
            border
            :data="marcList"
            stripe
            style="width: 100%"
            ref="marcTable"
            @row-click="marcClickRow"
            @row-dblclick="marcDblclick"
            @selection-change="handleMarcListSelectionChange"
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
              prop="libDaima"
              label="成员馆代码"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ydbhao"
              label="预订编号"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="gysCode"
              label="供应商代码"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="yusuanDaima"
              label="预算代码"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="cbzq"
              label="出版周期"
              width="70"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zongqi"
              label="订购期数"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="ceshu"
              label="预订数量"
            >
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="jiage" label="单价">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="username"
              label="预订人"
            >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="optime"
              label="预订日期"
            >
            </el-table-column>
            <el-table-column label="操作" width="45">
              <template slot-scope="scope">
                <td-action-tool
                  :id="scope.row.qkydsmid"
                  :data="scope.row"
                  :index="scope.$index"
                  :ops="['del', 'edit', 'discontinue']"
                  @handleEdit="checkZdmlDetail"
                  @handleDel="deleteMarcList"
                  @handleDiscontinue="stopZdml"
                ></td-action-tool>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-scrollbar>
    </div>
    <!-- 接收-导入 -->
    <side-wrap
      class="dialog__import common__side_form"
      v-if="initImportSide"
      v-show="showImportSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              MARC导入
            </div>
          </div>
          <i class="el-icon-close" @click="showImportSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <div class="tip">
          支持字符集为：UTF-16LE、UTF-16BE、ANSI、GBK，UTF-8字符集编码的文件导入，其他编码的文件请先转码再导入！
        </div>
        <div>
          <el-form
            class="custom__form"
            ref="importForm"
            :model="importForm"
            label-width="100px"
            size="mini"
          >
            <el-form-item class="item" prop="certtype" label="分编类型">
              <el-select
                filterable
                v-model="importForm.certtype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in fbList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ztming" label="正题名查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.ztming"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="zrsming" label="责任者查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.zrsming"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="flhao" label="分类号查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.flhao"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="isbn" label="ISBN查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.isbn"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="issn" label="ISSN查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.issn"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="isrc" label="ISRC查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.isrc"
              ></el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="cbzhe" label="出版社查重">
              <el-checkbox
                true-label="1"
                false-label="0"
                v-model="importForm.cbzhe"
              ></el-checkbox>
            </el-form-item>
            <el-form-item>
              <el-upload
                ref="marcUpload"
                action=""
                accept=".iso"
                :http-request="uploadMarcFile"
                :on-change="handleMarcChange"
                :before-upload="beforeMarcUpload"
                :auto-upload="false"
              >
                <el-button slot="trigger" size="mini" type="primary"
                  >选择文件</el-button
                >
                <div slot="tip" class="el-upload__tip" style="lineHeight: 1;">
                  请上传iso文件
                </div>
              </el-upload>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              type="primary"
              :loading="uploadingMarcData"
              @click="handleShowReceiveDialog"
              >导入</el-button
            >
            <el-button size="mini" @click="showImportSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 下载模板 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="showAddSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              模板下载
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm"></i>
        </div>
      </template>
      <div class="edit__content">
        <div class="header" style="marginTop:15px">
          <span>征订目录：</span>
          <el-select
            filterable
            style="margin-right: 10px;"
            v-model="receiveForm.zdmlpc"
            size="mini"
            placeholder="请选择征订目录"
            disabled
          >
            <el-option
              v-for="item in pcidOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <span style="marginTop:10px">分编类型：</span>
          <el-select
            filterable
            v-model="receiveForm.marcfb"
            size="mini"
            placeholder="请选择分编类型"
          >
            <el-option
              v-for="item in fbListArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="tip">选择需要导入的Excel文件</div>
        <div>
          <el-upload
            ref="excelUpload"
            :http-request="uploadExcelFile"
            :on-change="handleExcelFile"
            action=""
            accept=".xls,.xlsx"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </div>
        <span style="lineHeight: 2;">导入模板下载</span>
        <div class="literatureAddForm">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group
            v-model="checkedZiDuan"
            @change="handleCheckedCitiesChange"
          >
            <el-checkbox
              v-for="ziduan in ziduans"
              :label="ziduan"
              :key="ziduan"
              class="checkbox"
              :disabled="jinyong(ziduan)"
              >{{ ziduan }}</el-checkbox
            >
          </el-checkbox-group>
          <el-button
            slot="trigger"
            size="mini"
            type="primary"
            @click="loadMoudle"
            >下载模板</el-button
          >
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" @click="submitForm" type="primary"
              >导入</el-button
            >
            <el-button size="mini" @click="cancelForm">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  getZdmllbList,
  delZdmllb,
  getMarcOrderList,
  delYdsm,
  stopYdsm,
  zdmllbExportExcel,
  kjydExcel,
  kjydMould,
  getZdmlydList
} from "api/periodical";

import { downLoadExcel } from "utils/utils";

import { getMarcFbList } from "api/public";

import { QKZDMLLB_OPTIONS } from "utils/selectOptions";

import { marcImport } from "api/catalogue";
const ziduanOptions = [
  "正题名",
  "订购号",
  "预订数量",
  "出版周期",
  "预订单价",
  "预订年价",
  "预定部门",
  "ISSN",
  "订购期数",
  "责任者",
  "出版社",
  "供应商代码",
  "统一书刊号",
  "备注"
];
export default {
  name: "per_qkzdmllb",
  data() {
    this.zdmlFilterOptions = QKZDMLLB_OPTIONS;
    this.formItems = [
      {
        value: "tming",
        label: "正题名(必)"
      },
      {
        value: "ztming",
        label: "预订单价(必)"
      },
      {
        value: "zrsming",
        label: "出版周期(必)"
      },
      {
        value: "cbzhe",
        label: "预订年价(必)"
      },
      {
        value: "cbrqi",
        label: "预订数量(必)"
      },
      {
        value: "cbdi",
        label: "供应商代码"
      },
      {
        value: "zti",
        label: "订购号"
      },
      {
        value: "flhao",
        label: "ISSN"
      },
      {
        value: "jge",
        label: "统一书刊号"
      },
      {
        value: "yzhong",
        label: "记到地点"
      },
      {
        value: "yma",
        label: "订购期数"
      },
      {
        value: "ccun",
        label: "出版社"
      },
      {
        value: "fzhu",
        label: "责任者"
      }
    ];
    return {
      // 目录列表相关
      multipleZdmlSelection: [],
      currentZdmlFilterKey: "issn",
      zdmlSearchKey: "",
      loadZdmlData: false,
      // 复选框判断是否包含必选
      flagCheckbox: true,
      zdmlList: [],
      totalZdmlCount: 0,
      currentZdmlPage: 1,
      zdmlPageSize: 15,
      // 导入
      initImportSide: false,
      showImportSide: false,
      uploadingMarcData: false,
      importForm: {
        certtype: "",
        ztming: "1",
        zrsming: "0",
        flhao: "0",
        isbn: "0",
        issn: "1",
        isrc: "0",
        cbzhe: "0"
      },
      // 订购记录
      marcList: [],
      loadMarcListData: false,
      multipleMarcListSelection: [],
      receiveForm: {
        zdmlpc: "",
        marcfb: "",
        tming: {
          value: ""
        },
        ztming: {
          value: ""
        },
        zrsming: {
          value: ""
        },
        cbzhe: {
          value: ""
        },
        cbrqi: {
          value: ""
        },
        cbdi: {
          value: ""
        },
        zti: {
          value: ""
        },
        flhao: {
          value: ""
        },
        jge: {
          value: ""
        },
        yzhong: {
          value: ""
        },
        yma: {
          value: ""
        },
        ccun: {
          value: ""
        },
        fzhu: {
          value: ""
        }
      },
      pcidOptions: [],
      fbListArr: [],
      showAddSide: false,
      literatureAddForm: {},
      checkAll: false,
      checkedZiDuan: [
        "正题名",
        "订购号",
        "预订数量",
        "出版周期",
        "预订单价",
        "预订年价"
      ],
      ziduans: ziduanOptions,
      isIndeterminate: true
    };
  },
  watch: {
    $route(to) {
      if (to.name !== "per_qkzdmllb") {
        return;
      }
      if (this.zdpcid !== to.query.zdpcid) {
        this.zdpcid = to.query.zdpcid;
        this.initZdmlList();
      }
    }
  },
  activated() {
    this.$refs["focusInput"].focus();
    this.getSysMarcConfigMarcFbList();
    this.zdpcList();
  },
  mounted() {
    this.zdpcid = this.$route.query.zdpcid;
    this.initZdmlList();
    this.getSysMarcConfigMarcFbList();
    this.zdpcList();
    this.$eventBus.$on("jdbm-update", () => {
      this.initZdmlList();
    });
    this.$eventBus.$on("qkyd-update", () => {
      if (this.marcid) {
        this.getMarcOrderList();
      }
    });
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
    this.$eventBus.$off("qkyd-update");
  },
  methods: {
    // 目录列表相关
    handleMarcAdd() {
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "per_qkzdmllb",
          isQk: 1,
          zdpcid: this.zdpcid
        }
      });
    },
    handleMarcEdit(marcid, marctyid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marcid,
          marctyid,
          isQk: 1,
          zdpcid: this.zdpcid,
          from: "per_qkzdmllb"
        }
      });
    },
    initZdmlList() {
      this.currentZdmlPage = 1;
      this.setRequestObj();
      this.getZdmlList();
      this.marcList = [];
    },
    handleZdmlRowChange(row) {
      if (row) {
        this.marcid = row.marcid;
        this.marctyid = row.marctyid;
        this.getMarcOrderList();
      } else {
        this.marcid = "";
        this.marctyid = "";
      }
    },
    zdmlDblclick(row) {
      this.handleMarcEdit(row.marcid, row.marctyid);
    },
    zdmlClickRow(row) {
      this.$refs.zdmlTable.toggleRowSelection(row);
    },
    handleZdmlSelectionChange(val) {
      this.multipleZdmlSelection = val.map(item => item.zdsmid);
      this.multipleZdmlSelectionMarctyids = val.map(item => item.marctyid);
    },
    deleteZdml(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadZdmlData = true;
          delZdmllb({
            zdsmids: ids ? ids : this.multipleZdmlSelection.join(","),
            marctyIds: ids ? ids : this.multipleZdmlSelectionMarctyids.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initZdmlList();
            })
            .finally(() => {
              this.loadZdmlData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        zdpcid: this.zdpcid
      };
      this.requestObj[this.currentZdmlFilterKey] = this.zdmlSearchKey;
    },
    getZdmlList() {
      this.loadZdmlData = true;

      let requestObj = {
        pageNumber: this.currentZdmlPage,
        pageSize: this.zdmlPageSize,
        ...this.requestObj
      };

      getZdmllbList(requestObj)
        .then(res => {
          this.zdmlList = res.data.dataList;
          this.totalZdmlCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadZdmlData = false;
        });
    },
    handleZdmlSizeChange(val) {
      this.zdmlPageSize = val;
      this.getZdmlList();
    },
    handleZdmlCurrentChange(val) {
      this.currentZdmlPage = val;
      this.getZdmlList();
    },
    // 订购记录
    getMarcOrderList() {
      this.loadMarcListData = true;
      getMarcOrderList({
        marcid: this.marcid
      })
        .then(res => {
          this.marcList = res.data;
        })
        .finally(() => {
          this.loadMarcListData = false;
        });
    },
    marcDblclick(row) {
      this.checkZdmlDetail(row.qkydsmid);
    },
    marcClickRow(row) {
      this.$refs.marcTable.toggleRowSelection(row);
    },
    handleMarcListSelectionChange(val) {
      this.multipleMarcListSelection = val.map(item => item.qkydsmid);
    },
    renewMarcOrder() {
      if (!this.marcid) {
        this.$message("请先选择一个书目进行续订");
        return;
      }
      this.checkZdmlDetail("", "", "", 1);
    },
    checkZdmlDetail(qkydsmid, index, data, type) {
      if (type !== 1) {
        type = 2;
      }
      this.$router.push({
        name: "per_qkyd",
        query: {
          marctyid: this.marctyid,
          qkydsmid: qkydsmid,
          marcid: this.marcid,
          zdpcid: this.zdpcid,
          type: type, // 1为续订，2为获取单个记录
          from: "per_qkzdmllb"
        }
      });
    },
    deleteMarcList(ids) {
      this.$confirm("删除记录时，关联的记录将会同删除，是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarcListData = true;
          delYdsm({
            qkydsmids: ids ? ids : this.multipleMarcListSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getMarcOrderList();
            })
            .finally(() => {
              this.loadMarcListData = false;
            });
        })
        .catch(() => {});
    },
    stopZdml(id) {
      this.$confirm("确定要停订么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarcListData = true;
          stopYdsm({
            qkydsmid: id
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.getMarcOrderList();
            })
            .finally(() => {
              this.loadMarcListData = false;
            });
        })
        .catch(() => {});
    },
    handleYDAdd() {
      if (!this.marcid) {
        this.$message("请先选择一个书目操作");
        return;
      }
      this.$router.push({
        name: "per_qkyd",
        query: {
          marctyid: this.marctyid,
          marcid: this.marcid,
          zdpcid: this.zdpcid,
          from: "per_qkzdmllb"
        }
      });
    },
    // 导入
    getSysMarcConfigMarcFbList() {
      getMarcFbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.fbList = res.data
          ? res.data.map(item => {
              return {
                label: item.leixing,
                value: item.marcfbid
              };
            })
          : [];
        this.importForm.certtype = this.fbList[0] ? this.fbList[0].value : "";
        this.fbListArr = res.data
          ? res.data.map(item => {
              return {
                label: item.leixing,
                value: item.marcfbid
              };
            })
          : [];
        this.receiveForm.marcfb = this.fbListArr[0]
          ? this.fbListArr[0].value
          : "";
      });
    },
    handleShowImportSide() {
      this.initImportSide = true;
      this.showImportSide = true;
      this.$nextTick(() => {
        this.$refs["importForm"].resetFields();
      });
    },
    handleShowReceiveDialog() {
      if (this.$refs.excelUpload.uploadFiles.length) {
        this.$refs["marcUpload"].submit();
      } else {
        this.$message.warning("请上传iso文件");
      }
    },
    handleMarcChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    beforeMarcUpload(file) {
      if (
        file.name
          .split(".")
          .pop()
          .toUpperCase() !== "ISO"
      ) {
        this.$message.error("请上传iso格式的文件");
        return false;
      }
      return true;
    },
    uploadMarcFile(params) {
      this.uploadingMarcData = true;
      let formData = new FormData();
      formData.append("zdpcid", this.zdpcid);
      formData.append("marcfbId", this.importForm.certtype);
      formData.append("file", params.file);
      formData.append("isQk", 1);
      Object.keys(this.importForm).forEach(key => {
        if (key !== "certtype") {
          formData.append(key, this.importForm[key]);
        }
      });
      marcImport(formData)
        .then(res => {
          this.$message.success(res.message);
          this.showImportSide = false;
          this.initZdmlList();
        })
        .finally(() => {
          this.uploadingMarcData = false;
          this.$refs["marcUpload"].clearFiles();
        });
    },
    downLoadData() {
      let requestObj = {
        zdpcid: this.zdpcid
      };
      requestObj[this.currentZdmlFilterKey] = this.zdmlSearchKey;
      downLoadExcel(zdmllbExportExcel(), requestObj);
    },
    // 打开侧边栏
    handleShowKjyd() {
      this.showAddSide = true;
    },
    // 关闭侧边栏
    cancelForm() {
      this.showAddSide = false;
    },
    // 导入
    submitForm() {
      if (this.$refs.excelUpload.uploadFiles.length) {
        this.$refs["excelUpload"].submit();
      } else {
        this.$message.warning("请选择需要导入的Excel文件");
      }
    },
    handleCheckAllChange(val) {
      this.checkedZiDuan = val
        ? ziduanOptions
        : ["正题名", "订购号", "预订数量", "出版周期", "预订单价", "预订年价"];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.ziduans.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.ziduans.length;
    },
    uploadExcelFile(params) {
      let formData = new FormData();
      formData.append("excel", params.file);
      formData.append("zdpcid", this.$route.query.zdpcid);
      formData.append("marcfbid", this.receiveForm.marcfb);
      kjydExcel(formData).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.showAddSide = false;
        }
      });
    },
    handleExcelFile(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    zdpcList() {
      getZdmlydList({
        pageNumber: 1,
        pageSize: 9999,
        libid: this.$store.getters.userInfo.libId
      }).then(res => {
        let value = "";
        this.pcidOptions = res.data.dataList.map(item => {
          if (this.$route.query.zdpcid === item.zdpcid) {
            value = item.zdpcid;
          }
          return {
            value: item.zdpcid,
            label: item.zdpcdm
          };
        });
        this.receiveForm.zdmlpc = value
          ? value
          : this.pcidOptions[0]
          ? this.pcidOptions[0].value
          : "";
      });
    },
    loadMoudle() {
      downLoadExcel(kjydMould(), {
        headers: this.checkedZiDuan.join()
      });
    },
    jinyong(val) {
      return [
        "正题名",
        "订购号",
        "预订单价",
        "出版周期",
        "预订数量",
        "预订年价"
      ].includes(val);
    }
  }
};
</script>

<style lang="less" scoped>
// @import "~styles/commonContent.less";
@import "~styles/commonStyle.less";
.content {
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .top {
    border-bottom: 1px solid @borderColor;
  }
}

.dialog__import {
  .tip {
    font-size: @FSize_18;
    color: @fontTintColor;
    line-height: 24px;
    margin: 14px auto;
  }
}

.checkbox {
  width: 20%;
  margin-bottom: 15px;
}

.literatureAddForm {
  border: 1px solid #c8d3df;
  padding: 10px;
  height: 290px;
}
</style>
