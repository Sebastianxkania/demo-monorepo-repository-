import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView, RefreshControl} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import * as PostController from "backend/PostController";
import { Ionicons } from '@expo/vector-icons';


var mss = require('../styleSheets/master_style_sheet');


export default class ModuleProfileScreen extends React.Component {

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        return {
            title: '',
            headerTitleStyle: { fontWeight: '500', fontFamily: "Helvetica Neue", fontSize: 21,},
            headerTintColor: 'black', 
    
            headerLeft: () => (
                <Ionicons
                  name="chevron-back-outline"
                  size={35}
                  color="#202124"
                  style={{ marginRight: 0, marginBottom: 0, marginLeft: 15 }}
                  onPress={() => params.goBack()}
                />
            ),
    
            headerStyle: {
                backgroundColor: '#fafafa',
                elevation: 0, 
                shadowOpacity: 0, 
            },
        }
    };

    goBack = () => {
        this.props.navigation.navigate("Home")
    }


    componentDidMount() {
        const { navigation } = this.props;
      
        navigation.setParams({
            goBack: this.goBack,
        });
    }
    constructor(props) {
        super(props);

        this.state = {
            user: this.props.navigation.getParam('user', 'NO-user'),
            thisIsCurrentUserProfile : null,
            currentUserDetails : null,
            isLoading : true,
            postsAreLoading : true,
            currentUsersPosts: null,
            refreshing : true,
            followed : null,
            followedIsLoading : true,
        }

        this.loadDataFromFirestore()
    }

    loadDataFromFirestore = () => {
        const viewingUserID = this.state.user.id

        this.loadFollowedState()

        backend.getUserByUserID(viewingUserID).then((userDetails) => {
            this.setState({ currentUserDetails : userDetails })
            this.setState({ isLoading : false })
            this.setState({ refreshing : false })
        })

        PostController.pc.getAllUserPostsByUserID(viewingUserID).then(posts => {
            this.setState({ currentUsersPosts : posts })
            this.setState({ postsAreLoading : false })
            this.setState({ refreshing : false })
        })
    }

    onRefresh = () => {        
        this.loadDataFromFirestore()
    }

    maybeRenderPostImage = (url) => {
        if (url == null ) {
            return
        }
        else {
            return (
                <View style={styles.post_img_con}>
                    <Image 
                        style={styles.post_img} 
                        source={{uri: url }}
                    ></Image>  
                </View>
   
            )
        }
    }

    loadFollowedState = () => {  
        const followerID = backend.getAuth().currentUser.uid
        const followingID = this.state.user.id

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
        const followerID = backend.getAuth().currentUser.uid
        const followingID = this.state.user.id

        backend.createFollowingAndFollowerDocument(followerID, followingID)
        this.setState({ followed: true })
    }

    getFollowButtonOrFollowing = () => {     
        if (this.state.followed == true) {
            return (
                <Text style={styles.following_txt}>Following</Text>
            )
        }
        else if (this.state.followed == false ) {
            return (
                <TouchableOpacity
                    onPress={() => {
                        this.followEvent()
                    }}
                    style={styles.follow_btn}
                >

                    <Text style={styles.follow_btn_txt}>Follow</Text>
                </TouchableOpacity>
            )

        }
        else if (this.state.followed == null ) {
            return
        }
    }

    
    render() {
        if(this.state.isLoading || this.state.postsAreLoading || this.state.followedIsLoading){
            return(
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="fefefe"/>
              </View>
            )
          }    




        const noPosts = this.state.currentUsersPosts.length
        var posts = [];

        for(let i = 0; i < noPosts; i++){   
            const postData = this.state.currentUsersPosts
            posts.push(
                
                <View style={styles.post_main_con} key = {i}>
                    <View style={styles.post_top_con}>
                        <View style={styles.post_top_left_con}>
                            <Image 
                                style={styles.post_profile_img} 
                                source={{uri: postData[i].postUserProfileImageURL}}
                            ></Image>  
                        </View>
                        <View style={styles.post_top_right_con}>
                            <Text style={styles.post_username_txt} >{this.state.currentUserDetails.username}</Text>
                        </View>
                    </View>

                    <View style={styles.post_description_con}>
                        <Text style={styles.post_description_txt} >{postData[i].postDescription}</Text>
                    </View>

     
                    { this.maybeRenderPostImage(postData[i].postImageUrl) }

                    
                    <View style={styles.post_btns_con}>
                        <View style={styles.post_comment_btn}>
                            <Ionicons
                                name="chatbubble-outline"
                                size={25}
                                color="black"
                                style={{ marginRight: 0, marginBottom: 0, marginTop: 9, marginLeft: 13 }}
                                onPress={() => {this.props.navigation.navigate("Comment", {postID: postData[i].id, postUserID: postData[i].userID, goBackScreen: 'ModuleProfile'})}}
                            />
                        </View>

                        <View style={styles.post_view_comments_con}>
                            <Text style={styles.post_view_comments_txt} >View all 183 comments</Text>
                        </View>
                    </View>

                </View>

            )
        }


        return (
            
            <ScrollView 
                style={styles.main_wrapper} 
                showsVerticalScrollIndicator={false} 
                refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }
            >
                <View style={styles.top_con}>
                    <View style={styles.top_left_con} >
                        <Image 
                            style={styles.profile_img} 
                            source={{uri: this.state.currentUserDetails.profileImageURL}}
                        ></Image>  
                    </View>
                    <View style={styles.top_right_con} >
                        <Text style={styles.username_txt} >{this.state.currentUserDetails.username}</Text>
                    </View>
                </View>
            
                <View style={styles.name_con}>
                    <View style={styles.name_left_con} >
                        <Text style={styles.name_txt} >{this.state.currentUserDetails.firstName} {this.state.currentUserDetails.lastName}</Text>
                    </View>
                    <View style={styles.name_right_con} >
                        {this.getFollowButtonOrFollowing()}
                    </View>
                    
                </View>

                <View style={styles.bio_con}>
                    <Text style={styles.bio_txt} >{this.state.currentUserDetails.bio}</Text>
                </View>

                <View style={styles.lineSeperator01}></View>

                <View style={styles.posts_txt_con}>
                    <Text style={styles.posts_txt} >Posts</Text>
                </View>

                { posts }

            </ScrollView>



        )
    }
}


