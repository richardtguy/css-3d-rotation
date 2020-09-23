function matrixArrayToCSSMatrix(array) {
  if (array.length != 16) {
    throw new TypeError(`Invalid argument to matrixArrayToCSSMatrix: ${array} (must be an array of length 16)`)
  }
  return 'matrix3d(' + array.join(',') + ')';
}

function CSSMatrixToMatrixArray(matrix) {
  array = matrix.split("(")[1].split(")")[0].split(",");
  if (array.length == 16) {
    // return 3D transformation matrix
    return array;
  } else if (array.length == 6) {
    return [
      array[0], array[1], 0, 0,
      array[2], array[3], 0, 0,
      0, 0, 1, 0,
      array[4], array[5], 0, 1
    ];
  } else {
    throw new TypeError(`Invalid argument to CSSMatrixToMatrixArray: ${matrix} (must be 3D CSS matrix)`);
  }
}

function rotate(obj, axis, degrees) {
  // rotate an object around the x, y or z axes

  // validate arguments
  if (typeof(axis) != "string" || ['x', 'y', 'z'].indexOf(axis) == -1) {
    throw new TypeError(`Invalid argument 2 ('axis') to rotate: ${axis} (must be 'x', 'y' or 'z')`)
  }
  if (typeof(degrees) != "number") {
    throw new TypeError(`Invalid argument 3 ('degrees') to rotate: ${degrees} (must be a number)`)
  }

  // apply rotation to object
  let computedMatrix = window.getComputedStyle(obj).transform;
  if (computedMatrix == 'none') {
    var m = mat4.create();
  } else {
    var m = CSSMatrixToMatrixArray(window.getComputedStyle(obj).transform);
  }
  if (axis == 'x') {
    mat4.rotateX(m, m, degrees * Math.PI / 180);
  }
  if (axis == 'y') {
    mat4.rotateY(m, m, degrees * Math.PI / 180);
  }
  if (axis == 'z') {
    mat4.rotateZ(m, m, degrees * Math.PI / 180);
  }
  obj.style.transform = matrixArrayToCSSMatrix(m);

}

var rotateMe = document.getElementsByClassName("inner")[0];
document.addEventListener("keydown", function(e) {
  console.log(e.code)
  if (e.code == "ArrowUp") {
    rotate(rotateMe, 'x', 180);
  } else if (e.code == "ArrowDown") {
    rotate(rotateMe, 'x', -180);
  } else if (e.code == "ArrowLeft") {
    rotate(rotateMe, 'z', 30);
  } else if (e.code == "ArrowRight") {
    rotate(rotateMe, 'z', -30);
  }
})

// initialise glMatrix library
glMatrix.setMatrixArrayType(Array);
