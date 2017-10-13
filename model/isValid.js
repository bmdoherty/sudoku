"use strict"

function isValid(grid) {    
    function findUnassigned(grid) {
        return grid.cells.filter( v => v.digit == 0)[0]
    }  

    if( grid.isSolved() ){
        return true
    }

    let unassignedCell = findUnassigned(grid)

    for(let digit=1; digit<=9; digit++){ 
        if( unassignedCell.possibilities.has(digit) ){              
            unassignedCell.digit = digit
            if( isValid(grid) ){
                console.log( grid.row[0].cells.map( v => v.digit) )
                return true
            }   

            unassignedCell.digit = 0
        }    
    }

    return false
}

module.exports = {isValid}