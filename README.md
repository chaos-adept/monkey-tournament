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
* persist all attempt in format ready for logstash 


# Future Game Flow
---------------

1. make exercise on a monkey bar
1. send statistics with following data
    * amount
    _(see more about calculation in sections below)_
    * tags
    _(each tag is represented as rdf resource)_
    * geo location
    * date
1. compare results(amount) base on criteria
    * tags
    * dates _(it should support, macros like yesterday, today, and etc)_
    * geo location

it should make possible to have different tournaments like following:

* compare results from yesterday and today, for an user, user should be identified by tag with email
    * set 1 - date: yesterday, tag: mailto:rykovanov@gmail.com
    * set 2 - date: today, tag: mailto:jwales@bomis.com

* compare results for different offices,
    * set 1 - date: today, tag: Korolev
    * set 2 - date: today, tag: Hoboken
    * set 3 - date: today, tag: Izchevsk

# Counter

in the first beta version of this game it is possible to just persist data without validation.
but when game play will be debugged then it is possible to implement following simplified counter.

1. install webcam in the front of a monkey bar
1. turn on streaming on the tournament server
1. tournament server will start session
1. the player makes exercise and server count attempts

## possible calculation algorithms

### face based

1. app detect face, and horizontal bar
1. it makes space with vertical (bar is a point on this axis) when player in the max bottom position
1. app makes samples with discrete intervals during limited time of position face in the vertical up to bar (the vertical axis is bar, or based on bar)
1. each attempt should produce monotone function , like sin
1. application makes re-scale axes to transform personal space to ideal space
1. app calculates differences with ideal sin function on fixed duration like 5 seconds
1. in case when error is less than min then attempt is accepted

## Possible Game Modes

model - `Player`

```
    id,
    Klan
```

### Global Dead Match
every body against every body, winner has most of frags(succeed attempts) for all times

model - `TopScores`
```
{
    top_scores: [{player, score}],
}
```

### Dally Dead Match

every body against every during a week, it work also  with `TopScores`


### Team Melee (Daily)
each klan against each klan

```
{
    scores: [team, score]
}
```

### Geolocation competition
geo-locations based on scale

```
{
    cores: [geoHash, score]
}
```