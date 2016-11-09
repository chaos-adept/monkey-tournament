import {getOrCreateUser, VK_PROVIDER_KEY, LOCAL_PROVIDER_KEY} from '../auth/users';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

describe('users', () => {
    it('should get vk user', async() => {
        const user = await getOrCreateUser({provider:VK_PROVIDER_KEY, id:'id2', profile:{}});
        user.should.be.ok;
    });
});