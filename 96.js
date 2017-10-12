"use strict"


const request = require('request');

async function getGrids () {
  return await new Promise((resolve, reject) => {
     request('https://projecteuler.net/project/resources/p096_sudoku.txt', (err, res, body) => {
      if (err) {
        reject(err);
      }
      resolve(body);
    });
  });
}

class Cell {
    constructor(grid, row, column, digit) {
        this.id = row*9 + column        
        this.grid = grid
        this.rowID = row
        this.columnID = column
        this.squareID = Math.floor(row/3) * 3 + Math.floor(column/3)        

        this.impossibilities = [] 

        this._digit = digit

        return this
    }
    get digit() {
        return this._digit
    }

    set digit(digit) {
        //console.log('cell set : ' + digit + ' id: ' + this.id)
        this.grid.row[this.rowID].used.add(digit)
        this.grid.row[this.rowID].unused.delete(digit)

        this.grid.column[this.columnID].used.add(digit)
        this.grid.column[this.columnID].unused.delete(digit)   
        
        this.grid.square[this.squareID].used.add(digit)
        this.grid.square[this.squareID].unused.delete(digit)          

        this.grid.row[this.rowID].cells.filter( v => v.id != this.id).forEach( v => v.impossibilities.concat(digit))
        this.grid.column[this.columnID].cells.filter( v => v.id != this.id).forEach( v => v.impossibilities.concat(digit))
        this.grid.square[this.squareID].cells.filter( v => v.id != this.id).forEach( v => v.impossibilities.concat(digit))  

        this._digit = digit
    }

    get excluded() {
        return [1,2,3,4,5,6,7,8,9]
        .filter( v => [...this.impossibilities].indexOf(v) > -1)
        .filter( v => [...this.possibilities].indexOf(v) == -1)
    }

    get possibilities() {
        return this.getPossibilities()
    }
    

    getPossibilities() {
        if(this.digit){
            return new Set()
        }

        let possibles = new Set( [1,2,3,4,5,6,7,8,9] )
        for(let i=0; i<this.impossibilities.length; i++){
            possibles.delete(this.impossibilities[i])
        }
        let s = this.grid.square[this.squareID].cells.map( v => v.digit).filter( v => v != 0) 
        let r = this.grid.row[this.rowID].cells.map( v => v.digit).filter( v => v != 0) 
        let c = this.grid.column[this.columnID].cells.map( v => v.digit).filter( v => v != 0) 

        let used = new Set( r.concat(c).concat(s) )

        return new Set([...possibles].filter(v => !used.has(v)));
    }          
 
    get canSee() {        
        let s = this.grid.square[this.squareID].cells
        let r = this.grid.row[this.rowID].cells
        let c = this.grid.column[this.columnID].cells

        let used = new Set( r.concat(c).concat(s) )

        return new Set( r.concat(c).concat(s) )
    }
}

class House {
    constructor(id, cells, grid) {
        this.id = id      
        this.cells = cells
        this.grid = grid
        this.used = new Set()
        this.unused = new Set([1,2,3,4,5,6,7,8,9])

        return this
    }  

    get squares(){
        let squareIDs = [...new Set(this.cells.map( v => v.squareID))]
        return this.grid.square.filter( v => squareIDs.lastIndexOf(v.id) > -1)
    }   

    // naked singles have only one possibility
    get nakedSingles() {
        for(let i=0; i<this.unusedCells.length; i++){
            let cell = this.unusedCells[i]

            if( cell.possibilities.size == 1){
                let digit = cell.possibilities.values().next().value
                let cells = [...cell.canSee]
                let used = {}
                for(let i=0; i<=9; i++){
                    used[i] = cells.filter( v=> v.digit == i).map( v=>v.id)[0]
                }
                return {'id':cell.id, 'digit':digit, 'used':used, 'type':'nakedSingle'}
            }    
                    
        }
        return undefined
    }   
        
    get nakedDoubles() {
        return this.naked(2) 
    }    
    
    naked(size) {
        
        for(let i=0; i<this.unusedCells.length; i++){
            let cell = this.unusedCells[i]
            let sharedCells = [cell.id]
            
            for(let j=i+1; j<this.unusedCells.length; j++){
                let candidate = this.unusedCells[j]
                let containsAll = [...candidate.possibilities].every(v => cell.possibilities.has(v))
                if(containsAll){
                    sharedCells.push(candidate.id)
                }
            }

            if(sharedCells.length == size){
                //console.log(`type: ${this.type} id: ${this.id}`)
                if(sharedCells.length == cell.possibilities.size 
                    && sharedCells.length != this.unusedCells.length){
                       
                    let cellsWithDigitsPossible = 0
                    for(let digit of cell.possibilities){
                        //console.log(this.cells.filter( v => v.possibilities.has(digit)).map(v=>v.id))
                        cellsWithDigitsPossible = this.cells.filter( v => v.possibilities.has(digit)).reduce( (s,v) => s+1, cellsWithDigitsPossible)
                        
                    }
                    //console.log(`cellsWithDigitsPossible: ${cellsWithDigitsPossible} id: ${(size * cell.possibilities.size)}`)
                    if(cellsWithDigitsPossible > size * cell.possibilities.size){
                        let house = {'type':this.type, 'id':this.id}
                        let id = sharedCells.join('-')
                        return {'id':id, 'digits':cell.possibilities, 'house':house, 'length':sharedCells.length, 'type':'naked'}
                    }
                }
            }
        }

        return undefined
    }  

