const express = require("express");
const app = express();
const PORT = process.env.PORT || 9000;
const http = require('http'); //import
const cors = require('cors');

app.use(cors());
app.use(express.static(__dirname + '/public'));

const server = http.createServer(app);
server.listen(PORT, console.log(`Click to open: http://localhost:9000/`));


app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
})

// Node server which will handle socket io connection //
// const io = require("socket.io")(8000);
const io = require("socket.io")(8000, {
    cors: {
        origin: "http://localhost:9000", 
        methods: ["GET", "POST"],
        credentials: true
    }
});

const users = {};

io.on('connection', socket => {
    socket.on('new-user-joined', name => {
        console.log("New user", name)
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });

    socket.on('send', message => {
        socket.broadcast.emit('receive', { message: message, name: users[socket.id] })
    });

    socket.on('disconnect', message => {
        socket.broadcast.emit('left', users[socket.id]);
        delete users[socket.id];
    });
})