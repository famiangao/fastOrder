import path from 'path';
import fs from 'fs';

// 检查是否在 Electron 环境
const isElectron = typeof process !== 'undefined' && process.versions?.electron;

// 安全获取 electron app 对象
function getElectronApp() {
  if (!isElectron) return null;
  try {
    return require('electron').app;
  } catch {
    return null;
  }
}

/**
 * 获取应用资源路径，支持开发和打包环境
 */
export function getAppPath(): string {
  const app = getElectronApp();
  return app?.getAppPath() || process.resourcesPath || process.cwd();
}

/**
 * 获取用户数据目录
 */
export function getUserDataPath(): string {
  const app = getElectronApp();
  return app?.getPath('userData') || process.cwd();
}

/**
 * 确保数据库文件存在于用户数据目录中
 * 如果不存在，从应用资源中复制
 */
export function ensureDatabaseExists(): string {
  if (!isElectron) {
    // 开发环境：直接返回项目路径中的数据库
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }

  const app = getElectronApp();
  if (!app) {
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }

  const userDataPath = app.getPath('userData');
  const userDbPath = path.join(userDataPath, 'fastOrder.db');
  
  // 检查用户数据目录中是否已有数据库文件
  if (!fs.existsSync(userDbPath)) {
    // 在打包环境中，static 文件夹在 extraResources 中
    const resourcesPath = process.resourcesPath || app.getAppPath();
    const sourceDbPath = path.join(resourcesPath, 'static', 'fastOrder.db');
    
    try {
      // 确保用户数据目录存在
      fs.mkdirSync(userDataPath, { recursive: true });
      
      // 复制数据库文件
      fs.copyFileSync(sourceDbPath, userDbPath);
      console.log(`数据库文件已复制到: ${userDbPath}`);
    } catch (copyError) {
      console.error('复制数据库文件失败:', copyError);
      throw copyError;
    }
  }
  
  return userDbPath;
}

/**
 * 获取数据库文件路径
 */
export function getDatabasePath(): string {
  return ensureDatabaseExists();
}

/**
 * 检查是否在开发环境
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development' || !process.env.NODE_ENV;
}

/**
 * 检查是否在打包环境
 */
export function isPackaged(): boolean {
  const app = getElectronApp();
  return app?.isPackaged || false;
}