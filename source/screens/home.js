//import liraries
import React, { Component } from 'react';
import { View, StyleSheet,Image,Text,TouchableOpacity,Button,StatusBar,TouchableHighlight,AsyncStorage,Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Header, Content, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import IconBadge from 'react-native-icon-badge';
import Contacts from 'react-native-contacts';
import DeviceInfo from 'react-native-device-info';

import FCM, { FCMEvent } from "react-native-fcm";
// create a component
class home extends Component {
    static navigationOptions =({navigation})=> ({
        title:'Friends App',
        headerStyle:{
            elevation:0,
        backgroundColor: 'white',
 padding:10

        },
        headerTitleStyle: { textAlign:"center",alignSelf:"center"},
        headerLeft: (
        <View><Icon name="menu" size={26} color="#0F3057" onPress={()=>navigation.navigate('DrawerOpen')}/></View>

    ),

        headerRight:(
             <View style={{flexDirection:'row',paddingHorizontal:5}}><Icon name="compass"  style={{marginHorizontal:5}} size={26} color="#0F3057" onPress={()=>navigation.navigate('Locations')} /><Icon style={{marginHorizontal:5}} name="user" size={26} color="#0F3057" onPress={()=>navigation.navigate('Profile')} /></View>

      )
});

constructor(){
    super()
    this.state={
        famcount:null,
        fricount:null,
        common:null
    }
}
    
 componentWillMount(){
    
       
    //this.timer = setInterval(()=> this.getfamcount(), 1000)
    //this.timer = setInterval(()=> this.getclosecount(), 1000)
    //this.timer = setInterval(()=> this.getfriendscount(), 1000)
    


    this.getfamcount()
    this.getfriendscount()
    this.getclosecount()
}

async getfriendscount(){
var fri = await AsyncStorage.getItem('closefriends')
if(fri != null){
    var semi = (JSON.parse(fri))
    console.log(semi.length)
    var length = (semi.length)
    console.log(length)
    this.setState({fricount: length})

}
else {
    this.setState({fricount:0})
}
}




async getclosecount(){
    var fri = await AsyncStorage.getItem('friends')
    if(fri != null){
        var semi = (JSON.parse(fri))
        console.log(semi.length)
        var length = (semi.length)
        console.log(length)
        this.setState({common: length})
    
    }
    else {
        this.setState({common:0})
    }
    }

     async getfamcount(){
        var fam = await AsyncStorage.getItem('family')
        if(fam != null){
        var semi = (JSON.parse(fam))
        console.log(semi.length)
        var length = (semi.length)
        console.log(length)
        this.setState({famcount: length})

        }
            else {
                    this.setState({famcount:0})

                    }
                        }


    async contacts(){
        const result= await AsyncStorage.getItem('store')
      var newR = JSON.parse(result)
      console.log(newR)
      Alert.alert('done')


    }

   async componentDidMount(){

    FCM.getFCMToken().then(function(token){
        AsyncStorage.setItem('myToken',token)
        console.log('token stored')

    });


    StatusBar.setHidden(true);
    const uniqueId = DeviceInfo.getUniqueID();
    //console.log(uniqueId)
    await AsyncStorage.setItem('DeviceID',uniqueId) 
    console.log('successfuly stored device id')      
        Contacts.getAll((err, contacts) => {
            if(err === 'denied'){
              // error
            } else {
                //console.log(contacts)
                //console.log(contacts.length)
                AsyncStorage.setItem('store',JSON.stringify(contacts))
                //Alert.alert('stored')
              // contacts returned in []
            }
          })
    }

    logout(){
        AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
    console.log('logged out')
    }
    
    render() {
        return (

        <View style={styles.container}>
        
         <TouchableOpacity style={{backgroundColor:'white',shadowOffset: { width: 10, height: 10 },
          shadowOpacity: 1,
          shadowRadius: 5,shadowColor:'#000'}} onPress={()=>this.props.navigation.navigate('Family')}>

            <IconBadge
          MainElement={
        
          <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:2,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
             source={require('./images/family.png')}/>
            <View style={{marginHorizontal:10,width:'80%'}}>
              <Text>My Family</Text>
              <Text>You can add your family members in this section.</Text>
              </View>
         </View>          

    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:15,fontWeight:"700"}}>{this.state.famcount}</Text>
    }
    IconBadgeStyle={
      {   
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.famcount==0}
    />

</TouchableOpacity>



<TouchableOpacity  style={{backgroundColor:'white'}} onPress={()=>this.props.navigation.navigate('Close')}>


            <IconBadge
    MainElement={
        <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:2,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
        source={require('./images/teamwork.png')}/>
       <View style={{marginHorizontal:10,width:'80%'}}>
         <Text>Close Friends</Text>
         <Text>You can add close friends in this section.</Text>
         </View>
    </View>
    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:15,fontWeight:"700"}}>{this.state.fricount}</Text>
    }
    IconBadgeStyle={
      {
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.fricount==0}
    />

</TouchableOpacity>



<TouchableOpacity style={{backgroundColor:'white'}} onPress={()=>this.props.navigation.navigate('Friends')}>
            <IconBadge
    MainElement={
        <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:2,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
        source={require('./images/friends.png')}/>
       <View style={{marginHorizontal:10,width:'80%'}}>
         <Text>My Friends</Text>
         <Text>You can add other friends in this section.</Text>
         </View>
    </View>
    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:15,fontWeight:"700"}}>{this.state.common}</Text>
    }
    IconBadgeStyle={
      {
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.common==0}
    />

</TouchableOpacity>

</View>        

        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding:10,
        justifyContent:"space-around",
        backgroundColor: '#fff',
    },
});

//make this component available to the app
export default home;
