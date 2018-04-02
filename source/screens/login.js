//import liraries
import React, { Component } from 'react';
import { View,Text,Keyboard,TouchableWithoutFeedback,AsyncStorage,StyleSheet,ScrollView,Button,TouchableOpacity,KeyboardAvoidingView,TextInput,Image,ImageBackground,StatusBar,Alert } from 'react-native';
import PropTypes from 'prop-types';
import axios from 'react-native-axios';
// create a component
class login extends React.Component {
    static navigationOptions = {
        header:null,
        drawerLockMode: 'locked-closed',

    }
    constructor(){
        super()
        this.state={
            email:'',
            password:''
        }
    }
        
        register(){
            const { navigate } = this.props.navigation;

            axios.post('https://dev99.net/tracking/index.php/api/login', {
                email: this.state.email,
                password: this.state.password,
                
              })
              .then(async function (response) {
                console.log(response);
                var id= response.data.user_id
                var name=response.data.name
                var email= response.data.email
                console.log(id)
                await AsyncStorage.setItem('userToken', 'LoggedIn');
                AsyncStorage.setItem('thisUserId',JSON.stringify(id))
                AsyncStorage.setItem('name',JSON.stringify(name))
                AsyncStorage.setItem('email',JSON.stringify(email))
                navigate('App');

                alert('successfully logged in')

              })
              .catch(function (error) {
                console.log(error);
                alert('Something went wrong, please try again..')
              });

        }
     componentDidMount(){
        StatusBar.setHidden(true);

        
     }

    render() {
        return (
            <KeyboardAvoidingView behavior="padding">
<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <ImageBackground source={require('./images/login2.jpg')}  style={styles.bgImage}>
           <TextInput
                style={styles.input}
                selectionColor={'#3d1767'}

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

            <TouchableOpacity activeOpacity={0.8} onPress={()=>this.register()} style={{backgroundColor:'white',borderRadius:19,width:'75%',height:40,alignItems:'center',justifyContent:'center',marginVertical:10,borderWidth:2,borderColor:'rgba(0, 22, 0, 0.5)'}}>
                <Text style={{fontWeight:"700",fontSize:15,includeFontPadding:true,color:'#2c3e50'}}>LOGIN</Text>
            </TouchableOpacity>

<TouchableOpacity activeOpacity={0.8} onPress={()=>this.props.navigation.navigate('Register')} style={{backgroundColor:'white',borderRadius:19,width:'75%',height:40,alignItems:'center',justifyContent:'center',borderWidth:2,borderColor:'rgba(0, 22, 0, 0.5)'}}>
                <Text style={{fontWeight:"700",fontSize:15,includeFontPadding:true,color:'#2c3e50'}}>REGISTER</Text>
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
export default login;
