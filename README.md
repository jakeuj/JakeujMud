# MUD HTML 客户端

一个简单而强大的基于Web的MUD客户端，支持连接到各种MUD服务器，特别是台湾地区的MUD游戏。

## 功能特点

- 轻量级Web界面，支持ANSI颜色代码
- 内置台湾地区常用MUD服务器列表
- 支持自定义服务器地址和端口
- 使用WebSocket实时通信
- 自动保存服务器设置到浏览器本地存储
- 支持Big5编码，适用于中文MUD
- 响应式设计，适配不同屏幕尺寸

## 技术栈

- 前端：纯HTML、CSS和JavaScript
- 后端：Node.js、Express、WebSocket
- 数据转换：telnet-client、iconv-lite

## 安装和运行

1. 确保已安装Node.js环境

2. 克隆或下载本项目

3. 安装依赖包
   ```bash
   npm install
   ```

4. 运行服务器
   ```bash
   node server.js
   ```

5. 打开浏览器访问 `http://localhost:3000`

## 使用方法

1. 从下拉列表中选择一个MUD服务器，或手动输入服务器地址和端口
2. 点击"连接"按钮建立连接
3. 连接成功后，在底部输入框中输入命令并按Enter发送
4. 要断开连接，点击"断开"按钮

## 服务器设置

- 服务器地址和端口会自动保存到浏览器本地存储
- 可以点击"台湾MUD列表"链接查看更多可用的MUD服务器
- 预设的服务器列表包含13个常见的台湾MUD服务器

## 自定义开发

### 添加更多服务器

编辑`public/index.html`文件中的`select`元素，按照现有格式添加新的服务器选项：

```html
<option value="host:port">服务器名称 (host:port)</option>
```

### 修改默认服务器

在`server.js`中修改默认值：

```javascript
const mudHost = queryParams.host || '你的默认服务器';
const mudPort = parseInt(queryParams.port) || 你的默认端口;
```

## 许可证

MIT

## 致谢

- 感谢[Revival World Project](https://www.revivalworld.org)提供的台湾MUD列表
- 感谢所有MUD游戏的开发者和维护者 