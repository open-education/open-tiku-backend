import { Avatar, Badge, Dropdown, Space, type MenuProps } from "antd";
import { NavLink } from "react-router";
import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
} from "@ant-design/icons";

// 用户菜单配置即可
const items: MenuProps["items"] = [
  {
    key: "my_account",
    label: <NavLink to={"user/account"}>我的信息</NavLink>,
    icon: <UserOutlined />,
  },
  {
    key: "setting",
    label: <NavLink to={"user/setting"}>账户设置</NavLink>,
    icon: <SettingOutlined />,
  },
  {
    type: "divider",
  },
  {
    key: "logout",
    label: <NavLink to={"user/logout"}>退出系统</NavLink>,
    icon: <LogoutOutlined />,
  },
];

// 用户信息和操作列表
export default function User() {
  return (
    <Dropdown menu={{ items }}>
      <Space>
        <Badge count={100}>
          <Avatar
            shape="square"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          />
        </Badge>
      </Space>
    </Dropdown>
  );
}
