"use strict";

function main() {
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  var program = webglUtils.createProgramFromScripts(gl, ["vertex-shader-2d", "fragment-shader-2d"]);

  var positionLocation = gl.getAttribLocation(program, "a_position");

  var resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");
  var translationLocation = gl.getUniformLocation(program, "u_translation");

  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  var translation = [100, 150];
  var color = [Math.random(), Math.random(), Math.random(), 1];

  drawScene();

  webglLessonsUI.setupSlider("#x", {value: translation[0], slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {value: translation[1], slide: updatePosition(1), max: gl.canvas.height});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    var size = 2;          
    var type = gl.FLOAT;   
    var normalize = false; 
    var stride = 0;        
    var offset = 0; 

    gl.vertexAttribPointer(
        positionLocation, size, type, normalize, stride, offset);
    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);
    gl.uniform4fv(colorLocation, color);
    gl.uniform2fv(translationLocation, translation);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 18; 
    gl.drawArrays(primitiveType, offset, count);
  }
}

function setGeometry(gl) {
  gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([
          0, 0,
          30, 0,
          0, 150,
          0, 150,
          30, 0,
          30, 150,

          30, 0,
          100, 0,
          30, 30,
          30, 30,
          100, 0,
          100, 30,

          30, 60,
          67, 60,
          30, 90,
          30, 90,
          67, 60,
          67, 90,
      ]),
      gl.STATIC_DRAW);
}

main();
