// 字符串验证工具类
export const StringValidator = {
  // 检查是否为非空字符串
  isNonEmpty: (str: any) => typeof str === 'string' && str.length > 0,

  // 检查是否为非空白字符串
  isNonWhitespace: (str: any) => typeof str === 'string' && str.trim().length > 0,

  // 检查是否包含特定内容
  contains: (str: any, search: any) => StringValidator.isNonEmpty(str) && str.includes(search),

  // 检查是否以特定内容开头
  startsWith: (str: any, prefix: any) => StringValidator.isNonEmpty(str) && str.startsWith(prefix),

  // 检查是否以特定内容结尾
  endsWith: (str: any, suffix: any) => StringValidator.isNonEmpty(str) && str.endsWith(suffix),

  // 检查长度范围
  isLengthBetween: (str: any, min: any, max: any) => {
    if (!StringValidator.isNonEmpty(str)) return false;
    const length = str.length;
    return length >= min && length <= max;
  }
}

// 字符串相关工具函数
export const StringUtil = {
  getFirstPart: (str: string | undefined, separator: string = '_'): string => {
    return str === undefined ? "" : str.split(separator)[0] || '';
  },

  getLastPart: (str: string | undefined, separator: string = '_'): string => {
    if (str === undefined) return "";
    const lastIndex = str.lastIndexOf(separator);
    return lastIndex === -1 ? str : str.slice(lastIndex + 1);
  },

  removeLastPart: (str: string | undefined, separator: string = '_'): string => {
    if (str === undefined) return "";
    const lastUnderscoreIndex = str.lastIndexOf(separator);
    if (lastUnderscoreIndex === -1) {
      return '';
    }
    return str.substring(0, lastUnderscoreIndex);
  },

  getRandomInt: (min: number = 1, max: number = 500): number => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}

// 常量维护
export const StringConst = {
  dictTextbookAdd: "dictTextbookAdd", // 教材字典新增标识
  dictTextbookEdit: "dictTextbookEdit", // 教材字典编辑标识
  dictChapterNameAdd: "dictChapterNameAdd", // 教材章节和知识点类节点添加
  dictChapterPartNameAdd: "dictChapterPartNameAdd", // 章节小节和知识点小类节点添加
  dictChapterNameEdit: "dictChapterNameEdit", // 教材章节和知识点类节点编辑
  dictChapterPartNameEdit: "dictChapterPartNameEdit", // 章节小节和知识点小类节点编辑
}

export const StringConstUtil = {
  dictChapterNameAddSet: new Set([StringConst.dictChapterNameAdd, StringConst.dictChapterPartNameAdd]),
  dictChapterNameEditSet: new Set([StringConst.dictChapterNameEdit, StringConst.dictChapterPartNameEdit]),
}
