var express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

app.get('/',function (req,res) {
    res.sendFile(__dirname+'socket.html');
});

var onlineUserCount = 0;
var onlineUsers={};

io.on('connection',function (socket) {
    socket.emit('open');
    var client={
        socket:socket,
        name:false
    }


    socket.on('chat message',function (msg) {
        console.log('chat message:'+msg);
        var obj = {
            time:getTime()
        };
        if (!client.name){
            onlineUserCount++;
            client.name = msg;
            obj['text'] = client.name;
            obj['author'] = 'Sys';
            obj['type'] = 'welcome';
            obj['onlineUserCount'] = onlineUserCount;
            socket.name = client.name;
            if (!onlineUsers.hasOwnProperty(client.name)){
                onlineUsers[client.name] = client.name;

            }
            obj['onlineUsers'] = onlineUsers;
            console.log(client.name+'login,当前在线人数:'+onlineUserCount);

            socket.emit('system',obj);
            socket.broadcast.emit('system',obj);

        }else{

            obj['text'] = msg;
            obj['author'] = client.name;
            obj['type'] = 'message';
            console.log(client.name+' say:'+msg);
            socket.emit('chat message',obj);
            socket.broadcast.emit('chat message',obj);
        }
    });

    socket.io('disconnect',function () {
        onlineUserCount --;

        if (onlineUsers.hasOwnProperty(socket.name)){
            delete onlineUsers[client.name];
        }

        var obj = {
            time:getTime(),
            author:'Sys',
            text:client.name,
            type:'disconnect',
            onlineUsers:onlineUsers
        };

        socket.broadcast.emit('system',obj);
        console.log(client.name+'disconnect,当前人数：'+onlineUserCount);

    });

    http.listen(3000,function () {
        console.log('server begin...');
    });
    var getTime = function () {
        var date = new Date();
        return date.getHours()+":"+date.getMinutes();

    }

    var getColor=function(){
        var colors = ['aliceblue','antiquewhite','aqua','aquamarine','pink','red','green',
            'orange','blue','blueviolet','brown','burlywood','cadetblue'];
        return colors[Math.round(Math.random() * 10000 % colors.length)];
    }

});




