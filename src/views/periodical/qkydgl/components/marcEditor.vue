<!--
 * @Description: MARC编辑器
 * @Date: 2020-03-07 09:55:59
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-10 15:37:26
 -->

<template>
  <div
    class="c-editors"
    tabindex="1"
    style="outline: none;"
    ref="marcmsWrapper"
  >
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
      <div class="title">
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
              <el-button type="primary" @click="submitForm('fieldItemForm')"
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
                clearable
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
              <el-button type="primary" @click="submitForm('fieldItemForm')"
                >确定</el-button
              >
              <el-button @click="showSetFiledDialog = false">取消</el-button>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>
    </vue-draggable-resizable>
    <!-- 辅助录入结束 -->
    <div v-show="showMarcDownloadList" class="taolu__layer">
      <el-scrollbar v-loading="loadingMarcDownload">
        <icon-svg
          icon-class="icon-btn-ico-21"
          @click.native="
            showMarcDownloadList = false;
            $refs.marcmsWrapper.focus();
          "
        />
        <p class="shortItem__tip">
          根据【<span>{{ downLoadType }}</span
          >】套录
        </p>
        <div class="shortItem" v-show="marcDownList.length === 0">
          暂无相应记录
        </div>

        <div
          class="shortItem"
          v-for="(item, index) in marcDownList"
          :key="index"
          @click="marcDownloadTrans(item)"
        >
          <el-popover
            popper-class="isnb__popover"
            trigger="hover"
            placement="right-start"
          >
            <div class="triangle">
              <table width="680px" border="0" cellspacing="0">
                <tr
                  v-for="(item, index) in item.fieldList"
                  :key="index"
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
              <p>
                {{ index + 1 }}. 正题名：<span
                  style="font-weight:bold;"
                  :title="item.ztming"
                  >{{ item.ztming }}</span
                >
              </p>
              <p v-show="item.isbn">
                &nbsp;&nbsp;&nbsp;&nbsp;ISBN：<span
                  style="font-weight:bold;"
                  :title="item.isbn"
                  >{{ item.isbn }}</span
                >
              </p>
              <p v-show="item.issn">
                &nbsp;&nbsp;&nbsp;&nbsp;ISSN：<span
                  style="font-weight:bold;"
                  :title="item.issn"
                  >{{ item.issn }}</span
                >
              </p>
            </div>
          </el-popover>
        </div>
      </el-scrollbar>
    </div>
    <div class="header">
      <div class="header__line">
        <div style="marginBottom: 3px;">
          <span class="label" style="padding-left: 10px;">分编类型：</span>
          <el-select
            filterable
            size="mini"
            v-model="fbtype"
            placeholder="请选择"
            @change="getSysMarcConfigMarcTempList(true)"
          >
            <el-option
              v-for="item in fbList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <span class="label" style="marginLeft: 5px;">模板：</span>
          <el-select
            filterable
            size="mini"
            v-model="mbType"
            placeholder="请选择"
            clearable
            @change="changeMbType"
          >
            <el-option
              v-for="item in mbList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div style="marginBottom: 3px;">
          <el-button
            size="mini"
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
          <el-checkbox
            style="margin-left: 5px;"
            storageId="1583546474832"
            v-model="needShowTips"
            @change="setLocalStorageObj('1583546474832', needShowTips)"
            >字段帮助</el-checkbox
          >
        </div>
      </div>
    </div>
    <div
      class="body"
      ref="contentTable"
      v-loading="loadingMarcDownload"
      element-loading-text="正在套录中"
    >
      <el-table
        v-if="showItemTable"
        v-loading="loadTableData"
        ref="itemTable"
        border
        class="content__table_marc"
        :data="itemList"
        @selection-change="handleSelectionChange"
        style="width: 100%"
        height="100%"
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
                v-if="
                  scope.row.field !== '010' &&
                    scope.row.field !== '011' &&
                    scope.row.field !== '200'
                "
                type="textarea"
                autosize
                data-column="4"
                :data-index="scope.$index"
                class="triangle"
                data-type="marcInput"
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
                @dblclick.native="setFieldData(scope.row.field, scope.row)"
              ></el-input>
              <el-input
                v-else
                data-column="4"
                type="textarea"
                autosize
                :data-index="scope.$index"
                class="triangle"
                data-type="marcInput"
                size="mini"
                v-model="scope.row.content"
                @keydown.alt.84.native.exact.stop="
                  marcDownload($event, scope.row.field)
                "
                @keyup.ctrl.enter.native="
                  MonitorFieldEditFormshortCutTag($event, scope.$index)
                "
                @blur="setMarcActiveIndexNull"
                @focus="
                  setMarcActiveIndexActive(scope.$index);
                  getMarcHelp(scope.row.field);
                "
                @dblclick.native="setFieldData(scope.row.field, scope.row)"
              ></el-input>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getMarcFbList, getMarcTemp } from "api/public";

