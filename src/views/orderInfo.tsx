import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm, Select, Tag, Typography, Card } from "antd";
import { queryOrderInfoData, addOrderInfoData, updateOrderInfoData, deleteOrderInfoData, updateOrderStatus, fillMissingSkuMapper } from "@/ddl/orderInfo";
import { querySkuMapperData } from "@/ddl/skuMapper";
import BackButton from "@/components/BackButton";
import ImportExcel from "@/components/ImportExcel";
import { OrderStatus, OrderStatusLabel } from "@/type/orderStatus";

const { Title } = Typography;

const OrderInfo: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [form] = Form.useForm();
  const [skuMapperOptions, setSkuMapperOptions] = useState<any[]>([]);
  const [skuMapperDict, setSkuMapperDict] = useState<Record<string, string>>({});

  const fetchData = async () => {
    setLoading(true);
    const res = await queryOrderInfoData({});
    setData(res || []);
    setLoading(false);
  };

  const fetchSkuMapperData = async () => {
    const res = await querySkuMapperData({});
    if (res && res.length > 0) {
      const options = res.map((item: any) => ({
        value: item.id,
        label: item.skuName,
        disabled: item.disabled === 1
      }));
      
      // 创建ID到skuName的映射字典
      const dict: Record<string, string> = {};
      res.forEach((item: any) => {
        dict[item.id] = item.skuName;
      });
      
      setSkuMapperOptions(options);
      setSkuMapperDict(dict);
    }
  };

  useEffect(() => {
    fetchData();
    fetchSkuMapperData();
  }, []);

  const handleAdd = () => {
    setEditRecord(null);
    setModalOpen(true);
    setTimeout(() => {
      form.resetFields();
    }, 0);
  };

  const handleEdit = (record: any) => {
    setEditRecord(record);
    setModalOpen(true);
    setTimeout(() => {
      form.setFieldsValue({
        orderId: record.orderId || "",
        address: record.address || "",
        skuId: record.skuId || "",
        skuMapperId: record.skuMapperId || ""
      });
    }, 0);
  };

  const handleDelete = async (id: string) => {
    await deleteOrderInfoData(id);
    message.success("删除成功");
    fetchData();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editRecord) {
        // 修改时保留原有的状态
        values.status = editRecord.status;
        await updateOrderInfoData(editRecord.id, values);
        message.success("修改成功");
      } else {
        // 新增时不设置状态，由后端使用默认值
        await addOrderInfoData(values);
        message.success("添加成功");
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      // 校验失败
    }
  };

  // 处理Excel导入
  const handleImport = async (newData: any[], updateData: any[]) => {
    if (newData.length === 0 && updateData.length === 0) {
      message.warning('没有可导入的数据');
      return;
    }

    setLoading(true);
    try {
      // 如果 newData 中缺少 skuMapperId，交由 ddl 层填充已有映射
      await fillMissingSkuMapper(newData);
      // 批量添加新数据
      for (const item of newData) {
        await addOrderInfoData(item);
      }
      
      // 批量更新已存在数据
      for (const item of updateData) {
        const { id, ...updateFields } = item;
        await updateOrderInfoData(id, updateFields);
      }
      
      message.success(`导入完成: 新增 ${newData.length} 条，更新 ${updateData.length} 条`);
      fetchData();
    } catch (error) {
      console.error('导入错误:', error);
      message.error('导入过程中发生错误');
    } finally {
      setLoading(false);
    }
  };

  const columnsBase = [
    { title: "ID", dataIndex: "id", key: "id", width: '15%', ellipsis: true },
    { title: "订单号", dataIndex: "orderId", key: "orderId", width: '15%', ellipsis: true },
    { title: "地址", dataIndex: "address", key: "address", width: '25%', ellipsis: true },
    { title: "SKU", dataIndex: "skuId", key: "skuId", width: '15%', ellipsis: true },
    { 
      title: "SKU映射", 
      dataIndex: "skuMapperId", 
      key: "skuMapperId",
      width: '15%',
      ellipsis: true,
      render: (skuMapperId: string) => skuMapperDict[skuMapperId] || skuMapperId
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: '10%',
      render: (status: OrderStatus) => (
        <Tag 
          color={status === OrderStatus.FINISH ? 'green' : 'orange'}
        >
          {OrderStatusLabel[status] || status || OrderStatusLabel[OrderStatus.UNFINISH]}
        </Tag>
      )
    }
  ];

  const columns = [
    ...columnsBase,
    {
      title: "操作",
      key: "action",
      fixed: 'right' as const,
      width: '15%',
      render: (_: any, record: any) => (
        <>
          <Button type="link" onClick={() => handleEdit(record)}>
            修改
          </Button>
          <Popconfirm title="确定删除吗？" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" danger>删除</Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: '0 24px 24px', maxWidth: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
        <BackButton style={{ position: 'absolute', left: 24 }} />
        <Title level={2} style={{ margin: 0, textAlign: 'center',width: '100%' }}>订单信息页面</Title>
      </div>

      <div style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f0f0f0' }}>
        <ImportExcel onImport={handleImport} />
        <Button type="primary" onClick={handleAdd}>
          添加
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={data} 
        loading={loading} 
        rowKey="id" 
        scroll={{ x: 'max-content' }}
        pagination={{ 
          showSizeChanger: true, 
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条数据` 
        }} 
        style={{ width: '100%' }}
      />
      
      <Modal
        title={editRecord ? "修改订单" : "添加订单"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={600}
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="orderId" label="订单号" rules={[{ required: true, message: "请输入订单号" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="地址" rules={[{ required: true, message: "请输入地址" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="skuId" label="SKU" rules={[{ required: true, message: "请输入SKU" }]}>
            <Input />
          </Form.Item>
          <Form.Item 
            name="skuMapperId" 
            label="SKU映射" 
            rules={[{ required: true, message: "请选择SKU映射" }]}
          >
            <Select
              placeholder="请选择SKU映射"
              options={skuMapperOptions}
              optionFilterProp="label"
              showSearch
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default OrderInfo; 