<!--
 * @Description: 
 * @Version: 4.1
 * @Autor: zhihao.zhang
 * @Date: 2019-06-25 10:32:06
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-05 10:21:40
 -->
<template>
  <div class="dzgl common__content_">
    <div class="content__header_title">
      <span>读者信息</span>
      <div class="tool">
        <el-button size="mini" type="primary" @click="addCard">
          <icon-svg icon-class="icon-btn-ico-9" />新增办证
        </el-button>
        <el-button size="mini" type="primary" @click="multDealReader">
          <icon-svg icon-class="icon-btn-ico-10" />读者批管理
        </el-button>
        <el-button
          size="mini"
          type="primary"
          :disabled="selectRow.length ? false : true"
          @click="multDel"
        >
          <icon-svg icon-class="icon-btn-ico-1" />删除
        </el-button>
        <el-button size="mini" type="primary" @click="print">
          <icon-svg icon-class="icon-daochu" />导出
        </el-button>
      </div>
    </div>
    <div class="content">
      <div ref="toolBar" :class="more ? 'toolbar open-option' : 'toolbar'">
        <div class="base-option">
          <label>成员馆</label>
          <el-select
            filterable
            size="mini"
            @change="getFilterList"
            v-model="libid"
            placeholder="选择成员馆"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
          <label style="padding:0;">证件状态</label>
          <el-select
            filterable
            size="mini"
            class="el-select-120"
            v-model="ztai"
            placeholder="请选择"
          >
            <el-option
              v-for="item in ztaiList_"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option> </el-select
          >&nbsp;
          <div class="supplier-selection">
            <el-select
              filterable
              size="mini"
              class="el-select-supplier"
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
              class="supplier-key"
              placeholder="请输入搜索关键词"
              v-model="content"
              ref="focusInput"
              @keydown.native.enter="search"
            ></el-input>
          </div>
          <el-button size="mini" type="primary" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
          <p
            v-show="!more"
            @click="moreOption"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            更多条件
          </p>
          <p
            v-show="more"
            @click="more = false"
            style="cursor: pointer;color: #378DE6;line-height: 30px;display: inline-block;vertical-align: middle;margin-left: 10px;font-size: 12px;"
          >
            隐藏条件
          </p>
        </div>
        <div class="more-option">
          <label>办证时间</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="bzrqi_d1"
            type="datetime"
            placeholder="开始时间"
          ></el-date-picker
          >至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="bzrqi_d2"
            type="datetime"
            placeholder="结束时间"
          ></el-date-picker>
          <label>启用日期</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="qyrqi_d1"
            type="date"
            placeholder="选择日期"
          ></el-date-picker
          >至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="qyrqi_d2"
            type="date"
            placeholder="选择日期"
          ></el-date-picker
          >&nbsp;
          <label style="padding:0;">截止日期</label>
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="jzrqi_d1"
            type="date"
            placeholder="选择日期"
          ></el-date-picker
          >至
          <el-date-picker
            size="mini"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="jzrqi_d2"
            type="date"
            placeholder="选择日期"
          ></el-date-picker
          >&nbsp;
          <label style="padding:0;">性别</label>
          <el-select
            filterable
            size="mini"
            class="el-select-120"
            v-model="sex"
            placeholder="请选择"
          >
            <el-option
              v-for="item in sexList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option> </el-select
          >&nbsp;
          <label style="padding:0;">欠款</label>
          <el-select
            filterable
            size="mini"
            class="el-select-120"
            v-model="qkuan"
            placeholder="请选择"
          >
            <el-option
              v-for="item in qkuanList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option> </el-select
          >&nbsp;
          <label style="padding:0;">押金</label>
          <el-select
            filterable
            size="mini"
            class="el-select-120"
            v-model="yajin"
            placeholder="请选择"
          >
            <el-option
              v-for="item in yajinList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
      </div>
      <div
        :class="more ? 'more-option' : ''"
        class="multipleTableBox"
        ref="multipleTableBox"
      >
        <el-table
          border
          height="100%"
          ref="multipleTable"
          :data="tableData"
          @row-click="rowClick"
          @row-dblclick="handleEdit"
          @selection-change="selectFunc"
          stripe
          v-loading="loading"
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            align="center"
            width="42"
          ></el-table-column>
          <el-table-column
            type="index"
            label=" "
            width="35"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzzhao"
            label="读者证号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xjh"
            v-if="tableMode === '学校馆'"
            label="学籍号"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="xming"
            label="读者姓名"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="readerType"
            label="读者类型"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            v-if="tableMode === '学校馆'"
            prop="xueduan"
            label="学段"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="ji"
            v-if="tableMode === '学校馆'"
            label="级"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="ban"
            v-if="tableMode === '学校馆'"
            label="班"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="xingbie"
            label="性别"
            width="70"
          >
            <template slot-scope="scope">
              <span v-text="scope.row.xingbie ? '男' : '女'"></span>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="dzdw"
            label="读者单位"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="libName"
            label="成员馆"
          ></el-table-column>
          <el-table-column show-overflow-tooltip prop="bzrqi" label="办证时间">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="启用日期">
            <template slot-scope="scope">
              {{ scope.row.qyrqi | filterDate }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="截止日期">
            <template slot-scope="scope">
              {{ scope.row.jzrqi | filterDate }}
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="jifen"
            label="积分"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="qkuan"
            label="欠款"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="yajin"
            label="押金"
            width="70"
          ></el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="ztai"
            label="状态"
            width="70"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.ztai == '正常'" class="normal">
                <i></i>&nbsp;正常
              </div>
              <div v-if="scope.row.ztai == '注销'" class="logout">
                <i></i>&nbsp;注销
              </div>
              <div v-if="scope.row.ztai == '挂失'" class="guashi">
                <i></i>&nbsp;挂失
              </div>
              <div v-if="scope.row.ztai == '暂停'" class="zanting">
                <i></i>&nbsp;暂停
              </div>
              <div v-if="scope.row.ztai == '退证'" class="tuizheng">
                <i></i>&nbsp;退证
              </div>
              <div v-if="scope.row.ztai == '过期'" class="guoqi">
                <i></i>&nbsp;过期
              </div>
            </template>
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            align="center"
            prop="statusUpdateOptime"
            label="状态更新时间"
          ></el-table-column>
          <el-table-column fixed="right" align="center" label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.dzid"
                :scope="scope.row"
                :ops="['edit', 'del']"
                @handleEdit="handleEdit(scope.row)"
                @handleDel="handleDel(scope.row.dzid)"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="content__pages">
      <td-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :total="totalCount"
        :current-page.sync="param.pageNumber"
        :page-size="param.pageSize"
      ></td-pagination>
    </div>
    <!--  **新增面板**  -->
    <side-wrap v-show="xzbzWrap" width="850px">
      <template v-slot:header>
        <el-button
          size="mini"
          class="close-side-wrap"
          @click="closeWrap('xzbzForm')"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">新增办证</p>
      </template>
      <div class="side-wrap-content">
        <el-form
          ref="xzbzForm"
          :rules="xzbzRules"
          class="side-wrap-form"
          :model="xzbzForm"
          size="mini"
        >
          <p class="side-wrap-content-title">读者信息</p>
          <p></p>
          <div class="picture-info-item">
            <div class="fingerprint" v-if="false">
              <div class="picture-box">
                <icon-svg
                  style="color: #838F9D"
                  v-if="xgdzForm.fingerprint || xgdzForm.fingerprint === '0'"
                  icon-class="icon-btn-ico-7"
                ></icon-svg>
                <icon-svg v-else icon-class="icon-btn-ico-7"></icon-svg>
              </div>
              <div class="finger__content">
                <finger-print
                  @getFingerPrint="getFingerPrint"
                  compareTemplate="121554"
                  :actions="['register']"
                ></finger-print>
                <el-button size="mini" @click="delFingerPrint('add')"
                  >删除指纹</el-button
                >
              </div>
            </div>
            <div class="userface">
              <div class="picture-box">
                <el-upload
                  class="avatar-uploader"
                  :action="IMG_URL + '/api/p/img/upload'"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload"
                  :data="imageData"
                >
                  <el-image
                    class="avatar"
                    v-if="xzbzForm.picture"
                    style="width: 110px; height: 150px"
                    :src="
                      `${IMG_URL}/api/p/img/url?img=${this.xzbzForm.picture}`
                    "
                    fit="contain"
                  ></el-image>
                  <icon-svg v-else icon-class="icon-yonghu"></icon-svg>
                  <el-button
                    size="mini"
                    class="avatar-uploader-button"
                    type="primary"
                    >更换照片</el-button
                  >
                </el-upload>
              </div>
            </div>
          </div>
          <el-form-item
            class="xzbz-form-item require"
            prop="dzzhao"
            label="读者证号"
            ref="item_dzzhao"
          >
            <el-input
              @blur="setDefaultPass($event, 1)"
              clearable
              v-model="xzbzForm.dzzhao"
              ref="dzzhaoInput"
            ></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item"></el-form-item>
          <el-form-item
            class="xzbz-form-item require"
            prop="libid"
            label="成员馆"
          >
            <el-select
              filterable
              disabled
              v-model="xzbzForm.libid"
              placeholder="选择成员馆"
            >
              <el-option
                v-for="item in libListSelect"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item"></el-form-item>
          <el-form-item
            class="xzbz-form-item require"
            prop="dzlxid"
            ref="item_dzlxid"
            label="读者类型"
          >
            <el-select
              filterable
              v-model="xzbzForm.dzlxid"
              @change="linkYajin"
              placeholder="请选择"
            >
              <el-option
                v-for="item in readerTypeList"
                :key="item.dzlxid"
                :label="item.mcheng"
                :value="item.dzlxid"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            class="xzbz-form-item require"
            prop="jifen"
            v-if="false"
            label="积分值"
            ref="item_jfz"
          >
            <el-input
              clearable
              v-model="xzbzForm.jifen"
              ref="jfzInput"
              placeholder="请输入最低分值"
            ></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item"></el-form-item>
          <el-form-item
            class="xzbz-form-item"
            v-if="false"
            prop="smrz"
            label="实名认证"
          >
            <el-select filterable v-model="xzbzForm.smrz">
              <el-option
                v-for="item in smrzArr"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="libMingcheng" label="状态">
            <el-select filterable v-model="xzbzForm.ztai">
              <el-option
                v-for="item in ztaiList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item"></el-form-item>
          <el-form-item
            class="xzbz-form-item require"
            ref="item_mima"
            prop="mima"
            label="密码"
          >
            <el-input clearable v-model="xzbzForm.mima"></el-input>
          </el-form-item>
          <p class="side-wrap-content-title">其他信息</p>
          <el-form-item class="xzbz-form-item" prop="qyrqi" label="启用日期">
            <el-date-picker
              v-model="xzbzForm.qyrqi"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="jycshu" label="借阅次数">
            <el-input clearable disabled v-model="xzbzForm.jycshu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="ztenddate" label="停借至">
            <el-date-picker
              v-model="xzbzForm.ztenddate"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="yycshu" label="预约次数">
            <el-input clearable disabled v-model="xzbzForm.yycshu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="jzrqi" label="截止日期">
            <el-date-picker
              v-model="xzbzForm.jzrqi"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="xjcshu" label="续借次数">
            <el-input clearable disabled v-model="xzbzForm.xjcshu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="bzrqi" label="办证时间">
            <el-date-picker
              disabled
              v-model="xzbzForm.bzrqi"
              value-format="yyyy-MM-dd HH:mm:ss"
              type="date"
              placeholder="请选择"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            class="xzbz-form-item"
            prop="gjhjcshu"
            label="馆际互借次数"
          >
            <el-input clearable disabled v-model="xzbzForm.gjhjcshu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="yajin" label="读者押金">
            <el-input
              disabled
              v-only-num.float="xzbzForm.yajin"
              v-model="xzbzForm.yajin"
              placeholder="请输入读者押金"
            ></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="wzcshu" label="违章次数">
            <el-input clearable disabled v-model="xzbzForm.wzcshu"></el-input>
          </el-form-item>
          <el-form-item
            v-if="false"
            class="xzbz-form-item"
            prop="jifen"
            label="积分"
          >
            <el-input clearable disabled v-model="xzbzForm.jifen"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="qkuan" label="欠款">
            <el-input clearable disabled v-model="xzbzForm.qkuan"></el-input>
          </el-form-item>
          <el-form-item
            class="xzbz-form-item"
            prop="otherCode"
            label="其它证号"
          >
            <el-input clearable v-model="xzbzForm.otherCode"></el-input>
          </el-form-item>
          <span></span>
          <p class="side-wrap-content-title">个人信息</p>
          <el-form-item
            class="xzbz-form-item require"
            prop="xming"
            label="姓名"
            ref="item_xming"
          >
            <el-input clearable v-model="xzbzForm.xming"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="dzdw" label="读者单位">
            <el-input clearable v-model="xzbzForm.dzdw"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="xingbie" label="性别">
            <el-radio-group v-model="xzbzForm.xingbie">
              <el-radio :label="true">男</el-radio>
              <el-radio :label="false">女</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item
            v-if="addMode === '学校馆'"
            class="xzbz-form-item"
            prop="xjh"
            label="学籍号"
          >
            <el-input clearable v-model="xzbzForm.xjh"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zjlx" label="证件类型">
            <el-select filterable v-model="xzbzForm.zjlx">
              <el-option
                v-for="item in zjlxList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="addMode === '学校馆'"
            class="xzbz-form-item"
            prop="ban"
            label="班"
          >
            <el-input clearable v-model="xzbzForm.ban"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zjhma" label="证件号码">
            <el-input
              @blur="setDefaultPass($event, 3)"
              clearable
              v-model="xzbzForm.zjhma"
            ></el-input>
          </el-form-item>
          <el-form-item
            v-if="addMode === '学校馆'"
            class="xzbz-form-item"
            prop="ji"
            label="级"
          >
            <el-input clearable v-model="xzbzForm.ji"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="csrqi" label="出生日期">
            <el-date-picker
              v-model="xzbzForm.csrqi"
              type="date"
              placeholder="请选择"
              value-format="yyyy-MM-dd"
            ></el-date-picker>
          </el-form-item>
          <el-form-item
            v-if="addMode === '学校馆'"
            class="xzbz-form-item"
            prop="xueduan"
            label="学段"
          >
            <el-select filterable v-model="xzbzForm.xueduan">
              <el-option
                v-for="item in xueduanList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="shouji" label="手机号">
            <el-input
              @blur="setDefaultPass($event, 2)"
              clearable
              v-model="xzbzForm.shouji"
            ></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zhuanye" label="专业">
            <el-select filterable v-model="xzbzForm.zhuanye">
              <el-option
                v-for="item in zhuanyeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zhiye" label="职业">
            <el-select filterable v-model="xzbzForm.zhiye">
              <el-option
                v-for="item in zhiyeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="dianhua" label="固定电话">
            <el-input clearable v-model="xzbzForm.dianhua"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zhiwu" label="职务">
            <el-select filterable v-model="xzbzForm.zhiwu">
              <el-option
                v-for="item in zhiwuList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="dzyjian" label="E m a i l">
            <el-input clearable v-model="xzbzForm.dzyjian"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="zcheng" label="职称">
            <el-select filterable v-model="xzbzForm.zcheng">
              <el-option
                v-for="item in zchengList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="minzu" label="民族">
            <el-input clearable v-model="xzbzForm.minzu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="xueli" label="学历">
            <el-select filterable v-model="xzbzForm.xueli">
              <el-option
                v-for="item in xueliList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="jiguan" label="籍贯">
            <el-input clearable v-model="xzbzForm.jiguan"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="dizhi" label="地址">
            <el-input clearable v-model="xzbzForm.dizhi"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="xingqu" label="兴趣">
            <el-input clearable v-model="xzbzForm.xingqu"></el-input>
          </el-form-item>
          <el-form-item class="xzbz-form-item" prop="beizhu" label="备注">
            <el-input clearable v-model="xzbzForm.beizhu"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button
            size="mini"
            class="el-button__reset"
            @click="reset('xzbzForm')"
            >重置</el-button
          >
          <el-button size="mini" @click="closeWrap('xzbzForm')">取消</el-button>
          <el-button size="mini" @click="saveForm('xzbzForm')" type="primary"
            >保存</el-button
          >
        </div>
      </template>
    </side-wrap>
    <!--  **修改面板**  -->
    <side-wrap v-show="xgdzWrap" width="850px">
      <template v-slot:header>
        <el-button
          size="mini"
          class="close-side-wrap"
          @click="closeWrap('xgdzForm')"
          icon="el-icon-close"
        ></el-button>
        <el-tabs else type="border-card" lazy @tab-click="tabClick">
          <el-tab-pane id="reader" label="修改读者信息"></el-tab-pane>
          <el-tab-pane id="log" label="读者日志"></el-tab-pane>
        </el-tabs>
      </template>
      <div>
        <div v-if="!paneName" class="side-wrap-content">
          <div class="side-wrap-toolbar">
            <el-button size="mini" type="text" @click="dealFunc(1)">
              <icon-svg icon-class="icon-huifu"></icon-svg>恢复
            </el-button>
            <el-button size="mini" type="text" @click="dealFunc(3)">
              <icon-svg icon-class="icon-yanzheng"></icon-svg>验证
            </el-button>
            <el-button size="mini" type="text" @click="dealFunc(2)">
              <icon-svg icon-class="icon-zhengjianguashi"></icon-svg>挂失
            </el-button>
            <el-button size="mini" type="text" @click="zanting">
              <icon-svg icon-class="icon-zanting"></icon-svg>暂停
            </el-button>
            <el-button size="mini" type="text" @click="dealFunc(5)">
              <icon-svg icon-class="icon-zhuxiao"></icon-svg>注销
            </el-button>
            <el-button size="mini" type="text" @click="dealFunc(6)">
              <icon-svg icon-class="icon-tuizheng"></icon-svg>退证
            </el-button>
            <el-button size="mini" type="text" @click="yqiDialogVisible = true">
              <icon-svg icon-class="icon-yanqi"></icon-svg>延期
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="hzhengDialogVisible = true"
            >
              <icon-svg icon-class="icon-huanzheng"></icon-svg>换证
            </el-button>
            <el-button
              size="mini"
              type="text"
              @click="sfeiDialogVisible = true"
            >
              <icon-svg icon-class="icon-shoufei"></icon-svg>收费
            </el-button>
            <el-button size="mini" type="text" @click="dealFunc(10)">
              <icon-svg icon-class="icon-tuifei"></icon-svg>退费
            </el-button>
          </div>
          <el-form
            ref="xgdzForm"
            :rules="xgdzRules"
            class="side-wrap-form"
            :model="xgdzForm"
            size="mini"
          >
            <p class="side-wrap-content-title">读者信息</p>
            <p></p>
            <div class="picture-info-item">
              <div class="fingerprint" v-if="false">
                <div class="picture-box">
                  <icon-svg
                    style="color: #838F9D"
                    v-if="xgdzForm.fingerprint || xgdzForm.fingerprint === '0'"
                    icon-class="icon-btn-ico-7"
                  ></icon-svg>
                  <icon-svg v-else icon-class="icon-btn-ico-7"></icon-svg>
                </div>
                <div class="finger__content">
                  <finger-print
                    @getFingerPrint="getFingerPrint"
                    compareTemplate="121553"
                    :actions="['register']"
                  ></finger-print>
                  <el-button size="mini" @click="delFingerPrint('edit')"
                    >删除指纹</el-button
                  >
                </div>
              </div>
              <div class="userface">
                <div class="picture-box">
                  <el-upload
                    class="avatar-uploader"
                    :action="IMG_URL + '/api/p/img/upload'"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess2"
                    :before-upload="beforeAvatarUpload"
                    :data="imageData"
                  >
                    <el-image
                      v-if="xgdzForm.picture"
                      class="avatar"
                      style="width: 110px; height: 150px"
                      :src="
                        `${IMG_URL}/api/p/img/url?img=${this.xgdzForm.picture}`
                      "
                      fit="contain"
                    ></el-image>
                    <icon-svg v-else icon-class="icon-yonghu"></icon-svg>
                    <el-button
                      size="mini"
                      class="avatar-uploader-button"
                      type="primary"
                      >更换照片</el-button
                    >
                  </el-upload>
                </div>
              </div>
            </div>
            <el-form-item
              class="xzbz-form-item require"
              prop="dzzhao"
              label="读者证号"
            >
              <el-input clearable v-model="xgdzForm.dzzhao"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item"></el-form-item>
            <el-form-item
              class="xzbz-form-item require"
              prop="libid"
              label="成员馆"
            >
              <el-select
                filterable
                disabled
                v-model="xgdzForm.libid"
                placeholder="选择成员馆"
              >
                <el-option
                  v-for="item in libListSelect"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item"></el-form-item>
            <el-form-item
              class="xzbz-form-item require"
              prop="dzlxid"
              label="读者类型"
            >
              <el-select
                filterable
                v-model="xgdzForm.dzlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in readerTypeList"
                  :key="item.dzlxid"
                  :label="item.mcheng"
                  :value="item.dzlxid"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="false"
              class="xzbz-form-item require"
              prop="jifen"
              label="积分值"
              ref="item_jfz"
            >
              <el-input
                clearable
                v-model="xgdzForm.jifen"
                ref="jfzInput"
                placeholder="请输入最低分值"
              ></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item"></el-form-item>
            <el-form-item
              class="xzbz-form-item"
              v-if="false"
              prop="smrz"
              label="实名认证"
            >
              <el-select filterable v-model="xgdzForm.smrz">
                <el-option
                  v-for="item in smrzArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="libMingcheng"
              label="状态"
            >
              <el-select filterable v-model="xgdzForm.ztai">
                <el-option
                  v-for="item in ztaiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item"></el-form-item>
            <el-form-item
              class="xzbz-form-item require"
              prop="mima"
              label="密码"
            >
              <el-input clearable v-model="xgdzForm.mima"></el-input>
            </el-form-item>
            <p class="side-wrap-content-title">其他信息</p>
            <el-form-item class="xzbz-form-item" prop="qyrqi" label="启用日期">
              <el-date-picker
                v-model="xgdzForm.qyrqi"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="jycshu" label="借阅次数">
              <el-input clearable disabled v-model="xgdzForm.jycshu"></el-input>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="ztenddate"
              label="停借至"
            >
              <el-date-picker
                disabled
                v-model="xgdzForm.ztenddate"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="yycshu" label="预约次数">
              <el-input clearable disabled v-model="xgdzForm.yycshu"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="jzrqi" label="截止日期">
              <el-date-picker
                v-model="xgdzForm.jzrqi"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="xjcshu" label="续借次数">
              <el-input clearable disabled v-model="xgdzForm.xjcshu"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="bzrqi" label="办证时间">
              <el-date-picker
                disabled
                v-model="xgdzForm.bzrqi"
                value-format="yyyy-MM-dd HH:mm:ss"
                type="date"
                placeholder="请选择"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="gjhjcshu"
              label="馆际互借次数"
            >
              <el-input
                clearable
                disabled
                v-model="xgdzForm.gjhjcshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="yajin" label="读者押金">
              <el-input disabled clearable v-model="xgdzForm.yajin"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="wzcshu" label="违章次数">
              <el-input clearable disabled v-model="xgdzForm.wzcshu"></el-input>
            </el-form-item>
            <el-form-item
              v-if="false"
              class="xzbz-form-item"
              prop="jifen"
              label="积分"
            >
              <el-input clearable disabled v-model="xgdzForm.jifen"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="qkuan" label="欠款">
              <el-input clearable disabled v-model="xgdzForm.qkuan"></el-input>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="otherCode"
              label="其它证号"
            >
              <el-input clearable v-model="xgdzForm.otherCode"></el-input>
            </el-form-item>
            <span></span>
            <p class="side-wrap-content-title">个人信息</p>
            <el-form-item
              class="xzbz-form-item require"
              prop="xming"
              label="姓名"
            >
              <el-input clearable v-model="xgdzForm.xming"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="dzdw" label="读者单位">
              <el-input clearable v-model="xgdzForm.dzdw"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="xingbie" label="性别">
              <el-radio-group v-model="xgdzForm.xingbie">
                <el-radio :label="true">男</el-radio>
                <el-radio :label="false">女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-if="editMode === '学校馆'"
              class="xzbz-form-item"
              prop="xjh"
              label="学籍号"
            >
              <el-input clearable v-model="xgdzForm.xjh"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zjlx" label="证件类型">
              <el-select filterable v-model="xgdzForm.zjlx">
                <el-option
                  v-for="item in zjlxList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              v-if="editMode === '学校馆'"
              class="xzbz-form-item"
              prop="ban"
              label="班"
            >
              <el-input clearable v-model="xgdzForm.ban"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zjhma" label="证件号码">
              <el-input clearable v-model="xgdzForm.zjhma"></el-input>
            </el-form-item>
            <el-form-item
              v-if="editMode === '学校馆'"
              class="xzbz-form-item"
              prop="ji"
              label="级"
            >
              <el-input clearable v-model="xgdzForm.ji"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="csrqi" label="出生日期">
              <el-date-picker
                v-model="xgdzForm.csrqi"
                type="date"
                placeholder="请选择"
                value-format="yyyy-MM-dd"
              ></el-date-picker>
            </el-form-item>
            <el-form-item
              v-if="editMode === '学校馆'"
              class="xzbz-form-item"
              prop="xueduan"
              label="学段"
            >
              <el-select filterable v-model="xgdzForm.xueduan">
                <el-option
                  v-for="item in xueduanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="shouji" label="手机号">
              <el-input clearable v-model="xgdzForm.shouji"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zhuanye" label="专业">
              <el-select filterable v-model="xgdzForm.zhuanye">
                <el-option
                  v-for="item in zhuanyeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zhiye" label="职业">
              <el-select filterable v-model="xgdzForm.zhiye">
                <el-option
                  v-for="item in zhiyeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="dianhua"
              label="固定电话"
            >
              <el-input clearable v-model="xgdzForm.dianhua"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zhiwu" label="职务">
              <el-select filterable v-model="xgdzForm.zhiwu">
                <el-option
                  v-for="item in zhiwuList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="xzbz-form-item"
              prop="dzyjian"
              label="E m a i l"
            >
              <el-input clearable v-model="xgdzForm.dzyjian"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="zcheng" label="职称">
              <el-select filterable v-model="xgdzForm.zcheng">
                <el-option
                  v-for="item in zchengList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="minzu" label="民族">
              <el-input clearable v-model="xgdzForm.minzu"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="xueli" label="学历">
              <el-select filterable v-model="xgdzForm.xueli">
                <el-option
                  v-for="item in xueliList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="jiguan" label="籍贯">
              <el-input clearable v-model="xgdzForm.jiguan"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="dizhi" label="地址">
              <el-input clearable v-model="xgdzForm.dizhi"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="xingqu" label="兴趣">
              <el-input clearable v-model="xgdzForm.xingqu"></el-input>
            </el-form-item>
            <el-form-item class="xzbz-form-item" prop="beizhu" label="备注">
              <el-input clearable v-model="xgdzForm.beizhu"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div v-if="paneName" class="log-pane">
          <el-table
            :data="logTableData"
            border=""
            loading="logLoading"
            style="width: 100%"
          >
            <el-table-column
              show-overflow-tooltip
              prop="dzid"
              label="读者证号"
              width="140"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="operatorId"
              label="操作员"
              width="100"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="content"
              label="操作内容"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="opertime"
              label="操作时间"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <div v-if="!paneName" class="side-wrap-footer">
          <el-button
            size="mini"
            class="el-button__reset"
            @click="reset('xgdzForm')"
            >重置</el-button
          >
          <el-button size="mini" @click="closeWrap('xgdzForm')">取消</el-button>
          <el-button size="mini" @click="saveForm('xgdzForm')" type="primary"
            >保存</el-button
          >
        </div>
      </template>
    </side-wrap>
    <!--读者批管理-->
    <side-wrap v-show="dzpglWrap" width="850px">
      <template v-slot:header>
        <el-button
          size="mini"
          class="close-side-wrap"
          @click="closeWrap('dzpglForm')"
          icon="el-icon-close"
        ></el-button>
        <p class="pane-title">读者批管理</p>
      </template>
      <div class="side-wrap-content">
        <div class="ztpcl-item">
          <p>
            读者状态整体更换操作，可以实现批量修改读者信息，该操作不能回退，请谨慎操作！
          </p>
          <label>
            <span>已选择{{ this.totalCount }}个读者信息</span>&nbsp;&nbsp;
            <el-button
              size="mini"
              style="padding: 8px 20px;"
              @click="delBatchReader('dzpglForm')"
              >删除</el-button
            >
          </label>
          <br />
          <div class="edit__content">
            <el-form
              class="custom__form"
              ref="dzpglForm"
              label-width="85px"
              :model="dzpglForm"
              :rules="dzpglFormRules"
              size="mini"
            >
              <div class="form__type">
                <div></div>
                <el-form-item class="item" prop="dzdw" label="读者单位">
                  <el-input clearable v-model="dzpglForm.dzdwUpdate"></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item
                  v-show="addMode === '学校馆'"
                  class="item"
                  prop="xduan"
                  label="学段"
                >
                  <el-input
                    clearable
                    v-model="dzpglForm.xduanUpdate"
                  ></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item
                  v-show="addMode === '学校馆'"
                  class="item"
                  prop="ban"
                  label="班"
                >
                  <el-input clearable v-model="dzpglForm.banUpdate"></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item
                  v-show="addMode === '学校馆'"
                  class="item"
                  prop="ji"
                  label="级"
                >
                  <el-input clearable v-model="dzpglForm.jiUpdate"></el-input>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item class="item" prop="jzrq" label="截止日期">
                  <el-date-picker
                    type="date"
                    value-format="yyyy-MM-dd"
                    v-model="dzpglForm.jzrqUpdate"
                    placeholder="选择日期"
                  ></el-date-picker>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item class="item" prop="ztai" label="证件状态">
                  <el-select filterable v-model="dzpglForm.ztaiUpdate">
                    <el-option
                      v-for="item in ztaiList"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item></el-form-item>
                <el-form-item class="item" prop="integral" label="积分">
                  <el-input
                    clearable
                    type="number"
                    v-model="dzpglForm.integral"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
            <el-button
              size="mini"
              type="primary"
              style="padding: 8px 20px;margin-left: 85px;"
              @click="editBatchReader('dzpglForm')"
              >确定</el-button
            >
          </div>
        </div>
      </div>
      <template v-slot:footer>
        <div class="side-wrap-footer">
          <el-button size="mini" v-show="false">取消</el-button>
          <el-button size="mini" @click="closeWrap('dzpglForm')"
            >关闭</el-button
          >
        </div>
      </template>
    </side-wrap>
    <!--**暂停功能**-->
    <el-dialog
      title="暂停"
      :visible.sync="ztingDialogVisible"
      width="640px"
      :before-close="handleClose"
    >
      <div class="el-dialog-item">
        <el-radio-group v-model="ztingData.ztfshi">
          <el-radio :label="true"
            >暂停至某天：
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd"
              v-model="ztingData.date"
              type="date"
              placeholder="选择时间"
            ></el-date-picker>
          </el-radio>
          <el-radio :label="false"
            >暂停多少天：
            <el-input size="mini" clearable v-model="ztingData.days"></el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="ztingFunc"
          >确 定</el-button
        >
        <el-button size="mini" @click="ztingDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!--**延期功能**-->
    <el-dialog
      title="延期"
      :visible.sync="yqiDialogVisible"
      width="640px"
      :before-close="handleClose"
    >
      <div class="el-dialog-item">
        <el-radio-group v-model="yqiData.yxfshi">
          <el-radio :label="true"
            >截止时间：
            <el-date-picker
              size="mini"
              value-format="yyyy-MM-dd"
              v-model="yqiData.date"
              type="date"
              placeholder="选择时间"
            ></el-date-picker>
          </el-radio>
          <el-radio :label="false"
            >有效天数：
            <el-input size="mini" clearable v-model="yqiData.days"></el-input>
          </el-radio>
        </el-radio-group>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="yanqiFunc"
          >确 定</el-button
        >
        <el-button size="mini" @click="yqiDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!--**换证功能**-->
    <el-dialog
      title="换证"
      :visible.sync="hzhengDialogVisible"
      width="640px"
      :before-close="handleClose"
    >
      <div class="el-dialog-item">
        <label>新证号：</label>
        <el-input size="mini" v-model="hzhengData.dzzhao"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="huanzhengFunc"
          >确 定</el-button
        >
        <el-button size="mini" @click="hzhengDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
    <!--**收费功能**-->
    <el-dialog
      title="收费"
      :visible.sync="sfeiDialogVisible"
      width="640px"
      :before-close="handleClose"
      @close="handleClose"
    >
      <div class="el-dialog-item">
        <label>收费项目：</label>
        <el-select filterable size="mini" v-model="sfeiData.sfxm">
          <el-option
            v-for="item in sfList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div class="el-dialog-item">
        <label>收费金额：</label>
        <el-input
          size="mini"
          v-only-num.float="sfeiData.jine"
          v-model="sfeiData.jine"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" type="primary" @click="shoufeiFunc"
          >确 定</el-button
        >
        <el-button size="mini" @click="sfeiDialogVisible = false"
          >取 消</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import dayjs from "dayjs";
import { IMG_URL } from "utils/base";
import { getToken } from "utils/auth";
import { downLoadExcel } from "utils/utils";
import FingerPrint from "components/FingerPrint";
import SideWrap from "components/SideWrap";

import {
  readerManagerList,
  readerManagerSave,
  readerManagerDel,
  readerManagerUpdate,
  IDNOIsExist,
  readerType,
  readerManagerUpdateStatus,
  flowReaderLog,
  getReaderManager,
  readerBatchChange,
  getReaderDefaultPassType
} from "api/circulation";

import { mapGetters } from "vuex";

import {
  zjlxList,
  zhuanyeList,
  xueduanList,
  zhiyeList,
  zhiwuList,
  zchengList,
  xueliList,
  yajinList,
  sfList,
  qkuanList,
  sexList,
  flagList,
  ztaiList_,
  ztaiList,
  optionList
} from "./dzglComponents/dzglOption.js";

export default {
  name: "cir_dzgl",
  computed: {
    ...mapGetters(["libListSelect"])
  },
  components: {
    SideWrap,
    FingerPrint
  },
  data() {
    var validateDzzhao = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入读者证号"));
      } else {
        IDNOIsExist({
          dzzhao: value
        }).then(res => {
          if (res.data) {
            callback(new Error("此读者证号已存在，请重新输入"));
          } else {
            callback();
          }
        });
      }
    };
    var valiPassWord = (rule, value, callback) => {
      var reg = /^[A-Za-z0-9]+$/;
      if (reg.test(value)) {
        callback();
      } else if (value === "") {
        callback(new Error("密码不能为空"));
      } else {
        callback(new Error("密码不能有中文字符"));
      }
    };
    this.zjlxList = zjlxList;
    this.zhuanyeList = zhuanyeList;
    this.xueduanList = xueduanList;
    this.zhiyeList = zhiyeList;
    this.zhiwuList = zhiwuList;
    this.zchengList = zchengList;
    this.xueliList = xueliList;
    this.yajinList = yajinList;
    this.sfList = sfList;
    this.ztaiList_ = ztaiList_;
    this.ztaiList = ztaiList;
    this.qkuanList = qkuanList;
    this.sexList = sexList;
    this.flagList = flagList;

    this.baseForm = {
      smrz: 0,
      dzzhao: "",
      xming: "",
      ztai: "正常",
      mima: "",
      dzlxid: "",
      zjlx: "",
      zjhma: "",
      jzrqi: "",
      qyrqi: dayjs().format("YYYY-MM-DD"),
      bzrqi: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      libid: this.$store.getters.userInfo.libId,
      zhuanye: "其他",
      zhiwu: "无",
      zcheng: "无",
      xueli: "其他",
      minzu: "",
      csrqi: "",
      xingbie: true,
      shouji: "",
      dianhua: "",
      dizhi: "",
      youbian: "",
      dzyjian: "",
      jiguan: "",
      xingqu: "",
      yajin: "0",
      zpian: "",
      zhiye: "其他",
      ztstartdate: "",
      ztenddate: "",
      dzdw: "",
      beizhu: "",
      openid: "",
      zpianyshi: "",
      xjh: "",
      xueduan: "",
      ban: "",
      ji: "",
      checked: "",
      fingerprint: "",
      picture: "",
      jycshu: "0",
      yycshu: "0",
      xjcshu: "0",
      wzcshu: "0",
      gjhjcshu: "0",
      qkuan: "0",
      libYouxiang: "",
      jifen: "",
      otherCode: ""
    };
    return {
      // 实名认证
      smrzArr: [{ label: "未认证", value: 0 }, { label: "已认证", value: 1 }],
      optionList: optionList,
      imageData: {
        userToken: getToken(),
        imgType: "reader"
      },
      IMG_URL: IMG_URL,
      imageUrl: "",
      more: false,
      xzbzWrap: false,
      xgdzWrap: false,
      tableMode: "",
      dzpglWrap: false,
      //读者批管理
      dzpglFormRules: {
        integral: [
          {
            pattern: /^(-)?[1-9][0-9]*$/,
            message: "只允许输入正整数或负整数",
            trigger: "blur"
          }
        ]
      },
      dzpglForm: {
        dzdwUpdate: "",
        jzrqUpdate: "",
        xduanUpdate: "",
        banUpdate: "",
        jiUpdate: "",
        ztaiUpdate: "",
        integral: ""
      },
      //暂停
      ztingDialogVisible: false,
      ztingData: {
        ztfshi: false,
        date: "",
        days: 1
      },
      //延期
      yqiDialogVisible: false,
      yqiData: {
        yxfshi: false,
        date: "",
        days: 1
      },
      hzhengDialogVisible: false,
      hzhengData: {
        dzzhao: ""
      },
      //收费
      sfeiDialogVisible: false,
      sfeiData: {
        sfxm: 1,
        jine: 0
      },
      //表格参数
      libid: this.$store.getters.userInfo.libId,
      ztai: "",
      optionKey: "dzzhao",
      content: "",
      bzrqi_d1: "",
      bzrqi_d2: "",
      qyrqi_d1: "",
      qyrqi_d2: "",
      jzrqi_d1: "",
      jzrqi_d2: "",
      sex: "",
      qkuan: "",
      yajin: "",
      tableData: [],
      selectRow: [],
      loading: false,
      readerTypeList: [],
      paneName: 0,
      logTableData: [],
      //新增读者侧边栏
      addMode: "",
      tempForm: {},
      xzbzForm: {
        ...this.baseForm
      },
      yajinObj: {},
      xzbzRules: {
        dzzhao: [{ validator: validateDzzhao, trigger: "blur" }],
        libid: [{ required: true, message: "请选择成员馆", trigger: "change" }],
        dzlxid: [
          { required: true, message: "请选择读者类型", trigger: "change" }
        ],
        xming: [{ required: true, message: "请输入名称", trigger: "blur" }],
        mima: [{ validator: valiPassWord, trigger: "blur" }],
        jifen: [{ message: "请输入积分值", trigger: "blur" }]
      },
      //修改读者侧边栏
      editMode: "",
      xgdzRules: {
        dzzhao: [
          { required: true, message: "请输入读者证号", trigger: "blur" }
        ],
        libid: [{ required: true, message: "请选择成员馆", trigger: "change" }],
        dzlxid: [
          { required: true, message: "请选择读者类型", trigger: "change" }
        ],
        xming: [{ required: true, message: "请输入名称", trigger: "blur" }],
        mima: [{ validator: valiPassWord, trigger: "blur" }],
        jifen: [{ message: "请输入积分值", trigger: "blur" }]
      },
      xgdzForm: {},
      sign: false,
      readerStatus: "",
      totalCount: 0,
      param: {
        libid: this.$store.getters.userInfo.libId,
        pageNumber: 1,
        pageSize: 15
      }
    };
  },
  filters: {
    filterDate(val) {
      return dayjs(val).format("YYYY-MM-DD");
    }
  },
  methods: {
    getFilterList(value) {
      // 全部馆根据登录馆判断
      let mode = "";
      if (value === "") {
        mode = this.libListObj[this.$store.getters.userInfo.libId];
      } else {
        mode = this.libListObj[value];
      }
      if (mode === "学校馆") {
        this.optionList = optionList;
      } else {
        this.optionList = [
          { label: "读者证号", value: "dzzhao" },
          { label: "姓名", value: "xming" },
          { label: "手机", value: "shouji" },
          { label: "电话", value: "dianhua" },
          { label: "读者单位", value: "dzdw" },
          { label: "读者类型", value: "dzlxid" },
          { label: "证件号码", value: "zjhma" }
        ];
        if (["xjh", "xueduan", "ji", "ban"].includes(this.optionKey)) {
          this.optionKey = "dzzhao";
          this.content = "";
        }
      }
    },
    /** 获取读者类型列表 */
    getReaderTypeList() {
      let libId = this.$store.getters.userInfo.libId;
      if (this.sign) {
        libId = this.xgdzForm.libid;
      }
      readerType({
        libId,
        pageSize: 1000,
        pageNumber: 1
      }).then(res => {
        this.readerTypeList = [];
        res.data.filter(ele => {
          this.readerTypeList.push({
            mcheng: ele.mcheng,
            dzlxid: ele.dzlxid
          });
          this.yajinObj[ele.dzlxid] = ele.yajin;
        });
      });
    },
    //联动读者类型至押金
    linkYajin() {
      this.xzbzForm.yajin = this.yajinObj[this.xzbzForm.dzlxid];
    },
    addSpot(val) {
      val = "" + val;
      return parseFloat(val).toFixed(2);
    },
    /**获取读者管理列表 */
    getReaderManagerList() {
      this.loading = !this.loading;
      readerManagerList(this.param).then(res => {
        this.loading = false;
        // 全部馆根据登录馆
        if (this.param.libid === "") {
          this.tableMode = this.libListObj[this.$store.getters.userInfo.libId];
        } else {
          this.tableMode = this.libListObj[this.param.libid];
        }
        res.data.dataList.forEach(ele => {
          ele.sfxm = "";
          ele.qkuan = this.addSpot(ele.qkuan);
          ele.yajin = this.addSpot(ele.yajin);
        });

        this.tableData = res.data.dataList;
        this.totalCount = +res.data.totalElements;
      });
    },
    /**获取单个读者信息 */
    getReaderManager(dzid) {
      getReaderManager({
        dzid
      }).then(res => {
        if (res.code == 0) {
          res.data.qkuan = this.addSpot(res.data.qkuan);
          res.data.yajin = this.addSpot(res.data.yajin);
          this.xgdzForm = { ...res.data };
          this.tempForm = { ...res.data };
        }
      });
    },
    moreOption() {
      this.more = true;
    },
    multDel() {
      if (this.selectRow.length) {
        this.$confirm("确定要删除么?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }).then(() => {
          let dzid = "";
          this.selectRow.map(ele => {
            dzid += ele.dzid + ",";
          });
          readerManagerDel({
            dzid
          }).then(res => {
            if (res.code == 0) {
              this.param.pageNumber = 1;
              this.selectRow = [];
              this.getReaderManagerList();
              this.$message({
                type: "success",
                message: res.message
              });
            }
          });
        });
      }
    },

    multDealReader() {
      this.dzpglWrap = true;
    },

    addCard() {
      this.xzbzWrap = true;
      this.xzbzForm = {
        ...this.baseForm
      };
      this.$refs["xzbzForm"].resetFields();
      this.sign = false;
      this.getReaderTypeList();
      setTimeout(() => {
        this.$refs.dzzhaoInput.focus();
      }, 500);
    },
    print() {
      downLoadExcel("/api/e/flow/readerManager/readerManagerListExportExcel", {
        func_name_us: "dzgl",
        ...this.param
      });
    },
    search() {
      this.optionList.forEach(ele => {
        this.param[ele.value] = "";
      });
      this.param.libid = this.libid;
      this.param.ztai = this.ztai;
      this.param.sex = this.sex;
      this.param.yajin = this.yajin;
      this.param.qkuan = this.qkuan;
      this.param[this.optionKey] = this.content.replace(/^\s+|\s+$/g, "");
      this.param.bzrqi_d1 = this.bzrqi_d1;
      this.param.bzrqi_d2 = this.bzrqi_d2;
      this.param.qyrqi_d1 = this.qyrqi_d1;
      this.param.qyrqi_d2 = this.qyrqi_d2;
      this.param.jzrqi_d1 = this.jzrqi_d1;
      this.param.jzrqi_d2 = this.jzrqi_d2;
      this.param.pageNumber = 1;
      let tempParam = {};
      for (let key in this.param) {
        if (this.param[key]) {
          tempParam[key] = this.param[key];
        } else {
          null;
        }
      }
      this.param = {
        ...tempParam
      };
      this.getReaderTypeList();
      this.getReaderManagerList();
    },
    selectFunc(row) {
      this.selectRow = [...row];
    },
    rowClick(row) {
      this.$refs.multipleTable.toggleRowSelection(row);
    },

    closeWrap(formName) {
      this.xzbzWrap = false;
      this.xgdzWrap = false;
      this.dzpglWrap = false;
      this.sign = false;
      this.xzbzForm = { ...this.baseForm };
      this.xgdzForm = { ...this.baseForm };
      this.tempForm = { ...this.baseForm };
      this.$refs[formName].resetFields();
      for (const key in this.dzpglForm) {
        this.dzpglForm[key] = "";
      }
    },

    //读者状态批管理
    delBatchReader(formName) {
      this.$confirm("确定要批量删除读者么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        readerBatchChange({
          delUpdate: true,
          ...this.param
        }).then(res => {
          this.$message.success(res.message);
          for (const key in this.dzpglForm) {
            this.dzpglForm[key] = "";
          }
          this.$refs[formName].resetFields();
          this.getReaderManagerList();
          this.closeWrap("dzpglWrap");
        });
      });
    },
    editBatchReader(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$confirm(`确认修改这批读者的部分信息?`, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            readerBatchChange({
              integralUpdate: 1,
              ...this.dzpglForm,
              ...this.param
            }).then(res => {
              this.$message.success(res.message);
              for (const key in this.dzpglForm) {
                this.dzpglForm[key] = "";
              }
              this.$refs[formName].resetFields();
              this.getReaderManagerList();
              this.closeWrap("dzpglWrap");
            });
          });
        }
      });
    },

    saveForm(formName) {
      this.$refs[formName].validate((valid, err) => {
        if (err && Object.keys(err).length > 0) {
          let keysArr = Object.keys(err);
          this.$refs[`item_${keysArr[0]}`].$el.scrollIntoView();
        }
        if (valid) {
          if (formName === "xzbzForm") {
            readerManagerSave({
              ...this.xzbzForm,
              bzrqi: "" // 置空，后台会自动保存最新时间
            }).then(res => {
              if (res.code == 0) {
                this.pageNumber = 1;
                this.getReaderManagerList();
                this.xzbzWrap = !this.xzbzWrap;
                this.$message({
                  type: "success",
                  message: res.message
                });
              }
            });
          }
          if (formName === "xgdzForm") {
            readerManagerUpdate({
              ...this.xgdzForm,
              bzrqi: "" // 置空，后台会自动保存最新时间
            }).then(res => {
              if (res.code == 0) {
                this.pageNumber = 1;
                this.getReaderManagerList();
                this.xgdzWrap = !this.xgdzWrap;
                this.$message({
                  type: "success",
                  message: res.message
                });
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    reset(formName) {
      this.$refs[formName].resetFields();
      if (formName == "xzbzForm") {
        this.xzbzForm = { ...this.baseForm };
      } else {
        this.xgdzForm = { ...this.tempForm };
      }
    },
    /**指纹采集 */
    getFingerPrint(code) {
      this.xzbzForm.fingerprint = code;
      this.xgdzForm.fingerprint = code;
    },
    /**删除指纹 */
    delFingerPrint(item) {
      if (item == "add") {
        if (this.xzbzForm.fingerprint) {
          this.xzbzForm.fingerprint = "";
          this.$message({
            type: "success",
            message: "已删除"
          });
        } else {
          this.$message({
            type: "warning",
            message: "请先采集指纹"
          });
        }
      } else if (item == "edit") {
        if (this.xgdzForm.fingerprint) {
          this.$confirm("确定要删除指纹么?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }).then(() => {
            this.xgdzForm.fingerprint = "";
            this.$message({
              type: "success",
              message: "已删除"
            });
          });
        } else {
          this.$message({
            type: "warning",
            message: "请先采集指纹"
          });
        }
      }
    },
    /**上传图片 -新增*/
    handleAvatarSuccess(res) {
      if (res.code == 0) {
        this.xzbzForm.picture = res.data.imgUrl;
      }
    },
    /**上传图片 -修改*/
    handleAvatarSuccess2(res) {
      if (res.code == 0) {
        this.$set(this.xgdzForm, "picture", res.data.imgUrl);
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 1;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    ztingFunc() {
      readerManagerUpdateStatus({
        operateType: 4,
        dzid: this.xgdzForm.dzid,
        ztfshi: this.ztingData.ztfshi,
        deadline: this.ztingData.date,
        days: this.ztingData.days
      }).then(res => {
        if (res.code == 0) {
          this.ztingDialogVisible = false;
          this.getReaderManager(this.xgdzForm.dzid);
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    zanting() {
      this.ztingDialogVisible = true;
      this.ztingData.date = this.xgdzForm.ztenddate;
    },
    yanqiFunc() {
      readerManagerUpdateStatus({
        operateType: 7,
        dzid: this.xgdzForm.dzid,
        yxfshi: this.yqiData.yxfshi,
        deadline: this.yqiData.date,
        days: this.yqiData.days
      }).then(res => {
        this.getReaderManager(this.xgdzForm.dzid);
        this.yqiDialogVisible = false;
        this.$message({
          type: "success",
          message: res.message
        });
      });
    },
    shoufeiFunc() {
      readerManagerUpdateStatus({
        operateType: 9,
        dzid: this.xgdzForm.dzid,
        sfxm: this.sfeiData.sfxm,
        money: this.sfeiData.jine || 0
      }).then(res => {
        if (res.code == 0) {
          this.getReaderManager(this.xgdzForm.dzid);
          this.sfeiDialogVisible = false;
          this.sfeiData.jine = 0;
          this.sfeiData.sfxm = 1;
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    dealFunc(operateType) {
      readerManagerUpdateStatus({
        operateType,
        dzid: this.xgdzForm.dzid
      }).then(res => {
        if (res.code == 0) {
          this.getReaderManager(this.xgdzForm.dzid);
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    huanzhengFunc() {
      readerManagerUpdateStatus({
        operateType: 8,
        dzzhao: this.hzhengData.dzzhao,
        dzid: this.xgdzForm.dzid
      }).then(res => {
        if (res.code == 0) {
          this.getReaderManager(this.xgdzForm.dzid);
          this.hzhengDialogVisible = false;
          this.$message({
            type: "success",
            message: res.message
          });
        }
      });
    },
    //获取读者日志
    getReaderLog(row) {
      this.logLoading = true;
      flowReaderLog({
        dzid: row.dzid,
        pageSize: 200,
        pageNumber: 1
      }).then(res => {
        this.logLoading = false;
        this.logTableData = [...res.data.dataList];
      });
    },
    handleEdit(row) {
      this.xgdzWrap = true;
      this.editMode = this.libListObj[row.libid];
      this.xgdzForm = { ...row };
      this.tempForm = { ...row };
      this.getReaderLog(row);
      if (!this.paneName) {
        this.$refs.xgdzForm.resetFields();
        this.sign = true;
        this.getReaderTypeList();
      }
    },
    handleDel(dzid) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        readerManagerDel({
          dzid
        }).then(res => {
          if (res.code == 0) {
            this.param.pageNumber = 1;
            this.getReaderManagerList();
            this.$message({
              type: "success",
              message: res.message
            });
          }
        });
      });
    },
    tabClick(data) {
      this.paneName = Number(data.paneName);
      if (this.paneName) {
        this.getReaderLog(this.xgdzForm);
      }
    },
    handleClose() {
      this.yqiDialogVisible = false;
      this.hzhengDialogVisible = false;
      this.ztingDialogVisible = false;
      this.sfeiDialogVisible = false;
      this.sfeiData.jine = 0;
      this.sfeiData.sfxm = 1;
    },
    handleSizeChange(pageSize) {
      this.param.pageSize = pageSize;
      this.param.pageNumber = 1;
      this.getReaderManagerList();
    },
    handleCurrentChange(pageNumber) {
      this.param.pageNumber = pageNumber;
      this.getReaderManagerList();
    },
    // 获取默认密码状态
    getReaderDefaultPassType() {
      getReaderDefaultPassType().then(res => {
        this.dzhe_mima = res.data.dzhe_mima;
        this.dzhe_mima_type = res.data.dzhe_mima_type;
        if (this.dzhe_mima_type === 4) {
          this.baseForm.mima = this.dzhe_mima;
        }
      });
    },
    // 设置默认密码
    setDefaultPass(event, type) {
      if (this.xzbzForm.mima || type !== this.dzhe_mima_type) {
        return;
      }
      let defaultPass = event.target.value || "";
      this.xzbzForm.mima = defaultPass.substring(defaultPass.length - 6);
    }
  },
  created() {
    this.getReaderDefaultPassType();
    // 获取当前馆的类型
    this.libListObj = {};
    this.libListSelect.forEach(item => {
      if (item.value) {
        this.libListObj[item.value] = item.libType;
      }
    });
    let currentLibId = this.$store.getters.userInfo.libId;
    this.tableMode = this.libListObj[currentLibId];
    this.addMode = this.libListObj[currentLibId];
    this.getFilterList(this.tableMode);
  },
  mounted() {
    this.getReaderManagerList();
    this.$refs.focusInput.focus();
    if (this.$route.query.open) {
      this.addCard();
    }
  },
  watch: {
    more(val) {
      if (val) {
        // 展开
        let toolBarHeight = this.$refs.toolBar.scrollHeight;
        this.$refs.toolBar.style.height = toolBarHeight + "px";
        this.$refs.multipleTableBox.style.height = `calc(100% - ${toolBarHeight +
          2}px)`;
      } else {
        // 收缩
        this.$refs.toolBar.style.height = "32px";
        this.$refs.multipleTableBox.style.height = "calc(100% - 32px)";
      }
    }
  },
  activated() {
    this.getReaderDefaultPassType();
    // 获取当前馆的类型
    this.libListObj = {};
    this.libListSelect.forEach(item => {
      if (item.value) {
        this.libListObj[item.value] = item.libType;
      }
    });
  }
};
</script>
<style lang="less" scoped>
@import "~styles/commonContent.less";
</style>

<style lang="less">
@import "./dzglComponents/dzgl.less";
</style>
