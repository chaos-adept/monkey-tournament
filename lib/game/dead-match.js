import log4js from 'log4js';
log4js.configure('log4js.json', { reloadSecs: 300 });
const logger = log4js.getLogger('attempts-logger');

export class PlayerScores {
    constructor() {
        this.players = new Map();
    }

    async incPlayer(playerId, score) {
        let playerResults = this.players.get(playerId);

        if (!this.players.get(playerId)) {
            playerResults = { playerId: playerId , score: 0};
            this.players.set(playerId, playerResults);
        }

        playerResults.score += score;
    }
    async getTopPlayers(topN) {
        return [...this.players.values()].sort((a, b) => b.score - a.score).slice(0, topN);
    }
    async getPlayerResults(playerId) {
        return this.players.get(playerId);
    }
    async remove() {
        return this.players.clear();
    }
}

export class DeadMatchGame {
    constructor(playerStore) {
        this.playerStore = playerStore;
    }
    async makeTurn(turn) {
        logger.info(`${turn.playerId}, ${turn.value}`);
        return this.playerStore.incPlayer(turn.playerId, turn.value);
    }
    async getTopPlayers(topN) {
        return this.playerStore.getTopPlayers(topN);
    }
    async getPlayerResults(playerId) {
        return this.playerStore.getPlayerResults(playerId);
    }
}
