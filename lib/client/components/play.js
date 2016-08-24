import React from 'react';
import io from 'socket.io-client';
import request from 'superagent';
import _ from 'lodash';
import Promise from 'promise';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';

let playerTurnHash = 0;
let socket = io('', {'transports': ['websocket']});
class PlayerIcon extends React.Component {
    render() {
        return <span>
                {this.props.player && this.props.player.photos.map(photo => <img className="img-circle"
                                                            src={photo.value}/>)}</span>;

    }
}

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

            socket.on('connect', function () {
                console.log('connected');
                updateStatus('connected');
            });
            socket.on('reconnected', function () {
                console.log('reconnected');
                updateStatus('reconnected');
            });
            socket.on('event', function (data) {
                console.log('event', data);
            });
            socket.on('error', function (data) {
                console.log('error', data);
                updateStatus('error');
            });
            socket.on('reconnect_error', function (data) {
                console.log('reconnect_error', data);
            });
            socket.on('disconnect', function () {
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
                this.setState({scores});
            };

            socket.on('welcome', onRegister);
            socket.on('scores', onScoresUpdate);
            socket.on('turn', onAttempt);


        })();
    }

    onAttempt() {
        var value = +this.state.value;
        this.setState({isSendingAttempt: true});
        socket.emit('turn', {value, turnHash: ++playerTurnHash});
    }

    render() {
        const player = this.state.player;
        const status = this.state.status;
        const auth = this.state.auth;
        const scores = this.state.scores;
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
                            <h4>Results
                                <small></small>
                            </h4>
                            <ul className="media-list">
                                {scores && scores.map(it => {
                                    return (
                                        <li className="media">
                                            <div className="media-left media-middle">
                                                <div className="media-object">
                                                    <PlayerIcon player={it.player} />
                                                </div>
                                            </div>
                                            <div className="media-body">
                                                <h4 className="media-heading">
                                                    head
                                                </h4>
                                                <div>
                                                    <select>
                                                        <option>day</option>
                                                        <option>week</option>
                                                        <option>absolute</option>
                                                    </select>
                                                </div>
                                                <div><div className="badge">absolute: {it.score}</div></div>
                                                <div><div className="badge">day: {it.score / 2}</div></div>
                                                <div><div className="badge">week: {it.score / 3}</div></div>

                                                <h5><span>{it.player.displayName} </span></h5>
                                            </div>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-xs-12 col-md-8">
                            <h4>Attempts
                                <small></small>
                            </h4>
                            <ul>
                                <li>Denis Rykovanov , geo , number </li>
                                <li>attempt2</li>
                                <li>attempt3</li>
                            </ul>
                        </div>

                    </div>
                </div>}

            </div>
        )
    }
}


