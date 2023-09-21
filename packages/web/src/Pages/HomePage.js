
import * as backend  from "backend/firebase";
import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch, Link, Routes } from "react-router-dom";
import m from './../CSS/master.module.css';
import {withRouter} from './withRouter';
import { instanceOf } from "prop-types";
import { withCookies, Cookies } from "react-cookie";
import { compose } from 'redux'
import spinner from './../CSS/spinner.module.css';
import Spinner from "./../Spinner";
import home from './../CSS/home.module.css';
import post from './../CSS/post.module.css';
import * as PostController from "backend/PostController";

class HomePage extends Component {
  static propTypes = {
    cookies: instanceOf(Cookies).isRequired
  };

  constructor() {
    super()
    this.state = {
      currentUser : '',
      isLoading : true,

      searchText : '',

      homePosts : [],
      postLoaderArray : [],
      postsLoading : true,
      noFollowing : null,
      thereAreNoPosts : true,
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

  getCurrentUserID = () => {
    const { cookies } = this.props;
    return cookies.get("currentUserID")
  };


  load = () => {
    const { cookies } = this.props;
    const currentUserID = cookies.get("currentUserID")

    this.setState({ isLoading: true})
    
    backend.getUserDetailsByID(currentUserID).then((user) => {
      this.setState({ isLoading: false})
      this.setState({ currentUser: user})
    })

    this.loadPostData(currentUserID)
  }

  loadPostData = (currentUserID) => {
        
    PostController.pc.getAllFollowingIDs(currentUserID).then((followingIDs) => {
        
        if (followingIDs == null) {
            
            this.setState({ postsLoading : false })
            return
        }
        else {
            
            const noFollowingIDs = followingIDs.length
            
            for (let i = 0; i < noFollowingIDs; i++) { 
                this.state.postLoaderArray.push({loaded : false})
                
                PostController.pc.getAllUserPostsByUserID(followingIDs[i].id).then((post) => {
                    this.state.postLoaderArray[i].loaded = true
                    this.state.homePosts.push(post)
                    
                    this.setPostLoadingState()
                })
            }
        }


    })
  }

  allAreTrue = (arr) =>  {
    return arr.every(choice => choice.loaded)
  }

  setPostLoadingState = () => {
      

      if ( this.state.homePosts.length > 1 ) {
          if ( this.allAreTrue(this.state.postLoaderArray )) {
              this.setState({ postsLoading : false })
          }
          else {
              this.setState({ postsLoading : true })
          }
      }   
      else {
          if (this.state.homePosts[0].length == 0) {
              this.setState({ thereAreNoPosts : true })
              this.setState({ postsLoading : false })
          }
          else {
              this.setState({ thereAreNoPosts : false })
              this.setState({ postsLoading : false })
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
      return "570px"
    }

  } 

  handleCommentBtn = (currentPostData) => {
    const { cookies } = this.props;
    cookies.set("postDetails", currentPostData, { path: "/" }); // setting the cookie
    cookies.set("backPage", '/Pages/HomePage', { path: "/" }); // setting the cookie

    this.props.navigate('/Pages/CommentsPage')

  }

  maybeRenderPosts = () => {
    const postData = this.state.homePosts
    const noOfFollowing = this.state.homePosts.length
    var posts = []
    

    if (this.state.thereAreNoPosts == false) {
        for (let i = 0; i < noOfFollowing; i++) { 
            

            for (let j = 0; j < postData[i].length; j++) { 
                

              const marginTopSize = this.isPostWithImage(postData[i][j].postImageUrl)
                posts.push(
                    //<Text key = {postData[i][j].id} >{postData[i][j].id}</Text>
                    //key = {postData[i][j].id}
                    

                  <div key = {postData[i][j].id}>
                    <div className={post.post_main_con } >
                      <section className={post.post_profile_image_con} >
                        <img className={post.post_profile_image}
                          src={postData[i][j].postUserProfileImageURL}
                          alt="Profile image"
                        />
                        <div className={post.post_username} >{postData[i][j].postUsername}</div>
                      </section>
                      <div className={post.post_description_con } >
                        <div className={post.post_description} >{postData[i][j].postDescription}</div>
                      </div>
             
                      { this.maybeRenderPostImage(postData[i][j].postImageUrl) }
          
                      <div className={post.bottom_con } 
                        style={{marginTop: marginTopSize}}
                      >
                      
                      <button className={post.comment_btn } onClick={() => {this.handleCommentBtn(postData[i][j])}} ><img className={post.comment_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fcomment.png?alt=media&token=d976d00d-4aab-4ab4-9518-9ef1624ba857" /></button>
                      <button className={post.comment_btn02 } onClick={() => {this.handleCommentBtn(postData[i][j])}} >View all comments</button>
                      </div>
                    </div>
            
                  </div>
                )
            }
        }

        return posts
    }
    else {
        return (
            <div className={post.no_posts_available_con } >
                <div className={post.no_posts_available_text } >No posts available yet, </div>
                <div className={post.no_posts_available_text } >follow someone.</div>
            </div>
            
        )
    }
  }




  setProfileIDCookie = (userID) => {
    const { cookies } = this.props;
    //const currentUserID  = cookies.get("currentUserID")

    cookies.set("profileID", userID, { path: "/" }); // setting the cookie
  }

  handleSearch = (username) => {
    if (this.state.searchText != '') {
      backend.getUserByUsername(username).then((user) => {
        // user.id - gives id 
        // user.data() = gives user data 
        if (user != null ) {
          this.setProfileIDCookie(user.id)
          this.props.navigate('/Pages/ModuleProfilePage')
        }
        else {
          return
        }
        
    })



    }
    else {
      alert("Please enter a username you would like to search.")
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

  render() {
    if (this.state.isLoading == true || this.state.postsLoading) {
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
        <div className={home.main_con }>

          <button className={home.search_btn } onClick={() => {this.handleSearch(this.state.searchText)}} ><img className={home.search_btn_image } src="https://firebasestorage.googleapis.com/v0/b/wetogether-baf67.appspot.com/o/other%2Fsearch.png?alt=media&token=5bdaf57a-4e65-4f73-b08c-edad97a6e72f" /></button>
          <input 
            className={home.search_input} 
            type="text" 
            name="searchText" 
            placeholder="Search" 
            value={this.state.searchText}
            onChange={this.onInputchange}
          />
        </div>

        { this.maybeRenderPosts() }

      </div>
    )
  }
}

export default compose(
  withRouter,
  withCookies, 
) (HomePage)