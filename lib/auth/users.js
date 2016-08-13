var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export const LOCAL_PROVIDER_KEY = 'local';
export const VK_PROVIDER_KEY = 'vk';

var client = redis.createClient({detect_buffers: true, db:1});

const getUserId = (provider, id) => `${provider}-${id}`;
const makeLocalProfile = (username, password) =>({
    id: 123,
    username,
    password,
    displayName: username.toUpperCase(),
    name: {familyName: 'Smith', givenName: 'Jon'},
    gender: 'male',
    profileUrl: 'http://vk.com/jon_inside',
    photos: [{
        value: 'https://pp.vk.me/c631929/v631929789/1ac11/D3txrV54vGA.jpg',
        type: 'photo'
    }],
    provider: 'local'
});
const records = [ makeLocalProfile('jack', 'secret'), makeLocalProfile('jill', 'birthday') ];
const initLocalStorage = Promise.all(records.map((item) => {
    const id = getUserId(LOCAL_PROVIDER_KEY, item.username);
    return client.setAsync(id, JSON.stringify({id, profile: item}));
}));


function UserNotFound(message) {
    this.name = 'MyError';
    this.message = message || 'User not found';
    this.stack = (new Error()).stack;
}
UserNotFound.prototype = Object.create(Error.prototype);
UserNotFound.prototype.constructor = UserNotFound;

export const findUserById = function (id, cb) {
    process.nextTick(async () => {
        const user = await client.getAsync(id);
        if (user) {
            cb(null, JSON.parse(user));
        } else {
            cb(new UserNotFound('User ' + JSON.stringify(id) + ' does not exist'));
        }
    });
};

export const findUserByIdPromise = Promise.promisify(findUserById);
export const findUserByIdsPromise = (ids) => Promise.all(ids.map((userId) => findUserByIdPromise(userId)));
export const findUserByIdOrNull = async ({id}) => {
    try {
        return await findUserByIdPromise(id);
    } catch (e) {
        if (e instanceof UserNotFound) {
            return null;
        } else {
            throw e;
        }
    }
};

const createVKUser = async ({id, profile}) => {
    const user = {id, profile};
    await client.setAsync(id, JSON.stringify(user));
    return user;
};

export const getOrCreateUser = async ({provider, id, profile}) => {
    const userId = getUserId(provider, id);
    switch (provider) {
        case LOCAL_PROVIDER_KEY:
            await initLocalStorage;
            return findUserByIdPromise(userId);
        case VK_PROVIDER_KEY:
            const user = await findUserByIdOrNull({id:userId});
            return user || await createVKUser({id:userId, profile});
        default:
            throw new Error(`unknown provider`);
    }

    throw new Error(`not implemented`);

    // return Promise.resolve().then(() => {
    //     for (var i = 0, len = records.length; i < len; i++) {
    //         var record = records[i];
    //         if (record.username === id) {
    //             return record;
    //         }
    //     }
    //     throw new Error(`user is not found by id ${id}`);
    // });
};