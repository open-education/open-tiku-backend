import {Col, Flex, Row, Space, Table, type TableProps, Typography,} from "antd";
import {NavLink} from "react-router";
import type {Textbook} from "~/type/textbook";

// 科目管理
export default function Index(props: any) {
  const columns: TableProps<Textbook>["columns"] = [
    {
      title: "科目名称",
      dataIndex: "label",
      key: "label",
    },
    {
      title: "科目标识",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "排序编码",
      dataIndex: "sortOrder",
      key: "sortOrder",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <Flex gap="small">
            <NavLink to={"edit/" + record.id}>编辑</NavLink>
          </Flex>
        </Space>
      ),
    },
  ];

  // 科目列表
  const items: Textbook[] = props.items ?? [];

  return (
    <div>
      <Typography.Title level={5}>科目列表</Typography.Title>

      {/* 添加入口 */}
      <div className="mt-2 mb-2">
        <Row gutter={[12, 12]} align="middle">
          <Col span={24}>
            <Flex gap="small" justify="flex-start">
              <NavLink to={"add"}>添加科目</NavLink>
            </Flex>
          </Col>
        </Row>
      </div>

      {/* 展示列表 */}
      <Table<Textbook> columns={columns} dataSource={items}/>
    </div>
  );
}
