// Dependencies
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
import React, { Component } from 'react';
import {withRouter} from './withRouter';
import { withCookies } from 'react-cookie';

// CSS
import m from './../CSS/master.module.css';
import login from './../CSS/login.module.css';
import su from './../CSS/sign_up.module.css';
import post from './../CSS/post.module.css';

// Backend
import * as backend  from "backend/firebase";

class ForgotPasswordPage extends Component {
  constructor() {
    super()
    this.state = {
      email : '',
    }
    this.onInputchange = this.onInputchange.bind(this);
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  handleResetPassword = () => {
      backend.passwordReset(this.state.email).then((result) => {
        if (result) {
            this.props.navigate('/Pages/LoginPage')
        }
    })
  }

  goBack = () => {
          this.props.navigate('/Pages/LoginPage')
  }


  render() {
    return (
      <div className={m.main_wrapper}>
        <nav className={m.nav1} >
          <Link to={'/Pages/LoginPage'} className={m.link01}>WeTogether</Link>
          <div className={m.nav1_right}>
            <Link to={'/Pages/LoginPage'} className={m.link01}>Login</Link>
            <Link to={'/Pages/SignUpPage'} className={m.link01}>Sign up</Link>
          </div>
        </nav>

        
        <div className={login.login_form } >
        <button className={login.exit_forgot_password_btn } onClick={() => {this.goBack()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fclose.png?alt=media&token=0c1ed8e5-ff84-44c9-8255-ba4cc4ddb9c1" /></button>
          <div className={login.header_con} >
              <h1 className={login.header} >Forgot password</h1>
              <div className={login.forgot_password_text}>
                  Enter your email address and we'll send you a link to get back into your account.
              </div>
          </div>
      
          <div className={su.input_con} >

              <input 
                  className={m.input01} 
                  type="text" 
                  name="email" 
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onInputchange}
              />
 

            </div>
       
  
          
          <div className={su.btn_con} >
              <button className={su.btn} onClick={() => {this.handleResetPassword()}}>Reset Password</button>
          </div>
        </div>
        
      </div>
    );
  }
}

export default withRouter(ForgotPasswordPage);