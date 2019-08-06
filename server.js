const express = require('express');
const app = express();

const server = require('http').createServer(app);

const io = require('socket.io').listen(server);

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

user = [];
connections = [];

server.listen(process.env.PORT || 3000);
console.log('server is running at 3000');

app.get('/', function(req, res){
    res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){

    connections.push(socket);
    console.log('a user is connected: %s intotal', connections.length);
    io.sockets.emit('new message', {msg: '一个新用户加入游戏,' + '目前：' + connections.length + '人在线'});

    socket.on('disconnect', function(data){
        connections.splice(connections.indexOf(socket), 1);
        console.log('a user is disconnected: %s intotal now', connections.length);
        io.sockets.emit('new message', {msg: '一位用户退出游戏,' + '目前：' + connections.length + '人在线'});

    });
    socket.io('roomnum', )

    socket.on('send message', function(data){
        io.sockets.emit('new message', {msg: data});
    })

})