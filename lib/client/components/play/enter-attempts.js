import React from "react";
import {List, ListItem} from "material-ui/List";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import Slider from "material-ui/Slider";

const css = require('./play.scss');

export class EnterAttemptDialog extends React.Component {

    constructor(props) {
        super(props);
        this.state = {value: +localStorage.lastAttempt || 1};
    }

    componentDidMount() {

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
            />,
        ];

        return <Dialog
            title={`Enter Attempts (${this.state.value})`}
            actions={dlgActions}
            modal={false}
            open={this.props.open}
            onRequestClose={() => this.props.handleClose()}
        >
            <Slider
                min={0}
                max={30}
                step={1}
                defaultValue={15}
                value={this.state.value}
                onChange={this.onChangeValue}
            />
        </Dialog>
    }

}