# Apple Music 授权功能使用说明

## 功能概述

本项目实现了完整的 Apple Music 用户授权功能，包括：

- ✅ OAuth 2.0 授权流程
- ✅ 访问令牌获取和管理
- ✅ 用户信息获取
- ✅ 令牌自动刷新
- ✅ 本地存储管理
- ✅ 演示模式支持
- ✅ 错误处理和状态管理

## 文件结构

```
src/
├── lib/
│   ├── apple-music.ts          # Apple Music API 配置和基础工具函数
│   ├── apple-music-api.ts      # 音乐数据获取 API 函数
│   └── demo-data.ts            # 演示数据生成器
├── hooks/
│   └── use-apple-music-auth.ts # 授权状态管理 Hook
├── components/
│   └── SunoAssistant.tsx       # Suno 助手组件
└── pages/
    ├── Connect.tsx             # 授权页面
    └── TestAuth.tsx            # 测试页面
```

## 使用方法

### 1. 基本授权流程

```typescript
import { useAppleMusicAuth } from '@/hooks/use-apple-music-auth';

function MyComponent() {
  const { 
    isAuthenticated, 
    isLoading, 
    user, 
    token,
    error, 
    isConfigured,
    startAuth, 
    logout 
  } = useAppleMusicAuth();

  if (!isConfigured) {
    return <div>需要配置 Apple Music API</div>;
  }

  if (isLoading) {
    return <div>加载中...</div>;
  }

  if (!isAuthenticated) {
    return <button onClick={startAuth}>授权 Apple Music</button>;
  }

  return (
    <div>
      <p>欢迎，{user?.name}！</p>
      <p>访问令牌: {token?.access_token}</p>
      <button onClick={logout}>退出登录</button>
    </div>
  );
}
```

### 2. 获取用户音乐数据

```typescript
import { fetchUserMusicLibrary } from '@/lib/apple-music-api';

async function getUserMusicData(accessToken: string) {
  try {
    const library = await fetchUserMusicLibrary(accessToken);
    
    console.log('最近播放:', library.recentlyPlayed);
    console.log('收藏歌曲:', library.lovedTracks);
    console.log('播放列表:', library.playlists);
    console.log('热门流派:', library.topGenres);
    console.log('听歌统计:', library.listeningStats);
    
    return library;
  } catch (error) {
    console.error('获取音乐数据失败:', error);
  }
}
```

### 3. 演示模式

```typescript
import { generateDemoMusicLibrary } from '@/lib/demo-data';

// 生成演示数据
const demoLibrary = generateDemoMusicLibrary();
console.log('演示音乐库:', demoLibrary);
```

## 配置说明

### 环境变量

在项目根目录创建 `.env.local` 文件：

```env
# Apple Music API 配置
VITE_APPLE_MUSIC_CLIENT_ID=your-apple-music-client-id
VITE_APPLE_MUSIC_REDIRECT_URI=http://localhost:8080/connect/callback

# 可选：客户端密钥（如果需要）
# VITE_APPLE_MUSIC_CLIENT_SECRET=your-client-secret
```

### Apple Developer Console 设置

1. 访问 [Apple Developer Console](https://developer.apple.com/account/)
2. 创建或选择你的 App ID
3. 启用 "MusicKit" 功能
4. 创建 MusicKit 密钥
5. 配置重定向 URI

## API 参考

### useAppleMusicAuth Hook

返回的属性和方法：

```typescript
interface AppleMusicAuthState {
  isAuthenticated: boolean;    // 是否已授权
  isLoading: boolean;          // 是否正在加载
  token: AppleMusicToken | null; // 访问令牌
  user: AppleMusicUser | null;   // 用户信息
  error: string | null;        // 错误信息
  isConfigured: boolean;       // API 是否已配置
}

// 方法
startAuth(): void;             // 开始授权流程
logout(): void;                // 退出登录
refreshToken(): Promise<AppleMusicToken>; // 刷新令牌
handleAuthCallback(): Promise<void>;      // 处理授权回调
```

### Apple Music API 函数

```typescript
// 获取最近播放的音乐
fetchRecentlyPlayed(accessToken: string, limit?: number): Promise<AppleMusicTrack[]>

// 获取收藏的音乐
fetchLovedTracks(accessToken: string, limit?: number): Promise<AppleMusicTrack[]>

// 获取播放列表
fetchUserPlaylists(accessToken: string, limit?: number): Promise<AppleMusicPlaylist[]>

// 获取完整音乐库
fetchUserMusicLibrary(accessToken: string): Promise<AppleMusicLibrary>

// 分析音乐数据
analyzeMusicData(tracks: AppleMusicTrack[]): MusicAnalysis

// 生成音乐人格提示词
generateMusicPersonaPrompt(library: AppleMusicLibrary): string
```

## 测试页面

访问 `/test-auth` 页面可以：

- 查看当前授权状态
- 测试授权流程
- 生成演示数据
- 查看配置说明

## 安全注意事项

1. **客户端密钥**: 不要在前端代码中暴露客户端密钥
2. **HTTPS**: 生产环境必须使用 HTTPS
3. **重定向 URI**: 确保重定向 URI 与配置一致
4. **CSRF 保护**: 已实现状态参数验证
5. **令牌存储**: 令牌存储在 localStorage，注意安全性

## 故障排除

### 常见错误

1. **"Invalid client"**: 检查客户端 ID 是否正确
2. **"Invalid redirect_uri"**: 确保重定向 URI 与配置一致
3. **"Access denied"**: 用户拒绝了授权请求
4. **"Token expired"**: 令牌已过期，需要重新授权

### 调试技巧

1. 检查浏览器控制台的网络请求
2. 查看 localStorage 中的令牌信息
3. 使用测试页面验证功能
4. 检查环境变量配置

## 扩展功能

可以基于现有代码扩展以下功能：

1. **音乐推荐**: 基于用户数据生成推荐
2. **播放列表生成**: 自动创建个性化播放列表
3. **音乐分析**: 更深入的音乐品味分析
4. **社交功能**: 分享音乐品味和发现
5. **AI 集成**: 与 AI 模型集成生成音乐内容

## 许可证

请确保遵守 Apple Music API 的使用条款和条件。
