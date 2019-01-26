// MIT License
//
// Copyright (c) 2019 Alexandru Catrina
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

const { Char, CharError } = require(`${__dirname}/char`)

const UNDEF_T  = 'undefined'
const NO_LIMIT = -1

/*
 * An array wrapper for immutable unicode chars
 */
class CharArray {

    constructor (limit) {
        this._array = []
        this._limit = NO_LIMIT
        if (typeof limit !== UNDEF_T) {
            this.setLimit(limit)
        }
    }

    getArray () {
        return this._array
    }

    setArray () {
        throw new CharError(`Direct array update is not allowed`)
    }

    getArraySize () {
        return this._array.length
    }

    setArraySize () {
        throw new CharError(`Direct array size update is not allowed`)
    }

    get array () {
        return this.getArray()
    }

    set array (arr) {
        return this.setArray(arr)
    }

    get size () {
        return this.getArraySize()
    }

    set size () {
        return this.setArraySize()
    }

    getLimit () {
        return this._limit
    }

    setLimit (limit) {
        let limit_ = parseInt(limit)
        if (limit_ && !isNaN(limit_)) {
            this._limit = limit_
        } else {
            throw new CharError(`Cannot set non-integer as array limit`)
        }
    }

    get limit () {
        return this.getLimit()
    }

    set limit (val) {
        return this.setLimit(val)
    }

    write (char, index = -1) {
        if (char instanceof Char) {
            if (this._limit > NO_LIMIT && + this._array.length >= this._limit) {
                throw new CharError(`Cannot add char to array: reached limit ${this._array.length} >= ${this._limit}`)
            }
            let idx = parseInt(index)
            if (idx && !isNaN(idx)) {
                if (idx > -1) {
                    this._array.splice(idx, 0, char)
                } else {
                    this._array.push(char)
                    idx = this._array.length - 1
                }
                return idx
            } else {
                throw new CharError(`Provided index is not an integer`)
            }
        } else {
            throw new CharError(`Cannot add non-char instance to array`)
        }
    }

    erase (index) {
        if (index > -1) {
            if (this._array.length > index) {
                return this._array.splice(index, 1)
            } else {
                throw new CharError(`Cannot lookup index beyond array length`)
            }
        } else {
            throw new CharError(`Cannot lookup negative index to remove`)
        }
    }

    writeString (string) {
        if (string && string === string.toString()) {
            string.toString().split('').forEach(s => this.write(new Char(s)))
        } else {
            throw new CharError(`Cannot write to array: expected string, got ${typeof string}`)
        }
    }
}


module.exports = { CharArray, NO_LIMIT, UNDEF_T }
