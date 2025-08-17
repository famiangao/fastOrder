# 日志系统说明

## 修复完成！✅

### 问题解决：
1. **LogViewer 组件错误修复**：原来直接在渲染进程中访问 electron.app，现在改为使用 IPC 通信
2. **日志文件位置**：日志保存在 Electron 应用的 userData 目录中

### 日志文件位置：
- **Windows**: `%APPDATA%\electron-vite-react\buyGoods-log.txt`
- **具体路径示例**: `C:\Users\[用户名]\AppData\Roaming\electron-vite-react\buyGoods-log.txt`

### 新增的 IPC 处理器：
1. `get-log-path` - 获取日志文件路径
2. `read-log-file` - 读取日志文件内容  
3. `clear-log-file` - 清空日志文件
4. `open-log-folder` - 打开日志文件夹

### 测试步骤：
1. 启动应用程序
2. 点击"查看日志"按钮
3. 可以看到"← 返回主页"按钮
4. 可以看到日志文件路径显示
5. 点击"执行旧版"会在日志中记录详细信息
6. 使用"刷新日志"、"清除日志"、"打开日志文件夹"功能

### 功能特色：
- ✅ 回退按钮已添加
- ✅ 自动显示日志文件路径
- ✅ 实时日志更新（每5秒刷新）
- ✅ IPC 安全通信
- ✅ 错误处理完善

现在日志查看器应该能够正常工作了！