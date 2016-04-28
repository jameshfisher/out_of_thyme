/*

  cat /dev/cu.usbmodem1411 | node read.js

*/

const http = require('http')
const https = require('https')


const url = 'salty-earth-31929.herokuapp.com'



var readline = require('readline');
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

rl.on('line', function(line){

    var num = parseFloat(line.toString())

    if(num == 2) {
        set('thyme', 'empty')
    }
    if(num == 3) {
        set('thyme', 'full')
    }
})


function set(herb, state) {
  console.log(`setting ${herb} to ${state}`)

  var postData = state

  var options = {
    hostname: 'salty-earth-31929.herokuapp.com',
    port: 443,
    path: `/rack/${herb}`,
    method: 'POST',
    headers: {
      'Content-Length': postData.length
    }
  };

  var req = https.request(options, (res) => {
    res.on('data', (chunk) => {
      console.log(`HERB SERVER> ${chunk}`);
    })
  });

  req.on('error', (e) => {
    console.error(`HERB SERVER PROBLEMS: ${e.message}`);
  });

  req.write(postData);
  req.end();

}
