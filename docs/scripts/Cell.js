export default class Cell {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    equals(cell) {
        return this.x === cell.x && this.y === cell.y;
    }
}