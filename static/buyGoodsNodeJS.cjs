// Node.js兼容版本的buyGoods，用于在Electron主进程中执行
const puppeteer = require("puppeteer-core");
const axios = require("axios");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const fs = require("fs");

console.log("=================== 脚本启动 ===================");
console.log("当前时间:", new Date().toLocaleString());
console.log("工作目录:", process.cwd());
console.log("Node版本:", process.version);
console.log("是否在Electron环境:", typeof process !== 'undefined' && process.versions && process.versions.electron);
if (process.versions) {
  console.log("Process versions:", process.versions);
}
console.log("===============================================");

// 订单状态常量
const OrderStatus = {
  FINISH: 'finish',
  UNFINISH: 'unfinish'
};

// 智能获取数据库路径
function getDatabasePath() {
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
      // 在打包环境中，static 文件夹在 extraResources 中（process.resourcesPath）
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
    console.error('获取数据库路径失败:', e);
    // 降级到开发环境路径
    return path.join(process.cwd(), 'static', 'fastOrder.db');
  }
}

const DB_PATH = getDatabasePath();

// 直接的数据库操作函数
function connectDatabase() {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error(`数据库连接失败: ${err.message}`);
        reject(err);
      } else {
        console.log('数据库连接成功');
        resolve(db);
      }
    });
  });
}

