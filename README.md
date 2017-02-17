Monkey bar tournament
=========================
Game for making multiplayer game based
on distributed exercise with horizontal bar. it is also known as `Monkey Bar`.

the proposal of this game make exercise more funny,
and skills grow faster, as well for connect multiple random people.

# R1 Game
----------------
* provide social authorization
* collect attempt by a period of the time, winner based on self entered attempts

# How To Start Server

## Pre-Condition
Redis
1. installed nodejs [https://nodejs.org/en/]
1. install Redis [https://redis.io/topics/quickstart] (windows - [https://github.com/ServiceStack/redis-windows/tree/master/downloads])
1. redis should work on 127.0.0.1:6379 (values by default)
VK Authorization
1. set `host` and `port` as env variables for authorization callback urls
1. VK monkeybar app has following
1. 1. http://`localhost`:`3000`/auth/vkontakte/callback
1. 1. http://`localhost`:`80`/auth/vkontakte/callback
1. 1. http://`127.0.0.1`:`3000`/auth/vkontakte/callback

# Regular
1. `npm run build`
1. `npm run server:start`


# Debug (works with webpack hmr)
1. `npm run server:start:debug`

# Unit Tests
1. `npm run server:test:watch` - server side
1. `npm run client:test:single-run` - client side

# Integration Tests (redis is required)
1. `npm run server:test:integration`

