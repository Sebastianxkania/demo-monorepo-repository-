// Home.js
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
import React from 'react';
import login from './../CSS/login.module.css';
import {withRouter} from './withRouter';
import * as backend  from "backend/firebase";
import m from './../CSS/master.module.css';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { compose } from 'redux'

class LoginPage extends React.Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      password : '',
      email : '',
    }
    this.onInputchange = this.onInputchange.bind(this);

  }
  
  loginBtnEvent() {
    backend.handleLogin(this.state.email, this.state.password).then((userID) => {
        if (userID != null) {
            this.handleCookie(userID)
            this.props.navigate('/Pages/HomePage')

        }
    })
  }

  handleCookie = (userID) => {
    const { cookies } = this.props;
    cookies.set("currentUserID", userID, { path: "/" }); // setting the cookie
  };

  


  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  render() {
    return (  
      <div className={login.main_wrapper}>
        <nav className={m.nav1} >
          <Link to={'/Pages/LoginPage'} className={m.link01}>WeTogether</Link>
          <div className={m.nav1_right}>
            <Link to={'/Pages/LoginPage'} className={m.link01}>Login</Link>
            <Link to={'/Pages/SignUpPage'} className={m.link01}>Sign up</Link>
          </div>
        </nav>

          <div className={login.login_form } >
              <div className={login.header_con} >
                  <h1 className={login.header} >Hey,</h1>
                  <h1 className={login.header} >Welcome</h1>
                  <h1 className={login.header} >Back</h1>
              </div>
              
              <div className={login.input_con} >
                  <input 
                      className={login.input01} 
                      type="text" 
                      name="email" 
                      placeholder="Email"
                      value={this.state.email}
                      onChange={this.onInputchange}
                  />
                  <input 
                      className={login.input01} 
                      type="password" 
                      name="password" 
                      placeholder="Password" 
                      value={this.state.password}
                      onChange={this.onInputchange}
                  />
              </div>
              <div className={login.forgot_pass_btn_con} >
                  <Link className={login.forgot_pass_btn} to={'/Pages/ForgotPasswordPage'}>Forgot password</Link>
              </div>
              <div className={login.btn_con} >
                  <button className={login.btn} onClick={() => {this.loginBtnEvent()}}>Login</button>
            </div>
          </div>

      </div>
    );
  }
}

export default compose(
  withRouter,
  withCookies, 
) (LoginPage)
