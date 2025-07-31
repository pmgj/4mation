import { WebSocketServer } from 'ws';
import FourMation from '../model/FourMation.js';
import Message from './Message.js';
import ConnectionType from './ConnectionType.js';
import Player from '../model/Player.js';
import Winner from '../model/Winner.js';

const wss = new WebSocketServer({ port: 8081 });
console.log("Servidor ouvindo na porta 8081");
let s1 = null;
let s2 = null;
let game = null;
wss.on('connection', ws => {
    // open
    if (s1 === null) {
        console.log("Armazenando jogador 1");
        s1 = ws;
        let msg = new Message(ConnectionType.OPEN, Player.PLAYER1, null, null);
        s1.send(JSON.stringify(msg));
    } else if (s2 == null) {
        console.log("Armazenando jogador 2");
        game = new FourMation();
        s2 = ws;
        let msg = new Message(ConnectionType.OPEN, Player.PLAYER2, null, null)
        s2.send(JSON.stringify(msg));
        msg = new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard(), null);
        sendMessage(JSON.stringify(msg));
    } else {
        ws.close();
    }

    ws.on('message', message => {
        const beginCell = JSON.parse(message);
        console.log('Received JSON message:', beginCell);
        try {
            let ret = game.play(ws === s1 ? Player.PLAYER1 : Player.PLAYER2, beginCell);
            if (ret === Winner.NONE) {
                sendMessage2(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard(), null));
            } else {
                sendMessage2(new Message(ConnectionType.ENDGAME, null, game.getBoard(), ret));
            }
        } catch (ex) {
            console.log(ex.message);
        }
    });
    // Evento quando o cliente fecha a conexão
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
    ws.on("error", error => {
        console.error("Erro no WebSocket:", error);
    });
});

function sendMessage(msg) {
    s1.send(msg);
    s2.send(msg);
}
function sendMessage2(msg) {
    let json = JSON.stringify(msg);
    s1.send(json);
    s2.send(json);
}
