import React, { Component } from 'react';
import { View, Text, StyleSheet,AsyncStorage,Button,Image,Alert,FlatList,TouchableOpacity } from 'react-native';
import MultiSelect from 'react-native-multiple-select';
import SelectMultiple from 'react-native-select-multiple';
import Communications from 'react-native-communications';
const MESSAGE = 'Welcome to MyLocation App'
import Icon from 'react-native-vector-icons/FontAwesome';
import Modal from "react-native-modal";
// create a component
class family extends Component {
    static navigationOptions ={
        drawerLockMode: 'locked-closed',
        title:'Family',
        headerTitleStyle:{
            fontWeight:'400'
        }
    }
    
    state = { selectedFruits:[],ben:[], isModalVisible: false}

_toggleModal = () =>
this.setState({ isModalVisible: !this.state.isModalVisible });

        onSelectionsChange = (selectedFruits) => {
        // selectedFruits is array of { label, value }
        this.setState({ selectedFruits })
        console.log(selectedFruits)
      }
      

all(){
    console.log(this.state.selectedFruits)
}

async contacts(){
    var asyncstore = await AsyncStorage.getItem('family')
    console.log(JSON.parse(asyncstore))
const result= await AsyncStorage.getItem('store')
var newR = JSON.parse(result)


  this.setState({data:newR})
  this.setState({count:newR.length})
  //console.log(newR[0].phoneNumbers[0].number)
    //arrayName[index] has a value
    this.state.data.map((newR) => {
        //console.log(newR.phoneNumbers[0].number);
        if(newR.phoneNumbers.length > 0){
        this.state.ben.push({label:newR.givenName,value:newR.phoneNumbers[0].number});
        }
        else if(newR.phoneNumbers.length == 0){
            this.state.ben.push({label:newR.givenName,value:'Not found'});
        }
    });

  

console.log(this.state.ben)

  console.log('contact fetch done')


}

    async componentWillMount(){
        var print = await AsyncStorage.getItem('family').length;
        console.log(print)  
      
       this.contacts()
       const result= await AsyncStorage.getItem('family')
      var modres = JSON.parse(result)
      console.log(modres)
      this.setState({list:modres})
   
    }

     async submit(){
        
        try {
             
            let value = await AsyncStorage.getItem('family');
            if (value != null){
                var arr1 = (JSON.parse(value))
                var arr2 = this.state.selectedFruits
                Array.prototype.push.apply(arr1, arr2);
                console.log('after pushing new values')
            console.log(arr1)
            AsyncStorage.setItem('family',JSON.stringify(arr1))
            this.setState({list:arr1})
                this._toggleModal()                
            }
            else if(value == null){
                AsyncStorage.setItem('family',JSON.stringify(this.state.selectedFruits))
                console.log('family store is null')
                console.log('new items pushed')
                this.setState({list:this.state.selectedFruits})
                this._toggleModal()               
                // do something else
           }
         } catch (error) {
             alert(error)
           // Error retrieving data
         }
           
                
     }

     async removeItem(props){

        var forA = this.state.list        
        var index = forA.findIndex(img => img.label === props)
        if (index !== -1) forA.splice(index, 1);
        console.log(forA)
        this.setState({list:forA})
        AsyncStorage.setItem('family',JSON.stringify(forA))
        //alert('removed'+props)

        }


      

    renderLabel = (label,style) => {
        return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{marginLeft: 10}}>
              <Text style={style}>{label}</Text>


            </View>
          </View>
              )}

    render() {
        return (
            <View style={styles.container}>
                <FlatList
                showsHorizontalScrollIndicator={false}
            keyExtractor={(item, index) => index.toString()}
            data={this.state.list}
            renderItem={({ item }) => (
                <TouchableOpacity onLongPress={()=>alert('long presses')}  style={{flexDirection:'row',justifyContent:"space-around",borderColor:'#000',borderWidth:1,width:'100%',marginVertical:5}}>
                <View>
                <Text>{item.label}</Text>
            <Text>{item.value}</Text>
            </View>
                
        <Icon name="minus-circle" size={35} color="#c33" onPress={()=>this.removeItem(item.label)} />
        <Icon name="envelope" size={30} color="#2FC5CC" onPress={()=>Communications.textWithoutEncoding(item.value,MESSAGE)} />
            
            </TouchableOpacity>
      )}/>
                <Button title="Add People" onPress={this._toggleModal} />

                <Modal style={{backgroundColor:'white',borderColor:"black",borderWidth:2,padding:10}} isVisible={this.state.isModalVisible}>
                <View style={{flex:1}}>
                
            <SelectMultiple
            enableEmptySections={true}
          items={this.state.ben}
          selectedItems={this.state.selectedFruits}
          onSelectionsChange={this.onSelectionsChange} />
          </View>
          <View style={{justifyContent:"space-around",flexDirection:'row'}}>
          <Button title="Submit" color="#17B978" onPress={()=>this.submit()} />
          <Button title="Cancel" color="#c39" onPress={()=>this._toggleModal()} />
          </View>

          </Modal>
        
            </View>
        );
    }
}

// define your styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
       padding:8,
        backgroundColor: 'white',
    },
});

//make this component available to the app
export default family;
