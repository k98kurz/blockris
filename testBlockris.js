const blockris = require("./blockris.js");

const {Display, LShape, JShape, Square, Tee, Line, RSquiggle, LSquiggle, plotMatrix} = blockris;

let display = new Display(20, 10);
let lshape = new LShape([0, 0]);
display.addShape(lshape);
let jshape = new JShape([4, 0]);
display.addShape(jshape);
let square = new Square([8, 0]);
display.addShape(square);
let tee = new Tee([12, 0]);
display.addShape(tee);
let line = new Line([0, 4]);
display.addShape(line);
let rsquig = new RSquiggle([3, 5]);
display.addShape(rsquig);
let lsquig = new LSquiggle([8, 5]);
display.addShape(lsquig);

// display.shapes.forEach(shape => shape.moveRight().moveDown());

let gameSpace = display.draw();

plotMatrix(gameSpace);