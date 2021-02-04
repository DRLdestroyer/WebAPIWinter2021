var socket = io();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var chatText = document.getElementById('chat-text')
var chatInput = document.getElementById('chat-input')
var chatForm = document.getElementById('chat-form')
ctx.font = '30px Arial';

//event listeners for controls
document.addEventListener('keydown', keyPressDown)//keydown
document.addEventListener('keyup', keyPressUp)//key up
document.addEventListener('mousedown', mouseDown)//mouse click down
document.addEventListener('mouseup', mouseUp)//mouse click up
document.addEventListener('mousemove', mouseMove)//mouse location

function keyPressDown(e) {//recieve event from event handler
    if (e.keyCode === 68)//right//diagonal movement from else ifs
        socket.emit('keypress', { inputId: 'right', state: true })
    else if (e.keyCode === 65)//left
        socket.emit('keypress', { inputId: 'left', state: true })
    else if (e.keyCode === 87)//up
        socket.emit('keypress', { inputId: 'up', state: true })
    else if (e.keyCode === 83)//down
        socket.emit('keypress', { inputId: 'down', state: true })
}

function keyPressUp(e) {//recieve event from event handler
    if (e.keyCode === 68)//right//diagonal movement from else ifs
        socket.emit('keypress', { inputId: 'right', state: false })
    else if (e.keyCode === 65)//left
        socket.emit('keypress', { inputId: 'left', state: false })
    else if (e.keyCode === 87)//up
        socket.emit('keypress', { inputId: 'up', state: false })
    else if (e.keyCode === 83)//down
        socket.emit('keypress', { inputId: 'down', state: false })
}

function mouseDown(e) {//recieve event from event handler
    socket.emit('keypress', { inputId: 'attack', state: true })
}
function mouseUp(e) {//recieve event from event handler
    socket.emit('keypress', { inputId: 'attack', state: false })
}

function mouseMove(e) {//recieve event from event handler
    var x = -400/2 + e.clientX;//starting point + event
    var y = -300/2 + e.clientY;//starting point + event
    var angle = Math.atan2(y,x)/Math.PI*180;//get angle
    socket.emit('keypress', { inputId: 'mouseAngle', state: angle })
}

socket.on('newPositions', function (data) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    //data = new package we are sending
    //loop through objects within data
    for (var i = 0; i < data.player.length; i++) {
        ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);
    }
    for (var i = 0; i < data.bullet.length; i++) {
        ctx.fillRect(data.bullet[i].x, data.bullet[i].y,10,10);
    }
})

socket.on('addToChat',function(data){//emitter
    chatText.innerHTML += `<div>${data}</div>`;//utilize string literal with backtick(`) for a different way of concatination
})

socket.on('evalResponse',function(data){//emitter
    chatText.innerHTML += `<div>${data}</div>`;//utilize string literal with backtick(`) for a different way of concatination
    console.log(data);
})

chatForm.onsubmit = function(e){
    e.preventDefault()//prvent default action from action///prevent from refresh and losing data
    
    if(chatInput.value[0]==='/'){//use secret character to allow debugging
        socket.emit('evalServer', chatInput.value.slice(1))
    }else{//regular chat
        socket.emit('sendMessageToServer')
    }
    socket.emit('sendMessageToServer', chatInput.value);
    chatInput.value = "";//clear out input field
}

//example code from wendsday 1/27
// var msg = function(){//send data through json object to server?
//     socket.emit('sendMsg',{
//         message: 'Sending Message from button'
//     })
// }
// socket.emit('sendMsg',{//send data through json object to server?//emit a custom envent to our server
//         message: 'Hello Jordan I am logged in'
// })

// socket.on('messageFromServer', function(data){
//     console.log(data.message);
// });
