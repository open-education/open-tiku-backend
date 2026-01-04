import React from "react";
import {Cascader, type CascaderProps, Col, Row} from "antd";
import type {Textbook, TextbookOption} from "~/type/textbook";

// 父级菜单管理, 不同的类型下会有深度差别
export default function Node(props: any) {
  const textbookOptions = props.textbookOptions ?? [];
  const setNodeTextbookOption: React.Dispatch<React.SetStateAction<Textbook>> = props.setNodeTextbookOption;

  const onParentLevelChange: CascaderProps<TextbookOption>['onChange'] = (_, selectedOptions) => {
    if (setNodeTextbookOption) {
      setNodeTextbookOption(selectedOptions[selectedOptions.length - 1].raw);
    }
  };

  return <Row gutter={[12, 12]}>
    <Col span={24}>
      <div>
        <Cascader
          style={{width: "50%"}}
          changeOnSelect={true}
          options={textbookOptions}
          onChange={onParentLevelChange}
          placeholder="请选择选择教材章节或知识点类别"
        />
      </div>
    </Col>
  </Row>
}
