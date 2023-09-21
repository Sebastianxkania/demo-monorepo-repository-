import React from 'react';
import { LogBox } from 'react-native';
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import {createBottomTabNavigator } from "react-navigation-tabs";
import * as backend  from "backend/firebase";
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';


LogBox.ignoreAllLogs();
LogBox.ignoreLogs(['Setting a timer']);

// Screens
import LoginScreen from  './screens/LoginScreen'
import HomeScreen from './screens/HomeScreen'
import InitialPage from './screens/InitialPage'
import RegScreen01 from './screens/reg_screens/RegScreen01'
import RegScreen02 from './screens/reg_screens/RegScreen02'
import RegScreen03 from './screens/reg_screens/RegScreen03'
import RegScreen04 from './screens/reg_screens/RegScreen04'
import PostScreen from './screens/PostScreen';
import ProfilePage from './screens/ProfilePage';
import SettingsScreen from './screens/SettingsScreen';
import MessageScreen from './screens/MessageScreen';
import CommentScreen from './screens/CommentScreen';
import ModuleProfileScreen from './screens/ModuleProfileScreen';
import OptionsScreen from './screens/OptionsScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';



const getInitPage = async () => {
  const userId = await AsyncStorage.getItem('@userId')
  console.log(userId)
  if(userId){
      return "Home"
  }
  else {
      return "Login"
  }
}

const getInitPage2 = () => {
  const userId = AsyncStorage.getItem('@userId')
  console.log(userId)
  if(userId){
      return HomeScreen
  }
else {
      return LoginScreen;
  }
}




const InitialStack = createStackNavigator({
  Initial: { screen: InitialPage },
  Home: { screen: HomeScreen },
  Login: { screen: LoginScreen },
  Profile: { screen: ProfilePage },
  ModuleProfile: { screen: ModuleProfileScreen },
  Comment: { screen: CommentScreen },
  ForgotPassword: { screen: ForgotPasswordScreen },
  
  

  Reg01: { screen: RegScreen01 },
  Reg02: { screen: RegScreen02 },
  Reg03: { screen: RegScreen03 },
  Reg04: { screen: RegScreen04 },
});


const ProfileStack = createStackNavigator({
  Profile: { screen: ProfilePage },
  Settings: { screen: SettingsScreen },
  Comment: { screen: CommentScreen },
  Options: { screen: OptionsScreen },  
});


const PostStack = createStackNavigator({
  Post: { screen: PostScreen },
});

InitialStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName

  if (
      routeName == 'Login' || 
      routeName == 'Reg01' || 
      routeName == 'Reg02' || 
      routeName == 'Reg03' || 
      routeName == 'Reg04' ||
      routeName == 'ForgotPassword' 
    
      ) 
  {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}

ProfileStack.navigationOptions = ({ navigation }) => {

  let tabBarVisible = true;
  let routeName = navigation.state.routes[navigation.state.index].routeName

  if (
      routeName == 'Login' || 
      routeName == 'Reg01' || 
      routeName == 'Reg02' || 
      routeName == 'Reg03' || 
      routeName == 'Reg04' 
      ) 
  {
      tabBarVisible = false
  }

  return {
      tabBarVisible,
  }
}

export default createAppContainer(createBottomTabNavigator(
  {
    Home: { screen: InitialStack},
    Post: { screen: PostStack },
    Profile: { screen: ProfileStack },
    
    
  },
  {
    initialRouteName: 'Home',

    defaultNavigationOptions: ({ navigation }) => ({
      screenOptions: {
        tabBarHideOnKeyboard: true
      },
      style: {
        height: 10,
        borderTopWidth: 0,
      },
      tabBarIcon: ({ focused, tintColor }) => {
        const { routeName } = navigation.state;
        let iconName;
        if (routeName === 'Home') {
          iconName = `home${focused ? '' : '-outline'}`;
        } 
        
        else if (routeName === 'Message') {
          iconName = `chatbox-ellipses${focused ? '' : '-outline'}`;
        }
        
        else if (routeName === 'Profile') {
          iconName = `person-circle${focused ? '' : '-outline'}`;
        }
        else if (routeName === 'Post') {
          iconName = `create${focused ? '' : '-outline'}`;
        }

        // You can return any component that you like here! We usually use an
        // icon component from react-native-vector-icons
        return <Ionicons name={iconName} size={25} color={tintColor} />;
      }
    }),
    tabBarOptions: {
        keyboardHidesTabBar: true,
        activeTintColor: 'black',
        inactiveTintColor: 'gray',

        style: {
            backgroundColor: '#fafafa',
            height: 43,
            borderTopWidth: 1,
            borderTopColor: '#fefefe',
            paddingTop: 10,
        },

        labelStyle: {
            position: 'absolute',
            top: 30,
            fontSize: 12,
        },

        iconStyle: {
            marginTop: 10,
        },
    },
    
  }
));






