#!/usr/bin/env node

import readline from 'readline';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function setupAppleMusic() {
  console.log('🍎 Apple Music Developer Token 设置向导');
  console.log('=====================================\n');
  
  console.log('📋 请准备以下信息：');
  console.log('1. Team ID (Issuer ID) - 在 Apple Developer Console 的 Membership 页面');
  console.log('2. Key ID - 创建 MusicKit 密钥时获得');
  console.log('3. .p8 私钥文件 - 从 Apple Developer Console 下载\n');
  
  const teamId = await question('请输入 Team ID: ');
  const keyId = await question('请输入 Key ID: ');
  const privateKeyPath = await question('请输入 .p8 文件路径 (相对项目根目录): ');
  
  // 检查文件是否存在
  const fullPath = path.resolve(privateKeyPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ 文件不存在: ${fullPath}`);
    rl.close();
    return;
  }
  
  // 生成环境变量配置
  const envConfig = `# Apple Music MusicKit 配置
export APPLE_TEAM_ID="${teamId}"
export APPLE_KEY_ID="${keyId}"
export APPLE_PRIVATE_KEY_PATH="${privateKeyPath}"
`;
  
  // 创建 .env.apple 文件
  const envFile = path.join(__dirname, '..', '.env.apple');
  fs.writeFileSync(envFile, envConfig);
  
  console.log('\n✅ 配置已保存到 .env.apple 文件');
  console.log('\n📝 下一步：');
  console.log('1. 运行: source .env.apple');
  console.log('2. 运行: node scripts/generate-token.js');
  console.log('3. 重启开发服务器');
  
  rl.close();
}

setupAppleMusic().catch(console.error);
