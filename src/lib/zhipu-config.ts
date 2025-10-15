// 智谱AI API 配置
export const ZHIPU_CONFIG = {
  apiKey: 'cc1d68f4b3e06c9d2798dd696a1c1e76.5ljTIZc4FmalYITy',
  baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
  timeout: 30000,
  defaultModel: 'glm-4.6',
  defaultTemperature: 0.6,
} as const;

// 创建默认客户端实例
import { createZhipuClient } from './zhipu-api';

export const zhipuClient = createZhipuClient(ZHIPU_CONFIG.apiKey, {
  baseUrl: ZHIPU_CONFIG.baseUrl,
  timeout: ZHIPU_CONFIG.timeout,
});
