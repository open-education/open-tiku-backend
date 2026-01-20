import React from "react";
import { Cascader, type CascaderProps, Splitter } from "antd";
import type { Textbook, TextbookOption } from "~/type/textbook";

// 父级菜单管理, 不同的类型下会有深度差别
export default function Node(props: any) {
  const textbookOptions = props.textbookOptions ?? [];
  const setNodeTextbookOption: React.Dispatch<React.SetStateAction<Textbook>> =
    props.setNodeTextbookOption;

  const onParentLevelChange: CascaderProps<TextbookOption>["onChange"] = (
    _,
    selectedOptions,
  ) => {
    if (setNodeTextbookOption) {
      if (selectedOptions === undefined) {
        setNodeTextbookOption({
          children: [],
          id: 0,
          key: "",
          label: "",
          parentId: 0,
          pathDepth: 0,
          sortOrder: 0,
        });
      } else {
        setNodeTextbookOption(selectedOptions[selectedOptions.length - 1].raw);
      }
    }
  };

  return (
    <Splitter
      style={{ minHeight: 50, boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)" }}
    >
      <Splitter.Panel defaultSize="100%" resizable={false}>
        <div className="p-3">
          <Cascader
            style={{ width: "50%" }}
            changeOnSelect={true}
            options={textbookOptions}
            onChange={onParentLevelChange}
            placeholder="请选择选择教材章节或知识点类别"
          />
        </div>
      </Splitter.Panel>
    </Splitter>
  );
}
