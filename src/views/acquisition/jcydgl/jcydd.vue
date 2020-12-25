<!--
 * @Description: 教材预订单（将原采访预订单页面迁移过来，屏蔽催缺信息按钮，后台逻辑不需要变更）
 * @Autor: chenming.feng
 * @Date: 2019-11-04 10:52:38
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:50:38
 -->
<template>
  <div class="acq_yddgl common__content">
    <td-content-header
      >教材预订单
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="showAddYDOrder">
            <icon-svg icon-class="icon-btn-ico-" />新增
          </el-button>
          <el-button
            :disabled="multipleYDOrderSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteYDOrder()"
          >
            <icon-svg icon-class="icon-btn-ico-5" />清空订单
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="print"
            :disabled="multipleYDOrderSelection.length === 0"
          >
            <icon-svg icon-class="icon-daochu" />导出
          </el-button>
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
            v-model="currentFilterKey"
            placeholder="请选择"
          >
            <el-option
              v-for="item in filterOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <el-input
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keydown.enter.native="initYDCatalogList"
          ></el-input>
          <p class="label">创建时间：</p>
          <el-date-picker
            style="margin-right: 3px;"
            size="mini"
            v-model="startDate"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="开始时间"
          ></el-date-picker>
          <span>至&nbsp;</span>
          <el-date-picker
            v-model="endDate"
            size="mini"
            value-format="yyyy-MM-dd"
            type="date"
            placeholder="结束时间"
          ></el-date-picker>
          <el-button type="primary" size="mini" @click="initYDOrderList">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content__table" ref="literatureTable">
        <el-table
          v-loading="loadYDOrderData"
          @selection-change="handleYDOrderSelectionChange"
          border=""
          ref="YDOrderList"
          :data="YDOrderList"
          @row-click="rowClick"
          @row-dblclick="rowDblclick"
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
          <el-table-column show-overflow-tooltip prop="daima" label="预订单">
            <template slot-scope="scope">
              <span
                @click="pathYddxqPage(scope.row.ydpcid, scope.row.daima)"
                class="g-row__check primary"
                >{{ scope.row.daima }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="cygName"
            label="成员馆"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="gysName"
            label="供应商"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ysCode"
            label="预算代码"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="创建时间"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="userName"
            label="创建者"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="beizhu"
            label="备注"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="work"
            label="设为工作预订单"
          >
            <template slot-scope="scope">
              <span>
                <i
                  :class="
                    scope.row.work
                      ? 'el-icon-star-on workStyle'
                      : 'el-icon-star-off workNoStyle'
                  "
                  type="text"
                  @click="dealWorkSave(scope.row.ydpcid)"
                ></i>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool :ops="[]">
                <template v-slot:menus>
                  <div
                    class="menu"
                    @click="pathYddxqPage(scope.row.ydpcid, scope.row.daima)"
                  >
                    详情
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleYDOrderSizeChange"
          @current-change="handleYDOrderCurrentChange"
          :total="totalYDOrderCount"
          :currentPage="currentYDOrderPage"
          :pageSize="YDOrderPageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 新增预订单 -->
    <side-wrap class="common__side_form" v-if="showAddSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">新增预订单</div>
          </div>
          <i class="el-icon-close" @click="showAddSide = false"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="YDOrderAddForm"
          label-width="90px"
          :model="YDOrderAddForm"
          :rules="YDOrderFormRules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>预订单信息</span>
            </div>
            <el-form-item class="item" prop="daima" label="预订单">
              <el-input
                clearable
                v-model="YDOrderAddForm.daima"
                placeholder="请输入预订单号"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商">
              <el-select
                filterable
                v-model="YDOrderAddForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysList"
                  :key="item.gysId"
                  :label="item.gysName"
                  :value="item.gysId"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="libid" label="成员馆">
              <el-select
                filterable
                @change="getParamList"
                v-model="YDOrderAddForm.libid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                v-model="YDOrderAddForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysList"
                  :key="item.ysid"
                  :label="item.mingcheng"
                  :value="item.ysid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="isWork" label="当前预订单">
              <el-switch
                v-model="YDOrderAddForm.isWork"
                :active-value="true"
                :inactive-value="false"
                active-text="开"
                inactive-text="关"
              ></el-switch>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item class="item" prop="beizhu" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="YDOrderAddForm.beizhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('YDOrderAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              @click="submitForm('YDOrderAddForm')"
              type="primary"
              >保存</el-button
            >
            <el-button size="mini" @click="cancelForm('YDOrderAddForm')"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { ydPcSearch, ydPcEmpty, ydPcAdd, workSave } from "api/acquisition";
import { userGysInLibList, userYsLibList } from "api/public";
import { mapGetters } from "vuex";
import { downLoadExcel } from "utils/utils";
export default {
  name: "acq_yddgl",
  data() {
    this.zifujiOptions = [
      {
        value: "utf8",
        label: "UTF-8"
      }
    ];

    this.YDOrderFormRules = {
      daima: [{ required: true, message: "请输入预订单号", trigger: "blur" }],
      libid: [{ required: true, message: "请选择成员馆", trigger: "change" }],
      gysid: [{ required: true, message: "请选择供应商", trigger: "change" }],
      ysid: [{ required: true, message: "请选择预算", trigger: "change" }]
    };
    this.filterOptions = [
      { label: "预订单", value: "1" },
      { label: "供应商名称", value: "2" }
    ];
    return {
      // 列表相关
      multipleYDOrderSelection: [],
      loadYDOrderData: false,
      YDOrderList: [],
      currentFilterKey: "1",
      currentFilterVal: "",
      YDOrderPageSize: 15,
      currentYDOrderPage: 1,
      totalYDOrderCount: 0,
      currentYDOrderId: "",
      startDate: "",
      endDate: "",
      // 新增
      showAddSide: false,
      YDOrderAddForm: {
        daima: "",
        libid: this.$store.getters.userInfo.libId,
        gysid: "",
        ysid: "",
        beizhu: "",
        isWork: false
      },
      currentOrder: true,
      wxlxOptions: [],
      gysList: [],
      ysList: [],
      // 编辑
      loadYDOrderDetail: false,
      showEditSide: false,
      YDOrderEditForm: {
        daima: "",
        leixing: "",
        libId: "",
        fuzhu: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libListSelect", "libList"])
  },
  methods: {
    // 征订目录列表
    initYDOrderList() {
      this.currentYDOrderPage = 1;
      this.getYDOrderList();
    },
    handleYDOrderSelectionChange(val) {
      this.multipleYDOrderSelection = val.map(item => item.ydpcid);
    },

    deleteYDOrder() {
      this.$confirm("您确定要清空该预订单吗？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadYDOrderData = true;
          ydPcEmpty({
            ydpcids: this.multipleYDOrderSelection.join(",")
          })
            .then(res => {
              this.initYDOrderList();
              this.$message({
                type: "success",
                message: res.message
              });
            })
            .finally(() => {
              this.loadYDOrderData = false;
            });
        })
        .catch(() => {});
    },

    getYDOrderList() {
      this.loadYDOrderData = true;
      let requestObj = {
        pageNumber: this.currentYDOrderPage,
        pageSize: this.YDOrderPageSize,
        flag: this.currentFilterKey,
        content: this.currentFilterVal.replace(/\s+/g, ""),
        startDate: this.startDate,
        endDate: this.endDate
      };
      ydPcSearch(requestObj)
        .then(res => {
          this.loadYDOrderData = false;
          this.YDOrderList = res.data.dataList;
          this.totalYDOrderCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadYDOrderData = false));
    },
    //双击
    rowDblclick(row) {
      this.pathYddxqPage(row.ydpcid, row.daima);
    },
    rowClick(row) {
      this.$refs.YDOrderList.toggleRowSelection(row);
    },
    handleYDOrderSizeChange(val) {
      this.YDOrderPageSize = val;
      this.getYDOrderList();
    },
    handleYDOrderCurrentChange(val) {
      this.currentYDOrderPage = val;
      this.getYDOrderList();
    },
    // 新增预订单
    showAddYDOrder() {
      this.showAddSide = true;
    },
    handleLiteratureFormAdd() {
      ydPcAdd({
        ...this.YDOrderAddForm
      }).then(res => {
        this.$message.success(res.message);
        this.initYDOrderList();
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.showAddSide = false;
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.showAddSide = false;
          this.handleLiteratureFormAdd();
          this.$refs[formName].resetFields();
        } else {
          return false;
        }
      });
    },
    //修改工作单
    dealWorkSave(ydpcid) {
      workSave({
        ydpcid
      }).then(res => {
        this.$message.success(res.message);
        // this.initYDOrderList();
        this.YDOrderList.filter(ele => {
          if (ele.ydpcid === ydpcid) {
            ele.work = true;
          } else {
            ele.work = false;
          }
        });
      });
    },
    //导出
    print() {
      downLoadExcel("api/e/interview/file/ydsmE", {
        ydpcid: this.multipleYDOrderSelection.join(",")
      });
    },
    //获取参数列表
    getParamList() {
      this.YDOrderAddForm.gysid = "";
      this.YDOrderAddForm.ysid = "";
      userGysInLibList({
        libId: this.YDOrderAddForm.libid
      }).then(res => {
        this.gysList = res.data;
      });
      userYsLibList({
        libId: this.YDOrderAddForm.libid
      }).then(res => {
        this.ysList = res.data;
      });
    },
    // 前往预订单详情
    pathYddxqPage(ydpcid, daima) {
      this.$router.push({
        name: "acq_jcyddxq",
        query: {
          ydpcid,
          daima
        }
      });
    }
  },
  mounted() {
    this.getParamList();
    this.getYDOrderList();
  },
  activated() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
