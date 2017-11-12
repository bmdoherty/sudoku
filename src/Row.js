import {House} from './House'


export default class Row extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'row'

        return this

        
    }  
}

export function isRow(cells) {
    if(!cells.length){
        return false
    }

    return cells.every( (v,i,a) => v.rowID === a[0].rowID)
}