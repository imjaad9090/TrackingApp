//import liraries
import React, { Component } from 'react';
import { View, StyleSheet,Image,Text,TouchableOpacity,Button,StatusBar,Linking,TouchableHighlight,AsyncStorage,Alert,AppState,PermissionsAndroid } from 'react-native';
import Icon from 'react-native-vector-icons/Feather';
import { Container, Header, Content, Card, CardItem, Thumbnail, Left, Body, Right } from 'native-base';
import IconBadge from 'react-native-icon-badge';
import Contacts from 'react-native-contacts';
import Ripple from 'react-native-material-ripple';
import FCM, {presentLocalNotification} from "react-native-fcm";
import {FCMEvent} from 'react-native-fcm';
import FusedLocation,{getFusedLocation} from 'react-native-fused-location';
import BackgroundGeolocation from 'react-native-mauron85-background-geolocation';
import BackgroundTask from 'react-native-background-task'
import queueFactory from 'react-native-queue';import axios from 'react-native-axios';
import Permissions from 'react-native-permissions'
import LocationServicesDialogBox from "react-native-android-location-services-dialog-box";
function calcCrow(lat1, lon1, lat2, lon2) 
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }  


    

    BackgroundTask.define(async () => {
  
        // Init queue
        axios({
          method: 'put',
          url: 'https://trackingapp-2fd66.firebaseio.com/Locations/coords/2.json',
          data: {
            latitude: JSON.stringify(new Date()),
          }
        });
        // Register job worker
        // Run queue for at most 25 seconds.
      
        // finish() must be called before OS hits timeout.
        BackgroundTask.finish();
      
      });

// create a component
class home extends Component {
    static navigationOptions =({navigation})=> ({
        title:'Custodian',
        headerMode:'float',
        
        headerStyle:{
            //elevation:0,
        backgroundColor: 'white',
        padding:10

        },
        headerTitleStyle: { textAlign:"center",alignSelf:"center",fontWeight:'400'},
        headerLeft: (
        <View><Icon name="menu" size={26} color="#0F3057" onPress={()=>navigation.navigate('DrawerOpen')}/></View>

    ),

        headerRight:(
             <View style={{flexDirection:'row',paddingHorizontal:8}}><Icon style={{marginHorizontal:5}} name="users" size={26} color="#0F3057" onPress={()=>navigation.navigate('Profile')} /></View>

      )
});

constructor(){
    super()
    this.state={
        latitude:31.50144,
        longitude:74.3655,  
        famcount:null,
        fricount:null,
        common:null
    }
}
    
