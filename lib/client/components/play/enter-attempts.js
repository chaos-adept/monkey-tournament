import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from 'material-ui/TextField';

const css = require('./play.scss');

export class EnterAttemptDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: +localStorage.lastAttempt || 1, clan: localStorage.lastClanName};
    }

    componentDidMount() {

    }

    onChangeValue = (e, value) => {
        localStorage.lastAttempt = value;
        this.setState({value});
    };

    onChangeClan = (e, clanName) => {
        localStorage.lastClanName = name;
        this.setState({clan: clanName});
    };

    onAttempt() {
        let value = +this.state.value;
        console.log('on attempt');
        this.props.onAttempt(value);
    }

    render() {
        const dlgActions = [
            <FlatButton
                label="Ok"
                primary={true}
                keyboardFocused={true}
                onTouchTap={() => this.onAttempt()}
                data-sid="confirm-attempt-btn"
                disabled={!(this.state.value && this.state.clan)}
            >
            </FlatButton>,
        ];

        return <Dialog
            title={`Enter Attempts (${this.state.value})`}
            actions={dlgActions}
            modal={false}
            open={this.props.open}
            onRequestClose={() => this.props.handleClose()}
        >
            <TextField name="attempt-amount-input" onChange={this.onChangeValue} type="number" value={this.state.value}/>
            <TextField name="attempt-clan-input" onChange={this.onChangeClan} type="text" value={this.state.clan}/>
        </Dialog>
    }

}