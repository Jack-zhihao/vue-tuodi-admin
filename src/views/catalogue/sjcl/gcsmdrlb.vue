<!--
 * @Description: 馆藏书目导入列表
 * @Date: 2020-02-17 11:33:16
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 15:04:19
 -->

<template>
  <div class="cat-gcsmdrlb common__content">
    <td-content-header>
      导入批次【{{ $route.query.batchCode }}】书目信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowImportDialog"
            ><icon-svg icon-class="icon-btn-ico-13" /> 导入</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <!-- 书目信息 -->
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
            v-model="searchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (searchKey = val),
                initDataList
              )
            "
            @keydown.enter.native="delayFunc(initDataList)"
          ></el-input>
          <el-button type="primary" size="mini" @click="initDataList">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
        </div>
      </div>
      <div class="content__table percent_6" ref="dataTable">
        <el-table
          v-loading="loadingData"
          ref="catalogueTable"
          border
          @current-change="currentRowChange"
          :data="dataList"
          stripe
          style="width: 100%;"
          height="100%"
          highlight-current-row
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
            width="80"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN/ISSN"
            width="145"
          >
            <template slot-scope="scope">
              {{ scope.row.isbn || scope.row.issn }}
            </template>
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
          <el-table-column show-overflow-tooltip prop="ftming" label="副题名">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="70"
            prop="cbrqi"
            label="出版日期"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="50"
            prop="ccun"
            label="尺寸"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="85"
            prop="jge"
            label="价格"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fjming" label="分辑名">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="55"
            prop="fjhao"
            label="分辑号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            width="70"
            prop="yma"
            label="页数"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="userName" label="操作员">
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalDataCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>

      <!-- 馆藏信息 -->
      <td-content-header>
        馆藏信息
      </td-content-header>
      <div class="content__table percent_4_0" ref="dataTable">
        <el-table
          v-loading="loadCollectionData"
          ref="collectionTable"
          border
          :data="collectionData"
          stripe
          style="width: 100%;"
          height="100%"
        >
          <el-table-column
            type="index"
            label=" "
            align="center"
            width="30"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="tiaoma"
            label="条形码"
            min-width="110"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="propertyLibName"
            label="财产馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="propertySiteName"
            label="财产馆藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="现在馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="siteName"
            label="现在馆藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="馆藏状态"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cejia"
            label="册价"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="taojia"
            label="套价"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="batchCode"
            label="批次"
            width="110"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jzleixing"
            label="介质类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zdfangshi"
            label="装订方式"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcmshu"
            label="卷册描述"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="入库日期"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="入库人"
            width="70"
          ></el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 馆藏书目导入 -->
    <el-dialog
      title="馆藏书目导入"
      :visible.sync="importBatchVisible"
      width="690px"
    >
      <el-form
        ref="importForm"
        :model="importForm"
        size="mini"
        label-width="110px"
        class="custom__form"
      >
        <p class="tit" style="margin:0 0 10px;">导入信息</p>
        <el-form-item class="item" label="MARC类型">
          <el-select v-model="importForm.marclxid" placeholder="请选择">
            <el-option
              v-for="item in marcOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="item" label="数据文件">
          <el-upload
            ref="fileUpload"
            action=""
            accept=".iso,.txt"
            :http-request="uploadFile"
            :before-upload="beforeAvatarUpload"
            :on-change="handleFileChange"
            :auto-upload="false"
          >
            <el-button :disabled="importingData" slot="trigger" type="primary"
              >选择文件</el-button
            >
            <div slot="tip" class="el-upload__tip" style="line-height: 1.3;">
              支持字符集为UTF-16LE、UTF-16BE、ANSI、GBK，UTF-8字符集编码的iso、txt格式的MARC数据文件，其他编码的文件请先转码再导入！单次最大上传文件大小不超过
              10 MB。
            </div>
          </el-upload>
        </el-form-item>
        <el-form-item class="item" label="">
          <div v-if="importTotal && importTotal > 0">
            <p>状态：{{ importStatus }}</p>
            <p style="display: flex;align-items: center;">
              进度：<el-progress
                :text-inside="true"
                :stroke-width="16"
                style="width: 90%;"
                :percentage="+((importCount / importTotal) * 100).toFixed(2)"
              ></el-progress>
            </p>
          </div>
        </el-form-item>
        <el-form-item class="item" label="查重方式">
          <el-checkbox-group v-model="importForm.checkList">
            <el-checkbox label="ztming">正题名查重</el-checkbox>
            <el-checkbox label="zrsming">责任者查重</el-checkbox>
            <el-checkbox label="flhao">分类号查重</el-checkbox>
            <el-checkbox label="cbzhe">出版社查重</el-checkbox>
            <el-checkbox label="isbn">ISBN查重</el-checkbox>
            <el-checkbox label="issn">ISSN查重</el-checkbox>
            <el-checkbox label="isrc">ISRC查重</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <p class="tit" style="margin:0 0 10px;">书目处理</p>
        <el-form-item class="item" label="书目查重多条时">
          <el-select
            v-model="importForm.isCheck"
            placeholder="请选择"
            @change="checkIsDealDisable"
          >
            <el-option
              v-for="item in isCheckOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          class="item"
          v-show="showIsDealOptions"
          label="书目重复时"
        >
          <el-select v-model="importForm.isDeal" placeholder="请选择">
            <el-option
              v-for="item in isDealOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" :loading="importingData" @click="submitForm"
          >保 存</el-button
        >
        <el-button @click="importBatchVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 导入结果 -->
    <el-dialog
      title="导入结果"
      :visible.sync="importResultVisible"
      width="690px"
    >
      <div class="item__list" style="font-size: 0;">
        <div
          class="item"
          style="display:inline-block;fontSize: 16px;lineHeight: 26px;width:50%"
        >
          书目导入成功：{{ importRes.catalogSuccess }}
        </div>
        <div
          class="item"
          style="display:inline-block;fontSize: 16px;lineHeight: 26px;width:50%"
        >
          馆藏导入成功：{{ importRes.bookSuccess }}
        </div>
        <div
          class="item"
          style="display:inline-block;fontSize: 16px;lineHeight: 26px;width:50%"
        >
          书目导入失败：{{ importRes.catalogFail }}
        </div>
        <div
          class="item"
          style="display:inline-block;fontSize: 16px;lineHeight: 26px;width:50%"
        >
          馆藏导入失败：{{ importRes.bookFail }}
        </div>
      </div>
      <div
        class="links"
        style="lineHeight: 40px;fontSize: 16px;text-decoration: underline;color: #6699ff;"
      >
        <span
          v-if="importRes.failExcel"
          href="#"
          title="点击下载EXCEL表，包含失败原因"
          @click="downLoadData(importRes.failExcel)"
          style="margin-right: 20px;cursor: pointer;"
          >下载失败结果</span
        >
        <span
          v-if="importRes.failMarc"
          href="#"
          title="点击下载失败的MARC数据文件"
          @click="downLoadData(importRes.failMarc)"
          style="cursor: pointer;"
          >下载数据文件</span
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { BASE_URL } from "utils/base";
import { downLoadExcel } from "utils/utils";

