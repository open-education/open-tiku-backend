// 题目列表展示标签样式 题目类型在前 标签依次在后
import type {QuestionBaseInfoResp} from "~/type/question";
import type {TextbookOtherDict} from "~/type/textbook";
import {ArrayUtil} from "~/util/object";
import {Col, Flex, Row, Tag} from "antd";
import {getStatusLabel, type Label} from "~/util/approve";

export function CommonTag(
  questionInfo: QuestionBaseInfoResp,
  questionTypeList: TextbookOtherDict[],
  questionTagList: TextbookOtherDict[]
) {
  const questionTypeDict = ArrayUtil.arrayToDict(questionTypeList, 'id');
  const tagsDict = ArrayUtil.arrayToDict(questionTagList, 'id');

  // 审核状态标签
  const getApproveTag = (status: number) => {
    const label: Label = getStatusLabel(status);
    return <Tag color={label.color}>
      {label.text}
    </Tag>
  }

  return <Row gutter={[10, 10]}>
    <Col span={24}>
      <Flex gap="small" wrap>
        <Tag color="geekblue"
             key={questionInfo.questionTypeId}>{questionTypeDict[questionInfo.questionTypeId].itemValue}</Tag>
        {
          questionInfo.questionTagIds?.map(tagKey => {
            return <Tag color="green" key={tagKey}>{tagsDict[tagKey].itemValue}</Tag>
          })
        }
        {getApproveTag(questionInfo.status)}
      </Flex>
    </Col>
  </Row>
}
