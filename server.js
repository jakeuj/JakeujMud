const { Telnet } = require('telnet-client');
const WebSocket = require('ws');
const iconv = require('iconv-lite');
const express = require('express');
const path = require('path');
const url = require('url');

const app = express();
// 获取环境变量中的端口，如果不存在，则使用3000
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`HTTP & WS server running on http://localhost:${port}`);
});
app.use(express.static(path.join(__dirname, 'public')));

const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws, req) => {
  // 从URL查询参数获取MUD主机和端口
  const queryParams = url.parse(req.url, true).query;
  const mudHost = queryParams.host || 'kk.muds.idv.tw';
  const mudPort = parseInt(queryParams.port) || 4000;
  
  console.log(`连接到MUD服务器: ${mudHost}:${mudPort}`);

  const connection = new Telnet();
  const params = {
    host: mudHost, 
    port: mudPort,
    negotiationMandatory: false,
    shellPrompt: '', // 让他不等待提示符
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
      const msg = iconv.decode(cleanBuffer, 'big5');
      ws.send(msg);
    });

    ws.on('message', (msg) => {
      const encoded = iconv.encode(msg.toString(), 'big5');
      connection.send(encoded);
    });

    ws.on('close', () => connection.end());
  } catch (err) {
    console.error('Telnet 连接失败：', err);
    ws.send('连接失败，请稍后再试。');
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