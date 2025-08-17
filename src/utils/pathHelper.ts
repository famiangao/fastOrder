import path from 'path';
import fs from 'fs';

/**
 * 获取应用资源路径，支持开发和打包环境
 */
export function getAppPath(): string {
  // 检查是否在 Electron 环境中
  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    try {
      const { app } = require('electron');
      return app.getAppPath();
    } catch (e) {
      // 如果获取失败，使用备用路径
      return process.resourcesPath || process.cwd();
    }
  } else {
    // 开发环境：使用 process.cwd()
    return process.cwd();
  }
}

/**
 * 获取用户数据目录
 */
export function getUserDataPath(): string {
  if (typeof process !== 'undefined' && process.versions && process.versions.electron) {
    try {
      const { app } = require('electron');
      return app.getPath('userData');
    } catch (e) {
      return process.cwd();
    }
  } else {
    return process.cwd();
  }
}

/**
 * 确保数据库文件存在于用户数据目录中
 * 如果不存在，从应用资源中复制
 */
export function ensureDatabaseExists(): string {
  const isElectron = typeof process !== 'undefined' && process.versions && process.versions.electron;
  
  if (!isElectron) {
    // 开发环境：直接返回项目路径中的数据库
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }

  try {
    const { app } = require('electron');
    const userDataPath = app.getPath('userData');
    const userDbPath = path.join(userDataPath, 'fastOrder.db');
    
    // 检查用户数据目录中是否已有数据库文件
    if (!fs.existsSync(userDbPath)) {
      // 在打包环境中，static 文件夹在 extraResources 中
      const resourcesPath = process.resourcesPath || app.getAppPath();
      const sourceDbPath = path.join(resourcesPath, 'static', 'fastOrder.db');
      
      try {
        // 确保用户数据目录存在
        if (!fs.existsSync(userDataPath)) {
          fs.mkdirSync(userDataPath, { recursive: true });
        }
        
        // 复制数据库文件
        fs.copyFileSync(sourceDbPath, userDbPath);
        console.log(`数据库文件已复制到: ${userDbPath}`);
      } catch (copyError) {
        console.error('复制数据库文件失败:', copyError);
        throw copyError;
      }
    }
    
    return userDbPath;
  } catch (e) {
    // 降级到开发环境路径
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }
}

/**
 * 获取数据库文件路径
 */
export function getDatabasePath(): string {
  return ensureDatabaseExists();
}

/**
 * 获取脚本文件路径
 */
// export function getScriptPath(scriptName: string): string {
//   const appPath = getAppPath();
  
//   // 在打包环境中，脚本可能在不同位置
//   const possiblePaths = [
//     path.join(appPath, 'src', 'assets', scriptName),
//     path.join(appPath, 'dist-electron', 'main', 'assets', scriptName),
//     path.join(appPath, 'assets', scriptName),
//     path.join(appPath, scriptName)
//   ];
  
//   // 返回第一个可能的路径，运行时会尝试这些路径
//   return possiblePaths[0];
// }

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
  return typeof process !== 'undefined' && 
         process.versions && 
         !!process.versions.electron && 
         !isDevelopment();
}