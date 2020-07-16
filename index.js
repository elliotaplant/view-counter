const fs = require('fs');
const http = require('http');

const stats = require('./stats.json');

const port = process.argv[2] || 8080;

let statsWritePending = false;

const server = http.createServer((req, res) => {
  const { host = 'unknown_host', referer = 'unknown_referrer' } = req.headers;
  stats[host] = stats[host] || { total: 0 };
  stats[host].total++;
  stats[host][referer] = stats[host][referer] || 0;
  stats[host][referer]++;

  if (!statsWritePending) {
    setTimeout(() => {
      fs.writeFile('./stats.json', JSON.stringify(stats, null, 2) + '\n', (err) => {
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
