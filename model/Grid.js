"use strict"

import {Cell} from './Cell'
import {Row} from './Row'
import {Column} from './Column'
import {Square} from './Square'

class Grid {
    constructor(text) {
        this.cells = this.textToCells(text)
        this.square = []
        this.row = []   
        this.column = []   

        for(let i=0; i<9; i++){
            this.row.push( new Row(i, this.getRow(i), this))
            this.column.push( new Column(i, this.getColumn(i), this))
            this.square.push( new Square(i, this.getSquare(i), this))
        }
    };

    textToCells(text) {
        let cells = []
        let rows = text.split(/\n/).filter( v => v.length > 0)
        let digitArray = []

        for(let i=0; i<rows.length; i++){
            digitArray[i] = rows[i].split('').map(Number)
        }

        for(let r=0; r<digitArray.length; r++){
            for(let c=0; c<digitArray[r].length; c++){
                cells.push( new Cell(this, r, c, digitArray[r][c]) )
            }
        }

        return cells  
    }  

    getSquare(id) {
        return this.cells.filter( v => v.squareID == id)  
    }  
    
    getRow(id) {
        return this.cells.filter( v => v.rowID == id)  
    }  

    getColumn(id) {
        return this.cells.filter( v => v.columnID == id)  
    }      
    
    getNextStep(technique) {   
        let nextStep 
        for(let house of ['row','column','square']){
            for(let i=0;i<9;i++){
                nextStep = this[house][i][technique]

                if(nextStep){
                    return nextStep
                }
            }
        }             

        return undefined
    }   
    
    static cellCouldBeDigit(digit){
        return cell => cell.possibilities.has(digit)
    }

    fish(size) {

        for(let digit=1; digit<=9; digit++){     

            let columns = this.column
            .filter( v =>  {
                return v.cells.filter( Grid.cellCouldBeDigit(digit) ).length >= 2
            })
            .map( v => v.id)

            let rows = this.row
            .filter( v => v.cells.filter( v => v.possibilities.has(digit)).length >= 2 )
            .map( v => {
                let cells = v.cells
                .filter( v => v.possibilities.has(digit))
                .map( v => v.columnID)
                .filter( columnID => columns.indexOf(columnID) > -1)
                return {
                    'row':v.id,
                    'columns': cells
                }
            })
            .filter( v => v.columns.length >= 2)

            if(rows.length){
                let possibleFishRow = this.row[0].combinations( rows.map(v => v.row) ).filter( v => v.length == size)

                for(let fishRows of possibleFishRow){
                    let fishColumns = []
                    for(let i=0; i<fishRows.length; i++){
                        fishColumns = fishColumns.concat(rows.find( v => v.row == fishRows[i]).columns)
                    }

                    fishColumns = [...new Set([...fishColumns])]

                    if(fishColumns.length == size){
                        let cellsToExclude = this.cells
                        .filter( v => v.possibilities.has(digit) )
                        .filter( v => fishRows.indexOf(v.rowID) == -1 )
                        .filter( v => fishColumns.indexOf(v.columnID) > -1 )

                        if(cellsToExclude.length){
                            return {'digit':digit, 'rows':fishRows, 'columns':fishColumns, 'type':'fish'}  
                        }   
                    }
                }
            }              
        }
        
        return undefined
    }  

