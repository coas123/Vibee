# Apple Music Developer Token 自动生成指南

## 🚀 快速开始

### 方法一：使用交互式设置（推荐）

```bash
# 1. 运行设置向导
npm run apple:setup

# 2. 按提示输入信息后，加载环境变量
source .env.apple

# 3. 生成令牌
npm run apple:token
```

### 方法二：手动配置

```bash
# 1. 设置环境变量
export APPLE_TEAM_ID="你的Team ID"
export APPLE_KEY_ID="你的Key ID" 
export APPLE_PRIVATE_KEY_PATH="./AuthKey_XXXXXXXXXX.p8"

# 2. 生成令牌
npm run apple:token
```

## 📋 获取 Apple 凭据

### 1. 获取 Team ID
1. 访问 [Apple Developer Console](https://developer.apple.com/account/)
2. 进入 **Membership** 页面
3. 复制 **Team ID**（格式：`XXXXXXXXXX`）

### 2. 创建 MusicKit 密钥
1. 进入 **Certificates, Identifiers & Profiles**
2. 点击 **Keys** → **Create a key**
3. 输入密钥名称
4. 勾选 **MusicKit** 功能
5. 点击 **Continue** → **Register**
6. 下载 `.p8` 文件（只能下载一次！）
7. 记录 **Key ID**（格式：`XXXXXXXXXX`）

### 3. 配置项目
将下载的 `.p8` 文件放到项目根目录，或记录完整路径。

## 🔧 脚本功能

### `npm run apple:setup`
- 交互式配置向导
- 自动创建 `.env.apple` 文件
- 验证文件路径

### `npm run apple:token`
- 自动生成 JWT 令牌
- 自动更新 `.env.local` 文件
- 验证配置完整性

## 📁 文件说明

- `.env.apple` - Apple 凭据配置（不提交到 Git）
- `.env.local` - Vite 环境变量（不提交到 Git）
- `scripts/generate-token.js` - 令牌生成脚本
- `scripts/setup-apple-music.js` - 配置向导脚本

## ⚠️ 注意事项

1. **私钥安全**：`.p8` 文件只能下载一次，请妥善保管
2. **令牌有效期**：生成的令牌有效期为 180 天
3. **环境变量**：确保 `.env.apple` 和 `.env.local` 不被提交到版本控制
4. **重启服务**：更新令牌后需要重启开发服务器

## 🔄 更新令牌

令牌过期后，重新运行：
```bash
npm run apple:token
```

## 🐛 常见问题

### Q: 提示 "私钥文件不存在"
A: 检查 `.p8` 文件路径是否正确，确保文件在指定位置

### Q: 提示 "Team ID 或 Key ID 未配置"
A: 运行 `npm run apple:setup` 重新配置，或手动设置环境变量

### Q: 生成的令牌无效
A: 检查 Team ID、Key ID 和私钥文件是否匹配，确保私钥文件未损坏

## 📞 获取帮助

```bash
# 查看生成脚本帮助
node scripts/generate-token.js --help
```
