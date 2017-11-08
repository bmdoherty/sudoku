const usedBy = (cell, grid) => {
    
    let used = []

    // all used found in one house
    for(let houseType of ['row','column','square']){
        let houseID = cell[houseType+'ID']
        let houseCells = grid[houseType][houseID].cells

        if(houseCells.filter(v => v.digit > 0).length === 8){
            used = houseCells.filter(v => v.digit > 0).map( v=>v.id)
            return used
        }
    }

    // used found in different houses
    let cells = [...cell.canSee]

    for(let i=1; i<=9; i++){
        let seenBy = cells.filter( v=> v.digit === i).map( v=>v.id).map(Number)[0]
        
        if(!isNaN(seenBy)){
            used.push(seenBy)
        }
    }    

    return used
}

export default class NakedSingle {
    constructor() {
        this.type = 'NakedSingle'
        return this
    }  
    
    find(grid){
        let candidateCells = grid.cells.filter( cell => cell.possibilities.size === 1)
    
        if( candidateCells.length ){
            let cell = candidateCells[0]        
            let digit = cell.possibilities.values().next().value 
            let used = usedBy(cell, grid)

            return {'id':cell.id, 'digit':digit, 'used':used, 'strategy':this}
        }               
    
        return undefined     
    }    

    apply(grid, step){
        grid.cells[step.id].digit = step.digit
    }
}

