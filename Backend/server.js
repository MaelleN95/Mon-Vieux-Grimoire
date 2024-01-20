// Importing modules
const http = require('http');
const app = require('./app');

const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
};

// Set server listening port
const port = normalizePort(process.env.PORT || '4000');
app.set('port', port);

// Errors management
const errorHandler = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const address = server.address();
  const bind =
    typeof address === 'string' ? 'pipe ' + address : 'port: ' + port;

  switch (error.code) {
    case 'EACCES': // access error
      console.error(bind + ' requires elevated privileges.');
      process.exit(1);
      break;
    case 'EADDRINUSE': // port already used
      console.error(bind + ' is already in use.');
      process.exit(1);
      break;
    default:
      throw error;
  }
};

// Server creation
const server = http.createServer(app);

// Server event management
server.on('error', errorHandler);
server.on('listening', () => {
  const address = server.address();
  const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
  console.log('Listening on ' + bind);
});

// Server startup
server.listen(port);
