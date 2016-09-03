import React from 'react';
import io from 'socket.io-client';
import request from 'superagent';
import {Scores} from './scores';
import {PlayerIcon} from './player-icon';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';

const css = require('./play.scss');

let playerTurnHash = 0;


PlayerIcon.propTypes = {
    player: React.PropTypes.object.isRequired
};

export class Play extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: 1};
    }

    componentDidMount() {

        const updateStatus = (statusText) => {
            this.setState({status: statusText});
        };

        (async() => {
            const authResult = await request('GET', '/auth');

            this.setState({auth: authResult.body.user});

            this.socket = io('', {'transports': ['websocket']});
            this.socket.on('connect', function () {
                console.log('connected');
                updateStatus('connected');
            });
            this.socket.on('reconnected', function () {
                console.log('reconnected');
                updateStatus('reconnected');
            });
            this.socket.on('event', function (data) {
                console.log('event', data);
            });
            this.socket.on('error', function (data) {
                console.log('error', data);
                updateStatus('error');
            });
            this.socket.on('reconnect_error', function (data) {
                console.log('reconnect_error', data);
            });
            this.socket.on('disconnect', function () {
                console.log('disconnected');
                updateStatus('disconnected');
                //updateStatus('disconnected');
            });

            const onRegister = (player) => {
                this.setState({player});
            };

            const onAttempt = (event) => {
                // var value = +document.getElementById('attempt').value;
                // socket.emit('turn', {value: value, turnHash: ++playerTurnHash});
                this.setState({isSendingAttempt: false});
            };

            const onScoresUpdate = (scores) => {
                console.log("scores", scores);
                this.setState({scores});
            };

            this.socket.on('welcome', onRegister);
            this.socket.on('scores', onScoresUpdate);
            this.socket.on('turn', onAttempt);


        })();
    }

    onAttempt() {
        var value = +this.state.value;
        this.setState({isSendingAttempt: true});
        this.socket.emit('turn', {value, turnHash: ++playerTurnHash});
    }

    onChangeValue(e) {
        this.setState({value: e.target.value});
    }

    onChangeStatsTab(selectedTab) {
        this.setState({selectedTab});
    }

    render() {
        const player = this.state.player;
        const status = this.state.status;
        const auth = this.state.auth;
        const scores = this.state.scores;
        const todayScores = scores && scores.today;
        const yesterdayScores = scores && scores.yesterday;
        const twoDaysAgoScores = scores && scores.twoDaysAgo;
        const disconnected = status === 'disconnected';
        return (
            <div>
                <div>
                    {!auth && (<div className="alert alert-danger" role="alert"> user is not auth
                        <div>
                            <button className="btn btn-default"><Link to="/login">login</Link></button>
                        </div>
                    </div>)}
                </div>

                {auth && <div>
                    <div className="row">


                        <div className="col-xs-12 col-md-8">

                            {disconnected && (<div className="alert alert-danger" role="alert"> connection lost </div>)}

                            <div className="page-header">
                                <h1>monkey tournament game
                                    <small><span id="status"></span></small>
                                </h1>
                                <div className="col-xs-12 col-md-8" id="profile">
                                    {
                                        player &&
                                        (<span>
                                            <PlayerIcon player={player}/>
                                            <a href={player.profileUrl}> <span
                                                data-sid="player-name">{player.displayName}</span></a>
                                        (<a href="/logout">logout</a>)
                                    </span>)

                                    }
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="row">
                    </div>
                    <div className="row">
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <h3>enter the number of pull-ups
                                <small></small>
                            </h3>
                            <div id="turnsPanel">
                                <div className="input-group">

                                    <input id="attempt" onChange={(value) => this.onChangeValue(value)} type="number"
                                           value={this.state.value} className="form-control" placeholder="count"/>

                                    <span className="input-group-btn">

                                        <button disabled={this.state.isSendingAttempt || disconnected}
                                                className="btn btn-default"
                                                type="button" onClick={() => this.onAttempt()}>Go!</button>
                                    </span>
                                </div>
                            </div>
                            <br/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <div className="row">
                                <div className="col-xs-12 col-md-8">
                                    <h4>Today
                                        <small></small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                {(todayScores && <Scores data={todayScores}/>) || 'None'}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <div className="row">
                                <div className="col-xs-12 col-md-8">
                                    <h4>Yesterday
                                        <small></small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                {(yesterdayScores && <Scores data={yesterdayScores}/>) || 'None'}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <div className="row">
                                <div className="col-xs-12 col-md-8">
                                    <h4>2-Days Ago
                                        <small></small>
                                    </h4>
                                </div>
                            </div>
                            <div className="col-xs-12 col-md-8">
                                {(twoDaysAgoScores && <Scores data={twoDaysAgoScores}/>) || 'None'}
                            </div>
                        </div>
                    </div>
                </div>}

            </div>
        )

    }
}


