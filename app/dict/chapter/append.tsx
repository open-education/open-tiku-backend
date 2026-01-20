import {
  Alert,
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  type InputNumberProps,
  Row,
  Splitter,
} from "antd";
import React, { useCallback } from "react";

// 追加教材章节和知识点倒数2层数据
export default function Append(props: any) {
  // 教材章节和知识点名称
  const chapterName: string = props.chapterName ?? "";
  const setChapterName: React.Dispatch<React.SetStateAction<string>> =
    props.setChapterName;
  const onChapterNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (setChapterName) {
        setChapterName(e.target.value);
      }
    },
    [],
  );

  // 空报错提示
  const chapterNodeIsEmpty: boolean = props.chapterNodeIsEmpty;
  const chapterNodeMaxDepthLimit: boolean = props.chapterNodeMaxDepthLimit;
  const chapterIsEmpty: boolean = props.chapterIsEmpty;

  // 排序编号
  const chapterSortOrder: number = props.chapterSortOrder;
  const setChapterSortOrder: React.Dispatch<React.SetStateAction<number>> =
    props.setChapterSortOrder;
  const onChapterSortOrderChange: InputNumberProps["onChange"] = (value) => {
    if (setChapterSortOrder) {
      setChapterSortOrder(Number(value ?? 0));
    }
  };

  return (
    <div className="mt-4">
      <Splitter
        style={{ minHeight: 80, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
      >
        <Splitter.Panel defaultSize="100%" resizable={false}>
          <div className="p-3">
            <div>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <span className="text-blue-700 font-normal">
                    追加章节或知识点名称
                  </span>
                </Col>
              </Row>
            </div>
            <div className="mt-2.5">
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <Form
                    layout="horizontal"
                    labelCol={{ span: 2 }}
                    wrapperCol={{ span: 8 }}
                  >
                    <Form.Item label="名称: ">
                      <Input
                        value={chapterName}
                        placeholder="请输入名称"
                        onChange={onChapterNameChange}
                      />
                    </Form.Item>
                    <Form.Item label="排序编号: ">
                      <InputNumber
                        value={chapterSortOrder}
                        type={"number"}
                        name="sortOrder"
                        mode="spinner"
                        min={0}
                        max={100}
                        placeholder="请输入排序编号, 数字"
                        onChange={onChapterSortOrderChange}
                      />
                    </Form.Item>
                    <Form.Item>
                      <Button
                        color="primary"
                        variant="dashed"
                        onClick={props.appendChapterName}
                      >
                        追加
                      </Button>
                    </Form.Item>
                  </Form>
                </Col>
                <Col span={24}>
                  {chapterNodeIsEmpty && (
                    <Alert
                      title="请先选择 第一步: 选择教材章节或知识点类别"
                      type={"error"}
                    />
                  )}
                  {chapterNodeMaxDepthLimit && (
                    <Alert
                      title="择教材章节或知识点类别父级只能是第5级或者第6级"
                      type={"error"}
                    />
                  )}
                  {chapterIsEmpty && (
                    <Alert title="名称不能为空" type={"error"} />
                  )}
                </Col>
              </Row>
            </div>
          </div>
        </Splitter.Panel>
      </Splitter>
    </div>
  );
}
