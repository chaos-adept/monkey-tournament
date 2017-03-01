let elasticsearch = require('elasticsearch');

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';

const index = 'attempt';
const type = 'attempt';

const indexMapping = {
    "mappings": {
        [type]: {
            "_all":       { "enabled": false  },
            "properties": {
                "playerId": {
                    "type": "text"
                },
                "value": {
                    "type": "long"
                },
                "date": {
                    "type": "date"
                },
                "location": {
                    "type": "geo_point"
                }
            }
        }
    }
};

const docToAttempt  = ({_source: doc}) => {
    return {
        playerId: doc.playerId,
        value: +doc.value,
        time: moment.utc(doc.date),
        location: doc.location };
};

export class ElasticStorage {

    constructor() {

        this.client = new elasticsearch.Client({
            host: 'localhost:9200',
            log: 'trace'
        });

        this.client.ping({
            requestTimeout: 1000
        }, function (error) {
            if (error) {
                console.trace('elasticsearch cluster is down!');
            } else {
                console.log('All is well');
            }
        });
    }

    async isIndexPrepared() {
        return this.client.indices.exists({ index });
    }

    async prepare() {
        if (!(await this.isIndexPrepared())) {
            return this.client.indices.create({ index , body: indexMapping});
        }
    }

    async incPlayer(turn) {
        return this.client.index({
            index,
            type,
            body: {
                playerId: turn.playerId,
                value: turn.value,
                location: turn.location,
                date: turn.time.utc().format()
            }
        });
    }

    async getAllAttempts() {
        const results = await this.client.search({
            index,
            type,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        return results.hits.hits.map(docToAttempt);
    }

    async flush() {
        return this.client.indices.flushSynced({ index: type });
    }

    async remove() {
        if (await this.isIndexPrepared()) {
            return this.client.indices.delete({ index: 'attempt' });
        }
    }
}
