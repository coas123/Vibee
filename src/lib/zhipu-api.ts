// 智谱AI API 调用模块

export interface ZhipuMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface ZhipuChatRequest {
  model: string;
  messages: ZhipuMessage[];
  temperature?: number;
  stream?: boolean;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
}

export interface ZhipuChatResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: ZhipuMessage;
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ZhipuStreamChunk {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
    };
    finish_reason?: string;
  }>;
}

export interface ZhipuError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

/**
 * 智谱AI API 配置
 */
export interface ZhipuConfig {
  apiKey: string;
  baseUrl?: string;
  timeout?: number;
}

/**
 * 智谱AI API 客户端类
 */
export class ZhipuClient {
  private apiKey: string;
  private baseUrl: string;
  private timeout: number;

  constructor(config: ZhipuConfig) {
    this.apiKey = config.apiKey;
    this.baseUrl = config.baseUrl || 'https://open.bigmodel.cn/api/paas/v4';
    this.timeout = config.timeout || 30000;
  }

  /**
   * 发送聊天请求（非流式）
   */
  async chat(request: ZhipuChatRequest): Promise<ZhipuChatResponse> {
    const url = `${this.baseUrl}/chat/completions`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...request,
          stream: false, // 确保非流式
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorData: ZhipuError = await response.json();
        throw new Error(`智谱API错误: ${errorData.error?.message || response.statusText}`);
      }

      const data: ZhipuChatResponse = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`智谱API调用失败: ${error.message}`);
      }
      throw new Error('智谱API调用失败: 未知错误');
    }
  }

  /**
   * 发送流式聊天请求
   */
  async *chatStream(request: ZhipuChatRequest): AsyncGenerator<ZhipuStreamChunk, void, unknown> {
    const url = `${this.baseUrl}/chat/completions`;
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          ...request,
          stream: true, // 确保流式
        }),
        signal: AbortSignal.timeout(this.timeout),
      });

      if (!response.ok) {
        const errorData: ZhipuError = await response.json();
        throw new Error(`智谱API错误: ${errorData.error?.message || response.statusText}`);
      }

      if (!response.body) {
        throw new Error('响应体为空');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || ''; // 保留最后一个不完整的行
          
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('data: ')) {
              const data = trimmedLine.slice(6);
              if (data === '[DONE]') {
                return;
              }
              
              try {
                const chunk: ZhipuStreamChunk = JSON.parse(data);
                yield chunk;
              } catch (parseError) {
                console.warn('解析流式数据失败:', parseError);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`智谱API流式调用失败: ${error.message}`);
      }
      throw new Error('智谱API流式调用失败: 未知错误');
    }
  }

  /**
   * 简化的聊天方法，返回完整响应
   */
  async simpleChat(
    messages: ZhipuMessage[], 
    model: string = 'glm-4.6',
    temperature: number = 0.6
  ): Promise<string> {
    const response = await this.chat({
      model,
      messages,
      temperature,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  }

  /**
   * 简化的流式聊天方法，返回内容生成器
   */
  async *simpleChatStream(
    messages: ZhipuMessage[], 
    model: string = 'glm-4.6',
    temperature: number = 0.6
  ): AsyncGenerator<string, void, unknown> {
    for await (const chunk of this.chatStream({
      model,
      messages,
      temperature,
      stream: true,
    })) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) {
        yield content;
      }
    }
  }
}

/**
 * 创建智谱AI客户端实例
 */
export function createZhipuClient(apiKey: string, config?: Partial<ZhipuConfig>): ZhipuClient {
  return new ZhipuClient({
    apiKey,
    ...config,
  });
}

/**
 * 快速调用智谱AI的便捷函数
 */
export async function callZhipuAPI(
  messages: ZhipuMessage[],
  apiKey: string,
  options?: {
    model?: string;
    temperature?: number;
    stream?: boolean;
  }
): Promise<string | AsyncGenerator<string, void, unknown>> {
  const client = createZhipuClient(apiKey);
  const { model = 'glm-4.6', temperature = 0.6, stream = false } = options || {};

  if (stream) {
    return client.simpleChatStream(messages, model, temperature);
  } else {
    return await client.simpleChat(messages, model, temperature);
  }
}

/**
 * 音乐人格分析专用函数
 */
export async function analyzeMusicPersona(
  musicData: string,
  apiKey: string,
  stream: boolean = false
): Promise<string | AsyncGenerator<string, void, unknown>> {
  const messages: ZhipuMessage[] = [
    {
      role: 'system',
      content: '你是一个专业的音乐分析师，擅长分析用户的音乐偏好和人格特征。请基于提供的音乐数据，生成详细的音乐人格分析报告。'
    },
    {
      role: 'user',
      content: musicData
    }
  ];

  return callZhipuAPI(messages, apiKey, {
    model: 'glm-4.6',
    temperature: 0.7,
    stream
  });
}

/**
 * 生成Suno创作提示词
 */
export async function generateSunoPrompt(
  musicPersona: string,
  apiKey: string,
  stream: boolean = false
): Promise<string | AsyncGenerator<string, void, unknown>> {
  const messages: ZhipuMessage[] = [
    {
      role: 'system',
      content: '你是一个专业的音乐创作助手，擅长为Suno AI音乐生成平台创作提示词。基于用户的音乐人格分析，生成适合的Suno创作提示词。'
    },
    {
      role: 'user',
      content: `基于以下音乐人格分析，为我生成Suno创作提示词：\n\n${musicPersona}`
    }
  ];

  return callZhipuAPI(messages, apiKey, {
    model: 'glm-4.6',
    temperature: 0.8,
    stream
  });
}

/**
 * 使用预设API Key的便捷函数
 */
export const ZHIPU_API_KEY = 'cc1d68f4b3e06c9d2798dd696a1c1e76.5ljTIZc4FmalYITy';

/**
 * 快速聊天函数（使用预设API Key）
 */
export async function quickChat(
  message: string,
  systemPrompt?: string,
  stream: boolean = false
): Promise<string | AsyncGenerator<string, void, unknown>> {
  const messages: ZhipuMessage[] = [];
  
  if (systemPrompt) {
    messages.push({ role: 'system', content: systemPrompt });
  }
  
  messages.push({ role: 'user', content: message });

  return callZhipuAPI(messages, ZHIPU_API_KEY, {
    model: 'glm-4.6',
    temperature: 0.6,
    stream
  });
}

/**
 * 音乐人格分析（使用预设API Key）
 */
export async function analyzeMusicPersonaQuick(
  musicData: string,
  stream: boolean = false
): Promise<string | AsyncGenerator<string, void, unknown>> {
  return analyzeMusicPersona(musicData, ZHIPU_API_KEY, stream);
}

/**
 * 生成Suno创作提示词（使用预设API Key）
 */
export async function generateSunoPromptQuick(
  musicPersona: string,
  stream: boolean = false
): Promise<string | AsyncGenerator<string, void, unknown>> {
  return generateSunoPrompt(musicPersona, ZHIPU_API_KEY, stream);
}
