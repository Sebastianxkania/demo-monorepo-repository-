import './App.css';
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";

import HomePage from "./Pages/HomePage";
import ProfilePage from "./Pages/ProfilePage";
import ModuleProfilePage from "./Pages/ModuleProfilePage";
import PostPage from "./Pages/PostPage";

import SignUpPage from "./Pages/SignUpPage";


import ForgotPasswordPage from "./Pages/ForgotPasswordPage";
import CommentsPage from "./Pages/CommentsPage";
import EditProfilePage from "./Pages/EditProfilePage";



import m from './CSS/master.module.css';

import * as backend  from "backend/firebase";


class App extends Component {  


  render() {
    
    return (
      <Router>
      <div className={m.grid_parent}>
          <div className={m.grid_child_1}>
              <section className={m.side_nav}>
                 
              </section>

          </div>
          <div className={m.grid_child_2}>

              <div className={m.main_wrapper}  >
     
      
              <Routes>
                <Route path="/" element={<LoginPage/>} exact />
                <Route path="/Pages/LoginPage" element={<LoginPage/>} exact />
                <Route path="/Pages/ForgotPasswordPage" element={<ForgotPasswordPage/>} exact />
                <Route path="/Pages/HomePage" element={<HomePage/>} exact />
                <Route path="/Pages/PostPage" element={<PostPage/>} exact />
                <Route path="/Pages/ProfilePage" element={<ProfilePage/>} exact />

                <Route path="/Pages/SignUpPage" element={<SignUpPage/>} exact />
                <Route path="/Pages/CommentsPage" element={<CommentsPage/>} exact />
                <Route path="/Pages/ModuleProfilePage" element={<ModuleProfilePage/>} exact />
                <Route path="/Pages/EditProfilePage" element={<EditProfilePage/>} exact />
                
                
              </Routes>
            </div>
            
          </div>
          <div className={m.grid_child_3}>
              <section className={m.side_nav}>
                  
              </section>
          </div>  
      </div>
      

    </Router>


      

  
    )
  }
}


export default App;

