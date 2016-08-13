var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export class RedisPlayerScores {
    constructor(collectionId) {
        this.collectionId = collectionId;
        this.client = redis.createClient({detect_buffers: true, db:1});
    }

    async incPlayer(playerId, score) {
        return this.client.zincrbyAsync(this.collectionId, score, playerId);
    }
    async getTopPlayers(topN) {
        const players = await this.client.zrangeAsync(this.collectionId, 0, topN, 'withscores');
        return players;
        //return [...this.players.values()].sort((a, b) => b.score - a.score).slice(0, topN);
    }
    async getPlayerResults(playerId) {
        //return this.players.get(playerId);
        const score = await this.client.zrankAsync(this.collectionId, playerId);
        return {playerId, score};
    }
    async remove() {

    }
}