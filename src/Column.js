import House from "./House";

export default class Column extends House {
    constructor(id, cells, grid) {
        super(id, cells, grid);
        this.type = "column";
        return this;
    }
}

export function isColumn(cells) {
    return cells.every((v, i, a) => v.columnID === a[0].columnID);
}
