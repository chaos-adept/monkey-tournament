import log4js from 'log4js';
log4js.configure('log4js.json', { reloadSecs: 300 });
const logger = log4js.getLogger('attempts-logger');

export class PlayerScores {
    constructor() {
        this.players = new Map();
    }

    async incPlayer({playerId, value}) {
        let playerResults = this.players.get(playerId);

        if (!this.players.get(playerId)) {
            playerResults = { playerId: playerId , value: 0};
            this.players.set(playerId, playerResults);
        }

        playerResults.value += value;
    }
    async getTopPlayers(topN) {
        return [...this.players.values()].sort((a, b) => b.value - a.value).slice(0, topN);
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

    async incByDay(playerId, value, time) {
        const key = this.getKey(time);
        let scores = this.daysMap.get(key);
        if (!scores) {
            scores = new PlayerScores();
            this.daysMap.set(key, scores);
        }

        scores.incPlayer({playerId, value});
    }
    async getTopPlayers(topN, time) {
        const scores = this.daysMap.get(this.getKey(time));
        return scores ? scores.getTopPlayers(topN) : [];
    }
    async remove() {}

}

export class DeadMatch {
    constructor(allTimeScores, dayScores) {
        this.allTimeScores = allTimeScores;
        this.dayScores = dayScores;
    }

    async makeTurn(turn) {
        const {playerId, value, time, location} = turn;
        return Promise.all([
            this.allTimeScores.incPlayer(turn),
            this.dayScores.incByDay(playerId, value, time)]);
    }

    async getTopPlayersByAllTime(topN) {
        return this.allTimeScores.getTopPlayers(topN);
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
