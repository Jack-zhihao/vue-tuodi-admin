<!--
 * @Description: 结算清单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 18:04:55
 -->
<template>
  <div class="jsqd common__content">
    <td-content-header>
      结算清单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleExport"
            ><icon-svg icon-class="icon-daochu" /> 导出</el-button
          >
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">统计范围：</p>
          <el-radio-group v-model="radio" @change="toggleRadio">
            <el-radio label="0">书目</el-radio>
            <el-radio label="1">书册</el-radio>
          </el-radio-group>
        </div>
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectLibId"
            placeholder="请选择"
            @change="toggleLib"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">藏址：</p>
          <el-select
            filterable
            v-model="TibetanSite"
            multiple
            class="multi line"
            collapse-tags
            placeholder="请选择"
            size="mini"
            style="flexBasis:150px"
            @change="selectAll"
          >
            <el-option
              v-for="item in TibetanOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="statusId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in statusSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="currentLiteratureFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in literatureFilterOptions"
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
            v-model="literatureSearchKey"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (literatureSearchKey = val),
                initLiteratureList
              )
            "
            @keydown.enter.native="delayFunc(initLiteratureList)"
            style="flex:auto;max-width:200px"
          ></el-input>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table line2" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadLiteratureData"
          border
          :data="literatureList"
          stripe
          style="width: 100%"
          height="100%"
        >
          <el-table-column
            key="1"
            type="index"
            label=" "
            align="center"
            width="35"
          >
          </el-table-column>
          <el-table-column
            key="2"
            show-overflow-tooltip
            prop="bookName"
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            key="3"
            show-overflow-tooltip
            v-if="radio == 0"
            prop="isbn"
            label="ISBN"
            width="145"
          >
          </el-table-column>
          <el-table-column
            key="3"
            show-overflow-tooltip
            v-if="radio == 1"
            prop="barCode"
            label="条形码"
            width="161"
          >
          </el-table-column>
          <el-table-column
            key="4"
            show-overflow-tooltip
            v-if="radio == 0"
            prop="clsNumber"
            label="分类号"
          ></el-table-column>
          <el-table-column
            key="4"
            show-overflow-tooltip
            v-if="radio == 1"
            prop="callNumber"
            label="索书号"
          ></el-table-column>
          <el-table-column
            key="5"
            show-overflow-tooltip
            prop="ftming"
            label="副题名"
          ></el-table-column>
          <el-table-column
            key="6"
            show-overflow-tooltip
            prop="fjming"
            label="分辑名"
          ></el-table-column>
          <el-table-column
            key="7"
            show-overflow-tooltip
            prop="fjhao"
            label="分辑号"
            width="55"
          ></el-table-column>
          <el-table-column
            key="8"
            show-overflow-tooltip
            prop="press"
            label="出版社"
          >
          </el-table-column>
          <el-table-column
            key="9"
            show-overflow-tooltip
            v-if="radio == 0"
            prop="publicationDate"
            label="出版日期"
            width="70"
          >
          </el-table-column>
          <el-table-column
            key="10"
            show-overflow-tooltip
            prop="author"
            label="责任者"
          >
          </el-table-column>
          <el-table-column
            key="11"
            show-overflow-tooltip
            prop="price"
            label="价格"
            width="87"
          >
          </el-table-column>
          <el-table-column
            key="12"
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          >
          </el-table-column>
          <el-table-column
            key="13"
            show-overflow-tooltip
            v-if="radio == 1"
            prop="bookAddressName"
            label="现藏址"
          >
          </el-table-column>
          <el-table-column
            key="14"
            show-overflow-tooltip
            prop="status"
            label="状态"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" style="justifyContent:space-between">
        <div
          style="marginLeft:20px;font:bolder 16px Microsoft YaHei ;color:#515355"
        >
          未处理：<span>{{ undisposed }}</span> 已处理：<span>{{
            processed
          }}</span>
        </div>
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 导出侧边栏 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">
              导出批次
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('literatureAddForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="literatureAddForm"
          label-width="80px"
          :model="literatureAddForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>批次信息</span>
            </div>
            <el-form-item class="item" prop="batchNo" label="批次">
              <el-select
                filterable
                v-model="literatureAddForm.batchNo"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in batchNoList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button
              size="mini"
              @click="submitForm('literatureAddForm')"
              type="primary"
              >确定</el-button
            >
            <el-button size="mini" @click="cancelForm('literatureAddForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { jsqdList, jsqdExpo, selectBatchList } from "api/operation";
import { userCzList } from "api/public";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";
import { JSQD_OPTIONS } from "utils/selectOptions";

export default {
  name: "opera_pcqd",
  data() {
    this.literatureFilterOptions = JSQD_OPTIONS;
    return {
      radio: "0",
      TibetanSite: [],
      // 多选下拉框储存上一次数据
      oldOptions: [],
      TibetanOptions: [],
      // 批次列表
      batchNoList: [],
      // 多选
      multipleLiteratureSelection: [],
      // 列表相关
      statusSelect: [
        { label: "全部", value: "" },
        { label: "未处理", value: "0" },
        { label: "已处理", value: "1" }
      ],
      statusId: "",
      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "isbn",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 新增
      showAddSide: false,
      literatureAddForm: {
        batchNo: ""
      },
      // 编辑
      showEditSide: false,
      loadLiteratureDetail: false,
      undisposed: "",
      processed: "",
      rules: {
        batchNo: [{ required: true, message: "请选择批次 ", trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    toggleRadio() {
      this.initLiteratureList();
    },
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();
      this.getLiteratureList();

      this.searchCzList();
    },
    // 批次列表
    selectBatchList() {
      selectBatchList({ libId: this.selectLibId }).then(res => {
        let batchArr = [];
        res.data.forEach(item => {
          let batchObj = {
            label: item.batchNo,
            value: item.batchId
          };
          batchArr.push(batchObj);
        });
        this.batchNoList = batchArr;
      });
    },
    // 切换馆
    toggleLib() {
      this.initLiteratureList();
    },
    // 藏址选项事件
    selectAll(val) {
      // 定义一个空数组，装所有选项的value
      let allValues = [];
      //保留所有值
      for (let item of this.TibetanOptions) {
        allValues.push(item.value);
      }

      // 用来储存上一次的值，可以进行对比
      const oldVal = this.oldOptions.length === 0 ? [] : this.oldOptions;

      // 若是包含了全部，则所有选择都勾上
      if (val.includes("")) {
        this.TibetanSite = allValues;
      }

      // 取消全部选项，  上次oldVal有 当前val没有,所以进入条件  表示取消全选
      if (oldVal.includes("") && !val.includes("")) {
        this.TibetanSite = [];
      }

      // 点击非全部选项  需要取消勾选全部 以及 当前点击的选项
      // 新老数据都有全部选中
      if (oldVal.includes("") && val.includes("")) {
        const index = val.indexOf("");
        val.splice(index, 1); // 排除全选选项
        this.TibetanSite = val;
      }

      //全选未选 但是其他选项全部选上 则全选选上 上次和当前 都没有全选
      if (!oldVal.includes("") && !val.includes("")) {
        if (val.length === allValues.length - 1)
          this.TibetanSite = [""].concat(val);
      }

      // //储存当前最后的结果 作为下次的老数据
      this.oldOptions = this.TibetanSite;
    },
    // 查询藏址
    searchCzList() {
      let params = {
        libId: this.selectLibId
      };
      userCzList(params).then(res => {
        this.TibetanOptions = res.data.map(item => {
          return {
            label: item.mingcheng,
            value: item.czid
          };
        });
        this.TibetanOptions.unshift({
          label: "全部",
          value: ""
        });
      });
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick() {
      this.showAddSide = true;
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId,
        scope: this.radio,
        czIds: this.TibetanSite.join(),
        status: this.statusId
      };
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj
      };

      jsqdList(requestObj)
        .then(res => {
          this.loadLiteratureData = false;
          // 如果藏址存在
          res.data.page.dataList.forEach(item => {
            item.status = item.status == 0 ? "未处理" : "已处理";
          });
          this.literatureList = res.data.page.dataList;
          this.totalLiteratureCount = Number(res.data.page.totalElements);
          this.undisposed = res.data.undisposed;
          this.processed = res.data.processed;
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    handleLiteratureSizeChange(val) {
      this.literaturePageSize = val;
      this.getLiteratureList();
    },
    handleLiteratureCurrentChange(val) {
      this.currentLiteraturePage = val;
      this.getLiteratureList();
    },
    // 确定导出数据接口
    handleLiteratureFormAdd() {
      downLoadExcel(jsqdExpo(), {
        scope: this.radio,
        libId: this.selectLibId,
        czIds: this.TibetanSite.join(),
        batchId: this.literatureAddForm.batchNo,
        status: this.statusId,
        ...this.requestObj
      });
      setTimeout(() => {
        this.initLiteratureList();
      }, 500);
    },
    // 取消导出
    cancelForm(formName) {
      if (formName === "literatureAddForm") {
        this.showAddSide = false;
        this.$refs["literatureAddForm"].resetFields();
      }
    },
    // 导出按钮确定
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "literatureAddForm") {
            this.setRequestObj();
            this.handleLiteratureFormAdd();
            this.showAddSide = false;
            this.literatureAddForm.batchNo = "";
          }
        } else {
          return false;
        }
      });
    },
    // 点击导出
    handleExport() {
      this.showAddSide = true;
      this.selectBatchList();
    }
  },
  activated() {
    this.initLiteratureList();
  },
  mounted() {
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
.edit__footer {
  justify-content: flex-end !important;
}
</style>
