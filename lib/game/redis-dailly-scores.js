var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
import moment from 'moment';
import {RedisPlayerScores} from './redis-player-scores'

export class RedisDailyPlayerScores {
    constructor(collectionPrefix) {
        this.collectionPrefix = collectionPrefix;
        this.client = redis.createClient({detect_buffers: true, db:1});
    }

    getKey(time) {
        return this.collectionPrefix + ':' + time.format('YYYY-MM-DD');
    }

    async incByDay(playerId, score, time) {
        const scores = new RedisPlayerScores(this.getKey(time), this.client);
        return scores.incPlayer(playerId, score);
    }
    async getTopPlayers(topN, time) {
        const scores = new RedisPlayerScores(this.getKey(time), this.client);
        return scores.getTopPlayers(topN);
    }

    async remove() {
        // const keys = await this.client.keysAsync(this.collectionPrefix + '*');
        // return Promise.all(keys.map((key) => {
        //     return this.client.delAsync(key);
        // }));
    }
}
