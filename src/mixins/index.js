/*
 * @Description:
 * @Autor: chenming.feng
 * @Date: 2019-08-14 11:53:21
 * @LastEditors: chenming.feng
 * @LastEditTime: 2020-03-06 10:26:15
 */

// let barCodekeyCodesSearch = null;
// let barCodetimerSearch = null;
// let isNextUpper = false;

// // 不需要大写
// function notNeedUpper(keyCode) {
//   if (keyCode >= 48 && keyCode <= 57) return true;
//   if (keyCode >= 96 && keyCode <= 108) return true;
//   if (keyCode == 8) return true;
//   if (keyCode == 13) return true;
//   if (keyCode == 16) return true;
//   if (keyCode == 190) return true;
//   return false;
// }

const tdStorageKey = "tdStorage";

const mixin = {
  methods: {
    // key用时间戳表示
    setLocalStorageObj(key, value) {
      if (!localStorage.getItem(tdStorageKey)) {
        localStorage.setItem(tdStorageKey, JSON.stringify({}));
      }
      let Obj = JSON.parse(localStorage.getItem(tdStorageKey));
      Obj[key] = value;
      localStorage.setItem(tdStorageKey, JSON.stringify(Obj));
    },
    getLocalStorageObj(key) {
      if (!localStorage.getItem(tdStorageKey)) {
        return false;
      }
      return JSON.parse(localStorage.getItem(tdStorageKey))[key] || false;
    },
    // 返回下拉列表中第一个选项的值（默认 key 为 value）
    getArrFirstValue(arr, key = "value") {
      if (Object.prototype.toString.call([]) !== "[object Array]") {
        // eslint-disable-next-line no-console
        console.warn("getArrFirstValue 传入值不是数组，请检查");
        return "";
      }
      return arr.length > 0 ? arr[0][key] : "";
    },
    delayFunc(cb) {
      setTimeout(() => {
        cb();
      }, 200);
    },
    // event, cb, cb1
    handleBarCodeScanner() {
      // // console.log(event, event.key, event.code, event.keyCode);
      // // https://www.weibo.com/ttarticle/p/show?id=2309404214895699697077&mod=zwenzhang
      // if (!barCodekeyCodesSearch) {
      //   barCodekeyCodesSearch = [];
      // }
      // // console.log(event, event.keyCode);
      // // 如果16一位下个字符串是大写
      // if (event.keyCode === 16) {
      //   isNextUpper = true;
      // }
      // if (event.keyCode !== 16 && isNextUpper) {
      //   // 大写
      //   barCodekeyCodesSearch.push(event.keyCode);
      // } else if (event.keyCode !== 16) {
      //   // 小写或者不用处理
      //   if (notNeedUpper(event.keyCode)) {
      //     // 数字不用处理
      //     barCodekeyCodesSearch.push(+event.keyCode);
      //   } else {
      //     barCodekeyCodesSearch.push(+event.keyCode + 32);
      //   }
      //   isNextUpper = false;
      // }
      // if (barCodetimerSearch) {
      //   clearTimeout(barCodetimerSearch);
      // }
      // barCodetimerSearch = setTimeout(async () => {
      //   // 要将正常输入和扫码输入区分开来
      //   // 定时器 60ms 后执行，当 60ms 内触发下一个键时，重置定时器，直到触发定时器，算是记录下整个扫码得到的键码，再进行转换。
      //   // 为了避免极速输入，要判断满足输入长度超过 6 个字符才触发
      //   if (barCodekeyCodesSearch.length > 6) {
      //     let keysArr = Object.assign([], barCodekeyCodesSearch);
      //     if (keysArr[0] === 16) {
      //       keysArr.splice(0, 1);
      //     }
      //     let shouldEmitEnter = false;
      //     // console.log("keysArr", keysArr);
      //     if (keysArr[keysArr.length - 1] === 13) {
      //       // 如果监听到最后一个回车还要单独触发业务
      //       keysArr.splice(keysArr.length - 1);
      //     } else {
      //       shouldEmitEnter = true;
      //     }
      //     let strArr = keysArr.map(item => String.fromCharCode(item));
      //     let dataStr = strArr.join("");
      //     if (cb) {
      //       // 修改文本框数据
      //       cb(dataStr);
      //     }
      //     if (shouldEmitEnter && cb1) {
      //       // 触发业务逻辑
      //       cb1();
      //     }
      //   }
      //   barCodekeyCodesSearch = null;
      //   barCodetimerSearch = null;
      //   isNextUpper = false;
      // }, 60);
    }
  }
};

export default mixin;
