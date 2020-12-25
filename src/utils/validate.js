/* eslint-disable */
const REG_OBJ = {
  'email': {
    reg: /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/,
    name: "邮箱"
  },
  'phone': {
    reg: /1\d{10}/,
    name: "移动电话"
  },
  'tel': {
    reg: /(\d{4}-|\d{3}-)?(\d{8}|\d{7})/,
    name: "固定电话"
  },
}

// required - 是否必填
// tag - 校验规则标识符
export const validateObj = (required, tag) => (rule, value, callback) => {
  if (!value && value != 0) {
    value = ""
  }
  if (!REG_OBJ[tag]) {
    console.error('没有该正则校验规则，请补充');
    return;
  }
  if (required && value === "") {
    callback(new Error(`请输入${REG_OBJ[tag].name}`));
  } else if (value.length > 0 && !REG_OBJ[tag].reg.test(value)) {
    callback(new Error(`请输入正确的${REG_OBJ[tag].name}`));
  } else {
    callback();
  }
};
