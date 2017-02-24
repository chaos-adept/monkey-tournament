import {ElasticStorage} from '../game/elastic-storage'

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';


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
        await store.incPlayer(expectedAttempt);
        await store.flush();
        const [actualAttempt] = await store.getAllAttempts();
        actualAttempt.playerId.should.be.eq(expectedAttempt.playerId);
        actualAttempt.value.should.be.eq(expectedAttempt.value);
        actualAttempt.time.format().should.be.eq(expectedAttempt.time.format());
    });

});