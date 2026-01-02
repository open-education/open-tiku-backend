# 开放题库管理后台

开放题库分为两个前端项目, 一个为用户使用的前端项目, 另一个为管理员维护基础信息和做审核等管理的管理后台项目

## 开发

现在因为有两个前端服务, 部署在一台机器上, 因此需要配置两个前端访问路径

```
server {
    listen 80;
    server_name localhost;
    charset utf-8;

    # 1. 前端项目代理
    location /frontend/ {
        proxy_pass http://127.0.0.1:5173;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 2. 后端项目代理
    location /backend/ {
        proxy_pass http://127.0.0.1:5174;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # 3. API 接口
    location /api/ {
        proxy_pass http://127.0.0.1:8082/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```
注意以下4点, 如果自己的配置不一样请对应调整

1. `proxy_pass http://127.0.0.1:5174;` 这个配置后面没有 `/`, 转发后要保留 `/frontend`

2. [vite.config.ts](vite.config.ts) 文件中的这个属性要配置跟 nginx 对应

```
export default defineConfig({
  base: "/backend/", // 这个 base 要对应
  ...
});
``` 

3. [react-router.config.ts](react-router.config.ts) 也要对应配置

```
export default {
  ...
  basename: "/backend/", // 也要对应配置这个属性
} satisfies Config;
```

4. 前端访问路径为 `http://127.0.0.1/backend`

