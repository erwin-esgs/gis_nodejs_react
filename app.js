require('dotenv').config()
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors')
var http = require("http");
var socketio = require("socket.io");
// const serveStatic = require("serve-static");
//const process = require('process');

const bodyParser = require('body-parser'); 
const {verifyToken} = require("./middleware/auth.middleware")
const {verifyAdmin} = require("./middleware/admin.middleware")

 
var app = express();
app.disable('etag');
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const apiRouter = express.Router();
// apiRouter.use('/auth', require('./routes/auth.route'));
// apiRouter.use('/user',verifyToken,require('./routes/user.route'));
apiRouter.use('/query', require('./routes/elastic.route'));

app.use('/api', apiRouter); 
// app.use(serveStatic(`${process.cwd()}/frontend/build`, { index: false }));

app.use(express.static(path.join(__dirname, '/frontend/build')));
app.use("/*", async (_req, res, _next) => {
  return res
    .status(200)
    .set("Content-Type", "text/html")
    .send(readFileSync(join(STATIC_PATH, "index.html")));
});

// const server = require('http').createServer(app);
// const io = socketio(server);

// io.on("connection", (socket) => {
//     console.log("New client connected");
  
//     socket.on("chat message", (msg) => {
//       io.emit("chat message", msg);
//     });
  
//     socket.on("disconnect", () => {
//       console.log("Client disconnected");
//     });
// });

module.exports = { app: app /* , server: server */ };
