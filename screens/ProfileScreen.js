import React,{useLayoutEffect,useState,useEffect} from 'react'
import { ScrollView, Alert,StyleSheet, Text, View, Keyboard, TouchableWithoutFeedback,KeyboardAvoidingView } from 'react-native'
import {  TouchableOpacity } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import EditPasswordEmailScreen from '../components/EditPasswordEmailScreen'
import IconAntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DeleteButton from '../components/DeleteButton'

const ProfileScreen = ({navigation})=> {
  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Profile",
    })
  },[navigation]) 

  const  user = auth().currentUser
  const [details, setUsers] = useState([])

  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .onSnapshot(querySnapshot => {
        const details = []
        querySnapshot.forEach(documentSnapshot => {
          details.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          })
        })
        setUsers(details)
      })
    return () => subscriber() // Unsubscribe from events when no longer in use
  }, [])
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Home')} 
          activeOpacity ={0.5}
        >
          <Text h1 style={styles.h1}>QMSafe</Text>
        </TouchableOpacity>
        <Text style={styles.textcss}>Profile</Text>
        {details.map((details, index) => (
          <View key={index}>
            {details.displayName==user.displayName
            ?<>
            <Text style={{textAlign:'center'}}><Text style={{fontWeight:'bold', color:'#003e80'}}>Username:</Text>{details.displayName}</Text>
            <Text style={{textAlign:'center'}}><Text style={{fontWeight:'bold', color:'#003e80'}}>Email:</Text>{details.email}</Text>
            <Text style={{textAlign:'center'}}><Text style={{fontWeight:'bold', color:'#003e80'}}>Current year:</Text>{details.year}</Text>
            </>
            :null}
          </View>
        ))}
        <Text>{'\n'}</Text>
        <EditPasswordEmailScreen/>
        <View style={{alignSelf:"flex-end", marginRight:20}}>
        <View>
        {user.displayName==="Admin"
            ?<FontAwesome
              reverse
              name="users"
              color="#989898"
              size={30}
              style={{padding:10}}
              activeOpacity={0.5}
              onPress={()=>navigation.navigate("findProfile")}
            />
            :null
          }
          <FontAwesome5
            reverse
            name="user-edit"
            color="#ffa500"
            size={30}
            style={{padding:10}}
            activeOpacity={0.5}
            onPress={()=>{navigation.navigate('editProfile')}}
          />  
          <DeleteButton
            id={user.uid}
          />
        </View>
        </View>
        <Text>{'\n'}{'\n'}</Text>
      </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

export default ProfileScreen

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
});