const styles = StyleSheet.create({
    main_wrapper: {
        
        height: 3000,
        backgroundColor: '#f7f7f5',
    },

    top_con: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        borderRadius: 10,

        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',

        height: 120,
    },

    top_left_con: {
        width: 90,
        height: 90,
        borderRadius: 50,

        marginLeft: 15,
    },

    profile_img: {
        borderRadius: 50,

        width: 360/4,
        height: 360/4,
    },

    top_right_con: {
        width: '75%',
        height: '100%',

        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

        flex: 1,
        justifyContent: 'center',

    },

    username_con: {
        width: '75%',
        height: '50%',
        marginTop: 22.5,
        alignSelf: 'flex-end',
    },

    username_txt: {
        fontSize: 30,
        fontWeight: '500',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
        paddingBottom: 5,
        alignSelf: 'flex-end',

        marginRight: 15,
    },

    name_con: {
        backgroundColor: '#fefefe',
        
        borderRadius: 10,


        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        height: 45,

        flexDirection: 'row'
    },

    name_left_con: {
        justifyContent: 'center',

        width: '65%',
    },

    name_right_con: {
        width: '35%',
        //marginRight: 15,
        justifyContent: 'center',
        //alignItems: 'center',
    },

    follow_btn: {
        borderColor: '#0195f6',
        borderWidth : 1,
        width: 80,
  
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 15,
    },

    follow_btn_txt: {
        fontWeight: '600',
        color: '#0195f6',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
        fontSize: 14,

        marginVertical: 5,
    },

    following_txt: {
        fontWeight: '600',
        color: '#0195f6',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
        fontSize: 14,

        marginVertical: 5,

        alignItems: 'center',
        alignSelf: 'flex-end',
        marginRight: 15,
    },


    name_txt: {
        marginLeft: 15,
        fontSize: 25,
        fontWeight: '300',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 


    
    },



    bio_con: {
        justifyContent: 'center',

        backgroundColor: '#fefefe',
        

        borderRadius: 10,

        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
 

        flexDirection: 'row'
        
    },

    bio_txt: {
        fontSize: 15,
        fontWeight: '300',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 15,
        textAlign :'left', 
        flex : 1

    
    },

    lineSeperator01: {
        backgroundColor: '#dbdbdb',
        


        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
        height: 0.5,

        flexDirection: 'row'
        
    },

    lineSeperator02: {
        backgroundColor: '#dbdbdb',
        


        marginTop: 15,
        height: 0.7,

        flexDirection: 'row'
        
    },

    posts_txt_con: {
        justifyContent: 'center',

        

        borderRadius: 10,

        marginTop: 15,
        marginLeft: 15,
        marginRight: 15,
 

        flexDirection: 'row'
    },
    
    posts_txt: {
        
        fontSize: 15,
        fontWeight: '500',
        color: '#202124',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        marginRight: 15,
        textAlign :'left', 
        flex : 1

    
    },

    ///////////////// POST ////////////////////

    post_main_con: {
        marginTop: 15,
        //backgroundColor: '#fefefe',
        backgroundColor: '#fefefe',

    },

    post_top_con: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,

        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        flexDirection: 'row',

        height: 40,
    },

    post_top_left_con: {
        width: '11%',
        height: "100%",

    },


    post_profile_img: {
        borderRadius: 50,

        width: 360/9,
        height: 360/9,
    },

    post_top_right_con: {
        width: '89%',
        height: '100%',

        justifyContent: 'center',
        flex: 1,
        
    },

    post_username_txt: {
        marginLeft: 13,

        fontSize: 17,
        fontWeight: '500',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 
    },

    post_img_con: {
        marginTop: 10,
        height: 390,
    },

    post_img: {
        height: '100%',
        width: '100%',
    },

    ////////// POST COMMENTS TAB //////////

    post_btns_con: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fefefe',
        flexDirection: 'row',

        
        height: 45,
    },

    post_comment_btn: {
        width: '16%',
        height: "100%",
    },

    post_view_comments_con: {
        height: '100%',
        width: '84%',

        justifyContent: 'center',
        flex: 1,
    },

    post_view_comments_txt: {
        marginRight: 15,
        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'right', 
    },

    post_description_con: {
        backgroundColor: '#fefefe',
        //height: 50,
    },

    post_description_txt_con: {
        height: '100%',

        flex: 1,
    },

    post_description_txt: {
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,

        fontSize: 13,
        fontWeight: '400',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 
    },






    post_interests_con: {
        alignItems: 'center',
        backgroundColor: '#fefefe',

        flexDirection: 'row',

        
        height: 40,
    },

    post_interests_text_con: {
        //backgroundColor: 'black',
        borderColor: '#0195f6',
        borderWidth : 1,
        marginTop: 5,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 10,
    },  

    post_interests_text: {
        fontSize: 13,
        fontWeight: '600',
        color: '#0195f6',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',


        
        marginTop: 2,
        marginBottom: 5,
        marginRight: 10,
        marginLeft: 10,
    },

    btns_con: {
        width: '90%',
        marginTop: 15,
    },



    /////////////



    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',    
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#fefefe',
    },

    con01: {
        backgroundColor: 'red',
        width: '90%',
        height: 50,
    },





})


