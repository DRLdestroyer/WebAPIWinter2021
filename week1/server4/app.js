//app is entry point of application
var http = require('http');
var url = require('url');
var fileSystem = require('fs');

http.createServer(function(request, response){
    var pathName = url.parse(request.url).pathname;
    var fileName = "index.html";

    fileSystem.readFile(fileName, callback);//callback is the function we want to call when loaded

    function callback(err, data){
        if(err){
            console.log(err);

            response.writeHead(400), {'Content-Type':'text/html'};
            response.write('<!DOCTYPE><html><body><div>Page not found</div></body></html>')
        }
        else{
            //if the file is present
            //http header
            response.writeHead(200,{'Content-Type':'text/html'});//{} is json obj //use type text/html when utilizing html
            response.write(data.toString());
        }
        //Send a response to the body of the html
        response.end();
    }

}).listen(3000);//listen to 3000 port on computer

console.log("Server is running on port 3000");
