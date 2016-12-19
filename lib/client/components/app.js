import React from 'react';
import {Router, Route, IndexRoute, Link, IndexLink, browserHistory} from 'react-router';
const ACTIVE = {color: 'blue'};
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from './appbar/app-bar';

export class App extends React.Component {
    render() {
        return <MuiThemeProvider>
            <div>
                <AppBar/>
                <div>
                    {this.props.children}
                </div>
            </div>
        </MuiThemeProvider>
    }

}