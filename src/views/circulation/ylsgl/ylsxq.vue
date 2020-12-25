<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-05 17:34:44
 -->

<template>
  <div class="jjlb common__content">
    <td-content-header>
      阅览室详情
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleAdd"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="deleteGzsm"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
          >
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
          <p class="label">成员馆：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <p class="label">操作员：</p>
          <el-select
            filterable
            size="mini"
            v-model="userName"
            placeholder="请选择"
            clearable
          >
            <el-option
              v-for="item in userArr"
              :key="item.value"
              :label="item.username"
              :value="item.userId"
            >
            </el-option>
          </el-select>

          <p class="label">阅览室名称：</p>
          <el-input
            clearable
            size="mini"
            v-model="readerRoomName"
            placeholder="请输入阅览室名称"
          ></el-input>

          <p class="label">排序方式：</p>
          <el-select
            filterable
            size="mini"
            v-model="rankId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in rankArr"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>

          <el-button type="primary" size="mini" @click="initLiteratureList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
          @row-dblclick="rowDblclick"
          v-loading="loadLiteratureData"
          @selection-change="handleLiteratureSelectionChange"
          border
          :data="literatureList"
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
            prop="readingroomName"
            show-overflow-tooltip
            label="阅览室名称"
            width="100"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="collectionNumber"
            label="馆藏数"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="enterPreson"
            label="入室人数"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="seatNumber"
            label="座位数"
          ></el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="useSeatNumber"
            label="上座人数"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="useSeatNumberRate"
            label="上座率"
            width="70"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="libMingcheng"
            label="成员馆"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="remark" label="备注">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="username" label="操作人">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="optime" label="操作时间">
          </el-table-column>

          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['edit', 'del']"
                @handleEdit="editGzsm(scope.row)"
                @handleDel="singleDeleteGzsm(scope.row)"
              >
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page" style="justifyContent:flex-end">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 新增编辑活动 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="showSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit" v-if="isAdd">
              新增阅览室
            </div>
            <div class="tit  active" v-else>
              编辑阅览室
            </div>
          </div>
          <i class="el-icon-close" @click="cancelForm('literatureForm')"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="literatureForm"
          label-width="100px"
          :model="literatureForm"
          :rules="rules"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>阅览室信息</span>
            </div>
            <el-form-item
              class="item item__line"
              label="成员馆"
              prop="selectLibId"
            >
              <el-select
                filterable
                v-model="literatureForm.selectLibId"
                placeholder="请选择"
                ref="selectLibId"
              >
                <el-option
                  v-for="item in libList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              class="item item__line"
              label="阅览室名称"
              prop="readerRoomName"
            >
              <el-input
                clearable
                v-model="literatureForm.readerRoomName"
                placeholder="请输入阅览室名称"
                ref="readerRoomName"
              ></el-input>
            </el-form-item>

            <el-form-item class="item item__line" label="馆藏数" prop="libNum">
              <el-input
                clearable
                v-model="literatureForm.libNum"
                @change="transNumlib"
                placeholder="请输入馆藏数"
                ref="libNum"
              ></el-input>
            </el-form-item>
            <el-form-item
              class="item item__textarea item__line"
              label="座位数"
              prop="ticket"
              placeholder="请输入座位数"
            >
              <el-input
                clearable
                v-model="literatureForm.ticket"
                @change="transNumticket"
                ref="ticket"
              ></el-input>
            </el-form-item>

            <el-form-item
              class="item item__textarea item__line"
              label="预约时限"
              prop="minute"
            >
              <el-input
                v-model="literatureForm.minute"
                label="预约时限"
                clearable
                ref="minute"
              ></el-input>
              分钟
            </el-form-item>

            <el-form-item
              class="item item__textarea item__line"
              label="备注"
              style="flex:0 0 100%"
              prop="remarks"
            >
              <el-input
                type="textarea"
                autosize
                placeholder="请输入内容"
                v-model="literatureForm.remarks"
                clearable
                style="width:330%"
                ref="remarks"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button
              size="mini"
              @click="submitForm('add')"
              type="primary"
              v-if="isAdd"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="submitForm('edit')"
              v-else
              type="primary"
              >保存</el-button
            >
            <el-button
              size="mini"
              @click="cancelForm('literatureForm')"
              type="primary"
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
  list,
  userList,
  addRoom,
  editRoom,
  roomExcel,
  delRoom
} from "api/circulation";
import { downLoadExcel } from "utils/utils";
import { mapGetters } from "vuex";

