const {
    Display, LShape, JShape, Square, Tee, Line, RSquiggle, LSquiggle
} = require("./blockris.js");

const {
    FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite, FgRed
} = require("./colors.js");

const keypress = require('keypress');

const DISPLAY_WIDTH = 20;
const DISPLAY_HEIGHT = 27;

let display = new Display(DISPLAY_WIDTH, DISPLAY_HEIGHT);
let center = DISPLAY_WIDTH / 2 | 1;
const shapeTypes = [LShape, JShape, Square, Tee, Line, RSquiggle, LSquiggle];
const colors = [FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite, FgRed];
let shapes = [];
let currentShape = null;

function randomShape() {
    let shapeIdx = Math.floor(Math.random() * 7);
    let colorIdx = Math.floor(Math.random() * 7);
    let shape = new shapeTypes[shapeIdx]([0, 0], colors[colorIdx]);
    shape.position[0] = center - shape.matrix[0].length;
    return shape;
}

function checkCollision(currentShape) {
    if (currentShape.touchingBottom(display.sizeY)) return true;
    return shapes.reduce((p, s) =>
        ((s !== currentShape) && currentShape.touchesTopOf(s)) || p
    , false);
}

if (process.argv.length < 3 || process.argv[2] == 'shapes') {
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
    let lsquig = new LSquiggle([17, 5], FgBlue);
    display.addShape(lsquig);
    let lineAtBottom = new Line([17, 20], FgRed);
    display.addShape(lineAtBottom.rotateRight());
    display.draw();
}

if (process.argv.length > 2 && process.argv[2] == 'stack') {
    function refresh() {
        if (currentShape == null) {
            currentShape = randomShape();
            shapes.push(currentShape);
        } else {
            currentShape.moveDown();
        }
        console.clear();
        display.draw(shapes);

        if (checkCollision(currentShape)) {
            if (currentShape.position[1] == 0) {
                return;
            }
            currentShape = null;
        }

        setTimeout(refresh, 200);
    }

    refresh();
}

if (process.argv.length > 2 && process.argv[2] == 'row') {
    let currentColorIdx = 0;
    let currentX = 0;
    function doit() {
        console.clear();
        let score = display.deleteFullRow(shapes);
        if (score) {
            display.score += score;
            currentX = 0;
        }
        shapes = display.removeGarbage(shapes);

        if (score) {
            display.draw(shapes);
            setTimeout(doit, 2500);
        }
        else {
            shapes.push(new Line([currentX, 2], colors[currentColorIdx]).rotateLeft());
            currentColorIdx = (currentColorIdx + 1) % colors.length;
            currentX += 4;
            while (currentX+4 > display.sizeX) currentX -= 1;
            display.draw(shapes);
            setTimeout(doit, 250);
        }
    }
    doit();
}

if (process.argv.length > 2 && process.argv[2] == 'game') {
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        // console.log('got "keypress"', key);
        if (! key) return;
        if (key && key.ctrl && key.name == 'c') {
            process.exit();
        }
        switch (key.name) {
            case "right":
                currentShape.moveRight();
                updateDisplay();
                break;
            case "left":
                currentShape.moveLeft();
                updateDisplay();
                break;
            case "space":
                while (!checkCollision(currentShape)) {
                    currentShape.moveDown();
                }
                updateDisplay();
                break;
            case "e":
                currentShape.rotateRight();
                updateDisplay();
                break;
            case "q":
                currentShape.rotateLeft();
                updateDisplay();
                break;
        }
    });

    process.stdin.setRawMode(true);
    process.stdin.resume();

    let currentShape = randomShape();
    display.addShape(currentShape);
    shapes.push(currentShape);

    function updateDisplay() {
        console.clear();
        display.draw();
    }

    function updateGame() {
        if (checkCollision(currentShape)) {
            currentShape = randomShape();
            display.addShape(currentShape);
            shapes.push(currentShape);
            updateDisplay();
            if (checkCollision(currentShape) && currentShape.position[1] == 0) {
                console.log(`Game over. Final score: ${display.score}`);
                process.exit();
            }
        }

        currentShape.moveDown();
        display.score += display.deleteFullRow([]);
        shapes = display.removeGarbage(shapes);
        updateDisplay();
    }

    setInterval(updateGame, 500);
}
