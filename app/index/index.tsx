import React, {useState} from "react";
import {Layout, Menu, type MenuProps} from "antd";
import {NavLink, Outlet} from "react-router";
import User from "~/index/user";

const {Header} = Layout;

///
/// 后台入口
///

// 后台菜单直接手动配置即可
const items: MenuProps["items"] = [
  {
    key: "textbook",
    label: <NavLink to={"/textbook"}>题目</NavLink>,
  },
  {
    key: "dict",
    label: <NavLink to={"/dict"}>字典</NavLink>,
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
      <Outlet/>
    </Layout>
  );
}
