import {Alert, Button, Cascader, type CascaderProps, Col, Row, Splitter} from "antd";
import React, {useEffect} from "react";
import type {Textbook, TextbookOption} from "~/type/textbook";
import {ArrayUtil} from "~/util/object";
import {httpClient} from "~/util/http";
import {useFetcher} from "react-router";
import {StringConst} from "~/util/string";

// 关联章节小节和知识点展示
export default function RelationShow(props: any) {
  let fetcher = useFetcher();

  let currentStep: number = props.currentStep ?? 0;

  // 章节节点小类
  const [selectChapterOptions, setSelectChapterOptions] = React.useState<TextbookOption[]>([]);
  const [knowledgeLabelList, setKnowledgeLabelList] = React.useState<Textbook[]>([]);
  const onSelectChapterOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    const info = selectedOptions[selectedOptions.length - 1].raw;
    httpClient.post<Textbook[]>("/chapter-knowledge/knowledge", {ids: [info.id]}).then((res) => {
      setKnowledgeLabelList(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  // 知识点小类
  const [selectKnowledgeOptions, setSelectKnowledgeOptions] = React.useState<TextbookOption[]>([]);
  const [chapterLabelList, setChapterLabelList] = React.useState<Textbook[]>([]);
  const onSelectKnowledgeOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    const info = selectedOptions[selectedOptions.length - 1].raw;
    httpClient.post<Textbook[]>("/chapter-knowledge/chapter", {ids: [info.id]}).then((res) => {
      setChapterLabelList(res);
    }).catch((err) => {
      console.log(err);
    });
  };

  // 通过章节或者知识点解除关联
  const [chapterIsSelect, setChapterIsSelect] = React.useState<boolean>(false);
  const [knowledgeIsSelect, setKnowledgeIsSelect] = React.useState<boolean>(false);
  const onRemoveKnowledgeOptionChange = (id: number, type: string) => {
    if (confirm("确认解除关联?")) {
      setChapterIsSelect(type === "chapter");
      setKnowledgeIsSelect(type === "knowledge");

      fetcher.submit({
        source: StringConst.dictChapterKnowledgeRelationRemove,
        id,
      }, {method: "post"}).then((res) => {
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  // 触发该步骤时刷新菜单数据
  useEffect(() => {
    if (currentStep === 4) {
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

  return <div className="mt-4">
    <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
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
          </div>

          <div className="mt-2.5">
            {knowledgeLabelList.map((item) => {
              return <Row gutter={[12, 12]} key={item.id} align={"middle"}>
                <Col span={10}>{item.label}</Col>
                <Col span={4}>
                  <Button color="danger" variant="link" onClick={() => {
                    onRemoveKnowledgeOptionChange(item.id, "chapter")
                  }}>解除关联</Button>
                </Col>
                <Col span={10}>
                  {chapterIsSelect && fetcher.data?.error && <Alert title={fetcher.data.error} type="error"/>}
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

          <div className="mt-2.5">
            {chapterLabelList.map((item) => {
              return <Row gutter={[12, 12]} key={item.id}>
                <Col span={10}>{item.label}</Col>
                <Col span={4}>
                  <Button color="danger" variant="link" onClick={() => {
                    onRemoveKnowledgeOptionChange(item.id, "knowledge")
                  }}>解除关联</Button>
                </Col>
                <Col span={10}>
                  {knowledgeIsSelect && fetcher.data?.error && <Alert title={fetcher.data.error} type="error"/>}
                </Col>
              </Row>
            })}
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