// 查询未完成的订单
function queryUnfinishedOrders(db) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT id, orderId, address, skuId, skuMapperId, status FROM orderInfo WHERE status = ?`;
    db.all(sql, [OrderStatus.UNFINISH], (err, rows) => {
      if (err) {
        console.error(`查询订单失败: ${err.message}`);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// 查询SKU映射数据
function querySkuMappers(db, skuMapperIds) {
  return new Promise((resolve, reject) => {
    if (!skuMapperIds || skuMapperIds.length === 0) {
      resolve([]);
      return;
    }
    
    const placeholders = skuMapperIds.map(() => '?').join(',');
    console.log(placeholders,skuMapperIds,"sds");
    
    const sql = `SELECT id, sku, url, disabled, skuName FROM skuMapper WHERE id IN (${placeholders}) AND disabled = 0`;
    console.log(sql, skuMapperIds, "SQL查询语句");
    
    db.all(sql, skuMapperIds, (err, rows) => {
      if (err) {
        console.error(`查询SKU映射失败: ${err.message}`);
        reject(err);
      } else {
        resolve(rows || []);
      }
    });
  });
}

// 更新订单状态
function updateOrderStatus(db, orderId, status) {
  return new Promise((resolve, reject) => {
    const sql = `UPDATE orderInfo SET status = ? WHERE id = ?`;
    db.run(sql, [status, orderId], function(err) {
      if (err) {
        console.error(`更新订单状态失败: ${err.message}`);
        reject(err);
      } else {
        resolve(this.changes);
      }
    });
  });
}

async function executeBuyGoodsNodeJS() {
  // safeLog("开始执行自动购买任务(Node.js版本)...");
  
  let db = null;
  let browser = null;
  try {
    // 连接数据库
    db = await connectDatabase();

    // 连接到Chrome浏览器
    let wsKey = await axios.get('http://127.0.0.1:9222/json/version');
    browser = await puppeteer.connect({
      browserWSEndpoint: wsKey.data.webSocketDebuggerUrl,
      defaultViewport: null
    });

    const page = await browser.newPage();
    await page.evaluateOnNewDocument(() => {
      const newProto = navigator.__proto__;
      delete newProto.webdriver;
      navigator.__proto__ = newProto;
    });

    // 1. 查询所有状态为unfinish的订单数据
    const unfinishedOrders = await queryUnfinishedOrders(db);
    console.log(`找到 ${unfinishedOrders.length} 个未执行的订单`);

    if (unfinishedOrders.length === 0) {
      console.log("没有需要执行的订单，结束任务");
      await browser.close();
      return;
    }
    // 2. 获取所有需要的skuMapperId
    const skuMapperIds = [...new Set(unfinishedOrders.map(order => order.skuMapperId).filter(Boolean))];
    console.log(skuMapperIds);
    
    // 3. 查询对应的skuMapper数据
    const allSkuMappers = await querySkuMappers(db, skuMapperIds);
    const skuMapperMap = new Map();
    allSkuMappers.forEach((mapper) => {
      skuMapperMap.set(mapper.id, mapper);
    });

    console.log(`找到 ${skuMapperMap.size} 个有效的SKU映射`);

    // 4. 处理每个订单
    for (let i = 0; i < unfinishedOrders.length; i++) {
      const orderData = unfinishedOrders[i];
      console.log(`正在处理订单 ${i + 1}/${unfinishedOrders.length}: ${orderData.id}`);

      // 获取对应的skuMapper
      console.log(skuMapperMap);
      const skuMapper = skuMapperMap.get(orderData.skuMapperId);
      if (!skuMapper) {
        console.log(`订单 ${orderData.id} 找不到对应的SKU映射，跳过`);
        continue;
      }

      const url = skuMapper.url;
      if (!url) {
        console.log(`订单 ${orderData.id} 的SKU映射没有URL，跳过`);
        continue;
      }

      try {
        // 利用URL下单
        console.log(`访问URL: ${url}`);
        await page.goto(url);
        await delay();

        // 点击立即购买按钮 - 使用稳定的选择器（不依赖随机CSS类名）
        try {
          // 方法1：通过CSS类名前缀匹配（最稳定）
          await page.click('span[class*="title--"]:has-text("立即购买")');
        } catch (textError) {
          try {
            // 方法2：通过父级容器的类名前缀匹配
            await page.click('div[class*="btnItem--"]:has(span:text("立即购买"))');
          } catch (parentError) {
            try {
              // 方法3：通用文本选择器
              await page.click(':text("立即购买")');
            } catch (generalError) {
              try {
                // 方法4：通过样式特征选择（橙色渐变背景的按钮）
                await page.click('div[style*="rgb(255, 119, 0)"]');
              } catch (styleError) {
                try {
                  // 方法5：通过外层容器类名匹配
                  await page.click('div[class*="EmphasizeButtonList--"] div[class*="btnItem--"]:nth-child(2)');
                } catch (containerError) {
                  // 方法6：回退到原来的选择器
                  await page.click(`*[data-usage$="goBuyClick"]`);
                }
              }
            }
          }
        }

        // 对地址进行判定
        let fullAddress = orderData.address;
        if (!fullAddress) {
          console.log(`订单 ${orderData.id} 没有收货地址，跳过`);
          continue;
        }

        let fullAddressArr = fullAddress.split(" ");
        
        if (fullAddressArr.length == 4) {
          // 淘宝地址处理逻辑
          await handleTaobaoAddress(page, orderData, fullAddressArr);
          
          // 成功完成订单，更新状态为已完成
          await updateOrderStatus(db, orderData.id, OrderStatus.FINISH);
          console.log(`订单 ${orderData.id} 执行成功，状态已更新为已完成`);

        } else if (fullAddressArr.length == 6) {
          // 拼多多地址处理逻辑
          console.log(`订单 ${orderData.id} 是拼多多地址格式，暂未实现处理逻辑`);

        } else {
          console.log(`订单 ${orderData.id} 地址格式不正确，跳过`);
        }

      } catch (error) {
        console.error(`处理订单 ${orderData.id} 时发生错误: ${error.message}`);
        continue;
      }

      // 添加订单间的延迟
      await delay(Math.random() * 5000 + 2000);
    }

    // 关闭页面
    await page.close();
    console.log("页面已关闭");

    console.log("所有订单处理完成");

  } catch (error) {
    console.error(`执行自动购买任务时发生错误: ${error.message}`);
    throw error;
  } finally {
    // 关闭数据库连接
    if (db) {
      db.close();
    }
    // 关闭浏览器连接
    if (browser) {
      await browser.disconnect();
      console.log("浏览器连接已断开");
    }
  }
}

async function handleTaobaoAddress(page, orderData, fullAddressArr) {
  // 如果地址有四段，则认为是淘宝的地址
  let suffix = `[${fullAddressArr[1].split("-")[1]}]`;
  let name = fullAddressArr[0] + suffix;
  let phone = fullAddressArr[1].split("-")[0];
  let address = fullAddressArr[2];
  let addressDesc = fullAddressArr[3] + suffix;

  // 输入收货人信息
  let addressArr = address.split("/");
  await delay();
  await page.locator("div[class^='addAddress']").click();

  await delay();
  let pageFrame = await page.$("iframe[class^='addrIframe']");
  if (!pageFrame) {
    console.log(`订单 ${orderData.id} 找不到地址iframe，跳过`);
    return;
  }
  const frame = await pageFrame.contentFrame();
  if (!frame) {
    console.log(`订单 ${orderData.id} 找不到地址iframe内容，跳过`);
    return;
  }

  await delay();
  await frame.locator('.cndzk-entrance-division-header-click-input').click();

  await delay();
  await frame.locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[0]})`).click();

  await delay();
  await frame.locator(`.cndzk-entrance-division-box-title-level ::-p-text(市)`).click();
  await delay();
  await frame.locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[1]})`).click();

  await delay();
  await frame.locator(`.cndzk-entrance-division-box-title-level ::-p-text(区)`).click();
  await delay();
  await frame.locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[2]})`).click();

  await delay();
  await frame.locator(`.cndzk-entrance-division-box-title-level ::-p-text(街道)`).click();
  await delay();
  await frame.locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[3]})`).click();

  await delay();
  await delay();
  await frame.locator(".cndzk-entrance-associate-area-textarea").fill(addressDesc);
  await delay();
  await frame.locator("#fullName").fill(name);
  await delay();
  await frame.locator("#mobile").fill(phone);
  await delay();
  await frame.locator(".next-btn-primary ::-p-text(保存)").click();
  await delay(Math.random() * 8000);
  await page.locator("div[class^='btn-']").hover();
  await delay();
  // await page.locator("div[class^='btn-']").click();
}

function delay(time) {
  if (!time) { time = Math.random() * 4000; }
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}

// 导出主函数 - 使用CommonJS语法
module.exports = { executeBuyGoodsNodeJS };

// 如果直接运行此文件，则执行自动购买任务
if (require.main === module) {
  console.log("sdsd");
  
  executeBuyGoodsNodeJS().catch((error) => {
    console.error(`执行失败: ${error.message}`);
    process.exit(1);
  });
}