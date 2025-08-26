import path from 'node:path'
import fs from 'node:fs'
import childProcess from "child_process"
import { app } from 'electron'
import { executeBuyGoodsNodeJS } from './buyGoodsNodeJS'

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
    
    writeLog("浏览器启动完成，等待2秒后执行购买函数...");
    
    // 等待浏览器完全启动
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 直接调用函数而不是通过子进程
    writeLog("开始执行购买函数...");
    await executeBuyGoodsNodeJS(writeLog);
    
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