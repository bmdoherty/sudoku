export default class HiddenSingle {
    constructor() {
        this.type = 'HiddenSingle'
        return this
    }  

    find(grid){
        // house must have at least 2 empty cells to be hidden single
        let candidateHouses = grid.house.filter( house => house.unused.size > 1)

        for(let house of candidateHouses){
            
            for(let digit of house.unused.values()){
                let possibleCells = house.cells.filter( v => v.possibilities.has(digit) )

                if( possibleCells.length === 1 ){
                    return {'id':possibleCells[0].id, 'digit':digit, 'house':house, 'strategy':this}
                }                      
            }
        }
        
        return undefined
    }

    apply(grid, step){
        grid.cells[step.id].digit = step.digit
    }      
}