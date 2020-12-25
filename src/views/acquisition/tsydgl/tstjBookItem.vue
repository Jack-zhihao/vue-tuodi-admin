<!--
 * @Description: 
 * @Autor: weujie.liang
 * @Date: 2019-09-19 10:50:29
 * @LastEditors: wj.liang
 * @LastEditTime: 2020-03-10 09:32:47
 -->

<template>
  <div class="jjlb common__content">
    <td-content-header>
      图书推荐
      <template v-slot:btns>
        <div class="header__ops">
          <el-button
            :disabled="multipleLiteratureSelection.length === 0"
            size="mini"
            type="primary"
            @click="migrateAll"
            ><icon-svg icon-class="icon-wenjianyisong" />迁移</el-button
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
          <p class="label">推荐时间：</p>
          <el-date-picker
            v-model="date1"
            align="right"
            type="date"
            placeholder="选择开始日期"
            size="mini"
            :picker-options="startDatePicker"
            value-format="yyyy-MM-dd"
            style="marginRight:3px"
            :clearable="true"
          >
          </el-date-picker>
          <span>-&nbsp;</span>
          <el-date-picker
            v-model="date2"
            align="right"
            type="date"
            placeholder="选择结束日期"
            :picker-options="endDatePicker"
            value-format="yyyy-MM-dd"
            size="mini"
            :clearable="true"
          >
          </el-date-picker>

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
              handleBarColabelanner(
                $event,
                val => (literatureSearchKey = val),
                delayFunc(initLiteratureList)
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

      <div class="content__table" ref="literatureTable">
        <el-table
          ref="table"
          @row-click="clickRow"
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
          <el-table-column prop="isbn" show-overflow-tooltip label="ISBN">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="ztming"
            min-width="115"
            label="正题名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="zrsming"
            label="责任者"
          ></el-table-column>

          <el-table-column show-overflow-tooltip prop="cbzhe" label="出版社">
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="cbrqi"
            label="出版日期"
            width="70"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="jge"
            label="价格"
            width="87"
          >
          </el-table-column>

          <el-table-column
            show-overflow-tooltip
            prop="optime"
            label="推荐时间"
            width="150"
          >
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="tjNote" label="推荐备注">
          </el-table-column>

          <el-table-column show-overflow-tooltip prop="username" label="推荐人">
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :ops="['del']"
                @handleDel="singleDeleteGzsm(scope.row)"
              >
                <template v-slot:menus>
                  <div class="menu" @click="migrate(scope.row)">
                    迁移
                  </div>
                </template>
              </td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleLiteratureSizeChange"
          @current-change="handleLiteratureCurrentChange"
          :total="totalLiteratureCount"
          :currentPage="currentLiteraturePage"
          :pageSize="literaturePageSize"
        ></td-pagination>
      </div>
    </div>
    <!-- 迁移弹框 -->
    <el-dialog title="迁移书目" :visible.sync="dialogMigrate">
      <el-form :model="migrateThemeForm">
        <el-form-item label="目标主题：" size="medium">
          <el-select
            filterable
            v-model="migrateThemeForm.targetTheme"
            placeholder="请选择目标主题"
          >
            <el-option
              v-for="item in themeList"
              :key="item.themeId"
              :label="item.themeTitle"
              :value="item.themeId"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="dialogMigrate = false">取 消</el-button>
        <el-button
          size="small"
          type="primary"
          @click="confirmMigrate(migrateThemeForm.row)"
          v-if="isAllMigrate == 0"
          >确 定</el-button
        >
        <el-button
          size="small"
          type="primary"
          @click="confirmMigrate"
          v-if="isAllMigrate == 1"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  searchBookItem,
  removalTstj,
  deleteTstjB,
  themeList,
  bookExop
} from "api/acquisition";
import { downLoadExcel } from "utils/utils";

