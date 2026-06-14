# 开放题库管理后台

开放题库分为两个前端项目, 一个为用户使用的前端项目 [open-tiku](https://github.com/open-education/open-tiku); 当前项目为管理员维护基础信息和做审核等的操作后台

## 开发

现在免费的 https 证书申请和更新维护比较繁琐，故采用 [Caddy](https://caddyserver.com/) 来作为 Web 服务

开发环境 Caddyfile 配置, 按照自己系统的规范添加如下内容即可，本地不需要 https 域名证书, 指定 80 端口访问或者自行适配

比如 Arch Linux 的配置在 /etc/caddy/conf.d 目录中, 需要自行注释或者删除默认 Caddyfile 中的根配置或者直接替换

```bash
[zhangguangxun@b760m open-tiku-api]$ cat /etc/caddy/conf.d/tiku
tiku.test:80 {
    encode zstd gzip

    handle_path /api/* {
        reverse_proxy 127.0.0.1:8082
    }

    handle {
        reverse_proxy 127.0.0.1:5173
    }
}

admin-tiku.test:80 {
    encode zstd gzip

    handle_path /api/* {
        reverse_proxy 127.0.0.1:8082
    }

    handle {
        reverse_proxy 127.0.0.1:5174
    }
}
```

开发环境的端口配置在文件 `vite.config.ts` 中自行调整

### 本地域名解析

开发环境对应解析本地域名

```bash
[zhangguangxun@b760m open-tiku-api]$ cat /etc/hosts
# Static table lookup for hostnames.
# See hosts(5) for details.
127.0.0.1        localhost
::1              localhost

# add tiku domain
127.0.0.1 tiku.test
127.0.0.1 admin-tiku.test
[zhangguangxun@b760m open-tiku-api]$
```

### 后端接口配置

目前后端接口配置在 .env.development 文件中，形如:

```
VITE_API_BASE_URL=http://admin-tiku.test/api
```

线上配置是

```
VITE_API_BASE_URL=/api
```

具体配置可以查看请求的路径来修正

### 格式化

[VS Code](https://code.visualstudio.com/), 其它 IDE 注意不要引起代码大的格式化变动即可

[Prettier](https://prettier.io/) 代码格式化插件

Editor: Format On Save 格式化时机, 保存时格式化即可

Workbench › Tree: Indent 目录缩进默认8太窄, 加宽更容易区分

Prettier: Print Width 用户空间设置 150 个字符宽度, 现在显示器都比较宽 默认的 80 个字符宽度代码反而到处折行

## 构建部署

目前没有CI/CD 等流水线, 本地构建后借助 `github` 平台完成产出物的发布和部署

### 构建

运行项目脚本, 线上编译为 SPA 模式运行, 不再依赖 Node 服务; 构建后在 target 目录中生成 `tgz` 格式的压缩包, 目前的部署方式是将该包上传至 `github` 项目 [Releases](https://github.com/open-education/open-tiku-backend/releases) 中, 部署时使用自己生成的版本号即可

```bash
sh build.sh
```

编译时会删除软连接对应的图片和文件资源

### 部署

登录到部署机器, 部署脚本 deploy.sh 首次部署需要手动拷贝至线上机器, 然后运行待部署的版本号, 部署时会将构建完毕的静态文件拷贝至 `caddy` 静态资源目录 `/var/www/open-tiku-backend` 中, 需要登录用户有 sudo 权限

```bash
sh deploy.sh -v v0.0.1-beta
```

### 静态资源

目前没有提供静态文件资源服务, 后端其实有对应的 api 接口读取这些资源, 现在已调整为 软链接 的方式访问这些资源, 本地和线上首次初始化时需要自己手动创建软链接

本地 `images` 图片资源存储目录和 `files` 文件资源存储目录不限制存储位置, 构建会删除该部分的内容

开发根据自己的情况创建类似的软链接即可, 实际存储目录调整为自己的机器路径

```bash
[zhangguangxun@b760m open-tiku-backend]$ cd public/
[zhangguangxun@b760m public]$ ls -ahl
total 24K
drwxr-xr-x 1 zhangguangxun zhangguangxun  44 Jun  3 19:30 .
drwxr-xr-x 1 zhangguangxun zhangguangxun 430 Jun  3 18:24 ..
-rw-r--r-- 1 zhangguangxun zhangguangxun 15K Jan 13 11:41 favicon.ico
lrwxrwxrwx 1 zhangguangxun zhangguangxun  19 Jun  3 19:30 files -> /var/www/meta/files
lrwxrwxrwx 1 zhangguangxun zhangguangxun  20 Jun  3 19:29 images -> /var/www/meta/images
[zhangguangxun@b760m public]$
```

线上现有的配置如下, 线上路径固定, 如果机器有变化等请按需要调整即可, 首次部署时已创建, 后续部署时通常无需再处理

```bash
zhangguangxun@VM-0-4-debian:/var/www/open-tiku-backend$ pwd
/var/www/open-tiku-backend
zhangguangxun@VM-0-4-debian:/var/www/open-tiku-backend$ ls -al
total 40
drwxr-xr-x 3 root root  4096 Jun  3 15:51 .
drwxr-xr-x 5 root root  4096 Jun  3 15:47 ..
drwxr-xr-x 2 root root 12288 Jun  3 14:39 assets
-rw-r--r-- 1 root root 15086 Jun  3 14:39 favicon.ico
lrwxrwxrwx 1 root root    19 Jun  3 15:51 files -> /var/www/meta/files
lrwxrwxrwx 1 root root    20 Jun  3 15:51 images -> /var/www/meta/images
-rw-r--r-- 1 root root  2239 Jun  3 14:39 index.html
zhangguangxun@VM-0-4-debian:/var/www/open-tiku-backend$
```

线上的 `Caddyfile` 文件内容请参考项目根目录中的 `Caddfile` 文件内容, 首次部署时自己配置或者直接拷贝类似内容
