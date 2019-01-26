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

const ENCODING  = `utf-8`
const BYTE_SIZE = 4 // max unicode byte size
const U_LENGTH  = 1 // unit length
const S_INVALID = -1 // invalid default byte size
const __CHARS__ = new Set()

/*
 * Error wrapper
 */
class CharError extends Error { /* inherit */ }

/*
 * Immutable Unicode Character
 */
class Char {

    static get CHARS () {
        return __CHARS__
    }

    static get BYTE_SIZE () {
        return BYTE_SIZE
    }

    static get U_LENGTH () {
        return U_LENGTH
    }

    static get ENCODING () {
        return ENCODING
    }

    static Create (char) {
        if (!char) {
            throw new CharError(`Cannot create char from non-existing argument`)
        }
        let _char = null
        for (let c of Char.CHARS) {
            if (c.value === char) {
                _char = c
            }
        }
        if (!_char) {
            _char = new Char(char)
            Char.CHARS.add(_char)
        }
        return _char
    }

    static Error (message) {
        return new CharError(message || `generic error`)
    }

    static Copy (char) {
        if (char instanceof Char && char.hasValue()) {
            let c = new Char()
            return c.setValue(char.getValue())
        }
        throw new CharError(`Cannot copy from non-char`)
    }

    constructor (char) {
        this._buff = Buffer.alloc(Char.BYTE_SIZE)
        this._size = S_INVALID
        if (typeof char !== 'undefined') {
            this.setValue(char)
        }
    }

    setValue (value) {
        if (value && value === value.toString()) {
            if (this._size > S_INVALID) {
                throw new CharError(`Char already set`)
            } else {
                let strValue = value.toString()
                if (strValue.length === Char.U_LENGTH) {
                    this._buff.write(strValue)
                    this._size = Buffer.byteLength(strValue)
                } else {
                    throw new CharError(`Value exceeds one unit in length`)
                }
            }
        } else {
            throw new CharError(`Char must take value from string, not ${typeof value}: ${value}`)
        }
        return this
    }

    getValue () {
        if (this.hasValue()) {
            return this._buff.toString(Char.ENCODING, 0, this._size)
        }
        throw new CharError(`Char is not set`)
    }

    hasValue () {
        return this._size > S_INVALID
    }

    getHexValue () {
        if (this.hasValue()) {
            let hex = this._buff.toString('hex')
            return `0x${hex}`
        }
        throw new CharError(`Char is not set`)
    }

    get value () {
        return this.getValue()
    }

    set value (value) {
        return this.setValue(value)
    }

    get hex () {
        return this.getHexValue()
    }

    set hex () {
        throw new CharError(`Cannot set hex value`)
    }
}


module.exports = { Char, CharError, BYTE_SIZE, ENCODING }
