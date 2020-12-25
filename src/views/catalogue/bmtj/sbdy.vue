<template>
  <div class="cat_sbdy common__content">
    <!--读者借阅查询-->
    <td-content-header>
      <span>书标打印</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showPrint">
            <icon-svg icon-class="icon-dayin" />打印
          </el-button>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            @change="initParamList"
            v-model="libid"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <p class="label">索书号：</p>
          <el-input
            clearable
            placeholder="请输入索书号"
            size="mini"
            ref="sshaoInput"
            v-model="sshao"
          ></el-input>
          <p class="label">入库时间：</p>
          <el-date-picker
            size="mini"
            v-model="date1"
            value-format="yyyy-MM-dd HH:mm:ss"
            style="marginRight: 3px;"
            type="datetime"
            placeholder="开始时间"
            :picker-options="startDatePicker"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="date2"
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="结束时间"
            :picker-options="endDatePicker"
          ></el-date-picker>
          <el-button type="primary" size="mini" @click="initLabelPrintList">
            <icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
        <div class="header__line">
          <p class="label">条形码开始：</p>
          <el-input
            clearable
            placeholder="请输入起始条形码"
            size="mini"
            v-model="bookBarCodeStart"
          ></el-input>
          <p class="label">条形码结束：</p>
          <el-input
            clearable
            placeholder="请输入结束条形码"
            size="mini"
            v-model="bookBarCodeEnd"
          ></el-input>
          <p class="label">操作员：</p>
          <el-select
            filterable
            size="mini"
            v-model="userId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userIdList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div class="content__table line2" ref="literatureTable">
        <el-table
          v-loading="loadLabelPrintData"
          @selection-change="handleSelectionChange"
          @row-click="clickRow"
          ref="sbdyTable"
          border
          :data="LabelPrintList"
          stripe
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
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            prop="isbn"
            label="ISBN"
            width="145"
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
            prop="tiaoma"
            label="条形码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="sshao"
            label="索书号"
          ></el-table-column>
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
    </div>
    <!-- 书标打印 -->
    <el-dialog
      custom-class="sbdy__print_dialog"
      :modal-append-to-body="false"
      :visible.sync="showSBPrintDialog"
    >
      <div slot="title" class="dialog-header">
        <p class="title">书标参数设置</p>
        <p class="params">
          <span v-show="libid">{{ getLibNameById(libid) }}；</span>
          <span v-show="sshao">{{ sshao }}；</span>
          <span v-show="date1 || date2"
            >{{ date1 || "-" }} 至 {{ date2 || "-" }}；</span
          >
          <span v-show="bookBarCodeStart || bookBarCodeEnd"
            >{{ bookBarCodeStart || "-" }} 至
            {{ bookBarCodeEnd || "-" }}；</span
          >
          <span v-show="userId">{{ getUserNameById(userId) }}</span>
        </p>
      </div>
      <el-scrollbar>
        <div class="header">
          <div class="line">
            <span class="label">当前格式：</span>
            <el-select
              filterable
              size="mini"
              @change="changePrintTemp"
              v-model="printTempId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in printTempList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>

          <div class="line">
            <span class="label">新建格式：</span>
            <el-input
              ref="pritTmepName"
              clearable
              size="mini"
              v-model="printTempName"
            ></el-input>
            <el-button size="mini" @click="createPrintTemp">新建</el-button>
          </div>
          <div class="line" style="flex:1;justify-content: flex-end;">
            <el-button
              size="mini"
              type="primary"
              @click="handldeShowBQPrintDialog"
              >补缺打印</el-button
            >
          </div>
        </div>
        <hr />
        <p style="line-height: 30px;">打印布局设置（单位：mm）</p>
        <el-form
          class="print__form"
          ref="marctempFieldEditForm"
          v-loading="loadPrintFormData"
          label-width="60px"
          size="mini"
          :model="printTempForm"
          :rules="printTempFormRules"
        >
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">纸张</p>
            <el-form-item class="item" prop="zzkuandu" label="宽度">
              <el-input v-model="printTempForm.zzkuandu"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zzchangdu" label="高度">
              <el-input v-model="printTempForm.zzchangdu"></el-input>
            </el-form-item>
            <el-form-item
              class="item multi"
              label-width="80px"
              prop="ldqfs"
              label="适配打印机纸张"
            >
              <el-select filterable v-model="printTempForm.paperType">
                <el-option
                  v-for="item in paperTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">书标区域</p>
            <el-form-item class="item" prop="ybjshang" label="上边距">
              <el-input v-model="printTempForm.ybjshang"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ybjxia" label="下边距">
              <el-input v-model="printTempForm.ybjxia"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ybjzuo" label="左边距">
              <el-input v-model="printTempForm.ybjzuo"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ybjyou" label="右边距">
              <el-input v-model="printTempForm.ybjyou"></el-input>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">书标大小</p>
            <el-form-item class="item" prop="sbkuandu" label="宽度">
              <el-input v-model="printTempForm.sbkuandu"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sbchangdu" label="高度">
              <el-input v-model="printTempForm.sbchangdu"></el-input>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">书标排版</p>
            <el-form-item class="item" prop="hangshu" label="行数">
              <el-input v-model="printTempForm.hangshu"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="lieshu" label="列数">
              <el-input v-model="printTempForm.lieshu"></el-input>
            </el-form-item>
            <el-form-item class="item multi" prop="mdsbgs" label="添加空书标数">
              <el-input v-model="printTempForm.mdsbgs"></el-input>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = true">
            <p class="form__part">行间距</p>
            <el-form-item class="item" prop="hjianjuTop" label="上间距">
              <el-input v-model="printTempForm.hjianjuTop"></el-input>
            </el-form-item>
            <el-checkbox
              style="margin-left:3px;margin-right:26px;"
              v-model="printTempForm.noHaveFirstRowTopSpace"
              >去除首行上间距</el-checkbox
            >
            <el-form-item
              class="item"
              style="margin-left: 30px;"
              prop="hjianjuBottom"
              label="下间距"
            >
              <el-input v-model="printTempForm.hjianjuBottom"></el-input>
            </el-form-item>
            <el-checkbox
              style="margin-left:3px;"
              v-model="printTempForm.noHaveEndRowBottonSpace"
              >去除尾行下间距</el-checkbox
            >
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = true">
            <p class="form__part">列间距</p>
            <el-form-item class="item" prop="ljianjuLeft" label="左间距">
              <el-input v-model="printTempForm.ljianjuLeft"></el-input>
            </el-form-item>
            <el-checkbox
              style="margin-left:3px;margin-right:26px;"
              v-model="printTempForm.noHaveFirstLineLeftSpace"
              >去除首列左间距</el-checkbox
            >
            <el-form-item
              class="item"
              style="margin-left: 30px;"
              prop="ljianjuRight"
              label="右间距"
            >
              <el-input v-model="printTempForm.ljianjuRight"></el-input>
            </el-form-item>
            <el-checkbox
              style="margin-left:3px;"
              v-model="printTempForm.noHaveEndLineRightSpace"
              >去除首列右间距</el-checkbox
            >
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">书标内容</p>
            <el-form-item class="item" prop="sbzuo" label="左边距">
              <el-input v-model="printTempForm.sbzuo"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sbyou" label="右边距">
              <el-input v-model="printTempForm.sbyou"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sbshang" label="上边距">
              <el-input v-model="printTempForm.sbshang"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="sbxia" label="下边距">
              <el-input v-model="printTempForm.sbxia"></el-input>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">内容排列</p>
            <el-form-item class="item" prop="ldqfs" label="垂直">
              <el-select filterable v-model="printTempForm.ldqfs">
                <el-option
                  v-for="item in verticalTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="dqfs" label="水平">
              <el-select filterable v-model="printTempForm.dqfs">
                <el-option
                  v-for="item in alignTypes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item multi" prop="zfhjj" label="字符行间距">
              <el-input v-model="printTempForm.zfhjj"></el-input>
            </el-form-item>
          </div>
          <div class="line" @mouseenter="showSbdyImg2 = false">
            <p class="form__part">其它</p>
            <el-form-item class="item" prop="fontsize" label="字号">
              <el-select filterable v-model="printTempForm.fontsize">
                <el-option
                  v-for="item in fontSizes"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-checkbox style="margin-left:3px;" v-model="printTempForm.dyms"
              >打印卷册描述</el-checkbox
            >
          </div>
        </el-form>
      </el-scrollbar>
      <div class="print__img">
        <img v-if="showSbdyImg2" src="../../../assets/sbdy2.png" alt="" />
        <img v-else src="../../../assets/sbdy1.png" alt="" />
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button
            :loading="loadPreview"
            size="mini"
            type="primary"
            @click="previewSBPDF"
            >预览</el-button
          >
          <el-button size="mini">设为默认模板</el-button>
        </div>
        <div>
          <el-button type="primary" size="mini" @click="editPrintTemp"
            >更新参数</el-button
          >
          <el-button size="mini" @click="deletePrintTemp">删除</el-button>
        </div>
      </span>
    </el-dialog>
    <!-- 补缺打印 -->
    <el-dialog
      title="补缺打印"
      custom-class="bqdy__print_dialog"
      :visible.sync="showBQPrintDialog"
    >
      <div class="line">
        <span>请选择文件</span>
        <el-tooltip
          class="item"
          content="只支持 .txt 文件格式，多个书标用回车分隔"
          placement="top-start"
        >
          <el-upload
            class="dialog__upload"
            ref="fileUpload"
            action=""
            accept=".txt"
            :http-request="uploadFile"
            :on-change="handleFileChange"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="mini" type="primary"
              >选择文件</el-button
            >
          </el-upload>
        </el-tooltip>

        <el-button
          size="mini"
          type="primary"
          @click="handleFileUpload"
          :loading="uploadingFileData"
          >添加</el-button
        >
      </div>
      <div class="line">
        <span>书目条形码：</span>
        <el-input
          size="mini"
          clearable
          ref="bqBarCode"
          @keydown.enter.native="inputBarcode"
          v-model="singleBarcode"
        ></el-input>
        <el-button size="mini" type="primary" @click="inputBarcode"
          >添加</el-button
        >
      </div>
      <el-table
        @selection-change="handleBqSelectionChange"
        :data="barcodeList"
        border
        height="calc(100% - 80px)"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="code" label="将要打印的书目条形码">
        </el-table-column>
      </el-table>
      <p style="margin-top: 5px;">共{{ barcodeList.length }}条数据</p>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-button
            size="mini"
            :loading="loadBqPreview"
            type="primary"
            @click="previewBqPDF"
            >预览</el-button
          >
        </div>
        <div>
          <el-button size="mini" @click="deleteBqSelected">删除选定</el-button>
          <el-button size="mini" @click="deleteBqAll">全部删除</el-button>
        </div>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  catlabelPrint,
  labelPrintMakePdf,
  labelFileAdd,
  checkBarcode,
  labelPrintFind,
  labelPrintDel,
  labelPrintSave
} from "api/catalogue";

