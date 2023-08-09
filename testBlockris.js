const {
    Display, LShape, JShape, Square, Tee, Line, RSquiggle, LSquiggle,
    plotMatrix
} = require("./blockris.js");

const {
    FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite
} = require("./colors.js");

let display = new Display(20, 10);
let lshape = new LShape([0, 0], FgGreen);
display.addShape(lshape);
let jshape = new JShape([4, 0], FgYellow);
display.addShape(jshape);
let square = new Square([8, 0], FgBlue);
display.addShape(square);
let tee = new Tee([12, 0], FgMagenta);
display.addShape(tee);
let line = new Line([0, 4], FgCyan);
display.addShape(line);
let rsquig = new RSquiggle([3, 5], FgWhite);
display.addShape(rsquig);
let lsquig = new LSquiggle([8, 5], FgBlue);
display.addShape(lsquig);

// display.shapes.forEach(shape => shape.moveRight().moveDown());

display.draw();
