/*

  DO NOT READ THIS CODE

  NOT EVEN ONCE

*/

/*
  WARNING: THIS FUNCTION IS FUCKING ABSURD
*/
function getTextPixels(text, size) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var font = size + "px bold";

  // Measure how big the text will be
  context.font = font

  // Resize the canvas so it's totally filed by the text.
  // Seems like usually about 25% is vertical spacing, so knock that off.
  canvas.width = context.measureText(text).width;
  canvas.height = size * 0.75

  // For some reason resizing the canvas resets the font. I wonder if that's
  // supposed to happen?
  // Anyway, set it again
  context.font = font

  context.fillText(text, 0, canvas.height);

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

/*
  TURN BACK
*/

function getTextClosure(text) {
  var t = text;
  var i = 0;
  return function() {
    var ret = t[i];
    i = (i + 1) % t.length;
    return ret;
  }
}

/*
  GLOBAL VARIABLES MOTHERFUCKER

  DON'T SAY I DIDN'T WARN YOU
*/

var osc;
var gain;
var context;

function initNoise() {
  context = new AudioContext();

  osc = context.createOscillator();
  osc.frequency.value=1000;
  osc.type = "square"
  gain = context.createGain();

  gain.gain.value = 0;
  osc.start();

  osc.connect(gain);
  gain.connect(context.destination);
}

function makeNoise() {
  console.log("noise");
  gain.gain.setValueAtTime(0.08, context.currentTime);
  gain.gain.linearRampToValueAtTime(0, context.currentTime + 0.05);
}

window.onload = function() {
  var data = getTextPixels("404", 30);
  var text = [];
  var getNextChar = getTextClosure("FILENOTFOUND");

  initNoise();

  for (var y = 0; y < data.height; y++) {
    var row = []
    for (var x = 0; x < data.width; x++) {
      row.push(" ");
    }
    text.push(row);
  }

  function squash(text) {
    var ret = "";
    for (var i = 0; i < text.length; i++) {
      ret += text[i].join("") + "\n";
    }
    return ret;
  }

  var pre = document.getElementById("my_pre");


  /*
    WHY ARE YOU STILL HERE

    THIS NEXT BIT IS THE WORST
  */

  var y = 0; var x = 0;
  function f() {
    if (y >= data.height) {
      return;
    }

    var pixelIndex = ((y * data.width) + x) * 4 + 3;

    if (data.data[pixelIndex] == undefined) {
      alert("WHY DOES undefined EVEN EXIST? THROW A FUCKING EXCEPTION!");
    }

    var runInstantly = false;

    if (data.data[pixelIndex] != 0) {
      c = getNextChar();
      text[y][x] = c;
      pre.innerHTML = squash(text);
      makeNoise();
      window.setTimeout(f, 50);
    } else {
      window.setTimeout(f, 10);
    }

    /*
      HOLD ON TO YOUR BUTTS
    */
    x = (x + 1) % data.width;
    if (x == 0) {
      y++
    }
    /*
      WHAT THE ACTUAL FUCK

      WHO WOULD WRITE THAT
    */

    if (runInstantly) {
      f();
    }
  }

  f();
}

/* 
  THANK YOU FOR RIDING MR BONES' WILD RIDE
*/
