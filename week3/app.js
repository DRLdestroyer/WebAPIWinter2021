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

//Class for GameObject
var GameObject = function(){
    var self = {
        x:400,
        y:300,
        spX:0,
        spY:0,
        id:""
    };
    
    self.update = function(){
        self.updatePosition()
    }

    self.updatePosition = function(){
        self.x += self.spX;
        self.y += self.spY;
    }
    return self;
}

//add to game object class with new class
var Player = function(id){//class, similar to constructor
    
    var self = GameObject()
    self.id = id;
    self.number = Math.floor(Math.random()*10);
    self.right = false;
    self.left = false;
    self.up = false;
    self.down = false
    self.speed = 10;
    
    var playerUpdate = self.update;//inherited from base class

    self.update = function(){
        self.updateSpeed();
        playerUpdate();
    }

    self.updateSpeed = function(){
        if(self.right){
            self.spX = self.speed;
        }else if(self.left){
            self.spX = -self.speed
        }else{//prevent acceleration endlessly
            self.spX = 0;
        }

        if(self.up){
            self.spY = -self.speed;
        }else if(self.down){
            self.spY = self.speed;
        }else{//prevent acceleration endlessly
            self.spY = 0;
        }
    }

    Player.list[id] = self;

    return self;
}

Player.list = {}//= empty json

//list of functions for player connection and movement
Player.onConnect = function(socket){
    var player = new Player(socket.id);//instance of player, utlize new x,y
    
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
}

Player.onDisconnect = function(socket){
    delete Player.list[socket.id];
}

Player.update = function(){
    var pack = [];//collection of each package
    for (var i in Player.list){
        var player = Player.list[i];
        player.update();
        //console.log(player)
        pack.push({
            x: player.x,
            y: player.y,
            number: player.number
        })
    }

    return pack;
}

//Connection to game
io.sockets.on('connection', function(socket){//when connected to socket.io, is opened when someone on client connects to server
    console.log("Socket Connected");

    socket.id = Math.random();//random id, unlikely to be the same
    //socket.x = 0;
    //socket.y = Math.floor(Math.random()*600)//random number * canvas height
    //socket.number = Math.floor(Math.random()*10)//random number * canvas height
    //add something to socket list
    SocketList[socket.id] = socket;
    Player.onConnect(socket);

    //disconnection event
    socket.on('disconnect', function(){
        delete SocketList[socket.id];
        Player.onDisconnect(socket);
    });//disconnection

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
    var pack = Player.update();
    for (var i in SocketList){
        var socket = SocketList[i];//new local refernce to update previous versions
        socket.emit('newPositions', pack);
    }
}, 1000/30);//code to be executed when run, time in ms