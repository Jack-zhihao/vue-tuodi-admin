<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 15:14:18
 -->
<template>
  <div class="per_zdys_collection common__content">
    <td-content-header>
      <span>馆藏信息</span>
      <label>索书号：</label>
      <el-input
        size="mini"
        style="width:180px"
        @keyup.enter.native="multireelCheck"
        v-model="sshao"
      ></el-input>
      <div class="el-button__group">
        <el-button
          type="primary"
          size="mini"
          :loading="loadMultireel"
          @click="multireelCheck"
          >多卷查重</el-button
        >
        <el-button type="primary" size="mini" @click="checkZchao"
          >种次号查缺</el-button
        >
      </div>
      <div class="el-checkbox__group">
        <el-checkbox v-model="isCheck">种次号自动查缺</el-checkbox>
        <el-checkbox v-model="jytxma">记忆条形码</el-checkbox>
      </div>
    </td-content-header>
    <div class="content">
      <div class="content_pane">
        <div class="book__info">
          <el-form
            class="custom__form"
            ref="form"
            label-width="90px"
            :model="form"
            :rules="formRules"
          >
            <div class="form__type">
              <el-form-item class="item temp__item" prop="cejia" label="册价">
                <el-input
                  clearable
                  @change="templateFormChange('cejia', $event)"
                  size="small"
                  v-only-num.float="form.cejia"
                  v-model="form.cejia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item temp__item" prop="taojia" label="套价">
                <el-input
                  clearable
                  @change="templateFormChange('taojia', $event)"
                  size="small"
                  v-only-num.float="form.taojia"
                  v-model="form.taojia"
                ></el-input>
              </el-form-item>
              <el-form-item class="item temp__item" prop="ztai" label="状态">
                <el-select
                  filterable
                  size="small"
                  disabled
                  v-model="form.ztai"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in ztOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item temp__item" prop="czid" label="藏址">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('czid', $event)"
                  v-model="form.czid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in czOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="ltlxid"
                label="流通类型"
              >
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('ltlxid', $event)"
                  v-model="form.ltlxid"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in flowTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item temp__item" prop="gysid" label="供应商">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('gysid', $event)"
                  v-model="form.gysid"
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
              <el-form-item
                class="item temp__item"
                prop="zdlx"
                label="装订方式"
              >
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('zdlx', $event)"
                  v-model="form.zdlx"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in zdfsOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item temp__item" prop="ysid" label="预算">
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('ysid', $event)"
                  v-model="form.ysid"
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
              <el-form-item
                class="item temp__item"
                prop="jzleixing"
                label="介质类型"
              >
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('jzleixing', $event)"
                  v-model="form.jzleixing"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in jzlxOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="wxlyuan"
                label="文献来源"
              >
                <el-select
                  filterable
                  size="small"
                  @change="templateFormChange('wxlyuan', $event)"
                  v-model="form.wxlyuan"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in wxlyOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item class="item temp__item" prop="pihao" label="批号">
                <el-input
                  clearable
                  @change="templateFormChange('pihao', $event)"
                  size="small"
                  v-model="form.pihao"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="zdjg"
                label="装订价格"
              >
                <el-input
                  clearable
                  size="small"
                  @change="templateFormChange('zdjg', $event)"
                  v-only-num.float="form.zdjg"
                  v-model="form.zdjg"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="zdfs"
                label="装订总份数"
              >
                <el-input
                  clearable
                  size="small"
                  disabled
                  v-only-num="form.zdfs"
                  v-model="form.zdfs"
                ></el-input>
              </el-form-item>
              <el-form-item class="item temp__item" prop="beizhu" label="备注">
                <el-input
                  clearable
                  @change="templateFormChange('beizhu', $event)"
                  size="small"
                  v-model="form.beizhu"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="jcsm"
                label="卷册说明"
              >
                <el-input
                  clearable
                  size="small"
                  disabled
                  v-model="form.jcsm"
                ></el-input>
              </el-form-item>
              <el-form-item
                class="item temp__item"
                prop="bookNum"
                label="复本数"
              >
                <el-tooltip
                  class="item"
                  effect="dark"
                  :content="`复本数最多不能超过未到册数( ${form.wdcs} 册)`"
                  placement="top-start"
                >
                  <el-input
                    ref="focusInput"
                    clearable
                    size="small"
                    @keyup.enter.native="cloneFormData"
                    @blur="cloneFormData"
                    v-only-num="form.bookNum"
                    v-model="form.bookNum"
                  ></el-input>
                </el-tooltip>
              </el-form-item>
              <el-form-item class="item temp__item" prop label="">
                <el-checkbox v-model="memory" @change="cloneFormData"
                  >记忆复本数</el-checkbox
                >
              </el-form-item>
            </div>
          </el-form>
        </div>
        <div class="bottom__item">
          <div class="item__head">
            <table cellspacing="0" cellpadding="0">
              <thead>
                <tr>
                  <th width="6%">序号</th>
                  <th width="8%">条形码</th>
                  <th width="6%">册价</th>
                  <th width="6%">套价</th>
                  <th width="6%">状态</th>
                  <th width="10%">藏址</th>
                  <th width="6%">流通类型</th>
                  <th width="6%">供应商</th>
                  <th width="6%">装订</th>
                  <th width="4%">预算</th>
                  <th width="4%">介质类型</th>
                  <th width="4%">文献来源</th>
                  <th width="10%">卷册描述</th>
                  <th width="14%">备注</th>
                  <th width="4%">操作</th>
                </tr>
              </thead>
            </table>
          </div>
          <div class="item__content">
            <el-scrollbar>
              <table cellspacing="0" cellpadding="0">
                <tbody>
                  <tr v-for="(item, index) in tableData" :key="index">
                    <td width="6%">{{ index + 1 }}</td>
                    <td width="8%">
                      <input type="text" v-model="item.tiaoma" />
                    </td>
                    <td width="6%">
                      <input type="text" v-model="item.cejia" />
                    </td>
                    <td width="6%">
                      <input type="text" v-model="item.taojia" />
                    </td>
                    <td width="6%">
                      <select v-model="item.ztai" disabled>
                        <option
                          v-for="option in ztOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="10%">
                      <select v-model="item.czid">
                        <option
                          v-for="option in czOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.ltlxid">
                        <option
                          v-for="option in flowTypeOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.gysid">
                        <option
                          v-for="option in gysOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="6%">
                      <select v-model="item.zdlx">
                        <option
                          v-for="option in zdfsOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.ysid">
                        <option
                          v-for="option in ysOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.jzleixing">
                        <option
                          v-for="option in jzlxOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
                      </select>
                    </td>
                    <td width="4%">
                      <select v-model="item.wxlyuan">
                        <option
                          v-for="option in wxlyOptions"
                          :key="option.value"
                          v-bind:value="option.value"
                          >{{ option.label }}</option
                        >
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
                        style="color: #de5151;"
                        icon-class="icon-btn-ico-21"
                        @click.native="delteShuceItem(index)"
                      />
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-scrollbar>
          </div>
        </div>
      </div>
      <div class="content_bottom">
        <el-popover placement="top" width="400" trigger="hover">
          <div>
            <p style="text-align:center;font-weight: bold;">快捷键组合</p>
            <p style="text-align:center;margin-bottom: 10px;">
              快捷键由ALT键加上其他按键组成，如
            </p>
            <p>保存快捷键：ALT+S</p>
            <p>自动填写条码：ALT+B</p>
            <p>新增快捷键：ALT+A</p>
            <p>返回快捷键：ALT+Z</p>
            <p>删除快捷键：ALT+D</p>
            <p>快速定位到复本数：ALT+F</p>
          </div>
          <p slot="reference">
            <i class="el-icon-question"></i>
            <span style="margin-left: 10px;">快捷组合键：ALT+对应键</span>
          </p>
        </el-popover>
        <el-button
          size="small"
          :disabled="!tableData.length"
          @click="fullTiaoma"
          >填充条码(B)</el-button
        >
        <el-button
          size="small"
          :disabled="this.tableData.length >= 20"
          @click="addTableItem"
          >新增(A)</el-button
        >
        <el-button
          size="small"
          :disabled="this.tableData.length === 0"
          @click="submitForm('form')"
          >保存(S)</el-button
        >
        <el-button size="small" @click="returnLastPage">返回(Z)</el-button>
      </div>
    </div>
    <el-dialog
      :modal-append-to-body="false"
      :visible.sync="showMultireelCheck"
      title="多卷查重"
    >
      <el-table :data="multireelData" height="400">
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
  WXLYUAN_OPTIONS
} from "utils/variables";

