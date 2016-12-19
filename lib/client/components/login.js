import React from 'react';

export class Login extends React.Component {
    render() {
        return (<div>
                <div>
                    <div>
                        <div className="col-md-12 col-xs-12  col-lg-12 col-xs-11">
                            <form  className="text-center" action="/auth/vkontakte" method="get">
                                <input className="btn-primary btn-lg" data-sid="login-vk-submit" type="submit" value="Login by VK"/>
                            </form>
                        </div>
                    </div>
                </div>
            </div>);
    }

}
