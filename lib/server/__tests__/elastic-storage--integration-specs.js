let elasticsearch = require('elasticsearch');

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';

const indexName = 'attempt';
const typeName = 'attempt';

class ElasticStorage {

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
        return this.client.indices.exists({ index: indexName });
    }

    async prepare() {
        if (!(await this.isIndexPrepared())) {
            return this.client.indices.create({ index: indexName , body: {
                "mappings": {
                    [typeName]: {
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
                            }
                        }
                    }
                }
            }});
        }
    }

    async logAttempt(attempt) {
        return this.client.index({
            index: indexName,
            type: typeName,
            body: {
                playerId: attempt.playerId,
                value: attempt.value,
                date: attempt.time.utc().format()
            }
        });
    }

    async getAllAttempts() {
        const results = await this.client.search({
            index: indexName,
            type: typeName,
            body: {
                query: {
                    match_all: {}
                }
            }
        });
        console.log(results);
        return results.hits.hits.map(({_source: doc}) => {
            console.log(doc);
            return { playerId: doc.playerId, value: +doc.value, time: moment.utc(doc.date)};
        });
    }

    async flush() {
        return this.client.indices.flushSynced({ index: typeName });
    }

    async remove() {
        if (await this.isIndexPrepared()) {
            return this.client.indices.delete({ index: 'attempt' });
        }
    }
}


describe('elastic daily stores', () => {
    let store;
    beforeEach(async() => {
        store = new ElasticStorage('ut-d');
        return store.prepare();
    });

    afterEach(async() => {
        return store.remove();
    });

    it("should check index availability", async () => {
        await store.remove();
        const isAvailable = await store.isIndexPrepared();
        isAvailable.should.be.eq(false);
    });

    it("should create index if it is not exists", async () => {
        //given
        await store.remove();
        //when
        await store.prepare();
        //then
        (await store.isIndexPrepared()).should.be.eq(true);
    });

    it("should store attempt", async () => {
        const expectedAttempt = { playerId:'p1', value:10, time:moment() };
        await store.logAttempt(expectedAttempt);
        await store.flush();
        const [actualAttempt] = await store.getAllAttempts();
        actualAttempt.playerId.should.be.eq(expectedAttempt.playerId);
        actualAttempt.value.should.be.eq(expectedAttempt.value);
        actualAttempt.time.format().should.be.eq(expectedAttempt.time.format());
    });

});