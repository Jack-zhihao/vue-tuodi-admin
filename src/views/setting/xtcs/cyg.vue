<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-06 11:08:47
 -->
<template>
  <div class="cyg common__content">
    <td-content-header>
      <span>成员馆详细信息</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="add('新增成员馆')" type="primary" size="mini">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            :disabled="selectRow.length ? false : true"
            @click="multDel"
            size="mini"
            type="primary"
          >
            <icon-svg icon-class="icon-btn-ico-1" />删除
          </el-button>
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <span class="label">上级馆：</span>
          <el-select
            filterable
            size="mini"
            clearable
            v-model="innercode"
            placeholder="请选择上级馆"
          >
            <el-option
              v-for="item in cygSjList"
              :key="item.innercode"
              :label="item.lib_jiancheng"
              :value="item.innercode"
            ></el-option>
          </el-select>
          <el-select
            filterable
            class="group__filter_type"
            size="mini"
            v-model="flag"
          >
            <el-option
              v-for="item in flagList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            placeholder="请输入搜索关键词"
            v-model="content"
            ref="focusInput"
          ></el-input>
          <el-button type="primary" @click="search" size="mini">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="multipleTableBox">
        <el-table
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-click="rowClick"
          @row-dblclick="handleEdit"
          @selection-change="selectFunc"
          v-loading="loading"
          stripe
          border=""
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column type="index" label=" " width="35"></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libCode"
            label="成员馆代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libJiancheng"
            label="成员馆简称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆全称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libDizhi"
            label="成员馆地址"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libYouxiang"
            label="成员馆邮箱"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.libId)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :total="totalCount"
          :current-page.sync="param.pageNumber"
          :page-size="param.pageSize"
        ></td-pagination>
      </div>
    </div>
    <side-wrap class="common__side_form" v-if="show" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增成员馆</div>
            <div v-else class="tit active">修改成员馆</div>
          </div>
          <i class="el-icon-close" @click="closeWrap"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="form"
          :rules="rules"
          class="custom__form"
          :model="form"
          label-width="120px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <p class="tit">成员馆信息</p>
            <el-form-item class="item" prop="libJiancheng" label="成员馆简称">
              <el-input clearable v-model="form.libJiancheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libDaima" label="图书馆代码">
              <el-input clearable v-model="form.libDaima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libCode" label="成员馆代码">
              <el-input clearable v-model="form.libCode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libMingcheng" label="成员馆全称">
              <el-input clearable v-model="form.libMingcheng"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libYouxiang" label="成员馆邮箱">
              <el-input clearable v-model="form.libYouxiang"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libDizhi" label="成员馆地址">
              <el-input clearable v-model="form.libDizhi"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libType" label="成员馆类型">
              <el-select filterable v-model="form.libType" placeholder="请选择">
                <el-option
                  v-for="(option, index) in libTypes"
                  v-bind:key="index"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="成员馆区域">
              <el-cascader
                style="width: 230px;"
                v-model="form.areaId"
                placeholder="请选择区域所属区域"
                :options="regionData"
                :show-all-levels="false"
                :props="{
                  checkStrictly: true,
                  emitPath: false,
                  value: 'areaId',
                  label: 'areaName',
                  children: 'childs'
                }"
              ></el-cascader>
            </el-form-item>
            <p class="tit">权限</p>
            <el-form-item
              class="item item1"
              prop="libFujian"
              label="附件随书借还"
            >
              <el-radio-group v-model="form.libFujian">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libShangjia"
              label="编目完成"
            >
              <span></span>
              <el-input
                class="bmltts"
                clearable
                v-only-num="form.libShangjia"
                v-model="form.libShangjia"
                width:80px
              ></el-input
              >&nbsp;天 后 进 入 流 通
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libYuyue"
              label="接受他馆读者预约"
            >
              <el-radio-group v-model="form.libYuyue">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libMoshi"
              label="验收后立即流通"
            >
              <el-radio-group v-model="form.libMoshi">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libYyxujie"
              label="预约可以续借"
            >
              <el-radio-group v-model="form.libYyxujie">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item item1" prop="libHbid" label="基准货币">
              <el-select filterable v-model="form.libHbid" placeholder="请选择">
                <el-option
                  v-for="(option, index) in hbList"
                  v-bind:key="index"
                  :label="option.hbcode"
                  :value="option.hbid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libGjhshu"
              label="允许图书归还外馆"
            >
              <el-radio-group v-model="form.libGjhshu">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item item1" prop="libFenleifa" label="分类法">
              <el-select filterable v-model="form.libFenleifa">
                <el-option
                  v-for="(option, index) in libFenleifaList"
                  :key="index"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="libShhxs"
              label="图书索书号组成"
              style="width:50%;height:29px"
            >
              <el-radio-group v-model="form.libShhxs">
                <el-radio style="padding-bottom: 20px;" :label="true">
                  <el-select
                    filterable
                    v-if="form.libShhxs"
                    v-model="form.libAuthorCodeType"
                  >
                    <el-option
                      v-for="(option, index) in libAuthorCodeTypeList"
                      :key="index"
                      :label="option.label"
                      :value="option.value"
                    ></el-option>
                  </el-select>
                  <span style="line-height: 40px" v-else>责任者号</span>
                </el-radio>
                <br />
                <el-radio :label="false">种次号</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="haschildlib"
              label="是否有成员馆"
              style="height:29px"
            >
              <el-radio-group v-model="form.haschildlib">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item item1"></el-form-item>
            <el-form-item
              class="item item1"
              prop="innercode"
              style="height:29px"
              label="上级馆"
            >
              <el-select
                filterable
                v-model="form.innercode"
                placeholder="请选择上级馆"
              >
                <el-option
                  v-for="(option, index) in cygSjList_"
                  :key="index"
                  :label="option.lib_jiancheng"
                  :value="option.innercode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item item1"
              prop="qkssh"
              label="期刊索书号组成"
              style="height:29px"
            >
              <el-radio-group v-model="form.qkssh">
                <el-radio style="padding-bottom: 20px;" :label="true">
                  <el-select
                    filterable
                    v-if="form.qkssh"
                    v-model="form.qkAuthorCodeType"
                  >
                    <el-option
                      v-for="(option, index) in libAuthorCodeTypeList"
                      :key="index"
                      :label="option.label"
                      :value="option.value"
                    ></el-option>
                  </el-select>
                  <span style="line-height: 40px" v-else>责任者号</span>
                </el-radio>
                <br />
                <el-radio :label="false">种次号</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item item1"></el-form-item>
            <el-form-item class="item item1"></el-form-item>
            <p class="tit">读者管理</p>
            <el-form-item class="item" prop="dzheMima" label="读者默认密码">
              <el-radio-group v-model="form.dzheMimaType">
                <el-radio :label="1">读者证后6位</el-radio>
                <el-radio :label="2">手机号后6位</el-radio>
                <el-radio :label="3">证件号后6位</el-radio>
                <el-radio :label="4">统一密码</el-radio>
                <el-input
                  style="width: 140px;"
                  maxlength="12"
                  v-if="form.dzheMimaType === 4"
                  placeholder="请输入统一密码"
                  clearable
                  v-model="form.dzheMima"
                ></el-input>
              </el-radio-group>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button class="el-button__reset" @click="reset" size="mini"
              >恢复默认设置</el-button
            >
          </div>
          <div>
            <el-button @click="closeWrap" size="mini">取消</el-button>
            <el-button @click="saveForm('form')" type="primary" size="mini"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { cygFind, cygSjList, cygDel, cygSave } from "api/setting";
