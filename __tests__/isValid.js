import isValid from "../src/isValid";

it("invalid for 80 digits", () => {
    let text = "00037420000008204000000000000030826600090004805046970547020009000000405010450702";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid does not contain 9 numbers in row");
});

it("invalid for 2 rows", () => {
    let text = "abcdefghkabcdefghk";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid does not contain 9 rows");
});

it("invalid for 9 rows, 8 columns", () => {
    let text = "12345678123456789123456789123456789123456789123456789123456789123456789123456789";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid does not contain 9 numbers in row");
});

it("invalid for 9x9 grid of non numeric characters", () => {
    let text = "abcdefghkabcdefghkabcdefghkabcdefghkabcdefghkabcdefghkabcdefghkabcdefghkabcdefghk";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid contains non numeric values");
});

it("invalid for less than 17 digits", () => {
    let text = "000000000000000060000000000000000006000000290000000014000000001000000000500403800";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid contains less than 17 digits");
});

it("invalid for same digit in row", () => {
    let text = "111000003089000060060078000000030006004500290006000014000020001070085000500403800";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid contains duplicates in row 1");
});

it("invalid for same digit in column", () => {
    let text = "100000003183004569060078000000030006004500290006000014000020001070085000500403800";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid contains duplicates in column 1");
});

it("invalid for same digit in square", () => {
    let text = "100000003013004569060078000000030006004500290006000014000020001070085000500403800";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid contains duplicates in square 1");
});

it("valid for ok grid", () => {
    let text = "000000003089000060060078000000030006004500290006000014000020001070085000500403800";
    let v = isValid(text);

    expect(v.isValid).toEqual(true);
    expect(v.message).toEqual("Grid can be solved");
});

it("valid for very hard", () => {
    let text = "800000000003600000070090200050007000000045700000100030001000068008500010090000400";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid can not be solved by this tool");
});

it("valid xychain", () => {
    let text = "600802735702356940300407062100975024200183079079624003400560207067240300920738406";
    let v = isValid(text);

    expect(v.isValid).toEqual(true);
    expect(v.message).toEqual("Grid can be solved");
});

it("long running failure: ", async () => {
    let text = "024000000000007100090000000000000084000075000600030000000400029000200300100000000";
    let v = isValid(text);

    expect(v.isValid).toEqual(false);
    expect(v.message).toEqual("Grid can not be solved by this tool");
});
