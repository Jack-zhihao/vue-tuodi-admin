import { commLibList, commDictionary } from "api/public";
const app = {
  state: {
    libList: null,
    libListSelect: null,
    libTypeObj: {},
    CRM_CERT_TYPE: null, // 证件类型
    CRM_EDUCATION: null // 学历类型
  },
  mutations: {
    SET_LIB_LIST: (state, libList) => {
      state.libList = libList;
    },
    SET_LIB_TYPE: (state, libTypeObj) => {
      state.libTypeObj = libTypeObj;
    },
    SET_LIB_LIST_SELECT: (state, libListSelect) => {
      state.libListSelect = libListSelect;
    },
    SET_CRM_CERT_TYPE: (state, types) => {
      state.CRM_CERT_TYPE = types;
    },
    SET_CRM_EDUCATION: (state, types) => {
      state.CRM_EDUCATION = types;
    }
  },
  actions: {
    // 获取馆列表
    GetLibList({ commit }) {
      return new Promise((resolve, reject) => {
        commLibList()
          .then(res => {
            let libTypeObj = {};
            let formatResult = res.data
              .map(item => {
                libTypeObj[item.libId] = item.libType;
                return {
                  value: item.libId,
                  label: item.libJiancheng,
                  libType: item.libType
                };
              })
              .sort((a, b) =>
                a["label"].localeCompare(b["label"], "zh-Hans-CN", {
                  sensitivity: "accent"
                })
              );
            commit("SET_LIB_LIST", Object.assign([], formatResult));
            commit("SET_LIB_TYPE", libTypeObj);
            let libListSelect = Object.assign([], formatResult);
            if (libListSelect.length > 1) {
              libListSelect.unshift({
                value: "",
                label: "全部"
              });
            }
            commit("SET_LIB_LIST_SELECT", libListSelect);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获取证件类型
    GetCertTypes({ commit }) {
      return new Promise((resolve, reject) => {
        commDictionary("CRM_CERT_TYPE")
          .then(res => {
            commit("SET_CRM_CERT_TYPE", res.data);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    },
    // 获学历类型
    GetEduTypes({ commit }) {
      return new Promise((resolve, reject) => {
        commDictionary("CRM_EDUCATION")
          .then(res => {
            commit("SET_CRM_EDUCATION", res.data);
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      });
    }
  }
};
export default app;
