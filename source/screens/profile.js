//import liraries
import React, { Component } from 'react';
import {View, StyleSheet,ScrollView,Image,Text,FlatList,Platform,AsyncStorage,KeyboardAvoidingView,TouchableOpacity,ActivityIndicator,TextInput,Alert} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { Container, Header, Content, List,Button, Separator,ListItem,H3,H2,Left, Body, Right, Switch } from 'native-base';
import MapView, { AnimatedRegion,Circle, Animated,Marker } from 'react-native-maps';

const GOOGLE_MAPS_APIKEY = 'AIzaSyBzyI8GzavsFfFoxopFLCAApWM2VKRXNeo';
import axios from 'react-native-axios';
//import FusedLocation from 'react-native-fused-location';
import ImagePicker from 'react-native-image-crop-picker';
import Spinner from 'react-native-spinkit';
import firebase from 'react-native-firebase';
import AndroidKeyboardAdjust from 'react-native-android-keyboard-adjust';
import Modal from "react-native-modal";
import {
    
    MaterialIndicator,
    
  } from 'react-native-indicators';
// create a component
class profile extends Component {

    static navigationOptions = {
        drawerLockMode: 'locked-closed',
        title:'Watchlist',
        headerStyle:{
            elevation:0,
    
        },
        headerTitleStyle:{
            fontWeight:'400'
        }
        
    }

    constructor(){
        super()
        this.state={
            key:9,
            searchborder:'rgba(0,0,0,0.1)',
            showlist:false,
            watchlist:[],
            searchview:false,
            searchres:false,
            lat:null,
            lng:null,
            address:'Fetching...',
            isVisible:true,
            isModalVisible:false,
            region : {
                longitude:74.360123,

                latitude:31.497420,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }
        }
    }

    _toggleModal = () =>
this.setState({ isModalVisible: !this.state.isModalVisible });


   async componentDidMount(){
    

    var users = firebase.database().ref('Flocks');
    var id =  await AsyncStorage.getItem('MyID')
    this.setState({myID:id})

    
    users.on("value", (snapshot)=>{
        this.setState({custodians:snapshot.val()})

    },  (errorObject)=> {
        console.log("The read failed: " + errorObject.code);
      });




    if(Platform == 'Android'){
        AndroidKeyboardAdjust.setAdjustNothing();
    }
    firebase.database().ref().child("Flocks").on("value", (snapshot)=> {
        this.setState({common:snapshot.numChildren()})
        
      })
      firebase.database().ref("Flocks/"+this.state.myID).child('watchlist').on("value", (snapshot)=> {
        
        console.log(snapshot.val())

        
        if(snapshot.val() != null )
        {
            let semilist = Object.values(snapshot.val());
        console.log(semilist)
            
            
            if(semilist != null){
            var quat = []
            for(let i=0;i<semilist.length;i++){
                firebase.database().ref('Flocks/'+semilist[i].props).on("value", snapshot => {
                        quat.push(snapshot.val()) 
                           
                }

            )

        }
        this.setState({watchlist:quat,showlist:true})


    }
}
else {
    console.log('All records empty')
    this.setState({watchlist:[],showlist:true})
}
        
    })
        
        }
    







