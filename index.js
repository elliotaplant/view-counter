const fs = require('fs');
const http = require('http');

const stats = require('./stats.json');

let statsWritePending = false;

const server = http.createServer((req, res) => {
  stats[req.headers.origin] = stats[req.headers.origin] || { viewCount: 0 };
  stats[req.headers.origin].viewCount++;
  stats[req.headers.origin][req.url] = stats[req.headers.origin][req.url] || { viewCount: 0 };
  stats[req.headers.origin][req.url].viewCount++;

  if (!statsWritePending) {
    setTimeout(() => {
      fs.writeFile('./stats.json', JSON.stringify(stats, null, 2), (err) => {
        statsWritePending = false;
        if (err) {
          console.error(err);
        } else {
          console.log('Updated view counter file');
        }
      });
    });
  }

  res.writeHead(200);
  res.end();
});

server.listen(process.env.PORT || 8080);