    makeChainLink(node, cells, size, chain=[], visited=[], out=[]) {
        let processLink = (node, chain) =>{
            let excluded =  [...chain[0].cell.canSee]
            .filter(v => node.cell.canSee.has(v))
            .filter( v=> v.possibilities.has(node.mustBe))

            let sameRow = chain[0].cell.rowID == node.cell.rowID
            let sameColumn = chain[0].cell.columnID == node.cell.columnID
            let sameSquare = chain[0].cell.squareID == node.cell.squareID

            if(excluded.length && !sameRow && !sameColumn && !sameSquare){
                visited.push(node.cell.id)
                out.push(chain);
            }
        }

        let nextLink = (house, node) => {
            let links = house.links[node.mustBe]
            .filter( v => visited.indexOf(v.id) == -1)
            .filter( v => v.id != cell.id)

            if(links.length){
                let linkCell = this.cells[links[0].id]
                let mustBe = [...linkCell.possibilities.values()].filter(v=> v != node.mustBe)[0]
                let cannotBe = [...linkCell.possibilities.values()].filter(v=> v != mustBe)[0]

                this.makeChainLink(
                    {'cell':linkCell, 'mustBe':mustBe, 'cannotBe':cannotBe}, 
                    cells.filter(v=> v.id != cell.id), 
                    size,
                    chain.slice(0),
                    visited,
                    out) 
            }            
        }

        let cell = node.cell
        chain.push(node)
        
        if (!cells.length || chain.length > size){
            return
        }

        if (node.mustBe == chain[0].cannotBe ) {
            processLink(node, chain)
            
        } else {
            // row
            if(this.row[cell.rowID].links[node.mustBe]){
                nextLink(this.row[cell.rowID], node)
            }

            // column
            if(this.column[cell.columnID].links[node.mustBe]){
                nextLink(this.column[cell.columnID], node)
            }

            // square
            if(this.square[cell.squareID].links[node.mustBe]){
                nextLink(this.square[cell.squareID], node)  
            }
        }

        return out;
    }


    XYChain(size) {
        
        for(let digit=1; digit<=9; digit++){
            let bivalueCells = this.cells.filter( v => v.possibilities.size == 2)
            let startCells = bivalueCells.filter( v => v.possibilities.has(digit))
            
            while(startCells.length){
                let cell = startCells[0]
                startCells = startCells.filter( v => v.id != cell.id)
                bivalueCells = bivalueCells.filter(v=> v.id != cell.id)

                let mustBe = [...cell.possibilities].filter( v => v != digit)[0]
                let node = {'cell':cell, 'mustBe':mustBe, 'cannotBe':digit}
                let chain = this.makeChainLink(node, bivalueCells.map(v=>v.id), size)

                if(chain && chain.length && chain[0].length){
                    return {'chain':chain, 'type':'XYChain'}  
                }
            }
        }
        
        return undefined
    }  

    get XYWing() {
        return this.XYChain(3)
    }  

    get XYChain4() {
        return this.XYChain(4)
    }  

    get XYChain5() {
        return this.XYChain(5)
    } 

    get XYChain6() {
        return this.XYChain(6)
    } 

    get XYChain7() {
        return this.XYChain(7)
    } 

    get XYChain8() {
        return this.XYChain(8)
    }     

    get XYChain9() {
        return this.XYChain(9)
    }   

    get XWings() {
        return this.fish(2)
    }      

    get swordfish() {
        return this.fish(3)
    } 

    get jellyfish() {    
        return this.fish(4)
    }     

    excludeBasedOnNaked(naked) {
        let ids = naked.id.split('-').map(Number)
        this[naked.house.type][naked.house.id].cells
            .filter( v => v.digit == 0 )
            .filter( v => ids.indexOf(v.id) == -1 )
            .forEach( v => {
                //console.log(v.id)
                v.impossibilities = v.impossibilities.concat(...naked.digits)
            })

        return true
    };     
    
    excludeBasedOnHiddenDouble(hiddenDouble) {
        this[hiddenDouble.house.type][hiddenDouble.house.id].cells
            .filter( v => v.digit == 0 )
            .filter( v => hiddenDouble.id.indexOf(v.id) >= 0 )
            .forEach( v => {
                let excluded = [...v.possibilities].filter( v=> {
                    return hiddenDouble.digits.indexOf(v) == -1
                })
                v.impossibilities = v.impossibilities.concat(...excluded)
            })

        return true
    }; 

    excludeBasedOnFish(XWing) {
        
            this.cells
            .filter( v => v.possibilities.has(XWing.digit) )
            .filter( v => XWing.rows.indexOf(v.rowID) == -1 )
            .filter( v => XWing.columns.indexOf(v.columnID) > -1 )
            .forEach( v => {
                Grid.addToImpossibilities(v, XWing.digit)
            })

        return true
    }; 

    excludeBasedOnXYChain(XYchain) {
        
        let start = XYchain[0][0]
        let end = XYchain[0][XYchain.length-1]
        //console.log(start)
        let excluded = [...start.cell.canSee]
        .filter(v => end.cell.canSee.has(v))
        .filter( v=> v.possibilities.has(start.cannotBe))
        .forEach( v => {
            Grid.addToImpossibilities(v, end.mustBe)
        })

        return true
    }; 

