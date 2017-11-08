const onlyCellsLeft = (size, house) => {
    return size === house.unusedCells.length
}

const isCorrectSize = (size, cell, sharedCells) => {
    return size === sharedCells.length && size === cell.possibilities.size
}

const canExcludeAPossibilty = (size, house, cell) => {
    let cellsWithDigitsPossible = 0
    
    for(let digit of cell.possibilities){
        cellsWithDigitsPossible = house.cells.filter( v => v.possibilities.has(digit)).reduce( (s,v) => s+1, cellsWithDigitsPossible)                        
    }

    return cellsWithDigitsPossible > size * size
}

const isNaked = (size, cell, house, sharedCells) => {
    if(!sharedCells){
        return false
    }

    return isCorrectSize(size, cell, sharedCells) && !onlyCellsLeft(size, house) && canExcludeAPossibilty(size, house, cell) 
}



export default class naked {
    constructor() {
        return this
    }  
    
    find(grid) {
        let candidateHouses = grid.house.filter( house => house.unused.size > 1)

        for(let house of candidateHouses){
            let sharedCells = []

            for(let i=0; i<house.unusedCells.length; i++){
                let cell = house.unusedCells[i]
                sharedCells.push(cell.id)

                for(let j=i+1; j<house.unusedCells.length; j++){
                    let candidate = house.unusedCells[j]
                    let containsAll = [...candidate.possibilities].every(possibility => cell.possibilities.has(possibility))
                    if(containsAll){
                        sharedCells.push(candidate.id)
                    }
                }

                for(let size in [2,3,4]){
                    if( isNaked((size, cell, house, sharedCells) ) ){                       
                        return {'ids':sharedCells, 'digits':cell.possibilities, 'house':house, 'length':sharedCells.length, 'strategy':this}                        
                    }
                    
                }      
            }
        }
    
        return undefined
    }

    apply(grid, step){
        let ids = step.ids
        grid[step.house.type][step.house.id].cells
            .filter( v => v.digit === 0 )
            .filter( v => ids.indexOf(v.id) === -1 )
            .forEach( v => {
                //console.log(v.id)
                v.impossibilities = v.impossibilities.concat(...step.digits)
            })

        return true        
    }      
}