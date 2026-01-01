import React, {useEffect, useState} from "react";
import {Layout, Menu, type MenuProps, Spin, theme} from "antd";
import {NavLink, Outlet, useLocation} from "react-router";
import User from "~/index/user";
import {LoadingOutlined} from "@ant-design/icons";
import {StringConst, StringUtil} from "~/util/string";

const {Header, Content, Sider} = Layout;

///
/// 后台入口
///

// 后台菜单直接手动配置即可
const items: MenuProps["items"] = [
  {
    key: "textbook",
    label: <NavLink to={"/textbook"}>教材</NavLink>,
  },
  {
    key: "dict",
    label: <NavLink to={"/dict"}>字典</NavLink>
  },
  {
    key: "user",
    label: <NavLink to={"/user"}>用户</NavLink>,
  },
];

export default function Index(props: any) {
  const [selectMenuKey, setSelectMenuKey] = useState<string>("");
  const onMenuClick: MenuProps["onClick"] = (e) => {
    setSelectMenuKey(e.key);
  };

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  const [leftMenuItemSelectKey, setLeftMenuItemSelectKey] = React.useState<string>("");
  const onLeftMenuClick: MenuProps["onClick"] = (e) => {
    setLeftMenuItemSelectKey(e.key);
  }

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
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, [breakpoint]);

    return {isMobile, isSSR};
  };

  const getLeftMenuItems = () => {
    let leftMenus: MenuProps["items"] = []
    let location = useLocation();
    let path = StringUtil.getLastPart(location.pathname, "/");
    if (path == StringConst.dict) {
      leftMenus = [
        {
          key: "subject",
          label: <NavLink to={"dict/subject"}>学科</NavLink>
        },
        {
          key: "publisher",
          label: <NavLink to={"dict/publisher"}>出版社</NavLink>
        },
        {
          key: "stage",
          label: <NavLink to={"dict/stage"}>学段</NavLink>
        },
      ];
    }
    return leftMenus;
  }

  let leftMenuItems = getLeftMenuItems();

  const showLeftOrTopMenu = () => {
    const {isMobile, isSSR} = useIsMobile();
    if (isSSR) {
      return <Spin indicator={<LoadingOutlined spin/>}/>
    }

    if (leftMenuItems.length == 0) {
      return "";
    }

    if (isMobile) {
      return <Layout style={{padding: "0 12px 12px"}}>
        <Menu
          mode="inline"
          defaultSelectedKeys={[leftMenuItemSelectKey]}
          defaultOpenKeys={[]}
          style={{borderInlineEnd: 0}}
          onClick={onLeftMenuClick}
          items={leftMenuItems}
        />
      </Layout>
    }
    return <Sider
      theme={"light"}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={[leftMenuItemSelectKey]}
        defaultOpenKeys={[]}
        style={{borderInlineEnd: 0}}
        onClick={onLeftMenuClick}
        items={leftMenuItems}
      />
    </Sider>
  }

  return (
    <Layout>
      {/* 顶部导航 */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          padding: "25px",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <div className="text-white mr-2.5 text-[16px]">
          <NavLink to="/">开放题库管理</NavLink>
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectMenuKey]}
          onClick={onMenuClick}
          mode="horizontal"
          items={items}
          style={{flex: 1, minWidth: 0}}
        />
        <User/>
      </Header>

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
    </Layout>
  );
}
