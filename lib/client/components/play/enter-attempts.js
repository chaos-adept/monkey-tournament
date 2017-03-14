import React from "react";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from 'material-ui/TextField';

const css = require('./play.scss');

export class EnterAttemptDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: +localStorage.lastAttempt || 1};
    }

    componentDidMount() {
        //this.props.onAccelSensorData({ data:'123' });
        window.addEventListener('devicemotion', this.onEventData.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener('devicemotion', this.onEventData.bind(this));
    }

    onEventData(event) {
        console.log(event);
        this.props.onAccelSensorData && this.props.onAccelSensorData({
            acceleration: event.acceleration,
            rotationRate: event.rotationRate
        });
    }

    onChangeValue = (e, value) => {
        localStorage.lastAttempt = value;
        this.setState({value});
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
                disabled={!this.state.value}
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
        </Dialog>
    }

}