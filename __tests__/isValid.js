const {Grid} = require('../model/Grid'); 
const {isValid} = require('../model/isValid'); 

it('should be valid', () => {
    let text = '000000003\n089000060\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'
    let grid = new Grid(text)

    expect( isValid(grid) ).toEqual( true ); 
});

