import {Button, Cascader, type CascaderProps, Col, Row, Splitter} from "antd";
import React, {useEffect} from "react";
import type {ChapterAndKnowledgeResp, QuestionCateResp, Textbook, TextbookOption} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import {useFetcher} from "react-router";
import {StringConst} from "~/util/string";

// 题型展示
export default function QuestionShow(props: any) {
  let fetcher = useFetcher();
  const currentStep: number = props.currentStep ?? 0;

  // 章节节点小类
  const [selectChapterOptions, setSelectChapterOptions] = React.useState<TextbookOption[]>([]);
  const [chapterLabelList, setChapterLabelList] = React.useState<QuestionCateResp[]>([]);
  const onSelectChapterOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setChapterLabelList([]);
      return;
    }

    const info = selectedOptions[selectedOptions.length - 1].raw;
    // 此时我并不知道选择的类型是知识点还是章节, 因此需要查询关联标识
    httpClient.get<ChapterAndKnowledgeResp>(`/chapter-knowledge/info/${info.id}`).then(res => {
      httpClient.get<QuestionCateResp[]>(`/question-cate/list/${res.id}`).then((res) => {
        setChapterLabelList(res);
      }).catch((err) => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  };

  // 知识点小类
  const [selectKnowledgeOptions, setSelectKnowledgeOptions] = React.useState<TextbookOption[]>([]);
  const [knowledgeLabelList, setKnowledgeLabelList] = React.useState<QuestionCateResp[]>([]);
  const onSelectKnowledgeOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setKnowledgeLabelList([]);
      return;
    }

    const info = selectedOptions[selectedOptions.length - 1].raw;
    // 此时我并不知道选择的类型是知识点还是章节, 因此需要查询关联标识
    httpClient.get<ChapterAndKnowledgeResp>(`/chapter-knowledge/info/${info.id}`).then(res => {
      httpClient.get<QuestionCateResp[]>(`/question-cate/list/${res.id}`).then((res) => {
        setKnowledgeLabelList(res);
      }).catch((err) => {
        console.log(err);
      });
    }).catch(err => {
      console.log(err);
    });
  };

  // 点击该步骤时触发菜单加载
  useEffect(() => {
    if (currentStep === 6) {
      // 刷新菜单列表
      httpClient.get<Textbook[]>("/textbook/list/7/all").then(res => {
        const textbookOptions: TextbookOption[] = ArrayUtil.mapTextbookToOption(res);
        setSelectChapterOptions(textbookOptions);
        setSelectKnowledgeOptions(textbookOptions);
      }).catch(err => {
        console.log(err);
      });
    }
  }, [currentStep]);

  // 删除题型
  const onQuestionRemoveClick = (id: number) => {
    if (confirm("确认删除?")) {
      fetcher.submit({
        source: StringConst.dictQuestionsRemove,
        id,
      }, {method: "post"}).then((res) => {
      }).catch(err => {
        console.log(err);
      });
    }
  }

  return <div className="mt-4">
    <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]} align={"middle"}>
              <Col span={24}><span className="text-blue-700 font-normal">选择章节小节名称</span></Col>
            </Row>
          </div>

          <div className="mt-2.5">
            <Row gutter={[12, 12]} align={"middle"}>
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

            {}
          </div>

          <div className="mt-2.5">
            {chapterLabelList.map((item) => {
              return <Row gutter={[12, 12]} key={item.id} align={"middle"}>
                <Col span={10}>{item.label}</Col>
                <Col span={5}>
                  <Button color="danger" variant="link" onClick={() => {
                    onQuestionRemoveClick(item.id)
                  }}>删除</Button>
                </Col>
              </Row>
            })}
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

          <div className="mt-2.5">
            <Row gutter={[12, 12]} align={"middle"}>
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

          <div className="mt-2.5">
            {knowledgeLabelList.map((item) => {
              return <Row gutter={[12, 12]} key={item.id} align={"middle"}>
                <Col span={10}>{item.label}</Col>
                <Col span={5}>
                  <Button color="danger" variant="link" onClick={() => {
                    onQuestionRemoveClick(item.id)
                  }}>删除</Button>
                </Col>
              </Row>
            })}
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
