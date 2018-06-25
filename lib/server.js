// built-in modules
const http = require('http');
const url = require('url');
const { StringDecoder } = require('string_decoder');

// local modules
const handlers = require('./routeHandler');
const helpers = require('./helpers');
const config = require('./config');


// Container for server module
let server = {};

// http server
server.httpServer = http.createServer((req, res) => {
  server.responseHandler(req, res);
});

server.responseHandler = (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  console.log(`Making a ${req.method} request to: ${req.headers.host}${req.url}`);

  const trimmedPath = path.replace(/^\/+|\/+$/g, '');
  const headers = req.headers;
  const method = req.method.toLowerCase();
  const queryString = parsedUrl.query;

  // get payload if any
  const decoder = new StringDecoder('utf-8');
  let buffer = '';
  req.on('data', data => {
    buffer += decoder.write(data);
  });

  req.on('end', () => {
    buffer += decoder.end();
    // data object to send to the handler
    const data = {
      trimmedPath,
      queryString,
      method,
      headers,
      payload: helpers.jsonParser(buffer)
    };
    // Check the router for a matching path for a handler. If one is not found, use the notFound handler instead
    const chosenHandler = typeof (server.routes[trimmedPath]) !== 'undefined' ? server.routes[trimmedPath] : handlers.notFound;

    chosenHandler(data, (statusCode, payload) => {
      statusCode = typeof (statusCode) == 'number' ? statusCode : 200;
      let payloadString = JSON.stringify(payload);
      res.writeHead(statusCode);
      res.end(payloadString);
    });

  })


};

server.init = _ => {
  server.httpServer.listen(config.port, _ => console.log(`Server running on port: ${config.port}`));
}

// routes
server.routes = {
  'index': handlers.index,
  'users': handlers.user
};

module.exports = server;
