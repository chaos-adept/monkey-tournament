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
        const raw = await this.client.zrevrangeAsync(this.collectionId, 0, topN, 'withscores');
        const results = [];
        for (let i = 0; i < raw.length-1; i += 2) {
            results.push({playerId:raw[i], score:+raw[i+1]});
        }
        return results;
    }
    async getPlayerResults(playerId) {
        const score = +(await this.client.zscoreAsync(this.collectionId, playerId));
        return {playerId, score};
    }
    async remove() {
        return this.client.delAsync(this.collectionId);
    }
}