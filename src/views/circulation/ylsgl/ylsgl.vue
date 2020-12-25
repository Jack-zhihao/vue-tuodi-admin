<!--
 * @Description: 
 * @Autor: wj.liang
 * @Date: 2019-10-31 13:56:37
 * @LastEditors  : wj.liang
 * @LastEditTime : 2020-02-04 11:26:22
 -->
<template>
  <div class="ylsgl">
    <div class="c-tab__header">
      <span
        class="header__item"
        v-for="(item, index) in bottomTabs"
        @click="changeBottomMode(index)"
        :key="index"
        :class="{ active: currentBottomMode == index }"
        >{{ item.label }}</span
      >
    </div>
    <div class="c-tab_body">
      <div class="left">
        <span v-if="currentBottomMode == 0" style="fontWeight:700"
          >入室登记</span
        >
        <span v-if="currentBottomMode == 1" style="fontWeight:700"
          >出室登记</span
        >
        <span v-if="currentBottomMode == 2" style="fontWeight:700"
          >座位预约</span
        >
        <div class="dengji">
          <el-form
            class="addForm custom__form"
            label-width="80px"
            :model="literatureAddForm"
            :rules="rules"
            ref="literatureAddForm"
          >
            <el-form-item class="item" label="读者证号" prop="dzzh">
              <el-input
                clearable
                size="mini"
                v-model="literatureAddForm.dzzh"
                placeholder="请输入读者证号"
                ref="dzzh"
                @keyup.enter.native="submitForm"
              ></el-input>
            </el-form-item>
            <el-form-item class="item" label="页面刷新">
              <el-select
                filterable
                size="mini"
                v-model="literatureAddForm.shuaxin"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in shuaxinArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item class="item" label="成员馆">
              <el-select
                filterable
                size="mini"
                v-model="literatureAddForm.libId"
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
            </el-form-item>
            <el-form-item class="item" label="阅览室" prop="readerRoomId">
              <el-select
                filterable
                size="mini"
                v-model="literatureAddForm.readerRoomId"
                placeholder="请选择"
                @keyup.enter.native="submitForm"
                ref="readerRoomId"
              >
                <el-option
                  v-for="item in readerRoomArr"
                  :key="item.value"
                  :label="item.readingroomName"
                  :value="item.readingroomId"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item
              class="item"
              label="剩余座位数："
              v-if="currentBottomMode == 2"
              >{{ literatureAddForm.Ticket }}</el-form-item
            >
            <el-form-item class="item"></el-form-item>
            <!-- <el-form-item class="item"> -->
            <el-button
              class="btn"
              type="primary"
              @click="submitForm"
              size="mini"
              >确定</el-button
            >
            <!-- </el-form-item> -->
          </el-form>
        </div>
      </div>
      <div class="right">
        <span style="fontWeight:700">读者信息</span>
        <div class="dzxx">
          <div>
            <span class="item__name">读者证号</span
            ><span class="item__label">{{ taoFrom.readerNum }}</span>
          </div>
          <div>
            <span class="item__name">读者姓名</span
            ><span class="item__label">{{ taoFrom.readerName }}</span>
          </div>
          <div>
            <span class="item__name">读者单位</span
            ><span class="item__label">{{ taoFrom.unit }}</span>
          </div>
          <div>
            <span class="item__name">读者类型</span
            ><span class="item__label">{{ taoFrom.type }}</span>
          </div>
          <div>
            <span class="item__name">有效期</span
            ><span class="item__label" :title="taoFrom.endDate">{{
              taoFrom.endDate
            }}</span>
          </div>
          <div>
            <span class="item__name">证件号码</span
            ><span class="item__label" :title="taoFrom.cardNum">{{
              taoFrom.cardNum
            }}</span>
          </div>
          <div>
            <span class="item__name">状态</span
            ><span class="item__label">{{ taoFrom.status }}</span>
          </div>
          <div>
            <span class="item__name">联系方式</span
            ><span class="item__label" :title="taoFrom.phone">{{
              taoFrom.phone
            }}</span>
          </div>
          <div>
            <span class="item__name">备注</span
            ><span class="item__label">{{ taoFrom.Remarks }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { enterRoom, RoomId, outRoom, seatBooking } from "api/circulation";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      rules: {
        readerRoomId: [
          { required: true, message: "请选择阅览室", trigger: "change" }
        ],
        dzzh: [{ required: true, message: "请输入读者证号", trigger: "blur" }]
      },
      bottomTabs: [
        {
          label: "入室登记"
        },
        {
          label: "出室登记"
        },
        {
          label: "座位预约"
        }
      ],
      currentBottomMode: "0",
      shuaxinArr: [
        { value: "0", label: "不刷新" },
        { value: "30", label: "30秒" },
        { value: "60", label: "60秒" },
        { value: "2", label: "2分钟" },
        { value: "5", label: "5分钟" }
      ],
      readerRoomArr: [],

      literatureAddForm: {
        shuaxin: "0",
        dzzh: "",
        libId: this.$store.getters.userInfo.libId,
        readerRoomId: "",
        Ticket: "",
        timer: ""
      },
      taoFrom: {
        readerNum: "",
        readerName: "",
        unit: "",
        type: "",
        endDate: "",
        cardNum: "",
        status: "",
        phone: "",
        Remarks: ""
      }
    };
  },
  computed: {
    ...mapGetters(["libList"])
  },
  methods: {
    changeBottomMode(index) {
      this.currentBottomMode = index;
    },
    // 初始化阅览室
    initialReadingRoom() {
      RoomId({ libId: this.literatureAddForm.libId }).then(res => {
        this.readerRoomArr = res.data.map(item => {
          return {
            readingroomId: item.readingroomId,
            readingroomName: item.readingroomName
          };
        });
      });
    },
    // 入室登记接口
    enterRoom() {
      let params = {
        dzzhao: this.literatureAddForm.dzzh,
        readingroomId: this.literatureAddForm.readerRoomId,
        libId: this.literatureAddForm.libId
      };
      enterRoom(params).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.taoFrom.readerNum = res.data.dzzhao;
          this.taoFrom.readerName = res.data.xming;
          this.taoFrom.unit = res.data.dzdw;
          this.taoFrom.type = res.data.readerType;
          this.taoFrom.endDate = res.data.jzrqi;
          this.taoFrom.cardNum = res.data.zjhma;
          this.taoFrom.status = res.data.ztai;
          this.taoFrom.phone = res.data.shouji;
          this.taoFrom.Remarks = res.data.beizhu;
        }
      });
    },
    // 出室登记接口
    outRoom() {
      let params = {
        dzzhao: this.literatureAddForm.dzzh,
        readingroomId: this.literatureAddForm.readerRoomId,
        libId: this.literatureAddForm.libId
      };
      outRoom(params).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.taoFrom.readerNum = res.data.dzzhao;
          this.taoFrom.readerName = res.data.xming;
          this.taoFrom.unit = res.data.dzdw;
          this.taoFrom.type = res.data.readerType;
          this.taoFrom.endDate = res.data.jzrqi;
          this.taoFrom.cardNum = res.data.zjhma;
          this.taoFrom.status = res.data.ztai;
          this.taoFrom.phone = res.data.shouji;
          this.taoFrom.Remarks = res.data.beizhu;
        }
      });
    },
    seatBooking() {
      let params = {
        dzzhao: this.literatureAddForm.dzzh,
        readingroomId: this.literatureAddForm.readerRoomId,
        libId: this.literatureAddForm.libId
      };
      seatBooking(params).then(res => {
        if (res.code == 0) {
          this.$message.success(res.message);
          this.taoFrom.readerNum = res.data.dzzhao;
          this.taoFrom.readerName = res.data.xming;
          this.taoFrom.unit = res.data.dzdw;
          this.taoFrom.type = res.data.readerType;
          this.taoFrom.endDate = res.data.jzrqi;
          this.taoFrom.cardNum = res.data.zjhma;
          this.taoFrom.status = res.data.ztai;
          this.taoFrom.phone = res.data.shouji;
          this.taoFrom.Remarks = res.data.beizhu;
          this.literatureAddForm.Ticket = res.jump;
        }
      });
    },
    submitForm() {
      this.$refs.literatureAddForm.validate((valid, err) => {
        if (valid) {
          if (this.currentBottomMode == 0) {
            // 入室登记
            switch (this.literatureAddForm.shuaxin) {
              case "0":
                clearInterval(this.timer);
                this.enterRoom();
                break;
              case "30":
                clearInterval(this.timer);
                this.enterRoom();
                this.timer = setInterval(() => {
                  this.enterRoom();
                }, 30000);
                break;
              case "60":
                clearInterval(this.timer);
                this.enterRoom();
                this.timer = setInterval(() => {
                  this.enterRoom();
                }, 60000);
                break;
              case "2":
                clearInterval(this.timer);
                this.enterRoom();
                this.timer = setInterval(() => {
                  this.enterRoom();
                }, 1000 * 2 * 60);
                break;
              case "5":
                clearInterval(this.timer);
                this.enterRoom();
                this.timer = setInterval(() => {
                  this.enterRoom();
                }, 1000 * 5 * 60);
                break;
            }
          } else if (this.currentBottomMode == 1) {
            // 出室登记
            switch (this.literatureAddForm.shuaxin) {
              case "0":
                clearInterval(this.timer);
                this.outRoom();
                break;
              case "30":
                clearInterval(this.timer);
                this.outRoom();
                this.timer = setInterval(() => {
                  this.outRoom();
                }, 30000);
                break;
              case "60":
                clearInterval(this.timer);
                this.outRoom();
                this.timer = setInterval(() => {
                  this.outRoom();
                }, 60000);
                break;
              case "2":
                clearInterval(this.timer);
                this.outRoom();
                this.timer = setInterval(() => {
                  this.outRoom();
                }, 1000 * 2 * 60);
                break;
              case "5":
                clearInterval(this.timer);
                this.outRoom();
                this.timer = setInterval(() => {
                  this.outRoom();
                }, 1000 * 5 * 60);
                break;
            }
          } else if (this.currentBottomMode == 2) {
            // 座位预约
            switch (this.literatureAddForm.shuaxin) {
              case "0":
                clearInterval(this.timer);
                this.seatBooking();
                break;
              case "30":
                clearInterval(this.timer);
                this.seatBooking();
                this.timer = setInterval(() => {
                  this.seatBooking();
                }, 30000);
                break;
              case "60":
                clearInterval(this.timer);
                this.seatBooking();
                this.timer = setInterval(() => {
                  this.seatBooking();
                }, 60000);
                break;
              case "2":
                clearInterval(this.timer);
                this.seatBooking();
                this.timer = setInterval(() => {
                  this.seatBooking();
                }, 1000 * 2 * 60);
                break;
              case "5":
                clearInterval(this.timer);
                this.seatBooking();
                this.timer = setInterval(() => {
                  this.seatBooking();
                }, 1000 * 5 * 60);
                break;
            }
          }
        }
        if (err && Object.keys(err).length > 0) {
          let keysArr = Object.keys(err);
          this.$refs[keysArr[0]].focus();
        }
      });
    }
  },
  created() {
    this.initialReadingRoom();
  },
  mounted() {
    this.$refs["dzzh"].focus();
  }
};
</script>

