import { appConfig } from '@/dal/appConfig'

const configDal = new appConfig();

export interface ChromeConfig {
  userDataDir: string
  debugPort: string
}

export const getChromeConfig = async (): Promise<ChromeConfig> => {
  try {
    const userDataDir = await configDal.getConfig('chromeUserDataDir')
    const debugPort = await configDal.getConfig('chromeDebugPort')
    
    return {
      userDataDir: userDataDir || 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: debugPort || '9222'
    }
  } catch (error) {
    console.error('获取Chrome配置失败:', error)
    return {
      userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: '9222'
    }
  }
}

export const saveChromeConfig = async (config: ChromeConfig): Promise<boolean> => {
  try {
    const result1 = await configDal.setConfig(
      'chromeUserDataDir', 
      config.userDataDir, 
      'Chrome浏览器用户数据目录路径'
    )
    const result2 = await configDal.setConfig(
      'chromeDebugPort', 
      config.debugPort, 
      'Chrome远程调试端口'
    )
    return result1 && result2
  } catch (error) {
    console.error('保存Chrome配置失败:', error)
    throw error
  }
}

export const getConfigValue = async (key: string): Promise<string | null> => {
  try {
    return await configDal.getConfig(key)
  } catch (error) {
    console.error(`获取配置项 ${key} 失败:`, error)
    return null
  }
}

export const setConfigValue = async (key: string, value: string, description?: string): Promise<boolean> => {
  try {
    return await configDal.setConfig(key, value, description)
  } catch (error) {
    console.error(`设置配置项 ${key} 失败:`, error)
    throw error
  }
}

export const getAllConfigs = async () => {
  try {
    return await configDal.queryData()
  } catch (error) {
    console.error('获取所有配置失败:', error)
    return []
  }
}