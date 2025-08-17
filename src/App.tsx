import { useState } from 'react'
import './App.css'
import { Button, Space, Typography, Card } from 'antd';
import path from 'node:path'
import { ipcRenderer } from 'electron';
import { BrowserRouter, HashRouter, Routes, Route, useNavigate } from 'react-router-dom';
import OrderInfo from '@/views/orderInfo';
import SkuMapper from '@/views/skuMapper';
import LogViewer from '@/components/LogViewer';

const { Title } = Typography;

function Home() {
  const [count, setCount] = useState(0)
  const processCwd=process.cwd();
  const pidMapExcel=path.join(processCwd,"./src/assets/pidMap.xlsx")
  const importExcel=path.join(processCwd,"./src/assets/importExcel.xlsx")
  const handleRun=async()=>{
    //执行对应的脚本
    // await buyGoodsUseExcel();
    await ipcRenderer.invoke('toBuyGoods');
  }
  const navigate = useNavigate();
  return (
    <div className='App'>
      <Title level={2} style={{ margin: '20px 0', textAlign: 'center' }}>淘宝代拍助手</Title>
      
      <Card style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          {/* <div>
            <p>对照Excel：{pidMapExcel}</p>
            <p>商品Excel: {importExcel}</p>
          </div>
           */}
          <Space size="middle" wrap style={{ justifyContent: 'center', width: '100%' }}>
            <Button 
              onClick={handleRun} 
              type="primary" 
              size="large"
              style={{ 
                background: '#ff6b35', 
                borderColor: '#ff6b35',
                fontWeight: 'bold'
              }}
            >
              一键下单
            </Button>
            <Button onClick={()=>navigate('/orderInfo')} type="default">订单信息</Button>
            <Button onClick={()=>navigate('/skuMapper')} type="default">SKU映射</Button>
            <Button onClick={()=>navigate('/logs')} type="default">查看日志</Button>
            {/* <Button 
              onClick={()=>navigate('/buyGoods')} 
              type="primary" 
              style={{ background: '#52c41a', borderColor: '#52c41a' }}
            >
              自动下单系统
            </Button> */}
          </Space>
        </Space>
      </Card>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/orderInfo" element={<OrderInfo />} />
        <Route path="/skuMapper" element={<SkuMapper />} />
        <Route path="/logs" element={<LogViewer />} />
        {/* <Route path="/buyGoods" element={<BuyGoodsUseExcel />} /> */}
      </Routes>
    </HashRouter>
  );
}

export default App