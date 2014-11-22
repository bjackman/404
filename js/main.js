function getTextPixels(text, size) {
  // var canvas = document.createElement("canvas");
  var canvas = document.getElementById("my_canvas");
  var context = canvas.getContext("2d");

  console.log(context.font);
  context.font=size + "px monospace";
  console.log(context.font);
  canvas.width = context.measureText(text).width;
  canvas.height = size;

  console.log(canvas.width, canvas.height);

  context.fillText(text, 0, size);

  return context.getImageData(0, 0, canvas.width, canvas.height);
}

function getTextClosure(text) {
  var t = text;
  var i = 0;
  return function() {
    var ret = t[i];
    i = (i + 1) % t.length;
    return ret;
  }
}

document.onready = function() {
  var data = getTextPixels("404", 20);
  var text = "";
  var getNextChar = getTextClosure("FILENOTFOUND");

  for (var y = 0; y < data.height; y++) {
    for (var x = 0; x < data.width; x++) {
      var pixelIndex = ((y * data.width) + x) * 4 + 3;
      if (data.data[pixelIndex] == undefined) {
        alert();
      }
      if (data.data[pixelIndex] != 0) {
        text += getNextChar();
      } else {
        text += ' ';
      }
    }
    text += "\n"
  }

  var pre = document.getElementById("my_pre");
  pre.innerHTML = text;
}