import { getAreaTreeData } from "api/data";
import { hbList, flxList } from "api/public";

export default {
  name: "set_cyg",
  data() {
    var valiEmail = (rule, value, callback) => {
      // eslint-disable-next-line no-useless-escape
      let reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
      if (!reg.test(value)) {
        callback(new Error("请输入正确的格式的邮箱地址"));
      } else {
        callback();
      }
    };
    this.flagList = [
      { value: 1, label: "成员馆代码" },
      { value: 2, label: "成员馆简称" },
      { value: 3, label: "成员馆全称" },
      { value: 4, label: "成员馆地址" },
      { value: 5, label: "成员馆邮箱" }
    ];
    this.libTypes = [
      {
        label: "学校馆",
        value: "学校馆"
      },
      {
        label: "公共馆",
        value: "公共馆"
      }
    ];
    this.libAuthorCodeTypeList = [
      { label: "通用汉语著者号", value: 1 },
      { label: "卡特著者号", value: 2 },
      { label: "四角著者号", value: 3 },
      { label: "首字母", value: 4 }
    ];
    let validateDefaultPass = (rule, value, callback) => {
      if (this.form.dzheMimaType === 4 && value === "") {
        callback(new Error("统一密码不能为空"));
      } else {
        callback();
      }
    };
    this.rules = {
      libJiancheng: [
        { required: true, message: "请输入成员馆简称", trigger: "blur" }
      ],
      libDaima: [
        { required: true, message: "请输入图书馆代码", trigger: "blur" }
      ],
      libCode: [
        { required: true, message: "请输入成员馆代码", trigger: "blur" }
      ],
      libMingcheng: [
        { required: true, message: "请输入成员馆全称", trigger: "blur" }
      ],
      libYouxiang: [
        { required: true, message: "请输入成员馆邮箱", trigger: "blur" },
        { validator: valiEmail, trigger: "blur" }
      ],
      libDizhi: [
        { required: true, message: "请输入成员馆地址", trigger: "blur" }
      ],
      libType: [
        { required: true, message: "请输入成员馆类型", trigger: "change" }
      ],
      libHbid: [
        { required: true, message: "请选择基准货币", trigger: "change" }
      ],
      libFenleifa: [
        { required: true, message: "请选择分类法", trigger: "change" }
      ],
      innercode: [
        { required: true, message: "请选择上级馆", trigger: "change" }
      ],
      dzheMima: [{ validator: validateDefaultPass, trigger: "change" }]
    };
    this.baseForm = {
      /** 成员馆信息 */
      libJiancheng: "",
      libMingcheng: "",
      libCode: "",
      libDaima: "",
      libDizhi: "",
      libType: "学校馆",
      libYouxiang: "",
      areaId: "",
      /** 权限 */
      libFujian: false,
      libShangjia: "0",
      fjssjh: false,
      libMoshi: false,
      libYuyue: false,
      libYyxujie: false,
      libHbid: "",
      libGjhshu: false,
      libFenleifa: "",
      libShhxs: false,
      haschildlib: false,
      qkssh: false,
      innercode: "",
      libAuthorCodeType: 1,
      qkAuthorCodeType: 1,
      /** 读者管理 */
      dzheMimaType: 1,
      dzheMima: "123456"
    };
    return {
      loading: false,
      show: false,
      isAdd: false,
      value: "",
      innercode: "",
      cygSjList: [],
      tempCygSjList: [],
      cygSjList_: [],
      tableData: [],
      selectRow: [],
      flag: 1,
      content: "",
      form: {},
      tempForm: {},
      hbList: [],
      libHbid: "",
      libFenleifaList: [],
      totalCount: 0,
      param: {
        flag: 1,
        innercode: "",
        content: "",
        pageSize: 15,
        pageNumber: 1
      },
      regionData: []
    };
  },
  methods: {
    /** 获取成员馆列表  / 查询*/
    getCygList() {
      this.loading = true;
      cygFind(this.param)
        .then(res => {
          this.loading = false;
          if (res.code == 0) {
            this.totalCount = Number(res.data.totalElements);
            this.tableData = res.data.dataList;
          }
        })
        .catch(() => {
          this.loading = false;
        });
    },
    /** 获取上一级成员馆列表 */
    getCygSjList() {
      cygSjList({
        libId: this.$store.getters.userInfo.libId,
        innercode: ""
      }).then(res => {
        this.cygSjList = [...res.data];
        this.cygSjList_ = [...res.data];
      });
    },
    /** 获取货币列表 */
    gethbFind(libId) {
      hbList({
        libId: libId
      }).then(res => {
        this.hbList = res.data;
        let Existence = false;
        this.hbList.forEach(ele => {
          if (ele.hbid === this.libHbid) {
            Existence = true;
          }
        });
        this.form.libHbid = Existence ? this.libHbid : "";
      });
    },
    /**获取分类法 */
    getLibFenleifaList() {
      flxList().then(res => {
        if (res.code == 0) {
          let libFenleifaList = [];
          for (let key in res.data) {
            libFenleifaList.push({
              label: res.data[key],
              value: key
            });
          }
          this.libFenleifaList = [...libFenleifaList];
        }
      });
    },
    search() {
      this.param.pageNumber = 1;
      this.param.innercode = this.innercode;
      this.param.flag = this.flag;
      this.param.content = this.content.replace(/^\s+|\s+$/g, "");
      this.getCygList();
    },

    /** 新增 */
    add() {
      this.gethbFind(this.$store.getters.userInfo.libId);
      this.isAdd = true;
      this.show = !this.show;
      this.cygSjList_ = [...this.cygSjList];
      this.form = { ...this.baseForm };
    },

    /** 删除 */
    multDel() {
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let libIds = this.selectRow.map(item => item.libId).join(",");
          cygDel({
            libid: libIds
          }).then(res => {
            this.$store.dispatch("GetLibList");
            if (res.code == 0) {
              this.param.pageNumber = 1;
              this.getCygList();
              /**操作提示 */
              this.selectRow = [];
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        });
      } else {
        this.$message({
          type: "warning",
          message: "未选择操作项!"
        });
      }
    },
    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getCygList();
    },
    handleCurrentChange(currentPage) {
      this.param.pageNumber = currentPage;
      this.getCygList();
    },
    handleEdit(row) {
      if (row["innercodeP"]) {
        row["innercode"] = row["innercodeP"];
      }
      let cygSjExistence = false;
      this.cygSjList.forEach(item => {
        if (item.innercode === row.innercodeP) {
          cygSjExistence = true;
        }
      });
      if (!cygSjExistence) {
        let tempArr = Object.assign([], this.cygSjList);
        tempArr.unshift({
          innercode: row.innercodeP,
          lib_id: row.libIdP,
          lib_jiancheng: row.libJianchengP
        });
        this.cygSjList_ = tempArr;
      } else {
        this.cygSjList_ = Object.assign([], this.cygSjList);
      }

      this.tempCygSjList = Object.assign([], this.cygSjList_);
      this.gethbFind(row.libId);
      this.tempForm = { ...row };

      //基准货币延时500；
      let row_ = { ...row }; //拷贝。不能直接赋值会污染源数据
      this.libHbid = row_.libHbid;
      row_.libHbid = "";
      this.form = { ...row_ };

      this.show = true;
      this.isAdd = false;
    },
    handleDel(libid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        cygDel({
          libid
        }).then(res => {
          this.$store.dispatch("GetLibList");
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getCygList();
            /**操作提示 */
            this.selectRow = [];
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    closeWrap() {
      this.show = !this.show;
      this.$refs["form"].resetFields();
      this.form = { ...this.baseForm };
      this.tempForm = { ...this.baseForm };
      this.cygSjList_ = [...this.tempCygSjList];
      this.isAdd = true;
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.form["libShhxs"] ? null : (this.form["libAuthorCodeType"] = "");
          this.form["qkssh"] ? null : (this.form["qkAuthorCodeType"] = "");
          cygSave(this.form).then(res => {
            this.$store.dispatch("GetLibList");
            this.show = !this.show;
            this.cygSjList_ = [...this.tempCygSjList];
            this.param.pageNumber = 1;
            this.getCygList();
            this.$message({
              message: res.message,
              type: "success"
            });
            this.$refs[formName].resetFields();
            this.$eventBus.$emit("qypz-update");
            this.getCygSjList();
          });
        } else {
          return false;
        }
      });
    },
    reset() {
      this.$refs["form"].resetFields();
      this.form = { ...this.tempForm };
    },
    // 馆区域
    getAreasData() {
      getAreaTreeData().then(res => {
        let treeData = [];
        treeData.push(res.data);
        this.regionData = treeData;
        this.form.areaId = "";
      });
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    this.tempForm = { ...this.baseForm };
    this.getLibFenleifaList();
    this.getCygSjList();
    this.$refs.focusInput.focus();
  },
  created() {
    this.getAreasData();
    this.$eventBus.$on("qypz-update", () => {
      this.getAreasData();
    });
  },
  activated() {
    this.getCygSjList();
  },
  destroyed() {
    this.$eventBus.$off("qypz-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .item1 {
  .el-form-item:nth-child(2n -1) {
    justify-content: flex-end;
  }
  .el-input:nth-child(2) {
    width: 110px !important;
  }
}
/deep/ .el-form-item__label {
  width: 124px !important;
  white-space: nowrap;
  &::before {
    margin: 0 !important;
  }
}
.item:last-child {
  flex: 0 0 100% !important;
}
</style>
