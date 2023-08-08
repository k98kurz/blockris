const readline = require('readline');

function generateGameSpace(width, height){
    let space = [];
    for(let b = 0; b < height; b++){
        space.push(Array(width));
    }
    return space;
}

function plotMatrix(matrix){
    let rows = [];
    let nothing = ".";
    let block = "█";
    for(let a = 0; a < matrix.length; a++){
        let row = "";
        for(let b = 0; b < matrix[a].length; b++){
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

function assignOffset(shape){
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

function combineMatrices(gameSpace, matrix){
    for(let a = 0; a < matrix.length; a++){
        for(let b = 0; b < matrix[a].length; b++){
            if(matrix[a][b] == 1){
                gameSpace[a][b] = 1;
            }
        }
    }
}

function shapesTouch(shape1, shape2) {
    let matrix1 = assignOffset(shape1);
    let matrix2 = assignOffset(shape2);

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


class Shape {
    constructor(matrix, position) {
        this.matrix = matrix;
        this.position = position;
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
        combineMatrices(gameSpace, assignOffset(this));
        return this;
    }

    touches(otherShape) {
        return shapesTouch(this, otherShape);
    }
}

class Tee extends Shape {
    constructor(position) {
        super([
            [0,1,0],
            [1,1,1]
        ], position);
    }
}

class Square extends Shape {
    constructor(position) {
        super([
            [1, 1],
            [1, 1]
        ], position);
    }
}

class LShape extends Shape {
    constructor(position) {
        super([
            [1, 0],
            [1, 0],
            [1, 1]
        ], position)
    }
}

class JShape extends Shape {
    constructor(position) {
        super([
            [0, 1],
            [0, 1],
            [1, 1]
        ], position)
    }
}

class Line extends Shape {
    constructor(position) {
        super([
            [1],
            [1],
            [1],
            [1]
        ], position)
    }
}

class RSquiggle extends Shape {
    constructor(position) {
        super([
            [0, 1, 1],
            [1, 1, 0]
        ], position)
    }
}

class LSquiggle extends Shape {
    constructor(position) {
        super([
            [1, 1, 0],
            [0, 1, 1]
        ], position)
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
        shapes = shapes || [];
        shapes.forEach(shape => {
            shape.draw(gameSpace);
        });
        this.shapes.forEach(shape => {
            shape.draw(gameSpace);
        });
        return gameSpace;
    }
}

module.exports = {
    Shape, Tee, Square, LShape, JShape, Line, RSquiggle, LSquiggle, Display,
    plotMatrix
}
