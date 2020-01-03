const express         = require('express');
const http            = require('http');
const path            = require('path');
const morgan          = require('morgan');
const app             = express();
const port            = parseInt(process.env.PORT || '3000');
const server          = http.createServer(app);
const WebSocketServer = require('ws').Server;

require(__dirname + "/thermostat/sockethandler.js")(new WebSocketServer({ server }));

app.set('port', port);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', (req, res) => {
  res.render('home');
});

server.listen(port, () => {
  console.log(`Server started on port ${server.address().port}`);
});