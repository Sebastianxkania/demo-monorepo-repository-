import {TouchableOpacity, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React from 'react';
import * as backend  from "backend/firebase";
import { Ionicons } from '@expo/vector-icons';

var mss = require('../../styleSheets/master_style_sheet');


export class RegScreen04 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.getParam('userName', 'NO-User'),
            email: this.props.navigation.getParam('email', 'NO-Email'),
            firstName: this.props.navigation.getParam('firstName', 'NO-firstName'),
            lastName: this.props.navigation.getParam('lastName', 'NO-lastName'),
            password: '',
            confirmPassword: '',

            text_color: '#1f1d25',
            border_color_firstName: '#cacaca',
            border_color_lastName: '#cacaca',
            warning_text: ' ',
            
        }
    }
    

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        return {
            title: '',
            headerTitleStyle: { fontWeight: '500', fontFamily: "Helvetica Neue", fontSize: 21,},
            headerTintColor: '#202124', 
            headerStyle: { 
                backgroundColor: '#fefefe',
                elevation: 0, 
                shadowOpacity: 0, 
            
            },

            headerLeft: () => (
            <Ionicons
              name="chevron-back-outline"
              size={36}
              color="#202124"
              style={{ marginRight: 7, marginBottom: 3, marginLeft: 10 }}
              onPress={() => params.goBack()}
            />
          ),
        }
    }

    componentDidMount() {
        const { navigation } = this.props;
      
        navigation.setParams({
            goBack: this.goBack,
        });
    }

    componentDidUpdate() {
        const unsubscribe = backend.getAuth().onAuthStateChanged(user => {
        if (user) {
            this.props.navigation.replace("Home")
        }
        return unsubscribe 
        })
    }

    /*
    componentDidMount() {
        const { navigation } = this.props;
      
        navigation.setParams({
            goBack: this.goBack,
        });
    }
    */

    goBack = () => {
        this.props.navigation.replace("Reg03")
    }

    handleAddName = async () => {

   

            if ((this.state.password == '') && (this.state.confirmPassword == '')) {
                this.setState({ warning_text: 'Please enter password and confirm password.' })
                this.setState({ border_color_firstName: '#ed4956' })
                this.setState({ border_color_lastName: '#ed4956' })
                this.setState({ text_color: '#ed4956' })
            }
            else if (this.state.password == '') {
                this.setState({ warning_text: 'Please enter password.' })
                this.setState({ border_color_firstName: '#ed4956' })
                this.setState({ border_color_lastName: '#cacaca' })
                this.setState({ text_color: '#ed4956' })
            }
            else if (this.state.confirmPassword == '') {
                this.setState({ warning_text: 'Please confirm password.' })
                this.setState({ border_color_lastName: '#ed4956' })
                this.setState({ border_color_firstName: '#cacaca' })
                this.setState({ text_color: '#ed4956' })

            }
            else {
                if (this.state.password != this.state.confirmPassword) {
                    this.setState({ warning_text: 'Passwords do not match.' })
                    this.setState({ border_color_lastName: '#ed4956' })
                    this.setState({ border_color_firstName: '#ed4956' })
                    this.setState({ text_color: '#ed4956' })
                }
                else {
                    this.setState({ border_color_firstName: '#cacaca' })
                    this.setState({ border_color_lastName: '#cacaca' })
                    this.setState({ text_color: '#fefefe' })
                    
                    // firebase.js function // Handles sign up 
                    
                    backend.handleSignUp(
                        this.state.username.toLowerCase(), 
                        this.state.email.toLowerCase(), 
                        this.state.firstName, 
                        this.state.lastName, 
                        this.state.password
                    ).then(result => {
                        if (result != null) {
                            this.props.navigation.replace("Home")
                        } else {
                           // Stay on set password page
                        }
                    })
                    
                    

                    console.log(this.state.username)
                    console.log(this.state.email)
                    console.log(this.state.firstName)
                    console.log(this.state.lastName)
                    console.log(this.state.password)



                }

            }
      }

    render() {
        return (
            <View style={mss.main_wrapper}>
            <View style={mss.main_con}>

                <View style={mss.header02_con}>
                    <Text style={mss.header02} >Create password</Text>
                    <Text style={mss.header03} >Choose a password for your new account. You will use it to login into your account.</Text>
                </View>


                <View style={mss.input_con} >
                    <TextInput
                        placeholder="Password"
                        onChangeText = { (password) => this.setState({password})}
                        style={mss.input}
                        placeholderTextColor={'#464646'}
                        secureTextEntry

                        borderColor = {this.state.border_color_firstName}
                    />

                    <TextInput
                        placeholder="Confirm password"
                        onChangeText = { (confirmPassword) => this.setState({confirmPassword})}
                        style={mss.input}
                        placeholderTextColor={'#464646'}
                        secureTextEntry

                        borderColor = {this.state.border_color_lastName}
                    />  
                </View>

                

                <View style={mss.warning_msg_con}>
                    <Text style={{ color: this.state.text_color }}>{this.state.warning_text}</Text>
                </View>
                
                <View style={mss.next_btn_con}>
                
                    <TouchableOpacity
                        onPress={this.handleAddName}
                        style={mss.btn01}
                    >
                        <Text style={mss.btn01_text}>Next</Text>
                    </TouchableOpacity>
                </View>
                
            </View>
        </View>
        )
    }
}

export default RegScreen04
