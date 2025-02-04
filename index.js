const express = require('express');
const app = express();
const http = require('http');
const path =  require('path');

const socketio = require('socket.io');

// The Express app (app) is passed to the http.createServer() to create an HTTP server.
// Then, Socket.IO (io) is attached to the server to handle WebSocket connections.
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
// app.set('views', path.join(__dirname, 'views'));

// Listens for incoming WebSocket connections.
// When a client connects, "connection" is logged to the console
io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    socket.on("send-location", data =>{
      io.emit("receive-location", {id: socket.id, ...data});      
    });
   
    socket.on("disconnect", () => {
        io.emit("user-disconnected", socket.io)
    })
});

app.get('/', (req, res) => {
    res.render('/views/index.ejs');     
});

server.listen(3000);