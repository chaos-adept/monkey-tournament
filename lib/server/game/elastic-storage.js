let elasticsearch = require('elasticsearch');

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';

const index = 'attempt';
const typeAttempt = 'attempt';
const typeSensorData = 'sensorData';

const indexMapping = {
    "mappings": {
        [typeAttempt]: {
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
        },
        [typeSensorData]: {
            "_all":       { "enabled": false  },
            "properties": {
                "playerId": {
                    "type": "text"
                },
                "sessionId": {
                    "type": "text"
                },
                "date": {
                    "type": "date"
                },
                "acceleration": {
                    "properties": {
                        "x": { "type": "float" },
                        "y": { "type": "float" },
                        "z": { "type": "float" }
                    }
                },
                "rotationRate": {
                    "properties": {
                        "alpha": { "type": "float" },
                        "beta": { "type": "float" },
                        "gamma": { "type": "float" }
                    }
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

const docToSensorData = ({_source: doc}) => {
    return {
        playerId: doc.playerId,
        sessionId: doc.sessionId,
        acceleration: doc.acceleration,
        rotationRate: doc.rotationRate,
        time: moment.utc(doc.date) };
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
            'type': typeAttempt,
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
            'type': typeAttempt,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        return results.hits.hits.map(docToAttempt);
    }

    async getAcclerations(sessionId) {
        const results = await this.client.search({
            index,
            'type': typeSensorData,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        return results.hits.hits.map(docToSensorData);
    }

    async flush() {
        return this.client.indices.flushSynced({ index });
    }

    async incAcceleration(data) {
        return this.client.index({
            index,
            'type': typeSensorData,
            body: {
                playerId: data.playerId,
                sessionId: data.sessionId,
                acceleration: data.acceleration,
                rotationRate: data.rotationRate,
                date: data.time.utc().format()
            }
        });
    }

    async remove() {
        if (await this.isIndexPrepared()) {
            return this.client.indices.delete({ index: 'attempt' });
        }
    }
}
