// 题目详情页面
import type { TextbookOtherDict } from "~/type/textbook";
import type { QuestionInfoResp } from "~/type/question";
import { CommonTag } from "~/question/tag";
import { Col, Divider, Flex, Image, Row } from "antd";
import { CommonTitle } from "~/question/title";
import { CommonSelect } from "~/question/select";
import { StringValidator } from "~/util/string";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export default function Info(props: any) {
  const questionTypeList: TextbookOtherDict[] = props.questionTypeList ?? [];
  const questionTagList: TextbookOtherDict[] = props.questionTagList ?? [];
  const questionInfo: QuestionInfoResp = props.questionInfo;

  return (
    <div>
      {/* 题型和标签 */}
      {CommonTag(questionInfo.baseInfo, questionTypeList, questionTagList)}

      <Divider size="small" variant="dashed" style={{ borderColor: "#7cb305" }} dashed />

      {/* 题目标注和图片位置 */}
      {CommonTitle(questionInfo.baseInfo)}

      {/* 选项 */}
      {CommonSelect(questionInfo.baseInfo)}

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed>
        参考答案
      </Divider>

      {/* 参考答案 */}
      <Row>
        <Col span={24}>
          {StringValidator.isNonEmpty(questionInfo.extraInfo.answer) && (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {questionInfo.extraInfo.answer}
            </Markdown>
          )}
        </Col>
      </Row>

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed>
        知识点
      </Divider>

      {/* 知识点 */}
      <Row>
        <Col span={24}>
          {StringValidator.isNonEmpty(questionInfo.extraInfo.knowledge) && (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {questionInfo.extraInfo.knowledge}
            </Markdown>
          )}
        </Col>
      </Row>

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed>
        解题分析
      </Divider>

      {/* 解题分析 */}
      <Row>
        <Col span={24}>
          {StringValidator.isNonEmpty(questionInfo.extraInfo.analysis?.content) && (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {questionInfo.extraInfo.analysis?.content}
            </Markdown>
          )}
        </Col>
        {/* 如果有图片 */}
        <Col span={24}>
          <Flex gap="small" wrap>
            {questionInfo.extraInfo.analysis?.images?.map((imageName) => {
              return <Image height={200} key={imageName} alt="basic" src={`/api/file/read/${imageName}`} />;
            })}
          </Flex>
        </Col>
      </Row>

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed>
        解题过程
      </Divider>

      {/* 解题过程 */}
      <Row>
        <Col span={24}>
          {StringValidator.isNonEmpty(questionInfo.extraInfo.process?.content) && (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {questionInfo.extraInfo.process?.content}
            </Markdown>
          )}
        </Col>
        {/* 如果有图片 */}
        <Col span={24}>
          <Flex gap="small" wrap>
            {questionInfo.extraInfo.process?.images?.map((imageName) => {
              return <Image height={200} key={imageName} alt="basic" src={`/api/file/read/${imageName}`} />;
            })}
          </Flex>
        </Col>
      </Row>

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed>
        备注
      </Divider>

      {/* 备注 */}
      <Row>
        <Col span={24}>
          {StringValidator.isNonEmpty(questionInfo.extraInfo.remark) && (
            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
              {questionInfo.extraInfo.remark}
            </Markdown>
          )}
        </Col>
      </Row>

      <Divider size="small" variant="dashed" titlePlacement="start" style={{ borderColor: "#7cb305" }} dashed />
    </div>
  );
}
