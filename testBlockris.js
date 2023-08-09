const {
    Display, LShape, JShape, Square, Tee, Line, RSquiggle, LSquiggle
} = require("./blockris.js");

const {
    FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite
} = require("./colors.js");

let shapes = [];
let display = new Display(50, 25);
let lshape = new LShape([0, 0], FgGreen);
shapes.push(lshape);
let jshape = new JShape([4, 0], FgYellow);
shapes.push(jshape);
let square = new Square([8, 0], FgBlue);
shapes.push(square);
let tee = new Tee([12, 0], FgMagenta);
shapes.push(tee);
let line = new Line([0, 4], FgCyan);
shapes.push(line);
let rsquig = new RSquiggle([3, 5], FgWhite);
shapes.push(rsquig);
let lsquig = new LSquiggle([17, 5], FgBlue);
shapes.push(lsquig);

display.draw(shapes);
