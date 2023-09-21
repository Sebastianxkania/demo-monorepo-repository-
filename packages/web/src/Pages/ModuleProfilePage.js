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



class ModuleProfilePage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      currentUser : '',
      isLoading : true,
      postsAreLoading : true,
      popUpIsOpen : false,

      signedInUserIsLoading : true,
      signedInUser : null,

      followed : null,
      followedIsLoading : true,
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
    const profileID = cookies.get("profileID")
    const currentUserID = cookies.get("currentUserID")

    this.setState({ isLoading: true})
    this.setState({ signedInUserIsLoading: true})

    this.loadFollowedState(currentUserID, profileID)

    backend.getUserDetailsByID(currentUserID).then((user) => {
      this.setState({ signedInUserIsLoading: false})
      this.setState({ signedInUser: user})
    })
    
    backend.getUserDetailsByID(profileID).then((user) => {
      this.setState({ isLoading: false})
      this.setState({ currentUser: user})
    })

    PostController.pc.getAllUserPostsByUserID(profileID).then(posts => {
      this.setState({ currentUsersPosts : posts })
      this.setState({ postsAreLoading : false })
    })


  }

  loadFollowedState = (followerID, followingID) => {  
    backend.followed(followerID, followingID).then((followed) => {
        
        if (followed == true ) {
            this.state.followed = true
        }
        else if (followed == false ) {
            this.state.followed = false
        }
        else {
            this.state.followed = null
        }
        this.setState({ followedIsLoading : false })
    })
  }

  followEvent = () => {  
    const { cookies } = this.props;
    const followerID = cookies.get("currentUserID")
    const followingID = cookies.get("profileID")


    backend.createFollowingAndFollowerDocument(followerID, followingID)
    this.setState({ followed: true })
  }

  getFollowButtonOrFollowing = () => {     
    if (this.state.followed == true) {
        return (
          <div className={profile.following_text} >Following</div>
        )
    }
    else if (this.state.followed == false ) {
        return (
          <button className={profile.follow_btn} onClick={() => {this.followEvent()}}>Follow</button>
        )

    }
    else if (this.state.followed == null ) {
        return
    }
}


  getNav() {
    return (
      <nav className={m.nav1} >
        <Link to={'/Pages/HomePage'} className={m.link01}>WeTogether</Link>
        <div className={m.nav1_right}>
          <Link to={'/Pages/HomePage'} className={m.link01}>Home</Link>
          <Link to={'/Pages/PostPage'} className={m.link01}>Post</Link>
          <Link to={'/Pages/ProfilePage'} className={m.link01} ><>{this.state.signedInUser.username}</></Link>
          <Link to={'/Pages/LoginPage'} className={m.link01}><>Sign out</></Link>
        </div>
      </nav>
    )
  }

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

  goBack() {
    this.props.navigate('/Pages/HomePage')
  }

  render() {
      if (this.state.isLoading == true || this.state.postsAreLoading == true || this.state.signedInUserIsLoading == true || this.state.followedIsLoading == true) {
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
            <button className={profile.exit_btn } onClick={() => {this.goBack()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fclose02.png?alt=media&token=c116e644-ecbc-4367-9de9-7c9fffa2e210" /></button>
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
            <div className={profile.follow_btn_con}>
              { this.getFollowButtonOrFollowing() }
            </div>
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
) (ModuleProfilePage)