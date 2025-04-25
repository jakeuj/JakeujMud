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
  }
}; 