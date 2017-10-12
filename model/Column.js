"use strict"

import {House} from './House'
import {isSquare} from './Square'

class Column extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'column'
        return this
    }   

    get lockedCandidates() {
        
        for(let digit of this.unused){
            let possibleCells = this.cells.filter( v => v.possibilities.has(digit))
            
            if( possibleCells.length > 1 ){
                if(isSquare(possibleCells)){   
                    let squareID = possibleCells[0].squareID      
                    let total = this.grid.square[squareID].cells.filter( v => v.possibilities.has(digit))
                    
                    if(possibleCells.length < total.length){                     
                        let house = {'type':'square', 'id':squareID}
                        let ids = possibleCells.map( v => v.id)
                        return {'ids':ids, 'digit':digit, 'house':house, 'type':'lockedCandidate'} 
                    }
                }                 
            }                  
        }

        return undefined
    }       
}

function isColumn(cells) {
    if(!cells.length){
        return false
    }

    return cells.every( (v,i,a) => v.columnID === a[0].columnID)
}

module.exports = {Column, isColumn}