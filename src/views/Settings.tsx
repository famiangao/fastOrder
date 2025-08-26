import React, { useState, useEffect } from 'react';
import { Form, Input, Button, message, Card, Space, Divider } from 'antd';
import { FolderOpenOutlined, SaveOutlined, ReloadOutlined, LeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.require('electron');

interface ChromeConfig {
  userDataDir: string;
  debugPort: string;
}

const Settings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // 加载配置
  const loadConfig = async () => {
    try {
      const config = await ipcRenderer.invoke('get-chrome-config');
      form.setFieldsValue(config);
    } catch (error) {
      message.error('加载配置失败');
      console.error(error);
    }
  };

  useEffect(() => {
    loadConfig();
  }, []);

  // 保存配置
  const handleSave = async (values: ChromeConfig) => {
    setLoading(true);
    try {
      const result = await ipcRenderer.invoke('set-chrome-config', values);
      if (result.success) {
        message.success('配置保存成功');
      } else {
        message.error(`保存失败: ${result.error}`);
      }
    } catch (error) {
      message.error('保存配置失败');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // 重置为默认值
  const handleReset = () => {
    form.setFieldsValue({
      userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
      debugPort: '9222'
    });
  };

  // 选择文件夹
  const selectFolder = async () => {
    try {
      const { dialog } = window.require('@electron/remote');
      const result = await dialog.showOpenDialog({
        properties: ['openDirectory'],
        title: '选择Chrome用户数据目录'
      });
      
      if (!result.canceled && result.filePaths.length > 0) {
        form.setFieldValue('userDataDir', result.filePaths[0]);
      }
    } catch (error) {
      // 如果 @electron/remote 不可用，提示用户手动输入
      message.info('请手动输入文件夹路径');
    }
  };

  return (
    <div style={{ padding: '20px', position: 'relative' }}>
      <Button
        type="default"
        icon={<LeftOutlined />}
        style={{ position: 'absolute', left: 20, top: 30, zIndex: 10 }}
        onClick={() => navigate(-1)}
      >
        返回
      </Button>
      <Card title="Chrome 浏览器配置" style={{ maxWidth: 800, margin: '0 auto' }}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          initialValues={{
            userDataDir: 'D:\\SOFTWARE\\chrome\\ChromeDebug',
            debugPort: '9222'
          }}
        >
          <Form.Item
            label="Chrome 用户数据目录"
            name="userDataDir"
            rules={[{ required: true, message: '请输入Chrome用户数据目录路径' }]}
            extra="Chrome浏览器将使用此目录存储用户数据，确保路径存在且有写入权限"
          >
            <Input
              placeholder="例如: D:\SOFTWARE\chrome\ChromeDebug"
              suffix={
                <FolderOpenOutlined 
                  onClick={selectFolder}
                  style={{ cursor: 'pointer', color: '#1890ff' }}
                  title="选择文件夹"
                />
              }
            />
          </Form.Item>

          <Form.Item
            label="调试端口"
            name="debugPort"
            rules={[
              { required: true, message: '请输入调试端口' },
              { pattern: /^\d+$/, message: '端口必须是数字' },
              {
                validator: (_, value) => {
                  const port = parseInt(value);
                  if (port < 1024 || port > 65535) {
                    return Promise.reject('端口范围必须在1024-65535之间');
                  }
                  return Promise.resolve();
                }
              }
            ]}
            extra="Chrome远程调试端口，默认为9222"
          >
            <Input placeholder="例如: 9222" />
          </Form.Item>

          <Divider />

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                icon={<SaveOutlined />}
              >
                保存配置
              </Button>
              <Button
                onClick={handleReset}
                icon={<ReloadOutlined />}
              >
                恢复默认
              </Button>
              <Button onClick={loadConfig}>
                刷新配置
              </Button>
            </Space>
          </Form.Item>
        </Form>

        <Card type="inner" title="使用说明" style={{ marginTop: 20 }}>
          <ol>
            <li>用户数据目录：Chrome浏览器的用户配置文件存储位置，建议使用独立的目录</li>
            <li>调试端口：用于Puppeteer连接Chrome的端口，确保端口未被占用</li>
            <li>如果路径包含空格，系统会自动处理</li>
          </ol>
        </Card>
      </Card>
    </div>
  );
};

export default Settings;