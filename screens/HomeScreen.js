import React, {useLayoutEffect, useState,useEffect} from 'react'
import { Button,StyleSheet, Text, View } from 'react-native'
import {  TouchableOpacity } from 'react-native-gesture-handler'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const HomeScreen =({navigation})=> {
  const  user = auth().currentUser 
  const [details,setUsers]=useState([])

  //Firebase authentication - Sign user out of current authentication state
  const signOutUser = ()=>{
    auth().signOut().then(()=>{
      navigation.replace("Login")
    })
  }

  //Navigation bar
  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"Home",
      //Logout button
      headerLeft: ()=>(
        <View 
        style={{marginLeft:20}} 
        >
          <TouchableOpacity
            style={[styles.logoutbutton]}
            onPress={signOutUser}
          >
            <Text style={{textAlign: 'center', color:'white', fontSize:16, fontWeight:'800'}}>Logout</Text>
          </TouchableOpacity>
        </View>
      ),
      //Notifcation button navigate to 'self-isolate' alerts
      //User profile button navigate to user's profile for view, update, delte account details
      headerRight:()=>(
        <View style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginRight:20
        }}>
          <TouchableOpacity 
            onPress={() => navigation.navigate("notification")} 
            activeOpacity ={0.5}
            style={{paddingRight:10}}
          >
            <MaterialCommunityIcons name="bell-alert" size={30} color={'#FFA500'} /> 
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => navigation.navigate('userProfile')} 
            activeOpacity ={0.5}
          >
            <FontAwesome name="user-circle" size={30} color={"#003e80"} /> 
          </TouchableOpacity> 
        </View>
      )
    })
  },[navigation]);
    
  //React Native Firebase - Cloud Firestore query and fetch data methods
  //Source code: https://rnfirebase.io/firestore/usage
  useEffect(() => {
    const subscriber = firestore()
      .collection('users')
      .where('displayName','==',user.displayName)
      .onSnapshot(querySnapshot => {
        const details = []
        querySnapshot.forEach(documentSnapshot => {
          details.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
        setUsers(details); // store user data into array 
      }) 
    return () => subscriber() // Unsubscribe from events when no longer in use
  }, [])
    
    return(
      <View style={styles.container}>
        <Text h1 style={styles.h1}>QMSafe</Text>
        {/* <Button title="BLE screen" onPress={()=>navigation.navigate('blescreen')}/> */}
        {details.map((item,index)=>(
          <View key={index}>
          {/* if-else statment to see current user's account type and navigate user to their timetable */}
          {item.type==="Admin" 
          ?<>
            <TouchableOpacity key ={index} style={styles.button} onPress={() => navigation.navigate('adminattendance')}>
              <Text style={styles.buttontext}>Timetable</Text>
              <MaterialCommunityIcons name="timetable" size={25} color={'white'}/>
            </TouchableOpacity>
          </>
          :(item.type==="Lecturer"
          ?<>
            <TouchableOpacity  key ={index} style={styles.button} onPress={() => navigation.navigate('lecturerattendance')}>
              <Text style={styles.buttontext}>Timetable</Text>
              <MaterialCommunityIcons name="timetable" size={25} color={'white'}/>
            </TouchableOpacity>
          </>
          :<>
            <TouchableOpacity  key ={index} style={styles.button} onPress={() => navigation.navigate('studentattendance')}>
              <Text style={styles.buttontext}>Timetable</Text>
              <MaterialCommunityIcons name="timetable" size={25} color={'white'}/>
            </TouchableOpacity>
          </>
         )}
          </View>
        ))}
        {/* Button to navigate user to page where they can report they have covid symptoms or tested postiive */}
        <TouchableOpacity style={styles.buttontwo} onPress={() => navigation.navigate('ContactTracing')}>
          <Text style={styles.buttontexttwo}>Report Symptoms {'\n'}/ COVID</Text>
          <FontAwesome5 name="shield-virus" size={25} color={'white'}/>
        </TouchableOpacity>
      </View>
    )
}

export default HomeScreen;

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'center',
  },
  h1:{
    fontSize:60,
    color:'#003e80',
    fontWeight: 'bold',
    marginBottom:20,
  },
  textcss:{
    fontSize:30,
    fontWeight:"bold",
    textDecorationLine: 'underline',
    color:'#003e80',
    marginBottom:10,
  },
  button:{
    width:250,
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-around',
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#5f9ea0", //AFEEEE
    marginBottom:10,
  },
  buttontext:{
    textAlign:'right', 
    color:'#FFF', 
    fontSize:18,
    fontWeight:'800',
  },
  buttontwo:{
    width:250,
    marginTop:10,
    flexDirection:'row',
    justifyContent:'space-around',
    borderRadius: 5,
    padding: 8,
    backgroundColor: "#1558a1", //AFEEEE
    marginBottom:10,
  },
  buttontexttwo:{
    textAlign:'center', 
    color:'#FFF', 
    fontSize:18,
    fontWeight:'800',
  },
  logoutbutton:{
    width:80,
    justifyContent:'space-around',
    borderRadius: 20,
    padding: 5,
    backgroundColor: '#1558a1',
  }
});