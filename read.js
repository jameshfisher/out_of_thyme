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

const herbs = [
'satureja',
'origanum',
'salvia',
'mentha',
'petroselinum',
'cichorium',
'carum',
'melissa',
'lavendula',
'levisticum',
'calendula',
'hypericum',
'tanacetum',
'linium'
]


const SELECTING_HERB = 1
const SELECTING_HERB_STATUS = 2

var current = null
var mode = SELECTING_HERB

function reset() {
  current = null
  console.log('resetted')
}

var timer

rl.on('line', function(line){

    var num = parseFloat(line.toString())

    clearTimeout(timer)

    if(current) {
      if(num == 2) {
          set(current, 'empty')
      }
      if(num == 3) {
          set(current, 'full')
      }
      reset()
    } else {
      
      current = herbs[(num-1) % herbs.length]

      timer = setTimeout(reset, 15000)
    }


    //
    // if(mode === SELECTING_HERB) {
    //   current = herbs[(num-1) % herbs.length]
    //   console.log("Selected: " + current)
    //   mode = SELECTING_HERB_STATUS
    // } else {
    //   if(num == 1) {
    //       mode = SELECTING_HERB
    //   }
    //   if(num == 2) {
    //       set(current, 'empty')
    //   }
    //   if(num == 3) {
    //       set(current, 'full')
    //   }
    // }


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
