import type {Route} from "./+types/index";
import {httpClient} from "~/util/http";
import type {ChapterAndKnowledgeFetcherReq, Textbook, TextbookFetcherReq} from "~/type/textbook";
import {ArrayUtil} from "~/util/object";
import {Spin} from "antd";
import {LoadingOutlined} from "@ant-design/icons";
import Index from "~/dict/chapter/index";
import {StringConst, StringConstUtil, StringValidator} from "~/util/string";
import {ChapterAndKnowledgeUtil, DictSourceUtil, QuestionCateUtil, TextbookReqUtil} from "~/util/dict";

// 路由加载时获取所有层级信息
export async function clientLoader({params}: Route.ClientLoaderArgs) {
  // 只获取前6层, 否则嵌套太深不便于展示也不便于操作
  const textbooks = await httpClient.get<Textbook[]>("/textbook/list/6/all");

  // 转化数据结构供添加和编辑下拉列表使用
  const textbookOptions = ArrayUtil.mapTextbookToOption(textbooks);

  return {textbooks, textbookOptions};
}

// 客户端提交时处理表单操作
export async function clientAction({request}: Route.ClientActionArgs) {
  const formData = await request.formData();

  let source: string = DictSourceUtil.get_fetcher_source(formData);

  if (StringConstUtil.dictChapterNameSet.has(source)) { // 章节节点和知识点添加操作
    let req: TextbookFetcherReq = TextbookReqUtil.get_fetcher_form_data(formData);

    // 删除只有id
    try {
      if (StringConst.dictChapterNameRemove === source) {
        let res = await TextbookReqUtil.delete(req);
        if (res) {
          return {error: "", result: true, parentId: req.parentId};
        }
        return {error: "菜单删除失败", result: false};
      }
    } catch (err) {
      return {error: httpClient.getErrorMessage(err), result: false};
    }

    if (!StringValidator.isNonEmpty(req.label)) {
      return {error: "节点名称不能为空", result: false};
    }

    if (StringConst.dictChapterNameEdit === source) {
      try {
        let res = await TextbookReqUtil.edit(req);
        if (res && res.id > 0) {
          return {error: "", result: true, parentId: req.parentId};
        }
        return {error: "节点追加编辑失败", result: false};
      } catch (err) {
        return {error: httpClient.getErrorMessage(err), result: false};
      }
    } else {
      try {
        let res = await TextbookReqUtil.add(req);
        if (res && res.id > 0) {
          return {error: "", result: true};
        }
        return {error: "节点追加提交失败", result: false};
      } catch (err) {
        return {error: httpClient.getErrorMessage(err), result: false};
      }
    }
  } else if (StringConstUtil.dictChapterKnowledgeSet.has(source)) { // 章节和知识点关联相关操作
    let relationReq: ChapterAndKnowledgeFetcherReq = ChapterAndKnowledgeUtil.get_fetcher_form_data(formData);
    // 如果是解除关联只有id标识
    if (StringConst.dictChapterKnowledgeRelationRemove === source) {
      try {
        let res = await ChapterAndKnowledgeUtil.delete(relationReq);
        if (res) {
          return {error: "", result: true, reqType: source};
        }
        return {error: "解除关联失败", result: false};
      } catch (err) {
        return {error: httpClient.getErrorMessage(err), result: false};
      }
    }

    // 剩下添加关联一个请求
    if (relationReq.chapterId <= 0) {
      return {error: "请选择章节", result: false};
    }
    if (relationReq.knowledgeId <= 0) {
      return {error: "请选择知识点", result: false};
    }
    try {
      let res = await ChapterAndKnowledgeUtil.add(relationReq);
      if (res && res.id > 0) {
        return {error: "", result: true};
      }
      return {error: "添加关联失败", result: false};
    } catch (err) {
      return {error: httpClient.getErrorMessage(err), result: false};
    }
  } else if (StringConstUtil.dictQuestionSet.has(source)) { // 题型相关
    const questionReq = QuestionCateUtil.get_fetcher_form_data(formData);
    if (StringConst.dictQuestionsAdd === source) {
      try {
        let res = await QuestionCateUtil.add(questionReq);
        if (res) {
          return {error: "", result: true};
        }
        return {error: "追加题型失败", result: false};
      } catch (err) {
        return {error: httpClient.getErrorMessage(err), result: false};
      }
    } else {
      try {
        let res = await QuestionCateUtil.delete(questionReq);
        if (res) {
          return {error: "", result: true, reqType: source};
        }
        return {error: "删除题型失败", result: false};
      } catch (err) {
        return {error: httpClient.getErrorMessage(err), result: false};
      }
    }
  } else {
    return {error: "未知行为", result: false};
  }
}

// HydrateFallback is rendered while the client loader is running
export function HydrateFallback() {
  return <Spin indicator={<LoadingOutlined spin/>}/>;
}

export default function Home({loaderData}: Route.ComponentProps) {
  return <Index
    textbooks={loaderData.textbooks}
    textbookOptions={loaderData.textbookOptions}
  />
}
