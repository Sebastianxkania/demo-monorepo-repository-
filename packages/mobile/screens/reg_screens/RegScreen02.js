import {TouchableOpacity, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React from 'react';
import * as backend  from "backend/firebase";
import { Ionicons } from '@expo/vector-icons';

var mss = require('../../styleSheets/master_style_sheet');


export class RegScreen02 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.getParam('userName', 'NO-User'),
            email: '',
            text_color: '#fefefe',
            border_color: '#cacaca',
            warning_text: ' ',
            warningColour: '#ed4956'
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

    goBack = () => {
        this.props.navigation.replace("Reg01")
    }

    handleAddUsername = async () => {
        backend.emailExists(this.state.email.toLowerCase())
        .then(result => {
    
          // if Username is taken...
          if (result) { 
            this.setState({ warning_text: 'This email is not available.' })
            this.setState({ border_color: this.state.warningColour })
            this.setState({ text_color: this.state.warningColour })
            
            
            
          } 
          // if Username is not taken...
          else {
            this.setState({ border_color: '#cacaca' })
            this.setState({ text_color: '#fefefe' })

            if (this.state.email == '') {
                this.setState({ warning_text: 'Please enter email.' })
                this.setState({ border_color: this.state.warningColour })
                this.setState({ text_color: this.state.warningColour })
            }
            else {
                this.props.navigation.replace("Reg03", {userName: this.state.username, email: this.state.email})
            }
            
            
          }
        }); 
      }

    render() {
        return (
            <View style={mss.main_wrapper}>
            <View style={mss.main_con}>

                <View style={mss.header02_con}>
                    <Text style={mss.header02} >Enter your email</Text>
                    <Text style={mss.header03} >Choose an email for your new account. You will need it later to log in.</Text>
                </View>


                <View style={mss.input_con} >
                    <TextInput
                        placeholder="Email"
                        onChangeText = { (email) => this.setState({email})}
                        style={mss.input}
                        placeholderTextColor={'#464646'}

                        borderColor = {this.state.border_color}
                    />
                </View>

                <View style={mss.warning_msg_con}>
                    <Text style={{ color: this.state.text_color }}>{this.state.warning_text}</Text>
                </View>
                
                <View style={mss.next_btn_con}>
                
                    <TouchableOpacity
                        onPress={this.handleAddUsername}
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

export default RegScreen02
