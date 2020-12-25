<!--
 * @Description: 新增书目编辑
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: chenming.feng
 * @Date: 2019-04-18 09:18:29
 * @LastEditTime: 2020-03-10 15:35:45
 -->

<template>
  <div class="cat-xzbmedit" tabindex="1" style="outline: none;">
    <!-- 字段帮助开始 -->
    <button id="iframeBtn" @click="hideTips" v-show="false">测试</button>
    <vue-draggable-resizable
      class="iframe__wrapper"
      v-if="showIframeTips"
      :w="600"
      :h="350"
      :y="0"
      :x="frameInitialX"
      :parent="true"
    >
      <div class="title drag-handle">
        <p>
          字段帮助(<span style="color: red;">{{ tipsType }}</span
          >)
        </p>
        <icon-svg
          style="color:#de5151;cursor: pointer;"
          icon-class="icon-btn-ico-21"
          @click.native="hideTips"
        />
      </div>
      <iframe ref="iframe" :src="iframeSrc" frameborder="0"></iframe>
    </vue-draggable-resizable>
    <!-- 字段帮助结束 -->

    <!-- 辅助录入开始 -->
    <vue-draggable-resizable
      class="iframe__wrapper"
      v-if="showSetFiledDialog"
      :w="600"
      :h="650"
      :y="0"
      :x="frameInitialX"
      :parent="true"
      style="zIndex: 10 !important;"
      :drag-handle="'.drag-handle'"
    >
      <div class="title drag-handle">
        <p>
          编辑定长字段内容【
          <span style="color: red;" v-if="fieldTipsTypeList.length === 1">{{
            fieldTipsType
          }}</span>
          <el-dropdown v-else trigger="click" @command="changeCurrentFieldType">
            <span class="el-dropdown-link">
              <em style="color: red;">{{ fieldTipsType }}</em
              ><i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item
                v-for="item in fieldTipsTypeList"
                :key="item.value"
                :command="item"
                >{{ item.label }}</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
          】
        </p>
        <icon-svg
          style="color:#de5151;cursor: pointer;"
          icon-class="icon-btn-ico-21"
          @click.native="showSetFiledDialog = false"
        />
      </div>
      <div class="content">
        <el-scrollbar>
          <el-form
            ref="fieldItemForm"
            label-width="180px"
            :model="fieldItemForm"
            :rules="fieldItemFormRules"
            size="mini"
            label-position="left"
          >
            <el-form-item>
              <el-button
                type="primary"
                @click="submitFieldForm('fieldItemForm')"
                >确定</el-button
              >
              <el-button @click="showSetFiledDialog = false">取消</el-button>
            </el-form-item>
            <el-form-item
              v-for="(item, index) in subFieldItems"
              :label="`(${index + 1})${item.subFieldName}`"
              :key="index"
              :prop="item.subFieldId"
            >
              <!-- 1-文本框 -->
              <el-input
                v-if="item.subFieldType === 1"
                v-model="fieldItemForm[item.subFieldId]"
                :key="item.subFieldId"
                clearable
              ></el-input>
              <!-- 2-下拉框 -->
              <el-select
                v-model="fieldItemForm[item.subFieldId]"
                :key="item.subFieldId"
                v-if="item.subFieldType === 2"
                placeholder="请选择"
                @change="
                  $set(fieldItemForm, fieldItemForm[item.subFieldId], $event)
                "
              >
                <el-option
                  v-for="option in item.list"
                  :key="option.value"
                  :label="option.key + '-' + option.value"
                  :value="option.key"
                >
                </el-option>
              </el-select>
              <!-- 3-多选框 -->
              <el-select
                v-model="fieldItemForm[item.subFieldId]"
                :key="item.subFieldId"
                v-if="item.subFieldType === 3"
                multiple
                :multiple-limit="item.subFieldLength"
                placeholder="请选择"
                @change="
                  $set(fieldItemForm, fieldItemForm[item.subFieldId], $event)
                "
              >
                <el-option
                  v-for="option in item.list"
                  :key="option.value"
                  :label="option.key + '-' + option.value"
                  :value="option.key"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="submitFieldForm('fieldItemForm')"
                >确定</el-button
              >
              <el-button @click="showSetFiledDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </vue-draggable-resizable>
    <!-- 辅助录入结束 -->

    <div class="wrapper">
      <el-scrollbar ref="scrollBar">
        <div class="content__top">
          <div class="header__nav" v-show="!isOnlyMarcms">
            <div
              :class="{ active: cataMode === '简单' }"
              class="header__item"
              @click="changeCataMode('简单')"
            >
              简单书目
            </div>
            <div
              :class="{ active: cataMode === '条目式' }"
              class="header__item"
              @click="changeCataMode('条目式')"
            >
              条目式模式
            </div>
            <div
              :class="{ active: cataMode === 'Marc' }"
              class="header__item"
              @click="changeCataMode('Marc')"
            >
              MARC模式
            </div>
          </div>
          <el-form
            v-show="cataMode === '简单'"
            :disabled="mode === 'copy' && catalogueData.ztai !== '未审核'"
            class="simple__form"
            ref="simpleForm"
            :show-message="false"
            label-width="100px"
            :model="simpleForm"
            :rules="simpleFormRules"
          >
            <el-form-item class="item" prop="ztming" label="正题名">
              <el-input
                ref="focusInput"
                clearable
                data-type="smarcInput"
                class="smarc__input"
                data-index="0"
                size="mini"
                v-model="simpleForm.ztming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ftming" label="副题名">
              <el-input
                clearable
                data-type="smarcInput"
                class="smarc__input"
                data-index="1"
                size="mini"
                v-model="simpleForm.ftming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="bltming" label="并列题名">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="2"
                clearable
                size="mini"
                v-model="simpleForm.bltming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zrsming" label="责任者">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="3"
                @blur="getSSHaoChange"
                clearable
                size="mini"
                v-model="simpleForm.zrsming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="otherzrsming" label="其他责任者">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="4"
                clearable
                size="mini"
                v-model="simpleForm.otherzrsming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="isbn" label="I S B N">
              <el-input
                @change="getPublishWithISBN($event, 'simple')"
                data-type="smarcInput"
                class="smarc__input"
                data-index="5"
                clearable
                size="mini"
                v-model="simpleForm.isbn"
                @keyup.native="
                  handleBarCodeScanner($event, val => (simpleForm.isbn = val))
                "
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbrqi" label="出版时间">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="6"
                clearable
                size="mini"
                v-model="simpleForm.cbrqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbzhe" label="出版社">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="7"
                clearable
                size="mini"
                v-model="simpleForm.cbzhe"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbdi" label="出版地">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="8"
                clearable
                size="mini"
                v-model="simpleForm.cbdi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="flhao" label="分类号">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="9"
                @blur="flhaoBlur"
                @keydown.enter.native="flhaoBlur"
                clearable
                size="mini"
                v-model="simpleForm.flhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="bci" label="版本说明">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="10"
                clearable
                size="mini"
                v-model="simpleForm.bci"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ccun" label="文献尺寸">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="11"
                clearable
                size="mini"
                v-model="simpleForm.ccun"
              ></el-input>
            </el-form-item>
            <el-form-item class="item item__select" prop="zti" label="主题词">
              <el-select
                filterable
                v-model="ztiSelected"
                size="mini"
                multiple
                class="multi line"
                collapse-tags
                ref="ztiSelect"
                @change="changeZti"
                @blur="handleShowSelectBlur"
              >
                <el-option
                  v-for="item in ztiSelectedArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-input
                data-type="smarcInput"
                ref="nextFocus"
                class="smarc__input"
                data-index="12"
                clearable
                size="mini"
                v-model="simpleForm.zti"
              ></el-input>
              <span key="1" @click="handleShowSelect" v-if="!showSelect">
                <icon-svg class="primary" icon-class="icon-xialajiantou" />
              </span>
              <span key="2" v-if="showSelect">
                <icon-svg
                  style="transform: rotate(180deg)"
                  class="primary"
                  icon-class="icon-xialajiantou"
                />
              </span>
            </el-form-item>
            <el-form-item class="item" prop="jge" label="价格">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="13"
                clearable
                @change="setDefaultJiage"
                size="mini"
                v-model="simpleForm.jge"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yma" label="页码">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="14"
                clearable
                size="mini"
                v-model="simpleForm.yma"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yzhong" label="语种">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="15"
                clearable
                size="mini"
                v-model="simpleForm.yzhong"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fjming" label="分辑名">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="16"
                clearable
                size="mini"
                v-model="simpleForm.fjming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fjhao" label="分辑号">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="17"
                clearable
                size="mini"
                v-model="simpleForm.fjhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbtming" label="丛编题名">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="18"
                clearable
                size="mini"
                v-model="simpleForm.cbtming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbzrsming" label="丛编责任者">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="19"
                clearable
                size="mini"
                v-model="simpleForm.cbzrsming"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="fjian" label="附件">
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="20"
                clearable
                size="mini"
                v-model="simpleForm.fjian"
              ></el-input>
            </el-form-item>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="fzhu"
              label="一般性附注"
            >
              <el-input
                data-type="smarcInput"
                class="smarc__input"
                data-index="21"
                clearable
                size="mini"
                v-model="simpleForm.fzhu"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item"
              prop="zyao"
              label="内容摘要"
              style="flex-basis: 100%;"
            >
              <el-input
                type="textarea"
                :rows="5"
                data-type="smarcInput"
                class="smarc__input"
                data-index="22"
                clearable
                size="mini"
                v-model="simpleForm.zyao"
              ></el-input>
            </el-form-item>
          </el-form>
          <div class="marcs__content" v-show="cataMode === '条目式'">
            <div class="marcs__header">
              <div>
                <span class="label">MARC类型：</span>
                <el-select
                  filterable
                  size="mini"
                  :disabled="mode === 'copy' && catalogueData.ztai !== '未审核'"
                  v-model="marctype"
                  placeholder="请选择"
                  @change="getTMSData"
                >
                  <el-option
                    v-for="item in marcConfigMarcList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </div>
            </div>
            <div class="marcs__content">
              <el-table
                v-loading="loadTMTableData"
                border
                ref="tmItemTable"
                :data="tmList"
                class="content__table_tms"
                style="width: 100%"
                :cell-class-name="cellClassName"
              >
                <el-table-column
                  width="170"
                  label="字段名称"
                  align="center"
                  prop="name"
                >
                </el-table-column>
                <el-table-column
                  width="90"
                  label="字段标识"
                  align="center"
                  prop="item"
                >
                </el-table-column>
                <el-table-column
                  prop="roleCode"
                  label="字段内容"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-input
                      v-if="
                        !['isbn', 'zrsming', 'flhao', 'jge'].includes(
                          scope.row.field
                        )
                      "
                      data-type="tmInput"
                      :data-index="scope.$index"
                      size="mini"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      @keyup.native="
                        handleBarCodeScanner(
                          $event,
                          val => (scope.row.content = val)
                        )
                      "
                      v-model="scope.row.content"
                    ></el-input>
                    <el-input
                      v-if="scope.row.field === 'isbn'"
                      data-type="tmInput"
                      :data-index="scope.$index"
                      size="mini"
                      @change="getPublishWithISBN($event, 'tms')"
                      @keyup.native="
                        handleBarCodeScanner(
                          $event,
                          val => (scope.row.content = val)
                        )
                      "
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      v-model="scope.row.content"
                    ></el-input>
                    <el-input
                      v-if="scope.row.field === 'zrsming'"
                      data-type="tmInput"
                      :data-index="scope.$index"
                      size="mini"
                      @blur="getSSHaoChange"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      v-model="scope.row.content"
                    ></el-input>
                    <el-input
                      v-if="scope.row.field === 'flhao'"
                      data-type="tmInput"
                      :data-index="scope.$index"
                      size="mini"
                      @blur="getSSHaoChange"
                      @keydown.enter.native="getSSHaoChange"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      v-model="scope.row.content"
                    ></el-input>
                    <el-input
                      v-if="scope.row.field === 'jge'"
                      data-type="tmInput"
                      :data-index="scope.$index"
                      @change="setDefaultJiage"
                      size="mini"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      v-model="scope.row.content"
                    ></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div class="marcs__content" v-show="cataMode === 'Marc'">
            <div class="marcs__header">
              <div class="header__filter">
                <span class="label" style="whiteSpace:nowrap">分编类型：</span>
                <el-select
                  filterable
                  size="mini"
                  :disabled="mode === 'copy' && catalogueData.ztai !== '未审核'"
                  v-model="fbtype"
                  placeholder="请选择"
                  @change="marcTempChange"
                >
                  <el-option
                    v-for="item in fbList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <span class="label" style="margin-left: 10px;;whiteSpace:nowrap"
                  >模板：</span
                >
                <el-select
                  filterable
                  :disabled="mode === 'copy' && catalogueData.ztai !== '未审核'"
                  size="mini"
                  v-model="mbType"
                  placeholder="请选择"
                  @change="templateSwitch"
                >
                  <el-option
                    v-for="item in mbList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
                <el-button
                  size="mini"
                  v-show="mode !== 'copy'"
                  @click.native="addItem"
                  class="delAdd"
                  style="width:95px"
                  title="ALT+N"
                >
                  <icon-svg class="primary" icon-class="icon-btn-ico-" />
                  添加字段(N)
                </el-button>
                <el-button
                  size="mini"
                  v-show="mode !== 'copy'"
                  @click.native="checkRemoveItems"
                  class="delBtn"
                  style="width:95px"
                  title="ALT+X"
                >
                  <icon-svg icon-class="icon-btn-ico-21" />
                  删除字段(X)
                </el-button>
                <el-button size="mini" @click="resetData">
                  重置
                </el-button>
                <el-checkbox style="margin-left: 12px;" v-model="needShowTips"
                  >字段帮助</el-checkbox
                >
              </div>
            </div>

            <div class="marcs__content">
              <el-table
                ref="marcItemTable"
                border
                class="content__table_marc"
                :data="itemList"
                :row-class-name="setSelectRowClassName"
                @row-click="clickRow"
                @selection-change="handleSelectionChange"
                @current-change="handleCurrentChange"
                style="width: 100%"
              >
                <el-table-column
                  type="selection"
                  width="35"
                  align="center"
                ></el-table-column>
                <el-table-column width="75" label="字段标识" align="center">
                  <template slot-scope="scope">
                    <el-input
                      data-column="1"
                      :data-index="scope.$index"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      size="mini"
                      maxlength="3"
                      v-model="scope.row.field"
                      @blur="setMarcActiveIndexNull"
                      @focus="setMarcActiveIndexActive(scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column width="60" label="指示符1" align="center">
                  <template slot-scope="scope">
                    <el-input
                      data-column="2"
                      :data-index="scope.$index"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      maxlength="1"
                      size="mini"
                      v-model="scope.row.indexOne"
                      @blur="setMarcActiveIndexNull"
                      @focus="setMarcActiveIndexActive(scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column width="60" label="指示符2" align="center">
                  <template slot-scope="scope">
                    <el-input
                      data-column="3"
                      :data-index="scope.$index"
                      :disabled="
                        mode === 'copy' && catalogueData.ztai !== '未审核'
                      "
                      maxlength="1"
                      size="mini"
                      v-model="scope.row.indexTwo"
                      @blur="setMarcActiveIndexNull"
                      @focus="setMarcActiveIndexActive(scope.$index)"
                    ></el-input>
                  </template>
                </el-table-column>
                <el-table-column label="字段内容" align="center">
                  <template slot-scope="scope">
                    <div style="display: flex;align-items: center;">
                      <el-input
                        v-if="!['010', '200', '690'].includes(scope.row.field)"
                        data-type="marcInput"
                        type="textarea"
                        autosize
                        class="marcInput triangle"
                        data-column="4"
                        :data-index="scope.$index"
                        :disabled="
                          mode === 'copy' && catalogueData.ztai !== '未审核'
                        "
                        size="mini"
                        v-model="scope.row.content"
                        @keyup.ctrl.enter.native="
                          MonitorFieldEditFormshortCutTag($event, scope.$index)
                        "
                        @blur="setMarcActiveIndexNull"
                        @focus="
                          setMarcActiveIndexActive(scope.$index);
                          getMarcHelp(scope.row.field);
                        "
                        @dblclick.native="
                          setFieldData(scope.row.field, scope.row)
                        "
                      ></el-input>
                      <!-- 010a-isbn -->
                      <!-- 010d-价格 -->
                      <el-input
                        v-if="scope.row.field === '010'"
                        data-type="marcInput"
                        class="marcInput triangle"
                        data-column="4"
                        type="textarea"
                        autosize
                        :data-index="scope.$index"
                        :disabled="
                          mode === 'copy' && catalogueData.ztai !== '未审核'
                        "
                        size="mini"
                        @change="handMarc010Change($event, 'marc')"
                        v-model="scope.row.content"
                        @keyup.ctrl.enter.native="
                          MonitorFieldEditFormshortCutTag($event, scope.$index)
                        "
                        @blur="setMarcActiveIndexNull"
                        @focus="
                          setMarcActiveIndexActive(scope.$index);
                          getMarcHelp(scope.row.field);
                        "
                        @dblclick.native="
                          setFieldData(scope.row.field, scope.row)
                        "
                      ></el-input>
                      <!-- 200f-责任者 -->
                      <el-input
                        v-if="scope.row.field === '200'"
                        data-type="marcInput"
                        class="marcInput triangle"
                        data-column="4"
                        type="textarea"
                        autosize
                        :data-index="scope.$index"
                        :disabled="
                          mode === 'copy' && catalogueData.ztai !== '未审核'
                        "
                        size="mini"
                        v-model="scope.row.content"
                        @blur="
                          getSSHaoChange($event);
                          setMarcActiveIndexNull();
                        "
                        @keyup.ctrl.enter.native="
                          MonitorFieldEditFormshortCutTag($event, scope.$index)
                        "
                        @focus="
                          setMarcActiveIndexActive(scope.$index);
                          getMarcHelp(scope.row.field);
                        "
                        @dblclick.native="
                          setFieldData(scope.row.field, scope.row)
                        "
                      ></el-input>
                      <!-- 690a-分类号 -->
                      <el-input
                        v-if="scope.row.field === '690'"
                        data-type="marcInput"
                        class="marcInput triangle"
                        data-column="4"
                        type="textarea"
                        autosize
                        :data-index="scope.$index"
                        :disabled="
                          mode === 'copy' && catalogueData.ztai !== '未审核'
                        "
                        size="mini"
                        v-model="scope.row.content"
                        @blur="
                          getSSHaoChange($event);
                          setMarcActiveIndexNull();
                        "
                        @keydown.enter.native="getSSHaoChange"
                        @keyup.ctrl.enter.native="
                          MonitorFieldEditFormshortCutTag($event, scope.$index)
                        "
                        @focus="
                          setMarcActiveIndexActive(scope.$index);
                          getMarcHelp(scope.row.field);
                        "
                        @dblclick.native="
                          setFieldData(scope.row.field, scope.row)
                        "
                      ></el-input>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </div>
        <div class="content__middle">
          <span class="tit">馆藏信息</span>
          <div>
            <span class="tip">索书号：</span>
            <el-input
              :disabled="mode === 'copy' && catalogueData.ztai !== '未审核'"
              @keyup.enter.native="multireelCheck"
              size="mini"
              v-model="sshao"
              style="width: 180px;margin-right: 10px;"
            ></el-input>
            <el-button
              size="mini"
              type="primary"
              @click="multireelCheck"
              :loading="loadMultireel"
              >多卷查重</el-button
            >
            <el-button size="mini" type="primary" v-show="false"
              >种次号查缺</el-button
            >
          </div>
          <div>
            <el-checkbox
              v-model="isAutoCheck"
              @change="saveLocalStorageInTime('td-xzbmAutocheck', isAutoCheck)"
              >种次号自动查缺
            </el-checkbox>
            <el-checkbox
              v-model="rememberTM"
              @change="saveLocalStorageInTime('td-xzbmjytm', rememberTM)"
              >记忆条形码</el-checkbox
            >
          </div>
        </div>
        <div class="content__bottom" style="border-bottom: 1px solid #f2f2f2;">
          <!-- 馆藏模板 -->
          <div class="bottom__template">
            <el-form
              class="template__form"
              ref="templateForm"
              label-width="70px"
              :model="templateForm"
            >
              <el-form-item size="mini" class="item" label="复本数">
                <el-tooltip content="一次最多设置100本" placement="top">
                  <el-input
                    style="width: 70px;"
                    ref="fubenInput"
                    clearable
                    v-only-num="fuben"
                    :max="100"
                    :min="1"
                    v-model="fuben"
                    @blur="setShuceItems('blur')"
                    @keyup.enter.native="setShuceItems('enter')"
                  ></el-input>
                </el-tooltip>
                <el-checkbox
                  v-model="rememberFuben"
                  @change="saveLocalStorageInTime('td-xzbmjyfb', rememberFuben)"
                  style="margin-left: 5px;"
                  ><span style="margin-left: -5px;"
                    >记忆复本数</span
                  ></el-checkbox
                >
              </el-form-item>
              <el-form-item size="mini" class="item" prop="cejia" label="册价">
                <el-input
                  clearable
                  @change="templateFormChange('cejia', $event)"
                  v-model="templateForm.cejia"
                ></el-input>
              </el-form-item>
              <el-form-item size="mini" class="item" prop="taojia" label="套价">
                <el-input
                  clearable
                  @change="templateFormChange('taojia', $event)"
                  v-model="templateForm.taojia"
                ></el-input>
              </el-form-item>
              <el-form-item size="mini" class="item" prop="ztai" label="状态">
                <el-select
                  filterable
                  @change="templateFormChange('ztai', $event)"
                  v-model="templateForm.ztai"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ztOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item size="mini" class="item" prop="czid1" label="藏址">
                <el-select
                  filterable
                  @change="templateFormChange('czid1', $event)"
                  v-model="templateForm.czid1"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in czOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="ltlxid"
                label="流通类型"
              >
                <el-select
                  filterable
                  @change="templateFormChange('ltlxid', $event)"
                  v-model="templateForm.ltlxid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ltOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="gysid"
                label="供应商"
              >
                <el-select
                  filterable
                  v-model="templateForm.gysid"
                  @change="templateFormChange('gysid', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in gysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="batchid"
                label="批次"
              >
                <el-select
                  filterable
                  v-model="templateForm.batchid"
                  @change="templateFormChange('batchid', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in batchOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="zdfangshi"
                label="装订方式"
              >
                <el-select
                  filterable
                  v-model="templateForm.zdfangshi"
                  @change="templateFormChange('zdfangshi', $event)"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in zdfsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="ysuanid"
                label="预算"
              >
                <el-select
                  filterable
                  @change="templateFormChange('ysuanid', $event)"
                  v-model="templateForm.ysuanid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ysOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="jzleixing"
                label="介质类型"
              >
                <el-select
                  filterable
                  v-model="templateForm.jzleixing"
                  @change="templateFormChange('jzleixing', $event)"
                  placeholder="请选择"
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
              <el-form-item
                size="mini"
                class="item"
                prop="wxlyuan"
                label="来源"
              >
                <el-select
                  filterable
                  @change="templateFormChange('wxlyuan', $event)"
                  v-model="templateForm.wxlyuan"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in wxlyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                size="mini"
                class="item"
                prop="jcmshu"
                label="卷册描述"
              >
                <el-input
                  clearable
                  @change="templateFormChange('jcmshu', $event)"
                  v-model="templateForm.jcmshu"
                ></el-input>
              </el-form-item>
              <el-form-item size="mini" class="item" prop="beizhu" label="备注">
                <el-input
                  clearable
                  @change="templateFormChange('beizhu', $event)"
                  v-model="templateForm.beizhu"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <!-- 条目数据项 -->
          <div class="bottom__item">
            <div class="item__head">
              <table cellspacing="0" cellpadding="0">
                <thead>
                  <tr>
                    <th width="4%">序号</th>
                    <th width="8%">条形码</th>
                    <th width="5%">册价</th>
                    <th width="5%">套价</th>
                    <th width="5%">状态</th>
                    <th width="9%">藏址</th>
                    <th width="6%">流通类型</th>
                    <th width="6%">供应商</th>
                    <th width="6%">批次</th>
                    <th width="6%">装订方式</th>
                    <th width="4%">预算</th>
                    <th width="4%">介质类型</th>
                    <th width="4%">来源</th>
                    <th width="10%">卷册描述</th>
                    <th width="14%">备注</th>
                    <th width="4%">操作</th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="item__content">
              <el-scrollbar ref="contentScroll">
                <table cellspacing="0" cellpadding="0">
                  <tbody ref="itemBody">
                    <tr v-for="(item, index) in bookList" :key="index">
                      <td width="4%">{{ index + 1 }}</td>
                      <td width="8%">
                        <input
                          type="text"
                          v-model="item.tiaoma"
                          @keyup="
                            handleBarCodeScanner(
                              $event,
                              val => (item.tiaoma = val),
                              () => nextTiaoma($event, index)
                            )
                          "
                          @keyup.enter="nextTiaoma($event, index)"
                          @change="checkIsTiaomaRepeatInList"
                        />
                      </td>
                      <td width="5%">
                        <input type="text" v-model="item.cejia" />
                      </td>
                      <td width="5%">
                        <input type="text" v-model="item.taojia" />
                      </td>
                      <td width="5%">
                        <select v-model="item.ztai">
                          <option
                            v-for="option in ztOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="9%">
                        <select @change="czid1Change" v-model="item.czid1">
                          <option
                            v-for="option in czOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="6%">
                        <select v-model="item.ltlxid">
                          <option
                            v-for="option in ltOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="6%">
                        <select v-model="item.gysid">
                          <option
                            v-for="option in gysOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="6%">
                        <select v-model="item.batchid">
                          <option
                            v-for="option in batchOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="6%">
                        <select v-model="item.zdfangshi">
                          <option
                            v-for="option in zdfsOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="4%">
                        <select v-model="item.ysuanid">
                          <option
                            v-for="option in ysOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="4%">
                        <select v-model="item.jzleixing">
                          <option
                            v-for="option in jzlxOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="4%">
                        <select v-model="item.wxlyuan">
                          <option
                            v-for="option in wxlyOptions"
                            :key="option.value"
                            v-bind:value="option.value"
                          >
                            {{ option.label }}
                          </option>
                        </select>
                      </td>
                      <td width="10%">
                        <input type="text" v-model="item.jcmshu" />
                      </td>
                      <td width="14%">
                        <input type="text" v-model="item.beizhu" />
                      </td>
                      <td width="4%">
                        <icon-svg
                          style="color: #de5151;cursor: pointer;"
                          icon-class="icon-btn-ico-21"
                          @click.native="delteShuceItem(index)"
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <table
                  cellspacing="0"
                  cellpadding="0"
                  style="position: absolute;left: 0;pointer-events:none;"
                  :style="{ top: contentLayerTop + 'px' }"
                >
                  <tbody style="pointer-events:none;">
                    <tr
                      v-for="(item, index) in bookList"
                      :key="index"
                      style="height: 28px;pointer-events:none;"
                    >
                      <td
                        :class="{
                          repeat: repeatTiaoMaArr.includes(item.tiaoma),
                          repeat1:
                            nullTiaoMaArr.includes(index) &&
                            (item.tiaoma === '' || item.tiaoma === null),
                          repeat2: repeatTiaomaArrInList.includes(item.tiaoma)
                        }"
                        style="pointer-events:none;"
                      ></td>
                    </tr>
                  </tbody>
                </table>
              </el-scrollbar>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="content__footer">
      <div>
        <el-popover placement="top" width="400" trigger="hover">
          <div>
            <p style="text-align:center;font-weight: bold;">快捷键组合</p>
            <p style="text-align:center;margin-bottom: 10px;">
              快捷键由ALT键加上其他按键组成，如
            </p>
            <p>新增MARC字段快捷键：ALT+N（MARC模式下）</p>
            <p>删除MARC字段快捷键：ALT+X（MARC模式下）</p>
            <p>保存快捷键：ALT+S</p>
            <p>自动填写条码：ALT+B</p>
            <p>新增快捷键：ALT+A</p>
            <p>删除快捷键：ALT+D</p>
            <p>返回快捷键：ALT+Z</p>
            <p>快速定位到复本数：ALT+F</p>
            <p>快速定位第一个条形码输入框：ALT+Q</p>
            <p>编目文本框切换：ALT+方向键</p>
            <p>粘贴网页MARC：ALT+G</p>
          </div>
          <p slot="reference">
            <i class="el-icon-question"></i>
            <span style="margin-left: 10px;">快捷组合键：ALT+对应键</span>
          </p>
        </el-popover>
      </div>
      <div>
        <el-button
          type="primary"
          size="mini"
          @click="addNewShuceItem"
          title="ALT + A"
          >新增馆藏(A)</el-button
        >
        <el-button type="primary" size="mini" @click="fullfill" title="ALT + B"
          >填充条码(B)</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="handleAnalysisVisible"
          title="ALT + G"
          >粘贴网页MARC(G)</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="submitForm('simpleForm')"
          title="ALT + S"
          >保存(S)</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="returnLastPage"
          title="ALT + Z"
          >返回(Z)</el-button
        >
      </div>
    </div>
    <!-- 粘贴网页MARC -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="analysisVisible"
      title="粘贴网页MARC"
    >
      <el-input
        v-model="analysisData"
        type="textarea"
        ref="analysisData"
        :rows="10"
        placeholder="请输入网页MARC数据"
      >
      </el-input>
      <p style="line-height: 2;">操作步骤：</p>
      <!-- 多个链接的时候 -->
      <!-- <el-popover
        placement="top left"
        width="300"
        trigger="hover">
        <ol>
          <li>1</li>
          <li>2</li>
        </ol>
        <p style="line-height: 2;" slot="reference">1、选择对应链接，搜索书目数据</p>
      </el-popover> -->
      <p style="line-height: 2;">
        1、<a href="javascript:void(0)" @click="getGTLink">点击打开连接</a>
        ，搜索书目数据
      </p>
      <p style="line-height: 2;">2、切换到 MARC 格式</p>
      <p style="line-height: 2;">3、CTRL + A 全选</p>
      <p style="line-height: 2;">4、CTRL + C 复制</p>
      <p style="line-height: 2;">
        5、切换回本页 CTRL + V 复制内容到上方输入框中
      </p>
      <p style="line-height: 2;">6、点击确定解析数据</p>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" type="primary" @click="handleAnalysis"
              >确定</el-button
            >
            <el-button size="mini" @click="analysisVisible = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </el-dialog>
    <!-- 多卷查重 -->
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="showMultireelCheck"
      title="多卷查重"
    >
      <el-table :data="multireelData" max-height="400">
        <el-table-column
          show-overflow-tooltip
          property="ztming"
          label="正题名"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="cbtming"
          label="丛编题名"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="zrsming"
          label="责任者"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="sshao"
          label="索书号"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="jcmshu"
          label="卷册描述"
        ></el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {
  ZTAI_OPTIONS,
  ZDFANGSHI_OPTIONS,
  JZLEIXING_OPTIONS,
  WXLYUAN_OPTIONS,
  MARC_CN
} from "utils/variables";

