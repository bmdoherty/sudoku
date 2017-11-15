const canExcludeAPossibilty = (hiddenCellSet, hiddenDigitSet) => {
    let cells = hiddenCellSet.filter(cell => cell.possibilities.size > hiddenDigitSet.length);
    return !!cells.length;
};

const combinations = (str, length) => {
    const fn = function(rest, length, active = [], out = []) {
        if (!active.length && !rest.length) {
            return;
        }

        if (!rest.length) {
            if (active.length === length) {
                out.push(active);
            }
        } else {
            fn(rest.slice(1), length, active.concat(rest[0]), out);
            fn(rest.slice(1), length, active, out);
        }

        return out;
    };

    return fn(str, length);
};

export default class Hidden {
    constructor() {
        this.type = "Hidden";
        return this;
    }

    find(grid) {
        // need at least 3 for 2 unused cells to find a hidden double
        for (let size = 2; size <= 4; size++) {
            let candidateHouses = grid.house.filter(house => house.unused.size >= size + (size - 1));

            for (let house of candidateHouses) {
                let possibleSetOfHiddenDigits = combinations([...house.unused], size);

                for (let possibleHiddenDigits of possibleSetOfHiddenDigits) {
                    let possibleSetOfHiddenCells = house.unusedCells.filter(cell =>
                        [...cell.possibilities].some(v => possibleHiddenDigits.indexOf(v) > -1)
                    );

                    if (possibleSetOfHiddenCells.length === size) {
                        if (canExcludeAPossibilty(possibleSetOfHiddenCells, possibleHiddenDigits)) {
                            let id = possibleSetOfHiddenCells.map(v => v.id);
                            let digits = possibleHiddenDigits;

                            return {
                                id: id,
                                digits: digits,
                                house: house,
                                length: size,
                                strategy: this
                            };
                        }
                    }
                }
            }
        }

        return undefined;
    }

    apply(grid, step) {
        step.house.cells.filter(cell => step.id.indexOf(cell.id) > -1).forEach(cell => {
            let impossible = [...cell.possibilities].filter(p => {
                return step.digits.indexOf(p) === -1;
            });
            cell.impossibilities = cell.impossibilities.concat(...impossible);
        });

        return true;
    }
}
