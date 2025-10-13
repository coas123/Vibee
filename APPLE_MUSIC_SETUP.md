# Apple Music 授权配置指南

## 环境变量配置

在项目根目录创建 `.env.local` 文件，添加以下配置：

```env
# Apple Music API 配置
VITE_APPLE_MUSIC_CLIENT_ID=your-apple-music-client-id
VITE_APPLE_MUSIC_REDIRECT_URI=http://localhost:8080/connect/callback

# 可选：Apple Music API 客户端密钥（如果需要）
# VITE_APPLE_MUSIC_CLIENT_SECRET=your-client-secret
```

## Apple Developer Console 设置

1. 访问 [Apple Developer Console](https://developer.apple.com/account/)
2. 创建或选择你的 App ID
3. 启用 "MusicKit" 功能
4. 创建 MusicKit 密钥
5. 配置重定向 URI 为：`http://localhost:8080/connect/callback`

## 生产环境配置

在生产环境中，需要：

1. 更新重定向 URI 为你的生产域名
2. 确保 HTTPS 协议
3. 配置正确的域名验证

## 权限说明

应用请求的权限：
- `music-user-read-private`: 读取用户私人音乐数据
- `music-user-read-email`: 读取用户邮箱（可选）

## 安全注意事项

1. 客户端密钥不应暴露在前端代码中
2. 使用 HTTPS 协议
3. 验证重定向 URI
4. 实现 CSRF 保护（已包含状态参数）

## 故障排除

### 常见错误

1. **"Invalid client"**: 检查客户端 ID 是否正确
2. **"Invalid redirect_uri"**: 确保重定向 URI 与配置一致
3. **"Access denied"**: 用户拒绝了授权请求

### 调试模式

在开发环境中，可以在浏览器控制台查看详细的错误信息。
