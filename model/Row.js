"use strict"

import {House} from './House'
import {isSquare} from './Square'

class Row extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'row'

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

export function isRow(cells) {
    if(!cells.length){
        return false
    }

    return cells.every( (v,i,a) => v.rowID === a[0].rowID)
}

module.exports = {Row, isRow}
