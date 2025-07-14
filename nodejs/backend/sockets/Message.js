export default class Message {
    constructor(type, turn, board, winner) {
        this.type = type;
        this.turn = turn;
        this.board = board;
        this.winner = winner;
    }
}