import puppeteer from "puppeteer-core";
import axios from "axios";
import { queryOrdersByStatus, updateOrderStatus } from "@/ddl/orderInfo";
import { querySkuMapperData } from "@/ddl/skuMapper";
import { OrderStatus } from "@/type/orderStatus";

async function executeBuyGoods(): Promise<void> {
  console.log("开始执行自动购买任务...");
  
  try {
    // 连接到Chrome浏览器
    // https://my.oschina.net/xiaominmin/blog/10310884
    let wsKey = await axios.get('http://127.0.0.1:9222/json/version');
    let browser = await puppeteer.connect({
      browserWSEndpoint: wsKey.data.webSocketDebuggerUrl,
      defaultViewport: null
    });

    const page = await browser.newPage();
    page.evaluateOnNewDocument(() => {
      const newProto = (navigator as any).__proto__;
      delete newProto.webdriver;
      (navigator as any).__proto__ = newProto;
    });

    // 1. 查询所有状态为unfinish的订单数据
    const unfinishedOrders = await queryOrdersByStatus(OrderStatus.UNFINISH);
    console.log(`找到 ${unfinishedOrders.length} 个未执行的订单`);

    if (unfinishedOrders.length === 0) {
      console.log("没有需要执行的订单，结束任务");
      await browser.close();
      return;
    }

    // 2. 获取所有需要的skuMapperId
    const skuMapperIds = [...new Set(unfinishedOrders.map(order => order.skuMapperId).filter(Boolean))];
    
    // 3. 查询对应的skuMapper数据
    const allSkuMappers = await querySkuMapperData({});
    const skuMapperMap = new Map();
    allSkuMappers.forEach((mapper: any) => {
      if (skuMapperIds.includes(mapper.id) && !mapper.disabled) {
        skuMapperMap.set(mapper.id, mapper);
      }
    });

    console.log(`找到 ${skuMapperMap.size} 个有效的SKU映射`);

    // 4. 处理每个订单
    for (let i = 0; i < unfinishedOrders.length; i++) {
      const orderData = unfinishedOrders[i];
      console.log(`正在处理订单 ${i + 1}/${unfinishedOrders.length}: ${orderData.id}`);

      // 获取对应的skuMapper
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

        // 点击立即购买按钮
        await page.click(`*[data-usage$="goBuyClick"]`);

        // 对地址进行判定
        let fullAddress = orderData.address;
        if (!fullAddress) {
          console.log(`订单 ${orderData.id} 没有收货地址，跳过`);
          continue;
        }

        let fullAddressArr = fullAddress.split(" ");
        
        if (fullAddressArr.length == 4) {
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

          // 等待页面出现渲染完成
          // 这里要获取iframe元素
          await delay();
          let pageFrame = await page.$("iframe[class^='addrIframe']");
          if (!pageFrame) {
            console.log(`订单 ${orderData.id} 找不到地址iframe，跳过`);
            continue;
          }
          const frame = await pageFrame.contentFrame();
          if (!frame) {
            console.log(`订单 ${orderData.id} 找不到地址iframe内容，跳过`);
            continue;
          }

          await delay();
          await frame.locator('.cndzk-entrance-division-header-click-input').click();

          // 获取对应地址的dom并点击
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[0]})`)
            .click();

          await delay();
          // 点击市信息
          await frame
            .locator(`.cndzk-entrance-division-box-title-level ::-p-text(市)`)
            .click();
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[1]})`)
            .click();

          // 点击区信息
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-title-level ::-p-text(区)`)
            .click();
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[2]})`)
            .click();

          // 点击街道信息
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-title-level ::-p-text(街道)`)
            .click();
          await delay();
          await frame
            .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[3]})`)
            .click();

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

          // 成功完成订单，更新状态为已完成
          await updateOrderStatus(orderData.id, OrderStatus.FINISH);
          console.log(`订单 ${orderData.id} 执行成功，状态已更新为已完成`);

        } else if (fullAddressArr.length == 6) {
          // 如果有六段，则认为是拼多多地址
          let name = fullAddressArr[0];
          let phone = fullAddressArr[1];
          let address = fullAddressArr[2] + fullAddressArr[3] + fullAddressArr[4] + fullAddressArr[5];
          
          // TODO: 实现拼多多地址处理逻辑
          console.log(`订单 ${orderData.id} 是拼多多地址格式，暂未实现处理逻辑`);

        } else {
          // 如果地址有其他格式，则认为是错误的地址
          console.log(`订单 ${orderData.id} 地址格式不正确，跳过`);
        }

      } catch (error) {
        console.error(`处理订单 ${orderData.id} 时发生错误:`, error);
        continue;
      }

      // 添加订单间的延迟
      await delay(Math.random() * 5000 + 2000);
    }

    console.log("所有订单处理完成");
    // await browser.close();

  } catch (error) {
    console.error("执行自动购买任务时发生错误:", error);
  }
}

function delay(time?: number): Promise<void> {
  if (!time) { time = Math.random() * 4000; }
  return new Promise(function(resolve) { 
    setTimeout(resolve, time);
  });
}

// 导出主函数
export { executeBuyGoods };

// 如果直接运行此文件，则执行自动购买任务
if (require.main === module) {
  executeBuyGoods().catch(console.error);
}
