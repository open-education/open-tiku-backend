// 选择题样式
import type { QuestionBaseInfoResp, QuestionOption } from "~/type/question";
import { Col, Row } from "antd";
import { StringValidator } from "~/util/string";
import Markdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

export function CommonSelect(questionInfo: QuestionBaseInfoResp) {
  const showSelectVal: number = questionInfo.optionsLayout ?? 1;

  if (showSelectVal === 1) {
    return (
      <Row gutter={[10, 10]}>
        {questionInfo.options?.map((item) => {
          return (
            <Col span={6} key={item.label}>
              {StringValidator.isNonEmpty(item.label) && (
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {`${item.label}. ${item.content}`}
                </Markdown>
              )}
            </Col>
          );
        })}
      </Row>
    );
  } else if (showSelectVal === 2) {
    return (
      <Row gutter={[10, 10]}>
        {questionInfo.options?.map((item) => {
          return (
            <Col span={24} key={item.label}>
              {StringValidator.isNonEmpty(item.label) && (
                <Markdown
                  remarkPlugins={[remarkMath]}
                  rehypePlugins={[rehypeKatex]}
                >
                  {`${item.label}. ${item.content}`}
                </Markdown>
              )}
            </Col>
          );
        })}
      </Row>
    );
  } else {
    // 将数组分成两部分, 5各选项的如果后续需要再调整样式, 5个选项一般选择一列的样式应该是最好的
    const options: QuestionOption[] = questionInfo.options ?? [];
    if (options.length === 0) {
      return "";
    }

    const mid = Math.floor(options.length / 2);
    const firstHalf = options.slice(0, mid);
    const secondHalf = options.slice(mid);

    return (
      <Row gutter={[10, 10]}>
        <Col span={24}>
          <Row gutter={[10, 10]}>
            {firstHalf.map((item) => {
              return (
                <Col span={12} key={item.label}>
                  {StringValidator.isNonEmpty(item.label) && (
                    <Markdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {`${item.label}. ${item.content}`}
                    </Markdown>
                  )}
                </Col>
              );
            })}
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={[10, 10]}>
            {secondHalf.map((item) => {
              return (
                <Col span={12} key={item.label}>
                  {StringValidator.isNonEmpty(item.label) && (
                    <Markdown
                      remarkPlugins={[remarkMath]}
                      rehypePlugins={[rehypeKatex]}
                    >
                      {`${item.label}. ${item.content}`}
                    </Markdown>
                  )}
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  }
}
