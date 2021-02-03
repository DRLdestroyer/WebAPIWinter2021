var socket = io();
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
ctx.font = '30px Arial';

//event listeners for keypresses
document.addEventListener('keydown', keyPressDown)//keydown
document.addEventListener('keyup', keyPressUp)//key up

function keyPressDown(e) {//recieve event from event handler
    if (e.keyCode === 39)//right
        socket.emit('keypress', { inputId: 'right', state: true })
    else if (e.keyCode === 37)//left
        socket.emit('keypress', { inputId: 'left', state: true })
    else if (e.keyCode === 38)//up
        socket.emit('keypress', { inputId: 'up', state: true })
    else if (e.keyCode === 40)//down//diagonal movement from else ifs
        socket.emit('keypress', { inputId: 'down', state: true })
}

function keyPressUp(e) {//recieve event from event handler
    if (e.keyCode === 38)//up//diagonal movement from else ifs
        socket.emit('keypress', { inputId: 'up', state: false })
    else if (e.keyCode === 40)//down
        socket.emit('keypress', { inputId: 'down', state: false })
    else if (e.keyCode === 37)//left
        socket.emit('keypress', { inputId: 'left', state: false })
    else if (e.keyCode === 39)//right
        socket.emit('keypress', { inputId: 'right', state: false })
}

socket.on('newPositions', function (data) {
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var i = 0; i < data.length; i++) {//data = new package we are sending
        ctx.fillText(data[i].number, data[i].x, data[i].y);
        //console.log(data[i].number, data[i].x, data[i].y)
    }
})

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
