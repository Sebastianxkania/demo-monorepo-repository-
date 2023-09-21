import { StyleSheet, Text, TextInput, View, TouchableOpacity, ActivityIndicator, Image, ScrollView, Input, KeyboardAvoidingView} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import * as PostController from "backend/PostController";
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
var mss = require('../styleSheets/master_style_sheet');
import { SwitchActions } from 'react-navigation'

export default class PostScreen extends React.Component {
    static navigationOptions = {
        title: 'Create post',
        headerTitleStyle: { fontWeight: '500', fontFamily: "Helvetica Neue", fontSize: 21,},
        headerTintColor: 'black', 


        headerStyle: {
            backgroundColor: '#fafafa',
            elevation: 0, 
            shadowOpacity: 0, 
        },



    };

    constructor () {
        super() 

        this.state = {
            postDescription : "",
            selectedImage : null,
            image : null,

        }

        backend.getImage().then(result => {
            this.loadData(result)
        })
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.pokemons !== this.state.pokemons) {
          console.log('pokemons state has changed.')
        }
    }

    loadData = (img) => {
        this.setState({ image : img })
    }

    async componentDidMount() {
        (async () => {
            if (Platform.OS !== 'web') {
              const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
              if (status !== 'granted') {
                alert('Sorry, we need camera roll permissions to make this work!');
              }
            }

            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestCameraPermissionsAsync();
                if (status !== 'granted') {
                  alert('Sorry, we need camera roll permissions to make this work!');
                }
            }


          })();
    }

    openPicker = async ()=>{
        let pickerResult = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (pickerResult.cancelled) {
            return
        } 
        else {
            this.setState({ selectedImage: pickerResult })
            
        }



    }

    openCamera = async () => {
        let pickerResult = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (pickerResult.cancelled) {
            return
        } 
        else {
            this.setState({ selectedImage: pickerResult })
            
        }
    };


    createPostEvent = () => {
        const postDetails = {
            currentUserID : backend.getAuth().currentUser?.uid,
            postDescription : this.state.postDescription,
            selectedImage : this.state.selectedImage,
            isBlob : false,
        }
        
        if (this.state.postDescription == '') {
            alert("Write a cpation...")
            return
        }
        else {
            PostController.pc.handlePostCreation(postDetails)
            this.props.navigation.dispatch(SwitchActions.jumpTo({ routeName: 'Profile' }));
        }

    }

    maybeRenderImage = () => {

        return (
            <View style={styles.postImage_con}>
                <Image source= {this.state.selectedImage} style={styles.postImage} />
            </View>

        )
    }

    render () {
        
        

        return (
            <KeyboardAvoidingView style={styles.main_con} behavior="position" enabled keyboardVerticalOffset='110'>

            
              
                { this.maybeRenderImage() }
              
              

                <View style={styles.input_con} >
                    <TextInput
                        onChangeText = { (postDescription) => this.setState({postDescription})}
                        style={mss.input}
                        placeholderTextColor={'#737373'}
                        placeholder = "How was your day?"
                        //borderColor = {this.state.border_color}

                    />
                </View>

                <View style={styles.btns_con}>
                    <TouchableOpacity
                        onPress={() => {this.createPostEvent()}}
                        style={styles.btn02}
                    >
                        <Text style={mss.btn01_text}>Create Post</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btns_con}>
                    <TouchableOpacity
                        onPress={() => {this.openPicker()}}
                        style={styles.btn02}
                    >
                        <Text style={mss.btn01_text}>Open camera roll</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.btns_con}>
                    <TouchableOpacity
                        onPress={() => {this.openCamera()}}
                        style={styles.btn02}
                    >
                        <Text style={mss.btn01_text}>Open camera</Text>
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        )
    }
}


const styles = StyleSheet.create({
    main_con: {
    
        justifyContent: 'center',
        alignItems: 'center',
    },

    btns_con: {
        marginTop: 15,
        width: '92%',
        marginRight: 15,
        marginLeft: 15,
    },

    postImage_con : {
        width: 390,
        height: 390,
        backgroundColor: '#fefefe',
    },

    postImage: {
        width: 390,
        height: 390,
    },


    input_con: {
        marginTop: 10,
        marginBottom: 10,
        width: 360,
        marginRight: 15,
        marginLeft: 15,

    },

    btn02: {
        backgroundColor: '#212121',
        width: '100%',
        borderRadius: 9,
        alignItems: 'center',
        height: 45,
        justifyContent: 'center',
        alignItems: 'center',
        width: 360,
    },
})