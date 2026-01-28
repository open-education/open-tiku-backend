import { Col, Flex, Row, Tag } from "antd";
import type { TextbookOtherDict } from "~/type/textbook";
import { ArrayUtil } from "~/util/object";
import { StarFilled } from "@ant-design/icons";
import { getStatusLabel, type Label } from "~/util/approve";

interface TagProps {
  questionTypeList: TextbookOtherDict[];
  questionTagList: TextbookOtherDict[];
  questionTypeId: number;
  questionTagIds: number[];
  difficultyLevel: number;
  status?: number;
}

// 题目列表展示标签样式 题目类型在前 标签依次在后
export function CommonTag(props: TagProps) {
  const questionTypeDict = ArrayUtil.arrayToDict(props.questionTypeList, "id");
  const tagsDict = ArrayUtil.arrayToDict(props.questionTagList, "id");

  // 审核状态标签
  const getApproveTag = (status: number) => {
    const label: Label = getStatusLabel(status);
    return <Tag color={label.color}>{label.text}</Tag>;
  };

  return (
    <Row gutter={[10, 10]}>
      <Col span={24}>
        <Flex gap="small" wrap>
          <Tag color="geekblue" key={props.questionTypeId}>
            {questionTypeDict[props.questionTypeId].itemValue}
          </Tag>
          {props.questionTagIds?.map((tagKey) => {
            return (
              <Tag color="green" key={tagKey}>
                {tagsDict[tagKey].itemValue}
              </Tag>
            );
          })}
          <Tag color="red">
            {props.difficultyLevel} <StarFilled style={{ color: "green" }} />
          </Tag>
          {getApproveTag(props.status ?? 0)}
        </Flex>
      </Col>
    </Row>
  );
}
