const {f} = require('./index'); 

it('hidden singles', async () => {
    let grid = '003020600
    900305001
    001806400
    008102900
    700000008
    006708200
    002609500
    800203009
    005010300'
    
    expect( await f(0) ).toEqual(483); 
});
