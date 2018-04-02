/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native'
import { SwitchNavigator } from "react-navigation";
import { StackNavigator,DrawerNavigator } from "react-navigation";
import auth from './screens/auth';
import home from './screens/home';
import family from './screens/family';
import friends from './screens/friends';
import closefriends from './screens/closefriends';
import profile from './screens/profile';
import sidebar from './screens/sidebar';
import locations from './screens/locations';
import login from './screens/login';
import register from './screens/register';
import maptest from './screens/maptest';




 const Stack1 = StackNavigator({
  Home : {screen : home},
  Family: {screen : family},
  Friends: {screen : friends},
  Close : {screen : closefriends},
  Profile : {screen : profile},
  Locations : {screen : locations},
  Side : {screen : sidebar},
  Map : {screen : maptest},

},{
  initialRouteName:'Home'
})


 const AppStack = DrawerNavigator({
  Main : 
  {
      screen : Stack1,
  navigationOptions : {
      drawer:  {
          label : 'Main'
      }
  }
}
},{
  contentComponent:sidebar
})

const Go = StackNavigator({
  here :{screen : AppStack}
})



 const AuthStack = StackNavigator({
  Login : {screen : login},
  Register : {screen : register},
})


const App = SwitchNavigator(
  {
    AuthLoading: auth,
    App: AppStack,
    Auth: AuthStack,
  },
  {
    initialRouteName: 'AuthLoading',
  }
);


export default App;