import {Alert, Button, Cascader, type CascaderProps, Col, Row, Splitter} from "antd";
import React, {useEffect} from "react";
import type {Textbook, TextbookOption} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import {useFetcher} from "react-router";
import {StringConst} from "~/util/string";

// 关联章节节点和知识点小类名称
export default function Relation(props: any) {
  let fetcher = useFetcher();

  // 操作进度提示
  const currentStep: number = props.currentStep ?? 0;

  // 章节节点小类
  const [selectChapterOptions, setSelectChapterOptions] = React.useState<TextbookOption[]>([]);
  const [selectChapterOption, setSelectChapterOption] = React.useState<Textbook>({
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0
  });
  const [selectChapterOptionIsEmpty, setSelectChapterOptionIsEmpty] = React.useState<boolean>(false);
  const [selectChapterOptionMaxDepthLimit, setSelectChapterOptionMaxDepthLimit] = React.useState<boolean>(false);
  const onSelectChapterOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    setSelectChapterOption(selectedOptions[selectedOptions.length - 1].raw);
  };

  // 知识点小类
  const [selectKnowledgeOptions, setSelectKnowledgeOptions] = React.useState<TextbookOption[]>([]);
  const [selectKnowledgeOption, setSelectKnowledgeOption] = React.useState<Textbook>({
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0
  });
  const [selectKnowledgeOptionIsEmpty, setSelectKnowledgeOptionIsEmpty] = React.useState<boolean>(false);
  const [selectKnowledgeOptionMaxDepthLimit, setSelectKnowledgeOptionMaxDepthLimit] = React.useState<boolean>(false);
  const onSelectKnowledgeOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    setSelectKnowledgeOption(selectedOptions[selectedOptions.length - 1].raw);
  };

  // 监听进度条是否是第四步, 如果步骤顺序调整请顺带更新索引, 其它步骤不关注该区块内容
  useEffect(() => {
    if (currentStep === 3) {
      // 刷新菜单列表
      httpClient.get<Textbook[]>("/textbook/list/7/all").then(res => {
        const textbookOptions: TextbookOption[] = ArrayUtil.mapTextbookToOption(res);
        // 初始化两天都维护同样的内容即可, 因为后续选择可能会单独改变, 如果不变列表数据用同一份即可
        setSelectChapterOptions(textbookOptions);
        setSelectKnowledgeOptions(textbookOptions);
      }).catch(err => {
        console.log(err);
      });
    }
  }, [currentStep]);

  // 关联章节和知识点
  const onRelationClick = () => {
    if (selectChapterOption.id <= 0) {
      setSelectChapterOptionIsEmpty(true);
      return
    }
    setSelectChapterOptionIsEmpty(false);
    if (StringConst.dictChapterKnowledgeRelationMaxDepth != selectChapterOption.pathDepth) {
      setSelectChapterOptionMaxDepthLimit(true);
      return;
    }
    setSelectChapterOptionMaxDepthLimit(false);

    if (selectKnowledgeOption.id <= 0) {
      setSelectKnowledgeOptionIsEmpty(true);
      return;
    }
    setSelectKnowledgeOptionIsEmpty(false);
    if (StringConst.dictChapterKnowledgeRelationMaxDepth != selectKnowledgeOption.pathDepth) {
      setSelectKnowledgeOptionMaxDepthLimit(true);
      return;
    }
    setSelectKnowledgeOptionMaxDepthLimit(false);

    fetcher.submit({
      source: StringConst.dictChapterKnowledgeRelation,
      chapterId: selectChapterOption.id,
      knowledgeId: selectKnowledgeOption.id,
    }, {method: "post"}).then((res) => {
    });
  }

  // 监听是否有关联完毕的返回
  useEffect(() => {
    if (fetcher.data?.result === true) {

    }
  }, [fetcher.data]);

  return <div className="mt-4">
    <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">选择章节小节名称-只有题型的上一级需要关联, 并且是一对一关联, 其它层级关联无意义也无需操作</span></Col>
            </Row>
          </div>
          <div className="mt-2.5">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <div>
                  <Cascader
                    style={{width: "100%"}}
                    options={selectChapterOptions}
                    onChange={onSelectChapterOptionChange}
                    placeholder="请选择章节小节名称"
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div>
            {selectChapterOptionIsEmpty && <Alert title="章节小节名称为空" type={"error"}/>}
            {selectChapterOptionMaxDepthLimit && <Alert title="章节小节只能选择第7级" type={"error"}/>}
          </div>

          <div className="mt-2.5">
            <Button color="primary" variant="dashed" onClick={onRelationClick}>关联</Button>
          </div>
        </div>
      </Splitter.Panel>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">选择知识点小类名称</span></Col>
            </Row>
          </div>

          <div>
            {fetcher.data?.error && <Alert title={fetcher.data.error} type={"error"}/>}
          </div>

          <div className="mt-2.5">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <div>
                  <Cascader
                    style={{width: "100%"}}
                    options={selectKnowledgeOptions}
                    onChange={onSelectKnowledgeOptionChange}
                    placeholder="请选择知识点小类名称"
                  />
                </div>
              </Col>
            </Row>
          </div>

          <div>
            {selectKnowledgeOptionIsEmpty && <Alert title="知识点小类名称为空" type={"error"}/>}
            {selectKnowledgeOptionMaxDepthLimit && <Alert title="知识点小类只能选择第7级" type={"error"}/>}
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