import {
  userCzList,
  flowType,
  userGysInLibList,
  userYsLibList
} from "api/public";
import {
  getSSHao,
  catalogMultireelCheck,
  bookBookDefault,
  checkZchao
} from "api/catalogue";
import { getYanshou, zdysMarcSave } from "api/periodical";

export default {
  name: "per_zdys_collection",
  data() {
    this.libId = this.$store.getters.userInfo.libId;
    this.ztOptions = ZTAI_OPTIONS;
    this.zdfsOptions = ZDFANGSHI_OPTIONS;
    this.jzlxOptions = JZLEIXING_OPTIONS;
    this.wxlyOptions = WXLYUAN_OPTIONS;
    return {
      sshao: "",
      jytxma: this.getLocalStorage("td-jytxma") === "false" ? false : true,
      isCheck: true,
      yanshouid: "",
      marctyId: "",
      memory: this.getLocalStorage("td-memory") === "false" ? false : true,
      //表单
      form: {
        cejia: "",
        taojia: "",
        beizhu: "",
        tiaoma: "",
        czid: "",
        gysid: "",
        zdlx: "",
        ysid: "",
        jzleixing: "",
        ztai: "",
        wxlyuan: "",
        jcmshu: "",
        bookNum: Number(this.getLocalStorage("td-bookNum")) || 1
      },
      formRules: {},
      czOptions: [],
      flowTypeOptions: [],
      gysOptions: [],
      ysOptions: [],
      //多卷查重对话框
      showMultireelCheck: false,
      multireelData: [],
      loadMultireel: false,
      //表格
      loading: false,
      tableData: [],
      inputTips: false
    };
  },
  methods: {
    templateFormChange(key, value) {
      this.tableData.forEach(item => {
        item[key] = value;
      });
    },
    //根据验收id获取相应数据
    getYanshou() {
      this.yanshouid = this.$router.history.current.query.yanshouid;
      getYanshou({
        yanshouid: this.yanshouid
      }).then(res => {
        res.data.jcmshu = res.data.jcsm;
        this.form = { ...this.form, ...res.data };
        this.getSSHao();
      });
    },

    //获取索书号
    getSSHao() {
      getSSHao({
        flhao: this.form.flhao,
        author: this.form.author,
        isQk: 1,
        isCheck: this.isCheck ? 1 : 0
      }).then(res => {
        this.sshao = res.data;
        res.message ? this.$message(res.message) : null;
      });
    },
    //种次号查缺
    checkZchao() {
      checkZchao({
        flhao: this.form.flhao,
        libId: this.libId,
        isQk: 1
      }).then(res => {
        this.sshao = res.data;
      });
    },
    //多卷查重
    multireelCheck() {
      if (!this.sshao) {
        this.$message.warning("请输入索书号");
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
    //联动套价跟册价
    initMoney() {
      if (!this.form.cejia) {
        let num = this.form.jcsm.split(",").length;
        let money = this.$router.history.current.query.qkjge || "0";
        if (parseFloat(money)) {
          money = parseFloat(money).toFixed(2);
        } else {
          money = money.replace(/^[a-zA-Z]+/, "");
          if (parseFloat(money)) {
            money = parseFloat(money).toFixed(2);
          } else {
            money = 0;
          }
        }
        this.form.cejia = (Number(money) * num).toFixed(2);
        this.form.taojia = this.form.cejia;
      }
    },
    //默认展示表格
    initTable() {
      this.cloneFormData();
    },
    //克隆form
    cloneFormData() {
      let ind = 0;
      this.tableData = [];
      while (ind < (this.form.bookNum || 1) && ind < this.form.wdcs) {
        this.form.ind = ind + 1;
        this.tableData.push({ ...this.form, ysuanid: this.form.ysid });
        if (ind === 0) {
          this.tableData[0].tiaoma =
            this.getNextTiaoma(this.getLocalStorage("td-tiaoma")) || "";
        }
        ind++;
      }
      this.form.bookNum = this.tableData.length;
    },

    returnLastPage() {
      this.$store
        .dispatch("delView", {
          name: this.$route.name,
          path: this.$route.path
        })
        .then(() => {
          this.$router.push({
            name: "per_zdys",
            query: {
              isflash: true
            }
          });
        });
    },
    // 通用
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
    //填充条码
    fullTiaoma() {
      let fristTiaoma =
        this.tableData[0] && this.tableData[0].tiaoma
          ? this.tableData[0].tiaoma
          : (() => {
              this.$message.warning("请输入初始条形码");
              return null;
            })();
      if (fristTiaoma) {
        for (var i = 1; i < this.tableData.length; i++) {
          this.tableData[i].tiaoma = this.getNextTiaoma(
            this.tableData[i - 1].tiaoma
          );
        }
      }
    },
    //新增按钮功能
    addTableItem() {
      if (this.tableData.length >= Number(this.form.wdcs)) {
        this.$message.warning("复本数不能大于未到册数");
        return;
      }
      this.tableData.push({ ...this.form, ysuanid: this.form.ysid });
      this.form.bookNum = this.tableData.length;
    },
    //提交表单
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          for (const key in this.tableData) {
            const item = this.tableData[key];
            if (!item.tiaoma && item.tiaoma !== 0) {
              this.$message.warning("条形码不能为空");
              return;
            }
          }
          if (!this.sshao && this.sshao !== 0) {
            this.$message.warning("索书号不能为空");
            return;
          }
          this.zdysMarcSaveFunc();
        }
      });
    },
    //保存
    zdysMarcSaveFunc() {
      this.yanshouid = this.$router.history.current.query.yanshouid;
      let param = {
        ...this.form,
        sshao: this.sshao,
        bookList: JSON.stringify(this.tableData),
        yanshouid: this.yanshouid
      };
      zdysMarcSave(param).then(res => {
        this.saveLocalStorage();
        this.$message.success(res.message);
        this.$eventBus.$emit("zdys_collect");
        this.returnLastPage();
      });
    },
    // 本地存储的数据
    saveLocalStorage() {
      localStorage.setItem("td-memory", this.memory); // 记忆复本
      if (this.memory) {
        localStorage.setItem("td-bookNum", this.form.bookNum); // 复本数
      }

      localStorage.setItem("td-jytxma", this.jytxma); // 记忆条形码
      if (this.jytxma) {
        let tiaoma = this.tableData[this.tableData.length - 1].tiaoma;
        localStorage.setItem("td-tiaoma", tiaoma); // 最后一次的条码
      } else {
        localStorage.setItem("td-tiaoma", ""); // 下次开始的条码
      }
    },
    getLocalStorage(name) {
      return localStorage.getItem(name) || "";
    },
    //表格删除操作
    delteShuceItem(index) {
      this.tableData.splice(index, 1);
      this.form.bookNum = this.tableData.length;
    },
    initDataOptions() {
      this.getCzOptions();
      this.getFlowTypeOptions();
      this.getGysOptions();
      this.getYsOptions();
      this.form.ztai = "装订";
      this.form.jzleixing = this.jzlxOptions[0].value;
      this.form.wxlyuan = this.wxlyOptions[0].value;
      this.getBookDefault();
    },

    //获取默认数据
    getBookDefault() {
      this.marctyId = this.$router.history.current.query.marctyId;
      if (!this.marctyId) return;
      bookBookDefault({
        marctyId: this.marctyId
      }).then(res => {
        for (const [key, val] of Object.entries(res.data.bookDeault)) {
          if (key === "cejia") {
            this.form[key] = val;
          } else if (key === "taojia") {
            this.form[key] = val;
          }
        }
        this.form.ztai = "装订";
        this.initMoney();
        this.initTable();
      });
    },
    getCzOptions() {
      userCzList({
        libId: this.libId
      }).then(res => {
        this.czOptions = [];
        res.data.filter(ele => {
          this.czOptions.push({
            label: ele.mingcheng,
            value: ele.czid
          });
        });
        this.form.czid = this.getArrFirstValue(this.czOptions);
      });
    },
    getFlowTypeOptions() {
      flowType({
        libId: this.libId
      }).then(res => {
        this.flowTypeOptions = [];
        res.data.filter(ele => {
          this.flowTypeOptions.push({
            label: ele.mingcheng,
            value: ele.ltlxid
          });
        });
        this.form.ltlxid = this.getArrFirstValue(this.flowTypeOptions);
      });
    },

    getYsOptions() {
      userYsLibList({
        libId: this.libId
      }).then(res => {
        this.ysOptions = [];
        res.data.filter(ele => {
          this.ysOptions.push({
            label: ele.mingcheng,
            value: ele.ysid
          });
        });
        this.form.ysid = this.getArrFirstValue(this.ysOptions);
      });
    },

    getGysOptions() {
      userGysInLibList({
        libId: this.libId
      }).then(res => {
        this.gysOptions = [];
        res.data.filter(ele => {
          this.gysOptions.push({
            label: ele.gysName,
            value: ele.gysId
          });
        });
        this.form.gysid = this.getArrFirstValue(this.gysOptions);
      });
    },
    keyEvent(event) {
      if (event.altKey && event.keyCode === 65) {
        // A 新增
        window.event.preventDefault();
        this.addTableItem();
      } else if (event.altKey && event.keyCode === 68) {
        // D 删除最后一条记录
        window.event.preventDefault();
        this.delteShuceItem(this.tableData.length - 1);
      } else if (event.altKey && event.keyCode === 83) {
        // S 保存
        window.event.preventDefault();
        this.submitForm("form");
      } else if (event.altKey && event.keyCode === 90) {
        // Z 返回
        window.event.preventDefault();
        this.returnLastPage();
      } else if (event.altKey && event.keyCode === 66) {
        // B 自动填充
        window.event.preventDefault();
        this.fullTiaoma();
      } else if (event.altKey && event.keyCode === 70) {
        // F 定位复本
        window.event.preventDefault();
        this.$refs["focusInput"].focus();
      }
    }
  },
  mounted() {
    this.initDataOptions();
    this.getYanshou();
    document.body.addEventListener("keydown", this.keyEvent);
  },
  destroyed() {
    document.body.removeEventListener("keydown", this.keyEvent);
  },
  activated() {
    this.getYanshou();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>

<style lang="less">
.per_zdys_collection {
  .c-content-header {
    .content__header_title {
      width: 100%;
      position: relative;
      label,
      .el-input {
        font-size: @FSize_14;
        text-indent: 0;
      }
      label {
        margin-left: 30px;
      }
      .el-button__group {
        display: inline-block;
      }
      .el-checkbox__group {
        position: absolute;
        right: 5px;
        top: 0;
        .el-checkbox {
          margin: 0 5px;
        }
      }
    }
  }
  .content_pane {
    height: calc(100% - 41px);
    display: flex;
    border-top: 1px solid @topBgColor;
    .book__info {
      width: 270px;
      border-right: 1px solid @topBgColor;
      overflow: auto;
      .form__type {
        justify-content: center;
        margin-top: 5px;
        .jcsming {
          width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .item {
          margin-bottom: 5px;
          flex-basis: 100%;
          justify-content: center;
          .el-input,
          .el-select {
            width: 150px;
          }
        }
      }
    }
    .bottom__item {
      width: ~"calc(100% - 234px - 12px - 10px)";
      overflow: auto;
      flex-grow: 0;
      padding: 5px;
      padding-bottom: 0;
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
          height: 32px;
          font-weight: bold;
          text-align: left;
          border-right: 1px solid #c8d3df;
          border-bottom: 1px solid #c8d3df;
          text-align: center;
          font-size: @FSize_14;
          &:first-child {
            border-left: 1px solid #c8d3df;
          }
        }
        th {
          border-top: 1px solid #c8d3df;
        }
        input {
          width: 100%;
          height: 32px;
          text-align: center;
          border: none;
          outline: none;
        }
        select {
          width: 100%;
          height: 32px;
          border: none;
          outline: none;
        }
      }
      .item__content {
        height: calc(100% - 34px);
      }
    }
  }
  .content_bottom {
    display: flex;
    justify-content: flex-end;
    padding: 5px 10px;
    box-sizing: border-box;
    border-top: 1px solid @tableBorderColor;
    position: relative;

    .el-popover__reference {
      position: absolute;
      top: 8px;
      left: 10px;
    }
    .el-button {
      padding: 8px 30px;
    }
  }
}
</style>