 async componentWillMount(){
    var id =  await AsyncStorage.getItem('MyID')
       
    
    this.setState({myid:id})
    FCM.on(FCMEvent.Notification, async (notif) => {
        console.log(notif);
        
        FCM.presentLocalNotification({
          vibrate: 800,
          title:notif.fcm.title,
          body: notif.fcm.body,
          big_text: 'Details',
          priority: "high",
          sound:"default",
          large_icon: "ic_notif",
          lights:true,
          show_in_foreground: true,
        });
    
      });
      
      
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



     checkStatus(){
    
    FusedLocation.getFusedLocation().then((location)=>{

        var lats = location.latitude
      var long = location.longitude

        if (lats != null && long != null){
            axios({
                method: 'put',
                url: 'https://trackingapp-2fd66.firebaseio.com/Flocks/'+ this.state.myid +'/location.json',
                data: {
                  latitude: lats,
                  longitude: long,
                  latitudeDelta : 0.0922,
                  longitudeDelta : 0.0421
                }
              });
        }
    }
).catch((error)=>{
    console.log(error)
})
      //console.log(location)
      



    axios.get('https://trackingapp-2fd66.firebaseio.com/Flocks.json').then(response=>{
        console.log(response)
            var result = Object.values(response.data)

        var lcoationStore=[]
        for(let i=0;i<result.length;i++){
            if(result[i].custodianID != this.state.myid)
        {
            lcoationStore.push({latitude:result[i].location.latitude,longitude:result[i].location.longitude,name:result[i].name})
        }
        }
        console.log(lcoationStore)
        
        var nearby=[]
        for (let i = 0; i < lcoationStore.length; i++) {
            var distance = calcCrow(31.501502, 74.3657,parseFloat(lcoationStore[i].latitude), parseFloat(lcoationStore[i].longitude)).toFixed(5);
            if (distance <= 1){
                nearby.push(lcoationStore[i].name)
            }
            else {
            console.log('no one is nearby')
            }
        }



        this.setState({data:(nearby.join(' and '))})

        


       

    })
    if(this.state.data != null ){
        FCM.presentLocalNotification({
            body: this.state.data+" are around.",
            priority: "high",
            title: "Custodian",
            sound: "default", 
            "large_icon": "ic_notif",// Android only
            icon: "ic_notif",
            "show_in_foreground" :true, /* notification when app is in foreground (local & remote)*/
            vibrate: 200, /* Android only default: 300, no vibration if you pass null*/
            "lights": true, // Android only, LED blinking (default false)
        });
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
    //StatusBar.setHidden(true);
 
    BackgroundTask.schedule(); // Schedule the task to run every ~15 min if app is closed.

    FusedLocation.setLocationPriority(FusedLocation.Constants.BALANCED)
    FusedLocation.startLocationUpdates();
       

    setTimeout(() => { 
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
    });

}, 4000)

    

    this.interval = setInterval(() => {
        this.checkStatus()
}, 180000);



    BackgroundGeolocation.configure({
        desiredAccuracy: 10,
        stationaryRadius: 50,
        distanceFilter: 50,
        notificationTitle: 'Custodian',
        notificationText: 'enabled',
        debug: false,
        startOnBoot: false,
        stopOnTerminate: false,
        locationProvider: BackgroundGeolocation.ACTIVITY_PROVIDER,
        interval: 34000,
        fastestInterval: 1000,
        activitiesInterval: 1000,
        stopOnStillActivity: false,
        url: 'https://trackingapp-2fd66.firebaseio.com/Locations/coords/0.json',
        httpHeaders: {
          'Content-Type': 'application/json'
        },
        // customize post properties
        postTemplate: {
          latitude: '@latitude',
          longitude: '@longitude',
        }
      });



      BackgroundGeolocation.on('location', (location) => {
        console.log("Background mode on")
        
        console.log(location)
      // handle your locations here
      // to perform long running operation on iOS
      // you need to create background task
      BackgroundGeolocation.startTask(taskKey => {
         //6 seconds
    




       
        // execute long running task
        // eg. ajax post location
        // IMPORTANT: task has to be ended by endTask       
         BackgroundGeolocation.endTask(taskKey);

      });
    }); 

    BackgroundGeolocation.on('stationary', (stationaryLocation) => {
      // handle stationary locations here
      //Actions.sendLocation(stationaryLocation);
      console.log('[INFO] App in the stationary mode.')
    });

    BackgroundGeolocation.on('error', (error) => {
      console.log('[ERROR] BackgroundGeolocation error:', error);
      
    });

    BackgroundGeolocation.on('start', () => {
      console.log('[INFO] BackgroundGeolocation service has been started');
     
      
    });

    BackgroundGeolocation.on('stop', () => {
      console.log('[INFO] BackgroundGeolocation service has been stopped');

    });

    BackgroundGeolocation.on('authorization', (status) => {
      console.log('[INFO] BackgroundGeolocation authorization status: ' + status);
      if (status !== BackgroundGeolocation.AUTHORIZED) {
        Alert.alert('Location services are disabled', 'Would you like to open location settings?', [
          { text: 'Yes', onPress: () => BackgroundGeolocation.showLocationSettings() },
          { text: 'No', onPress: () => console.log('No Pressed'), style: 'cancel' }
        ]);
      }
    });

    BackgroundGeolocation.on('background', () => {
      console.log('[INFO] App is in background');
      
      //this.showN()
      //this.sendCoords()

    });

    BackgroundGeolocation.on('foreground', () => {
      console.log('[INFO] App is in foreground');
    });

    BackgroundGeolocation.checkStatus(status => {
      console.log('[INFO] BackgroundGeolocation service is running', status.isRunning);
      console.log('[INFO] BackgroundGeolocation service has permissions', status.hasPermissions);
      console.log('[INFO] BackgroundGeolocation auth status: ' + status.authorization);

      // you don't need to check status before start (this is just the example)
      if (!status.isRunning) {
        console.log('all good')
         //triggers start on start event
      }
    });



    console.log('ran upto bg')







    FCM.getFCMToken().then(function(token){
        
        AsyncStorage.setItem('myToken',token)                       
        console.log('token stored,and its : '+ token)

    });

    console.log('ran upto fcm')

    {/*const uniqueId = DeviceInfo.getUniqueID();
    //console.log(uniqueId)
    await AsyncStorage.setItem('DeviceID',uniqueId) 
    console.log('successfuly stored device id')*/}      
        Contacts.getAll((err, contacts) => {



            if(err === 'denied'){
                alert('allow contacts ?')
                console.log('could not get contacts')

            } else {
                //console.log(contacts)
                //console.log(contacts.length)
                AsyncStorage.setItem('store',JSON.stringify(contacts))
                //Alert.alert('stored')
              // contacts returned in []
}



          })
          console.log(' get contacts!!!')

    }

