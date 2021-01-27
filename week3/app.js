var express = require('express');
var app = express();
var serv = require('http').Server(app);//refer to server when refering to certain connections
var io = require('socket.io')(serv,{});

//File communication
app.get('/', function(req,res){
    res.sendFile(__dirname+'/client/index.html');
});//connection to index

app.use('/client', express.static(__dirname+'/client'))//set as staic folder

serv.listen(3000, function(){
    console.log('Connected on localhost 3000');

})//listen to port 3000

//server side communication
io.sockets.on('connection', function(socket){//when connected to socket.io, is opened when someone on clinet connects to server
    console.log("Socket Connected");

    socket.on('sendMsg', function(data){//on this event happening
        console.log(data.message);
    })
    socket.on('sendBtnMsg',function(data){
        console.log(data.message);
    })

    socket.emit('messageFromServer', {
        message:'Hey jordan welcome to the party'
    })

});
