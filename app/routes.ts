import {route, type RouteConfig} from "@react-router/dev/routes";

export default [
  route("/", "routes/index/index.tsx", [
    route("textbook", "routes/textbook/index.tsx"),
    route("dict", "routes/dict/index.tsx", [
      route("textbook", "routes/dict/textbook/index.tsx"),
      route("chapter", "routes/dict/chapter/index.tsx"),
    ]),
    route("user", "routes/user/index.tsx", [
      route("account", "routes/user/account.tsx"),
      route("setting", "routes/user/setting.tsx"),
      route("logout", "routes/user/logout.tsx"),
    ]),
  ]),
] satisfies RouteConfig;
