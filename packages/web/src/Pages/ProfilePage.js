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
import Spinner from "./../Spinner";
// Backend
import * as backend  from "backend/firebase";
import * as PostController from "backend/PostController";
import { Modal, Button } from 'react-bootstrap-modal'



class ProfilePage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      currentUser : '',
      isLoading : true,
      postsAreLoading : true,
      popUpIsOpen : false
    }


  }

  componentDidMount() {
    this.load()
  }

  getCurrentUserID = () => {
    const { cookies } = this.props;
    return cookies.get("currentUserID")
  };


  load = () => {
    const { cookies } = this.props;
    //const currentUserID = cookies.get("currentUserID")
    const currentUserID = cookies.get("currentUserID")

    this.setState({ isLoading: true})
    
    backend.getUserDetailsByID(currentUserID).then((user) => {
      this.setState({ isLoading: false})
      this.setState({ currentUser: user})
    })

    PostController.pc.getAllUserPostsByUserID(currentUserID).then(posts => {
      this.setState({ currentUsersPosts : posts })
      this.setState({ postsAreLoading : false })
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
          <Link to={'/Pages/ProfilePage'} className={m.link01} ><>{this.state.currentUser.username}</></Link>
          <Link to={'/Pages/LoginPage'} className={m.link01} onClick={() => {this.signOutBtnEvent()}} ><>Sign out</></Link>
        </div>
      </nav>
    )
  }

  togglePopup = () => {
    this.setState({ popUpIsOpen : true })
  };

  closePopup = () => {
    this.setState({ popUpIsOpen : true })
  };

  maybeRenderPostImage = (url) => {
    if (url == null ) {
        return
    }
    else {
        return (
          <div className={post.post_image_con} >
            <img className={post.post_image}
              src={url}
            />
          </div>

        )
    }
  } 

  isPostWithImage = (url) => {
    if (url == null ) {
      return "0px"
    }
    else 
    {
      return "570px"
    }

  } 

  handleCommentBtn = (currentPostData) => {
    const { cookies } = this.props;
    cookies.set("postDetails", currentPostData, { path: "/" }); // setting the cookie
    cookies.set("backPage", '/Pages/ProfilePage', { path: "/" }); // setting the cookie

    this.props.navigate('/Pages/CommentsPage')

  }
  getAllUsersPosts() {
    const noPosts = this.state.currentUsersPosts.length
    var posts = [];


    

    for(let i = 0; i < noPosts; i++){   
      const postData = this.state.currentUsersPosts
      const marginTopSize = this.isPostWithImage(postData[i].postImageUrl)

      posts.push(
        <div key = {i}>
          <div className={post.post_main_con } >
            <section className={post.post_profile_image_con} >
              <img className={post.post_profile_image}
                src={postData[i].postUserProfileImageURL}
                alt="Profile image"
              />
              <div className={post.post_username} >{postData[i].postUsername}</div>
            </section>
            <div className={post.post_description_con } >
              <div className={post.post_description} >{postData[i].postDescription}</div>
            </div>
   
            { this.maybeRenderPostImage(postData[i].postImageUrl) }

            
            
            <div className={post.bottom_con } 
              style={{marginTop: marginTopSize}}
            >
            

            <button className={post.comment_btn } onClick={() => {this.handleCommentBtn(postData[i])}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fcomment.png?alt=media&token=d976d00d-4aab-4ab4-9518-9ef1624ba857" /></button>
            <button className={post.comment_btn02 } onClick={() => {this.handleCommentBtn(postData[i])}} >View all comments</button>
            </div>
          </div>
  
      </div>
      )
    }

    return (
      <div>{posts}</div>
  
    )
  }



  goEditProfile = () => {
    this.props.navigate('/Pages/EditProfilePage')
  }

  render() {
      if (this.state.isLoading == true || this.state.postsAreLoading == true) {
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
          <div className={profile.exit_btn_con }>
            <button className={profile.edit_btn } onClick={() => {this.goEditProfile()}} >Edit profile</button>
          </div>
          <div className={profile.top_con } >
            <h1 className={profile.header} >{this.state.currentUser.username}</h1>
            <section className={profile.profile_image_con} >
            <img className={profile.profile_img}
              src={this.state.currentUser.profileImageURL}
              alt="Profile image"
              />
            </section>
          </div>
          
          <div className={profile.top_con } >
            <div className={profile.name01} >{this.state.currentUser.firstName}</div>
            <div className={profile.lastName01} >{this.state.currentUser.lastName}</div>
          </div>

          <div className={profile.top_con } >
            <div className={profile.bio01} >{this.state.currentUser.bio}</div>
          </div>

          <div className={profile.seperator01 } >
          </div>

          <div className={profile.post_text_con } >
            <div className={profile.post_text} >Posts</div>
          </div>
          
          { this.getAllUsersPosts() }




          

        </div>
        
      )
    }
}

export default compose(
  withRouter,
  withCookies, 
) (ProfilePage)