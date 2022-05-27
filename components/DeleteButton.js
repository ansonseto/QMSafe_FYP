import React,{useLayoutEffect,useState,useEffect} from 'react'
import { ScrollView, Alert,StyleSheet, Text, View } from 'react-native'
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';


const DeleteButton = ({id})=> {
  const  user = auth().currentUser
    const navigation = useNavigation()
  return (
        <FontAwesome
          reverse
          name="trash"
          color="#CA300E"
          size={30}
          style={{padding:10}}
          activeOpacity={0.5}
          onPress={()=>
              Alert.alert(
                'Are you sure you want to delete this user?',
                'This item will be deleted immediately. You cannot undo this action.',
                [
                  {text:'Cancel'},
                  {text:'Delete', onPress:()=>{
                      
                     //Source code: https://www.youtube.com/watch?v=aFtYsghw-1k&t=278s&ab_channel=PradipDebnath
                      firestore()
                      .collection('users')
                      .doc(id)
                      .delete()
                      .then(() => {
                        user.delete().then(function() {
                            Alert.alert("User Deleted")
                        })
                      }) .then(()=>{
                        navigation.navigate("Login")
                        })
                    .catch((error) => {
                          console.error("Error removing user: ", error);
                      })
                  }}
                ],
                {cancelable:false},
              )
            }
        />
  )
}

export default DeleteButton

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor: "#e6f2ff",
    alignItems: 'center', 
    justifyContent: 'flex-start'
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
});