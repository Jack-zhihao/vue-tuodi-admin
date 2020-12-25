<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-02-24 10:57:18
 -->
<template>
  <div class="per_hdbhs common__content">
    <td-content-header>
      <span>合订本回溯</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleDirectBMPage({})">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleDel(false)"
            :disabled="selectedRow.length ? false : true"
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
          <p class="desc">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="libId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
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
            ref="focusInput"
            class="group__filters_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="search"
          ></el-input>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          ref="HDBHSList"
          v-loading="bookTableLoading"
          border=""
          @selection-change="selectedRowFunc"
          @row-click="handleBookRow"
          @row-dblclick="handleDirectBMPage"
          :data="HDBHSList"
          stripe
          highlight-current-row
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
            prop="issn"
            width="145"
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
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dghao"
            label="订购号"
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
          <el-table-column
            show-overflow-tooltip
            prop="yma"
            label="页数"
            width="60"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.marcid"
                :ops="['del']"
                @handleDel="handleDel(scope.row.marctyid)"
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
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :currentPage="currentPage"
          :pageSize="pageSize"
        ></td-pagination>
      </div>
      <div class="content__table__bookList" ref="literatureTable2">
        <td-content-header>
          <span>馆藏信息</span>
          <template v-slot:btns>
            <div class="header__ops">
              <el-button
                size="mini"
                type="primary"
                :disabled="bookRow.libId ? false : true"
                @click="addNewCollect"
              >
                <icon-svg icon-class="icon-btn-ico-" />新增
              </el-button>
              <el-button
                size="mini"
                type="primary"
                @click="catalogueDel(false)"
                :disabled="selectedCatalogueRow.length ? false : true"
              >
                <icon-svg icon-class="icon-btn-ico-1" />删除
              </el-button>
            </div>
          </template>
        </td-content-header>
        <el-table
          v-loading="loadCatalogueListLoading"
          border=""
          ref="catalogueList"
          :data="catalogueList"
          stripe
          @row-click="rowClick"
          @selection-change="selectedCatalogueRowFunc"
          style="width: 100%"
          height="calc(100% - 68px)"
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
          <el-table-column show-overflow-tooltip prop="tiaoma" label="条形码">
            <template slot-scope="scope">
              <span
                @click="catalogueEdit(scope.row.shuceid)"
                class="g-row__check"
                >{{ scope.row.tiaoma }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jcmshu"
            label="卷册信息"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="所在馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="siteName"
            label="所在藏址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ltLxName"
            label="流通类型"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztai"
            label="馆藏状态"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cejia"
            label="单价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="taojia"
            label="套价"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="入库人"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="入库时间"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.shuceid"
                :ops="['del', 'modi']"
                @handleModi="catalogueEdit(scope.row.shuceid)"
                @handleDel="catalogueDel(scope.row.shuceid)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!--馆藏warp-->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showCollectionSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              {{ bookRow.ztming }} - {{ isAdd ? "添加馆藏" : "修改馆藏" }}
            </div>
          </div>
          <i class="el-icon-close" @click="closeWarp('collectionForm')"></i>
        </div>
      </template>
      <div class="edit__content" v-loading="loadFormDefault">
        <el-form
          class="addForm custom__form"
          ref="collectionForm"
          label-width="85px"
          :model="collectionForm"
          :rules="collectionFormRules"
        >
          <div class="form__type">
            <div class="tit">
              <span>基本信息</span>
            </div>
            <el-form-item class="item" prop="tiaoma" label="条形码">
              <el-input
                clearable
                size="small"
                v-model="collectionForm.tiaoma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                clearable
                size="small"
                v-model="collectionForm.sshao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cejia" label="册价">
              <el-input
                clearable
                v-only-num.float="collectionForm.cejia"
                size="small"
                v-model="collectionForm.cejia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jcmshu" label="卷册描述">
              <el-input
                clearable
                size="small"
                v-model="collectionForm.jcmshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="taojia" label="套价">
              <el-input
                clearable
                v-only-num.float="collectionForm.taojia"
                size="small"
                v-model="collectionForm.taojia"
              ></el-input>
            </el-form-item>
            <div class="tit">
              <span>馆藏信息</span>
            </div>
            <el-form-item class="item" prop="cygid1" label="现在馆">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.cygid1"
                @change="changeLib"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in allLibList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.ztai"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ztaiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="czid1" label="现在馆藏址">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.czid1"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in czList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="wxlyuan" label="文献来源">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.wxlyuan"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in wxlyuanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="cygid0" label="财产馆">
              <el-select
                filterable
                size="small"
                disabled
                v-model="collectionForm.cygid0"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in allLibList"
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
                v-model="collectionForm.ltlxid"
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
            <el-form-item class="item" prop="czid0" label="财产馆藏址">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.czid0"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ccgCzList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <div class="tit">
              <span>更多信息</span>
            </div>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysInLibList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.jzleixing"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in jzlxingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysuanid" label="预算">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.ysuanid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userYsList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-select
                filterable
                size="small"
                v-model="collectionForm.zdfangshi"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdfshiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item__textarea"
              prop="beizhu"
              label="备注"
            >
              <el-input
                clearable
                type="textarea"
                size="small"
                v-model="collectionForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="resetWarp('collectionForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="submitForm('collectionForm')"
              >保存</el-button
            >
            <el-button size="small" @click="closeWarp('collectionForm')"
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
  catalogueList,
  catalogueDelete,
  bookListByCatalogue,
  bookDelete,
  bookBookDefault,
  bookSave,
  bookGetBookById
} from "api/catalogue";

import {
  flowType,
  userGysInLibList,
  userYsLibList,
  userCzList,
  getAllLibList
} from "api/public";

import {
  ZDFANGSHI_OPTIONS,
  JZLEIXING_OPTIONS,
  WXLYUAN_OPTIONS,
  ZTAI_OPTIONS
} from "utils/variables";

import { HDBHS_OPTIONS } from "utils/selectOptions";

import { mapGetters } from "vuex";

export default {
  name: "per_hdbhs",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.filterOptions = HDBHS_OPTIONS;
    this.collectionFormRules = {
      tiaoma: [{ required: true, message: "请输入条形码", trigger: "blur" }],
      sshao: [{ required: true, message: "请输入索书号", trigger: "blur" }]
    };
    this.ztaiList = ZTAI_OPTIONS;
    return {
      currentFilterKey: "issn",
      currentFilterVal: "",
      libId: this.$store.getters.userInfo.libId,
      //书目表格
      bookTableLoading: false,
      HDBHSList: [],
      totalCount: 0,
      currentPage: 1,
      pageSize: 15,
      selectedRow: [],
      bookRow: {},
      param: {},
      //装订表格
      loadCatalogueListLoading: false,
      catalogueList: [],
      selectedCatalogueRow: [],
      tempForm: {},
      //侧边栏
      isAdd: true,
      loadFormDefault: false,
      showCollectionSide: false,
      collectionForm: {},
      //选择栏
      isChangeLib: false,
      czList: [],
      ccgCzList: [],
      flowTypeList: [],
      wxlyuanList: [],
      gysInLibList: [],
      userYsList: [],
      jzlxingList: [],
      zdfshiList: [],
      allLibList: []
    };
  },
  methods: {
    search() {
      this.currentPage = 1;
      this.getBookList();
    },
    //获取书目列表

    getBookList() {
      this.bookRow = {};
      this.catalogueList = [];
      this.param = {
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        libId: this.libId,
        isQk: 1
      };
      this.param[this.currentFilterKey] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );
      this.bookTableLoading = true;
      catalogueList({
        ...this.param
      })
        .then(res => {
          this.bookTableLoading = false;
          this.HDBHSList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.bookTableLoading = false;
        });
    },
    handleDirectBMPage(row) {
      const param = {
        isQk: 1,
        marcid: row.marcid || "",
        marctyid: row.marctyid || ""
      };
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "per_hdbhs",
          ...param
        }
      });
    },
    //选择行
    selectedRowFunc(rowArr) {
      this.selectedRow = [];
      rowArr.filter(ele => {
        this.selectedRow.push(ele.marctyid);
      });
    },
    rowClick(row) {
      this.$refs.catalogueList.toggleRowSelection(row);
    },
    handleSizeChange(pageSize) {
      this.pageSize = pageSize;
      this.currentPage = 1;
      this.getBookList();
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage;
      this.getBookList();
    },

    //期刊删除
    handleDel(marctyid) {
      let marctyIds = [];
      if (marctyid) {
        marctyIds.push(marctyid);
      } else {
        marctyIds = [...this.selectedRow];
      }
      catalogueDelete({
        marctyIds: marctyIds.join(",")
      }).then(res => {
        this.$message.success(res.message);
        this.getBookList();
      });
    },
    //馆藏点击选择行
    handleBookRow(row) {
      this.bookRow = { ...row };
      this.handleCatalogue(this.bookRow);
      this.$refs.HDBHSList.toggleRowSelection(row);
    },
    //期刊馆藏
    handleCatalogue(row) {
      this.loadCatalogueListLoading = true;
      bookListByCatalogue({
        pageNumber: 1,
        pageSize: 1000,
        marctyId: row.marctyid,
        isShow: 0
      })
        .then(res => {
          this.loadCatalogueListLoading = false;
          this.catalogueList = res.data.page.dataList;
        })
        .catch(() => {
          this.loadCatalogueListLoading = false;
        });
    },
    //馆藏选择行
    selectedCatalogueRowFunc(row) {
      this.selectedCatalogueRow = [];
      row.filter(ele => {
        this.selectedCatalogueRow.push(ele.shuceid);
      });
    },
    //馆藏删除
    catalogueDel(shuceId) {
      let shuceIds = shuceId || this.selectedCatalogueRow.join(",");
      bookDelete({
        shuceIds
      }).then(res => {
        this.$message.success(res.message);
        this.handleCatalogue(this.bookRow);
      });
    },
    //馆藏新增
    addNewCollect() {
      this.initAddCatalogue(this.bookRow);
      this.showCollectionSide = true;
    },
    //馆藏-新增初始化
    initAddCatalogue(row) {
      this.getBookDefault(row);
    },

    //获取默认数据
    getBookDefault(row) {
      this.loadFormDefault = true;
      bookBookDefault({
        marctyId: row.marctyid
      })
        .then(res => {
          this.loadFormDefault = false;
          res.data.bookDeault.marctyId = row.marctyid;
          const libId = this.$store.getters.userInfo.libId;
          this.collectionForm.cygid0 = this.collectionForm.cygid0 || libId;
          this.collectionForm.cygid1 = this.collectionForm.cygid1 || libId;
          //默认数据优化
          let bookDeault = res.data.bookDeault;
          bookDeault.sshao = res.data.sshao;
          bookDeault["taojia"] = parseFloat(bookDeault["taojia"]).toFixed(2);
          bookDeault["cejia"] = parseFloat(bookDeault["cejia"]).toFixed(2);
          this.collectionForm = bookDeault;
          this.initOption();
          this.collectionForm["wxlyuan"] =
            this.collectionForm["wxlyuan"] || this.wxlyuanList[0].value;
          this.collectionForm["jzleixing"] =
            this.collectionForm["jzleixing"] || this.jzlxingList[0].value;
          this.collectionForm["zdfangshi"] =
            this.collectionForm["zdfangshi"] || this.zdfshiList[0].value;
        })
        .catch(() => {
          this.loadFormDefault = false;
        });
    },

    //图书馆切换
    changeLib() {
      this.isChangeLib = true;
      this.initOption();
    },
    //新增保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          delete this.collectionForm["optime"];
          delete this.collectionForm["yjoptime"];
          bookSave(this.collectionForm).then(res => {
            this.$message.success(res.message);
            this.handleCatalogue(this.bookRow);
            this.$refs[formName].resetFields();
            this.showCollectionSide = false;
            this.isAdd = true;
            this.isChangeLib = false;
          });
        }
      });
    },

    closeWarp(formName) {
      this.$refs[formName].resetFields();
      this.showCollectionSide = false;
      this.showEditCollectionSide = false;
      this.isChangeLib = false;
      this.isAdd = true;
    },

    resetWarp(formName) {
      this.$refs[formName].resetFields();
      this.initAddCatalogue(this.bookRow);
    },

    initOption() {
      this.getUserCzList();
      this.getCcgCzList();
      this.getTlowType();
      this.getUserGysInLibList();
      this.getUserYsLibList();
      this.wxlyuanList = WXLYUAN_OPTIONS;
      this.jzlxingList = JZLEIXING_OPTIONS;
      this.zdfshiList = ZDFANGSHI_OPTIONS;
    },

    //期刊馆藏信息修改
    catalogueEdit(shuceid) {
      this.isAdd = false;
      this.showCollectionSide = true;
      this.loadFormDefault = true;
      bookGetBookById({
        shuceid
      })
        .then(res => {
          this.loadFormDefault = false;
          res.data.book.sshao = res.data.sshao;
          this.collectionForm = { ...res.data.book };
          this.collectionForm.marctyId = this.bookRow.marctyid;
          this.initOption();
        })
        .catch(() => {
          this.loadFormDefault = false;
        });
    },

    //获取现在馆藏址
    getUserCzList() {
      userCzList({
        libId: this.collectionForm.cygid1 || this.$store.getters.userInfo.libId
      }).then(res => {
        this.czList = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });

        if (this.isChangeLib) {
          this.collectionForm.czid1 = this.czList[0]
            ? this.czList[0].value
            : "";
        } else {
          this.collectionForm.czid1 =
            this.collectionForm.czid1 ||
            (this.czList[0] ? this.czList[0].value : "");
        }
      });
    },
    //获取财产馆藏址
    getCcgCzList() {
      userCzList({
        libId: this.collectionForm.cygid0 || this.$store.getters.userInfo.libId
      }).then(res => {
        this.ccgCzList = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });

        if (this.isChangeLib) {
          this.collectionForm.czid0 = this.ccgCzList[0]
            ? this.ccgCzList[0].value
            : "";
        } else {
          this.collectionForm.czid0 =
            this.collectionForm.czid0 ||
            (this.ccgCzList[0] ? this.ccgCzList[0].value : "");
        }
      });
    },
    //流通类型
    getTlowType() {
      flowType({
        libId: this.collectionForm.cygid1 || this.$store.getters.userInfo.libId
      }).then(res => {
        this.flowTypeList = [];
        res.data.filter(ele => {
          this.flowTypeList.push({
            label: ele.mingcheng,
            value: ele.ltlxid
          });
        });
        this.collectionForm.ltlxid = this.isChangeLib
          ? this.flowTypeList[0]
            ? this.flowTypeList[0].value
            : ""
          : this.collectionForm.ltlxid
          ? this.collectionForm.ltlxid
          : this.flowTypeList[0].value;
      });
    },
    //供应商列表
    getUserGysInLibList() {
      userGysInLibList({
        libId: this.collectionForm.cygid0 || this.$store.getters.userInfo.libId
      }).then(res => {
        this.gysInLibList = [];
        res.data.filter(ele => {
          this.gysInLibList.push({
            label: ele.gysName,
            value: ele.gysId
          });
        });
        this.collectionForm.gysid = this.isChangeLib
          ? this.gysInLibList[0]
            ? this.gysInLibList[0].value
            : ""
          : this.collectionForm.gysid
          ? this.collectionForm.gysid
          : this.gysInLibList[0].value;
      });
    },
    //预算
    getUserYsLibList() {
      userYsLibList({
        libId: this.collectionForm.cygid0 || this.$store.getters.userInfo.libId
      }).then(res => {
        this.userYsList = [];
        res.data.filter(ele => {
          this.userYsList.push({
            label: ele.mingcheng,
            value: ele.ysid
          });
        });
        this.collectionForm.ysuanid = this.isChangeLib
          ? this.userYsList[0]
            ? this.userYsList[0].value
            : ""
          : this.collectionForm.ysuanid
          ? this.collectionForm.ysuanid
          : this.userYsList[0].value;
      });
    },
    getAllLib() {
      getAllLibList().then(res => {
        this.allLibList = res.data.map(item => {
          return {
            label: item.libJiancheng,
            value: item.libId
          };
        });
      });
    }
  },
  mounted() {
    this.$refs.focusInput.focus();
    this.getAllLib();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.per_hdbhs {
  .content {
    .content__table {
      height: calc(50% - 35px);
      .handle__bar {
        border-top: 1px solid @borderColor;
      }
    }
    .content__table__bookList {
      height: calc(50% - 32px);
    }
  }
  .el-form-item__content {
    margin: 0 !important;
  }
  .el-dialog {
    .el-dialog__body {
      padding: 0 20px;
    }
  }
}
</style>