    logout(){
        AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
    console.log('logged out')
    }
    
    getnotif(){
        
             /* Create local notification for showing in a foreground */
                FCM.presentLocalNotification({
                   body: "Track your watchlist",
                   priority: "high",
                   title: "Custodian",
                   sound: "default", 
                   "large_icon": "ic_notif",// Android only
                   icon: "ic_notif",
                   "show_in_foreground" :true, /* notification when app is in foreground (local & remote)*/
                   vibrate: 200, /* Android only default: 300, no vibration if you pass null*/
                   "lights": true, // Android only, LED blinking (default false)
               });
           
    }


    render() {
        return (

        <View style={styles.container}>
        <StatusBar
        backgroundColor="#fcfcfc"
        barStyle="dark-content"
            />
         <TouchableOpacity activeOpacity={1.0} style={{backgroundColor:'white',elevation:3,shadowOpacity:0.6}}>
         <Ripple rippleOpacity={0.1} rippleSize={255} rippleSequential={true} onPress={()=>this.props.navigation.navigate('Family')}>

            <IconBadge
          MainElement={
        
          <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:0,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
             source={require('./images/family.png')}/>
            <View style={{marginHorizontal:10,width:'80%'}}>
              <Text>My Family</Text>
              <Text>You can add your family members in this section.</Text>
              </View>
         </View>          

    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:16,fontWeight:"700"}}>{this.state.famcount}</Text>
    }
    IconBadgeStyle={
      {   
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.famcount==0}
    />
</Ripple>
</TouchableOpacity>


<TouchableOpacity activeOpacity={1.0} style={{backgroundColor:'white',elevation:3,shadowOpacity:0.6}} >

<Ripple rippleOpacity={0.1} rippleSize={255} rippleSequential={true} onPress={()=>this.props.navigation.navigate('Close')}>

            <IconBadge
    MainElement={
        <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:0,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
        source={require('./images/teamwork.png')}/>
       <View style={{marginHorizontal:10,width:'80%'}}>
         <Text>Close Friends</Text>
         <Text>You can add close friends in this section.</Text>
         </View>
    </View>
    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:16,fontWeight:"700"}}>{this.state.fricount}</Text>
    }
    IconBadgeStyle={
      {
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.fricount==0}
    />
    </Ripple>


</TouchableOpacity>


<TouchableOpacity  activeOpacity={1.0} style={{backgroundColor:'white',elevation:3,shadowOpacity:0.6}} >
           
<Ripple rippleOpacity={0.1} rippleSize={255} rippleSequential={true} onPress={()=>this.props.navigation.navigate('Friends')}>

            <IconBadge
    MainElement={
        <View style={{flexDirection:'row',height:140,padding:5,alignItems:'center',borderColor:'rgba(0,0,0,0.1)',borderWidth:0,}}><Image style={{left:5,width:50,height:50,resizeMode:'contain'}}
        source={require('./images/friends.png')}/>
       <View style={{marginHorizontal:10,width:'80%'}}>
         <Text>My Friends</Text>
         <Text>You can add other friends in this section.</Text>
         </View>
    </View>
    }
    BadgeElement={
      <Text style={{color:'#eee',fontSize:16,fontWeight:"700"}}>{this.state.common}</Text>
    }
    IconBadgeStyle={
      {
          borderRadius:50,top:5,right:5,width:40,
      height:40,
      backgroundColor: '#005792'}
    }
    Hidden={this.state.common==0}
    />
</Ripple>
</TouchableOpacity>
{/*<Button title="get notification" onPress={()=>this.getnotif()} />*/}
{/*<Button title="Start BG Service" onPress={()=>BackgroundGeolocation.start()} />*/}

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




/*AppState.addEventListener('change', state => {
    if (state === 'active') {
        console.log('active')
    } else if (state === 'background') {
        //console.log('background')
    
    } else if (state === 'inactive') {
        console.log('inactive')
    }
  });*/