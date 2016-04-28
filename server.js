// Load the http module to create an http server.
var http = require('http');
var fs = require('fs');

global.state = {'thyme': 'empty'};

var getHerbState = function (herb) {
  if (global.state.hasOwnProperty(herb)) {
    return global.state[herb];
  } else {
    return 'empty';
  }
};

var setHerbState = function (herb, herbState) {
  global.state[herb] = herbState;
};

var ughReadBody = function(request, cb) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    cb(body);
  });
};

// Configure our HTTP server to respond with Hello World to all requests.
var server = http.createServer(function (request, response) {
  var herb = request.url.substr(1);
  response.writeHead(200, {"Content-Type": "text/plain"});
  if (request.method == 'GET') {
    response.end(getHerbState(herb));
  } else {
    ughReadBody(request, function(body) {
      setHerbState(herb, body);
      response.end(body);
    });
  }
});

// Listen on port 8000, IP defaults to 127.0.0.1
server.listen(8000);

// Put a friendly message on the terminal
console.log("Server running at http://127.0.0.1:8000/");
