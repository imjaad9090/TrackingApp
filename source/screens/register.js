//import liraries
import React, { Component } from 'react';
import { View,Text,Keyboard,TouchableWithoutFeedback,StyleSheet,ScrollView,Button,TouchableOpacity,KeyboardAvoidingView,TextInput,Image,ImageBackground,StatusBar,Alert,AsyncStorage } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'react-native-axios';
import firebase from 'react-native-firebase';
import FusedLocation from 'react-native-fused-location';
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";

// create a component
class register extends React.Component {
    static navigationOptions = {
        header:null,
        drawerLockMode: 'locked-closed',

    }

    constructor(){
        super()
        this.state={
            email:'',
            password:'',
            username:'',
            latitude:31.501229,
            longitude:74.3656
            
        }
    }

    async componentWillMount(){
        LocationServicesDialogBox.checkLocationServicesIsEnabled({
            message: "<p>To continue, turn on device location, which uses Google's location service</p>",
            ok: "YES",
            cancel: "NO",
            enableHighAccuracy: true, // true => GPS AND NETWORK PROVIDER, false => GPS OR NETWORK PROVIDER
            showDialog: true, // false => Opens the Location access page directly
            openLocationServices: true, // false => Directly catch method is called if location services are turned off
            preventOutSideTouch: false, // true => To prevent the location services window from closing when it is clicked outside
            preventBackClick: false, // true => To prevent the location services popup from closing when it is clicked back button
            providerListener: false // true ==> Trigger locationProviderStatusChange listener when the location state changes
        }).then(function(success) {
            console.log(success); // success => {alreadyEnabled: false, enabled: true, status: "enabled"}
        }).catch((error) => {
            console.log(error.message); // error.message => "disabled"
        });       FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
 
    // Get location once.
    const location = await FusedLocation.getFusedLocation();
    this.setState({latitude:(location.latitude),longitude:(location.longitude)})
        console.log(this.state)
    
    }
        
 
    register(){
        const { navigate,pop } = this.props.navigation;

        var db = firebase.database().ref();

        const { email, password,username } = this.state;


        if(email != '' && password.length >=6 && username != '')
        {
            firebase.auth().createUserWithEmailAndPassword(email, password)
        .then(() => {
            console.log(this.state.latitude,this.state.longitude)
            var user = firebase.auth().currentUser;
            var CustID =  'C'+Math.floor((Math.random() * 1000000000) + 100)
             AsyncStorage.setItem('MyID', CustID);
        console.log('successfuly created new child')
    firebase.database().ref().child('Flocks').child(CustID).set({
    email: email,
    watching: 0,
    userid: user.uid,
    custodianID: CustID,
    name: username,
    image:"https://firebasestorage.googleapis.com/v0/b/trackingapp-2fd66.appspot.com/o/sheep.png?alt=media&token=6af127ed-5344-46fa-b6e2-d5816c453731",
    online: false,
    location:{latitude:this.state.latitude,longitude:this.state.longitude,latitudeDelta:0.0922,longitudeDelta:0.0421},
    watchlist:0
}).then(async function() {

    var user = firebase.auth().currentUser;
    firebase.database().ref().child('Unique_Ids/'+user.uid).set({
        custid:CustID
    })

    await AsyncStorage.setItem('userToken', 'LoggedIn');
    navigate('App');
})
        {/*db.child('Users').push({
            email: this.state.email,
            uid: user.uid,
            name: this.state.username,
            role: this.state.role
        })
        db.child('Profile').push({
            email: this.state.email,
            uid: user.uid,
            name: this.state.username,
            role: this.state.role,
            image:" "
        })*/}



          
 }).catch(function(error) {

    var showErr = JSON.stringify(error.message)
    Alert.alert('Ohh Snapp..',showErr)

});

}
else {
    alert('One of the fields are empty or password is less than 6 characters')
}
        
    }
     componentDidMount(){
        //StatusBar.setHidden(true);

        
     }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding">
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground source={require('./images/space.jpg')}  style={styles.bgImage}>
           
           
            <Text style={{alignSelf:'center',marginVertical:20,color:'white',fontWeight:'500',letterSpacing:3,fontSize:40}}>Custodian</Text>

