require('dotenv').config({silent: true})
var http = require('http');
var nodeStatic = require('node-static');

var fileServer = new nodeStatic.Server('.', { indexFile: "index.htm" });

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

  pusher.trigger('herbs', 'update', {
    herb: herb,
    state: herbState
  })
};


const Pusher = require('pusher')
const pusher = new Pusher({
  appId:   process.env.PUSHER_APP_ID,
  key:     process.env.PUSHER_APP_KEY,
  secret:  process.env.PUSHER_SECRET_KEY,
  cluster: process.env.PUSHER_CLUSTER
})

setHerbState('satureja', 'empty');
setHerbState('origanum', 'empty');
setHerbState('salvia', 'empty');
setHerbState('mentha', 'empty');
setHerbState('petroselinum', 'empty');
setHerbState('cichorium', 'empty');
setHerbState('carum', 'empty');
setHerbState('melissa', 'empty');
setHerbState('lavendula', 'empty');
setHerbState('levisticum', 'empty');
setHerbState('calendula', 'empty');
setHerbState('hypericum', 'empty');
setHerbState('tanacetum', 'empty');
setHerbState('linium', 'empty');

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
  if (request.url === "/rack") {
    response.end(JSON.stringify(global.state));
  } else if (request.url.startsWith("/rack/")) {
    var herb = request.url.substr(6);
    response.writeHead(200, {"Content-Type": "text/plain"});
    if (request.method == 'GET') {
      response.end(getHerbState(herb));
    } else {
      ughReadBody(request, function(body) {
        setHerbState(herb, body);
        response.end(body);
      });
    }
  } else {
    fileServer.serve(request, response);
  }
});

var port = process.env.PORT || 5000;

server.listen(port);

console.log("Server running at http://127.0.0.1:" + port + "/");
