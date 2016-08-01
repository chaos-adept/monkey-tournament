var redis = require('redis');
var Promise = require('bluebird');
Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

var client = redis.createClient({detect_buffers: true});


const records = [
    {id: 1, username: 'jack', password: 'secret', displayName: 'Jack', emails: [{value: 'jack@example.com'}]}
    , {id: 2, username: 'jill', password: 'birthday', displayName: 'Jill', emails: [{value: 'jill@example.com'}]}
];


export const findUserById = function (id, cb) {
    process.nextTick(function() {
        var idx = id - 1;
        if (records[idx]) {
            cb(null, records[idx]);
        } else {
            cb(new Error('User ' + JSON.stringify(id) + ' does not exist'));
        }
    });
};

export const getOrCreateUser = ({provider, id, profile}) => {
    return Promise.resolve().then(() => {
        for (var i = 0, len = records.length; i < len; i++) {
            var record = records[i];
            if (record.username === id) {
                return record;
            }
        }

        throw new Error(`user is not found by id ${id}`);
    });
};
