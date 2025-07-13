import { WebSocketServer } from 'ws';
import FourMation from './FourMation';

const wss = new WebSocketServer({ port: 8081 });
console.log("Servidor ouvindo na porta 8081");
let s1, s2, game = null;
wss.on('connection', ws => {
    console.log(ws);
    // open
    if (s1 === null) {
        console.log("Armazenando jogador 1");
        s1 = ws;
        // s1.send(new Message(ConnectionType.OPEN, Player.PLAYER1, null, null));
    } else if (s2 == null) {
        console.log("Armazenando jogador 2");
        game = new FourMation();
        s2 = ws;
        // s2.send(new Message(ConnectionType.OPEN, Player.PLAYER2, null, null));
        // sendMessage(new Message(ConnectionType.MESSAGE, game.getTurn(), game.getBoard(), null));
    } else {
        ws.close();
    }

    ws.on('message', message => {
        console.log(message);
    });
    // Evento quando o cliente fecha a conexão
    ws.on('close', () => {
        console.log('Cliente desconectado');
    });
    ws.on("error", error => {
        console.error("Erro no WebSocket:", error);
    });
});
