//import liraries
import React, { Component } from 'react';
import { View, Text, StyleSheet,FlatList,AsyncStorage,Alert,Button,TouchableOpacity,ScrollView } from 'react-native';
import FAB from 'react-native-fab'
import MapView, { AnimatedRegion,Circle, Animated,Marker } from 'react-native-maps';
import st from './json/st';
//import FusedLocation from 'react-native-fused-location';
import Carousel from 'react-native-carousel';
import circleToPolygon from 'circle-to-polygon';
import Icon from 'react-native-vector-icons/FontAwesome';
import axios from 'react-native-axios';
import Spinner from 'react-native-spinkit';
import PopupDialog, { SlideAnimation,DialogTitle,DialogButton } from 'react-native-popup-dialog';

  
// create a component
class locations extends Component {

static navigationOptions = {
    title:"Locations",
    drawerLockMode: 'locked-closed',
    headerTitleStyle:{
        fontWeight:'400'
    }

}

constructor(){
    super()
    this.popupAnimation = new SlideAnimation({ slideFrom: "bottom" });
    
    this.state={
        index:0,
        data:[{name:'Loading.',value:'Loading..'}],
        visible: false,
        isVisible:false,
        markers:[{
           latitude: 0, longitude:0, description:'This is my address'
        },
    ],

    locStore:[],
    coords:{
    latitude:31.497420,
    longitude:74.360123,
    },


        region : {
            latitude:31.497420,
            longitude:74.360123,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
        }
    }
}

  _showDialog = () => this.setState({ visble: true });
  _hideDialog = () => this.setState({ visble: false });

componentDidMount(){

    navigator.geolocation.getCurrentPosition(
          
        (position) => {

            console.log(position)

        },
          (error) => console.log(error.message),
         {enableHighAccuracy: false, timeout: 20000, accuracy:1000, maximumAge:20000}  
       
    );

    let point ={
        lat : this.state.coords.latitude,
        lng : this.state.coords.longitude
    }

    const coordinates = [point.lat, point.lng]; //[lon, lat]
    const radius = 1000;                           
    const numberOfEdges = 50;  

let wholearea = circleToPolygon(coordinates, radius, numberOfEdges);
let finalarea = wholearea.coordinates[0]
//console.log(finalarea)
let star=[]
const polygon = [
    { lat: 3.1336599385978805, lng: 101.31866455078125 },
    { lat: 3.3091633559540123, lng: 101.66198730468757 },
    { lat: 3.091150714460597,  lng: 101.92977905273438 },
    { lat: 3.1336599385978805, lng: 101.31866455078125 } // last point has to be same as first point
  ];

  let point2 = {
    lat: 3.3091633559540123,
    lng: 101.66198730468757
  };
  


for(var i = 0; i < finalarea.length; i++){
    for(var j = 0; j < finalarea[i].length; j++){

        //console.log(finalarea[i][1]);
        
    }
    //console.log('lat:'+finalarea[i][1]+','+'lng:'+finalarea[i][0])
    //console.log(Math.floor(Math.random() * (1000 - 100 + 1)) + 100)
    star.push({lat:finalarea[i][1],lng:finalarea[i][0]});

}

    //alert(calcCrow(31.486053, 74.372513,31.214833, 74.041328).toFixed(5));

}


async componentWillMount(){

    /*FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
 
    // Get location once.
    const location = await FusedLocation.getFusedLocation();
    console.log(location)
    this.setState({region:{
        latitude:location.latitude,
        longitude:location.longitude,
        latitudeDelta:0.0400,
        longitudeDelta:0.0400
    }})
    this.setState({coords:{
        latitude:location.latitude,
        longitude:location.longitude
    }})*/



    this.setState({isVisible:true})
    var email =await AsyncStorage.getItem('email')
    var thisemail = JSON.parse(email)
    var mylat = this.state.coords.latitude
    var mylng = this.state.coords.longitude

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
    //console.log(this.state.markers)
    axios.get('https://dev99.net/tracking/index.php/api/users')
    
  .then((response)=>{
    console.log(response.data);
    var mark = []
    var Mew = []
    var insiders = []
    for (let i = 0; i < response.data.users.length; i++) {
        if(response.data.users[i].email != thisemail)
        {
            mark.push(JSON.parse(response.data.users[i].address))
        }
        else {
            console.log('ops')
        }
        
    }
    console.log(mark)
    for (let i = 0; i < mark.length; i++) {
        
        Mew.push({latitude: (parseFloat(mark[i].latitude)),longitude: (parseFloat(mark[i].longitude)), description:'This is my address'})
        
    }
    this.setState({markers:Mew})
    this.setState({isVisible:false})


for (let i = 0; i < mark.length; i++) {
    var distance = calcCrow(mylat, mylng,parseFloat(mark[i].latitude), parseFloat(mark[i].longitude)).toFixed(5);
    if (distance <= 1){
        insiders.push({name: response.data.users[i].name, phone: response.data.users[i].phone, id: response.data.users[i].id, notified:false, })
    }
    else {
    console.log('not inside')
    }
}

this.setState({count:insiders.length,data:insiders})
if (insiders.length>0) {
    this.popupDialog.show()

}
    
    console.log(insiders)
    
  })
  .catch((error) =>{
    console.log(error);
  });
    

    
}


    
 async sendNotification(props){
let array = this.state.data

var objIndex = array.findIndex((obj => obj.id === props));
array[objIndex].notified = true

this.setState({data:array})

    console.log(this.state.data)
    this.setState(prevState => ({index: prevState.index + 1}));
    console.log(array)
    console.log(props)
}


