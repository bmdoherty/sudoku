import isValid from '../model/isValid';

import fs from 'fs'
import {promisify} from 'util'

const readFileAsync = promisify(fs.readFile);

let arr = []
let sudoku

async function myReadfile () {
    let content = await readFileAsync( './__tests__/sudoku17.txt', "utf8" )

    arr = content.split('\n')
}

test.skip('ignore', () => {
  expect(0).toBe(0);
});

// describe('...', () => {
//   beforeAll(async () => {
//     await myReadfile()
//   });
  
//   beforeEach(async () => {
//     sudoku = arr.pop()
//   });

//   for(let i=0; i<=10; i++){ //49151
//     it('suduko' + i, async () => {    
//       let v = isValid(sudoku)    

//       expect(v.isValid).toEqual(true);
//     });
//   }
// })