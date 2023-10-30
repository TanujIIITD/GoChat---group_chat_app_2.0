// serving html file using nodejs                   

const http = require('http');            // created an http module
const express = require('express');      // to import express
const { application } = require('express');

const app = express();     // make an app of express

const server = http.createServer(app);      // the application of express will be ready to run on server
const port = process.env.PORT || 3000;      // a port is generated automatically to run our app on it, if not generated, it will use port 3000

// images, js, css files are static files, so we put them in one folder named public 
app.use(express.static(__dirname + '/public'));   

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');      
})


// *****Socket.io Setup*****
// Socket.io is a library that enables real-time, bidirectional and event-based communication between the browser(node.js client) and the server(node.js server).

const io = require('socket.io')(server);   // include or import socket.io in io variable and telling it to run on our server
let users={};     

// if a new user connects to chat(app), they will become a socket and a different id will be generated/provided to them by socket.io 
io.on("connection", (socket) => {    
    socket.on("new-user-joined", (username) => {   
        users[socket.id]=username;         
        socket.broadcast.emit("user-connected", username)    
        io.emit("user-list", users);       
    });

    socket.on("disconnect", ()=>{
        socket.broadcast.emit("user-disconnected", user=users[socket.id]);  
        delete users[socket.id];
        io.emit("user-list", users);
    });

    socket.on("message", (data) => {         
       socket.broadcast.emit("message", data); 
    });
});


// *****Socket.io Setup Ends *****

server.listen(port, () => {                 // listen function will be called with the help of server variable, and pass port number to it so that server run on that port number
    console.log("Server started at " + port);
});