export default {
  name: "opera_pcqd",
  data() {
    let znumRules = (rule, value, callback) => {
      if (!/(^[1-9]+\d*$)|(^0$)/.test(value)) {
        callback(new Error("只能为正整数或0"));
      } else {
        callback();
      }
    };
    return {
      userName: "",
      // 类型
      userArr: [],
      // 多选
      multipleLiteratureSelection: [],

      selectLibId: this.$store.getters.userInfo.libId,
      loadLiteratureData: false,
      literatureList: [],
      rankArr: [
        { value: 1, label: "入室人数" },
        { value: 2, label: "馆藏数" },
        { value: 3, label: "座位数" },
        { value: 4, label: "上座人数" }
      ],
      rankId: 1,
      readerRoomName: "",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 新增编辑
      showSide: false,
      isAdd: "",
      literatureForm: {
        selectLibId: this.$store.getters.userInfo.libId,
        readerRoomName: "",
        libNum: "",
        ticket: "",
        minute: "",
        remarks: ""
      },

      loadLiteratureDetail: false,
      rules: {
        readerRoomName: [
          { required: true, message: "请填写阅览室名称", trigger: "blur" }
        ],
        minute: [
          { validator: znumRules, trigger: "change" },
          { required: true, message: "请填写预约时限", trigger: "blur" }
        ]
      }
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      this.setRequestObj();

      this.getLiteratureList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.editGzsm(row);
    },
    setRequestObj() {
      this.requestObj = {
        libId: this.selectLibId,
        userId: this.userName,
        roomName: this.readerRoomName,
        orderBy: this.rankId
      };
    },

    handleMin() {},
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        ...this.requestObj
      };

      list(requestObj)
        .then(res => {
          this.loadLiteratureData = false;

          this.literatureList = res.data.dataList;
          this.totalLiteratureCount = Number(res.data.totalElements);
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
    // 新增按钮
    handleAdd() {
      this.showSide = true;
      this.isAdd = true;
      this.literatureForm = {
        selectLibId: this.$store.getters.userInfo.libId,
        readerRoomName: "",
        libNum: "",
        ticket: "",
        minute: "",
        remarks: ""
      };
      this.literatureForm.selectLibId = this.$store.getters.userInfo.libId;
    },
    // 编辑按钮
    editGzsm(row) {
      this.showSide = true;
      this.isAdd = false;
      this.literatureForm.libId = row.libId;
      this.literatureForm.readerRoomName = row.readingroomName;
      this.literatureForm.libNum =
        row.collectionNumber == 0 ? "" : row.collectionNumber;
      this.literatureForm.ticket = row.seatNumber == 0 ? "" : row.seatNumber;
      this.literatureForm.minute = row.timeLength == 0 ? "" : row.timeLength;
      this.literatureForm.remarks = row.remark;
      this.literatureForm.readingroomId = row.readingroomId;
    },
    // 新增接口
    handleLiteratureFormAdd() {
      let params = {
        libId: this.literatureForm.selectLibId,
        readingroomName: this.literatureForm.readerRoomName,
        collectionNumber: this.literatureForm.libNum,
        seatNumber: this.literatureForm.ticket,
        timeLength: this.literatureForm.minute,
        remark: this.literatureForm.remarks
      };
      addRoom(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.data,
            type: "success"
          });
          // 刷新列表
          this.initLiteratureList();
        }
      });
    },
    // 编辑接口
    handleLiteratureFormEdit() {
      let params = {
        libId: this.literatureForm.selectLibId,
        readingroomName: this.literatureForm.readerRoomName,
        collectionNumber: this.literatureForm.libNum,
        seatNumber: this.literatureForm.ticket,
        timeLength: this.literatureForm.minute,
        remark: this.literatureForm.remarks,
        readingroomId: this.literatureForm.readingroomId
      };
      editRoom(params).then(res => {
        if (res.code == 0) {
          this.$message({
            message: res.data,
            type: "success"
          });
          this.initLiteratureList();
        }
      });
    },
    // 取消提交
    cancelForm(formName) {
      this.showSide = false;
      this.$refs[formName].resetFields();
    },
    // 验证提交校验
    jsYz(formName) {
      this.$refs["literatureForm"].validate((valid, error) => {
        if (valid) {
          // 通过表单验证
          if (formName === "add") {
            this.handleLiteratureFormAdd();
            this.showSide = false;
          } else if (formName === "edit") {
            this.handleLiteratureFormEdit();
            this.showSide = false;
          }
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    },
    // 保存提交
    submitForm(formName) {
      let that = this;
      setTimeout(function() {
        that.jsYz(formName);
      }, 100);
    },

    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRoom({ readingroomIds: row.readingroomId }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.data,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },
    // 批量删除
    deleteGzsm() {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          delRoom({
            readingroomIds: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.data,
                type: "success"
              });
              this.initLiteratureList();
            }
          });
        })
        .catch(() => {});
    },

    // 导出
    handleExport() {
      downLoadExcel(roomExcel(), {
        func_name_us: "reading_roomDetails",
        ...this.requestObj
      });
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.readingroomId);
    },
    userList() {
      userList({ libId: this.selectLibId }).then(res => {
        if (res.code == 0) {
          res.data.push({ username: "全部", userId: "" });
          this.userArr = res.data;
        }
      });
    },
    transNumlib(val) {
      let flag = new RegExp("^[1-9][0-9]*$").test(val);
      if (!flag) {
        this.$message.error("请输入正整数");

        this.literatureForm.libNum = "";
      }
    },
    transNumticket(val) {
      let flag = new RegExp("^[1-9][0-9]*$").test(val);
      if (!flag) {
        this.$message.error("请输入正整数");

        this.literatureForm.ticket = "";
      }
    }
  },
  created() {
    this.initLiteratureList();
    this.userList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.edit__footer {
  justify-content: flex-end !important;
}
</style>
