import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { initMusicKit, authorizeMusicKit, unauthorizeMusicKit } from '@/lib/musickit';

export interface AppleMusicAuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  userToken: string | null; // MusicKit 用户令牌
  storefront: string | null;
  error: string | null;
}

export function useAppleMusicAuth() {
  const [state, setState] = useState<AppleMusicAuthState>({
    isAuthenticated: false,
    isLoading: true,
    userToken: null,
    storefront: null,
    error: null,
  });

  // 是否配置了 MusicKit 开发者令牌
  const developerToken = import.meta.env.VITE_APPLE_MUSIC_DEVELOPER_TOKEN;
  const appName = import.meta.env.VITE_APP_NAME || 'DocToDemo';
  const appBuild = import.meta.env.VITE_APP_BUILD || '1.0.0';
  const isConfigured = Boolean(developerToken);

  // 初始化 MusicKit 与本地令牌
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 未配置开发者令牌
        if (!isConfigured) {
          setState(prev => ({
            ...prev,
            isAuthenticated: false,
            isLoading: false,
          }));
          return;
        }
        // 初始化 MusicKit 实例
        const music = await initMusicKit({
          developerToken: developerToken as string,
          appName,
          appBuild,
        });

        // 读取本地用户令牌
        const storedUserToken = localStorage.getItem('apple_musickit_user_token');
        if (storedUserToken) {
          setState(prev => ({
            ...prev,
            isAuthenticated: true,
            isLoading: false,
            userToken: storedUserToken,
            storefront: music?.storefrontId ?? null,
          }));
          return;
        }

        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          userToken: null,
          storefront: music?.storefrontId ?? null,
        }));
      } catch (error) {
        console.error('Auth initialization failed:', error);
        setState(prev => ({
          ...prev,
          isAuthenticated: false,
          isLoading: false,
          error: error instanceof Error ? error.message : '初始化失败',
        }));
      }
    };

    initializeAuth();
  }, [isConfigured, developerToken, appName, appBuild]);

  // MusicKit 无回调流程，保留空实现以兼容调用方
  const handleAuthCallback = useCallback(async () => {
    return;
  }, []);

  // 开始授权流程（MusicKit 弹出授权，返回 userToken）
  const startAuth = useCallback(async () => {
    if (!isConfigured) {
      const errorMessage = 'MusicKit 未配置开发者令牌，请查看配置文档';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error(errorMessage);
      return;
    }

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      const userToken = await authorizeMusicKit();
      localStorage.setItem('apple_musickit_user_token', userToken);

      // storefront 可能已在实例上
      const musicInstance = (window as any).MusicKit?.getInstance();
      const storefront = musicInstance?.storefrontId ?? null;

      setState(prev => ({
        ...prev,
        isAuthenticated: true,
        isLoading: false,
        userToken,
        storefront,
      }));
      toast.success('Apple Music 授权成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '启动授权失败';
      setState(prev => ({ ...prev, isLoading: false, error: errorMessage }));
      toast.error(`启动授权失败: ${errorMessage}`);
    }
  }, [isConfigured]);

  // 登出
  const logout = useCallback(() => {
    try { unauthorizeMusicKit(); } catch {}
    localStorage.removeItem('apple_musickit_user_token');
    setState({
      isAuthenticated: false,
      isLoading: false,
      userToken: null,
      storefront: null,
      error: null,
    });
    toast.success('已退出 Apple Music');
  }, []);

  // MusicKit 用户令牌无需刷新，这里提供空实现保持 API 兼容
  const refreshToken = useCallback(async () => {
    return state.userToken;
  }, [state.userToken]);

  return {
    ...state,
    isConfigured,
    startAuth,
    logout,
    refreshToken,
    handleAuthCallback,
  };
}