<style lang="less" scoped>
.c-tab__header {
  display: flex;
  height: 36px;
  align-items: center;
  background: @topBgColor;
  .header__item {
    cursor: pointer;
    height: 36px;
    line-height: 36px;
    padding: 0 17px;
    font-size: @FSize_15;
    &.active {
      font-weight: bold;
      color: @primaryColor;
      background: @contentHdColor;
    }
  }
}
.c-tab_body {
  padding: 20px 0px 20px 20px;
}
.left,
.right {
  display: inline-block;
  width: 50%;
  height: 345px;
  box-sizing: border-box;
  vertical-align: bottom;
  > div {
    border: 1px solid #ccc;
    height: 315px;
    margin-right: 20px;
    margin-top: 10px;
    &.dzxx {
      padding: 15px;
      box-sizing: border-box;
      div {
        display: inline-block;
        width: 50%;
        height: 25px;
        line-height: 25px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        margin-bottom: 10px;
        .item__name {
          display: inline-block;
          width: 85px;
          text-align-last: justify;
          position: relative;
          padding-right: 14px;
          font-size: @FSize_14;
          &:after {
            content: "：";
            position: absolute;
            right: 0px;
          }
        }
        .item__label {
          font-weight: 700;
          font-size: @FSize_14;
        }
      }
    }
    &.dengji {
      padding: 10px;
      box-sizing: border-box;
      position: relative;
    }
  }
}
.item {
  display: flex;
  flex: 0 0 50%;
  margin-top: 10px;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
/deep/.el-form-item__label {
  white-space: nowrap;
  text-align: left;
}
/deep/.el-form-item__content {
  margin-left: 0 !important;
  flex: auto !important;
  max-width: 210px;
  margin-right: 15px;
}
.btn {
  position: absolute;
  bottom: 20px;
  right: 20px;
}
</style>
