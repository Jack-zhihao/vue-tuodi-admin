<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: qili.liang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-11 10:59:52
 -->
<template>
  <div class="cat-xzbmmarc common__content">
    <el-scrollbar style="zIndex: 1;">
      <div class="content__table_box" id="content__table_box" tabindex="1">
        <div class="content__top">
          <div class="content__top_table" id="content__top_table">
            <el-table
              :empty-text="emptyText"
              :data="catalogueData"
              border
              class="simple_table"
              height="100%"
              highlight-current-row
              @row-click="handleCurrentCatalogue"
              v-loading="loading"
              @row-dblclick="dbclickShowMarcSide"
              ref="singleTable"
            >
              <el-table-column
                type="index"
                label=" "
                width="30"
              ></el-table-column>
              <el-table-column
                prop="libName"
                label="数据来源"
                show-overflow-tooltip
                width="100"
              ></el-table-column>
              <el-table-column width="145" label="ISBN" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-popover
                    popper-class="isnb__popover"
                    trigger="hover"
                    placement="right-start"
                  >
                    <div class="triangle">
                      <table width="680px" border="0" cellspacing="0">
                        <tr
                          v-for="item in scope.row.fieldList"
                          :key="item.marctyid"
                          class="text"
                        >
                          <td width="30">
                            {{ item.field }}
                          </td>
                          <td width="25">
                            {{ item.indexOne + item.indexTwo }}
                          </td>
                          <td>
                            <input
                              v-if="myBrowser() === 'FF'"
                              class="text"
                              :value="item.content"
                              readonly
                            />
                            <span v-else class="text">
                              {{ item.content }}
                            </span>
                          </td>
                        </tr>
                      </table>
                    </div>
                    <div slot="reference" class="name-wrapper">
                      {{ scope.row.isbn }}
                    </div>
                  </el-popover>
                </template>
              </el-table-column>
              <el-table-column
                prop="ztming"
                min-width="115"
                label="正题名"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="ftming"
                label="副题名"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="zrsming"
                label="责任者"
                width="60"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="cbzhe"
                label="出版社"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="cbrqi"
                width="70"
                label="出版日期"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="jge"
                label="价格"
                width="87"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="fjming"
                label="分辑名"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="fjhao"
                label="分辑号"
                width="55"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="flhao"
                width="95"
                label="分类号"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="yma"
                label="页数"
                width="60"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="site"
                label="位置"
                width="70"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column
                prop="address"
                label="操作"
                width="45"
                fixed="right"
              >
                <template
                  slot-scope="scope"
                  v-if="scope.row.site === '本地书目'"
                >
                  <td-action-tool :ops="[]">
                    <template v-slot:menus>
                      <div
                        class="menu"
                        @click="editBm(scope.row.marcid, scope.row.marctyid)"
                      >
                        编辑
                      </div>
                      <div
                        class="menu"
                        @click="handleClick(scope.row.marctyid)"
                      >
                        删除
                      </div>
                    </template>
                  </td-action-tool>
                </template>
              </el-table-column>
            </el-table>
            <div class="content_right" ref>
              <el-button
                type="primary"
                size="small"
                @click="handleEdit('new')"
                title="ALT + N"
              >
                <span>N</span>新增
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="duojuanDisable"
                @click="handleEdit('taolu')"
                title="ALT + T"
              >
                <span>T</span>套录
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="fubenDisable"
                @click="handleEdit('copy')"
                title="ALT + C"
              >
                <span>C</span>复本
              </el-button>
              <el-button
                type="primary"
                size="small"
                :disabled="duojuanDisable"
                @click="handleEdit('multi')"
                title="ALT + X"
              >
                <span>X</span>多卷
              </el-button>
            </div>
          </div>
        </div>
        <div class="content__catalogue">
          <el-checkbox-group
            class="content__catalogue__check"
            v-model="checkedCities1"
            :min="1"
            :max="2"
          >
            <el-checkbox
              v-for="item in cityOptions"
              :label="item.label"
              :key="item.value"
              >{{ item.value }}
            </el-checkbox>
          </el-checkbox-group>
          <div
            class="header__filters"
            v-for="item in selectDataArr"
            :key="item.id"
          >
            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="item.flag"
              placeholder="请选择"
            >
              <el-option
                v-for="item in catalogueFilterOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <el-input
              size="mini"
              class="group__filters_value"
              clearable
              v-model="item.value"
              placeholder="请输入搜索关键词"
              @keyup.native="
                handleBarCodeScanner(
                  $event,
                  val => (item.value = val),
                  getcatalogueSelect
                )
              "
              @keyup.enter.native="delayFunc(getcatalogueSelect)"
              ref="selectInput"
            ></el-input>
          </div>
          <div class="header__filters_i">
            <i
              class="el-icon-remove"
              @click="removeselect"
              v-show="removeVisable"
              style="color: #de5151;"
            ></i>
            <i
              class="el-icon-circle-plus"
              @click="addselect"
              v-show="addVisable"
              style="color: #0079fe;"
            ></i>
          </div>

          <el-button
            type="primary"
            :disabled="catalogueDisabled"
            size="mini"
            @click="handleCatalogueSearch"
          >
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>

        <div class="content__middle">
          <div class="content_table">
            <div class="content_table_top">
              <span class="tit">编目信息</span>
              <div class="content-tip">
                <div>
                  编目人：
                  <span>
                    {{
                      currentRowCatalogue.userName
                        ? currentRowCatalogue.userName
                        : "--"
                    }}
                  </span>
                </div>
                <div>
                  编目时间：
                  <span>
                    {{
                      currentRowCatalogue.catalogueDate
                        ? currentRowCatalogue.catalogueDate
                        : "--"
                    }}
                  </span>
                </div>
              </div>
            </div>
            <div class="content__bottom">
              <div class="bottom__template">
                <div v-show="currentRowCatalogue.ztming">
                  <span class="item__name">正题名</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.ztming }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.fjming">
                  <span class="item__name">分辑名</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.fjming }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.fjhao">
                  <span class="item__name">分辑号</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.fjhao }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.zrsming">
                  <span class="item__name">责任者</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.zrsming }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.flhao">
                  <span class="item__name">分类号</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.flhao }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.isbn">
                  <span class="item__name">I S B N</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.isbn }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.jge">
                  <span class="item__name">价格</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.jge }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.cbzhe">
                  <span class="item__name">出版社</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.cbzhe }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.yzhong">
                  <span class="item__name">语种</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.yzhong }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.cbrqi">
                  <span class="item__name">出版时间</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.cbrqi }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.bci">
                  <span class="item__name">版本说明</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.bci }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.ccun">
                  <span class="item__name">文献尺寸</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.ccun }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.yma">
                  <span class="item__name">页码</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.yma }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.cbtming">
                  <span class="item__name">丛编题名</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.cbtming }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.fjian">
                  <span class="item__name">附件</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.fjian }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.cbzrsming">
                  <span class="item__name">丛编责任者</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.cbzrsming }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.zti">
                  <span class="item__name">主题词</span>
                  <span class="item__label">
                    {{ currentRowCatalogue.zti }}
                  </span>
                </div>
                <div v-show="currentRowCatalogue.zyao">
                  <span class="item__name">内容概要</span>
                  <span class="item__label" :title="currentRowCatalogue.zyao">
                    {{ currentRowCatalogue.zyao }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div class="content_table">
            <div class="content_table_top">
              <span class="tit">馆藏信息</span>
            </div>
            <div>
              <el-table
                :data="bookCatalogueList"
                height="330"
                border
                class="simple_table"
                v-loading="loadingCatalogue"
              >
                <el-table-column
                  type="index"
                  label=" "
                  width="30"
                ></el-table-column>
                <el-table-column
                  prop="tiaoma"
                  label="条形码"
                  width="161"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="sshao"
                  label="索书号"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="libName"
                  label="所在馆"
                  show-overflow-tooltip
                ></el-table-column>

                <el-table-column
                  prop="jcmshu"
                  label="卷册描述"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="cejia"
                  label="册价"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="siteName"
                  label="藏址"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="ztai"
                  label="状态"
                  width="45"
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="ltLxName"
                  label="流通类型"
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
              <div>
                <td-pagination
                  @size-change="handleUserSizeChange"
                  @current-change="handleUserCurrentChange"
                  :total="totalBookCount"
                  :currentPage="currentBookCount"
                  :pageSize="bookPageSize"
                ></td-pagination>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
    <xzbm-edit
      :isbn="searchIsbn"
      :mode="currentEditMode"
      :catalogueData="currentRowCatalogue"
      v-if="showEditPage"
      @handleHideEditPage="hideEditPage"
      @updateCatalogue="updateCatalogue"
    ></xzbm-edit>
  </div>
</template>

<script>
import {
  catalogueDownload,
  bookListByCatalogue,
  catalogueDelete
} from "api/catalogue";
import { CATALOGUE_DOWNLOAD_FILTER_OPTIONS } from "utils/variables";

import xzbmEdit from "./xzbmedit";

import { myBrowser } from "utils/utils";

export default {
  name: "cat_xzbm",
  components: {
    xzbmEdit
  },
  data() {
    this.myBrowser = myBrowser;
    this.catalogueFilterOptions = CATALOGUE_DOWNLOAD_FILTER_OPTIONS;
    return {
      emptyText: "暂无数据",
      libId: this.$store.getters.userInfo.libId,
      duojuanDisable: true,
      fubenDisable: true,
      isJINYong: true,
      isJyEditMarc: true,
      userInfoFormRules: [],
      addRoleIdOptions: [],
      catalogueSearchKey: "",
      filterOptions: [],
      currentFilterKey: "",
      currentFilterVal: "",
      certTypeList: [],
      eduTypeList: [],
      // 书目列表
      catalogueData: [],
      currentRowCatalogue: {}, //当前行数据
      keyId: 1,
      //默认的搜索框数组
      selectDataArr: [
        {
          id: 1,
          flag: "isbn",
          value: ""
        }
      ],
      // 侧栏遍历的数据
      MarcSideData: [],
      marcLx: "",
      ztming: "",
      marcHead: "",
      bookCatalogueList: [],
      totalBookCount: 0,
      currentBookCount: 1,
      bookPageSize: 10,
      // 展示编辑页
      showEditPage: false,
      currentEditMode: "",
      cityOptions: [
        {
          label: "isDownLoad",
          value: "拓迪数据中心"
        },
        {
          label: "isLocal",
          value: "本地书目"
        }
      ],
      checkedCities1: ["isDownLoad", "isLocal"],
      catalogueDisabled: true,
      loading: false,
      loadingCatalogue: false,
      removeVisable: false,
      addVisable: true,
      prevRow: {},
      nextCatalogue: null,
      searchIsbn: ""
    };
  },
  mounted() {
    this.prevIsbn = this.$route.query.isbn;
    document
      .getElementById("content__table_box")
      .addEventListener("keydown", this.tableEvent, false);
  },
  activated() {
    // 删除两个条件
    this.changeselectData();
    this.selectDataArr[0].value = this.$route.query.isbn || "";
    this.selectDataArr[0].flag = "isbn";
    if (this.$route.query.isbn) {
      this.getcatalogueSelect().then(() => {
        this.$refs.selectInput[0].select();
      });
      this.catalogueDisabled = false;
    } else {
      this.$refs.selectInput[0].select();
      this.catalogueDisabled = true;
    }
  },
  methods: {
    // 减少选择条件
    removeselect() {
      if (this.selectDataArr.length <= 1) {
        return;
      }
      this.selectDataArr.splice(-1, 1);
    },
    // 增加选择条件
    addselect() {
      if (this.selectDataArr.length > 2) {
        return;
      }
      let id = ++this.keyId;
      this.selectDataArr.push({
        id: id,
        flag: "isbn",
        value: ""
      });
    },
    handleCatalogueSearch() {
      let isbnVal = "";
      let key = "",
        value = "";
      this.selectDataArr.forEach(ele => {
        if (ele.value) {
          key = ele.flag;
          value = ele.value;
          if (key === "isbn") {
            isbnVal = value;
          }
        }
      });
      this.$router.push({
        name: "cat_xzbm",
        query: {
          isbn: isbnVal
        }
      });
      this.getcatalogueSelect();
    },
    // 获取列表
    getcatalogueSelect() {
      return new Promise((resolve, reject) => {
        this.loading = true;
        let param = {};
        this.checkedCities1.forEach(item => {
          param[item] = 1;
        });
        let key = "",
          value = "";
        let isbnVal = "";
        this.selectDataArr.forEach(ele => {
          if (ele.value) {
            key = ele.flag;
            value = ele.value;
            param[ele.flag] = ele.value;
            if (key === "isbn") {
              isbnVal = value;
            }
          }
        });
        catalogueDownload(param)
          .then(res => {
            this.$router.push({
              name: "cat_xzbm",
              query: {
                ...this.$route.query,
                isbn: isbnVal
              }
            });
            this.currentRowCatalogue = {};
            this.bookCatalogueList = [];
            this.nextCatalogue = null;
            this.totalBookCount = 0;
            this.currentBookCount = 1;
            this.duojuanDisable = true;
            this.fubenDisable = true;
            let matchItem = null; // 用于自动选中回溯建库查找的数据
            res.data.forEach((ele, index) => {
              if (this.$route.query.marctyId === ele.marctyid) {
                matchItem = ele;
              }
              ele.index = index + 1;
            });
            this.catalogueData = res.data;
            if (this.catalogueData.length) {
              this.isJINYong = false;
              this.$nextTick(() => {
                document.getElementById("content__table_box").focus();
                this.handleCurrentCatalogue(
                  matchItem ? matchItem : this.catalogueData[0]
                );
                // 如果一开始超过表格高度滚动到对应位置
                if (matchItem && matchItem.index > 11) {
                  document
                    .querySelector(".content__top_table .el-table tbody")
                    .children[matchItem.index - 1].scrollIntoView();
                } else {
                  document
                    .querySelector(".content__top_table")
                    .scrollIntoView();
                }
              });
            } else {
              this.isJINYong = true;
              this.$refs.selectInput[0].select();
            }
            this.loading = false;
            if (res.data.length === 0) {
              let map = CATALOGUE_DOWNLOAD_FILTER_OPTIONS.filter(
                item => item.value === key
              )[0];
              this.$message.warning(
                "查询（" + map["label"] + ":" + value + "）暂无数据"
              );
            }
            resolve();
          })
          .catch(() => {
            this.loading = false;
            reject();
          });
      });
    },
    // 选中当前行
    handleCurrentCatalogue(currentRow) {
      this.currentRowCatalogue = currentRow;
      if (currentRow.libId === this.libId) {
        this.fubenDisable = false;
      } else {
        this.fubenDisable = true;
      }
      // 判断MARC页面按钮是否可以编辑
      if (currentRow.site == "本地书目") {
        this.isJyEditMarc = false;
      } else {
        this.isJyEditMarc = true;
      }
      this.prevRow = currentRow;
      this.$refs.singleTable.setCurrentRow(currentRow);
      // 滚动到当前视图
      // document
      //   .querySelector(".content__top_table .el-table tbody")
      //   .children[currentRow.index - 1].scrollIntoView();
      this.currentBookCount = 1;
      this.duojuanDisable = false;
      this.getbookListByCatalogue();
      this.showMarcSide(
        currentRow.fieldList,
        currentRow.marcLx,
        currentRow.ztming,
        currentRow.head
      );
    },
    // 获取馆藏信息
    getbookListByCatalogue() {
      this.bookCatalogueList = [];
      if (!this.currentRowCatalogue.marctyid) {
        this.fubenDisable = true;
      } else {
        this.loadingCatalogue = true;
        let paramCatalogue = {};
        paramCatalogue.marctyId = this.currentRowCatalogue.marctyid;
        paramCatalogue.pageNumber = this.currentBookCount;
        paramCatalogue.pageSize = this.bookPageSize;
        bookListByCatalogue(paramCatalogue)
          .then(res => {
            res.data.page.dataList.forEach((ele, index) => {
              ele.index = index + 1;
              ele.cejia = ele.cejia.toFixed(2);
              ele.taojia = ele.taojia.toFixed(2);
            });
            this.bookCatalogueList = res.data.page.dataList;
            this.totalBookCount = Number(res.data.page.totalElements);
            this.loadingCatalogue = false;
          })
          .catch(() => {
            this.loadingCatalogue = false;
          });
      }
    },
    dbclickShowMarcSide(row) {
      if (row.site === "本地书目") {
        this.editBm(row.marcid, row.marctyid);
      }
    },
    showMarcSide(fieldList, marcLx, ztming, head) {
      this.MarcSideData = fieldList || [];
      this.marcHead = head || "";
      this.marcLx = marcLx || "";
      this.ztming = ztming || "";
    },
    handleUserSizeChange(pageSize) {
      this.bookPageSize = pageSize;
      this.getbookListByCatalogue();
    },
    handleUserCurrentChange(currentPage) {
      this.currentBookCount = currentPage;
      this.getbookListByCatalogue();
    },
    // 切换新增/套路/复本/多卷
    handleEdit(mode) {
      if (mode === "new") {
        let currentIsbn = "";
        let datalength = this.selectDataArr.length;
        for (let i = 0; i < datalength; i++) {
          if (
            this.selectDataArr[i].flag == "isbn" &&
            !this.selectDataArr[i].value == ""
          ) {
            currentIsbn = this.selectDataArr[i].value;
            break;
          }
        }
        this.searchIsbn = currentIsbn || ""; // 获取当前的检索isbn
      }
      this.currentEditMode = mode;
      this.showEditPage = true;
    },
    hideEditPage(isbnObj) {
      this.showEditPage = false;
      this.changeselectData();
      // 复本不用重新查询数据
      if (isbnObj.isbn) {
        this.selectDataArr[0].value = isbnObj.isbn || "";
        this.selectDataArr[0].flag = "isbn";
        this.getcatalogueSelect().then(() => {
          this.$refs.selectInput[0].select();
        });
      } else {
        this.$refs.selectInput[0].select();
      }
    },
    changeselectData() {
      this.selectDataArr.splice(1);
    },
    updateCatalogue() {
      this.getbookListByCatalogue();
    },
    tableEvent() {
      if (event.altKey && event.keyCode === 78) {
        // 新增N
        window.event.preventDefault();
        this.handleEdit("new");
      } else if (event.altKey && event.keyCode === 84) {
        //套录T
        window.event.preventDefault();
        if (this.duojuanDisable == false) {
          this.handleEdit("taolu");
        }
      } else if (event.altKey && event.keyCode === 67) {
        window.event.preventDefault();
        // 复本C
        if (this.fubenDisable == false) {
          this.handleEdit("copy");
        }
      } else if (event.altKey && event.keyCode === 88) {
        // 多卷X
        window.event.preventDefault();
        if (this.duojuanDisable == false) {
          this.handleEdit("multi");
        }
      } else if (event.altKey && event.keyCode === 38) {
        // 上箭头
        window.event.preventDefault();
        if (this.catalogueData.length) {
          this.catalogueData.forEach((item, i) => {
            if (this.catalogueData[i].index == this.prevRow.index) {
              if (i <= 0) {
                // window.console.log()
              } else {
                this.nextCatalogue = this.catalogueData[i - 1];
              }
            }
          });
        }
        this.currentRowCatalogue = this.nextCatalogue;
        this.handleCurrentCatalogue(this.nextCatalogue);
      } else if (event.altKey && event.keyCode === 40) {
        // 下箭头
        window.event.preventDefault();
        if (this.catalogueData.length) {
          this.catalogueData.forEach((item, i) => {
            if (this.catalogueData[i].index == this.prevRow.index) {
              if (i >= this.catalogueData.length - 1) {
                // window.console.log()
              } else {
                this.nextCatalogue = this.catalogueData[i + 1];
              }
            }
          });
          this.currentRowCatalogue = this.nextCatalogue;
          this.handleCurrentCatalogue(this.nextCatalogue);
        }
      }
    },
    handleClick(marctyid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadCatalogueData = true;
          catalogueDelete({
            marctyIds: marctyid
          })
            .then(res => {
              this.loadCatalogueData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              this.getcatalogueSelect();
            })
            .catch(() => {
              this.loadCatalogueData = false;
            });
        })
        .catch(() => {});
    },
    editBm(marcid, marctyid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          isbn: this.$route.query.isbn,
          marctyid,
          marcid,
          from: "cat_xzbm"
        }
      });
    }
  },
  watch: {
    $route: function(to) {
      if (to.name !== "cat_xzbm") {
        return;
      }
      if (to.query.isbn !== this.prevIsbn) {
        this.showEditPage = false;
      }
      this.prevIsbn = to.query.isbn;
    },
    selectDataArr: {
      handler: function(newval) {
        if (newval.length >= 3) {
          this.addVisable = false;
        } else {
          this.addVisable = true;
        }
        if (newval.length <= 1) {
          this.removeVisable = false;
        } else {
          this.removeVisable = true;
        }
        for (let i = 0; i < newval.length; i++) {
          if (!newval[i].value) {
            this.catalogueDisabled = true;
            return;
          } else {
            this.catalogueDisabled = false;
          }
        }
      },
      deep: true
    }
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";

.cat-xzbmmarc {
  position: relative;
  background: @contentBgColor;
}

.content__top__padding {
  height: 20px;
  background: #f1f1f1;
}

.content__table_box {
  outline: none;
}

.content__top {
  height: 350px;

  .content__top_table {
    height: 100%;
    outline: none;
    position: relative;
    border-bottom: 1px solid #e2e2e2;
    background: @contentBgColor;

    .simple_table {
      width: ~"calc(100% - 200px)";
      display: inline-block;

      .simple_table_tip {
        color: @primaryColor;
        cursor: pointer;

        &:nth-child(2) {
          margin-left: 10px;
        }
      }
    }

    .content_right {
      width: 200px;
      padding: 20px 0;
      box-sizing: border-box;
      height: 100%;
      background: #fff;
      display: inline-block;
      vertical-align: top;
      text-align: center;

      .el-button {
        width: 80%;
        margin-bottom: 5px;
        margin-left: 0;

        span {
          display: inline-block;
          margin: 0 10px;
          border-bottom: 1px solid;
        }
      }

      .el-button:nth-child(4) {
        margin-bottom: 50px;
      }
    }
  }
}

.content__catalogue {
  vertical-align: middle;
  padding: 0 6px;
  height: 38px;
  align-items: center;
  display: flex;
  background-color: @contentBgColor;
  box-sizing: border-box;
  justify-content: flex-start;

  .header__filters {
    width: 25%;
    display: flex;
    justify-content: flex-start;
    margin-left: 10px;

    .header__filters_typ {
      width: 30%;
    }
  }

  .el-button {
    margin-left: 10px;
    height: 32px;
  }

  .header__filters_i {
    margin-left: 10px;

    .el-icon-remove {
      font-size: 32px;
    }

    .el-icon-circle-plus {
      font-size: 32px;
    }
  }

  .content__catalogue__check {
    height: 34px;
    line-height: 34px;

    min-width: 165px;

    .el-checkbox {
      margin-right: 15px;
    }
  }
}

.content__middle {
  display: flex;
  justify-content: space-between;
  background: @contentBgColor;

  .content_table {
    width: ~"calc(50% - 2px)";
    align-items: center;
    background: @contentHdColor;
    box-sizing: border-box;
    margin-right: 1px;

    .content_table_top {
      background: @topBgColor;
    }

    .content-tip {
      margin-left: 25px;

      display: inline-block;

      div {
        font-size: @FSize_16;
        margin-left: 10px;
        display: inline-block;

        span {
          background: #fff;
          padding: 2px 5px;
        }
      }
    }

    .tit {
      font-weight: bold;
      font-size: @FSize_15;
      color: @fontDarkColor;
      line-height: 40px;
    }

    .tip {
      line-height: 32px;
      font-weight: bold;
      font-size: @FSize_16;
      color: @fontDarkColor;
    }
  }
}

.dialog__add {
  .add__form {
    padding: 20px 20px 0 20px;
  }

  .add__header {
    display: flex;
    align-items: center;
    font-size: @FSize_16;
    height: 50px;
    padding: 0 20px;
    justify-content: space-between;

    .tit {
      color: @fontDarkColor;
      font-size: @FSize_20;
      font-weight: bold;
    }

    i {
      color: @primaryColor;
      cursor: pointer;
    }
  }

  .add__footer {
    display: flex;
    height: 76px;
    align-items: center;
    justify-content: space-between;
  }
}

.content__bottom {
  box-sizing: border-box;
  display: flex;
  background: @contentHdColor;

  .bottom__template {
    width: 100%;
    padding: 15px;
    box-sizing: border-box;

    div {
      display: inline-block;
      width: 50%;
      height: 25px;
      line-height: 25px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      .item__name {
        display: inline-block;
        width: 85px;
        text-align-last: justify;
        position: relative;
        padding-right: 14px;
        font-size: @FSize_14;

        &:after {
          content: "：";
          position: absolute;
          right: 0px;
        }
      }

      .item__label {
        font-weight: 700;
        font-size: @FSize_14;
      }
    }

    div:nth-child(1),
    div:nth-last-child(1) {
      width: 100%;
    }
  }
}
</style>

<style lang="less">
.common__content {
  .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
}

.isnb__popover {
  box-sizing: border-box;
  max-height: 600px;
  overflow: auto;
  table {
    border-collapse: collapse;
  }
  td {
    border: 1px solid #c8d3df;
  }
  tr {
    line-height: 23px;
    color: #333;
    font-size: 14px;
  }
}
</style>
