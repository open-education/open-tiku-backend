import {Alert, Button, Col, Divider, Drawer, Empty, Flex, Row, Tree, type TreeDataNode, Typography,} from "antd";
import React, {useState} from "react";
import Add from "~/dict/textbook/add";
import Edit from "~/dict/textbook/edit";
import {DownOutlined} from "@ant-design/icons";
import type {Textbook} from "~/type/textbook";
import {httpClient} from "~/util/http";
import {useNavigate} from "react-router";

// 菜单管理
export default function Index(props: any) {
  const navigate = useNavigate();
  const textbooks: Textbook[] = props.textbooks ?? [];

  // 递归生成树节点 - 菜单列表
  const get_items = (data: Textbook[]): TreeDataNode[] => {
    return data.map((item) => ({
      key: item.id,
      // 自定义渲染标题
      title: (
        <Row gutter={[12, 12]} align="middle" key={item.id}>
          <Col span={12}>{item.label}</Col>
          <Col span={12}>
            <Flex gap="small">
              <Button
                type="link"
                size="small"
                onClick={(e) => {
                  e.stopPropagation(); // 阻止事件冒泡
                  onEditClick(item.id);
                }}>
                编辑
              </Button>
              {
                /* 只有末级菜单可删除 */
                (!item.children || item.children.length == 0) && <Button
                  type="link"
                  size="small"
                  danger
                  onClick={(e) => {
                    e.stopPropagation(); // 阻止事件冒泡
                    onDeleteClick(item.id);
                  }}>
                  删除
                </Button>
              }
            </Flex>
          </Col>
        </Row>
      ),
      // 递归逻辑：如果存在子节点，则再次调用自身
      children: item.children && item.children.length > 0
        ? get_items(item.children)
        : []
    }));
  };

  // Drawer
  const [addDrawerSize, setAddDrawerSize] = useState(1200);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [drawerTitle, setDrawerTitle] = useState<string>("");
  const [drawerContent, setDrawerContent] = useState<React.ReactNode>("");
  const drawerExtraInfo = <div className="text-xs text-blue-700">提示: 鼠标触摸边框左右拖动可以调整到适合的宽度</div>
  // 添加菜单
  const showAddDrawer = () => {
    setOpenDrawer(true);
    setDrawerTitle("添加菜单");
    setDrawerContent(<Add
      setOpenDrawer={setOpenDrawer}
      setDrawerTitle={setDrawerTitle}
      setDrawerContent={setDrawerContent}
      textbookOptions={props.textbookOptions}
    />)
  };
  const onCloseDrawer = () => {
    setOpenDrawer(false);
  };

  // 打开编辑区域
  const onEditClick = (id: number) => {
    setOpenDrawer(true);
    setDrawerTitle("编辑菜单");
    setDrawerContent(<Edit
      setOpenDrawer={setOpenDrawer}
      setDrawerTitle={setDrawerTitle}
      setDrawerContent={setDrawerContent}
      textbookOptions={props.textbookOptions}
      key={id}
      id={id}
    />)
  }

  // 捕获错误标识
  const [catchError, setCatchError] = useState<React.ReactNode>("");

  // 删除菜单-实际上写在 组件客户端还灵活一些, 提交到 action 反而捕获错误要特殊处理监听
  const onDeleteClick = (id: number) => {
    if (confirm("确定删除?")) {
      httpClient.get<boolean>(`/textbook/delete/${id}`)
        .then((res) => {
          setCatchError("");
          // 刷新页面数据
          navigate("/dict/textbook", {replace: true});
        }).catch(err => {
        setCatchError(
          <Alert title={err.toString()} type="error"/>
        );
      })
    }
  }

  return (
    <div>
      <Typography.Title level={5}>菜单列表</Typography.Title>
      <Typography.Text type="secondary" italic={true}>
        该栏目只展示5级菜单, 否则太深不便于展示也不便于操作, 菜单一般只需要建到教材列表即可, 比如 学科-学段-出版社-类型-教材列表,
        即 数学-初中-湘教版-教材章节-七年级上册; 只有末级菜单可以删除;
      </Typography.Text>

      {/* 添加入口 */}
      <div className="mt-2 mb-2">
        <Row gutter={[12, 12]} align="middle">
          <Col span={24}>
            <Flex gap="small" justify="flex-start">
              <Button color="primary" variant="dashed" onClick={showAddDrawer}>
                添加菜单
              </Button>
            </Flex>
          </Col>
        </Row>
      </div>

      {/* 菜单分割线 */}
      <Divider titlePlacement="start" variant="dashed" style={{borderColor: '#7cb305'}} dashed/>

      {/* 展示错误信息 */}
      {catchError}

      {/* 展示空数据 */}
      {textbooks.length == 0 && <Empty/>}

      {/* 展示列表 */}
      <div className="mt-2">
        <Tree
          showLine
          blockNode // 这个属性让剩余水平空间尽可能宽, 否则变形严重
          switcherIcon={<DownOutlined/>}
          defaultExpandedKeys={['0-0-0']}
          treeData={get_items(textbooks)}
        />
      </div>

      {/* 抽屉操作区域 */}
      <Drawer
        title={drawerTitle}
        closable={{'aria-label': 'Close Button'}}
        onClose={onCloseDrawer}
        open={openDrawer}
        size={addDrawerSize}
        resizable={{
          onResize: (newSize) => setAddDrawerSize(newSize),
        }}
        extra={drawerExtraInfo}
      >
        {drawerContent}
      </Drawer>
    </div>
  );
}
