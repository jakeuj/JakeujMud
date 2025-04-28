/**
 * MUD客戶端配置文件
 */
module.exports = {
  // 默認MUD服務器設置
  server: {
    defaultHost: 'mud.csie.org',
    defaultPort: 3838
  },
  
  // 編碼設置
  encoding: {
    defaultEncoding: 'big5',
    supportedEncodings: ['big5', 'utf8', 'gbk']
  },
  
  // Web服務器設置
  webServer: {
    port: process.env.PORT || 3000
  },
  
  // 界面設置
  ui: {
    // 字體設置
    font: {
      // 主要字體，使用等寬字體
      family: "'思源黑體 HW', monospace, 'Microsoft JhengHei', 'PingFang TC'",
      // 字體大小
      size: '12px',
      // 行高
      lineHeight: 1.0
    },
    // 輸出區域設置
    output: {
      // 行間距
      padding: '1px 1px'
    }
  }
}; 