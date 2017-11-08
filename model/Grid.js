import {Cell} from './Cell'
import Row from './Row'
import Column from './Column'
import Square from './Square'

import NakedSingle from './strategies/nakedSingle'
import HiddenSingle from './strategies/hiddenSingle'
import Naked from './strategies/naked'
import Hidden from './strategies/hidden'
import LockedCandidate from './strategies/lockedCandidate'
import XYChain from './strategies/XYChain'
import Fish from './strategies/fish'

const ns = new NakedSingle()
const hs = new HiddenSingle()
const n = new Naked()
const h = new Hidden()
const lc = new LockedCandidate()
const f = new Fish()
const xy = new XYChain()

const strategies = [ns,hs,n,h,lc,f,xy]

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
        let rows = text.split(/\n/).filter( v => v.length > 0)
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

    isSolved() {
        let isSolved = true
        for(let i=0; i<9; i++){      
            if ( this.row[i].isSolved === false){
                isSolved = false
            }           
        }    
        
        return isSolved
    }    

    next (){
        let next 

        for(let i in strategies){
            next = strategies[i].find(this)
            if(next){
                return next
            }            
        }       
    }

    solve() {
        let i = 1      
        let nextStep = this.next()

        while( !this.isSolved() && nextStep){            
            this.apply(nextStep)
            nextStep = this.next()
            i = i + 1
        }
        
        return this
    }     
    
    apply(step) {
        step.strategy.apply(this, step)

        return 
    }      
}