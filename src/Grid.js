import Cell from './Cell'
import Row from './Row'
import Column from './Column'
import Square from './Square'

export default class Grid {
    constructor(text) {
        this.cells = this.textToCells(text)
        this.square = []
        this.row = []   
        this.column = []   
        this.house = []           

        for(let i=0; i<9; i++){
            this.row.push( new Row(i, this.getRow(i), this))
            this.column.push( new Column(i, this.getColumn(i), this))
            this.square.push( new Square(i, this.getSquare(i), this))
        }

        this.house.push( ...this.row, ...this.column, ...this.square )   
    };

    textToCells(text) {
        let cells = []
        let rows = text.match(/.{1,9}/g)
        let digitArray = []

        for(let i=0; i<9; i++){
            digitArray[i] = rows[i].split('').map(Number)
        }

        for(let r=0; r<9; r++){
            for(let c=0; c<9; c++){
                let locked = !!digitArray[r][c]
                cells.push( new Cell(this, r, c, digitArray[r][c], locked) )
            }
        }

        return cells  
    }  

    getSquare(id) {
        return this.cells.filter( v => v.squareID === id)  
    }  
    
    getRow(id) {
        return this.cells.filter( v => v.rowID === id)  
    }  

    getColumn(id) {
        return this.cells.filter( v => v.columnID === id)  
    }          
}