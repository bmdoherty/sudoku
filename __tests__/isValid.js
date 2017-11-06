import isValid from '../model/isValid';

it('invalid for 2 rows', () => {
    let text = 'abcdefghk\nabcdefghk' 
    let v = isValid(text)

    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid does not contain 9 rows' )
});

it('invalid for 9 rows, 8 columns', () => {
    let text = '12345678\n123456789\n123456789\n123456789\n123456789\n123456789\n123456789\n123456789\n123456789'
    let v = isValid(text)

    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid does not contain 9 numbers in row' )
});

it('invalid for 9x9 grid of non numeric characters', () => {
    let text = 'abcdefghk\nabcdefghk\nabcdefghk\nabcdefghk\nabcdefghk\nabcdefghk\nabcdefghk\nabcdefghk\nabcdefghk'
    let v = isValid(text)

    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid contains non numeric values' )
});

it('invalid for less than 17 digits', () => {
    let text = '000000000\n000000060\n000000000\n000000006\n000000290\n000000014\n000000001\n000000000\n500403800'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid contains less than 17 digits' )
});

it('invalid for same digit in row', () => {
    let text = '111000003\n089000060\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid contains duplicates in row 1' )
});

it('invalid for same digit in column', () => {
    let text = '100000003\n183004569\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid contains duplicates in column 1' )
});

it('invalid for same digit in square', () => {
    let text = '100000003\n013004569\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid contains duplicates in square 1' )
});

it('valid for ok grid', () => {
    let text = '000000003\n089000060\n060078000\n000030006\n004500290\n006000014\n000020001\n070085000\n500403800'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( true )
    expect( v.message ).toEqual( 'Grid can be solved' )
});

it('valid for very hard', () => {
    let text = '800000000\n003600000\n070090200\n050007000\n000045700\n000100030\n001000068\n008500010\n090000400'
    let v = isValid(text)
    
    expect( v.isValid ).toEqual( false )
    expect( v.message ).toEqual( 'Grid can not be solved by this tool' )
});






