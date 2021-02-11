var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PlayerSchema = Schema({
    username:{
        type:String,
        required:true
    },
    password:{//typically dont store passwords, encrypt them
        type:String,
        required:true
    }
});

mongoose.model('player', PlayerSchema);