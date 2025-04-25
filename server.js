const { Telnet } = require('telnet-client');
const WebSocket = require('ws');
const iconv = require('iconv-lite');
const express = require('express');
const path = require('path');

const app = express();
const server = app.listen(3000, () => {
  console.log('HTTP & WS server running on http://localhost:3000');
});
app.use(express.static(path.join(__dirname, 'public')));

const wss = new WebSocket.Server({ server });

wss.on('connection', async (ws) => {
  const connection = new Telnet();
  const params = {
    host: 'kk.muds.idv.tw', // 改成你的 MUD 主機
    port: 4000,
    negotiationMandatory: false,
    shellPrompt: '', // 讓他不等待提示符
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
    console.error('Telnet 連線失敗：', err);
    ws.send('連線失敗，請稍後再試。');
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