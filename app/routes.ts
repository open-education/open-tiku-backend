import {route, type RouteConfig} from "@react-router/dev/routes";

export default [
  route("/", "routes/index/index.tsx", [
    route("textbook", "routes/textbook/index.tsx"),
    route("dict", "routes/dict/index.tsx", [
      // 注意路由同级关系
      route("subject", "routes/dict/subject/index.tsx"),
      route("subject/add", "routes/dict/subject/add.tsx"),
      route("subject/edit/:id", "routes/dict/subject/edit.tsx"),
    ]),
    route("user", "routes/user/index.tsx", [
      route("account", "routes/user/account.tsx"),
      route("setting", "routes/user/setting.tsx"),
      route("logout", "routes/user/logout.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
