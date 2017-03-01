import React from "react";
import io from "socket.io-client";
import request from "superagent";
import {getPlayerPhoto} from "./utils";
import {Link} from "react-router";
import Avatar from "material-ui/Avatar";
import {List, ListItem} from "material-ui/List";
import Subheader from "material-ui/Subheader";
import FloatingActionButton from "material-ui/FloatingActionButton";
import ContentAdd from "material-ui/svg-icons/content/add";
import {calcPlayerScoreDiff} from "./score-diff-utils";
import {EnterAttemptDialog} from "./enter-attempts";
import {getCurrentPosition} from "./geo-utils";

const css = require('./play.scss');

let playerTurnHash = 0;


export class Play extends React.Component {

    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleOpen = () => {
        console.log("handle open");
        this.setState({open: true});
    };

    handleClose = () => {
        this.setState({open: false});
    };

    componentDidMount() {

        const updateStatus = (statusText) => {
            this.setState({status: statusText});
        };

        (async() => {
            const authResult = await request('GET', '/auth');
            this.setState({auth: authResult.body.user});

            try {
                const geoPosition = await getCurrentPosition();
                this.setState({ geoPosition });
            } catch (err) {
                console.error({ geoError: err });
            }

            this.socket = io();
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

    onAttempt(value) {
        const location = this.getDetectedLocation();
        this.setState({isSendingAttempt: true});
        this.socket.emit('turn', {value, turnHash: ++playerTurnHash, location});
        this.handleClose();
    }

    getDetectedLocation() {
        if (this.state.geoPosition) {
            return {
                lat: this.state.geoPosition.coords.latitude,
                lon: this.state.geoPosition.coords.longitude
            }
        } else {
            return undefined;
        }
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
        const geoPos = this.state.geoPosition;


        const renderDayScores = (currScores, prevScores) => {
            return currScores && currScores.map(it => {
                    return (
                        <ListItem key={it.player.id}
                                  primaryText={it.player.displayName}
                                  leftAvatar={<Avatar src={getPlayerPhoto(it.player)}/>}
                                  data-sid="score-list-item"
                                  rightAvatar={
                                      <Avatar><span data-sid="score-value">{`${calcPlayerScoreDiff(it.player.id, null, currScores).score}`}</span></Avatar>
                                  }
                        />
                    );
                });
        };

        return (
            <div>
                <div>
                    {!auth && (<div className="alert alert-danger" role="alert"> user is not auth
                        <div>
                            <Link to="/login">
                                <button className="btn btn-default" data-sid="auth-failed-login-btn">login</button>
                            </Link>
                        </div>
                    </div>)}
                </div>

                {auth && <div>
                    <div>
                        <div className="col-xs-12 col-md-8">
                            {disconnected && (<div className="alert alert-danger" role="alert"> connection lost </div>)}
                        </div>
                    </div>

                    {!geoPos && <div>
                        <h3>you should allow your geo position to play.</h3>
                    </div>}


                    <div data-sid="game-result-list">
                        <List>
                            {renderDayScores(todayScores, yesterdayScores)}
                            <Subheader>Yesterday</Subheader>
                            {renderDayScores(yesterdayScores, twoDaysAgoScores)}
                            <Subheader>2-days ago</Subheader>
                            {renderDayScores(twoDaysAgoScores, undefined)}
                        </List>
                    </div>
                    <FloatingActionButton
                        data-sid="add-attempt-btn"
                        onTouchTap={() => this.handleOpen()}
                        style={
                            {
                                margin: 0,
                                top: 'auto',
                                right: 20,
                                bottom: 60,
                                left: 'auto',
                                position: 'fixed'
                            }
                        }>
                        <ContentAdd  />
                    </FloatingActionButton>


                    {
                        this.state.open &&
                        <span data-sid="enter-attempt-dlg">
                            <EnterAttemptDialog open={this.state.open} handleClose={() => this.handleClose()}
                                            onAttempt={(value) => this.onAttempt(value)}/>
                        </span>
                    }


                </div>}

            </div>
        )

    }
}


