import {Alert, Button, Flex, Input, InputNumber, type InputNumberProps, Typography,} from "antd";
import React, {useCallback, useState} from "react";
import {StringValidator} from "~/util/string";
import {useFetcher} from "react-router";

// 科目信息维护
export default function Add() {
  let fetcher = useFetcher();

  // 名称
  const [label, setLabel] = useState<string>("");
  const onLabelChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setLabel(e.target.value);
    },
    []
  );
  // 名称不能为空
  const [labelIsEmpty, setLabelIsEmpty] = useState<boolean>(false);

  // 标识
  const [code, setCode] = useState<string>("");
  const onCodeChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setCode(e.target.value);
    },
    []
  );

  // 排序编号
  const [sortOrder, setSortOrder] = useState<number>(0);
  const onSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setSortOrder(Number(value ?? 0));
  };

  // 保存
  const add = () => {
    // 科目名称
    if (!StringValidator.isNonEmpty(label)) {
      setLabelIsEmpty(true);
      return;
    }
    setLabelIsEmpty(false);
    // 其它都是可选项

    // 提交到路由对应的 action 去处理
    fetcher.submit({label, code, sortOrder}, {method: "post"}).then(r => {
    });
  };

  return (
    <div className="border-4 border-indigo-50 pl-8 pr-8 pt-4 pb-4">
      <Flex vertical gap={16}>
        <div>
          <Typography.Title level={4}>添加科目</Typography.Title>
        </div>

        {/* 提交错误展示错误信息 */}
        {fetcher.data?.error && (
          <Alert title={fetcher.data.error} type="error"/>
        )}

        <div>
          <Typography.Title level={5}>科目名称</Typography.Title>
          <Input
            defaultValue={label}
            type="text"
            name="label"
            placeholder="请输入科目名称"
            onChange={onLabelChange}
          />
          {labelIsEmpty && <Alert title="科目名称不能为空" type="error"/>}
          <Typography.Text type="secondary" italic={true}>
            比如 语文, 后面才区分小学, 初中等
          </Typography.Text>
        </div>

        <div>
          <Typography.Title level={5}>科目标识</Typography.Title>
          <Input
            defaultValue={code}
            type="text"
            name="code"
            placeholder="请输入科目标识"
            onChange={onCodeChange}
          />
          <Typography.Text type="secondary" italic={true}>
            比如 语文 对应的英语单词是 chinese, 多个单词中间用下划线连接, 比如
            this is 应该输入 this_is, 为空保存后会默认生成一个唯一的标识
          </Typography.Text>
        </div>

        <div>
          <Typography.Title level={5}>排序编号</Typography.Title>
          <InputNumber
            defaultValue={sortOrder}
            type={"number"}
            name="sortOrder"
            mode="spinner"
            min={0}
            max={10}
            placeholder="请输入排序编号"
            onChange={onSortOrderChange}
          />
          <Typography.Text type="secondary" italic={true}>
            默认升序排列, 最小值0, 数字越小越靠前
          </Typography.Text>
        </div>

        <div className="mt-1.5">
          <Button
            type="primary"
            disabled={fetcher.state !== "idle"}
            onClick={add}
          >
            {fetcher.state === "submitting" ? "提交中..." : "提交"}
          </Button>
        </div>
      </Flex>
    </div>
  );
}
