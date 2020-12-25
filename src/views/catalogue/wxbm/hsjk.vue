<!--
 * @Description: 回溯建库
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-03-16 11:10:26
 * @LastEditTime: 2020-03-11 11:58:53
 -->

<template>
  <div class="cal-hsjk common__content">
    <td-content-header>
      书目信息
      <template v-slot:btns>
        <div class="header__ops">
          <el-checkbox v-if="false">使用MARC模式编目</el-checkbox>
          <el-button size="mini" type="primary" @click="handleXzbm">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            :disabled="multipleCatalogueSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteCatalogue('')"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
            <span v-show="multipleCatalogueSelection.length"
              >({{ multipleCatalogueSelection.length }})</span
            >
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="handleRec('')"
            :disabled="multipleCatalogueSelection.length === 0"
          >
            <icon-svg icon-class="icon-btn-ico-12" />推荐
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 书目信息 -->
    <div class="content content__catalogue">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <!-- 阅读岛的批次根据现在馆改动 -->
          <el-select
            filterable
            size="mini"
            v-if="$TDLib === 'yun'"
            v-model="selectLibId"
            @change="
              getThemeList();
              _getUserList();
            "
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
            size="mini"
            v-if="$TDLib !== 'yun'"
            @change="
              getCatalogBatchListALL();
              getThemeList();
              _getUserList();
            "
            v-model="selectLibId"
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
            class="group__filter_type"
            size="mini"
            v-model="currentCatalogueFilterKey"
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
            clearable
            class="group__filter_value"
            v-model="catalogueSearchKey"
            placeholder="请输入搜索关键词"
            ref="focusInput"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (catalogueSearchKey = val),
                initCatalogueList
              )
            "
            @keydown.enter.native="delayFunc(initCatalogueList)"
          ></el-input>
          <p class="label" v-show="$TDLib === 'yun'">财产馆：</p>
          <el-select
            filterable
            size="mini"
            v-show="$TDLib === 'yun'"
            v-model="filter_cygid0"
            placeholder="请选择"
          >
            <el-option
              v-for="item in fullLibList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label" v-show="$TDLib === 'yun'">现在馆：</p>
          <el-select
            filterable
            v-show="$TDLib === 'yun'"
            size="mini"
            @change="getCatalogBatchListALL"
            v-model="filter_cygid1"
            placeholder="请选择"
          >
            <el-option
              v-for="item in fullLibList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">批次：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectBatchId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in batchOptionsAll"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="header__line">
          <p class="label">审校：</p>
          <el-select
            style="width: 50px;"
            filterable
            clearable
            size="mini"
            v-model="isAudit"
            placeholder="请选择"
          >
            <el-option label="是" :value="1"></el-option>
            <el-option label="否" :value="0"></el-option>
          </el-select>
          <p class="label">创建人：</p>
          <el-select
            filterable
            clearable
            size="mini"
            v-model="createUserId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">创建日期：</p>
          <el-date-picker
            v-model="createStartDate"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="起始日期"
          >
          </el-date-picker>
          <span class="gap_r">至</span>
          <el-date-picker
            v-model="createEndDate"
            type="date"
            size="mini"
            value-format="yyyy-MM-dd"
            placeholder="结束日期"
          >
          </el-date-picker>
          <el-button type="primary" size="mini" @click="initCatalogueList">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div
        class="content__table content__table_catalogue"
        tabindex="1"
        ref="catalogueTableOut"
      >
        <el-table
          v-loading="loadCatalogueData"
          ref="catalogueTable"
          :row-class-name="setSelectionClass"
          @row-dblclick="catalogueRowDblclick"
          @current-change="catalogueCurrentChange"
          @selection-change="handleCatalogueSelectionChange"
          border
          :data="catalogueList"
          stripe
          style="width: 100%"
          height="100%"
          highlight-current-row
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
            width="30"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isbn"
            label="ISBN"
            width="145"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="flhao"
            label="分类号"
            width="90"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            label="正题名"
            min-width="115"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ftming"
            label="副题名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbzhe"
            label="出版社"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjming"
            label="分辑名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fjhao"
            label="分辑号"
            width="55"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="yma"
            label="页数"
            width="60"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ccun"
            label="尺寸"
            width="50"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="创建人"
            width="65"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="optime" label="创建时间">
            <template slot-scope="scope">
              {{ scope.row.optime | splitDateTime }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="审校" width="40">
            <template slot-scope="scope">
              {{ scope.row.ztai === "已审核" ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="isTjian"
            label="推荐"
            width="40"
          >
            <template slot-scope="scope">
              {{ scope.row.isTjian === "已推荐" ? "是" : "否" }}
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.marctyid"
                :index="scope.$index"
                :ops="['del']"
                @handleDel="deleteCatalogue"
              >
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="
                      handleCataEdit(scope.row.marctyid, scope.row.marcid)
                    "
                  >
                    编目
                  </div>
                  <div class="menu" @click="handleRec(scope.row.marctyid)">
                    推荐
                  </div>
                  <div
                    class="menu"
                    @click="checkDuplicate(scope.row.marctyid, scope.row.isbn)"
                  >
                    查重合并
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCatalogueSizeChange"
          @current-change="handleCatalogueCurrentChange"
          :total="totalCatalogueCount"
          :currentPage="currentCataloguePage"
          :pageSize="cataloguePageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 书目推荐 -->
    <el-dialog title="图书推荐" :visible.sync="showRecommendDialog">
      <p>关联主题：</p>
      <el-select filterable size="mini" v-model="themeId" placeholder="请选择">
        <el-option
          v-for="item in themeList"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <br />
      <br />
      <p>备注：</p>
      <el-input clearable size="mini" v-model="recommendReason"></el-input>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button type="primary" size="mini" @click="handleRecSubmit"
            >推 荐</el-button
          >
          <el-button size="mini" @click="showRecommendDialog = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
    <!-- 分割区域 -->
    <td-content-header>
      <span>馆藏信息</span>
      <span class="tips">
        本馆馆藏总数：{{ localCollectionCount }} 所有分馆馆藏总数：{{
          allCollectionCount
        }}
      </span>
      <el-checkbox
        :disabled="!currentMarctyId"
        v-model="showLocalCollection"
        @change="initBookListByCatalogue"
        >显示本馆馆藏</el-checkbox
      >
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            title="新增快捷键：ALT+N"
            :disabled="!currentMarctyId"
            size="mini"
            type="primary"
            @click="showAddCollection"
          >
            <icon-svg icon-class="icon-btn-ico-" />新增(N)
          </el-button>
          <el-button
            :disabled="multipleCollectionSelection.length === 0"
            size="mini"
            type="primary"
            @click="modiCollection"
          >
            <icon-svg icon-class="icon-btn-ico-22" />编辑
            <span v-show="multipleCollectionSelection.length"
              >({{ multipleCollectionSelection.length }})</span
            >
          </el-button>
          <el-button
            :disabled="multipleCollectionSelection.length === 0"
            size="mini"
            type="primary"
            @click="changeCollectionSSH"
            >修改索书号</el-button
          >
          <el-button
            :disabled="multipleCollectionSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteCollection('')"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
            <span v-show="multipleCollectionSelection.length"
              >({{ multipleCollectionSelection.length }})</span
            >
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 馆藏信息 -->
    <div class="content content__collection">
      <div class="content__table" ref="collectionTableOut">
        <el-table
          v-loading="loadCollectionData"
          highlight-current-row
          ref="collectionTable"
          :row-class-name="setSelectionClass1"
          @row-dblclick="collectionRowDblclick"
          @row-click="collectionClickRow"
          @selection-change="handleCollectionSelectionChange"
          border
          :data="collectionList"
          stripe
          style="width: 100%"
          v-if="$refs.collectionTableOut"
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
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.shuceid"
                :index="scope.$index"
                :ops="['del', 'modi']"
                @handleModi="checkCollectionDetail"
                @handleDel="deleteCollection"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" v-if="false">
        <td-pagination
          @size-change="handleCollectionSizeChange"
          @current-change="handleCollectionCurrentChange"
          :total="totalCollectionCount"
          :currentPage="currentCollectionPage"
          :pageSize="collectionPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 馆藏新增 -->
    <side-wrap
      class="common__side_form"
      v-show="showAddCollectionSide"
      v-if="initAddCollectionSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tit">{{ currentBookName }} - 添加馆藏</div>
          <i class="el-icon-close" @click="hideAddCollection"></i>
        </div>
      </template>
      <div class="edit__content" v-loading="loadAddFormDefault">
        <el-form
          class="custom__form"
          ref="collectionAddForm"
          label-width="85px"
          size="mini"
          :model="collectionAddForm"
          :rules="collectionFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>基本信息</span>
            </div>
            <el-form-item class="item" prop="tiaoma" label="条形码">
              <el-input
                ref="addFormTiaoma"
                clearable
                @input="getAddFormAllTiaoma"
                @keyup.native="
                  handleBarCodeScanner(
                    $event,
                    handleBarCodeInput,
                    handleAllTiaomaFocus
                  )
                "
                @keydown.enter.native="delayFunc(handleAllTiaomaFocus)"
                v-model="collectionAddForm.tiaoma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="bookNum" label="复本数">
              <el-input
                @input="getAddFormAllTiaoma"
                @keydown.enter.native="$refs.addFormTiaoma.select"
                style="width: 170px;margin-right: 10px;"
                clearable
                ref="addFormFuben"
                v-only-num="collectionAddForm.bookNum"
                v-model="collectionAddForm.bookNum"
              ></el-input>
              <el-checkbox v-model="isRememberHSJKFB">记忆复本</el-checkbox>
            </el-form-item>
            <el-form-item class="item" prop="jcmshu" label="卷册描述">
              <el-input clearable v-model="collectionAddForm.jcmshu"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cejia" label="册价">
              <el-input
                ref="add_ref_cejia"
                clearable
                v-only-num.float="collectionAddForm.cejia"
                v-model="collectionAddForm.cejia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                ref="add_ref_sshao"
                style="width: 150px; margin-right: 10px;"
                clearable
                v-model="collectionAddForm.sshao"
              ></el-input>
              <el-button type="primary" @click="checkAddFormZchao"
                >种次号查缺</el-button
              >
            </el-form-item>
            <el-form-item class="item" prop="taojia" label="套价">
              <el-input
                ref="add_ref_taojia"
                clearable
                v-only-num.float="collectionAddForm.taojia"
                v-model="collectionAddForm.taojia"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="bookCodes"
              label="所有条码"
            >
              <!-- @keyup.native="handleAllBarCodeInput" -->
              <el-input
                style="width: 100%;"
                :rows="4"
                ref="add_ref_bookCodes"
                clearable
                type="textarea"
                v-model="collectionAddForm.bookCodes"
              ></el-input>
            </el-form-item>
            <div class="tit">
              <span>馆藏信息</span>
            </div>
            <el-form-item class="item" prop="cygid1" label="现在馆">
              <el-select
                filterable
                v-model="collectionAddForm.cygid1"
                placeholder="请选择"
                @change="handleAddFormCurrentLibChange"
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
                v-model="collectionAddForm.ztai"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ztaiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="czid1" label="现在馆藏址">
              <el-select
                filterable
                v-model="collectionAddForm.czid1"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in xzgczOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="wxlyuan" label="文献来源">
              <el-select
                filterable
                v-model="collectionAddForm.wxlyuan"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in wxlyuanOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="cygid0" label="财产馆">
              <el-select
                filterable
                disabled
                v-model="collectionAddForm.cygid0"
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
                v-model="collectionAddForm.ltlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ltlxidOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="czid0" label="财产馆藏址">
              <el-select
                filterable
                v-model="collectionAddForm.czid0"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ccgczOptions"
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
                ref="add_ref_gysid"
                v-model="collectionAddForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="batchid" label="批次">
              <el-select
                filterable
                ref="add_ref_batchid"
                v-model="collectionAddForm.batchid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in batchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-select
                filterable
                v-model="collectionAddForm.jzleixing"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in jzleixingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysuanid" label="预算">
              <el-select
                filterable
                ref="add_ref_yusuanid"
                v-model="collectionAddForm.ysuanid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-select
                filterable
                v-model="collectionAddForm.zdfangshi"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdfangshiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="collectionAddForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('collectionAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              title="保存快捷键：ALT+S"
              size="mini"
              @click="submitForm('collectionAddForm')"
              type="primary"
              >保存(S)</el-button
            >
            <el-button
              title="取消快捷键：ALT+Z"
              size="mini"
              @click="hideAddCollection"
              >取消(Z)</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 馆藏修改 -->
    <side-wrap
      class="common__side_form"
      v-show="showEditCollectionSide"
      v-if="initEditCollectionSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">{{ currentBookNameTit }} - 修改馆藏</div>
          </div>
          <i class="el-icon-close" @click="showEditCollectionSide = false"></i>
        </div>
      </template>
      <div class="edit__content" v-loading="loadEditFormDefault">
        <el-form
          class="custom__form"
          ref="collectionEditForm"
          label-width="85px"
          size="mini"
          :model="collectionEditForm"
          :rules="collectionFormRules"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>基本信息</span>
            </div>
            <el-form-item class="item" prop="tiaoma" label="条形码">
              <!-- @keyup.native="handleBarCodeInputChange" -->
              <el-input
                clearable
                @input="getEditFormAllTiaoma"
                v-model="collectionEditForm.tiaoma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="bookNum" label="复本数">
              <el-input
                disabled
                clearable
                v-only-num="collectionEditForm.bookNum"
                v-model="collectionEditForm.bookNum"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jcmshu" label="卷册描述">
              <el-input
                clearable
                v-model="collectionEditForm.jcmshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cejia" label="册价">
              <el-input
                clearable
                ref="edit_ref_cejia"
                v-only-num.float="collectionEditForm.cejia"
                v-model="collectionEditForm.cejia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sshao" label="索书号">
              <el-input
                ref="edit_ref_sshao"
                clearable
                style="width: 150px; margin-right: 10px;"
                v-model="collectionEditForm.sshao"
              ></el-input>
              <el-button type="primary" @click="checkEditFormZchao"
                >种次号查缺</el-button
              >
            </el-form-item>
            <el-form-item class="item" prop="taojia" label="套价">
              <el-input
                ref="edit_ref_taojia"
                clearable
                v-only-num.float="collectionEditForm.taojia"
                v-model="collectionEditForm.taojia"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__line"
              prop="bookCodes"
              label="所有条码"
            >
              <el-input
                style="width: 100%;"
                ref="edit_ref_bookCodes"
                :rows="4"
                clearable
                readonly
                type="textarea"
                v-model="collectionEditForm.bookCodes"
              ></el-input>
            </el-form-item>
            <div class="tit">
              <span>馆藏信息</span>
            </div>
            <el-form-item class="item" prop="cygid1" label="现在馆">
              <el-select
                filterable
                v-model="collectionEditForm.cygid1"
                placeholder="请选择"
                @change="handleEditFormCurrentLibChange"
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
                v-model="collectionEditForm.ztai"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ztaiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="czid1" label="现在馆藏址">
              <el-select
                filterable
                v-model="collectionEditForm.czid1"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in xzgczOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="wxlyuan" label="文献来源">
              <el-select
                filterable
                v-model="collectionEditForm.wxlyuan"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in wxlyuanOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="cygid0" label="财产馆">
              <el-select
                filterable
                disabled
                v-model="collectionEditForm.cygid0"
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
                v-model="collectionEditForm.ltlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ltlxidOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="czid0" label="财产馆藏址">
              <el-select
                filterable
                v-model="collectionEditForm.czid0"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ccgczOptions"
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
                ref="edit_ref_gysid"
                v-model="collectionEditForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="batchid" label="批次">
              <el-select
                filterable
                ref="edit_ref_batchid"
                v-model="collectionEditForm.batchid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in batchOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-select
                filterable
                v-model="collectionEditForm.jzleixing"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in jzleixingOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysuanid" label="预算">
              <el-select
                filterable
                ref="edit_ref_ysuanid"
                v-model="collectionEditForm.ysuanid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-select
                filterable
                v-model="collectionEditForm.zdfangshi"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdfangshiOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="collectionEditForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('collectionEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('collectionEditForm')"
              type="primary"
              >保存(S)</el-button
            >
            <el-button size="mini" @click="showEditCollectionSide = false"
              >取消(Z)</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 批量修改索书号 -->
    <el-dialog
      title="修改索书号"
      :visible.sync="dialogChangeSSHVisible"
      :close-on-click-modal="false"
    >
      <el-form
        label-width="80px"
        size="medium"
        ref="sshForm"
        :model="sshForm"
        @submit.native.prevent
      >
        <el-form-item
          style="margin-bottom: 7px;"
          label="索书号："
          prop="sshao"
          :rules="{
            required: true,
            message: '请输入索书号',
            trigger: 'change'
          }"
        >
          <el-input
            style="width: calc(100% - 118px);"
            v-model="sshForm.sshao"
            placeholder="请输入索书号"
            @keyup.enter.native="submitChangeSSH"
            clearable
          ></el-input>
          <el-button style="margin-left: 20px;" @click="generateSSH"
            >自动生成</el-button
          >
        </el-form-item>
        <el-form-item>
          <el-checkbox v-model="isCheck">种次号自动查缺</el-checkbox>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <div></div>
        <div>
          <el-button size="mini" type="primary" @click="submitChangeSSH"
            >确定</el-button
          >
          <el-button size="mini" @click="dialogChangeSSHVisible = false"
            >取 消</el-button
          >
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  catalogueList,
  catalogueDelete,
  catalogueRecommend,
  bookListByCatalogue,
  bookDelete,
  bookBookDefault,
  bookSave,
  bookGetBookById,
  checkZchao,
  updateBatchSshao,
  checkLibUpdate,
  getSSHao
} from "api/catalogue";

import {
  flowType,
  userGysInLibList,
  userYsLibList,
  userCzList,
  getAllLibList,
  catalogBatchList,
  userList
} from "api/public";

import { themeList } from "api/acquisition";

import {
  ZTAI_OPTIONS,
  ZDFANGSHI_OPTIONS,
  JZLEIXING_OPTIONS,
  WXLYUAN_OPTIONS
} from "utils/variables";

import { HSJK_OPTIONS } from "utils/selectOptions";

import { mapGetters } from "vuex";

export default {
  name: "cat_hsjk",
  activated() {
    this.setEventListeners();
    this.getAllLibList();
    this.getCatalogBatchListALL();
    this.$refs["focusInput"].select();
    if (this.needUpdate) {
      this.getCatalogueList();
      this.needUpdate = false;
    }
    if (this.needUpdateGc) {
      this.getBookListByCatalogue();
      this.needUpdateGc = false;
    }
  },
  deactivated() {
    this.removeEventListeners();
  },
  created() {
    this.getCatalogBatchListALL();
    this.getCatalogBatchList();
    this.getThemeList();
    this._getUserList();
  },
  mounted() {
    this.$refs["focusInput"].select();
    this.$eventBus.$on("jdbm-update", () => {
      this.needUpdate = true;
    });
    this.$eventBus.$on("hsjk-updategcxx", () => {
      this.needUpdateGc = true;
    });
    if (JSON.parse(localStorage.getItem("td-hsjkjyfb"))) {
      this.isRememberHSJKFB = true;
      this.collectionAddFormOrigin.bookNum = localStorage.getItem(
        "td-hsjktiaomu"
      );
    }
    this.getAllLibList();
    this.collectionAddFormOrigin.tiaoma = localStorage.getItem("td-hsjktiaoma");
    this.setEventListeners();
    document
      .querySelector(".content__catalogue")
      .addEventListener("keydown", this.tableKeyEvent, false);
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
    this.removeEventListeners();
  },
  data() {
    let checkTiaoma = (rule, value, callback) => {
      if (value === "" || value === null) {
        callback(new Error("条形码不能为空"));
      } else {
        callback();
      }
    };
    this.catalogueFilterOptions = HSJK_OPTIONS;
    this.ztaiOptions = ZTAI_OPTIONS;
    this.zdfangshiOptions = ZDFANGSHI_OPTIONS;
    this.jzleixingOptions = JZLEIXING_OPTIONS;
    this.wxlyuanOptions = WXLYUAN_OPTIONS;
    this.collectionFormRules = {
      bookCodes: [
        {
          required: true,
          validator: checkTiaoma,
          trigger: "blur"
        }
      ],
      sshao: [
        {
          required: true,
          message: "索书号不能为空",
          trigger: "blur"
        }
      ],
      gysid: [
        {
          required: true,
          message: "供应商不能为空",
          trigger: "change"
        }
      ],
      batchid: [
        {
          required: true,
          message: "批次不能为空",
          trigger: "change"
        }
      ],
      ysuanid: [
        {
          required: true,
          message: "预算不能为空",
          trigger: "change"
        }
      ],
      cejia: [
        {
          required: true,
          message: "册价不能为空",
          trigger: "blur"
        }
      ],
      taojia: [
        {
          required: true,
          message: "套价不能为空",
          trigger: "blur"
        }
      ]
    };
    return {
      allLibList: [],
      fullLibList: [],
      isRememberHSJKFB: false, // 记忆复本数
      // 书目列表
      multipleCatalogueSelection: [],
      currentCatalogueFilterKey: "isbn",
      selectLibId: this.$store.getters.userInfo.libId,
      userList: [],
      createUserId: "",
      isAudit: "",
      createStartDate: "",
      createEndDate: "",
      batchOptionsAll: [],
      selectBatchId: "",
      catalogueSearchKey: "",
      filter_cygid0: "",
      filter_cygid1: "",
      loadCatalogueData: false,
      catalogueList: [],
      totalCatalogueCount: 0,
      currentCataloguePage: 1,
      cataloguePageSize: 15,
      showRecommendDialog: false,
      themeId: "",
      themeList: [], // 推荐列表
      recommendReason: "",
      currentMarctyId: "", // 当前选中行
      // 馆藏信息
      localCollectionCount: "-",
      allCollectionCount: "-",
      showLocalCollection: false,
      multipleCollectionSelection: [],
      multipleCollectionSSHSelection: [],
      dialogChangeSSHVisible: false,
      sshForm: {
        sshao: ""
      },
      loadCollectionData: false,
      collectionList: [],
      totalCollectionCount: 0,
      currentCollectionPage: 1,
      collectionPageSize: 15,
      currentBookName: "",
      currentBookNameTit: "", // 修改馆藏调用接口才更新标题
      // 馆藏新增
      loadAddFormDefault: false,
      showAddCollectionSide: false,
      initAddCollectionSide: false,
      collectionAddFormOrigin: {
        tiaoma: "",
        bookNum: 1,
        jcmshu: "",
        cejia: "",
        sshao: "",
        taojia: "",
        bookCodes: "",
        cygid1: "",
        ztai: "",
        czid1: "",
        wxlyuan: "",
        cygid0: "",
        ltlxid: "",
        czid0: "",
        gysid: "",
        batchid: "",
        jzleixing: "",
        ysuanid: "",
        zdfangshi: "",
        beizhu: ""
      },
      collectionAddForm: {
        tiaoma: "",
        bookNum: 1,
        jcmshu: "",
        cejia: "",
        sshao: "",
        taojia: "",
        bookCodes: "",
        cygid1: "",
        ztai: "",
        czid1: "",
        wxlyuan: "",
        cygid0: "",
        ltlxid: "",
        czid0: "",
        gysid: "",
        batchid: "",
        jzleixing: "",
        ysuanid: "",
        zdfangshi: "",
        beizhu: ""
      },
      // 索书号修改
      isCheck: true,
      // 馆藏修改
      showEditCollectionSide: false,
      initEditCollectionSide: false,
      loadEditFormDefault: false,
      collectionEditForm: {
        tiaoma: "",
        bookNum: 1,
        jcmshu: "",
        cejia: "",
        sshao: "",
        taojia: "",
        bookCodes: "",
        cygid1: "",
        ztai: "",
        czid1: "",
        wxlyuan: "",
        cygid0: "",
        ltlxid: "",
        czid0: "",
        gysid: "",
        batchid: "",
        jzleixing: "",
        ysuanid: "",
        zdfangshi: "",
        beizhu: ""
      },
      // 类型列表
      ltlxidOptions: [], // 流通类型
      xzgczOptions: [], // 现在馆藏址
      ccgczOptions: [], // 财产馆藏址
      gysOptions: [], // 供应商列表
      batchOptions: [], // 批次列表
      ysOptions: [] // 预算列表
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    _getUserList() {
      userList({
        libId: this.selectLibId
      }).then(res => {
        this.userList = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
      });
    },
    getThemeList() {
      themeList({
        libId: this.selectLibId
      }).then(res => {
        this.themeList = res.data
          .filter(item => item.themeZtai == 0)
          .map(item => {
            return {
              label: item.themeTitle,
              value: item.themeId
            };
          });
      });
    },
    // 获取批次
    getCatalogBatchListALL() {
      catalogBatchList({
        flag: 0,
        libId: this.selectLibId
      }).then(res => {
        this.batchOptionsAll = res.data.map(item => {
          return {
            label: item.batchCode,
            value: item.batchId
          };
        });
        this.batchOptionsAll.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    getCatalogBatchList(isChange) {
      catalogBatchList({
        flag: 0,
        libId: this.getCurrentLibId()
      }).then(res => {
        this.batchOptions = res.data.map(item => {
          if (item.last === true && !this.initBatch) {
            this.initBatch = true;
            this.collectionAddFormOrigin.batchid = item.batchId;
            this.collectionAddForm.batchid = item.batchId;
          }
          return {
            label: item.batchCode,
            value: item.batchId
          };
        });
        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.batchid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.batchid = this.batchOptions[0]
            ? this.batchOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.batchid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.batchid = this.batchOptions[0]
            ? this.batchOptions[0].value
            : "";
        }
      });
    },
    setEventListeners() {
      document.body.addEventListener("keydown", this.shortCutEvent, false);
    },
    removeEventListeners() {
      document.body.removeEventListener("keydown", this.shortCutEvent, false);
    },
    // 书目列表
    initCatalogueList() {
      this.currentCataloguePage = 1;
      this.setCatalogueRequestObj();
      this.getCatalogueList();
    },
    setCatalogueRequestObj() {
      this.catalogueRequestObj = {
        libId: this.selectLibId,
        batchId: this.selectBatchId,
        cygid0: this.filter_cygid0,
        cygid1: this.filter_cygid1,
        isAudit: this.isAudit,
        createUserId: this.createUserId,
        createStartDate: this.createStartDate,
        createEndDate: this.createEndDate
      };
      this.catalogueRequestObj[
        this.currentCatalogueFilterKey
      ] = this.catalogueSearchKey;
    },
    getCatalogueList() {
      // 重置馆藏信息
      this.currentMarctyId = "";
      this.initBookListByCatalogue();

      this.loadCatalogueData = true;

      let requestObj = {
        pageNumber: this.currentCataloguePage,
        pageSize: this.cataloguePageSize,
        ...this.catalogueRequestObj
      };
      catalogueList(requestObj)
        .then(res => {
          this.loadCatalogueData = false;
          res.data.dataList.forEach((item, index) => {
            item.$index = index;
          });
          this.catalogueList = res.data.dataList;
          this.totalCatalogueCount = +res.data.totalElements;
          // 输入ISBN回车后，系统默认选中搜索结果中的第一条数据，如无数据，全选本次输入的ISBN，等待下一次输入
          if (this.totalCatalogueCount > 0) {
            this.$nextTick(() => {
              document.querySelector(".content__table_catalogue").focus();
              this.setCurrent(this.catalogueList[0]);
              this.$refs.focusInput.select();
            });
          } else {
            this.$refs.focusInput.select();
            this.$message.warning(
              "查询（" +
                HSJK_OPTIONS.filter(
                  item => item.value === this.currentCatalogueFilterKey
                )[0].label +
                ":" +
                this.catalogueSearchKey +
                "）暂无数据"
            );
          }
        })
        .catch(() => {
          this.loadCatalogueData = false;
        });
    },
    setSelectionClass({ row }) {
      if (this.multipleCatalogueSelection.includes(row.marctyid)) {
        return "row-selection";
      }
    },
    setSelectionClass1({ row }) {
      if (this.multipleCollectionSelection.includes(row.shuceid)) {
        return "row-selection";
      }
    },
    handleCatalogueSelectionChange(val) {
      this.multipleCatalogueSelection = val.map(item => item.marctyid);
    },
    handleXzbm() {
      let isbn = this.currentISBN
        ? this.currentISBN
        : this.currentCatalogueFilterKey === "isbn"
        ? this.catalogueSearchKey
        : "";
      let queryObj = {
        isbn
      };
      if (this.currentMarctyId) {
        queryObj.marctyId = this.currentMarctyId;
      }
      this.$router.push({
        name: "cat_xzbm",
        query: queryObj
      });
    },
    deleteCatalogue(ids, index) {
      this.$confirm(
        `确定删除 ${
          ids ? 1 : this.multipleCatalogueSelection.length
        } 条书目数据么?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadCatalogueData = true;
          catalogueDelete({
            marctyIds: ids ? ids : this.multipleCatalogueSelection.join(",")
          })
            .then(res => {
              this.loadCatalogueData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.catalogueList.splice(index, 1);
              } else {
                this.initCatalogueList();
              }
            })
            .catch(() => {
              this.loadCatalogueData = false;
            });
        })
        .catch(() => {});
    },
    handleCataEdit(marctyid, marcid) {
      this.$router.push({
        name: "cat_bm",
        query: {
          marctyid,
          marcid,
          from: "cat_hsjk"
        }
      });
    },
    // 查重
    checkDuplicate(marctyid, isbn) {
      this.$router.push({
        name: "cat_cc",
        query: {
          marctyid,
          isbn,
          from: "cat_hsjk"
        }
      });
    },
    // 推荐
    handleRec(ids) {
      this.recommendsArr = ids
        ? ids
        : this.multipleCatalogueSelection.join(",");
      this.showRecommendDialog = true;
    },
    handleRecSubmit() {
      if (!this.themeId) {
        this.$message.warning("请选择关联主题");
        return;
      }

      catalogueRecommend({
        marctyIds: this.recommendsArr,
        remark: this.recommendReason,
        themeId: this.themeId
      }).then(res => {
        this.recommendReason = "";
        this.themeId = "";
        this.showRecommendDialog = false;
        this.$message.success(res.message);
        this.getCatalogueList();
      });
    },
    handleCatalogueSizeChange(val) {
      this.cataloguePageSize = val;
      this.getCatalogueList();
    },
    handleCatalogueCurrentChange(val) {
      this.currentCataloguePage = val;
      this.getCatalogueList();
    },
    setCurrent(row) {
      this.$refs.catalogueTable.setCurrentRow(row);
      document
        .querySelector(".content__table_catalogue table tbody")
        .children[row.$index].scrollIntoView();
    },
    catalogueCurrentChange(row) {
      if (!row) {
        this.currentISBN = "";
        return;
      }
      this.currentISBN = row.isbn;
      this.currentCataIndex = row.$index;
      // 选中后加载馆藏数据
      this.currentFlhao = row.flhao;
      this.currentZrsming = row.zrsming;
      this.currentMarctyId = row.marctyid;
      this.currentBookName = row.ztming;
      this.currentCollectionPage = 1;
      this.getBookListByCatalogue();
    },
    catalogueRowDblclick(row) {
      this.handleCataEdit(row.marctyid, row.marcid);
    },
    catalogueRowClick(row) {
      this.$refs.catalogueTable.toggleRowSelection(row);
    },
    // 馆藏信息
    initBookListByCatalogue() {
      if (!this.currentMarctyId) {
        this.collectionList = [];
        return;
      }
      this.currentCollectionPage = 1;
      this.getBookListByCatalogue();
    },
    getBookListByCatalogue() {
      this.loadCollectionData = true;
      bookListByCatalogue({
        marctyId: this.currentMarctyId,
        pageSize: 1000,
        pageNumber: this.currentCollectionPage,
        isShow: +this.showLocalCollection
      })
        .then(res => {
          res.data.page.dataList.forEach(item => {
            item.cejia = item.cejia.toFixed(2);
            item.taojia = item.taojia.toFixed(2);
          });
          this.collectionList = res.data.page.dataList;
          this.totalCollectionCount = +res.data.page.totalElements;

          this.localCollectionCount = res.data.curLibCount;
          this.allCollectionCount = res.data.count;
        })
        .finally(() => {
          this.loadCollectionData = false;
        });
    },
    collectionRowDblclick(row) {
      this.checkCollectionDetail(row.shuceid);
    },
    collectionClickRow(row) {
      this.$refs.collectionTable.toggleRowSelection(row);
    },
    handleCollectionSelectionChange(val) {
      this.multipleCollectionSelectionCYG1 = val.map(item => item.cygid1);
      this.multipleCollectionSelection = val.map(item => item.shuceid);
      this.multipleCollectionSSHSelection = val.map(item => item.sshao);
      this.multipleCollectionSelectionArr = val.map(item => {
        return {
          shuceid: item.shuceid,
          sshid: item.sshid
        };
      });
    },
    modiCollection() {
      // 相同馆才能批量编辑
      let firstCYG1 = this.multipleCollectionSelectionCYG1[0];
      for (let i = 1; i < this.multipleCollectionSelectionCYG1.length; i++) {
        if (firstCYG1 !== this.multipleCollectionSelectionCYG1[i]) {
          this.$message.error("批量编辑只能修改相同馆的馆藏!");
          return;
        }
      }
      checkLibUpdate({
        libId: firstCYG1
      }).then(() => {
        this.$router.push({
          name: "cat_plbjgc",
          query: {
            libId: firstCYG1
          },
          params: {
            shuceid: this.multipleCollectionSelection.join(",")
          }
        });
      });
    },
    changeCollectionSSH() {
      // 相同馆才能批量编辑
      let firstCYG1 = this.multipleCollectionSelectionCYG1[0];
      for (let i = 1; i < this.multipleCollectionSelectionCYG1.length; i++) {
        if (firstCYG1 !== this.multipleCollectionSelectionCYG1[i]) {
          this.$message.error("只能同时修改相同馆的索书号!");
          return;
        }
      }
      let firsetSSH = this.multipleCollectionSSHSelection[0];
      let canModiSSH = true;
      if (this.multipleCollectionSSHSelection.length > 1) {
        for (let i = 1; i < this.multipleCollectionSSHSelection.length; i++) {
          if (this.multipleCollectionSSHSelection[i] !== firsetSSH) {
            canModiSSH = false;
            break;
          }
        }
      }
      if (!canModiSSH) {
        this.$message.warning("只能对同一索书号进行批量修改");
        return;
      }
      this.sshForm.sshao = firsetSSH;
      this.dialogChangeSSHVisible = true;
    },
    generateSSH() {
      getSSHao({
        libId: this.multipleCollectionSelectionCYG1[0],
        flhao: this.currentFlhao,
        author: this.currentZrsming,
        isCheck: this.isCheck ? 1 : 0
      }).then(res => {
        this.sshForm.sshao = res.data;
      });
    },
    submitChangeSSH() {
      this.$refs["sshForm"].validate(valid => {
        if (valid) {
          updateBatchSshao({
            sshao: this.sshForm.sshao,
            bookList: JSON.stringify(this.multipleCollectionSelectionArr)
          }).then(res => {
            this.dialogChangeSSHVisible = false;
            this.getBookListByCatalogue();
            this.$message.success(res.message);
          });
        }
      });
    },
    deleteCollection(ids, index) {
      this.$confirm(
        `确定删除 ${
          ids ? 1 : this.multipleCollectionSelection.length
        } 条馆藏数据么?`,
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      )
        .then(() => {
          this.loadCollectionData = true;
          bookDelete({
            shuceIds: ids ? ids : this.multipleCollectionSelection.join(",")
          })
            .then(res => {
              this.loadCollectionData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.collectionList.splice(index, 1);
              } else {
                this.initBookListByCatalogue();
              }
            })
            .catch(() => {
              this.loadCollectionData = false;
            });
        })
        .catch(() => {});
    },
    handleCollectionSizeChange(val) {
      this.collectionPageSize = val;
      this.getBookListByCatalogue();
    },
    handleCollectionCurrentChange(val) {
      this.currentCollectionPage = val;
      this.getBookListByCatalogue();
    },
    // 馆藏新增
    hideAddCollection() {
      this.showAddCollectionSide = false;
      this.$refs.focusInput.select();
    },
    showAddCollection() {
      if (!this.currentMarctyId) {
        return;
      }
      this.currentFormMode = "add"; // 新增模式
      this.getCollectionAddFormDefault();
    },
    checkAddFormZchao() {
      checkZchao({
        flhao: this.currentFlhao,
        libId: this.collectionAddForm.cygid1
      }).then(res => {
        this.collectionAddForm.sshao = res.data;
      });
    },
    getCollectionAddFormDefault() {
      this.initAddCollectionSide = true;
      this.showAddCollectionSide = true;
      this.loadAddFormDefault = true;
      this.$nextTick(() => {
        this.$refs.addFormFuben.select();
      });
      setTimeout(() => {
        bookBookDefault({
          marctyId: this.currentMarctyId
        }).then(res => {
          this.loadAddFormDefault = false;
          // 删除空数据和多余的数据
          Object.keys(res.data.bookDeault).map(key => {
            if (!(key in this.collectionAddForm)) {
              delete res.data.bookDeault[key];
            }
            if (
              res.data.bookDeault[key] === null ||
              res.data.bookDeault[key] === ""
            ) {
              delete res.data.bookDeault[key];
            }
          });
          this.collectionAddForm = {
            ...this.collectionAddFormOrigin,
            sshao: res.data.sshao,
            ...res.data.bookDeault,
            marctyId: this.currentMarctyId
          };
          this.getAddFormAllTiaoma();
          // 重置表格用
          this.collectionAddFormCopy = Object.assign(
            {},
            this.collectionAddForm
          );

          if (res.data.bookDeault.cygid1) {
            // 有默认的现在馆，获取现在馆藏址、流通类型、供应商、预算
            this.getCurrentCzOptions();
            this.getLtlxOptions();
            this.getGysOptions();
            this.getYsOptions();
            this.getCatalogBatchList();
          }
          if (res.data.bookDeault.cygid0) {
            // 有默认的财产馆，获取财产馆藏址
            this.getAssetCzOptions();
          }
        });
      }, 1000);
    },
    handleCollectionFormAdd() {
      this.loadAddFormDefault = true;
      let requestObj = Object.assign({}, this.collectionAddForm);
      let allCodesArr = requestObj.bookCodes
        .replace(/[\r\n]/g, " ")
        .split(" ")
        .filter(item => item !== "");
      requestObj.bookCodes = allCodesArr.join(",");
      bookSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          let nextTM = this.getNextTiaoma(
            allCodesArr.length > 0 ? allCodesArr[allCodesArr.length - 1] : ""
          );
          this.collectionAddForm.tiaoma = nextTM;
          this.collectionAddFormOrigin.tiaoma = nextTM;
          this.initBookListByCatalogue();
          this.saveLocalStorage();
          this.getAddFormAllTiaoma(); // 保存后更新
          this.hideAddCollection();
        })
        .finally(() => {
          this.loadAddFormDefault = false;
        });
    },
    saveLocalStorage() {
      localStorage.setItem(
        "td-hsjkjyfb",
        JSON.stringify(this.isRememberHSJKFB)
      );
      if (this.isRememberHSJKFB) {
        // 记忆复本数
        localStorage.setItem("td-hsjktiaomu", this.collectionAddForm.bookNum);
        this.collectionAddFormOrigin.bookNum = this.collectionAddForm.bookNum;
      } else {
        localStorage.setItem("td-hsjktiaomu", 1);
        this.collectionAddFormOrigin.bookNum = 1;
      }
      localStorage.setItem("td-hsjktiaoma", this.collectionAddForm.tiaoma);
    },
    handleAddFormCurrentLibChange(val) {
      let isChange = false;
      if (val) {
        // 切换馆导致变化
        isChange = true;
      }
      this.getCurrentCzOptions(isChange);
      this.getLtlxOptions(isChange);
      this.getCatalogBatchList(isChange);
      // this.getGysOptions(isChange);
      // this.getYsOptions(isChange);
    },
    handleAllTiaomaFocus() {
      this.$refs.add_ref_bookCodes.focus();
    },
    handleBarCodeInput(val) {
      this.collectionAddForm.tiaoma = val;
      this.getAddFormAllTiaoma();
    },
    handleBarCodeInputChange(e) {
      if (!this.barCodekeyCodesChnage) {
        this.barCodekeyCodesChnage = [];
      }
      if (e.keyCode !== 16) {
        this.barCodekeyCodesChnage.push(e.keyCode);
      }
      if (this.barCodeChangetimer) {
        clearTimeout(this.barCodeChangetimer);
      }
      this.barCodeChangetimer = setTimeout(() => {
        if (this.barCodekeyCodesChnage.length > 6) {
          let keysArr = Object.assign([], this.barCodekeyCodesChnage);
          if (keysArr[0] === 16) {
            keysArr.splice(0, 1);
          }
          if (keysArr[keysArr.length - 1] === 13) {
            keysArr.splice(keysArr.length - 1);
          }
          let strArr = keysArr.map(item => String.fromCharCode(item));
          this.collectionEditForm.tiaoma = strArr.join("");
          this.getEditFormAllTiaoma();
        }
        this.barCodekeyCodesChnage = [];
      }, 30);
    },
    handleAllBarCodeInput(e) {
      if (!this.allBarCodekeyCodes) {
        this.allBarCodekeyCodes = [];
      }
      // 如果16一位下个字符串是大写
      if (e.keyCode === 16) {
        this.isNextUpper = true;
      }
      if (e.keyCode !== 16 && this.isNextUpper) {
        // 大写
        this.allBarCodekeyCodes.push(e.keyCode);
      } else if (e.keyCode !== 16) {
        // 小写
        this.allBarCodekeyCodes.push(+e.keyCode + 32);
        this.isNextUpper = false;
      }
      if (this.allBarCodetimer) {
        clearTimeout(this.allBarCodetimer);
      }
      this.allBarCodetimer = setTimeout(() => {
        if (this.allBarCodekeyCodes.length > 6) {
          let keysArr = Object.assign([], this.allBarCodekeyCodes);
          if (keysArr[0] === 16) {
            keysArr.splice(0, 1);
          }
          if (keysArr[keysArr.length - 1] === 13) {
            keysArr.splice(keysArr.length - 1);
          }
          let strArr = keysArr.map(item => String.fromCharCode(item));
          this.collectionAddForm.bookCodes =
            (this.tempBookcodesStr || "") + strArr.join("") + "\r";
          this.tempBookcodesStr = this.collectionAddForm.bookCodes;
        } else {
          this.tempBookcodesStr = this.collectionAddForm.bookCodes;
        }
        this.allBarCodekeyCodes = [];
      }, 30);
    },
    getAddFormAllTiaoma() {
      let arr = [];
      let lastTM = this.collectionAddForm.tiaoma;
      if (!lastTM) {
        return;
      }
      if (!(+lastTM[lastTM.length - 1] >= 0)) {
        this.collectionAddForm.bookCodes = "";
        return ""; // 最后一位不为数字
      }
      if (this.collectionAddForm.bookNum > 100) {
        this.collectionAddForm.bookNum = 100;
      }
      for (let i = 0; i < this.collectionAddForm.bookNum; i++) {
        arr.push(lastTM);
        lastTM = this.getNextTiaoma(lastTM);
      }
      this.collectionAddForm.bookCodes = arr.join("\r\n");
    },
    // 馆藏修改
    checkCollectionDetail(id) {
      this.currentShuceId = id;
      this.initEditCollectionSide = true;
      this.showEditCollectionSide = true;
      this.currentFormMode = "edit"; // 新增模式
      this.getCollectionEditFormDetail();
      this.currentBookNameTit = this.currentBookName;
    },
    checkEditFormZchao() {
      checkZchao({
        flhao: this.currentFlhao,
        libId: this.collectionEditForm.cygid1
      }).then(res => {
        this.collectionEditForm.sshao = res.data;
      });
    },
    getCollectionEditFormDetail() {
      this.loadEditFormDefault = true;
      setTimeout(() => {
        bookGetBookById({
          shuceid: this.currentShuceId
        }).then(res => {
          this.loadEditFormDefault = false;
          Object.keys(res.data.book).map(key => {
            if (!(key in this.collectionEditForm)) {
              delete res.data.book[key];
            }
            // if (res.data.book[key] === null || res.data.book[key] === "") {
            //   delete res.data.book[key];
            // }
          });
          this.collectionEditForm = Object.assign({}, res.data.book, {
            sshao: res.data.sshao,
            bookNum: 1,
            bookCodes: res.data.book.tiaoma
          });
          this.collectionEditFormOrigin = Object.assign({}, res.data.book, {
            sshao: res.data.sshao,
            bookNum: 1,
            bookCodes: res.data.book.tiaoma
          });

          if (res.data.book.cygid1) {
            // 有默认的现在馆，获取现在馆藏址、流通类型、供应商、预算、批次
            this.getCurrentCzOptions();
            this.getLtlxOptions();
            this.getGysOptions();
            this.getYsOptions();
            this.getCatalogBatchList();
          }
          if (res.data.book.cygid0) {
            // 有默认的财产馆，获取财产馆藏址
            this.getAssetCzOptions();
          }
        });
      }, 1000);
    },
    getEditFormAllTiaoma(val) {
      this.collectionEditForm.bookCodes = val;
    },
    handleEditFormCurrentLibChange(isChange = true) {
      this.getCurrentCzOptions(isChange);
      this.getLtlxOptions(isChange);
      this.getCatalogBatchList(isChange);
      // this.getGysOptions(isChange);
      // this.getYsOptions(isChange);
    },
    handleCollectionFormEdit() {
      this.loadEditFormDefault = true;
      let requestObj = this.collectionEditForm;
      requestObj.shuceid = this.currentShuceId;
      requestObj.marctyId = this.currentMarctyId;
      bookSave(requestObj)
        .then(res => {
          this.$message.success(res.message);
          this.showEditCollectionSide = false;
          this.getBookListByCatalogue();
        })
        .finally(() => {
          this.loadEditFormDefault = false;
        });
    },
    // 通用
    shortCutEvent(event) {
      if (event.altKey && event.keyCode === 78) {
        // ALT+N 新增馆藏
        window.event.preventDefault();
        this.showAddCollection();
      } else if (event.altKey && event.keyCode === 83) {
        // ALT+S 新增馆藏保存
        window.event.preventDefault();
        if (this.showAddCollectionSide) {
          this.submitForm("collectionAddForm");
        } else if (this.showEditCollectionSide) {
          this.submitForm("collectionEditForm");
        }
      } else if (event.altKey && event.keyCode === 90) {
        // ALT+Z 新增馆藏返回
        window.event.preventDefault();
        if (this.showAddCollectionSide) {
          this.hideAddCollection();
        } else if (this.showEditCollectionSide) {
          this.showEditCollectionSide = false;
        }
      }
    },
    tableKeyEvent(event) {
      // ALT + 方向键
      if (!event.altKey) {
        return;
      }
      if (event.keyCode === 38) {
        // ↑ 切换列表
        window.event.preventDefault();
        if (!this.currentCataIndex && this.currentCataIndex !== 0) {
          return;
        }
        this.currentCataIndex--;
        this.currentCataIndex = Math.max(this.currentCataIndex, 0);
        this.setCurrent(this.catalogueList[this.currentCataIndex]);
      } else if (event.keyCode === 40) {
        // ↓ 切换列表
        window.event.preventDefault();
        if (!this.currentCataIndex && this.currentCataIndex !== 0) {
          return;
        }
        this.currentCataIndex++;
        this.currentCataIndex = Math.min(
          this.currentCataIndex,
          this.catalogueList.length - 1
        );
        this.setCurrent(this.catalogueList[this.currentCataIndex]);
      }
    },
    getAllLibList() {
      getAllLibList().then(res => {
        this.allLibList = res.data
          .map(item => {
            return {
              value: item.libId,
              label: item.libJiancheng
            };
          })
          .sort((a, b) =>
            a["label"].localeCompare(b["label"], "zh-Hans-CN", {
              sensitivity: "accent"
            })
          );
        this.fullLibList = Object.assign([], this.allLibList);
        this.fullLibList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    getNextTiaoma(val) {
      if (!(+val[val.length - 1] >= 0)) {
        return ""; // 最后一位不为数字
      }
      let arrNums = val.match(/\d+(\d+)?/g); // 分隔全部数字
      let lastNum = arrNums[arrNums.length - 1]; // 最后一个数字
      let startString = val.slice(0, val.lastIndexOf(lastNum)); // 获取数字前的字符串
      let totalCount = lastNum.length;
      let result = startString + String(+lastNum + 1).padStart(totalCount, "0");
      return result;
    },
    resetForm(formName) {
      if (formName === "collectionEditForm") {
        // 恢复原始数据
        this.collectionEditForm = Object.assign(
          {},
          this.collectionEditFormOrigin
        );
        this.handleEditFormCurrentLibChange(false);
      } else if (formName === "collectionAddForm") {
        this.collectionAddForm = Object.assign({}, this.collectionAddFormCopy);
        this.handleAddFormCurrentLibChange(false);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, fields) => {
        if (valid) {
          if (formName === "collectionAddForm") {
            this.handleCollectionFormAdd();
          } else if (formName === "collectionEditForm") {
            this.handleCollectionFormEdit();
          }
        } else {
          let errs = Object.keys(fields);
          let errField = errs[0];
          if (errField) {
            let prefix = this.showAddCollectionSide ? "add" : "edit";
            this.$refs[`${prefix}_ref_${errField}`].$el.scrollIntoView();
          }
          return false;
        }
      });
    },
    // 获取各种列表类型
    getLtlxOptions(isChange) {
      // 流通类型
      flowType({
        libId: this.getCurrentLibId()
      }).then(res => {
        this.ltlxidOptions = res.data.map(item => {
          return {
            value: item.ltlxid,
            label: item.mingcheng
          };
        });
        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.ltlxid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.ltlxid = this.ltlxidOptions[0]
            ? this.ltlxidOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.ltlxid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.ltlxid = this.ltlxidOptions[0]
            ? this.ltlxidOptions[0].value
            : "";
        }
      });
    },
    getCurrentCzOptions(isChange) {
      // 现在馆藏址
      userCzList({
        ztai: true,
        libId: this.getCurrentLibId(),
        pageSize: 0,
        pageNumber: 1
      }).then(res => {
        this.xzgczOptions = res.data.map(item => {
          return {
            value: item.czid,
            label: item.mingcheng
          };
        });
        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.czid1) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.czid1 = this.xzgczOptions[0]
            ? this.xzgczOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.czid1) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.czid1 = this.xzgczOptions[0]
            ? this.xzgczOptions[0].value
            : "";
        }
      });
    },
    getGysOptions(isChange) {
      // 供应商列表
      userGysInLibList({
        libId: this.getCurrentCcgLibId()
      }).then(res => {
        this.gysOptions = res.data.map(item => {
          return {
            value: item.gysId,
            label: item.gysName
          };
        });
        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.gysid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.gysid = this.gysOptions[0]
            ? this.gysOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.gysid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.gysid = this.gysOptions[0]
            ? this.gysOptions[0].value
            : "";
        }
      });
    },
    getYsOptions(isChange) {
      // 预算列表
      userYsLibList({
        libId: this.getCurrentCcgLibId()
      }).then(res => {
        this.ysOptions = res.data.map(item => {
          return {
            value: item.ysid,
            label: item.mingcheng
          };
        });
        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.ysuanid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.ysuanid = this.ysOptions[0]
            ? this.ysOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.ysuanid) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.ysuanid = this.ysOptions[0]
            ? this.ysOptions[0].value
            : "";
        }
      });
    },
    getCurrentLibId() {
      return this.currentFormMode === "add"
        ? this.collectionAddForm.cygid1
        : this.collectionEditForm.cygid1;
    },
    getCurrentCcgLibId() {
      return this.currentFormMode === "add"
        ? this.collectionAddForm.cygid0
        : this.collectionEditForm.cygid0;
    },
    getAssetCzOptions(isChange) {
      // 财产馆藏址
      userCzList({
        ztai: true,
        libId:
          this.currentFormMode === "add"
            ? this.collectionAddForm.cygid0
            : this.collectionEditForm.cygid0,
        pageSize: 0,
        pageNumber: 1
      }).then(res => {
        this.ccgczOptions = res.data.map(item => {
          return {
            value: item.czid,
            label: item.mingcheng
          };
        });

        if (this.currentFormMode === "add") {
          if (!isChange && this.collectionAddForm.czid0) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionAddForm.czid0 = this.ccgczOptions[0]
            ? this.ccgczOptions[0].value
            : "";
        } else {
          if (!isChange && this.collectionEditForm.czid0) {
            // 首次加载且有默认值不需要重置
            return;
          }
          this.collectionEditForm.czid0 = this.ccgczOptions[0]
            ? this.ccgczOptions[0].value
            : "";
        }
      });
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";

.cal-hsjk {
  /deep/ .content__header_title {
    .tips {
      font-size: @FSize_14;
      color: @fontTintColor;
      margin: 0 23px 0 10px;
    }

    .el-checkbox__label {
      display: inline;
    }
  }

  .custom__form {
    .item__line {
      /deep/ .el-form-item__content {
        width: 100%;
      }
    }
  }

  .content__catalogue {
    height: ~"calc(60% - 36px)";

    .content__table {
      height: ~"calc(100% - 62px - 32px)";

      .status {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 50%;
        margin-right: 5px;
        background: #919faf;

        &.active {
          background: #1dc147;
        }
      }
    }
  }

  .content__table_catalogue {
    outline: none;
  }

  .content__collection {
    height: ~"calc(40% - 37px)";

    .content__table {
      height: 100%;
    }
  }

  .check__tips {
    color: @dangerColor;
    font-weight: bold;
  }
}
</style>
