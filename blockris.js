const readline = require('readline');
const {
    Reset, Bright, Dim, Underscore, Blink, Reverse, Hidden, FgBlack, FgRed,
    FgGreen, FgYellow, FgBlue, FgMagenta, FgCyan, FgWhite, FgGray, BgBlack,
    BgRed, BgGreen, BgYellow, BgBlue, BgMagenta, BgCyan, BgWhite, BgGray
} = require('./colors.js');


function generateGameSpace(width, height){
    let space = [];
    for(let b = 0; b < height; b++){
        space.push(Array(width).fill(0));
    }
    return space;
}

function plotMatrix(matrix, colorMap){
    let rows = [];
    let nothing = "  ";
    let block = "██";
    for(let a = 0; a < matrix.length; a++){
        let row = "";
        for(let b = 0; b < matrix[a].length; b++){
            if (colorMap) {
                if (a < colorMap.length && b < colorMap[a].length) {
                    row += colorMap[a][b];
                } else {
                    row += Reset;
                }
            }
            if(matrix[a][b]){
                row += block;
            } else {
                row += nothing;
            }
        }
        rows.push(row);
        row = "";
    }
    for(let c = 0; c < rows.length; c++){
        console.log(rows[c]);
    }
}

function displayMatrix(matrix) {
    for (let i = 0; i < matrix.length; i++) {
        let row = "" + matrix[i][0];
        for (let j = 1; j < matrix[i].length; j++) {
            row += ",";
            row += matrix[i][j];
        }
        console.log(row);
    }
    console.log("\n");
}

function rotateRight(matrix){
    let newMatrix = [];
    for(let a = 0; a < matrix[0].length; a++){
        let newRow = [];
        for(let b = matrix.length - 1; b >= 0; b--){
            newRow.push(matrix[b][a]);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}

function rotateLeft(matrix){
    let newMatrix = [];
    for(let a = matrix[0].length -1; a >= 0; a--){
        let newRow = [];
        for(let b = 0; b < matrix.length; b++){
            newRow.push(matrix[b][a]);
        }
        newMatrix.push(newRow);
    }
    return newMatrix;
}

function calculateOffsetMatrix(shape){
    let offsetX = shape.position[0];
    let offsetY = shape.position[1];
    let offsetMatrix = [];
    for(let a = 0; a < shape.matrix.length + offsetY; a++){
        let newRow = [];
        for(let b = 0; b < shape.matrix[0].length + offsetX; b++){
            if((a < offsetY) || (b < offsetX)) {
                newRow.push(0);
            } else {
                newRow.push(shape.matrix[a - offsetY][b - offsetX]);
            }
        }
        offsetMatrix.push(newRow);
    }
    return offsetMatrix;
}

function combineMatrices(matrix1, matrix2){
    for(let a = 0; a < matrix2.length; a++){
        for(let b = 0; b < matrix2[a].length; b++){
            if(matrix2[a][b]){
                matrix1[a][b] = matrix2[a][b];
            }
        }
    }
}

function shapesTouch(shape1, shape2) {
    let matrix1 = calculateOffsetMatrix(shape1);
    let matrix2 = calculateOffsetMatrix(shape2);

    for (let y = 0; y < matrix1.length; y++) {
        if (y >= matrix2.length) break;
        for (let x = 0; x < matrix1[y].length; x++) {
            if (x > matrix2[y].length) break;
            if (matrix1[y][x] == 0) continue;

            if (matrix2[y][x] == 1) return true; // identical cells
            if (y > 0 && matrix2[y-1][x] == 1) return true; // above
            if (y < matrix2.length - 1 && matrix2[y+1][x] == 1) return true; // below
            if (x > 0 && matrix2[y][x-1] == 1) return true; // left
            if (x < matrix2[y].length && matrix2[y][x+1] == 1) return true; // right
        }
    }
    return false; // no touches found
}

function replaceMatrixValues(matrix, map) {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (map.hasOwnProperty(matrix[i][j])) {
                matrix[i][j] = map[matrix[i][j]];
            }
        }
    }
}


class Shape {
    constructor(matrix, position, color) {
        this.matrix = matrix;
        this.position = position;
        this.color = color;
    }

    translate(x, y) {
        this.position = [x, y];
        return this;
    }

    moveUp(count) {
        count = count || 1;
        this.position[1] -= count;
        return this;
    }

    moveDown(count) {
        count = count || 1;
        this.position[1] += count;
        return this;
    }

    moveLeft(count) {
        count = count || 1;
        this.position[0] -= count;
        return this;
    }

    moveRight(count) {
        count = count || 1;
        this.position[0] += count;
        return this;
    }

    rotateRight() {
        this.matrix = rotateRight(this.matrix);
        return this;
    }

    rotateLeft() {
        this.matrix = rotateLeft(this.matrix);
        return this;
    }

    draw(gameSpace) {
        combineMatrices(gameSpace, calculateOffsetMatrix(this));
        return this;
    }

    fullMatrix() {
        return calculateOffsetMatrix(this);
    }

    colorMatrix() {
        let colorMatrix = calculateOffsetMatrix(this);
        replaceMatrixValues(colorMatrix, {1: this.color});
        return colorMatrix;
    }

    touches(otherShape) {
        return shapesTouch(this, otherShape);
    }
}

class Tee extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [0,1,0],
            [1,1,1]
        ], position, color);
    }
}

class Square extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [1, 1],
            [1, 1]
        ], position, color);
    }
}

class LShape extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [1, 0],
            [1, 0],
            [1, 1]
        ], position, color);
    }
}

class JShape extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [0, 1],
            [0, 1],
            [1, 1]
        ], position, color);
    }
}

class Line extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [1],
            [1],
            [1],
            [1]
        ], position, color);
    }
}

class RSquiggle extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [0, 1, 1],
            [1, 1, 0]
        ], position, color);
    }
}

class LSquiggle extends Shape {
    constructor(position, color) {
        color = color || "";
        super([
            [1, 1, 0],
            [0, 1, 1]
        ], position, color);
    }
}

class Display {
    constructor(sizeX, sizeY) {
        this.sizeX = sizeX;
        this.sizeY = sizeY;
        this.shapes = [];
    }

    addShape(shape) {
        this.shapes.push(shape);
    }

    draw(shapes) {
        let gameSpace = generateGameSpace(this.sizeX, this.sizeY);
        let colorMap = generateGameSpace(this.sizeX, this.sizeY);
        replaceMatrixValues(colorMap, {0: Reset});
        shapes = shapes ?? [];
        shapes.forEach(shape => {
            shape.draw(gameSpace);
            combineMatrices(colorMap, shape.colorMatrix());
        });
        this.shapes.forEach(shape => {
            shape.draw(gameSpace);
            combineMatrices(colorMap, shape.colorMatrix());
        });
        plotMatrix(gameSpace, colorMap);
    }
}

module.exports = {
    Shape, Tee, Square, LShape, JShape, Line, RSquiggle, LSquiggle, Display,
    plotMatrix
}