    excludeBasedOnLockedCandidate(lockedCandidate) {
        //console.log(lockedCandidate)
        this[lockedCandidate.house.type][lockedCandidate.house.id].cells
            .filter( v => v.possibilities.has(lockedCandidate.digit)  )
            .filter( v => Grid.cellIsNotInArray(v, lockedCandidate.ids) )
            .forEach( v => {
                //console.log(`cell to exclude ${v.id}`)
                Grid.addToImpossibilities(v, lockedCandidate.digit)
                //console.log(`cell possibilities ${[...v.possibilities]}`)

            })

        return true
    };      

    static cellIsUnassigned(cell){
        return cell.digit == 0
    }

    static cellIsNotInArray(cell, array){
        return array.indexOf(cell.id) == -1
    }  
    
    static cellIsInArray(cell, array){
        return array.indexOf(cell.id) > -1
    }       

    static addToImpossibilities(cell, digit){
        cell.impossibilities.push(digit)    

        return cell.impossibilities
    }        

    isSolved() {
        let isSolved = true
        for(let i=0; i<9; i++){      
            if ( this.row[i].isSolved == false){
                isSolved = false
            }           
        }    
        
        return isSolved
    }    

    next (){
        let next 
        
        let techniques = [
            'hiddenSingles', 
            'nakedSingles', 
            'nakedDoubles', 
            'lockedCandidates',
            'hiddenDoubles',
            'nakedTriplets',  
            'nakedQuads',                         

        ]

        for(let technique of techniques){
            next = this.getNextStep(technique)
            if(next){
                return next
            }
        } 

        techniques = [
            'XWings',
            'swordfish',
            'XYWing',
            'jellyfish',
            'XYChain4',
            'XYChain5',
            'XYChain6',
            'XYChain7',
            'XYChain8',
            'XYChain9'
        ]

        for(let technique of techniques){
            next = this[technique]
            if(next){
                return next
            }
        } 

    }

    solve() {
        let i = 1
        let x = {}
        
        let nextStep = this.next()
        while( !this.isSolved() && nextStep && i < 100){
            
            //console.log(nextStep)
            
            x[nextStep.type] = x[nextStep.type] ? x[nextStep.type] + 1 : 1

            switch (nextStep.type) {
                case 'hiddenSingle':
                    this.cells[nextStep.id].digit = nextStep.digit
                    break;
                case 'nakedSingle':
                    this.cells[nextStep.id].digit = nextStep.digit
                    break;
                case 'lockedCandidate':
                    this.excludeBasedOnLockedCandidate(nextStep)
                    break;
                case 'naked':
                    this.excludeBasedOnNaked(nextStep)
                    break;    
                case 'hiddenDouble':
                    this.excludeBasedOnHiddenDouble(nextStep)
                    break;   
                case 'fish':
                    this.excludeBasedOnFish(nextStep)
                    break; 
                case 'XYChain':
                    this.excludeBasedOnXYChain(nextStep.chain)  
                    break;                     
                                       
                default:
                    break;
            }
            nextStep = this.next()
            i++
        }
        
        // console.log(x)
        // console.log('-------------')

        i = 0

        // this.XYWing.forEach( v => {
        //     this.excludeBasedOnXYChain(v)
        // })           

        // console.log( `i: ${i}` )
        //console.log( this.nakedDoubles )
        //console.log( this.cells[12].possibilities )

        // // console.log( this.lockedCandidates )
        // // console.log( this.column[3].cells.filter( Grid.cellCouldBeDigit(3)).map(v=> v.columnID))

        // console.log( '==================================' )
        // console.log( this.row[0].cells.map( v => v.digit) )
        // console.log( this.row[1].cells.map( v => v.digit) )
        // console.log( this.row[2].cells.map( v => v.digit) )
        // console.log( this.row[3].cells.map( v => v.digit) )
        // console.log( this.row[4].cells.map( v => v.digit) )
        // console.log( this.row[5].cells.map( v => v.digit) )
        // console.log( this.row[6].cells.map( v => v.digit) )
        // console.log( this.row[7].cells.map( v => v.digit) )
        // console.log( this.row[8].cells.map( v => v.digit) )

        return this
    }       
    
    get title() {
        return this._title;
    };
      
    set title(title) {
        this._title = title
    };
}


module.exports = {Grid}

 

   

