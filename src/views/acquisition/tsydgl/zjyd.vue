/* eslint-disable no-useless-escape */
<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: wj.liang
 * @Date: 2019-03-16 11:09:37
 * @LastEditTime: 2020-03-10 16:18:59
 -->

<template>
  <div class="acq-zjyd common__content">
    <td-content-header>
      预订书目信息【预订单号：{{ defaultYDD || "暂未设置" }}】
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleYDAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <el-scrollbar>
        <div class="top">
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
                >
                </el-option>
              </el-select>
              <el-input
                ref="focusInput"
                size="mini"
                clearable
                class="group__filters_value"
                v-model="currentFilterVal"
                placeholder="请输入搜索关键词"
                @keyup.native="
                  handleBarCodeScanner(
                    $event,
                    val => (currentFilterVal = val),
                    initYDCatalogList
                  )
                "
                @keydown.enter.native="delayFunc(initYDCatalogList)"
              ></el-input>
              <el-button type="primary" size="mini" @click="initYDCatalogList"
                ><icon-svg icon-class="icon-btn-ico-2" /> 查询</el-button
              >
            </div>
          </div>
          <div class="content__table">
            <el-table
              v-loading="loadYDCatalogData"
              border
              highlight-current-row
              @row-dblclick="rowDblclick"
              @current-change="handleYDRowChange"
              :data="ydCatalogList"
              stripe
              style="width: 100%"
              height="50vh - 56px - 52px"
            >
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
              <el-table-column show-overflow-tooltip prop="zti" label="主题词">
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
                prop="cbrqi"
                label="出版日期"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jge"
                label="价格"
                width="100"
              >
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yma"
                label="页数"
                width="100"
              >
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="guan" label="位置">
              </el-table-column>
              <el-table-column label="操作" width="45" fixed="right">
                <template slot-scope="scope">
                  <td-action-tool
                    :id="scope.row.ydCatalogid"
                    :index="scope.$index"
                    :ops="['']"
                  >
                    <template v-slot:menus>
                      <div
                        class="menu"
                        @click="
                          handleDirectYDPage(
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
              @size-change="handleYDCatalogSizeChange"
              @current-change="handleYDCatalogCurrentChange"
              :total="totalYDCatalogCount"
              :currentPage="currentYDCatalogPage"
              :pageSize="ydCatalogPageSize"
            ></td-pagination>
          </div>
        </div>
        <div class="bottom">
          <div class="c-tab__header">
            <div class="headers">
              <span
                class="header__item"
                v-for="(item, index) in bottomTabs"
                @click="changeBottomMode(item.value)"
                :key="index"
                :class="{ active: currentBottomMode === item.value }"
                >{{ item.label }}</span
              >
            </div>
            <el-button
              size="small"
              type="primary"
              @click="handleShowAddSide"
              v-show="currentBottomMode === 'yd' && marcid"
              ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
            >
          </div>
          <div class="content">
            <div class="content__yd" v-if="currentBottomMode === 'yd'">
              <el-table
                key="ydTable"
                v-loading="loadYdsmList"
                :header-cell-style="{ background: '#fff' }"
                :data="ydList"
                stripe
                style="width: 100%;"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="libCode"
                  label="成员馆代码"
                >
                  <template slot-scope="scope">
                    <span
                      @click="showYdDetail(scope.row)"
                      class="g-row__check"
                      >{{ scope.row.libCode }}</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ydpcCode"
                  label="订购单"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ydbhao"
                  label="预订编号"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="gysName"
                  label="供应商"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ysCode"
                  label="预算代码"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ceshu"
                  label="册数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="jge"
                  label="价格"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ydlaiyuan"
                  label="文献来源"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ydTime"
                  label="预订日期"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="userName"
                  label="预订者"
                >
                </el-table-column>
                <el-table-column label="操作" width="45" fixed="right">
                  <template slot-scope="scope">
                    <td-action-tool
                      ref="actionTool"
                      :id="scope.row.ydsmid"
                      :index="scope.$index"
                      :ops="['del', 'unsubscribe']"
                      @handleUnsubscribe="unsubscribeYd"
                      @handleDel="deleteYd(scope.row)"
                    >
                      <template v-slot:menus>
                        <div class="menu" @click="showYdDetail(scope.row)">
                          编辑
                        </div>
                      </template>
                    </td-action-tool>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="content__ys" v-if="currentBottomMode === 'ys'">
              <el-table
                key="ysTable"
                v-loading="loadYssmList"
                :header-cell-style="{ background: '#fff' }"
                :data="ysList"
                stripe
                style="width: 100%;"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="yslxing"
                  label="验收类别"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="libCode"
                  label="成员馆代码"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="yspcCode"
                  label="验收单"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="gysName"
                  label="供应商"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="fuben"
                  label="册数"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cejia"
                  label="册价"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="userName"
                  label="验收人"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="optime"
                  label="验收时间"
                >
                </el-table-column>
              </el-table>
            </div>
            <div class="content__gc" v-if="currentBottomMode === 'gc'">
              <el-table
                key="gcTable"
                v-loading="loadGcsmList"
                :header-cell-style="{ background: '#fff' }"
                :data="gcList"
                stripe
                style="width: 100%;"
              >
                <el-table-column
                  type="index"
                  label=" "
                  align="center"
                  width="35"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="tiaoma"
                  label="条码号"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="sshao"
                  label="索书号"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="libName0"
                  label="财产馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="czName0"
                  label="财产馆藏址"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="libName1"
                  label="现在馆"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="czName1"
                  label="现在馆藏址"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="ztai"
                  label="状态"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="cejia"
                  label="册价"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="taojia"
                  label="套价"
                  width="100"
                >
                </el-table-column>
                <el-table-column
                  show-overflow-tooltip
                  prop="jzleixing"
                  label="介质类型"
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
                  prop="optime"
                  label="入库时间"
                >
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <!-- 新增预订记录 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="initAddSide"
      v-show="showAddSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增预订记录
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="ydjlAddForm"
          class="custom__form"
          label-width="100px"
          :rules="ydjlFormRules"
          :model="ydjlAddForm"
        >
          <div class="form__type">
            <div class="tit">
              <span>书目控制号：{{ marcid }}</span>
            </div>
            <el-form-item class="item" label="预订编号">
              <el-input
                clearable
                size="small"
                v-model="ydjlAddForm.ydbhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="预订单">
              <el-select
                filterable
                size="small"
                v-model="ydjlAddForm.ydpcid"
                placeholder="请选择预订单"
              >
                <el-option
                  v-for="item in yddOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="预订册数">
              <el-input
                clearable
                size="small"
                ref="addFocusInput"
                v-model="ydjlAddForm.ceshu"
                v-only-num="ydjlAddForm.ceshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="文献来源">
              <el-select
                filterable
                size="small"
                v-model="ydjlAddForm.ydlaiyuan"
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
            <el-form-item class="item" label="原价货币类型">
              <el-select
                filterable
                size="small"
                v-model="ydjlAddForm.yjhbid"
                @change="handleAddConvertHlv"
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
            <el-form-item class="item" label="介质类型">
              <el-select
                filterable
                size="small"
                v-model="ydjlAddForm.jzleixing"
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
            <el-form-item class="item" prop="yuanjia" label="原价">
              <el-input
                clearable
                @blur="handleAddConvertHlv"
                size="small"
                v-only-num.float="ydjlAddForm.yuanjia"
                v-model="ydjlAddForm.yuanjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="装订方式">
              <el-select
                filterable
                size="small"
                v-model="ydjlAddForm.zdfangshi"
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
            <el-form-item class="item" label="预订货币类型">
              <el-select
                filterable
                size="small"
                @change="handleAddConvertHlv"
                v-model="ydjlAddForm.ydhbid"
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
            <el-form-item class="item" prop="juance" label="分册数量">
              <el-input
                clearable
                size="small"
                v-only-num="ydjlAddForm.juance"
                v-model="ydjlAddForm.juance"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jiage" label="预订价">
              <el-input
                clearable
                size="small"
                v-only-num.float="ydjlAddForm.jiage"
                v-model="ydjlAddForm.jiage"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__textarea" label="备注">
              <el-input
                clearable
                size="small"
                v-model="ydjlAddForm.fuzhu"
                type="textarea"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="resetForm('ydjlAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="small"
              @click="submitForm('ydjlAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="small" @click="showAddSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑预订记录 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="initEditSide"
      v-show="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              编辑预订记录
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="ydjlEditForm"
          class="custom__form"
          label-width="100px"
          :rules="ydjlFormRules"
          :model="ydjlEditForm"
        >
          <div class="form__type">
            <div class="tit">
              <span>书目控制号：{{ marcid }}</span>
            </div>
            <el-form-item class="item" label="预订编号">
              <el-input
                clearable
                size="small"
                v-model="ydjlEditForm.ydbhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="预订单">
              <el-select
                filterable
                size="small"
                v-model="ydjlEditForm.ydpcid"
                placeholder="请选择预订单"
              >
                <el-option
                  v-for="item in yddOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="预订册数">
              <el-input
                ref="editFocusInput"
                clearable
                size="small"
                v-model="ydjlEditForm.ceshu"
                v-only-num="ydjlEditForm.ceshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="文献来源">
              <el-select
                filterable
                size="small"
                v-model="ydjlEditForm.ydlaiyuan"
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
            <el-form-item class="item" label="原价货币类型">
              <el-select
                filterable
                @change="handleEditConvertHlv"
                size="small"
                v-model="ydjlEditForm.yjhbid"
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
            <el-form-item class="item" label="介质类型">
              <el-select
                filterable
                size="small"
                v-model="ydjlEditForm.jzleixing"
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
            <el-form-item class="item" prop="yuanjia" label="原价">
              <el-input
                @blur="handleEditConvertHlv"
                clearable
                size="small"
                v-model="ydjlEditForm.yuanjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="装订方式">
              <el-select
                filterable
                size="small"
                v-model="ydjlEditForm.zdfangshi"
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
            <el-form-item class="item" label="预订货币类型">
              <el-select
                filterable
                size="small"
                @change="handleEditConvertHlv"
                v-model="ydjlEditForm.ydhbid"
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
            <el-form-item class="item" prop="juance" label="分册数量">
              <el-input
                clearable
                size="small"
                v-model="ydjlEditForm.juance"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jiage" label="预订价">
              <el-input
                clearable
                size="small"
                v-model="ydjlEditForm.jiage"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__textarea" label="备注">
              <el-input
                clearable
                size="small"
                v-model="ydjlEditForm.fuzhu"
                type="textarea"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="resetForm('ydjlEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="small"
              @click="submitForm('ydjlEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="small" @click="showEditSide = false"
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

import { ZJYD_OPTIONS } from "utils/selectOptions";

import { hbList } from "api/public";

import {
  reserveZdsm,
  searchYdBook,
  getYdsmCollection,
  getYssmListInLib,
  getYdsmListInLib,
  ydPcList,
  unsubscribeYdsm,
  ydsmDel,
  saveYdsm,
  workGet,
  convertHlv
} from "api/acquisition";

import { itemsGetMarcTyinfo } from "api/catalogue";

export default {
  name: "acq_zjyd",
  data() {
    this.filterOptions = ZJYD_OPTIONS;
    this.dglyOptions = WXLYUAN_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.zzfsOptions = ZDFANGSHI_OPTIONS;
    this.ydjlFormRules = {
      yuanjia: [{ required: true, message: "原价不能为空", trigger: "blur" }],
      jiage: [{ required: true, message: "原价不能为空", trigger: "blur" }]
    };
    this.ydjlAddFormOrigin = {
      cygName: "",
      ysCode: "",
      marcid: "",
      gysCode: "",
      ydbhao: "",
      ydpcid: "",
      ceshu: localStorage.getItem("td-ydceshu") || 1,
      ydlaiyuan: "订购",
      yjhbid: "",
      jzleixing: "纸张",
      yuanjia: "",
      zdfangshi: "平装",
      ydhbid: "",
      juance: 1,
      jiage: "",
      fuzhu: ""
    };
    return {
      // 列表相关
      defaultYDD: "",
      multipleYDCatalogSelection: [],
      currentFilterKey: "1",
      loadYDCatalogData: false,
      ydCatalogList: [],
      currentFilterVal: "",
      ydCatalogPageSize: 15,
      currentYDCatalogPage: 1,
      totalYDCatalogCount: 0,
      // 下方表格
      bottomTabs: [
        {
          label: "预订记录",
          value: "yd"
        },
        {
          label: "验收记录",
          value: "ys"
        },
        {
          label: "馆藏记录",
          value: "gc"
        }
      ],
      currentBottomMode: "yd",
      loadYdsmList: false,
      ydList: [],
      loadYssmList: false,
      ysList: [],
      loadGcsmList: false,
      gcList: [],
      // 侧边弹窗
      marcid: "",
      yddOptions: [],
      moneyTypeOptions: [],
      // 新增预订记录
      initAddSide: false,
      showAddSide: false,
      ydjlAddForm: {
        cygName: "",
        ysCode: "",
        marcid: "",
        gysCode: "",
        ydbhao: "",
        ydpcid: "",
        ceshu: 1,
        ydlaiyuan: "订购",
        yjhbid: "",
        jzleixing: "纸张",
        yuanjia: "",
        zdfangshi: "平装",
        ydhbid: "",
        juance: 1,
        jiage: "",
        fuzhu: ""
      },
      // 编辑预订记录
      initEditSide: false,
      showEditSide: false,
      ydjlEditForm: {}
    };
  },
  methods: {
    // 征订目录列表
    initYDCatalogList() {
      localStorage.setItem("td-ydSearchKey", this.currentFilterKey);
      this.currentYDCatalogPage = 1;
      this.setRequestObj();
      this.getYDCatalogList();
      this.ydList = [];
      this.gcList = [];
      this.ysList = [];
      this.bottomTabs[0].label = "预订记录";
      this.bottomTabs[1].label = "验收记录";
      this.bottomTabs[2].label = "馆藏记录";
    },
    setRequestObj() {
      this.requestObj = {
        flag: this.currentFilterKey,
        content: this.currentFilterVal
      };
    },
    getYDCatalogList() {
      this.loadYDCatalogData = true;

      let requestObj = {
        pageNumber: this.currentYDCatalogPage,
        pageSize: this.ydCatalogPageSize,
        ...this.requestObj
      };

      searchYdBook(requestObj)
        .then(res => {
          this.loadYDCatalogData = false;
          this.ydCatalogList = res.data.dataList;
          this.totalYDCatalogCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadYDCatalogData = false));
    },
    handleYDCatalogSizeChange(val) {
      this.ydCatalogPageSize = val;
      this.getYDCatalogList();
    },
    handleYDCatalogCurrentChange(val) {
      this.currentYDCatalogPage = val;
      this.getYDCatalogList();
    },
    // 新增预订
    handleYDAdd() {
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "acq_zjyd"
        },
        params: {
          reset: true
        }
      });
    },
    // 前往书目预订
    handleDirectYDPage(marcid, marctyid) {
      reserveZdsm({
        marcid
      }).then(() => {
        this.$router.push({
          name: "acq_smyd",
          query: {
            marcid,
            marctyid,
            from: "acq_zjyd"
          }
        });
      });
    },
    // 下方表格
    rowDblclick(row) {
      this.handleDirectYDPage(row.marcid, row.marctyid);
    },
    handleYDRowChange(row) {
      if (row) {
        this.marctyid = row.marctyid;
        this.marcid = row.marcid;
        this.getDetailTableData();
      } else {
        this.marctyid = "";
        this.marcid = "";
      }
    },
    changeBottomMode(mode) {
      this.currentBottomMode = mode;
    },
    // 下方表格 - 馆藏
    getYdsmCollection() {
      this.loadGcsmList = true;
      getYdsmCollection({
        marcid: this.marcid
      })
        .then(res => {
          this.gcList = res.data;
          let inLib = 0;
          res.data.forEach(item => {
            if (item.ztai === "在馆") {
              inLib++;
            }
          });
          this.bottomTabs[2].label = `馆藏记录（${inLib}/${res.data.length}）`;
        })
        .finally(() => {
          this.loadGcsmList = false;
        });
    },
    // 下方表格 - 验收
    getYssmListInLib() {
      this.loadYssmList = true;
      getYssmListInLib({
        marcid: this.marcid
      })
        .then(res => {
          this.ysList = res.data;
          this.bottomTabs[1].label = `验收记录（${res.data.length}）`;
        })
        .finally(() => {
          this.loadYssmList = false;
        });
    },
    // 下方表格 - 预订
    getYdsmListInLib() {
      this.loadYdsmList = true;
      getYdsmListInLib({
        marcid: this.marcid
      })
        .then(res => {
          this.ydList = res.data;
          this.bottomTabs[0].label = `预订记录（${res.data.length}）`;
        })
        .finally(() => {
          this.loadYdsmList = false;
        });
    },
    unsubscribeYd(id) {
      this.$confirm("确定要退订么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          unsubscribeYdsm({
            ydsmids: id
          }).then(res => {
            this.$message.success(res.message);
            this.getYdsmListInLib();
          });
        })
        .catch(() => {});
    },
    deleteYd(row) {
      this.$confirm(`确定要删除订购单【${row.ydpcCode}】么?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          ydsmDel({
            ydsmids: row.ydsmid
          }).then(res => {
            this.$message.success(res.message);
            this.getYdsmListInLib();
          });
        })
        .catch(() => {});
    },
    // 初始化
    getDetailTableData() {
      this.getYdsmListInLib();
      this.getYssmListInLib();
      this.getYdsmCollection();
    },
    //  预订单乱码排查
    getWorkDefault() {
      workGet().then(res => {
        this.defaultYDD = res.data ? res.data.ydpcCode : "";
        this.defaultYdpcid = res.data ? res.data.ydpcid : "";
        let ydOptionDefault = this.yddOptions[0]
          ? this.yddOptions[0].value
          : "";
        this.ydjlAddFormOrigin.ydpcid = this.defaultYdpcid
          ? this.defaultYdpcid
          : ydOptionDefault;
      });
    },
    // 侧边弹窗通用
    getMoneyTypeOptions() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.moneyTypeOptions = res.data.map(item => {
          // 默认人民币
          if (item.hbcode.toUpperCase() === "CNY") {
            this.ydjlAddFormOrigin.yjhbid = this.ydjlAddFormOrigin.ydhbid =
              item.hbid;
          }
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
        if (!this.ydjlAddFormOrigin.yjhbid) {
          this.ydjlAddFormOrigin.yjhbid = this.ydjlAddFormOrigin.ydhbid = this.getArrFirstValue(
            this.moneyTypeOptions
          );
        }
      });
    },
    getYdPcList() {
      ydPcList().then(res => {
        this.yddOptions = res.data.map(item => {
          return {
            label: item.daima,
            value: item.ydpcid
          };
        });
        let ydOptionDefault = this.yddOptions[0]
          ? this.yddOptions[0].value
          : "";

        this.ydjlAddFormOrigin.ydpcid = this.defaultYdpcid
          ? this.defaultYdpcid
          : ydOptionDefault;
      });
    },
    // 侧边弹窗-新增
    itemsGetMarcTyinfo() {
      this.ydjlAddFormOrigin.yuanjia = this.ydjlAddForm.yuanjia = ""; // 防止没有价格字段没有重置为空
      if (!this.marctyid) {
        return;
      }
      itemsGetMarcTyinfo({
        marctyid: this.marctyid
      }).then(res => {
        res.data.fieldList.forEach(item => {
          if (item.item === "010d" && item.content) {
            this.ydjlAddFormOrigin.yuanjia = this.ydjlAddForm.yuanjia = item.content.replace(
              // eslint-disable-next-line no-useless-escape
              /[^\d\.]/g,
              ""
            );
            this.handleAddConvertHlv();
          }
        });
      });
    },
    handleShowAddSide() {
      this.initAddSide = true;
      this.showAddSide = true;
      this.$nextTick(() => {
        this.$refs["addFocusInput"].focus();
      });
      this.resetForm("ydjlAddForm");
      this.ydjlAddForm.ceshu = localStorage.getItem("td-ydceshu") || 1;
      this.itemsGetMarcTyinfo();
    },
    createYdsm() {
      let requestObj = Object.assign({}, this.ydjlAddForm);
      requestObj.marcid = this.marcid;
      saveYdsm(requestObj).then(res => {
        localStorage.setItem("td-ydceshu", requestObj.ceshu);
        this.ydjlAddFormOrigin.ceshu = requestObj.ceshu;
        this.$message.success(res.message);
        this.getYdsmListInLib();
        this.showAddSide = false;
      });
    },
    handleAddConvertHlv() {
      convertHlv({
        fromHbId: this.ydjlAddForm.yjhbid,
        toHbId: this.ydjlAddForm.ydhbid,
        fromMoney: this.ydjlAddForm.yuanjia
      }).then(res => {
        this.ydjlAddForm.jiage = Number(res.data.toMoney).toFixed(2);
      });
    },
    // 侧边弹窗-编辑
    showYdDetail(data) {
      this.initEditSide = true;
      this.showEditSide = true;
      this.$nextTick(() => {
        this.$refs["editFocusInput"].focus();
        this.$refs["ydjlEditForm"].clearValidate();
        this.ydjlEditFormOrigin = Object.assign(
          {},
          {
            ...data,
            jiage: data["jge"]
          }
        );
        this.ydjlEditForm = {
          ...data,
          jiage: data["jge"]
        };
      });
    },
    updateYdsm() {
      let requestObj = Object.assign({}, this.ydjlEditForm);
      requestObj.marcid = this.marcid;
      saveYdsm(requestObj).then(res => {
        this.$message.success(res.message);
        this.getYdsmListInLib();
        this.showEditSide = false;
      });
    },
    handleEditConvertHlv() {
      convertHlv({
        fromHbId: this.ydjlEditForm.yjhbid,
        toHbId: this.ydjlEditForm.ydhbid,
        fromMoney: this.ydjlEditForm.yuanjia
      }).then(res => {
        this.ydjlEditForm.jiage = Number(res.data.toMoney).toFixed(2);
      });
    },
    // 通用
    resetForm(formName) {
      if (this.$refs[formName]) {
        this.$refs[formName].clearValidate();
      }
      if (formName === "ydjlAddForm") {
        this.ydjlAddForm = Object.assign({}, this.ydjlAddFormOrigin);
        this.handleAddConvertHlv();
      } else {
        this.ydjlEditForm = Object.assign({}, this.ydjlEditFormOrigin);
        this.handleEditConvertHlv();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "ydjlAddForm") {
            this.createYdsm();
          } else if (formName === "ydjlEditForm") {
            this.updateYdsm();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.currentFilterKey = localStorage.getItem("td-ydSearchKey") || "1";
    this.getWorkDefault();
    this.getYdPcList();
    this.getMoneyTypeOptions();
    this.$eventBus.$on("jdbm-update", () => {
      this.initYDCatalogList();
    });
    this.$eventBus.$on("smyd-update", () => {
      this.getYdsmListInLib();
    });
    this.$refs["focusInput"].focus();
  },
  activated() {
    this.getWorkDefault();
    this.$refs["focusInput"].focus();
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
    this.$eventBus.$off("smyd-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.content {
  /deep/ .el-scrollbar__wrap {
    overflow-x: hidden !important;
  }
  .top {
    height: 50vh;
    border-bottom: 1px solid @borderColor;
  }
  .bottom {
    border-top: 1px solid @borderColor;
  }
  .c-tab__header {
    height: 36px;
    background: @topBgColor;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 20px;
    .header__item {
      display: inline-block;
      cursor: pointer;
      height: 36px;
      line-height: 36px;
      padding: 0 17px;
      font-size: @FSize_15;
      &.active {
        font-weight: bold;
        color: @primaryColor;
        background: @contentHdColor;
      }
    }
  }
  .cus__table {
    /deep/ th,
    /deep/ td {
      padding: 1px 0;
    }
  }
  /deep/ .el-table .el-button {
    padding: 0;
  }
}
</style>
