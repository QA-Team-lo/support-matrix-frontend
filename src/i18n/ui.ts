export const languages = {
  en: "English",
  zh_CN: "简体中文",
};

export const defaultLang = "en";

export const ui = {
  en: {
    "nav.board": "Board Overview",
    "nav.table": "OS Support",
    "nav.list": "Test Reports",
    cpu: "CPU",
    core: "Core",
    ram: "RAM",
    "sys.status": "Status",
    "sys.variant": "Variant",
    "sys.version": "Version",
    "sys.update": "Last Update",
    "og.title": "Test Report",
    search_placeholder: "Search board, cpu, core ...",
    no_board_results: "No boards found matching your search criteria",
    "sort.ruyi": "Ruyisdk Support",
    "sort.asc": "Board Name A-Z",
    "sort.desc": "Board Name Z-A",
  },
  zh_CN: {
    "nav.board": "开发板总览",
    "nav.table": "系统支持",
    "nav.list": "测试报告",
    cpu: "处理器",
    core: "核心",
    ram: "内存",
    "sys.status": "支持状态",
    "sys.variant": "系统变种",
    "sys.version": "系统版本",
    "sys.update": "最后更新",
    "og.title": "测试报告",
    search_placeholder: "查找开发板,处理器,核心...",
    no_board_results: "未找到符合您搜索条件的开发板",
    "sort.ruyi": "Ruyisdk 支持",
    "sort.asc": "开发板名称 A-Z",
    "sort.desc": "开发版名称 Z-A",
  },
} as const;
