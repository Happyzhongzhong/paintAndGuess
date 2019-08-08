const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

user = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server is running at 3000');

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    var roomNum;

    connections.push(socket);
    console.log('a user is connected: %s intotal', connections.length);
    io.sockets.emit('new message', {msg: '一个新用户加入游戏,' + '目前：' + connections.length + '人在线'});

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log('a user is disconnected: %s intotal now', connections.length);
        io.sockets.emit('new message', {msg: '一位用户退出游戏,' + '目前：' + connections.length + '人在线'});

    });

    socket.on('roomNum', function(data){
        socket.join(data, function () {
            console.log('一位用户加入' + data + '房间');
            roomNum = data;
        })
    });

    socket.on('send message', function(data){
        io.sockets.in(roomNum).emit('new message', {msg:data});
        console.log(roomNum);
    });

});