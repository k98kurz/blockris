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

function newShape(shapeIdx) {
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
            while (currentX + 4 > display.sizeX) currentX -= 1;
            display.draw(shapes);
            setTimeout(doit, 250);
        }
    }
    doit();
}

if (process.argv.length > 2 && process.argv[2] == 'game') {
    // make `process.stdin` begin emitting "keypress" events
    keypress(process.stdin);
    let interval = 0;

    // listen for the "keypress" event
    process.stdin.on('keypress', function (ch, key) {
        // console.log('got "keypress"', ch, key);
        if (["1", "2", "3", "4", "5", "6", "7"].indexOf(ch) != -1) {
            display.shapes = display.shapes.filter(p => p != currentShape);
            switch (ch) {
                case "1":
                    currentShape = newShape(0);
                    break;
                case "2":
                    currentShape = newShape(1);
                    break;
                case "3":
                    currentShape = newShape(2);
                    break;
                case "4":
                    currentShape = newShape(3);
                    break;
                case "5":
                    currentShape = newShape(4);
                    break;
                case "6":
                    currentShape = newShape(5);
                    break;
                case "7":
                    currentShape = newShape(6);
                    break;
            }
            display.addShape(currentShape);
            updateDisplay();
        }

        if (!key) return;
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
            case "up":
                currentShape.moveUp();
                updateDisplay();
                break;
            case "down":
                currentShape.moveDown();
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
            case "p":
                if (interval !== 0) {
                    clearInterval(interval);
                    interval = 0;
                } else {
                    interval = setInterval(updateGame, 500);
                }
                break;
            // case "o":
            // break;
            case "c":
                display.shapes = [];
                shapes = [];
                updateDisplay();
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
        let score = display.deleteFullRow([]);
        display.score += score;
        for (let i = 0; i < shapes.length; i++) {
            if (shapes[i] == currentShape) continue;
            while (!checkCollision(shapes[i])) {
                shapes[i].moveDown();
            }
        }
        shapes = display.removeGarbage(shapes);
        updateDisplay();
    }

    interval = setInterval(updateGame, 500);
}