   async componentWillMount(){
    var id = await AsyncStorage.getItem('thisUserId')

       console.log('on mount')
       
     

        {/*axios.get('https://maps.googleapis.com/maps/api/geocode/json?address=' + location.latitude + ',' + location.longitude + '&key=' + GOOGLE_MAPS_APIKEY) // be sure your api key is correct and has access to the geocode api
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
      */} 



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


    search(props){
        

        var search = this.state.custodians
        var arr = Object.values(search);
        
        if(props.length == 0){
            this.setState({results:[]})
        }

        if(props.length == 9)

        {
           var New = 'C'
           var final=  New.concat(props)
           let obj = arr.find(o => o.custodianID === final);
            if(obj != null){
                var resarray =[]
            console.log(obj.name + obj.custodianID)
            resarray.push({searchname:obj.name,searchid:obj.custodianID,picture:obj.image})
            this.setState({results:resarray,searchres:true,searchborder:'skyblue'})
        }
        else{
            console.log('not found')
            this.setState({searchborder:'red'})
        }
           


        }
    }

    addToList(props){
        firebase.database().ref("Flocks/"+this.state.myID).child('watchlist').on("value",snapshot => {
            
            console.log(snapshot.numChildren())
            if(snapshot.numChildren() <3){
            
            const userData = snapshot.val();
            if (userData){
              console.log("exists!");
              firebase.database().ref('Flocks/'+this.state.myID).child('watchlist').push({props});
              this.setState({searchview:false,searchres:false})

            }
            else {
                console.log('need to write'+ props)
                firebase.database().ref('Flocks/'+this.state.myID).child('watchlist').push({props});
                this.setState({searchview:false,searchres:false,key:Math.random()})
            }
}
else {
    Alert.alert('Subscribe','Please subscribe for more, send your desired members to "richtech@mail.pk", once you are allowed you can add more people.')
}
            
        });
    }


    showModal(props){
        console.log(props)
        this.setState({region:props})
        this._toggleModal()
    }

    removeList(props){
        
        console.log(props)
        firebase.database().ref("Flocks/"+this.state.myID).child('watchlist').orderByChild('props').equalTo(props).on('child_added',(snapshot)=>{
        console.log(snapshot.val())
        console.log(snapshot.key)

        //var toRemove = (snapshot.key)

        //firebase.database().ref().child("Flocks/"+this.state.myID).child('watchlist').child(toRemove).remove()


        
            {/*
            firebase.database().ref().child("Flocks/"+this.state.myID).child('watchlist').on("value", snapshot=> {
            var count =  Object.values(snapshot.val())   
          console.log(count.length , toRemove)
          
            
          
          
        })*/}


            {/*firebase.database().ref("Flocks/"+this.state.myID).once('value', (snapshot)=> {
                if (snapshot.hasChild('watchlist')) {
                  console.log('child location exists');
                }
                else {
                    firebase.database().ref("Flocks/"+this.state.myID).push({watchlist:0})

                }
              });*/}






            



                
              


        })
        console.log('fe')
    }

    render() {
        return (
        <View style={styles.container}>
            <View style={{backgroundColor:'#273c75',width:'100%',flexDirection:'row',height:'16%',alignItems:'center',justifyContent:'center'}}>
            <View style={{justifyContent:'center',paddingHorizontal:20,alignSelf:'center'}} >
            <Text style={{fontSize:25,color:'white',fontWeight:'400',marginVertical:2}}>Custodian Network</Text>
            <Text  style={{color:'#4cd137',fontSize:15,textAlign:'center'}}>{this.state.common} People on the network</Text>

            </View>
            </View>
            {this.state.searchview ? 
            
             <TextInput
             autoFocus={true}
             placeholder="Search custodian ID" 
             underlineColorAndroid="transparent"
             keyboardType="numeric"
            style={{
                alignSelf:'center',
                marginVertical:5,
                padding:4,
                width:'70%',
                height:'6%',
                borderColor:this.state.searchborder,
                borderWidth:1,
                borderRadius:4,
                fontSize:17
            }}
            onChangeText={(text)=>this.search(text)}
            maxLength={9}  

             />
            : null}


            {this.state.searchres ? (
               <View style={{padding:2}}>
               <FlatList        
               //extraData={this.state.index}
               //horizontal={true}
               keyExtractor={(item, index) => index.toString()}
               data={this.state.results}
               renderItem={({item}) => (
                   
                    <View style={{borderColor:'green',borderWidth:1,flexDirection:'row',backgroundColor:'white',paddingHorizontal:6,paddingVertical:6,width:'70%',alignItems:'center',alignSelf:"center"}}>
                    
                    <Image style={{width:30,height:30,borderRadius:15,marginHorizontal:3}} resizeMode="contain" source={{uri:item.picture}} />

                    <View>
                    <Text style={{fontSize:12}}>Name: {item.searchname}</Text>
                <Text style={{fontSize:12}}>ID: {item.searchid}</Text>
                </View>

                <View style={{marginHorizontal:3,right:0}}>
                    <Icon name="add-circle" size={28} onPress={()=>this.addToList(item.searchid)} color="#0F3057"  />
                </View>
                

                </View>
                    
                )}
                />
                </View>

                
            ) : null}



<Modal onBackButtonPress={()=>this.setState({isModalVisible:false})}  style={{backgroundColor:'white',alignSelf:'center',width:'89%',height:'90%',borderRadius:3,}}  isVisible={this.state.isModalVisible}>
                <View style={{flex:1,backgroundColor:'grey',borderRadius:5}}>
                
            
                <MapView
           showsUserLocation
           showsCompass={false}
           //customMapStyle={st1}
           style={styles.map}
      region={this.state.region}
      //onRegionChange={this.onRegionChange}
>
<Marker
      
      coordinate={this.state.region}
      title="My "
    /> 
    </MapView>          


</View>

          </Modal>







             
                <View style={{alignSelf:'center',marginVertical:6}}>
                <Text  style={{color:'#c99333',fontSize:17,textAlign:'center'}}>My Watchlist</Text>

                </View>
             
             {this.state.showlist ? 
             (<FlatList
                key={this.state.key}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.watchlist}
            renderItem={({ item }) => (
                <View style={{borderColor:'grey',borderWidth:1,borderRadius:3,padding:3,alignItems:'center',marginHorizontal:3,marginVertical:3,flexDirection:'row',width:'100%'}}>
            <Image style={{width:30,height:30,borderRadius:15,marginHorizontal:10}} source={{uri:item.image}} resizeMode="contain" />
            <View style={{marginHorizontal:3,top:0}}>
                    <Icon name="person-pin-circle" size={30} onPress={()=>this.showModal(item.location)} color="#27ae60"  />
                </View>
                {/*<View style={{marginHorizontal:3,right:0}}>
                    <Icon name="remove-circle" size={28} onPress={()=>this.removeList(item.custodianID)} color="#faa"  />
            </View>*/}
            <View style={{alignSelf:"center",marginHorizontal:10}}>
             <Text style={{fontSize:13,fontWeight:'500'}}>{item.name}</Text>
            <Text style={{fontSize:12}}>{JSON.stringify(item.online)}</Text>
            <Text style={{fontSize:12}}>{item.email}</Text>
            </View>

                

            </View>
                
            
      )}

  />)
    :

    <MaterialIndicator color='#22a6b3' size={40} animating={true} animationDuration={1000} />

}



           <Button onPress={()=>this.setState({searchview:true})} style={{marginVertical:14,alignSelf:'center',width:'50%',backgroundColor:'#0F3057',justifyContent:'center'}}><Text style={{alignSelf:'center',alignContent:'center',color:'white',fontSize:16,fontWeight:'400'}}>Add Person</Text></Button>



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
    map:{
        position:'absolute',
        top:0,
        left:0,
        right:0,
        bottom:0
    }
});

//make this component available to the app
export default profile;
