import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Routes,} from "react-router-dom";
import m from './../CSS/master.module.css';
import {withRouter} from './withRouter';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { compose } from 'redux'
import profile from './../CSS/profile.module.css';

import spinner from './../CSS/spinner.module.css';
import post from './../CSS/post.module.css';
import cp from './../CSS/createPost.module.css';
import ep from './../CSS/EditProfile.module.css';
import Spinner from "./../Spinner";
import * as PostController from "backend/PostController";

// Backend
import * as backend  from "backend/firebase";

class EditProfilePage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      currentUser : '',
      isLoading : true,

      profileImage : '',
      newBio : '',
      newFirstName : '',
      newLastName : '',

      
    }
    this.onInputchange = this.onInputchange.bind(this);
    this.handleAddImage = this.handleAddImage.bind(this);


  }

  componentDidMount() {
    this.load()
  }

  onInputchange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }



  load = () => {
    const { cookies } = this.props;
    const currentUserID = cookies.get("currentUserID")

    this.setState({ isLoading: true})
    
    backend.getUserDetailsByID(currentUserID).then((user) => {
      this.setState({ isLoading: false})
      this.setState({ currentUser: user})
      this.setState({ profileImage: user.profileImageURL})
    })


    

  }

  signOutBtnEvent = async () => {

    backend.handleSignOut()
    .then(result => {
        // User signs out
        if (result) {
            const { cookies } = this.props;
            cookies.set("currentUserID", '', { path: "/" }); // setting the cookie
            cookies.set("profileID", '', { path: "/" });
        }
        else {
            console.log("not logged in!!")
        }

    }); 
  } 


  getNav() {
    return (
      <nav className={m.nav1} >
        <Link to={'/Pages/HomePage'} className={m.link01}>WeTogether</Link>
        <div className={m.nav1_right}>
          <Link to={'/Pages/HomePage'} className={m.link01}>Home</Link>
          <Link to={'/Pages/PostPage'} className={m.link01}>Post</Link>
          <Link to={'/Pages/ProfilePage'} className={m.link01}><>{this.state.currentUser.username}</></Link>
          <Link to={'/Pages/LoginPage'} className={m.link01} onClick={() => {this.signOutBtnEvent()}} ><>Sign out</></Link>
        </div>
      </nav>
    )
  }

  handleAddImage(event) {
    const {target} = event;
    const {files} = target;

    if (files && files[0]) {
      var reader = new FileReader();
      
      reader.onloadstart = () => this.setState({loading: true});

      reader.onload = event => {
        this.setState({
          data: event.target.result,
          loading: false
          
        });

        const image = event.target.result 

        this.setState({ profileImage: event.target.result });
      };
   
      reader.readAsDataURL(files[0]);


    }
  }

  updateBio = () => {
    const { cookies } = this.props;
    const currentUserID = cookies.get("currentUserID")

    if (this.state.newBio == '') {
      alert("Please enter new bio.")
    }
    else {
      backend.updateBio(currentUserID, this.state.newBio)
    }
  }

  updateFirstName = () => {
    const { cookies } = this.props;
    const currentUserID = cookies.get("currentUserID")

    backend.updateFirstName(currentUserID, this.state.newFirstName)
  }

  updateLastName = () => {
    const { cookies } = this.props;
    const currentUserID = cookies.get("currentUserID")

    backend.updateLastName(currentUserID, this.state.newLastName)
  }


 

  
  


  goBack() {
    this.props.navigate('/Pages/ProfilePage')
  }

  updateProfileImage = () => {
    const img = this.state.profileImage

    fetch(img)
    .then(response => response.blob())
    .then(blob => {
      const { cookies } = this.props;
      const currentUserID = cookies.get("currentUserID")

                  
      PostController.pc.handleProfileImageUpdate(currentUserID, blob, true)

    });

  }

  renderEditProfile() {
    const { cookies } = this.props;
    const postDetails = cookies.get("postDetails")

    return (
      <div >
        
        <div className={post.post_main_con } >
          <button className={post.exit_comments_btn } onClick={() => {this.goBack()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fclose.png?alt=media&token=0c1ed8e5-ff84-44c9-8255-ba4cc4ddb9c1" /></button>
          <section className={post.post_profile_image_con} >
            <div className={cp.post_username} >Edit profile</div>
          </section>

          <div className={post.post_description_con } >
          </div>

                    
          <div className={cp.bottom_con } >

            <section className={ep.profile_image_con} >
              <img className={ep.profile_img}
                src={this.state.profileImage}
                />
            </section>

            <input
              id="url"
              type="file"
              accept="image/*"
              capture="camera"
              onChange={this.handleAddImage}
              className={ep.add_image_btn}
            >
            
            </input>

            <button className={ep.btn02 } onClick={() => {this.updateProfileImage()}} >Update </button>

            <input 
              className={ep.input01} 
              type="text" 
              name="newBio" 
              placeholder="Enter bio" 
              value={this.state.newBio}
              onChange={this.onInputchange}
            />
            <button className={ep.btn01 } onClick={() => {this.updateBio()}} >Update </button>

            <input 
              className={ep.input01} 
              type="text" 
              name="newFirstName" 
              placeholder="Enter first name" 
              value={this.state.newFirstName}
              onChange={this.onInputchange}
            />
            <button className={ep.btn01 } onClick={() => {this.updateFirstName()}} >Update </button>

            <input 
              className={ep.input01} 
              type="text" 
              name="newLastName" 
              placeholder="Enter last name" 
              value={this.state.newLastName}
              onChange={this.onInputchange}
            />
            <button className={ep.btn01 } onClick={() => {this.updateLastName()}} >Update </button>



          </div>
        </div>

      </div>
  
    )
  }

  render() {
      if ( this.state.isLoading == true ) {
        return (
          <div>
            <section className={m.side_nav}>
            
            </section>
            <div className={spinner.pos_center}>
              <Spinner />
            </div>
        </div>
  
        )
      }


      return (  
        <div>
          { this.getNav() }

          { this.renderEditProfile() }

        </div>
        
      )
    }
}

export default compose(
  withRouter,
  withCookies, 
) (EditProfilePage)