export default {
  data() {
    this.literatureFilterOptions = [
      {
        value: "2",
        label: "ISBN"
      },
      {
        value: "1",
        label: "正题名"
      },
      {
        value: "3",
        label: "责任者"
      },
      {
        value: "4",
        label: "出版社"
      },
      {
        value: "5",
        label: "推荐人"
      }
    ];

    return {
      // 多选
      multipleLiteratureSelection: [],
      loadLiteratureData: false,
      literatureList: [],
      literatureSearchKey: "",
      currentLiteratureFilterKey: "2",
      literaturePageSize: 15,
      currentLiteraturePage: 1,
      totalLiteratureCount: 0,
      // 时间传参
      date1: "",
      date2: "",
      dialogMigrate: false,
      migrateThemeForm: {
        targetTheme: ""
      },
      isAllMigrate: "",
      // 激活主题列表
      themeList: [],
      loadLiteratureDetail: false,

      startDatePicker: {
        disabledDate: time => {
          if (this.date2) {
            return (
              // 如果结束时间已经选择
              time.getTime() > Date.now() ||
              time.getTime() > new Date(this.date2)
            );
          }
          // 结束时间没选--可以选择当天
          return time.getTime() > Date.now();
        }
      },
      endDatePicker: {
        disabledDate: time => {
          return (
            time.getTime() > Date.now() || time.getTime() < new Date(this.date1)
          );
        }
      }
    };
  },

  methods: {
    // 文献列表
    initLiteratureList() {
      this.currentLiteraturePage = 1;
      // this.setRequestObj();
      this.getLiteratureList();
    },
    clickRow(row) {
      this.$refs.table.toggleRowSelection(row);
    },
    getLiteratureList() {
      this.loadLiteratureData = true;

      let requestObj = {
        pageNumber: this.currentLiteraturePage,
        pageSize: this.literaturePageSize,
        libId: this.$route.query.libId,
        start: this.date1,
        end: this.date2,
        themeId: this.$route.query.themeId,
        flag: this.currentLiteratureFilterKey,
        content: this.literatureSearchKey
      };

      searchBookItem(requestObj)
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
    // 新增
    handleAdd() {
      this.showAddSide = true;
    },
    // 单个删除
    singleDeleteGzsm(row) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTstjB({ tjIds: row.tjId }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
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
          deleteTstjB({
            tjIds: this.multipleLiteratureSelection.join()
          }).then(res => {
            if (res.code == 0) {
              this.$message({
                message: res.message,
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
      downLoadExcel(bookExop(), {
        ...this.requestObj,
        start: this.date1,
        end: this.date2,
        themeId: this.$route.query.themeId
      });
    },
    // 多选成员馆
    handleLiteratureSelectionChange(val) {
      this.multipleLiteratureSelection = val.map(item => item.tjId);
    },
    getThemeList() {
      themeList({ libId: this.$route.query.libId, isAlive: true }).then(res => {
        if (res.code == 0) {
          this.themeList = res.data.map(item => {
            return {
              themeId: item.themeId,
              themeTitle: item.themeTitle
            };
          });
        }
      });
    },
    // 单迁移按钮
    migrate(row) {
      this.dialogMigrate = true;
      this.getThemeList();
      this.migrateThemeForm.row = row;
      this.isAllMigrate = 0;
    },
    // 批量迁移按钮
    migrateAll() {
      this.dialogMigrate = true;
      this.getThemeList();
      this.isAllMigrate = 1;
    },
    // 弹窗内确认迁移
    confirmMigrate(row) {
      this.dialogMigrate = false;

      this.removalTstj(row);
    },
    // 迁移书目
    removalTstj(row) {
      removalTstj({
        tjIds: row.tjId || this.multipleLiteratureSelection.join(),
        themeId: this.migrateThemeForm.targetTheme
      }).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.initLiteratureList();
        }
      });
    }
  },
  mounted() {
    this.initLiteratureList();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
</style>
