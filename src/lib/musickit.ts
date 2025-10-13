// MusicKit JS 加载与初始化封装

export type MusicKitInstance = any;

declare global {
  interface Window {
    MusicKit?: any;
  }
}

let musicKitLoadPromise: Promise<any> | null = null;

export function loadMusicKitScript(): Promise<void> {
  if (window.MusicKit) {
    console.log('MusicKit 已存在');
    return Promise.resolve();
  }
  if (musicKitLoadPromise) {
    console.log('MusicKit 正在加载中...');
    return musicKitLoadPromise.then(() => {});
  }

  console.log('开始加载 MusicKit 脚本...');
  musicKitLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://js-cdn.music.apple.com/musickit/v3/musickit.js';
    script.async = true;
    script.onload = () => {
      console.log('MusicKit 脚本加载成功');
      // 等待一小段时间确保 MusicKit 对象完全初始化
      setTimeout(() => {
        if (window.MusicKit) {
          console.log('MusicKit 对象已可用');
          resolve(undefined);
        } else {
          reject(new Error('MusicKit 对象未在窗口上创建'));
        }
      }, 100);
    };
    script.onerror = (error) => {
      console.error('MusicKit 脚本加载失败:', error);
      reject(new Error('MusicKit JS 加载失败'));
    };
    document.head.appendChild(script);
  });

  return musicKitLoadPromise.then(() => {});
}

export interface InitMusicKitOptions {
  developerToken: string; // 来自 Apple 开发者后台签发的 JWT
  appName?: string;
  appBuild?: string;
}

export async function initMusicKit(options: InitMusicKitOptions): Promise<MusicKitInstance> {
  await loadMusicKitScript();
  const { developerToken, appName = 'DocToDemo', appBuild = '1.0.0' } = options;

  if (!window.MusicKit) {
    throw new Error('MusicKit 未在窗口对象上可用');
  }

  try {
    window.MusicKit.configure({
      developerToken,
      app: { name: appName, build: appBuild },
    });
  } catch (error) {
    throw new Error(`MusicKit 配置失败: ${error instanceof Error ? error.message : '未知错误'}`);
  }

  // 等待 MusicKit 实例创建，最多重试 5 次
  for (let i = 0; i < 5; i++) {
    try {
      const music = window.MusicKit.getInstance();
      
      if (music && typeof music.authorize === 'function') {
        return music;
      }
      
      // 等待 100ms 后重试
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      if (i === 4) { // 最后一次重试失败
        throw new Error(`MusicKit 实例初始化失败: ${error instanceof Error ? error.message : '未知错误'}`);
      }
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }
  
  throw new Error('MusicKit 实例初始化超时');
}

export async function authorizeMusicKit(music?: MusicKitInstance): Promise<string> {
  const instance = music ?? window.MusicKit?.getInstance();
  if (!instance) throw new Error('MusicKit 实例未初始化');
  const userToken: string = await instance.authorize();
  return userToken;
}

export function unauthorizeMusicKit(music?: MusicKitInstance): void {
  const instance = music ?? window.MusicKit?.getInstance();
  if (!instance) return;
  try {
    instance.unauthorize();
  } catch {
    // ignore
  }
}