import dayjs from "dayjs";

import {
  getSSHao,
  catalogDownloadSave,
  catalogCoppy,
  catalogMultireelCheck,
  bookBookDefault,
  marcTyInfoToFieldList,
  fieldListToMarcTyInfo,
  marcTyInfoToItemList,
  getPublishWithISBN,
  downLoadToMarc,
  fieldListToItemList,
  templateSwitch,
  getDonateBarCode,
  analysisCatalogueNlc
} from "api/catalogue";

import { marcConfigInvFieldLoad, marcConfigInvSubFieldList } from "api/setting";

import { findZtcByFlhaoEq } from "api/acquisition";

import {
  userCzList,
  flowType,
  userGysInLibList,
  userYsLibList,
  getMarcFbList,
  getMarcTemp,
  getMarcType,
  catalogBatchList
} from "api/public";

import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

import { duplicates } from "utils/utils";

export default {
  components: {
    "vue-draggable-resizable": VueDraggableResizable
  },
  name: "cat_xzbmedit",
  props: {
    mode: {
      // 新增new/套路taolu/复本copy/多卷multi
      type: String
    },
    catalogueData: {
      type: Object
    },
    isbn: {
      type: String
    }
  },
  data() {
    this.isOnlyMarcms = this.$TDLib === "yun";
    this.libId = this.$store.getters.userInfo.libId;
    this.ztOptions = ZTAI_OPTIONS;
    this.zdfsOptions = ZDFANGSHI_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.wxlyOptions = WXLYUAN_OPTIONS;
    this.libListSelect = [
      {
        label: "",
        value: ""
      }
    ];
    let validateZtming = (rule, value, callback) => {
      if (value === "" || value === null) {
        this.$message.error("正题名不能为空");
        callback(new Error(""));
      } else {
        callback();
      }
    };
    let validateFlh = (rule, value, callback) => {
      if (value === "" || value === null) {
        this.$message.error("分类号不能为空");
        callback(new Error(""));
      } else {
        callback();
      }
    };
    this.simpleFormRules = {
      ztming: [
        {
          required: true,
          validator: validateZtming,
          trigger: "blur"
        }
      ],
      flhao: [
        {
          required: true,
          validator: validateFlh,
          trigger: "blur"
        }
      ]
    };
    this.currentRow = {};
    this.tempFieldList = null; // marc模式新增数据，切换栏目时要记住
    return {
      frameInitialX: 0,
      needShowTips: false,
      showIframeTips: false,
      iframeSrc: "",
      tipsType: "",
      // 套录
      currentMarcActiveIndex: null,
      contentLayerTop: 0,
      repeatTiaoMaArr: [], // 保存重复的条码
      nullTiaoMaArr: [], // 空的条码
      repeatTiaomaArrInList: [], // 列表重复的条码
      loadMultireel: false,
      fuben: this.getLocalStorage("td-xzbmfuben") || 1,
      rememberFuben: JSON.parse(this.getLocalStorage("td-xzbmjyfb")),
      rememberTM: JSON.parse(this.getLocalStorage("td-xzbmjytm")),
      // 编目表格数据
      simpleForm: {
        ztming: "",
        ftming: "",
        fjming: "",
        bltming: "",
        flhao: "",
        fjhao: "",
        zrsming: "",
        isbn: "",
        jge: "CNY",
        otherzrsming: "",
        cbtming: "",
        yzhong: "chi",
        cbdi: "",
        cbzrsming: "",
        bci: "",
        cbzhe: "",
        fjian: "",
        yma: "",
        cbrqi: "",
        zti: "",
        fzhu: "",
        ccun: "",
        zyao: ""
      },
      showSelect: false,
      ztiSelected: [],
      ztiSelectedArr: [],
      isAutoCheck: JSON.parse(this.getLocalStorage("td-xzbmAutocheck")),
      sshao: "",
      // 条目模式
      loadTMTableData: false,
      tmList: [],
      marcConfigMarcList: [],
      marctype: "",
      // marcs模式
      cataMode: localStorage.getItem("td-xzbmmode") || "简单", // 简单&条目式&MARC
      fbList: [],
      fbtype: "",
      multiSelection: [],
      mbList: [],
      mbType: "",
      itemList: [],
      // 模板
      czOptions: [],
      ltOptions: [],
      gysOptions: [],
      batchOptions: [],
      ysOptions: [],
      templateForm: {
        tiaoma: "",
        cejia: 0,
        taojia: 0,
        ztai: this.getLocalStorage("td-xzbmztai"),
        czid1: "",
        ltlxid: "",
        gysid: "",
        batchid: "",
        zdfangshi: this.getLocalStorage("td-xzbmzdfangshi"),
        ysuanid: "",
        jzleixing: this.getLocalStorage("td-xzbmjzleixing"),
        wxlyuan: this.getLocalStorage("td-xzbmwxlyuan"),
        jcmshu: "",
        beizhu: ""
      },
      bookList: [],
      // 多卷
      showMultireelCheck: false,
      multireelData: [],
      // 解析
      analysisData: "",
      analysisVisible: false,
      // 辅助录入
      fieldTipsTypeList: [],
      fieldTipsType: "",
      subFieldItems: [],
      showSetFiledDialog: false,
      fieldItemForm: {},
      fieldItemFormRules: {}
    };
  },
  methods: {
    resetData() {
      this.$confirm("是否恢复初始数据？", "提示", {
        confirmButtonText: "恢复",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.itemList = JSON.parse(this.defaultItemList);
        this.fbtype = this.defaultItemFbType;
        getMarcTemp({
          marcfbid: this.fbtype,
          location: 2
        }).then(res => {
          this.mbList = res.data
            ? res.data.map(item => {
                return {
                  label: item.mingcheng,
                  value: item.mbid
                };
              })
            : [];
          this.mbType = this.defaultItemMbType;
        });
      });
    },
    handleIFrameClose(event) {
      if (
        this.showIframeTips === true &&
        event.altKey &&
        event.keyCode === 67
      ) {
        // C 关闭窗口
        window.event.preventDefault();
        this.hideTips();
      }
    },
    hideTips() {
      this.iframeSrc = "";
      this.showIframeTips = false;
    },
    cellClassName({ columnIndex }) {
      if (columnIndex < 2) {
        return "disabled";
      }
    },
    setSelectRowClassName({ rowIndex }) {
      // 高亮选中
      if (this.multiSelection.includes(rowIndex)) {
        return "selected";
      }
    },
    getGTLink() {
      window.open(
        `http://opac.nlc.cn/F/?func=find-b&find_code=ISB&request=${this.isbn ||
          ""}&local_base=NLC01&filter_code_1=WLN&filter_request_1=&filter_code_2=WYR&filter_request_2=&filter_code_3=WYR&filter_request_3=&filter_code_4=WFM&filter_request_4=&filter_code_5=WSL&filter_request_5=`,
        "_blank"
      );
    },
    handleAnalysis() {
      if (!this.analysisData) {
        this.$message.warning("请输入国图标准MARC数据");
        return;
      }
      analysisCatalogueNlc({
        nlc: this.analysisData,
        marcMode: 3
      }).then(res => {
        if (this.cataMode !== "Marc") {
          this.cataMode = "Marc";
          this.saveLocalStorageInTime("td-xzbmmode", this.cataMode); // 当前模式
        }
        this.itemList = res.data.map((item, index) => {
          item = {
            index: index,
            ...item
          };
          return item;
        });

        this.setFocus();
        this.analysisVisible = false;
        this.getSSHaoData();
      });
    },
    handleAnalysisVisible() {
      this.analysisVisible = true;
      this.analysisData = "";
      this.$nextTick(() => {
        this.$refs["analysisData"].select();
      });
    },
    getMarcHelp(marcType) {
      if (!this.needShowTips || !marcType) {
        this.hideTips();
        return;
      }
      // 打开marc帮助页面
      // prettier-ignore
      let helpsDataArr = ["510", "512", "513", "514", "515", "516", "517", "000", "001", "520", "488", "005", "801",
          "802", "010", "011", "530", "410", "531", "411", "532", "020", "021", "660", "540", "661", "541", "300",
          "421", "422", "302", "423", "303", "304", "700", "305", "701", "306", "702", "307", "308", "430", "310",
          "431", "311", "432", "312", "433", "675", "313", "434", "676", "314", "435", "710", "315", "436", "711",
          "437", "712", "680", "440", "320", "441", "200", "321", "442", "443", "444", "686", "324", "720", "446",
          "600", "205", "326", "447", "601", "722", "327", "448", "602", "328", "604", "605", "606", "607", "690",
          "692", "330", "451", "210", "452", "332", "453", "454", "610", "215", "461", "462", "100", "101", "102",
          "345", "620", "225", "500", "105", "501", "106", "503"
        ];
      if (helpsDataArr.includes((marcType + "").padStart(3, 0))) {
        this.showIframeTips = true;
        this.tipsType = marcType;
        this.iframeSrc = `/elib/static/cnmarcHelps/cnmarc${marcType}Help.html`;
        // this.iframeSrc = `http://192.168.1.171:4819/static/cnmarcHelps/cnmarc${marcType}Help.html`;
      } else {
        this.hideTips();
      }
    },
    // 简单模式
    setSimpleFormInputEvents() {
      this.$refs.simpleForm.$el.addEventListener(
        "keydown",
        event => {
          // 37-← 38-↑  39-→ 40-↓ 13-Enter
          let keyCode = event.keyCode;

          // 如果不是ALT+上下左右方向键 或者 回车键 则不处理
          if (event.altKey) {
            if (keyCode < 37 || keyCode > 40) {
              return;
            }
          } else if (keyCode !== 13) {
            return;
          }
          let target = event.target || event.srcElement;

          if (
            target.nodeName.toLowerCase() !== "input" &&
            target.dataset.type !== "smarcInput"
          ) {
            return;
          }
          window.event.preventDefault();
          let targetIndex = +target.dataset.index;
          // 最后一个输入框回车跳转到条形码
          if (keyCode === 13 && targetIndex === 22) {
            this.smItemFocus();
            return;
          }
          switch (keyCode) {
            case 37:
              targetIndex--;
              targetIndex = Math.max(targetIndex, 0);
              break;
            case 38:
              if (targetIndex >= 22) {
                targetIndex -= 1;
              } else {
                targetIndex -= 3;
              }
              if (targetIndex < 0) {
                targetIndex += 3;
              }
              break;
            case 39:
            case 13:
              targetIndex++;
              targetIndex = Math.min(targetIndex, 22);
              break;
            case 40:
              if (18 <= targetIndex && targetIndex <= 20) {
                targetIndex = 21;
              } else if (targetIndex === 21) {
                targetIndex = 22;
              } else {
                targetIndex += 3;
              }
              if (targetIndex > 22) {
                targetIndex -= 3;
              }
              break;
            default:
              break;
          }

          let container = document.querySelector(".simple__form").children[
            targetIndex
          ];

          let targetDom =
            container.querySelector(".smarc__input input") ||
            container.querySelector(".smarc__input textarea");
          setTimeout(() => {
            targetDom.focus();
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    // 条目模式
    setTMSEvents() {
      this.$refs.tmItemTable.$el.addEventListener(
        "keydown",
        event => {
          // 38-↑ 40-↓ 13-Enter
          let keyCode = event.keyCode;
          // 如果不是ALT + 上下方向键或者回车键则不处理
          if (event.altKey) {
            if (keyCode !== 38 && keyCode !== 40) {
              return;
            }
          } else if (keyCode !== 13) {
            return;
          }

          let target = event.target || event.srcElement;
          if (
            target.nodeName.toLowerCase() !== "input" &&
            target.dataset.type !== "tmInput"
          ) {
            return;
          }

          window.event.preventDefault();
          let targetIndex = +target.dataset.index;
          let maxItem = this.tmList.length;
          // 最后一个输入框回车跳转到条形码
          if (keyCode === 13 && targetIndex === maxItem - 1) {
            this.smItemFocus();
            return;
          }
          switch (keyCode) {
            case 38:
              targetIndex--;
              targetIndex = Math.max(targetIndex, 0);
              break;
            case 13:
            case 40:
              targetIndex++;
              targetIndex = Math.min(targetIndex, maxItem - 1);
              break;
            default:
              break;
          }

          let container = document.querySelector(".content__table_tms tbody")
            .children[targetIndex];
          let targetDom = container.querySelector("input");
          setTimeout(() => {
            targetDom.focus();
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    async getSysMarcConfigMarcList() {
      return new Promise((resolve, reject) => {
        getMarcType()
          .then(res => {
            this.marcConfigMarcList = res.data
              ? res.data.map(item => {
                  return {
                    label: item.leixing,
                    value: item.marclxid
                  };
                })
              : [];
            if (!this.marctype) {
              this.marctype = this.marcConfigMarcList[0]
                ? this.marcConfigMarcList[0].value
                : "";
              resolve();
            }
          })
          .catch(() => {
            reject();
          });
      });
    },
    getTMSData() {
      if (!this.marctype) {
        return;
      }
      marcTyInfoToItemList({
        marclxid: this.marctype,
        ...this.simpleForm,
        fieldList: this.tempFieldList
          ? JSON.parse(this.tempFieldList)
          : this.mode === "new"
          ? []
          : JSON.stringify(this.catalogueData.fieldList)
      }).then(res => {
        this.tmList = res.data.fieldList.map(item => {
          return {
            name: MARC_CN[item.field] ? MARC_CN[item.field] : item.field,
            ...item
          };
        });
        this.setFocus();
      });
    },
    getSimpleDataFromTMS() {
      let dataObj = {};
      this.tmList.forEach(item => {
        dataObj[item.field] = item.content;
      });
      Object.keys(this.simpleForm).forEach(key => {
        if (dataObj[key]) {
          this.simpleForm[key] = dataObj[key];
        } else {
          this.simpleForm[key] = "";
        }
      });
      this.setSimpleFocus();
    },
    // marc模式
    setMARCEvents() {
      this.$refs.marcItemTable.$el.addEventListener(
        "keydown",
        event => {
          // 38-↑ 40-↓ Enter-13
          let keyCode = event.keyCode;
          // 如果不是上下方向键或回车键则不处理
          if (event.altKey) {
            if (keyCode !== 38 && keyCode !== 40) {
              return;
            }
          } else if (keyCode !== 13) {
            return;
          }
          let target = event.target || event.srcElement;
          if (
            target.nodeName.toLowerCase() !== "textarea" &&
            target.dataset.type !== "marcInput"
          ) {
            return;
          }
          window.event.preventDefault();
          let targetIndex = target.dataset.index ? +target.dataset.index : "";

          if (targetIndex === "") {
            return;
          }
          let maxItem = this.itemList.length;
          // 最后一个输入框回车跳转到条形码
          if (keyCode === 13 && !event.ctrlKey && targetIndex === maxItem - 1) {
            this.smItemFocus();
            return;
          }
          switch (keyCode) {
            case 38:
              targetIndex--;
              targetIndex = Math.max(targetIndex, 0);
              break;
            case 40:
              targetIndex++;
              targetIndex = Math.min(targetIndex, maxItem - 1);
              break;
            default:
              break;
          }
          // 额外判断回车符，要避免冲突
          if (keyCode === 13) {
            if (event.ctrlKey) {
              // Ctrl + 回车是输入分隔符
              return;
            } else {
              // 回车是换行换行
              targetIndex++;
              targetIndex = Math.min(targetIndex, maxItem - 1);
            }
          }

          let container = document.querySelector(".content__table_marc tbody")
            .children[targetIndex];

          let targetDom = container.children[4].querySelector("textarea");
          setTimeout(() => {
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    changeCataMode(targetMode) {
      let prevMode = this.cataMode;
      this.cataMode = targetMode;
      this.saveLocalStorageInTime("td-xzbmmode", this.cataMode); // 当前模式
      // 简单或条目 转 marc 模式使用 http://192.168.1.132:4999/index.php?s=/29&page_id=3334
      if (prevMode === "简单") {
        if (targetMode === "条目式") {
          // 简单 => 条目式
          this.getTMSData();
        } else if (targetMode === "Marc") {
          // 简单 => Marc
          this.toMarcFromSimpleOrTiaomu("简单");
        }
      } else if (prevMode === "条目式") {
        if (targetMode === "Marc") {
          // 条目式 => MARC模式
          this.toMarcFromSimpleOrTiaomu("条目式");
        } else {
          // 条目式 => 简单模式
          this.getSimpleDataFromTMS();
        }
      } else if (prevMode === "Marc") {
        this.tempFieldList = JSON.stringify(this.itemList);
        if (targetMode === "简单") {
          // Marc => 简单
          this.getSimpleFormInfo();
          this.setSimpleFocus();
          setTimeout(() => {
            document
              .querySelector(".item__select input")
              .setAttribute("tabIndex", -1);
          }, 500);
        } else {
          // Marc => 条目模式
          this.fieldListToItemList();
        }
      }
    },
    toMarcFromSimpleOrTiaomu(fromMode) {
      if (this.fbtype === "") {
        this.itemList = [];
        this.multiSelection = [];
        return;
      }
      let requestObj = {
        marcfbid: this.fbtype,
        templateId: this.mbType,
        fieldList: this.tempFieldList
          ? JSON.parse(this.tempFieldList)
          : this.mode === "new"
          ? []
          : JSON.stringify(this.catalogueData.fieldList)
      };
      if (fromMode === "条目式") {
        this.tmList.forEach(item => {
          if (item.content) {
            requestObj[item.field] = item.content;
          }
        });
      } else if (fromMode === "简单") {
        requestObj = {
          ...requestObj,
          ...this.simpleForm
        };
      }

      marcTyInfoToFieldList(requestObj).then(res => {
        this.itemList = res.data.fieldList.map((item, index) => {
          item = {
            index: index,
            ...item
          };
          return item;
        });
        this.defaultItemList = JSON.stringify(this.itemList);
        this.defaultItemFbType = this.fbtype;
        this.defaultItemMbType = this.mbType;
        this.setFocus();
      });
    },
    // marc -> tm
    fieldListToItemList() {
      fieldListToItemList({
        marclxid: this.marctype,
        fieldList: JSON.stringify(this.itemList)
      }).then(res => {
        this.tmList = res.data.fieldList.map(item => {
          return {
            name: MARC_CN[item.field] ? MARC_CN[item.field] : item.field,
            ...item
          };
        });
        this.setFocus();
      });
    },
    async getSysMarcConfigMarcFbList() {
      return new Promise(resolve => {
        getMarcFbList()
          .then(res => {
            this.fbList = res.data
              ? res.data.map(item => {
                  return {
                    label: item.leixing,
                    value: item.marcfbid,
                    marcLxId: item.marclxid
                  };
                })
              : [];
            this.fbtype = this.fbList[0] ? this.fbList[0].value : "";
            this.currentMarcLxId = this.fbList[0]
              ? this.fbList[0].marcLxId
              : "";
          })
          .finally(() => {
            resolve();
          });
      });
    },
    marcTempChange() {
      this.mbType = "";
      if (!this.fbtype) {
        return;
      }
      getMarcTemp({
        marcfbid: this.fbtype,
        location: 2
      }).then(res => {
        this.mbList = res.data
          ? res.data.map(item => {
              return {
                label: item.mingcheng,
                value: item.mbid
              };
            })
          : [];
      });
    },
    async asyncGetSysMarcConfigMarcTempList() {
      return new Promise(resolve => {
        if (!this.fbtype) {
          return;
        }
        for (let i = 0; i < this.fbList.length; i++) {
          if (this.fbList[i].value === this.fbtype) {
            this.currentMarcLxId = this.fbList[i].marcLxId;
            break;
          }
        }
        getMarcTemp({
          marcfbid: this.fbtype,
          location: 2
        })
          .then(res => {
            this.mbList = res.data
              ? res.data.map(item => {
                  return {
                    label: item.mingcheng,
                    value: item.mbid
                  };
                })
              : [];
            this.mbType = this.mbList[0] ? this.mbList[0].value : "";
          })
          .finally(() => {
            resolve();
          });
      });
    },
    // Marc模式切换模板
    templateSwitch() {
      let requestObj = {
        marcfbid: this.fbtype,
        templateId: this.mbType,
        fieldList: JSON.stringify(this.itemList)
      };
      templateSwitch(requestObj).then(res => {
        this.itemList = res.data.fieldList.map((item, index) => {
          item = {
            index: index,
            ...item
          };
          return item;
        });
        this.setFocus();
      });
    },
    handleSelectionChange(val) {
      this.multiSelection = val.map(item => item.index);
    },
    handleCurrentChange(val) {
      this.currentRow = val || {};
    },
    MonitorFieldEditFormshortCutTag(e, index) {
      let start = e.target.selectionStart;
      let end = e.target.selectionEnd;
      let value = this.itemList[index].content || "";
      value = value.split("");
      value.splice(start, end - start, String.fromCharCode(31));
      let result = value.join("");
      this.itemList[index].content = result;
      this.$nextTick(() => {
        e.target.setSelectionRange(start + 1, start + 1);
      });
    },
    addItem() {
      let currentIndex = this.getMarcActiveElementIndex();

      this.itemList.splice(currentIndex + 1, 0, {
        field: "",
        indexOne: "#",
        indexTwo: "#",
        content: "",
        index: this.itemList.length
      });
      this.updateIndex();
      this.$nextTick(() => {
        // 选中新加的输入框字段标识符
        let targetIndex =
          currentIndex + 1 > this.itemList.length - 1 ? 0 : currentIndex + 1;
        let container = document.querySelector(".content__table_marc tbody")
          .children[targetIndex];

        let targetDom = container.children[1].querySelector("input");
        setTimeout(() => {
          targetDom.select();
          if (this.itemList.length > 14) {
            targetDom.scrollIntoView();
          }
        }, 100);
      });
    },
    checkRemoveItems() {
      if (this.multiSelection.length > 1) {
        this.$confirm(
          `确定删除 ${this.multiSelection.length} 条数据吗？`,
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            this.removeItems();
          })
          .catch(() => {});
      } else if (this.multiSelection.length === 1) {
        // 只勾选中一个，直接删除
        this.removeItems();
      } else {
        // 删除光标所在行或者没有光标时候（删除最后一行）
        if (this.itemList.length > 0) {
          let currentIndex = this.getMarcActiveElementIndex();
          let columnIndex = this.getMarcActiveElementInputColumn();
          this.itemList.splice(currentIndex, 1);
          this.updateIndex();
          this.$nextTick(() => {
            if (this.itemList.length === 0) {
              // 不存在行数后激活，为了监听键盘事件
              document.querySelector(".cat-xzbmedit").focus();
            } else {
              let targetIndex = Math.max(currentIndex - 1, 0);
              // 删除后光标定位在删除的行
              let container = document.querySelector(
                ".content__table_marc tbody"
              ).children[targetIndex];
              container.children[columnIndex]
                .querySelector("textarea")
                .select();
            }
          });
        }
      }
    },
    removeItems() {
      let targetIndex = this.itemList.length - 1;
      let columnIndex = this.getMarcActiveElementInputColumn();
      this.multiSelection.map(selectedIndex => {
        this.itemList.forEach((item, index) => {
          if (item.index === selectedIndex) {
            targetIndex = Math.min(targetIndex, index);
            this.itemList.splice(index, 1);
          }
        });
      });
      this.multiSelection = [];
      this.updateIndex();
      this.$nextTick(() => {
        if (this.itemList.length === 0) {
          // 不存在行数后激活，为了监听键盘事件
          document.querySelector(".cat-xzbmedit").focus();
        } else {
          // 可以多选，定位到最小所在行
          let container = document.querySelector(".content__table_marc tbody")
            .children[targetIndex];
          container.children[columnIndex].querySelector("input").select();
        }
      });
    },
    setMarcActiveIndexActive(index) {
      // 这2个方法是为了解决光标在某行时点击删除字段按钮无法获取之前所在行
      if (this.marcActiveTimer) {
        clearTimeout(this.marcActiveTimer);
      }
      this.currentMarcActiveIndex = index;
    },
    setMarcActiveIndexNull() {
      this.marcActiveTimer = setTimeout(() => {
        this.currentMarcActiveIndex = null;
      }, 100);
    },
    getMarcActiveElementIndex() {
      // 获取当前光标所在行或者最后一行
      let currentIndex =
        this.currentMarcActiveIndex !== null
          ? this.currentMarcActiveIndex
          : this.itemList.length - 1;
      return Math.max(currentIndex, 0);
    },
    getMarcActiveElementInputColumn() {
      // 获取当前光标所在行的列
      let columnIndex = document.activeElement.dataset["column"];
      columnIndex = columnIndex || 4;
      return columnIndex;
    },
    updateIndex() {
      this.itemList.forEach((item, index) => {
        item.index = index;
      });
    },
    clickRow(row, column, event) {
      if (
        event.target.className.indexOf("el-input__inner") === -1 &&
        event.target.className.indexOf("el-icon-question") === -1
      ) {
        this.$refs.marcItemTable.toggleRowSelection(row);
      }
    },
    // 表单数据
    changeZti(val) {
      this.simpleForm.zti = val.join("");
    },
    handleShowSelect() {
      this.showSelect = true;
      this.$refs.ztiSelect.focus();
      setTimeout(() => {
        document
          .querySelector(".item__select input")
          .setAttribute("tabIndex", -1);
      }, 500);
    },
    handleShowSelectBlur() {
      this.showSelect = false;
      setTimeout(() => {
        document
          .querySelector(".item__select input")
          .setAttribute("tabIndex", -1);
      }, 500);
    },
    // 模板数据
    getSimpleFormInfo() {
      fieldListToMarcTyInfo({
        fieldList: JSON.stringify(this.itemList)
      }).then(res => {
        Object.keys(this.simpleForm).forEach(item => {
          this.simpleForm[item] = res.data[item];
        });
      });
    },
    getDefaultData() {
      // 获取默认数据
      bookBookDefault({
        marctyId: this.catalogueData.marctyid
      }).then(res => {
        // 复本模式下，从 bookBookDefault 接口获取初始索书号
        if (this.mode === "copy") {
          this.sshao = res.data.sshao;
        }
        let bookData = res.data.bookDeault;
        Object.keys(this.templateForm).forEach(item => {
          if (item !== "batchid") {
            this.templateForm[item] = bookData[item];
          }
        });
        this.getOptions();
      });
    },
    getOptions() {
      let p1 = this.getCZOptions();
      let p2 = this.getLTOptions();
      let p3 = this.getGYSOptions();
      let p4 = this.getYSOptions();
      let p5 = this.getDonateBarCode();
      Promise.all([p1, p2, p3, p4, p5]).then(() => {
        this.initOptions();
        this.initItems();
      });
    },
    initOptions() {
      // 初始化下拉列表
      this.templateForm.czid1 = this.templateForm.czid1
        ? this.templateForm.czid1
        : this.getArrFirstValue(this.czOptions);
      // 优先根据“捐赠图书条形码”接口设置藏址
      if (this.donateCodes.length > 0) {
        this.templateForm.czid1 = this.donateCodes[0].czId;
      }
      // 记住用户上次选择的藏址并使用
      let lastCZ1 = this.getLocalStorage("td-xzbmcz");
      this.czOptions.forEach(item => {
        if (lastCZ1 === item.value) {
          this.templateForm.czid1 = lastCZ1;
        }
      });
      this.templateForm.ztai = this.templateForm.ztai
        ? this.templateForm.ztai
        : "在馆";
      this.templateForm.zdfangshi = this.templateForm.zdfangshi
        ? this.templateForm.zdfangshi
        : this.getArrFirstValue(this.zdfsOptions);
      this.templateForm.jzleixing = this.templateForm.jzleixing
        ? this.templateForm.jzleixing
        : this.getArrFirstValue(this.jzlxOptions);
      this.templateForm.wxlyuan = this.templateForm.wxlyuan
        ? this.templateForm.wxlyuan
        : this.getArrFirstValue(this.wxlyOptions);

      // 记住上次选择
      this.templateForm.ltlxid = this.templateForm.ltlxid
        ? this.templateForm.ltlxid
        : this.getArrFirstValue(this.ltOptions);
      for (let i = 0; i < this.ltOptions.length; i++) {
        let item = this.ltOptions[i];
        if (item.value === this.getLocalStorage("td-xzbmltlxid")) {
          this.templateForm.ltlxid = item.value;
          break;
        }
      }

      this.templateForm.gysid = this.templateForm.gysid
        ? this.templateForm.gysid
        : this.getArrFirstValue(this.gysOptions);
      for (let i = 0; i < this.gysOptions.length; i++) {
        let item = this.gysOptions[i];
        if (item.value === this.getLocalStorage("td-xzbmgysid")) {
          this.templateForm.gysid = item.value;
          break;
        }
      }

      this.templateForm.ysuanid = this.templateForm.ysuanid
        ? this.templateForm.ysuanid
        : this.getArrFirstValue(this.ysOptions);
      for (let i = 0; i < this.ysOptions.length; i++) {
        let item = this.ysOptions[i];
        if (item.value === this.getLocalStorage("td-xzbmysuanid")) {
          this.templateForm.ysuanid = item.value;
          break;
        }
      }
    },
    getCZOptions() {
      return new Promise((resolve, reject) => {
        userCzList({
          libId: this.libId
        })
          .then(res => {
            this.czOptions = res.data.map(item => {
              return {
                value: item.czid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getLTOptions() {
      return new Promise((resolve, reject) => {
        flowType({
          libId: this.libId
        })
          .then(res => {
            this.ltOptions = res.data.map(item => {
              return {
                value: item.ltlxid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getGYSOptions() {
      return new Promise((resolve, reject) => {
        userGysInLibList({
          libId: this.libId
        })
          .then(res => {
            this.gysOptions = res.data.map(item => {
              return {
                value: item.gysId,
                label: item.gysName
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getYSOptions() {
      return new Promise((resolve, reject) => {
        userYsLibList({
          libId: this.libId
        })
          .then(res => {
            this.ysOptions = res.data.map(item => {
              return {
                value: item.ysid,
                label: item.mingcheng
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    getNumVal() {
      if (this.fuben > 100) {
        this.fuben = 100;
      }
      if (this.fuben <= 0) {
        this.fuben = 1;
      }
    },
    setShuceItems(key) {
      this.getNumVal();
      let val = this.fuben;
      // 复本数变动
      if (+val <= 0) {
        return; // 非正整数
      }
      let gap = val - this.bookList.length;
      if (gap > 0) {
        // 增加复本数
        for (let i = 0; i < gap; i++) {
          this.addShuceItem();
        }
      } else if (gap < 0) {
        // 减少复本数也要对应减少 2019年12月16日 from:qzj
        let deleteCount = Math.abs(gap);
        this.bookList.splice(this.bookList.length - deleteCount);
      }
      if (key === "enter") {
        // 只有复本数回车才会触发定位到第一条
        this.$nextTick(() => {
          this.emptySMItemFocus();
        });
      }
    },
    smItemFocus() {
      // 因为条形码输入框监听了keyup事件，会导致顶部最后一个输入框回车后跳入第一行条形码输入框时跳去第二个条形码，所以需要延时
      setTimeout(() => {
        if (this.bookList.length > 0) {
          let firstSmItem = this.$refs["itemBody"].childNodes[0].childNodes[1]
            .firstChild;
          if (firstSmItem) {
            firstSmItem.select();
            firstSmItem.scrollIntoView();
          }
        }
      }, 200);
    },
    emptySMItemFocus() {
      // 定位到第一个空的条形码输入框
      for (let i = 0; i < this.bookList.length; i++) {
        if (
          this.bookList[i].tiaoma === "" ||
          this.bookList[i].tiaoma === null
        ) {
          let focusItem = this.$refs["itemBody"].childNodes[i].childNodes[1]
            .firstChild;
          if (focusItem) {
            focusItem.select();
            focusItem.scrollIntoView();
          }
          return;
        }
      }
      // 全部都有值定位到第一条
      this.smItemFocus();
    },
    // 书目信息变更
    templateFormChange(key, value) {
      let needSaveTemplateProps = [
        "ztai",
        "ltlxid",
        "gysid",
        "zdfangshi",
        "ysuanid",
        "jzleixing",
        "wxlyuan"
      ];
      if (needSaveTemplateProps.includes(key)) {
        this.saveLocalStorageInTime("td-xzbm" + key, value);
      }
      this.bookList.forEach(item => {
        item[key] = value;
      });
      if (key === "czid1") {
        this.lastSelectCzid = event.target.value;
      }
    },
    czid1Change(event) {
      this.lastSelectCzid = event.target.value;
    },
    initItems() {
      // 优先根据“捐赠图书条形码”接口设置复本以及条形码
      let donateCodesLen = this.donateCodes.length;
      this.fuben = donateCodesLen > 0 ? donateCodesLen : this.fuben;
      for (let i = 0; i < this.fuben; i++) {
        this.addShuceItem();
      }
      if (donateCodesLen > 0) {
        for (let i = 0; i < this.bookList.length; i++) {
          this.bookList[i].tiaoma = this.donateCodes[i].barCode;
        }
      } else {
        if (this.getLocalStorage("td-xzbmtiaoma")) {
          this.generateInitTiaoma(this.getLocalStorage("td-xzbmtiaoma"));
        }
      }
    },
    generateInitTiaoma(startTM) {
      let num = startTM;
      let lastNum = num;
      for (let i = 0; i < this.bookList.length; i++) {
        lastNum = this.getNextTiaoma(lastNum);
        this.bookList[i].tiaoma = lastNum;
      }
    },
    delteShuceItem(index) {
      this.bookList.splice(index, 1);
      this.fuben = this.bookList.length;
    },
    addShuceItem() {
      this.bookList.push(Object.assign({}, this.templateForm));
    },
    addNewShuceItem() {
      this.addShuceItem();
      this.fuben = this.bookList.length;
    },
    // 本地存储的数据
    saveLocalStorageInTime(key, value) {
      localStorage.setItem(key, value);
    },
    saveLocalStorage() {
      localStorage.setItem(
        "td-xzbmcz",
        this.lastSelectCzid || this.templateForm.czid1
      ); // 记住上次藏址

      if (this.rememberFuben) {
        localStorage.setItem("td-xzbmfuben", this.fuben); // 复本数
      } else {
        localStorage.setItem("td-xzbmfuben", 1); // 不记住复本重置为1
      }

      if (this.rememberTM) {
        let tiaoma = this.bookList[this.bookList.length - 1].tiaoma;
        localStorage.setItem("td-xzbmtiaoma", tiaoma); // 最后一次的条码
      } else {
        localStorage.setItem("td-xzbmtiaoma", ""); // 下次开始的条码
      }
    },
    getLocalStorage(name) {
      return localStorage.getItem(name);
    },
    checkIsTiaomaRepeatInList() {
      // 找到列表中重复的条形码并高亮
      let tiaomaArr = [];
      this.bookList.forEach(item => {
        if (item.tiaoma !== "" && item.tiaoma !== null) {
          tiaomaArr.push(item.tiaoma);
        }
      });
      this.repeatTiaomaArrInList = duplicates(tiaomaArr);
      if (this.repeatTiaomaArrInList.length > 0) {
        this.$message.error(
          `列表中条形码[${this.repeatTiaomaArrInList.join(", ")}]重复`
        );
        for (let i = 0; i < this.bookList.length; i++) {
          if (this.bookList[i].tiaoma === this.repeatTiaomaArrInList[0]) {
            setTimeout(() => {
              this.$refs.itemBody.children[i].scrollIntoView();
              this.$refs.itemBody.children[i].children[1].children[0].select();
            }, 200);
            break;
          }
        }
        return true;
      }
      return false;
    },
    scrollIntoFirstExistTiaoma(arr) {
      for (let i = 0; i < this.bookList.length; i++) {
        if (this.bookList[i].tiaoma === arr[0]) {
          this.$refs.itemBody.children[i].scrollIntoView();
          this.$refs.itemBody.children[i].children[1].children[0].select();
          return;
        }
      }
    },
    // 提交
    submitForm(formName) {
      // 先判断其他必填条件
      if (this.sshao === "") {
        this.$message("请输入分类号");
        return false;
      }
      // 找到列表中空的条形码并高亮
      this.nullTiaoMaArr = [];
      this.bookList.forEach((item, index) => {
        if (item.tiaoma === "" || item.tiaoma === null) {
          this.nullTiaoMaArr.push(index);
        }
      });
      for (let i = 0; i < this.bookList.length; i++) {
        if (
          this.bookList[i].tiaoma === "" ||
          this.bookList[i].tiaoma === null
        ) {
          this.$message.error("保存失败，条形码不能为空");
          this.$refs.itemBody.children[i].scrollIntoView();
          this.$refs.itemBody.children[i].children[1].children[0].select();
          return;
        }
        if (
          this.bookList[i].batchid === "" ||
          this.bookList[i].batchid === null
        ) {
          this.$message("批次不能为空");
          return;
        }
      }
      // 列表存在重复
      if (this.checkIsTiaomaRepeatInList()) {
        return;
      }

      // marc模式要判断规则
      if (this.cataMode === "Marc") {
        this.checkItems();
      } else if (this.cataMode === "条目式") {
        this.tmList.forEach(item => {
          if (item.field === "isbn") {
            this.submitISBN = item.content; // 当前保存项的 ISBN
          }
        });
        this.handleCatalogueSave();
      } else if (this.cataMode === "简单") {
        // 简单模式提交需要先校验表单
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.submitISBN = this.simpleForm.isbn; // 当前保存项的 ISBN
            this.handleCatalogueSave();
          } else {
            this.$refs["scrollBar"].$refs["wrap"].scrollTo(0, 0);
            return false;
          }
        });
      }
    },
    checkItems() {
      // 有字段内容才要判断标识是否为空
      let finalItems = this.itemList.filter(item => item.content !== "");
      for (let i = 0; i < finalItems.length; i++) {
        let currentField = finalItems[i].field;
        let currentContent = finalItems[i].content;
        let currentIndexOne = finalItems[i].indexOne;
        let currentIndexTwo = finalItems[i].indexTwo;
        if (currentField === "" || currentField === null) {
          this.$message.error("字段标识不能为空");
          return;
        }
        // 前三位需为数字
        if (!/^\d{3}$/.test(currentField)) {
          this.$message.error(`字段标识 ${currentField} 需为三位数字`);
          return;
        }
        // 指示符判断 000-008 允许为空，其余只能输入 #/0-9
        if (!/00[0-8]$/.test(currentField)) {
          if (
            !["#", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
              currentIndexOne
            )
          ) {
            this.$message.error(
              `字段标识 ${currentField} 的 指示符1 需为 #/0-9 其中一个`
            );
            return;
          }

          if (
            !["#", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
              currentIndexTwo
            )
          ) {
            this.$message.error(
              `字段标识 ${currentField} 的 指示符2 需为 #/0-9 其中一个`
            );
            return;
          }
        }
        // 字段内容不为空
        if (currentContent === "" || currentContent === null) {
          this.$message.error("字段内容不能为空");
          return;
        }
        // 字段内容第一位
        if (
          !/00[0-8]$/.test(currentField) &&
          currentContent[0].charCodeAt() !== 31
        ) {
          this.$message.error(
            `字段标识 ${currentField} 的字段内容第一位需要以 ▼ 开头`
          );
          return;
        }
        // 字段内容第二位
        if (
          !/00[0-8]$/.test(currentField) &&
          !/^[a-zA-Z\d]+$/.test(currentContent[1])
        ) {
          this.$message.error(
            `字段标识 ${currentField} 的字段内容第二位只能是 0-9/a-z/A-Z`
          );
          return;
        }
        // 截取当前保存的 ISBN
        if (currentField === "010") {
          this.submitISBN = this.getDataFromMarcWithCode(currentContent, "a");
        }
      }
      this.handleCatalogueSave();
    },
    handleCatalogueSave() {
      let requestObj = {};
      let bookList = JSON.stringify(this.bookList);
      if (this.mode === "copy") {
        // 复本
        if (this.cataMode === "简单") {
          requestObj = {
            marcMode: 1,
            marctyid: this.catalogueData.marctyid,
            sshao: this.sshao,
            bookList,
            ...this.simpleForm,
            fieldList: this.tempFieldList
              ? JSON.parse(this.tempFieldList)
              : this.mode === "new"
              ? []
              : JSON.stringify(this.catalogueData.fieldList)
          };
        } else if (this.cataMode === "条目式") {
          requestObj = {
            marcMode: 2,
            marctyid: this.catalogueData.marctyid,
            sshao: this.sshao,
            bookList,
            fieldList: this.tempFieldList
              ? JSON.parse(this.tempFieldList)
              : this.mode === "new"
              ? []
              : JSON.stringify(this.catalogueData.fieldList)
          };
          this.tmList.forEach(item => {
            if (item.content) {
              requestObj[item.field] = item.content;
            }
          });
        } else if (this.cataMode === "Marc") {
          requestObj = {
            marcMode: 3,
            marctyid: this.catalogueData.marctyid,
            marcfbid: this.fbtype,
            templateId: this.mbType,
            sshao: this.sshao,
            bookList,
            fieldList: JSON.stringify(this.itemList)
          };
        }
        catalogCoppy(requestObj)
          .then(res => {
            this.saveLocalStorage();
            this.$message.success(res.message);
            this.$emit("updateCatalogue");
            this.returnLastPage();
          })
          .catch(err => {
            if (err.data) {
              this.repeatTiaoMaArr = err.data;
              this.scrollIntoFirstExistTiaoma(err.data);
            }
          });
      } else {
        // 套录/新增/多卷
        if (this.cataMode === "简单") {
          requestObj = {
            marcMode: 1,
            sshao: this.sshao,
            bookList,
            ...this.simpleForm,
            fieldList: this.tempFieldList
              ? JSON.parse(this.tempFieldList)
              : this.mode === "new"
              ? []
              : JSON.stringify(this.catalogueData.fieldList)
          };
        } else if (this.cataMode === "Marc") {
          requestObj = {
            marcMode: 3,
            marcfbid: this.fbtype,
            templateId: this.mbType,
            sshao: this.sshao,
            bookList,
            fieldList: JSON.stringify(this.itemList)
          };
        } else if (this.cataMode === "条目式") {
          requestObj = {
            marcMode: 2,
            sshao: this.sshao,
            bookList,
            fieldList: this.tempFieldList
              ? JSON.parse(this.tempFieldList)
              : this.mode === "new"
              ? []
              : JSON.stringify(this.catalogueData.fieldList)
          };
          this.tmList.forEach(item => {
            if (item.content) {
              requestObj[item.field] = item.content;
            }
          });
        }
        catalogDownloadSave(requestObj)
          .then(res => {
            this.saveLocalStorage();
            this.$message.success(res.message);
            this.$emit("updateCatalogue");
            this.returnLastPage();
          })
          .catch(err => {
            if (err.data) {
              this.repeatTiaoMaArr = err.data;
              this.scrollIntoFirstExistTiaoma(err.data);
            }
            this.$message.error(err.message);
          });
      }
    },
    // 多卷查重
    multireelCheck() {
      if (!this.sshao) {
        this.$message("请输入索书号");
        return;
      }
      this.loadMultireel = true;
      catalogMultireelCheck({
        sshao: this.sshao
      })
        .then(res => {
          this.showMultireelCheck = true;
          this.multireelData = res.data;
        })
        .finally(() => {
          this.loadMultireel = false;
        });
    },
    // 通用
    setDefaultJiage(value) {
      if (!value) {
        return;
      }
      let floatReg = /\d+(.\d+)?/g;
      let arrNums = value.match(floatReg);
      this.templateForm.cejia = this.templateForm.taojia = arrNums
        ? arrNums[0]
        : 0;
      // 联动模板价格
      this.templateFormChange("cejia", this.templateForm.cejia);
      this.templateFormChange("taojia", this.templateForm.taojia);
    },
    flhaoBlur(event) {
      this.getSSHaoChange(event);
      if (this.cataMode !== "简单") {
        // 只有简单模式要加载主题词列表
        return;
      }
      findZtcByFlhaoEq({
        flhao: event.target.value
      }).then(res => {
        this.ztiSelectedArr = res.data.map(item => {
          return {
            value: item,
            label: item
          };
        });

        if (this.ztiSelectedArr[0]) {
          this.ztiSelected = [this.ztiSelectedArr[0].value];
          this.changeZti(this.ztiSelected);
        } else {
          this.ztiSelected = [];
        }
        setTimeout(() => {
          document
            .querySelector(".item__select input")
            .setAttribute("tabIndex", -1);
        }, 500);
      });
    },
    getSSHaoChange(event) {
      if (!event.target.value) {
        return;
      }
      this.getSSHaoData();
    },
    getSSHaoData() {
      let flhao = ""; // 分类号
      let author = ""; // 责任者
      if (this.cataMode === "简单") {
        flhao = this.simpleForm.flhao;
        author = this.simpleForm.zrsming;
      } else if (this.cataMode === "条目式") {
        this.tmList.forEach(item => {
          if (item.field === "flhao") {
            flhao = item.content;
          }
          if (item.field === "zrsming") {
            author = item.content;
          }
        });
      } else if (this.cataMode === "Marc") {
        this.itemList.forEach(item => {
          if (item.field === "690") {
            flhao = this.getDataFromMarcWithCode(item.content, "a");
            flhao = flhao.split(";")[0];
          }
          if (item.field === "200") {
            author = this.getDataFromMarcWithCode(item.content, "f");
          }
        });
      }
      if (!flhao) {
        return;
      }
      getSSHao({
        flhao: flhao,
        author: author,
        isQk: 0,
        isCheck: this.isAutoCheck ? 1 : 0
      }).then(res => {
        this.sshao = res.data;
      });
    },
    handMarc010Change(value, type) {
      // Marc 模式的 010
      // 传递价格改变模板价格
      this.setDefaultJiage(this.getDataFromMarcWithCode(value, "d"));
      // 联动模板价格
      this.templateFormChange("cejia", this.templateForm.cejia);
      this.templateFormChange("taojia", this.templateForm.taojia);
      // 传递isbn获取出版地/出版社
      this.getPublishWithISBN(value, type);
    },
    getPublishWithISBN(isbn, formType) {
      if (this.mode !== "new") {
        // 新增模式下才要获取出版社
        return;
      }
      if (formType === "marc") {
        isbn = this.getDataFromMarcWithCode(isbn, "a");
      }
      if (!isbn) {
        return;
      }
      getPublishWithISBN({
        isbn: isbn
      }).then(res => {
        if (formType === "simple") {
          this.simpleForm.cbzhe = res.data.cbzhe || this.simpleForm.cbzhe;
          this.simpleForm.cbdi = res.data.cbdi || this.simpleForm.cbdi;
        } else if (formType === "tms") {
          this.tmList.forEach(item => {
            if (item.field === "cbzhe") {
              item.content = res.data.cbzhe || item.content;
            }
            if (item.field === "cbdi") {
              item.content = res.data.cbdi || item.content;
            }
          });
        } else if (formType === "marc") {
          this.itemList.forEach(item => {
            if (item.field === "210") {
              let content = item.content;
              // 出版者
              if (res.data.cbzhe) {
                let cbzheSplit = String.fromCharCode(31) + "c";
                let cbzheSplitIndex = content.indexOf(cbzheSplit);
                if (cbzheSplitIndex === -1) {
                  content += cbzheSplit + res.data.cbzhe;
                } else {
                  let endSplitIndex = content.indexOf(
                    String.fromCharCode(31),
                    cbzheSplitIndex + 1
                  );
                  let endWord =
                    endSplitIndex > -1 ? content.substring(endSplitIndex) : "";
                  content =
                    content.substring(0, cbzheSplitIndex + 2) +
                    res.data.cbzhe +
                    endWord;
                }
              }

              // 出版地
              if (res.data.cbdi) {
                let cbdiSplit = String.fromCharCode(31) + "a";
                let cbdiSplitIndex = content.indexOf(cbdiSplit);
                if (cbdiSplitIndex === -1) {
                  content += cbdiSplit + res.data.cbdi;
                } else {
                  let endSplitIndex = content.indexOf(
                    String.fromCharCode(31),
                    cbdiSplitIndex + 1
                  );
                  let endWord =
                    endSplitIndex > -1 ? content.substring(endSplitIndex) : "";
                  content =
                    content.substring(0, cbdiSplitIndex + 2) +
                    res.data.cbdi +
                    endWord;
                }
              }

              // 重新赋值
              item.content = content;
            }
          });
        }
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
    getDataFromMarcWithCode(marcString, splitCode) {
      let sub = String.fromCharCode(31) + splitCode;
      if (marcString.indexOf(sub) > -1) {
        let word = marcString.substring(marcString.indexOf(sub));
        let splitIndex = word.indexOf(String.fromCharCode(31), 1);
        if (splitIndex > -1) {
          return word.substring(2, splitIndex);
        } else {
          return word.substring(2);
        }
      }
      return "";
    },
    // 功能按钮
    fullfill() {
      if (this.bookList[0] && this.bookList[0].tiaoma) {
        let num = this.bookList[0].tiaoma;
        let lastNum = num;
        for (let i = 0; i < this.bookList.length; i++) {
          this.bookList[i].tiaoma = lastNum;
          lastNum = this.getNextTiaoma(lastNum);
        }
      } else {
        this.$message("请输入初始条形码");
      }
    },
    returnLastPage() {
      // 复本的时候记住刚才选择的书目，其余时候定位到第一条
      this.$router.push({
        name: "cat_xzbm",
        query: {
          isbn: this.$route.query.isbn,
          marctyId: this.mode === "copy" ? this.catalogueData.marctyid : ""
        }
      });
      this.$emit("handleHideEditPage", {
        isbn: this.submitISBN || ""
      });
    },
    keyEvent(event) {
      if (event.altKey && event.keyCode === 65) {
        // A 新增
        window.event.preventDefault();
        this.addNewShuceItem();
      } else if (event.altKey && event.keyCode === 68) {
        // D 删除最后一条记录
        window.event.preventDefault();
        this.delteShuceItem(this.bookList.length - 1);
      } else if (event.altKey && event.keyCode === 83) {
        // S 保存
        window.event.preventDefault();
        this.submitForm("simpleForm");
      } else if (event.altKey && event.keyCode === 81) {
        // Q 定位到第一个条码框
        window.event.preventDefault();
        this.smItemFocus();
      } else if (event.altKey && event.keyCode === 90) {
        // Z 返回
        window.event.preventDefault();
        this.returnLastPage();
      } else if (event.altKey && event.keyCode === 66) {
        // B 自动填充
        window.event.preventDefault();
        this.fullfill();
      } else if (event.altKey && event.keyCode === 123) {
        // ALT+F 复本数输入
        window.event.preventDefault();
        this.$refs["fubenInput"].select();
        this.$refs["fubenInput"].$el.scrollIntoView();
      } else if (event.altKey && event.keyCode === 78) {
        // ALT+N 新增MARC
        window.event.preventDefault();
        if (this.cataMode !== "Marc" || this.mode === "copy") {
          return;
        }
        this.addItem();
      } else if (event.altKey && event.keyCode === 88) {
        // ALT+X 删除MARC
        window.event.preventDefault();
        if (this.cataMode !== "Marc" || this.mode === "copy") {
          return;
        }
        this.checkRemoveItems();
      } else if (event.altKey && event.keyCode === 70) {
        // F 定位复本
        window.event.preventDefault();
        this.scrollIntoFuben();
      } else if (event.altKey && event.keyCode === 71) {
        // G 国图标准MARC
        window.event.preventDefault();
        this.handleAnalysisVisible();
      }
    },
    nextTiaoma(e, index) {
      if (index < this.bookList.length - 1) {
        this.$refs["itemBody"].childNodes[
          index + 1
        ].childNodes[1].firstChild.select();
      }
    },
    setFocus() {
      if (this.mode === "copy") {
        if (!this.alreadyFBFocus) {
          // 复本，只有第一次复本模式进入会定位到条形码
          // 切换模式不会
          this.$nextTick(() => {
            this.smItemFocus();
            this.alreadyFBFocus = true;
          });
        }
      } else {
        if (this.cataMode === "简单") {
          this.setSimpleFocus();
        } else if (this.cataMode === "条目式") {
          this.setTMSFocus();
        } else if (this.cataMode === "Marc") {
          this.setMarcFocus();
        }
      }
    },
    setSimpleFocus() {
      this.$nextTick(() => {
        this.$refs.focusInput.select();
        this.$refs["scrollBar"].$refs["wrap"].scrollTo(0, 0);
      });
    },
    setTMSFocus() {
      this.$nextTick(() => {
        let firstInputOuter = document.querySelector(
          ".content__table_tms tbody"
        ).children;
        if (firstInputOuter[0]) {
          let firstInput = firstInputOuter[0].querySelector("input");
          firstInput.select();
          this.$refs["scrollBar"].$refs["wrap"].scrollTo(0, 0);
        }
      });
    },
    setMarcFocus() {
      this.$nextTick(() => {
        let firstInputOuter = document.querySelector(
          ".content__table_marc tbody"
        ).children;
        if (firstInputOuter[0]) {
          let firstInput = firstInputOuter[0].children[4].querySelector(
            "textarea"
          );
          firstInput.select();
          this.$refs["scrollBar"].$refs["wrap"].scrollTo(0, 0);
        }
      });
    },
    scrollIntoFuben() {
      this.$refs["fubenInput"].select();
      this.$refs["fubenInput"].$el.scrollIntoView();
    },
    // 获取批次
    async getCatalogBatchList() {
      return new Promise((resolve, reject) => {
        catalogBatchList({
          flag: 0
        })
          .then(res => {
            this.batchOptions = res.data.map(item => {
              if (item.last === true) {
                this.templateForm.batchid = item.batchId;
              }
              return {
                label: item.batchCode,
                value: item.batchId
              };
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    // 获取捐献图书条码
    getDonateBarCode() {
      return new Promise((resolve, reject) => {
        if (!this.isbn) {
          this.donateCodes = [];
          resolve();
        } else {
          getDonateBarCode({
            isbn: this.isbn
          })
            .then(res => {
              this.donateCodes = res.data;
              resolve();
            })
            .catch(() => {
              reject();
            });
        }
      });
    },
    // 初始解析 isbn 获取出版社和初版地
    defaultGetPublishWithISBN() {
      getPublishWithISBN({
        isbn: this.isbn
      }).then(res => {
        if (this.cataMode === "简单") {
          this.simpleForm.cbzhe = res.data.cbzhe || this.simpleForm.cbzhe;
          this.simpleForm.cbdi = res.data.cbdi || this.simpleForm.cbdi;
        } else if (this.cataMode === "条目式") {
          this.tmList.forEach(item => {
            if (item.field === "cbzhe") {
              item.content = res.data.cbzhe || item.content;
            }
            if (item.field === "cbdi") {
              item.content = res.data.cbdi || item.content;
            }
          });
        } else if (this.cataMode === "Marc") {
          this.itemList.forEach(item => {
            if (item.field === "210") {
              let content = item.content;
              // 出版者
              if (res.data.cbzhe) {
                let cbzheSplit = String.fromCharCode(31) + "c";
                let cbzheSplitIndex = content.indexOf(cbzheSplit);
                if (cbzheSplitIndex === -1) {
                  content += cbzheSplit + res.data.cbzhe;
                } else {
                  let endSplitIndex = content.indexOf(
                    String.fromCharCode(31),
                    cbzheSplitIndex + 1
                  );
                  let endWord =
                    endSplitIndex > -1 ? content.substring(endSplitIndex) : "";
                  content =
                    content.substring(0, cbzheSplitIndex + 2) +
                    res.data.cbzhe +
                    endWord;
                }
              }

              // 出版地
              if (res.data.cbdi) {
                let cbdiSplit = String.fromCharCode(31) + "a";
                let cbdiSplitIndex = content.indexOf(cbdiSplit);
                if (cbdiSplitIndex === -1) {
                  content += cbdiSplit + res.data.cbdi;
                } else {
                  let endSplitIndex = content.indexOf(
                    String.fromCharCode(31),
                    cbdiSplitIndex + 1
                  );
                  let endWord =
                    endSplitIndex > -1 ? content.substring(endSplitIndex) : "";
                  content =
                    content.substring(0, cbdiSplitIndex + 2) +
                    res.data.cbdi +
                    endWord;
                }
              }

              // 重新赋值
              item.content = content;
            }
          });
        }
      });
    },
    // 辅助录入
    changeCurrentFieldType(command) {
      this.marcConfigInvSubFieldList(command.value);
      this.fieldTipsType = command.label;
    },
    setFieldData(field, fieldData) {
      marcConfigInvFieldLoad({
        field,
        marcLxId: this.currentMarcLxId
      }).then(res => {
        if (res.data.length > 0) {
          // 一开始直接取第一个
          this.fieldTipsTypeList = res.data.map(item => {
            return {
              label: item.invariantField,
              value: item.fieldId
            };
          });
          this.fieldTipsType = res.data[0].invariantField;
          this.showSetFiledDialog = true;
          if (this.showIframeTips) {
            this.showIframeTips = false;
          }
          this.marcConfigInvSubFieldList(res.data[0].fieldId, fieldData);
        }
      });
    },
    getMatchContent(content) {
      let tag = this.fieldTipsType.slice(3, 4);
      let matchStart = content.indexOf(String.fromCharCode(31) + tag);
      let matchEnd = content.indexOf(String.fromCharCode(31), matchStart + 1);
      // 去掉前面的标识符
      if (matchEnd > -1) {
        // 后面还有字符串
        return content.slice(matchStart + 2, matchEnd);
      } else {
        return content.slice(matchStart + 2);
      }
    },
    marcConfigInvSubFieldList(fieldId, fieldData) {
      marcConfigInvSubFieldList({
        fieldId
      }).then(res => {
        this.fieldItemFormRules = {};
        let propsArr = [];
        // 头标区
        let defaultContent = "";
        if (fieldData.field === "000") {
          defaultContent = fieldData.content;
        } else {
          defaultContent = this.getMatchContent(fieldData.content);
        }
        // 循环获取字段模板配置，匹配对应字符串长度渲染默认值
        let startIndex = 0;
        let endIndex = 0;
        // 没有取到 defaultItemContent 的时候就用默认值
        let defaultItemContent = "";
        res.data.forEach(item => {
          endIndex += item.subFieldLength;
          defaultItemContent = defaultContent.slice(startIndex, endIndex);
          startIndex += item.subFieldLength;
          if (item.subFieldType === 3) {
            // 多选框是数组
            let emptyArr = [];
            let len = item.keyLength || 1;
            let defaultStr = defaultItemContent || item.subFieldDefault;
            for (let i = 0, l = defaultStr.length; i < l / len; i++) {
              let ele = defaultStr.slice(len * i, len * (i + 1));
              emptyArr.push(ele);
            }
            // 判断数据源是否有空值 key
            let subData = JSON.parse(item.subFieldData);
            let isEmptyKey = false;
            for (let k = 0; k < subData.length; k++) {
              let keyItem = subData[k];
              if (keyItem.key.trim() === "") {
                isEmptyKey = true;
                break;
              }
            }
            if (isEmptyKey) {
              propsArr[item.subFieldId] = emptyArr;
            } else {
              propsArr[item.subFieldId] = emptyArr.filter(
                item => !!item.trim()
              );
            }
            propsArr[item.subFieldId] = emptyArr.filter(item => !!item.trim());
            // 过滤重复数据
            propsArr[item.subFieldId] = [...new Set(propsArr[item.subFieldId])];
          } else {
            // 判断是否为日期
            if (
              item.subFieldDefault.toUpperCase() === "YYYY" ||
              item.subFieldDefault.toUpperCase() === "YYYYMM" ||
              item.subFieldDefault.toUpperCase() === "YYYYMMDD"
            ) {
              propsArr[item.subFieldId] =
                defaultItemContent ||
                dayjs().format(item.subFieldDefault.toUpperCase());
            } else {
              propsArr[item.subFieldId] =
                defaultItemContent || item.subFieldDefault;
            }
          }
          // 补充校验规则
          if (item.subFieldType === 1) {
            this.fieldItemFormRules[item.subFieldId] = [
              {
                required: item.isEmpty === 0,
                message: "不允许为空",
                trigger: "blur"
              },
              {
                max: item.subFieldLength,
                message: `长度不能超过${item.subFieldLength}字符`,
                trigger: "blur"
              }
            ];
          } else {
            // 下拉框
            this.fieldItemFormRules[item.subFieldId] = [
              {
                required: item.isEmpty === 0,
                message: "不允许为空",
                trigger: "change"
              }
            ];
          }
        });
        this.fieldItemForm = { ...propsArr };
        this.subFieldItems = res.data;
      });
    },
    submitFieldForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          let dataStr = "";

          this.subFieldItems.forEach(item => {
            if (item.subFieldType === 1) {
              dataStr += this.fieldItemForm[item.subFieldId];
              let lengthGap =
                item.subFieldLength -
                this.fieldItemForm[item.subFieldId].length;
              for (let i = 0; i < lengthGap; i++) {
                dataStr += " ";
              }
            } else if (item.subFieldType === 2) {
              dataStr += this.fieldItemForm[item.subFieldId];
              let lengthGap =
                item.subFieldLength -
                this.fieldItemForm[item.subFieldId].length;
              for (let i = 0; i < lengthGap; i++) {
                dataStr += " ";
              }
            } else if (item.subFieldType === 3) {
              dataStr += this.fieldItemForm[item.subFieldId].join("");
              let lengthGap =
                item.subFieldLength -
                this.fieldItemForm[item.subFieldId].join("").length;
              for (let i = 0; i < lengthGap; i++) {
                dataStr += " ";
              }
            }
          });
          // 填充到对应的字段标识
          this.fullupMarcContent(dataStr);
        }
      });
    },
    fullupMarcContent(content) {
      let field = this.fieldTipsType.slice(0, 3);
      let tag = this.fieldTipsType.slice(3, 4);
      for (let i = 0; i < this.itemList.length; i++) {
        let item = this.itemList[i];
        if (item.field === field && this.fieldTipsType.length === 3) {
          // 没有切割符直接填充
          item.content = content;
          break;
        } else if (item.field === field && tag) {
          // 找对应的填充
          let matchStart = item.content.indexOf(String.fromCharCode(31) + tag);
          let matchEnd = item.content.indexOf(
            String.fromCharCode(31),
            matchStart + 1
          );
          let contentStart = item.content.slice(0, matchStart);
          let contentEnd = "";
          if (matchEnd > -1) {
            contentEnd = item.content.slice(matchEnd);
          } else {
            // 没有其他标识
            contentEnd = "";
          }
          item.content =
            contentStart + String.fromCharCode(31) + tag + content + contentEnd;
          break;
        }
      }
      this.showSetFiledDialog = false;
    }
  },
  destroyed() {
    window.removeEventListener("keydown", this.handleIFrameClose);
  },
  async mounted() {
    if (this.isOnlyMarcms) {
      this.cataMode = "Marc";
    }

    this.frameInitialX =
      document.querySelector(".cat-xzbmedit").clientWidth - 640;
    window.addEventListener("keydown", this.handleIFrameClose, false);
    // 馆藏浮层，用于展示错误提示
    let scrollbarEl = this.$refs.contentScroll.wrap;
    scrollbarEl.onscroll = () => {
      this.contentLayerTop = -scrollbarEl.scrollTop;
    };

    // 模板相关数据预处理-------开始
    // 同步 获取批次数据
    await this.getCatalogBatchList();

    if (this.catalogueData && this.mode !== "new") {
      this.setDefaultJiage(this.catalogueData.jge); // 设置默认价格和套价
      if (this.mode !== "copy") {
        // 非复本模式下，初始索书号从 getSSHao 接口获取
        if (this.catalogueData.flhao) {
          getSSHao({
            flhao: this.catalogueData.flhao,
            author: this.catalogueData.zrsming,
            isQk: 0,
            isCheck: this.isAutoCheck ? 1 : 0
          }).then(res => {
            this.sshao = res.data;
          });
        }
      }
    }
    // 如果有marctyid就初始化默认馆藏数据再加载下拉列表，否则直接初始下拉列表数据
    if (this.catalogueData && this.catalogueData.marctyid) {
      this.getDefaultData();
    } else {
      this.getOptions();
    }

    // 模板相关数据预处理-------结束

    // 设置三种模式 input 框事件
    this.setSimpleFormInputEvents();
    this.setTMSEvents();
    this.setMARCEvents();

    // 取消简单模式中下拉框的focus事件
    setTimeout(() => {
      document
        .querySelector(".item__select input")
        .setAttribute("tabIndex", -1);
    }, 500);

    // 获取条目式 Marc 类型
    await this.getSysMarcConfigMarcList();
    // 获取分编类型列表
    await this.getSysMarcConfigMarcFbList();
    await this.asyncGetSysMarcConfigMarcTempList();

    // 进来是简单模式
    if (this.cataMode === "简单") {
      downLoadToMarc({
        marcMode: 1,
        fieldList:
          this.mode === "new"
            ? []
            : JSON.stringify(this.catalogueData.fieldList)
      }).then(res => {
        Object.keys(this.simpleForm).forEach(item => {
          this.simpleForm[item] = res.data[item] || "";
        });
        if (this.mode === "new") {
          this.simpleForm.jge = "CNY";
          this.simpleForm.yzhong = "chi";
        }
        this.setFocus();
        if (this.mode === "new" && this.isbn) {
          // 新增模式要解析 isbn 获取出版社和出版地
          this.defaultGetPublishWithISBN();
        }
      });
    }
    // 进来是条目模式
    if (this.cataMode === "条目式" && this.marctype) {
      // 有MARC类型
      downLoadToMarc({
        marcMode: 2,
        marclxid: this.marctype,
        fieldList:
          this.mode === "new"
            ? []
            : JSON.stringify(this.catalogueData.fieldList)
      }).then(res => {
        this.tmList = res.data.map(item => {
          if (this.mode === "new") {
            if (item.field === "jge") {
              item.content = "CNY";
            }
            if (item.field === "yzhong") {
              item.content = "chi";
            }
          }
          return {
            name: MARC_CN[item.field] ? MARC_CN[item.field] : item.field,
            ...item
          };
        });

        this.setFocus();
        if (this.mode === "new" && this.isbn) {
          // 新增模式要解析 isbn 获取出版社和出版地
          this.defaultGetPublishWithISBN();
        }
      });
    }
    // 进来就是 Marc 模式
    if (this.cataMode === "Marc") {
      if (this.fbtype === "") {
        this.$message.warning("不存在分编类型!");
        return;
      }
      downLoadToMarc({
        marcMode: 3,
        marcfbid: this.fbtype,
        templateId: this.mbType,
        fieldList:
          this.mode === "new"
            ? []
            : JSON.stringify(this.catalogueData.fieldList)
      }).then(res => {
        this.itemList = res.data.fieldList.map((item, index) => {
          item = {
            index: index,
            ...item
          };
          return item;
        });
        this.setFocus();
        this.defaultItemList = JSON.stringify(this.itemList);
        this.defaultItemFbType = this.fbtype;
        this.defaultItemMbType = this.mbType;
        if (this.mode === "new" && this.isbn) {
          // 新增模式要解析 isbn 获取出版社和出版地
          this.defaultGetPublishWithISBN();
        }
      });
    }

    // 监听键盘事件
    document
      .querySelector(".cat-xzbmedit")
      .addEventListener("keydown", this.keyEvent, false);
  },
  activated() {
    this.setFocus();
  }
};
</script>

<style lang="less" scoped>
.iframe__wrapper {
  z-index: 9 !important;
  border: 1px solid #99bbe8;
  padding: 5px;
  background: transparent url("../../../assets/panel_title.jpg");
  border-radius: 5px;
  .title {
    cursor: move;
    display: flex;
    justify-content: space-between;
    padding: 2px 0px 4px 0px;
    border-bottom: 1px solid #99bbe8;
    background: #eff8ff;
    font-size: 12px;
    font-weight: bold;
  }
  .content,
  iframe {
    background: #fff;
    width: 100%;
    height: 100%;
    max-height: ~"calc(100% - 28px)";
  }
  .content {
    box-sizing: border-box;
  }
}
.cat-xzbmedit {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  z-index: 100;
  background: #fff;
}
.header__nav {
  width: 100%;
  line-height: 39px;
  background: #f1f2f3;
  font-size: 0;
  .header__item {
    cursor: pointer;
    display: inline-block;
    vertical-align: bottom;
    color: #515355;
    padding: 0 20px;
    font-size: 0.15rem;
    &.active {
      color: #0079fe;
      font-weight: 600;
      background: #fff;
    }
  }
}
.wrapper {
  height: ~"calc(100% - 47px)";
}

.content__top {
  background: #fff;

  .simple__form {
    display: flex;
    flex-wrap: wrap;
    padding: 5px 50px 0 15px;
    justify-content: space-between;
    background: @contentHdColor;

    .item {
      flex: 0 0 30%;
      margin-bottom: 0px;

      /deep/ .el-form-item__label {
        text-align-last: justify;
        position: relative;

        &:after {
          content: "：";
          position: absolute;
          right: 0px;
        }
      }

      /deep/ .el-form-item__error {
        padding-top: 0;
      }

      &.is-required {
        /deep/ .el-form-item__label {
          &::before {
            position: absolute;
            left: -8px;
            top: 3px;
            content: "*";
            color: @dangerColor;
          }
        }
      }
    }

    .item__select {
      /deep/ .el-form-item__content {
        display: flex;
      }

      .el-select {
        position: absolute;
        opacity: 0;
        left: 0;
        right: 0;
      }
    }
  }

  .marcs__header {
    display: flex;
    padding: 5px 15px;
    justify-content: space-between;

    .header__filter {
      display: flex;
      align-items: center;
    }
  }
}

.content__middle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: @topBgColor;
  height: 36px;
  padding: 0 20px;

  .tit {
    font-weight: bold;
    font-size: @FSize_15;
    color: @fontDarkColor;
  }

  .tip {
    line-height: 32px;
    font-weight: bold;
    font-size: @FSize_14;
    color: @fontDarkColor;
  }
}

.content__bottom {
  display: flex;
  background: @contentHdColor;

  .bottom__template {
    flex: 0 0 234px;
    padding: 0 5px;
    border-right: 1px solid @tableBorderColor;
    /deep/ .el-form-item__content {
      line-height: 28px;
    }
    .item {
      margin-bottom: 0px;
      /deep/ .el-form-item__label {
        line-height: 28px;
      }
    }
  }

  .bottom__item {
    width: ~"calc(100% - 234px - 12px - 10px)";
    overflow: auto;
    flex-grow: 0;
    padding: 5px;

    /deep/ .el-input__inner {
      padding: 0;
    }

    /deep/ .cell {
      padding: 0;
    }

    table {
      width: 100%;

      th,
      td {
        font-size: @FSize_14;
        height: 28px;
        font-weight: bold;
        text-align: left;
        border-right: 1px solid #c8d3df;
        border-bottom: 1px solid #c8d3df;
        text-align: center;

        &:first-child {
          border-left: 1px solid #c8d3df;
        }
      }

      th {
        border-top: 1px solid #c8d3df;
      }

      input {
        width: 100%;
        height: 28px;
        text-align: center;
        border: none;
        outline: none;
      }

      select {
        width: 100%;
        height: 28px;
        border: none;
        outline: none;
      }
    }

    .item__content {
      height: 420px;
      .repeat,
      .repeat1,
      .repeat2 {
        background: red;
        opacity: 0.1;
      }
    }
  }
}

.content__footer {
  height: 46px;
  background: @contentHdColor;
  border-top: 1px solid @tableBorderColor;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;

  .el-button {
    padding: 8px 10px;
  }
}

.el-form {
  .item {
    /deep/ .el-form-item__label {
      text-align-last: justify;
      position: relative;

      &:after {
        content: "：";
        position: absolute;
        right: 0px;
      }
    }
  }
}

/deep/ .el-scrollbar__wrap {
  overflow-x: hidden !important;
}

.delBtn {
  background-color: #fff !important;
  border: 1px solid rgb(222, 81, 81) !important;
  color: rgb(222, 81, 81) !important;
  &:hover {
    background-color: #de51511a !important;
  }
}
.delAdd {
  margin-left: 10px;
  border: 1px solid #0079fe !important;
  color: #0079fe !important;
  background-color: #fff !important;
  &:hover {
    background-color: #0079fe1a !important;
  }
}
</style>

<style lang="less">
.cat-xzbmedit {
  .el-form {
    .el-form-item__content,
    .el-form-item__label {
      line-height: 28px;
    }
  }
  .marcs__content {
    .content__table_tms,
    .content__table_marc {
      td {
        padding: 0;
        &.disabled {
          background: #f2f2f2 !important;
        }
      }
      .cell {
        padding: 0 !important;
      }
      textarea,
      input {
        font-size: 14px;
        color: #333;
        border-radius: 0;
        border-color: transparent;
        &:focus {
          border-color: #378de6;
        }
      }
      textarea {
        min-height: 31px;
        height: 31px;
        padding: 0 5px;
      }
    }
    tr.selected {
      background: #72c4ff !important;
    }
    .content__table_marc {
      td {
        background: #fff !important;
      }
    }
  }
  .el-icon-question {
    cursor: pointer;
    margin-left: 2px;
    font-size: 16px;

    &:hover {
      color: #0079fe;
    }
  }
}
.iframe__wrapper {
  .content {
    .el-form-item {
      margin-bottom: 12px;
    }
    .el-form-item__label {
      text-indent: 10px;
      position: relative;
      &::before {
        position: absolute;
        left: -10px;
      }
    }
    .el-form-item__content {
      width: 300px;
      .el-select {
        width: 100%;
      }
    }
    .el-scrollbar__wrap {
      overflow-x: hidden;
    }
  }
}
</style>
