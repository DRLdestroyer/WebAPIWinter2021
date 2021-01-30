var express = require('express');
var app = express();
var serv = require('http').Server(app);//refer to server when refering to certain connections
var io = require('socket.io')(serv,{});

//File communication
app.get('/', function(req,res){
    res.sendFile(__dirname+'/client/index.html');
});//connection to index

app.use('/client', express.static(__dirname+'/client'))//set as static folder

//server side communication
serv.listen(3000, function(){
    console.log('Connected on localhost 3000');

})//listen to port 3000

var SocketList = {};
var PlayerList = {};

var Player = function(id){//class, similar to constructor
    var self = {//induvidual instance, holds params
        x:400,
        y:300,
        id:id,
        number:Math.floor(Math.random()*10),
        right:false,
        left:false,
        up:false,
        down:false,
        speed:10
    }
    self.updatePosition = function(){
        //console.log(self.up)
        if (self.right)
            self.x += self.speed;
        if (self.left)
            self.x -= self.speed;
        if (self.up)
            self.y -= self.speed;
        if (self.down)
            self.y += self.speed;
    }
    return self;
}

io.sockets.on('connection', function(socket){//when connected to socket.io, is opened when someone on client connects to server
    console.log("Socket Connected");

    socket.id = Math.random();//random id, unlikely to be the same
    //socket.x = 0;
    //socket.y = Math.floor(Math.random()*600)//random number * canvas height
    //socket.number = Math.floor(Math.random()*10)//random number * canvas height
    //add something to socket list
    SocketList[socket.id] = socket;

    var player = new Player(socket.id);//instance of player, utlize new x,y
    PlayerList[socket.id] = player;

    //disconnection event
    socket.on('disconnect', function(){
        delete SocketList[socket.id];
        delete PlayerList[socket.id];
    });//disconnection

    //recieves player input
    socket.on('keypress', function(data){
        console.log(data.state)
        if(data.inputId === 'up')
            player.up = data.state;
        if(data.inputId === 'down')
            player.down = data.state;
        if(data.inputId === 'left')
            player.left = data.state;
        if(data.inputId === 'right')
            player.right = data.state;
    });

    //old example from wendsday 1/27
    // socket.on('sendMsg', function(data){//on this event happening
    //     console.log(data.message);
    // })
    // socket.on('sendBtnMsg',function(data){//recive action
    //     console.log(data.message);
    // })

    // socket.emit('messageFromServer', {//send out action
    //     message:'Hey jordan welcome to the party'
    // })
});

//setup update loop
setInterval(function(){
    var pack = [];//collection of each package
    for (var i in PlayerList){
        var player = PlayerList[i];
        player.updatePosition();
        //console.log(player)
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        })
    }
    for (var i in SocketList){
        var socket = SocketList[i];//new local refernce to update previous versions
        socket.emit('newPositions', pack);
    }
}, 1000/30);//code to be executed when run, time in ms