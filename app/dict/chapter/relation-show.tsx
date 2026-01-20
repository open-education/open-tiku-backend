import {
  Alert,
  Button,
  Cascader,
  type CascaderProps,
  Col,
  Row,
  Splitter,
} from "antd";
import React, { useEffect } from "react";
import type { Textbook, TextbookOption } from "~/type/textbook";
import { ArrayUtil } from "~/util/object";
import { httpClient } from "~/util/http";
import { useFetcher } from "react-router";
import { StringConst, StringValidator } from "~/util/string";

// 关联章节小节和知识点展示
export default function RelationShow(props: any) {
  let fetcher = useFetcher();

  let currentStep: number = props.currentStep ?? 0;

  const optionInit: Textbook = {
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0,
  };

  // 章节节点小类
  const [selectChapterOptions, setSelectChapterOptions] = React.useState<
    TextbookOption[]
  >([]);
  const [chapterOption, setChapterOption] =
    React.useState<Textbook>(optionInit);
  const [knowledgeLabelList, setKnowledgeLabelList] = React.useState<
    Textbook[]
  >([]);
  const onSelectChapterOptionChange: CascaderProps<TextbookOption>["onChange"] =
    (_, selectedOptions) => {
      if (selectedOptions === undefined) {
        setChapterOption(optionInit);
        setKnowledgeLabelList([]);
        return;
      }

      const info = selectedOptions[selectedOptions.length - 1].raw;
      setChapterOption(info);

      httpClient
        .post<Textbook[]>("/chapter-knowledge/knowledge", { ids: [info.id] })
        .then((res) => {
          setKnowledgeLabelList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

  // 知识点小类
  const [selectKnowledgeOptions, setSelectKnowledgeOptions] = React.useState<
    TextbookOption[]
  >([]);
  const [knowledgeOption, setKnowledgeOption] =
    React.useState<Textbook>(optionInit);
  const [chapterLabelList, setChapterLabelList] = React.useState<Textbook[]>(
    [],
  );
  const onSelectKnowledgeOptionChange: CascaderProps<TextbookOption>["onChange"] =
    (_, selectedOptions) => {
      if (selectedOptions === undefined) {
        setKnowledgeOption(optionInit);
        setKnowledgeLabelList([]);
        return;
      }

      const info = selectedOptions[selectedOptions.length - 1].raw;
      setKnowledgeOption(info);

      httpClient
        .post<Textbook[]>("/chapter-knowledge/chapter", { ids: [info.id] })
        .then((res) => {
          setChapterLabelList(res);
        })
        .catch((err) => {
          console.log(err);
        });
    };

  // 通过章节或者知识点解除关联, 解除关联后要实时刷新, 也是通过父级标识
  const [chapterIsSelect, setChapterIsSelect] = React.useState<boolean>(false);
  const [knowledgeIsSelect, setKnowledgeIsSelect] =
    React.useState<boolean>(false);
  const onRemoveKnowledgeOptionChange = (
    id: number,
    reqType: string,
    parentId: number,
  ) => {
    if (confirm("确认解除关联?")) {
      setChapterIsSelect(reqType === "chapter");
      setKnowledgeIsSelect(reqType === "knowledge");

      fetcher
        .submit(
          {
            source: StringConst.dictChapterKnowledgeRelationRemove,
            id,
            parentId,
          },
          { method: "post" },
        )
        .then((res) => {})
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // 触发该步骤时刷新菜单数据
  useEffect(() => {
    // 刷新菜单列表
    if (currentStep === 4) {
      httpClient
        .get<Textbook[]>("/textbook/list/7/all")
        .then((res) => {
          const textbookOptions: TextbookOption[] =
            ArrayUtil.mapTextbookToOption(res);
          // 初始化两天都维护同样的内容即可, 因为后续选择可能会单独改变, 如果不变列表数据用同一份即可
          setSelectChapterOptions(textbookOptions);
          setSelectKnowledgeOptions(textbookOptions);
        })
        .catch((err) => {
          console.log(err);
        });
    }

    // 如果收到特定的信息刷新关联列表
    if (fetcher.data?.result === true) {
      const reqType: string = fetcher.data.reqType ?? "";
      if (!StringValidator.isNonEmpty(reqType)) {
        return;
      }

      // 如果接收到类型和父级菜单标识才刷新子菜单列表, 两边都需要刷新其实本身是关联解除
      if (reqType === StringConst.dictChapterKnowledgeRelationRemove) {
        if (chapterOption.id > 0) {
          httpClient
            .post<Textbook[]>("/chapter-knowledge/knowledge", {
              ids: [chapterOption.id],
            })
            .then((res) => {
              setKnowledgeLabelList(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }

        if (knowledgeOption.id > 0) {
          httpClient
            .post<Textbook[]>("/chapter-knowledge/chapter", {
              ids: [knowledgeOption.id],
            })
            .then((res) => {
              setChapterLabelList(res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
      }
    }
  }, [currentStep, fetcher.data]);

  return (
    <div className="mt-4">
      <Splitter
        style={{ minHeight: 100, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="50%" resizable={false}>
          <div className="p-3">
            <div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <span className="text-blue-700 font-normal">
                    选择章节小节名称
                  </span>
                </Col>
              </Row>
            </div>

            <div className="mt-2.5">
              <Row gutter={[12, 12]} align={"middle"}>
                <Col span={24}>
                  <div>
                    <Cascader
                      style={{ width: "100%" }}
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
                return (
                  <Row gutter={[12, 12]} key={item.id} align={"middle"}>
                    <Col span={10}>{item.label}</Col>
                    <Col span={4}>
                      <Button
                        color="danger"
                        variant="link"
                        onClick={() => {
                          onRemoveKnowledgeOptionChange(
                            item.id,
                            "chapter",
                            item.parentId,
                          );
                        }}
                      >
                        解除关联
                      </Button>
                    </Col>
                    <Col span={10}>
                      {chapterIsSelect && fetcher.data?.error && (
                        <Alert title={fetcher.data.error} type="error" />
                      )}
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Splitter.Panel>

        <Splitter.Panel defaultSize="50%" resizable={false}>
          <div className="p-3">
            <div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <span className="text-blue-700 font-normal">
                    选择知识点小类名称
                  </span>
                </Col>
              </Row>
            </div>

            <div className="mt-2.5">
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <div>
                    <Cascader
                      style={{ width: "100%" }}
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
                return (
                  <Row gutter={[12, 12]} key={item.id}>
                    <Col span={10}>{item.label}</Col>
                    <Col span={4}>
                      <Button
                        color="danger"
                        variant="link"
                        onClick={() => {
                          onRemoveKnowledgeOptionChange(
                            item.id,
                            "knowledge",
                            item.parentId,
                          );
                        }}
                      >
                        解除关联
                      </Button>
                    </Col>
                    <Col span={10}>
                      {knowledgeIsSelect && fetcher.data?.error && (
                        <Alert title={fetcher.data.error} type="error" />
                      )}
                    </Col>
                  </Row>
                );
              })}
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
