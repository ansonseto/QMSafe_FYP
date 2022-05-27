//Page showing all users 
//only can be accessed by the admin 
import React,{useLayoutEffect,useState,useEffect} from 'react';
import {TouchableOpacity,ScrollView, StyleSheet, Text, View } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import SearchBarScreen from '../components/SearchBarScreen';
import ShowFindUserScreen from '../components/ShowFindUserScreen';

const FindUserScreen = ({navigation})=> {
  const  user = auth().currentUser
  const [search, setSearch]=useState("")

  useLayoutEffect(()=>{
    navigation.setOptions({
      title:"User Library",
    })
  },[navigation])

  //fetch all users detail from firestore and store into array
  const [userdetail, seteditUsers] = useState([])
  useLayoutEffect(() => {
    const unsubscribe = 
    firestore()
    .collection('users')
    .onSnapshot(snapshot => (
      seteditUsers(
        snapshot.docs.map(doc => ({
          id: doc.id,
          data: doc.data()
        })))
      )
    )
    seteditUsers(userdetail)
    return unsubscribe
  } ,[])

  //navigate to page where admin can edit user's details
  const enterEditUser = (id,displayName, year,) => {
    navigation.navigate("editUser", {
        id,
        displayName:displayName,
        year:year,
    })
  }

  return (
    <View style={{backgroundColor: "#e6f2ff",}}>
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Home')} 
        activeOpacity ={0.5}
      >
        <Text h1 style={styles.h1}>QMSafe</Text>
      </TouchableOpacity>
      <Text style={styles.textcss}>Find User</Text>
      {userdetail.map(({id, data:{displayName,year}})=>(
        //import compoennt showign list of all users
        <ShowFindUserScreen
          key={id}
          id={id}
          displayName={displayName}
          year={year}
          enterEditUser={enterEditUser}
        />
      ))}
      </ScrollView>
    </View>
  )
}
export default FindUserScreen

const styles = StyleSheet.create({
  container:{
    backgroundColor: "#e6f2ff",
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
      