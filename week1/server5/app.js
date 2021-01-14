var WebSocketServer = require('ws').Server,
wss =  new WebSocketServer({port:3000}),
clients = [],
messages = [];//messages exchanged

wss.on('connection', function(ws){//look for connection
    var index = clients.push(ws) - 1;
    console.log(wss.clients);
    var msgText = messages.join('<br>');//add line break to messages
    ws.send(msgText);//send the message

    ws.on('message', function(message){
        messages.push(message);
        console.log('recived: %s from %s', message, index);//shows up serverside

        wss.clients.forEach(function(conn){//take clients and loop through them to update all screens
            conn.send(message);
        })
    })
})

console.log("Connected on Port 3000")