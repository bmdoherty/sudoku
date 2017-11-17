const makeChainLink = (grid, node, cells, size, chain = [], visited = [], out = []) => {
    let processLink = (node, chain) => {
        let excluded = [...chain[0].cell.canSee]
            .filter(v => node.cell.canSee.has(v))
            .filter(v => v.possibilities.has(node.mustBe));

        let sameRow = chain[0].cell.rowID === node.cell.rowID;
        let sameColumn = chain[0].cell.columnID === node.cell.columnID;
        let sameSquare = chain[0].cell.squareID === node.cell.squareID;

        if (excluded.length && !sameRow && !sameColumn && !sameSquare) {
            visited.push(node.cell.id);
            out.push(chain);
        }
    };

    let nextLink = (house, node) => {
        let links = house.links[node.mustBe].filter(v => visited.indexOf(v.id) === -1).filter(v => v.id !== cell.id);
        let linkCell = grid.cells[links[0].id];
        let mustBe = [...linkCell.possibilities.values()].filter(v => v !== node.mustBe)[0];
        let cannotBe = [...linkCell.possibilities.values()].filter(v => v !== mustBe)[0];

        makeChainLink(
            grid,
            { cell: linkCell, mustBe: mustBe, cannotBe: cannotBe },
            cells.filter(v => v.id !== cell.id),
            size,
            chain.slice(0),
            visited,
            out
        );
    };

    let cell = node.cell;
    chain.push(node);

    if (!cells.length || chain.length > size) {
        return;
    }

    if (node.mustBe === chain[0].cannotBe) {
        processLink(node, chain);
    } else {
        // row
        if (grid.row[cell.rowID].links[node.mustBe]) {
            nextLink(grid.row[cell.rowID], node);
        }

        // column
        if (grid.column[cell.columnID].links[node.mustBe]) {
            nextLink(grid.column[cell.columnID], node);
        }

        // square
        if (grid.square[cell.squareID].links[node.mustBe]) {
            nextLink(grid.square[cell.squareID], node);
        }
    }

    return out;
};

export default class XYChain {
    constructor() {
        this.type = "XYChain";
        return this;
    }

    find(grid) {
        let candidateHouses = grid.house.filter(house => house.unused.size > 0);

        for (let size = 3; size < 10; size++) {
            for (let digit = 1; digit <= 9; digit++) {
                let bivalueCells = grid.cells.filter(v => v.possibilities.size === 2);
                let startCells = bivalueCells.filter(v => v.possibilities.has(digit));

                while (startCells.length) {
                    let cell = startCells[0];
                    startCells = startCells.filter(v => v.id !== cell.id);
                    bivalueCells = bivalueCells.filter(v => v.id !== cell.id);

                    let mustBe = [...cell.possibilities].filter(v => v !== digit)[0];
                    let node = { cell: cell, mustBe: mustBe, cannotBe: digit };
                    let chain = makeChainLink(grid, node, bivalueCells.map(v => v.id), size);

                    if (chain && chain.length && chain[0].length) {
                        return {
                            chain: [].concat(...chain),
                            type: "XYChain",
                            length: chain.length,
                            strategy: this
                        };
                    }
                }
            }
        }

        return undefined;
    }

    apply(grid, step) {
        let start = step.chain[0];
        let end = step.chain[step.chain.length - 1];

        let excluded = [...start.cell.canSee]
            .filter(v => end.cell.canSee.has(v))
            .filter(v => v.possibilities.has(start.cannotBe))
            .forEach(v => {
                v.addToImpossibilities(end.mustBe);
            });

        return excluded;
    }
}
