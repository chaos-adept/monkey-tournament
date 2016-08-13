import {getOrCreateUser, VK_PROVIDER_KEY, LOCAL_PROVIDER_KEY} from '../auth/users';
let should = require('chai').should();
let expect = require('chai').expect;
let chai = require('chai');
chai.use(require('chai-fuzzy'));
chai.use(require('chai-datetime'));

const vkProfile = {
    id: 123,
    username: 'jon_inside',
    displayName: 'Jon Smith',
    name: {familyName: 'Smith', givenName: 'Jon'},
    gender: 'male',
    profileUrl: 'http://vk.com/jon_inside',
    photos: [{
        value: 'https://pp.vk.me/c631929/v631929789/1ac11/D3txrV54vGA.jpg',
        type: 'photo'
    }],
    provider: 'vkontakte',
    _raw: '{"response":[{"id":123,"first_name":"Денис","last_name":"Рыкованов","sex":2,"screen_name":"chaos_inside","photo":"https:\\/\\/pp.vk.me\\/c631929\\/v631929789\\/1ac11\\/D3txrV54vGA.jpg"}]}',
    _json: {
        id: 123,
        first_name: 'Jon',
        last_name: 'Smith',
        sex: 2,
        screen_name: 'jon_inside',
        photo: 'https://pp.vk.me/c631929/v631929789/1ac11/D3txrV54vGA.jpg'
    }
};

describe('users', () => {
    it('should get local user', async () => {
        const user = await getOrCreateUser({provider:LOCAL_PROVIDER_KEY, id:'jack', profile:{}});
        expect(user.id, JSON.stringify(user)).to.be.ok;
    });
    it('should get vk user', async() => {
        const user = await getOrCreateUser({provider:VK_PROVIDER_KEY, id:'id2', profile:{}});
        user.should.be.ok;
    });
});