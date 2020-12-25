<!--
 * @labelription: MARC条目
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-02-26 21:01:35
 * @LastEditTime: 2020-03-10 16:55:17
 -->

<template>
  <div class="set-marctm common__content">
    <td-content-header>
      MARC条目管理
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddMarctm"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleMarctmSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteMarctm('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
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
            v-model="currentMarctmFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in marctmFilterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            ref="focusInput"
            class="group__filter_value"
            v-model="marctmSearchKey"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initMarctmList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initMarctmList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="marctmTable">
        <el-table
          v-loading="loadMarctmData"
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          @selection-change="handleMarctmSelectionChange"
          border
          :data="marctmList"
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
            prop="marcName"
            label="MARC类型"
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
          <el-table-column
            show-overflow-tooltip
            prop="wxlxing"
            label="一般文献类型标识"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="cbdi" label="出版地">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="fjian" label="附件">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="flhao" label="分类号">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="bci" label="版次">
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.tmid"
                :index="scope.$index"
                :ops="['del', 'edit']"
                @handleEdit="checkMarctmDetail"
                @handleDel="deleteMarctm"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleMarctmSizeChange"
          @current-change="handleMarctmCurrentChange"
          :total="totalMarctmCount"
          :currentPage="currentMarctmPage"
          :pageSize="marctmPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增marc条目 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              新增MARC条目
            </div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marctmAddForm"
          label-width="130px"
          :model="marctmAddForm"
          :rules="marctmFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC条目信息</span>
            </div>
            <el-form-item
              class="item item__3"
              prop="marclxid"
              label="M A R C类型"
            >
              <el-select
                filterable
                v-model="marctmAddForm.marclxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marclxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjian" label="附件">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.fjian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="yzhong" label="语种">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.yzhong"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="wxlxing"
              label="一般文献类型标识"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.wxlxing"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="flhao" label="分类号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.flhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ccun" label="尺寸">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.ccun"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zti" label="主题">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.zti"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="smkzhao"
              label="书目控制号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.smkzhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="bci" label="版次">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.bci"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ztming" label="正题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.ztming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="tyskhao"
              label="统一书刊号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.tyskhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="jge" label="价格">
              <el-input
                maxlength="4"
                clearable
                v-model="marctmAddForm.jge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ftming" label="副题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.ftming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="isbn" label="I S B N">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.isbn"
                @keyup.native="
                  handleBarColabelanner(
                    $event,
                    val => (marctmAddForm.isbn = val)
                  )
                "
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="qkjge" label="期刊价格">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.qkjge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zrsming" label="责任者">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.zrsming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="issn" label="I S S N">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.issn"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="yma" label="页码">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.yma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbdi" label="出版地">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbdi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbzhe" label="出版者">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbzhe"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="isrc" label="I S R C">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.isrc"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zyao" label="摘要">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.zyao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbrqi" label="出版日期">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbrqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="dghao" label="邮发代号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.dghao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fzhu" label="附注">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.fzhu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbzqi" label="出版周期">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbzqi"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="wwdghao"
              label="外文邮发代号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.wwdghao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="tmpyin" label="题名拼音">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.tmpyin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjhao" label="分辑号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.fjhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbtming" label="丛编题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbtming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="zrsmpyin"
              label="责任者拼音"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.zrsmpyin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjming" label="分辑名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.fjming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="cbzrsming"
              label="丛编责任者"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmAddForm.cbzrsming"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('marctmAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marctmAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showAddSideCancle">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 编辑MARC条目 -->
    <side-wrap
      v-loading="loadMarctmDetail"
      class="dialog__add common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              MARC条目信息
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="marctmEditForm"
          label-width="130px"
          :model="marctmEditForm"
          :rules="marctmFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>MARC条目信息</span>
            </div>
            <el-form-item
              class="item item__3"
              prop="marclxid"
              label="M A R C类型"
            >
              <el-select
                filterable
                v-model="marctmEditForm.marclxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in marclxOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjian" label="附件">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.fjian"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="yzhong" label="语种">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.yzhong"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="wxlxing"
              label="一般文献类型标识"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.wxlxing"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="flhao" label="分类号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.flhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ccun" label="尺寸">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.ccun"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zti" label="主题">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.zti"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="smkzhao"
              label="书目控制号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.smkzhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="bci" label="版次">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.bci"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ztming" label="正题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.ztming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="tyskhao"
              label="统一书刊号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.tyskhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="jge" label="价格">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.jge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="ftming" label="副题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.ftming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="isbn" label="I S B N">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.isbn"
                @keyup.native="
                  handleBarColabelanner(
                    $event,
                    val => (marctmEditForm.isbn = val)
                  )
                "
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="qkjge" label="期刊价格">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.qkjge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zrsming" label="责任者">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.zrsming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="issn" label="I S S N">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.issn"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="yma" label="页码">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.yma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbdi" label="出版地">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbdi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbzhe" label="出版者">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbzhe"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="isrc" label="I S R C">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.isrc"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="zyao" label="摘要">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.zyao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbrqi" label="出版日期">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbrqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="dghao" label="邮发代号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.dghao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fzhu" label="附注">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.fzhu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbzqi" label="出版周期">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbzqi"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="wwdghao"
              label="外文邮发代号"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.wwdghao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="tmpyin" label="题名拼音">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.tmpyin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjhao" label="分辑号">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.fjhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="cbtming" label="丛编题名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbtming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="zrsmpyin"
              label="责任者拼音"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.zrsmpyin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__3" prop="fjming" label="分辑名">
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.fjming"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__3"
              prop="cbzrsming"
              label="丛编责任者"
            >
              <el-input
                clearable
                maxlength="4"
                v-model="marctmEditForm.cbzrsming"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('marctmEditForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('marctmEditForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
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
  sysMarcConfigMarcEntryList,
  sysMarcConfigMarcEntryDel,
  sysMarcConfigMarcEntrySave,
  sysMarcConfigMarcEntryGet,
  sysMarcConfigMarcList
} from "api/setting";
import { mapGetters } from "vuex";

