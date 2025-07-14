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
        s1.send(convert(new Message(ConnectionType.OPEN, Player.PLAYER1, null, null)));
    } else if (s2 == null) {
        console.log("Armazenando jogador 2");
        game = new FourMation();
        s2 = ws;
        s2.send(convert(new Message(ConnectionType.OPEN, Player.PLAYER2, null, null)));
        sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard(), null));
    } else {
        ws.close();
    }

    ws.on('message', message => {
        console.log('message', message.toString(), ws === s1 ? Player.PLAYER1 : Player.PLAYER2);
        try {
            let ret = game.play(ws === s1 ? Player.PLAYER1 : Player.PLAYER2, JSON.parse(message.toString()));
            if (ret === Winner.NONE) {
                sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard(), null));
            } else {
                sendMessage(new Message(ConnectionType.ENDGAME, null, game.getBoard(), ret));
            }
        } catch (ex) {
            console.error(ex.message);
        }
    });
    // Evento quando o cliente fecha a conexão
    ws.on('close', reason => {
        console.log('Cliente desconectado', reason);
        switch (reason) {
            case 4000:
                if (ws === s1) {
                    s1 = null;
                } else {
                    s2 = null;
                }
                break;
            case 1001:
            case 4001:
                if (ws === s1) {
                    s2.send(convert(new Message(ConnectionType.ENDGAME, null, game.getBoard(), Winner.PLAYER2)));
                    s1 = null;
                } else {
                    s1.send(convert(new Message(ConnectionType.ENDGAME, null, game.getBoard(), Winner.PLAYER1)));
                    s2 = null;
                }
                break;
            default:
                console.log(`Close code ${reason} incorrect`);
        }
    });
    ws.on("error", error => {
        console.error("Erro no WebSocket:", error);
    });
});

function convert(message) {
    return JSON.stringify(message);
}

function sendMessage(msg) {
    s1.send(convert(msg));
    s2.send(convert(msg));
}