import {
  catalogueList,
  bookListByCatalogue,
  marcBookImport,
  marcBookImportProcess
} from "api/catalogue";

import { getMarcType } from "api/public";

export default {
  name: "cat_gcsmdrlb",
  data() {
    this.BASE_URL = BASE_URL;
    this.filterOptions = [
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "tiaoma",
        label: "条形码"
      },
      {
        value: "sshao",
        label: "索书号"
      },
      {
        value: "issn",
        label: "ISSN"
      }
    ];
    this.isCheckOptions = [
      {
        value: "1",
        label: "取第一条"
      },
      {
        value: "0",
        label: "不作处理"
      }
    ];
    this.isDealOptions = [
      {
        value: "1",
        label: "书目馆藏不处理"
      },
      {
        value: "2",
        label: "书目不处理，馆藏合并"
      },
      {
        value: "3",
        label: "书目覆盖，馆藏合并"
      },
      {
        value: "4",
        label: "只覆盖未审校书目，已审校书目不覆盖，馆藏合并"
      }
    ];
    return {
      // 列表
      currentFilterKey: "isbn",
      searchKey: "",
      loadingData: false,
      dataList: [],
      totalDataCount: 0,
      currentPage: 1,
      pageSize: 15,
      // 馆藏
      collectionData: [],
      loadCollectionData: false,
      // 导入
      importBatchVisible: false,
      importForm: {
        marclxid: "",
        checkList: ["isbn"],
        isCheck: "1",
        isDeal: localStorage.getItem("td-gcsmdrlb_isDeal") || "1"
      },
      importingData: false,
      marcOptions: [],
      importStatus: "",
      importCount: 0,
      importTotal: 0,
      showIsDealOptions: true,
      // 导入结果
      importRes: {},
      importResultVisible: false
    };
  },
  created() {
    this.oldId = this.$route.query.id;
    this.initDataList();
    this.getSysMarcConfigMarcList();
  },
  activated() {
    if (this.oldId !== this.$route.query.id) {
      this.oldId = this.$route.query.id;
      this.initDataList();
    }
    this.getSysMarcConfigMarcList();
  },
  methods: {
    // 书目列表
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[this.currentFilterKey] = this.searchKey;
    },
    initDataList() {
      this.currentPage = 1;
      this.setRequestObj();
      this.getDataList();
    },
    getDataList() {
      this.loadingData = true;

      let requestObj = {
        marcBookBatchId: this.$route.query.id,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        ...this.requestObj
      };

      catalogueList(requestObj)
        .then(res => {
          this.dataList = res.data.dataList;
          this.totalDataCount = Number(res.data.totalElements);
          if (this.totalDataCount === 0) {
            this.collectionData = [];
          }
          this.$nextTick(() => {
            this.dataList[0] &&
              this.$refs.catalogueTable.setCurrentRow(this.dataList[0]);
          });
        })
        .finally(() => (this.loadingData = false));
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getDataList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getDataList();
    },
    currentRowChange(row) {
      if (!row) {
        this.collectionData = [];
        return;
      }
      this.currentMarctyId = row.marctyid;
      this.getBookListByCatalogue();
    },
    // 馆藏列表
    getBookListByCatalogue() {
      this.loadCollectionData = true;
      bookListByCatalogue({
        marctyId: this.currentMarctyId,
        pageSize: 1000,
        pageNumber: 1,
        marcBookBatchId: this.$route.query.id
      })
        .then(res => {
          res.data.page.dataList.forEach(item => {
            item.cejia = item.cejia.toFixed(2);
            item.taojia = item.taojia.toFixed(2);
          });
          this.collectionData = res.data.page.dataList;
        })
        .finally(() => {
          this.loadCollectionData = false;
        });
    },
    // 导入
    getSysMarcConfigMarcList() {
      getMarcType().then(res => {
        this.marcOptions = res.data.map(item => {
          return {
            label: item.leixing,
            value: item.marclxid
          };
        });
        this.importForm.marclxid = this.marcOptions[0]
          ? this.marcOptions[0].value
          : "";
      });
    },
    handleShowImportDialog() {
      this.importBatchVisible = true;
    },
    beforeAvatarUpload(file) {
      if (file.size / 1024 / 1024 > 10) {
        this.$message.error("单次上传的文件大小不能超过 10MB!");
        return false;
      }
      return true;
    },
    handleFileChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    submitForm() {
      if (this.$refs["fileUpload"].uploadFiles.length > 0) {
        this.$refs["fileUpload"].submit();
      } else {
        this.$message.error("请先选择一份数据文件");
      }
    },
    uploadFile(params) {
      localStorage.setItem("td-gcsmdrlb_isDeal", this.importForm.isDeal);
      let formData = new FormData();
      formData.append("batchId", this.$route.query.id);
      formData.append("marclxid", this.importForm.marclxid);
      formData.append("isCheck", this.importForm.isCheck);
      if (this.showIsDealOptions) {
        // 书目查重多条不做处理的时候不需要传
        formData.append("isDeal", this.importForm.isDeal);
      }
      let matchKeys = [
        "ztming",
        "zrsming",
        "flhao",
        "isbn",
        "issn",
        "isrc",
        "cbzhe"
      ];
      matchKeys.forEach(key => {
        if (this.importForm.checkList.includes(key)) {
          formData.append(key, "1");
        } else {
          formData.append(key, "0");
        }
      });
      formData.append("file", params.file);
      this.importingData = true;
      marcBookImport(formData)
        .then(() => {})
        .catch(() => {
          this.$refs["fileUpload"].clearFiles();
          this.importingData = false;
        });
      if (this.importTimer) {
        clearInterval(this.importTimer);
      }
      this.importTimer = setInterval(() => {
        marcBookImportProcess({})
          .then(res => {
            this.importStatus = res.data.msg;
            this.importCount = res.data.current;
            this.importTotal = res.data.dataCount;
            if (res.data && res.data.isDone === 1) {
              clearInterval(this.importTimer);
              this.$refs["fileUpload"].clearFiles();
              this.importingData = false;
              this.initDataList();
              this.importRes = {
                catalogSuccess: res.data.catalogSuccess,
                catalogFail: res.data.catalogFail,
                bookSuccess: res.data.bookSuccess,
                bookFail: res.data.bookFail,
                failExcel: res.data.failExcel,
                failMarc: res.data.failMarc
              };
              if (res.data.errMsg) {
                this.$message.error(res.data.errMsg);
              } else {
                this.importResultVisible = true;
              }
              this.importStatus = this.importCount = this.importTotal = "";
            }
          })
          .catch(() => {
            this.$refs["fileUpload"].clearFiles();
            this.importStatus = this.importCount = this.importTotal = "";
            this.importingData = false;
          });
      }, 1000);
    },
    checkIsDealDisable(value) {
      this.showIsDealOptions = value === "1";
    },
    // 导入结果
    downLoadData(fileUrl) {
      downLoadExcel("/service" + fileUrl, {}, false);
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__content {
  width: 100% !important;
}
</style>
