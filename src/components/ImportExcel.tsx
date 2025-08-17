import React, { useState } from 'react';
import { Button, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import * as XLSX from 'xlsx';
import { querySkuMapperData } from '@/ddl/skuMapper';
import { queryOrderInfoBySkuIds } from '@/ddl/orderInfo';

interface ImportExcelProps {
  onImport: (data: any[], updateData: any[]) => void;
}

const ImportExcel: React.FC<ImportExcelProps> = ({ onImport }) => {
  const [loading, setLoading] = useState(false);

  const handleImport = async (file: File) => {
    setLoading(true);
    
    try {
      // 读取Excel文件
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const excelData = XLSX.utils.sheet_to_json(worksheet);
          
          // 获取SKU映射数据
          const skuMapperData = await querySkuMapperData({});
          const skuMapperDict: Record<string, string> = {};
          
          if (skuMapperData && skuMapperData.length > 0) {
            skuMapperData.forEach((item: any) => {
              if (!skuMapperDict[item.sku]) {
                skuMapperDict[item.sku] = item.id;
              }
            });
          }

          // 提取Excel中的所有skuId
          const skuIds = excelData
            .map((row: any) => row['skuId'] || '')
            .filter(skuId => skuId !== '');
          
          // 使用IN查询获取已存在的订单
          const existingOrders = await queryOrderInfoBySkuIds(skuIds);
          const existingOrderMap: Record<string, any> = {};
          
          if (existingOrders && existingOrders.length > 0) {
            existingOrders.forEach((order: any) => {
              if (order.skuId) {
                existingOrderMap[order.skuId] = order;
              }
            });
          }
          
          // 处理Excel数据，映射字段
          const newData: any[] = [];
          const updateData: any[] = [];
          
          excelData.forEach((row: any) => {
            // 查找skuMapperId
            const skuId = row['skuId'] || '';
            // 如果skuId包含小数点，舍弃小数点后面的内容
            const processedSkuId = skuId.toString().includes('.') 
              ? skuId.toString().split('.')[0] 
              : skuId;
            const skuMapperId = skuMapperDict[processedSkuId] || '';
            
            const processedItem = {
              orderId: row['订单编号'] || row['orderId'] || '',
              address: row['收货地址'] || row['address'] || '',
              skuId: processedSkuId,
              skuMapperId: skuMapperId
            };
            
            // 判断是否已存在
            if (processedSkuId && existingOrderMap[processedSkuId]) {
              // 已存在，标记为更新
              const existingOrder = existingOrderMap[processedSkuId];
              updateData.push({
                id: existingOrder.id,
                ...processedItem
              });
            } else {
              // 不存在，标记为新增
              newData.push(processedItem);
            }
          });
          
          onImport(newData, updateData);
          message.success(`成功处理 ${excelData.length} 条数据，新增 ${newData.length} 条，更新 ${updateData.length} 条`);
        } catch (error) {
          console.error('Excel解析错误:', error);
          message.error('Excel解析失败，请检查文件格式');
        } finally {
          setLoading(false);
        }
      };
      
      reader.readAsBinaryString(file);
      return false; // 阻止自动上传
    } catch (error) {
      setLoading(false);
      message.error('导入失败');
      return false;
    }
  };

  const uploadProps: UploadProps = {
    accept: '.xlsx,.xls',
    showUploadList: false,
    beforeUpload: handleImport,
    maxCount: 1,
  };

  return (
    <Upload {...uploadProps}>
      <Button 
        icon={<UploadOutlined />} 
        loading={loading}
      >
        导入Excel
      </Button>
    </Upload>
  );
};

export default ImportExcel; 