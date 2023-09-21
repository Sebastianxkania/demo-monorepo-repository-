import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, TextInput, RefreshControl, ScrollView, Image} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';
var mss = require('../styleSheets/master_style_sheet');
import { Ionicons } from '@expo/vector-icons';
import * as PostController from "backend/PostController";

var pss = require('../styleSheets/post_style_sheet');


export default class HomeScreen extends React.Component {

    static navigationOptions = ({ navigation, screenProps }) => {
        const { params = {} } = navigation.state;
        return {
            title: '',
            headerTitleStyle: { fontWeight: '500', fontFamily: "Helvetica Neue", fontSize: 21,},
            headerTintColor: 'black', 
            
            animationEnabled: false, 
            headerLeft: () => (
                <View style={styles.main_header_con} >
                    <View style={styles.bottom_left_con} >
                        <Ionicons
                            name="search-outline"
                            size={25}
                            color="#202124"
                            style={{ marginRight: 0, marginBottom: 0, marginLeft: 0 }}
                        />
                    </View>
                    <View style={styles.bottom_middle_con} >
                        <TextInput
                            placeholder="Search"
                            placeholderTextColor= 'gray'
                            style={styles.search_input}
                            onChangeText = { (input) => params.setSearchInput({input})}
                        />
                    </View>

                    <View style={styles.bottom_right_con} >
                        <TouchableOpacity
                            onPress={() => params.searchEvent()}
                            style={styles.search_btn01}
                        >
                            <Text style={styles.search_btn01_text}>Search</Text>
                        </TouchableOpacity>
                    </View>
      
                </View>
            ),

            headerStyle: {
                backgroundColor: '#fafafa',
                elevation: 0, 
                shadowOpacity: 0, 
            },
        }
    };


     
    setSearchInput = (input) => {
        this.setState({ searchInput: input})
    }

    componentDidMount() {
        const { navigation } = this.props;
      
        navigation.setParams({
            setSearchInput: this.setSearchInput,
            searchEvent: this.searchEvent,
            
        });
    }

    constructor(props) {
        super(props);

        this.state = {
            currentUserDetails : null,
            isLoading : true,
            searchInput: '',
            HomePosts: null,
            currentUser : '',
            homePosts : [],
            postLoaderArray : [],
            postsLoading : true,
            noFollowing : null,
            thereAreNoPosts : true,
        }

        this.loadHomeData()
    }   

    onRefresh = () => {
        this.setState({postLoaderArray: []})
        this.setState({homePosts: []})

        this.loadHomeData()
    }

    loadHomeData = async () => {
        const currentUserID = await AsyncStorage.getItem('@userId')
        
        backend.getUserDetailsByID(currentUserID).then(user => {
            this.setState({ currentUser : user })
            this.setState({ isLoading : false })
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

    searchEvent = () => {
        const username = this.state.searchInput.input

        if (username == undefined || username == '' ) {
            alert("Please enter a username.")
            return null
        }
        else {
            backend.getUserByUsername(username).then((user) => {
                // user.id - gives id 
                // user.data() = gives user data 
                if (user != null ) {
                    this.props.navigation.navigate("ModuleProfile", {user: user})
                }
                else {
                    return
                }
                
            })
        }

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
                <View style={pss.post_img_con}>
                    <Image 
                        style={pss.post_img} 
                        source={{uri: url }}
                    ></Image>  
                </View>
   
            )
        }
    }


    maybeRenderPosts = () => {
        const postData = this.state.homePosts
        const noOfFollowing = this.state.homePosts.length
        var posts = []

        if (this.state.thereAreNoPosts == false) {
            for (let i = 0; i < noOfFollowing; i++) { 
                

                for (let j = 0; j < postData[i].length; j++) { 
                    

                    
                    posts.push(
                        //<Text key = {postData[i][j].id} >{postData[i][j].id}</Text>

                        

                        <View style={pss.post_main_con} key = {postData[i][j].id}>
                            <View style={pss.post_top_con}>
                                <View style={pss.post_top_left_con}>
                                    <Image 
                                        style={pss.post_profile_img} 
                                        source={{uri: postData[i][j].postUserProfileImageURL}}
                                    ></Image>  
                                </View>
                                <View style={pss.post_top_right_con}>
                                    <Text style={pss.post_username_txt} >{postData[i][j].postUsername}</Text>
                                </View>
                            </View>
        
                            <View style={pss.post_description_con}>
                                <Text style={pss.post_description_txt} >{postData[i][j].postDescription}</Text>
                            </View>
        
            
                            { this.maybeRenderPostImage(postData[i][j].postImageUrl) }
        
                            
                            <View style={pss.post_btns_con}>
                                <View style={pss.post_comment_btn}>
                                    <Ionicons
                                        name="chatbubble-outline"
                                        size={25}
                                        color="black"
                                        style={{ marginRight: 0, marginBottom: 0, marginTop: 9, marginLeft: 13 }}
                                        onPress={() => {this.props.navigation.navigate("Comment", {postID: postData[i][j].id, postUserID: postData[i][j].userID, goBackScreen: 'Home'})}}
                                    />
                                </View>
        
                                <View style={pss.post_view_comments_con}>
                                    <TouchableOpacity
                                        onPress={() => {this.props.navigation.navigate("Comment", {postID: postData[i].id, postUserID: postData[i].userID, goBackScreen: 'Home'})}}
                                    >
                                        <Text style={pss.post_view_comments_txt} >View all comments</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
        
                        </View>
                    )
                }
            }

            return posts
        }
        else {
            return (
                <View style={styles.no_posts_available} >
                    <Text style={styles.no_posts_available_text} >No posts available yet, </Text>
                    <Text style={styles.no_posts_available_text} >follow someone.</Text>
                </View>
                
            )
        }

        


        

    }


    render() {
        if(this.state.isLoading || this.state.postsLoading){
            return(
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="black"/>
              </View>
            )
        }    


        



        





        return (
            <ScrollView 
                style={styles.main_wrapper} 
                showsVerticalScrollIndicator={false} 
                refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} /> }
            >   
                

                { this.maybeRenderPosts() }

                <View style={styles.btn_con}>
            </View>   
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    main_wrapper: {
        backgroundColor: '#f7f7f5',
    },

    main_con: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: '#fefefe',
    },

    main_header_con: {

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',

        //borderRadius: 15,
        width: 360,
        height: 35,

        marginBottom: 15,
        marginLeft: 5,
        marginRight: 15,
    },

    bottom_left_con: {

        width: '10%',
        marginLeft: 20,
    },

    bottom_middle_con: {
        width: '70%',

    },

    bottom_right_con: {
        width: '20%',
    },

    search_input: {
        borderColor: '#cacaca',
        backgroundColor : "#f7f7f7",

        paddingLeft: 15,
        height: '100%',
       
        
        borderRadius: 10,

        color: '#202124',
        borderWidth : 0.5,
        fontSize : 16,
    },

    search_btn01: {
        height: '100%',
        

        alignItems: 'center',
        justifyContent: 'center', 
        color: '#202124',

        marginLeft: 10,
    },

    search_btn01_text: {
        fontSize: 18,
        fontWeight: '400',
        color: 'black',
    },
    
    loader: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',    
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: '#f7f7f5',
    },
    no_posts_available: {
        marginTop: 15,
        alignItems: 'center',
        justifyContent: 'center',    
    },

    no_posts_available_text: {
        color: '#0195f6',
        fontWeight: '400',
    }   


   
})