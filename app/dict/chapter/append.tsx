import {Alert, Button, Col, Form, Input, InputNumber, type InputNumberProps, Row, Splitter} from "antd";
import React, {useCallback} from "react";

// 追加教材章节和知识点倒数2层数据
export default function Append(props: any) {
  // 教材章节和知识点名称
  const chapterName: string = props.chapterName ?? "";
  const setChapterName: React.Dispatch<React.SetStateAction<string>> = props.setChapterName;
  const onChapterNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (setChapterName) {
        setChapterName(e.target.value);
      }
    },
    []
  );

  // 空报错提示
  const chapterNodeIsEmpty: boolean = props.chapterNodeIsEmpty;
  const chapterIsEmpty: boolean = props.chapterIsEmpty;

  // 排序编号
  const chapterSortOrder: number = props.chapterSortOrder;
  const setChapterSortOrder: React.Dispatch<React.SetStateAction<number>> = props.setChapterSortOrder;
  const onChapterSortOrderChange: InputNumberProps["onChange"] = (value) => {
    if (setChapterSortOrder) {
      setChapterSortOrder(Number(value ?? 0));
    }
  };

  // 章节节点和知识点小类
  const chapterPartName: string = props.chapterPartName ?? "";
  const setChapterPartName: React.Dispatch<React.SetStateAction<string>> = props.setChapterPartName;
  const onChapterPartNameChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (setChapterPartName) {
        setChapterPartName(e.target.value);
      }
    },
    []
  );

  // 空报错提示
  const chapterPartNodeIsEmpty: boolean = props.chapterPartNodeIsEmpty;
  const chapterPartNameIsEmpty: boolean = props.chapterPartNameIsEmpty;

  // 排序编号
  const chapterPartSortOrder: number = props.chapterPartSortOrder;
  const setChapterPartSortOrder: React.Dispatch<React.SetStateAction<number>> = props.setChapterPartSortOrder;
  const onChapterPartSortOrderChange: InputNumberProps["onChange"] = (value) => {
    if (setChapterPartSortOrder) {
      setChapterPartSortOrder(Number(value ?? 0));
    }
  };

  return <div className="mt-4">
    <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">追加章节或知识点名称</span></Col>
            </Row>
          </div>
          <div className="mt-2.5">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form
                  layout="horizontal"
                  labelCol={{span: 4}}
                  wrapperCol={{span: 15}}
                >
                  <Form.Item label="名称: ">
                    <Input value={chapterName} placeholder="请输入名称" onChange={onChapterNameChange}/>
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
                    <Button type="primary" onClick={props.appendChapterName}>追加</Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={24}>
                {chapterNodeIsEmpty && <Alert title="请先选择 第一步: 选择教材章节或知识点类别" type={"error"}/>}
                {chapterIsEmpty && <Alert title="名称不能为空" type={"error"}/>}
              </Col>
            </Row>
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
              <Col span={24}><span className="text-blue-700 font-normal">追加章节小节或知识点小类</span></Col>
            </Row>
          </div>
          <div className="mt-2.5">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form
                  layout="horizontal"
                  labelCol={{span: 4}}
                  wrapperCol={{span: 15}}
                >
                  <Form.Item label="名称: ">
                    <Input value={chapterPartName} placeholder="请输入名称" onChange={onChapterPartNameChange}/>
                  </Form.Item>
                  <Form.Item label="排序编号: ">
                    <InputNumber
                      value={chapterPartSortOrder}
                      type={"number"}
                      name="sortOrder"
                      mode="spinner"
                      min={0}
                      max={100}
                      placeholder="请输入排序编号, 数字"
                      onChange={onChapterPartSortOrderChange}
                    />
                  </Form.Item>
                  <Form.Item>
                    <Button type="primary" onClick={props.appendChapterPartName}>追加</Button>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={24}>
                {chapterPartNodeIsEmpty && <Alert title="请先选择 第一步: 选择教材章节或知识点类别" type={"error"}/>}
                {chapterPartNameIsEmpty && <Alert title="名称不能为空" type={"error"}/>}
              </Col>
            </Row>
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
