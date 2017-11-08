const canExcludeAPossibilty = (grid, house, ids, digits ) => {
    let cells = grid[house.type][house.id].unusedCells
                .filter( cell => ids.indexOf(cell.id) > -1 )
                .filter( cell => cell.possibilities.size > digits.length )

    return !!cells.length
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

const compare = (a,b) => {
    return a.length === b.length && a.every((v,i)=> v === b[i])
}

export default class Hidden {
    constructor() {
        return this
    }  
    
    find(grid) {
        // need at least 3 unused cells to find a hidden double
        for(let size=2; size<=4; size++){  
            let candidateHouses = grid.house.filter( house => house.unused.size >= size+(size-1))

            for(let house of candidateHouses){
                let possibleSetOfHiddenDigits = combinations([...house.unused], size)
                
                for(let possibleHiddenDigits of possibleSetOfHiddenDigits ){
                    
                    let possibleSetOfHiddenCells = house.unusedCells
                        .filter( cell => [...cell.possibilities].some( ( v => possibleHiddenDigits.indexOf(v) > -1 )))

                    if(possibleSetOfHiddenCells.length === size){
                        
                        let id = possibleSetOfHiddenCells.map(v=>v.id)
                        let digits = possibleHiddenDigits

                        if( canExcludeAPossibilty(grid, house, id, digits) ){
                            return {'id':id, 'digits':digits, 'house':{'type':house.type, 'id':house.id} , 'length':size, 'strategy':this} 
                        }
                    }                 
                }
            }
        }
    
        return undefined
    }

    apply(grid, step){
        grid[step.house.type][step.house.id].cells
        .filter( v => v.digit === 0 )
        .filter( v => step.id.indexOf(v.id) >= 0 )
        .forEach( v => {
            let excluded = [...v.possibilities].filter( v=> {
                return step.digits.indexOf(v) === -1
            })
            v.impossibilities = v.impossibilities.concat(...excluded)
        })

    return true        
    }      
}