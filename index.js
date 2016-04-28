var http = require('http');

global.state = {};

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

setHerbState('thyme', 'empty');
setHerbState('oregano', 'empty');
setHerbState('basil', 'empty');
setHerbState('sage', 'empty');

var ughReadBody = function(request, cb) {
  var body = '';
  request.on('data', function (data) {
    body += data;
  });
  request.on('end', function () {
    cb(body);
  });
};

var server = http.createServer(function (request, response) {
  if (request.url === "/") {
    response.end(JSON.stringify(global.state));
  } else {
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
  }
});

var port = process.env.PORT || 5000;

server.listen(port);

console.log("Server running at http://127.0.0.1:" + port + "/");
