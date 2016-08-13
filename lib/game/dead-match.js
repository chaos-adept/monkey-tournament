import log4js from 'log4js';
log4js.configure('log4js.json', { reloadSecs: 300 });
const logger = log4js.getLogger('attempts-logger');

export default class DeadMatchGame {
    constructor() {
        this.players = new Map();
    }
    makeTurn(turn) {
        logger.info(`${turn.playerId}, ${turn.value}`);
        let playerResults = this.players.get(turn.playerId);

        if (!this.players.get(turn.playerId)) {
            playerResults = { playerId: turn.playerId , score: 0};
            this.players.set(turn.playerId, playerResults);
        }

        playerResults.score += turn.value;
    }
    getTopPlayers(topN) {
        return [...this.players.values()].sort((a, b) => b.score - a.score).slice(0, topN);
    }
    getPlayerResults(playerId) {
        return this.players.get(playerId);
    }
}
