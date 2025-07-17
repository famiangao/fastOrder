import path from 'node:path'
import childProcess from "child_process"

async function buyGoodsUseExcel(){
  //https://my.oschina.net/xiaominmin/blog/10310884
  //先打开对应浏览器
  openChome();
  //执行对应脚本
  await new Promise((res,rej)=>{
    childProcess.exec(`node ${path.join(process.cwd(), './src/assets/buyGoods.js')}`, (error, stdout, stderr) => {
      if (!error) {
          // 成功
          res("");
      } else {
        console.log(error);
        
          // 失败
          rej(error.cause)
      }
  })
})
};


async function openChome(){
    //清理之前的谷歌进程
    await new Promise((res,rej)=>{
      childProcess.exec('taskkill /F /IM "chrome.exe"', (error, stdout, stderr) => {
            if (!error) {
                // 成功
                res("");
            } else {
                // 失败
                rej(error.cause)
            }
        })
    })
    //创建新谷歌进程
    await new Promise((res,rej)=>{
      childProcess.exec('start chrome --remote-debugging-port=9222', (error, stdout, stderr) => {
            if (!error) {
                // 成功
                res("");
            } else {
                // 失败
                rej(error.cause)
            }
        })
    })
}

export {buyGoodsUseExcel}