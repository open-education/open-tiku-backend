// 教材元数据结构
export interface Textbook {
  id: number;
  parentId: number;
  label: string;
  key: string;
  sortOrder: number;
  pathDepth: number;
  children?: Textbook[];
}

// 创建元数据结构
export interface CreateTextbookReq {
  parentId?: number;
  label: string;
  pathDepth: number; // 深度需要前端根据选择的栏目自己提供
  sortOrder: number;
}

// 更新元数据结构
export interface UpdateTextbookReq {
  id: number;
  parentId?: number;
  label: string;
  pathDepth: number; // 深度需要前端根据选择的栏目自己提供
  sortOrder: number;
}

// 选择父级菜单时下拉列表数据结构
export interface TextbookOption {
  label: string;
  value: string;
  raw: Textbook;
  children?: TextbookOption[];
}

// fetcher 请求字典表单数据
export interface TextbookFetcherReq {
  reqId: number;
  parentId: number;
  label: string;
  sortOrder: number;
  pathDepth: number;
}

// 章节和知识点关联请求结构
export interface ChapterAndKnowledgeFetcherReq {
  reqId: number;
  chapterId: number;
  knowledgeId: number;
}

// 章节和知识点请求结构
export interface CreateChapterAndKnowledgeReq {
  chapterId: number;
  knowledgeId: number;
}

// 删除章节和知识点关联结构体
export interface DeleteChapterAndKnowledgeReq {
  id: number;
}

// 章节和知识点返回结构体
export interface ChapterAndKnowledgeResp {
  id: number;
  chapterId: number;
  knowledgeId: number;
}

// 题型前端结构体数据结构
export interface QuestionCateFetcherReq {
  reqId: number;
  relatedId: number;
  label: string;
  sortOrder: number;
}

// 题型前端结构体数据结构
export interface CreateQuestionCateReq {
  relatedId: number;
  label: string;
  sortOrder: number;
}

// 题型前端结构体数据结构
export interface QuestionCateResp {
  id: number;
  relatedId: number;
  label: string;
  key: string;
  sortOrder: number;
}

// 教材其它字典
export interface TextbookOtherDictFetcherReq {
  reqId: number;
  textbookId: number;
  typeCode: string;
  label: string;
  sortOrder: number;
  isSelect: boolean;
}

// 教材其它字典创建请求
export interface CreateTextbookOtherDictReq {
  textbookId: number;
  typeCode: string;
  itemValue: string;
  sortOrder: number;
  isSelect: boolean;
}

// 教材其它字典返回
export interface TextbookOtherDictResp {
  id: number;
  textbookId: number;
  typeCode: string;
  itemValue: string;
  sortOrder: number;
  isSelect: boolean;
}

// 教材章节其它字典
export interface TextbookOtherDict {
  id: number;
  textbookId: number;
  typeCode: string;
  itemValue: string;
  sortOrder: number;
}

