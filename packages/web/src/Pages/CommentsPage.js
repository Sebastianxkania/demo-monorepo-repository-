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



class CommentsPage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      currentUser : '',
      isLoading : true,

      allPostComments : null,
      commentsAreLoading : true,
      commentText : '',
    }
    this.onInputchange = this.onInputchange.bind(this);


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
    const postDetails = cookies.get("postDetails")
    const currentUserID = cookies.get("currentUserID")

    this.setState({ isLoading: true})
    
    backend.getUserDetailsByID(currentUserID).then((user) => {
      this.setState({ isLoading: false})
      this.setState({ currentUser: user})
    })

    PostController.pc.getAllCommentsByPostUserIDAndPostId(postDetails.userID, postDetails.id).then((comments) => {
      this.setState({ allPostComments : comments })
      this.setState({ commentsAreLoading : false })
  })

  }

  createCommentEvent = () => {
    const { cookies } = this.props;
    const postDetails = cookies.get("postDetails")

    const commenterUserID = cookies.get("currentUserID")
    const postUserID = postDetails.userID
    const postID = postDetails.id
    const commentText = this.state.commentText

    
    if (commentText == "") {
        alert("Please enter comment")
    } 
    else {
        PostController.pc.createCommentDocument(commenterUserID, postUserID, postID, commentText)
        setTimeout(
          () => { this.load()},    
          200
        )
        this.setState({ commentText : "" })
    }
  }


  getNav() {
    return (
      <nav className={m.nav1} >
        <Link to={'/Pages/HomePage'} className={m.link01}>WeTogether</Link>
        <div className={m.nav1_right}>
          <Link to={'/Pages/HomePage'} className={m.link01}>Home</Link>
          <Link to={'/Pages/PostPage'} className={m.link01}>Post</Link>
          <Link to={'/Pages/ProfilePage'} className={m.link01}><>{this.state.currentUser.username}</></Link>
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

  renderComments = (commentsData) => {
    const Bold = ({ children }) => <div style={{ fontWeight: 'bold' }}>{children}</div>
    

    const noComments = commentsData.length
    var comments = []

    for(let i = 0; i < noComments; i++){   
      
      comments.push(
        <div className={post.comment_con} key = {i}>
          <div className={post.comment_caption}  ><Bold>{commentsData[i].commenterUsername}</Bold>{commentsData[i].commentText}</div>
        </div>
      )
  }
    return (
      <div>{comments}</div>
    )
  }

  goBack() {
    const { cookies } = this.props;
    const backPage = cookies.get("backPage")
    this.props.navigate(backPage)
  }
  
  getPost() {
    const { cookies } = this.props;
    const postDetails = cookies.get("postDetails")

    const commentsData = this.state.allPostComments

    return (
      <div >
        
        <div className={post.post_main_con } >
          <button className={post.exit_comments_btn } onClick={() => {this.goBack()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fclose.png?alt=media&token=0c1ed8e5-ff84-44c9-8255-ba4cc4ddb9c1" /></button>
          <section className={post.post_profile_image_con} >
            <img className={post.post_profile_image}
              src={postDetails.postUserProfileImageURL}
              alt="Profile image"
            />
            <div className={post.post_username} >{postDetails.postUsername}</div>
          </section>
          <div className={post.post_description_con } >
            <div className={post.post_description} >{postDetails.postDescription}</div>
          </div>
                    
          <div className={post.bottom_con } 
            style={{marginTop: '0px'}}
          >
          
          <div style={{ overflowY: 'scroll', }} className={post.main_comments_con}>
            { this.renderComments(commentsData) }
          </div>
          

          <button className={post.comment_btn } onClick={() => {this.createCommentEvent()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fcomment.png?alt=media&token=d976d00d-4aab-4ab4-9518-9ef1624ba857" /></button>
            <input 
              className={post.comment_input} 
              type="text" 
              name="commentText" 
              placeholder="Comment" 
              value={this.state.commentText}
              onChange={this.onInputchange}
            />
          </div>
        </div>

      </div>
  
    )
  }

  render() {
      if ( this.state.isLoading == true || this.state.commentsAreLoading == true) {
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

          { this.getPost() }

        </div>
        
      )
    }
}

export default compose(
  withRouter,
  withCookies, 
) (CommentsPage)