import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import os from 'node:os'
import { exec } from 'child_process'
import { update } from './update'
import { buyGoodsUseExcel } from '../puppeteer/buyGoodsUseExcel'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.mjs   > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.APP_ROOT = path.join(__dirname, '../..')

export const MAIN_DIST = path.join(process.env.APP_ROOT, 'dist-electron')
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
export const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL

process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL
  ? path.join(process.env.APP_ROOT, 'public')
  : RENDERER_DIST

// Disable GPU Acceleration for Windows 7
if (os.release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

let win: BrowserWindow | null = null
const preload = path.join(__dirname, '../preload/index.mjs')
const indexHtml = path.join(RENDERER_DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: path.join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      nodeIntegration: true,

      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      contextIsolation: false,
      // preload,
    },
  })

  if (VITE_DEV_SERVER_URL) { // #298
    win.loadURL(VITE_DEV_SERVER_URL)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
    // 在打包环境中也打开开发者工具，方便调试
    // win.webContents.openDevTools()
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Auto update
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${VITE_DEV_SERVER_URL}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})
ipcMain.handle("toBuyGoods",()=>{
  try{
    buyGoodsUseExcel();
  }catch(e){
    console.log(e);
    
  }
})

// 添加日志相关的 IPC 处理器
ipcMain.handle('get-log-path', () => {
  const userDataPath = app.getPath('userData');
  return path.join(userDataPath, 'buyGoods-log.txt');
});

ipcMain.handle('read-log-file', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
    
    if (fs.existsSync(logFilePath)) {
      return fs.readFileSync(logFilePath, 'utf8');
    } else {
      return '日志文件不存在';
    }
  } catch (error) {
    return `读取日志失败: ${error}`;
  }
});

ipcMain.handle('clear-log-file', async () => {
  try {
    const userDataPath = app.getPath('userData');
    const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
    
    if (fs.existsSync(logFilePath)) {
      fs.writeFileSync(logFilePath, '', 'utf8');
      return '日志清空成功';
    } else {
      return '日志文件不存在';
    }
  } catch (error) {
    return `清空日志失败: ${error}`;
  }
});

ipcMain.handle('open-log-folder', async () => {
  try {
    const userDataPath = app.getPath('userData');
    shell.openPath(userDataPath);
    return '文件夹打开成功';
  } catch (error) {
    return `打开文件夹失败: ${error}`;
  }
});

// 打开淘宝登录页面
ipcMain.handle('open-taobao-login', async () => {
  try {
    const configPath = path.join(app.getPath('userData'), 'chrome-config.json');
    let chromeConfig = {
      userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: '9222'
    };
    
    if (fs.existsSync(configPath)) {
      try {
        chromeConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      } catch (error) {
        console.error('读取Chrome配置失败，使用默认配置:', error);
      }
    }
    
    // 先尝试关闭已有的Chrome进程
    await new Promise<void>((resolve) => {
      exec('taskkill /F /IM "chrome.exe"', (error: any) => {
        // 无论是否成功都继续执行
        resolve();
      });
    });
    
    // 等待一下确保进程已关闭
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 打开Chrome并跳转到淘宝登录页
    const chromeCommand = `start chrome --remote-debugging-port=${chromeConfig.debugPort} --user-data-dir="${chromeConfig.userDataDir}" "https://login.taobao.com/havanaone/login/login.htm"`;
    
    return new Promise((resolve, reject) => {
      exec(chromeCommand, (error: any, stdout: any, stderr: any) => {
        if (error) {
          console.error('打开淘宝登录页失败:', error);
          reject({ success: false, error: error.message });
        } else {
          console.log('淘宝登录页已打开');
          resolve({ success: true });
        }
      });
    });
  } catch (error: any) {
    console.error('打开淘宝登录页失败:', error);
    return { success: false, error: error?.message || '未知错误' };
  }
});

// Chrome配置相关的IPC处理器
ipcMain.handle('get-chrome-config', async () => {
  try {
    // 从文件读取配置，如果不存在则返回默认值
    const configPath = path.join(app.getPath('userData'), 'chrome-config.json');
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return config;
    }
    return {
      userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: '9222'
    };
  } catch (error) {
    console.error('获取Chrome配置失败:', error);
    return {
      userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: '9222'
    };
  }
});

ipcMain.handle('set-chrome-config', async (_, config) => {
  try {
    const configPath = path.join(app.getPath('userData'), 'chrome-config.json');
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2), 'utf8');
    return { success: true };
  } catch (error: any) {
    console.error('保存Chrome配置失败:', error);
    return { success: false, error: error?.message || '未知错误' };
  }
});
