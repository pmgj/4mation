import Player from "./Player.js";
import CellState from "./CellState.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

export default class FourMation {
    constructor(nrows = 7, ncols = 7) {
        this.ROWS = nrows;
        this.COLS = ncols;
        this.turn = Player.PLAYER1;
        this.board = new Array(nrows).fill(0).map(x => new Array(ncols).fill(CellState.EMPTY));
        this.lastCell = null;
    }
    getTurn() {
        return this.turn;
    }
    getRows() {
        return this.ROWS;
    }
    getCols() {
        return this.COLS;
    }
    getBoard() {
        return this.board;
    }
    onBoard({ x, y }) {
        return x >= 0 && x < this.ROWS && y >= 0 && y < this.COLS;
    }
    play(player, player, cell) {
        if (player !== this.turn) {
            throw new Error("It's not your turn.");
        }
        let { x, y } = cell;
        if (player != this.turn) {
            throw new Error("It is not your turn.");
        }
        if (!this.onBoard(cell)) {
            throw new Error("Cell does not exist.");
        }
        if (this.board[x][y] !== CellState.EMPTY) {
            throw new Error("Cell is not empty.");
        }
        if (this.lastCell) {
            let { x: x1, y: y1 } = this.lastCell;
            let cells = [new Cell(x1 - 1, y1 - 1), new Cell(x1 - 1, y1), new Cell(x1 - 1, y1 + 1), new Cell(x1, y1 - 1), new Cell(x1, y1 + 1), new Cell(x1 + 1, y1 - 1), new Cell(x1 + 1, y1), new Cell(x1 + 1, y1 + 1)];
            if (cells.some(c => this.onBoard(c) && this.board[c.x][c.y] === CellState.EMPTY)) {
                if (!cells.some(c => c.equals(cell))) {
                    throw new Error("Not orthogonal.");
                }
            }
        }
        this.board[x][y] = this.turn === Player.PLAYER1 ? CellState.PLAYER1 : CellState.PLAYER2;
        this.lastCell = cell;
        this.turn = this.turn === Player.PLAYER1 ? Player.PLAYER2 : Player.PLAYER1;
        return this.endOfGame();
    }
    possibleMoves() {
        let moves = [];
        if (this.lastCell) {
            let { x, y } = this.lastCell;
            let cells = [new Cell(x - 1, y - 1), new Cell(x - 1, y), new Cell(x - 1, y + 1), new Cell(x, y - 1), new Cell(x, y + 1), new Cell(x + 1, y - 1), new Cell(x + 1, y), new Cell(x + 1, y + 1)];
            cells.forEach(c => {
                let { x: i, y: j } = c;
                if (this.onBoard(c) && this.board[i][j] === CellState.EMPTY) {
                    moves.push(c);
                }
            });
        }
        if (moves.length === 0) {
            for (let i = 0; i < this.ROWS; i++) {
                for (let j = 0; j < this.COLS; j++) {
                    if (this.board[i][j] === CellState.EMPTY) {
                        moves.push(new Cell(i, j));
                    }
                }
            }
        }
        return moves;
    }
    endOfGame() {
        let checkH = player => {
            for (let i = 0; i < this.ROWS; i++) {
                for (let j = 0; j <= this.COLS - 4; j++) {
                    if (this.board[i][j] === player && this.board[i][j + 1] === player && this.board[i][j + 2] === player && this.board[i][j + 3] === player) {
                        return true;
                    }
                }
            }
            return false;
        };
        let checkV = player => {
            for (let i = 0; i < this.COLS; i++) {
                for (let j = 0; j <= this.ROWS - 4; j++) {
                    if (this.board[j][i] === player && this.board[j + 1][i] === player && this.board[j + 2][i] === player && this.board[j + 3][i] === player) {
                        return true;
                    }
                }
            }
            return false;
        };
        let checkD1 = player => {
            for (let i = 0; i <= this.ROWS - 4; i++) {
                for (let j = 0; j <= this.COLS - 4; j++) {
                    if (this.board[i][j] === player && this.board[i + 1][j + 1] === player && this.board[i + 2][j + 2] === player && this.board[i + 3][j + 3] === player) {
                        return true;
                    }
                }
            }
            return false;
        };
        let checkD2 = player => {
            for (let i = 0; i <= this.ROWS - 4; i++) {
                for (let j = 3; j < this.COLS; j++) {
                    if (this.board[i][j] === player && this.board[i + 1][j - 1] === player && this.board[i + 2][j - 2] === player && this.board[i + 3][j - 3] === player) {
                        return true;
                    }
                }
            }
            return false;
        };
        if (checkH(CellState.PLAYER1) || checkV(CellState.PLAYER1) || checkD1(CellState.PLAYER1) || checkD2(CellState.PLAYER1)) {
            return Winner.PLAYER1;
        } else if (checkH(CellState.PLAYER2) || checkV(CellState.PLAYER2) || checkD1(CellState.PLAYER2) || checkD2(CellState.PLAYER2)) {
            return Winner.PLAYER2;
        } else if (this.board.flat().filter(c => c === CellState.EMPTY).length === 0) {
            return Winner.DRAW;
        }
        return Winner.NONE;
    }
}
// let fm = new FourMation();
function test1() {
    console.log(fm.play(new Cell(2, 3)));
    console.log(fm.play(new Cell(1, 3)));
    console.log(fm.play(new Cell(2, 4)));
    console.log(fm.play(new Cell(1, 4)));
    console.log(fm.play(new Cell(2, 5)));
    console.log(fm.play(new Cell(1, 5)));
    console.log(fm.play(new Cell(2, 6)));
}
function test2() {
    console.log(fm.play(new Cell(2, 3)));
    console.log(fm.play(new Cell(2, 2)));
    console.log(fm.play(new Cell(3, 3)));
    console.log(fm.play(new Cell(3, 2)));
    console.log(fm.play(new Cell(4, 3)));
    console.log(fm.play(new Cell(4, 2)));
    console.log(fm.play(new Cell(5, 3)));
}