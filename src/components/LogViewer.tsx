import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ipcRenderer } from 'electron';

const LogViewer: React.FC = () => {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [logPath, setLogPath] = useState<string>('');

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      // 获取日志路径
      const path = await ipcRenderer.invoke('get-log-path');
      setLogPath(path);
      
      // 读取日志内容
      const logContent = await ipcRenderer.invoke('read-log-file');
      setLogs(logContent);
    } catch (error) {
      setLogs(`读取日志失败: ${error}`);
    }
    setIsLoading(false);
  };

  const clearLogs = async () => {
    try {
      const result = await ipcRenderer.invoke('clear-log-file');
      console.log(result);
      setLogs('');
    } catch (error) {
      console.error('清除日志失败:', error);
    }
  };

  const openLogFolder = async () => {
    try {
      const result = await ipcRenderer.invoke('open-log-folder');
      console.log(result);
    } catch (error) {
      console.error('打开文件夹失败:', error);
    }
  };

  useEffect(() => {
    loadLogs();
    // 每5秒自动刷新日志
    const interval = setInterval(loadLogs, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4">
      <div className="mb-4">
        <div className="flex items-center mb-4">
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center gap-2 mr-4"
          >
            ← 返回主页
          </button>
          <h2 className="text-xl font-bold">自动购买任务日志</h2>
        </div>
        <div className="flex gap-2 mb-2">
          <button
            onClick={loadLogs}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isLoading ? '加载中...' : '刷新日志'}
          </button>
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            清除日志
          </button>
          <button
            onClick={openLogFolder}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            打开日志文件夹
          </button>
        </div>
        {logPath && (
          <p className="text-sm text-gray-600">
            日志文件位置: {logPath}
          </p>
        )}
      </div>
      
      <div className="border border-gray-300 rounded">
        <div className="bg-gray-100 px-3 py-2 border-b">
          <span className="font-medium">日志内容</span>
          <span className="text-sm text-gray-500 ml-2">(自动刷新)</span>
        </div>
        <pre className="p-3 h-96 overflow-auto bg-black text-green-400 text-sm font-mono">
          {logs || '暂无日志内容'}
        </pre>
      </div>
    </div>
  );
};

export default LogViewer;