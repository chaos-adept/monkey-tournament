import React from 'react';

export class Login extends React.Component {
    render() {
        return (<div>
                <div className="row">
                    <div className="row">
                        <div className="col-md-12 col-xs-12  col-lg-12 col-xs-11">
                            <form  className="text-right" action="/auth/vkontakte" method="get">
                                <input className="btn-primary btn-lg" data-sid="login-vk-submit" type="submit" value="Login by VK"/>
                            </form>
                        </div>
                    </div>
                    <div className="row">

                        <div >
                            <hr/>
                            <h5>login for admins <b>please dont use it, login by social network</b></h5>
                            <form action="/login" method="post">
                                <div className="form-group">
                                    <label for="exampleInputEmail1">user name</label>
                                    <input data-sid="username" name="username" className="form-control" id="exampleInputEmail1" placeholder="user name"/>
                                </div>
                                <div className="form-group">
                                    <label for="exampleInputPassword1">Password</label>
                                    <input data-sid="password" name="password" type="password" className="form-control" id="exampleInputPassword1" placeholder="Password"/>
                                </div>
                                <button data-sid="submit" type="submit" className="btn btn-default">Enter</button>
                            </form>
                        </div>
                        <div className="col-xs-6 col-md-4"></div>
                    </div>
                </div>
            </div>);
    }

}
