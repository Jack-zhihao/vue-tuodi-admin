<!--
 * @Description: 征定书目列表
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-03-16 11:09:37
 * @LastEditTime: 2020-03-10 09:34:24
 -->

<template>
  <div class="acq-zdsmlb common__content">
    <td-content-header>
      征订目录【{{ zdpcdm }}】 供应商【{{ gysName }}】
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowImportSide"
            ><icon-svg icon-class="icon-btn-ico-13" /> 导入</el-button
          >
          <el-button
            :loading="loadZdcc"
            size="mini"
            type="primary"
            @click="handleShowZdcc"
            ><icon-svg icon-class="icon-btn-ico-15" /> 征订查重</el-button
          >
          <el-button
            :disabled="multipleZDCatalogSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteZDCatalog('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
          <el-button @click="downLoadData" type="primary" size="mini"
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
            v-model="filterSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (filterSearchKey = val),
                initZDCatalogList
              )
            "
            @keydown.enter.native="delayFunc(initZDCatalogList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initZDCatalogList"
            ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="literatureTableOut">
        <el-table
          ref="literatureTable"
          @row-click="literatureClickRow"
          v-loading="loadZDCatalogData"
          @selection-change="handleZDCatalogSelectionChange"
          @row-dblclick="rowDblclick"
          border
          :data="zdCatalogList"
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
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="inLibNum" label="馆藏数">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="inYdNum" label="预订数">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="tagging" label="标注">
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.zdsmid"
                :index="scope.$index"
                :ops="['del']"
                @handleDel="deleteZDCatalog"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="
                      handleDirectDetailPage(
                        scope.row.zdpcid,
                        scope.row.zdsmid,
                        scope.row.marcid,
                        scope.row.marctyid
                      )
                    "
                  >
                    预订
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleZDCatalogSizeChange"
          @current-change="handleZDCatalogCurrentChange"
          :total="totalZDCatalogCount"
          :currentPage="currentZDCatalogPage"
          :pageSize="zdCatalogPageSize"
        ></td-pagination>
      </div>
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
            <div
              v-for="(item, index) in editTabs"
              :key="index"
              class="tit"
              :class="{ active: item.id === currentEditTab }"
              @click="currentEditTab = item.id"
            >
              {{ item.value }}
            </div>
          </div>
          <i class="el-icon-close" @click="showImportSide = false"></i>
        </div>
      </template>
      <div class="edit__content" v-show="currentEditTab === 1">
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
            <el-form-item class="item" prop="zrsming" label="著者查重">
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
                <el-button slot="trigger" size="small" type="primary"
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
      <div class="edit__content" v-show="currentEditTab === 2">
        <div class="tip">选择需要导入的Excel文件</div>
        <div>
          <el-upload
            ref="excelUpload"
            :http-request="uploadExcelFile"
            :on-change="handleMarcChange"
            action=""
            accept=".xls,.xlsx"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary"
              >选择文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="lineHeight: 1;">
              请上传excel文件
            </div>
          </el-upload>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button
              size="mini"
              type="primary"
              :loading="isLoadingReceivingData"
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
    <!-- 征订目录导入 -->
    <el-dialog
      custom-class="receive__dialog"
      title="征订目录导入"
      v-if="initReceiveDialog"
      :visible.sync="showReceiveDialog"
    >
      <el-scrollbar>
        <div class="wrapper">
          <div class="header">
            <span>征订目录：</span>
            <el-select
              filterable
              style="margin-right: 10px;"
              v-model="receiveForm.zdmlpc"
              size="small"
              disabled
              placeholder="请选择征订目录"
            >
              <el-option
                v-for="item in pcidOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <span>分编类型：</span>
            <el-select
              filterable
              v-model="receiveForm.marcfb"
              size="small"
              placeholder="请选择分编类型"
            >
              <el-option
                v-for="item in fbList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="tit">请选择查重条件</div>
          <div class="receive__form">
            <div class="receive_row form__tit">
              <div class="row__item form__tit_item">
                <span class="col col1">MARC对应字段</span>
                <span class="col col2">Excel对应字段</span>
                <span class="col col3">查重</span>
              </div>
              <div class="row__item form__tit_item">
                <span class="col1">MARC对应字段</span>
                <span class="col2">Excel对应字段</span>
                <span class="col3">查重</span>
              </div>
            </div>
            <div class="receive_row form_items">
              <div
                class="row__item form__item"
                v-for="(item, index) in formItems"
                :key="index"
              >
                <div class="col col1">{{ item.label }}</div>
                <div class="col col2">
                  <el-select
                    filterable
                    size="small"
                    clearable
                    v-model="receiveForm[item.value].value"
                    placeholder="请选择"
                  >
                    <el-option
                      v-for="item in listOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    >
                    </el-option>
                  </el-select>
                </div>
                <div class="col col3">
                  <el-checkbox
                    v-model="receiveForm[item.value].check"
                  ></el-checkbox>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button
            type="primary"
            :loading="ishandleExcelDataCheck"
            size="small"
            @click="handleExcelDataCheck"
            >查重</el-button
          >
          <el-button
            size="small"
            type="primary"
            :loading="ishandleExcelDataImport"
            @click="handleExcelDataImport"
            >导入</el-button
          >
          <el-button size="small" @click="resetExcelForm">重置</el-button>
          <el-button size="small" @click="showReceiveDialog = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 数据查重结果 -->
    <el-dialog
      :close-on-click-modal="false"
      custom-class="duplicate__dialog"
      title="数据查重结果"
      v-if="initDuplicateDialog"
      :visible.sync="showDuplicateDialog"
    >
      <div>
        <p class="tips">查重完成，共{{ duplicateData.length }}条</p>
        <el-table
          :data="duplicateData"
          ref="duplicateTable"
          @row-click="duplicateClickRow"
          border
          style="width: 100%"
          height="calc(50vh - 70px)"
          @selection-change="handleExcelSelectionChange"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
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
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbrqi" label="出版时间">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuben"
            label="本馆复本数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ydNum"
            label="本馆预订数"
          >
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button
            type="primary"
            size="small"
            :disabled="excelSelection.length === 0"
            @click="handleExcelDelRepeat"
            >删除</el-button
          >
          <el-button size="small" @click="showDuplicateDialog = false"
            >关闭</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 征订查重 -->
    <el-dialog
      custom-class="duplicate__dialog"
      title="征订查重"
      v-if="initZdccDialog"
      :visible.sync="showZdccDialog"
    >
      <div>
        <p class="tips">重复征订书目共{{ zdccData.length }}条</p>
        <el-table
          :data="zdccData"
          ref="zdccTable"
          @row-click="zdccClickRow"
          border
          style="width: 100%"
          height="calc(50vh - 50px)"
          @selection-change="handleZdccSelectionChange"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zdpcdm" label="征订书目">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbrqi" label="出版时间">
          </el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button
            type="primary"
            size="small"
            :loading="isDeletingZdcc"
            @click="deleteZdccCatalog"
            :disabled="zdccSelectedData.length === 0"
            >删除</el-button
          >
          <el-button size="small" @click="showZdccDialog = false"
            >关闭</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchZdsm,
  delZdsm,
  checkZdsmRepeat,
  reserveZdsm,
  uploadZdExcel,
  importZdsmMain,
  checkExcelRepeat,
  delRepeat
} from "api/acquisition";

