// 馆藏状态
export const ZTAI_OPTIONS = [
  {
    label: "编目",
    value: "编目"
  },
  {
    label: "在馆",
    value: "在馆"
  },
  {
    label: "借出",
    value: "借出"
  },
  {
    label: "丢失",
    value: "丢失"
  },
  {
    label: "剔除",
    value: "剔除"
  },
  {
    label: "交换",
    value: "交换"
  },
  {
    label: "赠送",
    value: "赠送"
  },
  {
    label: "装订",
    value: "装订"
  },
  {
    label: "锁定",
    value: "锁定"
  },
  {
    label: "预约",
    value: "预约"
  },
  {
    label: "清点",
    value: "清点"
  },
  {
    label: "闭架",
    value: "闭架"
  },
  {
    label: "修补",
    value: "修补"
  },
  {
    label: "移送",
    value: "移送"
  },
  {
    label: "清查",
    value: "清查"
  }
];
// 图书类型
export const BOOKTYPE_OPTIONS = [
  {
    label: "全部",
    value: ""
  },
  {
    label: "普通图书",
    value: "aa"
  },
  {
    label: "期刊",
    value: "bb"
  }
];
// 馆藏装订方式
export const ZDFANGSHI_OPTIONS = [
  {
    label: "平装",
    value: "平装"
  },
  {
    label: "精装",
    value: "精装"
  },
  {
    label: "软精装",
    value: "软精装"
  },
  {
    label: "简装",
    value: "简装"
  },
  {
    label: "压模",
    value: "压模"
  },
  {
    label: "线装",
    value: "线装"
  }
];
// 馆藏介质类型
export const JZLEIXING_OPTIONS = [
  {
    label: "纸张",
    value: "纸张"
  },
  {
    label: "电子数据",
    value: "数据"
  },
  {
    label: "VCD",
    value: "vcd"
  },
  {
    label: "DVD",
    value: "dvd"
  },
  {
    label: "CD",
    value: "cd"
  },
  {
    label: "微缩胶片",
    value: "微缩胶片"
  },
  {
    label: "录像带",
    value: "录像带"
  },
  {
    label: "其他",
    value: "其他"
  }
];
// 馆藏来源
export const WXLYUAN_OPTIONS = [
  {
    label: "订购",
    value: "订购"
  },
  {
    label: "邮购",
    value: "邮购"
  },
  {
    label: "交换",
    value: "交换"
  },
  {
    label: "赠送",
    value: "赠送"
  },
  {
    label: "其他",
    value: "其他"
  }
];

// 套录书目列表筛选条件
export const CATALOGUE_DOWNLOAD_FILTER_OPTIONS = [
  {
    value: "isbn",
    label: "ISBN"
  },
  {
    value: "ztming",
    label: "正题名"
  },
  {
    value: "tiaoma",
    label: "条形码"
  },
  {
    value: "sshao",
    label: "索书号"
  },
  {
    value: "flhao",
    label: "分类号"
  },
  {
    value: "zrsming",
    label: "责任者"
  },
  {
    value: "ftming",
    label: "副题名"
  },
  {
    value: "fjming",
    label: "分辑名"
  },
  {
    value: "cbtming",
    label: "丛编题名"
  },
  {
    value: "cbzhe",
    label: "出版社"
  }
];

// 编目字段/中文对照表

export const MARC_CN = {
  ztming: "正题名",
  zrsming: "责任者",
  wxlxing: "文献类型",
  cbdi: "出版地",
  fjian: "附件",
  flhao: "分类号",
  cbrqi: "出版日期",
  smkzhao: "书目控制号",
  isbn: "ISBN",
  issn: "ISSN",
  isrc: "ISRC",
  yzhong: "语种",
  dghao: "订购号",
  wwdghao: "外文订购号",
  yma: "页码",
  jge: "价格",
  qkjge: "期刊价格",
  cbzhe: "出版者",
  ccun: "尺寸",
  tyskhao: "统一书刊号",
  bci: "版次",
  cbzqi: "出版周期",
  fzhu: "附注",
  zti: "主题词",
  zyao: "摘要",
  cbtming: "丛编题名",
  cbzrsming: "丛编责任者",
  tmpyin: "题名拼音",
  zrsmpyin: "责任者拼音",
  fjming: "分辑名",
  ftming: "副题名",
  fjhao: "分辑号",
  bltming: "并列题名",
  otherzrsming: "其他责任者",
  bbysmsfzhu: "版本与书目史附注",
  xgtmfzhu: "相关题名附注",
  nrfzhu: "内容附注",
  blztming: "并列正题名",
  fmtming: "副题名"
};
