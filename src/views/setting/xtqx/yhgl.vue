<!--
 * @labelription: 用户管理/用户IP权限
 * @Version: 4.1
 * @Autor: chenming.feng
 * @LastEditors: xiaohong.lin
 * @Date: 2019-02-18 11:07:46
 * @LastEditTime: 2020-03-09 17:43:34
 -->

<template>
  <div class="set-yhgl common__content">
    <td-content-header>
      用户列表
      <template v-slot:btns>
        <div class="header__ops">
          <el-button size="mini" type="primary" @click="handleShowGCAllotMulti"
            ><icon-svg icon-class="icon-btn-ico-10" /> 馆藏批管理</el-button
          >
          <el-button size="mini" type="primary" @click="showAddUser"
            ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
          >
          <el-button
            :disabled="multipleUserSelection.length === 0"
            size="mini"
            type="primary"
            @click="handleDelUser('')"
            ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
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
            v-model="currentLibId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in libListSelect"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <p class="label">状态：</p>
          <el-select
            filterable
            size="mini"
            v-model="selectUserStatus"
            placeholder="请选择"
          >
            <el-option
              v-for="item in userStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
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
            >
            </el-option>
          </el-select>
          <el-input
            ref="focusInput"
            size="mini"
            clearable
            class="group__filter_value"
            v-model="currentFilterVal"
            placeholder="请输入搜索关键词"
            @keyup.enter.native="initUserList"
          ></el-input>
          <el-button type="primary" size="mini" @click="initUserList"
            ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
          >
        </div>
      </div>
      <div class="content__table" ref="contentTable">
        <el-table
          ref="userListTable"
          v-loading="loadUserListData"
          @row-click="userListRowClick"
          @row-dblclick="rowDblclick"
          @selection-change="handleSelectionChange"
          border
          :data="userList"
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
            show-overflow-tooltip
            prop="usercode"
            label="登录账号"
          >
          </el-table-column>
          <el-table-column
            show-overflow-tooltip
            prop="username"
            label="用户名称"
          >
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="libName" label="成员馆">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="roleName" label="角色">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="固定电话">
            <template slot-scope="scope">
              {{ scope.row.tel1 || scope.row.tel1 }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="email" label="email">
          </el-table-column>
          <el-table-column show-overflow-tooltip label="入职时间">
            <template slot-scope="scope">
              {{ scope.row.employdatetime | splitDateTime }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="注销时间">
            <template slot-scope="scope">
              {{ scope.row.awaydatetime | splitDateTime }}
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="在职状态">
            <template slot-scope="scope">
              <span v-show="scope.row.inServer == 0"
                ><span class="server__status server__status_on"></span
                >正常</span
              >
              <span v-show="scope.row.inServer == 1"
                ><span class="server__status server__status_off"></span
                >注销</span
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45" fixed="right">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.userId"
                :index="scope.$index"
                :data="scope.row"
                :ops="['gcfp', 'del', 'edit']"
                @handleEdit="checkUserDetail"
                @handleDel="handleDelUser"
                @handleGCFP="handleShowGCAllot"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="content__page">
        <td-pagination
          @size-change="handleUserSizeChange"
          @current-change="handleUserCurrentChange"
          :total="totalUserListCount"
          :currentPage="currentUserListPage"
          :pageSize="userListPageSize"
        ></td-pagination>
      </div>
    </div>
    <side-wrap class="common__side_form" v-if="showAddUserSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">新增用户</div>
          </div>
          <i class="el-icon-close" @click="hideAddUser"></i>
        </div>
      </template>
      <div class="edit__content">
        <el-form
          class="custom__form"
          ref="userAddForm"
          :model="userAddForm"
          :rules="userInfoFormRules"
          label-width="80px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">用户信息</div>
            <el-form-item class="item" prop="usercode" label="登录账号">
              <el-input clearable v-model="userAddForm.usercode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="certtype" label="证件类型">
              <el-select
                filterable
                v-model="userAddForm.certtype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in certTypeList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="username" label="用户名称">
              <el-input clearable v-model="userAddForm.username"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="certcard" label="证件号码">
              <el-input clearable v-model="userAddForm.certcard"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="password" label="密码">
              <el-input
                autocomplete="new-password"
                type="password"
                clearable
                v-model="userAddForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="birthday" label="出生日期">
              <el-date-picker
                v-model="userAddForm.birthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="mode" label="用户模式">
              <el-radio-group v-model="userAddForm.mode" class="item__radio">
                <el-radio label="0">专业模式</el-radio>
                <el-radio label="1">极简模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="sex" label="性别">
              <el-radio-group v-model="userAddForm.sex" class="item__radio">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">员工信息</div>
            <el-form-item class="item" prop="employdatetime" label="入职时间">
              <el-date-picker
                v-model="userAddForm.employdatetime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="tel2" label="移动电话">
              <el-input
                clearable
                type="tel"
                maxlength="11"
                v-model="userAddForm.tel2"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="awaydatetime" label="有效日期">
              <el-date-picker
                v-model="userAddForm.awaydatetime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="tel1" label="固定电话">
              <el-input
                clearable
                type="tel"
                v-model="userAddForm.tel1"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="userAddForm.libId"
                placeholder="请选择"
                @change="getAddFormRoleOptions"
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
            <el-form-item class="item" prop="roleId" label="角色">
              <el-select
                filterable
                v-model="userAddForm.roleId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in addRoleIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="email" label="e m a i l">
              <el-input clearable v-model="userAddForm.email"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="linkman" label="联系人">
              <el-input clearable v-model="userAddForm.linkman"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="position" label="职位">
              <el-input clearable v-model="userAddForm.position"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="address" label="住址">
              <el-input clearable v-model="userAddForm.address"></el-input>
            </el-form-item>
            <el-form-item class="item" v-if="false" prop="deposit" label="部门">
              <el-input clearable v-model="userAddForm.deposit"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="inServer" label="在职状态">
              <el-radio-group
                v-model="userAddForm.inServer"
                class="item__radio"
              >
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">更多信息</div>
            <el-form-item class="item" prop="nation" label="民族">
              <el-input clearable v-model="userAddForm.nation"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="homeplace" label="籍贯">
              <el-input clearable v-model="userAddForm.homeplace"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="degree" label="学历">
              <el-select
                filterable
                v-model="userAddForm.degree"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in eduTypeList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="degree" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="userAddForm.reamrk"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('userAddForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm('userAddForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="hideAddUser">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <side-wrap class="common__side_form" v-if="showEditSide" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits active">
            <div
              v-for="(item, index) in editTabs"
              :key="index"
              class="tit"
              :class="{ active: item.id === currentEditTab }"
              @click="currentEditTab = item.id"
            >
              {{ item.value }}
            </div>
          </div>
          <i class="el-icon-close" @click="showEditSide = false"></i>
        </div>
      </template>
      <!-- 用户详细信息 -->
      <div class="edit__content" v-show="currentEditTab === 1">
        <el-form
          class="custom__form"
          ref="userEditForm"
          :model="userEditForm"
          :rules="userInfoFormRules1"
          label-width="80px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div class="tit">
              <span>用户信息</span>
            </div>
            <el-form-item class="item" prop="usercode" label="登录账号">
              <el-input clearable v-model="userEditForm.usercode"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="certtype" label="证件类型">
              <el-select
                filterable
                v-model="userEditForm.certtype"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in certTypeList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="username" label="用户名称">
              <el-input clearable v-model="userEditForm.username"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="certcard" label="证件号码">
              <el-input clearable v-model="userEditForm.certcard"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="password" label="密码">
              <el-input
                clearable
                ref="pwdInput"
                autocomplete="new-password"
                type="password"
                v-model="userEditForm.password"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="birthday" label="出生日期">
              <el-date-picker
                v-model="userEditForm.birthday"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="mode" label="用户模式">
              <el-radio-group v-model="userEditForm.mode" class="item__radio">
                <el-radio label="0">专业模式</el-radio>
                <el-radio label="1">极简模式</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item class="item" prop="sex" label="性别">
              <el-radio-group v-model="userEditForm.sex" class="item__radio">
                <el-radio label="1">男</el-radio>
                <el-radio label="0">女</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">员工信息</div>
            <el-form-item class="item" prop="employdatetime" label="入职时间">
              <el-date-picker
                v-model="userEditForm.employdatetime"
                type="date"
                placeholder="选择日期"
                value-format="yyyy-MM-dd"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="tel2" label="移动电话">
              <el-input
                clearable
                type="tel"
                maxlength="11"
                v-model="userEditForm.tel2"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="awaydatetime" label="有效日期">
              <el-date-picker
                v-model="userEditForm.awaydatetime"
                type="date"
                value-format="yyyy-MM-dd"
                placeholder="选择日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item class="item" prop="tel1" label="固定电话">
              <el-input
                clearable
                type="tel"
                v-model="userEditForm.tel1"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" prop="libId" label="成员馆">
              <el-select
                filterable
                v-model="userEditForm.libId"
                placeholder="请选择"
                @change="getEditFormRoleOptions('reset')"
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
            <el-form-item class="item" prop="roleId" label="角色">
              <el-select
                filterable
                v-model="userEditForm.roleId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in editRoleIdOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="email" label="e m a i l">
              <el-input clearable v-model="userEditForm.email"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="linkman" label="联系人">
              <el-input clearable v-model="userEditForm.linkman"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="position" label="职位">
              <el-input clearable v-model="userEditForm.position"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="address" label="住址">
              <el-input clearable v-model="userEditForm.address"></el-input>
            </el-form-item>
            <el-form-item class="item" v-if="false" prop="deposit" label="部门">
              <el-input clearable v-model="userEditForm.deposit"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="inServer" label="在职状态">
              <el-radio-group
                v-model="userEditForm.inServer"
                class="item__radio"
              >
                <el-radio label="0">是</el-radio>
                <el-radio label="1">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="custom__form_wrapper">
            <div class="tit">更多信息</div>
            <el-form-item class="item" prop="nation" label="民族">
              <el-input clearable v-model="userEditForm.nation"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="homeplace" label="籍贯">
              <el-input clearable v-model="userEditForm.homeplace"></el-input>
            </el-form-item>
            <el-form-item class="item" prop="degree" label="学历">
              <el-select
                filterable
                v-model="userEditForm.degree"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in eduTypeList"
                  :key="item.dictId"
                  :label="item.dictName"
                  :value="item.dictId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" prop="reamrk" label="备注">
              <el-input
                clearable
                type="textarea"
                v-model="userEditForm.reamrk"
              ></el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <!-- 用户IP登录设置 -->
      <div class="edit__content edit__ip" v-show="currentEditTab === 2">
        <div class="tit">
          <span>用户IP登录设置</span>
          <div class="header__ops">
            <el-button size="mini" type="primary" @click="showIPListDialog"
              ><icon-svg icon-class="icon-btn-ico-" /> 新增</el-button
            >
            <el-button
              @click="handleDelIP('')"
              :disabled="multipleIPSelection.length === 0"
              size="mini"
              type="primary"
              ><icon-svg icon-class="icon-btn-ico-1" /> 删除</el-button
            >
          </div>
        </div>
        <el-table
          border
          ref="IpTable"
          @row-click="userIPListRowClick"
          @selection-change="handleIPSelectionChange"
          :data="ipConfigList"
          stripe
          style="width: 100%"
        >
          <el-table-column
            type="selection"
            width="35"
            align="center"
          ></el-table-column>
          <el-table-column show-overflow-tooltip label="计算机代码">
            <template slot-scope="scope">
              <span>{{ scope.row.daima }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="IP地址">
            <template slot-scope="scope">
              <span>{{ scope.row.ipdizhi }}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="成员馆">
            <template slot-scope="scope">
              <span>{{ scope.row.libName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="45">
            <template slot-scope="scope">
              <td-action-tool
                :id="scope.row.useripid"
                :index="scope.$index"
                :ops="['del']"
                @handleDel="handleDelIP"
              ></td-action-tool>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template v-slot:footer>
        <div class="edit__footer" v-show="currentEditTab === 1">
          <el-button size="mini" @click="resetForm('userEditForm')"
            >重置</el-button
          >
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm('userEditForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showEditSide = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 馆藏分配 -->
    <side-wrap class="common__side_form" v-if="showGCAside" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tit">馆藏分配信息</div>
          <i class="el-icon-close" @click="showGCAside = false"></i>
        </div>
      </template>
      <el-form
        class="custom__form"
        ref="gcForm"
        :model="gcForm"
        :rules="gcFormRules"
        label-width="80px"
        size="mini"
      >
        <div class="custom__form_wrapper">
          <div class="tit">用户信息</div>
          <el-form-item class="item" prop="username" label="用户名称">
            <el-input disabled clearable v-model="gcForm.username"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="usercode" label="登录账号">
            <el-input disabled clearable v-model="gcForm.usercode"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="libName" label="成员馆">
            <el-input disabled clearable v-model="gcForm.libName"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="tel" label="电话">
            <el-input disabled clearable v-model="gcForm.tel"></el-input>
          </el-form-item>
          <el-form-item class="item" prop="userTypeId" label="用户类型">
            <el-select
              filterable
              v-model="gcForm.userTypeId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in userTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="custom__form_wrapper">
          <div class="tit">运营信息</div>
          <el-form-item
            style="flex-basis: 100%;"
            class="item"
            prop="operateCzids"
            label="藏址"
          >
            <el-cascader
              v-model="gcForm.operateCzids"
              style="width: 230px;"
              filterable
              :options="gcfpOptions"
              :props="{ multiple: true }"
              clearable
            ></el-cascader>
          </el-form-item>
        </div>
      </el-form>
      <template v-slot:footer>
        <div class="edit__footer">
          <div>
            <el-button size="mini" @click="resetForm('gcForm')">重置</el-button>
          </div>
          <div>
            <el-button size="mini" type="primary" @click="submitForm('gcForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showGCAside = false">取消</el-button>
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 馆藏批管理 -->
    <side-wrap class="common__side_form" v-if="showGCMultiAside" width="850px">
      <template v-slot:header>
        <div class="edit__header">
          <div class="tits">
            <div class="tit">馆藏批管理</div>
          </div>
          <i class="el-icon-close" @click="showGCMultiAside = false"></i>
        </div>
      </template>
      <div class="edit__content" style="padding:7px 20px 0">
        <el-form
          class="custom__form"
          ref="gcMultiForm"
          :model="gcMultiForm"
          :rules="gcFormRules"
          label-width="80px"
          size="mini"
        >
          <div class="custom__form_wrapper">
            <div>
              用户馆藏可批量更换，可以实现批量修改用户馆藏信息，该操作不能回退，请谨慎操作！
            </div>
            <div class="tit">
              已选择
              {{ multipleUserSelection.length || totalUserListCount }} 个用户
            </div>
            <span></span>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="userTypeId"
              label="用户类型"
            >
              <el-select
                filterable
                v-model="gcMultiForm.userTypeId"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <span></span>
            <el-form-item
              style="flex-basis: 100%;"
              class="item"
              prop="operateCzids"
              label="藏址"
            >
              <el-cascader
                v-model="gcMultiForm.operateCzids"
                style="width: 230px;"
                filterable
                :options="gcfpOptions"
                :props="{ multiple: true }"
                clearable
              ></el-cascader>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <template v-slot:footer>
        <div class="edit__footer border">
          <div>
            <el-button size="mini" @click="resetForm('gcMultiForm')"
              >重置</el-button
            >
          </div>
          <div>
            <el-button
              size="mini"
              type="primary"
              @click="submitForm('gcMultiForm')"
              >保存</el-button
            >
            <el-button size="mini" @click="showGCMultiAside = false"
              >取消</el-button
            >
          </div>
        </div>
      </template>
    </side-wrap>
    <!-- 新增用户IP登录 -->
    <el-dialog
      custom-class="ip__dialog"
      title="新增用户IP登录"
      :visible.sync="showIPList"
    >
      <div class="ip__dialog_filters">
        <div class="dialog__filter">
          <span>计算机代码：</span>
          <el-input
            clearable
            v-model="newIPCode"
            size="mini"
            placeholder="请输入计算机代码"
          ></el-input>
        </div>
        <div class="dialog__filter">
          <span>IP地址：</span>
          <el-input
            clearable
            v-model="newIPAdd"
            size="mini"
            placeholder="请输入IP地址"
          ></el-input>
        </div>
        <el-button
          size="mini"
          @click="
            newIPPage = 1;
            getNewIPList();
          "
          type="primary"
          ><icon-svg icon-class="icon-btn-ico-2" />查询</el-button
        >
      </div>
      <el-table
        border
        ref="newIpTable"
        @row-click="newIPListRowClick"
        :data="newIPList"
        v-loading="isLoadNewIp"
        max-height="300"
        @selection-change="handleNewIPSelectionChange"
      >
        <el-table-column
          type="selection"
          width="35"
          align="center"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="daima"
          label="计算机代码"
        ></el-table-column>
        <el-table-column
          show-overflow-tooltip
          property="ipdizhi"
          label="IP地址"
        ></el-table-column>
        <el-table-column
          property="libName"
          show-overflow-tooltip
          label="成员馆"
        >
        </el-table-column>
      </el-table>
      <el-pagination
        medium
        @current-change="handleNewIPPageChange"
        layout="prev, pager, next"
        :current-page.sync="newIPPage"
        :total="totalNewIpList"
      >
      </el-pagination>
      <span slot="footer" class="dialog-footer">
        <el-button
          type="primary"
          size="mini"
          :disabled="multipleNewIPSelection.length === 0"
          @click="
            handleIPSet();
            showIPList = false;
          "
          >保 存</el-button
        >
        <el-button size="mini" @click="showIPList = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  sysUserSave,
  sysUserGetUser,
  sysUserDelete,
  sysUserList,
  sysRoleSelectByLibId,
  sysUserIPList, // IP列表
  sysUserIPSet, // 用户IP新增
  sysUserIPDel, // 用户IP删除
  sysUserOwnIPList, // 用户IP列表
  saveUserTypeBatch // 批管理保存
} from "api/setting";

import { getGcCollections, UserList } from "api/operation";

import { validateObj } from "utils/validate";

import { mapGetters } from "vuex";
export default {
  name: "set_yhgl",
  computed: {
    ...mapGetters(["libList", "libListSelect", "certTypeList", "eduTypeList"])
  },
  data() {
    this.editTabs = [
      {
        value: "用户详细信息",
        id: 1
      },
      {
        value: "用户IP登录设置",
        id: 2
      }
    ];
    this.userStatusOptions = [
      {
        value: "",
        label: "全部"
      },
      {
        value: 0,
        label: "正常"
      },
      {
        value: 1,
        label: "注销"
      }
    ];
    this.filterOptions = [
      {
        value: "username",
        label: "用户名称"
      },
      {
        value: "usercode",
        label: "登录账号"
      }
    ];
    let validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("密码不能为空"));
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/.test(value)) {
        callback(new Error("密码至少包含6位字符，由数字，大小写字母组成"));
      } else {
        callback();
      }
    };
    this.userInfoFormRules = {
      usercode: [
        { required: true, message: "登录账号不能为空", trigger: "blur" }
      ],
      password: [{ required: true, validator: validatePass, trigger: "blur" }],
      username: [
        { required: true, message: "用户名称不能为空", trigger: "blur" }
      ],
      awaydatetime: [{ required: true, message: "有效日期不能为空" }],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }],
      email: [{ validator: validateObj(false, "email"), trigger: "blur" }],
      tel1: [{ validator: validateObj(false, "tel"), trigger: "blur" }],
      tel2: [{ validator: validateObj(false, "phone"), trigger: "blur" }]
    };
    // 修改用户信息密码非必填
    let validatePass1 = (rule, value, callback) => {
      if (!value) {
        callback();
      } else if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,50}$/.test(value)) {
        callback(new Error("密码至少包含6位字符，由数字，大小写字母组成"));
      } else {
        callback();
      }
    };
    this.userInfoFormRules1 = {
      usercode: [
        { required: true, message: "登录账号不能为空", trigger: "blur" }
      ],
      password: [{ validator: validatePass1, trigger: "blur" }],
      username: [
        { required: true, message: "用户名称不能为空", trigger: "blur" }
      ],
      awaydatetime: [{ required: true, message: "有效日期不能为空" }],
      libId: [{ required: true, message: "成员馆不能为空", trigger: "change" }],
      email: [{ validator: validateObj(false, "email"), trigger: "blur" }],
      tel1: [{ validator: validateObj(false, "tel"), trigger: "blur" }],
      tel2: [{ validator: validateObj(false, "phone"), trigger: "blur" }]
    };
    this.gcFormRules = {
      // operateCzids: [{ required: true, message: "藏址不能为空" }],
      // userTypeId: [
      //   { required: true, message: "请选择用户类型", trigger: "change" }
      // ]
    };
    return {
      // 列表信息
      showAddUserSide: false,
      loadUserListData: false,
      multipleUserSelection: [],
      userList: [],
      currentLibId: this.$store.getters.userInfo.libId,
      selectUserStatus: "",
      currentFilterKey: "username",
      currentFilterVal: "",
      userListPageSize: 15,
      currentUserListPage: 1,
      totalUserListCount: 0,
      currentUserId: "",
      /*-- 新增 - 表单信息 --*/
      userAddForm: {
        usercode: "",
        certtype: "",
        username: "",
        certcard: "",
        sex: "1",
        mode: "0",
        password: "",
        birthday: "",
        roleId: "",
        employdatetime: "",
        tel2: "",
        awaydatetime: "",
        tel1: "",
        libId: "",
        email: "",
        deposit: "",
        linkman: "",
        position: "",
        address: "",
        inServer: "0",
        nation: "",
        reamrk: "",
        homeplace: "",
        degree: ""
      },
      addRoleIdOptions: [],
      editRoleIdOptions: [],
      /*-- 编辑页相关信息 --*/
      userEditForm: {
        usercode: "",
        certtype: "",
        username: "",
        certcard: "",
        sex: "",
        mode: "",
        password: "",
        birthday: "",
        roleId: "",
        employdatetime: "",
        tel2: "",
        awaydatetime: "",
        tel1: "",
        libId: "",
        email: "",
        deposit: "",
        linkman: "",
        position: "",
        address: "",
        inServer: "",
        nation: "",
        reamrk: "",
        homeplace: "",
        degree: ""
      },
      currentEditTab: 1,
      showEditSide: false,
      /*-- IP管理 --*/
      showIPList: false,
      isLoadNewIp: false,
      newIPList: [],
      multipleIPSelection: [],
      multipleNewIPSelection: [],
      totalNewIpList: 0,
      newIPCode: "",
      newIPAdd: "",
      newIPPageSize: 15,
      newIPPage: 1,
      ipConfigList: [],
      // 馆藏
      showGCAside: false,
      showGCMultiAside: false,
      gcForm: {
        username: "",
        usercode: "",
        libName: "",
        tel: "",
        userTypeId: "",
        operateCzids: []
      },
      userTypeOptions: [],
      gcfpOptions: [],
      gcMultiForm: {
        userTypeId: "",
        operateCzids: []
      }
    };
  },
  methods: {
    // 列表相关
    handleSelectionChange(val) {
      this.multipleUserSelection = val.map(item => item.userId);
    },
    userListRowClick(row) {
      this.$refs["userListTable"].toggleRowSelection(row);
    },
    rowDblclick(row) {
      this.checkUserDetail(row.userId);
    },
    userIPListRowClick(row) {
      this.$refs["IpTable"].toggleRowSelection(row);
    },
    newIPListRowClick(row) {
      this.$refs["newIpTable"].toggleRowSelection(row);
    },
    initUserList() {
      this.currentUserListPage = 1;
      this.setUserListRequestObj();
      this.getUserList();
    },
    setUserListRequestObj() {
      this.userListRequestObj = {
        userStatus: this.selectUserStatus,
        libId: this.currentLibId
      };
      this.userListRequestObj[this.currentFilterKey] = this.currentFilterVal;
    },
    getUserList() {
      this.loadUserListData = true;
      let searchObj = {
        pageNumber: this.currentUserListPage,
        pageSize: this.userListPageSize,
        ...this.userListRequestObj
      };

      sysUserList(searchObj)
        .then(res => {
          this.loadUserListData = false;
          this.userList = res.data.dataList;
          this.totalUserListCount = Number(res.data.totalElements);
        })
        .catch(() => {
          this.loadUserListData = false;
        });
    },
    handleUserSizeChange(pageSize) {
      this.userListPageSize = pageSize;
      this.getUserList();
    },
    handleUserCurrentChange(currentPage) {
      this.currentUserListPage = currentPage;
      this.getUserList();
    },
    handleDelUser(ids, index) {
      this.$confirm("确定要删除么?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.loadUserListData = true;
          sysUserDelete({
            userIds: ids ? ids : this.multipleUserSelection.join(",")
          })
            .then(res => {
              this.loadUserListData = false;
              this.$message({
                type: "success",
                message: res.message
              });
              if (index) {
                // 单个删除
                this.userList.splice(index, 1);
              } else {
                this.initUserList();
              }
            })
            .catch(() => {
              this.loadUserListData = false;
            });
        })
        .catch(() => {});
    },
    // 用户新增表单相关
    getAddFormRoleOptions() {
      this.userAddForm.roleId = "";
      if (!this.userAddForm.libId) {
        this.addRoleIdOptions = [];
        return;
      }
      sysRoleSelectByLibId({
        libId: this.userAddForm.libId
      }).then(res => {
        let roleIdOptions = res.data.map(item => {
          return {
            value: item.roleId,
            label: item.roleName
          };
        });

        this.addRoleIdOptions = roleIdOptions;
        this.userAddForm.roleId = roleIdOptions[0]
          ? roleIdOptions[0].value
          : "";
      });
    },
    handleAddFormSubmit() {
      let userData = {
        usercode: this.userAddForm.usercode,
        username: this.userAddForm.username,
        password: this.userAddForm.password,
        mode: this.userAddForm.mode,
        sex: this.userAddForm.sex,
        degree: this.userAddForm.degree,
        birthday: this.userAddForm.birthday,
        certtype: this.userAddForm.certtype,
        certcard: this.userAddForm.certcard,
        nation: this.userAddForm.nation,
        homeplace: this.userAddForm.homeplace,
        employdatetime: this.userAddForm.employdatetime,
        awaydatetime: this.userAddForm.awaydatetime,
        position: this.userAddForm.position,
        inServer: this.userAddForm.inServer,
        linkman: this.userAddForm.linkman,
        tel1: this.userAddForm.tel1,
        tel2: this.userAddForm.tel2,
        address: this.userAddForm.address,
        email: this.userAddForm.email,
        libId: this.userAddForm.libId,
        reamrk: this.userAddForm.reamrk,
        roleId: this.userAddForm.roleId
      };
      sysUserSave(userData).then(res => {
        this.showAddUserSide = false;
        this.$message.success(res.message);
        this.resetForm("userAddForm");
        this.getUserList();
      });
    },
    showAddUser() {
      this.showAddUserSide = true;
    },
    hideAddUser() {
      this.resetForm("userAddForm");
      this.showAddUserSide = false;
    },
    // 馆藏批管理
    handleShowGCAllotMulti() {
      this.resetForm("gcMultiForm");
      this.showGCMultiAside = true;
    },
    saveGcfpMultiInfo() {
      // 批管理保存
      let ids = this.gcMultiForm.operateCzids.map(item => item[1]).join();
      saveUserTypeBatch({
        ...this.userListRequestObj,
        userIds: this.multipleUserSelection.join(),
        userTypeId: this.gcMultiForm.userTypeId,
        operateCzids: ids
      }).then(res => {
        this.$message.success(res.message);
        this.showGCMultiAside = false;
        this.initUserList();
      });
    },
    // 馆藏分配
    handleShowGCAllot(id, index, data) {
      this.showGCAside = true;
      let operateCzids = [];
      if (data.operateCzids) {
        data.operateCzids.split(",").forEach(item => {
          let arr = [];
          arr.push(this.czLipMap[item]);
          arr.push(item);
          operateCzids.push(arr);
        });
      }
      this.gcForm = {
        ...data,
        username: data.username,
        usercode: data.usercode,
        libName: data.libName,
        tel: data.tel2 || data.tel1,
        userTypeId: data.userTypeId
          ? data.userTypeId
          : this.userTypeOptions[0]
          ? this.userTypeOptions[0].value
          : "",
        operateCzids: operateCzids
      };

      this.tempOperateCzids = JSON.stringify(operateCzids);
    },
    saveGcfpInfo() {
      let ids = this.gcForm.operateCzids.map(item => item[1]).join();
      delete this.gcForm["sysUpDate"];
      delete this.gcForm["password"];
      sysUserSave({
        ...this.gcForm,
        operateCzids: ids
      }).then(res => {
        this.$message.success(res.message);
        this.showGCAside = false;
        this.initUserList();
      });
    },
    // 用户详情表单相关
    getEditFormRoleOptions(isReset) {
      if (!this.userEditForm.libId) {
        this.editRoleIdOptions = [];
        this.userEditForm.roleId = "";
        return;
      }
      sysRoleSelectByLibId({
        libId: this.userEditForm.libId
      }).then(res => {
        let roleIdOptions = res.data.map(item => {
          return {
            value: item.roleId,
            label: item.roleName
          };
        });
        this.editRoleIdOptions = roleIdOptions;
        if (isReset) {
          this.userEditForm.roleId = roleIdOptions[0]
            ? roleIdOptions[0].value
            : "";
        } else {
          // 保存初始用户角色类型
          this.editRoleIdOptionsOrigin = Object.assign([], roleIdOptions);
        }
      });
    },
    updateUserInfo() {
      sysUserSave(
        Object.assign(this.userEditForm, {
          userId: this.currentUserId
        })
      )
        .then(res => {
          this.showEditSide = false;
          this.$message.success(res.message);
          this.getUserList();
        })
        .catch(() => {
          this.showEditSide = false;
        });
    },
    checkUserDetail(id, isChangePwd) {
      this.currentUserId = id;
      this.showEditSide = true;
      if (isChangePwd) {
        this.$nextTick(() => {
          this.$refs.pwdInput.select();
        });
      }
      this.getUserDetail();
      this.getUserOwnIp();
    },
    getUserDetail() {
      sysUserGetUser({
        userId: this.currentUserId
      }).then(res => {
        this.currentEditTab = 1;
        let userInfo = res.data.user;
        let roleInfo = res.data.role;
        delete userInfo["sysUpDate"];
        delete userInfo["password"]; // 删除密码字段
        for (const key in userInfo) {
          const element = userInfo[key];
          if (element === null) {
            delete userInfo[key];
          }
        }
        for (const key in roleInfo) {
          const element = roleInfo[key];
          if (element === null) {
            delete roleInfo[key];
          }
        }
        this.userEditFormOrigin = Object.assign({}, roleInfo, userInfo);
        this.userEditForm = Object.assign({}, roleInfo, userInfo);
        this.getEditFormRoleOptions();
      });
    },
    // 通用
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (formName === "userAddForm") {
            this.handleAddFormSubmit();
          } else if (formName === "userEditForm") {
            this.updateUserInfo();
          } else if (formName === "gcForm") {
            this.saveGcfpInfo();
          } else if (formName === "gcMultiForm") {
            this.saveGcfpMultiInfo();
          }
        } else {
          return false;
        }
      });
    },
    resetForm(formName) {
      if (formName === "userEditForm") {
        this.userEditForm = Object.assign({}, this.userEditFormOrigin);
        this.editRoleIdOptions = Object.assign(
          [],
          this.editRoleIdOptionsOrigin
        );
      } else if (formName === "userAddForm") {
        this.$nextTick(() => {
          this.$refs[formName].resetFields();
        });
        this.addRoleIdOptions = [];
      } else if (formName === "gcForm") {
        this.gcForm.operateCzids = JSON.parse(this.tempOperateCzids);
      } else if (formName === "gcMultiForm") {
        this.gcMultiForm.operateCzids = [];
        this.gcMultiForm.userTypeId = "";
      }
    },
    // IP管理
    handleNewIPPageChange(page) {
      this.newIPPage = page;
      this.getNewIPList();
    },
    showIPListDialog() {
      this.newIPList = [];
      this.showIPList = true;
      this.getNewIPList();
    },
    getUserOwnIp() {
      sysUserOwnIPList({
        userId: this.currentUserId
      }).then(res => {
        this.ipConfigList = res.data;
      });
    },
    getNewIPList() {
      this.isLoadNewIp = true;
      sysUserIPList({
        pageNumber: this.newIPPage,
        pageSize: this.newIPPageSize,
        userId: this.currentUserId,
        daima: this.newIPCode,
        ipAddress: this.newIPAdd
      })
        .then(res => {
          this.isLoadNewIp = false;
          this.newIPList = res.data.dataList;
          this.totalNewIpList = Number.parseInt(res.data.totalElements, 10);
        })
        .catch(() => {
          this.isLoadNewIp = false;
        });
    },
    handleIPSelectionChange(ip) {
      this.multipleIPSelection = ip.map(item => item.useripid);
    },
    handleNewIPSelectionChange(ip) {
      this.multipleNewIPSelection = ip.map(item => item.ipid);
    },
    handleIPSet() {
      if (this.isUserIPSet) {
        return;
      }
      this.isUserIPSet = true;
      sysUserIPSet({
        userId: this.currentUserId,
        ipIds: this.multipleNewIPSelection.join(",")
      })
        .then(res => {
          this.$message.success(res.message);
          this.showIPList = false;
          this.getUserOwnIp();
        })
        .finally(() => {
          // 防止重复点击
          setTimeout(() => {
            this.isUserIPSet = false;
          }, 1000);
        });
    },
    handleDelIP(ip, index) {
      sysUserIPDel({
        userIpIds: ip || this.multipleIPSelection.join(",")
      }).then(res => {
        this.$message.success(res.message);
        if (index) {
          this.ipConfigList.splice(index, 1);
        } else {
          this.getUserOwnIp();
        }
      });
    },
    // 获取馆藏列表
    getGcCollections() {
      getGcCollections().then(res => {
        let data = res.data.filter(item => {
          return item.czInfo.length > 0;
        });
        this.czLipMap = {}; // 藏址对应的父级馆id
        let renameArr = [];
        data.forEach(libItem => {
          let arr = [];
          libItem.czInfo.forEach(czItem => {
            this.czLipMap[czItem.czId] = libItem.libId;
            arr.push({
              label: czItem.czName,
              value: czItem.czId
            });
          });
          renameArr.push({
            label: libItem.libName,
            value: libItem.libId,
            children: arr
          });
        });
        this.gcfpOptions = renameArr;
      });
    },
    // 获取用户类型
    getUserType() {
      UserList().then(res => {
        this.userTypeOptions = res.data.map(item => {
          return {
            label: item.userTypeName,
            value: item.userTypeId
          };
        });
      });
    }
  },
  created() {
    this.getGcCollections();
    this.getUserType();
  },
  activated() {
    this.getGcCollections();
    this.getUserType();
    this.$refs["focusInput"].focus();
  },
  mounted() {
    this.certTypeNameObj = {};
    this.certTypeList.map(item => {
      this.certTypeNameObj[item.dictId] = item.dictName;
    });
    this.eduTypeNameObj = {};
    this.eduTypeList.map(item => {
      this.eduTypeNameObj[item.dictId] = item.dictName;
    });
    this.initUserList();
    if (this.$route.params.userId) {
      this.checkUserDetail(this.$route.params.userId, true);
    } else {
      this.$refs["focusInput"].focus();
    }
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonStyle.less";
.set-yhgl {
  .server__status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    margin-right: 4px;
    display: inline-block;
  }
  .server__status_on {
    background: @successColor;
  }
  .server__status_off {
    background: @fontTintColor;
  }
  .edit__ip {
    .tit {
      width: 100%;
      display: flex;
      justify-content: space-between;
      font-weight: 700;
      margin: 20px 0;
      color: #000;
      font-size: 0.15rem;
    }
    .header__ops {
      padding-right: 0;
    }
  }
  .ip__dialog {
    .ip__dialog_filters {
      display: flex;
      margin-bottom: 20px;
      .dialog__filter {
        margin-right: 25px;
        display: flex;
        align-items: center;
        span {
          flex-shrink: 0;
        }
      }
    }
    .el-pagination {
      text-align: center;
      margin-top: 10px;
    }
  }
}
</style>
