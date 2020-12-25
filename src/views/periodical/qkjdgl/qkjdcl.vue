<!--
 * @Description: 
 * @Autor: zhihao.zhang
 * @Date: 2019-08-14 11:53:23
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-06 14:54:59
 -->
<template>
  <div class="per_qkjdcl common__content">
    <div class="content">
      <div class="content__header">
        <div class="header__filters">
          <el-select
            filterable
            class="header__filters_type group__filters_type"
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
            ref="FocusInput"
            class="group__filters_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keyup.native="
              handleBarCodeScanner(
                $event,
                val => (currentFilterVal = val),
                search
              )
            "
            @keydown.enter.native="delayFunc(search)"
          ></el-input>
          <el-button type="primary" size="mini" @click="search">
            <icon-svg icon-class="icon-btn-ico-2" />查询
          </el-button>
        </div>
      </div>
      <div class="content_container">
        <div class="content_pane_left">
          <td-content-header>
            <span>预订书目信息</span>
            <template v-slot:btns>
              <div class="header__ops">
                <el-button
                  size="mini"
                  type="primary"
                  @click="handleDirectBMPage('', '')"
                >
                  <icon-svg icon-class="icon-btn-ico-" />新增书目
                </el-button>
              </div>
            </template>
          </td-content-header>
          <div class="content__table">
            <el-table
              ref="JDSMXXTable"
              border=""
              v-loadmore="getJdsmxx"
              v-loading="loadding"
              :data="JDSMXXTable"
              @row-dblclick="smEdit"
              @row-click="storageRowFunc"
              stripe
              highlight-current-row
              style="width: 100%"
              height="100%"
            >
              <el-table-column
                type="index"
                label=" "
                align="center"
                width="35"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                width="145"
                prop="issn"
                label="ISSN"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="flhao"
                label="分类号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ztming"
                min-width="115"
                label="正题名"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="dghao"
                label="订购号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zrsming"
                label="责任者"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzhe"
                label="出版社"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="cbzqi"
                label="出版周期"
                width="70"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="qkjge"
                label="价格"
                width="87"
              ></el-table-column>
              <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="45"
              >
                <template slot-scope="scope">
                  <td-action-tool>
                    <template v-slot:menus>
                      <div
                        class="menu"
                        @click="
                          handleDirectBMPage(
                            scope.row.marcid,
                            scope.row.marctyid
                          )
                        "
                      >
                        编目
                      </div>
                    </template>
                  </td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="content_pane_right">
          <td-content-header>
            <span>记到总记录</span>
            <template v-slot:btns>
              <div class="header__ops">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="storageRow.marcid ? false : true"
                  @click="jdjlWarp"
                >
                  <icon-svg icon-class="icon-btn-ico-" />新增
                </el-button>
              </div>
            </template>
          </td-content-header>
          <div class="content__table">
            <div class="placeholder"></div>
            <el-table
              border
              v-loading="JDZJLoading"
              ref="JDZJLTable"
              :data="JDZJLTable"
              stripe
              highlight-current-row
              @row-dblclick="rowDblclick"
              @row-click="JDZJLStorageRowFunc"
              style="width: 99%;display: inline-block;"
              height="100%"
            >
              <el-table-column
                show-overflow-tooltip
                prop="jddd"
                label="预订部门"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="dgnf"
                label="订购年"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ydbhao"
                label="预订编号"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="jiage"
                label="单价"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zongqi"
                label="期数"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="ceshu"
                label="预订数"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="fuzhu"
                label="备注"
              ></el-table-column>
              <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="45"
              >
                <template slot-scope="scope">
                  <td-action-tool
                    :id="scope.row.qkydsmid"
                    :data="scope.row"
                    :index="scope.$index"
                    :ops="['edit', 'del']"
                    @handleEdit="handleEditJdjl"
                    @handleDel="jdzjlDel"
                  ></td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="content_pane_bottom">
          <td-content-header>
            <span>记到信息</span>
            <div class="tool_button">
              <p class="desc">状态：</p>
              <el-select
                filterable
                size="mini"
                v-model="infoStatus"
                @change="getJdxx"
              >
                <el-option
                  v-for="item in infoStatusList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
            <template v-slot:btns>
              <div class="header__ops">
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="JDXXSelectedRow.length ? false : true"
                  @click="openZdingWarp(1)"
                >
                  <icon-svg icon-class="icon-zhuangding" />装订
                </el-button>
                <el-button
                  size="mini"
                  type="primary"
                  :disabled="JDXXTable.length ? false : true"
                  @click="openZdingWarp(2)"
                >
                  <icon-svg icon-class="icon-zidongzhuangding" />自动装订
                </el-button>
              </div>
            </template>
          </td-content-header>
          <div class="content__table" ref="JDXXTableBox">
            <el-table
              ref="JDXXTable"
              border=""
              v-loading="JDXXLoading"
              :data="JDXXTable"
              stripe
              @row-dblclick="jdxxJdFunc_jd"
              @row-click="rowClick"
              @selection-change="JDXXSelectedRowFunc"
              style="width:100%;"
              height="100%"
            >
              <el-table-column
                type="selection"
                width="35"
                align="center"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="qi" label="记到期">
                <template slot-scope="scope">
                  <span class="g-row__check" @click="xxjdFunc(scope.row)">
                    {{ scope.row.qi }}
                  </span>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="zongfuben"
                label="总复本"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="yidao"
                label="已到数"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="weidao"
                label="未到数"
              ></el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="username"
                label="记到人"
              ></el-table-column>
              <el-table-column show-overflow-tooltip prop="ztai" label="状态">
                <template slot-scope="scope">
                  <div class="tip">
                    <i v-if="scope.row.ztai === '全部到馆'" class="qbdg"></i>
                    <i v-if="scope.row.ztai === '部分到馆'" class="bfdg"></i>
                    <i v-if="scope.row.ztai === '未到'" class="wd"></i>
                    <i v-if="scope.row.ztai === '停刊'" class="tk"></i>
                    <i v-if="scope.row.ztai === '催不到'" class="cbd"></i>
                    <i v-if="scope.row.ztai === '催缺'" class="cq"></i>
                    <i v-if="scope.row.ztai === '推迟出版'" class="tccb"></i>
                    <i v-if="scope.row.ztai === '装订'" class="zd"></i>
                    {{ scope.row.ztai }}
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                show-overflow-tooltip
                prop="shuoming"
                label="记到备注"
              ></el-table-column>
              <el-table-column
                fixed="right"
                align="center"
                label="操作"
                width="45"
              >
                <template slot-scope="scope">
                  <td-action-tool>
                    <template v-slot:menus>
                      <div class="menu" @click="jdxxJdFunc(1, scope.row)">
                        记到
                      </div>
                      <div class="menu" @click="xxjdFunc(scope.row)">
                        详细记到
                      </div>
                      <div
                        class="menu"
                        @click="jdxxDelFunc(scope.row.qiandaoid)"
                      >
                        删除记到
                      </div>
                      <div class="menu" @click="jdxxJdFunc(2, scope.row)">
                        取消记到
                      </div>
                      <div
                        class="menu"
                        @click="jdxxSaveTedingFunc(1, scope.row.qiandaoid)"
                      >
                        向前新增
                      </div>
                      <div
                        class="menu"
                        @click="jdxxSaveTedingFunc(2, scope.row.qiandaoid)"
                      >
                        向后新增
                      </div>
                      <div class="menu" @click="jdxxSaveFunc(scope.row)">
                        停刊
                      </div>
                      <div class="menu" @click="handleShowGCAllot(scope.row)">
                        馆藏分配
                      </div>
                    </template>
                  </td-action-tool>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <!-- 新增记到 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showSideWarp"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit" v-if="isAdd">新增记到记录</div>
            <div class="tit" v-else>编辑记到记录</div>
          </div>
          <i class="el-icon-close" @click="closeWarp(true)"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="jdjlForm"
          label-width="110px"
          :model="jdjlForm"
          :rules="jdjlFormRules"
        >
          <div class="form__type">
            <div class="tit">
              <span>记到记录</span>
            </div>
            <el-form-item
              class="item temp__item"
              prop="libMingcheng"
              label="成员馆"
            >
              <span v-text="jdjlForm.libMingcheng || '-'"></span>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item temp__item"
              prop="smkzhao"
              label="书目控制号"
            >
              <span v-text="jdjlForm.smkzhao || '-'"></span>
            </el-form-item>
            <el-form-item class="item" prop="gysid" label="供应商代码">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.gysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in gysList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ydbhao" label="预订编号">
              <el-input
                clearable
                size="small"
                v-model="jdjlForm.ydbhao"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="cbzq" label="出版周期">
              <el-select
                filterable
                size="small"
                @change="changeCbzq(jdjlForm.cbzq, jdjlForm)"
                v-model="jdjlForm.cbzq"
                placeholder="请选择"
                :disabled="notSelected"
              >
                <el-option
                  v-for="item in cbzqiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value + ',' + item.value2"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="yjhbid" label="原价货币类型">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.yjhbid"
                @change="yjhbLinkNum"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in hbList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="dgnf" label="订购年份">
              <el-date-picker
                :disabled="!isAdd"
                v-model="jdjlForm.dgnf"
                format="yyyy"
                value-format="yyyy"
                align="right"
                size="small"
                type="year"
                placeholder=""
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="yuanjia" label="原单价">
              <el-input
                clearable
                v-only-num.float="jdjlForm.yuanjia"
                size="small"
                @blur="changeNjia(jdjlForm)"
                v-model="jdjlForm.yuanjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zongqi" label="订购期数">
              <el-input
                clearable
                v-only-num="jdjlForm.zongqi"
                size="small"
                @blur="changeNjia(jdjlForm)"
                :disabled="notSelected"
                v-model="jdjlForm.zongqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="nianjia" label="原年价">
              <el-input
                clearable
                v-only-num.float="jdjlForm.nianjia"
                size="small"
                v-model="jdjlForm.nianjia"
                @blur="yjhbLinkNum"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ceshu" label="预订数量">
              <el-input
                type="text"
                size="small"
                v-only-num="jdjlForm.ceshu"
                v-model="jdjlForm.ceshu"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ydhbid" label="预订货币类型">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.ydhbid"
                @change="yjhbLinkNum"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in hbList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ydlaiyuan" label="文献来源">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.ydlaiyuan"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in dglyuanList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="jiage" label="预订单价">
              <el-input
                clearable
                v-only-num.float="jdjlForm.jiage"
                size="small"
                v-model="jdjlForm.jiage"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jzleixing" label="介质类型">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.jzleixing"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in jzlxingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ydnianjia" label="预订年价">
              <el-input
                clearable
                v-only-num.float="jdjlForm.ydnianjia"
                size="small"
                v-model="jdjlForm.ydnianjia"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zdfangshi" label="装订方式">
              <el-select
                filterable
                size="small"
                v-model="jdjlForm.zdfangshi"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdfshiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="dgh" label="订购号">
              <el-input
                clearable
                size="small"
                v-model="jdjlForm.dgh"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="jddd" label="预订部门">
              <el-input
                clearable
                size="small"
                v-model="jdjlForm.jddd"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="hexinqk" label="是否核心期刊">
              <el-checkbox-group v-model="jdjlForm.hexinqk">
                <el-checkbox name="type"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item></el-form-item>
            <el-form-item
              class="item overWidth__item"
              prop="fuzhu"
              label="备注"
            >
              <el-input
                clearable
                type="textarea"
                size="small"
                v-model="jdjlForm.fuzhu"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small" @click="closeWarp(false)">重置</el-button>
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="submitForm('jdjlForm')"
              >保存</el-button
            >
            <el-button size="small" @click="closeWarp(true)">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!--装订-->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showBindingSideWarp"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">装订</div>
          </div>
          <i class="el-icon-close" @click="closeZdingWarp"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="zdingForm"
          label-width="110px"
          :model="zdingForm"
          :rules="zdingFormRules"
        >
          <div class="form__type">
            <div class="tit">
              <span>新增装订</span>
            </div>
            <el-form-item class="item" prop="czid" label="馆藏地点">
              <el-select
                filterable
                size="small"
                v-model="zdingForm.czid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in czList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="ltlxid" label="流通类型">
              <el-select
                filterable
                size="small"
                v-model="zdingForm.ltlxid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in flowTypeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdlx" label="装订类型">
              <el-select
                filterable
                size="small"
                v-model="zdingForm.zdlx"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in zdleixngList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdjg" label="装订价格">
              <el-input
                clearable
                size="small"
                v-only-num.float="zdingForm.zdjg"
                v-model="zdingForm.zdjg"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ysid" label="预算代码">
              <el-select
                filterable
                size="small"
                v-model="zdingForm.ysid"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ysList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="zdfs" label="装订份数">
              <el-input
                clearable
                size="small"
                v-only-num="zdingForm.zdfs"
                v-model="zdingForm.zdfs"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="pihao" label="批号">
              <el-input
                clearable
                size="small"
                v-model="zdingForm.pihao"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
        <div class="tit">
          <span>装订描述</span>
        </div>
        <div class="zdingTable" ref="zdingWarpTable">
          <el-table
            border=""
            :data="zdingForm.zdingWarpTable"
            stripe
            style="width: 99%;display: inline-block;"
            height="100%"
          >
            <el-table-column
              show-overflow-tooltip
              prop="jdnian"
              label="记到年"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="djia"
              label="单价"
            ></el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="zdqi"
              label="装订期"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="small">重置</el-button>
          </div>
          <div>
            <el-button
              size="small"
              type="primary"
              @click="submitJDXXForm('zdingForm')"
              >保存</el-button
            >
            <el-button size="small" @click="closeZdingWarp">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 详细记到 -->
    <el-dialog
      title="详细记到"
      :visible.sync="dialogVisible"
      width="690px"
      :before-close="dialogClose"
    >
      <div class="edit__content">
        <el-form
          class="addForm custom__form"
          ref="xxjdForm"
          label-width="80px"
          :model="xxjdForm"
          :rules="xxjdFormRules"
        >
          <div class="form__type">
            <div></div>
            <el-form-item class="item" prop="ce" label="记到册数">
              <el-input
                @blur="linkZtai"
                clearable
                size="small"
                v-model="xxjdForm.ce"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="year" label="记到年">
              <el-input
                clearable
                size="small"
                v-model="xxjdForm.year"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="juan" label="记到卷">
              <el-input
                clearable
                size="small"
                v-model="xxjdForm.juan"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="qi" label="记到期">
              <el-input
                clearable
                disabled
                size="small"
                v-model="xxjdForm.qi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="zongqi" label="记到总期">
              <el-input
                clearable
                disabled
                size="small"
                v-model="xxjdForm.zongqi"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="username" label="记到人">
              <el-input
                clearable
                disabled
                size="small"
                v-model="xxjdForm.username"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="yingdaorq" label="应到日期">
              <el-date-picker
                v-model="xxjdForm.yingdaorq"
                type="date"
                size="small"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="shidaorq" label="实到日期">
              <el-date-picker
                v-model="xxjdForm.shidaorq"
                type="date"
                size="small"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="benqijg" label="本期价格">
              <el-input
                clearable
                v-only-num.float="xxjdForm.benqijg"
                size="small"
                v-model="xxjdForm.benqijg"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="ztai" label="状态">
              <el-select
                filterable
                size="small"
                v-model="xxjdForm.ztai"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in ztaiList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="shuoming" label="备注">
              <el-input
                clearable
                type="textarea"
                size="small"
                v-model="xxjdForm.shuoming"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <div style="display: flex;justify-content: space-between;">
          <div>
            <el-button
              type="primary"
              @click="
                dialogVisible = false;
                handleShowGCAllot(xxjdForm);
              "
              >馆藏分配</el-button
            >
          </div>
          <div>
            <el-button type="primary" @click="dialogSubmit('xxjdForm')"
              >确 定</el-button
            >
            <el-button @click="dialogClose">取 消</el-button>
          </div>
        </div>
      </span>
    </el-dialog>
    <!-- 馆藏分配 -->
    <side-wrap
      class="dialog__add common__side_form"
      v-show="showGCAllot"
      width="850px"
    >
      <template v-slot:header>
        <div class="edit__header">
          <div class="tit">馆藏分配</div>
          <i class="el-icon-close" @click="showGCAllot = false"></i>
        </div>
      </template>
      <div class="edit__content" style="padding: 20px 10px;">
        <el-table :data="gcAllotList" border style="width: 100%">
          <el-table-column type="index" label=" " align="center" width="35">
          </el-table-column>
          <el-table-column label="条形码">
            <template slot-scope="scope">
              <el-input
                :ref="'gcTmInput' + scope.$index"
                clearable
                size="small"
                v-model="scope.row.barcode"
                @keyup.native="
                  handleBarCodeScanner($event, val => (scope.row.barcode = val))
                "
                @keydown.enter.native="nextGcInput($event, scope.$index)"
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column label="分馆">
            <template slot-scope="scope">
              <el-select
                filterable
                size="small"
                v-model="scope.row.libId"
                @change="changeCygOption($event, scope.$index)"
              >
                <el-option
                  v-for="item in cygList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="馆藏地点">
            <template slot-scope="scope">
              <el-select filterable size="small" v-model="scope.row.czId">
                <el-option
                  v-for="item in gcListMap[scope.row.libId] || []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="流通类型">
            <template slot-scope="scope">
              <el-select filterable size="small" v-model="scope.row.ltlxId">
                <el-option
                  v-for="item in ltListMap[scope.row.libId] || []"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="装订方式">
            <template slot-scope="scope">
              <el-select filterable size="small" v-model="scope.row.zdfangshi">
                <el-option
                  v-for="item in ZDFANGSHI_OPTIONS"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="卷册说明">
            <template slot-scope="scope">
              <el-input
                v-model="scope.row.jcsm"
                size="small"
                clearable
              ></el-input>
            </template>
          </el-table-column>
          <el-table-column width="40" align="center">
            <template slot-scope="scope">
              <div @click="deleteAllotItem(scope.$index)">
                <icon-svg class="danger" icon-class="icon-btn-ico-21" />
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <template v-slot:footer>
        <div class="edit__footer border">
          <div></div>
          <div>
            <el-checkbox v-model="isAutoGc">记到后立即分配</el-checkbox>
            <el-button size="small" type="primary" @click="addOneAllotItem"
              >新 增</el-button
            >
            <el-button size="small" @click="handleSaveGCAllot">确 认</el-button>
            <el-button size="small" @click="showGCAllot = false"
              >取 消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
  </div>
