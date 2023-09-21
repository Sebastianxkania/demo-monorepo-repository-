import {TouchableOpacity, StyleSheet, Text, TextInput, View, Image } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

var mss = require('../../styleSheets/master_style_sheet');


export class RegScreen03 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: this.props.navigation.getParam('userName', 'NO-User'),
            email: this.props.navigation.getParam('email', 'NO-Email'),
            firstName: '',
            lastName: '',
            text_color: '#fefefe',
            border_color_firstName: '#cacaca',
            border_color_lastName: '#cacaca',
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
        this.props.navigation.replace("Reg02")
    }

    handleAddName = async () => {

   

            if ((this.state.firstName == '') && (this.state.lastName == '')) {
                this.setState({ warning_text: 'Please enter first name and last name.' })
                this.setState({ border_color_firstName: this.state.warningColour  })
                this.setState({ border_color_lastName: this.state.warningColour  })
                this.setState({ text_color: this.state.warningColour  })
            }
            else if (this.state.firstName == '') {
                this.setState({ warning_text: 'Please enter first name.' })
                this.setState({ border_color_firstName: this.state.warningColour  })
                this.setState({ border_color_lastName: '#cacaca' })
                this.setState({ text_color: this.state.warningColour  })
            }
            else if (this.state.lastName == '') {
                this.setState({ warning_text: 'Please enter last name.' })
                this.setState({ border_color_lastName: this.state.warningColour  })
                this.setState({ border_color_firstName: '#cacaca' })
                this.setState({ text_color: this.state.warningColour  })

            }
            else {
                this.setState({ border_color_firstName: '#cacaca' })
                this.setState({ border_color_lastName: '#cacaca' })
                this.setState({ text_color: '#fefefe' })
                
                this.props.navigation.replace("Reg04", {
                    userName: this.state.username, 
                    email: this.state.email,
                    firstName: this.state.firstName,
                    lastName: this.state.lastName,
                })
            }


            
            
            

      }

    render() {
        return (
            <View style={mss.main_wrapper}>
            <View style={mss.main_con}>

                <View style={mss.header02_con}>
                    <Text style={mss.header02} >Enter your name</Text>
                    <Text style={mss.header03} >Enter your name for your new account. It will be visible to everyone who vists your profile.</Text>
                </View>


                <View style={mss.input_con} >
                    <TextInput
                        placeholder="First name"
                        onChangeText = { (firstName) => this.setState({firstName})}
                        style={mss.input}
                        placeholderTextColor={'#464646'}

                        borderColor = {this.state.border_color_firstName}
                    />

                    <TextInput
                        placeholder="Last name"
                        onChangeText = { (lastName) => this.setState({lastName})}
                        style={mss.input}
                        placeholderTextColor={'#464646'}

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

export default RegScreen03
