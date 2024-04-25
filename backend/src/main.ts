import http = require('http');
import app from './app';

app.set('port', process.env.PORT || 4000);
const server = http.createServer(app);

server.listen(process.env.PORT || 4000);
