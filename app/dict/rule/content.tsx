import type { TextbookOtherDictResp } from "~/type/textbook";
import { Form, InputNumber, Select, type InputNumberProps } from "antd";

// 选择题型
interface SelectQuestionTypeProps {
  questionTypeList: TextbookOtherDictResp[];
}
export function SelectQuestionType(props: SelectQuestionTypeProps) {
  return (
    <div>
      {/* 题型 */}
      <Form.Item label="选择题型">
        <Select
          options={[
            { label: "选择题", value: "1" },
            { label: "填空题", value: "2" },
          ]}
        />
      </Form.Item>
    </div>
  );
}

// 选择填空样式一致
interface SelectAndFillBlankProps {
  num: number;
  setNum: (value: number) => void;
  score: number;
  setScore: (value: number) => void;
  total: number;
  setTotal: (value: number) => void;
}
export function SelectAndFillBlank(props: SelectAndFillBlankProps) {
  const onNumChange: InputNumberProps["onChange"] = (value) => {
    const val: number = Number(value ?? 0);
    props.setNum?.(val);
    props.setTotal?.(props.score * val);
  };

  const onScoreChange: InputNumberProps["onChange"] = (value) => {
    const val: number = Number(value ?? 0);
    props.setScore?.(val);
    props.setTotal?.(props.num * val);
  };

  return (
    <div>
      <Form.Item label="题数">
        <InputNumber value={props.num} min={1} max={30} defaultValue={1} onChange={onNumChange} />
      </Form.Item>

      <Form.Item label="每题分值">
        <InputNumber value={props.score} min={1} max={50} defaultValue={5} onChange={onScoreChange} />
      </Form.Item>

      <Form.Item label="小计">
        <span>{props.total} 分</span>
      </Form.Item>
    </div>
  );
}
