<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:07
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-07 13:51:13
 -->
<template>
  <div class="dzlx common__content">
    <td-content-header>
      <span>读者类型</span>
      <template v-slot:btns>
        <div class="header__ops">
          <el-button @click="add" type="primary" size="mini">
            <icon-svg icon-class="icon-btn-ico-" />
            新增</el-button
          >
          <el-button
            size="mini"
            type="primary"
            :disabled="selectRow.length ? false : true"
            @click="multDel"
          >
            <icon-svg icon-class="icon-btn-ico-1" />
            删除</el-button
          >
        </div>
      </template>
    </td-content-header>
    <div class="content">
      <div class="content__header">
        <div class="header__line">
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="libId"
            placeholder="选择成员馆"
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
            class="group__filter_type"
            v-model="optionKey"
          >
            <el-option
              v-for="item in optionList"
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
          <el-button size="mini" type="primary" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />
            查询</el-button
          >
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
          stripe
          border=""
          v-loading="loading"
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
            prop="daima"
            label="读者类型代码"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="mcheng"
            label="读者类型名称"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="guanji"
            label="馆际互借"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.guanji ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="chazheng"
            label="查验有效期"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.chazheng ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="yuyue"
            label="馆内预约"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.yuyue ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="yajin"
            label="押金"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="xishu"
            label="押金系数"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="chaoqi"
            label="超期借阅"
          >
            <template slot-scope="scope">
              <div v-text="scope.row.chaoqi ? '是' : '否'"></div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="fuzhu"
            label="附注"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.libId"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.dzlxid)"
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

    <side-wrap class="common__side_form" v-show="show" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div v-if="isAdd" class="tit">新增读者类型</div>
            <div v-else class="tit active">修改读者类型</div>
          </div>
          <i class="el-icon-close" @click="closeWrap" icon="el-icon-close"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          ref="form"
          :rules="rules"
          class="custom__form"
          :model="form"
          label-width="auto"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <p class="tit">基本信息</p>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select filterable v-model="form.libid">
                <el-option
                  v-for="option in libList"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="daima" label="读者类型代码">
              <el-input clearable v-model="form.daima"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-radio-group v-model="form.ztai">
                <el-radio :label="true">正常</el-radio>
                <el-radio :label="false">注销</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="mcheng" label="读者类型名称">
              <el-input clearable v-model="form.mcheng"></el-input>
            </el-form-item>
            <p class="tit">等级设定</p>
            <el-form-item
              class="item"
              v-if="false"
              prop="csfz"
              label="初始分值"
            >
              <el-input
                clearable
                v-model="form.csfz"
                placeholder="请输入初始最低分值"
              ></el-input>
            </el-form-item>
            <el-form-item v-if="false" prop="jfz" class="item" label="积分值">
              <el-input
                clearable
                v-model="form.jfz"
                placeholder="请输入最低分值"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjgshu" label="可荐购数量">
              <el-input
                clearable
                v-model="form.zdjgshu"
                @change="transNumshu"
                placeholder="请输入读者可荐购数量"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjgje" label="可荐购总额">
              <el-input
                clearable
                v-model="form.zdjgje"
                @change="transNumMoney"
                placeholder="请输入读者可荐购总额"
              ></el-input>
            </el-form-item>
            <p class="tit">有效期设定</p>
            <el-form-item class="item" prop="yxfshi" label="有效方式">
              <el-radio-group v-model="form.yxfshi">
                <el-radio :label="true"
                  >选择日期
                  <el-date-picker
                    :picker-options="pickerDate"
                    editable
                    value-format="yyyy-MM-dd"
                    v-model="form.jiezhi"
                    type="date"
                    placeholder="选择日期"
                    style="width:140px"
                  ></el-date-picker>
                </el-radio>
                <el-radio :label="false" style="margin: 20px 0"
                  >有效天数
                  <el-input
                    v-only-num="form.yxtshu"
                    clearable
                    v-model="form.yxtshu"
                    style="width:140px"
                  ></el-input>
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="chazheng" label="查验有效期">
              <el-radio-group v-model="form.chazheng">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <p class="tit">费用设定</p>
            <el-form-item class="item" prop="gongben" label="工本费">
              <el-input
                clearable
                v-only-num.float="form.gongben"
                v-model="form.gongben"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yanzheng" label="验证费">
              <el-input
                clearable
                v-only-num.float="form.yanzheng"
                v-model="form.yanzheng"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yajin" label="押金">
              <el-input
                clearable
                v-only-num.float="form.yajin"
                v-model="form.yajin"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zengzhi" label="增值服务费">
              <el-input
                clearable
                v-only-num.float="form.zengzhi"
                v-model="form.zengzhi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="xishu" label="押金系数">
              <el-input
                clearable
                v-only-num.float="form.xishu"
                v-model="form.xishu"
              ></el-input>
            </el-form-item>
            <p class="tit">借阅设定</p>
            <el-form-item class="item" prop="zdqkuan" label="最大欠款额">
              <el-input
                clearable
                v-only-num.float="form.zdqkuan"
                v-model="form.zdqkuan"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdwzcs" label="违章停借次数">
              <el-input
                clearable
                v-only-num="form.zdwzcs"
                v-model="form.zdwzcs"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdjieyue" label="最大借阅册数">
              <el-input
                clearable
                v-only-num="form.zdjieyue"
                v-model="form.zdjieyue"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="wztjts" label="违章停借天数">
              <el-input
                clearable
                v-only-num="form.wztjts"
                v-model="form.wztjts"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="chaoqi" label="超期允许借阅">
              <el-radio-group v-model="form.chaoqi">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <p class="tit">预约互借</p>
            <el-form-item class="item" prop="yuyue" label="允许馆内预约">
              <el-radio-group v-model="form.yuyue">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="zdyysl" label="预约最大册数">
              <el-input
                clearable
                v-only-num="form.zdyysl"
                v-model="form.zdyysl"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yyblts" label="预约保留天数">
              <el-input
                clearable
                v-only-num="form.yyblts"
                v-model="form.yyblts"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="guanji" label="允许馆际互借">
              <el-radio-group v-model="form.guanji">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="gjyysl" label="馆际预约册数">
              <el-input
                clearable
                v-only-num="form.gjyysl"
                v-model="form.gjyysl"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gjjysl" label="馆际借阅册数">
              <el-input
                clearable
                v-only-num="form.gjjysl"
                v-model="form.gjjysl"
              ></el-input>
            </el-form-item>
            <p class="tit">更多信息</p>
            <el-form-item class="item" prop="fuzhu" label="附注">
              <el-input
                clearable
                type="textarea"
                v-model="form.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div></div>
          <div>
            <el-button size="mini" @click="closeWrap">取消</el-button>
            <el-button size="mini" @click="saveForm('form')" type="primary"
              >保存</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>
