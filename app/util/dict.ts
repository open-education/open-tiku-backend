import type {CreateTextbookReq, Textbook, TextbookFetcherReq, UpdateTextbookReq} from "~/type/textbook";
import {httpClient} from "~/util/http";

// 字典相关公共函数
export const TextbookReqUtil = {
  // 从 fetcher 请求中获取表单数据
  get_fetcher_form_data: (formData: FormData): TextbookFetcherReq => {
    return {
      code: formData.get("code")?.toString() ?? "",
      label: formData.get("label")?.toString() ?? "",
      parentId: Number(formData.get("parentId")?.toString() ?? 0),
      pathDepth: Number(formData.get("pathDepth")?.toString() ?? 1),
      reqId: Number(formData.get("id")?.toString() ?? 0),
      sortOrder: Number(formData.get("sortOrder")?.toString() ?? 0),
      source: formData.get("source")?.toString() ?? ""
    };
  },

  // 教材字典创建请求
  add: async (req: TextbookFetcherReq): Promise<Textbook> => {
    const addReq: CreateTextbookReq = {
      label: req.label,
      key: req.code,
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
      key: req.code,
      sortOrder: req.sortOrder,
      pathDepth: req.pathDepth,
    };
    if (req.parentId > 0) {
      editReq.parentId = req.parentId;
    }
    return httpClient.post<Textbook>("/textbook/edit", editReq);
  },
}
