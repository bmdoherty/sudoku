export const nakedSingle = (house) => {
    for(let i=0; i<house.unusedCells.length; i++){
        let cell = house.unusedCells[i]
  
        if( cell.possibilities.size === 1){
            let digit = cell.possibilities.values().next().value
            let cells = [...cell.canSee]
            let used = []
  
            // all used found in one house
            for(let houseType of ['row','column','square']){
                let houseID = cell[houseType+'ID']
                let houseCells = house.grid[houseType][houseID].cells
                if(houseCells.filter(v => v.digit > 0).length === 8){
                    used = houseCells.filter(v => v.digit > 0).map( v=>v.id)
                    return {'id':cell.id, 'digit':digit, 'used':used, 'type':'nakedSingle'}
                }
            }
  
            // used found in different houses
            for(let i=1; i<=9; i++){
                if(i !== digit){
                    let seenBy = cells.filter( v=> v.digit === i).map( v=>v.id).map(Number)[0]
                    if(!isNaN(seenBy)){
                        used.push(seenBy)
                    }
                }
            }
            return {'id':cell.id, 'digit':digit, 'used':used, 'type':'nakedSingle'}
        }               
    }
  
    return undefined     
}