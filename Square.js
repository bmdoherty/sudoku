"use strict"

class Square extends House{
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'square'
        return this
    }  

    isSquare(cells) {
        if(!cells.length){
            return false
        }

        return cells.every( (v,i,a) => v.squareID === a[0].squareID)
    }

    get lockedCandidates() {

        for(let digit of this.unused){
            let possibleCells = this.cells.filter( v => v.possibilities.has(digit))
            
            if( possibleCells.length > 1 ){

                if(this.isRow(possibleCells) ){ 
                    let rowID = possibleCells[0].rowID 
                    let total = this.grid.row[rowID].cells.filter( v => v.possibilities.has(digit))

                    if(possibleCells.length < total.length){
                        let house = {'type':'row', 'id':rowID}
                        let ids = possibleCells.map( v => v.id)
                        return {'ids':ids, 'digit':digit, 'house':house, 'type':'lockedCandidate'}  
                    }
                }   
           
                if(this.isColumn(possibleCells)){   
                    let columnID = possibleCells[0].columnID      
                    let total = this.grid.column[columnID].cells.filter( v => v.possibilities.has(digit))
                    
                    if(possibleCells.length < total.length){                       
                        let house = {'type':'column', 'id':columnID}
                        let ids = possibleCells.map( v => v.id)
                        return {'ids':ids, 'digit':digit, 'house':house, 'type':'lockedCandidate'} 
                    }
                }               
            }                  
        }

        return undefined
    } 

}
