"use strict"

import {Grid} from './Grid'

function isValid(text) {    

    let grid = new Grid(text).solve()
    
    if(grid.cells.filter( v => v.digit != 0).length < 17){
        return false
    }

    if( grid.isSolved() ){
        return true
    }


    return false
}

module.exports = {isValid}