const fs = require('fs');
const http = require('http');

const stats = require('./stats.json');

const port = process.argv[2] || 8080;

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


console.log('Server listening on port', port);
server.listen(port);
