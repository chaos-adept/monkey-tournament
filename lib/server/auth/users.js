

export const VK_PROVIDER_KEY = 'vk';

var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);
var client = redis.createClient({detect_buffers: true, db:1});

const getUserId = (provider, id) => `${provider}-${id}`;

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
        case VK_PROVIDER_KEY:
            const user = await findUserByIdOrNull({id:userId});
            return user || await createVKUser({id:userId, profile});
        default:
            throw new Error(`unknown provider`);
    }

    throw new Error(`not implemented`);
};