let elasticsearch = require('elasticsearch');

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';

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
        return this.client.indices.exists({ index: 'attempt' });
    }

    async prepare() {
        if (!(await this.isIndexPrepared())) {
            return this.client.indices.create({ index: 'attempt' , body: {
                "mappings": {
                    "attempt": {
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
        throw new Error('not implemented');
    }

    async getAllAttempts() {
        return [];
    }

    async remove() {
        if (await this.isIndexPrepared()) {
            return this.client.indices.delete({index: 'attempt'});
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
        const expectedAttempt = { playerId:1, value:10, time:moment() };
        await store.logAttempt(expectedAttempt);
        const [actualAttempt] = await store.getAllAttempts();
        actualAttempt.should.be.like(expectedAttempt);
    });

});