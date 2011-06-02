var http = require('http');
var apps = require('../appserver.js');

var PORT = 3456;

var appserver = new apps.AppServer();
appserver.add('Cat', '/cat', '/bin/cat');
appserver.add('Sorter', '/sorter', './sorter.rb');

http.createServer(function(req, res) {
  if (!appserver.serve(req, res)) {
    res.writeHead(404);
    res.end("No such app");
  }
}).listen(PORT);

console.log('Listening at http://localhost:' + PORT + '/');
