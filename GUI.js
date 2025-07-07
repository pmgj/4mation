import FourMation from "./FourMation.js";
import Cell from "./Cell.js";
import Winner from "./Winner.js";

class GUI {
    constructor() {
        this.game = new FourMation();
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
            if (w !== Winner.NONE) {
                message.textContent = w === Winner.PLAYER1 ? "As azuis ganharam!" : w === Winner.PLAYER2 ? "As vermelhas ganharam!" : "Empate";
            }
        } catch (ex) {
            message.textContent = ex.message;
        }
    }
    init() {
        let tbody = document.querySelector("tbody");
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
}
let gui = new GUI();
gui.init();