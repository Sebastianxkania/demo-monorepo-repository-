import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, Image, ScrollView, TextInput,} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import * as PostController from "backend/PostController";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeModules } from "react-native";
import * as ImagePicker from 'expo-image-picker';


import { ProgressBar, Colors } from 'react-native-paper';

var mss = require('../styleSheets/master_style_sheet');

export default class OptionsScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        return {
            title: 'Options',
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
        this.props.navigation.navigate("Profile")
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
            bio : '',
            fname : '',
            lname : '',
            imageUrl : '',
            loading : true,
            uploadingProgress : 0,
        }   

        this.loadProfileImage()
    }


    signOutBtnEvent = async () => {

        backend.handleSignOut()
        .then(result => {
            // User signs out
            if (result) {
                // Clears current user 
                AsyncStorage.clear()
                
                // Reloads the whole app
                NativeModules.DevSettings.reload();
            }
            else {
                console.log("not logged in!!")
            }

        }); 
    }


    updateFirstName = async () => {
        const userID = await AsyncStorage.getItem('@userId')
        backend.updateFirstName(userID, this.state.fname)
    }

    updateLastName = async () => {
        const userID = await AsyncStorage.getItem('@userId')
        backend.updateLastName(userID, this.state.lname)
    }

    updateBio = async () => {
        const userID = await AsyncStorage.getItem('@userId')
        backend.updateBio(userID, this.state.bio)
    }

    loadProfileImage = async () => {
        const userID = await AsyncStorage.getItem('@userId')
        backend.getUserDetailsByID(userID).then((user) => {
            this.setState({ imageUrl: user.profileImageURL })
            this.setState({ loading: false })
        })

    }

    openPicker = async ()=>{
        const userID = await AsyncStorage.getItem('@userId')
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
            
            PostController.pc.handleProfileImageUpdate(userID, pickerResult.uri, false)
            
            setTimeout(
                () => { this.setState({ imageUrl: pickerResult.uri }) },    
                1000
              )
        }
    }


    render () {

        if(this.state.loading){
            return(
              <View style={styles.loader}>
                <ActivityIndicator size="small" color="fefefe"/>
              </View>
            )
        } 


        return (
        
            <View style={styles.main_con}
                showsVerticalScrollIndicator={false} 
            >   
            
                <View style={styles.top_left_con} >
                    <Image 
                        style={styles.profile_img} 
                        source={{uri: this.state.imageUrl}}
                    ></Image>  
                </View>

                <View style={mss.btn02_con}>
                
                    <TouchableOpacity
                        onPress={() => {this.openPicker()}}
                        style={mss.btn02}
                    >
                        <Text style={mss.btn02_text}>Change profile picture</Text>
                    </TouchableOpacity>
                </View>



                <View style={styles.bio_input_con} >
                    <TextInput
                        onChangeText = { (bio) => this.setState({bio})}
                        style={styles.bio_input}
                        placeholderTextColor={'#737373'}

                    />
                </View>

                <View style={mss.btn02_con}>
                    <TouchableOpacity
                        onPress={() => {this.updateBio()}}
                        style={mss.btn02}
                    >
                        <Text style={mss.btn02_text}>Update your bio</Text>
                    </TouchableOpacity>
                </View>


                <View style={mss.input02_con} >
                    <TextInput
                        onChangeText = { (fname) => this.setState({fname})}
                        style={mss.input02}
                        placeholderTextColor={'#737373'}
                        placeholder="First name"

                    />
                </View>

                <View style={mss.btn02_con}>
                    <TouchableOpacity
                        onPress={() => {this.updateFirstName()}}
                        style={mss.btn02}
                    >
                        <Text style={mss.btn02_text}>Update</Text>
                    </TouchableOpacity>
                </View>


                <View style={mss.input02_con} >
                    <TextInput
                        onChangeText = { (lname) => this.setState({lname})}
                        style={mss.input02}
                        placeholderTextColor={'#737373'}
                        placeholder="Last name"

                    />
                </View>

                <View style={mss.btn02_con}>
                    <TouchableOpacity
                        onPress={() => {this.updateLastName()}}
                        style={mss.btn02}
                    >
                        <Text style={mss.btn02_text}>Update</Text>
                    </TouchableOpacity>
                </View>







                <View style={mss.btn02_con}>
                    <TouchableOpacity
                        onPress={() => this.signOutBtnEvent()}
                        style={mss.btn02}
                    >
                        <Text style={mss.btn02_text}>Sign out</Text>
                    </TouchableOpacity>
                </View>    

        </View>
        )
    }
}


const styles = StyleSheet.create({
    main_con: {
        flex: 1,

        alignItems: 'center',
        backgroundColor: '#fefefe',
    },

    progress_bar_con: {
        width: '100%'
    },

    btn_con: {
        marginTop: 15,
        width: '90%',
    },

    bio_input_con: {
        marginTop: 15,
        width: '90%',
    },

    bio_input: {
        borderColor: '#cacaca',
        backgroundColor : "#f7f7f7",
        paddingHorizontal: 15,
        paddingVertical: 17,
        
        borderRadius: 9,
        
        color: '#202124',
        borderWidth : 0.5,

        height: 100,
    },

    top_left_con: {
        marginTop: 15,
        width: 90,
        height: 90,
        borderRadius: 50,

    },

    profile_img: {
        borderRadius: 50,

        width: 360/4,
        height: 360/4,
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

})

