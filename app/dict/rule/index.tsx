import { Alert, Button, Cascader, Col, Divider, Drawer, Empty, Flex, Form, Row, type CascaderProps } from "antd";
import React, { useState } from "react";
import type { Textbook, TextbookOption, TextbookOtherDictResp } from "~/type/textbook";
import Add from "~/dict/rule/add";
import { httpClient } from "~/util/http";

// 试卷规则维护
export default function Index(props: any) {
  const textbookOptions = props.textbookOptions ?? [];

  // 请求相关错误
  const [reqErr, setReqErr] = useState<React.ReactNode>("");

  // 题型列表
  const [questionTypeList, setQuestionTypeList] = useState<TextbookOtherDictResp[]>([]);

  // 菜单变化处理
  const optionInit: Textbook = {
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0,
    pathType: "",
  };
  const [nodeOption, setNodeOption] = useState<Textbook>(optionInit);
  const [nodeOptionIsEmpty, setNodeOptionIsEmpty] = useState<boolean>(false);
  const onParentLevelChange: CascaderProps<TextbookOption>["onChange"] = (_, selectedOptions) => {
    if (selectedOptions === undefined) {
      setNodeOption(optionInit);
    } else {
      setNodeOption(selectedOptions[selectedOptions.length - 1].raw);
      // 同时获取题型列表
      httpClient
        .get<TextbookOtherDictResp[]>(`/other/dict/list/${nodeOption.id}/question_type`)
        .then((res) => {
          setQuestionTypeList(res);
        })
        .catch((err) => {
          setReqErr(<Alert title={`请求错误: ${err}`} type={"error"} />);
        });
    }
  };

  // Drawer
  const [addDrawerSize, setAddDrawerSize] = useState(1200);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>("");
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>("");
  const drawerExtraInfo = <div className="text-xs text-blue-700">提示: 鼠标触摸边框左右拖动可以调整到适合的宽度</div>;
  // 添加规则
  const showAddDrawer = () => {
    setOpenDrawer(true);
    setDrawerTitle("添加规则");
    setDrawerContent(<Add questionTypeList={questionTypeList} />);
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  return (
    <div className="p-2.5">
      {/* 选择第二层科目 */}
      <div className="mt-2.5">
        <Form layout="horizontal" labelCol={{ span: 2 }} wrapperCol={{ span: 4 }}>
          <Form.Item label="选择第二层科目: ">
            <Cascader
              style={{ width: "100%" }}
              changeOnSelect={true}
              options={textbookOptions}
              onChange={onParentLevelChange}
              placeholder="请选择学段"
            />
          </Form.Item>
          {nodeOptionIsEmpty && <Alert title="第二层科目为空" type={"error"} />}
        </Form>
      </div>

      {/* 添加入口 */}
      <div className="mt-2.5 mb-2.5">
        <Row gutter={[12, 12]} align="middle">
          <Col span={24}>
            <Flex gap="small" justify="flex-start">
              <Button color="primary" variant="dashed" onClick={showAddDrawer}>
                添加规则
              </Button>
            </Flex>
          </Col>
        </Row>
      </div>

      <Divider size="small" />

      {/* 规则展示和编辑 */}
      <div className="mt-2.5">
        <div className="text-blue-700 font-bold">已有规则列表</div>
        {/* 请求相关错误 */}
        {reqErr}
        <Empty />
      </div>

      {/* 抽屉操作区域 */}
      <Drawer
        title={drawerTitle}
        closable={{ "aria-label": "Close Button" }}
        onClose={onCloseDrawer}
        open={openDrawer}
        size={addDrawerSize}
        resizable={{
          onResize: (newSize) => setAddDrawerSize(newSize),
        }}
        extra={drawerExtraInfo}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}
