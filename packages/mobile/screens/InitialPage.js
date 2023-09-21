import React from 'react';
import {TouchableOpacity, StyleSheet, Text, TextInput, View, Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as backend  from "backend/firebase";

var mss = require('../styleSheets/master_style_sheet');

export default class InitialPage extends React.Component {
    static navigationOptions = {
        headerShown:false, 
        animationEnabled: false, 
    }

    
    async componentDidMount() {
        const userId = await AsyncStorage.getItem('@userId')
        this.props.navigation.navigate("Login")
        if(userId){
            this.props.navigation.navigate("Home")
        }
        else {
            this.props.navigation.navigate("Login")
        }
    }

    
    render() {
        return (
            <View style={styles.loader}>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    loader: { 
        backgroundColor: '#fefefe',
      }
})