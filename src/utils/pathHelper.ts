import path from 'path';

/**
 * 获取数据库文件路径
 */
export function getDatabasePath(): string {
  console.log(isDevelopment());
  
  if (isDevelopment()) {
    // 开发环境：直接返回项目路径中的数据库
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }
  return path.join(process.cwd(), 'resources', 'static', 'fastOrder.db');
}

/**
 * 检查是否在开发环境
 */
export function isDevelopment(): boolean {
  console.log(`当前环境: ${process.env}`);

  return process.env.NODE_ENV === 'development';
}