export default {
  name: "set_marctm",
  data() {
    this.marctmFilterOptions = [
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "flhao",
        label: "分类号"
      },
      {
        value: "cbdi",
        label: "出版地"
      },
      {
        value: "bci",
        label: "版次"
      }
    ];
    let reg = /^\d{3}[0-9a-zA-Z]{1}$/; // 前三位为数字，最后一位是字符串
    let validateItem = (rule, value, callback) => {
      if (!value) {
        callback();
        return;
      }
      if (!reg.test(value)) {
        callback(new Error("需四位 前三位为数字,第四位[0-9a-zA-Z]"));
      } else {
        callback();
      }
    };
    this.marctmFormRules = {
      marclxid: [
        { required: true, message: "MARC类型不能为空", trigger: "change" }
      ],
      fjian: [{ validator: validateItem, trigger: "blur" }],
      yzhong: [{ validator: validateItem, trigger: "blur" }],
      wxlxing: [{ validator: validateItem, trigger: "blur" }],
      flhao: [{ validator: validateItem, trigger: "blur" }],
      ccun: [{ validator: validateItem, trigger: "blur" }],
      zti: [{ validator: validateItem, trigger: "blur" }],
      smkzhao: [{ validator: validateItem, trigger: "blur" }],
      bci: [{ validator: validateItem, trigger: "blur" }],
      ztming: [{ validator: validateItem, trigger: "blur" }],
      tyskhao: [{ validator: validateItem, trigger: "blur" }],
      jge: [{ validator: validateItem, trigger: "blur" }],
      ftming: [{ validator: validateItem, trigger: "blur" }],
      isbn: [{ validator: validateItem, trigger: "blur" }],
      qkjge: [{ validator: validateItem, trigger: "blur" }],
      zrsming: [{ validator: validateItem, trigger: "blur" }],
      issn: [{ validator: validateItem, trigger: "blur" }],
      yma: [{ validator: validateItem, trigger: "blur" }],
      cbdi: [{ validator: validateItem, trigger: "blur" }],
      cbzhe: [{ validator: validateItem, trigger: "blur" }],
      isrc: [{ validator: validateItem, trigger: "blur" }],
      zyao: [{ validator: validateItem, trigger: "blur" }],
      cbrqi: [{ validator: validateItem, trigger: "blur" }],
      dghao: [{ validator: validateItem, trigger: "blur" }],
      fzhu: [{ validator: validateItem, trigger: "blur" }],
      cbzqi: [{ validator: validateItem, trigger: "blur" }],
      wwdghao: [{ validator: validateItem, trigger: "blur" }],
      tmpyin: [{ validator: validateItem, trigger: "blur" }],
      fjhao: [{ validator: validateItem, trigger: "blur" }],
      cbtming: [{ validator: validateItem, trigger: "blur" }],
      zrsmpyin: [{ validator: validateItem, trigger: "blur" }],
      fjming: [{ validator: validateItem, trigger: "blur" }],
      cbzrsming: [{ validator: validateItem, trigger: "blur" }]
    };
    return {
      // 列表相关
      multipleMarctmSelection: [],
      loadMarctmData: false,
      marctmList: [],
      marctmSearchKey: "",
      currentMarctmFilterKey: "ztming",
      marctmPageSize: 15,
      currentMarctmPage: 1,
      totalMarctmCount: 0,
      currentMarctmId: "",
      marclxOptions: [],
      // 新增
      showAddSide: false,
      marctmAddForm: {
        marclxid: "",
        fjian: "",
        yzhong: "",
        wxlxing: "",
        flhao: "",
        ccun: "",
        zti: "",
        smkzhao: "",
        bci: "",
        ztming: "",
        tyskhao: "",
        jge: "",
        ftming: "",
        isbn: "",
        qkjge: "",
        zrsming: "",
        issn: "",
        yma: "",
        cbdi: "",
        cbzhe: "",
        isrc: "",
        zyao: "",
        cbrqi: "",
        dghao: "",
        fzhu: "",
        cbzqi: "",
        wwdghao: "",
        tmpyin: "",
        fjhao: "",
        cbtming: "",
        zrsmpyin: "",
        fjming: "",
        cbzrsming: ""
      },
      // 编辑
      loadMarctmDetail: false,
      showEditSide: false,
      marctmEditForm: {
        marclxid: "",
        fjian: "",
        yzhong: "",
        wxlxing: "",
        flhao: "",
        ccun: "",
        zti: "",
        smkzhao: "",
        bci: "",
        ztming: "",
        tyskhao: "",
        jge: "",
        ftming: "",
        isbn: "",
        qkjge: "",
        zrsming: "",
        issn: "",
        yma: "",
        cbdi: "",
        cbzhe: "",
        isrc: "",
        zyao: "",
        cbrqi: "",
        dghao: "",
        fzhu: "",
        cbzqi: "",
        wwdghao: "",
        tmpyin: "",
        fjhao: "",
        cbtming: "",
        zrsmpyin: "",
        fjming: "",
        cbzrsming: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    // 文献列表
    initMarctmList() {
      this.currentMarctmPage = 1;
      this.setRequestObj();
      this.getMarctmList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkMarctmDetail(row.tmid);
    },
    handleMarctmSelectionChange(val) {
      this.multipleMarctmSelection = val.map(item => item.tmid);
    },
    checkMarctmDetail(id) {
      this.currentMarctmId = id;
      this.showEditSide = true;
      this.getMarctmDetail();
    },
    deleteMarctm(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadMarctmData = true;
          sysMarcConfigMarcEntryDel({
            tmids: ids ? ids : this.multipleMarctmSelection.join(",")
          })
            .then(res => {
              this.loadMarctmData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.marctmList.splice(index, 1);
              } else {
                this.initMarctmList();
              }
            })
            .catch(() => {
              this.loadMarctmData = false;
            });
        })
        .catch(() => {});
    },
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[this.currentMarctmFilterKey] = this.marctmSearchKey;
    },
    getMarctmList() {
      this.loadMarctmData = true;

      let requestObj = {
        pageNumber: this.currentMarctmPage,
        pageSize: this.marctmPageSize,
        ...this.requestObj
      };

      sysMarcConfigMarcEntryList(requestObj)
        .then(res => {
          this.marctmList = res.data.dataList;
          this.totalMarctmCount = Number(res.data.totalElements);
        })
        .finally(() => {
          this.loadMarctmData = false;
        });
    },
    handleMarctmSizeChange(val) {
      this.marctmPageSize = val;
      this.getMarctmList();
    },
    handleMarctmCurrentChange(val) {
      this.currentMarctmPage = val;
      this.getMarctmList();
    },
    getMarclxOptions() {
      sysMarcConfigMarcList({
        pageNumber: 1,
        pageSize: 1000
      }).then(res => {
        let options = res.data.dataList || [];
        this.marclxOptions = options.map(item => {
          return {
            label: item.leixing,
            value: item.marclxid
          };
        });
      });
    },
    // 文献新增
    showAddMarctm() {
      this.showAddSide = true;
    },
    // 新增没保存、取消要重置
    showAddSideCancle() {
      this.showAddSide = false;
      this.resetForm("marctmAddForm");
    },
    handleMarctmFormAdd() {
      sysMarcConfigMarcEntrySave(this.marctmAddForm).then(res => {
        this.$message.success(res.message);
        this.resetForm("marctmAddForm");
        this.showAddSide = false;
        this.initMarctmList();
      });
    },
    // 文献编辑
    getMarctmDetail() {
      this.loadMarctmDetail = true;
      sysMarcConfigMarcEntryGet({
        tmid: this.currentMarctmId
      }).then(res => {
        this.loadMarctmDetail = false;
        this.marctmEditFormOrigin = Object.assign({}, res.data);
        this.marctmEditForm = res.data;
      });
    },
    handleMarctmFormEdit() {
      let requestObj = this.marctmEditForm;
      requestObj.marctmid = this.currentMarctmId;
      delete requestObj["optime"];
      sysMarcConfigMarcEntrySave(requestObj).then(res => {
        this.$message.success(res.message);
        this.showEditSide = false;
        this.initMarctmList();
      });
    },
    // 通用
    resetForm(formName) {
      if (formName === "marctmEditForm") {
        // 恢复原始数据
        this.marctmEditForm = Object.assign({}, this.marctmEditFormOrigin);
      } else {
        this.$refs[formName].resetFields();
      }
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "marctmAddForm") {
            this.handleMarctmFormAdd();
          } else if (formName === "marctmEditForm") {
            this.handleMarctmFormEdit();
          }
        } else {
          return false;
        }
      });
    }
  },
  mounted() {
    this.$refs["focusInput"].focus();
    this.initMarctmList();
    this.getMarclxOptions();
  },
  activated() {
    this.$refs["focusInput"].focus();
    this.getMarclxOptions();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
