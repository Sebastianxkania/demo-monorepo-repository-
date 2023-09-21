// Dependencies
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
import React, { Component } from 'react';
import {withRouter} from './withRouter';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { compose } from 'redux'

// CSS
import m from './../CSS/master.module.css';
import login from './../CSS/login.module.css';
import su from './../CSS/sign_up.module.css';


// Backend
import * as backend  from "backend/firebase";

class SignUpPage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      username : '',
      email : '',
      firstName : '',
      lastName : '',
      password : '',

      passedUsername : false,
      passedEmail : false,

    }
    this.onInputchange = this.onInputchange.bind(this);
  }

  handleCreateAccount()  {
    backend.usernameExists(this.state.username.toLowerCase())
    .then(result => {
      // if Username is taken...
      if (result) { 
        this.setState({ passedUsername: false })
        alert("This username is not available.")
      } 
      // if Username is not taken...
      else {
        if (this.state.username == '') {
          this.setState({ passedUsername: false })
          alert('Please enter username.')
        }
        // Username has passed all checks
        else {
          this.setState({ passedUsername: true })
          this.handleAddingEmail().then((result) => {
            if (result == false) {
              return
            }
            else if (result == true) {
              this.handleAddingNameAndPassword().then((result) => {
                if (result == true) {
                  this.createAccount()

                }

              })
              
            }
          })
        }
      }
    }); 
  }

  async handleAddingEmail() {
    return backend.emailExists(this.state.email.toLowerCase())
    .then(result => {

      // if Username is taken...
      if (result) { 
        alert('This email is not available.')
        return false
      } 
      // if Username is not taken...
      else {
        if (this.state.email == '') {
          this.setState({ passedEmail: false })
          alert('Please enter your email.')
          return false
        }
        else {
          this.setState({ passedEmail: true })
          return true
        }
      }
    }); 
  }

  async handleAddingNameAndPassword() {
    if (this.state.firstName == '') {
      alert('Please enter your first name.')
      return false
    }
    else if (this.state.lastName == '') {
      alert('Please enter your last name.')
      return false
    } 
    else if (this.state.password == '') {
      alert('Please enter your password.')
      return false
    }
    else {
      return true
    }
  }

  async createAccount() {
    backend.handleSignUp(
        this.state.username.toLowerCase(), 
        this.state.email.toLowerCase(), 
        this.state.firstName, 
        this.state.lastName, 
        this.state.password
      )
      .then(userID => {
        if (userID != null) {
          const { cookies } = this.props;
          cookies.set("currentUserID", userID, { path: "/" }); // setting the cookie
          
          // Waits for firestore creation
          setTimeout(
            () => { this.props.navigate('/Pages/HomePage')},    
            1000
          )
        }
        else {
          return
        }
        

          
      })
    }
  
  



  goBack() {
    this.props.navigate('/')
  }


  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
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
          <div className={login.header_con} >
              <h1 className={login.header} >Sign up</h1>
          </div>
      
          <div className={su.input_con} >
              <input 
                  className={m.input01} 
                  type="text" 
                  name="username" 
                  placeholder="Username"
                  value={this.state.username}
                  onChange={this.onInputchange}
              />
              <input 
                  className={m.input01} 
                  type="text" 
                  name="email" 
                  placeholder="Email"
                  value={this.state.email}
                  onChange={this.onInputchange}
              />
              <input 
                  className={m.input01} 
                  type="text" 
                  name="firstName" 
                  placeholder="First name"
                  value={this.state.firstName}
                  onChange={this.onInputchange}
              />
              <input 
                  className={m.input01} 
                  type="text" 
                  name="lastName" 
                  placeholder="Last name"
                  value={this.state.lastName}
                  onChange={this.onInputchange}
              />
              <input 
                  className={m.input01} 
                  type="password" 
                  name="password" 
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.onInputchange}
              />

            </div>
       
  
          
          <div className={su.btn_con} >
              <button className={su.btn} onClick={() => {this.handleCreateAccount()}}>Sign up</button>
          </div>
        </div>
        
      </div>
    );
  }
}

export default compose(
  withRouter,
  withCookies, 
) (SignUpPage)
