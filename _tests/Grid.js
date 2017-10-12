const {Grid} = require('./model/Grid'); 

it('swordfish & XY Wing', () => {
    let text = '195367248\n078050369\n306098157\n003780590\n709005006\n584906710\n832549671\n907013025\n051072900'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 1, 9, 5, 3, 6, 7, 2, 4, 8 ] ); 
});

it('jellyfish', () => {
    let text = '204103580\n000020341\n103485600\n732954168\n005010900\n619832400\n001508200\n300240000\n026300004'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 2, 9, 4, 1, 6, 3, 5, 8, 7 ] ); 
});

it('random 1', () => {
    let text = '200000003\n080030050\n003402100\n001205400\n000090000\n009308600\n002506900\n090020070\n400000001'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 2, 5, 6, 8, 1, 9, 7, 4, 3 ]); 
});

it('random 2', () => {
    let text = '000090000\n504601000\n000834000\n000000910\n000000208\n319000450\n870100040\n005300000\n206400070'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 7, 3, 8, 2, 9, 5, 1, 6, 4 ] ); 
});    

it('this week mag', () => {
    let text = '013000000\n000390501\n000004090\n000000000\n782503910\n196702380\n000007050\n048000000\n000830609'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 9, 1, 3, 2, 5, 6, 4, 7, 8 ] ); 
});   

it('hidden singles', () => {
    let text = '003020600\n900305001\n001806400\n008102900\n700000008\n006708200\n002609500\n800203009\n005010300'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual([ 4, 8, 3, 9, 2, 1, 6, 5, 7 ] ); 
});

it('euler 0: hidden singles', () => {
    let text = '100920000\n524010000\n000000070\n050008102\n000000000\n402700090\n060000000\n000030945\n000071006'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 1, 7, 6, 9, 2, 3, 5, 8, 4 ] ); 
});

it('euler 6: nakedSingle, lockedCandidate, nakedDouble, hiddenDouble & XWings', async () => {
    let text = '043080250\n600000000\n000001094\n900004070\n000608000\n010200003\n820500000\n000000005\n034090710'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 1, 4, 3, 9, 8, 6, 2, 5, 7 ] ); 
});

it('euler 46: ', async () => {
    let text = '904200007\n010000000\n000706500\n000800090\n020904060\n040002000\n001607000\n000000030\n300005702'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 9, 5, 4, 2, 1, 3, 6, 8, 7 ] ); 
});


it('euler 47: ', async () => {
    let text = '000700800\n006000031\n040002000\n024070000\n010030080\n000060290\n000800070\n860000500\n002006000\n'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 1, 5, 9, 7, 4, 3, 8, 6, 2 ] ); 
});

it('euler 48: ', async () => {
    let text = '001007090\n590080001\n030000080\n000005800\n050060020\n004100000\n080000030\n100020079\n020700400'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 8, 6, 1, 3, 5, 7, 2, 9, 4 ] ); 
});

it('euler 49: ', async () => {
    let text = '000003017\n015009008\n060000000\n100007000\n009000200\n000000020\n000500004\n500600340\n340200000'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 9, 0, 4, 8, 5, 3, 6, 1, 7 ] ); 
});

it('euler 50: ', async () => {
    let text = '300200000\n000107000\n706030500\n070009080\n900020004\n010800050\n009040301\n000702000\n000008006'
    let grid = new Grid(text).solve()
    let firstRow = grid.row[0].cells.map( v => v.digit)

    expect( firstRow ).toEqual( [ 3, 5, 1, 2, 8, 6, 4, 9, 7 ] ); 
});