import {Layout, Menu, type MenuProps, Spin, theme} from "antd";
import React, {useEffect, useState} from "react";
import {NavLink, Outlet} from "react-router";
import {LoadingOutlined} from "@ant-design/icons";

const {Content, Sider} = Layout;

///
/// 每一个顶部菜单下面这个首页其实都是重复的, 直接拷贝即可如果界面相同
///
export default function Index(props: any) {
  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const [leftMenuItemSelectKey, setLeftMenuItemSelectKey] =
    React.useState<string>("");
  const onLeftMenuClick: MenuProps["onClick"] = (e) => {
    setLeftMenuItemSelectKey(e.key);
  };

  const useIsMobile = (breakpoint = 768) => {
    // 默认值（SSR 时使用）
    const [isMobile, setIsMobile] = useState(false);
    const [isSSR, setIsSSR] = useState(true);

    useEffect(() => {
      setIsSSR(false);
      const checkMobile = () => {
        setIsMobile(window.innerWidth < breakpoint);
      };

      checkMobile();
      window.addEventListener("resize", checkMobile);

      return () => window.removeEventListener("resize", checkMobile);
    }, [breakpoint]);

    return {isMobile, isSSR};
  };

  let leftMenuItems: MenuProps["items"] = [
    {
      key: "textbook",
      label: <NavLink to={"textbook"}>教材元数据配置</NavLink>,
    },
    {
      key: "chapter",
      label: <NavLink to={"chapter"}>章节知识点题型配置</NavLink>,
    },
  ];

  const showLeftOrTopMenu = () => {
    const {isMobile, isSSR} = useIsMobile();
    if (isSSR) {
      return <Spin indicator={<LoadingOutlined spin/>}/>;
    }

    if (leftMenuItems.length == 0) {
      return "";
    }

    if (isMobile) {
      return (
        <Layout style={{padding: "0 12px 12px"}}>
          <Menu
            mode="inline"
            defaultSelectedKeys={[leftMenuItemSelectKey]}
            defaultOpenKeys={[]}
            style={{borderInlineEnd: 0}}
            onClick={onLeftMenuClick}
            items={leftMenuItems}
          />
        </Layout>
      );
    }
    return (
      <Sider theme={"light"}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[leftMenuItemSelectKey]}
          defaultOpenKeys={[]}
          style={{borderInlineEnd: 0}}
          onClick={onLeftMenuClick}
          items={leftMenuItems}
        />
      </Sider>
    );
  };

  return (
    <Layout>
      {/* 显示左侧或者顶部二级菜单, PC端显示左侧菜单, 其它端直接顶部显示即可 */}
      {showLeftOrTopMenu()}

      {/* 右边主体内容部分 */}
      <Layout style={{padding: "0 12px 12px", minHeight: "100vh"}}>
        {/* 导航对应的实际内容 */}
        <Content
          style={{
            padding: 24,
            margin: 0,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet/>
        </Content>
      </Layout>
    </Layout>
  );
}
