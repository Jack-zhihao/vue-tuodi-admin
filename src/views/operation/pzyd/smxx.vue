<!--
 * @Description: 批次清单
 * @Version: 4.1
 * @Autor: weijie.liang
 * @Date: 2019-09-11 09:44:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-03 18:57:06
 -->
<template>
  <div class="smxx common__content" id="jjlb" tabindex="1">
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header" style="position:relative">
        <div class="header__line">
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

          <el-button
            type="primary"
            size="mini"
            @click="initLiteratureList"
            :disabled="!literatureSearchKey"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
          <div class="addTao">
            <el-button size="mini" @click="handleAdd"
              ><icon-svg icon-class="icon-btn-ico-" />
              <span>N</span>&nbsp;新增</el-button
            >
            <el-button size="mini" @click="handleTAOLU" :disabled="isTao">
              <span>T</span>&nbsp;套录</el-button
            >
          </div>
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          v-loading="loadLiteratureData"
          border
          :data="literatureList"
          stripe
          style="width: 100%"
          height="100%"
          @row-click="rowclick"
          highlight-current-row
          @current-change="handleCurrentChange"
        >
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="isbn" label="ISBN">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="zrsming" label="责任者">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="site" label="位置">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <!-- 书目信息 -->
    <div class="edit__content" style="marginTop:5px">
      <div class="custom__form_wrapper">
        <div
          class="tit"
          style="borderTop:1px solid #eaeaea;marginTop:0px;padding:10px 0px 0px 10px"
        >
          <span style="fontWeight:700">书目信息</span>
        </div>
        <div class="bottom__template">
          <div>
            <span class="item__name">I S B N</span
            ><span class="item__label">{{ taoFrom.isbn }}</span>
          </div>
          <div>
            <span class="item__name">出版社</span
            ><span class="item__label">{{ taoFrom.cbzhe }}</span>
          </div>
          <div>
            <span class="item__name">正题名</span
            ><span class="item__label">{{ taoFrom.ztming }}</span>
          </div>
          <div>
            <span class="item__name">出版日期</span
            ><span class="item__label">{{ taoFrom.cbrqi }}</span>
          </div>
          <div>
            <span class="item__name">分类号</span
            ><span class="item__label">{{ taoFrom.flhao }}</span>
          </div>
          <div v-if="taoFrom.flm">
            <span class="item__name">分类名</span
            ><span class="item__label">{{ taoFrom.flm }}</span>
          </div>
          <div>
            <span class="item__name">责任者</span
            ><span class="item__label">{{ taoFrom.zrsming }}</span>
          </div>
          <div>
            <span class="item__name">价格</span
            ><span class="item__label">{{ taoFrom.jge }}</span>
          </div>
          <div>
            <span class="item__name">语种</span
            ><span class="item__label">{{ taoFrom.yzhong }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { catalogueDownload } from "api/operation";

export default {
  name: "opera_smxx",
  data() {
    this.literatureFilterOptions = [
      {
        value: "isbn",
        label: "ISBN"
      },
      {
        value: "ztming",
        label: "正题名"
      },
      {
        value: "ftming",
        label: "副题名"
      },
      {
        value: "cbtming",
        label: "丛编题名"
      },
      {
        value: "fjming",
        label: "分辑名"
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
        value: "zrsming",
        label: "责任者"
      },
      {
        value: "flhao",
        label: "分类号"
      },
      {
        value: "cbzhe",
        label: "出版社"
      }
    ];
    return {
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "isbn",
      isTao: true,
      libList: [],
      taoFrom: {
        isbn: "",
        cbzhe: "",
        ztming: "",
        cbrqi: "",
        flhao: "",
        zrsming: "",
        jge: "",
        yzhong: "",
        flm: ""
      },
      // 传参对象
      row: {
        isbn: "",
        publication: "",
        fenlh: "",
        ztm: "",
        author: "",
        date: "",
        price: "",
        language: "",
        fenlm: ""
      },
      rules: {
        bookLibId: [{ required: true, message: "请选择书库", trigger: "blur" }],
        isbn: [{ required: true, message: "请输入ISBN", trigger: "blur" }],

        publication: [
          { required: true, message: "请输入出版社 ", trigger: "blur" }
        ],
        ztm: [{ required: true, message: "请输入正题名 ", trigger: "blur" }],
        author: [{ required: true, message: "请输入责任者 ", trigger: "blur" }]
      }
    };
  },
  computed: {},
  methods: {
    // 文献列表
    initLiteratureList() {
      this.setRequestObj();
      this.getLiteratureList();
    },
    setRequestObj() {
      this.requestObj = {};
      this.requestObj[
        this.currentLiteratureFilterKey
      ] = this.literatureSearchKey;
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        ...this.requestObj,
        isDownLoad: 1,
        isLocal: 1
      };

      catalogueDownload(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data;
        })
        .catch(() => {
          this.loadLiteratureData = false;
        });
    },
    rowclick(row) {
      this.taoFrom = row;
      this.isTao = false;
    },
    // 新增
    handleAdd() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          //跳转到其他页面
          this.$router.push({
            name: "opera_addtao-add"
          });
        });
    },
    handleCurrentChange(val) {
      this.row.date = val.cbrqi;
      this.row.publication = val.cbzhe;
      this.row.fenlh = val.flhao;
      this.row.isbn = val.isbn;
      this.row.price = val.jge;
      this.row.language = val.yzhong;
      this.row.author = val.zrsming;
      this.row.ztm = val.ztming;
    },
    handleTAOLU() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          //跳转到其他页面
          this.$router.push({
            name: "opera_addtao-add",
            query: this.row
          });
        });
    },
    // 快捷键
    tableEvent() {
      if (event.altKey && event.keyCode === 78) {
        // 新增N
        window.event.preventDefault();
        this.handleAdd();
      } else if (event.altKey && event.keyCode === 84 && !this.isTao) {
        //套录T
        window.event.preventDefault();
        this.handleTAOLU();
      }
    }
  },
  activated() {
    document.getElementById("jjlb").focus();
    document
      .getElementById("jjlb")
      .addEventListener("keydown", this.tableEvent, false);
  },
  beforeDestroy() {
    document
      .getElementById("jjlb")
      .removeEventListener("keydown", this.tableEvent);
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.content {
  height: 50% !important;
  padding-bottom: 2px;
  padding-top: 10px;
}
.edit__content {
  height: ~"calc(50% - 10px)" !important;
}
/deep/ .el-form-item__label {
  width: 100px !important;
}
.content__table {
  height: ~"calc(100% - 40px)" !important;
}
.addTao {
  position: absolute;
  right: 15px;
}
.bottom__template {
  width: 100%;
  padding: 15px;
  box-sizing: border-box;
  div {
    display: inline-block;
    width: 33.33%;
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
}
#jjlb {
  outline: none;
}
</style>
