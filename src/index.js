const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const cors = require('cors')
const app = express();

const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
}); 

const PORT = process.env.PORT || 3002;
app.use(cors())
const route = require('./route/index.js');
const db = require('./config/db.js');
const handleSocket = require('./socket/index.js')
const credentials = require('./credentials');
const init = require("./init");
db.connect();
// init account admin
init.createAdminAccount();

app.use(cookieParser())
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: credentials.cookieSecret,
}))
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(express.static(__dirname));
route(app)
server.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`);
})
handleSocket(io)