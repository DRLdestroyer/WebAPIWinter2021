var socket = io();

//___Sign in related client___
var signDiv = document.getElementById('signInDiv');
var signDivUsername = document.getElementById('signInDiv-username');
var signDivSignIn = document.getElementById('signInDiv-signIn');
var signDivSignUp = document.getElementById('signInDiv-signUp');
var signDivPassword = document.getElementById('signInDiv-password');
var gameDiv = document.getElementById('gameDiv');
var error = document.getElementById('err');

//add event listeners for sign in buttons
signDivSignIn.onclick = function(){
    socket.emit('signIn',{username:signDivUsername.value, password:signDivPassword.value});//send an object to the server
}
signDivSignUp.onclick = function(){
    socket.emit('signUp',{username:signDivUsername.value, password:signDivPassword.value});
}

socket.on('signInResponse', function(data){
    if(data.success){
        //log user in
        signDiv.style.display = "none";
        gameDiv.style.display = "inline-block";//default style
    }else{
        //alert("Sign in Unsucessful");//considered a pop up
        error.innerHTML = "Sign in Unsucessful";
    }
    
});

socket.on('signUpResponse', function(data){
    if(data.success){
        error.innerHTML = "Sign up Success, please log in";
    }else{
        error.innerHTML = "Sign Up Unsucessful";
        
    }
    
});

//___Game related___
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var chatText = document.getElementById('chat-text')
var chatInput = document.getElementById('chat-input')
var chatForm = document.getElementById('chat-form')
var clientId;
var px = 0;
var py = 0;
var clientId;
ctx.font = '30px Arial';

var Sprites = {};
Sprites.player = new Image();
Sprites.player.src  = '/client/images/player.png';
Sprites.fireball = new Image();
Sprites.fireball.src  = '/client/images/Fireball.png';
Sprites.map = new Image();
Sprites.map.src  = '/client/images/Tilemap.png';

var drawMap = function(){
    ctx.drawImage(Sprites.map, 0, 0, 800, 600)
}

var drawScore = function(){
    ctx.fillStyle = 'white';//will change perminantly
    ctx.fillText(Player.list[clientId].score, 10, 50);
    ctx.fillStyle = 'black';//set it back
}

var Player = function(initPack){
    var self = {}
    self.id = initPack.id
    self.number = initPack.number
    self.x = initPack.x
    self.y = initPack.y
    self.hp = initPack.hp
    self.hpMax = initPack.hpMax
    self.score = initPack.score

    self.draw = function(){
        var hpWidth = 30 * self.hp/self.hpMax
        ctx.fillStyle = "red"
        ctx.fillRect(self.x - hpWidth/2, self.y -50, hpWidth, 5)
        ctx.fillStyle = "black"
        //ctx.fillText(self.number, self.x, self.y)
        //ctx.font = "20px Arial"
        //ctx.fillText(self.score, self.x, self.y - 60)
        //ctx.font = "30px Arial"
        ctx.drawImage(Sprites.player, self.x - 10, self.y - 40, Sprites.player.width/4, Sprites.player.height/4);
    }

    Player.list[self.id] = self
    return self
}

Player.list = {}

var Bullet= function(initPack){
    var self = {}
    self.id = initPack.id
    self.x = initPack.x
    self.y = initPack.y

    self.draw = function(){ 
        //ctx.fillRect(self.x-5, self.y-5, 10, 10);
        ctx.drawImage(Sprites.fireball, self.x - 5, self.y - 5, 15, 10);
    }

    Bullet.list[self.id] = self
    return self
}

Bullet.list = {}

socket.on('connected', function(data){
    clientId = data;
    console.log(clientId);
})

//init
socket.on('init', function(data){
    for(var i =0;i<data.player.length;i++){
        new Player(data.player[i])
    }

    for(var i =0;i<data.bullet.length;i++){
        new Bullet(data.bullet[i])
    }
})

//update
socket.on('update', function(data){
    //sets player position
    for(var i =0; i<data.player.length; i++){
        if(clientId == data.player[i].id){
            px = data.player[i].x
            py = data.player[i].y
        }
        //ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y)
        var pack = data.player[i]
        var p = Player.list[pack.id]

        if(p){
            if(pack.x !== undefined){
                p.x = pack.x
            }
            if(pack.y !== undefined){
                p.y = pack.y
            }
            if(pack.hp !== undefined){
                p.hp = pack.hp
            }
            if(pack.hpMax !== undefined){
                p.hpMax = pack.hpMax
            }
            if(pack.score !== undefined){
                p.score = pack.score
            }
            
        }

    }
    for(var i = 0;i<data.bullet.length;i++){
        var pack = data.bullet[i];
        var b = Bullet.list[pack.id];
        if(b){
            if(pack.x !== undefined){
                b.x = pack.x
            }
            if(pack.y !== undefined){
                b.y = pack.y
            }
        }
    }
})


//remove
socket.on('remove', function(data){
    for(var i =0;i<data.player.length;i++){
        delete Player.list[data.player[i]]
    }

    for(var i =0;i<data.bullet.length;i++){
        delete Bullet.list[data.bullet[i]]
    }
})

setInterval(function(){
    ctx.clearRect(0, 0, 800, 600);
    drawMap();
    for(var i in Player.list){
        //Draw function will go here
        Player.list[i].draw()
    }
    for(var i in Bullet.list){
        //Draw functions will go here
        Bullet.list[i].draw()
    }
    drawScore();//draw score on top
},1000/30)

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
    var x = -px + e.clientX - 8;//starting point + header dimention
    var y = -py + e.clientY - 98;//starting point + header dimention
    var angle = Math.atan2(y,x)/Math.PI*180;//get angle
    socket.emit('keypress', { inputId: 'mouseAngle', state: angle })
}

// socket.on('newPositions', function (data) {
//     //data = new package we are sending
//     //loop through objects within data
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     for (var i = 0; i < data.player.length; i++) {
//         if(clientId == data.player[i].id){
//             px = data.player[i].x;
//             py = data.player[i].y;
//         }
//         ctx.fillText(data.player[i].number, data.player[i].x, data.player[i].y);
//     }
//     for (var i = 0; i < data.bullet.length; i++) {
//         ctx.fillRect(data.bullet[i].x + 5, data.bullet[i].y - 10,10,10);
//     }
// })

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
