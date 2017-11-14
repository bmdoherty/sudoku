export default class House {
    constructor(id, cells, grid) {
        this.id = id      
        this.cells = cells
        this.grid = grid

        return this
    }  
     
    get isSolved() {
        return this.usedCells.length === 9
    }  

    get unused() {
        let fullSet = [1,2,3,4,5,6,7,8,9]
        
        return new Set(fullSet.filter(x => !this.used.has(x)))
    }    

    get used() {
        return new Set(this.usedCells.map(cell => cell.digit))
    }    

    get usedCells() {
        return this.cells.filter( v => v.digit !== 0)
    }    

    get unusedCells() {
        return this.cells.filter( v => v.digit === 0)
    }   
     
    get links() {
        let links = {}
        
        for(let digit of this.unused){
            let digitLinks = this.cells
            .filter( v => v.possibilities.has(digit) && v.possibilities.size === 2)
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