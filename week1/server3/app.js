//app is entry point of application
var http = require('http');
var url = require('url');

http.createServer(function(request, response){
    var pathName = url.parse(request.url).pathname;
    //http header
    response.writeHead(200,{'Content-type':'text/html'});//{} is json obj //use type text/html when utilizing html
    response.write('<!DOCTYPE><html><body><div>Request  for' + pathName + '</div></body></html>')
    //Send a response to the body of the html
    response.end();
}).listen(3000);//listen to 3000 port on computer

console.log("Server is running on port 3000");
