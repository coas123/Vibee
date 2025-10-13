#!/usr/bin/env node

import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 配置信息 - 请替换为你的实际值
const CONFIG = {
  teamId: process.env.APPLE_TEAM_ID || '2GXTYU4XCM', // 你的 Team ID
  keyId: process.env.APPLE_KEY_ID || 'HZ357LJK38',   // 你的 Key ID
  privateKeyPath: process.env.APPLE_PRIVATE_KEY_PATH || './AuthKey_HZ357LJK38.p8', // .p8 文件路径
};

function generateDeveloperToken() {
  try {
    // 检查配置文件
    if (CONFIG.teamId === 'YOUR_TEAM_ID' || CONFIG.keyId === 'YOUR_KEY_ID') {
      console.error('❌ 请先配置 Team ID 和 Key ID');
      console.log('\n📝 配置方法：');
      console.log('1. 设置环境变量：');
      console.log('   export APPLE_TEAM_ID="你的Team ID"');
      console.log('   export APPLE_KEY_ID="你的Key ID"');
      console.log('   export APPLE_PRIVATE_KEY_PATH="./你的.p8文件路径"');
      console.log('\n2. 或者直接修改脚本中的 CONFIG 对象');
      process.exit(1);
    }

    // 检查私钥文件
    if (!fs.existsSync(CONFIG.privateKeyPath)) {
      console.error(`❌ 私钥文件不存在: ${CONFIG.privateKeyPath}`);
      console.log('\n📝 请确保：');
      console.log('1. 已从 Apple Developer Console 下载 .p8 文件');
      console.log('2. 文件路径正确');
      console.log('3. 设置正确的 APPLE_PRIVATE_KEY_PATH 环境变量');
      process.exit(1);
    }

    // 读取私钥
    const privateKey = fs.readFileSync(CONFIG.privateKeyPath);

    // 生成 JWT
    const token = jwt.sign({}, privateKey, {
      algorithm: 'ES256',
      expiresIn: '180d',
      issuer: CONFIG.teamId,
      header: { 
        kid: CONFIG.keyId, 
        alg: 'ES256' 
      }
    });

    console.log('✅ Developer Token 生成成功！');
    console.log('\n🔑 生成的令牌：');
    console.log(token);
    
    // 自动更新 .env.local 文件
    updateEnvFile(token);
    
    console.log('\n📋 使用说明：');
    console.log('1. 令牌已自动更新到 .env.local 文件');
    console.log('2. 重启开发服务器以生效');
    console.log('3. 令牌有效期：180 天');
    console.log('4. 过期后重新运行此脚本生成新令牌');

  } catch (error) {
    console.error('❌ 生成令牌失败：', error.message);
    process.exit(1);
  }
}

function updateEnvFile(token) {
  const envPath = path.join(__dirname, '..', '.env.local');
  
  try {
    let envContent = '';
    
    // 如果 .env.local 存在，读取现有内容
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    
    // 更新或添加 VITE_APPLE_MUSIC_DEVELOPER_TOKEN
    const tokenRegex = /^VITE_APPLE_MUSIC_DEVELOPER_TOKEN=.*$/m;
    const newTokenLine = `VITE_APPLE_MUSIC_DEVELOPER_TOKEN=${token}`;
    
    if (tokenRegex.test(envContent)) {
      // 替换现有令牌
      envContent = envContent.replace(tokenRegex, newTokenLine);
    } else {
      // 添加新令牌
      envContent += (envContent ? '\n' : '') + newTokenLine;
    }
    
    // 确保其他必要的环境变量存在
    const requiredVars = [
      'VITE_APP_NAME=DocToDemo',
      'VITE_APP_BUILD=1.0.0'
    ];
    
    requiredVars.forEach(varLine => {
      const [varName] = varLine.split('=');
      const varRegex = new RegExp(`^${varName}=.*$`, 'm');
      
      if (!varRegex.test(envContent)) {
        envContent += '\n' + varLine;
      }
    });
    
    // 写入文件
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env.local 文件已更新');
    
  } catch (error) {
    console.warn('⚠️  无法自动更新 .env.local 文件：', error.message);
    console.log('请手动将以下内容添加到 .env.local：');
    console.log(`VITE_APPLE_MUSIC_DEVELOPER_TOKEN=${token}`);
  }
}

// 显示帮助信息
if (process.argv.includes('--help') || process.argv.includes('-h')) {
  console.log('🍎 Apple Music Developer Token 生成器');
  console.log('\n📖 使用方法：');
  console.log('  node scripts/generate-token.js');
  console.log('\n🔧 配置方法：');
  console.log('  方法1 - 环境变量：');
  console.log('    export APPLE_TEAM_ID="你的Team ID"');
  console.log('    export APPLE_KEY_ID="你的Key ID"');
  console.log('    export APPLE_PRIVATE_KEY_PATH="./AuthKey_XXXXXXXXXX.p8"');
  console.log('\n  方法2 - 修改脚本：');
  console.log('    编辑 scripts/generate-token.js 中的 CONFIG 对象');
  console.log('\n📋 获取凭据：');
  console.log('  1. 访问 https://developer.apple.com/account/');
  console.log('  2. 进入 Certificates, Identifiers & Profiles');
  console.log('  3. 创建 MusicKit 密钥');
  console.log('  4. 下载 .p8 文件');
  process.exit(0);
}

// 运行生成器
generateDeveloperToken();
