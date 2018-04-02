//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView from 'react-native-maps';
// create a component
class maptest extends Component {

    constructor(){
        super()
        this.state={
            region: {
                latitude: 37.78825,
                longitude: -122.4324,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              },
        }
    }

    render() {
        return (
            <View style={styles.container}>
        <MapView
        style={styles.map}
      region={this.state.region}
    />            
    </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: '#2c3e50',
    },
    map:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0
    }
});

//make this component available to the app
export default maptest;
