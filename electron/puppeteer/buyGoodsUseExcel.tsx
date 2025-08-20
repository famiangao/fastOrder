import path from 'node:path'
import fs from 'node:fs'
import childProcess from "child_process"
import { app } from 'electron'

async function buyGoodsUseExcel(){
  try {
    console.log("开始执行自动购买任务...");
    
    // 创建日志文件路径
    const userDataPath = app.getPath('userData');
    const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
    
    // 创建日志写入函数
    const writeLog = (message: string) => {
      const timestamp = new Date().toLocaleString();
      const logEntry = `[${timestamp}] ${message}\n`;
      console.log(message); // 同时输出到控制台
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
    };
    
    writeLog("开始执行自动购买任务...");
    
    //https://my.oschina.net/xiaominmin/blog/10310884
    //先打开对应浏览器
    await openChrome();
    
    writeLog("浏览器启动完成，等待2秒后执行脚本...");
    
    // 等待浏览器完全启动
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 使用子进程执行Node.js脚本，避免模块系统冲突
    await new Promise((resolve, reject) => {
      // 智能路径检测
      let scriptPath: string;
      
      if (app.isPackaged) {
        // 打包环境：脚本在 extraResources 中
        const resourcesPath = process.resourcesPath;
        scriptPath = path.join(resourcesPath, 'static', 'buyGoodsNodeJS.cjs');
        writeLog(`打包环境 - resources路径: ${resourcesPath}`);
        writeLog(`打包环境 - 脚本路径: ${scriptPath}`);
      } else {
        // 开发环境：脚本在项目 static 目录中
        const appPath = app.getAppPath();
        scriptPath = path.join(appPath, 'static', 'buyGoodsNodeJS.cjs');
        writeLog(`开发环境 - app路径: ${appPath}`);
        writeLog(`开发环境 - 脚本路径: ${scriptPath}`);
      }
      
      // 检查文件是否存在
      if (!fs.existsSync(scriptPath)) {
        writeLog(`脚本文件不存在: ${scriptPath}`);
        reject(new Error(`脚本文件不存在: ${scriptPath}`));
        return;
      }
      
      writeLog(`开始执行脚本: ${scriptPath}`);
      
      // 使用 spawn 而不是 exec，以便实时获取输出
      const spawn = childProcess.spawn('node', [scriptPath], {
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      // 实时输出 stdout
      spawn.stdout.on('data', (data: Buffer) => {
        const output = data.toString('utf8');
        writeLog(`[子进程输出]: ${output.trim()}`);
      });
      
      // 实时输出 stderr
      spawn.stderr.on('data', (data: Buffer) => {
        const output = data.toString('utf8');
        writeLog(`[子进程错误]: ${output.trim()}`);
      });
      
      // 监听进程退出
      spawn.on('close', (code: number | null) => {
        writeLog(`子进程退出，退出码: ${code}`);
        if (code === 0) {
          writeLog("自动购买任务执行完成");
          resolve("");
        } else {
          reject(new Error(`子进程退出异常，退出码: ${code}`));
        }
      });
      
      // 监听进程错误
      spawn.on('error', (error: Error) => {
        writeLog(`子进程启动失败: ${error.message}`);
        reject(error);
      });
      
      // 添加超时处理（5分钟）
      setTimeout(() => {
        if (!spawn.killed) {
          writeLog('子进程执行超时，正在终止...');
          spawn.kill();
          reject(new Error('执行超时'));
        }
      }, 5 * 60 * 1000);
    });
    
    writeLog("自动购买任务全部完成");
    writeLog(`日志文件位置: ${logFilePath}`);
  } catch (error) {
    const userDataPath = app.getPath('userData');
    const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
    const writeLog = (message: string) => {
      const timestamp = new Date().toLocaleString();
      const logEntry = `[${timestamp}] ${message}\n`;
      console.log(message);
      fs.appendFileSync(logFilePath, logEntry, 'utf8');
    };
    writeLog(`执行购买脚本失败: ${error}`);
    throw error;
  }
};


async function openChrome(){
    try {
      // 获取日志函数
      const userDataPath = app.getPath('userData');
      const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
      const writeLog = (message: string) => {
        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] ${message}\n`;
        console.log(message);
        fs.appendFileSync(logFilePath, logEntry, 'utf8');
      };
      
      // 读取Chrome配置
      const configPath = path.join(app.getPath('userData'), 'chrome-config.json');
      let chromeConfig = {
        userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
        debugPort: '9222'
      };
      
      if (fs.existsSync(configPath)) {
        try {
          chromeConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
          writeLog(`使用自定义Chrome配置: ${JSON.stringify(chromeConfig)}`);
        } catch (error) {
          writeLog(`读取Chrome配置失败，使用默认配置: ${error}`);
        }
      } else {
        writeLog('Chrome配置文件不存在，使用默认配置');
      }
      
      //清理之前的谷歌进程
      await new Promise((res, rej) => {
        childProcess.exec('taskkill /F /IM "chrome.exe"', (error, stdout, stderr) => {
          if (!error) {
            writeLog("Chrome进程清理成功");
            res("");
          } else {
            // Chrome 没有运行也算正常情况，不需要抛出错误
            writeLog(`Chrome 进程不存在或清理失败，继续执行: ${error.message}`);
            res(""); // 改为 resolve 而不是 reject
          }
        });
      });

      //创建新谷歌进程
      await new Promise((res, rej) => {
        const chromeCommand = `start chrome --remote-debugging-port=${chromeConfig.debugPort} --user-data-dir="${chromeConfig.userDataDir}"`;
        writeLog(`执行Chrome启动命令: ${chromeCommand}`);
        childProcess.exec(chromeCommand, (error, stdout, stderr) => {
          if (!error) {
            writeLog("Chrome 浏览器启动成功");
            res("");
          } else {
            writeLog(`Chrome 浏览器启动失败: ${error.message}`);
            rej(error);
          }
        });
      });
    } catch (error) {
      const userDataPath = app.getPath('userData');
      const logFilePath = path.join(userDataPath, 'buyGoods-log.txt');
      const writeLog = (message: string) => {
        const timestamp = new Date().toLocaleString();
        const logEntry = `[${timestamp}] ${message}\n`;
        console.log(message);
        fs.appendFileSync(logFilePath, logEntry, 'utf8');
      };
      writeLog(`openChrome 函数执行失败: ${error}`);
      throw error;
    }
}

export {buyGoodsUseExcel}