import { myBrowser } from "utils/utils";

import dayjs from "dayjs";

import {
  marcGetMarcTyinfo,
  catMarcDownload,
  catMarcDownloadFieldList
} from "api/catalogue";

import { marcConfigInvFieldLoad, marcConfigInvSubFieldList } from "api/setting";

import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

import { getMarcData } from "utils/utils";

export default {
  components: {
    "vue-draggable-resizable": VueDraggableResizable
  },
  beforeDestroy() {
    window.removeEventListener("beforeunload", this.storageUnSaveData);
    this.storageUnSaveData();
  },
  destroyed() {
    window.removeEventListener("keydown", this.handleIFrameClose);
  },
  mounted() {
    this.frameInitialX = this.$refs.marcmsWrapper.clientWidth;
  },
  async created() {
    window.addEventListener("beforeunload", this.storageUnSaveData);

    window.addEventListener("keydown", this.handleIFrameClose, false);
    this.showItemTable = true;
    if (!this.alreadySetMARCEvent) {
      this.$nextTick(() => {
        this.setMARCEvents();
      });
      this.alreadySetMARCEvent = true;
    }
  },
  data() {
    this.myBrowser = myBrowser;
    this.defaultItemList = JSON.stringify([]);
    this.currentRow = {};
    return {
      frameInitialX: 0,
      needShowTips: this.getLocalStorageObj("1583546474832"),
      showIframeTips: false,
      iframeSrc: "",
      tipsType: "",
      multiSelection: [],
      fbList: [],
      fbtype: "",
      mbList: [],
      mbType: "",
      currentMarcActiveIndex: null,
      loadTableData: false,
      itemList: [],
      showItemTable: false,
      loadingMarcDownload: false,
      downLoadType: "",
      showMarcDownloadList: false,
      marcDownList: [],
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
          marcfbid: this.fbtype
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
    storageUnSaveData() {
      localStorage.setItem("td-marcmsMarcData", JSON.stringify(this.itemList));
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
    getMarcHelp(marcType) {
      if (!this.needShowTips || !marcType) {
        this.hideTips();
        return;
      }
      // prettier-ignore
      let helpsDataArr = ["510","512","513","514","515","516","517","000","001","520","488","005","801","802","010","011","530","410","531","411","532","020","021","660","540","661","541","300","421","422","302","423","303","304","700","305","701","306","702","307","308","430","310","431","311","432","312","433","675","313","434","676","314","435","710","315","436","711","437","712","680","440","320","441","200","321","442","443","444","686","324","720","446","600","205","326","447","601","722","327","448","602","328","604","605","606","607","690","692","330","451","210","452","332","453","454","610","215","461","462","100","101","102","345","620","225","500","105","501","106","503"];
      if (helpsDataArr.includes((marcType + "").padStart(3, 0))) {
        this.showIframeTips = true;
        this.tipsType = marcType;
        this.iframeSrc = `/elib/static/cnmarcHelps/cnmarc${marcType}Help.html`;
        // this.iframeSrc = `http://www.baidu.com`;
      } else {
        this.hideTips();
      }
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
    submitForm(formName) {
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
    },
    // 输入框事件
    setMarcFocus() {
      this.$nextTick(() => {
        let firstInputOuter = this.$refs.itemTable.$el.querySelector("tbody")
          .children;
        if (firstInputOuter[0]) {
          let firstInput = firstInputOuter[0].children[4].querySelector(
            "textarea"
          );
          firstInput.select();
          firstInput.scrollIntoView();
        }
      });
    },
    setMARCEvents() {
      this.$refs.itemTable.$el.addEventListener(
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
          let targetIndex = +target.dataset.index;
          let maxItem = this.itemList.length;
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
          // 额外判断回车符，要避免冲突，
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
          let container = this.$refs.itemTable.$el.querySelector("tbody")
            .children[targetIndex];
          let targetDom = container.children[4].querySelector("textarea");
          setTimeout(() => {
            targetDom.focus();
            targetDom.select();
          }, 100);
        },
        false
      );
    },
    setMarcActiveIndexActive(index) {
      // 这2个方法是为了解决光标在某行时点击删除字段按钮无法获取之前所在行
      if (this.marcActiveTimer) {
        clearTimeout(this.marcActiveTimer);
      }
      this.currentMarcActiveIndex = index;
    },
    setMarcActiveIndexNull() {
      this.$refs.itemTable.doLayout();
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
    // 表单
    updateIndex() {
      this.itemList.forEach((item, index) => {
        item.index = index;
      });
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
    checkMarcDownload(defatulData) {
      let isbn = "",
        issn = "",
        ztming = "";
      this.itemList.forEach(item => {
        if (item.field === "010") {
          isbn = getMarcData(item.content);
        }
        if (item.field === "011") {
          issn = getMarcData(item.content);
        }
        if (item.field === "200") {
          ztming = getMarcData(item.content);
        }
      });
      if (isbn === "" && issn === "" && ztming === "" && !defatulData) {
        this.$message.error("请输入 ISBN 或 ISSN 或 正题名 字段");
        return;
      }
      let requestObj = {};
      if (isbn !== "") {
        requestObj.isbn = isbn;
      } else if (issn !== "") {
        requestObj.issn = issn;
      } else if (ztming !== "") {
        requestObj.ztming = ztming;
      } else if (defatulData.key) {
        requestObj[defatulData.key] = defatulData.value;
      }
      if (requestObj.isbn) {
        this.downLoadType = "ISBN";
      } else if (requestObj.issn) {
        this.downLoadType = "ISSN";
      } else if (requestObj.ztming) {
        this.downLoadType = "正题名";
      }
      this.loadingMarcDownload = true;
      catMarcDownload(requestObj)
        .then(res => {
          this.$nextTick(() => {
            this.showMarcDownloadList = true;
          });
          this.marcDownList = res.data;
        })
        .finally(() => {
          this.loadingMarcDownload = false;
        });
    },
    marcDownload(event, field) {
      if (field === "010" || field === "011" || field === "200") {
        let data = event.target.value;
        let requestObj = {};
        switch (field) {
          case "010":
            requestObj.isbn = getMarcData(data);
            break;
          case "011":
            requestObj.issn = getMarcData(data);
            break;
          case "200":
            requestObj.ztming = getMarcData(data);
            break;
          default:
            break;
        }
        this.loadingMarcDownload = true;
        if (requestObj.isbn) {
          this.downLoadType = "ISBN";
        } else if (requestObj.issn) {
          this.downLoadType = "ISSN";
        } else if (requestObj.ztming) {
          this.downLoadType = "正题名";
        }
        catMarcDownload(requestObj)
          .then(res => {
            this.$nextTick(() => {
              this.showMarcDownloadList = true;
            });
            this.marcDownList = res.data;
          })
          .finally(() => {
            this.loadingMarcDownload = false;
          });
      }
    },
    handleSelectionChange(val) {
      this.multiSelection = val.map(item => item.index);
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
              document.querySelector(".c-marcms").focus();
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
      this.multiSelection.map(selectedIndex => {
        this.itemList.forEach((item, index) => {
          if (item.index === selectedIndex) {
            this.itemList.splice(index, 1);
          }
        });
      });
      this.multiSelection = [];
      this.updateIndex();
    },
    updateItemList(data) {
      this.itemList = data;
    },
    marcDownloadTrans(item) {
      this.loadingMarcDownload = true;
      catMarcDownloadFieldList({
        marcnr: item.marcnr,
        mode: 0
      })
        .then(res => {
          this.itemList = res.data.fieldList.map((item, index) => {
            item = {
              index: index,
              ...item
            };
            return item;
          });
        })
        .finally(() => {
          this.loadingMarcDownload = false;
          this.$refs.marcmsWrapper.focus();
        });
    },
    getSysMarcConfigMarcFbList() {
      getMarcFbList().then(res => {
        this.fbList = res.data
          ? res.data.map(item => {
              return {
                label: item.leixing,
                value: item.marcfbid,
                marcLxId: item.marclxid
              };
            })
          : [];
        this.fbtype = "";
        for (let i = 0; i < this.fbList.length; i++) {
          let item = this.fbList[i].value;
          if (item === this.defaultFbtype) {
            this.fbtype = this.defaultFbtype;
            break;
          }
        }
        this.fbtype = this.fbtype
          ? this.fbtype
          : this.fbList[0]
          ? this.fbList[0].value
          : "";
        let matchItem = this.fbList.filter(item => item.value === this.fbtype);
        this.currentMarcLxId = matchItem[0] ? matchItem[0].marcLxId : "";

        this.getSysMarcConfigMarcTempList();
      });
    },
    getSysMarcConfigMarcTempList(isChange) {
      if (isChange) {
        this.defaultMbtype = "";
      }
      // 切换分编模板重置
      if (!this.fbtype) {
        this.mbList = [];
        this.mbType = "";
        return;
      }

      // 辅助录入需求
      for (let i = 0; i < this.fbList.length; i++) {
        if (this.fbList[i].value === this.fbtype) {
          this.currentMarcLxId = this.fbList[i].marcLxId;
          break;
        }
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
        this.mbType = this.defaultMbtype || "";
      });
    },
    isChangeItemList() {
      return this.defaultItemList !== JSON.stringify(this.itemList);
    },
    changeMbType() {
      this.getMarcTyInfo(false);
    },
    getMarcTyInfo(isInitData) {
      return new Promise((resolve, reject) => {
        // 新增的时候，都没有则不加载数据
        if (!this.mbType && !this.$route.query.marctyid) {
          this.itemList = [];
          this.defaultItemList = JSON.stringify(this.itemList);
          this.defaultItemFbType = this.fbtype;
          this.defaultItemMbType = this.mbType;
          resolve();
          return;
        }
        marcGetMarcTyinfo({
          marcfbid: isInitData ? "" : this.fbtype,
          templateId: isInitData ? "" : this.mbType,
          marctyid: this.$route.query.marctyid
        })
          .then(res => {
            this.defaultFbtype = res.data.marcfbid;
            this.defaultMbtype = res.data.templateId;

            this.marcDownList = [];
            if (isInitData) {
              // 原始数据
              this.itemList = res.data.fieldList.map((item, index) => {
                item = {
                  index: index,
                  ...item
                };
                return item;
              });
              this.defaultItemList = JSON.stringify(this.itemList);
              this.defaultItemFbType = this.defaultFbtype;
              this.defaultItemMbType = this.defaultMbtype;
            } else {
              // 改变模板的时候合并数据，要判断如果已经存在该字段则不要覆盖
              let existItemField = this.itemList.map(item => item.field);
              let resultData = res.data.fieldList.filter(item => {
                return !existItemField.includes(item.field);
              });
              this.itemList.push(...resultData);
              this.itemList
                .sort((a, b) => +a.field - +b.field)
                .forEach((item, index) => {
                  item.index = index;
                });
            }
            this.setMarcFocus();
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
    },
    checkItems() {
      for (let i = 0; i < this.itemList.length; i++) {
        let currentField = this.itemList[i].field;
        let currentContent = this.itemList[i].content;
        let currentIndexOne = this.itemList[i].indexOne;
        let currentIndexTwo = this.itemList[i].indexTwo;
        if (!currentField && currentField !== 0) {
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
            `字段标识 ${currentField} 的字段内容第一位需要以 ${String.fromCharCode(
              31
            )} 开头`
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
        return true;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.c-editors {
  height: ~"calc(100% - 36px)";
  position: relative;
  .header {
    .tips {
      font-size: @FSize_14;
      color: @fontTintColor;
    }
  }
  .body {
    height: ~"calc(100% - 62px)";
  }
  .delBtn {
    background-color: #fff;
    border: 1px solid rgb(222, 81, 81);
    color: rgb(222, 81, 81);
    &:hover {
      background-color: #de51511a;
    }
  }
  .delAdd {
    border: 1px solid #0079fe;
    color: #0079fe;
    background-color: #fff;
    margin-left: 10px;
    &:hover {
      background-color: #0079fe1a;
    }
  }
  .taolu__layer {
    position: absolute;
    font-size: 14px;
    width: 230px;
    right: 20px;
    top: 0;
    padding: 0 0 10px;
    height: 50vh;
    z-index: 3;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    .svg-icon {
      position: absolute;
      top: 7px;
      right: 7px;
      cursor: pointer;
      color: #de5151;
    }
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
    .shortItem__tip {
      line-height: 1;
      color: @fontTintColor;
      padding: 10px 9px;
      span {
        color: red;
      }
    }
    .shortItem {
      color: @fontBaseColor;
      line-height: 1;
      cursor: pointer;
      padding: 10px;
      &:hover {
        background: @hoverBgColor;
        color: @primaryColor;
      }
      p {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 5px;
        &:last-child {
          margin-bottom: 0;
        }
      }
    }
  }
}

.iframe__wrapper {
  z-index: 9 !important;
  border: 1px solid #99bbe8;
  padding: 5px;
  background: transparent url("../../../../assets/panel_title.jpg");
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
</style>

<style lang="less">
.c-editors {
  .body {
    table {
      td {
        padding: 0;
        background: #fff !important;
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
