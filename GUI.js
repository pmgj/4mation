import FourMation from "./FourMation.js";
import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.game = null;
    }
    coordinates(td) {
        return new Cell(td.parentNode.rowIndex, td.cellIndex);
    }
    play(ev) {
        let message = document.querySelector("#message");
        let cell = this.coordinates(ev.target);
        let turn = this.game.getTurn();
        try {
            let w = this.game.play(cell);
            ev.target.className = turn;
            this.changeMessage(w);
        } catch (ex) {
            message.textContent = ex.message;
        }
    }
    showPossibleMoves() {
        let cell = this.game.getLastCell();
        let tbody = document.querySelector("tbody");
        if (cell) {
            let { x, y } = cell;
            let cells = [new Cell(x - 1, y - 1), new Cell(x - 1, y), new Cell(x - 1, y + 1), new Cell(x, y - 1), new Cell(x, y + 1), new Cell(x + 1, y - 1), new Cell(x + 1, y), new Cell(x + 1, y + 1)];
            cells.forEach(c => {
                let { x: i, y: j } = c;
                let td = tbody.rows[i].cells[j];
                if (!td.classList.contains("PLAYER1") && !td.classList.contains("PLAYER2")) {
                    td.classList.add("MOVE");
                }
            });
        } else {
            for (let i = 0; i < this.game.getRows(); i++) {
                for (let j = 0; j < this.game.getCols(); j++) {
                    let td = tbody.rows[i].cells[j];
                    td.classList.add("MOVE");
                }
            }
        }
    }
    resetMoves() {
        let tbody = document.querySelector("tbody");
        for (let i = 0; i < this.game.getRows(); i++) {
            for (let j = 0; j < this.game.getCols(); j++) {
                let td = tbody.rows[i].cells[j];
                td.classList.remove("MOVE");
            }
        }
    }
    changeMessage(m) {
        let objs = { DRAW: "Draw!", PLAYER2: "Red's win!", PLAYER1: "Blue's win!" };
        if (objs[m]) {
            this.setMessage(`Game Over! ${objs[m]}`);
        } else {
            let msgs = { PLAYER1: "Blue's turn.", PLAYER2: "Red's turn." };
            this.setMessage(msgs[this.game.getTurn()]);
            this.resetMoves();
            this.showPossibleMoves();
        }
    }
    setMessage(message) {
        let msg = document.getElementById("message");
        msg.textContent = message;
    }
    printBoard() {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < this.game.getRows(); i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < this.game.getCols(); j++) {
                let td = document.createElement("td");
                td.onclick = this.play.bind(this);
                tr.appendChild(td);
            }
        }
    }
    init() {
        let iSize = document.getElementById("size");
        let iStart = document.getElementById("start");
        iSize.onchange = this.init.bind(this);
        iStart.onclick = this.init.bind(this);
        let size = iSize.valueAsNumber;
        this.game = new FourMation(size, size);
        this.printBoard();
        this.changeMessage();
    }
}
let gui = new GUI();
gui.init();