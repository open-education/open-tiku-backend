import React, {useCallback, useEffect, useState} from "react";
import type {Textbook, TextbookOption} from "~/type/textbook";
import {
  Alert,
  Button,
  Cascader,
  type CascaderProps,
  Col,
  Flex,
  Form,
  Input,
  InputNumber,
  type InputNumberProps,
  Row,
  Select,
  Splitter
} from "antd";
import {useFetcher} from "react-router";
import {StringValidator} from "~/util/string";

// 其它类型字典配置
export default function Index(props: any) {
  let fetcher = useFetcher();

  const textbookOptions = props.textbookOptions ?? [];

  // 标签信息
  const [tagValue, setTagValue] = useState<string>("");
  const [tagValueIsEmpty, setTagValueIsEmpty] = useState<boolean>(false);
  const onTagValueChange = (value: string) => {
    setTagValue(value);
  };

  // 菜单变化处理
  const optionInit: Textbook = {children: [], id: 0, key: "", label: "", parentId: 0, pathDepth: 0, sortOrder: 0};
  const [nodeOption, setNodeOption] = useState<Textbook>(optionInit);
  const [nodeOptionIsEmpty, setNodeOptionIsEmpty] = useState<boolean>(false);
  const onParentLevelChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setNodeOption(optionInit);
    } else {
      setNodeOption(selectedOptions[selectedOptions.length - 1].raw);
    }
  };

  // 字典名称
  const [label, setLabel] = useState<string>("");
  const [labelIsEmpty, setLabelIsEmpty] = useState<boolean>(false);
  const onLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLabel(e.target.value);
    },
    []
  );

  // 排序字段
  const [sortOrder, setSortOrder] = useState<number>(0);
  const [sortOrderIsEmpty, setSortOrderIsEmpty] = useState<boolean>(false);
  const onSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setSortOrder(Number(value ?? 0));
  };

  // 添加
  const onAddClick = () => {
    if (!StringValidator.isNonEmpty(tagValue)) {
      setTagValueIsEmpty(true);
      return;
    }
    setLabelIsEmpty(false);

    if (nodeOption.id <= 0) {
      setNodeOptionIsEmpty(true);
      return;
    }
    setNodeOptionIsEmpty(false);

    if (!StringValidator.isNonEmpty(label)) {
      setLabelIsEmpty(true);
      return;
    }
    setLabelIsEmpty(false);

    if (sortOrder <= 0) {
      setSortOrderIsEmpty(true);
      return;
    }
    setSortOrderIsEmpty(false);
  }

  // 删除
  const onDeleteClick = (id: number) => {

  }

  // 监听字典类型和菜单变化刷新字典列表
  useEffect(() => {

  }, [tagValue, nodeOption, fetcher.data]);

  return <Splitter vertical style={{height: 500, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
    {/* 操作区域 */}
    <Splitter.Panel
      defaultSize="50%"
      resizable={false}
    >
      <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
        {/* 搜索区域 */}
        <Splitter.Panel
          defaultSize="50%"
          resizable={false}
        >
          <div className="p-3">
            <Form
              layout="horizontal"
              labelCol={{span: 3}}
              wrapperCol={{span: 16}}
            >
              <Form.Item label="选择字典类型: ">
                <Select
                  value={tagValue}
                  style={{width: 120}}
                  onChange={onTagValueChange}
                  options={[
                    {value: 'question_type', label: '题型'},
                    {value: 'question_tag', label: '标签'},
                  ]}
                />
                {tagValueIsEmpty && <Alert title="字典类型为空" type={"error"}/>}
              </Form.Item>

              <Form.Item label="选择学段: ">
                <Cascader
                  style={{width: "50%"}}
                  changeOnSelect={true}
                  options={textbookOptions}
                  onChange={onParentLevelChange}
                  placeholder="请选择学段"
                />
              </Form.Item>
              {nodeOptionIsEmpty && <Alert title="学段为空" type={"error"}/>}
            </Form>
          </div>
        </Splitter.Panel>

        {/* 添加区域 */}
        <Splitter.Panel
          defaultSize="50%"
          resizable={false}
        >
          <div className="p-3">
            <Form
              layout="horizontal"
              labelCol={{span: 3}}
              wrapperCol={{span: 16}}
            >
              <Form.Item label="字典名称: ">
                <Input value={label} onChange={onLabelChange} placeholder="请输入名称"/>
                {labelIsEmpty && <Alert title="字典名称为空" type={"error"}/>}
              </Form.Item>
              <Form.Item label="排序编号: ">
                <InputNumber
                  value={sortOrder}
                  type={"number"}
                  name="sortOrder"
                  mode="spinner"
                  min={0}
                  max={100}
                  placeholder="请输入排序编号, 数字"
                  onChange={onSortOrderChange}
                />
                {sortOrderIsEmpty && <Alert title="排序字段为空" type={"error"}/>}
              </Form.Item>
              <Form.Item>
                <Button
                  color="primary"
                  variant="dashed"
                  onClick={onAddClick}
                >
                  添加
                </Button>
              </Form.Item>
            </Form>
          </div>
        </Splitter.Panel>
      </Splitter>
    </Splitter.Panel>

    {/* 展示区域 */}
    <Splitter.Panel
      defaultSize="50%"
      resizable={false}
    >
      <div className="p-3">
        <Row gutter={[12, 12]} align={"middle"}>
          <Col span={4}>
            hello
          </Col>
          <Col span={2}>
            <Flex gap="small" justify="flex-start">
              <Button
                color="danger"
                variant="link"
                onClick={() => {
                  onDeleteClick(0)
                }}
              >删除
              </Button>
            </Flex>
          </Col>
        </Row>
      </div>
    </Splitter.Panel>
  </Splitter>
}
