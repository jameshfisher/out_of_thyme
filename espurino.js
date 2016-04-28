/*

Wiring instructions: plug stuff in.

3.3v -> black
B4 -> Blue
B6 -> Red

*/



// number of clicks within .5s of each other

function clickListener(count){
  console.log(count);
  notify(count);
}



var num = 0;
var timer;

pinMode(B4, "input_pulldown");
setWatch(function(state) {

  num++;
  if(timer) clearTimeout(timer);
  timer = setTimeout(function(){
    timer = null;
    clickListener(num);
    num = 0;
  }, 500);


  digitalPulse(LED2, 1, 150);

}, B4, { repeat: true, debounce : 20, edge: "rising" });


function notify(num) {
  for(var i = 0; i < num; i++) {
    setTimeout(digitalPulse, i * 150, B6, 0, 50);
  }
}

// hello there!
notify(10);
