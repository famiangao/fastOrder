import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, message, Popconfirm, Switch, Typography, Card } from "antd";
import { querySkuMapperData, addSkuMapperData, updateSkuMapperData, deleteSkuMapperData } from "@/ddl/skuMapper";
import BackButton from "@/components/BackButton";

const { Title } = Typography;

const columnsBase = [
  { title: "ID", dataIndex: "id", key: "id", width: '15%', ellipsis: true },
  { title: "SKU", dataIndex: "sku", key: "sku", width: '15%', ellipsis: true },
  { title: "SKU名称", dataIndex: "skuName", key: "skuName", width: '15%', ellipsis: true },
  { title: "URL", dataIndex: "url", key: "url", width: '30%', ellipsis: true },
  { 
    title: "状态", 
    dataIndex: "disabled", 
    key: "disabled",
    width: '10%',
    render: (disabled: number) => (
      <span>{disabled === 0 ? '启用' : '禁用'}</span>
    )
  },
];

const SkuMapper: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    const res = await querySkuMapperData({});
    setData(res || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
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
        sku: record.sku || "",
        url: record.url || "",
        skuName: record.skuName || "",
        disabled: record.disabled === 1
      });
    }, 0);
  };

  const handleDelete = async (id: string) => {
    await deleteSkuMapperData(id);
    message.success("删除成功");
    fetchData();
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 将Switch的boolean值转换为数字
      values.disabled = values.disabled ? 1 : 0;
      
      if (editRecord) {
        // 修改
        await updateSkuMapperData(editRecord.id, values);
        message.success("修改成功");
      } else {
        // 新增
        await addSkuMapperData(values);
        message.success("添加成功");
      }
      setModalOpen(false);
      fetchData();
    } catch (e) {
      // 校验失败
    }
  };

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
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 16 }}>
        <BackButton style={{ marginRight: 16 }} />
        <Title level={2} style={{ margin: 0,textAlign: 'center',width: '100%' }}>SKU映射页面</Title>
      </div>

      <div style={{ padding: '16px', display: 'flex', justifyContent: 'flex-end', borderBottom: '1px solid #f0f0f0' }}>
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
        title={editRecord ? "修改SKU映射" : "添加SKU映射"}
        open={modalOpen}
        onOk={handleOk}
        onCancel={() => setModalOpen(false)}
        width={600}
        maskClosable={false}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="sku"
            label="SKU"
            rules={[{ required: true, message: "请输入SKU" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="skuName"
            label="SKU名称"
            rules={[{ required: true, message: "请输入SKU名称" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "请输入URL" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="disabled"
            label="禁用状态"
            valuePropName="checked"
          >
            <Switch checkedChildren="禁用" unCheckedChildren="启用" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SkuMapper; 