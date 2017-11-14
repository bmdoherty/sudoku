import Solver from "../src/Solver";

it("HiddenSingle, NakedSingle - Guardian hard Oct 13", () => {
    let text = "000000000007020400008504900009000800510080027000203000000000000435000196180000054";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([2, 4, 1, 6, 9, 7, 3, 8, 5]);
});

it("Naked Double", () => {
    let text = "400270600798156234020840007237468951849531726561792843082015479070024300004087002";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([4, 1, 3, 2, 7, 9, 6, 8, 5]);
});

it("Naked Triple, LockedCandidate, jellyfish, XYWing", () => {
    let text = "600802735702356940300407062100975024200183079079624003400560207067240300920738406";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([6, 9, 4, 8, 1, 2, 7, 3, 5]);
});

it("Naked Quad ", () => {
    let text = "624900000739100008815004000400009370300040006591003002900400200100296004248357169";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([6, 2, 4, 9, 3, 8, 7, 5, 1]);
});

it("Hidden double", () => {
    let text = "049132000081479000327685914096051800075028000038046005853267000712894563964513000";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([6, 4, 9, 1, 3, 2, 7, 5, 8]);
});

it("Hidden triplet", () => {
    let text = "400000005000200700001000608009102300302097000070060000020051006086030000500009000";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([4, 6, 7, 3, 1, 8, 2, 9, 5]);
});

it("Hidden Quad", () => {
    let text = "000374200000082040000000000000030826600090004805046970547020009000000405010450702";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([1, 5, 6, 3, 7, 4, 2, 9, 8]);
});

it("Hidden double, Hidden Quad, XY Wing", () => {
    let text = "632145978810090004040080010000850000160274000000960000481529060753416009296738040";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([6, 3, 2, 1, 4, 5, 9, 7, 8]);
});

it("Hidden double, swordfish & XY Wing", () => {
    let text = "195367248078050369306098157003780590709005006584906710832549671907013025051072900";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([1, 9, 5, 3, 6, 7, 2, 4, 8]);
});

it("Hidden double, LockedCandidate, jellyfish", () => {
    let text = "204103580000020341103485600732954168005010900619832400001508200300240000026300004";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([2, 9, 4, 1, 6, 3, 5, 8, 7]);
});

it.skip("jellyfish", () => {
    let text = "200000003080030050003402100001205400000090000009308600002506900090020070400000001";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([2, 5, 6, 8, 1, 9, 7, 4, 3]);
});

it.skip("euler 6: lockedCandidate, hidden triple, hidden Double & XWing", () => {
    let text = "043080250600000000000001094900004070000608000010200003820500000000000005034090710";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([1, 4, 3, 9, 8, 6, 2, 5, 7]);
});

it.skip("long running failure (unsolved): ", () => {
    let text = "024000000000007100090000000000000084000075000600030000000400029000200300100000000";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([0, 2, 4, 0, 0, 0, 9, 0, 0]); // un solved
});

it.skip("HiddenSingle, NakedSingle - Guardian hard Oct 12", () => {
    let text = "000000003089000060060078000000030006004500290006000014000020001070085000500403800";
    let solver = new Solver(text).solve();

    expect(solver.firstRow()).toEqual([4, 2, 7, 6, 5, 1, 9, 8, 3]);
});
