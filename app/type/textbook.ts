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
  key: string;
  pathDepth: number; // 深度需要前端根据选择的栏目自己提供
  sortOrder: number;
}

// 更新元数据结构
export interface UpdateTextbookReq {
  id: number;
  parentId?: number;
  label: string;
  key: string;
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
  source: string,
  reqId: number;
  parentId: number;
  label: string;
  code: string;
  sortOrder: number;
  pathDepth: number;
}
