const {isValid} = require('../model/isValid')

const fs = require('fs');
const {promisify} = require('util');
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

//   for(let i=0; i<=49151; i++){
//     it('suduko' + i, async () => {
//       sudoku = sudoku.replace(/(.{9})/g,"$1\n").replace(/^\s\s*/, '').replace(/\s\s*$/, '')
//       let v = isValid(sudoku)     
//       expect(v.isValid).toEqual(true);
//     });
//   }
// })