function getTextPixels(text, size) {
  var canvas = document.createElement("canvas");
  var context = canvas.getContext("2d");

  var font = size + "px Arial";

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

function getTextClosure(text) {
  var t = text;
  var i = 0;
  return function() {
    var ret = t[i];
    i = (i + 1) % t.length;
    return ret;
  }
}

window.onload = function() {
  var data = getTextPixels("404", 30);
  var text = [];
  var getNextChar = getTextClosure("FILENOTFOUND");

  for (var y = 0; y < data.height; y++) {
    var row = []
    for (var x = 0; x < data.width; x++) {
      row.push(" ");
    }
    text.push(row);
  }

  console.log(text);

  for (var y = 0; y < data.height; y++) {
    for (var x = 0; x < data.width; x++) {
      var pixelIndex = ((y * data.width) + x);
      var alphaIndex = pixelIndex * 4 + 3;
      if (data.data[alphaIndex] == undefined) {
        alert("WHY DOES undefined EVEN EXIST? THROW A FUCKING EXCEPTION!");
      }
      if (data.data[alphaIndex] != 0) {
        c = getNextChar();
        text[y][x] = c;
      } 
    }
  }

  var pre = document.getElementById("my_pre");
  for (var i = 0; i < text.length; i++) {
    pre.innerHTML += text[i].join("") + "\n";
  }
}
