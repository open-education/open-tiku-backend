# 开放题库管理后台

开放题库分为两个前端项目, 一个为用户使用的前端项目 [open-tiku](https://github.com/open-education/open-tiku), 该项目为管理员维护基础信息和做审核等的管理后台项目

## 开发

现在因为有两个前端服务, 部署在一台机器上, 因此需要配置两个前端访问路径. 如果你未做同样的配置, 需要将以下要注意的4点也做对应的更改, 更改后要注意部署机器上的配置, 否则不要盲目将该更改提交到主分支

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

Mac 环境可能 nginx 时间不一致导致资源过期, 如果遇到可尝试在每个配置下增加如下配置 `autoindex_localtime on` :

错误类似

```
Summary
    URL: http://127.0.0.1/backend/node_modules/.vite/deps/react-router.js?v=63655cd9
    Status: 504 Outdated Optimize Dep
    Source: Network
    Initiator: 
    backend:489
```

```
# API 代理到后端服务
location /api/ {
    # 代理到后端服务器
    autoindex_localtime on;
    proxy_pass http://localhost:8081/;
}
```

或者开发时需要运行 

```
npm run dev -- --force
```

也可能是 Safari 浏览器的原因, 其它浏览器应该就没类似的问题

vite 这个垃圾玩意, 又想自动刷新又搞不定，还不如剩下资源自己手动刷新

注意以下5点, 如果自己的配置不一样请对应调整

#### 1. `proxy_pass http://127.0.0.1:5174;` 

这个配置后面没有 `/`, 转发后要保留 `/backend` 一样的路径, 不然浏览器区分不了资源, ip和端口使用自己电脑的即可

#### 2. [vite.config.ts](vite.config.ts) 文件中的这个属性要配置跟 nginx 对应

```
export default defineConfig({
  base: "/backend/", // 这个 base 要对应
  ...
});
``` 

#### 3. [react-router.config.ts](react-router.config.ts) 也要对应配置

```
export default {
  ...
  basename: "/backend/", // 也要对应配置这个属性
} satisfies Config;
```

#### 4. 前端访问 `http://127.0.0.1/backend/`

#### 5. [server.js](server.js) 文件中类似下面的访问

```
  // 静态文件 - 长缓存
app.use('/backend/assets', express.static('./build/client/assets', {
    maxAge: '1y', immutable: true,
}));
```

通常线上才有该配置, 也需要一起调整
