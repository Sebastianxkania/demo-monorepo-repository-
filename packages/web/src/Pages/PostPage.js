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
import Spinner from "./../Spinner";
// Backend
import * as backend  from "backend/firebase";
import * as PostController from "backend/PostController";

import { base64StringToBlob } from 'blob-util';


class PostPage extends Component {
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
      captionText : '',
      data : null,
      imageBase64 : null,

      loading : false,
      selectedImage : null,
      
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

        this.setState({ imageBase64: event.target.result });
      };
   
      reader.readAsDataURL(files[0]);


    }


  }

  async handleCreatePost() {


    
    const img = this.state.imageBase64

    if (img != null) {
      fetch(img)
      .then(response => response.blob())
      .then(blob => {
        const { cookies } = this.props;
        const currentUserID = cookies.get("currentUserID")
  
  
        const postDetails = {
          currentUserID : currentUserID,
          postDescription : this.state.captionText,
          selectedImage : blob,
          isBlob : true,
        }
        
        
        if (this.state.captionText == '') {
          alert("Write a cpation...")
          return
        }
        else {
          
          PostController.pc.handlePostCreation(postDetails)
          this.props.navigate('/Pages/ProfilePage')
        }
      });
    }
    else {
      const { cookies } = this.props;
      const currentUserID = cookies.get("currentUserID")


      const postDetails = {
        currentUserID : currentUserID,
        postDescription : this.state.captionText,
        selectedImage : null,
        isBlob : true,
      }
      
      
      if (this.state.captionText == '') {
        alert("Write a cpation...")
        return
      }
      else {
        
        PostController.pc.handlePostCreation(postDetails)
        this.props.navigate('/Pages/ProfilePage')
      }
    }

    

    

    
  
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
      return "585px"
    }

  } 

  goBack() {
    this.props.navigate('/Pages/HomePage')
  }

  getPost() {
    const { cookies } = this.props;
    const postDetails = cookies.get("postDetails")

    const commentsData = this.state.allPostComments
    const marginTopSize = this.isPostWithImage(this.state.imageBase64)

    return (
      <div >
        
        <div className={post.post_main_con } >
          <button className={post.exit_comments_btn } onClick={() => {this.goBack()}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fclose.png?alt=media&token=0c1ed8e5-ff84-44c9-8255-ba4cc4ddb9c1" /></button>
          <section className={post.post_profile_image_con} >
            <div className={cp.post_username} >Create post</div>
          </section>
          <div className={post.post_description_con } >
          </div>

          { this.maybeRenderPostImage(this.state.imageBase64) }
                    
          <div className={cp.bottom_con } 
            style={{marginTop: marginTopSize}}
          >
          
 
          

            <input 
              className={cp.comment_input} 
              type="text" 
              name="captionText" 
              placeholder="Caption" 
              value={this.state.captionText}
              onChange={this.onInputchange}
            />

            <div>
            <button className={cp.post_btn } onClick={() => {this.handleCreatePost()}} >Post</button>

            <input
              id="url"
              type="file"
              accept="image/*"
              capture="camera"
              onChange={this.handleAddImage}
              className={cp.add_image_btn}
            >
            
            </input>


            </div>
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
) (PostPage)