</template>

<script>
import {
  jdsmxx,
  jdzjl,
  jdxx,
  jdxxSave,
  jdxxDel,
  jdxxJd,
  jdxxSaveTeding,
  jdxxYanshou,
  saveYdsm,
  delYdsm,
  qkjdxxGcfp
} from "api/periodical";

import { convertHlv, getYscurSshao } from "api/acquisition";

import {
  userYsLibList,
  userGysInLibList,
  hbList,
  userCzList,
  flowType,
  getCygList
} from "api/public";

import {
  ZDFANGSHI_OPTIONS,
  JZLEIXING_OPTIONS,
  WXLYUAN_OPTIONS
} from "utils/variables";

import { formatDate } from "utils/filterDate";

import { mapGetters } from "vuex";

import { QKJDCL_OPTIONS } from "utils/selectOptions";

export default {
  name: "per_qkjdcl",
  computed: {
    ...mapGetters(["libList"])
  },
  data() {
    var validateCe = (rule, value, callback) => {
      if (
        value == 0 &&
        (this.xxjdForm.ztai === "全部到馆" || this.xxjdForm.ztai === "部分到馆")
      ) {
        callback(new Error(this.xxjdForm.ztai + "状态下,记到册数不能为0"));
      } else if (value > this.xxjdForm.zongfuben) {
        callback(new Error("记到册数不能大于总复本数"));
      } else {
        this.$refs.xxjdForm.clearValidate();
        callback();
      }
    };
    var validateZtai = (rule, value, callback) => {
      if (value === "全部到馆" && this.xxjdForm.ce != this.xxjdForm.zongfuben) {
        this.xxjdForm.ce = this.xxjdForm.zongfuben;
        this.$refs["xxjdForm"].validate();
        callback(
          new Error(
            `全部到馆状态下,记到册数等于总复本数(${this.xxjdForm.zongfuben})`
          )
        );
      } else if (
        value === "部分到馆" &&
        this.xxjdForm.ce == this.xxjdForm.zongfuben
      ) {
        this.xxjdForm.ce = 0;
        callback(
          new Error(
            `部分到馆状态下,记到册数小于总复本数(${this.xxjdForm.zongfuben})`
          )
        );
      } else if (value === "部分到馆" && this.xxjdForm.ce == 0) {
        callback(new Error(`部分到馆状态下,记到册数不能为0`));
      } else if (value !== "全部到馆" && value !== "部分到馆") {
        this.xxjdForm.ce = 0;
        callback();
      } else {
        callback();
      }
    };
    var validateZdfs = (rule, value, callback) => {
      if (value > Number(this.JDXXDealRows[0].zongfuben)) {
        callback(
          new Error(
            `装订份数不能大于总复本数(${this.JDXXDealRows[0].zongfuben})`
          )
        );
      } else if (value == 0) {
        callback(new Error("装订份数不能为0"));
      } else {
        callback();
      }
    };

    this.filterOptions = QKJDCL_OPTIONS;

    this.infoStatusList = [
      { label: "全部", value: "" },
      { label: "未到", value: "未到" },
      { label: "部分到馆", value: "部分到馆" },
      { label: "全部到馆", value: "全部到馆" },
      { label: "装订", value: "装订" },
      { label: "停刊", value: "停刊" },
      { label: "催缺", value: "催缺" },
      { label: "催不到", value: "催不到" },
      { label: "推迟出版", value: "推迟出版" }
    ];

    this.cbzqiList = [
      { label: "年刊", value: "年刊", value2: 1 },
      { label: "半年刊", value: "半年刊", value2: 2 },
      { label: "双月刊", value: "双月刊", value2: 6 },
      { label: "月刊", value: "月刊", value2: 12 },
      { label: "半月刊", value: "半月刊", value2: 24 },
      { label: "双周刊", value: "双周刊", value2: 26 },
      { label: "周刊", value: "周刊", value2: 52 },
      { label: "季刊", value: "季刊", value2: 4 },
      { label: "旬刊", value: "旬刊", value2: 36 },
      { label: "日报", value: "日报", value2: 365 },
      { label: "不定期", value: "不定期", value2: 1 }
    ];

    this.zdleixngList = [
      { label: "精装", value: "精装" },
      { label: "平装", value: "平装" },
      { label: "线装", value: "线装" }
    ];

    this.ZDFANGSHI_OPTIONS = ZDFANGSHI_OPTIONS;

    this.jdjlFormRules = {
      ysid: [{ required: true, message: "请选择预算代码", trigger: "change" }],
      gysid: [
        { required: true, message: "请选择供应商代码", trigger: "change" }
      ],
      yuanjia: [{ required: true, message: "请输入原单价", trigger: "blur" }],
      nianjia: [{ required: true, message: "请输入原年价", trigger: "blur" }],
      ydhbid: [
        { required: true, message: "请选择预订货币类型", trigger: "change" }
      ],
      yjhbid: [
        { required: true, message: "请选择原价货币类型", trigger: "change" }
      ],
      zongqi: [{ required: true, message: "请输入订购期数", trigger: "blur" }],
      jiage: [{ required: true, message: "请输入预订单价", trigger: "blur" }],
      ceshu: [{ required: true, message: "请输入预订数量", trigger: "blur" }],
      ydnianjia: [
        { required: true, message: "请输入预订年价", trigger: "blur" }
      ],
      dgh: [{ required: true, message: "请输入订购号", trigger: "blur" }],
      dgnf: [{ required: true, message: "请选择订购年份", trigger: "blur" }]
    };

    this.zdingFormRules = {
      czid: [{ required: true, message: "请选择藏址", trigger: "change" }],
      ltlxid: [
        { required: true, message: "请选择流通类型", trigger: "change" }
      ],
      zdlx: [{ required: true, message: "请选择装订类型", trigger: "change" }],
      zdfs: [
        { required: true, message: "请输入装订份数", trigger: "blur" },
        { validator: validateZdfs, trigger: "blur" }
      ],
      zdjg: [{ required: true, message: "请输入装订价格", trigger: "blur" }],
      ysid: [{ required: true, message: "请选择预算代码", trigger: "change" }]
    };

    this.xxjdFormRules = {
      benqijg: [{ required: true, message: "请输入本期价格", trigger: "blur" }],
      ztai: [
        { required: true, message: "请选择期刊状态", trigger: "blur" },
        { validator: validateZtai, trigger: ["change", "blur"] }
      ],
      ce: [{ validator: validateCe, trigger: "blur" }],
      shidaorq: [{ required: true, message: "请选择实到日期", trigger: "blur" }]
    };

    this.ztaiList = [
      { label: "全部到馆", value: "全部到馆" },
      { label: "部分到馆", value: "部分到馆" },
      { label: "催缺", value: "催缺" },
      { label: "催不到", value: "催不到" },
      { label: "推迟出版", value: "推迟出版" },
      { label: "装订", value: "装订" },
      { label: "停刊", value: "停刊" }
    ];

    return {
      currentFilterVal: "",
      currentFilterKey: "issn",
      //记到书目信息
      JDSMXXTable: [],
      loadding: false,
      flag: true,
      pageNumber: 1,
      storageRow: {},
      //记到总记录
      isAdd: true,
      JDZJLoading: false,
      JDZJLTable: [],
      JDZJLStorageRow: {},
      //记到信息
      JDXXLoading: false,
      JDXXTable: [],
      infoStatus: "",
      JDXXSelectedRow: [],
      //记到记录侧边栏
      showSideWarp: false,
      notSelected: false,
      jdjlForm: {
        yjhbid: "",
        yuanjia: "0.00",
        jiage: "0.00",
        taojia: "0.00",
        ceshu: 1,
        juance: "",
        fuzhu: "",
        ydlaiyuan: "",
        jzleixing: "",
        zdfangshi: "",
        ydbhao: "",
        ztai: "",
        ydhbid: "",
        hexinqk: false,
        nianjia: "0.00",
        ydnianjia: "0.00",
        zongqi: "12",
        cbplv: "12",
        cbzq: "月刊",
        libid: this.$store.getters.userInfo.libId,
        gysid: "",
        ysid: "",
        dgnf: "",
        jddd: "",
        dgh: ""
      },
      tempForm: {
        yjhbid: "",
        yuanjia: "0.00",
        jiage: "0.00",
        taojia: "0.00",
        ceshu: 1,
        juance: "",
        fuzhu: "",
        ydlaiyuan: "",
        jzleixing: "",
        zdfangshi: "",
        ydbhao: "",
        ztai: "",
        ydhbid: "",
        hexinqk: false,
        nianjia: "0.00",
        ydnianjia: "0.00",
        zongqi: "12",
        cbplv: "12",
        cbzq: "月刊",
        libid: this.$store.getters.userInfo.libId,
        gysid: "",
        ysid: "",
        dgnf: "",
        jddd: "",
        dgh: ""
      },
      ysList: [],
      gysList: [],
      hbList: [],
      zdfshiList: [],
      jzlxingList: [],
      dglyuanList: [],
      //装订侧边栏
      showBindingSideWarp: false,
      JDXXDealRows: [],
      zdingTempForm: {
        czid: "",
        ltlxid: "",
        pihao: "",
        zdlx: "",
        zdcs: "",
        ysid: "",
        zdfs: "",
        zdjg: "",
        jcsm: "",
        zdingWarpTable: []
      },
      zdingForm: {},
      sign: 1,
      czList: [],
      flowTypeList: [],
      //详细记到
      dialogVisible: false,
      xxjdForm: {
        juan: "",
        qi: "",
        shuoming: "",
        zongqi: "",
        ztai: "",
        ydsmid: "",
        marcid: "",
        ce: "",
        year: "",
        yingdaorq: "",
        shidaorq: "",
        benqijg: ""
      },
      // 馆藏分配
      isAutoGc: localStorage.getItem("td-qkjdcl-atuogc") === "1" ? true : false,
      showGCAllot: false,
      gcAllotList: [],
      cygList: [],
      gcListMap: {},
      ltListMap: {}
    };
  },
  directives: {
    loadmore: {
      // 指令的定义   bind(el, binding, vnode) {
      bind(el, binding) {
        const selectWrap = el.querySelector(".el-table__body-wrapper");
        selectWrap.addEventListener("scroll", function() {
          const sign = 30;
          const scrollDistance =
            this.scrollHeight - this.scrollTop - this.clientHeight;
          if (scrollDistance <= sign) {
            binding.value();
          }
        });
      }
    }
  },
  methods: {
    // 馆藏分配
    handleSaveGCAllot() {
      for (let index = 0; index < this.gcAllotList.length; index++) {
        let item = this.gcAllotList[index];
        if (item.barcode === "") {
          this.$message.error("馆藏分配中条形码不能为空！");
          return;
        }
      }
      getYscurSshao({
        marcid: this.JDZJLStorageRow.marcid
      }).then(res => {
        let sshao = res.data.sshao;
        if (sshao) {
          qkjdxxGcfp({
            qkydsmid: this.JDZJLStorageRow.qkydsmid,
            marcid: this.JDZJLStorageRow.marcid,
            sshao: sshao,
            collectionDtos: JSON.stringify(this.gcAllotList)
          }).then(res => {
            localStorage.setItem("td-qkjdcl-atuogc", this.isAutoGc ? "1" : "0");
            this.$message.success(res.message);
            this.showGCAllot = false;
          });
        } else {
          this.$message.error(res.message);
        }
      });
    },
    nextGcInput(event, index) {
      let nextInput = this.$refs["gcTmInput" + (index + 1)];
      if (nextInput) {
        nextInput.focus();
      }
    },
    addOneAllotItem() {
      let currentLib = this.$store.getters.userInfo.libId;
      this.gcAllotList.push({
        barcode: "",
        libId: currentLib,
        czId: this.gcListMap[currentLib][0].value || "",
        ltlxId: this.ltListMap[currentLib][0].value || "",
        jcsm: this.gcjcsm,
        zdfangshi: ZDFANGSHI_OPTIONS[0].value
      });
    },
    addAllotItems() {
      let gap = this.gcyidao || 1;
      let currentLib = this.$store.getters.userInfo.libId;
      let gcData = this.gcListMap[currentLib];
      let ltlxData = this.ltListMap[currentLib];
      for (let index = 0; index < gap; index++) {
        this.gcAllotList.push({
          barcode: "",
          libId: currentLib,
          czId: gcData[0] ? gcData[0].value : "",
          ltlxId: ltlxData[0] ? ltlxData[0].value : "",
          jcsm: this.gcjcsm,
          zdfangshi: ZDFANGSHI_OPTIONS[0].value
        });
      }
      this.$nextTick(() => {
        this.$refs["gcTmInput0"].focus();
      });
    },
    deleteAllotItem(index) {
      this.gcAllotList.splice(index, 1);
    },
    handleShowGCAllot(data) {
      this.gcjcsm = data.qi;
      this.gcyidao = data.yidao;
      this.gcAllotList = [];
      this.showGCAllot = true;
      if (this.cygList.length === 0) {
        this.getCygList();
      } else if (this.cygList.length > 0) {
        this.addAllotItems();
      }
    },
    getCygList() {
      getCygList().then(res => {
        this.cygList = res.data
          ? res.data.map(item => {
              return {
                label: item.libJiancheng,
                value: item.libId
              };
            })
          : [];
        this.changeCygOption(this.$store.getters.userInfo.libId);
      });
    },
    changeCygOption(cygId, index) {
      this.getGcList(cygId, index);
      this.getLtList(cygId, index);
    },
    getGcList(cygId, index) {
      if (this.gcListMap[cygId]) {
        if (index >= 0) {
          this.gcAllotList[index].czId = this.gcListMap[cygId][0]
            ? this.gcListMap[cygId][0].value
            : "";
        }
        return;
      }
      userCzList({
        libId: cygId
      }).then(res => {
        let filterData = res.data
          ? res.data.map(item => {
              return {
                label: item.mingcheng,
                value: item.czid
              };
            })
          : [];
        this.$set(this.gcListMap, cygId, filterData);
        if (index >= 0) {
          this.gcAllotList[index].czId = filterData[0]
            ? filterData[0].value
            : "";
        }
        this.getgcAllotListFinish = true;
        if (this.gcAllotList.length === 0 && this.getLtListFinish) {
          this.addAllotItems();
        }
      });
    },
    getLtList(cygId, index) {
      if (this.ltListMap[cygId]) {
        if (index >= 0) {
          this.gcAllotList[index].ltlxId = this.ltListMap[cygId][0]
            ? this.ltListMap[cygId][0].value
            : "";
        }
        return;
      }
      flowType({
        libId: cygId
      }).then(res => {
        let filterData = res.data
          ? res.data.map(item => {
              return {
                label: item.mingcheng,
                value: item.ltlxid
              };
            })
          : [];
        this.$set(this.ltListMap, cygId, filterData);
        if (index >= 0) {
          this.gcAllotList[index].ltlxId = filterData[0]
            ? filterData[0].value
            : "";
        }
        this.getLtListFinish = true;
        if (this.gcAllotList.length === 0 && this.getgcAllotListFinish) {
          this.addAllotItems();
        }
      });
    },
    // 搜索
    search() {
      this.pageNumber = 1;
      this.flag = true;
      this.JDSMXXTable = [];
      this.getJdsmxx();
    },
    //记到处理--记到书目信息
    getJdsmxx() {
      if (this.loadding) {
        return;
      }
      let param = {
        pageNumber: this.pageNumber,
        pageSize: 15
      };
      param[this.currentFilterKey] = this.currentFilterVal.replace(
        /^\s+|\s+$/g,
        ""
      );
      if (this.flag) {
        this.flag = false;
        this.loadding = true;
        jdsmxx({
          ...param
        })
          .then(res => {
            this.loadding = false;
            if (res.data.dataList.length) {
              this.pageNumber++;
              this.JDSMXXTable = [...this.JDSMXXTable, ...res.data.dataList];
              this.$refs.JDSMXXTable.setCurrentRow(this.JDSMXXTable[0]);
              this.storageRowFunc(this.JDSMXXTable[0]);
              this.flag = true;
            }
          })
          .catch(() => {
            this.flag = true;
            this.loadding = false;
          });
      }
    },
    //编目触发方式
    smEdit(row) {
      this.handleDirectBMPage(row.marcid, row.marctyid);
    },
    //新建书目
    handleDirectBMPage(marcid, marctyid) {
      const param = {
        isQk: 1,
        marcid,
        marctyid
      };
      this.$router.push({
        name: "cat_bm",
        query: {
          from: "per_qkjdcl",
          ...param
        }
      });
    },
    storageRowFunc(row) {
      let qkjgeStr = "";
      this.storageRow = { ...row };
      this.tempForm.cbzq = row.cbzqi || "月刊";
      qkjgeStr = row.qkjge || "0.00";
      if (parseFloat(qkjgeStr)) {
        qkjgeStr = parseFloat(qkjgeStr).toFixed(2);
      } else {
        qkjgeStr = qkjgeStr.replace(/^[a-zA-Z]+/, "");
        if (parseFloat(qkjgeStr)) {
          qkjgeStr = parseFloat(qkjgeStr).toFixed(2);
        } else {
          qkjgeStr = "0.00";
        }
      }
      //初始值 - 价格-预订价格
      this.tempForm.yuanjia = qkjgeStr;
      this.tempForm.jiage = qkjgeStr;
      this.tempForm.nianjia = (
        Number(qkjgeStr) * Number(this.tempForm.zongqi)
      ).toFixed(2);

      this.tempForm.ydnianjia = this.tempForm.nianjia;
      this.getJdzjl();
    },
    //新增 记到记录 面板
    jdjlWarp() {
      this.jdjlForm = { ...this.tempForm };
      this.initJdjlOption();
      this.jdjlForm.smkzhao = this.storageRow.smkzhao;
      this.jdjlForm.libMingcheng = this.$store.getters.userInfo.libName;
      this.$refs["jdjlForm"].resetFields();
      this.showSideWarp = true;
    },

    //编辑记到记录面板
    rowDblclick(row) {
      this.handleEditJdjl("", "", row);
    },
    handleEditJdjl(id, index, row) {
      this.isAdd = false;
      this.initJdjlOption();
      this.jdjlForm = { ...row };
      this.jdjlForm.smkzhao = this.storageRow.smkzhao;
      this.jdjlForm.libMingcheng = this.$store.getters.userInfo.libName;
      this.$refs["jdjlForm"].resetFields();
      this.showSideWarp = true;
      this.notSelected = true;
    },
    closeWarp(flag) {
      this.jdjlForm = { ...this.tempForm };
      this.isAdd = true;
      if (flag) {
        this.showSideWarp = false;
      } else {
        this.initJdjlOption();
      }
      this.notSelected = false;
      this.$refs["jdjlForm"].resetFields();
    },
    initJdjlOption() {
      this.getUserYsLibList();
      this.getUserGysInLibList();
      this.getHbList();
      this.zdfshiList = ZDFANGSHI_OPTIONS;
      this.jzlxingList = JZLEIXING_OPTIONS;
      this.dglyuanList = WXLYUAN_OPTIONS;
      this.jdjlForm.ydlaiyuan = this.dglyuanList[0].value;
      this.jdjlForm.jzleixing = this.jzlxingList[0].value;
      this.jdjlForm.zdfangshi = this.zdfshiList[0].value;
    },

    //记到记录保存
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.jdjlForm.marcid = this.storageRow.marcid;
          saveYdsm({ ...this.jdjlForm }).then(res => {
            this.$message.success(res.message);
            this.closeWarp(true);
            this.getJdzjl();
          });
        }
      });
    },
    rowClick(row) {
      this.$refs.JDXXTable.toggleRowSelection(row);
    },
    //联动订购年份
    changeCbzq(data, form) {
      data = data.split(",");
      form.cbzq = data[0];
      form.cbplv = data[1];
      form.zongqi = data[1];
      //联动原年价
      form.nianjia = form.zongqi * Number(form.yuanjia);
      this.yjhbLinkNum();
    },
    //原年价联动总期数和原单价
    changeNjia(form) {
      form.nianjia = (form.zongqi * Number(form.yuanjia)).toFixed(2);
      this.yjhbLinkNum();
    },
    //预算代码
    getUserYsLibList() {
      userYsLibList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.ysList = [];
        res.data.filter(ele => {
          this.ysList.push({
            label: ele.daima,
            value: ele.ysid
          });
        });
      });
    },
    //供应商
    getUserGysInLibList() {
      userGysInLibList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.gysList = [];
        res.data.filter(ele => {
          this.gysList.push({
            label: ele.gysCode,
            value: ele.gysId
          });
        });
      });
    },
    //货币列表
    getHbList() {
      hbList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.hbList = res.data.map(item => {
          // 默认人民币
          if (item.hbcode.toUpperCase() === "CNY") {
            this.tempForm.yjhbid = this.tempForm.ydhbid = item.hbid;
          }
          return {
            label: item.hbcode,
            value: item.hbid
          };
        });
        if (!this.tempForm.yjhbid) {
          this.tempForm.yjhbid = this.tempForm.ydhbid = this.getArrFirstValue(
            this.hbList
          );
        }
      });
    },
    //获取记到记录列表
    getJdzjl() {
      this.JDZJLoading = true;
      jdzjl({
        marcid: this.storageRow.marcid
      })
        .then(res => {
          this.JDZJLoading = false;
          this.JDZJLTable = [...res.data];
          if (this.JDZJLTable[0]) {
            this.$refs.JDZJLTable.setCurrentRow(this.JDZJLTable[0]);
            this.JDZJLStorageRowFunc(this.JDZJLTable[0]);
          }
          this.JDXXTable = [];
          this.infoStatus = "";
        })
        .catch(() => {
          this.JDZJLoading = false;
        });
    },
    //记到记录删除
    jdzjlDel(qkydsmid) {
      this.$confirm(
        "预订记录被删除，对应的记到记录将会被同步删除，是否删除？",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).then(() => {
        delYdsm({
          qkydsmids: qkydsmid
        }).then(res => {
          this.$message.success(res.message);
          this.getJdzjl();
        });
      });
    },
    //联动原价货币类型
    yjhbLinkNum() {
      this.convertHlvFunc(
        this.jdjlForm.yjhbid,
        this.jdjlForm.ydhbid,
        this.jdjlForm.yuanjia,
        "jiage"
      );
      this.convertHlvFunc(
        this.jdjlForm.yjhbid,
        this.jdjlForm.ydhbid,
        this.jdjlForm.nianjia,
        "ydnianjia"
      );
    },
    //汇率货币计算
    convertHlvFunc(fromHbId, toHbId, fromMoney, key) {
      convertHlv({
        fromHbId: fromHbId,
        toHbId: toHbId,
        fromMoney: fromMoney
      }).then(res => {
        this.jdjlForm[key] = res.data.toMoney;
      });
    },
    //记到记录获取行
    JDZJLStorageRowFunc(row) {
      this.JDZJLStorageRow = { ...row };
      this.infoStatus = "";
      this.getJdxx();
    },
    //记到信息
    getJdxx() {
      if (this.JDXXLoading) {
        return;
      }
      this.JDXXLoading = true;
      jdxx({
        ztai: this.infoStatus,
        pageSize: 1000,
        qkydsmid: this.JDZJLStorageRow.qkydsmid
      })
        .then(res => {
          this.JDXXLoading = false;
          this.JDXXTable = [...res.data.dataList];
        })
        .catch(() => {
          this.JDXXLoading = false;
        });
    },
    //联动状态信息
    linkZtai() {
      if (this.xxjdForm.ce == this.xxjdForm.zongfuben) {
        this.xxjdForm.ztai = "全部到馆";
      } else if (
        this.xxjdForm.ce > 0 &&
        this.xxjdForm.ce < this.xxjdForm.zongfuben
      ) {
        this.xxjdForm.ztai = "部分到馆";
      }
    },
    JDXXSelectedRowFunc(row) {
      this.JDXXSelectedRow = [...row];
    },
    submitJDXXForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.zdingForm.zdingWarpTable.filter(ele => {
            this.zdingForm.jcsm = ele.zdqi;
            this.zdingForm.shuceid = this.storageRow.shuceid;
          });
          this.zdingForm.zdingWarpTable = [];
          this.zdingFunc(this.sign, this.zdingForm);
        }
      });
    },
    openZdingWarp(sign) {
      this.sign = sign;
      this.zdingWarp();
    },
    //装订
    zdingWarp() {
      let zdqi = [];
      let qiandaoids = [];
      this.JDXXDealRows =
        this.sign === 1 ? this.JDXXSelectedRow : this.JDXXTable;
      this.JDXXDealRows.filter(ele => {
        if (ele.ztai === "全部到馆") {
          zdqi.push(ele.qi);
          qiandaoids.push(ele.qiandaoid);
        }
      });
      if (!zdqi.length) {
        this.$message.warning("不存在全部到馆状态记到信息");
        return;
      }
      this.zdingForm = { ...this.zdingTempForm };
      this.zdingForm.zdcs = "";
      this.zdingForm.zdfs = this.JDZJLStorageRow.ceshu;
      this.zdingForm.marcid = this.JDZJLStorageRow.marcid;
      this.zdingForm.qkydsmid = this.JDZJLStorageRow.qkydsmid;
      this.zdingForm.qiandaoids = qiandaoids.join(",");
      this.zdingForm.zdingWarpTable = [
        {
          ...{
            jdnian: this.JDZJLStorageRow.dgnf,
            djia: this.JDZJLStorageRow.jiage,
            zdqi: zdqi.join(",")
          }
        }
      ];
      this.$refs["zdingForm"].resetFields();
      this.initJdxxOption();
      this.showBindingSideWarp = true;
    },
    closeZdingWarp() {
      this.showBindingSideWarp = false;
      Object.keys(this.zdingTempForm).filter(key => {
        this.zdingTempForm[key] = this.zdingForm[key];
      });
      this.$refs["zdingForm"].resetFields();
      this.zdingTemp = {};
    },
    zdingFunc(sign, param) {
      jdxxYanshou({
        type: sign,
        ...param
      }).then(res => {
        this.$message.success(res.message);
        this.closeZdingWarp();
        this.getJdxx("");
      });
    },
    initJdxxOption() {
      this.getCzList();
      this.getFlowType();
      this.getUserYsLibList();
    },
    //馆藏地点userCzList , flowType , yslxList
    getCzList() {
      userCzList({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.czList = [];
        res.data.filter(ele => {
          this.czList.push({
            label: ele.mingcheng,
            value: ele.czid
          });
        });
      });
    },
    //流通类型
    getFlowType() {
      flowType({
        libId: this.$store.getters.userInfo.libId
      }).then(res => {
        this.flowTypeList = [];
        res.data.filter(ele => {
          this.flowTypeList.push({
            label: ele.mingcheng,
            value: ele.ltlxid
          });
        });
      });
    },
    //详细记到对话框
    xxjdFunc(row) {
      this.dialogVisible = true;
      this.xxjdForm = { ...row };
      let param = {
        ce: this.xxjdForm.zongfuben,
        shidaorq: formatDate(new Date(), "yyyy-MM-dd"),
        year: row.year ? row.year : formatDate(new Date(), "yyyy"),
        ztai: "全部到馆"
      };
      this.xxjdForm = { ...this.xxjdForm, ...param };
    },
    dialogSubmit(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          jdxxSave({
            ...this.xxjdForm
          }).then(res => {
            this.$message.success(res.message);
            this.getJdxx();
            this.dialogVisible = false;
          });
        }
      });
    },
    dialogClose() {
      this.dialogVisible = false;
      this.$refs["xxjdForm"].resetFields();
    },
    //记到信息-删除
    jdxxDelFunc(qiandaoid) {
      jdxxDel({
        qiandaoids: qiandaoid
      }).then(res => {
        this.$message.success(res.message);
        this.getJdxx();
      });
    },
    //记到信息双击记到
    jdxxJdFunc_jd(row) {
      this.jdxxJdFunc(1, row);
    },
    //记到信息-记到
    jdxxJdFunc(type, row) {
      if (type === 2) {
        if (row.ztai !== "部分到馆" && row.ztai !== "全部到馆") {
          this.$message.warning(
            `${row.ztai}状态下不能取消记到；操作状态：部分到馆，全部到馆`
          );
          return;
        }
      }
      jdxxJd({
        type,
        qiandaoid: row.qiandaoid
      }).then(res => {
        this.$message.success(res.message);
        this.getJdxx();
        this.$refs.FocusInput.select();
        if (localStorage.getItem("td-qkjdcl-atuogc") === "1" && type == "1") {
          this.handleShowGCAllot(res.data || row);
        }
      });
    },

    //记到信息-想前后新增
    jdxxSaveTedingFunc(type, qiandaoid) {
      jdxxSaveTeding({
        type,
        qiandaoid
      }).then(res => {
        this.$message.success(res.message);
        this.getJdxx();
      });
    },

    //记到信息 - 停刊
    jdxxSaveFunc(row) {
      row.ztai = "停刊";
      jdxxSave({
        ...row
      }).then(res => {
        this.$message.success(res.message);
        this.getJdxx();
      });
    }
  },
  mounted() {
    this.getHbList();
    this.$refs.FocusInput.select();
    this.$eventBus.$on("jdbm-update", () => {
      this.search();
    });
  },
  destroyed() {
    this.$eventBus.$off("jdbm-update");
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.per_qkjdcl {
  .content__header {
    padding-top: 10px;
    padding-bottom: 0;
  }
  .content {
    height: 100%;
    .content_container {
      height: calc(100% - 56px);
    }
    .content_pane_left,
    .content_pane_right,
    .content_pane_bottom {
      height: 57%;
      display: inline-block;
      vertical-align: top;
      .c-content-header {
        background-color: transparent;
      }
    }
    .content_pane_left {
      width: calc(100% - 620px);
    }
    .content_pane_right {
      width: 620px;
      .placeholder {
        width: 1%;
        height: 100%;
        background-color: #fff;
        display: inline-block;
        border-bottom: 1px solid @tableBorderColor;
        box-sizing: border-box;
      }
    }
    .content_pane_bottom {
      height: 45%;
      width: 100%;
      /deep/.tool_button {
        display: inline;
        padding-left: 15px;
        .desc {
          white-space: nowrap;
          font-size: 0.14rem;
          display: inline;
        }
        .el-select {
          line-height: 32px;
          width: 120px;
          text-indent: 0;
          padding-right: 14px;
        }
      }
    }
    .content__table {
      height: calc(100% - 40px) !important;
      .el-table__fixed-right {
        &::before {
          background-color: transparent;
        }
      }
      /deep/.tip {
        i {
          display: inline-block;
          width: 10px;
          height: 10px;
          border-radius: 8px;
          margin-right: 4px;
          &.qbdg {
            background-color: #1dc147;
          }
          &.bfdg {
            background-color: #1dbbc1;
          }
          &.wd {
            background-color: #919faf;
          }
          &.tk {
            background-color: #de5151;
          }
          &.cbd {
            background-color: #e32a8e;
          }
          &.cq {
            background-color: #fe8900;
          }
          &.tccb {
            background-color: #ebb206;
          }
          &.zd {
            background-color: #0079fe;
          }
        }
      }
    }
  }
  .temp__item {
    justify-content: flex-start !important;
    color: #000;
    font-size: @FSize_16 !important;
    .el-form-item__label,
    .el-form-item__content {
      font-weight: bold;
      font-size: @FSize_16 !important;
    }
  }
  .el-input-number__increase,
  .el-input-number__decrease {
    width: 60px;
  }
  /deep/.overWidth__item {
    flex-basis: 100% !important;
    .el-form-item__content,
    .el-textarea {
      width: 100%;
    }
  }
  .zdingTable {
    height: 400px;
  }
}
</style>
