import { Alert, Button, Cascader, type CascaderProps, Flex, Input, InputNumber, type InputNumberProps, Select, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { StringConst, StringConstUtil, StringValidator } from "~/util/string";
import { useFetcher } from "react-router";
import type { Textbook, TextbookOption } from "~/type/textbook";
import { httpClient } from "~/util/http";
import { ArrayUtil } from "~/util/object";

// 菜单信息维护
export default function Edit(props: any) {
  let fetcher = useFetcher();

  // 父级菜单选择信息
  const [maxDepthLimit, setMaxDepthLimit] = useState<boolean>(false);
  let textbookOptions: TextbookOption[] = props.textbookOptions ?? [];

  // 详情标识
  const id: number = props.id ?? 0;
  const [item, setItem] = useState<Textbook>({
    id: 0,
    key: "",
    label: "",
    parentId: 0,
    pathDepth: 0,
    sortOrder: 0,
    pathType: "",
  });

  // 需要默认值信息
  const pathNodes = ArrayUtil.findPath(textbookOptions, id.toString());
  // 去掉最后一层, 该层为当前自己
  const _values = pathNodes ? pathNodes.slice(0, -1).map((node) => node.label) : [];
  const [selectValues, _] = useState<string[]>(_values);

  // 这个地方需要注意处理, 如果是编辑可以不选择这部分, 此时这部分是没有实际值的, 默认的空是合法的, action 需要特殊处理
  // 如果存在有效值则该值才是目标值
  const onParentLevelChange: CascaderProps<TextbookOption>["onChange"] = (_, selectedOptions) => {
    const option = selectedOptions[selectedOptions.length - 1].raw;
    setParentId(option.id);
    setPathDepth(option.pathDepth + 1);
  };

  // 名称, 编辑时可更新
  const [label, setLabel] = useState<string>(item.label);
  const onLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setLabel(e.target.value);
  }, []);
  // 名称不能为空
  const [labelIsEmpty, setLabelIsEmpty] = useState<boolean>(false);

  // 排序编号
  const [sortOrder, setSortOrder] = useState<number>(item.sortOrder);
  const onSortOrderChange: InputNumberProps["onChange"] = (value) => {
    setSortOrder(Number(value ?? 0));
  };

  // 菜单类型
  const [pathTypeValue, setPathTypeValue] = useState<string>(item.pathType);
  const onPathTypeValueChange = (value: string) => {
    setPathTypeValue(value);
  };

  // 指定父级标识和深度, 默认继承详情的父级和深度, 有选择时更新为选择的目标值
  const [parentId, setParentId] = useState<number>(item.parentId);
  const [pathDepth, setPathDepth] = useState<number>(item.pathDepth);

  // 如果监听到详情变化则更新详情信息
  useEffect(() => {
    // 因为没有对应的路由需要在组件中获取最新的详情
    if (id > 0) {
      httpClient.get<Textbook>(`/textbook/info/${id}`).then((res) => {
        setItem(res);
        // 触发 ui 渲染最新的默认值
        setLabel(res.label);
        setPathTypeValue(res.pathType);
        setParentId(res.parentId);
        setPathDepth(res.pathDepth);
        setSortOrder(res.sortOrder);
      });
    }
  }, [id]);

  // 保存
  const edit = () => {
    if (StringConst.dictTextbookMaxDepth < pathDepth) {
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
    fetcher
      .submit(
        {
          source: StringConst.dictTextbookEdit, // 标记是教材字典编辑来源
          id: item.id,
          label,
          sortOrder,
          parentId, // 这两个字段需要使用最新的目标值
          pathDepth,
          pathType: pathTypeValue,
        },
        { method: "post" },
      )
      .then((r) => {});
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
      {fetcher.data?.error && <Alert title={fetcher.data.error} type="error" />}

      <div>
        <Typography.Title level={5}>父级菜单</Typography.Title>
        <Cascader
          style={{ width: "30%" }}
          defaultValue={selectValues}
          changeOnSelect={true}
          options={textbookOptions}
          onChange={onParentLevelChange}
          placeholder="请选择父级菜单"
        />
        {maxDepthLimit && <Alert title="菜单深度不能超过第5级" type="error" />}
        <Typography.Text type="secondary" italic={true}>
          选择当前栏目对应的父级菜单, 不选择任何父级菜单则是顶级菜单
        </Typography.Text>
      </div>

      <div>
        <Typography.Title level={5}>* 菜单名称简称 - 必填</Typography.Title>
        <Input value={label} type="text" name="label" placeholder="请输入菜单名称简称" onChange={onLabelChange} />
        {labelIsEmpty && <Alert title="菜单名称简称不能为空" type="error" />}
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

      <div>
        <Typography.Title level={5}>菜单类型</Typography.Title>
        <Select value={pathTypeValue} style={{ width: 120 }} onChange={onPathTypeValueChange} options={StringConstUtil.dictTextbookPathTypeOptions} />
        <Typography.Text type="secondary" italic={true}>
          默认为公共节点, 需要选择具体的菜单类型
        </Typography.Text>
      </div>

      <div className="mt-1.5">
        <Button type="primary" disabled={fetcher.state !== "idle"} onClick={edit}>
          {fetcher.state === "submitting" ? "提交中..." : "提交"}
        </Button>
      </div>
    </Flex>
  );
}
