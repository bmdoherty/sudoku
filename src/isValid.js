import Solver from './Solver'

export default function isValid(text) {   
    function hasDuplicates(a){
        
        return a.length - new Set(a).size 
    }

    let rows = text.match(/.{1,9}/g)
    let grid = {}
    grid.row = []
    grid.column = []
    grid.square = []
    for(let i=0; i<9; i++){
        grid.row[i] = []
        grid.column[i] = []
        grid.square[i] = []
    }   
        
    if(rows.length !== 9){
        return { 'isValid':false, 'message':'Grid does not contain 9 rows'}
    }

    let row = []
    for(let rowID=0; rowID<9; rowID++){
        row = rows[rowID].split('')
        if(row.length !== 9){
            return { 'isValid':false, 'message':'Grid does not contain 9 numbers in row'}
        }  

        row = row.map(Number).filter( v => !isNaN(v) )
        
        if(row.length !== 9){
            return { 'isValid':false, 'message':'Grid contains non numeric values'}
        }    
                
        grid.row[rowID] = row
        for(let columnID=0; columnID<9; columnID++){
            let squareID = Math.floor(rowID/3) * 3 + Math.floor(columnID/3) 

            grid.column[columnID].push( row[columnID]) 
            grid.square[squareID].push( row[columnID]) 
        }            
    }

    for(let house of ['row','column','square']){
        let nonZeroTotal = 0
        for(let i=0; i<9; i++){       
            let nonZeroValues = grid[house][i].filter( v=> v !== 0)
            
            if(nonZeroValues.length){
                nonZeroTotal = nonZeroTotal + nonZeroValues.length
                if( hasDuplicates(nonZeroValues) ){
                    return { 'isValid':false, 'message':`Grid contains duplicates in ${house} ${i+1}`}
                }
            }

        }
        
        if(nonZeroTotal < 17){
            return { 'isValid':false, 'message':'Grid contains less than 17 digits'}
        }
    }

    let solver = new Solver(text).solve() 

    if( solver.isSolved() ){
        return { 'isValid':true, 'message':'Grid can be solved'}
    }

    return { 'isValid':false, 'message':'Grid can not be solved by this tool'}
}

//module.exports = {isValid}