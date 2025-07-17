import { useState } from 'react'
import './App.css'
import { Button } from 'antd';
import path from 'node:path'
import { ipcRenderer } from 'electron';

function App() {
  const [count, setCount] = useState(0)
  const processCwd=process.cwd();
  const pidMapExcel=path.join(processCwd,"./src/assets/pidMap.xlsx")
  const importExcel=path.join(processCwd,"./src/assets/importExcel.xlsx")
  const handleRun=async()=>{
    //执行对应的脚本
    // await buyGoodsUseExcel();
    await ipcRenderer.invoke('toBuyGoods');
  }
  return (
    <div className='App'>
      对照Excel：{pidMapExcel}
      商品Excel:{importExcel}
      <Button onClick={handleRun}>执行</Button>
    </div>
  )
}

export default App