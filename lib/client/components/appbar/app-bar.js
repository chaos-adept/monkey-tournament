import React, {Component} from "react";
import AppBar from "material-ui/AppBar";
import IconButton from "material-ui/IconButton";
import IconMenu from "material-ui/IconMenu";
import MenuItem from "material-ui/MenuItem";
import FlatButton from "material-ui/FlatButton";
import MoreVertIcon from "material-ui/svg-icons/navigation/more-vert";

class Login extends Component {
    static muiName = 'FlatButton';

    render() {
        return (
            <FlatButton {...this.props} label="Login" />
        );
    }
}


class AppBarComposition extends Component {
    render() {
        return (
            <div>
                <AppBar
                    title="Monkey Bar"
                    iconElementRight={<IconButton iconClassName="muidocs-icon-custom-github" />}
                />
            </div>
        );
    }
}

export default AppBarComposition;