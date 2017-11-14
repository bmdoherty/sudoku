import Grid from "./Grid";

import NakedSingle from "./strategies/nakedSingle";
import HiddenSingle from "./strategies/hiddenSingle";
import Naked from "./strategies/naked";
import Hidden from "./strategies/hidden";
import LockedCandidate from "./strategies/lockedCandidate";
import XYChain from "./strategies/XYChain";
import Fish from "./strategies/fish";

const ns = new NakedSingle();
const hs = new HiddenSingle();
const n = new Naked();
const h = new Hidden();
const lc = new LockedCandidate();
const f = new Fish();
const xy = new XYChain();

const strategies = [ns, hs, n, h, lc, f, xy];

export default class Solver {
    constructor(text) {
        this.grid = new Grid(text);

        return this;
    }

    isSolved() {
        let isSolved = true;
        for (let i = 0; i < 9; i++) {
            if (this.grid.row[i].isSolved === false) {
                isSolved = false;
            }
        }

        return isSolved;
    }

    next() {
        let next;

        for (let i in strategies) {
            next = strategies[i].find(this.grid);
            if (next) {
                return next;
            }
        }
    }

    solve() {
        let i = 1;
        let nextStep = this.next();

        while (!this.isSolved() && nextStep) {
            this.apply(nextStep);
            nextStep = this.next();
            i = i + 1;
        }

        return this;
    }

    apply(step) {
        step.strategy.apply(this.grid, step);

        return;
    }

    firstRow() {
        return this.grid.row[0].cells.map(v => v.digit);
    }
}