    combinations(str) {
        var fn = function(rest, active=[], out=[]) {
            if (!active.length && !rest.length)
                return;
            if (!rest.length) {
                out.push(active);
            } else {
                fn(rest.slice(1), active.concat(rest[0]),  out);
                fn(rest.slice(1), active, out);
            }
            return out;
        }
        return fn(str);
    }

    compare(a,b) {
        return a.length==b.length && a.every((v,i)=> v === b[i])
    }

    get hiddenDoubles() {
        //console.log(`type: ${this.type} id: ${this.id} unused:${this.unused.size}`)
        if(this.unused.size){
            let possibleDouble = this.combinations([...this.unused]).filter( v => v.length == 2)

            for(let double of possibleDouble){
                let a = this.unusedCells.filter( v => v.possibilities.has(double[0]) )
                let b = this.unusedCells.filter( v => v.possibilities.has(double[1]) )
                //console.log(a)
                //console.log(b)
                if( a.length == 2 && this.compare(a,b)){
                    //console.log(`type: ${this.type} id: ${this.id}`)
                    let cellA = a[0]
                    let cellB = a[1]

                    if( !this.compare([...cellA.possibilities],[...cellB.possibilities])){
                        let house = {'type':this.type, 'id':this.id}              
                        return {'id':a.map(v=> v.id), 'digits':double, 'house':house, 'length':2, 'type':'hiddenDouble'} 
                    }
                }                            
            }
        }

        return undefined
    }  

    get hiddenSingles() {

        for(let digit=0; digit<=9; digit++){
            let possibleCells = this.cells.filter( v => v.possibilities.has(digit))

            if( possibleCells.length == 1){
                return {'id':possibleCells[0].id, 'digit':digit, 'type':'hiddenSingle'}
            }    
                    
        }
        return undefined
    }  

    get isSolved() {
        return this.usedCells.length == 9
    }  

    get usedCells() {
        return this.cells.filter( v => v.digit != 0)
    }    

    get unusedCells() {
        return this.cells.filter( v => v.digit == 0)
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
                if(this.isSquare(possibleCells)){   
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
    
    get links() {
        let links = {}
        
        for(let digit of this.unused){
            let digitLinks = this.cells
            .filter( v => v.possibilities.has(digit) && v.possibilities.size == 2)
            .map(v => {
                return {
                    'id':v.id,
                    'possibilities':v.possibilities
                }
            })

            if(digitLinks.length > 1){
                links[digit] = digitLinks
            }
        }    

        return links
    }
}

class Row extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'row'
        return this
    }  
}

class Column extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'column'
        return this
    }   
}

