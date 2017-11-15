import House from "./House";

export default class Square extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = "square";

        return this;
    }
}

export function isSquare(cells) {
    return cells.every((v, i, a) => v.squareID === a[0].squareID);
}
