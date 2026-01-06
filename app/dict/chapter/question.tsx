import {
  Alert,
  Button,
  Cascader,
  type CascaderProps,
  Col,
  Form,
  Input,
  InputNumber,
  type InputNumberProps,
  Row,
  Splitter
} from "antd";
import React, {useCallback, useEffect} from "react";
import type {ChapterAndKnowledgeResp, Textbook, TextbookOption} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {ArrayUtil} from "~/util/object";
import {StringConst, StringValidator} from "~/util/string";
import {useFetcher} from "react-router";

// 追加题型
export default function Question(props: any) {
  let fetcher = useFetcher();

  const currentStep: number = props.currentStep ?? 0;

  const optionInit: Textbook = {
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0
  };

  // 章节节点小类
  const [selectOptions, setSelectOptions] = React.useState<TextbookOption[]>([]);
  const [selectOption, setSelectOption] = React.useState<Textbook>(optionInit);
  const [selectOptionIsEmpty, setSelectOptionIsEmpty] = React.useState<boolean>(false);
  const onSelectOptionChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setSelectOption(optionInit);
      return;
    }

    setSelectOption(selectedOptions[selectedOptions.length - 1].raw);
  };

  // 编辑名称
  const [label, setLabel] = React.useState<string>("");
  const [labelIsEmpty, setLabelIsEmpty] = React.useState<boolean>(false);
  const onLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLabel(e.target.value);
    },
    []
  );

  // 排序编号
  const [sortOrder, setSortOrder] = React.useState<number>(0);
  const onSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setSortOrder(Number(value ?? 0));
  };

  // 选择该步骤时刷新菜单列表
  useEffect(() => {
    if (currentStep === 5) {
      // 刷新菜单列表
      httpClient.get<Textbook[]>("/textbook/list/7/all").then(res => {
        const textbookOptions: TextbookOption[] = ArrayUtil.mapTextbookToOption(res);
        setSelectOptions(textbookOptions);
      }).catch(err => {
        console.log(err);
      });
    }
  }, [currentStep]);

  const [relationIsEmpty, setRelationIsEmpty] = React.useState<React.ReactNode>("");

  // 添加题型
  const onAddQuestion = () => {
    if (selectOption.id <= 0) {
      setSelectOptionIsEmpty(true);
      return;
    }
    setSelectOptionIsEmpty(false);

    if (!StringValidator.isNonEmpty(label)) {
      setLabelIsEmpty(true);
      return;
    }
    setLabelIsEmpty(false);

    // 题型要存入单独的表来维护
    // 此时我并不知道选择的类型是知识点还是章节, 因此需要查询关联标识
    httpClient.get<ChapterAndKnowledgeResp>(`/chapter-knowledge/info/${selectOption.id}`).then(res => {
      setRelationIsEmpty("");

      fetcher.submit({
        source: StringConst.dictQuestionsAdd,
        relatedId: res.id,
        label,
        sortOrder,
      }, {method: "post"}).then((res) => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
    }).catch(err => {
      setRelationIsEmpty(<Alert title={`请先做关联后在追加题型: ${err.toString()}`} type={"error"}/>);
    });
  }

  return <div className="mt-4">
    <Splitter style={{minHeight: 100, boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)'}}>
      <Splitter.Panel
        defaultSize="50%"
        resizable={false}
      >
        <div className="p-3">
          <div>
            <Row gutter={[12, 12]}>
              <Col span={24}><span className="text-blue-700 font-normal">选择章节小节名称或者知识点名称均可, 上一步骤关联完成后, 后续的题型均挂在在章节小节和对应的知识点小类下面</span></Col>
            </Row>
          </div>

          <div className="mt-2.5">
            <Row gutter={[12, 12]}>
              <Col span={24}>
                <Form
                  layout="horizontal"
                  labelCol={{span: 3}}
                  wrapperCol={{span: 10}}
                >
                  <Form.Item label="选择教材章节或知识点类别">
                    <Cascader
                      style={{width: "100%"}}
                      options={selectOptions}
                      onChange={onSelectOptionChange}
                      placeholder="请选择章节小节名称或者知识点名称"
                    />
                  </Form.Item>

                  <div>
                    {selectOptionIsEmpty && <Alert title="请先选择章节或者知识点" type={"error"}/>}
                  </div>

                  <Form.Item label="名称: ">
                    <Input value={label} placeholder="请输入名称" onChange={onLabelChange}/>
                  </Form.Item>

                  <div>
                    {labelIsEmpty && <Alert title="名称不能为空" type="error"/>}
                  </div>

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
                  </Form.Item>

                  <Form.Item>
                    <Button color="primary" variant="dashed" onClick={onAddQuestion}>追加</Button>
                  </Form.Item>

                  <div>
                    {fetcher.data?.error && <Alert title={fetcher.data.error} type={"error"}/>}
                    {relationIsEmpty}
                  </div>
                </Form>
              </Col>
            </Row>
          </div>
        </div>
      </Splitter.Panel>
    </Splitter>
  </div>
}
