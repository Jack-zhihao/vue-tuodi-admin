<!--
 * @Description: 
 * @Autor: xiaohong.lin
 * @Date: 2019-12-13 15:28:29
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-04 17:26:38
 -->
<template>
  <div class="cir_dzjypg common__content">
    <td-content-header>
      读者借阅评估
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="detail"
            ><icon-svg icon-class="icon-btn-ico-10" /> 评估配置</el-button
          >
          <el-dropdown @command="download">
            <el-button size="mini" type="primary" class="daochustyle">
              <icon-svg icon-class="icon-daochu" />导出
            </el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="downloadFile">
                列表统计数据</el-dropdown-item
              >
              <el-dropdown-item command="downloadDocx"
                >详细借阅数据</el-dropdown-item
              >
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </template>
    </td-content-header>
    <!-- 列表内容 -->
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <div class="filters__line">
            <span style="white-space: nowrap" class="label">成员馆：</span>
            <el-select
              filterable
              v-model="currentLib"
              placeholder="请选择馆"
              size="mini"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <span style="white-space: nowrap" class="label">状态：</span>
            <el-select
              filterable
              size="mini"
              placeholder="请选择"
              v-model="readerStatus"
            >
              <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-select
              filterable
              class="header__filters_type group__filters_type"
              size="mini"
              v-model="currentReaderIdKey"
              placeholder="请选择"
            >
              <el-option
                v-for="item in readerOptions"
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
              class="group__filters_value"
              v-model="collectionSearchKey"
              placeholder="请输入搜索关键词"
              @keydown.enter.native="initCollectionList"
            ></el-input>
          </div>

          <div class="filters__line">
            <p class="desc">借阅时间：</p>
            <el-date-picker
              v-model="brwDateStart"
              align="right"
              type="datetime"
              placeholder="选择开始时间"
              size="mini"
              value-format="yyyy-MM-dd HH:mm:ss"
              style="marginRight:5px;flex: 0 0 160px"
              :clearable="true"
            >
            </el-date-picker>
            <span>-</span>
            <el-date-picker
              v-model="brwDateEnd"
              align="right"
              type="datetime"
              placeholder="选择结束时间"
              value-format="yyyy-MM-dd HH:mm:ss"
              size="mini"
              :clearable="true"
              style="flex: 0 0 160px"
            >
            </el-date-picker>

            <span style="white-space: nowrap" class="label">排序方式：</span>
            <el-select
              filterable
              size="mini"
              placeholder="请选择"
              v-model="sortField"
            >
              <el-option
                v-for="item in sortOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <span style="white-space: nowrap" class="label">评估等级：</span>
            <el-select
              filterable
              size="mini"
              placeholder="请选择"
              v-model="evaluate"
            >
              <el-option
                v-for="item in assessOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>

            <el-button type="primary" size="mini" @click="initCollectionList">
              <icon-svg icon-class="icon-btn-ico-2" />
              查询</el-button
            >
          </div>
        </div>
      </div>
      <div class="content__table">
        <el-table
          v-loading="loadData"
          ref="table"
          border
          :data="collectionList"
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
            show-overflow-tooltip
            prop="readerCode"
            label="读者证号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerName"
            label="读者姓名"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerUnit"
            label="读者单位"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="readerGrade" label="级">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="readerClass" label="班">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="readerSex" label="性别">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerStatus"
            label="状态"
            width="45"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="brwNum" label="借阅册数">
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="brwClassify"
            label="常借类别"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="evaluate"
            label="借阅评估"
          >
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleCollectionSizeChange"
          @current-change="handleCollectionCurrentChange"
          :total="totalCollectionCount"
          :currentPage="currentUserPage"
          :pageSize="userPageSize"
        ></td-pagination>
      </div>
    </div>

    <!-- 评估配置页面 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-if="showEditSide"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit active">
              评估配置
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <div class="content">
        <div class="content__header" style="margin: 20px 0">
          <div class="header__filters">
            <div class="filters__line">
              <span style="white-space: nowrap" class="label">成员馆：</span>
              <el-select
                filterable
                v-model="detailLib"
                placeholder="请选择馆"
                size="mini"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </div>

            <div class="filters__line">
              <div style="height: 200px">
                <span style="white-space: nowrap" class="label"
                  >评估方式：</span
                >
                <el-radio-group v-model="assessMethods">
                  <el-radio :label="true">分值制</el-radio>
                  <el-radio :label="false">等级制</el-radio>
                </el-radio-group>
                <span v-if="assessMethods == true">
                  <span style="white-space: nowrap">
                    借阅册数：0册 - 5册 等级：不合格
                  </span>
                </span>
              </div>
            </div>

            <div class="filters__line">
              <div style="height: 32px">
                <span
                  style="white-space: nowrap;margin-right: 10px;height: 32px;line-height: 32px;"
                  class="label"
                >
                  是否限定借阅时长：
                  <el-switch
                    v-model="switchValue"
                    active-text="开"
                    inactive-text="关"
                  >
                  </el-switch>
                </span>
                <span v-show="switchValue == true">
                  <el-input
                    ref="focusInput"
                    size="mini"
                    clearable
                    class="group__filters_value"
                    style="width: 100px;"
                  ></el-input
                  >/天
                </span>
              </div>
            </div>

            <div class="filters__line">
              <span style="white-space: nowrap" class="label">
                限定借阅时长后，在限定时间内归还的图书，将不计算到评估中
              </span>
            </div>

            <div class="filters__line" style="height: 100px">
              <span style="white-space: nowrap" class="label">
                电子章：
              </span>
            </div>
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
            <el-button size="mini" @click="submitForm">保存</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import { inviteUser } from "api/operation";

