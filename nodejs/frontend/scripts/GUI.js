import Cell from "./Cell.js";

class GUI {
    constructor() {
        this.ws = null;
        this.player = null;
        this.closeCodes = { ENDGAME: { code: 4000, description: "End of game." }, ADVERSARY_QUIT: { code: 4001, description: "The opponent quit the game" } };
        this.ROWS = 7;
        this.COLS = 7;
    }
    coordinates(td) {
        return new Cell(td.parentNode.rowIndex, td.cellIndex);
    }
    readData(evt) {
        let data = JSON.parse(evt.data);
        switch (data.type) {
            case "OPEN":
                /* Informando cor da peça do usuário atual */
                this.player = data.turn;
                this.setMessage("Waiting for opponent.");
                this.clearBoard();
                break;
            case "MESSAGE":
                /* Recebendo o tabuleiro modificado */
                this.printBoard(data.board);
                this.setMessage(data.turn === this.player ? "Your turn." : "Opponent's turn.");
                break;
            case "ENDGAME":
                /* Fim do jogo */
                this.printBoard(data.board);
                this.ws.close(this.closeCodes.ENDGAME.code, this.closeCodes.ENDGAME.description);
                this.endGame(data.winner);
                break;
        }
    }
    clearBoard() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => {
            td.innerHTML = "";
            td.className = "";
            td.onclick = undefined;
        });
    }
    endGame(type) {
        this.unsetEvents();
        this.ws = null;
        this.setButtonText(true);
        this.setMessage(`Game Over! ${(type === "DRAW") ? "Draw!" : (type === this.player ? "You win!" : "You lose!")}`);
    }
    setButtonText(on) {
        let button = document.querySelector("input[type='button']");
        button.value = on ? "Start" : "Quit";
    }
    play(evt) {
        let begin = this.coordinates(evt.currentTarget);
        this.ws.send(JSON.stringify(begin));
    }
    showPossibleMoves() {
        let moves = this.game.possibleMoves();
        let tbody = document.querySelector("tbody");
        moves.forEach(({ x, y }) => {
            tbody.rows[x].cells[y].classList.add("MOVE");
        });
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
    printBoard(matrix) {
        let tbody = document.querySelector("tbody");
        tbody.innerHTML = "";
        for (let i = 0; i < this.ROWS; i++) {
            let tr = document.createElement("tr");
            tbody.appendChild(tr);
            for (let j = 0; j < this.COLS; j++) {
                let td = document.createElement("td");
                td.className = "";
                td.onclick = this.play.bind(this);
                if (matrix) {
                    switch (matrix[i][j]) {
                        case "PLAYER1":
                        case "PLAYER2":
                            td.className = matrix[i][j];
                            break;
                    }
                }
                tr.appendChild(td);
            }
        }
    }
    unsetEvents() {
        let cells = document.querySelectorAll("td");
        cells.forEach(td => td.onclick = undefined);
    }
    startGame() {
        if (this.ws) {
            this.ws.close(this.closeCodes.ADVERSARY_QUIT.code, this.closeCodes.ADVERSARY_QUIT.description);
            this.endGame();
        } else {
            this.ws = new WebSocket("ws://localhost:8081");
            // this.ws = new WebSocket("ws://" + document.location.host + document.location.pathname);
            this.ws.onmessage = this.readData.bind(this);
            this.setButtonText(false);
        }
    }
    init() {
        let button = document.querySelector("input[type='button']");
        button.onclick = this.startGame.bind(this);
        this.setButtonText(true);
        this.printBoard();
        // this.changeMessage();
    }
}
let gui = new GUI();
gui.init();