const http = require('http');
const handlers = require('./routeHandler');
const config = require('./config');


// Container for server module
let server = {};

// http server
server.httpServer = http.createServer((req, res) => {
  res.end('Hello world');
});

server.init = _ => {
  server.httpServer.listen(config.port, _ => console.log(`Server running on port: ${config.port}`));
}

// routes
server.routes = {
  '/index': handlers.index
};

module.exports = server;