import { marcImport } from "api/catalogue";

import { getMarcFbList, getZdpcList } from "api/public";

import { downLoadExcel } from "utils/utils";

export default {
  name: "acq_zdsmlb",
  data() {
    this.editTabs = [
      {
        value: "MARC导入",
        id: 1
      },
      {
        value: "Excel导入",
        id: 2
      }
    ];
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
        label: "价格"
      },
      {
        value: "5",
        label: "出版社"
      },
      {
        value: "6",
        label: "分类号"
      }
    ];
    this.formItems = [
      {
        value: "isbn",
        label: "ISBN（必）"
      },
      {
        value: "ztming",
        label: "正题名（必）"
      },
      {
        value: "zrsming",
        label: "责任者"
      },
      {
        value: "cbzhe",
        label: "出版社"
      },
      {
        value: "cbrqi",
        label: "出版时间"
      },
      {
        value: "cbdi",
        label: "出版地"
      },
      {
        value: "zti",
        label: "主题词"
      },
      {
        value: "flhao",
        label: "分类号"
      },
      {
        value: "jge",
        label: "价格"
      },
      {
        value: "yzhong",
        label: "语种"
      },
      {
        value: "yma",
        label: "页码"
      },
      {
        value: "ccun",
        label: "尺寸"
      },
      {
        value: "fzhu",
        label: "一般性附注"
      },
      {
        value: "zyao",
        label: "摘要"
      }
    ];
    this.listOptions = [
      {
        value: 1,
        label: "12"
      }
    ];
    this.receiveFormTemp = {
      zdmlpc: this.zdpcid,
      marcfb: "",
      isbn: {
        value: "",
        check: false
      },
      ztming: {
        value: "",
        check: false
      },
      zrsming: {
        value: "",
        check: false
      },
      cbzhe: {
        value: "",
        check: false
      },
      cbrqi: {
        value: "",
        check: false
      },
      cbdi: {
        value: "",
        check: false
      },
      zti: {
        value: "",
        check: false
      },
      flhao: {
        value: "",
        check: false
      },
      jge: {
        value: "",
        check: false
      },
      yzhong: {
        value: "",
        check: false
      },
      yma: {
        value: "",
        check: false
      },
      ccun: {
        value: "",
        check: false
      },
      fzhu: {
        value: "",
        check: false
      },
      zyao: {
        value: "",
        check: false
      }
    };
    return {
      isLoadingReceivingData: false,
      ishandleExcelDataCheck: false,
      ishandleExcelDataImport: false,
      // 列表相关
      zdpcdm: "",
      gysName: "",
      filterSearchKey: "",
      currentFilterKey: "1",
      multipleZDCatalogSelection: [],
      loadZDCatalogData: false,
      zdCatalogList: [],
      zdCatalogPageSize: 15,
      currentZDCatalogPage: 1,
      totalZDCatalogCount: 0,
      // 导入
      fbList: [],
      currentEditTab: 1,
      initImportSide: false,
      showImportSide: false,
      importForm: {
        certtype: "",
        ztming: "1",
        zrsming: "0",
        flhao: "0",
        isbn: "1",
        issn: "0",
        isrc: "0",
        cbzhe: "0"
      },
      // 征订目录导入
      initReceiveDialog: false,
      showReceiveDialog: false,
      receiveForm: {
        zdmlpc: "",
        marcfb: "",
        isbn: {
          value: "",
          check: false
        },
        ztming: {
          value: "",
          check: false
        },
        zrsming: {
          value: "",
          check: false
        },
        cbzhe: {
          value: "",
          check: false
        },
        cbrqi: {
          value: "",
          check: false
        },
        cbdi: {
          value: "",
          check: false
        },
        zti: {
          value: "",
          check: false
        },
        flhao: {
          value: "",
          check: false
        },
        jge: {
          value: "",
          check: false
        },
        yzhong: {
          value: "",
          check: false
        },
        yma: {
          value: "",
          check: false
        },
        ccun: {
          value: "",
          check: false
        },
        fzhu: {
          value: "",
          check: false
        },
        zyao: {
          value: "",
          check: false
        }
      },
      // Excel查重结果
      initDuplicateDialog: false,
      showDuplicateDialog: false,
      duplicateData: [],
      excelSelection: [],
      // 征订查重
      isDeletingZdcc: false,
      loadZdcc: false,
      initZdccDialog: false,
      showZdccDialog: false,
      zdccData: [],
      zdccSelectedData: []
    };
  },
  watch: {
    $route(to) {
      if (to.name !== "acq_zdsmlb") {
        return;
      }
      if (this.zdpcid !== to.query.zdpcid) {
        this.zdpcid = to.query.zdpcid;
        this.initZDCatalogList();
      }
    }
  },
  methods: {
    // 目录列表
    initZDCatalogList() {
      this.currentZDCatalogPage = 1;
      this.setRequestObj();
      this.getZDCatalogList();
    },
    literatureClickRow(row) {
      this.$refs.literatureTable.toggleRowSelection(row);
    },
    handleZDCatalogSelectionChange(val) {
      this.multipleZDCatalogSelection = val.map(item => item.zdsmid);
    },
    rowDblclick(row) {
      this.handleDirectDetailPage(
        row.zdpcid,
        row.zdsmid,
        row.marcid,
        row.marctyid
      );
    },
    downLoadData() {
      downLoadExcel("/api/e/interview/file/zdsmE", {
        zdpcid: this.zdpcid,
        flag: this.currentFilterKey,
        content: this.filterSearchKey
      });
    },
    deleteZDCatalog(ids) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadZDCatalogData = true;
          delZdsm({
            zdsmids: ids ? ids : this.multipleZDCatalogSelection.join(",")
          })
            .then(res => {
              this.$message({
                type: "success",
                message: res.message
              });
              this.initZDCatalogList();
            })
            .finally(() => {
              this.loadZDCatalogData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.filterSearchKey ? this.currentFilterKey : "",
        content: this.filterSearchKey
      };
    },
    getZDCatalogList() {
      this.loadZDCatalogData = true;

      let requestObj = {
        zdpcid: this.zdpcid,
        pageNumber: this.currentZDCatalogPage,
        pageSize: this.zdCatalogPageSize,
        ...this.requestObj
      };

      searchZdsm(requestObj)
        .then(res => {
          this.zdpcdm = res.data.zdpcdm;
          this.gysName = res.data.gysName;
          let listData = res.data.page;
          this.zdCatalogList = listData.dataList;
          this.totalZDCatalogCount = Number(listData.totalElements);
        })
        .finally(() => {
          this.loadZDCatalogData = false;
        });
    },
    handleZDCatalogSizeChange(val) {
      this.zdCatalogPageSize = val;
      this.getZDCatalogList();
    },
    handleZDCatalogCurrentChange(val) {
      this.currentZDCatalogPage = val;
      this.getZDCatalogList();
    },
    // 导入
    handleShowImportSide() {
      this.currentEditTab = 1;
      this.initImportSide = true;
      this.showImportSide = true;
      this.$nextTick(() => {
        this.resetForm("importForm");
      });
    },
    handleShowReceiveDialog() {
      if (this.currentEditTab === 1) {
        // MARC 导入
        if (this.$refs["marcUpload"].uploadFiles.length === 0) {
          this.$message.warning("请上传文件");
        } else {
          this.$refs["marcUpload"].submit();
        }
      } else {
        if (this.$refs["excelUpload"].uploadFiles.length === 0) {
          this.$message.warning("请上传文件");
        } else {
          this.$refs["excelUpload"].submit();
        }
      }
    },
    // 征订目录导入
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
        this.receiveFormTemp.marcfb = this.importForm.certtype = this.fbList[0]
          ? this.fbList[0].value
          : "";
      });
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
      let formData = new FormData();
      formData.append("zdpcid", this.zdpcid);
      formData.append("marcfbId", this.importForm.certtype);
      Object.keys(this.importForm).forEach(key => {
        if (key !== "certtype") {
          formData.append(key, this.importForm[key]);
        }
      });
      formData.append("file", params.file);
      this.isLoadingReceivingData = true;
      marcImport(formData)
        .then(res => {
          this.$message.success(res.message);
          this.showImportSide = false;
          this.initZDCatalogList();
        })
        .finally(() => {
          this.$refs["marcUpload"].clearFiles();
          this.isLoadingReceivingData = false;
        });
    },
    uploadExcelFile(params) {
      let formData = new FormData();
      formData.append("excel", params.file);
      this.isLoadingReceivingData = true;
      uploadZdExcel(formData)
        .then(res => {
          if (res.data.headList.length === 0) {
            this.$message.warning("没有找到对应的Excel字段，请检查文件内容！");
            return;
          }
          this.receiveFormTemp.zdmlpc = this.zdpcid;
          this.receiveForm = JSON.parse(JSON.stringify(this.receiveFormTemp));
          this.initReceiveDialog = true;
          this.showReceiveDialog = true;
          this.listOptions = res.data.headList.map(item => {
            return {
              label: item,
              value: item
            };
          });
          this.filePath = res.data.path;
        })
        .finally(() => {
          this.isLoadingReceivingData = false;
          this.$refs["excelUpload"].clearFiles();
        });
    },
    getExcelFormObj() {
      let requestObj = {
        path: this.filePath,
        marcfbid: this.receiveForm.marcfb,
        zdpcid: this.receiveForm.zdmlpc
      };
      for (const key in this.receiveForm) {
        if (this.receiveForm[key].value) {
          requestObj[key] =
            this.receiveForm[key].value +
            "," +
            (this.receiveForm[key].check ? 0 : 1);
        }
      }
      return requestObj;
    },
    handleExcelDataCheck() {
      if (this.receiveForm.marcfb === "") {
        this.$message.error("请选择分编类型");
        return;
      }
      if (this.receiveForm.isbn.value === "") {
        this.$message.error("ISBN Excel对应字段 未选择");
        return;
      }
      if (this.receiveForm.ztming.value === "") {
        this.$message.error("正题名 Excel对应字段 未选择");
        return;
      }
      this.ishandleExcelDataCheck = true;
      checkExcelRepeat(this.getExcelFormObj())
        .then(res => {
          this.initDuplicateDialog = true;
          this.showDuplicateDialog = true;
          this.duplicateData = res.data.repeatList;
        })
        .finally(() => {
          this.ishandleExcelDataCheck = false;
        });
    },
    handleExcelDataImport() {
      if (this.receiveForm.marcfb === "") {
        this.$message.error("请选择分编类型");
        return;
      }
      if (this.receiveForm.isbn.value === "") {
        this.$message.error("ISBN Excel对应字段 未选择");
        return;
      }
      if (this.receiveForm.ztming.value === "") {
        this.$message.error("正题名 Excel对应字段 未选择");
        return;
      }
      this.ishandleExcelDataImport = true;
      importZdsmMain(this.getExcelFormObj())
        .then(res => {
          this.$message.success(res.message);
          this.showReceiveDialog = false;
          this.showImportSide = false;
          this.initZDCatalogList();
        })
        .finally(() => {
          this.ishandleExcelDataImport = false;
        });
    },
    resetExcelForm() {
      this.receiveForm = JSON.parse(JSON.stringify(this.receiveFormTemp));
    },
    // 数据查重结果
    duplicateClickRow(row) {
      this.$refs.duplicateTable.toggleRowSelection(row);
    },
    handleExcelSelectionChange(val) {
      this.excelSelection = val.map(item => item.drid);
    },
    handleExcelDelRepeat() {
      delRepeat({
        drids: this.excelSelection.join(","),
        path: this.filePath
      }).then(res => {
        this.$message.success(res.message);
        this.filePath = res.data.path;
        this.handleExcelDataCheck();
      });
    },
    // 征订查重
    getPcList() {
      getZdpcList().then(res => {
        this.pcidOptions = res.data.map(item => {
          return {
            value: item.zdpcid,
            label: item.zdpcdm
          };
        });
      });
    },
    handleShowZdcc() {
      this.loadZdcc = true;
      this.checkZdsmRepeat();
    },
    checkZdsmRepeat() {
      checkZdsmRepeat({
        zdpcid: this.zdpcid
      })
        .then(res => {
          this.initZdccDialog = true;
          this.showZdccDialog = true;
          this.zdccData = res.data;
        })
        .finally(() => {
          this.loadZdcc = false;
        });
    },
    zdccClickRow(row) {
      this.$refs.zdccTable.toggleRowSelection(row);
    },
    handleZdccSelectionChange(vals) {
      this.zdccSelectedData = vals.map(item => item.zdsmid);
    },
    deleteZdccCatalog() {
      this.isDeletingZdcc = true;
      delZdsm({
        zdsmids: this.zdccSelectedData.join(",")
      })
        .then(res => {
          this.$message({
            type: "success",
            message: res.message
          });
          this.checkZdsmRepeat();
          this.getZDCatalogList();
        })
        .finally(() => {
          this.isDeletingZdcc = false;
        });
    },
    // 通用
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    // 前往书目预订
    handleDirectDetailPage(zdpcid, zdsmid, marcid, marctyid) {
      reserveZdsm({
        zdpcid: zdpcid,
        zdsmid: zdsmid
      }).then(() => {
        this.$router.push({
          name: "acq_smyd",
          query: {
            zdpcid,
            zdsmid,
            marcid,
            marctyid,
            from: "acq_zdsmlb"
          }
        });
      });
    }
  },
  mounted() {
    this.zdpcid = this.$route.query.zdpcid;
    this.initZDCatalogList();
    this.getPcList();
    this.getSysMarcConfigMarcFbList();
    this.$eventBus.$on("smyd-update", () => {
      this.initZDCatalogList();
    });
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.getPcList();
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("smyd-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.acq-zdsmlb {
  .custom__form {
    .item:nth-child(2n + 1) {
      justify-content: flex-start;
    }
  }

  .dialog__import {
    .tip {
      font-size: @FSize_18;
      color: @fontTintColor;
      line-height: 24px;
      margin: 24px auto;
    }
  }

  /deep/ .receive__dialog {
    width: 830px;
    .el-dialog__body {
      padding: 0;
    }
    .wrapper {
      padding: 20px 20px 10px;
    }
    .tit {
      font-weight: bold;
      font-size: @FSize_20;
      color: @fontBaseColor;
      margin: 26px 0 16px;
    }
    .receive_row {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      .row__item {
        display: flex;
        align-items: center;
        margin: 10px 0;
        flex-shrink: 0;
        .col {
          flex-shrink: 0;
        }
      }
      .col1 {
        width: 140px;
      }
      .col2 {
        width: 180px;
      }
      .col3 {
        width: 50px;
      }
      .el-selct,
      .el-input {
        width: 150px;
      }
    }
    .form__tit_item {
      font-weight: bold;
      color: @fontBaseColor;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
  }
  /deep/ .duplicate__dialog {
    width: 830px;
    .tips {
      font-size: @FSize_16;
      color: @fontTintColor;
      margin-bottom: 15px;
    }
  }
}
</style>
