var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/Players';

if(process.env.NODE_ENV == 'production'){//if hosted on atlas (mongo's hosting service)//check if local or production environment, similar to heroku's process
    dbURI = process.env.MONGOLAB_URI;//set to URI if production
}

mongoose.connect(dbURI,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

mongoose.Promise = Promise;

mongoose.connection.on('connected', function(){//event, function
    console.log("Mongoose connected to " + dbURI);
})