import { rushRetExport, docxExport } from "api/circulation";

import { mapGetters } from "vuex";

import { downLoadExcel } from "utils/utils";
export default {
  name: "cir_dzjypg",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  data() {
    this.readerOptions = [
      {
        value: "readerCode",
        label: "读者证号"
      },
      {
        value: "readerName",
        label: "读者姓名"
      },
      {
        value: "readerUnit",
        label: "读者单位"
      },
      {
        value: "readerGrade",
        label: "级"
      },
      {
        value: "readerClass",
        label: "班"
      },
      {
        value: "readerSex",
        label: "性别"
      }
    ];
    this.statusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "正常",
        label: "正常"
      },
      {
        value: "挂失",
        label: "挂失"
      },
      {
        value: "注销",
        label: "注销"
      }
    ];
    this.sortOptions = [
      {
        value: 1,
        label: "借阅册数"
      },
      {
        value: 2,
        label: "借阅评估"
      },
      {
        value: 3,
        label: "读者单位"
      },
      {
        value: 4,
        label: "级"
      },
      {
        value: 5,
        label: "班"
      }
    ];
    this.assessOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: "合格",
        label: "合格"
      },
      {
        value: "不合格",
        label: "不合格"
      }
    ];
    return {
      readerStatus: "",
      sortField: 1,
      evaluate: "",
      currentLib: this.$store.getters.userInfo.libId,
      //时间传参
      brwDateStart: "",
      brwDateEnd: "",
      // 列表相关
      loadData: false,
      collectionList: [],
      collectionSearchKey: "",
      currentReaderIdKey: "readerCode",
      userPageSize: 15,
      currentUserPage: 1,
      totalCollectionCount: 0,
      // 评估配置
      detailLib: this.$store.getters.userInfo.libId,
      showEditSide: false,
      assessMethods: true,
      switchValue: false
    };
  },
  methods: {
    // 保存
    submitForm() {
      // save({
      // }).then(res => {
      //   this.showUserSide = false;
      //   this.$message.success(res.message);
      //   this.getUserFeedBackList();
      // });
    },
    detail() {
      this.showEditSide = true;
    },
    // 用户列表
    initCollectionList() {
      this.currentUserPage = 1;
      this.setRequestObj();
      this.getUserCodeList();
    },
    setRequestObj() {
      this.requestObj = {
        readerStatus: this.readerStatus,
        sortField: this.sortField,
        evaluate: this.evaluate,
        libId: this.currentLib,
        brwDateStart: this.brwDateStart,
        brwDateEnd: this.brwDateEnd
      };
      this.requestObj[this.currentReaderIdKey] = this.collectionSearchKey;
    },
    getUserCodeList() {
      this.loadData = true;
      let requestObj = {
        pageNumber: this.currentUserPage,
        pageSize: this.userPageSize,
        ...this.requestObj
      };
      inviteUser(requestObj)
        .then(res => {
          this.loadData = false;
          this.collectionList = res.data.dataList;
          this.totalCollectionCount = Number(res.data.totalElements);
        })
        .catch(() => (this.loadData = false));
    },
    handleCollectionSizeChange(val) {
      this.userPageSize = val;
      this.getUserCodeList();
    },
    handleCollectionCurrentChange(val) {
      this.currentUserPage = val;
      this.getUserCodeList();
    },
    // 导出
    download(command) {
      if (command == "downloadFile") {
        let requestObj = {};
        for (const key in this.requestObj) {
          if (this.requestObj.hasOwnProperty(key)) {
            const element = this.requestObj[key];
            if (element) {
              requestObj[key] = element;
            }
          }
        }
        downLoadExcel(rushRetExport(), requestObj);
      } else {
        docxExport().then(res => {
          let data = res.data;
          downLoadExcel(data);
        });
      }
    }
  },
  created() {}
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.content {
  .content__table {
    height: ~"calc(100% - 64px - 32px)";
  }
  .content__header {
    padding-bottom: 0;
  }
  .header__filters {
    flex-wrap: wrap;
  }
  .filters__line {
    width: 100%;
    display: flex;
    align-items: center;
    margin-bottom: 3px;
  }
}
.daochustyle {
  margin: 0 10px;
}
</style>
