import React, { useCallback, useEffect, useState } from "react";
import type { Textbook, TextbookOption, TextbookOtherDictResp } from "~/type/textbook";
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
  Radio,
  type RadioChangeEvent,
  Row,
  Select,
  Splitter
} from "antd";
import { useFetcher } from "react-router";
import { StringConst, StringValidator } from "~/util/string";
import { httpClient } from "~/util/http";
import type { CheckboxGroupProps } from 'antd/es/checkbox';

// 其它类型字典配置
export default function Index(props: any) {
  let fetcher = useFetcher();

  const textbookOptions = props.textbookOptions ?? [];

  // 标签信息
  const [tagValue, setTagValue] = useState<string>("");
  const [tagValueIsEmpty, setTagValueIsEmpty] = useState<boolean>(false);
  const onTagValueChange = (value: string) => {
    setTagValue(value);
    setSelectQuestionType(StringConst.dictTextbookOtherType === value);
  };

  // 选择题样式
  const isSelectOptions: CheckboxGroupProps<string>['options'] = [
    { label: '是', value: '1' },
    { label: '否', value: '0' },
  ];
  // 是否选择题型
  const [selectQuestionType, setSelectQuestionType] = useState<boolean>(false);
  // 是否是选择题
  const [isSelect, setIsSelect] = useState<string>('0');
  const onIsSelectChange = ({ target: { value } }: RadioChangeEvent) => {
    setIsSelect(value);
  };

  // 菜单变化处理
  const optionInit: Textbook = { children: [], id: 0, key: "", label: "", parentId: 0, pathDepth: 0, sortOrder: 0 };
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
    setTagValueIsEmpty(false);

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

    fetcher.submit({
      source: StringConst.dictTextbookOtherAdd,
      textbookId: nodeOption.id,
      typeCode: tagValue,
      label,
      sortOrder,
      isSelect: selectQuestionType ? Number(isSelect) === 1 : false,
    }, { method: "post" }).then(res => {
    }).catch(err => {
      console.log(err);
    });
  }

  // 删除
  const onDeleteClick = (id: number) => {
    if (id <= 0) {
      return;
    }

    fetcher.submit({
      source: StringConst.dictTextbookOtherRemove,
      id,
    }, { method: "post" }).then(res => {
    }).catch(err => {
      console.log(err);
    });
  }

  // 字典内容列表
  const [otherDictItems, setOtherDictItems] = useState<TextbookOtherDictResp[]>([]);
  const [otherDictError, setOtherDictError] = useState<React.ReactNode>("");

  // 监听字典类型和菜单变化刷新字典列表
  useEffect(() => {
    if (!StringValidator.isNonEmpty(tagValue) || nodeOption.id <= 0 || nodeOption.pathDepth != 3 || fetcher.data?.error) {
      return;
    }

    httpClient.get<TextbookOtherDictResp[]>(`/other/dict/list/${nodeOption.id}/${tagValue}`).then((res) => {
      setOtherDictItems(res);
    }).catch(err => {
      setOtherDictError(<Alert title={`请求错误: ${err}`} type={"error"} />);
    });
  }, [tagValue, nodeOption, fetcher.data]);

  return <Splitter vertical style={{ height: 500, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
    {/* 操作区域 */}
    <Splitter.Panel
      defaultSize="50%"
      resizable={false}
    >
      <Splitter style={{ minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
        {/* 搜索区域 */}
        <Splitter.Panel
          defaultSize="50%"
          resizable={false}
        >
          <div className="p-3">
            <Form
              layout="horizontal"
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="选择字典类型: ">
                <Select
                  value={tagValue}
                  style={{ width: 120 }}
                  onChange={onTagValueChange}
                  options={[
                    { value: StringConst.dictTextbookOtherType, label: '题型' },
                    { value: StringConst.dictTextbookOtherTag, label: '标签' },
                  ]}
                />
                {tagValueIsEmpty && <Alert title="字典类型为空" type={"error"} />}
              </Form.Item>

              <Form.Item label="选择学段: ">
                <Cascader
                  style={{ width: "50%" }}
                  changeOnSelect={true}
                  options={textbookOptions}
                  onChange={onParentLevelChange}
                  placeholder="请选择学段"
                />
              </Form.Item>
              {nodeOptionIsEmpty && <Alert title="学段为空" type={"error"} />}
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
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 16 }}
            >
              <Form.Item label="字典名称: ">
                <Input value={label} onChange={onLabelChange} placeholder="请输入名称" />
                {labelIsEmpty && <Alert title="字典名称为空" type={"error"} />}
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
                {sortOrderIsEmpty && <Alert title="排序字段为空" type={"error"} />}
              </Form.Item>
              {
                selectQuestionType &&
                <Form.Item label="是选择题">
                  <Radio.Group
                    options={isSelectOptions}
                    onChange={onIsSelectChange}
                    value={isSelect}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              }
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
        {
          otherDictItems.map(item => {
            return <Row gutter={[12, 12]} align={"middle"} key={item.id}>
              <Col span={4}>
                {item.itemValue}
              </Col>
              <Col span={2}>
                <Flex gap="small" justify="flex-start">
                  <Button
                    color="danger"
                    variant="link"
                    onClick={() => {
                      onDeleteClick(item.id)
                    }}
                  >删除
                  </Button>
                </Flex>
              </Col>
            </Row>
          })
        }

        {fetcher.data?.error && <Alert title={fetcher.data.error} type={"error"} />}

        {otherDictError}
      </div>
    </Splitter.Panel>
  </Splitter>
}
