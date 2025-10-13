// Apple Music API 相关类型定义和工具函数

export interface AppleMusicToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope?: string;
}

export interface AppleMusicUser {
  id: string;
  name: string;
  email?: string;
}

export interface AppleMusicAuthError {
  error: string;
  error_description?: string;
}

// Apple Music 授权配置
export const APPLE_MUSIC_CONFIG = {
  // 注意：这些是示例值，实际使用时需要替换为真实的配置
  // 使用 import.meta.env 而不是 process.env，这是 Vite 推荐的方式
  clientId: import.meta.env.VITE_APPLE_MUSIC_CLIENT_ID || 'your-client-id',
  redirectUri: import.meta.env.VITE_APPLE_MUSIC_REDIRECT_URI || `${window.location.origin}/connect/callback`,
  scope: 'music-user-read-private music-user-read-email',
  responseType: 'code',
  // Apple Music API 端点
  authUrl: 'https://appleid.apple.com/auth/authorize',
  tokenUrl: 'https://appleid.apple.com/auth/token',
  userInfoUrl: 'https://api.music.apple.com/v1/me',
} as const;

/**
 * 生成 Apple Music 授权 URL
 */
export function generateAppleMusicAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: APPLE_MUSIC_CONFIG.clientId,
    redirect_uri: APPLE_MUSIC_CONFIG.redirectUri,
    response_type: APPLE_MUSIC_CONFIG.responseType,
    scope: APPLE_MUSIC_CONFIG.scope,
    state: generateRandomState(), // 防止 CSRF 攻击
  });

  return `${APPLE_MUSIC_CONFIG.authUrl}?${params.toString()}`;
}

/**
 * 生成随机状态字符串用于 CSRF 保护
 */
function generateRandomState(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

/**
 * 验证授权回调中的状态参数
 */
export function validateAuthState(receivedState: string, storedState: string): boolean {
  return receivedState === storedState;
}

/**
 * 从 URL 中提取授权码
 */
export function extractAuthCodeFromUrl(): string | null {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('code');
}

/**
 * 从 URL 中提取错误信息
 */
export function extractAuthErrorFromUrl(): AppleMusicAuthError | null {
  const urlParams = new URLSearchParams(window.location.search);
  const error = urlParams.get('error');
  const errorDescription = urlParams.get('error_description');
  
  if (error) {
    return {
      error,
      error_description: errorDescription || undefined,
    };
  }
  
  return null;
}

/**
 * 使用授权码获取访问令牌
 */
export async function exchangeCodeForToken(
  code: string,
  clientSecret?: string
): Promise<AppleMusicToken> {
  const tokenRequest = {
    grant_type: 'authorization_code',
    code,
    client_id: APPLE_MUSIC_CONFIG.clientId,
    client_secret: clientSecret,
    redirect_uri: APPLE_MUSIC_CONFIG.redirectUri,
  };

  const response = await fetch(APPLE_MUSIC_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(tokenRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token exchange failed: ${errorData.error_description || response.statusText}`);
  }

  return response.json();
}

/**
 * 使用访问令牌获取用户信息
 */
export async function fetchUserInfo(accessToken: string): Promise<AppleMusicUser> {
  const response = await fetch(APPLE_MUSIC_CONFIG.userInfoUrl, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  const userData = await response.json();
  return {
    id: userData.id,
    name: userData.name || userData.email || 'Apple Music User',
    email: userData.email,
  };
}

/**
 * 刷新访问令牌
 */
export async function refreshAccessToken(
  refreshToken: string,
  clientSecret?: string
): Promise<AppleMusicToken> {
  const tokenRequest = {
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
    client_id: APPLE_MUSIC_CONFIG.clientId,
    client_secret: clientSecret,
  };

  const response = await fetch(APPLE_MUSIC_CONFIG.tokenUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(tokenRequest),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(`Token refresh failed: ${errorData.error_description || response.statusText}`);
  }

  return response.json();
}

/**
 * 检查令牌是否即将过期
 */
export function isTokenExpiringSoon(token: AppleMusicToken, bufferMinutes: number = 5): boolean {
  const expirationTime = Date.now() + (token.expires_in * 1000);
  const bufferTime = bufferMinutes * 60 * 1000;
  return expirationTime - Date.now() < bufferTime;
}

/**
 * 本地存储令牌
 */
export function storeToken(token: AppleMusicToken): void {
  localStorage.setItem('apple_music_token', JSON.stringify({
    ...token,
    expires_at: Date.now() + (token.expires_in * 1000),
  }));
}

/**
 * 从本地存储获取令牌
 */
export function getStoredToken(): AppleMusicToken | null {
  try {
    const stored = localStorage.getItem('apple_music_token');
    if (!stored) return null;
    
    const token = JSON.parse(stored);
    
    // 检查令牌是否已过期
    if (token.expires_at && Date.now() > token.expires_at) {
      localStorage.removeItem('apple_music_token');
      return null;
    }
    
    return token;
  } catch (error) {
    console.error('Failed to parse stored token:', error);
    localStorage.removeItem('apple_music_token');
    return null;
  }
}

/**
 * 清除本地存储的令牌
 */
export function clearStoredToken(): void {
  localStorage.removeItem('apple_music_token');
}
