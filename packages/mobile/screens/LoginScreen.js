import {TouchableOpacity, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React, { Component } from 'react'
import * as backend  from "backend/firebase";
import AsyncStorage from '@react-native-async-storage/async-storage';

var mss = require('../styleSheets/master_style_sheet');


export default class LoginScreen extends React.Component{
    static navigationOptions = {
        headerShown:false, 
        animationEnabled: false, 
    }

    constructor(props) {
        super(props);
        this.state = {
          email: '',
          password: '',
        }
    }

    








    loginBtnEvent = () => {
        backend.handleLogin(this.state.email, this.state.password)
        .then(result => {
            if (result != null) {
                //this.home()
                this.props.navigation.navigate("Home")
            }
            else {
                //this.props.navigation.replace("Login")    
            }
        })
    }   



    forgotPasswordEvent = () => {

        //backend.passwordReset("oasisxprivate@gmail.com")
        this.props.navigation.replace("ForgotPassword")
    }


    



 
    render() {
        return (
            <View style={mss.main_wrapper}>
                
                <Image 
                    style={styles.logo} 
                    source={require('../imgs/gradient.jpg')}
                ></Image>

                <View style={styles.square}>
      
                    <View style={styles.headerContainer}>

                        <Text style={styles.header} >Hi,</Text>
                        <Text style={styles.header} >Welcome</Text>
                        <Text style={styles.header} >Back</Text>
                    </View>

                    <View style={styles.inputContainer} >
                        <TextInput
                            placeholder="Email"
                            onChangeText = { (email) => this.setState({email})}
                            style={mss.input}
                            placeholderTextColor={'#737373'}
                        />

                        <TextInput
                            placeholder="Password"
                            onChangeText = { (password) => this.setState({password})}
                            style={mss.input}
                            placeholderTextColor={'#737373'}
                            secureTextEntry
                        />
                    </View>

                    <View style={styles.forgot_pass_con}>
                        <TouchableOpacity
                            onPress={() => this.forgotPasswordEvent()}
                            style={styles.forgot_pass_btn}
                        >
                            <Text style={styles.forgot_pass_text}>Forgot password?</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.login_btn_con}>
                        <TouchableOpacity
                            onPress = {() => this.loginBtnEvent()}
                            style={mss.btn01}
                        >
                            <Text style={mss.btn01_text}>Login</Text>
                            
                        </TouchableOpacity>
                    </View>

                    <View style={styles.sign_up_con}>
                        <TouchableOpacity
                            onPress={() => this.props.navigation.replace("Reg01")}
                            style={styles.sign_up_btn}
                        >
                            <Text style={styles.forgot_pass_text}>Don't have an account? Sign Up</Text>
                    </TouchableOpacity>
                    </View>


                </View>
            </View>
        )
    }
}







const styles = StyleSheet.create({
    logo: {
        width: 1280/3,
        height: 720/3,
        position: 'absolute',

        top:      -110,
    },
    
    square: {
        flex: 1,
        width: '100%',
        height: '86%',
        backgroundColor: '#fefefe',
    
        alignItems: 'center',
        position: 'absolute', //Here is the trick
        borderRadius: 15,
        bottom: 0,
      },

    squareOutline: {
        borderColor: 'black',
        borderWidth: 1,
    },

    headerContainer: {
        paddingTop: 50,
        paddingLeft: 20,
        
        width: '100%',

    },

    header: {
        fontSize: 38,
        fontWeight: '700',
        color: '#202124',
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    },


    inputContainer: {
        marginTop: 20,
        width: '90%',
        
    },


    forgot_pass_con: {
        paddingTop: 15,
        width: '90%',
        paddingLeft: 234,
        paddingBottom: 15,
    },
    forgot_pass_text: {
        color: '#202124',
        
    },




    login_btn_con: {
        paddingTop: Platform.OS === 'ios' ? 170 : 130,
        width: '90%',
    },
    
    sign_up_con: {
        paddingTop: Platform.OS === 'ios' ? 45 : 30,
    },

})