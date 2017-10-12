"use strict"

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


module.exports = {House}