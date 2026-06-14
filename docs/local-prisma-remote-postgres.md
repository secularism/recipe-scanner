# 本机 Prisma 连接远程 PostgreSQL 指南

本指南用于：

- 本机运行 Prisma
- 通过 SSH Tunnel 访问服务器上的 PostgreSQL
- 后续迁移表、重装电脑或换电脑时快速恢复连接

敏感信息统一放在本地 `apps/api/.env` 中，不写入 git 仓库。

## 一、当前约定

项目后端目录：

```text
apps/api
```

本地敏感配置文件：

```text
apps/api/.env
```

示例模板：

```text
apps/api/.env.example
```

## 二、`.env` 里需要保存什么

当前项目本地连接远程数据库时，至少保存这些变量：

```env
SSH_TUNNEL_HOST=47.96.36.31
SSH_TUNNEL_PORT=22
SSH_TUNNEL_USER=root
SSH_LOCAL_PORT=5432

DB_HOST=127.0.0.1
DB_PORT=5432
DB_NAME=recipe_scanner
DB_USER=recipe_user

DATABASE_URL="postgresql://recipe_user:your-url-encoded-password@127.0.0.1:5432/recipe_scanner?schema=public"
```

说明：

- `SSH_TUNNEL_HOST`：服务器公网 IP
- `SSH_TUNNEL_PORT`：SSH 端口，默认 `22`
- `SSH_TUNNEL_USER`：SSH 登录用户
- `SSH_LOCAL_PORT`：本机转发端口，当前使用 `5432`
- `DATABASE_URL`：Prisma 使用的数据库连接串

## 三、为什么 `DATABASE_URL` 要写 `127.0.0.1`

因为 Prisma 在本机运行时，不是直接连服务器公网数据库端口，而是连：

```text
127.0.0.1:5432
```

这个端口由 SSH Tunnel 转发到服务器上的 PostgreSQL。

所以：

- DBeaver 能用 SSH 连接，不代表 Prisma 自动能连
- Prisma 需要你在本机单独开启 SSH Tunnel

## 四、如何开启 SSH Tunnel

在 Windows PowerShell 中执行：

```powershell
ssh -L 5432:127.0.0.1:5432 root@47.96.36.31
```

如果 SSH 端口不是默认 `22`，则执行：

```powershell
ssh -L 5432:127.0.0.1:5432 root@47.96.36.31 -p 22
```

说明：

- 左侧第一个 `5432`：本机监听端口
- 中间 `127.0.0.1:5432`：服务器本机 PostgreSQL 监听地址
- `root@47.96.36.31`：服务器登录信息

这个窗口必须保持打开。窗口关闭后，隧道会断开。

## 五、如何验证本机隧道是否成功

在另一个 PowerShell 窗口执行：

```powershell
Test-NetConnection 127.0.0.1 -Port 5432
```

如果输出中有：

```text
TcpTestSucceeded : True
```

说明本机 Prisma 已具备连接数据库的前提条件。

## 六、密码里有特殊字符怎么办

如果数据库密码包含特殊字符，比如：

- `@`
- `:`
- `/`
- `?`
- `#`

则必须写 URL 编码。

例如密码末尾有一个 `@`：

```text
原密码: abc123@
编码后: abc123%40
```

所以：

```env
DATABASE_URL="postgresql://recipe_user:abc123%40@127.0.0.1:5432/recipe_scanner?schema=public"
```

## 七、后续 Prisma 常用命令

在仓库根目录执行：

```bash
npm --prefix apps/api install
```

初始化或生成客户端：

```bash
npm --prefix apps/api exec prisma generate
```

创建迁移并建表：

```bash
npm --prefix apps/api exec prisma migrate dev --name init
```

查看数据库结构：

```bash
npm --prefix apps/api exec prisma studio
```

## 八、换电脑后的恢复步骤

1. 拉取仓库
2. 安装 Node.js 与 npm
3. 在本地创建 `apps/api/.env`
4. 把 SSH 主机、SSH 用户、本地端口和 `DATABASE_URL` 填进去
5. 执行 SSH Tunnel 命令
6. 用 `Test-NetConnection 127.0.0.1 -Port 5432` 验证
7. 执行 Prisma 命令

## 九、不要提交的内容

以下内容不要提交到 git：

- `apps/api/.env`
- 明文数据库密码
- SSH 私钥
- 本机自定义 tunnel 脚本中的敏感信息

## 十、当前项目的推荐习惯

- 本机开发：Prisma 通过 SSH Tunnel 连远程 PostgreSQL
- 服务器部署：NestJS 通过 `127.0.0.1:5432` 直连同机 PostgreSQL
- 结构变更：优先通过 Prisma migration，而不是在 DBeaver 里手工改表
