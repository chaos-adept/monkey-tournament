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
        const location = { lat: 10.1, lon:9.5 };
        const expectedAttempt = { playerId:'p1', value:10, time:moment(), location };
        await store.incPlayer(expectedAttempt);
        await store.flush();
        const [actualAttempt] = await store.getAllAttempts();
        actualAttempt.playerId.should.be.eq(expectedAttempt.playerId);
        actualAttempt.value.should.be.eq(expectedAttempt.value);
        actualAttempt.location.should.be.like(expectedAttempt.location);
        actualAttempt.time.format().should.be.eq(expectedAttempt.time.format());
    });

    it("should store sensor data", async () => {
        const sessionId = 'sessionId';
        const expectedSensorData = { playerId:'p1', sessionId: sessionId, time:moment(), acceleration: { x:1.21, y:2.22, z:3.31 }, rotationRate: { alpha:5.1, beta:5.2, gamma:5.3  } };
        const otherSensorData = { playerId:'p2', sessionId:'other session id1', time:moment() };
        await store.incAcceleration(otherSensorData);
        await store.incAcceleration(expectedSensorData);
        await store.flush();
        const [actualSensorData] = await store.getAcclerations(sessionId);
        actualSensorData.time.format().should.be.eq(expectedSensorData.time.format());
        //fixme workaround for like match
        actualSensorData.time = null;
        expectedSensorData.time = null;
        actualSensorData.should.be.like(expectedSensorData);
    });

});