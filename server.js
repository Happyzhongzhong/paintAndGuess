const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
server.listen(process.env.PORT || 3000);
console.log('server is running at 3000');
app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});
//以上为套话
var user = [];
var connections = [];
var painter = 0;
var guesser = 0;
//以上为核心变量
//注意：项目可能存在的Bug：
//guesser 和 painter不能为一个全局的变量
//如果不输入房间号或者选择角色就重新刷新页面则会导致guesser 和 painter计算错误
//需要改进（如果有时间）：
//游戏开始的提醒和全局监听（是否需要加入全局监听，还是只做到用户发送消息是刷新页面）
io.sockets.on('connection', function(socket){
    var roomNum;
    var character;
    connections.push(socket);
    console.log('a user is connected: %s intotal', connections.length);
    io.sockets.emit('new message', {msg: '一个新用户加入游戏，' + '目前：' + connections.length + '人在线'});

    socket.on('disconnect', function(){
        connections.splice(connections.indexOf(socket), 1);
        console.log('a user is disconnected: %s intotal now', connections.length);
        socket.leave(roomNum);
        socket.leave(character);
        if(character == '猜者，你需要在游戏开始后，根据画者所画内容进行猜谜' + roomNum)
            guesser -= 1;
        else
            painter -= 1;
        io.sockets.in(roomNum).emit('new message', {msg:'一位用户退出房间'});
        io.sockets.emit('new message', {msg: '一位用户退出游戏，' + '目前：' + connections.length + '人在线'});
    });

    socket.on('roomNum', function(data){
        socket.join(data, function () {  
            roomNum = data;
            console.log('一位玩家进入' + roomNum + '房间');
            io.sockets.in(roomNum).emit('new message', {msg:'一位用户加入房间'});
        })
    });

     socket.on('character', function(data){
        socket.join(data + roomNum);
        character = data + roomNum;
        console.log('一位' + character + '加入');
        if(data == '猜者，你需要在游戏开始后，根据画者所画内容进行猜谜')
            guesser += 1;
        else
            painter += 1;
     });

    socket.on('send message', function(data){
        io.sockets.in(roomNum).emit('new message', {msg:data});
        console.log(roomNum);
        if(guesser >= 2 && painter >= 1 && character == '猜者，你需要在游戏开始后，根据画者所画内容进行猜谜' + roomNum)
            io.sockets.in(character).emit('new message', {msg:'游戏开始，猜猜看现在画的是什么？'});
        if(guesser >= 2 && painter >= 1 && character == '画者，你需要在游戏开始后，根据系统消息画画' + roomNum)
            io.sockets.in(character).emit('new message', {msg:'游戏开始，您需要画：大象'});
    });
    socket.on('new draw', function(data){
        console.log('发送图片');
        io.sockets.emit('draw new', data);
    });

});