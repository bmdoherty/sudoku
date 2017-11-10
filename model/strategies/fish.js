const byDigit = (digit) => {

    return (house) => {
        return house.cells.filter( cell => cell.possibilities.has(digit)).length >= 2
    }
}

const linkToColumns = (digit) => {
    
    return row => {        
        let columnIDs = row.cells.filter( v => v.possibilities.has(digit)).map( v => v.columnID)

        return {
            'rowID': row.id,
            'columnIDs': columnIDs
        }
    }
}

const extractUniqueFishColumns = (possibleFishRows, rowsAndThierColumns) => {
    let fishColumns = []
    
    for(let i=0; i<possibleFishRows.length; i++){
        let row = rowsAndThierColumns.find( row => row.rowID === possibleFishRows[i])
        let columnIDs = row.columnIDs
        fishColumns.push(...columnIDs)
    }

    return [...new Set(fishColumns)]
}

const canExcludeCellsBasedOnFish = (grid, digit, fishRows, fishColumns) => {
    let cellsToExclude = grid.cells
    .filter( v => v.possibilities.has(digit) )
    .filter( v => fishRows.indexOf(v.rowID) === -1 )
    .filter( v => fishColumns.indexOf(v.columnID) > -1 )

    return cellsToExclude.length
}

const combinations = (str, length) => {
    const fn = function(rest, length, active=[], out=[]) {

        if (!active.length && !rest.length){
            return
        }

        if (!rest.length) {
            if(active.length === length){
                out.push(active)
            }            
        } else {
            fn(rest.slice(1), length, active.concat(rest[0]), out)
            fn(rest.slice(1), length, active, out)
        }

        return out
    }

    return fn(str, length)
}

export default class Fish {
    constructor() {
        this.type = 'Fish'
        return this
    }  
    
    find(grid){
      
        for(let digit=1; digit<=9; digit++){ 
            let rowsWithDigitTwice = grid.row.filter( byDigit(digit) )   

            if(rowsWithDigitTwice.length){
                let rowsAndThierColumns = rowsWithDigitTwice.map( linkToColumns(digit) ).filter( v => v.columnIDs.length >= 2)
                
                if(rowsAndThierColumns.length){     
                    // 2 == XY-Wing
                    // 3 == swordfish
                    // 4 == jellyfish                    
                    for(let size=2; size<=4; size++){                                            
                        let rowIDs = rowsAndThierColumns.map(row => row.rowID)

                        // all possible rowID combinations (where row contains digit) of required size
                        let possibleSetOfFishRowCombinations = combinations(rowIDs , size)

                        for(let possibleFishRows of possibleSetOfFishRowCombinations){
                            let fishColumns = extractUniqueFishColumns(possibleFishRows, rowsAndThierColumns)
   
                            // fishColumns and possibleSetOfFishRows are both equal to size required, so we have a fish
                            if(fishColumns.length === size){                                
                                let fishRows = possibleFishRows

                                // dont return unless it progresses grid solving
                                if( canExcludeCellsBasedOnFish(grid, digit, fishRows, fishColumns) ){
                                    return {'digit':digit, 'rows':fishRows, 'columns':fishColumns, 'length':fishRows.length, 'strategy':this}  
                                }   
                            }
                        }
                    }
                }
            }              
        }

        return undefined
    }

  apply(grid, step){
      grid.cells
      .filter( v => v.possibilities.has(step.digit) )
      .filter( v => step.rows.indexOf(v.rowID) === -1 )
      .filter( v => step.columns.indexOf(v.columnID) > -1 )
      .forEach( v => {
          v.addToImpossibilities(step.digit)
      })

      return true
  }  
}
