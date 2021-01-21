var mongoose = require('mongoose');//redundancy for fallback if separated from program
var Schema = mongoose.Schema;

var GameSchema = new Schema({
    game:{
        type:String,
        required:true//required to create entry, validator
    }
});

mongoose.model('game', GameSchema)//export model
//can now reference varible to create a new entry