const fs = require('fs');

const stats = require('./stats.json');


const port = process.argv[2] || 8080;

let protocol;
const options = {};
if (process.argv[3] == 'ssl') {
  protocol = require('https');
  options.key = fs.readFileSync(`${process.argv[4]}/privkey.pem`).toString();
  options.cert = fs.readFileSync(`${process.argv[4]}/cert.pem`).toString();
  options.ca = fs.readFileSync(`${process.argv[4]}/chain.pem`).toString();
} else {
  protocol = require('http');
}

let statsWritePending = false;

const handler = (req, res) => {
  const { referer = 'unknown_referrer' } = req.headers;
  stats[referer] = stats[referer] || 0;
  stats[referer]++;

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
};


const server = protocol.createServer(handler);
console.log('Server listening on port', port);
server.listen(port);
