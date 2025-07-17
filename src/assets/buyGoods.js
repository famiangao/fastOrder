// const puppeteer = require('puppeteer-core');
// const axios  = require('axios');
// const xlsx = require('node-xlsx').default;
import puppeteer from "puppeteer-core";
import axios from "axios";
import xlsx from "node-xlsx"
(async () => {
  //https://my.oschina.net/xiaominmin/blog/10310884
  let wsKey=await axios.get('http://127.0.0.1:9222/json/version');
  let browser=await puppeteer.connect({
    browserWSEndpoint: wsKey.data.webSocketDebuggerUrl,
    defaultViewport:null,
    args: ['--disable-features=site-per-process'],
  });

  const page = await browser.newPage();
  page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
  });

  //获取pidMap这个excel内的内容
  let pidMapUrl="./src/assets/pidMap.xlsx"
  const pidMapSheets=xlsx.parse(pidMapUrl);
  const pidMapSheet=pidMapSheets[0].data;
  let pidMap={};
  //默认第一个是pid，第二个是url
  for(let i=1;i<pidMapSheet.length;i++){
    //map内的数据是pid:url
    pidMap[pidMapSheet[i][0]]=pidMapSheet[i][1];
  }


  //获取excel内的内容
  let excelUrl="./src/assets/importExcel.xlsx"
  const sheets=xlsx.parse(excelUrl);
  const sheet=sheets[0].data;
  //然后解析每一行数据，获取skuid对应的url链接，利用地址下单
  let tableDataMap={};
  for(let i=0;i<sheet[0].length;i++){
    tableDataMap[sheet[0][i]]=i;
  }


  for(let i=1;i<sheet.length;i++){
    let rowData=sheet[i];
    //处理当前行的数据
    let skuid=rowData[tableDataMap["skuId"]];
    let url=pidMap[skuid];
    if(url){
      //利用url下单
      await page.goto(url);
      await delay();
      //点击立即购买按钮
      await page.click(`*[data-usage$="goBuyClick"]`)
      //对地址进行判定
      let fullAddress=rowData[tableDataMap["收货地址"]]
      let fullAddressArr=fullAddress.split(" ");
      if(fullAddressArr.length==4){
        //如果地址有四段，则认为是淘宝的地址
        let suffix=`[${fullAddressArr[1].split("-")[1]}]`
        let name=fullAddressArr[0]+suffix;
        let phone=fullAddressArr[1].split("-")[0];
        let address=fullAddressArr[2];
        let addressDesc=fullAddressArr[3]+suffix;
        //输入收货人信息
        let addressArr=address.split("/")
        await delay();
        await page.locator("div[class^='addAddress']").click();
        //等待页面出现渲染完成
        //这里要获取ifram元素
        await delay();
        let pageFrame=await page.$("iframe[class^='addrIframe']")
        const frame=await pageFrame.contentFrame();
        if(!frame)return;
        await delay();
        await frame.locator('.cndzk-entrance-division-header-click-input').click();
        //获取对应地址的dom并点击div ::-p-text(Checkout)'
        
        await delay();
        await frame
          .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[0]})`)
          .click();
        
        await delay();
        //点击市信息
        await frame
          .locator(`.cndzk-entrance-division-box-title-level ::-p-text(市)`)
          .click();
        await delay();
        await frame
          .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[1]})`)
          .click();

        //点击区信息
        await delay();
        await frame
          .locator(`.cndzk-entrance-division-box-title-level ::-p-text(区)`)
          .click();
        await delay();
        await frame
          .locator(`.cndzk-entrance-division-box-content-tag ::-p-text(${addressArr[2]})`)
          .click();

          //点击街道信息
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
        await delay(Math.random()*8000);
        await page.locator("div[class^='btn-']").hover();
        await delay();
        // await page.locator("div[class^='btn-']").click();
        console.log("23232323");
        return;
      }else if(fullAddressArr.length==6){
        //如果有六段，则认为是拼多多地址
        let name=fullAddressArr[0];
        let phone=fullAddressArr[1];
        let address=fullAddressArr[2]+fullAddressArr[3]+fullAddressArr[4]+fullAddressArr[5];

      }else{  
        //如果地址有其他格式，则认为是错误的地址
      }
    }else{
      //这个地方要写一些反馈信息
      console.log("未找到对应url");
    }
  }

//   await browser.close();
})();



function delay(time) {
  if(!time){time=Math.random()*4000}
  return new Promise(function(resolve) { 
      setTimeout(resolve, time)
  });
}
