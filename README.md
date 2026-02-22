# 开放题库管理后台

开放题库分为两个前端项目, 一个为用户使用的前端项目 [open-tiku](https://github.com/open-education/open-tiku), 该项目为管理员维护基础信息和做审核等的管理后台项目

## 开发

开发环境 Caddyfile 配置, 安装自己系统的规范添加如下内容即可，本地不需要 https 域名证书指定 80 端口访问或者自行适配即可

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

本地域名解析

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

后端接口配置

目前后端接口配置在 .env.development 文件中，形如:

```
VITE_API_BASE_URL=http://tiku.test/api
```

线上配置是

```
VITE_API_BASE_URL=/api
```

具体配置可以查看请求的路径来修正

## 格式化

[VS Code](https://code.visualstudio.com/), 其它 IDE 注意不要引起代码大的格式化变动即可

[Prettier](https://prettier.io/) 代码格式化插件

Editor: Format On Save 格式化时机, 保存时格式化即可

Workbench › Tree: Indent 目录缩进默认8太窄, 加宽更容易区分

Prettier: Print Width 用户空间设置 150 个字符宽度, 现在显示器都比较宽 默认的 80 个字符宽度代码反而到处折行
