import {Alert, Col, Row, Steps} from "antd";
import React, {useEffect, useState} from "react";
import Append from "~/dict/chapter/append";
import Show from "~/dict/chapter/show";
import Relation from "~/dict/chapter/relation";
import Node from "~/dict/chapter/node";
import type {Textbook} from "~/type/textbook";
import {useFetcher} from "react-router";
import {StringConst, StringValidator} from "~/util/string";
import {httpClient} from "~/util/http";

// 教材章节和知识点类管理
export default function Index(props: any) {
  let fetcher = useFetcher();

  // 进度条状态维护
  const [currentStep, setCurrentStep] = useState(0);
  const onStepChange = (value: number) => {
    setCurrentStep(value);
  };

  // 父级菜单选择信息
  const [nodeTextbookOption, setNodeTextbookOption] = useState<Textbook>({
    children: [], id: 0, key: "", label: "", parentId: 0, pathDepth: 0, sortOrder: 0
  });

  // 教材章节或者知识点名称, 需要根据父级菜单知道当前属于那一类型
  const [chapterName, setChapterName] = useState<string>("");
  const [chapterNodeIsEmpty, setChapterNodeIsEmpty] = useState<boolean>(false);
  const [chapterIsEmpty, setChapterIsEmpty] = useState<boolean>(false);

  // 教材章节和知识点名称排序编号
  const [chapterSortOrder, setChapterSortOrder] = useState<number>(0);

  // 添加教材章节和知识点名称
  const appendChapterName = () => {
    console.log("appendChapterName: ", chapterName);
    // 必须有父节点暂时不限制深度
    if (nodeTextbookOption.id <= 0 || nodeTextbookOption.parentId <= 0) {
      setChapterNodeIsEmpty(true);
      return;
    }
    setChapterNodeIsEmpty(false);

    // 名称不能为空
    if (!StringValidator.isNonEmpty(chapterName)) {
      setChapterIsEmpty(true);
      return;
    }
    setChapterIsEmpty(false);

    // 提交到路由对应的 action 去处理
    fetcher.submit({
      source: StringConst.dictChapterNameAdd, // 教材章节和知识点类节点添加
      label: chapterName,
      sortOrder: chapterSortOrder,
      parentId: nodeTextbookOption.id,
      pathDepth: nodeTextbookOption.pathDepth + 1
    }, {method: "post"}).then(res => {
      // 要刷新第一步的菜单列表
      console.log("res: ", res);
    }).catch(err => {
      // 请求接口错误
      console.log("err: ", err);
    });
  }
  const [chapterPartName, setChapterPartName] = useState<string>("");
  const [chapterPartNodeIsEmpty, setChapterPartNodeIsEmpty] = useState<boolean>(false);
  const [chapterPartNameIsEmpty, setChapterPartNameIsEmpty] = useState<boolean>(false);

  // 排序编号
  const [chapterPartSortOrder, setChapterPartSortOrder] = useState<number>(0);
  const appendChapterPartName = () => {
    console.log("appendChapterPartName submit: ", chapterPartName);
    // 必须有父节点暂时不限制深度
    if (nodeTextbookOption.id <= 0 || nodeTextbookOption.parentId <= 0) {
      setChapterPartNodeIsEmpty(true);
      return;
    }
    setChapterPartNodeIsEmpty(false);

    // 名称不能为空
    if (!StringValidator.isNonEmpty(chapterPartName)) {
      setChapterPartNameIsEmpty(true);
      return;
    }
    setChapterPartNameIsEmpty(false);

    // 提交到路由对应的 action 去处理
    fetcher.submit({
      source: StringConst.dictChapterPartNameAdd, // 章节小节和知识点小类节点添加
      label: chapterPartName,
      sortOrder: chapterPartSortOrder,
      parentId: nodeTextbookOption.id,
      pathDepth: nodeTextbookOption.pathDepth + 1
    }, {method: "post"}).then(res => {
      // 要刷新第一步的菜单列表
    }).catch(err => {
      // 请求接口错误
    });
  }

  // 章节节点和知识点名称展示区域
  const [chapterShowItems, setChapterShowItems] = useState<Textbook[]>([]);

  // 第一步菜单层级变动时刷新节点展示
  useEffect(() => {
    // if depth=5
    if (nodeTextbookOption.pathDepth >= 5) {
      httpClient.get<Textbook[]>(`/textbook/list/${nodeTextbookOption.id}/part`).then(res => {
        setChapterShowItems(res);
      }).catch(err => {
      });
    }
  }, [nodeTextbookOption]);

  return <div>
    {/* 描述 */}
    <div className="text-blue-700 font-normal">
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <span>说明: </span>
        </Col>
        <Col span={24}>
          <span>1. 教材章节和知识点类别是平级的</span>
        </Col>
        <Col span={24}>
          <span>2. 章节节点和知识点小类也是平级的, 这一级要做关联, 因为接下来的末级是挂载题目的菜单</span>
        </Col>
        <Col span={24}>
          <span>3. 追加 章节小节和知识点小类 需要重新选择父级菜单</span>
        </Col>
        <Col span={24}>
          <span>4. 关联章节小节和知识点小类后前端才可以添加题目到该节点上</span>
        </Col>
      </Row>
    </div>

    {/* 提交错误展示错误信息 */}
    <div>
      {fetcher.data?.error && (
        <Alert title={fetcher.data.error} type="error"/>
      )}
    </div>

    {/* 进度条 */}
    <div className="mt-4">
      <Steps
        current={currentStep}
        onChange={onStepChange}
        orientation="vertical"
        items={[
          {
            title: '第一步. 选择教材章节或知识点类别',
            content: <Node
              textbookOptions={props.textbookOptions}
              setNodeTextbookOption={setNodeTextbookOption}
            />,
          },
          {
            title: '第二步. 添加节点',
            content: <Append
              chapterName={chapterName}
              setChapterName={setChapterName}
              appendChapterName={appendChapterName}
              chapterSortOrder={chapterSortOrder}
              setChapterSortOrder={setChapterSortOrder}
              chapterNodeIsEmpty={chapterNodeIsEmpty}
              chapterIsEmpty={chapterIsEmpty}
              chapterPartName={chapterPartName}
              setChapterPartName={setChapterPartName}
              appendChapterPartName={appendChapterPartName}
              chapterPartSortOrder={chapterPartSortOrder}
              setChapterPartSortOrder={setChapterPartSortOrder}
              chapterPartNodeIsEmpty={chapterPartNodeIsEmpty}
              chapterPartNameIsEmpty={chapterPartNameIsEmpty}
            />,
          },
          {
            title: '第三步. 节点展示',
            content: <Show
              chapterShowItems={chapterShowItems}
            />,
          },
          {
            title: '第四步. 关联章节小节和知识点小类',
            content: <Relation/>,
          },
          {
            title: '第五步. 追加题型',
            content: <div>hello</div>,
          },
          {
            title: '第六步. 题型展示',
            content: <div>hello</div>,
          },
        ]}
      />
    </div>

  </div>
}
