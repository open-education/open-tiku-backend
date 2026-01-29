import { Alert, Col, Row, Steps } from "antd";
import { useEffect, useState } from "react";
import Append from "~/dict/chapter/append";
import AppendShow from "~/dict/chapter/append-show";
import Relation from "~/dict/chapter/relation";
import Node from "~/dict/chapter/node";
import type { Textbook } from "~/type/textbook";
import { useFetcher } from "react-router";
import { StringConst, StringConstUtil, StringValidator } from "~/util/string";
import { httpClient } from "~/util/http";
import RelationShow from "~/dict/chapter/relation-show";
import Question from "~/dict/chapter/question";
import QuestionShow from "~/dict/chapter/question-show";

// 教材章节和知识点类管理
export default function Index(props: any) {
  let fetcher = useFetcher();

  // 进度条状态维护
  const [currentStep, setCurrentStep] = useState<number>(0);
  const onStepChange = (value: number) => {
    setCurrentStep(value);
  };

  // 父级菜单选择信息
  const [nodeTextbookOption, setNodeTextbookOption] = useState<Textbook>({
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0,
    pathType: "",
  });

  // 教材章节或者知识点名称, 需要根据父级菜单知道当前属于那一类型
  const [chapterName, setChapterName] = useState<string>("");
  const [chapterNodeIsEmpty, setChapterNodeIsEmpty] = useState<boolean>(false);
  const [chapterNodeMaxDepthLimit, setChapterNodeMaxDepthLimit] = useState<boolean>(false);
  const [chapterIsEmpty, setChapterIsEmpty] = useState<boolean>(false);

  // 教材章节和知识点名称排序编号
  const [chapterSortOrder, setChapterSortOrder] = useState<number>(0);

  // 添加教材章节和知识点名称
  const appendChapterName = () => {
    // 必须有父节点
    if (nodeTextbookOption.id <= 0 || nodeTextbookOption.parentId <= 0) {
      setChapterNodeIsEmpty(true);
      return;
    }
    setChapterNodeIsEmpty(false);

    // 并且该处只能添加第6级和第7级 - 对应的父节点就是 第5级和第6级
    if (!StringConstUtil.dictChapterNameAddMaxDepthSet.has(nodeTextbookOption.pathDepth)) {
      setChapterNodeMaxDepthLimit(true);
      return;
    }
    setChapterNodeMaxDepthLimit(false);

    // 名称不能为空
    if (!StringValidator.isNonEmpty(chapterName)) {
      setChapterIsEmpty(true);
      return;
    }
    setChapterIsEmpty(false);

    // 提交到路由对应的 action 去处理
    fetcher
      .submit(
        {
          source: StringConst.dictChapterNameAdd, // 教材章节和知识点类节点添加
          label: chapterName,
          sortOrder: chapterSortOrder,
          parentId: nodeTextbookOption.id,
          pathDepth: nodeTextbookOption.pathDepth + 1,
          pathType: nodeTextbookOption.pathType,
        },
        { method: "post" },
      )
      .then((_) => {
        // 要刷新第一步的菜单列表
        httpClient
          .get<Textbook[]>(`/textbook/list/${nodeTextbookOption.id}/part`)
          .then((res) => {
            setChapterShowItems(res);
          })
          .catch((err) => {
            console.log("err: ", err);
          });
      })
      .catch((err) => {
        // 请求接口错误
        console.log("err: ", err);
      });
  };

  // 章节节点和知识点名称展示区域
  const [chapterShowItems, setChapterShowItems] = useState<Textbook[]>([]);

  // 第一步菜单层级变动时刷新节点展示
  useEffect(() => {
    // if depth=5
    if (nodeTextbookOption.pathDepth >= 5) {
      httpClient
        .get<Textbook[]>(`/textbook/list/${nodeTextbookOption.id}/part`)
        .then((res) => {
          setChapterShowItems(res);
        })
        .catch((err) => {
          console.log("err: ", err);
        });
    }
  }, [nodeTextbookOption]);

  return (
    <div>
      {/* 描述 */}
      <div className="text-blue-700 font-normal">
        <Row gutter={[12, 12]}>
          <Col span={24}>
            <span>说明: </span>
          </Col>
          <Col span={24}>
            <span>1. 考点选题和章节选题一共均有8个层级;</span>
          </Col>
          <Col span={24}>
            <span>
              2. 章节选题的第7层级跟考点选题的第6层是一一对应的, 但是考点选题还有细分, 因此目前章节选题实际会对应考点选题第6层级的所有子集,
              多次进行关联即可;
            </span>
          </Col>
          <Col span={24}>
            <span>
              3. 题型均挂载在第7层级下面, 因此章节选题下面包括了考点选题的所有题型, 因此题型请在考点选题下面追加,
              否则章节选题追加无法关联考点选题的子集;
            </span>
          </Col>
          <Col span={24}>
            <span>4. 章节选题目前主要是用来查看和选题, 添加题型等后续看是否有细分领域对应关系后再追加;</span>
          </Col>
        </Row>
      </div>

      {/* 提交错误展示错误信息 */}
      <div>{fetcher.data?.error && <Alert title={fetcher.data.error} type="error" />}</div>

      {/* 进度条 */}
      <div className="mt-4">
        <Steps
          current={currentStep}
          onChange={onStepChange}
          orientation="vertical"
          items={[
            {
              title: "第一步. 选择教材章节或考点类别",
              content: <Node textbookOptions={props.textbookOptions} setNodeTextbookOption={setNodeTextbookOption} />,
            },
            {
              title: "第二步. 添加节点",
              content: (
                <Append
                  chapterName={chapterName}
                  setChapterName={setChapterName}
                  appendChapterName={appendChapterName}
                  chapterSortOrder={chapterSortOrder}
                  setChapterSortOrder={setChapterSortOrder}
                  chapterNodeIsEmpty={chapterNodeIsEmpty}
                  chapterNodeMaxDepthLimit={chapterNodeMaxDepthLimit}
                  chapterIsEmpty={chapterIsEmpty}
                />
              ),
            },
            {
              title: "第三步. 节点追加查看",
              content: <AppendShow chapterShowItems={chapterShowItems} setChapterShowItems={setChapterShowItems} />,
            },
            {
              title: "第四步. 关联章节小节和考点小类",
              content: <Relation currentStep={currentStep} />,
            },
            {
              title: "第五步. 关联章节小节和考点小类查看",
              content: <RelationShow currentStep={currentStep} />,
            },
            {
              title: "第六步. 追加题型",
              content: <Question currentStep={currentStep} />,
            },
            {
              title: "第七步. 题型查看",
              content: <QuestionShow currentStep={currentStep} />,
            },
          ]}
        />
      </div>
    </div>
  );
}
