var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

export const LOCAL_PROVIDER_KEY = 'local';
export const VK_PROVIDER_KEY = 'vk';

var client = redis.createClient({detect_buffers: true});

const getUserId = (provider, id) => `${provider}-${id}`;

const records = [
    {id: 1, displayName: 'jack@example.com', username: 'jack', password: 'secret', displayName: 'Jack', emails: [{value: 'jack@example.com'}]}
    , {id: 2, displayName: 'jack@example.com', username: 'jill', password: 'birthday', displayName: 'Jill', emails: [{value: 'jill@example.com'}]}
];
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
        console.log(`try to find user by ${id}`);
        const user = await client.getAsync(id);
        console.log(user);
        if (user) {
            cb(null, JSON.parse(user));
        } else {
            cb(new UserNotFound('User ' + JSON.stringify(id) + ' does not exist'));
        }
    });
};

export const findUserByIdPromise = Promise.promisify(findUserById);
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
    console.log('get or create by id', userId);
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