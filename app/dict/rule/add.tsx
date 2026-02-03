import { Alert, Form, Input, InputNumber, Select, Tag, type InputNumberProps } from "antd";
import { useCallback, useState } from "react";
import { StringConst, StringConstUtil } from "~/util/string";

// 组卷规则添加
export default function Add(props: any) {
  // 层次
  const [level, setLevel] = useState<number>(StringConstUtil.dictTestLevelOptions[0].value);
  const [levelIsEmpty, setLevelIsEmpty] = useState<boolean>(false);
  const onLevelChange = (value: number) => {
    setLevel(value);
  };

  // 核心考查目标
  const [target, setTarget] = useState<string>("");
  const [targetIsEmpty, setTargetIsEmpty] = useState<boolean>(false);
  const onTargetChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setTarget(e.target.value);
  }, []);

  // 总分
  const [score, setScore] = useState<number>(0);
  const [scoreIsEmpty, setScoreIsEmpty] = useState<boolean>(false);
  const onScoreChange: InputNumberProps["onChange"] = (value) => {
    setScore(Number(value ?? 0));
  };

  // 描述
  const [description, setDescription] = useState<string>("");
  const onDescriptionChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  }, []);

  return (
    <div>
      <Form layout="horizontal" labelCol={{ span: 2 }} wrapperCol={{ span: 22 }}>
        <Form.Item label="选择试卷层次">
          <Select value={level} style={{ width: 120 }} onChange={onLevelChange} options={StringConstUtil.dictTestLevelOptions} />
          {levelIsEmpty && <Alert title="试卷层次为空" type={"error"} />}
        </Form.Item>

        <Form.Item label="核心考查目标">
          <Input value={target} onChange={onTargetChange} placeholder="请输入核心考查目标" />
          {targetIsEmpty && <Alert title="核心考查目标为空" type={"error"} />}
        </Form.Item>

        <Form.Item label="总分">
          <InputNumber
            value={score}
            type={"number"}
            name="sortOrder"
            mode="spinner"
            min={0}
            max={150}
            placeholder="请输入总分"
            onChange={onScoreChange}
          />
          {scoreIsEmpty && <Alert title="总分为空" type={"error"} />}
        </Form.Item>

        <Form.Item label="描述">
          <Input value={description} onChange={onDescriptionChange} placeholder="请输入描述" />
        </Form.Item>
      </Form>
    </div>
  );
}
