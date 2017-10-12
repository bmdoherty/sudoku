"use strict"

class Column extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'column'
        return this
    }   
    
    isColumn(cells) {
        if(!cells.length){
            return false
        }
    
        return cells.every( (v,i,a) => v.columnID === a[0].columnID)
    }
}

