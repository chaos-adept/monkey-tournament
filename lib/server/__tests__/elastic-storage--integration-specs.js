import {ElasticStorage} from '../game/elastic-storage'

let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));
import moment from 'moment';

describe('elastic daily stores', () => {
    let store;
    const location = { lat: 10.1, lon:9.5 };

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
        const expectedAttempt = { playerId:'p1', value:10, time:moment(), location, clan:'deadbabyes' };
        await store.incPlayer(expectedAttempt);
        await store.flush();
        const [actualAttempt] = await store.getAllAttempts();
        actualAttempt.playerId.should.be.eq(expectedAttempt.playerId);
        actualAttempt.value.should.be.eq(expectedAttempt.value);
        actualAttempt.location.should.be.like(expectedAttempt.location);
        actualAttempt.clan.should.be.like(expectedAttempt.clan);
        actualAttempt.time.format().should.be.eq(expectedAttempt.time.format());
    });

    it("should get all day attempt", async () => {
        const wrongAttemptYesterday = { playerId:'p1', value:1, time:moment().subtract(2, 'd'), location };
        const wrongAttemptEndOfDay = { playerId:'p1', value:1, time:moment().endOf('day').add(1, 's'), location };
        const expectedAttempt = { playerId:'p2', value:10, time:moment(), location };
        await store.incPlayer(wrongAttemptYesterday);
        await store.incPlayer(wrongAttemptEndOfDay);
        await store.incPlayer(expectedAttempt);
        await store.flush();

        const attempts = await store.getAttemptsByDates({
            fromDate: moment().startOf('day'), toDate: moment().endOf('day')});

        attempts.length.should.be.eq(1);
        attempts[0].playerId.should.be.eq('p2');
    });

});