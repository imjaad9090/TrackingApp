import React from 'react';
import { StackNavigator,TabNavigator,DrawerNavigator } from "react-navigation";
import Icon from 'react-native-vector-icons/FontAwesome';
import home from '../home';
import family from '../family';
import friends from '../friends';
import closefriends from '../closefriends';
import profile from '../profile';
import sidebar from '../sidebar';
import locations from '../locations';
import login from '../login';
import register from '../register';


export const Stack1 = StackNavigator({
    Home : {screen : home},
    Family: {screen : family},
    Friends: {screen : friends},
    Close : {screen : closefriends},
    Profile : {screen : profile},
    Locations : {screen : locations},

},{
    initialRouteName:'Home'
})


export const AppStack = DrawerNavigator({
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


export const AuthStack = StackNavigator({
    Login : {screen : login},
    Register : {screen : register},
})