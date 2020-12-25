// https://blog.csdn.net/henyulee/article/details/83383228

/**
 * [handleInput 在输入阶段的处理逻辑]
 * @param  {[DOM]} ele   [当前指令操作的dom对象]
 * @param  {[虚拟节点]} vnode [当前指令渲染的虚拟节点]
 * @param  {[指令信息]} rel   [当前指令的所有指令信息]
 * @param  {[校验类型]} type  [输入阶段的校验类型]
 *      "number": 仅支持输入数字
 *      "float": 仅支持数字和小数点
 */
function handleInput(ele, vnode, rel) {
  let rule;
  let val = ele.value;

  switch (true) {
    case rel.modifiers.float: // 浮点型
      // eslint-disable-next-line
      rule = /[^\d\.]/g;
      val = val.replace(rule, "");
      break;
    default:
      //默认仅支持输入数字
      rule = /\D/g;
      val = Math.floor(val);
  }

  if (rel.modifiers.float === true) {
    let fixedNum = parseFloat(val).toFixed(2);
    val =
      fixedNum !== "NaN"
        ? fixedNum
        : parseFloat(ele.getAttribute("data-number") || 0).toFixed(2);
  } else {
    val = Number.isNaN(val)
      ? parseFloat(ele.getAttribute("data-number") || 0)
      : val;
  }

  let maxLen =
    vnode.data.attrs && vnode.data.attrs["max-len"]
      ? vnode.data.attrs["max-len"]
      : 0;
  if (maxLen > 0) {
    val = val.substr(0, maxLen);
  }

  setValueWithExpressionVue({
    currObj: vnode.context.$data,
    expression: rel.expression,
    value: val,
    key: vnode.key,
    arg: rel.arg,
    toString: rel.modifiers.string || rel.modifiers.float
  });
}

/**
 * [setValueWithExpressionVue 更新数据模型]
 * @param {Boolean} toString    [是否转化为字符串]
 * @param {[type]}  currObj    [当前的数据模型]
 * @param {[type]}  expression [指令表达式]
 * @param {[type]}  value      [指令的值]
 * @param {[type]}  key        [用于批量渲染时的跟踪键]
 * @param {[type]}  arg        [指令的参数]
 */
function setValueWithExpressionVue(option) {
  let expression = option.expression.split(".");
  expression.forEach(function(item, i) {
    if (i < expression.length - 1) {
      option.currObj = option.currObj[item];
    } else {
      if (option.key !== undefined) {
        option.currObj[item][option.key][option.arg] =
          option.value === "" || option.toString
            ? option.value
            : option.value * 1;
      } else {
        option.currObj[item] =
          option.value === "" || option.toString
            ? option.value
            : option.value * 1;
      }
    }
  });
}

export default Vue => {
  Vue.directive("onlyNum", {
    // 当被绑定的元素插入到 DOM 中时……
    inserted: function(el, binding, vnode) {
      let ele = el.tagName === "INPUT" ? el : el.querySelector("input");
      ele.onfocus = function() {
        // eslint-disable-next-line
        let rule = /[^\d\.]/g;
        ele.setAttribute("data-number", ele.value.replace(rule, ""));
      };
      ele.onblur = function() {
        //获取相关的指令配置信息
        let rel = vnode.data.directives.filter(item => {
          return item.name === "only-num";
        })[0];
        vnode.context.$nextTick(() => {
          handleInput(ele, vnode, rel);
        });
      };
    }
  });
  // input监听增加  分隔符 <!-- v-monitor-split="xxx"  -->
  Vue.directive("monitorSplit", {
    inserted: function(el, binding, vnode) {
      let tagName = el.tagName;
      let ele = "";
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        ele = el;
      } else {
        ele = el.querySelector("input") || el.querySelector("textarea");
      }

      ele.addEventListener("keyup", event => {
        if (event.ctrlKey && event.keyCode === 13) {
          let rel = vnode.data.directives.filter(item => {
            return item.name === "monitor-split";
          })[0];
          vnode.context.$nextTick(() => {
            let start = event.target.selectionStart;
            let end = event.target.selectionEnd;
            let value = ele.value;
            value = value.split("");
            value.splice(start, end - start, String.fromCharCode(31));
            let result = value.join("");
            setValueWithExpressionVue({
              currObj: vnode.context.$data,
              expression: rel.expression,
              value: result,
              key: vnode.key,
              arg: rel.arg,
              toString: true
            });
          });
        }
      });
    }
  });
};
