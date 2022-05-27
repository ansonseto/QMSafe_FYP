//edit user form page where only can be accessed by the admin
//Admin set user's account type as 'Student' or 'Lecturer' or 'Admin'
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {TouchableOpacity,View, Text,StyleSheet, Alert} from 'react-native';
import {Input} from 'react-native-elements';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';

const EditFindUserScreen = ({route, navigation})=>{
  const [details, setUsers] = useState([])
  const [type, setType] = useState([])
  const { id,} = route.params

  useLayoutEffect(() => {
    navigation.setOptions({
        title: "Edit User",
    })
  }, [navigation])

  useEffect(()=>{
    getUser()
  },[])

  //get selected user from the ShowFindUserScreen.js list
  const getUser=async()=>{
    const subscriber = firestore()
      .collection('users')
      .doc(id)
      .get()
      .then((documentSnapshot)=>{
        if(documentSnapshot.exists){
          setUsers(documentSnapshot.data())
        }
      })
    return () => subscriber() 
  }

  //update user's details on firestore record and go back to FindUserScreen.js
  const updateUserData = () =>{
    firestore()
    .collection('users')
    .doc(id)
    .update({
      displayName:details.displayName, 
      year:details.year,
      type: type,
    })
    .then(()=>{
      Alert.alert('Profile Updated Sucessfully!')
      navigation.goBack()
    })
    .catch((error)=>{
      console.error("Error removing user", error)
    })
  }
  
  //Source code for KeyboardAvoidingView: https://reactnative.dev/docs/keyboardavoidingview
  return(
    <View style={styles.container}>
      <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          activeOpacity ={0.5}
        >
          <Text h1 style={styles.h1}>QMSafe</Text>
        </TouchableOpacity>
        <Text style={styles.textcss}>Edit User</Text>
      <View style={styles.inputContainer}>
      <Text style={styles.subtitlecss}>Username:</Text>
        <Input 
          style={styles.input}
          placeholder="Username"
          autoCorrect={false}
          value={details ? details.displayName:""} 
          onChangeText={(text)=>setUsers({...details,displayName:text})}
        />

        <Text style={styles.subtitlecss}>{"\n"}Year:</Text>
        <Input 
          style={styles.input}
          placeholder="Year"
          autoCorrect={false}
          value={details ? details.year:""}
          onChangeText={(text)=>setUsers({year:text})}
        />
        <Text style={styles.subtitlecss}>{"\n"}Type: {type}</Text>
        <Picker
          value={type}
          onValueChange={(itemValue,itemIndex) => setType(itemValue)}
        >
          <Picker.Item label="Student" value="Student" />
          <Picker.Item label="Lecturer" value="Lecturer" />
          <Picker.Item label="Admin" value="Admin" />
        </Picker>
        <TouchableOpacity
          style={[styles.button]}
          onPress={updateUserData}
        >
          <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Update Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}
export default EditFindUserScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
  },
  inputContainer:{
    width:300,
    margin:0,
  },
  input:{
    height: 55,
    fontSize: 16,
  },
  button:{
    width:300,
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#2196F3",
  },
  h1:{
    paddingTop:50,
    fontSize:60,
    color:'#003e80',
    fontWeight: 'bold',
    textAlign:"center",
  },
  textcss:{
    fontSize:30,
    fontWeight:"bold",
    textDecorationLine: 'underline',
    color:'#003e80',
    marginBottom:20,
    textAlign:"center"
  },
  subtitlecss:{
    fontSize:15,
    fontWeight:"bold",
    color:'#003e80',
    textAlign:  "left",
  },
  
})