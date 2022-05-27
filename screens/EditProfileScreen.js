//Edit profile form Page where current user can edit their own profile details 
import React, {useLayoutEffect, useEffect, useState} from 'react';
import {KeyboardAvoidingView,Keyboard,TouchableWithoutFeedback,TouchableOpacity,View, Text, Button, StyleSheet,Alert} from 'react-native';
import {Input} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import firebase from '@react-native-firebase/app';

const EditProfileScreen = ({navigation})=>{
  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Edit Profile",
    })
  },[navigation]) 

  useEffect(()=>{
    getUser()
  },[])

  //fetch current users details and store into array
  const getUser=()=>{
    const subscriber = firestore()
      .collection('users')
      .where('displayName','==',user.displayName)
      .get()
      .then((documentSnapshot)=>{
        if(documentSnapshot.exists){
          setUsers(documentSnapshot.data())
        }
      })
    return () => subscriber() 
  }

  //update users details in firestore record
  //Source code: https://www.youtube.com/watch?v=aFtYsghw-1k&t=278s&ab_channel=PradipDebnath
  const  user = auth().currentUser
  const id = auth().currentUser.uid
  const [details, setUsers] = useState([])

  const updateProfile = () =>{
    firebase.auth().currentUser.updateProfile({displayName:details.displayName}).then(()=>{
      firestore()
      .collection('users')
      .doc(id)
      .update({
        displayName:details.displayName, 
        email: user.email, //doesn't change email, only save the one auth database recognised
        year: details.year,
      })
      .then(()=>{
        Alert.alert('Profile Updated Sucessfully!')
      })
    })
  }
  
  return(
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inputContainer}>
          <Text h1 style={styles.h1}>QMSafe</Text>
          <Text style={styles.textcss}>Edit Profile</Text>
          <Text style={{fontStyle:"italic", color:"red",}}>**Please re-enter your current email address to chnage details.</Text>
          <Text style={styles.subtitlecss}>{"\n"}Email: *</Text>
          <Input 
            required
            placeholder="Email"
            autoCorrect={false}
            value={details ? details.email:""}
            onChangeText={(text)=>setUsers({...details, email:text})}
            style={styles.textInput} 
          />
          
          <Text style={styles.subtitlecss}>{"\n"}Username: *</Text>
          <Input 
            required
            placeholder="Username"
            autoCorrect={false}
            value={details ? details.displayName:""}
            onChangeText={(text)=>setUsers({...details, displayName:text})}
            style={styles.textInput} 
          />

          <Text style={styles.subtitlecss}>{"\n"}Year: *</Text>
          <Input 
            required
            placeholder="Year"
            autoCorrect={false}
            value={details ? details.year:""}
            onChangeText={(text)=>setUsers({...details, year:text})}
            style={styles.textInput} 
          />
          <Text>{'\n'}{'\n'}{'\n'}</Text>
          <View style={styles.btnContainer}>
            <TouchableOpacity
              style={[styles.button]}
              onPress={updateProfile}
            >
              <Text style={{textAlign: 'center', color:'#FFF', fontSize:16}}>Update Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}
export default EditProfileScreen

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'center'
  },
  inputContainer:{
    width:300,
    margin:0,
    marginBottom:0
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
  loginText: {
    color: '#3740FE',
    marginTop: 20,
    textAlign: 'center'
  },
  subtitlecss:{
      fontSize:15,
      fontWeight:"bold",
      color:'#003e80',
      textAlign:  "left",
  }
})