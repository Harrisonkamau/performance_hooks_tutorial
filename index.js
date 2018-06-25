const server = require('./lib/server');

const app = {
  init() {
    server.init();
  }
};

// start server
app.init();
