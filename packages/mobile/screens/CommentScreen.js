import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView, TextInput, RefreshControl, Keyboard, KeyboardAvoidingView} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import { Ionicons } from '@expo/vector-icons';
import * as PostController from "backend/PostController";
import { ProgressBar, Colors } from 'react-native-paper';

var mss = require('../styleSheets/master_style_sheet');

export default class CommentScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        
        return {
            title: 'Comments',
            animationEnabled: false, 
            headerTitleStyle: { fontWeight: '500', fontFamily: "Helvetica Neue", fontSize: 21,},
            headerTintColor: 'black', 
    
            headerLeft: () => (
                <Ionicons
                  name="close-outline"
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
        this.props.navigation.navigate(this.state.goBackScreen)
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
            postID: this.props.navigation.getParam('postID', 'NO-postID'),
            postUserID: this.props.navigation.getParam('postUserID', 'NO-postUserID'),
            goBackScreen: this.props.navigation.getParam('goBackScreen', 'NO-goBackScreen'),
            commentText: "",
            commentsAreLoading : true,
            allPostComments : null,
            refreshing : true,
            progress: 0,
            
        }

        this.loadComments()
    }

    loadComments = () => {
        PostController.pc.getAllCommentsByPostUserIDAndPostId(this.state.postUserID, this.state.postID).then((comments) => {
            this.setState({ allPostComments : comments })
            this.setState({ commentsAreLoading : false })
            this.setState({ refreshing : false })
        })
    }

    createCommentEvent = () => {
        const commenterUserID = backend.getAuth().currentUser?.uid
        const postUserID = this.state.postUserID
        const postID = this.state.postID
        const commentText = this.state.commentText

        
        if (commentText == "") {
            alert("Please enter comment")
        } 
        else {
            PostController.pc.createCommentDocument(commenterUserID, postUserID, postID, commentText)

            setTimeout(
                () => { 
                    this.loadComments(
                    this.setState({ refreshing : true })
                ) },    
                200
              )
            this.setState({ refreshing : false })

            this.setState({ commentText : "" })
            Keyboard.dismiss()
        }



        
    }

    load = () => {
        //this.setState({ refreshing : true })
        this.loadComments()
        
    }


    




    


  




    render () {
        if(this.state.commentsAreLoading){
            return(
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="fefefe"/>
              </View>
            )
        }    
        const B = (props) => <Text style={{fontWeight: 'bold'}}>{props.children}</Text>
        const noComments = this.state.allPostComments.length
        var comments = []

        for(let i = 0; i < noComments; i++){   
            const commentsData = this.state.allPostComments
            comments.push(
                
                <View style={styles.comment_con} key = {i}>
                    <View style={styles.comment_txt_con}>
                        <Text style={styles.comment_txt} ><B>{commentsData[i].commenterUsername}</B> {commentsData[i].commentText} </Text>
                    </View>
                    
                </View>
            )
        }
        

        
        
        return (

            <KeyboardAvoidingView style={styles.container} behavior="height" enabled keyboardVerticalOffset='120'>

                    <ScrollView 
                        style={styles.scroll_wrapper} 
                        showsVerticalScrollIndicator={false} 
                        refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadComments} /> }
                    >   
                        <View style={styles.all_comments_con}>
                            { comments }
                        </View >
                    </ScrollView>


                <View style={styles.bottomContainer}>
                    <View style={styles.bottom_left_con} >
                        <TextInput
                            value ={this.state.commentText}
                            onChangeText = { (commentText) => this.setState({commentText})}
                            style={styles.input}
                            placeholderTextColor={'#737373'}
                            placeholder = "Add comment"
                            //borderColor = {this.state.border_color}

                        />
                    </View>

                    <View style={styles.bottom_right_con}>
                        <TouchableOpacity
                            onPress={() => {this.createCommentEvent()}}
                            style={styles.btn01}
                        >
                            <Text style={styles.btn01_text}>Post</Text>
                        </TouchableOpacity>
                        
                    </View>
                        
                </View>
            </KeyboardAvoidingView>
            
        )
    }   
}


const styles = StyleSheet.create({
    
    main_con: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },


    scroll_wrapper: {

        backgroundColor: '#f7f7f5',

        height: '87%'
    },

    all_comments_con: {

    },

    btns_con: {
        marginTop: 15,
        width: '90%',

    },

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


    comment_con: {
        backgroundColor: '#fefefe',
        marginTop: 10,
        marginLeft: 15,
        marginRight: 15,
        
        borderRadius: 10,
    },

    comment_txt_con: {
        marginLeft: 15,
        marginRight: 15,
        marginTop: 15,
        marginBottom: 15,

        
    },

    comment_txt: {
   
        fontSize: 14,
        fontWeight: '400',
        color: 'black',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',

        textAlign :'left', 
    },

    bottomContainer: {
        backgroundColor: '#fafafa',

        justifyContent: 'center',
        alignItems: 'center',

        flexDirection: 'row',

        height: 80,
        paddingTop: 10,
        paddingBottom: 10,

        borderWidth: 0.5, borderColor: '#dbdbdb', margin: -2, 
    },

    bottom_left_con: {

        width: '75%',
        marginLeft: 15,
    },

    bottom_right_con: {
        width: '25%',
      

        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,

        marginRight: 15,

        flex: 1,
        justifyContent: 'center',

    },

    input_con: {

    },

    input: {
        borderColor: '#cacaca',
        backgroundColor : "#f7f7f7",
        paddingHorizontal: 15,
        paddingVertical: 17,
        
        
        color: '#202124',
        borderWidth : 0.5,

        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
    },

    btn01: {
        backgroundColor: '#212121',
        padding: 17,

        alignItems: 'center',

        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },

    btn01_text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    },

    container: {    
        flex: 1,
        

        zIndex: 0,

    },
})





/*



            <KeyboardAvoidingView
               

            >
                <View

                >

                    
    
                    <ScrollView 
                        style={styles.scroll_wrapper} 
                        showsVerticalScrollIndicator={false} 
                        refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this.loadComments} /> }
        
                    >   
                        <View style={styles.all_comments_con}>
                            { comments }
                        </View >
                    </ScrollView>

                    <View style={styles.bottomContainer}>
                        <View style={styles.bottom_left_con} >
                            <TextInput
                                ref={this.input}
                                onChangeText = { (commentText) => this.setState({commentText})}
                                style={styles.input}
                                placeholderTextColor={'#737373'}
                                placeholder = "Add comment"
                                //borderColor = {this.state.border_color}

                            />
                        </View>

                        <View style={styles.bottom_right_con}>
                            <TouchableOpacity
                                onPress={() => {this.createCommentEvent()}}
                                style={styles.btn01}
                            >
                                <Text style={styles.btn01_text}>Post</Text>
                            </TouchableOpacity>
                            
                        </View>
                        
                    </View>
                </View>
            </KeyboardAvoidingView>





*/