// 标题样式
import type {QuestionBaseInfoResp} from "~/type/question";
import {Col, Flex, Image, Row} from "antd";
import {StringValidator} from "~/util/string";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

export function CommonTitle(questionInfo: QuestionBaseInfoResp) {
  return <Row gutter={[10, 10]}>
    <Col span={24}>
      {
        StringValidator.isNonEmpty(questionInfo.title) && <Markdown
          remarkPlugins={[remarkMath, remarkGfm]}
          rehypePlugins={[rehypeKatex]}
        >
          {questionInfo.title}
        </Markdown>
      }
    </Col>
    {/* 标注 */}
    <Col span={24} className="text-[10px] italic text-blue-950">
      {
        StringValidator.isNonEmpty(questionInfo.comment) && <Markdown
          remarkPlugins={[remarkMath]}
          rehypePlugins={[rehypeKatex]}
        >
          {questionInfo.comment}
        </Markdown>
      }
    </Col>
    {/* 如果有图片 */}
    <Col span={24}>
      <Flex gap="small" wrap>
        {questionInfo.images?.map(imageName => {
          return (
            <div className="w-125" key={imageName}>
              <Image alt="basic" src={`/api/file/read/${imageName}`}/>
            </div>
          );
        })}
      </Flex>
    </Col>
  </Row>
}
