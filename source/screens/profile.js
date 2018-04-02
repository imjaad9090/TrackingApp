//import liraries
import React, { Component } from 'react';
import {View, StyleSheet,ScrollView,Image,Text ,AsyncStorage,TouchableOpacity,ActivityIndicator} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { Container, Header, Content, List,Button, Separator,ListItem,H3,H2,Left, Body, Right, Switch } from 'native-base';
const GOOGLE_MAPS_APIKEY = 'AIzaSyBFrgueE02yf3Fh4UHuYzxnaX5LabsNAFg';
import axios from 'react-native-axios';
import FusedLocation from 'react-native-fused-location';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-spinkit';
// create a component
class profile extends Component {

    static navigationOptions = {
        drawerLockMode: 'locked-closed',
        title:'Profile',
        headerStyle:{
            elevation:0,
    
        }
        
    }

    constructor(){
        super()
        this.state={
            lat:null,
            lng:null,
            address:'Fetching...',
            isVisible:true
        }
    }
   async componentDidMount(){
        var fri = await AsyncStorage.getItem('friends')
        if(fri != null){
            var semi = (JSON.parse(fri))
            var length = (semi.length)
            this.setState({common:length})
        
        }
    }

   async componentWillMount(){
    var id = await AsyncStorage.getItem('thisUserId')

       console.log('on mount')
       FusedLocation.setLocationPriority(FusedLocation.Constants.HIGH_ACCURACY);
 
       // Get location once.
       const location = await FusedLocation.getFusedLocation();
       console.log(location)
     

        axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location.latitude + ',' + location.longitude + '&key=' + GOOGLE_MAPS_APIKEY) // be sure your api key is correct and has access to the geocode api
        .then(response => {
        console.log(response);
        var str=response.data.results[2].formatted_address
        
          this.setState({
              address: str // access from response.data.results[0].formatted_address
          })
      
       }).catch((error) => { // catch is called after then
        console.log(error)
         this.setState({ address: 'Cant calculate current address.' })
       });  
       
       axios.post('https://dev99.net/tracking/index.php/api/get_profile', {
        user_id: id
      })
      .then( (response) =>{
        console.log(response.data.name);
        this.setState({name:response.data.name,email:response.data.email,phone:response.data.phone})
    })
      .catch( (error) =>{
        console.log(error);
      });



    }

    getImage(){
        ImagePicker.openPicker({
            width: 300,
            height: 400,
            cropping: true,
            includeBase64: true
          }).then(image => {
            console.log(image);
          });        
    }


    render() {
        return (
            <View style={styles.container}>
            <ScrollView>
            <View style={{backgroundColor:'#0F3057',width:'100%',height:210,padding:10,alignItems:'center',justifyContent:'center'}}>
                
                <TouchableOpacity onPress={()=>this.getImage()}>
                <Image style={{alignSelf:'center',borderRadius:50,width:100,height:100}} source={require('./images/dav.jpg')} />
                </TouchableOpacity>
            <Text style={{color:'white',fontSize:19,marginVertical:5}}>{this.state.name}</Text>

    <View style={{flexDirection:'row',top:10,justifyContent:"space-around",paddingHorizontal:10}}>
    <View style={{alignItems:'center',paddingHorizontal:20,right:10}} >
    <Text style={{fontSize:14,color:'white'}}>Friends</Text>
    <Text  style={{color:'white'}}>{this.state.common}</Text>
    </View>

    <View style={{alignItems:'center',paddingHorizontal:20,left:10}}>
    <Text style={{color:'white',fontSize:14}}>My Places</Text>
    <Text style={{color:'white'}}>42</Text>
    </View>
    </View>

    </View>
    <Content>
        <List style={{marginRight:6,top:14}}>
            <ListItem>

            <Text style={{fontWeight:'bold'}}>Email :   </Text>
              
                <Text>{this.state.email}</Text>
              
            </ListItem>


            <ListItem>
            
              <Text style={{fontWeight:'bold'}}>Location :   </Text>
              
                <Text>{this.state.address}</Text>
              
            </ListItem>


            <ListItem>
            
            <Text style={{fontWeight:'bold'}}>Contact :   </Text>
            
              <Text>{this.state.phone}</Text>
            
          </ListItem>
            </List>
            </Content>
            
            <Button onPress={()=>alert('Pressed')} style={{marginVertical:20,alignSelf:'center',width:'50%',backgroundColor:'#0F3057',justifyContent:'center'}}><Text style={{alignSelf:'center',alignContent:'center',color:'white',fontSize:16,fontWeight:'400'}}>Update</Text></Button>


        </ScrollView>

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
});

//make this component available to the app
export default profile;
