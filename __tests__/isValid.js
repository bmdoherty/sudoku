const {Grid} = require('../model/Grid'); 
const {isValid} = require('../model/isValid');

it('should be valid', () => {
    let text = '000000003\n089000060\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'

    expect( isValid(text) ).toEqual( true ); 
});

it('should be valid', () => {
    let text = '000000000\n000000060\n000000000\n000000006\n000000290\n000000014\n000000001\n000000000\n500403800'

    expect( isValid(text) ).toEqual( true ); 
});
