const { Telnet } = require('telnet-client');
const WebSocket = require('ws');
const iconv = require('iconv-lite');
const express = require('express');
const path = require('path');
const url = require('url');
const config = require('./config');

const app = express();
// 從配置文件獲取端口
const port = config.webServer.port;

// 添加配置端點以提供給前端
app.get('/config', (req, res) => {
  res.json(config);
});

const server = app.listen(port, () => {
  console.log(`HTTP & WS server running on http://localhost:${port}`);
});
app.use(express.static(path.join(__dirname, 'public')));

const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws, req) => {
  // 從URL查詢參數獲取MUD主機和端口
  const queryParams = url.parse(req.url, true).query;
  const mudHost = queryParams.host || config.server.defaultHost;
  const mudPort = parseInt(queryParams.port) || config.server.defaultPort;
  // 獲取編碼設置
  const encoding = queryParams.encoding || config.encoding.defaultEncoding;
  
  // 驗證編碼是否支持
  if (!config.encoding.supportedEncodings.includes(encoding)) {
    ws.send(`不支援的編碼: ${encoding}，已使用預設編碼: ${config.encoding.defaultEncoding}`);
    encoding = config.encoding.defaultEncoding;
  }
  
  console.log(`連接到MUD伺服器: ${mudHost}:${mudPort} (編碼: ${encoding})`);

  const connection = new Telnet();
  const params = {
    host: mudHost, 
    port: mudPort,
    negotiationMandatory: false,
    shellPrompt: '', // 讓它不等待提示符
    timeout: 5000,
    execTimeout: 2000,
    debug: false,
    irs: '\n',
    ors: '\r\n',
  };

  try {
    await connection.connect(params);

    connection.on('data', (buffer) => {
      const cleanBuffer = stripTelnetControlBytes(buffer);
      const msg = iconv.decode(cleanBuffer, encoding);
      ws.send(msg);
    });

    ws.on('message', (msg) => {
      const encoded = iconv.encode(msg.toString(), encoding);
      connection.send(encoded);
    });

    ws.on('close', () => connection.end());
  } catch (err) {
    console.error('Telnet 連接失敗：', err);
    ws.send('連接失敗，請稍後再試。');
    ws.close();
  }
});

function stripTelnetControlBytes(buffer) {
  const IAC = 255;
  const result = [];
  let i = 0;
  while (i < buffer.length) {
    if (buffer[i] === IAC && i + 1 < buffer.length) {
      const cmd = buffer[i + 1];
      // skip IAC DO/WILL/WONT/DONT (2 or 3-byte sequences)
      if ([251, 252, 253, 254].includes(cmd)) {
        i += 3;
      } else if (cmd === 250) {
        // subnegotiation start: skip until IAC SE (255 240)
        i += 2;
        while (i + 1 < buffer.length && !(buffer[i] === IAC && buffer[i + 1] === 240)) {
          i++;
        }
        i += 2;
      } else {
        i += 2; // fallback skip
      }
    } else {
      result.push(buffer[i]);
      i++;
    }
  }
  return Buffer.from(result);
}