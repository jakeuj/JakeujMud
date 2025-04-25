# MUD HTML 客戶端

一個簡單而強大的基於Web的MUD客戶端，支持連接到各種MUD伺服器，特別是臺灣地區的MUD遊戲。

## 功能特點

- 輕量級Web界面，支持ANSI顏色代碼
- 內置臺灣地區常用MUD伺服器列表
- 支持自定義伺服器地址和端口
- 支持多種編碼（Big5、UTF-8、GBK），適用於不同MUD遊戲
- 使用WebSocket實時通信
- 自動保存伺服器設置和編碼選擇到瀏覽器本地存儲
- 支持通過URL參數指定伺服器和編碼
- 響應式設計，適配不同屏幕尺寸
- 內置幫助彈窗，方便用戶了解功能

## 技術棧

- 前端：純HTML、CSS和JavaScript
- 後端：Node.js、Express、WebSocket
- 數據轉換：telnet-client、iconv-lite

## 安裝和運行

1. 確保已安裝Node.js環境

2. 克隆或下載本項目

3. 安裝依賴包
   ```bash
   npm install
   ```

4. 運行伺服器
   ```bash
   node server.js
   ```

5. 打開瀏覽器訪問 `http://localhost:3000`

## 使用方法

1. 從下拉列表中選擇一個MUD伺服器，或手動輸入伺服器地址和端口
2. 選擇適合您MUD遊戲的字符編碼（默認Big5）
3. 點擊"連接"按鈕建立連接
4. 連接成功後，在底部輸入框中輸入命令並按Enter發送
5. 要斷開連接，點擊"斷開"按鈕

## URL參數

可以通過URL參數預設伺服器和編碼，例如：
```
http://localhost:3000/?host=mud.csie.org&port=3838&encoding=big5
```

支持的參數：
- `host`: MUD伺服器地址
- `port`: MUD伺服器端口
- `encoding`: 字符編碼（big5, utf8, gbk）

## 配置文件

伺服器的默認設置存儲在`config.js`中，可以修改以下配置：

```javascript
module.exports = {
  // 默認MUD伺服器設置
  server: {
    defaultHost: 'mud.csie.org',
    defaultPort: 3838
  },
  
  // 編碼設置
  encoding: {
    defaultEncoding: 'big5',
    supportedEncodings: ['big5', 'utf8', 'gbk']
  },
  
  // Web伺服器設置
  webServer: {
    port: process.env.PORT || 3000
  }
};
```

## 部署到Azure App Service

1. 確保項目包含`web.config`文件
2. 啟用Azure App Service的WebSocket支持
3. 設置HTTP版本為2.0獲得更好性能
4. 應用默認使用環境變量`PORT`，無需額外配置

## 自定義開發

### 添加更多伺服器

編輯`public/index.html`文件中的`select`元素，按照現有格式添加新的伺服器選項：

```html
<option value="host:port">伺服器名稱 (host:port)</option>
```

### 添加更多編碼支持

1. 在`config.js`中的`supportedEncodings`數組添加新的編碼
2. 在`public/index.html`中的編碼下拉選擇器添加對應選項

## 許可證

MIT

## 致謝

- 感謝[Revival World Project](https://www.revivalworld.org)提供的臺灣MUD列表
- 感謝所有MUD遊戲的開發者和維護者 