<!--
 *@Description: 
* @Autor: wj.liang
 * @Date: 2019-10-16 14:04:15
 * @LastEditors: xiaohong.lin
 * @LastEditTime: 2020-03-06 09:30:11
 -->
<template>
  <div class=" common__content">
    <!-- 表单内容 -->
    <div class="edit__content">
      <el-form
        class="addForm custom__form"
        ref="literatureForm"
        label-width="80px"
        :model="literatureForm"
        :rules="rules"
      >
        <div class="form__type">
          <div class="tit" style="marginTop:0px;padding:10px 0px 0px 10px">
            <span>书目信息</span>
          </div>
          <el-form-item class="item" label="书库名称" prop="bookLibId">
            <el-select
              filterable
              size="small"
              v-model="literatureForm.bookLibId"
              placeholder="请选择"
              ref="bookLibId"
            >
              <el-option
                v-for="item in libList"
                :key="item.value"
                :label="item.tableDescribe"
                :value="item.tableName"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item class="item item__textarea" prop="isbn" label="I S B N">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.isbn"
              @keyup.native="
                handleBarCodeScanner($event, val => (literatureForm.isbn = val))
              "
              ref="isbn"
            ></el-input>
          </el-form-item>

          <el-form-item
            class="item item__textarea"
            prop="publication"
            label="出版社"
          >
            <el-input
              clearable
              size="small"
              v-model="literatureForm.publication"
              ref="publication"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="分类号">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.fenlh"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="分类名">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.fenlm"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" prop="ztm" label="正题名">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.ztm"
              ref="ztm"
            ></el-input>
          </el-form-item>

          <el-form-item
            class="item item__textarea"
            prop="author"
            label="责任者"
          >
            <el-input
              clearable
              size="small"
              v-model="literatureForm.author"
              ref="author"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="出版日期">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.date"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="价格">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.price"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="语种">
            <el-input
              clearable
              size="small"
              v-model="literatureForm.language"
            ></el-input>
          </el-form-item>

          <el-form-item class="item item__textarea" label="荐购理由">
            <el-input
              type="textarea"
              clearable
              size="small"
              v-model="literatureForm.recommendReason"
              placeholder="请输入荐购理由"
            ></el-input>
          </el-form-item>
        </div>
      </el-form>
    </div>

    <div class="edit__footer border">
      <div
        style="text-align: end;
    margin-right: 20px"
      >
        <el-button
          size="small"
          @click="submitForm('literatureForm')"
          type="primary"
          >保存</el-button
        >
        <el-button size="small" @click="cancelForm('literatureForm')"
          >取消</el-button
        >
      </div>
    </div>
  </div>
</template>
<script>
import { getTableList, yunbookItemsave } from "api/other";
export default {
  name: "opera_addtao",
  data() {
    return {
      libList: [],
      literatureForm: {
        bookLibId: "" || this.$route.query.tableName,
        isbn: "" || this.$route.query.isbn,
        publication:
          "" || this.$route.query.publisher || this.$route.query.publication,
        fenlh: "" || this.$route.query.categoryNo || this.$route.query.fenlh,
        ztm: "" || this.$route.query.title || this.$route.query.ztm,
        author: "" || this.$route.query.author,
        date: "" || this.$route.query.pubdate || this.$route.query.date,
        price: "" || this.$route.query.price,
        language: "" || this.$route.query.language,
        fenlm: "" || this.$route.query.categoryName,
        recommendReason: "" || this.$route.query.recommendReason
      },
      rules: {
        bookLibId: [{ required: true, message: "请选择书库", trigger: "blur" }],
        isbn: [{ required: true, message: "请输入ISBN", trigger: "blur" }],

        publication: [
          { required: true, message: "请输入出版社 ", trigger: "blur" }
        ],
        ztm: [{ required: true, message: "请输入正题名 ", trigger: "blur" }],
        author: [{ required: true, message: "请输入责任者 ", trigger: "blur" }]
      }
    };
  },
  computed: {
    isEdit() {
      return this.$route.meta.isEdit;
    }
  },
  methods: {
    setParams() {
      this.params = {
        tableName: this.literatureForm.bookLibId,
        isbn: this.literatureForm.isbn,
        title: this.literatureForm.ztm,
        author: this.literatureForm.author,
        pubdate: this.literatureForm.date,
        press: this.literatureForm.publication,
        price: this.literatureForm.price,
        flhao: this.literatureForm.fenlh,
        catagory: this.literatureForm.fenlm,
        language: this.literatureForm.language,
        recommendReason: this.literatureForm.recommendReason
      };
    },
    yunbookItemsave() {
      this.setParams();
      this.obj = {
        id: this.$route.query.id,
        oldTableName: this.$route.query.tableName
      };

      if (this.isEdit) {
        // 编辑
        this.params.id = this.obj.id;
        this.params.oldTableName = this.obj.oldTableName;
      }
      yunbookItemsave(this.params).then(res => {
        if (res.code == 0) {
          if (this.isEdit) {
            this.$message.success(res.message);
          } else {
            this.$message.success(res.message);
          }
          this.$refs.literatureForm.resetFields();
          this.$store
            .dispatch("delView", {
              name: this.$route.name,
              path: this.$route.path
            })
            .then(() => {
              //跳转到其他页面
              this.$router.push({
                name: "opera_yts"
              });
            });
        }
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid, error) => {
        if (valid) {
          // 新增或套录接口
          this.yunbookItemsave();
        }
        if (error && Object.keys(error).length > 0) {
          let keysArr = Object.keys(error);
          this.$refs[keysArr[0]].focus();
        }
      });
    },
    cancelForm(formName) {
      this.$refs[formName].resetFields();
      this.$store.dispatch("delView", {
        name: this.$route.name,
        path: this.$route.path
      });
      // 返回上一个路由
      this.$router.go(-1);
    },
    allLib() {
      getTableList().then(res => {
        this.libList = res.data;
      });
    }
  },
  created() {
    this.allLib();
  },
  activated() {
    this.allLib();
  }
};
</script>

<style lang="less" scoped>
@import "~styles/commonContent.less";
.custom__form .item {
  flex: 0 0 30%;
  &:nth-child(2n + 1) {
    justify-content: flex-start;
  }
  .el-select,
  .item__radio,
  .item__text,
  .el-textarea,
  .el-input,
  .el-input-number,
  .el-date-editor .el-select {
    max-width: 230px;
    min-width: 160px;
  }
}
/deep/.el-form-item__label {
  margin-left: 30px !important;
}
.addTao {
  position: absolute;
  right: 15px;
}
</style>
