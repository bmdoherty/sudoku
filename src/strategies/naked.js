const cellsAffected = (house, id, digits) => {
    let cells = house.cells
        .filter(cell => id.indexOf(cell.id) === -1)
        .filter(cell => [...cell.possibilities].some(p => digits.indexOf(p) > -1));

    return cells;
};

const canExcludeAPossibilty = (house, id, digits) => {
    return !!cellsAffected(house, id, digits).length;
};

export default class Naked {
    constructor() {
        this.type = "Naked";
        return this;
    }

    find(grid) {
        let candidateHouses;

        for (let size = 2; size <= 4; size++) {
            candidateHouses = grid.house.filter(house => house.unused.size > size);

            for (let house of candidateHouses) {
                let possibleSetOfNakedDigits = house.cells
                    .filter(cell => cell.possibilities.size <= size)
                    .map(cell => [...cell.possibilities]);

                for (let possibleNakedDigits of possibleSetOfNakedDigits) {
                    let possibleSetOfNakedCells = house.unusedCells.filter(cell =>
                        [...cell.possibilities].every(v => possibleNakedDigits.indexOf(v) > -1)
                    );

                    if (possibleSetOfNakedCells.length === size) {
                        let id = possibleSetOfNakedCells.map(v => v.id);
                        let digits = possibleNakedDigits;

                        if (canExcludeAPossibilty(house, id, digits)) {
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
        cellsAffected(step.house, step.id, step.digits).forEach(v => {
            v.impossibilities = v.impossibilities.concat(step.digits);
        });

        return true;
    }
}