class Square extends House{
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = 'square'
        return this
    }  

    isRow(cells) {
        if(!cells.length){
            return false
        }

        return cells.every( (v,i,a) => v.rowID === a[0].rowID)
    }

    isColumn(cells) {
        if(!cells.length){
            return false
        }

        return cells.every( (v,i,a) => v.columnID === a[0].columnID)
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

class Grid {
    constructor(title, text) {
        this.title = title;
        //this.text = text;
        this.rowText = text.split(/\n/).filter( v => v.length > 0)
        this.row = []
        for(let i=0; i<this.rowText.length; i++){
            this.row[i] = this.rowText[i].split('').map(Number)
        }

        // refactor
        this.cells = []
        let fixed = []
        for(let r=0; r<this.row.length; r++){
            for(let c=0; c<this.row[r].length; c++){
                fixed[ r * 9 + c  ] = this.row[r][c]
                this.cells.push( new Cell(this, r, c, this.row[r][c]) )

            }
        }

        this.square = []
        this.row = []   
        this.column = []                
        for(let i=0; i<9; i++){
            this.row.push( new Row(i, this.getRow(i), this))
            this.column.push( new Column(i, this.getColumn(i), this))
            this.square.push( new Square(i, this.getSquare(i), this))
        }
    };

    getSquare(id) {
        return this.cells.filter( v => v.squareID == id)  
    }  
    
    getRow(id) {
        return this.cells.filter( v => v.rowID == id)  
    }  

    getColumn(id) {
        return this.cells.filter( v => v.columnID == id)  
    }      

    get nakedTriplets() {
        return this.naked.filter( v => v.length == 3)
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

    // naked(size) {   
    //     let naked 
        
    //     for(let house of ['row','column','square']){
    //         for(let i=0;i<9;i++){
    //             naked = this[house][i].naked(size)

    //             if(naked){
    //                 return naked
    //             }
    //         }
    //     }             

    //     return undefined
    // }     
    
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

                if(chain.length && chain[0].length){
                    return {'chain':chain, 'type':'XYChain'}  
                }
            }
        }
        
        return undefined
    }  

    get XYWing() {
        return this.XYChain(3)
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
            'hiddenDoubles'

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
            'jellyfish'
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

        let nextStep = this.next()
        while( !this.isSolved() && nextStep && i < 100){
            
            //console.log(nextStep)

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
        
        // console.log(`steps: ${i}`)
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



const processResponse = (response) => {
    let processedText = response
    .split(/(Grid\s\d{2})/)
    .filter( v => v.length > 0)
    .map( (v,i,a) => {
        if(i % 2 == 0){
            return {'title':a[i], 'text':a[i+1]}
        }
        return undefined
    })
    .filter( v => v != undefined)

    return processedText 
}


async function f(n) {
    console.time('timer')
    let response = await getGrids()

    // swordfish & XY Wing
    //let response = 'Grid 01\n195367248\n078050369\n306098157\n003780590\n709005006\n584906710\n832549671\n907013025\n051072900'

    // jellyfish
    //let response = 'Grid 01\n204103580\n000020341\n103485600\n732954168\n005010900\n619832400\n001508200\n300240000\n026300004'
    
    //let response = 'Grid 01\n200000003\n080030050\n003402100\n001205400\n000090000\n009308600\n002506900\n090020070\n400000001'   
    //let response = 'Grid 01\n000090000\n504601000\n000834000\n000000910\n000000208\n319000450\n870100040\n005300000\n206400070'
    
    // this week mag
    //let response = 'Grid 01\n013000000\n000390501\n000004090\n000000000\n782503910\n196702380\n000007050\n048000000\n000830609'    
    
    //console.log(response)
    let grids = processResponse(response).map( ({title, text}) => new Grid(title, text))   
    //grids = grids.slice(n,n+1)

    //grids = grids.map( ({title, text}) => new Grid(title, text)) 
    
    grids = grids.map( g => g.solve())
    //grids = grids.map( g => g.solve())

    console.timeEnd('timer')
    return  grids.map( g => g.row[0].cells.map( v => v.digit).slice(0,3).join('') ).map(Number).reduce( (s,v) => s = s + v ) 
}

module.exports = {f}

f(6)



    // backtrack(triplet, value) {
    //     let r = Math.floor(triplet/9)
    //     let c = triplet % 9
    //     let s = Math.floor(r/3) * 3 + Math.floor(c/3)
    //     let ss = (Math.floor(r % 3) * 3) + c % 3
      
    //     this.row[r][c] = value
    //     this.column[c][r] = value
    //     this.square[s][ss] = value
    //     //console.log(`backtrack: t: ${triplet} r: ${r} c:${c} value: ${value}`)
    // };    

    // rollback(triplet, value) {
    //     let r = Math.floor(triplet/9)
    //     let c = triplet % 9
    //     let s = Math.floor(r/3) * 3 + Math.floor(c/3)
    //     let ss = (Math.floor(r % 3) * 3) + c % 3
      
    //     this.row[r][c] = value
    //     this.column[c][r] = value
    //     this.square[s][ss] = value
    //     //console.log(`rollback: t: ${triplet} r: ${r} c:${c} value: ${value}`)
    // };  

    // const solve = (grid, deducedArray=[]) => {    
//     // deduce
//     let deduced = deduce(grid)
    
//     while ( deduced !== undefined ){
//         // if(deduced.t == 54 && deduced.value==8){
//         //     console.log( `deduce fill t: ${deduced.t} v: ${deduced.value}  r: ${deduced.r}` )
//         //     console.log(deduced.row)
//         //     console.log(deduced.column)
//         //     console.log(deduced.square)
//         // }  
//         // if(deduced.t == 65 && deduced.value==8){
//         //     console.log( `deduce fill t: ${deduced.t} v: ${deduced.value}  r: ${deduced.r}` )
//         //     console.log(deduced.row)
//         //     console.log(deduced.column)
//         //     console.log(deduced.square)
//         // }                    
//         deducedArray.push(deduced.t)
//         grid.deducefill(deduced.t, deduced.value)
//         deduced = deduce(grid)
        
//     }
//     //console.log(deducedArray)
//     //return grid
//     if( isSolved(grid) ){
//         console.log( grid.title + ': is solved')
//         return grid
//     }   


//     //console.log( grid.row[0] )  

//     //guess
//     let {r,c} = findUnassigned(grid)
//     let s = Math.floor(r/3) * 3 + Math.floor(c/3)
//     let t = (r * 9) + c      

//     let row = grid.row[r]
//     let column = grid.column[c]
//     let square = grid.square[s]

//     //let unused = filterTriplet(row, column, square)

//     for(let i=1; i<=9; i++){
//         let isSafe = filterTriplet(row, column, square).has(i)    
//         if(isSafe){              
//             grid.guessfill(t, i)
//             if( solve(grid, deducedArray) ){
//                 return grid
//             }   
//             grid.backtrack(t, 0) 
           
//             while(deducedArray.length){
//                 let test = deducedArray.pop()
//                 grid.rollback(test, 0) 
//             }
//         }    
//     }

//     return false
// }