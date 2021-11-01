"use strict";

/*
Copyright (c) 2016, 2021 Vincent Hiribarren

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/

const SHAPE_O_0 = [
    [0, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_I_0 = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0]
];
const SHAPE_I_1 = [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_T_0 = [
    [0, 0, 1, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_T_1 = [
    [0, 0, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_T_2 = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_T_3 = [
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_S_0 = [
    [0, 0, 1, 1],
    [0, 1, 1, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_S_1 = [
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_Z_0 = [
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_Z_1 = [
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_L_0 = [
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_L_1 = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_L_2 = [
    [0, 1, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_L_3 = [
    [0, 0, 0, 0],
    [0, 0, 0, 1],
    [0, 1, 1, 1],
    [0, 0, 0, 0]
];
const SHAPE_J_0 = [
    [0, 0, 1, 0],
    [0, 0, 1, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 0]
];
const SHAPE_J_1 = [
    [0, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 0]
];
const SHAPE_J_2 = [
    [0, 1, 1, 0],
    [0, 1, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 0, 0]
];
const SHAPE_J_3 = [
    [0, 0, 0, 0],
    [0, 1, 1, 1],
    [0, 0, 0, 1],
    [0, 0, 0, 0]
];

const SHAPE_O = [SHAPE_O_0];
const SHAPE_I = [SHAPE_I_0, SHAPE_I_1];
const SHAPE_T = [SHAPE_T_0, SHAPE_T_1, SHAPE_T_2, SHAPE_T_3];
const SHAPE_L = [SHAPE_L_0, SHAPE_L_1, SHAPE_L_2, SHAPE_L_3];
const SHAPE_J = [SHAPE_J_0, SHAPE_J_1, SHAPE_J_2, SHAPE_J_3];
const SHAPE_S = [SHAPE_S_0, SHAPE_S_1];
const SHAPE_Z = [SHAPE_Z_0, SHAPE_Z_1];

const ShapeType = {
    I: Symbol(),
    O: Symbol(),
    T: Symbol(),
    S: Symbol(),
    Z: Symbol(),
    L: Symbol(),
    J: Symbol(),
};

const shapes = [
    [ShapeType.I, SHAPE_I],
    [ShapeType.O, SHAPE_O],
    [ShapeType.T, SHAPE_T],
    [ShapeType.L, SHAPE_L],
    [ShapeType.J, SHAPE_J],
    [ShapeType.S, SHAPE_S],
    [ShapeType.Z, SHAPE_Z],
];


class RandomShape {
    constructor() {
        const shapeIndex = Math.floor(shapes.length*Math.random());
        this._type = shapes[shapeIndex][0];
        this._sequence = shapes[shapeIndex][1];
        this._rotationIndex = Math.floor(this._sequence.length*Math.random());
        if (this._sequence.length === 0) {
            throw "Error: shape sequence is empty!";
        }
    }
    get type() {
        return this._type;
    }
    getNextLeftRotation() {
        let nextIndex =  (this._rotationIndex - 1);
        if (nextIndex < 0) {
            nextIndex =  this._sequence.length - 1;
        }
        return this._sequence[nextIndex];
    }
    rotateLeft() {
        this._rotationIndex = (this._rotationIndex - 1);
        if (this._rotationIndex < 0) {
            this._rotationIndex = this._sequence.length - 1;
        }
        return this.getShape();
    }
    getNextRightRotation() {
        let nextIndex =  (this._rotationIndex + 1) % this._sequence.length;
        return this._sequence[nextIndex];
    }
    rotateRight() {
        this._rotationIndex = (this._rotationIndex + 1) % this._sequence.length;
        return this.getShape();
    }
    getShape() {
        return this._sequence[this._rotationIndex];
    }
}

module.exports = {ShapeType, RandomShape};
