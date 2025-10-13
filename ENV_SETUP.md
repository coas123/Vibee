# 环境变量设置指南

## 问题解决

如果你遇到了 `Uncaught ReferenceError: process is not defined` 错误，这是因为代码尝试在浏览器环境中访问 Node.js 的 `process` 对象。

## 解决方案

我们已经将代码从 `process.env` 更改为 `import.meta.env`，这是 Vite 推荐的方式。

## 环境变量配置

要配置 Apple Music（推荐使用网页版 MusicKit JS），请创建以下环境变量文件：

### 1. 创建 `.env.local` 文件

在项目根目录创建 `.env.local` 文件：

```bash
# MusicKit JS 配置（前端可用变量需以 VITE_ 开头）
VITE_APPLE_MUSIC_DEVELOPER_TOKEN=your-developer-jwt
VITE_APP_NAME=DocToDemo
VITE_APP_BUILD=1.0.0
```

### 2. 生成 MusicKit 开发者令牌（Developer Token）

1. 访问 [Apple Developer Portal](https://developer.apple.com/)
2. 在 "Certificates, Identifiers & Profiles" 创建 MusicKit 密钥（Key ID、Issuer ID、私钥 p8）
3. 使用上述信息在服务端生成 JWT（Developer Token）。开发环境可临时本地生成，但生产环境必须由服务端签发
4. 将生成的 JWT 填入 `VITE_APPLE_MUSIC_DEVELOPER_TOKEN`

示例 Node 生成脚本（仅供参考，建议放在服务端运行）：

```js
import jwt from 'jsonwebtoken';

const teamId = 'YOUR_TEAM_ID'; // Issuer ID
const keyId = 'YOUR_KEY_ID';
const privateKey = process.env.APPLE_MUSICKIT_PRIVATE_KEY_P8; // 读取 p8 内容

const token = jwt.sign({}, privateKey, {
  algorithm: 'ES256',
  expiresIn: '180d',
  issuer: teamId,
  header: { kid: keyId, alg: 'ES256' },
});

console.log(token);
```

### 3. 重要提示

- 所有环境变量必须以 `VITE_` 开头才能在客户端代码中访问
- `.env.local` 文件应该被添加到 `.gitignore` 中，不要提交到版本控制
- Developer Token 建议由后端下发，前端仅使用 User Token（MusicKit 授权得到）
- 在生产环境中，避免把 Developer Token 硬编码在前端

## 验证配置

重启开发服务器后，错误应该消失。你可以通过以下方式验证配置：

```javascript
console.log('Developer Token:', import.meta.env.VITE_APPLE_MUSIC_DEVELOPER_TOKEN);
```

如果输出显示你的客户端 ID，说明配置成功。
