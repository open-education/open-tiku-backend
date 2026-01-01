import {Flex, Input, Typography} from "antd";

export default function AddSubject() {
  return (
    <Flex vertical gap={16}>
      <div>
        <Typography.Title level={5}>科目名称</Typography.Title>
        <Input
          defaultValue=""
          placeholder="请输入科目名称"
        />
        <Typography.Text type="secondary" italic={true}>比如 语文, 后面才区分小学, 初中等</Typography.Text>
      </div>

      <div>
        <Typography.Title level={5}>科目标识</Typography.Title>
        <Input
          defaultValue=""
          placeholder="请输入科目标识"
        />
        <Typography.Text type="secondary" italic={true}>比如 语文 对应的英语单词是 chinese, 多个单词中间用下划线连接, 比如 this is 应该输入
          this_is</Typography.Text>
      </div>

      <div>
        <Typography.Title level={5}>排序编号</Typography.Title>
        <Input
          defaultValue=""
          placeholder="请输入排序编号"
        />
        <Typography.Text type="secondary" italic={true}>数字越小越靠前</Typography.Text>
      </div>
    </Flex>
  )
}