<script>
import { readerTypeSave, readerTypeDel, readerTypeList } from "api/setting";
import { mapGetters } from "vuex";
export default {
  name: "set_dzlx",
  computed: {
    ...mapGetters(["libList", "libListSelect"])
  },
  data() {
    this.optionList = [
      { label: "读者类型名称", value: "name" },
      { label: "读者类型代码", value: "code" }
    ];
    this.rules = {
      libid: [{ required: true, message: "请选择成员馆", trigger: "blur" }],
      daima: [
        { required: true, message: "请输入读者类型代码", trigger: "blur" }
      ],
      mcheng: [
        { required: true, message: "请输入读者类型名称", trigger: "blur" }
      ],
      mingcheng: [
        { required: true, message: "请输入预算名称", trigger: "blur" }
      ],
      gongben: [{ required: true, message: "请输入工本费", trigger: "blur" }],
      yanzheng: [{ required: true, message: "请输入验证费", trigger: "blur" }],
      yajin: [{ required: true, message: "请输入押金", trigger: "blur" }],
      zengzhi: [
        { required: true, message: "请输入增值服务费", trigger: "blur" }
      ],
      xishu: [{ required: true, message: "请输入押金系数", trigger: "blur" }],
      zdqkuan: [
        { required: true, message: "请输入最大欠款额", trigger: "blur" }
      ],
      zdwzcs: [
        { required: true, message: "请输入违章停借次数", trigger: "blur" }
      ],
      zdjieyue: [
        { required: true, message: "请输入最大借阅册数", trigger: "blur" }
      ],
      wztjts: [
        { required: true, message: "请输入违章停借天数", trigger: "blur" }
      ],
      csfz: [{ required: true, message: "请输入初始分值", trigger: "blur" }],
      jfz: [{ required: true, message: "请输入积分值", trigger: "blur" }]
    };
    this.baseForm = {
      libid: this.$store.getters.userInfo.libId,
      daima: "",
      ztai: true,
      mcheng: "",
      yxfshi: true,
      jiezhi: "",
      yxtshu: "1",
      chazheng: true,
      gongben: "0.00",
      yanzheng: "0.00",
      yajin: "0.00",
      zengzhi: "0.00",
      xishu: "0.00",
      zdqkuan: "0.00",
      zdwzcs: "0",
      zdjieyue: "1",
      zdjgshu: "",
      zdjgmoney: "",
      wztjts: "0",
      chaoqi: true,
      yuyue: true,
      zdyysl: "1",
      yyblts: "2",
      guanji: true,
      gjyysl: "1",
      gjjysl: "1",
      fuzhu: ""
    };
    return {
      show: false,
      isAdd: true,
      libId: this.$store.getters.userInfo.libId,
      optionKey: "name",
      content: "",
      tableData: [],
      selectRow: [],
      loading: false,
      form: {},
      pickerDate: {
        disabledDate(time) {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      totalCount: 0,
      param: {
        pageSize: 15,
        pageNumber: 1
      }
    };
  },
  methods: {
    /**获取预算列表 */
    getReaderTypeList() {
      this.loading = !this.loading;
      readerTypeList(this.param).then(res => {
        this.loading = !this.loading;
        if (res.code == 0) {
          this.totalCount = +res.data.totalElements;
          this.tableData = [...res.data.dataList];
        }
      });
    },
    add() {
      this.show = !this.show;
      this.form = { ...this.baseForm };
      this.isAdd = true;
    },
    multDel() {
      let dzlxid = "";
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          this.selectRow.forEach(ele => {
            dzlxid += ele.dzlxid + ",";
          });
          readerTypeDel({
            dzlxid
          }).then(res => {
            this.param.pageNumber = 1;
            this.getReaderTypeList(this.param);
            this.selectRow = [];
            if (res.code == 0) {
              this.param.pageNumber = 1;
              this.getReaderTypeList(this.param);
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
    search() {
      this.param.name = "";
      this.param.code = "";
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.libId = this.libId;
      this.param.pageNumber = 1;
      this.getReaderTypeList(this.param);
    },

    closeWrap() {
      this.show = !this.show;
      this.$refs["form"].resetFields();
      this.form = { ...this.baseForm };
    },
    /** 选中行 -- 取消选择*/
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },
    saveForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          readerTypeSave(this.form).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
                type: "success"
              });
              this.show = !this.show;
              this.$refs[formName].resetFields();
              this.param.pageNumber = 1;
              this.getReaderTypeList(this.param);
            }
          });
        } else {
          return false;
        }
      });
    },

    handleEdit(row) {
      this.isAdd = false;
      this.show = true;
      this.form = { ...row };
    },
    handleDel(dzlxid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        readerTypeDel({
          dzlxid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getReaderTypeList(this.param);
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getReaderTypeList(this.param);
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getReaderTypeList(this.param);
    },
    transNumshu(val) {
      let flag = new RegExp("^[1-9][0-9]*$").test(val);
      if (!flag) {
        this.$message.error("请输入正整数");

        this.form.zdjgshu = "";
      }
    },
    transNumMoney(val) {
      let flag = new RegExp("^[1-9][0-9]*$").test(val);
      if (!flag) {
        this.$message.error("请输入正整数");

        this.form.zdjgje = "";
      }
    }
  },
  mounted() {
    this.form = { ...this.baseForm };
    this.$refs.focusInput.focus();
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonStyle.less";
/deep/ .el-form-item__label {
  width: 100px !important;
}
</style>
