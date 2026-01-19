import type {
  ChapterAndKnowledgeFetcherReq,
  ChapterAndKnowledgeResp,
  CreateChapterAndKnowledgeReq,
  CreateQuestionCateReq,
  CreateTextbookOtherDictReq,
  CreateTextbookReq,
  DeleteChapterAndKnowledgeReq,
  QuestionCateFetcherReq,
  QuestionCateResp,
  Textbook,
  TextbookFetcherReq,
  TextbookOtherDictFetcherReq,
  TextbookOtherDictResp,
  UpdateTextbookReq
} from "~/type/textbook";
import {httpClient} from "~/util/http";

// 字典相关来源获取
export const DictSourceUtil = {

  // 获取 fetcher 提交中的来源
  get_fetcher_source: (formData: FormData): string => {
    return formData.get("source")?.toString() ?? "";
  }
}

// 字典相关公共函数
export const TextbookReqUtil = {
  // 从 fetcher 请求中获取表单数据
  get_fetcher_form_data: (formData: FormData): TextbookFetcherReq => {
    return {
      label: formData.get("label")?.toString() ?? "",
      parentId: Number(formData.get("parentId")?.toString() ?? 0),
      pathDepth: Number(formData.get("pathDepth")?.toString() ?? 1),
      reqId: Number(formData.get("id")?.toString() ?? 0),
      sortOrder: Number(formData.get("sortOrder")?.toString() ?? 0),
    };
  },

  // 教材字典创建请求
  add: async (req: TextbookFetcherReq): Promise<Textbook> => {
    const addReq: CreateTextbookReq = {
      label: req.label,
      pathDepth: req.pathDepth,
      sortOrder: req.sortOrder,
    };
    if (req.parentId > 0) {
      addReq.parentId = req.parentId;
    }
    return httpClient.post<Textbook>("/textbook/add", addReq);
  },

  // 教材字典编辑请求
  edit: async (req: TextbookFetcherReq): Promise<Textbook> => {
    let editReq: UpdateTextbookReq = {
      id: req.reqId,
      label: req.label,
      sortOrder: req.sortOrder,
      pathDepth: req.pathDepth,
    };
    if (req.parentId > 0) {
      editReq.parentId = req.parentId;
    }
    return httpClient.post<Textbook>("/textbook/edit", editReq);
  },

  // 删除菜单
  delete: async (req: TextbookFetcherReq): Promise<boolean> => {
    return httpClient.get<boolean>(`/textbook/delete/${req.reqId}`);
  }
}

// 章节和知识点关联工具
export const ChapterAndKnowledgeUtil = {
  // 从 fetcher 请求中获取表单数据
  get_fetcher_form_data: (formData: FormData): ChapterAndKnowledgeFetcherReq => {
    return {
      reqId: Number(formData.get("id")?.toString() ?? 0),
      chapterId: Number(formData.get("chapterId")?.toString() ?? 0),
      knowledgeId: Number(formData.get("knowledgeId")?.toString() ?? 0),
    };
  },

  // 关联
  add: async (req: ChapterAndKnowledgeFetcherReq): Promise<ChapterAndKnowledgeResp> => {
    const addReq: CreateChapterAndKnowledgeReq = {
      chapterId: req.chapterId,
      knowledgeId: req.knowledgeId,
    };
    return httpClient.post<ChapterAndKnowledgeResp>("/chapter-knowledge/add", addReq);
  },

  // 取消关联
  delete: async (req: ChapterAndKnowledgeFetcherReq): Promise<boolean> => {
    const delReq: DeleteChapterAndKnowledgeReq = {
      id: req.reqId
    };
    return httpClient.post<boolean>("/chapter-knowledge/remove", delReq);
  },
}

// 题型工具
export const QuestionCateUtil = {
  // 从 fetcher 请求中获取表单数据
  get_fetcher_form_data: (formData: FormData): QuestionCateFetcherReq => {
    return {
      reqId: Number(formData.get("id")?.toString() ?? 0),
      relatedId: Number(formData.get("relatedId")?.toString() ?? 0),
      label: formData.get("label")?.toString() ?? "",
      sortOrder: Number(formData.get("sortOrder")?.toString() ?? 0),
    };
  },

  // 追加题型
  add: async (req: QuestionCateFetcherReq): Promise<QuestionCateResp> => {
    const addReq: CreateQuestionCateReq = {
      relatedId: req.relatedId,
      label: req.label,
      sortOrder: req.sortOrder,
    };
    return httpClient.post<QuestionCateResp>("/question-cate/add", addReq);
  },

  // 删除题型
  delete: async (req: QuestionCateFetcherReq): Promise<boolean> => {
    return httpClient.get<boolean>(`/question-cate/remove/${req.reqId}`);
  },
}

// 教材其它字典
export const OtherDictUtil = {
  // 从 fetcher 请求中获取表单数据
  get_fetcher_form_data: (formData: FormData): TextbookOtherDictFetcherReq => {
    return {
      reqId: Number(formData.get("id")?.toString() ?? 0),
      textbookId: Number(formData.get("textbookId")?.toString() ?? 0),
      typeCode: formData.get("typeCode")?.toString() ?? "",
      label: formData.get("label")?.toString() ?? "",
      sortOrder: Number(formData.get("sortOrder")?.toString() ?? 0),
      isSelect: Boolean(formData.get("isSelect")?.toString() === "true"),
    };
  },

  add: async (req: TextbookOtherDictFetcherReq): Promise<TextbookOtherDictResp> => {
    const addReq: CreateTextbookOtherDictReq = {
      itemValue: req.label,
      sortOrder: req.sortOrder,
      textbookId: req.textbookId,
      typeCode: req.typeCode,
      isSelect: req.isSelect,
    }
    return httpClient.post<TextbookOtherDictResp>("/other/dict/add", addReq);
  },

  remove: async (req: TextbookOtherDictFetcherReq): Promise<boolean> => {
    return httpClient.get<boolean>(`/other/dict/remove/${req.reqId}`);
  }
}