            <TextInput
                style={styles.input}
                selectionColor={'#3d1767'}
                onChangeText={(username) => this.setState({username})}
                multiline={false}
                placeholder="Username"
                autoCapitalize="words"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={(event) => { 
                    this.refs.go.focus(); 
                  }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bdc3c7"

              />
           
           
           
           
           <TextInput
                style={styles.input}
                selectionColor={'#3d1767'}
                ref="go"
                onChangeText={(email) => this.setState({email})}
                multiline={false}
                placeholder="Email"
                autoCapitalize="none"
                keyboardType="email-address"
                autoCorrect={false}
                returnKeyType="next"
                onSubmitEditing={(event) => { 
                    this.refs.SecondInput.focus(); 
                  }}
                underlineColorAndroid="transparent"
                placeholderTextColor="#bdc3c7"

              />


                  

              <TextInput
        style={styles.input}
        selectionColor={'#3d1767'}
        ref='SecondInput'
        onChangeText={(password) => this.setState({password})}
        multiline={false}
        placeholder="Password"
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
        underlineColorAndroid="transparent"
        placeholderTextColor="#bdc3c7"

/>

            <TouchableOpacity activeOpacity={1.0} onPress={()=>this.register()} style={{backgroundColor:'white',borderRadius:19,width:'75%',height:40,alignItems:'center',justifyContent:'center',marginVertical:10,borderWidth:2,borderColor:'rgba(0, 22, 0, 0.5)'}}>
                <Text style={{fontWeight:"700",fontSize:15,includeFontPadding:true,color:'#2c3e50'}}>REGISTER</Text>
            </TouchableOpacity>

<TouchableOpacity activeOpacity={1.0} onPress={()=>this.props.navigation.pop()} style={{backgroundColor:'white',borderRadius:19,width:'75%',height:40,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'rgba(0, 22, 0, 0.5)'}}>
                <Text style={{fontWeight:"700",fontSize:15,includeFontPadding:true,color:'#2c3e50'}}>LOGIN</Text>
            </TouchableOpacity>
            
              </ImageBackground>
              </TouchableWithoutFeedback>
          </KeyboardAvoidingView>

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
    justifyContent:'center',
    paddingLeft: 15,
    paddingRight: 15
    },
    input: {
        marginVertical:5,
        height: 40,
        padding:8,
        borderWidth:2,
        borderColor:'rgba(0, 22, 0, 0.5)',
        borderRadius: 6,
        width:'75%',
        backgroundColor:'white',
        fontSize: 16,
        //color: "#2c3e50"
      },

      bgImage:{
          width:'100%',
          height:'100%',
          justifyContent:'center',
          alignItems:'center'
      }
});

//make this component available to the app
export default register;


/*

axios.post('https://dev99.net/tracking/index.php/api/register',{
                name: this.state.username,
                email: this.state.email,
                password: this.state.password,
                address : JSON.stringify(this.state.address),
                phone: this.state.phone
              })
              .then( async function (response) {
                console.log(response);
                await AsyncStorage.setItem('userToken', 'LoggedIn');
                navigate('App');
                alert('Registered Successfuly')

              })
              .catch(function (error) {
                console.log(error);
                alert('Something went wrong, try again..Make sure the GPS is enabled')
              });
*/

/*
var user = firebase.auth().currentUser;

user.sendEmailVerification().then(async function() {
    console.log('email has been sent')
    await AsyncStorage.setItem('userToken', 'LoggedIn');
    Alert.alert('Verify Email','A verification email has been sent to your inbox, please verify yourself and log in.')
    //navigate('App');
    pop()
      })
console.log(user)
*/