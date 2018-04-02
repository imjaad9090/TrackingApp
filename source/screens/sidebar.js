//import liraries
import React, { Component } from 'react';
import { View, StyleSheet,ScrollView,Image,Text,AsyncStorage} from 'react-native';
import Icon from 'react-native-vector-icons/Feather'
import { Container, Header, Content, List,Button, ListItem,H3,H2,Left, Body, Right, Switch } from 'native-base';

// create a component
class sidebar extends Component {



  logout(){
    AsyncStorage.removeItem('userToken');
    this.props.navigation.navigate('Auth');
  }

  state={
    username:'',
    usermail:''
  }

   async componentWillMount(){
   var name =  await AsyncStorage.getItem('name')
   var email =await AsyncStorage.getItem('email')
   //alert(JSON.parse(email))
   this.setState({username:JSON.parse(name)})
   this.setState({usermail:JSON.parse(email)})

  }


    render() {
        return (
            <View style={styles.container}>
                <ScrollView>
                <Content>
<View style={{backgroundColor:'#0F3057',width:'100%',height:150,flexDirection:'row',padding:10,alignItems:'center'}}>
<Image style={{alignSelf:'center',borderRadius:50,width:60,height:60}} source={require('./images/dav.jpg')} />

<View style={{justifyContent:'center',left:10}}>
<Text style={{color:'white',fontSize:18,fontWeight:"800"}}>{this.state.username}</Text>
<Text style={{color:'white',fontSize:12}}>{this.state.usermail}</Text>

</View>
</View>

          <List style={{marginRight:6,top:8}}>
            <ListItem onPress={()=>this.props.navigation.navigate('Home')}  icon>
              <Left>
                <Icon name="home" size={21} color="#0F3057"/>
              </Left>
              <Body>
                <Text>Home</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>


            <ListItem onPress={()=>this.props.navigation.navigate('Locations')} icon>
              <Left>
                <Icon name="map" size={21} color="#0F3057"/>
              </Left>
              <Body>
                <Text>Places</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>



            <ListItem onPress={()=>this.props.navigation.navigate('Profile')} icon>
              <Left>
                <Icon name="user" size={21} color="#0F3057"/>
              </Left>
              <Body>
                <Text>My Profile</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>



             <ListItem icon>
              <Left>
                <Icon name="settings" size={21} color="#0F3057" />
              </Left>
              <Body>
                <Text>Settings</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>


        <ListItem onPress={()=>this.logout()} icon>
              <Left>
                <Icon name="log-out" size={21} color="#0F3057" />
              </Left>
              <Body>
                <Text>Logout</Text>
              </Body>
              <Right>
                  <View></View>
              </Right>
            </ListItem>

            </List>
            </Content>
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
export default sidebar;