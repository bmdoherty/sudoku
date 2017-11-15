export default class Cell {
    constructor(grid, row, column, digit, locked) {
        this.id = row * 9 + column;
        this.grid = grid;
        this.rowID = row;
        this.columnID = column;
        this.locked = locked;
        this.squareID = Math.floor(row / 3) * 3 + Math.floor(column / 3);
        this.impossibilities = [];
        this._digit = digit;
        this.row = `R${this.rowID + 1}`;
        this.column = `C${this.columnID + 1}`;
        this.square = `S${this.squareID + 1}`;

        return this;
    }

    get digit() {
        return this._digit;
    }

    set digit(digit) {
        this.grid.row[this.rowID].used.add(digit);
        this.grid.row[this.rowID].unused.delete(digit);

        this.grid.column[this.columnID].used.add(digit);
        this.grid.column[this.columnID].unused.delete(digit);

        this.grid.square[this.squareID].used.add(digit);
        this.grid.square[this.squareID].unused.delete(digit);

        this.grid.row[this.rowID].cells.filter(v => v.id !== this.id).forEach(v => v.impossibilities.concat(digit));
        this.grid.column[this.columnID].cells
            .filter(v => v.id !== this.id)
            .forEach(v => v.impossibilities.concat(digit));
        this.grid.square[this.squareID].cells
            .filter(v => v.id !== this.id)
            .forEach(v => v.impossibilities.concat(digit));

        this._digit = digit;
    }

    // get excluded() {
    //     return [1, 2, 3, 4, 5, 6, 7, 8, 9]
    //         //.filter(v => [...this.impossibilities].indexOf(v) > -1)
    //         .filter(v => [...this.possibilities].indexOf(v) === -1);
    // }

    get possibilities() {
        return this.getPossibilities();
    }

    getPossibilities() {
        if (this.digit) {
            return new Set();
        }

        let possibles = new Set([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        for (let i = 0; i < this.impossibilities.length; i++) {
            possibles.delete(this.impossibilities[i]);
        }
        let s = this.grid.square[this.squareID].cells.map(v => v.digit).filter(v => v !== 0);
        let r = this.grid.row[this.rowID].cells.map(v => v.digit).filter(v => v !== 0);
        let c = this.grid.column[this.columnID].cells.map(v => v.digit).filter(v => v !== 0);

        let used = new Set(r.concat(c).concat(s));

        return new Set([...possibles].filter(v => !used.has(v)));
    }

    get canSee() {
        let s = this.grid.square[this.squareID].cells;
        let r = this.grid.row[this.rowID].cells;
        let c = this.grid.column[this.columnID].cells;

        return new Set(r.concat(c).concat(s));
    }

    addToImpossibilities(digit) {
        this.impossibilities.push(digit);

        return this.impossibilities;
    }
}
