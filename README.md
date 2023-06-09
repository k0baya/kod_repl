# [kod](https://github.com/kalcaddle/kodbox)_repl

在[Replit](https://replit.com/)中使用[可道云](https://kodcloud.com/)。基于可道云官方1.40版本。本仓库中添加了一些插件。

## 一键部署到Replit

点击下方图片一键部署。似乎会被Replit误判为Node.js，请**在Import之前手动修改Language为PHP Web Server**。一键部署的速度较慢，建议使用命令行部署。

[![一键部署到Replit](https://upload.wikimedia.org/wikipedia/commons/thumb/7/78/New_Replit_Logo.svg/330px-New_Replit_Logo.svg.png)](https://replit.com/github/k0baya/kod_repl)

## 命令行部署到Replit

在Replit中新建一个PHP Web Server容器，在Files中删除全部文件，然后在Shell中执行下述命令，等待命令执行完，点击Run即可。

```bash
git clone https://github.com/k0baya/kod_repl && mv -b kod_repl/* ./ && mv -b kod_repl/.[^.]* ./ && rm -rf *~ && rm -rf kod_repl
```

## 初始设定

初始用户名密码均为`admin`，请在第一次登陆之后修改，以确保安全。

## 后续更新

请使用手动更新，不要自动更新。在Replit的workspace中自行下载并解压覆盖升级包即可。

## 容器保活

Replit上托管的容器在一段时间无人访问之后就会休眠，所以可以使用一些外部监控手段保活。

我已知的网站监控：

>1 [cron-job.org](https://console.cron-job.org)
>
>2 [UptimeRobot](https://uptimerobot.com/)

可供自行搭建的网站监控：

>[Uptime-Kuma](https://github.com/louislam/uptime-kuma)
