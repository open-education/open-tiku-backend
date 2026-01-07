import {
  Alert,
  Button,
  Cascader,
  type CascaderProps,
  Flex,
  Input,
  InputNumber,
  type InputNumberProps,
  Typography,
} from "antd";
import React, {useCallback, useEffect, useState} from "react";
import {StringConst, StringValidator} from "~/util/string";
import {useFetcher} from "react-router";
import type {Textbook, TextbookOption} from "~/type/textbook";

// 菜单信息维护
export default function Add(props: any) {
  let fetcher = useFetcher();

  // 父级菜单选择信息
  const [maxDepthLimit, setMaxDepthLimit] = useState<boolean>(false);
  const textbookOptionInit: Textbook = {
    children: [],
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0
  };
  const [textbookOption, setTextbookOption] = useState<Textbook>(textbookOptionInit);
  const onParentLevelChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    // 点击清除时并没有返回空数组, 而是 undefined
    if (selectedOptions === undefined) {
      setTextbookOption(textbookOptionInit);
    } else {
      setTextbookOption(selectedOptions[selectedOptions.length - 1].raw);
    }
  };

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

  // 排序编号
  const [sortOrder, setSortOrder] = useState<number>(0);
  const onSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setSortOrder(Number(value ?? 0));
  };

  // 保存
  const add = () => {
    // 菜单深度限制
    if (StringConst.dictTextbookMaxDepth < textbookOption.pathDepth) {
      setMaxDepthLimit(true);
      return;
    }
    setMaxDepthLimit(false);

    // 名称
    if (!StringValidator.isNonEmpty(label)) {
      setLabelIsEmpty(true);
      return;
    }
    setLabelIsEmpty(false);
    // 其它都是可选项

    // 提交到路由对应的 action 去处理
    fetcher.submit({
      source: StringConst.dictTextbookAdd, // 标记是教材字典添加来源
      label,
      sortOrder,
      parentId: textbookOption.id,
      pathDepth: textbookOption.pathDepth + 1
    }, {method: "post"}).then(r => {
    });
  };

  // 关闭抽屉
  const setOpenDrawer: React.Dispatch<React.SetStateAction<boolean>> = props.setOpenDrawer;
  useEffect(() => {
    if (fetcher.data?.result === true) {
      setOpenDrawer(false);
    }
  }, [fetcher.state, fetcher.data]);

  return (
    <Flex vertical gap={16}>
      <div>
        <Typography.Text type="secondary" italic={true}>
          注意菜单的目录层级
        </Typography.Text>
      </div>

      {/* 提交错误展示错误信息 */}
      {fetcher.data?.error && (
        <Alert title={fetcher.data.error} type="error"/>
      )}

      <div>
        <Typography.Title level={5}>父级菜单</Typography.Title>
        <Cascader
          style={{width: "30%"}}
          changeOnSelect={true}
          options={props.textbookOptions}
          onChange={onParentLevelChange}
          placeholder="请选择父级菜单"
        />
        {maxDepthLimit && <Alert title="菜单深度不能超过第5级" type="error"/>}
        <Typography.Text type="secondary" italic={true}>
          选择当前栏目对应的父级菜单, 不选择任何父级菜单则是顶级菜单
        </Typography.Text>
      </div>

      <div>
        <Typography.Title level={5}>* 菜单名称简称 - 必填</Typography.Title>
        <Input
          value={label}
          type="text"
          name="label"
          placeholder="请输入菜单名称简称"
          onChange={onLabelChange}
        />
        {labelIsEmpty && <Alert title="菜单名称简称不能为空" type="error"/>}
        <Typography.Text type="secondary" italic={true}>
          比如 科目菜单 语文, 数学; 出版社菜单为 人教版, 湘教版等; 其它类似...
        </Typography.Text>
      </div>

      <div>
        <Typography.Title level={5}>排序编号(数字) - 关注顺序要填</Typography.Title>
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
        <Typography.Text type="secondary" italic={true}>
          默认升序排列, 最小值0, 最大值100, 数字越小越靠前
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
  );
}
