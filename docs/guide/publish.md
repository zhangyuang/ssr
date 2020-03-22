# Node.js 应用部署

如果是使用 egg 框架开发的应用，强烈推荐使用 `egg-scripts` 进行部署，使用 egg 提供的一系列解决方案，包括但不限于:

- 灵活的启动参数
- [Node.js 性能平台](https://www.aliyun.com/product/nodejs)
- [egg-alinode](https://github.com/eggjs/egg-alinode)

egg 提供了从部署、进程守护、监控、问题排查等一系列的解决方案。详情见[egg 部署文档](https://eggjs.org/zh-cn/core/deployment.html)

## pm2 部署

pm2 是一个带有负载均衡功能的应用的进程管理器。当你要把你的独立代码利用全部的服务器上的所有 CPU 核数，并保证进程永远都是存活状态和 0 秒的重载，那么 PM2 是很完美的选择。详细可参考[官方的部署文档示例](http://pm2.keymetrics.io/docs/usage/deployment/)，[github项目地址](https://github.com/Unitech/pm2)。

pm2 有以下的几个非常给力的能力:

- 内建负载均衡（使用Node cluster 集群模块）
- 后台运行
- 0 秒停机重载，我理解大概意思是维护升级的时候不需要停机
- 具有 Ubuntu 和 CentOS 的启动脚本
- 停止不稳定的进程（避免无限循环）
- 控制台检测
- 提供 HTTP API
- 远程控制和实时的接口API (Nodejs 模块, 允许和PM2进程管理器交互)

### pm2部署简单应用

- 安装pm2

```bash
$ npm install -g pm2
```

- 编写启动文件app.js

```js
const egg = require('egg')

const workers = Number(process.argv[2] || require('os').cpus().length)
egg.startCluster({
  workers,
  baseDir: __dirname
})

```

- 使用 pm2 部署简单的项目

```bash
$ EGG_SERVER_ENV=prod pm2 start app.js --name "egg-react-ssr" -i 0 --watch

pm2 start: 使用pm2启动 app.js
-i 0: 使用最大进程数启动
–name: 指定一个你喜欢的名字
–watch: 开启监视模式，如果代码有变动pm2自动重启（一般用于本地开发 ）
```

- 查看pm2部署

```bash
$ pm2 ls

┌───────────────┬────┬─────────┬──────┬───────┬────────┬─────────┬────────┬─────┬───────────┬──────┬──────────┐
│ App name      │ id │ version │ mode │ pid   │ status │ restart │ uptime │ cpu │ mem       │ user │ watching │
├───────────────┼────┼─────────┼──────┼───────┼────────┼─────────┼────────┼─────┼───────────┼──────┼──────────┤
│ egg-react-ssr │ 0  │ 1.0.53  │ fork │ 58835 │ online │ 0       │ 0s     │ 0%  │ 17.4 MB   │ xxx  │ disabled │
└───────────────┴────┴─────────┴──────┴───────┴────────┴─────────┴────────┴─────┴───────────┴──────┴──────────┘
```

### pm2自动部署远程服务器

不太清楚读者是使用什么方式部署 Node.js 应用的，之前我们的做法是使用 git 托管项目，然后在服务器中安装 git 将项目克隆到服务器中，然后一台一台机器的使用 pm2 命令启动项目，如果项目有任何的修改，就会需要跑到几个服务器中 pull 代码，然后pm2 reload 项目，蛋疼的要死。
现在就使用pm2的远程部署方式，解决这个蛋疼的问题！

#### 准备工作

- git ssh

在服务器上生成git ssh公钥(本地机器和服务器操作一样)，并添加到 git 上。这样服务器中clone项目也不需要输入密码。

```bash
$ git config --global user.name "yourname"
$ git config --global user.email "yourmail@mail.com"
$ ssh-keygen -t rsa -C "yourmail@mail.com"
```

连续三次回车,这样生成的ssh公钥添加到 github 或其他的 git 托管平台上。

- 机器免密登录

查看生成的ssh公钥:

```bash
$ ls ~/.ssh/
authorized_keys id_rsa          id_rsa.pub      known_hosts
```

理论上已经生成 ssh 公钥，在用户主目录下的 .ssh 目录中生成的 id_rsa.pub 就是生成的公钥。authorized_keys 文件是通过授权的 ssh 公钥，在使用 ssh 协议进行远程访问的时候，如果该机器的 ssh 公钥在这个文件中，那么能直接进行访问。将本地机器和线上服务器建立ssh信任，实现免密码登陆。

将ssh公钥拷贝到服务器:

```bash
$ scp ~/.ssh/id_rsa.pub username@ip:用户主目录/.ssh/authorized_keys
```

### pm2 配置文件 ecosystem.json

```json
{
  /**
   * Deployment section
   * http://pm2.keymetrics.io/docs/usage/deployment/
   */
  "deploy" : {
    "yourprojectname" : {
      // 你登陆到远程主机的用户名
      "user" : "node",
      // 服务器的ip地址 支持数组
      "host" : ["ip"],
      // 部署的分支
      "ref"  : "origin/master",
      // github 或 oschina 中托管的地址
      "repo" : "your-project-repo",
      // 部署到服务器的目录
      "path" : "/your/deploy/folder/",
      // 部署时的命令
      "post-deploy" : "npm install ; pm2 start bin/www --name 'your-app-name' --watch",
      // 环境变量
      "env"  : {
        "NODE_ENV": "dev"
      }
    }
  }
}
```

### 执行部署

```bash
$ pm2 deploy ecosystem.json yourprojectname setup
```

上面命令是将项目从 github 中克隆到指定 path 中，需要注意一下的是，pm2 将目录结构分为 :

```bash
|current | shared |source |
```

克隆好之后执行安装和启动

```bash
$ pm2 deploy ecosystem.json yourprojectname
```

以上的操作会将你的项目从远程仓库中克隆到服务器指定目录，然后执行配置文件中的执行命令。实现从本地执行一行命令部署多台服务器的操作。此功能可以大大减少部署和运维成本。

## 使用nginx来做负载均衡和端口代理

nginx 作为负载和代理服务可以实现在服务器上的静态资源托管、多应用 route 级别转发等基本需求。

- install

```bash
$ sudo yum install nginx
```

### nginx 托管静态资源

```js
server {
    listen       80;
    server_name  yourServerName;
    root         your/folder;
    index  index.html;
    # Load configuration files for the default server block.
    include /etc/nginx/default.d/*.conf;
    location / {}
    error_page 404 /404.html;
        location = /40x.html {
    }
    error_page 500 502 503 504 /50x.html;
        location = /50x.html {
    }
}
```

### nginx 开机自启

```bash
$ systemctl enable nginx
$ systemctl restart nginx
```

### 修改用户

nginx 文件首行默认用户为 nginx，需要修改为当前用户名。

### 本地代理某端口的服务

```js
location / {
    proxy_pass http://127.0.0.1:7001;
    proxy_hide_header 'x-frame-options';
    #root   html;
    #index  index.html index.htm;
}
```

### 启动

```bash
$ sudo nginx -c /usr/local/etc/nginx/nginx.conf
```
