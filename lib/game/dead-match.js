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



export class DailyPlayerScores {
    constructor() {
        this.daysMap = new Map();
    }

    getKey(time) {
        return time.format('YYYY-MM-DD');
    }

    async incByDay(playerId, score, time) {
        const key = this.getKey(time);
        let scores = this.daysMap.get(key);
        if (!scores) {
            scores = new PlayerScores();
            this.daysMap.set(key, scores);
        }

        scores.incPlayer(playerId, score);
    }
    async getTopPlayers(topN, time) {
        const scores = this.daysMap.get(this.getKey(time));
        return scores ? scores.getTopPlayers(topN) : [];
    }
}

export class DeadMatch {
    constructor(allTimeScores, dayScores) {
        this.allTimeScores = allTimeScores;
        this.dayScores = dayScores;
    }

    async makeTurn({playerId, value, time}) {
        return Promise.all([
            this.allTimeScores.incPlayer(playerId, value),
            this.dayScores.incByDay(playerId, value, time)]);
    }

    async getTopPlayersByAllTime(topN) {
        return this.allTimeScores.getTopPlayers(topN);
    }

    async getPlayerAlltimeResults(playerId) {
        return this.allTimeScores.getPlayerResults(playerId);
    }

    async getGameStatsForDay(topN, moment) {
        const dayScores = await this.dayScores.getTopPlayers(topN, moment);
        return dayScores;
    }


    async remove() {
        await this.allTimeScores.remove();
        await this.dayScores.remove();
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
        return this.playerStore.getPlayerAlltimeResults(playerId);
    }
}
