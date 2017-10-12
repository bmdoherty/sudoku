"use strict"

import {Grid} from './Grid'

function f(text) {
    console.time('timer')

    let grid = new Grid(text)

    grid.solve()

    console.timeEnd('timer')
    return  grid
}

module.exports = {f}


