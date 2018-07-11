//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,WebView,StatusBar} from 'react-native';

// create a component
class web extends Component {
    static navigationOptions ={
        header:null
    }
    render() {
        return (
            

            <WebView source={{uri:'https://www.apple.com'}}/>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#2c3e50',
    },
});

//make this component available to the app
export default web;
