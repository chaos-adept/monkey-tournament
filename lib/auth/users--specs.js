import {getOrCreateUser} from './users';

describe('users', () => {
    it('should get local user', () => {
        return getOrCreateUser({provider:'local', id:'jack', profile:{}});
    });
    it('should get vk user', () => {
         //getOrCreateUser()
    });
});