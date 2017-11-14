import { isSquare } from "../Square";
import { isRow } from "../Row";
import { isColumn } from "../Column";

const cellIsNotInArray = (cell, array) => {
    return array.indexOf(cell.id) === -1;
};

export default class LockedCandidate {
    constructor() {
        this.type = "LockedCandidate";
        return this;
    }

    find(grid) {
        let candidateHouses = grid.house.filter(house => house.unused.size > 0);

        for (let house of candidateHouses) {
            switch (house.type) {
                case "row":
                case "column":
                    for (let digit of house.unused) {
                        let possibleCells = house.cells.filter(v => v.possibilities.has(digit));

                        if (possibleCells.length > 1) {
                            if (isSquare(possibleCells)) {
                                let squareID = possibleCells[0].squareID;
                                let total = grid.square[squareID].cells.filter(v => v.possibilities.has(digit));

                                if (possibleCells.length < total.length) {
                                    let locked = grid.square[squareID];
                                    let ids = possibleCells.map(v => v.id);
                                    return {
                                        ids: ids,
                                        digit: digit,
                                        house: house,
                                        locked: locked,
                                        strategy: this
                                    };
                                }
                            }
                        }
                    }
                    break;

                case "square":
                    for (let digit of house.unused) {
                        let possibleCells = house.cells.filter(v => v.possibilities.has(digit));

                        if (possibleCells.length > 1) {
                            if (isRow(possibleCells)) {
                                let rowID = possibleCells[0].rowID;
                                let total = grid.row[rowID].cells.filter(v => v.possibilities.has(digit));

                                if (possibleCells.length < total.length) {
                                    let locked = grid.row[rowID];
                                    let ids = possibleCells.map(v => v.id);
                                    return {
                                        ids: ids,
                                        digit: digit,
                                        house: house,
                                        locked: locked,
                                        strategy: this
                                    };
                                }
                            }

                            if (isColumn(possibleCells)) {
                                let columnID = possibleCells[0].columnID;
                                let total = grid.column[columnID].cells.filter(v => v.possibilities.has(digit));

                                if (possibleCells.length < total.length) {
                                    let locked = grid.column[columnID];
                                    let ids = possibleCells.map(v => v.id);
                                    return {
                                        ids: ids,
                                        digit: digit,
                                        house: house,
                                        locked: locked,
                                        strategy: this
                                    };
                                }
                            }
                        }
                    }

                    break;
                default:
                    break;
            }
        }

        return undefined;
    }

    apply(grid, step) {
        grid[step.locked.type][step.locked.id].cells
            .filter(v => step.ids.indexOf(v.id) === -1)
            .filter(v => v.possibilities.has(step.digit))
            .forEach(v => {
                v.addToImpossibilities(step.digit);
            });

        return true;
    }
}
