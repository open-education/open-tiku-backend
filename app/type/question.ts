// 题目选项信息
export interface QuestionOption {
  label: string;
  content: string;
  images?: string[];
  order: number;
}

// 解题分析
export interface Content {
  content: string;
  images?: string[];
}

// 题目基本信息返回
export interface QuestionBaseInfoResp {
  id: number;
  status: number;
  rejectReason: string;
  questionCateId: number;
  questionTypeId: number;
  questionTagIds?: number[];
  authorId?: number;
  title: string;
  contentPlain: string;
  comment: string;
  difficultyLevel: number;
  images?: string[];
  options?: QuestionOption[];
  optionsLayout?: number;
}

// 题目其它信息返回
export interface QuestionExtraInfoResp {
  answer?: string;
  knowledge?: string;
  analysis?: Content;
  process?: Content;
  remark?: string;
}

// 题目详情信息返回
export interface QuestionInfoResp {
  baseInfo: QuestionBaseInfoResp;
  extraInfo: QuestionExtraInfoResp;
}

// 题目列表请求
export interface QuestionListReq {
  questionCateId: number;
  status?: number;
  questionTypeId?: number;
  pageNo: number;
  pageSize: number;
}

// 题目列表返回
export interface QuestionListResp {
  pageNo: number;
  pageSize: number;
  total: number;
  list: QuestionBaseInfoResp[];
}

// 修改状态
export interface QuestionEditStatusReq {
  id: number;
  status: number;
  rejectReason: string;
}
