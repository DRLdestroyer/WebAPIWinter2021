var express = require('express');
var mongoose = require('mongoose');
var app = express();
var path = require('path');
var bodyparser = require('body-parser');//component of express to parse jsons
//const { Console } = require('console');
const { EPERM } = require('constants');
const { request } = require('http');

//sets up middleware to use in application
app.use(bodyparser.json());//key value pairs in json obj
app.use(bodyparser.urlencoded({extended:true}));//all reading of encoded urls
app.use(express.json());

//makes the connection to the database server
mongoose.connect('mongodb://localhost:27017/gameEntries', {//connect to mongoose //connect('connection string', {exeptions})
    useNewUrlParser:true
}).then(function(){
    console.log("Connected to MongoDB Database");
}).catch(function(err){
    console.log(err);
});

//load in database templates
require('./models/Game');//require folder
var Game = mongoose.model('game');

//basic code for saving an entry (every startup)
/*
//for fun create an entry in the database
var Game = mongoose.model('Game', {nameofgame:String});//model = schema

var game = new Game({nameofgame:"Skyrim"});
game.save().then(function(){//save the entry
    Console.log("Game Saved");
})
*/

//example of a POST route
app.post('/saveGame', function(req,res){
    console.log("Request Made");
    console.log(req.body);

    new Game(req.body).save().then(function(){
        res.redirect('gamelist.html');
    })
})

//gets the data for the list
app.get('/getData',function(req,res){//utilize mongoose commands to grab data //{} = all data //.then = promise
    Game.find({}).then(function(game){
        res.json({game})
    })
})

//postroute to delete game entry
app.post('/deleteGame', function(req,res){
    console.log('Game Deleted', req.body._id);
    Game.findByIdAndDelete(req.body._id).exec();
    res.redirect('gamelist.html');
})


app.use(express.static(__dirname+"/views"))
app.listen(3000, function(){//connect to database
    console.log("Listening on port 3000");
});