    render() {
        return (
            <View style={styles.container}>
           <View style={{width:'100%',height:'100%',backgroundColor:"#222"}}>
           <MapView
           showsUserLocation
           showsCompass={false}
           customMapStyle={st}
           style={styles.map}
      region={this.state.region}
      //onRegionChange={this.onRegionChange}
>


{this.state.markers.map((marker,i) => (
    <Marker
      key={i}
      coordinate={marker}
      image={require('./images/mapin.png')}
      title={marker.description}
    />
  ))}

<Circle
    center={this.state.coords}
    radius={1000}
    lineJoin="bevel"                
    fillColor="rgba(0,51,102,0.2)"
    /></MapView>



<View>
<PopupDialog
width={300}
overlayOpacity={0.0}
    ref={(popupDialog) => { this.popupDialog = popupDialog; }}
    dialogTitle={<DialogTitle titleStyle={{backgroundColor:'#13315c'}} titleTextStyle={{color:'white',fontWeight:'bold'}} title="We Found Some Nearby Friends" />}
    dialogStyle={{backgroundColor:'#edf2f4'}}
    //dialogAnimation={this.popupAnimation}
>
<View style={{flexDirection:'column'}}>
    <View style={{top:10}}>
      <Text style={{alignSelf:'center'}}>Would you like to send them notification now</Text>
            <Text style={{alignSelf:'center'}}>We found {this.state.count} near you..</Text>
          
          <View style={{top:10,alignItems:'center'}}>
          <FlatList
                showsHorizontalScrollIndicator={false}
                extraData={this.state.index}
            horizontal={true}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.data}
            renderItem={({item}) => (
                <TouchableOpacity activeOpacity={0.9} onPress={()=>this.sendNotification(item.id)} style={{alignItems:'center'}}>
                <View style={{borderRadius:2,width:120,height:80,backgroundColor:'#0E79B2',alignItems:'center',marginHorizontal:4,justifyContent:'center'}}>
                <Text style={{color:'white'}}>{item.name}</Text>
            

            <Icon name="check" color={item.notified ? '#00E640' : '#fff'}  size={22}/>

            </View>
            </TouchableOpacity>

      )}/>
       </View>  
       
       



    </View>

    
    <TouchableOpacity activeOpacity={0.8} onPress={()=>this.popupDialog.dismiss()} style={{top:30,backgroundColor:'#2ECC71',alignSelf:'center',borderRadius:5,width:'75%',height:45,alignItems:'center',justifyContent:'center'}}>
                <Text style={{fontWeight:"700",fontSize:16,color:'#eee'}}>Done</Text>
            </TouchableOpacity>
            
            </View>
  </PopupDialog>

</View>


<View style={{alignSelf:'center',top:5,marginHorizontal:10}}>
 <Spinner  isVisible={this.state.isVisible} size={40} type={'Wave'} color="#d63031"/>
 </View>
           </View>   
           <View style={{position:'absolute',bottom:7,right:0}}>
            <FAB buttonColor="#40c4ff" iconTextColor="#FFFFFF" onClickAction={()=>this.popupDialog.show()} visible={true} iconTextComponent={<Icon name="map-marker"/>} />
            </View>
             </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        
        backgroundColor: 'white',
    },
    co:{
       
            width: 375,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'white',
            borderColor:'black',
            borderWidth:2,
          
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
export default locations;
