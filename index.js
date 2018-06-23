const server = require('./app/lib/server');

const app = {
  init() {
    server.init();
  }
}

// start server
app.init();