import { userCzList, userList } from "api/public";
import { mapGetters } from "vuex";

let fontSizes = [];
for (let index = 6; index <= 21; index++) {
  fontSizes.push({
    label: index,
    value: index
  });
}

let verticalTypes = [
  {
    value: 0,
    label: "顶端对齐"
  },
  {
    value: 1,
    label: "垂直居中"
  },
  {
    value: 2,
    label: "底端对齐"
  }
];

let alignTypes = [
  {
    value: 1,
    label: "水平居中"
  },
  {
    value: 0,
    label: "左对齐"
  },
  {
    value: 2,
    label: "右对齐"
  }
];

export default {
  name: "cat_sbdy",
  data() {
    this.paperTypeOptions = [
      {
        value: "A4",
        label: "A4纸"
      },
      {
        value: "",
        label: "自定义"
      }
    ];
    this.startDatePicker = {
      disabledDate: time => {
        if (this.date2) {
          return (
            // 如果结束时间已经选择

            time.getTime() > new Date(this.date2)
          );
        }
      }
    };

    this.endDatePicker = {
      disabledDate: time => {
        if (this.date1) {
          return time.getTime() < new Date(this.date1);
        }
      }
    };
    return {
      showSbdyImg2: false,
      // 列表相关
      libid: this.$store.getters.userInfo.libId,
      date1: "",
      date2: "",
      sshao: "",
      czid: "",
      bookBarCodeStart: "",
      bookBarCodeEnd: "",
      userId: "",
      userIdList: [],
      userCzList: [],
      multipleSelection: [],
      loadLabelPrintData: false,
      LabelPrintList: [],
      pageSize: 15,
      currentPage: 1,
      totalCount: 0,
      requestObj: {},
      // 书标打印
      showSBPrintDialog: false,
      printTempId: "",
      printTempList: [],
      printTempName: "",
      loadPreview: false,
      loadPrintFormData: false,
      printTempForm: {
        fontsize: 12,
        hangshu: 0,
        lieshu: 0,
        dqfs: 1,
        ldqfs: 1,
        hjianjuTop: 0,
        hjianjuBottom: 0,
        ljianjuLeft: 0,
        ljianjuRight: 0,
        zzkuandu: 0,
        zzchangdu: 0,
        ybjzuo: 0,
        ybjyou: 0,
        ybjshang: 0,
        ybjxia: 0,
        zfhjj: 0,
        mdsbgs: 0,
        sbkuandu: 0,
        sbchangdu: 0,
        sbzuo: 0,
        sbyou: 0,
        sbshang: 0,
        sbxia: 0,
        dyms: false,
        noHaveFirstRowTopSpace: true,
        noHaveEndRowBottonSpace: true,
        noHaveFirstLineLeftSpace: true,
        noHaveEndLineRightSpace: true,
        paperType: "A4"
      },
      printTempFormRules: {},
      fontSizes: fontSizes,
      alignTypes: alignTypes,
      verticalTypes: verticalTypes,
      // 补缺打印
      uploadingFileData: false,
      singleBarcode: "",
      showBQPrintDialog: false,
      barcodeList: [],
      bqMultiSelection: [],
      loadBqPreview: false
    };
  },
  computed: {
    ...mapGetters(["libListSelect"])
  },
  methods: {
    getLibNameById(id) {
      for (let i = 0; i < this.libListSelect.length; i++) {
        if (this.libListSelect[i].value === id) {
          return this.libListSelect[i].label;
        }
      }
    },
    getUserNameById(id) {
      for (let i = 0; i < this.userIdList.length; i++) {
        if (this.userIdList[i].value === id) {
          return this.userIdList[i].label;
        }
      }
    },
    initLabelPrintList() {
      for (let key in this.requestObj) {
        this.requestObj[key] = "";
      }
      this.getLabelPrintList();
      this.currentPage = 1;
    },

    initParamList() {
      this.getUserCzList();
      this.getUserList();
    },
    // 获取操作员列表
    getUserList() {
      userList({
        libid: this.libid
      }).then(res => {
        this.userId = "";
        this.userIdList = res.data.map(item => {
          return {
            label: item.username,
            value: item.userId
          };
        });
        this.userIdList.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 点击当前行
    clickRow(row) {
      this.$refs.sbdyTable.toggleRowSelection(row);
    },
    getLabelPrintList() {
      this.requestObj = {
        libId: this.libid,
        userId: this.userId,
        optimeStart: this.date1,
        optimeEnd: this.date2,
        pageNumber: this.currentPage,
        pageSize: this.pageSize,
        sshao: this.sshao,
        bookBarCodeStart: this.bookBarCodeStart,
        bookBarCodeEnd: this.bookBarCodeEnd
      };
      if (
        this.requestObj.bookBarCodeStart.replace(/^\s+|\s+$/g, "").length !==
        this.requestObj.bookBarCodeEnd.replace(/^\s+|\s+$/g, "").length
      ) {
        this.$message.error("条形码开始和结束的长度必须一致");
        return;
      }
      this.loadLabelPrintData = true;
      catlabelPrint(this.requestObj)
        .then(res => {
          this.loadLabelPrintData = false;
          this.LabelPrintList = res.data.dataList;
          this.totalCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadLabelPrintData = false));
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.getLabelPrintList();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getLabelPrintList();
    },
    getUserCzList() {
      this.czid = "";
      userCzList({
        libId: this.libid || this.$store.getters.userInfo.libId
      }).then(res => {
        res.data.unshift({
          mingcheng: "全部",
          czid: ""
        });
        this.userCzList = [...res.data];
      });
    },
    // 书标打印
    getLabelPrintTempList() {
      labelPrintFind({
        libid: this.libid
      }).then(res => {
        this.printTempList = res.data.map(item => {
          if (!this.printTempObj) {
            this.printTempObj = {};
          }
          this.printTempObj[item.mbid] = Object.assign({}, item);
          return {
            label: item.daima,
            value: item.mbid
          };
        });
        this.printTempId = this.printTempList[0]
          ? this.printTempList[0].value
          : "";
        if (this.printTempId) {
          let dataForm = this.printTempObj[this.printTempId];
          Object.keys(this.printTempForm).forEach(key => {
            this.printTempForm[key] = dataForm[key];
          });
        }
      });
    },
    changePrintTemp() {
      let dataForm = this.printTempObj[this.printTempId];
      Object.keys(this.printTempForm).forEach(key => {
        this.printTempForm[key] = dataForm[key];
      });
    },
    createPrintTemp() {
      if (this.printTempName === "") {
        this.$message.warning("模板名字不能为空");
        this.$refs.pritTmepName.focus();
        return;
      }
      labelPrintSave({
        daima: this.printTempName,
        ...this.printTempForm
      }).then(res => {
        this.$message.success(res.message);
        this.getLabelPrintTempList();
        this.printTempName = "";
      });
    },
    editPrintTemp() {
      if (!this.printTempId) {
        this.$message("请选择要更新的模板");
        return;
      }
      labelPrintSave({
        mbid: this.printTempId,
        daima: this.printTempObj[this.printTempId].daima,
        ...this.printTempForm
      }).then(res => {
        this.$message.success(res.message);
        this.getLabelPrintTempList();
      });
    },
    deletePrintTemp() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          labelPrintDel({
            mbids: this.printTempId,
            ...this.printTempForm
          }).then(res => {
            this.$message.success(res.message);
            this.getLabelPrintTempList();
          });
        })
        .catch(() => {});
    },
    showPrint() {
      this.showSBPrintDialog = true;
      this.showSbdyImg2 = false;
    },
    transformFloatNum(obj) {
      let floatKeys = [
        "zzkuandu",
        "zzchangdu",
        "ybjshang",
        "ybjxia",
        "ybjzuo",
        "ybjzuo",
        "sbkuandu",
        "sbchangdu",
        "hjianjuTop",
        "hjianjuBottom",
        "ljianjuLeft",
        "ljianjuRight",
        "sbzuo",
        "sbyou",
        "sbshang",
        "sbxia",
        "zfhjj"
      ];
      Object.keys(obj).forEach(key => {
        if (floatKeys.includes(key) && obj[key] !== "") {
          obj[key] = obj[key].toFixed(2);
        }
      });
      return obj;
    },
    previewSBPDF() {
      let formObj = Object.assign({}, this.printTempForm);
      let requestObj = {
        isOtherAdd: false,
        barcodes: "",
        ...this.requestObj,
        ...this.transformFloatNum(formObj)
      };
      this.loadPreview = true;
      labelPrintMakePdf(requestObj)
        .then(res => {
          window.open(`${location.origin}/service${res.data.labelPath}`);
        })
        .finally(() => {
          this.loadPreview = false;
        });
    },
    // 补缺打印
    handldeShowBQPrintDialog() {
      this.showBQPrintDialog = true;
      this.$nextTick(() => {
        this.singleBarcode = "";
        // this.barcodeList = [];
        this.$refs["fileUpload"].clearFiles();
      });
    },
    inputBarcode() {
      if (this.singleBarcode === "") {
        this.$message.warning("请输入要打印的书标");
        return;
      }
      checkBarcode({
        barcode: this.singleBarcode
      })
        .then(res => {
          this.barcodeList.push({
            code: res.data.barcode
          });
        })
        .finally(() => {
          this.$refs.bqBarCode.select();
        });
    },
    handleFileUpload() {
      this.$refs["fileUpload"].submit();
    },
    uploadFile(params) {
      this.uploadingFileData = true;
      let formData = new FormData();

      formData.append("file", params.file);
      labelFileAdd(formData)
        .then(res => {
          this.$message(res.message);
          res.data.forEach(item => {
            this.barcodeList.push({
              code: item
            });
          });
        })
        .finally(() => {
          this.uploadingFileData = false;
          this.removeFile();
        });
    },
    previewBqPDF() {
      let barcodesArr = this.barcodeList.map(item => item.code);
      let formObj = Object.assign({}, this.printTempForm);
      let requestObj = {
        isOtherAdd: true,
        barcodes: barcodesArr.join(","),
        ...this.transformFloatNum(formObj)
      };
      this.loadBqPreview = true;
      labelPrintMakePdf(requestObj)
        .then(res => {
          window.open(`${location.origin}/service${res.data.labelPath}`);
        })
        .finally(() => {
          this.loadBqPreview = false;
        });
    },
    removeFile() {
      this.$refs["fileUpload"].clearFiles();
    },
    handleBqSelectionChange(val) {
      this.bqMultiSelection = val.map(item => item.code);
    },
    handleFileChange(files, fileList) {
      if (fileList.length > 1) {
        fileList.splice(0, 1);
      }
    },
    deleteBqSelected() {
      this.barcodeList = this.barcodeList.filter(
        item => !this.bqMultiSelection.includes(item.code)
      );

      this.bqMultiSelection = [];
    },
    deleteBqAll() {
      this.barcodeList = [];
    }
  },
  mounted() {
    this.initParamList();
    this.getLabelPrintTempList();
    this.$refs.sshaoInput.focus();
  },
  activated() {
    this.$nextTick(() => {
      this.$refs.sshaoInput.focus();
    });
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>

.<style lang="less">
.sbdy__print_dialog {
  width: 680px;
  margin-left: calc((100vw - 680px - 440px) / 2);
  .header {
    display: flex;
    margin-bottom: 5px;
    .line {
      display: flex;
      align-items: center;
      .label {
        white-space: nowrap;
      }
      .el-input,
      .el-select {
        flex: 0 0 150px !important;
      }
      .el-button {
        margin-left: 10px;
      }
    }
  }
  .el-dialog__header {
    height: 64px;
    box-sizing: border-box;
    .dialog-header {
      .title {
        font-size: 0.16rem;
        font-weight: bold;
        color: #373839;
      }
      .params {
        color: #8f8f8f;
        margin-top: 2px;
        font-size: 14px;
      }
    }
  }
  .el-dialog__body {
    padding: 10px 20px;
    height: 50vh;
    .el-scrollbar__wrap {
      overflow-x: hidden !important;
    }
  }
  .print__img {
    position: absolute;
    left: 100%;
    top: 0;
    bottom: 0;
    width: 440px;
    background: #e9e9e9;
    img {
      max-width: 100%;
      max-height: 100%;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      margin: auto;
    }
  }
  .print__form {
    .line {
      line-height: 42px;
      &:nth-child(2n) {
        background: #eef1f3;
      }
      &:nth-child(2n + 1) {
        background: #fafbfc;
      }
    }
    .form__part {
      display: inline-block;
      font-weight: bold;
      width: 80px;
      font-size: 16px;
      text-indent: 5px;
    }
    .item {
      display: inline-block;
      margin-bottom: 0px;
      .el-input {
        width: 50px;
      }
      .el-select {
        .el-input {
          width: 82px;
        }
      }

      &.multi {
        .el-form-item__label {
          line-height: 1.2;
        }
      }
    }

    .el-input--small .el-input__inner {
      padding: 2px;
    }
    .el-input__suffix {
      padding: 2px;
    }
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
}
.bqdy__print_dialog {
  .line {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    .el-input {
      flex: 0 0 150px;
    }
    .el-button {
      margin-left: 5px;
    }
  }
  .dialog__upload {
    display: flex;
    align-items: center;
  }
  .dialog-footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>
