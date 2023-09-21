import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator, Image, ScrollView} from 'react-native'
import React from 'react';
import * as backend  from "backend/firebase";
import { Ionicons } from '@expo/vector-icons';

var mss = require('../styleSheets/master_style_sheet');

export default class ForgotPasswordScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        
        
        return {
            title: 'Forgot password',
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
        this.props.navigation.replace("Login")
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
          email: '',
        }
    }

    forgotPasswordEvent = () => {

 
        backend.passwordReset(this.state.email).then((result) => {
            if (result) {
                this.props.navigation.replace("Login")
            }
        })


        
    }

    render () {
        return (
            <View style={styles.main_con} >
                <View style={styles.text01_con} >
                    <Text style={styles.text01} >Enter your email address and we'll send you a link to get back into your account. </Text>
                </View>


                <View style={styles.input_con} >
                    <TextInput
                        onChangeText = { (email) => this.setState({email})}
                        style={mss.input}
                        placeholderTextColor={'#737373'}
                        placeholder = "Email"
                        //borderColor = {this.state.border_color}

                    />
                </View>

                <View style={styles.btns_con}>
                    <TouchableOpacity
                        onPress={() => {this.forgotPasswordEvent()}}
                        style={mss.btn01}
                    >   
                        <Text style={mss.btn01_text}>Reset password</Text>
                       
                    </TouchableOpacity>
                </View>
            </View>
            
        )
    }


}


const styles = StyleSheet.create({
    main_con: {

        alignItems: 'center',
        backgroundColor: '#fefefe',
        flex: 1,
    },

    btns_con: {
        marginTop: 35,
        width: '90%',
        marginRight: 15,
        marginLeft: 15,
    },

    input_con: {
        marginTop: 15,

        width: '90%',
        marginRight: 15,
        marginLeft: 15,

    },

    text01_con: {
        marginTop: 50,
        width: '90%',

    },

    text01: {
        color: 'black',
        fontWeight: '300',
        fontSize: 15,
        fontFamily: Platform.OS === 'ios' ? "Helvetica Neue" : 'normal',
    }

})
